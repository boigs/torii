/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
      },
    ],
  },
  reactStrictMode: false,
  output: 'standalone',
};

module.exports = nextConfig;
