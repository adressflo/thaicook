'use client'

import * as React from "react"

// Breakpoints alignés avec Tailwind CSS v4
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

// Hook supplémentaire pour tablette
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isTablet
}

// Hook consolidé pour tous les breakpoints
export function useBreakpoints() {
  const [breakpoints, setBreakpoints] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const updateBreakpoints = () => {
      const width = window.innerWidth
      setBreakpoints({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT
      })
    }

    const mql1 = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const mql2 = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    const mql3 = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`)

    mql1.addEventListener("change", updateBreakpoints)
    mql2.addEventListener("change", updateBreakpoints)
    mql3.addEventListener("change", updateBreakpoints)
    updateBreakpoints()

    return () => {
      mql1.removeEventListener("change", updateBreakpoints)
      mql2.removeEventListener("change", updateBreakpoints)
      mql3.removeEventListener("change", updateBreakpoints)
    }
  }, [])

  return breakpoints
}
