'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePWAInstalled } from '@/hooks/usePWAInstalled'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useBreakpoints } from '@/hooks/use-mobile'

export interface HeroMedia {
  id: string
  type: 'image' | 'video'
  url: string
  titre?: string | null
  description?: string | null
  ordre: number
  active: boolean
}

interface HeroCarouselProps {
  medias: HeroMedia[]
  autoPlayDuration?: number
  isAuthenticated?: boolean
}

export function HeroCarousel({ medias, autoPlayDuration = 7000, isAuthenticated = false }: HeroCarouselProps) {
  const { isInstalled, canInstall, install } = usePWAInstalled()
  const { isMobile } = useBreakpoints()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedLang, setSelectedLang] = useState<'fr' | 'th' | 'en' | 'nl'>('fr')
  const [showInstallDialog, setShowInstallDialog] = useState(false)

  // Configuration des langues avec drapeaux waving WebP
  const languages = [
    { code: 'fr' as const, flag: '/flags/fr.webp', label: 'Français' },
    { code: 'th' as const, flag: '/flags/th.webp', label: 'ไทย' },
    { code: 'en' as const, flag: '/flags/gb.webp', label: 'English' },
    { code: 'nl' as const, flag: '/flags/nl.webp', label: 'Nederlands' },
  ]

  // Scroll animations for navigation card
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end start'],
  })

  // Transform scroll progress into animation values
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0.7, 0.9] : [1.05, 1]
  )
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Détecter prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Configuration Embla avec Autoplay et Fade
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30, // Durée de la transition en ms (fade rapide)
    },
    [
      Fade(),
      ...(prefersReducedMotion
        ? [] // Désactiver autoplay si prefers-reduced-motion
        : [
            Autoplay({
              delay: autoPlayDuration,
              stopOnInteraction: false, // Continue après interaction
              stopOnMouseEnter: true, // Pause au hover
              stopOnFocusIn: true,
            }),
          ]),
    ]
  )

  // Mettre à jour l'index sélectionné
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Navigation vers slide spécifique (dots)
  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  // Smooth scroll vers section navigation
  const handleDiscoverClick = () => {
    document.getElementById('navigation-cards')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  // Fallback si aucun média
  if (!medias || medias.length === 0) {
    return (
      <div className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-thai-orange/20 via-thai-gold/10 to-thai-green/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Sparkles className="w-16 h-16 mx-auto text-thai-orange animate-pulse" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-thai-green">
              ChanthanaThaiCook
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto px-4">
              Cuisine Thaïlandaise Authentique
              <br />
              Faite Maison avec Passion
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" className="bg-thai-orange hover:bg-thai-orange/90">
                Commander
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={handleDiscoverClick}
              >
                Découvrir <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[80vh] min-h-[650px] w-full overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Card navigation en haut à gauche - Avec scroll animations */}
      <motion.div
        className="absolute top-6 left-12 z-30"
        style={
          prefersReducedMotion
            ? {}
            : {
                rotateX,
                scale,
                translateY,
              }
        }
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex flex-col items-center gap-4">
            {/* Logo + Nom */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 flex-shrink-0">
                <div className="absolute inset-0 bg-thai-orange/20 rounded-full blur-xl group-hover:bg-thai-orange/40 transition-all duration-500" />
                <Image
                  src="/logo.svg"
                  alt="Logo ChanthanaThaiCook"
                  fill
                  className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10"
                />
              </div>
              <span className="text-white font-bold text-2xl whitespace-nowrap drop-shadow-2xl group-hover:text-thai-orange transition-colors duration-300">
                ChanthanaThaiCook
              </span>
            </Link>

            {/* Séparateur décoratif */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Bouton Commander */}
            <Link href="/commander" className="w-full group/btn">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-thai-orange to-thai-orange/90 hover:from-thai-orange/90 hover:to-thai-orange text-white font-bold text-lg shadow-xl hover:shadow-thai-orange/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              >
                <span className="relative z-10">Commander</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>

            {/* Bouton Nous Trouver */}
            <Link href="/nous-trouver" className="w-full group/btn">
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white font-bold text-lg hover:bg-white hover:text-thai-green hover:border-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              >
                <span className="relative z-10">Nous Trouver</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Sélecteur de langue - Position absolue coin bas-gauche */}
      <div className="absolute bottom-4 left-4 z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center transition-transform duration-200 hover:scale-110"
              aria-label="Changer de langue"
            >
              <div className="relative w-12 h-9 flex-shrink-0">
                <Image
                  src={languages.find(l => l.code === selectedLang)?.flag || '/flags/fr.webp'}
                  alt={`Flag ${selectedLang}`}
                  fill
                  className="object-cover rounded-sm"
                  sizes="48px"
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-white/95 backdrop-blur-sm">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className="cursor-pointer flex items-center gap-2"
              >
                <div className="relative w-6 h-5 flex-shrink-0">
                  <Image
                    src={lang.flag}
                    alt={`Flag ${lang.code}`}
                    fill
                    className="object-cover rounded-sm"
                    sizes="24px"
                  />
                </div>
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header Navigation - Centré */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/5 to-transparent backdrop-blur-[2px] py-6 px-4">
        <nav className="flex items-center justify-center gap-8">
          <a
            href="#navigation-cards"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('[href="/evenements"]')?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }}
            className="text-white/90 hover:text-thai-orange text-xl md:text-2xl font-bold transition-colors duration-200 drop-shadow-lg"
          >
            Événements
          </a>
          <a
            href="#navigation-cards"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('[href="/a-propos"]')?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }}
            className="text-white/90 hover:text-thai-orange text-xl md:text-2xl font-bold transition-colors duration-200 drop-shadow-lg"
          >
            À Propos
          </a>
          <a
            href="#navigation-cards"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('[href="/actualites"]')?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }}
            className="text-white/90 hover:text-thai-orange text-xl md:text-2xl font-bold transition-colors duration-200 drop-shadow-lg"
          >
            Actualités
          </a>
          {isAuthenticated && (
            <>
              <Link
                href="/profil"
                className="text-white/90 hover:text-thai-orange text-xl md:text-2xl font-bold transition-colors duration-200 drop-shadow-lg"
              >
                Mon Profil
              </Link>
              <Link
                href="/historique"
                className="text-white/90 hover:text-thai-orange text-xl md:text-2xl font-bold transition-colors duration-200 drop-shadow-lg"
              >
                Suivi
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Embla Carousel */}
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {medias.map((media) => (
            <div key={media.id} className="relative flex-[0_0_100%] min-w-0">
              {media.type === 'video' ? (
                <video
                  src={media.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source src={media.url} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={media.url}
                  alt={media.titre || 'Hero image'}
                  fill
                  priority={medias.indexOf(media) === 0} // Priority pour la première image
                  className="object-cover"
                  sizes="100vw"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay gradient (tiers inférieur) */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Bouton CTA Installer l'Application - Bas droite */}
      <div className="absolute bottom-4 right-4 z-30">
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            if (!isInstalled && canInstall) {
              setShowInstallDialog(true)
            }
          }}
          className="bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold hover:bg-white hover:text-thai-green transition-all duration-300 hover:scale-105"
        >
          {isInstalled ? 'Application Installée' : 'Installer l\'App'}
        </Button>
      </div>

      {/* Dialog de confirmation installation PWA */}
      <AlertDialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-thai-green">
              Installer ChanthanaThaiCook
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-3 pt-2">
              <p>
                Installez notre application pour une expérience optimale :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Accès rapide depuis votre écran d'accueil</li>
                <li>Notifications en temps réel pour vos commandes</li>
                <li>Consultation du menu hors ligne</li>
                <li>Interface plus fluide et rapide</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await install()
                setShowInstallDialog(false)
              }}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white"
            >
              Installer l'application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dots navigation (discrets) */}
      {medias.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {medias.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === selectedIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
