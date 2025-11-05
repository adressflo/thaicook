import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chanthana Thai Cook',
    short_name: 'Chanthana',
    description: 'Restaurant thaïlandais traditionnel - Commandez vos plats préférés en ligne',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FFFFFF',
    theme_color: '#D97706',
    lang: 'fr-FR',
    dir: 'ltr',
    scope: '/',
    categories: ['food', 'restaurant', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Commander',
        short_name: 'Commander',
        description: 'Accéder au menu et commander',
        url: '/commander',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
          },
        ],
      },
      {
        name: 'Mon Historique',
        short_name: 'Historique',
        description: 'Voir mes commandes',
        url: '/historique',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
          },
        ],
      },
    ],
    screenshots: [],
  };
}
