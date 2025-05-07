# Weather Forecast Application

A modern weather forecast application built with Next.js that provides detailed weather information for cities worldwide. The application features a responsive design, real-time weather updates, and an intuitive user interface.

## Features

- **City Search**: Search for cities worldwide with autocomplete functionality
- **Current Weather Display**: 
  - Temperature and weather conditions
  - Feels like temperature
  - Humidity, wind speed, and pressure
  - Sunrise and sunset times
  - High and low temperatures
  - Precise geographical coordinates
- **5-Day Forecast**: Detailed weather predictions for the next 5 days
- **Dynamic Weather Backgrounds**: Background changes based on weather conditions and time of day
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Unit Toggle**: Switch between metric and imperial units

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Weather Data**: [OpenWeather API](https://openweathermap.org/api)
- **Cities Data**: [OpenDataSoft API](https://public.opendatasoft.com/)
- **TypeScript**: For type safety and better developer experience

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/hsayvaidya23/weather-forecast.git
cd weather-forecast
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
