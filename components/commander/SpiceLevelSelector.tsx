"use client"

import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Flame, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpiceLevelSelectorProps {
  maxLevel: number // Niveau max du plat (0-3)
  selectedLevel: number
  onLevelChange: (level: number) => void
  className?: string
}

const SPICE_LEVELS = [
  {
    level: 0,
    label: "Non épicé",
    flameCount: 0,
    gradientFrom: "from-green-400",
    gradientTo: "to-green-600",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    hoverBg: "hover:bg-green-100",
    selectedBg: "data-[state=on]:bg-green-500 data-[state=on]:text-white",
    description: "Sans piment"
  },
  {
    level: 1,
    label: "Un peu épicé",
    flameCount: 1,
    gradientFrom: "from-yellow-400",
    gradientTo: "to-orange-500",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    hoverBg: "hover:bg-yellow-100",
    selectedBg: "data-[state=on]:bg-yellow-500 data-[state=on]:text-white",
    description: "Un peu relevé"
  },
  {
    level: 2,
    label: "Épicé",
    flameCount: 2,
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    hoverBg: "hover:bg-orange-100",
    selectedBg: "data-[state=on]:bg-orange-500 data-[state=on]:text-white",
    description: "Bien épicé"
  },
  {
    level: 3,
    label: "Très épicé",
    flameCount: 3,
    gradientFrom: "from-red-500",
    gradientTo: "to-red-700",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    hoverBg: "hover:bg-red-100",
    selectedBg: "data-[state=on]:bg-red-600 data-[state=on]:text-white",
    description: "Pour les amateurs !"
  }
]

export function SpiceLevelSelector({
  maxLevel,
  selectedLevel,
  onLevelChange,
  className
}: SpiceLevelSelectorProps) {
  // Afficher TOUS les niveaux (0-3) - le client peut choisir n'importe quel niveau
  const availableLevels = SPICE_LEVELS

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-thai-orange to-red-500 shadow-md">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <Label className="text-sm font-bold text-thai-green">
          Niveau d'épice souhaité
        </Label>
      </div>

      <ToggleGroup
        type="single"
        value={selectedLevel.toString()}
        onValueChange={(value) => {
          if (value) {
            onLevelChange(parseInt(value))
          }
        }}
        className="grid grid-cols-4 gap-1.5 w-full"
      >
        {availableLevels.map((spiceLevel) => {
          const isSelected = selectedLevel === spiceLevel.level
          return (
            <ToggleGroupItem
              key={spiceLevel.level}
              value={spiceLevel.level.toString()}
              aria-label={spiceLevel.label}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 h-auto min-h-[70px] rounded-lg border-2 transition-all duration-200",
                "hover:scale-105 hover:shadow-md focus:outline-none",
                "bg-white",
                spiceLevel.borderColor,
                "hover:border-thai-gold",
                isSelected && [
                  "scale-105 shadow-md",
                  spiceLevel.selectedBg,
                  "border-thai-gold"
                ]
              )}
            >
              {/* Badge compact */}
              {isSelected && (
                <div className="absolute -top-0.5 -right-0.5 bg-thai-gold text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                  ✓
                </div>
              )}

              {/* Icônes */}
              <div className="flex gap-0.5 mb-1">
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
              <span className={cn(
                "text-[10px] font-bold text-center leading-tight",
                isSelected && "text-white"
              )}>
                {spiceLevel.label}
              </span>
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </div>
  )
}

/**
 * Fonction helper pour générer le texte à ajouter dans demande_special
 */
export function getSpiceLevelText(level: number): string {
  const spiceLevel = SPICE_LEVELS.find(s => s.level === level)
  if (!spiceLevel || level === 0) return ""

  const flameText = "🔥".repeat(spiceLevel.flameCount)
  return `Niveau épicé : ${spiceLevel.label} ${flameText}`
}
