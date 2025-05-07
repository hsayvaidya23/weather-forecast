import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['openweathermap.org'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
