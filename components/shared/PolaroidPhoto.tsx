import { CSSProperties } from "react"
import { parseColoredText } from "@/components/ui/toast"

type AspectRatio = "16:9" | "4:5" | "1:1" | "auto"
type PolaroidPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center" | "custom"
type BorderColor = "thai-orange" | "thai-green" | "red" | "blue" | "custom"
type MaxWidth = "sm" | "md" | "lg" | "xl" | "custom"
type TitleColor = "thai-green" | "thai-orange" | "white" | "black"

interface PolaroidPhotoProps {
  src: string
  alt: string
  // Contenu (comme ModalVideo)
  title?: string
  description?: string
  titleColor?: TitleColor
  scrollingText?: boolean
  scrollDuration?: number
  // Position
  position?: PolaroidPosition
  customX?: string
  customY?: string
  // Taille
  size?: MaxWidth | number
  customSize?: number
  rotation?: number
  aspectRatio?: AspectRatio
  // Bordure
  borderColor?: BorderColor
  customBorderColor?: string
  borderWidth?: 1 | 2 | 4 | "custom"
  customBorderWidth?: number
  // Animations
  animateBorder?: boolean
  hoverScale?: boolean
  className?: string
}

export function PolaroidPhoto({
  src,
  alt,
  // Contenu
  title,
  description,
  titleColor = "thai-green",
  scrollingText = false,
  scrollDuration = 10,
  // Position
  position = "bottom-right",
  customX,
  customY,
  // Taille
  size = "md",
  customSize,
  rotation = 3,
  aspectRatio = "1:1",
  // Bordure
  borderColor = "thai-green",
  customBorderColor,
  borderWidth = 1,
  customBorderWidth,
  // Animations
  animateBorder = false,
  hoverScale = true,
  className = "",
}: PolaroidPhotoProps) {
  // Position classes
  const positionClasses: Record<PolaroidPosition, string> = {
    "bottom-right": "bottom-0 right-6 translate-y-[40%]",
    "bottom-left": "bottom-0 left-8 translate-y-[40%]",
    "top-right": "top-0 right-6 -translate-y-[40%]",
    "top-left": "top-0 left-8 -translate-y-[40%]",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "custom": "",
  }

  // Taille en pixels
  const sizeMap: Record<MaxWidth, number> = {
    sm: 96,
    md: 128,
    lg: 160,
    xl: 200,
    custom: customSize || 128,
  }
  const sizeInPx = typeof size === "number" ? size : sizeMap[size]

  // Calculer la hauteur en fonction de l'aspect ratio
  const getImageHeight = (): number | "auto" => {
    switch (aspectRatio) {
      case "16:9":
        return Math.round(sizeInPx * (9 / 16))
      case "4:5":
        return Math.round(sizeInPx * (5 / 4))
      case "1:1":
        return sizeInPx
      case "auto":
      default:
        return "auto"
    }
  }

  const imageHeight = getImageHeight()

  // Border color classes
  const borderColorClasses: Record<BorderColor, string> = {
    "thai-orange": "border-thai-orange",
    "thai-green": "border-thai-green",
    "red": "border-red-500",
    "blue": "border-blue-500",
    "custom": customBorderColor || "",
  }

  // Title color classes
  const titleColorClasses: Record<TitleColor, string> = {
    "thai-green": "text-thai-green",
    "thai-orange": "text-thai-orange",
    "white": "text-white",
    "black": "text-black",
  }

  // Border width
  const borderWidthValue = borderWidth === "custom" && customBorderWidth
    ? customBorderWidth
    : typeof borderWidth === "number"
      ? borderWidth
      : 1

  // Style pour rotation et dimensions
  const style: CSSProperties = {
    padding: "10px 10px 20px 10px",
    ...(position === "custom" && customX && customY ? {
      top: customY,
      left: customX,
      transform: "translate(-50%, -50%)",
    } : {}),
  }

  // Classes hover scale
  const hoverClasses = hoverScale
    ? "hover:scale-110 hover:rotate-0 hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
    : ""

  // Animation bordure
  const animateBorderClass = animateBorder ? "animate-moving-border" : ""

  return (
    <div
      className={`absolute ${positionClasses[position]} ${borderColorClasses[borderColor]} z-10 rotate-[var(--polaroid-rotation)] bg-white text-center shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-all duration-300 ${hoverClasses} ${animateBorderClass} ${className}`}
      style={
        {
          ...style,
          "--polaroid-rotation": `${rotation}deg`,
          borderWidth: `${borderWidthValue}px`,
        } as CSSProperties
      }
    >
      <img
        src={src}
        alt={alt}
        className={`mx-auto block object-cover ${borderColorClasses[borderColor]}`}
        style={{
          width: `${sizeInPx}px`,
          height: imageHeight === "auto" ? "auto" : `${imageHeight}px`,
          borderWidth: `${borderWidthValue}px`,
        }}
      />
      {/* Contenu : titre + description (comme ModalVideo) */}
      {(title || description) && (
        <div className="mt-2 space-y-1">
          {title && (
            <div className={`text-sm font-bold ${titleColorClasses[titleColor]}`}>
              {parseColoredText(title)}
            </div>
          )}
          {description && (
            <div className={scrollingText ? "overflow-hidden" : ""}>
              <div
                className={`text-xs ${titleColorClasses[titleColor]} ${scrollingText ? "animate-marquee inline-block whitespace-nowrap" : ""}`}
                style={
                  scrollingText && scrollDuration
                    ? ({ "--marquee-duration": `${scrollDuration}s` } as CSSProperties)
                    : undefined
                }
              >
                {parseColoredText(description)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
