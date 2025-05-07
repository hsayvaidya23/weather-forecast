"use client";
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { fetchCities } from '@/lib/api';
import { City } from '@/lib/types';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = memo(function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) return;
      
      setIsLoading(true);
      try {
        const { cities } = await fetchCities({
          q: query,
          rows: 10
        });
        setSuggestions(cities);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      debouncedFetch(value);
    }
    onSearch(value);
  }, [debouncedFetch, onSearch]);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((city: City) => {
    setInputValue(city.name);
    onSearch(city.name);
    setShowSuggestions(false);
  }, [onSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
        <input
          type="text"
          className="py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search cities..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Search cities"
          aria-expanded={showSuggestions}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
        />
        {isLoading ? (
          <div className="px-3" aria-hidden="true">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
          </div>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none transition-colors"
            onClick={() => onSearch(inputValue)}
            type="button"
          >
            Search
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((city) => (
            <li
              key={city.id}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
              onClick={() => handleSuggestionClick(city)}
              role="option"
              aria-selected="false"
            >
              <div className="font-medium">{city.name}</div>
              <div className="text-sm text-gray-500">{city.country}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SearchBar;