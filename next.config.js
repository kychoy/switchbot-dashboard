/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      // Explicitly allow your local network IP (or wildcard for testing)
      allowedDevOrigins: ['http://192.168.0.204:3000'],
      // Optionally allow all dev origins (less secure but works in dev)
      // allowedDevOrigins: ['*']
    }
  };
  
  module.exports = nextConfig;
  