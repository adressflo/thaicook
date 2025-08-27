import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'ChanthanaThaiCook - Restaurant Thaï Authentique',
    template: '%s | ChanthanaThaiCook'
  },
  description: 'Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande. Découvrez nos plats authentiques et notre service personnalisé à Marigny-Marmande.',
  keywords: [
    'restaurant thaï',
    'cuisine thaïlandaise',
    'plats authentiques',
    'ChanthanaThaiCook',
    'Marigny-Marmande',
    'commande en ligne',
    'événements thaï',
    'livraison'
  ],
  authors: [{ name: 'ChanthanaThaiCook', url: 'https://chanthanathaicock.fr' }],
  creator: 'ChanthanaThaiCook',
  publisher: 'ChanthanaThaiCook',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'ChanthanaThaiCook',
    title: 'ChanthanaThaiCook - Restaurant Thaï Authentique',
    description: 'Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande',
    locale: 'fr_FR',
    images: [
      {
        url: '/logo.svg',
        width: 300,
        height: 300,
        alt: 'Logo ChanthanaThaiCook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@chanthanathaicock',
    creator: '@chanthanathaicock',
    title: 'ChanthanaThaiCook - Restaurant Thaï Authentique',
    description: 'Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande',
    images: ['/logo.svg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: 'your-google-verification-code', // À remplacer par le vrai code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: 'restaurant',
};

export const generatePageMetadata = (title: string, description: string): Metadata => {
  return {
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
    },
  };
};