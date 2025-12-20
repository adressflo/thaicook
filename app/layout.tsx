import { MobileNav } from "@/components/layout/MobileNav"
import { Toaster } from "@/components/ui/toaster"
import { ToasterVideo } from "@/components/ui/toastervideo"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "../components/providers"
import "./globals.css" // This is a side-effect import

import { RestaurantFooter } from "@/components/Footer"
import { FloatingUserIcon } from "@/components/layout/FloatingUserIcon"
import { OfflineBanner } from "@/components/pwa/OfflineBanner"
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator"
import { PWARegister } from "@/components/pwa/PWARegister"
import { ChunkErrorBoundary } from "@/components/shared/ChunkErrorBoundary"
import ErrorBoundary from "@/components/shared/ErrorBoundary"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ChanthanaThaiCook - Restaurant Thaï Authentique",
  description:
    "Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande. Découvrez nos plats authentiques et notre service personnalisé.",
  keywords: "restaurant thaï, cuisine thaïlandaise, plats authentiques, ChanthanaThaiCook",
  authors: [{ name: "APPCHANTHANA" }],
  robots: "index, follow",
  applicationName: "Chanthana Thai Cook",
  appleWebApp: {
    capable: true,
    title: "Chanthana",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "ChanthanaThaiCook - Restaurant Thaï Authentique",
    description:
      "Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande",
    type: "website",
    locale: "fr_FR",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D97706",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="h-full" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen font-sans antialiased`}
      >
        <ChunkErrorBoundary>
          <PWARegister />
          <ErrorBoundary>
            <Providers>
              <TooltipProvider>
                <OfflineBanner dismissible showLastSync />
                <Toaster />
                <ToasterVideo />
                <Sonner />
                <NuqsAdapter>
                  {children}
                  <RestaurantFooter />
                  <MobileNav />
                </NuqsAdapter>
                <FloatingUserIcon />
                <OfflineIndicator position="bottom-right" />
              </TooltipProvider>
            </Providers>
          </ErrorBoundary>
        </ChunkErrorBoundary>
      </body>
    </html>
  )
}
