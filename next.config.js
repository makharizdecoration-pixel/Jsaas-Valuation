/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // <-- 🎨 كانت الفاصلة ناقصة هنا
        hostname: 'jassas.mahkhariz-backend.com', // الدومين القديم
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // --- هذا هو الدومين الجديد الذي أضفناه ---
      {
        protocol: 'https', // <-- 🎨 وكانت الفاصلة ناقصة هنا
        hostname: 'jasasvaluation.mahkhariz-backend.com', // الدومين الجديد
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // ----------------------------------------
    ],
  },
};

module.exports = nextConfig;