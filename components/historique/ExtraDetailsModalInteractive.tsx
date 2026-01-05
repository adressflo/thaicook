import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Minus, Plus, ShoppingCart, Sparkles } from "lucide-react"
import React from "react"

interface ExtraData {
  idextra: number
  nom_extra: string
  prix: string
  description?: string | null
  photo_url?: string | null
  est_disponible: boolean
}

interface ExtraDetailsModalInteractiveProps {
  extra: ExtraData
  children: React.ReactNode
  formatPrix: (prix: number) => string
  onAddToCart?: (extra: ExtraData, quantity: number) => void
  currentQuantity?: number
  dateRetrait?: Date
}

export const ExtraDetailsModalInteractive = React.memo<ExtraDetailsModalInteractiveProps>(
  ({ extra, children, formatPrix, onAddToCart, currentQuantity = 0, dateRetrait }) => {
    const [open, setOpen] = React.useState(false)
    const [quantity, setQuantity] = React.useState(1)
    const prixUnitaire = parseFloat(extra.prix || "0")
    const sousTotal = prixUnitaire * quantity

    // Quand le modal s'ouvre, charger la quantité du panier existant
    React.useEffect(() => {
      if (open && currentQuantity > 0) {
        setQuantity(currentQuantity)
      } else if (open && currentQuantity === 0) {
        setQuantity(1)
      }
    }, [open, currentQuantity])

    const handleModalClick = () => {
      setOpen(false)
    }

    const handleAddToCart = () => {
      if (onAddToCart) {
        onAddToCart(extra, quantity)
        setOpen(false)
      }
    }

    const incrementQuantity = () => {
      setQuantity((prev) => prev + 1)
    }

    const decrementQuantity = () => {
      setQuantity((prev) => Math.max(1, prev - 1))
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="animate-scaleIn mx-auto max-w-lg transform overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl transition-all duration-300 [&>button]:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {/* Header avec photo */}
            <div className="from-thai-gold/20 to-thai-orange/20 relative h-64 bg-linear-to-br md:h-72">
              {extra.photo_url ? (
                <img
                  src={extra.photo_url}
                  alt={extra.nom_extra}
                  className="h-full w-full object-cover transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
                  }}
                />
              ) : (
                <div className="from-thai-gold/20 to-thai-orange/20 flex h-full w-full items-center justify-center bg-linear-to-br">
                  <div className="text-thai-gold/50 text-8xl">
                    <Sparkles className="h-20 w-20" />
                  </div>
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

              {/* Badge extra */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-thai-gold flex items-center gap-1 px-3 py-1 font-semibold text-white shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Extra
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

            {/* Contenu */}
            <div className="space-y-4 p-6">
              <DialogHeader>
                <DialogTitle className="text-thai-green flex items-center gap-2 text-xl font-bold">
                  <Sparkles className="text-thai-gold h-5 w-5" />
                  {extra.nom_extra}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Ajouter l'extra {extra.nom_extra} au panier - Prix: {formatPrix(prixUnitaire)}
                </DialogDescription>
              </DialogHeader>

              {/* Description */}
              {extra.description && (
                <div className="animate-fadeIn space-y-2">
                  <h4 className="text-thai-orange flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4" />
                    Description
                  </h4>
                  <p className="bg-thai-cream/30 border-thai-orange/20 rounded-lg border p-3 text-sm leading-relaxed text-gray-700">
                    {extra.description}
                  </p>
                </div>
              )}

              {/* Prix */}
              {prixUnitaire > 0 && (
                <div className="from-thai-gold/20 to-thai-orange/10 border-thai-gold/30 rounded-lg border bg-linear-to-r p-4">
                  <div className="text-center">
                    <div className="mb-1 text-xs font-medium text-gray-600">PRIX UNITAIRE</div>
                    <div className="text-thai-gold text-2xl font-bold">
                      {formatPrix(parseFloat(extra.prix || "0"))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sélecteur de quantité et actions */}
              {onAddToCart && (
                <div className="space-y-4">
                  {/* Sélecteur de quantité */}
                  <div className="border-thai-gold/20 rounded-lg border-2 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-thai-green font-medium">Quantité :</span>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="border-thai-gold/30 hover:border-thai-gold hover:bg-thai-gold h-8 w-8 p-0 transition-all duration-200 hover:text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-thai-gold w-12 text-center text-lg font-bold">
                          {quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={incrementQuantity}
                          className="border-thai-gold/30 hover:border-thai-gold hover:bg-thai-gold h-8 w-8 p-0 transition-all duration-200 hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Sous-total */}
                    {quantity > 1 && (
                      <div className="border-thai-gold/20 mt-3 flex items-center justify-between border-t pt-3">
                        <span className="text-thai-green font-medium">Sous-total :</span>
                        <span className="text-thai-gold text-xl font-bold">
                          {formatPrix(sousTotal)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Informations sur la date de retrait */}
                  {dateRetrait && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                      <p className="text-sm font-medium text-blue-800">
                        📅 Sera ajouté pour le retrait du {dateRetrait.toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}

                  {/* Bouton d'ajout au panier */}
                  <Button
                    onClick={handleAddToCart}
                    className="bg-thai-gold hover:bg-thai-gold/90 w-full py-6 text-lg text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au panier ({formatPrix(sousTotal)})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
)

ExtraDetailsModalInteractive.displayName = "ExtraDetailsModalInteractive"
