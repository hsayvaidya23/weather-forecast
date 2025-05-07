import React from 'react';
import CitiesTable from '@/components/Cities Table/CitiesTable'; 

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Weather Forecast</h1>
      <p className="text-center mb-8 text-gray-600">
        Search for a city to view current weather conditions and forecasts
      </p>
      <CitiesTable />
    </main>
  );
}