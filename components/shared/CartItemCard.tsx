"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ModalVideo } from "@/components/ui/ModalVideo"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { SmartSpice } from "./SmartSpice"

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
  spiceDistribution?: number[]
  onSpiceDistributionChange?: (distribution: number[]) => void
  readOnly?: boolean
  className?: string
  imageClassName?: string
  imageAspectRatio?: "square" | "video" | "auto" | "square-contain" | "video-contain"
  imageObjectPosition?: "center" | "top" | "bottom" | "left" | "right"
  imageZoom?: number
  imageWidth?: number
  imageHeight?: number
  desktopImageWidth?: string
  customImageObjectPosition?: string
  cardClassName?: string
  quantityBadgeLabel?: string
  showQuantityBadge?: boolean
}

export function CartItemCard({
  name,
  imageUrl,
  unitPrice,
  quantity,
  isVegetarian,
  onQuantityChange,
  onRemove,
  onClick,
  showSpiceSelector = false,
  spiceSelectorSlot,
  readOnly = false,
  className,
  imageClassName,
  imageAspectRatio = "square",
  imageObjectPosition = "center",
  imageWidth,
  imageHeight,
  desktopImageWidth = "w-22",
  customImageObjectPosition,
  cardClassName,
  spiceDistribution,
  onSpiceDistributionChange,
  quantityBadgeLabel = "Qté",
  showQuantityBadge = true,
}: CartItemCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const controls = useAnimation()
  const x = useMotionValue(0)

  // Opacité de l'arrière-plan rouge basée sur la position du swipe
  const bgOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0])
  const iconScale = useTransform(x, [-100, -50], [1.2, 0.8])

  // Gestion de la fin du glissement
  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      // Swipe vers la gauche suffisant -> Ouvre modal
      setIsModalOpen(true)
    }
    // Retour à la position initiale
    controls.start({ x: 0 })
  }

  // Fermer la modal remet la position à 0 si annulé
  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      controls.start({ x: 0 })
    }
  }

  useEffect(() => {
    setImageError(false)
  }, [imageUrl])

  // Utiliser la position personnalisée par défaut (20% 50%) si aucune position n'est spécifiée
  // et que la position standard est "center" (valeur par défaut)
  const effectiveCustomPosition =
    customImageObjectPosition ?? (imageObjectPosition === "center" ? "20% 50%" : undefined)

  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`
    } else {
      return `${prix.toFixed(2).replace(".", ",")}€`
    }
  }

  const totalPrice = unitPrice * quantity

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "aspect-auto",
    "square-contain": "aspect-square",
    "video-contain": "aspect-video",
  }[imageAspectRatio]

  const objectFitClass = imageAspectRatio.endsWith("-contain")
    ? "object-contain bg-gray-50"
    : "object-cover"

  const objectPositionClass = {
    center: "object-center",
    top: "object-top",
    bottom: "object-bottom",
    left: "object-left",
    right: "object-right",
  }[imageObjectPosition]

  // Rendu du sélecteur d'épices (soit via slot, soit via SmartSpice interne)
  const renderSpiceSelector = () => {
    if (!showSpiceSelector) return null

    if (spiceDistribution && (onSpiceDistributionChange || readOnly)) {
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <SmartSpice
            quantity={quantity}
            distribution={spiceDistribution}
            onDistributionChange={onSpiceDistributionChange || (() => {})}
            className="scale-90"
            readOnly={readOnly}
          />
        </div>
      )
    }

    return spiceSelectorSlot
  }

  const spiceContent = renderSpiceSelector()

  return (
    <div className={cn("group relative", className)}>
      {/* Arrière-plan rouge (Action de suppression) */}
      {!readOnly && (
        <motion.div
          className="absolute inset-0 z-0 flex items-center justify-end rounded-lg bg-red-500 px-6"
          style={{ opacity: bgOpacity }}
        >
          <motion.div style={{ scale: iconScale }}>
            <Trash2 className="h-6 w-6 text-white" />
          </motion.div>
        </motion.div>
      )}

      {/* Carte (Premier plan draggable) */}
      <motion.div
        drag={!readOnly && !isDesktop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, touchAction: "pan-y" }}
        className={cn(
          "hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 relative z-10 transform rounded-lg border border-gray-200 bg-white p-0 transition-shadow duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2 sm:p-4",
          // On retire className ici car il est sur le wrapper parent, sauf s'il contient des styles internes spécifiques
          // Pour la sécurité, on garde les styles de base ici et layout sur le parent
          cardClassName
        )}
      >
        {/* Layout principal : Col sur mobile (comme ProductCard), Row sur desktop */}
        <div className="flex flex-col gap-0 sm:flex-row sm:items-stretch sm:gap-4">
          {/* Image du plat */}
          <div className="w-full sm:w-auto sm:shrink-0">
            <div className="relative" onClick={onClick}>
              <div
                className={cn(
                  "relative overflow-hidden rounded-t-lg sm:rounded-lg",
                  !imageWidth && "w-full",
                  !imageWidth &&
                    {
                      "w-16": "sm:w-16",
                      "w-20": "sm:w-20",
                      "w-22": "sm:w-22",
                      "w-24": "sm:w-24",
                      "w-32": "sm:w-32",
                      "w-40": "sm:w-40",
                      "w-48": "sm:w-48",
                    }[desktopImageWidth],
                  !imageHeight && aspectRatioClass
                )}
                style={{
                  ...(imageWidth ? { width: `${imageWidth}px` } : {}),
                }}
              >
                {imageUrl && !imageError ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, 150px"
                    className={cn(objectFitClass, objectPositionClass, imageClassName)}
                    style={
                      effectiveCustomPosition
                        ? { objectPosition: effectiveCustomPosition }
                        : undefined
                    }
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-50">
                    <span className="text-thai-orange text-xl sm:text-lg">🍽️</span>
                  </div>
                )}
              </div>
              {/* Badges Mobile (Masqués sur Desktop) */}
              <div className="sm:hidden">
                <div className="absolute top-2 left-2">
                  <Badge className="bg-thai-green px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                    Disponible
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-thai-orange px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                    {quantityBadgeLabel} {quantity}
                  </Badge>
                </div>
              </div>

              {/* Badge Desktop (Masqué sur Mobile) - Pastille simple */}
              {showQuantityBadge && (
                <div className="bg-thai-orange absolute -top-1.5 -right-1.5 hidden h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg sm:flex">
                  {quantity}
                </div>
              )}
            </div>
          </div>

          {/* Informations du plat */}
          <div className="relative flex min-w-0 flex-1 flex-col justify-between self-stretch p-3 sm:p-0 sm:pb-6">
            {/* Container Mobile : Stack vertical centré */}
            <div className="flex flex-col items-center gap-2 sm:block sm:gap-0">
              {/* Nom du plat et Badges (Desktop) */}
              <div className="flex w-full flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h4
                  className="text-thai-green hover:text-thai-orange decoration-thai-orange/50 max-w-[90%] cursor-pointer text-center text-base font-medium transition-colors duration-200 hover:underline sm:max-w-[60%] sm:text-left"
                  onClick={onClick}
                >
                  {name}
                </h4>

                {/* Badges Desktop (Alignés à droite) */}
                <div className="hidden flex-col items-end gap-2 sm:flex">
                  {/* Sélecteur épicé */}
                  {spiceContent && (
                    <div className="origin-right transition-all duration-300 hover:scale-105">
                      {spiceContent}
                    </div>
                  )}

                  {/* Badge Végétarien */}
                  {isVegetarian && (
                    <Badge
                      variant="outline"
                      className="h-5 border-green-300 bg-green-50 px-1.5 py-0 text-[10px] text-green-700"
                    >
                      🌱 Végétarien
                    </Badge>
                  )}
                </div>
              </div>

              {/* Prix unitaire (Mobile : sous le nom, centré) */}
              <div className="flex items-center justify-center text-xs text-gray-600 sm:mt-1 sm:max-w-[45%] sm:justify-start sm:text-sm">
                <span className="font-semibold text-gray-700">Prix unitaire:</span>
                <Badge variant="secondary" className="ml-1 text-xs font-bold sm:text-sm">
                  {formatPrix(unitPrice)}
                </Badge>
              </div>

              {/* Quantité (Mobile : sous le prix, si readOnly) */}
              {readOnly && (
                <div className="mt-1 flex items-center justify-center text-xs text-gray-600 sm:hidden">
                  <span className="font-semibold text-gray-700">Quantité:</span>
                  <Badge variant="secondary" className="ml-1 text-xs font-bold">
                    {quantity}
                  </Badge>
                </div>
              )}

              {/* Sélecteur épicé (Mobile : Centré sous le prix) */}
              {spiceContent && (
                <div className="mt-1 flex justify-center sm:hidden">
                  <div className="origin-center scale-90 transition-transform duration-200 hover:scale-100">
                    {spiceContent}
                  </div>
                </div>
              )}

              {/* Badge Végétarien (Mobile : Centré sous les épices) */}
              {isVegetarian && (
                <div className="mt-1 sm:hidden">
                  <Badge
                    variant="outline"
                    className="h-5 border-green-300 bg-green-50 px-1.5 py-0 text-[10px] text-green-700"
                  >
                    🌱 Végétarien
                  </Badge>
                </div>
              )}
            </div>

            {/* Espace flexible (Desktop) */}
            <div className="hidden flex-1 sm:block"></div>

            {/* Infos Quantité / Prix (Desktop - caché sur mobile car réorganisé) */}
            <div className="mt-1 hidden items-center text-sm text-gray-600 sm:flex">
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
                    setIsModalOpen(true)
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
      </motion.div>

      {/* Modal de confirmation de suppression */}
      <ModalVideo
        isOpen={isModalOpen}
        onOpenChange={handleModalClose}
        title="<orange>Supprimer</orange> cette commande ?"
        description="Êtes-vous sûr de vouloir <bold><orange>retirer</orange></bold> ce plat de votre <semi-bold><orange>panier</orange></semi-bold> ?"
        media="/media/animations/toasts/ajoutpaniernote.mp4"
        aspectRatio="1:1"
        polaroid={true}
        scrollingText={false}
        scrollDuration={10}
        loopCount={1}
        autoClose={true}
        buttonLayout="double"
        cancelText="Annuler"
        confirmText="Supprimer"
        maxWidth="sm"
        borderColor="thai-green"
        borderWidth={2}
        shadowSize="2xl"
        onCancel={() => handleModalClose(false)}
        onConfirm={() => {
          onRemove()
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}
