"use client"

import { useCallback } from "react"

/**
 * Hook pour gérer les retours haptiques (vibrations)
 * Améliore l'expérience utilisateur mobile en ajoutant une dimension tactile
 */
export const useHaptic = () => {
  /**
   * Déclenche une vibration selon le pattern demandé
   * @param pattern - 'light' | 'medium' | 'heavy' | 'success' | 'error'
   */
  const trigger = useCallback(
    (pattern: "light" | "medium" | "heavy" | "success" | "error" = "light") => {
      // Vérifier si l'API est disponible (mobile uniquement en général)
      if (typeof navigator === "undefined" || !navigator.vibrate) return

      switch (pattern) {
        case "light":
          // Clic navigation, sélection simple
          navigator.vibrate(10)
          break
        case "medium":
          // Toggle, ajout panier
          navigator.vibrate(40)
          break
        case "heavy":
          // Validation importante, suppression
          navigator.vibrate(70)
          break
        case "success":
          // Action réussie (double tap rapide)
          navigator.vibrate([10, 30, 10])
          break
        case "error":
          // Erreur (séquence d'alerte)
          navigator.vibrate([50, 50, 50, 50, 50])
          break
      }
    },
    []
  )

  return {
    trigger,
    light: () => trigger("light"),
    medium: () => trigger("medium"),
    heavy: () => trigger("heavy"),
    success: () => trigger("success"),
    error: () => trigger("error"),
  }
}
