import { CSSProperties } from 'react'

interface PolaroidPhotoProps {
  src: string
  alt: string
  caption?: string
  position?: 'left' | 'center' | 'right'
  size?: number // en px (128 par défaut)
  rotation?: number // en degrés (3 par défaut)
  className?: string
}

export function PolaroidPhoto({
  src,
  alt,
  caption,
  position = 'right',
  size = 128,
  rotation = 3,
  className = ''
}: PolaroidPhotoProps) {
  // Position classes
  const positionClasses = {
    left: 'left-8',
    center: 'left-1/2 -translate-x-1/2',
    right: '-right-4'
  }

  // Style pour rotation et dimensions
  const style: CSSProperties = {
    padding: '10px 10px 20px 10px'
  }

  return (
    <div
      className={`
        absolute ${positionClasses[position]} bottom-0 translate-y-[85%]
        bg-white border-1 border-thai-green shadow-[0_4px_6px_rgba(0,0,0,0.3)]
        hover:shadow-[0_10px_20px_rgba(0,0,0,0.7)]
        hover:scale-110 hover:rotate-0
        transition-all duration-300 text-center
        rotate-[${rotation}deg] z-10
        ${className}
      `}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className="block object-cover mx-auto border-1 border-thai-green"
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      />
      {caption && (
        <div className="text-thai-green font-bold mt-4 text-sm">
          {caption}
        </div>
      )}
    </div>
  )
}
