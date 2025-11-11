'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from 'framer-motion'
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ===== CONTEXT =====

interface DockContextValue {
  mouseX: MotionValue<number | null>
  spring: SpringOptions
  magnification: number
  distance: number
}

const DockContext = createContext<DockContextValue | undefined>(undefined)

function useDock() {
  const context = useContext(DockContext)
  if (!context) {
    throw new Error('useDock must be used within DockProvider')
  }
  return context
}

// ===== PROVIDER =====

interface DockProviderProps {
  children: ReactNode
  spring?: SpringOptions
  magnification?: number
  distance?: number
}

function DockProvider({
  children,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 60,
  distance = 150,
}: DockProviderProps) {
  const mouseX = useMotionValue<number | null>(null)

  return (
    <DockContext.Provider value={{ mouseX, spring, magnification, distance }}>
      {children}
    </DockContext.Provider>
  )
}

// ===== DOCK CONTAINER =====

interface DockProps {
  children: ReactNode
  className?: string
  spring?: SpringOptions
  magnification?: number
  distance?: number
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 60,
  distance = 150,
}: DockProps) {
  const mouseX = useMotionValue<number | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.pageX)
  }

  const handleMouseLeave = () => {
    mouseX.set(null)
  }

  return (
    <DockContext.Provider value={{ mouseX, spring, magnification, distance }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'flex items-end gap-4 rounded-2xl p-2',
          className
        )}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  )
}

// ===== DOCK ITEM =====

interface DockItemProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

function DockItem({ children, className, href, onClick }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { mouseX, spring, magnification, distance } = useDock()

  // Calculate distance from mouse to item center
  const distanceFromMouse = useTransform(mouseX, (val) => {
    if (val === null || !ref.current) {
      return distance
    }

    const bounds = ref.current.getBoundingClientRect()
    const itemCenterX = bounds.x + bounds.width / 2

    return Math.abs(val - itemCenterX)
  })

  // Transform distance to width (40px base, up to magnification on hover)
  const width = useTransform(
    distanceFromMouse,
    [0, distance],
    [magnification, 40]
  )

  const height = useTransform(
    distanceFromMouse,
    [0, distance],
    [magnification, 40]
  )

  // Apply spring physics for smooth, elastic motion
  const widthWithSpring = useSpring(width, spring)
  const heightWithSpring = useSpring(height, spring)

  const ItemWrapper = href ? 'a' : 'div'

  return (
    <ItemWrapper
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={cn('cursor-pointer', className)}
    >
      <motion.div
        ref={ref}
        style={{
          width: widthWithSpring,
          height: heightWithSpring,
        }}
        className="flex items-center justify-center"
      >
        {children}
      </motion.div>
    </ItemWrapper>
  )
}

// ===== DOCK ICON =====

interface DockIconProps {
  children: ReactNode
  className?: string
}

function DockIcon({ children, className }: DockIconProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full',
        className
      )}
    >
      {children}
    </div>
  )
}

// ===== DOCK LABEL (Tooltip) =====

interface DockLabelProps {
  children: ReactNode
  className?: string
}

function DockLabel({ children, className }: DockLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

// ===== EXPORTS =====

export { Dock, DockIcon, DockItem, DockLabel, DockProvider, useDock }
