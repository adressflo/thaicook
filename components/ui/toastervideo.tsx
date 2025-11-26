"use client"

import { useToastVideo } from "@/hooks/use-toast-video"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  titleColorMap,
  descriptionColorMap,
  fontWeightMap,
  positionClassMap,
  type BorderColor,
  type ShadowSize,
  type MaxWidth,
  type TitleColor,
  type DescriptionColor,
  type ToastPosition,
  type FontWeight,
} from "@/components/ui/toast"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// Maps pour les classes CSS (reutilisation de toast.tsx)
const borderColorMap: Record<BorderColor, string> = {
  "thai-orange": "border-thai-orange",
  "thai-green": "border-thai-green",
  "red": "border-red-500",
  "blue": "border-blue-500",
  "yellow": "border-yellow-500",
  "purple": "border-purple-500",
  "custom": "",
}

const shadowSizeMap: Record<ShadowSize, string> = {
  "none": "shadow-none",
  "sm": "shadow-sm",
  "md": "shadow-md",
  "lg": "shadow-lg",
  "xl": "shadow-xl",
  "2xl": "shadow-2xl",
}

const maxWidthMap: Record<MaxWidth, string> = {
  "xs": "max-w-[280px]",
  "sm": "max-w-[320px]",
  "md": "max-w-[400px]",
  "lg": "max-w-[500px]",
  "xl": "max-w-[600px]",
}

export function ToasterVideo() {
  const { toasts, dismiss } = useToastVideo()

  // Grouper les toasts par position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || "bottom-right"
    if (!acc[position]) acc[position] = []
    acc[position].push(toast)
    return acc
  }, {} as Record<ToastPosition, typeof toasts>)

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
              "fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 md:max-w-fit",
              position === "custom"
                ? ""
                : positionClassMap[position as ToastPosition]
            )}
            style={position === "custom" ? getCustomPositionStyle(
              positionToasts[0]?.customX,
              positionToasts[0]?.customY
            ) : undefined}
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
  aspectRatio?: "16:9" | "4:5" | "1:1"
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
  loopVideo?: boolean
  showCloseButton?: boolean
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
  aspectRatio,
  // Props de style
  borderColor = "thai-orange",
  customBorderColor,
  borderWidth = 2,
  customBorderWidth,
  shadowSize = "2xl",
  maxWidth = "md",
  titleColor = "thai-green",
  titleFontWeight = "bold",
  descriptionColor = "thai-green",
  descriptionFontWeight = "semibold",
  animateBorder = false,
  hoverScale = false,
  loopVideo = false,
  showCloseButton = true,
  ...props
}: ToastVideoItemProps) {
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)

  useEffect(() => {
    if (!media || !mediaRef.current) return

    const element = mediaRef.current

    // Pour les videos : detection automatique de la fin (si pas de loop)
    if (element instanceof HTMLVideoElement && !loopVideo) {
      const handleVideoEnd = () => {
        dismiss(id)
      }
      element.addEventListener("ended", handleVideoEnd)
      return () => element.removeEventListener("ended", handleVideoEnd)
    }

    // Pour les images : delai selon le type
    if (element instanceof HTMLImageElement) {
      // GIF anime : 3 secondes
      // Images statiques (svg, png, jpeg) : 1 seconde
      const isGif = media.toLowerCase().endsWith(".gif")
      const delay = isGif ? 3000 : 1000

      const timer = setTimeout(() => {
        dismiss(id)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [media, id, dismiss, loopVideo])

  // Map aspect ratio to Tailwind classes
  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:5": "aspect-[4/5]",
    "1:1": "aspect-square",
  }

  // Calcul des classes dynamiques pour la bordure
  const borderColorClass = borderColor === "custom" && customBorderColor
    ? customBorderColor
    : borderColorMap[borderColor]

  const borderWidthClass = borderWidth === "custom" && customBorderWidth
    ? ""
    : `border-${borderWidth}`

  const borderWidthStyle = borderWidth === "custom" && customBorderWidth
    ? { borderWidth: `${customBorderWidth}px` }
    : {}

  return (
    <Toast
      {...props}
      className={cn(
        "flex-col items-center bg-white transition-all duration-300",
        // Ombre
        shadowSizeMap[shadowSize],
        // Animation bordure
        animateBorder && "animate-moving-border",
        // Hover scale
        hoverScale && "hover:scale-105",
        // Style polaroid ou standard
        polaroid
          ? cn(
              "p-[10px_10px_20px_10px]",
              borderColorClass,
              borderWidthClass
            )
          : cn(
              "min-w-[320px] overflow-hidden rounded-xl p-0",
              borderColorClass,
              borderWidthClass,
              maxWidthMap[maxWidth]
            ),
        props.className
      )}
      style={borderWidthStyle}
    >
      {/* Section image/video */}
      {media && (
        <div
          className={cn(
            "w-full overflow-hidden",
            polaroid && cn("border", borderColorClass),
            aspectRatio && aspectRatioClass[aspectRatio as keyof typeof aspectRatioClass]
          )}
        >
          {media.endsWith(".mp4") || media.endsWith(".webm") ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={media}
              autoPlay
              loop={loopVideo}
              muted
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={media}
              alt="Toast media"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      )}

      {/* Section contenu */}
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
            {title}
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
                scrollingText && scrollDuration
                  ? ({ "--marquee-duration": `${scrollDuration}s` } as React.CSSProperties)
                  : undefined
              }
            >
              {description}
            </ToastDescription>
          </div>
        )}
        {action}
      </div>

      {showCloseButton && (
        <ToastClose
          className={cn(
            "absolute top-2 right-2 rounded-full p-1 transition-opacity hover:text-white/80",
            polaroid
              ? cn(titleColorMap[titleColor], "hover:bg-thai-green/10")
              : "bg-black/30 text-white hover:bg-black/50"
          )}
        />
      )}
    </Toast>
  )
}
