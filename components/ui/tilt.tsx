"use client"

import type { HTMLAttributes, ReactNode } from "react"
import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface TiltProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  rotation?: number
  scale?: number
  perspective?: number
}

export function Tilt({
  children,
  className,
  rotation = 15,
  scale = 1.05,
  perspective = 1000,
  ...props
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    const rotateX = (0.5 - y) * rotation * 2 // Reverse Y for natural tilt
    const rotateY = (x - 0.5) * rotation * 2

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
    })
  }

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
    })
  }

  return (
    <div
      ref={ref}
      className={cn("transition-transform duration-200 ease-out", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}
