"use client"

import { Label } from "@/components/ui/label"
import { Flame, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
    const currentTotal = newDistribution.reduce((sum, count) => sum + count, 0)

    if (currentTotal < totalQuantity) {
      // Il reste de la place, on ajoute simplement
      newDistribution[index] += 1
    } else {
      // Transfert automatique depuis un autre niveau (priorité: Non épicé d'abord)
      const priorities = [0, 1, 2, 3].filter(i => i !== index)
      for (const sourceIndex of priorities) {
        if (newDistribution[sourceIndex] > 0) {
          newDistribution[sourceIndex] -= 1
          newDistribution[index] += 1
          break
        }
      }
    }

    onDistributionChange(newDistribution)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-thai-orange to-red-500 shadow-md">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <Label className="text-sm font-bold text-thai-green">
          Répartition épicée
        </Label>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        {SPICE_LEVELS.map((spiceLevel) => {
          const count = distribution[spiceLevel.index]
          const hasCount = count > 0

          return (
            <motion.div
              key={spiceLevel.index}
              onClick={() => handleCardClick(spiceLevel.index)}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-xl border-2 cursor-pointer",
                "bg-white shadow-md",
                "h-16",
                spiceLevel.borderColor,
                hasCount && "ring-2 ring-thai-gold/50 shadow-lg"
              )}
            >
              {/* Badge numérique en haut à droite */}
              {hasCount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-thai-gold text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md z-10"
                >
                  {count}
                </motion.div>
              )}

              {/* Icône */}
              <div className="mb-1 flex items-center justify-center gap-0.5">
                {spiceLevel.flameCount === 0 ? (
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br shadow-sm",
                    spiceLevel.gradientFrom,
                    spiceLevel.gradientTo
                  )}>
                    <Leaf className="w-3.5 h-3.5 text-white" />
                  </div>
                ) : (
                  Array.from({ length: spiceLevel.flameCount }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br shadow-sm",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo
                      )}
                    >
                      <Flame className="w-3 h-3 text-white" />
                    </div>
                  ))
                )}
              </div>

              {/* Label */}
              <span className="text-[9px] font-bold text-center leading-tight">
                {spiceLevel.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Fonction helper pour générer le texte à afficher dans le panier
 * Exemple: "1 très épicé 🔥🔥🔥, 1 épicé 🔥🔥"
 */
export function getDistributionText(distribution: number[]): string {
  const parts: string[] = []

  if (distribution[3] > 0) {
    parts.push(`${distribution[3]} très épicé 🔥🔥🔥`)
  }
  if (distribution[2] > 0) {
    parts.push(`${distribution[2]} épicé 🔥🔥`)
  }
  if (distribution[1] > 0) {
    parts.push(`${distribution[1]} un peu épicé 🔥`)
  }
  if (distribution[0] > 0) {
    parts.push(`${distribution[0]} non épicé 🍃`)
  }

  return parts.length > 0 ? parts.join(", ") : ""
}
