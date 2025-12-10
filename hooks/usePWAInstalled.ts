"use client"

import { useEffect, useState } from "react"

/**
 * Hook pour détecter si l'application PWA est installée
 *
 * Détecte 3 états :
 * - Installée : App lancée en mode standalone
 * - Installable : beforeinstallprompt event disponible
 * - Non installée : navigateur standard
 *
 * @returns {boolean} isInstalled - True si l'app est installée/lancée en mode PWA
 * @returns {BeforeInstallPromptEvent | null} installPrompt - Event pour déclencher l'installation
 * @returns {Function} install - Fonction pour déclencher l'installation
 */
export function usePWAInstalled() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  useEffect(() => {
    // Détecter si l'app est lancée en mode standalone (installée)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const isIOSStandalone = (window.navigator as any).standalone === true

    setIsInstalled(isStandalone || isIOSStandalone)

    // Écouter l'event beforeinstallprompt (Android Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher le prompt automatique du navigateur
      e.preventDefault()
      // Stocker l'event pour l'utiliser plus tard
      setInstallPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Écouter l'installation réussie
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  /**
   * Déclenche le prompt d'installation natif du navigateur
   */
  const install = async () => {
    if (!installPrompt) {
      return false
    }

    // Afficher le prompt natif
    installPrompt.prompt()

    // Attendre la réponse de l'utilisateur
    const { outcome } = await installPrompt.userChoice

    if (outcome === "accepted") {
      setInstallPrompt(null)
      return true
    } else {
      return false
    }
  }

  return {
    isInstalled,
    installPrompt,
    canInstall: !isInstalled && installPrompt !== null,
    install,
  }
}
