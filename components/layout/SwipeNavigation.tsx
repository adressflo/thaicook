"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

interface SwipeNavigationProps {
  targetLeft?: string // URL to go to on Swipe Left (Drag finger Right -> Left)
  targetRight?: string // URL to go to on Swipe Right (Drag finger Left -> Right)
  threshold?: number
}

export function SwipeNavigation({
  targetLeft,
  targetRight,
  threshold = 100, // min pixels to trigger
}: SwipeNavigationProps) {
  const router = useRouter()
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchEnd.current = null
      touchStart.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      }
    }

    const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return

      const xDiff = touchStart.current.x - touchEnd.current.x
      const yDiff = touchStart.current.y - touchEnd.current.y

      const absX = Math.abs(xDiff)
      const absY = Math.abs(yDiff)

      // Check if horizontal swipe is dominant and exceeds threshold
      if (absX > threshold && absX > absY) {
        if (xDiff > 0) {
          // Swipe Left (Finger goes Right -> Left)
          // Go to "Next" page (targetLeft)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (targetLeft) router.push(targetLeft as any)
        } else {
          // Swipe Right (Finger goes Left -> Right)
          // Go to "Previous" page (targetRight)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (targetRight) router.push(targetRight as any)
        }
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [router, targetLeft, targetRight, threshold])

  return null // This component is logic-only
}
