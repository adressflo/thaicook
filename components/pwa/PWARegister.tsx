'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Component to register Service Worker PWA with update detection
 * Must be placed in root layout to enable PWA
 */
export function PWARegister() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check if browser supports Service Workers
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register Service Worker on load
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('✅ Service Worker registered:', reg.scope)
          setRegistration(reg)

          // Detect updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New version available
                  console.log('🔄 New Service Worker version available')

                  toast.info('Nouvelle version disponible', {
                    description: 'Actualiser pour obtenir la dernière version',
                    duration: 10000,
                    action: {
                      label: 'Actualiser',
                      onClick: () => {
                        newWorker.postMessage({ type: 'SKIP_WAITING' })
                        window.location.reload()
                      },
                    },
                  })
                }
              })
            }
          })

          // Check for updates every 60 minutes
          setInterval(() => {
            console.log('🔍 Checking for Service Worker updates...')
            reg.update()
          }, 60 * 60 * 1000)
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error)
        })

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload page when new SW takes control (but only once)
        if (!window.location.hash.includes('sw-reload')) {
          window.location.hash = 'sw-reload'
          window.location.reload()
        }
      })
    }
  }, [])

  return null // This component renders nothing visually
}
