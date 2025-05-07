'use client';

import React from 'react';
// import { useRouter } from 'next/navigation';
import { fetchWeatherForCity } from '@/lib/api';
import { WeatherData } from '@/lib/types';
import CurrentWeather from '@/components/WeatherDisplay/CurrentWeather';
import Forecast from '@/components/WeatherDisplay/Forecast';
import Link from 'next/link';

interface CityWeatherClientProps {
  cityName: string;
  latitude: string | null;
  longitude: string | null;
}

export default function CityWeatherClient({ cityName, latitude, longitude }: CityWeatherClientProps) {
  // const router = useRouter();
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [units, setUnits] = React.useState<'metric' | 'imperial'>('metric');

  React.useEffect(() => {
    async function loadWeatherData() {
      if (!latitude || !longitude) {
        setError('Missing location coordinates');
        setIsLoading(false);
        return;
      }

      // Validate coordinates
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) {
        setError('Invalid coordinates');
        setIsLoading(false);
        return;
      }

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        setError('Coordinates out of valid range');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const data = await fetchWeatherForCity(lat, lon, units);
        
        setWeatherData(data);

        // Update browser title with city name and temperature
        document.title = `${cityName} Weather - ${Math.round(data.current.temp)}${units === 'metric' ? '°C' : '°F'}`;
        
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadWeatherData();
  }, [cityName, latitude, longitude, units]);

  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg">{error}</p>
          <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!weatherData || !latitude || !longitude) {
    return null;
  }

  const coords = {
    lat: parseFloat(latitude),
    lon: parseFloat(longitude)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to cities
        </Link>
        
        <button 
          onClick={toggleUnits}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Switch to {units === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </button>
      </div>
      
      <CurrentWeather 
        data={weatherData.current} 
        cityName={cityName}
        units={units}
        latitude={coords.lat}
        longitude={coords.lon}
      />
      
      <Forecast 
        forecast={weatherData.forecast} 
        units={units}
        latitude={coords.lat}
        longitude={coords.lon}
      />
    </div>
  );
}