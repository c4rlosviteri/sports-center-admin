/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Cloudflare Pages deployment
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'biciantro.pages.dev'], // Add your production domain
    },
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      'pg-native': 'commonjs pg-native',
    })
    return config
  },
}

export default nextConfig
