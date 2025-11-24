import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CartItemCardProps {
  // Données du produit
  name: string
  imageUrl?: string
  unitPrice: number
  quantity: number

  // Badges
  isVegetarian?: boolean
  isSpicy?: boolean

  // Callbacks
  onQuantityChange: (newQuantity: number) => void
  onRemove: () => void
  onClick?: () => void

  // Options
  showSpiceSelector?: boolean
  spiceSelectorSlot?: React.ReactNode
  readOnly?: boolean
  className?: string
}

export function CartItemCard({
  name,
  imageUrl,
  unitPrice,
  quantity,
  isVegetarian,
  isSpicy,
  onQuantityChange,
  onRemove,
  onClick,
  showSpiceSelector = false,
  spiceSelectorSlot,
  readOnly = false,
  className,
}: CartItemCardProps) {
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`
    } else {
      return `${prix.toFixed(2).replace(".", ",")}€`
    }
  }

  const totalPrice = unitPrice * quantity

  return (
    <div
      className={cn(
        "hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 transform rounded-lg border border-gray-200 bg-white p-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2 sm:p-4",
        className
      )}
    >
      {/* Layout principal : Col sur mobile (comme ProductCard), Row sur desktop */}
      <div className="flex flex-col gap-0 sm:flex-row sm:items-stretch sm:gap-4">
        {/* Image du plat */}
        <div className="w-full sm:w-auto sm:flex-shrink-0">
          <div className="relative" onClick={onClick}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="aspect-video w-full cursor-pointer rounded-t-lg object-cover transition-opacity duration-200 hover:opacity-80 sm:h-20 sm:w-36 sm:rounded-lg"
              />
            ) : (
              <div className="bg-thai-cream/30 border-thai-orange/20 hover:bg-thai-cream/50 flex aspect-video w-full cursor-pointer items-center justify-center rounded-t-lg border-b transition-colors duration-200 sm:h-20 sm:w-36 sm:rounded-lg sm:border">
                <span className="text-thai-orange text-xl sm:text-lg">🍽️</span>
              </div>
            )}
            {/* Badges Mobile (Masqués sur Desktop) */}
            <div className="sm:hidden">
              <div className="absolute top-2 left-2">
                <Badge className="bg-thai-green px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                  Disponible
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge className="bg-thai-orange px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                  Panier {quantity}
                </Badge>
              </div>
            </div>

            {/* Badge Desktop (Masqué sur Mobile) - Pastille simple */}
            <div className="bg-thai-orange absolute -top-1.5 -right-1.5 hidden h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg sm:flex">
              {quantity}
            </div>
          </div>
        </div>

        {/* Informations du plat */}
        <div className="relative flex min-w-0 flex-1 flex-col justify-between self-stretch p-3 sm:p-0">
          {/* Container Mobile : Stack vertical centré */}
          <div className="flex flex-col items-center gap-2 sm:block sm:gap-0">
            {/* Nom du plat */}
            <div className="flex w-full items-start justify-center sm:justify-between">
              <h4
                className="text-thai-green hover:text-thai-orange decoration-thai-orange/50 max-w-[90%] cursor-pointer text-center text-base font-medium transition-colors duration-200 hover:underline sm:max-w-[40%] sm:text-left"
                onClick={onClick}
              >
                {name}
              </h4>

              {/* Sélecteur épicé (Desktop) - ABSOLUMENT CENTRÉ EN HAUT */}
              {showSpiceSelector && spiceSelectorSlot && (
                <div className="absolute top-0 left-1/2 hidden -translate-x-1/2 transform md:block">
                  <div className="origin-center cursor-pointer transition-all duration-300 hover:scale-110 hover:drop-shadow-lg">
                    {spiceSelectorSlot}
                  </div>
                </div>
              )}
            </div>

            {/* Prix unitaire (Mobile : sous le nom, centré) */}
            <div className="flex items-center justify-center text-xs text-gray-600 sm:mt-1 sm:justify-start sm:text-sm">
              <span className="font-semibold text-gray-700">Prix unitaire:</span>
              <Badge variant="secondary" className="ml-1 text-xs font-bold sm:text-sm">
                {formatPrix(unitPrice)}
              </Badge>
            </div>

            {/* Sélecteur épicé (Mobile : Centré sous le prix) */}
            {showSpiceSelector && spiceSelectorSlot && (
              <div className="mt-1 flex justify-center md:hidden">
                <div className="origin-center scale-90 transition-transform duration-200 hover:scale-100">
                  {spiceSelectorSlot}
                </div>
              </div>
            )}

            {/* Badge Végétarien (Mobile : Centré sous les épices) */}
            {isVegetarian && (
              <div className="mt-1 md:hidden">
                <Badge
                  variant="outline"
                  className="h-5 border-green-300 bg-green-50 px-1.5 py-0 text-[10px] text-green-700"
                >
                  🌱 Végétarien
                </Badge>
              </div>
            )}
          </div>

          {/* Badge Végétarien (Desktop : Absolu bas) */}
          {isVegetarian && (
            <div className="absolute bottom-0.5 left-1/2 hidden -translate-x-1/2 transform md:block">
              <Badge
                variant="outline"
                className="h-5 border-green-300 bg-green-50 px-1.5 py-0 text-[10px] text-green-700"
              >
                🌱 Végétarien
              </Badge>
            </div>
          )}

          {/* Espace flexible (Desktop) */}
          <div className="hidden flex-1 sm:block"></div>

          {/* Infos Quantité / Prix (Desktop - caché sur mobile car réorganisé) */}
          <div className="mt-1 hidden items-center text-sm text-gray-600 sm:flex">
            {/* Ce bloc est redondant sur mobile avec le nouveau layout, on le garde pour desktop */}
            {readOnly && (
              <>
                <span className="font-semibold text-gray-700">Qté:</span>
                <span className="mx-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-100 px-1 text-xs font-bold text-orange-600">
                  {quantity}
                </span>
                <span className="mr-2"></span>
              </>
            )}
          </div>
        </div>

        {/* Contrôles (Mobile : Row complète centrée / Desktop : Col droite) */}
        <div className="flex w-full flex-row items-center justify-center gap-3 p-3 pt-0 sm:w-auto sm:flex-col sm:items-end sm:justify-between sm:gap-4 sm:p-0">
          {/* Prix Total (Desktop uniquement ici, Mobile à la fin de la ligne) */}
          <div className="text-thai-orange hidden text-2xl font-bold sm:block">
            {formatPrix(totalPrice)}
          </div>

          {!readOnly && (
            <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-end">
              {/* Poubelle */}
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                className="h-8 w-8 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500 hover:shadow-lg hover:ring-2 hover:ring-red-300"
                aria-label="Supprimer l'article"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {/* Bouton Moins (Orange/Blanc) */}
              <Button
                size="sm"
                className="border-thai-orange text-thai-orange hover:bg-thai-orange h-8 w-8 rounded-md border bg-white p-0 transition-all duration-200 hover:scale-105 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onQuantityChange(Math.max(1, quantity - 1))
                }}
              >
                -
              </Button>

              {/* Quantité */}
              <span className="w-8 text-center font-medium">{quantity}</span>

              {/* Bouton Plus (Orange/Blanc) */}
              <Button
                size="sm"
                className="border-thai-orange text-thai-orange hover:bg-thai-orange h-8 w-8 rounded-md border bg-white p-0 transition-all duration-200 hover:scale-105 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onQuantityChange(quantity + 1)
                }}
              >
                +
              </Button>

              {/* Prix Total (Mobile uniquement) */}
              <div className="text-thai-orange ml-2 text-lg font-bold sm:hidden">
                {formatPrix(totalPrice)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
