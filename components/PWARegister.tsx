'use client'

import { useEffect } from 'react'

/**
 * Composant pour enregistrer le Service Worker PWA
 * Doit être placé dans le layout racine pour activer la PWA
 */
export function PWARegister() {
  useEffect(() => {
    // Vérifier si le navigateur supporte les Service Workers
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Enregistrer le Service Worker au chargement
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('✅ Service Worker enregistré:', registration.scope)

          // Vérifier les mises à jour toutes les heures
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000)
        })
        .catch((error) => {
          console.error('❌ Erreur Service Worker:', error)
        })
    }
  }, [])

  return null // Ce composant ne rend rien visuellement
}
