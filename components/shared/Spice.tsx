"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { toastVideo } from "@/hooks/use-toast-video"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Flame, Leaf } from "lucide-react"

interface SpiceProps {
  distribution: number[] | string // [nonSpicy, littleSpicy, spicy, verySpicy] OU texte
  onDistributionChange?: (distribution: number[]) => void
  readOnly?: boolean
  showBackground?: boolean
  hideZeros?: boolean
  className?: string
}

const SPICE_LEVELS = [
  {
    index: 0,
    label: "Non épicé",
    flameCount: 0,
    gradientFrom: "from-green-400",
    gradientTo: "to-green-600",
    color: "#22c55e",
  },
  {
    index: 1,
    label: "Un peu épicé",
    flameCount: 1,
    gradientFrom: "from-yellow-400",
    gradientTo: "to-orange-500",
    color: "#f59e0b",
  },
  {
    index: 2,
    label: "Épicé",
    flameCount: 2,
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    color: "#f97316",
  },
  {
    index: 3,
    label: "Très épicé",
    flameCount: 3,
    gradientFrom: "from-red-500",
    gradientTo: "to-red-700",
    color: "#dc2626",
  },
]

export function Spice({
  distribution,
  onDistributionChange,
  readOnly = false,
  showBackground = false,
  hideZeros = false,
  className,
}: SpiceProps) {
  // Parser la distribution (tableau ou texte)
  const parsedDistribution =
    typeof distribution === "string" ? parseDistributionText(distribution) : distribution

  const handleCardClick = (index: number) => {
    if (readOnly || !onDistributionChange) return

    const newDistribution = [...parsedDistribution]
    const priorities = [0, 1, 2, 3].filter((i) => i !== index)

    for (const sourceIndex of priorities) {
      if (newDistribution[sourceIndex] > 0) {
        newDistribution[sourceIndex] -= 1
        newDistribution[index] += 1
        break
      }
    }

    // Afficher le toast "Attention, ça pique !" quand on sélectionne le niveau 3 (Piment Thaï)
    const wasLevel3Selected = parsedDistribution[3] > 0
    const isLevel3NowSelected = newDistribution[3] > 0

    if (!wasLevel3Selected && isLevel3NowSelected) {
      toastVideo({
        title: (
          <div className="flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap">
            <TypingAnimation duration={10} className="inline-flex items-center">
              <span>
                Attention, ça&nbsp;<span className="text-thai-orange">pique</span> !
              </span>
            </TypingAnimation>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-700 shadow-md">
              <div className="flex flex-col items-center gap-0">
                <Flame className="h-3 w-3 text-white" />
                <div className="-mt-0.5 flex gap-0">
                  <Flame className="h-3 w-3 text-white" />
                  <Flame className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        ),
        description: (
          <TypingAnimation duration={10} className="font-semibold">
            Vous avez choisi le niveau <span className="text-thai-orange">Piment Thaï</span>.
            C&apos;est vraiment très <span className="text-thai-orange">fort</span> !
          </TypingAnimation>
        ),
        media: "/media/avatars/panier1.svg",
        position: "center",
        aspectRatio: "1:1",
        polaroid: true,
        borderColor: "thai-green",
        maxWidth: "sm",
        animateBorder: true,
        hoverScale: true,
        rotation: true,
        customDuration: 1000,
        mangaExplosion: true,
      })
    }

    onDistributionChange(newDistribution)
  }

  const getBackgroundStyle = () => {
    if (!showBackground) return {}

    const total = parsedDistribution.reduce((sum, count) => sum + count, 0)
    if (total === 0) {
      return { background: "linear-gradient(to right, #22c55e, #16a34a)" }
    }

    const activeColors = SPICE_LEVELS.map((level, i) => ({
      color: level.color,
      count: parsedDistribution[i],
    })).filter((c) => c.count > 0)

    if (activeColors.length === 1) {
      return { background: activeColors[0].color }
    }

    const gradientStops: string[] = []
    let currentPercent = 0

    activeColors.forEach((colorData) => {
      const percentage = (colorData.count / total) * 100
      const midPoint = currentPercent + percentage / 2
      gradientStops.push(`${colorData.color} ${midPoint}%`)
      currentPercent += percentage
    })

    return { background: `linear-gradient(to right, ${gradientStops.join(", ")})` }
  }

  const levelsToDisplay = hideZeros
    ? SPICE_LEVELS.filter((_, i) => parsedDistribution[i] > 0)
    : SPICE_LEVELS

  const containerClasses = showBackground
    ? cn("rounded-xl p-4", className)
    : cn("flex items-center gap-1", className)

  const Wrapper = TooltipProvider

  return (
    <Wrapper>
      <div className={containerClasses} style={getBackgroundStyle()}>
        <div className={showBackground ? "flex items-center justify-center gap-4" : "contents"}>
          {levelsToDisplay.map((spiceLevel) => {
            const count = parsedDistribution[spiceLevel.index]
            const hasCount = count > 0

            const circleContent = (
              <div className="relative">
                {hasCount && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-thai-green absolute -top-1.5 -right-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md"
                  >
                    {count}
                  </motion.div>
                )}

                <div className="flex items-center justify-center">
                  {spiceLevel.flameCount === 0 ? (
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br shadow-md transition-all",
                        showBackground ? "h-14 w-14" : "",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo,
                        !readOnly && "cursor-pointer"
                      )}
                    >
                      <Leaf className={cn("text-white", showBackground ? "h-8 w-8" : "h-5 w-5")} />
                    </div>
                  ) : spiceLevel.flameCount === 1 ? (
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br shadow-md transition-all",
                        showBackground ? "h-14 w-14" : "",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo,
                        !readOnly && "cursor-pointer"
                      )}
                    >
                      <Flame className={cn("text-white", showBackground ? "h-8 w-8" : "h-5 w-5")} />
                    </div>
                  ) : spiceLevel.flameCount === 3 ? (
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br shadow-md transition-all",
                        showBackground ? "h-14 w-14" : "",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo,
                        !readOnly && "cursor-pointer"
                      )}
                    >
                      <div className="flex flex-col items-center gap-0">
                        <Flame
                          className={cn("text-white", showBackground ? "h-4 w-4" : "h-3 w-3")}
                        />
                        <div className="-mt-0.5 flex gap-0">
                          <Flame
                            className={cn("text-white", showBackground ? "h-4 w-4" : "h-3 w-3")}
                          />
                          <Flame
                            className={cn("text-white", showBackground ? "h-4 w-4" : "h-3 w-3")}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br shadow-md transition-all",
                        showBackground ? "h-14 w-14" : "",
                        spiceLevel.gradientFrom,
                        spiceLevel.gradientTo,
                        !readOnly && "cursor-pointer"
                      )}
                    >
                      <div className="flex gap-0">
                        <Flame
                          className={cn("text-white", showBackground ? "h-5 w-5" : "h-3.5 w-3.5")}
                        />
                        <Flame
                          className={cn("text-white", showBackground ? "h-5 w-5" : "h-3.5 w-3.5")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )

            return (
              <Tooltip key={spiceLevel.index}>
                <TooltipTrigger asChild>
                  <motion.div
                    onClick={() => handleCardClick(spiceLevel.index)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={!readOnly ? { scale: 0.9 } : undefined}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(!readOnly ? "cursor-pointer" : "cursor-default")}
                  >
                    {circleContent}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="z-50 border border-gray-200 bg-white shadow-lg"
                >
                  <span className="text-xs font-medium">{spiceLevel.label}</span>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </Wrapper>
  )
}

function parseDistributionText(text: string): number[] {
  const distribution = [0, 0, 0, 0]
  const parts = text.split(", ")

  parts.forEach((part) => {
    const match = part.match(/^(\d+)\s+(.+?)(?:\s+[🔥🍃]+)?$/)
    if (!match) return

    const count = parseInt(match[1])
    const levelText = match[2].trim()

    if (levelText.includes("très épicé")) {
      distribution[3] = count
    } else if (levelText === "épicé") {
      distribution[2] = count
    } else if (levelText.includes("un peu épicé")) {
      distribution[1] = count
    } else if (levelText.includes("non épicé")) {
      distribution[0] = count
    }
  })

  return distribution
}
