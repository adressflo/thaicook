/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: __dirname, // Moved from experimental in Next.js 16
  experimental: {
    typedEnv: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lkaiwnkyoztebplqoifc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/plats/**',
      },
    ],
  },
};

export default nextConfig;