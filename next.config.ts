/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
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