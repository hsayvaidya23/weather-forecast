// City types
export interface City {
    name: string;
    country: string;
    country_code: string;
    timezone: string;
    latitude: number;
    longitude: number;
    population: number;
    id: string;
  }
  
  export interface CitySearchParams {
    q?: string;
    rows?: number;
    start?: number;
    sort?: string;
  }
  
  export interface CitiesResponse {
    nhits: number;
    parameters: {
      dataset: string;
      q?: string;
      rows?: number;
      start?: number;
      sort?: string;
      format?: string;
      timezone?: string;
    };
    records: {
      datasetid: string;
      recordid: string;
      fields: {
        name: string;
        cou_name_en: string;
        country_code: string;
        timezone: string;
        coordinates: [number, number]; // [longitude, latitude]
        population: number;
      };
      geometry?: {
        type: 'Point';
        coordinates: [number, number];
      };
    }[];
  }
  
  // Weather types
  export interface WeatherData {
    current: CurrentWeather;
    forecast: ForecastDay[];
  }
  
  export interface CurrentWeather {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    description: string;
    icon: string;
    main: string;
    dt: number; // timestamp
    sunrise: number;
    sunset: number;
  }
  
  export interface ForecastDay {
    dt: number; // timestamp
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    wind_speed: number;
    wind_deg: number;
    clouds: number;
    pop: number; // probability of precipitation
    rain?: number;
    snow?: number;
  }
  
  // Sort and filter types
  export type SortDirection = 'asc' | 'desc';
  
  export interface SortState {
    column: string;
    direction: SortDirection;
  }
  
  // Table column definition
  export interface Column {
    id: string;
    label: string;
    sortable: boolean;
  }

  export interface TableColumn {
    id: string;
    label: string;
    sortable: boolean;
    width?: number; // Optional width property
  }

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  pop?: number;
  rain?: {
    '3h': number;
  };
  snow?: {
    '3h': number;
  };
}

export interface DailyForecast {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
}