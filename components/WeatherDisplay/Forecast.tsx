import React from 'react';
import { ForecastDay } from '@/lib/types';
import WeatherIcon from './WeatherIcon';

interface ForecastProps {
  forecast: ForecastDay[];
  units?: 'metric' | 'imperial';
  latitude: number;
  longitude: number;
}

export default function Forecast({ forecast, units = 'metric' }: ForecastProps) {
  const getTemperatureUnit = () => units === 'metric' ? '°C' : '°F';
  
  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'short' });
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">5-Day Forecast</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.slice(0, 5).map((day, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-md p-3 sm:p-4 transition-transform hover:transform hover:scale-105"
          >
            <div className="text-center">
              <h4 className="font-bold text-base sm:text-lg">{formatDay(day.dt)}</h4>
              <p className="text-xs sm:text-sm text-gray-500">{formatDate(day.dt)}</p>
            </div>
            
            <div className="flex justify-center my-1 sm:my-2">
              <WeatherIcon 
                iconCode={day.weather[0].icon} 
                description={day.weather[0].description} 
                size="medium"
              />
            </div>
            
            <div className="text-center">
              <p className="text-xs sm:text-sm capitalize">{day.weather[0].description}</p>
            </div>
            
            <div className="flex justify-between mt-2 sm:mt-3">
              <span className="font-bold text-sm sm:text-base">{Math.round(day.temp.max)}{getTemperatureUnit()}</span>
              <span className="text-gray-500 text-sm sm:text-base">{Math.round(day.temp.min)}{getTemperatureUnit()}</span>
            </div>
            
            <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="truncate">
                <span className="text-gray-500">Humidity:</span>
                <span className="ml-1">{day.humidity}%</span>
              </div>
              
              <div className="truncate">
                <span className="text-gray-500">Wind:</span>
                <span className="ml-1">{Math.round(day.wind_speed)}{units === 'metric' ? 'm/s' : 'mph'}</span>
              </div>
              
              <div className="truncate">
                <span className="text-gray-500">Precip:</span>
                <span className="ml-1">{Math.round(day.pop * 100)}%</span>
              </div>
              
              <div className="truncate">
                <span className="text-gray-500">Press:</span>
                <span className="ml-1">{day.pressure}hPa</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}