"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useData } from "@/contexts/DataContext"
import { usePrismaExtras } from "@/hooks/usePrismaData"
import type { CommandeUI, PlatPanier } from "@/types/app"
import { Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface BoutonCommanderNouveauProps {
  commande: CommandeUI
  className?: string
}

export default function BoutonCommanderNouveau({
  commande,
  className,
}: BoutonCommanderNouveauProps) {
  const router = useRouter()
  const { ajouterPlusieursAuPanier } = useCart()
  const { plats } = useData()
  const { data: extras } = usePrismaExtras()
  const [isLoading, setIsLoading] = useState(false)

  const handleReorder = async () => {
    if (!commande.details || commande.details.length === 0) {
      toast.error("Cette commande est vide.")
      return
    }

    setIsLoading(true)

    try {
      const itemsToAdd: PlatPanier[] = []
      let missingItemsCount = 0

      commande.details.forEach((detail) => {
        // Logique pour les plats
        if (!detail.type || detail.type === "plat") {
          // Trouver le plat à jour dans la base de données locale
          // On utilise plat_r (ID) s'il existe, sinon on essaie de matcher via l'objet plat
          const platId = typeof detail.plat_r === "number" ? detail.plat_r : detail.plat?.idplats

          if (!platId) {
            missingItemsCount++
            return
          }

          const freshPlat = plats?.find((p) => p.idplats === platId)

          if (freshPlat) {
            // Vérifier la disponibilité (optionnel, on pourrait aussi ajouter mais avertir)
            if (freshPlat.est_epuise) {
              // On pourrait skipper ou ajouter avec un flag. Ici on skip pour simplifier.
              toast.warning(`Le plat "${freshPlat.plat}" n'est plus disponible.`)
              return
            }

            itemsToAdd.push({
              id: freshPlat.idplats.toString(),
              nom: freshPlat.plat,
              prix: freshPlat.prix?.toString() || "0",
              quantite: detail.quantite_plat_commande || 1,
              jourCommande: "Aujourd'hui", // Par défaut ou à définir plus tard dans le panier
              // On garde les préférences épicées
              demandeSpeciale: detail.preference_epice_niveau
                ? `Niveau épicé: ${detail.preference_epice_niveau}`
                : undefined,
              spiceDistribution: detail.spice_distribution || undefined,
              type: "plat",
            })
          } else {
            missingItemsCount++
          }
        }
        // Logique pour les extras
        else if (detail.type === "extra") {
          const extraId = detail.extra_id || detail.extra?.idextra

          if (!extraId) {
            missingItemsCount++
            return
          }

          const freshExtra = extras?.find((e) => e.idextra === extraId)

          if (freshExtra) {
            itemsToAdd.push({
              id: freshExtra.idextra.toString(),
              nom: freshExtra.nom_extra,
              prix: freshExtra.prix?.toString() || "0",
              quantite: detail.quantite_plat_commande || 1,
              jourCommande: "Aujourd'hui",
              type: "extra",
            })
          } else {
            missingItemsCount++
          }
        }
      })

      if (itemsToAdd.length > 0) {
        ajouterPlusieursAuPanier(itemsToAdd)

        let message = `${itemsToAdd.length} articles ajoutés au panier.`
        if (missingItemsCount > 0) {
          message += ` (${missingItemsCount} articles non trouvés ou indisponibles)`
        }

        toast.success(message)
        router.push("/commander")
      } else {
        toast.error("Aucun article disponible pour la recomande.")
      }
    } catch (error) {
      console.error("Erreur lors de la recomande:", error)
      toast.error("Une erreur est survenue lors de la tentative de commande.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={handleReorder}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="mr-2 h-4 w-4" />
      )}
      Commander à nouveau
    </Button>
  )
}
