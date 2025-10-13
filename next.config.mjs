/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.brandfetch.io',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['cdn.brandfetch.io'],
  },
};

export default nextConfig;
