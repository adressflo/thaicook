"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBreakpoints } from "@/hooks/use-mobile"
import { usePWAInstalled } from "@/hooks/usePWAInstalled"
import { cn } from "@/lib/utils"
import Autoplay from "embla-carousel-autoplay"
import Fade from "embla-carousel-fade"
import useEmblaCarousel from "embla-carousel-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

export interface HeroMedia {
  id: string
  type: "image" | "video"
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

export function HeroCarousel({
  medias,
  autoPlayDuration = 7000,
  isAuthenticated = false,
}: HeroCarouselProps) {
  const { isInstalled, canInstall, install } = usePWAInstalled()
  const { isMobile } = useBreakpoints()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedLang, setSelectedLang] = useState<"fr" | "th" | "en" | "nl">("fr")
  const [showInstallDialog, setShowInstallDialog] = useState(false)

  // Configuration des langues avec drapeaux waving WebP
  const languages = [
    { code: "fr" as const, flag: "/flags/fr.webp", label: "Français" },
    { code: "th" as const, flag: "/flags/th.webp", label: "ไทย" },
    { code: "en" as const, flag: "/flags/gb.webp", label: "English" },
    { code: "nl" as const, flag: "/flags/nl.webp", label: "Nederlands" },
  ]

  // Scroll animations for navigation card
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  })

  // Transform scroll progress into animation values
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.9] : [1.05, 1])
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Détecter prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

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
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
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
    document.getElementById("navigation-cards")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  // Fallback si aucun média
  if (!medias || medias.length === 0) {
    return (
      <div className="from-thai-orange/20 via-thai-gold/10 to-thai-green/20 relative h-[60vh] min-h-[500px] bg-linear-to-br">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <Sparkles className="text-thai-orange mx-auto h-16 w-16 animate-pulse" />
            <h1 className="text-thai-green text-4xl font-bold md:text-5xl lg:text-6xl">
              ChanthanaThaiCook
            </h1>
            <p className="mx-auto max-w-2xl px-4 text-lg text-gray-700 md:text-xl">
              Cuisine Thaïlandaise Authentique
              <br />
              Faite Maison avec Passion
            </p>
            <div className="flex justify-center gap-4 pt-4">
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
    <div
      className="relative h-[65vh] min-h-[450px] w-full overflow-hidden md:h-[80vh] md:min-h-[650px]"
      style={{ perspective: "1000px" }}
    >
      {/* Card navigation en haut à gauche - Avec scroll animations */}
      <motion.div
        className="absolute top-4 left-4 z-30 md:top-6 md:left-12"
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
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="relative transition-all duration-500 md:rounded-2xl md:border md:border-white/20 md:bg-linear-to-br md:from-white/15 md:via-white/10 md:to-white/5 md:p-6 md:shadow-2xl md:backdrop-blur-xl md:hover:scale-[1.02] md:hover:border-white/40 md:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          {/* Effet de brillance (Desktop seulement) */}
          <div className="absolute inset-0 hidden rounded-2xl bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 md:block" />

          <div className="relative flex flex-col items-center gap-4">
            {/* Logo + Nom */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 md:h-14 md:w-14">
                <div className="bg-thai-orange/20 group-hover:bg-thai-orange/40 absolute inset-0 rounded-full blur-xl transition-all duration-500" />
                <Image
                  src="/logo.svg"
                  alt="Logo ChanthanaThaiCook"
                  fill
                  priority
                  sizes="56px"
                  className="relative z-10 object-contain shadow-black/20 drop-shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                />
              </div>
              <span className="group-hover:text-thai-orange pt-2 text-xl font-bold whitespace-nowrap text-white drop-shadow-xl transition-colors duration-300 md:pt-0 md:text-2xl">
                ChanthanaThaiCook
              </span>
            </Link>

            {/* Conteneur boutons masqué sur mobile */}
            <div className="hidden w-full flex-col gap-4 md:flex">
              {/* Séparateur décoratif */}
              <div className="h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent" />

              {/* Bouton Commander */}
              <Link href="/commander" className="group/btn w-full">
                <Button
                  size="lg"
                  className="from-thai-orange to-thai-orange/90 hover:from-thai-orange/90 hover:to-thai-orange hover:shadow-thai-orange/50 relative w-full overflow-hidden bg-linear-to-r text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  <span className="relative z-10">Commander</span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                </Button>
              </Link>

              {/* Bouton Nous Trouver */}
              <Link href="/nous-trouver" className="group/btn w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:text-thai-green relative w-full overflow-hidden border-2 border-white/50 bg-white/10 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-white hover:bg-white"
                >
                  <span className="relative z-10">Nous Trouver</span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                </Button>
              </Link>
            </div>
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
              <div className="relative h-9 w-12 shrink-0">
                <Image
                  src={languages.find((l) => l.code === selectedLang)?.flag || "/flags/fr.webp"}
                  alt={`Flag ${selectedLang}`}
                  fill
                  className="rounded-sm object-cover"
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
                className="flex cursor-pointer items-center gap-2"
              >
                <div className="relative h-5 w-6 shrink-0">
                  <Image
                    src={lang.flag}
                    alt={`Flag ${lang.code}`}
                    fill
                    className="rounded-sm object-cover"
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
      <header className="absolute top-0 right-0 left-0 z-20 hidden bg-linear-to-b from-black/5 to-transparent px-4 py-6 backdrop-blur-[2px] md:block">
        <nav className="flex items-center justify-center gap-8">
          <a
            href="#navigation-cards"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('[href="/evenements"]')?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }}
            className="hover:text-thai-orange text-xl font-bold text-white/90 drop-shadow-lg transition-colors duration-200 md:text-2xl"
          >
            Événements
          </a>
          <a
            href="#navigation-cards"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('[href="/a-propos"]')?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }}
            className="hover:text-thai-orange text-xl font-bold text-white/90 drop-shadow-lg transition-colors duration-200 md:text-2xl"
          >
            À Propos
          </a>
          <a
            href="#navigation-cards"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('[href="/actualites"]')?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }}
            className="hover:text-thai-orange text-xl font-bold text-white/90 drop-shadow-lg transition-colors duration-200 md:text-2xl"
          >
            Actualités
          </a>
          {isAuthenticated && (
            <>
              <Link
                href="/profil"
                className="hover:text-thai-orange text-xl font-bold text-white/90 drop-shadow-lg transition-colors duration-200 md:text-2xl"
              >
                Mon Profil
              </Link>
              <Link
                href="/historique"
                className="hover:text-thai-orange text-xl font-bold text-white/90 drop-shadow-lg transition-colors duration-200 md:text-2xl"
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
            <div key={media.id} className="relative min-w-0 flex-[0_0_100%]">
              {media.type === "video" ? (
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
                  alt={media.titre || "Hero image"}
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
        className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Bouton CTA Installer l'Application - Bas droite */}
      {!isInstalled && (
        <div className="absolute right-4 bottom-4 z-30">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              if (canInstall) {
                setShowInstallDialog(true)
              }
            }}
            className="hover:text-thai-green border-2 border-white bg-white/10 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
          >
            Installer l'App
          </Button>
        </div>
      )}

      {/* Dialog de confirmation installation PWA */}
      <AlertDialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-thai-green text-2xl font-bold">
              Installer ChanthanaThaiCook
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2 text-base">
              <p>Installez notre application pour une expérience optimale :</p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Accès rapide depuis votre écran d'accueil</li>
                <li>Notifications en temps réel pour vos commandes</li>
                <li>Consultation du menu hors ligne</li>
                <li>Interface plus fluide et rapide</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">Annuler</AlertDialogCancel>
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
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {medias.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === selectedIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
