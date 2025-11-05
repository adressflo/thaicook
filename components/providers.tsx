'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { get, set, del } from 'idb-keyval';
import { DataProvider } from '../contexts/DataContext';
import { CartProvider } from '../contexts/CartContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ReactNode, useState, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

// Créer le persister avec IndexedDB (via idb-keyval)
const createPersister = () => {
  if (typeof window === 'undefined') {
    // Côté serveur, retourner un persister no-op
    return {
      persistClient: async () => {},
      restoreClient: async () => undefined,
      removeClient: async () => {},
    };
  }

  return createAsyncStoragePersister({
    storage: {
      getItem: async (key) => {
        try {
          return await get(key);
        } catch (error) {
          console.error('Error reading from IndexedDB:', error);
          return null;
        }
      },
      setItem: async (key, value) => {
        try {
          await set(key, value);
        } catch (error) {
          console.error('Error writing to IndexedDB:', error);
        }
      },
      removeItem: async (key) => {
        try {
          await del(key);
        } catch (error) {
          console.error('Error deleting from IndexedDB:', error);
        }
      },
    },
  });
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 24 * 60 * 60 * 1000, // Garder données 24h (anciennement cacheTime)
            refetchOnWindowFocus: false,
            networkMode: 'offlineFirst', // ⭐ Enable offline-first mode
            retry: (failureCount, error) => {
              // Ne pas retry si offline
              if (typeof navigator !== 'undefined' && !navigator.onLine) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  const [persister] = useState(() => createPersister());

  // Nettoyer les données expirées au montage du composant
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cleanup = async () => {
      try {
        // Importer dynamiquement pour éviter erreurs SSR
        const { offlineStorage } = await import('@/lib/offlineStorage');
        await offlineStorage.cleanup();
        console.log('✅ Offline storage cleanup completed');
      } catch (error) {
        console.error('Error during offline storage cleanup:', error);
      }
    };

    cleanup();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
        dehydrateOptions: {
          // Ne pas persister les queries avec des erreurs
          shouldDehydrateQuery: (query) => {
            return query.state.status !== 'error';
          },
        },
      }}
    >
      <DataProvider>
        <CartProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </CartProvider>
      </DataProvider>
    </PersistQueryClientProvider>
  );
}