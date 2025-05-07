import React from 'react';
import Link from 'next/link';
import { City } from '@/lib/types';

interface CityRowProps {
  city: City;
  isLastElement?: boolean;
  lastCityRef?: (node: HTMLTableRowElement) => void;
  weatherData?: {
    high: number;
    low: number;
  };
}

const CityRow = ({ city, isLastElement, lastCityRef, weatherData }: CityRowProps) => {
  // Ensure coordinates are in the correct order
  const lat = city.latitude;
  const lon = city.longitude;

  return (
    <tr 
      ref={isLastElement ? lastCityRef : null}
      className="border-b hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <Link 
          href={`/city/${encodeURIComponent(city.name)}?lat=${lon}&lon=${lat}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {city.name}
          {weatherData && (
            <span className="ml-2 text-sm text-gray-500">
              {weatherData.high}°/{weatherData.low}°
            </span>
          )}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {city.country}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {city.timezone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {city.population.toLocaleString()}
      </td>
    </tr>
  );
};

export default CityRow;