/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jassas.mahkhariz-backend.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;