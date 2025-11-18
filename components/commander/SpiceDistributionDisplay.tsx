"use client"

import { Flame, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpiceDistributionDisplayProps {
  distributionText: string
  className?: string
}

/**
 * Composant qui affiche la répartition épicée avec des icônes Lucide
 * Style identique à SpiceDistributionSelector avec badges numériques
 *
 * Exemple d'entrée: "1 très épicé, 1 épicé, 1 un peu épicé, 1 non épicé"
 * Sortie: Icônes circulaires avec gradient et badge numérique
 */
export function SpiceDistributionDisplay({
  distributionText,
  className
}: SpiceDistributionDisplayProps) {
  if (!distributionText) return null

  // Parser le texte pour extraire les niveaux
  const parts = distributionText.split(", ")

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {parts.map((part, index) => {
        const match = part.match(/^(\d+)\s+(.+?)(?:\s+[🔥🍃]+)?$/)
        if (!match) return null

        const count = parseInt(match[1])
        const levelText = match[2].trim()

        // Déterminer le niveau d'épice basé sur le texte
        let flameCount = 0
        let gradientFrom = "from-green-400"
        let gradientTo = "to-green-600"

        if (levelText.includes("très épicé")) {
          flameCount = 3
          gradientFrom = "from-red-500"
          gradientTo = "to-red-700"
        } else if (levelText === "épicé") {
          flameCount = 2
          gradientFrom = "from-orange-400"
          gradientTo = "to-red-500"
        } else if (levelText.includes("un peu épicé")) {
          flameCount = 1
          gradientFrom = "from-yellow-400"
          gradientTo = "to-orange-500"
        } else if (levelText.includes("non épicé")) {
          flameCount = 0
          gradientFrom = "from-green-400"
          gradientTo = "to-green-600"
        }

        return (
          <div key={index} className="relative">
            {/* Badge numérique en haut à droite */}
            <div className="absolute -top-1.5 -right-1.5 bg-thai-green text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md z-10">
              {count}
            </div>

            {/* Icône circulaire avec gradient */}
            {flameCount === 0 ? (
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br shadow-md",
                gradientFrom,
                gradientTo
              )}>
                <Leaf className="w-5 h-5 text-white" />
              </div>
            ) : flameCount === 1 ? (
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br shadow-md",
                gradientFrom,
                gradientTo
              )}>
                <Flame className="w-5 h-5 text-white" />
              </div>
            ) : flameCount === 3 ? (
              // Triangle formation for 3 flames
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br shadow-md",
                gradientFrom,
                gradientTo
              )}>
                <div className="flex flex-col items-center gap-0">
                  <Flame className="w-2.5 h-2.5 text-white" />
                  <div className="flex gap-0 -mt-0.5">
                    <Flame className="w-2.5 h-2.5 text-white" />
                    <Flame className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              // 2 flames
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br shadow-md",
                gradientFrom,
                gradientTo
              )}>
                <div className="flex gap-0">
                  <Flame className="w-3 h-3 text-white" />
                  <Flame className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
