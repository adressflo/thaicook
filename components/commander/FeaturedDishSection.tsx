"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { plats_db } from "@/generated/prisma/client"

interface FeaturedDish extends plats_db {
  joursDisponibles: string[]
}

interface FeaturedDishSectionProps {
  onScrollToDays: () => void
  featuredDay?: string // Jour actuellement sélectionné
}

export function FeaturedDishSection({
  onScrollToDays,
  featuredDay,
}: FeaturedDishSectionProps) {
  const [featuredDish, setFeaturedDish] = useState<FeaturedDish | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedDish = async () => {
      try {
        const response = await fetch("/api/featured-dish")
        if (response.ok) {
          const data = await response.json()
          setFeaturedDish(data.dish)
        }
      } catch (error) {
        console.error("Error fetching featured dish:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedDish()
  }, [])

  // Ne rien afficher si pas de plat vedette ou en chargement
  if (isLoading || !featuredDish) {
    return null
  }

  const joursLabels: Record<string, string> = {
    lundi: "Lundi",
    mardi: "Mardi",
    mercredi: "Mercredi",
    jeudi: "Jeudi",
    vendredi: "Vendredi",
    samedi: "Samedi",
    dimanche: "Dimanche",
  }

  const getJoursDisponiblesLabels = () => {
    return featuredDish.joursDisponibles
      .map((jour) => joursLabels[jour])
      .join(", ")
  }

  return (
    <Card className="mb-6 overflow-hidden shadow-lg border-2 border-thai-gold/30 bg-gradient-to-br from-white to-amber-50/30">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Vidéo Chanthana + Bulle dialogue */}
          <div className="relative flex-shrink-0">
            <video
              src="/media/hero/videos/platsemaine.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover"
            />
            {/* Bulle de dialogue */}
            <div className="absolute -top-2 -right-2 md:-right-4 bg-white rounded-2xl px-4 py-2 shadow-xl border-2 border-thai-gold animate-bounce">
              <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
              <p className="text-sm font-bold text-thai-orange whitespace-nowrap">
                Au menu cette semaine !
              </p>
            </div>
          </div>

          {/* Polaroid Plat Vedette */}
          <div
            onClick={onScrollToDays}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300 flex-1 max-w-sm"
          >
            <div className="bg-white p-4 shadow-2xl rounded-lg border-4 border-white transform hover:rotate-1 transition-transform">
              {/* Badge étoile */}
              <div className="absolute -top-2 -left-2 bg-thai-gold rounded-full p-2 shadow-lg z-10 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>

              {/* Image du plat */}
              <div className="relative aspect-square overflow-hidden rounded-md mb-3">
                <img
                  src={
                    featuredDish.photo_du_plat ||
                    "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/default.png"
                  }
                  alt={featuredDish.plat}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <p className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir les jours
                  </p>
                </div>
              </div>

              {/* Nom + Prix sur même ligne */}
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="font-semibold text-thai-green line-clamp-1">
                  {featuredDish.plat}
                </h3>
                <Badge variant="secondary" className="shrink-0 ml-2">
                  {featuredDish.prix ? `${parseFloat(featuredDish.prix.toString()).toFixed(2).replace('.', ',')}€` : "Prix sur demande"}
                </Badge>
              </div>

              {/* Description du plat - scrollable si longue */}
              <div
                className="max-h-20 overflow-y-auto px-2 mb-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#9ca3af #f3f4f6'
                }}
              >
                <p className="text-xs text-gray-600 leading-relaxed">
                  {featuredDish.description}
                </p>
              </div>

              {/* Jours disponibles */}
              <div className="text-center">
                <p className="text-xs text-thai-green font-semibold mb-1">Disponible</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {featuredDish.joursDisponibles.map((jour) => (
                    <Badge
                      key={jour}
                      variant="outline"
                      className={cn(
                        "text-xs",
                        featuredDay === jour
                          ? "bg-thai-gold text-white border-thai-gold"
                          : "border-thai-gold/30 text-thai-gold"
                      )}
                    >
                      {joursLabels[jour]}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Indication */}
              <p className="text-xs text-center text-gray-400 mt-3 italic">
                Cliquez pour choisir votre jour
              </p>
            </div>
          </div>

          {/* Message d'encouragement (mobile/desktop) */}
          <div className="hidden md:block text-center max-w-xs">
            <p className="text-thai-green font-semibold text-lg mb-2">
              Notre suggestion de la semaine !
            </p>
            <p className="text-gray-600 text-sm">
              Découvrez notre plat vedette, spécialement sélectionné pour vous.
            </p>
            <p className="text-thai-orange text-xs mt-2 font-medium">
              {getJoursDisponiblesLabels()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
