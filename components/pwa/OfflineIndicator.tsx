"use client"

import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import { useEffect, useState } from "react"

/**
 * Props pour le composant OfflineIndicator
 */
interface OfflineIndicatorProps {
  /** Position du badge (défaut: 'bottom-right') */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  /** Afficher le texte à côté de l'icône (défaut: false) */
  showText?: boolean
  /** Classe CSS personnalisée */
  className?: string
}

/**
 * Badge indicateur de statut online/offline
 *
 * Affiche un badge discret avec :
 * - Cercle vert si online
 * - Cercle rouge si offline
 * - Animation pulse lors du changement
 * - Tooltip au hover
 *
 * @example
 * ```tsx
 * <OfflineIndicator position="bottom-right" showText />
 * ```
 */
export function OfflineIndicator({
  position = "bottom-right",
  showText = false,
  className = "",
}: OfflineIndicatorProps) {
  const isOnline = useOnlineStatus()
  const [justChanged, setJustChanged] = useState(false)

  // Animation lors du changement de statut
  useEffect(() => {
    setJustChanged(true)
    const timer = setTimeout(() => setJustChanged(false), 2000)
    return () => clearTimeout(timer)
  }, [isOnline])

  // Classes CSS selon la position
  const positionClasses = {
    "top-left": "top-20 md:top-4 left-4",
    "top-right": "top-20 md:top-4 right-4",
    "bottom-left": "bottom-24 md:bottom-4 left-4",
    "bottom-right": "bottom-24 md:bottom-4 right-4",
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800/90 ${justChanged ? "scale-110" : "scale-100"} ${className} `}
      role="status"
      aria-live="polite"
      aria-label={isOnline ? "Mode en ligne" : "Mode hors-ligne"}
    >
      {/* Icône avec animation pulse */}
      <div className="relative">
        <div
          className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} ${justChanged ? "animate-pulse" : ""} `}
        />
        {/* Ring externe pour effet pulse permanent si offline */}
        {!isOnline && (
          <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-red-500 opacity-75" />
        )}
      </div>

      {/* Texte optionnel */}
      {showText && (
        <span
          className={`text-sm font-medium ${isOnline ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"} `}
        >
          {isOnline ? "En ligne" : "Hors-ligne"}
        </span>
      )}

      {/* Tooltip au hover */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-700">
        {isOnline
          ? "Connecté à Internet"
          : "Vous êtes hors-ligne. Les données affichées peuvent être obsolètes."}
        <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
      </div>
    </div>
  )
}

/**
 * Badge inline pour afficher le statut sans position fixed
 *
 * @example
 * ```tsx
 * <OfflineIndicatorInline />
 * ```
 */
export function OfflineIndicatorInline({ className = "" }: { className?: string }) {
  const isOnline = useOnlineStatus()

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md px-2 py-1 ${isOnline ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"} ${className} `}
      role="status"
      aria-live="polite"
    >
      <div
        className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} ${!isOnline ? "animate-pulse" : ""} `}
      />
      <span
        className={`text-xs font-medium ${isOnline ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"} `}
      >
        {isOnline ? "En ligne" : "Hors-ligne"}
      </span>
    </div>
  )
}

/**
 * Hook pour afficher des notifications toast lors du changement de statut
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useOfflineStatusNotifications();
 *   return <div>...</div>;
 * }
 * ```
 */
export function useOfflineStatusNotifications() {
  const isOnline = useOnlineStatus()
  const [previousStatus, setPreviousStatus] = useState<boolean | null>(null)

  useEffect(() => {
    // Skip première render
    if (previousStatus === null) {
      setPreviousStatus(isOnline)
      return
    }

    // Détecter changement de statut
    if (isOnline !== previousStatus) {
      if (isOnline) {
        console.log("✅ Connexion rétablie - synchronisation des données...")
        // TODO: Intégrer avec système de notifications toast
      } else {
        console.log("⚠️ Connexion perdue - mode hors-ligne activé")
        // TODO: Intégrer avec système de notifications toast
      }

      setPreviousStatus(isOnline)
    }
  }, [isOnline, previousStatus])
}
