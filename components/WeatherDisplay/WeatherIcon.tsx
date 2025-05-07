import React from 'react';

interface WeatherIconProps {
  iconCode: string;
  description: string;
  size?: 'small' | 'medium' | 'large';
}

export default function WeatherIcon({ iconCode, description, size = 'medium' }: WeatherIconProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  return (
    <div className={`${sizeClasses[size]} animate-float`}>
      <img 
        src={iconUrl} 
        alt={description}
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  );
}