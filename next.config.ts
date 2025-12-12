/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: __dirname, // Moved from experimental in Next.js 16
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
  },
  experimental: {
    typedEnv: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lkaiwnkyoztebplqoifc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "storage.chanthana.fr",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "116.203.111.206",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
  // Redirections
  async redirects() {
    return [
      {
        source: "/suivi",
        destination: "/historique",
        permanent: true, // 308 Permanent Redirect
      },
    ]
  },
  // Turbopack config (Next.js 16 default)
  turbopack: {},
  webpack: (config: any) => {
    // Exclure firebase-messaging-sw.js du bundling
    config.module.rules.push({
      test: /firebase-messaging-sw\.js$/,
      use: "null-loader",
    })
    return config
  },
}

export default nextConfig
