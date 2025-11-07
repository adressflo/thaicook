'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

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
}

export function HeroCarousel({ medias, autoPlayDuration = 7000 }: HeroCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

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
    <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
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

      {/* Contenu overlay (texte + CTA) */}
      <div className="absolute inset-x-0 bottom-0 pb-16 px-4 md:px-8 lg:px-12">
        <div
          className="max-w-4xl mx-auto text-center space-y-6"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-2xl">
            ChanthanaThaiCook
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 drop-shadow-lg max-w-2xl mx-auto">
            Cuisine Thaïlandaise Authentique
            <br />
            Faite Maison avec Passion
          </p>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-xl"
              asChild
            >
              <a href="/commander">Commander</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20 shadow-xl backdrop-blur-sm"
              onClick={handleDiscoverClick}
            >
              Découvrir <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

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
