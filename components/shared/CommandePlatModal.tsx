"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Minus, ShoppingCart } from "lucide-react"
import type { PlatUI as Plat } from "@/types/app"

import { Spice } from "@/components/shared/Spice"
import { getDistributionText } from "@/lib/spice-helpers"

export interface CommandePlatModalProps {
  plat: Plat
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formatPrix: (prix: number) => string
  onAddToCart?: (
    plat: Plat,
    quantity: number,
    spicePreference?: string,
    spiceDistribution?: number[],
    uniqueId?: string
  ) => void
  currentQuantity?: number
  currentSpiceDistribution?: number[]
  dateRetrait?: Date
  uniqueId?: string
}

export const CommandePlatContent = React.memo<
  Omit<CommandePlatModalProps, "isOpen"> & { standalone?: boolean }
>(
  ({
    plat,
    onOpenChange,
    formatPrix,
    onAddToCart,
    currentQuantity = 0,
    currentSpiceDistribution,
    dateRetrait,
    uniqueId,
    standalone = false,
  }) => {
    const [quantity, setQuantity] = React.useState(1)
    // Par défaut, toutes les portions sont "Non épicé"
    const [spiceDistribution, setSpiceDistribution] = React.useState<number[]>([1, 0, 0, 0])
    const prixUnitaire = parseFloat(plat.prix || "0")
    const sousTotal = prixUnitaire * quantity

    // Niveau d'épice maximum du plat (0 = pas épicé, 1-3 = niveaux d'épice)
    const maxSpiceLevel = plat.niveau_epice || 0

    // Initialisation des données
    React.useEffect(() => {
      if (currentQuantity > 0) {
        // Item du panier : charger la quantité
        setQuantity(currentQuantity)

        // Charger la distribution épicée si elle existe
        if (currentSpiceDistribution && currentSpiceDistribution.length === 4) {
          const distTotal = currentSpiceDistribution.reduce((sum, count) => sum + count, 0)
          if (distTotal === currentQuantity) {
            setSpiceDistribution(currentSpiceDistribution)
          } else {
            // Désynchronisation : toutes portions non épicées
            setSpiceDistribution([currentQuantity, 0, 0, 0])
          }
        } else {
          // Pas de distribution (plat non épicé) : toutes portions non épicées
          setSpiceDistribution([currentQuantity, 0, 0, 0])
        }
      } else {
        // Nouveau plat : reset à 1
        setQuantity(1)
        setSpiceDistribution([1, 0, 0, 0])
      }
    }, [currentQuantity, currentSpiceDistribution])

    const handleAddToCart = () => {
      if (onAddToCart) {
        // Ne passer la distribution épicée que si le plat a l'option épicée activée
        const spicePreference =
          maxSpiceLevel > 0 ? getDistributionText(spiceDistribution) : undefined
        const distribution = maxSpiceLevel > 0 ? spiceDistribution : undefined
        onAddToCart(plat, quantity, spicePreference, distribution, uniqueId)
        onOpenChange(false)
      }
    }

    const incrementQuantity = () => {
      setQuantity((prev) => {
        const newQuantity = prev + 1
        setSpiceDistribution([newQuantity, 0, 0, 0])
        return newQuantity
      })
    }

    const decrementQuantity = () => {
      setQuantity((prev) => {
        const newQuantity = Math.max(1, prev - 1)
        setSpiceDistribution([newQuantity, 0, 0, 0])
        return newQuantity
      })
    }

    return (
      <>
        <div className="relative flex-1 overflow-y-auto">
          {/* Header avec photo */}
          <div className="from-thai-orange/10 to-thai-gold/10 relative h-48 flex-shrink-0 bg-gradient-to-br md:h-56">
            {plat.photo_du_plat ? (
              <img
                src={plat.photo_du_plat}
                alt={plat.plat}
                className="h-full w-full object-cover transition-transform duration-300"
              />
            ) : (
              <div className="from-thai-cream to-thai-orange/20 flex h-full w-full items-center justify-center bg-gradient-to-br">
                <div className="text-thai-orange/50 text-8xl">🍽️</div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Badge disponible */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-thai-green px-3 py-1 font-semibold text-white shadow-md">
                Disponible
              </Badge>
            </div>

            {/* Badge quantité actuelle dans le panier */}
            {currentQuantity > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-thai-orange px-3 py-1 font-semibold text-white shadow-md">
                  Panier {currentQuantity}
                </Badge>
              </div>
            )}
          </div>

          {/* Contenu scrollable */}
          <div className="space-y-3 p-4">
            <DialogHeader>
              {standalone ? (
                <>
                  <h2 className="text-thai-green text-lg font-bold">{plat.plat}</h2>
                  <p className="sr-only">
                    Ajouter {plat.plat} au panier - Prix: {formatPrix(prixUnitaire)}
                  </p>
                </>
              ) : (
                <>
                  <DialogTitle className="text-thai-green text-lg font-bold">
                    {plat.plat}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Ajouter {plat.plat} au panier - Prix: {formatPrix(prixUnitaire)}
                  </DialogDescription>
                </>
              )}
            </DialogHeader>

            {/* Description */}
            {plat.description && (
              <div className="animate-fadeIn space-y-1.5">
                <h4 className="text-thai-orange flex items-center gap-1.5 text-xs font-semibold">
                  <FileText className="h-3.5 w-3.5" />
                  Description
                </h4>
                <p className="bg-thai-cream/30 border-thai-orange/20 rounded-lg border p-2.5 text-xs leading-relaxed text-gray-700">
                  {plat.description}
                </p>
              </div>
            )}

            {/* Prix */}
            {prixUnitaire > 0 && (
              <div className="from-thai-cream/40 to-thai-orange/10 border-thai-orange/20 rounded-lg border bg-gradient-to-r p-3">
                <div className="text-center">
                  <div className="mb-0.5 text-xs font-medium text-gray-600">PRIX UNITAIRE</div>
                  <div className="text-thai-orange text-xl font-bold">
                    {formatPrix(prixUnitaire)}
                  </div>
                </div>
              </div>
            )}

            {/* Sélecteur de quantité et actions */}
            {onAddToCart && (
              <div className="space-y-3">
                {/* Sélecteur de quantité */}
                <div className="border-thai-orange/20 rounded-lg border-2 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-thai-green text-sm font-medium">Quantité :</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="border-thai-orange/30 hover:border-thai-orange hover:bg-thai-orange h-7 w-7 p-0 transition-all duration-200 hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-thai-orange w-10 text-center text-base font-bold">
                        {quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={incrementQuantity}
                        className="border-thai-orange/30 hover:border-thai-orange hover:bg-thai-orange h-7 w-7 p-0 transition-all duration-200 hover:text-white"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Sous-total */}
                  {quantity > 1 && (
                    <div className="border-thai-orange/20 mt-2 flex items-center justify-between border-t pt-2">
                      <span className="text-thai-green text-sm font-medium">Sous-total :</span>
                      <span className="text-thai-orange text-lg font-bold">
                        {formatPrix(sousTotal)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sélecteur de répartition épicée (uniquement si le plat est épicé) */}
                {maxSpiceLevel > 0 && (
                  <div className="border-thai-orange/20 animate-fadeIn rounded-lg border-2 bg-white p-3 shadow-sm">
                    <Spice
                      distribution={spiceDistribution}
                      onDistributionChange={setSpiceDistribution}
                      readOnly={false}
                      showBackground={true}
                      hideZeros={false}
                    />
                  </div>
                )}

                {/* Informations sur la date de retrait */}
                {dateRetrait && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-center">
                    <p className="text-xs font-medium text-blue-800">
                      📅 Sera ajouté pour le retrait du {dateRetrait.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'ajout au panier - sticky en bas */}
        {onAddToCart && (
          <div className="sticky bottom-0 flex-shrink-0 border-t border-gray-200 bg-white p-4 shadow-lg">
            <Button
              onClick={handleAddToCart}
              className="bg-thai-orange hover:bg-thai-orange/90 w-full py-5 text-base text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Ajouter au panier ({formatPrix(sousTotal)})
            </Button>
          </div>
        )}
      </>
    )
  }
)

CommandePlatContent.displayName = "CommandePlatContent"

export const CommandePlatModal = React.memo<CommandePlatModalProps>((props) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent
        className="animate-scaleIn mx-auto flex max-h-[90vh] max-w-lg transform flex-col overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl transition-all duration-300 [&>button]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CommandePlatContent {...props} />
      </DialogContent>
    </Dialog>
  )
})

CommandePlatModal.displayName = "CommandePlatModal"
