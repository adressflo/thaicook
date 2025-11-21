import { CSSProperties } from "react"

interface PolaroidPhotoProps {
  src: string
  alt: string
  caption?: string
  position?: "left" | "center" | "right"
  size?: number // en px (128 par défaut)
  rotation?: number // en degrés (3 par défaut)
  className?: string
}

export function PolaroidPhoto({
  src,
  alt,
  caption,
  position = "right",
  size = 128,
  rotation = 3,
  className = "",
}: PolaroidPhotoProps) {
  // Position classes
  const positionClasses = {
    left: "left-8",
    center: "left-1/2 -translate-x-1/2",
    right: "right-6",
  }

  // Style pour rotation et dimensions
  const style: CSSProperties = {
    padding: "10px 10px 20px 10px",
  }

  return (
    <div
      className={`absolute ${positionClasses[position]} border-thai-green bottom-0 z-10 translate-y-[40%] rotate-[var(--polaroid-rotation)] border-1 bg-white text-center shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-110 hover:rotate-0 hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)] ${className} `}
      style={
        {
          ...style,
          "--polaroid-rotation": `${rotation}deg`,
        } as CSSProperties
      }
    >
      <img
        src={src}
        alt={alt}
        className="border-thai-green mx-auto block border-1 object-cover"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      {caption && <div className="text-thai-green mt-4 text-sm font-bold">{caption}</div>}
    </div>
  )
}
