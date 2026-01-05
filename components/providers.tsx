"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { del } from "idb-keyval"
import { ReactNode, useEffect, useState } from "react"
import { CartProvider } from "../contexts/CartContext"
import { DataProvider } from "../contexts/DataContext"
import { NotificationProvider } from "../contexts/NotificationContext"

interface ProvidersProps {
  children: ReactNode
}

// Créer le persister avec IndexedDB (via idb-keyval)
/*
const createPersister = () => {
  // Côté serveur, retourner undefined - le PersistQueryClientProvider le gère
  if (typeof window === "undefined") {
    return undefined
  }

  return createAsyncStoragePersister({
    storage: {
      getItem: async (key) => {
        try {
          const value = await get(key)
          return value ?? null
        } catch (error) {
          console.error("Error reading from IndexedDB:", error)
          return null
        }
      },
      setItem: async (key, value) => {
        try {
          await set(key, value)
        } catch (error) {
          console.error("Error writing to IndexedDB:", error)
        }
      },
      removeItem: async (key) => {
        try {
          await del(key)
        } catch (error) {
          console.error("Error deleting from IndexedDB:", error)
        }
      },
    },
  })
}
*/

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 24 * 60 * 60 * 1000, // Garder données 24h (anciennement cacheTime)
            refetchOnWindowFocus: false,
            networkMode: "offlineFirst", // ⭐ Enable offline-first mode
            retry: (failureCount, _error) => {
              // Ne pas retry si offline
              if (typeof navigator !== "undefined" && !navigator.onLine) {
                return false
              }
              return failureCount < 3
            },
          },
        },
      })
  )

  /*
  const [persister, setPersister] = useState<ReturnType<typeof createAsyncStoragePersister> | null>(
    null
  )
  */
  // FIX: Explicitly set persister to null to disable persistence and satisfy TS
  const persister = null

  // Initialiser le persister côté client uniquement
  useEffect(() => {
    if (typeof window !== "undefined") {
      // DEBUG: Persistence disabled to fix crash
      console.warn("⚠️ Persistence disabled for debugging")
      /*
      const p = createPersister()
      if (p) {
        setPersister(p)
      }
      */
    }
  }, [])

  // Nettoyer les données expirées au montage du composant
  useEffect(() => {
    if (typeof window === "undefined") return

    const cleanup = async () => {
      try {
        // Importer dynamiquement pour éviter erreurs SSR
        const { offlineStorage } = await import("@/lib/offlineStorage")
        await offlineStorage.cleanup()
        console.log("✅ Offline storage cleanup completed")
      } catch (error) {
        console.error("Error during offline storage cleanup:", error)
      }
    }

    cleanup()
  }, [])

  // Composant interne pour éviter duplication
  const AppProviders = ({ children: c }: { children: ReactNode }) => (
    <DataProvider>
      <CartProvider>
        <NotificationProvider>{c}</NotificationProvider>
      </CartProvider>
    </DataProvider>
  )

  // Si pas de persister (SSR ou en cours d'initialisation), utiliser QueryClientProvider standard
  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        <AppProviders>{children}</AppProviders>
      </QueryClientProvider>
    )
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
        buster: "v2024.12.22", // 🔑 Version du cache - changer pour invalider l'ancien cache
        dehydrateOptions: {
          // Ne pas persister les queries avec des erreurs
          shouldDehydrateQuery: (query) => {
            return query.state.status !== "error"
          },
        },
      }}
      onError={async () => {
        // Si le cache est corrompu, le vider automatiquement
        console.warn("⚠️ Cache corrompu détecté, nettoyage en cours...")
        try {
          await del("tanstack-query-cache")
          await del("REACT_QUERY_OFFLINE_CACHE")
          console.log("✅ Cache nettoyé avec succès")
        } catch (e) {
          console.error("Erreur lors du nettoyage du cache:", e)
        }
      }}
    >
      <AppProviders>{children}</AppProviders>
    </PersistQueryClientProvider>
  )
}
