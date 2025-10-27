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
      {
        protocol: 'https',
        hostname: 'pub-22aba751964d4cd59830c943be546a9e.r2.dev',
        port: '',
        pathname: '/getfork-images/**',
      },
    ],
    domains: ['cdn.brandfetch.io', 'pub-22aba751964d4cd59830c943be546a9e.r2.dev'],
  },
};

export default nextConfig;
