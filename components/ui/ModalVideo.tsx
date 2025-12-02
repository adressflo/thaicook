"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

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
  autoClose?: boolean // Si true, affiche le bouton X de fermeture (défaut: true)

  // Couleurs personnalisées (utiliser balises dans title et description)
  // Balises couleur : <orange>, <green>, <white>, <gold>, <black>
  // Balises style : <bold>, <semi-bold>
  titleColor?: "thai-green" | "thai-orange" | "white" | "black" | "thai-gold" // Couleur par défaut du titre (défaut: "thai-green")
  titleFontWeight?: "normal" | "medium" | "semibold" | "bold" // Poids police titre - IDENTIQUE à ToasterVideo
  descriptionColor?: "thai-green" | "thai-orange" | "white" | "black" | "thai-gold" // Couleur description - IDENTIQUE à ToasterVideo
  descriptionFontWeight?: "normal" | "medium" | "semibold" | "bold" // Poids police description - IDENTIQUE à ToasterVideo

  // Boutons d'action
  buttonLayout?: "none" | "single" | "double" | "triple" // Layout des boutons (0, 1, 2, ou 3 boutons)
  cancelText?: string
  confirmText?: string
  thirdButtonText?: string // Texte du 3ème bouton (pour layout "triple")
  onCancel?: () => void
  onConfirm?: () => void
  onThirdButton?: () => void // Callback du 3ème bouton

  // Navigation (redirection vers pages)
  cancelLink?: string // URL de redirection pour le bouton Annuler
  confirmLink?: string // URL de redirection pour le bouton Confirmer
  thirdButtonLink?: string // URL de redirection pour le 3ème bouton

  // Mode standalone pour aperçu
  standalone?: boolean

  // Style Dialog - Nouvelles propriétés configurables
  rotation?: boolean // Active l'animation rotate-[-2deg] hover:rotate-0 (comme modal "Installer l'Application")
  maxWidth?: "sm" | "md" | "lg" | "xl" | "custom" // Taille du modal
  customWidth?: string // Largeur personnalisée (ex: "600px", "90vw") - utilisé si maxWidth="custom"
  customHeight?: string // Hauteur personnalisée (ex: "400px", "80vh")
  borderColor?: "thai-orange" | "thai-green" | "red" | "blue" | string // Couleur bordure (string pour custom)
  borderWidth?: number // Épaisseur bordure (1, 2, 4, ou custom)
  shadowSize?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" // Taille ombre - IDENTIQUE à ToasterVideo
  animateBorder?: boolean // Animation bordure pulsante (défaut: false)
  animateOut?: boolean // Animation de sortie (fade-out + zoom-out)
  mangaExplosion?: boolean // Animation Manga Explosion (orange thai)
  hoverScale?: boolean // Effet scale au hover (défaut: false)

  // Polaroid cadre custom (padding)
  polaroidPaddingSides?: number // Padding gauche/droite (défaut 3)
  polaroidPaddingTop?: number // Padding haut (défaut 3)
  polaroidPaddingBottom?: number // Padding bas (défaut 8)

  // Animation typing
  typingAnimation?: boolean // Animation dactylographie (typing)
  typingSpeed?: number // Vitesse de l'animation typing (ms par caractère, défaut 100)
  typingTarget?: "title" | "description" | "both" // Cible de l'animation (défaut: "description")

  // Synchronisation marquee avec vidéo
  scrollSyncWithVideo?: boolean // Si true, la durée du marquee = durée vidéo × loopCount (défaut: false)

  // Position du modal
  position?: "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "custom" // Position du modal (défaut: "center")
  customX?: string // Position X custom (ex: "10px", "50%") - utilisé si position="custom"
  customY?: string // Position Y custom (ex: "20px", "80vh") - utilisé si position="custom"
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
  autoClose = true, // Par défaut, bouton X visible
  buttonLayout = "double",
  cancelText = "Annuler",
  confirmText = "Confirmer",
  thirdButtonText = "Action",
  onCancel,
  onConfirm,
  onThirdButton,
  cancelLink,
  confirmLink,
  thirdButtonLink,
  standalone = false,
  borderColor = "thai-orange",
  borderWidth = 2,
  shadowSize = "2xl",
  animateBorder = false,
  hoverScale = false,
  polaroidPaddingSides = 3,
  polaroidPaddingTop = 3,
  polaroidPaddingBottom = 8,
  titleColor = "thai-green",
  titleFontWeight = "bold",
  descriptionColor = "thai-green",
  descriptionFontWeight = "semibold",
  typingAnimation = false,
  typingSpeed = 100,
  typingTarget = "description",
  scrollSyncWithVideo = false,
}: Omit<ModalVideoProps, "isOpen"> & { onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playCount, setPlayCount] = useState(0)
  const [syncedScrollDuration, setSyncedScrollDuration] = useState<number | null>(null)

  // Map aspect ratio to Tailwind classes
  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:5": "aspect-[4/5]",
    "1:1": "aspect-square",
    auto: "", // Pas de contrainte d'aspect ratio
  }

  // Map title colors to Tailwind classes
  const titleColorClass: Record<string, string> = {
    "thai-green": "text-thai-green",
    "thai-orange": "text-thai-orange",
    white: "text-white",
    black: "text-black",
    "thai-gold": "text-thai-gold",
  }

  // Map description colors - IDENTIQUE à ToasterVideo
  const descriptionColorClass: Record<string, string> = {
    "thai-green": "text-thai-green",
    "thai-orange": "text-thai-orange",
    white: "text-white",
    black: "text-black",
    "thai-gold": "text-thai-gold",
  }

  // Map font weights - IDENTIQUE à ToasterVideo
  const fontWeightClass: Record<string, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }

  // Fonction pour parser les balises de couleur et style dans le texte (avec support imbriqué)
  const parseColoredText = (text: string | React.ReactNode, depth: number = 0): React.ReactNode => {
    if (typeof text !== "string") return text

    // Map des classes Tailwind pour couleurs et styles
    const styleMap: Record<string, string> = {
      // Couleurs
      orange: "text-thai-orange",
      green: "text-thai-green",
      white: "text-white",
      gold: "text-thai-gold",
      black: "text-black",
      // Styles
      bold: "font-bold",
      "semi-bold": "font-semibold",
    }

    // Regex pour trouver la PREMIÈRE balise (pas greedy pour supporter imbrication)
    const regex = /<(orange|green|white|gold|black|bold|semi-bold)>(.*?)<\/\1>/
    const match = text.match(regex)

    if (!match) {
      // Aucune balise trouvée, retourner le texte tel quel
      return text
    }

    const [fullMatch, tag, content] = match
    const beforeMatch = text.substring(0, match.index!)
    const afterMatch = text.substring(match.index! + fullMatch.length)

    // Construire le résultat avec récursion pour gérer les balises imbriquées
    const parts: React.ReactNode[] = []

    // Texte avant la balise
    if (beforeMatch) {
      parts.push(
        <React.Fragment key={`before-${depth}-${match.index}`}>
          {parseColoredText(beforeMatch, depth + 1)}
        </React.Fragment>
      )
    }

    // Contenu de la balise (parser récursivement pour balises imbriquées)
    parts.push(
      <span key={`tag-${depth}-${match.index}`} className={styleMap[tag]}>
        {parseColoredText(content, depth + 1)}
      </span>
    )

    // Texte après la balise (parser récursivement pour autres balises)
    if (afterMatch) {
      parts.push(
        <React.Fragment key={`after-${depth}-${match.index}`}>
          {parseColoredText(afterMatch, depth + 1)}
        </React.Fragment>
      )
    }

    return <>{parts}</>
  }

  const borderWidthClass = {
    1: "border",
    2: "border-2",
    4: "border-4",
  }

  // Map des couleurs de bordure - IDENTIQUE à ToasterVideo
  const borderColorMap: Record<string, string> = {
    "thai-orange": "border-thai-orange",
    "thai-green": "border-thai-green",
    red: "border-red-500",
    blue: "border-blue-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
  }

  // Classe de couleur de bordure calculée - IDENTIQUE à ToasterVideo
  const borderColorClass = borderColor in borderColorMap ? borderColorMap[borderColor] : ""

  // Map des tailles d'ombre - IDENTIQUE à ToasterVideo
  const shadowSizeMap: Record<string, string> = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  }

  // Map des couleurs hex pour l'animation de bordure dynamique
  const borderColorHexMap: Record<
    string,
    { base: string; light: string; rgba: string; rgbaStrong: string }
  > = {
    "thai-orange": {
      base: "#ff7b54",
      light: "#ffb386",
      rgba: "rgba(255, 123, 84, 0.4)",
      rgbaStrong: "rgba(255, 123, 84, 0.6)",
    },
    "thai-green": {
      base: "#2d5016",
      light: "#4a7c23",
      rgba: "rgba(45, 80, 22, 0.4)",
      rgbaStrong: "rgba(45, 80, 22, 0.6)",
    },
    red: {
      base: "#ef4444",
      light: "#f87171",
      rgba: "rgba(239, 68, 68, 0.4)",
      rgbaStrong: "rgba(239, 68, 68, 0.6)",
    },
    blue: {
      base: "#3b82f6",
      light: "#60a5fa",
      rgba: "rgba(59, 130, 246, 0.4)",
      rgbaStrong: "rgba(59, 130, 246, 0.6)",
    },
    yellow: {
      base: "#eab308",
      light: "#facc15",
      rgba: "rgba(234, 179, 8, 0.4)",
      rgbaStrong: "rgba(234, 179, 8, 0.6)",
    },
    purple: {
      base: "#a855f7",
      light: "#c084fc",
      rgba: "rgba(168, 85, 247, 0.4)",
      rgbaStrong: "rgba(168, 85, 247, 0.6)",
    },
  }

  // Variables CSS pour l'animation de bordure dynamique
  const getMovingBorderStyle = (): React.CSSProperties => {
    if (!animateBorder) return {}
    const colorKey = borderColor in borderColorHexMap ? borderColor : "thai-orange"
    const colors = borderColorHexMap[colorKey]
    return {
      "--moving-border-color": colors.base,
      "--moving-border-light": colors.light,
      "--moving-border-glow": colors.rgba,
      "--moving-border-glow-strong": colors.rgbaStrong,
    } as React.CSSProperties
  }

  // Détection du type de média
  const isVideo = media?.endsWith(".mp4") || media?.endsWith(".webm")

  // Calcul de la durée synchronisée du marquee avec la vidéo
  useEffect(() => {
    if (!scrollSyncWithVideo || !isVideo || !videoRef.current) return

    const video = videoRef.current

    const handleLoadedMetadata = () => {
      const videoDuration = video.duration
      // loopCount = 0 signifie infini, on utilise scrollDuration par défaut dans ce cas
      if (loopCount === 0) {
        setSyncedScrollDuration(null) // Utiliser scrollDuration manuel
      } else {
        // Durée totale = durée vidéo × nombre de lectures
        const totalDuration = videoDuration * loopCount
        setSyncedScrollDuration(totalDuration)
      }
    }

    // Si les metadata sont déjà chargées
    if (video.readyState >= 1) {
      handleLoadedMetadata()
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata)
      return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [scrollSyncWithVideo, isVideo, loopCount, media])

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
    if (cancelLink) {
      router.push(cancelLink as any)
    }
    if (!standalone) {
      onOpenChange(false)
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    if (confirmLink) {
      router.push(confirmLink as any)
    }
    if (!standalone) {
      onOpenChange(false)
    }
  }

  const handleThirdButton = () => {
    if (onThirdButton) {
      onThirdButton()
    }
    if (thirdButtonLink) {
      router.push(thirdButtonLink as any)
    }
    if (!standalone) {
      onOpenChange(false)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col transition-transform duration-300",
        standalone ? "h-full" : "",
        standalone && hoverScale && "hover:scale-105"
      )}
    >
      {/* Bouton close (seulement si pas standalone ET si autoClose activé) */}
      {!standalone && autoClose && (
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-20 rounded-full p-1.5 text-white/80 transition-all duration-200 hover:bg-black/20 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Mode Polaroid : TOUT dans le cadre (média + contenu) - IDENTIQUE à ToasterVideo */}
      {polaroid ? (
        <div
          className={cn(
            "border-solid bg-white",
            shadowSizeMap[shadowSize],
            !animateBorder && borderColorClass,
            animateBorder && "animate-moving-border"
          )}
          style={{
            padding: `${polaroidPaddingTop * 0.25}rem ${polaroidPaddingSides * 0.25}rem ${polaroidPaddingBottom * 0.25}rem`,
            borderWidth: `${borderWidth}px`,
            ...getMovingBorderStyle(),
          }}
        >
          {/* Cadre intérieur avec bordure autour du media */}
          {media && (
            <div
              className={cn(
                "relative w-full overflow-hidden border-solid",
                aspectRatioClass[aspectRatio],
                borderColorClass
              )}
              style={{ borderWidth: `${borderWidth}px` }}
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
                <img src={media} alt="Modal media" className="h-full w-full object-cover" />
              )}
            </div>
          )}

          {/* Contenu texte À L'INTÉRIEUR du cadre Polaroid */}
          <div className="mt-4 space-y-3">
            {title && (
              <h3
                className={cn(
                  "text-center text-xl",
                  titleColorClass[titleColor],
                  fontWeightClass[titleFontWeight]
                )}
              >
                {typingAnimation && (typingTarget === "title" || typingTarget === "both") ? (
                  <TypingAnimation duration={typingSpeed}>
                    {parseColoredText(title)}
                  </TypingAnimation>
                ) : (
                  parseColoredText(title)
                )}
              </h3>
            )}
            {description && (
              <div className={cn("w-full", scrollingText && "overflow-hidden")}>
                <p
                  className={cn(
                    "text-center text-sm leading-relaxed",
                    descriptionColorClass[descriptionColor],
                    fontWeightClass[descriptionFontWeight],
                    scrollingText && "animate-marquee inline-block whitespace-nowrap"
                  )}
                  style={
                    scrollingText
                      ? ({
                          "--marquee-duration": `${syncedScrollDuration ?? scrollDuration}s`,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  {typingAnimation &&
                  (typingTarget === "description" || typingTarget === "both") ? (
                    <TypingAnimation duration={typingSpeed}>
                      {parseColoredText(description)}
                    </TypingAnimation>
                  ) : (
                    parseColoredText(description)
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Boutons d'action À L'INTÉRIEUR du cadre Polaroid */}
          {buttonLayout !== "none" && (
            <div className={cn("mt-4 flex gap-3", buttonLayout === "single" && "justify-center")}>
              {buttonLayout === "single" && (
                <Button
                  onClick={handleConfirm}
                  className="bg-thai-orange hover:bg-thai-orange/90 rounded-lg px-8 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  {confirmText}
                </Button>
              )}
              {buttonLayout === "double" && (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-thai-green text-thai-green hover:bg-thai-green flex-1 rounded-lg border-2 transition-all duration-200 hover:text-white"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="bg-thai-orange hover:bg-thai-orange/90 flex-1 rounded-lg text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    {confirmText}
                  </Button>
                </>
              )}
              {buttonLayout === "triple" && (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-thai-green text-thai-green hover:bg-thai-green flex-1 rounded-lg border-2 transition-all duration-200 hover:text-white"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="bg-thai-orange hover:bg-thai-orange/90 flex-1 rounded-lg text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    {confirmText}
                  </Button>
                  <Button
                    onClick={handleThirdButton}
                    className="bg-thai-gold hover:bg-thai-gold/90 flex-1 rounded-lg text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    {thirdButtonText}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Mode normal : média séparé du contenu */}
          {media && (
            <div className={cn("relative w-full", standalone && "shrink-0")}>
              <div className={cn("relative w-full overflow-hidden", aspectRatioClass[aspectRatio])}>
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
                  <img src={media} alt="Modal media" className="h-full w-full object-cover" />
                )}
              </div>
            </div>
          )}

          {/* Section contenu (mode normal) */}
          <div className={cn("space-y-4 bg-white p-6", standalone && "flex flex-1 flex-col")}>
            <div className={cn("space-y-3", standalone && "flex-1")}>
              {title && (
                <h3
                  className={cn(
                    "text-center text-2xl",
                    titleColorClass[titleColor],
                    fontWeightClass[titleFontWeight]
                  )}
                >
                  {typingAnimation && (typingTarget === "title" || typingTarget === "both") ? (
                    <TypingAnimation duration={typingSpeed}>
                      {parseColoredText(title)}
                    </TypingAnimation>
                  ) : (
                    parseColoredText(title)
                  )}
                </h3>
              )}
              {description && (
                <div className={cn("w-full", scrollingText && "overflow-hidden")}>
                  <p
                    className={cn(
                      "text-center text-base leading-relaxed",
                      descriptionColorClass[descriptionColor],
                      fontWeightClass[descriptionFontWeight],
                      scrollingText && "animate-marquee inline-block whitespace-nowrap"
                    )}
                    style={
                      scrollingText
                        ? ({
                            "--marquee-duration": `${syncedScrollDuration ?? scrollDuration}s`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {typingAnimation &&
                    (typingTarget === "description" || typingTarget === "both") ? (
                      <TypingAnimation duration={typingSpeed}>
                        {parseColoredText(description)}
                      </TypingAnimation>
                    ) : (
                      parseColoredText(description)
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Boutons d'action (mode normal) */}
            {buttonLayout !== "none" && (
              <div className={cn("flex gap-3", buttonLayout === "single" && "justify-center")}>
                {buttonLayout === "single" && (
                  <Button
                    onClick={handleConfirm}
                    className="bg-thai-orange hover:bg-thai-orange/90 rounded-lg px-8 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    {confirmText}
                  </Button>
                )}
                {buttonLayout === "double" && (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-thai-green text-thai-green hover:bg-thai-green flex-1 rounded-lg border-2 transition-all duration-200 hover:text-white"
                    >
                      {cancelText}
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="bg-thai-orange hover:bg-thai-orange/90 flex-1 rounded-lg text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                    >
                      {confirmText}
                    </Button>
                  </>
                )}
                {buttonLayout === "triple" && (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-thai-green text-thai-green hover:bg-thai-green flex-1 rounded-lg border-2 transition-all duration-200 hover:text-white"
                    >
                      {cancelText}
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="bg-thai-orange hover:bg-thai-orange/90 flex-1 rounded-lg text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                    >
                      {confirmText}
                    </Button>
                    <Button
                      onClick={handleThirdButton}
                      className="bg-thai-gold hover:bg-thai-gold/90 flex-1 rounded-lg text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                    >
                      {thirdButtonText}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
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
  animateBorder = false,
  animateOut = true,
  mangaExplosion = false,
  hoverScale = false,
  position = "center",
  customX,
  customY,
  ...props
}: ModalVideoProps) {
  // Mapping des classes Tailwind
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    custom: "", // Pas de classe max-w si custom
  }

  // Map des couleurs de bordure
  const borderColorMap: Record<string, string> = {
    "thai-orange": "border-thai-orange",
    "thai-green": "border-thai-green",
    red: "border-red-500",
    blue: "border-blue-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
  }

  // Classe de couleur de bordure calculée
  const borderColorClass = borderColor in borderColorMap ? borderColorMap[borderColor] : ""

  const borderWidthClass = {
    1: "border",
    2: "border-2",
    4: "border-4",
  }

  // Map des tailles d'ombre - IDENTIQUE à ToasterVideo
  const shadowClass: Record<string, string> = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  }

  // Map des couleurs hex pour l'animation de bordure dynamique
  const borderColorHexMap: Record<
    string,
    { base: string; light: string; rgba: string; rgbaStrong: string }
  > = {
    "thai-orange": {
      base: "#ff7b54",
      light: "#ffb386",
      rgba: "rgba(255, 123, 84, 0.4)",
      rgbaStrong: "rgba(255, 123, 84, 0.6)",
    },
    "thai-green": {
      base: "#2d5016",
      light: "#4a7c23",
      rgba: "rgba(45, 80, 22, 0.4)",
      rgbaStrong: "rgba(45, 80, 22, 0.6)",
    },
    red: {
      base: "#ef4444",
      light: "#f87171",
      rgba: "rgba(239, 68, 68, 0.4)",
      rgbaStrong: "rgba(239, 68, 68, 0.6)",
    },
    blue: {
      base: "#3b82f6",
      light: "#60a5fa",
      rgba: "rgba(59, 130, 246, 0.4)",
      rgbaStrong: "rgba(59, 130, 246, 0.6)",
    },
    yellow: {
      base: "#eab308",
      light: "#facc15",
      rgba: "rgba(234, 179, 8, 0.4)",
      rgbaStrong: "rgba(234, 179, 8, 0.6)",
    },
    purple: {
      base: "#a855f7",
      light: "#c084fc",
      rgba: "rgba(168, 85, 247, 0.4)",
      rgbaStrong: "rgba(168, 85, 247, 0.6)",
    },
  }

  // Variables CSS pour l'animation de bordure dynamique
  const getMovingBorderStyle = (): React.CSSProperties => {
    if (!animateBorder) return {}
    const colorKey = borderColor in borderColorHexMap ? borderColor : "thai-orange"
    const colors = borderColorHexMap[colorKey]
    return {
      "--moving-border-color": colors.base,
      "--moving-border-light": colors.light,
      "--moving-border-glow": colors.rgba,
      "--moving-border-glow-strong": colors.rgbaStrong,
    } as React.CSSProperties
  }

  // Mapping des positions
  const positionClass = {
    center: "!left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%]",
    "bottom-right": "!left-auto !top-auto !right-4 !bottom-4 !translate-x-0 !translate-y-0",
    "bottom-left": "!left-4 !top-auto !right-auto !bottom-4 !translate-x-0 !translate-y-0",
    "top-right": "!left-auto !top-4 !right-4 !bottom-auto !translate-x-0 !translate-y-0",
    "top-left": "!left-4 !top-4 !right-auto !bottom-auto !translate-x-0 !translate-y-0",
    custom: "!left-auto !top-auto !right-auto !bottom-auto !translate-x-0 !translate-y-0", // Classes custom via style inline
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          maxWidthClass[maxWidth],
          "fixed z-50 grid w-full gap-4 p-0",
          // Mode Polaroid : IDENTIQUE à ToasterVideo - bg-transparent p-0 border-0 (ombre sur Polaroid frame)
          props.polaroid
            ? cn(
                "border-0 bg-transparent p-0",
                // PAS de shadow ici - elle est sur le Polaroid frame dans ModalVideoContent
                hoverScale && "hover:scale-105",
                rotation && "-rotate-2 hover:rotate-0",
                animateBorder && "overflow-visible!"
              )
            : cn(
                "border-solid bg-white",
                borderWidth in borderWidthClass
                  ? borderWidthClass[borderWidth as keyof typeof borderWidthClass]
                  : "",
                borderColorClass,
                animateBorder && "animate-moving-border",
                shadowClass[shadowSize],
                rotation && "-rotate-2 transition-transform duration-300 hover:rotate-0",
                hoverScale && "transition-transform duration-300 hover:scale-105"
              ),
          // Position du modal
          positionClass[position],
          // Animation de sortie
          !animateOut &&
            !mangaExplosion &&
            "data-[state=closed]:animate-none! data-[state=closed]:duration-0!",
          // Si Manga Explosion est actif, on désactive les animations par défaut de Radix/Tailwind
          mangaExplosion &&
            "manga-explosion-modal-exit data-[state=closed]:zoom-out-100! data-[state=closed]:fade-out-100! data-[state=closed]:slide-out-to-left-1/2! data-[state=closed]:slide-out-to-top-[50%]! data-[state=closed]:duration-500!"
        )}
        style={{
          // Forcer styles en mode polaroid
          ...(props.polaroid
            ? {
                background: "transparent",
                border: "none",
                padding: 0,
                boxShadow: "none",
              }
            : {}),
          // Custom dimensions
          ...(maxWidth === "custom" && (customWidth || customHeight)
            ? {
                width: customWidth || undefined,
                maxWidth: customWidth || undefined,
                height: customHeight || undefined,
              }
            : {}),
          // Custom borderWidth (si borderWidth n'est pas dans borderWidthClass ET pas en mode polaroid)
          ...(!props.polaroid && !(borderWidth in borderWidthClass)
            ? { borderWidth: `${borderWidth}px` }
            : {}),
          // Custom position (si position="custom")
          ...(position === "custom" && (customX || customY)
            ? {
                left: customX || undefined,
                top: customY || undefined,
                transform: "none",
              }
            : {}),
          // Animation bordure dynamique (seulement si pas polaroid)
          ...(!props.polaroid ? getMovingBorderStyle() : {}),
        }}
        onInteractOutside={(e) => {
          // Si autoClose est false, empêcher la fermeture au clic sur le backdrop
          if (props.autoClose === false) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={(e) => {
          // Si autoClose est false, empêcher la fermeture avec Escape
          if (props.autoClose === false) {
            e.preventDefault()
          }
        }}
      >
        {/* Titres accessibles (cachés visuellement) */}
        <DialogTitle className="sr-only">{title || "Modal Vidéo"}</DialogTitle>
        <DialogDescription className="sr-only">
          {description || "Modal avec contenu vidéo ou image"}
        </DialogDescription>

        <ModalVideoContent
          onOpenChange={onOpenChange}
          title={title}
          description={description}
          borderColor={borderColor}
          borderWidth={borderWidth}
          shadowSize={shadowSize}
          animateBorder={animateBorder}
          hoverScale={hoverScale}
          titleColor={props.titleColor}
          {...props}
        />
      </DialogContent>
    </Dialog>
  )
}
