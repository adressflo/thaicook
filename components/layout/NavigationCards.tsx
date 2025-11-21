'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Utensils,
  Calendar,
  MapPin,
  User,
  Users,
  History,
  Sparkles,
  Smartphone,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePWAInstalled } from '@/hooks/usePWAInstalled'
import { useState, useEffect } from 'react'

export interface NavigationCardData {
  id: string
  title: string
  buttonTitle: string
  description: string
  image: string
  link: string
  icon: LucideIcon
  disabled?: boolean
  badge?: string
  userPhoto?: string | null
  onClick?: () => void | Promise<void>
}

interface NavigationCardsProps {
  isAuthenticated: boolean
  userPhoto?: string | null
  photoUploadedRecently?: boolean
}

export function NavigationCards({
  isAuthenticated,
  userPhoto,
  photoUploadedRecently = false,
}: NavigationCardsProps) {
  const { isInstalled, canInstall, install } = usePWAInstalled()
  const [showInstallDialog, setShowInstallDialog] = useState(false)
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null)

  // Fonction exposée globalement pour déclencher l'effet depuis QuickNav
  useEffect(() => {
    const highlightCard = (cardId: string) => {
      setHighlightedCardId(cardId)

      // Scroll vers la card
      const element = document.getElementById(cardId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      // Retirer l'effet après 3 secondes
      setTimeout(() => {
        setHighlightedCardId(null)
      }, 3000)
    }

    // Exposer la fonction globalement
    (window as any).highlightCard = highlightCard

    return () => {
      delete (window as any).highlightCard
    }
  }, [])

  // Définition des cartes (Ordre : Priorité Business/Conversion)
  const cards: NavigationCardData[] = [
    {
      id: 'card-commander',
      title: 'Pour Commander',
      buttonTitle: 'Commander',
      description: 'Découvrez notre menu authentique et passez votre commande',
      image: '/pourcommander.svg',
      link: '/commander',
      icon: Utensils,
    },
    {
      id: 'card-installer',
      title: isInstalled ? 'Application Installée' : 'Installer l\'Application',
      buttonTitle: isInstalled ? 'Ouvrir' : 'Installer',
      description: isInstalled
        ? 'Accédez rapidement depuis votre écran d\'accueil'
        : 'Commander plus rapidement, notifications et mode hors ligne',
      image: '/installapp.svg',
      link: '#',
      icon: Smartphone,
      badge: !isInstalled && canInstall ? 'Recommandé' : undefined,
      onClick: async () => {
        if (!isInstalled) {
          setShowInstallDialog(true)
        } else if (isInstalled) {
          window.location.href = '/'
        }
      },
    },
    {
      id: 'card-evenements',
      title: 'Pour vos Événements',
      buttonTitle: 'Événements',
      description: 'Organisez vos événements avec nos menus personnalisés',
      image: '/pourvosevenement.svg',
      link: '/evenements',
      icon: Calendar,
    },
    {
      id: 'card-nous-trouver',
      title: 'Nous Trouver',
      buttonTitle: 'Nous Trouver',
      description: 'Venez nous rendre visite à Marigny-Marmande',
      image: '/nous trouver.svg',
      link: '/nous-trouver',
      icon: MapPin,
    },
    {
      id: 'card-decouvertes',
      title: 'Découvertes',
      buttonTitle: 'Découvrir',
      description: 'Nouveautés, plats du moment et suivez nos coulisses sur les réseaux sociaux',
      image: '/pourcommander.svg', // Temporaire - à remplacer par image appropriée
      link: '/actualites',
      icon: Sparkles,
    },
    {
      id: 'card-profil',
      title: 'Mon Profil',
      buttonTitle: 'Mon Profil',
      description: 'Gérez vos informations personnelles et préférences',
      image: userPhoto || '/image avatar/profildefaut.svg',
      link: isAuthenticated ? '/profil' : '/auth/login',
      icon: User,
      disabled: !isAuthenticated,
      badge: isAuthenticated && photoUploadedRecently ? 'Nouveau !' : undefined,
      userPhoto: userPhoto,
    },
    {
      id: 'card-suivi',
      title: isAuthenticated ? 'Suivi' : 'Historique',
      buttonTitle: isAuthenticated ? 'Suivi' : 'Historique',
      description: "Suivez vos commandes et consultez l'historique",
      image: '/suivihistorique.svg',
      link: isAuthenticated ? '/historique' : '/auth/login',
      icon: History,
      disabled: !isAuthenticated,
    },
    {
      id: 'card-a-propos',
      title: 'À propos de nous',
      buttonTitle: 'À Propos',
      description: 'Découvrez notre histoire et notre passion',
      image: '/apropos.svg',
      link: '/a-propos',
      icon: Users,
    },
  ]

  // Filtrer les cards : masquer celles qui nécessitent une connexion si non connecté
  const visibleCards = isAuthenticated
    ? cards // Tout afficher si connecté
    : cards.filter((card) => !card.disabled) // Masquer les cards disabled si non connecté

  return (
    <section className="flex-1 py-16" id="navigation-cards">
      <div className="w-full px-8">
        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ gridAutoRows: '1fr' }}
        >
          {visibleCards.map((card, index) => {
            const isHighlighted = highlightedCardId === card.id

            return (
              <Card
                key={card.title}
                id={card.id}
                className={cn(
                  'group cursor-pointer transition-all duration-500 ease-out border-2 overflow-hidden flex flex-col h-full scroll-mt-24',
                  // Effet hover normal
                  !isHighlighted && 'hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:rotate-[-2deg]',
                  // Effet temporaire quand highlighté (3 secondes) avec glow lumineux
                  isHighlighted
                    ? 'rotate-[-2deg] scale-105 -translate-y-2 border-thai-orange animate-glow-pulse'
                    : 'rotate-0',
                  card.disabled
                    ? 'border-gray-300 opacity-60 cursor-not-allowed hover:scale-100 hover:translate-y-0 hover:rotate-0'
                    : 'border-thai-orange/20 hover:border-thai-orange'
                )}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
              <Link
                href={(card.disabled ? '#' : card.link) as any}
                className="h-full flex flex-col"
                onClick={(e) => {
                  if (card.disabled) {
                    e.preventDefault()
                  } else if (card.onClick) {
                    e.preventDefault()
                    card.onClick()
                  }
                }}
              >
                {/* Image avec badge optionnel */}
                <div className="aspect-video overflow-hidden relative flex-shrink-0">
                  {card.userPhoto ? (
                    <Image
                      src={card.userPhoto}
                      alt={card.title}
                      fill
                      className={cn(
                        'object-cover transition-all duration-700',
                        !card.disabled && 'group-hover:scale-110 group-hover:brightness-110'
                      )}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <img
                      src={card.image}
                      alt={card.title}
                      className={cn(
                        'w-full h-full object-cover transition-all duration-700',
                        card.image === '/installapp.svg' && 'object',
                        !card.disabled && 'group-hover:scale-110 group-hover:brightness-110'
                      )}
                      loading="lazy"
                    />
                  )}

                  {/* Overlay gradient au hover */}
                  {!card.disabled && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  {/* Icon */}
                  <card.icon
                    className={cn(
                      'absolute top-4 right-4 h-8 w-8 text-white transition-all duration-500',
                      card.disabled
                        ? 'opacity-40'
                        : 'opacity-0 group-hover:opacity-100 group-hover:text-thai-orange transform group-hover:scale-125'
                    )}
                  />

                  {/* Badge "Nouveau !" */}
                  {card.badge && (
                    <Badge
                      className="absolute top-4 left-4 bg-thai-orange text-white shadow-lg animate-pulse"
                      variant="default"
                    >
                      {card.badge}
                    </Badge>
                  )}

                  {/* Badge "Connexion requise" pour cartes désactivées */}
                  {card.disabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Badge variant="secondary" className="text-xs">
                        Connexion requise
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <CardContent className="p-6 flex flex-col flex-grow justify-between">
                  <div className="flex-grow">
                    <h3
                      className={cn(
                        'text-xl font-semibold mb-3 transition-colors duration-300',
                        card.disabled
                          ? 'text-gray-500'
                          : 'text-thai-green group-hover:text-thai-orange'
                      )}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={cn(
                        'text-center transition-colors duration-300',
                        card.disabled
                          ? 'text-gray-400'
                          : 'text-thai-green/70 group-hover:text-thai-green'
                      )}
                    >
                      {card.description}
                    </p>
                  </div>

                  {/* Bouton */}
                  <div className="mt-6 flex-shrink-0">
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full transition-all duration-300',
                        card.disabled
                          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                          : 'border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white group-hover:shadow-lg transform group-hover:scale-105'
                      )}
                      disabled={card.disabled}
                      onClick={(e) => {
                        if (card.onClick) {
                          e.preventDefault()
                          e.stopPropagation()
                          card.onClick()
                        }
                      }}
                    >
                      {card.buttonTitle}
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
            )
          })}
        </div>
      </div>

      {/* Dialog de confirmation d'installation PWA */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="max-w-md bg-white border-2 border-thai-orange shadow-2xl p-0 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
          <button
            onClick={() => setShowInstallDialog(false)}
            className="absolute right-4 top-4 z-20 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-black/20 transition-all duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image en haut comme les cards */}
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src="/image avatar/phonevalid.svg"
              alt="Installation"
              fill
              className="object-cover"
            />
            {/* Icon comme les cards */}
            <Smartphone className="absolute top-4 left-4 h-8 w-8 text-white" />
          </div>

          {/* Contenu comme les cards */}
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-thai-green">
                Installer l'Application
              </DialogTitle>
              <DialogDescription className="text-thai-green/90 text-base leading-relaxed text-center">
                L'application sera ajoutée à votre écran d'accueil pour un accès rapide et des notifications en temps réel.
              </DialogDescription>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowInstallDialog(false)}
                variant="outline"
                className="flex-1 rounded-lg border-2 border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
              >
                Annuler
              </Button>
              <Button
                onClick={async () => {
                  await install()
                  setShowInstallDialog(false)
                }}
                className="flex-1 bg-thai-orange hover:bg-thai-orange/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Installer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
