"use client"
import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer"
import { details_commande_db, extras_db, plats_db } from "@/generated/prisma/client"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { FileText, Minus, Plus, RefreshCw, ShoppingCart, X } from "lucide-react"
import NextImage from "next/image"

import { Spice } from "@/components/shared/Spice"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useHaptic } from "@/hooks/useHaptic"
import { getDistributionText } from "@/lib/spice-helpers"

// Composant 3D Card avec effet tilt au survol
const Floating3DCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const { left, top, width, height } = card.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    // Rotation angles based on mouse position
    const rotateX = ((y - height / 2) / height) * 12
    const rotateY = ((x - width / 2) / width) * -12

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  )
}

import type { PlatUI } from "@/types/app"

export interface CommandePlatModalProps {
  plat: plats_db | PlatUI | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formatPrix: (prix: number) => string
  onAddToCart?: (
    plat: plats_db | PlatUI,
    quantity: number,
    spicePreference?: string,
    spiceDistribution?: number[],
    uniqueId?: string
  ) => void
  currentQuantity?: number
  currentSpiceDistribution?: number[]
  dateRetrait?: Date
  uniqueId?: string
  // Nouvelles props pour mode readonly
  mode?: "interactive" | "readonly"
  extra?: extras_db | null
  detail?: details_commande_db | null
  showPriceDetails?: boolean
  closeOnClick?: boolean
  isDeleted?: boolean
  // Props de visibilité des sections
  showImage?: boolean
  showBadge?: boolean
  showBadgeDisponible?: boolean
  showBadgeExtra?: boolean
  showBadgePanier?: boolean
  showDescription?: boolean
  showPrice?: boolean
  showQuantitySelector?: boolean
  showSpiceSelector?: boolean
  showAddToCartButton?: boolean
  show3DTilt?: boolean
  // Props de style
  modalSize?: "sm" | "md" | "lg" | "xl" | "custom"
  imageFormat?: "16:9" | "4:5" | "1:1" | "auto"
  modalPosition?: "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "custom"
  // Props animation fermeture
  exitAnimation?: "fade-zoom" | "fade-out" | "manga-explosion" | "none"
  showCloseButton?: boolean
  // Props scroll
  disableScroll?: boolean
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
    mode,
    extra,
    detail,
    showPriceDetails = false,
    closeOnClick = true,
    isDeleted: isDeletedProp,
    // Props de visibilité (par défaut tout visible)
    showImage = true,
    showBadge = true,
    showBadgeDisponible = true,
    showBadgeExtra = true,
    showBadgePanier = true,
    showDescription = true,
    showPrice = true,
    showQuantitySelector = true,
    showSpiceSelector = true,
    showAddToCartButton = true,
    show3DTilt = true,
    // Props de style
    imageFormat = "auto",
    // Props scroll
    disableScroll = false,
  }) => {
    const [quantity, setQuantity] = React.useState(1)
    // Par défaut, toutes les portions sont "Non épicé"
    const [spiceDistribution, setSpiceDistribution] = React.useState<number[]>([1, 0, 0, 0])
    const haptic = useHaptic()

    // Détection du mode effectif
    const effectiveMode = mode || (onAddToCart ? "interactive" : "readonly")
    const isReadonly = effectiveMode === "readonly"

    // Détection si c'est un extra
    const isExtra = !!extra || detail?.type === "extra"

    // Détection si supprimé
    const isDeleted = isDeletedProp ?? (!isExtra && !plat?.plat)

    // Nom et photo selon le type
    const itemName = isExtra
      ? extra?.nom_extra || detail?.nom_plat || "Extra"
      : plat?.plat || "Plat supprimé"

    const itemPhoto = isExtra
      ? extra?.photo_url ||
        "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
      : plat?.photo_du_plat

    const itemDescription = isExtra ? extra?.description : plat?.description

    // Prix selon le type et le contexte
    const prixUnitaire = isExtra
      ? parseFloat(String(detail?.prix_unitaire || extra?.prix || "0"))
      : parseFloat(String(plat?.prix || "0"))

    // Quantité depuis detail ou props
    const displayQuantity = detail?.quantite_plat_commande || currentQuantity || quantity
    const sousTotal = prixUnitaire * displayQuantity

    // Niveau d'épice maximum du plat (0 = pas épicé, 1-3 = niveaux d'épice)
    const maxSpiceLevel = plat?.niveau_epice || 0

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
      if (onAddToCart && plat) {
        // Ne passer la distribution épicée que si le plat a l'option épicée activée
        const spicePreference =
          maxSpiceLevel > 0 ? getDistributionText(spiceDistribution) : undefined
        const distribution = maxSpiceLevel > 0 ? spiceDistribution : undefined
        haptic.medium()
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

    // Classes pour le format d'image
    const imageHeightClass = {
      "16:9": "h-48 md:h-56",
      "4:5": "h-64 md:h-80",
      "1:1": "h-56 md:h-64",
      auto: "h-48 md:h-56",
    }[imageFormat]

    // Composant wrapper conditionnel pour 3D tilt
    const ImageWrapper = show3DTilt ? Floating3DCard : React.Fragment
    const imageWrapperProps = show3DTilt ? { className: "shrink-0" } : {}

    return (
      <>
        <div className={`relative flex-1 ${disableScroll ? "" : "overflow-y-auto"}`}>
          {/* Header avec photo et effet 3D tilt conditionnel */}
          {showImage && (
            <ImageWrapper {...imageWrapperProps}>
              <div
                className={`from-thai-orange/10 to-thai-gold/10 relative ${imageHeightClass} overflow-hidden rounded-b-xl bg-linear-to-br`}
              >
                {itemPhoto && !isDeleted ? (
                  <NextImage
                    src={itemPhoto}
                    alt={itemName}
                    fill
                    sizes="(max-width: 768px) 100vw, 512px"
                    className={`transition-transform duration-300 ${isExtra ? "object-contain" : "object-cover"}`}
                  />
                ) : (
                  <div className="from-thai-cream to-thai-orange/20 flex h-full w-full items-center justify-center bg-linear-to-br">
                    <div className="text-thai-orange/50 text-8xl">{isDeleted ? "❌" : "🍽️"}</div>
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

                {/* Badge statut gauche (Disponible ou Supprimé) */}
                {showBadge && showBadgeDisponible && (
                  <div className="absolute top-3 left-3">
                    {isDeleted ? (
                      <Badge className="bg-red-500 px-3 py-1 font-semibold text-white shadow-md">
                        Supprimé
                      </Badge>
                    ) : (
                      <Badge className="bg-thai-green px-3 py-1 font-semibold text-white shadow-md">
                        Disponible
                      </Badge>
                    )}
                  </div>
                )}

                {/* Badge droite (Extra ou Panier) */}
                {showBadge && (
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    {showBadgePanier && !isReadonly && currentQuantity > 0 && (
                      <Badge className="bg-thai-orange px-3 py-1 font-semibold text-white shadow-md">
                        Panier {currentQuantity}
                      </Badge>
                    )}
                    {showBadgeExtra && isExtra && (
                      <Badge className="bg-thai-gold px-3 py-1 font-semibold text-white shadow-md">
                        Extra
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </ImageWrapper>
          )}

          {/* Contenu scrollable */}
          <div className="space-y-3 p-4">
            <DialogHeader>
              {standalone ? (
                <>
                  <h2
                    className={`text-lg font-bold ${isDeleted ? "text-gray-600" : "text-thai-green"}`}
                  >
                    {itemName}
                  </h2>
                  <p className="sr-only">
                    {isReadonly
                      ? `Détails de ${itemName} - Prix: ${formatPrix(prixUnitaire)}`
                      : `Ajouter ${itemName} au panier - Prix: ${formatPrix(prixUnitaire)}`}
                  </p>
                </>
              ) : (
                <>
                  <DialogTitle
                    className={`text-lg font-bold ${isDeleted ? "text-gray-600" : "text-thai-green"}`}
                  >
                    {itemName}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    {isReadonly
                      ? `Détails de ${itemName} - Prix: ${formatPrix(prixUnitaire)}`
                      : `Ajouter ${itemName} au panier - Prix: ${formatPrix(prixUnitaire)}`}
                  </DialogDescription>
                </>
              )}
            </DialogHeader>

            {/* Description */}
            {showDescription && itemDescription && !isDeleted && (
              <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 animate-fadeIn space-y-1.5 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
                <h4 className="text-thai-orange flex items-center gap-1.5 text-xs font-semibold">
                  <FileText className="h-3.5 w-3.5" />
                  Description
                </h4>
                <p className="text-xs leading-relaxed text-gray-700">{itemDescription}</p>
              </div>
            )}

            {/* Prix unitaire (mode interactif simple) */}
            {showPrice && prixUnitaire > 0 && !showPriceDetails && !isDeleted && (
              <div className="hover:bg-thai-cream/30 hover:border-thai-orange hover:ring-thai-orange/30 from-thai-cream/40 to-thai-orange/10 rounded-lg border border-gray-200 bg-linear-to-r p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
                <div className="text-center">
                  <div className="mb-0.5 text-xs font-medium text-gray-600">PRIX UNITAIRE</div>
                  <div className="text-thai-orange text-xl font-bold">
                    {formatPrix(prixUnitaire)}
                  </div>
                </div>
              </div>
            )}

            {/* Prix détaillés (mode readonly avec showPriceDetails) */}
            {showPriceDetails && !isDeleted && (
              <div className="animate-fadeIn space-y-3">
                {/* Prix unitaire - style comme mode interactif */}
                <div className="hover:bg-thai-cream/30 hover:border-thai-orange hover:ring-thai-orange/30 from-thai-cream/40 to-thai-orange/10 rounded-lg border border-gray-200 bg-linear-to-r p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
                  <div className="text-center">
                    <div className="mb-0.5 text-xs font-medium text-gray-600">PRIX UNITAIRE</div>
                    <div className="text-thai-orange text-xl font-bold">
                      {formatPrix(prixUnitaire)}
                    </div>
                  </div>
                </div>

                {/* Quantité et Sous-total - style comme mode interactif */}
                <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
                  {/* Quantité */}
                  <div className="flex items-center justify-between">
                    <span className="text-thai-green text-sm font-medium">Quantité :</span>
                    <span className="bg-thai-orange flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-bold text-white shadow-sm">
                      {displayQuantity}
                    </span>
                  </div>

                  {/* Sous-total */}
                  <div className="border-thai-orange/20 mt-2 flex items-center justify-between border-t pt-2">
                    <span className="text-thai-green text-sm font-medium">Sous-total :</span>
                    <span className="text-thai-orange text-lg font-bold">
                      {formatPrix(sousTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Message pour plats/extras supprimés */}
            {isDeleted && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                <p className="text-sm font-medium text-red-700">
                  ⚠️ Cet {isExtra ? "extra" : "article"} n'est plus disponible
                </p>
              </div>
            )}

            {/* Sélecteur de quantité et actions (mode interactif uniquement) */}
            {!isReadonly && onAddToCart && (
              <div className="space-y-3">
                {/* Sélecteur de quantité */}
                {showQuantitySelector && (
                  <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
                    <div className="flex items-center justify-between">
                      <span className="text-thai-green text-sm font-medium">Quantité :</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="border-thai-orange/30 hover:border-thai-orange hover:bg-thai-orange h-7 w-7 p-0 transition-all duration-200 hover:scale-110 hover:text-white"
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
                          className="border-thai-orange/30 hover:border-thai-orange hover:bg-thai-orange h-7 w-7 p-0 transition-all duration-200 hover:scale-110 hover:text-white"
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
                )}

                {/* Sélecteur de répartition épicée (uniquement si le plat est épicé) */}
                {showSpiceSelector && maxSpiceLevel > 0 && (
                  <div className="animate-fadeIn rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-red-400 hover:bg-red-50/50 hover:shadow-lg hover:ring-2 hover:ring-red-300/50">
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
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-center transition-all duration-300 hover:scale-[1.01] hover:border-blue-400 hover:shadow-lg hover:ring-2 hover:ring-blue-300/50">
                    <p className="text-xs font-medium text-blue-800">
                      📅 Sera ajouté pour le retrait du {dateRetrait.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'ajout au panier - sticky en bas (mode interactif uniquement) */}
        {showAddToCartButton && !isReadonly && onAddToCart && (
          <div className="sticky bottom-0 shrink-0 border-t border-gray-200 bg-white p-4 shadow-lg">
            <Button
              onClick={handleAddToCart}
              className="bg-thai-orange hover:bg-thai-orange/90 w-full py-5 text-base text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              {uniqueId ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Mettre à jour ({formatPrix(sousTotal)})
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier ({formatPrix(sousTotal)})
                </>
              )}
            </Button>
          </div>
        )}
      </>
    )
  }
)

CommandePlatContent.displayName = "CommandePlatContent"

export const CommandePlatModal = React.memo<CommandePlatModalProps>((props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const effectiveMode = props.mode || (props.onAddToCart ? "interactive" : "readonly")
  const isReadonly = effectiveMode === "readonly"
  const closeOnClick = props.closeOnClick ?? isReadonly
  const exitAnimation = props.exitAnimation ?? "fade-zoom"
  const showCloseButton = props.showCloseButton ?? false

  const handleContentClick = () => {
    if (closeOnClick) {
      props.onOpenChange(false)
    }
  }

  // Classes de taille modal (Desktop uniquement)
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-xl",
    xl: "max-w-2xl",
    custom: "max-w-lg",
  }[props.modalSize ?? "md"]

  // Classes de position (Desktop uniquement)
  const positionClasses = {
    center: "",
    "bottom-right": "fixed bottom-4 right-4 top-auto left-auto translate-x-0 translate-y-0",
    "bottom-left": "fixed bottom-4 left-4 top-auto right-auto translate-x-0 translate-y-0",
    "top-right": "fixed top-4 right-4 bottom-auto left-auto translate-x-0 translate-y-0",
    "top-left": "fixed top-4 left-4 bottom-auto right-auto translate-x-0 translate-y-0",
    custom: "",
  }[props.modalPosition ?? "center"]

  // Classes d'animation de sortie - IDENTIQUE à ToasterVideo/ModalVideo
  const getExitAnimationClasses = () => {
    switch (exitAnimation) {
      case "none":
        return "data-[state=closed]:animate-none! data-[state=closed]:duration-0!"
      case "fade-out":
        return "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200"
      case "manga-explosion":
        return "manga-explosion-modal-exit data-[state=closed]:zoom-out-100! data-[state=closed]:fade-out-100! data-[state=closed]:slide-out-to-left-1/2! data-[state=closed]:slide-out-to-top-[50%]! data-[state=closed]:duration-500!"
      case "fade-zoom":
      default:
        // Animation fade-out + zoom-out identique à ToasterVideo
        return "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:duration-200"
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
        <DialogContent
          className={`mx-auto flex max-h-[90vh] ${sizeClasses} ${positionClasses} transform flex-col overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl transition-all duration-300 ${getExitAnimationClasses()} ${showCloseButton ? "" : "[&>button]:hidden"} ${closeOnClick ? "cursor-pointer" : ""}`}
          onClick={closeOnClick ? handleContentClick : (e) => e.stopPropagation()}
        >
          <VisuallyHidden>
            <DialogTitle>{props.plat?.plat || "Détails du plat"}</DialogTitle>
            <DialogDescription>
              Personnalisez votre plat : options, épices et quantité.
            </DialogDescription>
          </VisuallyHidden>

          {/* Bouton X de fermeture personnalisé */}
          {showCloseButton && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                props.onOpenChange(false)
              }}
              className="absolute top-3 right-3 z-50 rounded-full bg-white/80 p-1.5 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          )}
          <CommandePlatContent {...props} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={props.isOpen} onOpenChange={props.onOpenChange}>
      {/* max-h-[90vh] pour éviter de couvrir tout l'écran et laisser la barre de grab visible */}
      <DrawerContent className="max-h-[85vh] outline-none">
        <VisuallyHidden>
          <DrawerTitle>{props.plat?.plat || "Détails du plat"}</DrawerTitle>
          <DrawerDescription>
            Personnalisez votre plat : options, épices et quantité.
          </DrawerDescription>
        </VisuallyHidden>
        {/* Container interne scrollable */}
        <div className="flex h-full flex-col overflow-hidden rounded-t-[10px]">
          <div className="flex-1 overflow-y-auto">
            {/* standalone={true} pour éviter l'erreur DialogTitle manquant */}
            <CommandePlatContent {...props} standalone={true} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
})

CommandePlatModal.displayName = "CommandePlatModal"

// Wrapper component pour utiliser CommandePlatModal avec le pattern "children" (comme DishDetailsModal)
interface CommandePlatModalTriggerProps
  extends Omit<CommandePlatModalProps, "isOpen" | "onOpenChange"> {
  children: React.ReactNode
}

export const CommandePlatModalTrigger = React.memo<CommandePlatModalTriggerProps>(
  ({ children, ...props }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <>
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {children}
        </div>
        <CommandePlatModal isOpen={isOpen} onOpenChange={setIsOpen} {...props} />
      </>
    )
  }
)

CommandePlatModalTrigger.displayName = "CommandePlatModalTrigger"
