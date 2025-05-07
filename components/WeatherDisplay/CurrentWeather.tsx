import React, { useMemo } from 'react';
import { CurrentWeather as CurrentWeatherType } from '@/lib/types';
import WeatherIcon from './WeatherIcon'; 

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  cityName: string;
  countryCode?: string;
  units?: 'metric' | 'imperial';
  latitude: number;
  longitude: number;
}

export default function CurrentWeather({ 
  data, 
  cityName, 
  countryCode,
  units = 'metric',
  latitude,
  longitude
}: CurrentWeatherProps) {
  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  };

  const getTemperatureUnit = () => units === 'metric' ? '°C' : '°F';
  const getWindSpeedUnit = () => units === 'metric' ? 'm/s' : 'mph';

  const bgClass = useMemo(() => {
    const weatherMain = data.main.toLowerCase();
    const hour = new Date(data.dt * 1000).getHours();
    const isNight = hour < 6 || hour > 18;
    const suffix = isNight ? '-night' : '';

    switch (true) {
      case weatherMain.includes('clear'):
        return `bg-weather-clear${suffix}`;
      case weatherMain.includes('cloud'):
        return `bg-weather-clouds${suffix}`;
      case weatherMain.includes('rain'):
      case weatherMain.includes('drizzle'):
        return `bg-weather-rain${suffix}`;
      case weatherMain.includes('thunderstorm'):
        return `bg-weather-thunderstorm`;
      case weatherMain.includes('snow'):
        return `bg-weather-snow${suffix}`;
      case weatherMain.includes('mist'):
      case weatherMain.includes('fog'):
      case weatherMain.includes('haze'):
        return `bg-weather-mist${suffix}`;
      default:
        return `bg-weather-clear${suffix}`;
    }
  }, [data.main, data.dt]);

  const formattedDate = useMemo(() => {
    try {
      return new Date(data.dt * 1000).toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date unavailable';
    }
  }, [data.dt]);

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${bgClass}`}>
      <div className="bg-black bg-opacity-30 backdrop-blur-sm text-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {cityName}
              {countryCode && <span className="ml-2 text-xl">{countryCode}</span>}
            </h2>
            <p className="text-base sm:text-lg opacity-90">{formattedDate}</p>
          </div>
          
          <div className="flex items-center">
            <WeatherIcon 
              iconCode={data.icon} 
              description={data.description} 
              size="large"
              // className="weather-icon-glow" 
            />
            <div className="ml-4">
              <div className="text-4xl sm:text-5xl font-bold">
                {Math.round(data.temp)}{getTemperatureUnit()}
              </div>
              <div className="text-lg sm:text-xl capitalize">{data.description}</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
          {[
            { label: 'Feels Like', value: `${Math.round(data.feels_like)}${getTemperatureUnit()}` },
            { label: 'Humidity', value: `${data.humidity}%` },
            { label: 'Wind', value: `${Math.round(data.wind_speed)} ${getWindSpeedUnit()}` },
            { label: 'Pressure', value: `${data.pressure} hPa` }
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg">
              <div className="text-sm opacity-80">{label}</div>
              <div className="text-lg sm:text-xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        {/* Add coordinates display */}
        <div className="flex justify-center gap-4 mt-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="text-sm opacity-80">Longitude</div>
            <div className="text-base sm:text-lg font-medium">{longitude.toFixed(4)}°</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="text-sm opacity-80">Latitude</div>
            <div className="text-base sm:text-lg font-medium">{latitude.toFixed(4)}°</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
          {[
            { label: 'Sunrise', value: formatTime(data.sunrise) },
            { label: 'Sunset', value: formatTime(data.sunset) },
            { label: 'High', value: `${Math.round(data.temp_max)}${getTemperatureUnit()}` },
            { label: 'Low', value: `${Math.round(data.temp_min)}${getTemperatureUnit()}` }
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-sm opacity-80">{label}</div>
              <div className="text-base sm:text-lg font-medium">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}