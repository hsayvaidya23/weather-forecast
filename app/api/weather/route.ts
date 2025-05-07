import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const units = searchParams.get('units') || 'metric';

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Fetch both current weather and forecast in parallel
    const [currentWeather, forecast] = await Promise.all([
      fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      ),
      fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      )
    ]);

    if (!currentWeather.ok || !forecast.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const [currentData, forecastData] = await Promise.all([
      currentWeather.json(),
      forecast.json()
    ]);

    // Transform current weather data
    const current = {
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      temp_min: currentData.main.temp_min,
      temp_max: currentData.main.temp_max,
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      main: currentData.weather[0].main,
      dt: currentData.dt,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset
    };

    return NextResponse.json(
      {
        current,
        forecast: forecastData.list,
        city: forecastData.city
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        },
      }
    );

  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

// // Fetch Pune weather data
// const puneLat = 18.51957;
// const puneLon = 73.85535;

// const puneCurrentWeather = await fetch(
//   `https://api.openweathermap.org/data/2.5/weather?lat=${puneLat}&lon=${puneLon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
// );

// const puneForecast = await fetch(
//   `https://api.openweathermap.org/data/2.5/forecast?lat=${puneLat}&lon=${puneLon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
// );

// if (!puneCurrentWeather.ok || !puneForecast.ok) {
//   throw new Error('Failed to fetch Pune weather data');
// }

// const [puneCurrentData, puneForecastData] = await Promise.all([
//   puneCurrentWeather.json(),
//   puneForecast.json()
// ]);

// // Transform Pune current weather data
// const puneCurrent = {
//   temp: puneCurrentData.main.temp,
//   feels_like: puneCurrentData.main.feels_like,
//   temp_min: puneCurrentData.main.temp_min,
//   temp_max: puneCurrentData.main.temp_max,
//   humidity: puneCurrentData.main.humidity,
//   pressure: puneCurrentData.main.pressure,
//   wind_speed: puneCurrentData.wind.speed,
//   wind_deg: puneCurrentData.wind.deg,
//   description: puneCurrentData.weather[0].description,
//   icon: puneCurrentData.weather[0].icon,
//   main: puneCurrentData.weather[0].main,
//   dt: puneCurrentData.dt,
//   sunrise: puneCurrentData.sys.sunrise,
//   sunset: puneCurrentData.sys.sunset
// };

// // Log Pune weather data
// console.log('Pune Current Weather:', puneCurrent);
// console.log('Pune 5-Day Forecast:', puneForecastData.list);