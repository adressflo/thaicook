"use client"

import { useState, useEffect } from "react"
import { Spice } from "./Spice"
import { cn } from "@/lib/utils"

interface SmartSpiceProps {
  quantity: number
  distribution: number[]
  onDistributionChange: (distribution: number[]) => void
  className?: string
}

/**
 * SmartSpice - Composant intelligent qui bascule automatiquement entre lecture seule et interactif
 *
 * Comportement :
 * - Par défaut : Affichage en lecture seule (hideZeros) - compact et propre
 * - Quand la quantité change (+ ou -) : Devient interactif pour permettre de modifier la distribution
 *
 * Usage :
 * <SmartSpice
 *   quantity={item.quantite}
 *   distribution={item.spiceDistribution}
 *   onDistributionChange={(newDist) => updateDistribution(newDist)}
 * />
 */
export function SmartSpice({
  quantity,
  distribution,
  onDistributionChange,
  className,
}: SmartSpiceProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [previousQuantity, setPreviousQuantity] = useState(quantity)

  // Détecter le changement de quantité et basculer en mode interactif + ajuster la distribution
  useEffect(() => {
    if (quantity !== previousQuantity) {
      setIsEditing(true)

      // Calculer la somme actuelle de la distribution
      const currentSum = distribution.reduce((a, b) => a + b, 0)
      const diff = quantity - currentSum

      if (diff !== 0) {
        const newDistribution = [...distribution]

        // Trouver l'index majoritaire (le niveau d'épice le plus utilisé)
        // En cas d'égalité, on préfère les niveaux inférieurs (plus sûrs)
        let majorityIndex = 0
        let maxCount = -1

        newDistribution.forEach((count, index) => {
          if (count > maxCount) {
            maxCount = count
            majorityIndex = index
          }
        })

        if (diff > 0) {
          // AJOUT : On ajoute toujours la différence au niveau 0 (Non épicé / Vert)
          // C'est le choix le plus sûr par défaut
          newDistribution[0] += diff
        } else {
          // RETRAIT : On retire intelligemment
          let remainingToRemove = Math.abs(diff)

          // D'abord on tape dans le majoritaire
          if (newDistribution[majorityIndex] >= remainingToRemove) {
            newDistribution[majorityIndex] -= remainingToRemove
            remainingToRemove = 0
          } else {
            // Si pas assez, on vide le majoritaire et on cherche ailleurs
            remainingToRemove -= newDistribution[majorityIndex]
            newDistribution[majorityIndex] = 0

            // On retire du plus élevé au plus faible
            // Simple : on parcourt en inverse (du plus fort au moins fort)
            for (let i = newDistribution.length - 1; i >= 0; i--) {
              if (remainingToRemove <= 0) break

              if (newDistribution[i] > 0) {
                const take = Math.min(newDistribution[i], remainingToRemove)
                newDistribution[i] -= take
                remainingToRemove -= take
              }
            }
          }
        }

        onDistributionChange(newDistribution)
      }

      setPreviousQuantity(quantity)
    }
  }, [quantity, previousQuantity, distribution, onDistributionChange])

  // Gérer le changement de distribution
  const handleDistributionChange = (newDistribution: number[]) => {
    onDistributionChange(newDistribution)
  }

  return (
    <div
      onClick={(e) => {
        if (!isEditing) {
          e.stopPropagation()
          setIsEditing(true)
        }
      }}
      className={cn(!isEditing && "cursor-pointer", className)}
    >
      <Spice
        distribution={distribution}
        onDistributionChange={isEditing ? handleDistributionChange : undefined}
        readOnly={!isEditing}
        showBackground={false}
        hideZeros={!isEditing}
      />
    </div>
  )
}
