"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Génération automatique de blurDataURL pour placeholder
  const generateBlurDataURL = (width: number, height: number) => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(0, 0, width, height)
    }
    return canvas.toDataURL()
  }

  // Sizes par défaut responsive
  const defaultSizes = fill ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-400",
          fill ? "absolute inset-0" : "h-full w-full",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-sm">Image non disponible</span>
      </div>
    )
  }

  return (
    <div className={cn("relative", fill && "h-full w-full", className)}>
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className={cn(
            "skeleton-box absolute inset-0 z-10 rounded-md",
            fill ? "h-full w-full" : ""
          )}
          style={!fill ? { width, height } : undefined}
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || defaultSizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={
          blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)
        }
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          !fill && "object-cover"
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

// Version légère pour les petites images (icônes, logos)
export function OptimizedIcon({
  src,
  alt,
  size = 24,
  className,
  ...props
}: Omit<OptimizedImageProps, "width" | "height"> & {
  size?: number
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      quality={90}
      priority={true}
      {...props}
    />
  )
}
