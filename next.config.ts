import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Add any other Next.js config options here
  reactStrictMode: true,
  swcMinify: true,
  // Handle static exports if needed
  images: {
    unoptimized: true,
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

export default nextConfig;
