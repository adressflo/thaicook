"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { plats_db } from "@/generated/prisma/client"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface FeaturedDish extends plats_db {
  joursDisponibles: string[]
}

interface FeaturedDishSectionProps {
  onScrollToDays: () => void
  featuredDay?: string // Jour actuellement sélectionné
}

export function FeaturedDishSection({ onScrollToDays, featuredDay }: FeaturedDishSectionProps) {
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
    return featuredDish.joursDisponibles.map((jour) => joursLabels[jour]).join(", ")
  }

  return (
    <Card className="border-thai-gold/30 mb-6 overflow-hidden border-2 bg-linear-to-br from-white to-amber-50/30 shadow-lg">
      <div className="p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          {/* Vidéo Chanthana + Bulle dialogue SUPPRIMÉS */}

          {/* Polaroid Plat Vedette */}
          <div
            onClick={onScrollToDays}
            className="group max-w-sm flex-1 transform cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="transform rounded-lg border-4 border-white bg-white p-4 shadow-2xl transition-transform hover:rotate-1">
              {/* Badge étoile */}
              <div className="bg-thai-gold absolute -top-2 -left-2 z-10 rounded-full p-2 shadow-lg transition-transform group-hover:scale-110">
                <Star className="h-6 w-6 fill-white text-white" />
              </div>

              {/* Image du plat */}
              <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                <Image
                  src={
                    featuredDish.photo_du_plat ||
                    "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/default.png"
                  }
                  alt={featuredDish.plat}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  priority
                />
                {/* Overlay au hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                  <p className="text-lg font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Voir les jours
                  </p>
                </div>
              </div>

              {/* Nom + Prix sur même ligne */}
              <div className="mb-2 flex items-center justify-between px-2">
                <h3 className="text-thai-green line-clamp-1 font-semibold">{featuredDish.plat}</h3>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  {featuredDish.prix
                    ? `${parseFloat(featuredDish.prix.toString()).toFixed(2).replace(".", ",")}€`
                    : "Prix sur demande"}
                </Badge>
              </div>

              {/* Description du plat - scrollable si longue */}
              <div
                className="mb-2 max-h-20 overflow-y-auto px-2"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#9ca3af #f3f4f6",
                }}
              >
                <p className="text-xs leading-relaxed text-gray-600">{featuredDish.description}</p>
              </div>

              {/* Jours disponibles */}
              <div className="text-center">
                <p className="text-thai-green mb-1 text-xs font-semibold">Disponible</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {featuredDish.joursDisponibles.map((jour) => (
                    <Badge
                      key={jour}
                      variant="outline"
                      className={cn(
                        "text-xs",
                        featuredDay === jour
                          ? "bg-thai-gold border-thai-gold text-white"
                          : "border-thai-gold/30 text-thai-gold"
                      )}
                    >
                      {joursLabels[jour]}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Indication */}
              <p className="mt-3 text-center text-xs text-gray-400 italic">
                Cliquez pour choisir votre jour
              </p>
            </div>
          </div>

          {/* Message d'encouragement (mobile/desktop) */}
          <div className="hidden max-w-xs text-center md:block">
            <p className="text-thai-green mb-2 text-lg font-semibold">
              Notre suggestion de la semaine !
            </p>
            <p className="text-sm text-gray-600">
              Découvrez notre plat vedette, spécialement sélectionné pour vous.
            </p>
            <p className="text-thai-orange mt-2 text-xs font-medium">
              {getJoursDisponiblesLabels()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
