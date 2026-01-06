import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Отключаем Turbopack, если он вызывает проблемы
  // webpack: (config) => config,
};

export default nextConfig;
