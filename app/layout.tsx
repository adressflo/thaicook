import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '../components/providers';
import './globals.css'; // This is a side-effect import
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FloatingUserIcon } from '../components/FloatingUserIcon';
import ErrorBoundary from '../components/ErrorBoundary';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ChanthanaThaiCook - Restaurant Thaï Authentique',
  description:
    'Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande. Découvrez nos plats authentiques et notre service personnalisé.',
  keywords:
    'restaurant thaï, cuisine thaïlandaise, plats authentiques, ChanthanaThaiCook',
  authors: [{ name: 'APPCHANTHANA' }],
  robots: 'index, follow',
  openGraph: {
    title: 'APPCHANTHANA - Restaurant Thaï Authentique',
    description:
      'Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande',
    type: 'website',
    locale: 'fr_FR',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <ErrorBoundary>
          <Providers>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
              <FloatingUserIcon />
            </TooltipProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
