'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Component to detect and handle JavaScript chunk loading errors
 * Automatically reloads the page when Turbopack chunks fail to load
 *
 * Common chunk errors:
 * - ChunkLoadError
 * - "Failed to fetch dynamically imported module"
 * - "Loading chunk X failed"
 * - "Unexpected token '<'" (HTML error page served as JS)
 */
export function ChunkErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasReloaded, setHasReloaded] = useState(false)

  useEffect(() => {
    // Check if we already reloaded once (to prevent infinite loops)
    const reloadFlag = sessionStorage.getItem('chunk-error-reload')
    if (reloadFlag === 'true') {
      setHasReloaded(true)
      // Clear flag after 5 seconds to allow future reloads
      setTimeout(() => {
        sessionStorage.removeItem('chunk-error-reload')
      }, 5000)
    }

    const handleChunkError = (event: ErrorEvent) => {
      const errorMessage = event.message?.toLowerCase() || ''
      const errorStack = event.error?.stack?.toLowerCase() || ''

      // Detect chunk loading errors
      const isChunkError =
        errorMessage.includes('chunkloaderror') ||
        errorMessage.includes('failed to fetch dynamically imported module') ||
        errorMessage.includes('loading chunk') ||
        errorMessage.includes('unexpected token') ||
        errorStack.includes('chunks/') ||
        errorStack.includes('turbopack')

      if (isChunkError && !hasReloaded) {
        console.error('⚠️ Chunk load error detected:', {
          message: event.message,
          filename: event.filename,
          error: event.error,
        })

        // Prevent infinite reload loop
        if (sessionStorage.getItem('chunk-error-reload') === 'true') {
          console.error('❌ Chunk error persists after reload. Manual intervention required.')
          toast.error('Erreur critique', {
            description: 'Visitez /unregister-sw.html pour réinitialiser le Service Worker',
            duration: Infinity,
            action: {
              label: 'Ouvrir',
              onClick: () => {
                window.location.href = '/unregister-sw.html'
              },
            },
          })
          return
        }

        // Show toast notification
        toast.info('Mise à jour détectée', {
          description: 'Rechargement de l\'application dans 2 secondes...',
          duration: 2000,
        })

        // Set reload flag
        sessionStorage.setItem('chunk-error-reload', 'true')

        // Reload page after 2 seconds
        setTimeout(() => {
          console.log('🔄 Reloading page to load updated chunks...')
          window.location.reload()
        }, 2000)
      }
    }

    // Listen for global errors
    window.addEventListener('error', handleChunkError)

    // Listen for unhandled promise rejections (for dynamic imports)
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message?.toLowerCase() || event.reason?.toString().toLowerCase() || ''

      const isChunkError =
        reason.includes('chunkloaderror') ||
        reason.includes('failed to fetch dynamically imported module') ||
        reason.includes('loading chunk')

      if (isChunkError && !hasReloaded) {
        console.error('⚠️ Chunk load error (promise rejection):', event.reason)

        // Prevent infinite reload loop
        if (sessionStorage.getItem('chunk-error-reload') === 'true') {
          console.error('❌ Chunk error persists after reload. Manual intervention required.')
          toast.error('Erreur critique', {
            description: 'Visitez /unregister-sw.html pour réinitialiser le Service Worker',
            duration: Infinity,
          })
          return
        }

        toast.info('Mise à jour détectée', {
          description: 'Rechargement de l\'application dans 2 secondes...',
          duration: 2000,
        })

        sessionStorage.setItem('chunk-error-reload', 'true')

        setTimeout(() => {
          console.log('🔄 Reloading page to load updated chunks...')
          window.location.reload()
        }, 2000)
      }
    }

    window.addEventListener('unhandledrejection', handlePromiseRejection)

    return () => {
      window.removeEventListener('error', handleChunkError)
      window.removeEventListener('unhandledrejection', handlePromiseRejection)
    }
  }, [hasReloaded])

  return <>{children}</>
}
