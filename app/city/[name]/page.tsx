"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import CityWeatherClient from './CityWeatherClient'; 

interface PageParams {
  name: string;
}

export default function CityWeatherPage({ params }: { params: Promise<PageParams> }) {
  const unwrappedParams = React.use(params);
  const searchParams = useSearchParams();
  const cityName = decodeURIComponent(unwrappedParams.name);
  const latitude = searchParams.get('lat');
  const longitude = searchParams.get('lon');

  return (
    <CityWeatherClient 
      cityName={cityName}
      latitude={latitude}
      longitude={longitude}
    />
  );
}