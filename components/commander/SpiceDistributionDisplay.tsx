"use client"

import { Flame, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpiceDistributionDisplayProps {
  distributionText: string
  className?: string
}

/**
 * Composant qui affiche la répartition épicée avec des icônes Lucide
 * au lieu des emojis 🔥🍃
 *
 * Exemple d'entrée: "1 très épicé 🔥🔥🔥, 1 épicé 🔥🔥, 1 non épicé 🍃"
 * Sortie: Icônes visuelles avec gradients
 */
export function SpiceDistributionDisplay({
  distributionText,
  className
}: SpiceDistributionDisplayProps) {
  if (!distributionText) return null

  // Parser le texte pour extraire les niveaux
  const parts = distributionText.split(", ")

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
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
          <div
            key={index}
            className="flex items-center gap-1 bg-white/50 rounded-md px-2 py-1"
          >
            <span className="text-xs font-semibold text-gray-700">{count}</span>
            <div className="flex gap-0.5">
              {flameCount === 0 ? (
                <div className={cn(
                  "flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br shadow-sm",
                  gradientFrom,
                  gradientTo
                )}>
                  <Leaf className="w-2.5 h-2.5 text-white" />
                </div>
              ) : (
                Array.from({ length: flameCount }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br shadow-sm",
                      gradientFrom,
                      gradientTo
                    )}
                  >
                    <Flame className="w-2.5 h-2.5 text-white" />
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
