"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import Link from 'next/link';
import { City, SortState, Column } from '@/lib/types';
import { fetchCities } from '@/lib/api';
import SearchBar from './SearchBar'; 
import TableHeader from './TableHeader'; 
import CityRow from './CityRow';

const ROWS_PER_PAGE = 30;
const INTERSECTION_OPTIONS = { threshold: 0.5 };

// Memoize columns configuration
const columns: readonly Column[] = [
  { id: 'name', label: 'City', sortable: true },
  { id: 'country', label: 'Country', sortable: true },
  { id: 'timezone', label: 'Timezone', sortable: true },
  { id: 'population', label: 'Population', sortable: true }
] as const;

export default function CitiesTable() {
  const [state, setState] = useState({
    cities: [] as City[],
    isLoading: true,
    error: null as string | null,
    searchQuery: '',
    sort: { column: 'name', direction: 'asc' } as SortState,
    page: 0,
    hasMore: true,
    weatherCache: {} as Record<string, { high: number; low: number }>
  });

  const observer = useRef<IntersectionObserver | null>(null);

  // Memoize intersection observer callback
  const lastCityElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (state.isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && state.hasMore) {
        setState(prev => ({ ...prev, page: prev.page + 1 }));
      }
    }, INTERSECTION_OPTIONS);
    
    if (node) observer.current.observe(node);
  }, [state.isLoading, state.hasMore]);

  // Memoize fetch function
  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const sortParam = `${state.sort.direction === 'desc' ? '-' : ''}${state.sort.column}`;
      
      const { cities: newCities, total } = await fetchCities({
        q: state.searchQuery,
        rows: ROWS_PER_PAGE,
        start: state.page * ROWS_PER_PAGE,
        sort: sortParam
      });
      
      setState(prev => ({
        ...prev,
        cities: prev.page === 0 ? newCities : [...prev.cities, ...newCities],
        hasMore: (prev.page + 1) * ROWS_PER_PAGE < total,
        isLoading: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch cities. Please try again.',
        isLoading: false
      }));
      console.error(err);
    }
  }, [state.searchQuery, state.sort, state.page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize handlers
  const handleSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, page: 0 }));
  }, []);

  const handleSort = useCallback((column: string) => {
    setState(prev => ({
      ...prev,
      sort: {
        column,
        direction: prev.sort.column === column && prev.sort.direction === 'asc' ? 'desc' : 'asc'
      },
      page: 0
    }));
  }, []);

  // Update the memoized city rows rendering to use CityRow component
  const cityRows = useMemo(() => (
    state.cities.map((city, index) => (
      <CityRow
        key={city.id}
        city={city}
        isLastElement={index === state.cities.length - 1}
        lastCityRef={lastCityElementRef}
        weatherData={state.weatherCache[city.id]}
      />
    ))
  ), [state.cities, state.weatherCache, lastCityElementRef]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <TableHeader 
            columns={[...columns]} 
            currentSort={state.sort} 
            onSort={handleSort} 
          />
          <tbody>{cityRows}</tbody>
        </table>
      </div>
      
      {state.isLoading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}
      
      {!state.hasMore && state.cities.length > 0 && (
        <div className="text-center my-4 text-gray-500">
          End of results
        </div>
      )}
      
      {!state.isLoading && state.cities.length === 0 && (
        <div className="text-center my-4 text-gray-500">
          No cities found. Try a different search term.
        </div>
      )}
    </div>
  );
}