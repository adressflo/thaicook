import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Re-activer ESLint pour la production
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Optimisation TypeScript pour la production
  typescript: {
    // Désactiver uniquement si vous êtes sûr qu'il n'y a pas d'erreurs TypeScript
    ignoreBuildErrors: false,
  },
  
  // Optimisations expérimentales Next.js 15
  experimental: {
    // React Compiler - compatible avec React 19 
    reactCompiler: true,
    // Optimisation bundle
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    // PPR sera activé quand Next.js stable le supportera
    // ppr: true, // Disponible uniquement en canary
  },
  
  // Turbopack (stable dans Next.js 15) - Configuration simplifiée
  turbopack: {
    // Alias de résolution corrigés
    resolveAlias: {
      '@': './',
      '@/components': './components',
      '@/lib': './lib',
      '@/contexts': './contexts',
      '@/hooks': './hooks',
      '@/types': './types',
    },
  },
  
  // Optimisation des images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 an
  },
  
  // Optimisation des performances
  compress: true,
  poweredByHeader: false,
  
  // Optimisation des headers
  async headers() {
    return [
      // Headers de sécurité globaux
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Cache des ressources statiques
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
