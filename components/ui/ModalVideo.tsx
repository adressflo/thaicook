'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ModalVideoProps {
  // État du modal
  isOpen: boolean
  onOpenChange: (open: boolean) => void

  // Propriétés héritées de ToasterVideo
  title?: string
  description?: string | React.ReactNode
  media?: string // URL vidéo (.mp4/.webm) ou image

  // Propriétés de style vidéo
  aspectRatio?: "16:9" | "4:5" | "1:1" | "auto"
  polaroid?: boolean
  scrollingText?: boolean
  scrollDuration?: number

  // Contrôle de lecture vidéo
  loopCount?: number // 0 = infini, 1 = une fois, n = n fois

  // Boutons d'action
  buttonLayout?: "none" | "single" | "double" | "triple" // Layout des boutons (0, 1, 2, ou 3 boutons)
  cancelText?: string
  confirmText?: string
  thirdButtonText?: string // Texte du 3ème bouton (pour layout "triple")
  onCancel?: () => void
  onConfirm?: () => void
  onThirdButton?: () => void // Callback du 3ème bouton

  // Mode standalone pour aperçu
  standalone?: boolean

  // Style Dialog - Nouvelles propriétés configurables
  rotation?: boolean // Active l'animation rotate-[-2deg] hover:rotate-0 (comme modal "Installer l'Application")
  maxWidth?: "sm" | "md" | "lg" | "xl" | "custom" // Taille du modal
  customWidth?: string // Largeur personnalisée (ex: "600px", "90vw") - utilisé si maxWidth="custom"
  customHeight?: string // Hauteur personnalisée (ex: "400px", "80vh")
  borderColor?: "thai-orange" | "thai-green" | "red" | "blue" // Couleur bordure
  borderWidth?: number // Épaisseur bordure (1, 2, 4)
  shadowSize?: "sm" | "lg" | "2xl" // Taille ombre
}

// Composant de contenu réutilisable (pour Dialog et Aperçu)
export function ModalVideoContent({
  onOpenChange,
  title = "Vidéo",
  description,
  media,
  aspectRatio = "16:9",
  polaroid = false,
  scrollingText = false,
  scrollDuration = 10,
  loopCount = 1,
  buttonLayout = "double",
  cancelText = "Annuler",
  confirmText = "Confirmer",
  thirdButtonText = "Action",
  onCancel,
  onConfirm,
  onThirdButton,
  standalone = false,
  borderColor = "thai-orange",
  borderWidth = 2,
}: Omit<ModalVideoProps, 'isOpen'> & { onOpenChange: (open: boolean) => void; borderColor?: "thai-orange" | "thai-green" | "red" | "blue"; borderWidth?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playCount, setPlayCount] = useState(0)

  // Map aspect ratio to Tailwind classes
  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:5": "aspect-[4/5]",
    "1:1": "aspect-square",
    "auto": "", // Pas de contrainte d'aspect ratio
  }

  const borderWidthClass = {
    1: "border",
    2: "border-2",
    4: "border-4"
  }

  const borderColorClass = {
    "thai-orange": "border-thai-orange",
    "thai-green": "border-thai-green",
    "red": "border-red-500",
    "blue": "border-blue-500"
  }

  // Détection du type de média
  const isVideo = media?.endsWith('.mp4') || media?.endsWith('.webm')

  // Gestion de la fin de vidéo
  const handleVideoEnded = () => {
    if (loopCount === 0) {
      // Boucle infinie - restart
      videoRef.current?.play()
    } else if (playCount < loopCount - 1) {
      // Encore des lectures restantes
      setPlayCount(playCount + 1)
      videoRef.current?.play()
    }
    // Si loopCount est atteint, la vidéo s'arrête simplement
    // Le modal reste ouvert pour attendre confirmation de l'utilisateur
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    if (!standalone) {
      onOpenChange(false)
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    if (!standalone) {
      onOpenChange(false)
    }
  }

  return (
    <div className={cn("flex flex-col", standalone ? "h-full" : "")}>
      {/* Bouton close (seulement si pas standalone) */}
      {!standalone && (
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-20 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-black/20 transition-all duration-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Section image/vidéo */}
      {media && (
        <div className={cn("relative w-full", standalone && "flex-shrink-0")}>
          {polaroid ? (
            // Mode Polaroid : cadre blanc + bordure intérieure autour de la photo
            <div className="bg-white p-3 pt-3 pb-8">
              <div
                className={cn(
                  "relative w-full overflow-hidden",
                  aspectRatioClass[aspectRatio],
                  borderWidthClass[borderWidth as keyof typeof borderWidthClass],
                  borderColorClass[borderColor]
                )}
              >
                {isVideo ? (
                  <video
                    ref={videoRef}
                    src={media}
                    autoPlay
                    muted
                    loop={loopCount === 0}
                    onEnded={handleVideoEnded}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={media}
                    alt="Modal media"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          ) : (
            // Mode normal : pas de cadre Polaroid
            <div
              className={cn(
                "relative w-full overflow-hidden",
                aspectRatioClass[aspectRatio]
              )}
            >
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={media}
                  autoPlay
                  muted
                  loop={loopCount === 0}
                  onEnded={handleVideoEnded}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={media}
                  alt="Modal media"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Section contenu */}
      <div className={cn("p-6 space-y-4 bg-white", standalone && "flex-1 flex flex-col")}>
        <div className={cn("space-y-3", standalone && "flex-1")}>
          {title && (
            <h3 className="text-2xl font-bold text-center text-thai-green">
              {title}
            </h3>
          )}
          {description && (
            <div className={cn("w-full", scrollingText && "overflow-hidden")}>
              <p
                className={cn(
                  "text-center text-base leading-relaxed text-thai-green/90",
                  scrollingText && "animate-marquee inline-block whitespace-nowrap"
                )}
                style={
                  scrollingText && scrollDuration
                    ? ({ "--marquee-duration": `${scrollDuration}s` } as React.CSSProperties)
                    : undefined
                }
              >
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Boutons d'action (selon buttonLayout) */}
        {buttonLayout !== "none" && (
          <div className={cn("flex gap-3", buttonLayout === "single" && "justify-center")}>
            {/* Layout "single" : 1 bouton centré (Confirmer) */}
            {buttonLayout === "single" && (
              <Button
                onClick={handleConfirm}
                className="bg-thai-orange hover:bg-thai-orange/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 px-8"
              >
                {confirmText}
              </Button>
            )}

            {/* Layout "double" : 2 boutons (Annuler + Confirmer) */}
            {buttonLayout === "double" && (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 rounded-lg border-2 border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-thai-orange hover:bg-thai-orange/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {confirmText}
                </Button>
              </>
            )}

            {/* Layout "triple" : 3 boutons (Annuler + Confirmer + 3ème) */}
            {buttonLayout === "triple" && (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 rounded-lg border-2 border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-thai-orange hover:bg-thai-orange/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {confirmText}
                </Button>
                <Button
                  onClick={() => {
                    if (onThirdButton) {
                      onThirdButton()
                    }
                    if (!standalone) {
                      onOpenChange(false)
                    }
                  }}
                  className="flex-1 bg-thai-gold hover:bg-thai-gold/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {thirdButtonText}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function ModalVideo({
  isOpen,
  onOpenChange,
  title,
  description,
  rotation = true,
  maxWidth = "md",
  customWidth,
  customHeight,
  borderColor = "thai-orange",
  borderWidth = 2,
  shadowSize = "2xl",
  ...props
}: ModalVideoProps) {
  // Mapping des classes Tailwind
  const maxWidthClass = {
    "sm": "max-w-sm",
    "md": "max-w-md",
    "lg": "max-w-lg",
    "xl": "max-w-xl",
    "custom": "" // Pas de classe max-w si custom
  }

  const borderColorClass = {
    "thai-orange": "border-thai-orange",
    "thai-green": "border-thai-green",
    "red": "border-red-500",
    "blue": "border-blue-500"
  }

  const borderWidthClass = {
    1: "border",
    2: "border-2",
    4: "border-4"
  }

  const shadowClass = {
    "sm": "shadow-sm",
    "lg": "shadow-lg",
    "2xl": "shadow-2xl"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          maxWidthClass[maxWidth],
          "bg-white p-0",
          borderWidthClass[borderWidth as keyof typeof borderWidthClass] || "border-2",
          borderColorClass[borderColor],
          shadowClass[shadowSize],
          rotation && "rotate-[-2deg] hover:rotate-0 transition-transform duration-300"
        )}
        style={
          maxWidth === "custom" && (customWidth || customHeight)
            ? {
                width: customWidth || undefined,
                maxWidth: customWidth || undefined,
                height: customHeight || undefined,
              }
            : undefined
        }
      >
        {/* Titres accessibles (cachés visuellement) */}
        <DialogTitle className="sr-only">{title || "Modal Vidéo"}</DialogTitle>
        <DialogDescription className="sr-only">{description || "Modal avec contenu vidéo ou image"}</DialogDescription>

        <ModalVideoContent
          onOpenChange={onOpenChange}
          title={title}
          description={description}
          borderColor={borderColor}
          borderWidth={borderWidth}
          {...props}
        />
      </DialogContent>
    </Dialog>
  )
}
