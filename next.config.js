/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*', // Adjust if your backend port is different
        },
      ];
    },
  };
  
  module.exports = nextConfig;