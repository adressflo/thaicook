"use client"

import { Flame, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SpiceDistributionSelectorProps {
  totalQuantity: number
  distribution: number[] // [nonSpicy, littleSpicy, spicy, verySpicy]
  onDistributionChange: (distribution: number[]) => void
  className?: string
}

const SPICE_LEVELS = [
  {
    index: 0,
    label: "Non épicé",
    flameCount: 0,
    gradientFrom: "from-green-400",
    gradientTo: "to-green-600",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    hoverBg: "hover:bg-green-100",
    selectedBg: "bg-green-500",
    buttonBg: "bg-green-500 hover:bg-green-600",
  },
  {
    index: 1,
    label: "Un peu épicé",
    flameCount: 1,
    gradientFrom: "from-yellow-400",
    gradientTo: "to-orange-500",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    hoverBg: "hover:bg-yellow-100",
    selectedBg: "bg-yellow-500",
    buttonBg: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    index: 2,
    label: "Épicé",
    flameCount: 2,
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    hoverBg: "hover:bg-orange-100",
    selectedBg: "bg-orange-500",
    buttonBg: "bg-orange-500 hover:bg-orange-600",
  },
  {
    index: 3,
    label: "Très épicé",
    flameCount: 3,
    gradientFrom: "from-red-500",
    gradientTo: "to-red-700",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    hoverBg: "hover:bg-red-100",
    selectedBg: "bg-red-600",
    buttonBg: "bg-red-600 hover:bg-red-700",
  },
]

export function SpiceDistributionSelector({
  totalQuantity,
  distribution,
  onDistributionChange,
  className,
}: SpiceDistributionSelectorProps) {
  const handleCardClick = (index: number) => {
    const newDistribution = [...distribution]

    // Toujours transférer depuis un autre niveau (priorité: Non épicé d'abord)
    const priorities = [0, 1, 2, 3].filter(i => i !== index)
    for (const sourceIndex of priorities) {
      if (newDistribution[sourceIndex] > 0) {
        newDistribution[sourceIndex] -= 1
        newDistribution[index] += 1
        break
      }
    }

    onDistributionChange(newDistribution)
  }

  // Détermine la couleur de fond selon les niveaux sélectionnés (proportionnel aux quantités avec dégradés)
  const getBackgroundStyle = () => {
    const total = distribution.reduce((sum, count) => sum + count, 0)

    if (total === 0) {
      return { background: "linear-gradient(to right, #22c55e, #16a34a)" } // Default green
    }

    const colors = [
      { color: "#22c55e", count: distribution[0] }, // green-500
      { color: "#f59e0b", count: distribution[1] }, // amber-500
      { color: "#f97316", count: distribution[2] }, // orange-500
      { color: "#dc2626", count: distribution[3] }, // red-600
    ]

    // Filtrer les couleurs avec des quantités > 0
    const activeColors = colors.filter(c => c.count > 0)

    if (activeColors.length === 1) {
      return { background: activeColors[0].color }
    }

    // Créer le gradient proportionnel avec dégradés fluides
    const gradientStops: string[] = []
    let currentPercent = 0

    activeColors.forEach((colorData, index) => {
      const percentage = (colorData.count / total) * 100
      // Position au milieu de la zone de cette couleur
      const midPoint = currentPercent + (percentage / 2)

      gradientStops.push(`${colorData.color} ${midPoint}%`)
      currentPercent += percentage
    })

    return { background: `linear-gradient(to right, ${gradientStops.join(", ")})` }
  }

  // Génère le texte de sélection avec nombres encerclés
  const getSelectionParts = () => {
    const parts: { count: number; label: string }[] = []
    if (distribution[0] > 0) parts.push({ count: distribution[0], label: "Non épicé" })
    if (distribution[1] > 0) parts.push({ count: distribution[1], label: "Un peu épicé" })
    if (distribution[2] > 0) parts.push({ count: distribution[2], label: "Épicé" })
    if (distribution[3] > 0) parts.push({ count: distribution[3], label: "Très épicé" })
    return parts
  }

  return (
    <TooltipProvider>
      <div className={cn("rounded-xl p-4", className)} style={getBackgroundStyle()}>
        <div className="flex items-center justify-center gap-4">
        {SPICE_LEVELS.map((spiceLevel) => {
          const count = distribution[spiceLevel.index]
          const hasCount = count > 0

          return (
            <Tooltip key={spiceLevel.index}>
              <TooltipTrigger asChild>
                <motion.div
                  onClick={() => handleCardClick(spiceLevel.index)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative cursor-pointer"
                >
                  {/* Badge numérique en haut à droite */}
                  {hasCount && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-thai-green text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md z-10"
                    >
                      {count}
                    </motion.div>
                  )}

                  {/* Icône(s) */}
                  <div className="flex items-center justify-center">
                    {spiceLevel.flameCount === 0 ? (
                      <div className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br shadow-md",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo
                      )}>
                        <Leaf className="w-8 h-8 text-white" />
                      </div>
                    ) : spiceLevel.flameCount === 1 ? (
                      <div className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br shadow-md",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo
                      )}>
                        <Flame className="w-8 h-8 text-white" />
                      </div>
                    ) : spiceLevel.flameCount === 3 ? (
                      // Triangle formation for 3 flames in a circle
                      <div className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br shadow-md",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo
                      )}>
                        <div className="flex flex-col items-center gap-0">
                          <Flame className="w-4 h-4 text-white" />
                          <div className="flex gap-0 -mt-1">
                            <Flame className="w-4 h-4 text-white" />
                            <Flame className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 2 flames in a circle
                      <div className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br shadow-md",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo
                      )}>
                        <div className="flex gap-0">
                          <Flame className="w-5 h-5 text-white" />
                          <Flame className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white border border-gray-200 shadow-lg z-50">
                <span className="text-xs font-medium">{spiceLevel.label}</span>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
      </div>
    </TooltipProvider>
  )
}

/**
 * Fonction helper pour générer le texte à afficher dans le panier
 * Exemple: "2 non épicé, 1 un peu épicé, 1 épicé, 1 très épicé"
 * Ordre croissant: non épicé → un peu épicé → épicé → très épicé
 * Note: Plus d'emojis - les icônes Lucide sont utilisées dans SpiceDistributionDisplay
 */
export function getDistributionText(distribution: number[]): string {
  const parts: string[] = []

  // Ordre croissant: du moins épicé au plus épicé
  if (distribution[0] > 0) {
    parts.push(`${distribution[0]} non épicé`)
  }
  if (distribution[1] > 0) {
    parts.push(`${distribution[1]} un peu épicé`)
  }
  if (distribution[2] > 0) {
    parts.push(`${distribution[2]} épicé`)
  }
  if (distribution[3] > 0) {
    parts.push(`${distribution[3]} très épicé`)
  }

  return parts.length > 0 ? parts.join(", ") : ""
}
