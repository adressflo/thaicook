import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { DetailCommande, Extra, Plat } from "@/types/app"
import { Calculator, Euro, FileText, Hash, ShoppingCart } from "lucide-react"
import React from "react"

interface DishDetailsModalComplexProps {
  detail: DetailCommande & { plat: Plat | null; extra: Extra | null }
  children: React.ReactNode
  formatPrix: (prix: number) => string
}

export const DishDetailsModalComplex = React.memo<DishDetailsModalComplexProps>(
  ({ detail, children, formatPrix }) => {
    const [open, setOpen] = React.useState(false)

    // Détection si c'est un extra
    const isExtra =
      detail.type === "extra" ||
      (!detail.plat && (detail.plat_r === 0 || detail.extra || detail.nom_plat))

    // Nom de l'item
    const platName = isExtra
      ? detail.nom_plat || detail.extra?.nom_extra || "Extra"
      : detail.plat?.plat || "Plat supprimé"

    const quantite = detail.quantite_plat_commande || 0

    // Prix unitaire selon le type
    const prixUnitaire = isExtra
      ? Number(detail.prix_unitaire) || Number(detail.extra?.prix) || 0
      : Number(detail.plat?.prix) || 0

    const sousTotal = prixUnitaire * quantite

    // Un item est considéré comme supprimé s'il n'y a ni plat ni extra
    const isDeleted = !isExtra && !detail.plat?.plat

    const handleModalClick = () => {
      setOpen(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="animate-scaleIn hover:shadow-3xl group mx-auto max-w-lg transform cursor-pointer overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl transition-all duration-500 [&>button]:hidden"
          onClick={handleModalClick}
        >
          <div className="relative">
            {/* Header avec photo */}
            <div className="from-thai-orange/10 to-thai-gold/10 relative h-64 bg-linear-to-br md:h-72">
              {detail.plat?.photo_du_plat || detail.extra?.photo_url || isExtra ? (
                <img
                  src={
                    isExtra
                      ? detail.extra?.photo_url ||
                        "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
                      : detail.plat?.photo_du_plat || ""
                  }
                  alt={platName}
                  className="h-full w-full object-contain filter transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 group-hover:brightness-110"
                  title="Cliquer pour fermer"
                  onError={(e) => {
                    // Fallback pour les extras si l'image ne charge pas
                    if (isExtra) {
                      e.currentTarget.src =
                        "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
                    }
                  }}
                />
              ) : (
                <div className="from-thai-cream to-thai-orange/20 flex h-full w-full items-center justify-center bg-linear-to-br">
                  <div className="text-thai-orange/50 text-8xl">{isDeleted ? "❌" : "🍽️"}</div>
                </div>
              )}

              {/* Overlay gradient plus subtil */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

              {/* Effet brillance Thai pour les extras */}
              {isExtra && (
                <div className="from-thai-gold/30 to-thai-orange/20 absolute inset-0 bg-linear-to-tr via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              )}
            </div>

            {/* Contenu */}
            <div className="space-y-4 p-6">
              <DialogHeader>
                <DialogTitle className="text-thai-green text-xl font-bold">{platName}</DialogTitle>
                <DialogDescription className="sr-only">
                  Détails de {platName} - Quantité: {quantite}, Sous-total: {formatPrix(sousTotal)}
                </DialogDescription>
              </DialogHeader>

              {/* Description */}
              {(detail.plat?.description || detail.extra?.description) && !isDeleted && (
                <div className="animate-fadeIn space-y-2">
                  <h4 className="text-thai-orange flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4" />
                    Description
                  </h4>
                  <p className="bg-thai-cream/30 border-thai-orange/20 hover:bg-thai-cream/50 rounded-lg border p-3 text-sm leading-relaxed text-gray-700 transition-colors duration-200">
                    {detail.plat?.description || detail.extra?.description}
                  </p>
                </div>
              )}

              {/* Détails de commande */}
              <div className="from-thai-cream/40 to-thai-orange/10 animate-fadeIn border-thai-orange/20 space-y-3 rounded-lg border bg-linear-to-r p-4">
                <h4 className="text-thai-green mb-3 flex items-center gap-2 text-sm font-semibold">
                  <ShoppingCart className="h-4 w-4" />
                  Détails de la commande
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantité */}
                  <div className="group text-center">
                    <div className="border-thai-orange/20 hover:border-thai-orange/60 group/card relative overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="text-thai-orange mb-1 text-2xl font-bold transition-transform duration-300 group-hover:scale-110">
                        {quantite}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs font-medium text-gray-600">
                        <Hash className="h-3 w-3" />
                        Quantité
                      </div>
                    </div>
                  </div>

                  {/* Prix unitaire */}
                  <div className="group text-center">
                    <div className="border-thai-orange/20 hover:border-thai-orange/60 group/card relative overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="text-thai-green mb-1 text-lg font-bold transition-transform duration-300 group-hover:scale-110">
                        {formatPrix(prixUnitaire)}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs font-medium text-gray-600">
                        <Euro className="h-3 w-3" />
                        Prix unitaire
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sous-total */}
                <div className="border-thai-orange hover:border-thai-orange group relative overflow-hidden rounded-lg border-2 bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600">
                      <Calculator className="h-3 w-3" />
                      <span>SOUS-TOTAL</span>
                    </div>
                    <div className="text-thai-orange text-2xl font-bold transition-transform duration-200 group-hover:scale-110">
                      {formatPrix(sousTotal)}
                    </div>
                    {quantite > 1 && (
                      <div className="bg-thai-cream/50 mt-1 rounded-full px-2 py-1 text-xs text-gray-500">
                        {quantite} × {formatPrix(prixUnitaire)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Message pour plats/extras supprimés */}
              {isDeleted && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-sm font-medium text-red-700">
                    ⚠️ Cet {isExtra ? "extra" : "article"} n'est plus disponible
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
)

DishDetailsModalComplex.displayName = "DishDetailsModalComplex"
