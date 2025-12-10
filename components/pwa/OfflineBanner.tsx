"use client"

import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import { Wifi, WifiOff, X } from "lucide-react"
import { useEffect, useState } from "react"

/**
 * Props pour le composant OfflineBanner
 */
interface OfflineBannerProps {
  /** Afficher un bouton pour fermer la bannière (défaut: true) */
  dismissible?: boolean
  /** Message personnalisé pour le mode offline */
  offlineMessage?: string
  /** Message personnalisé pour le retour en ligne */
  onlineMessage?: string
  /** Durée d'affichage du message "retour en ligne" en ms (défaut: 5000) */
  onlineMessageDuration?: number
  /** Afficher les détails de la dernière synchronisation */
  showLastSync?: boolean
  /** Classe CSS personnalisée */
  className?: string
}

/**
 * Bannière d'avertissement affichée en haut de page en mode offline
 *
 * Fonctionnalités :
 * - Affichage automatique quand la connexion est perdue
 * - Message de confirmation quand la connexion revient
 * - Animation slide depuis le haut
 * - Peut être fermée temporairement
 * - Réapparaît automatiquement si connexion perdue à nouveau
 *
 * @example
 * ```tsx
 * <OfflineBanner
 *   dismissible
 *   showLastSync
 *   offlineMessage="Mode hors-ligne : Les données affichées peuvent être obsolètes"
 * />
 * ```
 */
export function OfflineBanner({
  dismissible = true,
  offlineMessage = "Vous êtes actuellement hors-ligne. Les données affichées proviennent du cache local.",
  onlineMessage = "Connexion rétablie ! Synchronisation en cours...",
  onlineMessageDuration = 5000,
  showLastSync = true,
  className = "",
}: OfflineBannerProps) {
  const isOnline = useOnlineStatus()
  const [isVisible, setIsVisible] = useState(!isOnline)
  const [isDismissed, setIsDismissed] = useState(false)
  const [showOnlineNotification, setShowOnlineNotification] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Gérer l'affichage de la bannière
  useEffect(() => {
    if (!isOnline) {
      // Mode offline : afficher la bannière (sauf si dismissed)
      if (!isDismissed) {
        setIsVisible(true)
      }
      setShowOnlineNotification(false)
    } else {
      // Mode online : masquer bannière offline, afficher notification temporaire
      setIsVisible(false)
      setIsDismissed(false) // Reset dismissed state

      // Afficher notification "connexion rétablie" temporairement
      setShowOnlineNotification(true)
      setLastSyncTime(new Date())

      const timer = setTimeout(() => {
        setShowOnlineNotification(false)
      }, onlineMessageDuration)

      return () => clearTimeout(timer)
    }
  }, [isOnline, isDismissed, onlineMessageDuration])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  // Ne rien afficher si connexion OK et pas de notification
  if (!isVisible && !showOnlineNotification) {
    return null
  }

  return (
    <>
      {/* Bannière OFFLINE */}
      {isVisible && !isOnline && (
        <div
          className={`animate-slide-down fixed top-0 right-0 left-0 z-40 border-b-2 border-amber-500 bg-amber-50 px-4 py-3 shadow-lg dark:bg-amber-900/20 ${className} `}
          role="alert"
          aria-live="assertive"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            {/* Icône et message */}
            <div className="flex flex-1 items-center gap-3">
              <div className="shrink-0">
                <WifiOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  {offlineMessage}
                </p>

                {showLastSync && lastSyncTime && (
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    Dernière synchronisation :{" "}
                    {lastSyncTime.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Bouton fermer */}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="shrink-0 rounded-md p-1 text-amber-600 transition-colors hover:bg-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-amber-400 dark:hover:bg-amber-800/30"
                aria-label="Fermer la bannière"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Notification ONLINE (temporaire) */}
      {showOnlineNotification && isOnline && (
        <div
          className={`animate-slide-down fixed top-0 right-0 left-0 z-40 border-b-2 border-green-500 bg-green-50 px-4 py-3 shadow-lg dark:bg-green-900/20 ${className} `}
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3">
            <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              {onlineMessage}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Version compacte de la bannière pour usage inline dans les pages
 *
 * @example
 * ```tsx
 * <OfflineBannerCompact />
 * ```
 */
export function OfflineBannerCompact({ className = "" }: { className?: string }) {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-900/20 ${className} `}
      role="alert"
      aria-live="polite"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-sm text-amber-900 dark:text-amber-100">Mode hors-ligne actif</p>
    </div>
  )
}

/**
 * Bannière pour pages spécifiques nécessitant une connexion
 * Affiche un message d'erreur si offline
 *
 * @example
 * ```tsx
 * <OfflineBlocker
 *   featureName="Passer une commande"
 *   onRetryAction={() => window.location.reload()}
 * />
 * ```
 */
export function OfflineBlocker({
  featureName = "Cette fonctionnalité",
  onRetryAction,
  className = "",
}: {
  featureName?: string
  onRetryAction?: () => void
  className?: string
}) {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border-2 border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20 ${className} `}
      role="alert"
      aria-live="assertive"
    >
      <WifiOff className="mb-4 h-12 w-12 text-red-500" />

      <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">
        Connexion requise
      </h3>

      <p className="mb-4 max-w-md text-sm text-red-700 dark:text-red-300">
        {featureName} nécessite une connexion Internet active. Veuillez vérifier votre connexion et
        réessayer.
      </p>

      {onRetryAction && (
        <button
          onClick={onRetryAction}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
