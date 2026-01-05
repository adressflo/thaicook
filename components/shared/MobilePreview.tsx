"use client"

import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type PreviewMode = "desktop" | "tablet" | "mobile"
type DeviceSize = "xs" | "sm" | "md" | "lg" | "custom"

interface MobilePreviewProps {
  children: ReactNode
  /** Contenu spécifique pour le mode mobile (si différent du desktop) */
  mobileContent?: ReactNode
  /** Contenu spécifique pour le mode tablette (si différent du desktop) */
  tabletContent?: ReactNode
  /** Mode actuel de prévisualisation */
  mode: PreviewMode
  /** Callback pour changer le mode */
  onModeChange: (mode: PreviewMode) => void
  /** Taille du simulateur mobile */
  mobileSize?: DeviceSize
  /** Taille du simulateur tablette */
  tabletSize?: DeviceSize
  /** Largeur personnalisée mobile en px (si mobileSize="custom") */
  customMobileWidth?: number
  /** Largeur personnalisée tablette en px (si tabletSize="custom") */
  customTabletWidth?: number
  /** Callback pour changer la largeur mobile */
  onMobileWidthChange?: (width: number) => void
  /** Callback pour changer la largeur tablette */
  onTabletWidthChange?: (width: number) => void
  /** Afficher les contrôles de redimensionnement */
  showSizeControls?: boolean
  /** Afficher les boutons de toggle */
  showToggle?: boolean
  /** Afficher le bouton tablette */
  showTabletToggle?: boolean
  /** Titre de la zone de prévisualisation */
  title?: string
  /** Classes CSS additionnelles pour le container */
  className?: string
  /** Classes CSS additionnelles pour le contenu */
  contentClassName?: string
  /** Afficher l'encoche (notch) */
  showNotch?: boolean
  /** Afficher la barre home */
  showHomeBar?: boolean
  /** Couleur du cadre */
  frameColor?: "gray" | "black" | "white"
  /** Afficher le bouton popup */
  showPopupButton?: boolean
  /** Nom du composant (pour la page preview dédiée) */
  componentName?: string
  /** Props à passer à la page preview (sérialisées en URL) */
  previewProps?: Record<string, string | number | boolean>
}

const mobileSizes: Record<DeviceSize, number> = {
  xs: 240,
  sm: 280,
  md: 320,
  lg: 375,
  custom: 280,
}

const tabletSizes: Record<DeviceSize, number> = {
  xs: 480,
  sm: 600,
  md: 768,
  lg: 820,
  custom: 600,
}

const frameColors = {
  gray: {
    border: "border-gray-800",
    bg: "bg-gray-800",
    notch: "bg-gray-800",
    notchInner: "bg-black",
    homeBar: "bg-white",
  },
  black: {
    border: "border-black",
    bg: "bg-black",
    notch: "bg-black",
    notchInner: "bg-gray-900",
    homeBar: "bg-gray-300",
  },
  white: {
    border: "border-gray-300",
    bg: "bg-gray-100",
    notch: "bg-gray-200",
    notchInner: "bg-gray-400",
    homeBar: "bg-gray-400",
  },
}

export function MobilePreview({
  children,
  mobileContent,
  tabletContent,
  mode,
  onModeChange,
  mobileSize = "sm",
  tabletSize = "sm",
  customMobileWidth,
  customTabletWidth,
  onMobileWidthChange,
  onTabletWidthChange,
  showSizeControls = false,
  showToggle = true,
  showTabletToggle = true,
  title = "Prévisualisation",
  className,
  contentClassName,
  showNotch = true,
  showHomeBar = true,
  frameColor = "gray",
  showPopupButton = false,
  componentName = "Unknown",
  previewProps = {},
}: MobilePreviewProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_popupWindow, setPopupWindow] = useState<Window | null>(null)

  // State interne pour la largeur si pas de callback externe
  const [internalMobileWidth, setInternalMobileWidth] = useState(
    customMobileWidth || mobileSizes[mobileSize]
  )
  const [internalTabletWidth, setInternalTabletWidth] = useState(
    customTabletWidth || tabletSizes[tabletSize]
  )

  // Utiliser les valeurs contrôlées ou internes
  const mobileWidth = customMobileWidth ?? internalMobileWidth
  const tabletWidth = customTabletWidth ?? internalTabletWidth
  const colors = frameColors[frameColor]

  // Handlers pour le changement de taille
  const handleMobileWidthChange = (width: number) => {
    setInternalMobileWidth(width)
    onMobileWidthChange?.(width)
  }

  const handleTabletWidthChange = (width: number) => {
    setInternalTabletWidth(width)
    onTabletWidthChange?.(width)
  }

  // Contenu à afficher selon le mode
  const getDisplayContent = () => {
    if (mode === "mobile" && mobileContent) return mobileContent
    if (mode === "tablet" && tabletContent) return tabletContent
    if (mode === "tablet" && mobileContent) return mobileContent // Fallback tablette vers mobile
    return children
  }

  const displayContent = getDisplayContent()
  const isDevice = mode === "mobile" || mode === "tablet"
  const currentWidth = mode === "mobile" ? mobileWidth : tabletWidth

  // Fonction pour ouvrir la popup avec la page preview autonome
  const openPreviewPopup = () => {
    // Construire les paramètres URL (uniquement les props du composant)
    const params = new URLSearchParams({ component: componentName })

    // Ajouter les props du composant
    Object.entries(previewProps).forEach(([key, value]) => {
      params.set(key, String(value))
    })

    const popupWidth = 550
    const popupHeight = 750
    const left = window.screenX + window.outerWidth - popupWidth - 30
    const top = window.screenY + 30

    // _blank force une nouvelle fenêtre popup
    const popup = window.open(
      `/preview?${params.toString()}`,
      "_blank",
      `popup=yes,width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )

    if (popup) {
      setPopupWindow(popup)
      popup.focus()
    }
  }

  return (
    <div
      className={cn("relative w-full rounded-lg border border-dashed bg-blue-50 p-4", className)}
    >
      {/* Header avec titre et toggle */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {/* Bouton Détacher */}
          {showPopupButton && isDevice && (
            <Button
              size="sm"
              variant="outline"
              onClick={openPreviewPopup}
              className="border-thai-orange/50 text-thai-orange hover:bg-thai-orange h-6 px-2 text-xs hover:text-white"
              title="Ouvrir dans une fenêtre séparée"
            >
              🔗 Détacher
            </Button>
          )}
        </div>
        {showToggle && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === "desktop" ? "default" : "outline"}
              onClick={() => onModeChange("desktop")}
              className={cn(
                mode === "desktop"
                  ? "bg-thai-green hover:bg-thai-green/90"
                  : "border-thai-green/30 text-thai-green hover:bg-thai-green/10"
              )}
            >
              🖥️ Desktop
            </Button>
            {showTabletToggle && (
              <Button
                size="sm"
                variant={mode === "tablet" ? "default" : "outline"}
                onClick={() => onModeChange("tablet")}
                className={cn(
                  mode === "tablet"
                    ? "bg-thai-green hover:bg-thai-green/90"
                    : "border-thai-green/30 text-thai-green hover:bg-thai-green/10"
                )}
              >
                📱 Tablette
              </Button>
            )}
            <Button
              size="sm"
              variant={mode === "mobile" ? "default" : "outline"}
              onClick={() => onModeChange("mobile")}
              className={cn(
                mode === "mobile"
                  ? "bg-thai-green hover:bg-thai-green/90"
                  : "border-thai-green/30 text-thai-green hover:bg-thai-green/10"
              )}
            >
              📱 Mobile
            </Button>
          </div>
        )}
      </div>

      {/* Container principal avec slider vertical à gauche */}
      <div className={cn("flex gap-4", showSizeControls && isDevice && "items-stretch")}>
        {/* Slider vertical à gauche */}
        {showSizeControls && isDevice && (
          <div className="flex flex-col items-center gap-2 py-2">
            {/* Valeur en haut */}
            <span className="text-thai-green text-xs font-bold whitespace-nowrap">
              {currentWidth}px
            </span>

            {/* Slider vertical */}
            <div className="relative flex min-h-[200px] flex-1 items-center justify-center">
              <input
                type="range"
                min={mode === "mobile" ? 240 : 480}
                max={mode === "mobile" ? 430 : 1024}
                value={currentWidth}
                onChange={(e) => {
                  const width = parseInt(e.target.value)
                  if (mode === "mobile") {
                    handleMobileWidthChange(width)
                  } else {
                    handleTabletWidthChange(width)
                  }
                }}
                className="accent-thai-green h-2 cursor-pointer appearance-none rounded-lg bg-gray-200"
                style={{
                  writingMode: "vertical-lr",
                  direction: "rtl",
                  width: "200px",
                  height: "8px",
                }}
              />
            </div>

            {/* Presets verticaux */}
            <div className="flex flex-col gap-1">
              {mode === "mobile" ? (
                <>
                  <Button
                    size="sm"
                    variant={mobileWidth === 280 ? "default" : "outline"}
                    onClick={() => handleMobileWidthChange(280)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 280
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    280
                  </Button>
                  <Button
                    size="sm"
                    variant={mobileWidth === 320 ? "default" : "outline"}
                    onClick={() => handleMobileWidthChange(320)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 320
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    SE
                  </Button>
                  <Button
                    size="sm"
                    variant={mobileWidth === 375 ? "default" : "outline"}
                    onClick={() => handleMobileWidthChange(375)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 375
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    12
                  </Button>
                  <Button
                    size="sm"
                    variant={mobileWidth === 390 ? "default" : "outline"}
                    onClick={() => handleMobileWidthChange(390)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 390
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    14
                  </Button>
                  <Button
                    size="sm"
                    variant={mobileWidth === 414 ? "default" : "outline"}
                    onClick={() => handleMobileWidthChange(414)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      mobileWidth === 414
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    Plus
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant={tabletWidth === 600 ? "default" : "outline"}
                    onClick={() => handleTabletWidthChange(600)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      tabletWidth === 600
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    600
                  </Button>
                  <Button
                    size="sm"
                    variant={tabletWidth === 768 ? "default" : "outline"}
                    onClick={() => handleTabletWidthChange(768)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      tabletWidth === 768
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    Mini
                  </Button>
                  <Button
                    size="sm"
                    variant={tabletWidth === 820 ? "default" : "outline"}
                    onClick={() => handleTabletWidthChange(820)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      tabletWidth === 820
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    Air
                  </Button>
                  <Button
                    size="sm"
                    variant={tabletWidth === 1024 ? "default" : "outline"}
                    onClick={() => handleTabletWidthChange(1024)}
                    className={cn(
                      "h-5 px-1.5 text-[9px]",
                      tabletWidth === 1024
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
                    )}
                  >
                    Pro
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Container de prévisualisation */}
        <div
          className={cn(
            "mx-auto transition-all duration-300",
            isDevice && ["rounded-[1.5rem] border-[3px] p-1.5 shadow-lg", colors.border, colors.bg],
            !isDevice && "w-full"
          )}
          style={isDevice ? { maxWidth: `${currentWidth}px` } : undefined}
        >
          {/* Encoche (notch) - uniquement mobile */}
          {mode === "mobile" && showNotch && (
            <div className="mb-1 flex justify-center">
              <div className={cn("relative h-3 w-16 rounded-b-lg", colors.notch)}>
                <div
                  className={cn(
                    "absolute top-0.5 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full",
                    colors.notchInner
                  )}
                />
              </div>
            </div>
          )}

          {/* Barre supérieure tablette (caméra) */}
          {mode === "tablet" && showNotch && (
            <div className="mb-1 flex justify-center">
              <div className={cn("h-2 w-2 rounded-full", colors.notchInner)} />
            </div>
          )}

          {/* Contenu */}
          <div
            className={cn(
              "bg-white",
              isDevice && "min-h-[200px] overflow-hidden rounded-2xl",
              contentClassName
            )}
          >
            {displayContent}
          </div>

          {/* Barre home */}
          {isDevice && showHomeBar && (
            <div className="mt-2 flex justify-center">
              <div
                className={cn(
                  "h-1 rounded-full",
                  colors.homeBar,
                  mode === "mobile" ? "w-32" : "w-40"
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook utilitaire pour gérer le state du preview mode
export function usePreviewMode(initialMode: PreviewMode = "desktop") {
  const [mode, setMode] = useState<PreviewMode>(initialMode)
  return {
    mode,
    setMode,
    isDesktop: mode === "desktop",
    isTablet: mode === "tablet",
    isMobile: mode === "mobile",
    isDevice: mode === "mobile" || mode === "tablet",
  }
}

// Export du type pour usage externe
export type { PreviewMode, DeviceSize }
