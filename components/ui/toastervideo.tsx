"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  descriptionColorMap,
  fontWeightMap,
  parseColoredText,
  positionClassMap,
  titleColorMap,
  type BorderColor,
  type DescriptionColor,
  type FontWeight,
  type MaxWidth,
  type RedirectBehavior,
  type ShadowSize,
  type TitleColor,
  type ToastPosition,
} from "@/components/ui/toast"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { useToastVideo } from "@/hooks/use-toast-video"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

// Maps pour les classes CSS (reutilisation de toast.tsx)
const borderColorMap: Record<BorderColor, string> = {
  "thai-orange": "border-thai-orange",
  "thai-green": "border-thai-green",
  red: "border-red-500",
  blue: "border-blue-500",
  yellow: "border-yellow-500",
  purple: "border-purple-500",
  custom: "",
}

const shadowSizeMap: Record<ShadowSize, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
}

const maxWidthMap: Record<MaxWidth, string> = {
  xs: "max-w-[280px]",
  sm: "max-w-[320px]",
  md: "max-w-[400px]",
  lg: "max-w-[500px]",
  xl: "max-w-[600px]",
}

// Map des couleurs hex pour l'animation de bordure dynamique
const borderColorHexMap: Record<
  BorderColor,
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
  custom: {
    base: "#2d5016",
    light: "#4a7c23",
    rgba: "rgba(45, 80, 22, 0.4)",
    rgbaStrong: "rgba(45, 80, 22, 0.6)",
  },
}

export function ToasterVideo() {
  const { toasts, dismiss } = useToastVideo()

  // Grouper les toasts par position
  const toastsByPosition = toasts.reduce(
    (acc, toast) => {
      const position = toast.position || "bottom-right"
      if (!acc[position]) acc[position] = []
      acc[position].push(toast)
      return acc
    },
    {} as Record<ToastPosition, typeof toasts>
  )

  // Generer le style custom pour les positions personnalisees
  const getCustomPositionStyle = (customX?: string, customY?: string) => {
    if (!customX && !customY) return {}
    return {
      top: customY || "50%",
      left: customX || "50%",
      transform: `translate(-50%, -50%)`,
    }
  }

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <ToastProvider key={position}>
          {positionToasts.map(
            ({
              id,
              title,
              description,
              action,
              media,
              duration,
              position: _toastPosition,
              scrollingText,
              scrollDuration,
              customX,
              customY,
              ...props
            }) => (
              <ToastVideoItem
                key={id}
                id={id}
                title={title}
                description={description}
                action={action}
                media={media}
                dismiss={dismiss}
                scrollingText={scrollingText}
                scrollDuration={scrollDuration}
                {...props}
              />
            )
          )}
          <ToastViewport
            className={cn(
              "fixed z-[9999] flex max-h-screen w-full flex-col-reverse p-4 md:max-w-fit",
              position === "custom" ? "" : positionClassMap[position as ToastPosition]
            )}
            style={
              position === "custom"
                ? getCustomPositionStyle(positionToasts[0]?.customX, positionToasts[0]?.customY)
                : undefined
            }
          />
        </ToastProvider>
      ))}
    </>
  )
}

interface ToastVideoItemProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  media?: string
  dismiss: (id: string) => void
  scrollingText?: boolean
  scrollDuration?: number
  polaroid?: boolean
  aspectRatio?: "16:9" | "4:5" | "1:1" | "auto"
  // Props de style
  borderColor?: BorderColor
  customBorderColor?: string
  borderWidth?: 1 | 2 | 4 | "custom"
  customBorderWidth?: number
  shadowSize?: ShadowSize
  maxWidth?: MaxWidth
  titleColor?: TitleColor
  titleFontWeight?: FontWeight
  descriptionColor?: DescriptionColor
  descriptionFontWeight?: FontWeight
  animateBorder?: boolean
  hoverScale?: boolean
  rotation?: boolean
  // Polaroid padding props
  polaroidPaddingSides?: number
  polaroidPaddingTop?: number
  polaroidPaddingBottom?: number
  // Animation typing
  typingAnimation?: boolean
  typingSpeed?: number
  // Synchronisation marquee avec vidéo
  scrollSyncWithVideo?: boolean // Si true, la durée du marquee = durée vidéo × playCount
  // Lecture video (remplace loopVideo)
  playCount?: 1 | 2 | "custom"
  customPlayCount?: number
  customDuration?: number
  // Redirection
  redirectUrl?: string
  redirectBehavior?: RedirectBehavior
  showCloseButton?: boolean
  animateOut?: boolean
  mangaExplosion?: boolean
  className?: string
  [key: string]: unknown
}

function ToastVideoItem({
  id,
  title,
  description,
  action,
  media,
  dismiss,
  scrollingText,
  scrollDuration,
  polaroid,
  aspectRatio = "auto",
  // Props de style - défaut vert pour polaroid
  borderColor: borderColorProp,
  customBorderColor,
  borderWidth: borderWidthProp,
  customBorderWidth,
  shadowSize = "2xl",
  maxWidth = "md",
  titleColor = "thai-green",
  titleFontWeight = "bold",
  descriptionColor = "thai-green",
  descriptionFontWeight = "semibold",
  animateBorder = false,
  hoverScale = false,
  rotation = false,
  // Polaroid padding props
  polaroidPaddingSides = 3,
  polaroidPaddingTop = 3,
  polaroidPaddingBottom = 8,
  // Animation typing
  typingAnimation = false,
  typingSpeed = 100,
  // Synchronisation marquee avec vidéo
  scrollSyncWithVideo = false,
  // Lecture video
  playCount = 1,
  customPlayCount,
  customDuration,
  // Redirection
  redirectUrl,
  redirectBehavior = "auto",
  showCloseButton = true,
  animateOut = true,
  mangaExplosion = false,
  ...props
}: ToastVideoItemProps) {
  // Défauts différents selon le mode polaroid
  const borderColor = borderColorProp ?? (polaroid ? "thai-green" : "thai-orange")
  const borderWidth = borderWidthProp ?? (polaroid ? 4 : 2)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | HTMLImageElement | null>(null)
  const playCountRef = useRef(0)
  const router = useRouter()
  const [syncedScrollDuration, setSyncedScrollDuration] = useState<number | null>(null)
  const [dismissCalled, setDismissCalled] = useState(false)
  const [currentCount, setCurrentCount] = useState(0)

  // Calculer le nombre de lectures cible
  const targetPlayCount =
    playCount === "custom" && customPlayCount
      ? customPlayCount
      : playCount === "custom"
        ? 1
        : playCount

  // Détection du type de média
  const isVideo = media?.endsWith(".mp4") || media?.endsWith(".webm")

  // Calcul de la durée synchronisée du marquee avec la vidéo
  useEffect(() => {
    if (!scrollSyncWithVideo || !isVideo || !videoElement) return

    const video = videoElement as HTMLVideoElement

    const handleLoadedMetadata = () => {
      const videoDuration = video.duration
      // Durée totale = durée vidéo × nombre de lectures
      const totalDuration = videoDuration * targetPlayCount
      setSyncedScrollDuration(totalDuration)
    }

    // Si les metadata sont déjà chargées
    if (video.readyState >= 1) {
      handleLoadedMetadata()
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata)
      return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [scrollSyncWithVideo, isVideo, targetPlayCount, media, videoElement])

  // Fonction de fermeture avec redirection - stabilisée avec useCallback
  const handleDismiss = useCallback(() => {
    setDismissCalled(true)
    dismiss(id)

    if (redirectUrl) {
      if (redirectBehavior === "auto") {
        router.push(redirectUrl as "/")
      } else if (redirectBehavior === "new-tab") {
        window.open(redirectUrl, "_blank")
      }
      // Pour "button", la redirection est gérée par le bouton
    }
  }, [dismiss, id, redirectUrl, redirectBehavior, router])

  // useEffect pour customDuration - indépendant de videoElement
  // Ceci garantit que le toast se ferme après customDuration ms même si le ref n'est pas encore set
  useEffect(() => {
    if (customDuration && customDuration > 0) {
      const timer = setTimeout(handleDismiss, customDuration)
      return () => clearTimeout(timer)
    }
  }, [customDuration, handleDismiss])

  useEffect(() => {
    if (!media || !videoElement) return

    const element = videoElement

    // Si customDuration est défini, le timer est déjà géré par le useEffect ci-dessus
    if (customDuration && customDuration > 0) {
      return
    }

    // Pour les videos : compter les lectures
    // Pour les videos : le comptage se fait via onEnded sur la balise video directement
    // Plus besoin de addEventListener ici
    if (element instanceof HTMLVideoElement) {
      // On garde juste le log pour debug
      console.log("Video element mounted via callback ref")
    }

    // Pour les images : delai selon le type
    if (element instanceof HTMLImageElement) {
      // GIF anime : 3 secondes
      // Images statiques (svg, png, jpeg) : 1 seconde
      const isGif = media.toLowerCase().endsWith(".gif")
      const delay = isGif ? 3000 : 1000

      const timer = setTimeout(() => {
        handleDismiss()
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [media, id, customDuration, targetPlayCount, videoElement])

  // Map aspect ratio to Tailwind classes
  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "4:5": "aspect-[4/5]",
    "1:1": "aspect-square",
    auto: "",
  }

  // Calcul des classes dynamiques pour la bordure
  const borderColorClass =
    borderColor === "custom" && customBorderColor ? customBorderColor : borderColorMap[borderColor]

  // Calcul de l'épaisseur de bordure (en pixels)
  const borderWidthValue =
    borderWidth === "custom" && customBorderWidth
      ? customBorderWidth
      : typeof borderWidth === "number"
        ? borderWidth
        : 2

  // Variables CSS pour l'animation de bordure dynamique
  const getMovingBorderStyle = (): React.CSSProperties => {
    if (!animateBorder) return {}
    const colorKey = borderColor === "custom" ? "thai-green" : borderColor
    const colors = borderColorHexMap[colorKey]
    return {
      "--moving-border-color":
        borderColor === "custom" && customBorderColor ? customBorderColor : colors.base,
      "--moving-border-light": colors.light,
      "--moving-border-glow": colors.rgba,
      "--moving-border-glow-strong": colors.rgbaStrong,
    } as React.CSSProperties
  }

  // Rendu du media (video ou image)
  const renderMedia = () => {
    if (!media) return null

    if (media.endsWith(".mp4") || media.endsWith(".webm")) {
      const handleVideoEnd = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const video = e.currentTarget
        playCountRef.current += 1
        setCurrentCount(playCountRef.current)
        console.log("Video ended (prop). Count:", playCountRef.current, "Target:", targetPlayCount)

        if (playCountRef.current >= targetPlayCount) {
          handleDismiss()
        } else {
          // Relancer la vidéo pour la prochaine lecture
          console.log("Replaying video...")
          video.currentTime = 0
          video.play()
        }
      }

      return (
        <video
          ref={setVideoElement}
          src={media}
          autoPlay
          loop={false}
          muted
          onEnded={handleVideoEnd}
          className="h-full w-full object-cover"
        />
      )
    }

    return (
      <img
        ref={setVideoElement}
        src={media}
        alt="Toast media"
        className="h-full w-full object-cover"
      />
    )
  }

  // Rendu du contenu texte
  const renderContent = () => (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-3",
        polaroid ? "mt-4 p-0" : "bg-white p-6"
      )}
    >
      {title && (
        <ToastTitle
          className={cn(
            "text-center text-xl",
            titleColorMap[titleColor],
            fontWeightMap[titleFontWeight]
          )}
        >
          {typingAnimation ? (
            <TypingAnimation duration={typingSpeed}>{parseColoredText(title)}</TypingAnimation>
          ) : (
            parseColoredText(title)
          )}
        </ToastTitle>
      )}
      {description && (
        <div className={cn("w-full", scrollingText && "overflow-hidden")}>
          <ToastDescription
            className={cn(
              "text-center text-sm leading-relaxed",
              descriptionColorMap[descriptionColor],
              fontWeightMap[descriptionFontWeight],
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
            {typingAnimation ? (
              <TypingAnimation duration={typingSpeed}>
                {parseColoredText(description)}
              </TypingAnimation>
            ) : (
              parseColoredText(description)
            )}
          </ToastDescription>
        </div>
      )}
      {action}
      {/* Bouton de redirection si behavior = button */}
      {redirectUrl && redirectBehavior === "button" && (
        <Link
          href={redirectUrl as "/"}
          className={cn(
            "mt-2 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
            "bg-thai-orange hover:bg-thai-orange/90 text-white"
          )}
        >
          Voir
        </Link>
      )}
    </div>
  )

  // Mode Polaroid : double cadre avec bordures synchronisées
  if (polaroid) {
    return (
      <Toast
        duration={Infinity}
        {...props}
        animateOut={animateOut}
        mangaExplosion={mangaExplosion}
        className={cn(
          "flex-col items-center border-0 bg-transparent p-0 transition-all duration-300",
          shadowSizeMap[shadowSize],
          hoverScale && "hover:scale-105",
          rotation && "-rotate-2 hover:rotate-0",
          maxWidthMap[maxWidth],
          animateBorder && "overflow-visible!",
          // Désactiver les animations si les deux sont false
          !animateOut &&
            !mangaExplosion &&
            "data-[state=closed]:animate-none! data-[state=closed]:duration-0!",
          // Animation fade-out + zoom-out + slide si animateOut=true (comme ModalVideo)
          animateOut &&
            !mangaExplosion &&
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:duration-200",
          // Animation Manga Explosion si mangaExplosion=true
          mangaExplosion && "manga-explosion-exit data-[state=closed]:duration-500!",
          props.className
        )}
      >
        {/* Cadre extérieur avec bordure */}
        <div
          className={cn(
            "border-solid bg-white",
            !animateBorder && borderColorClass,
            animateBorder && "animate-moving-border"
          )}
          style={{
            padding: `${polaroidPaddingTop * 0.25}rem ${polaroidPaddingSides * 0.25}rem ${polaroidPaddingBottom * 0.25}rem`,
            borderWidth: `${borderWidthValue}px`,
            ...getMovingBorderStyle(),
          }}
        >
          {/* Cadre intérieur avec bordure autour du media */}
          {media && (
            <div
              className={cn(
                "relative w-full overflow-hidden border-solid",
                aspectRatioClassMap[aspectRatio],
                borderColorClass
              )}
              style={{ borderWidth: `${borderWidthValue}px` }}
            >
              {renderMedia()}
            </div>
          )}

          {/* Contenu texte */}
          {renderContent()}
        </div>

        {showCloseButton && (
          <ToastClose
            className={cn(
              "absolute top-2 right-2 rounded-full p-1 opacity-100 transition-opacity hover:text-white/80",
              titleColorMap[titleColor],
              "hover:bg-thai-green/10"
            )}
          />
        )}
      </Toast>
    )
  }

  // Mode standard (non-polaroid)
  return (
    <Toast
      duration={Infinity}
      {...props}
      animateOut={animateOut}
      mangaExplosion={mangaExplosion}
      className={cn(
        "flex-col items-center bg-white transition-all duration-300",
        shadowSizeMap[shadowSize],
        animateBorder && "animate-moving-border",
        hoverScale && "hover:scale-105",
        rotation && "-rotate-2 hover:rotate-0",
        "min-w-[320px] overflow-hidden rounded-xl border-solid p-0",
        borderColorClass,
        maxWidthMap[maxWidth],
        // Désactiver les animations si les deux sont false
        !animateOut &&
          !mangaExplosion &&
          "data-[state=closed]:animate-none! data-[state=closed]:duration-0!",
        // Animation fade-out + zoom-out + slide si animateOut=true (comme ModalVideo)
        animateOut &&
          !mangaExplosion &&
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:duration-200",
        // Animation Manga Explosion si mangaExplosion=true
        mangaExplosion && "manga-explosion-exit data-[state=closed]:duration-500!",
        props.className
      )}
      style={{ borderWidth: `${borderWidthValue}px`, ...getMovingBorderStyle() }}
    >
      {/* Section image/video */}
      {media && (
        <div className={cn("w-full overflow-hidden", aspectRatioClassMap[aspectRatio])}>
          {renderMedia()}
        </div>
      )}

      {/* Section contenu */}
      {renderContent()}

      {showCloseButton && (
        <ToastClose
          className={cn(
            "absolute top-2 right-2 rounded-full p-1 opacity-100! transition-opacity hover:text-white/80",
            "bg-black/30 text-white hover:bg-black/50"
          )}
        />
      )}
    </Toast>
  )
}
