'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface NavLink {
  label: string
  href: string
}

interface QuickNavProps {
  isAuthenticated?: boolean
}

// Navigation pour visiteurs non connectés - liens vers cards
const NAV_LINKS_GUEST: NavLink[] = [
  { label: 'Commander', href: '#card-commander' },
  { label: 'Installer l\'App', href: '#card-installer' },
  { label: 'Événements', href: '#card-evenements' },
  { label: 'Nous trouver', href: '#card-nous-trouver' },
  { label: 'Découvertes', href: '#card-decouvertes' },
  { label: 'À propos', href: '#card-a-propos' },
]

// Navigation pour utilisateurs connectés - liens vers cards
const NAV_LINKS_AUTH: NavLink[] = [
  { label: 'Commander', href: '#card-commander' },
  { label: 'Installer l\'App', href: '#card-installer' },
  { label: 'Événements', href: '#card-evenements' },
  { label: 'Nous trouver', href: '#card-nous-trouver' },
  { label: 'Découvertes', href: '#card-decouvertes' },
  { label: 'Mon Profil', href: '#card-profil' },
  { label: 'Suivi', href: '#card-suivi' },
  { label: 'À propos', href: '#card-a-propos' },
]

export function QuickNav({ isAuthenticated = false }: QuickNavProps) {
  const [activeWaveIndex, setActiveWaveIndex] = useState<number>(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const navLinks = isAuthenticated ? NAV_LINKS_AUTH : NAV_LINKS_GUEST

  // Animation automatique continue
  useEffect(() => {
    if (!isPaused && !isClicked) {
      intervalRef.current = setInterval(() => {
        setActiveWaveIndex((prev) => (prev + 1) % navLinks.length)
      }, 800) // 800ms par élément (plus long)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, isClicked, navLinks.length])

  // Arrêter l'animation au survol
  const handleMouseEnter = () => {
    setIsPaused(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Reprendre l'animation quand la souris quitte
  const handleMouseLeave = () => {
    if (!isClicked) {
      setIsPaused(false)
    }
  }

  // Gérer le clic - arrêter définitivement l'animation
  const handleClick = (cardId: string, index: number) => {
    setIsClicked(true)
    setIsPaused(true)
    setClickedIndex(index)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if ((window as any).highlightCard) {
      (window as any).highlightCard(cardId)
    }

    // Reprendre l'animation après 3 secondes (durée du highlight)
    setTimeout(() => {
      setIsClicked(false)
      setIsPaused(false)
      setClickedIndex(null)
    }, 3000)
  }

  return (
    <nav
      className="quick-nav w-full py-4 sticky top-0 z-30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full px-8">
        <ul className="flex items-center justify-center gap-6 flex-wrap">
          {navLinks.map((link, index) => {
            // Calculer la couleur selon l'état
            let color = '#2d5016' // vert par défaut
            if (isClicked) {
              // Mode clic : seul l'élément cliqué est orange
              color = index === clickedIndex ? '#ff7b54' : '#2d5016'
            } else {
              // Mode vague : l'élément actif est orange
              color = index === activeWaveIndex ? '#ff7b54' : '#2d5016'
            }

            return (
              <motion.li key={link.href}>
                <button
                  onClick={() => {
                    const cardId = link.href.replace('#', '')
                    handleClick(cardId, index)
                  }}
                  className="relative block bg-transparent border-none cursor-pointer"
                >
                  <motion.span
                    className="text-lg font-semibold inline-block"
                    animate={{
                      color: color,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeInOut',
                    }}
                  >
                    {link.label}
                  </motion.span>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
