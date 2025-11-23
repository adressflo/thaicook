import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  title: string
  description: string
  price: number
  imageSrc?: string
  isVegetarian?: boolean
  isSpicy?: boolean
  quantityInCart?: number
  onAdd?: () => void
  className?: string
}

export function ProductCard({
  title,
  description,
  price,
  imageSrc,
  isVegetarian,
  isSpicy,
  quantityInCart = 0,
  onAdd,
  className,
}: ProductCardProps) {
  const formatPrix = (prix: number) => {
    return prix % 1 === 0 ? `${prix.toFixed(0)}€` : `${prix.toFixed(2).replace(".", ",")}€`
  }

  return (
    <Card
      className={cn(
        "border-thai-orange/20 hover:border-thai-orange/40 flex cursor-pointer flex-col transition-all duration-300 hover:shadow-md",
        className
      )}
      onClick={onAdd}
    >
      {imageSrc && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {/* Badge Disponible en haut à gauche */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-thai-green px-2 py-0.5 text-xs font-semibold text-white shadow-md">
              Disponible
            </Badge>
          </div>
          {/* Badge Panier en haut à droite */}
          {quantityInCart > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-thai-orange px-2 py-0.5 text-xs font-semibold text-white shadow-md">
                Panier {quantityInCart}
              </Badge>
            </div>
          )}
        </div>
      )}
      <CardContent className="flex flex-grow flex-col p-3">
        {/* Nom + Badges sur même ligne */}
        <div className="mb-1 flex items-center justify-between gap-2">
          <h4 className="text-thai-green line-clamp-1 flex-1 font-semibold">{title}</h4>
          {(isVegetarian || isSpicy) && (
            <div className="flex flex-shrink-0 gap-1">
              {isVegetarian && (
                <Badge
                  variant="outline"
                  className="h-5 border-green-300 bg-green-50 px-1.5 py-0 text-[10px] text-green-700"
                >
                  🌱 Végétarien
                </Badge>
              )}
              {isSpicy && (
                <Badge
                  variant="outline"
                  className="flex h-5 items-center gap-0.5 border-orange-300 bg-orange-50 px-1.5 py-0 text-[10px] text-orange-700"
                >
                  <Flame className="h-3 w-3" />
                  Peut être épicé
                </Badge>
              )}
            </div>
          )}
        </div>

        <p className="mb-2 line-clamp-3 flex-grow text-xs text-gray-600">{description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Badge variant="secondary">{formatPrix(price)}</Badge>
          <Button
            size="sm"
            className="bg-thai-orange hover:bg-thai-orange/90 transition-all duration-200 hover:scale-105 hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation()
              onAdd?.()
            }}
          >
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
