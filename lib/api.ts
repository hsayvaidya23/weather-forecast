import { CitySearchParams, CitiesResponse, City, WeatherData, CurrentWeather, ForecastItem, DailyForecast } from './types';

const CITIES_API_BASE_URL = 'https://public.opendatasoft.com/api/records/1.0/search/';
const CITIES_DATASET = 'geonames-all-cities-with-a-population-1000';
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

/**
 * Fetch cities from the OpenDataSoft API
 */
export async function fetchCities(params: CitySearchParams): Promise<{
  cities: City[];
  total: number;
}> {
  const searchParams = new URLSearchParams();
  searchParams.append('dataset', CITIES_DATASET);
  
  if (params.q) {
    searchParams.append('q', params.q);
  }
  
  if (params.rows) {
    searchParams.append('rows', params.rows.toString());
  }
  
  if (params.start) {
    searchParams.append('start', params.start.toString());
  }
  
  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  try {
    const response = await fetch(`${CITIES_API_BASE_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status}`);
    }
    
    const data: CitiesResponse = await response.json();
    
    const cities: City[] = data.records.map(record => {
      // Ensure coordinates are correctly mapped
      const [lon, lat] = record.fields.coordinates;
      
      return {
        name: record.fields.name,
        country: record.fields.cou_name_en,
        country_code: record.fields.country_code,
        timezone: record.fields.timezone,
        latitude: lat,  // Use the correct latitude
        longitude: lon, // Use the correct longitude
        population: record.fields.population,
        id: record.recordid
      };
    });
    
    return {
      cities,
      total: data.nhits
    };
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

/**
 * Fetch current weather and forecast for a city
 */
export async function fetchWeatherForCity(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData> {
  if (!WEATHER_API_KEY) {
    throw new Error('OpenWeather API key is missing');
  }

  // Validate coordinates
  if (isNaN(lat) || isNaN(lon)) {
    throw new Error('Invalid coordinates');
  }

  // Ensure coordinates are within valid ranges
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error('Coordinates out of valid range');
  }

  try {
    // Log coordinates for debugging
    console.log('Fetching weather for coordinates:', { lat, lon });

    // Fetch both current weather and forecast in parallel
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      fetch(
        `${WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`
      ),
      fetch(
        `${WEATHER_API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`
      )
    ]);

    if (!currentWeatherResponse.ok || !forecastResponse.ok) {
      const errorData = await currentWeatherResponse.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to fetch weather data');
    }

    const [currentWeatherData, forecastData] = await Promise.all([
      currentWeatherResponse.json(),
      forecastResponse.json()
    ]);

    // Log API response for debugging
    console.log('Weather API Response:', currentWeatherData);

    // Process and organize the data
    const current: CurrentWeather = {
      temp: currentWeatherData.main.temp,
      feels_like: currentWeatherData.main.feels_like,
      temp_min: currentWeatherData.main.temp_min,
      temp_max: currentWeatherData.main.temp_max,
      humidity: currentWeatherData.main.humidity,
      pressure: currentWeatherData.main.pressure,
      wind_speed: currentWeatherData.wind.speed,
      wind_deg: currentWeatherData.wind.deg,
      description: currentWeatherData.weather[0].description,
      icon: currentWeatherData.weather[0].icon,
      main: currentWeatherData.weather[0].main,
      dt: currentWeatherData.dt,
      sunrise: currentWeatherData.sys.sunrise,
      sunset: currentWeatherData.sys.sunset
    };

    // Process forecast data - group by day
    const dailyForecasts = processForecast(forecastData.list);

    return {
      current,
      forecast: dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Process the 3-hour forecast data into daily forecasts
 */
function processForecast(forecastList: ForecastItem[]): DailyForecast[] {
  const dailyMap = new Map<string, DailyForecast>();
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        dt: item.dt,
        temp: {
          day: item.main.temp,
          min: item.main.temp_min,
          max: item.main.temp_max,
          night: item.main.temp,
          eve: item.main.temp,
          morn: item.main.temp
        },
        feels_like: {
          day: item.main.feels_like,
          night: item.main.feels_like,
          eve: item.main.feels_like,
          morn: item.main.feels_like
        },
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        weather: item.weather,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        clouds: item.clouds.all,
        pop: item.pop || 0,
        rain: item.rain?.['3h'],
        snow: item.snow?.['3h']
      });
    } else {
      const existing = dailyMap.get(date)!;
      
      // Update min/max temperatures
      existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
      existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
      
      // Update time-specific temperatures based on hour
      const hour = new Date(item.dt * 1000).getHours();
      if (hour >= 6 && hour < 12) {
        existing.temp.morn = item.main.temp;
        existing.feels_like.morn = item.main.feels_like;
      } else if (hour >= 12 && hour < 18) {
        existing.temp.day = item.main.temp;
        existing.feels_like.day = item.main.feels_like;
      } else if (hour >= 18 && hour < 24) {
        existing.temp.eve = item.main.temp;
        existing.feels_like.eve = item.main.feels_like;
      } else {
        existing.temp.night = item.main.temp;
        existing.feels_like.night = item.main.feels_like;
      }
      
      // Update precipitation probability if higher
      existing.pop = Math.max(existing.pop, item.pop || 0);
      
      // Keep the weather description for midday if possible
      if (hour >= 12 && hour < 15) {
        existing.weather = item.weather;
      }
    }
  });
  
  return Array.from(dailyMap.values());
}