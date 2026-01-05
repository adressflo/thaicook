import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

// ============================================================================
// FONCTION DE PARSING DE BALISES CUSTOM
// ============================================================================

/**
 * Parse le texte avec balises custom et retourne du JSX formaté
 * Balises supportées :
 * - Couleurs : <orange>, <green>, <white>, <gold>, <black>
 * - Styles : <bold>, <semi-bold>, <italic>, <underline>, <small>
 */
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
    italic: "italic",
    underline: "underline",
    small: "text-sm",
  }

  // Regex pour trouver la PREMIÈRE balise (pas greedy pour supporter imbrication)
  const regex = /<(orange|green|white|gold|black|bold|semi-bold|italic|underline|small)>(.*?)<\/\1>/
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

export { parseColoredText }

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "pointer-events-none fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:w-auto sm:flex-col md:max-w-fit",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex items-center overflow-hidden rounded-md p-6 transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-thai-orange bg-white text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        polaroid:
          "border-thai-green bg-white text-thai-green shadow-[0_4px_6px_rgba(0,0,0,0.3)] rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105 border-4 p-4",
        success: "border-thai-green bg-white text-thai-green",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-700",
        info: "border-blue-500 bg-blue-50 text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Types pour les props étendues du Toast
type BorderColor = "thai-orange" | "thai-green" | "red" | "blue" | "yellow" | "purple" | "custom"
type ShadowSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl"
type MaxWidth = "xs" | "sm" | "md" | "lg" | "xl"
type TitleColor = "thai-green" | "thai-orange" | "white" | "black" | "thai-gold" | "inherit"
type DescriptionColor = "thai-green" | "thai-orange" | "gray" | "black" | "inherit"
type ToastPosition = "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "custom"
type FontWeight = "normal" | "medium" | "semibold" | "bold" | "extrabold"
type RedirectBehavior = "auto" | "new-tab" | "button"

interface ToastExtendedProps {
  /** Inclinaison du toast (boolean ou angle en degrés) */
  tilted?: boolean | number
  /** Couleur de la bordure */
  borderColor?: BorderColor
  /** Classe Tailwind custom pour la bordure (si borderColor="custom") */
  customBorderColor?: string
  /** Épaisseur de la bordure (1, 2, 4 ou custom) */
  borderWidth?: 1 | 2 | 4 | "custom"
  /** Épaisseur custom en px */
  customBorderWidth?: number
  /** Taille de l'ombre */
  shadowSize?: ShadowSize
  /** Largeur max du toast */
  maxWidth?: MaxWidth
  /** Animation de bordure animée */
  animateBorder?: boolean
  /** Animation de sortie (fade-out + zoom-out) */
  animateOut?: boolean
  /** Animation Manga Explosion (orange thai) */
  mangaExplosion?: boolean
  /** Effet scale au hover */
  hoverScale?: boolean
  /** Animation rotation (-rotate-2 hover:rotate-0) */
  rotation?: boolean
  /** Couleur du titre */
  titleColor?: TitleColor
  /** Poids de la police du titre */
  titleFontWeight?: FontWeight
  /** Couleur de la description */
  descriptionColor?: DescriptionColor
  /** Poids de la police de la description */
  descriptionFontWeight?: FontWeight
  /** Position du toast */
  position?: ToastPosition
  /** Position X custom (si position="custom") */
  customX?: string
  /** Position Y custom (si position="custom") */
  customY?: string
  /** URL de redirection à la fermeture du toast */
  redirectUrl?: string
  /** Comportement de la redirection */
  redirectBehavior?: RedirectBehavior
  /** Texte défilant (marquee) */
  scrollingText?: boolean
  /** Durée du défilement en secondes */
  scrollDuration?: number
}

// Map des classes CSS pour les positions du Viewport
const positionClassMap: Record<ToastPosition, string> = {
  center:
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center sm:top-1/2 sm:right-auto sm:bottom-auto sm:flex-col",
  "bottom-right": "sm:top-auto sm:right-0 sm:bottom-0 sm:w-auto sm:flex-col",
  "bottom-left": "sm:top-auto sm:left-0 sm:bottom-0 sm:right-auto sm:w-auto sm:flex-col",
  "top-right": "top-0 right-0 bottom-auto sm:top-0 sm:right-0 sm:bottom-auto sm:w-auto sm:flex-col",
  "top-left":
    "top-0 left-0 right-auto bottom-auto sm:top-0 sm:left-0 sm:right-auto sm:bottom-auto sm:w-auto sm:flex-col",
  custom: "",
}

export { positionClassMap }

// Maps pour les classes CSS
const borderColorMap: Record<BorderColor, string> = {
  "thai-orange": "border-thai-orange",
  "thai-green": "border-thai-green",
  red: "border-red-500",
  blue: "border-blue-500",
  yellow: "border-yellow-500",
  purple: "border-purple-500",
  custom: "",
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

const titleColorMap: Record<TitleColor, string> = {
  "thai-green": "text-thai-green",
  "thai-orange": "text-thai-orange",
  white: "text-white",
  black: "text-black",
  "thai-gold": "text-thai-gold",
  inherit: "",
}

const descriptionColorMap: Record<DescriptionColor, string> = {
  "thai-green": "text-thai-green",
  "thai-orange": "text-thai-orange",
  gray: "text-gray-600",
  black: "text-black",
  inherit: "",
}

const fontWeightMap: Record<FontWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> &
    ToastExtendedProps
>(
  (
    {
      className,
      variant,
      tilted,
      borderColor = "thai-orange",
      customBorderColor,
      borderWidth = 2,
      customBorderWidth,
      shadowSize = "lg",
      maxWidth = "lg",
      animateBorder = false,
      animateOut = false,
      mangaExplosion = false,
      hoverScale = false,
      rotation = false,
      style,
      // Props qui ne doivent PAS être passées au DOM
      titleColor: _titleColor,
      titleFontWeight: _titleFontWeight,
      descriptionColor: _descriptionColor,
      descriptionFontWeight: _descriptionFontWeight,
      position: _position,
      customX: _customX,
      customY: _customY,
      redirectUrl: _redirectUrl,
      redirectBehavior: _redirectBehavior,
      scrollingText: _scrollingText,
      scrollDuration: _scrollDuration,
      ...props
    },
    ref
  ) => {
    const angle = typeof tilted === "number" ? tilted : tilted ? -3 : 0
    const isTilted = angle !== 0

    // Calcul des classes dynamiques
    const borderColorClass =
      borderColor === "custom" && customBorderColor
        ? customBorderColor
        : borderColorMap[borderColor]

    const borderWidthClass =
      borderWidth === "custom" && customBorderWidth ? "" : `border-${borderWidth}`

    const borderWidthStyle =
      borderWidth === "custom" && customBorderWidth ? { borderWidth: `${customBorderWidth}px` } : {}

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

    return (
      <ToastPrimitives.Root
        ref={ref}
        className={cn(
          toastVariants({ variant }),
          // Bordure
          borderColorClass,
          borderWidthClass,
          // Ombre
          shadowSizeMap[shadowSize],
          // Largeur max
          maxWidthMap[maxWidth],
          // Largeur min
          "min-w-[280px]",
          // Animation bordure
          animateBorder && "animate-moving-border",
          // Hover scale
          hoverScale && "transition-transform duration-300 hover:scale-105",
          // Rotation
          rotation && "-rotate-2 transition-transform duration-300 hover:rotate-0",
          // Inclinaison
          isTilted &&
            "rotate-(--toast-angle) transition-all duration-300 hover:scale-105 hover:rotate-0",
          // Animation de sortie
          !animateOut &&
            !mangaExplosion &&
            "data-[state=closed]:animate-none! data-[state=closed]:duration-0!",
          // Animation fade-out + zoom-out + slide si animateOut=true (comme ModalVideo)
          animateOut &&
            !mangaExplosion &&
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:duration-200",
          // Animation Manga Explosion
          mangaExplosion && "manga-explosion-exit data-[state=closed]:duration-500!",
          className
        )}
        style={
          {
            ...style,
            ...borderWidthStyle,
            ...getMovingBorderStyle(),
            "--toast-angle": `${angle}deg`,
          } as React.CSSProperties & { "--toast-angle": string }
        }
        {...props}
      />
    )
  }
)
Toast.displayName = ToastPrimitives.Root.displayName

export { descriptionColorMap, fontWeightMap, titleColorMap }
export type {
  BorderColor,
  DescriptionColor,
  FontWeight,
  MaxWidth,
  RedirectBehavior,
  ShadowSize,
  TitleColor,
  ToastExtendedProps,
  ToastPosition,
}

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "ring-offset-background hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "text-foreground/50 hover:text-foreground absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:ring-2 focus:outline-none group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-thai-green text-center text-xl font-bold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-thai-green text-center text-sm leading-relaxed font-semibold opacity-90",
      className
    )}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
}
