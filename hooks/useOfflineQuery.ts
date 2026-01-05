'use client';

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useOnlineStatus } from './useOnlineStatus';
import { offlineStorage, StoreName } from '@/lib/offlineStorage';
import { useEffect, useState } from 'react';

/**
 * Metadata pour les données offline
 */
export interface OfflineMetadata {
  isFromCache: boolean; // Données viennent du cache offline
  cachedAt?: number; // Timestamp du cache
  isStale?: boolean; // Données expirées mais toujours affichées
  lastSyncedAt?: number; // Dernier sync réussi
}

/**
 * Options étendues pour useOfflineQuery
 */
interface UseOfflineQueryOptions<TData> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  /** Query key pour identifier la requête */
  queryKey: readonly unknown[];
  /** Fonction pour fetcher les données */
  queryFn: () => Promise<TData>;
  /** Nom du store IndexedDB pour le cache offline */
  offlineStore: StoreName;
  /** Clé pour identifier les données dans le store */
  offlineKey: string;
  /** TTL du cache offline en millisecondes (défaut: 24h) */
  offlineTTL?: number;
  /** Activer le mode offline-first (défaut: true) */
  enableOfflineFirst?: boolean;
}

/**
 * Résultat étendu avec métadonnées offline
 */
type UseOfflineQueryResult<TData> = UseQueryResult<TData> & {
  offlineMetadata: OfflineMetadata;
}

/**
 * Hook wrapper pour TanStack Query avec support offline-first
 *
 * Fonctionnalités :
 * - Détecte automatiquement le statut online/offline
 * - Utilise IndexedDB comme cache de secours si hors-ligne
 * - Synchronise automatiquement les données quand la connexion revient
 * - Fournit des métadonnées sur l'état des données (fraîches, cached, stale)
 *
 * @example
 * ```tsx
 * const { data, isLoading, offlineMetadata } = useOfflineQuery({
 *   queryKey: ['plats'],
 *   queryFn: async () => {
 *     const response = await fetch('/api/plats');
 *     return response.json();
 *   },
 *   offlineStore: STORES.PLATS,
 *   offlineKey: 'all-plats',
 *   offlineTTL: 24 * 60 * 60 * 1000, // 24h
 * });
 *
 * if (offlineMetadata.isFromCache) {
 *   console.log('Displaying cached data from offline storage');
 * }
 * ```
 */
export function useOfflineQuery<TData = unknown>({
  queryKey,
  queryFn,
  offlineStore,
  offlineKey,
  offlineTTL = 24 * 60 * 60 * 1000, // 24h par défaut
  enableOfflineFirst = true,
  ...queryOptions
}: UseOfflineQueryOptions<TData>): UseOfflineQueryResult<TData> {
  const isOnline = useOnlineStatus();
  const [offlineMetadata, setOfflineMetadata] = useState<OfflineMetadata>({
    isFromCache: false,
  });

  // Query TanStack avec configuration offline
  const query = useQuery<TData>({
    queryKey,
    queryFn: async () => {
      try {
        // Essayer de fetch depuis l'API
        const data = await queryFn();

        // Sauvegarder dans IndexedDB pour usage offline
        if (enableOfflineFirst && typeof window !== 'undefined') {
          await offlineStorage.set(offlineStore, offlineKey, data, offlineTTL);
        }

        // Mettre à jour metadata
        setOfflineMetadata({
          isFromCache: false,
          lastSyncedAt: Date.now(),
        });

        return data;
      } catch (error) {
        // Si offline ou erreur réseau, essayer le cache
        if (!isOnline && enableOfflineFirst) {
          console.log(`⚠️ Offline - trying cache for ${offlineKey}`);

          const cachedData = await offlineStorage.get<TData>(
            offlineStore,
            offlineKey
          );

          if (cachedData) {
            // Vérifier si les données sont expirées
            const isExpired = await offlineStorage.isExpired(
              offlineStore,
              offlineKey
            );

            setOfflineMetadata({
              isFromCache: true,
              cachedAt: Date.now(),
              isStale: isExpired,
            });

            return cachedData;
          }
        }

        // Pas de cache disponible, propager l'erreur
        throw error;
      }
    },
    // Configuration TanStack Query pour offline
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: offlineTTL, // Garder en mémoire selon le TTL offline
    refetchOnWindowFocus: isOnline, // Refetch seulement si online
    refetchOnReconnect: true, // Refetch quand connexion revient
    networkMode: enableOfflineFirst ? 'offlineFirst' : 'online',
    retry: (failureCount, error) => {
      // Ne pas retry si offline
      if (!isOnline) return false;
      return failureCount < 3;
    },
    ...queryOptions,
  });

  // Refetch automatique quand connexion revient
  useEffect(() => {
    if (isOnline && offlineMetadata.isFromCache && enableOfflineFirst) {
      console.log(`🔄 Connection restored - refetching ${offlineKey}`);
      query.refetch();
    }
  }, [isOnline, offlineMetadata.isFromCache, offlineKey, enableOfflineFirst, query]);

  return {
    ...query,
    offlineMetadata,
  };
}

/**
 * Hook simplifié pour queries avec store PLATS
 * @example
 * ```tsx
 * const { data, offlineMetadata } = useOfflinePlatsQuery({
 *   queryKey: ['plats'],
 *   queryFn: fetchPlats,
 * });
 * ```
 */
export function useOfflinePlatsQuery<TData = unknown>(
  options: Omit<UseOfflineQueryOptions<TData>, 'offlineStore'>
): UseOfflineQueryResult<TData> {
  return useOfflineQuery({
    ...options,
    offlineStore: 'plats',
    offlineKey: options.offlineKey || (options.queryKey?.[0] as string) || 'default',
    offlineTTL: 24 * 60 * 60 * 1000, // 24h pour les plats
  });
}

/**
 * Hook simplifié pour queries avec store COMMANDES
 * @example
 * ```tsx
 * const { data, offlineMetadata } = useOfflineCommandesQuery({
 *   queryKey: ['commandes', userId],
 *   queryFn: fetchCommandes,
 * });
 * ```
 */
export function useOfflineCommandesQuery<TData = unknown>(
  options: Omit<UseOfflineQueryOptions<TData>, 'offlineStore'>
): UseOfflineQueryResult<TData> {
  return useOfflineQuery({
    ...options,
    offlineStore: 'commandes',
    offlineKey: options.offlineKey || (options.queryKey?.join('-') as string) || 'default',
    offlineTTL: 1 * 60 * 60 * 1000, // 1h pour les commandes
  });
}

/**
 * Hook simplifié pour queries avec store USER_PROFILE
 * @example
 * ```tsx
 * const { data, offlineMetadata } = useOfflineUserProfileQuery({
 *   queryKey: ['profile', userId],
 *   queryFn: fetchUserProfile,
 * });
 * ```
 */
export function useOfflineUserProfileQuery<TData = unknown>(
  options: Omit<UseOfflineQueryOptions<TData>, 'offlineStore'>
): UseOfflineQueryResult<TData> {
  return useOfflineQuery({
    ...options,
    offlineStore: 'user_profile',
    offlineKey: options.offlineKey || (options.queryKey?.join('-') as string) || 'default',
    offlineTTL: 24 * 60 * 60 * 1000, // 24h pour le profil
  });
}
