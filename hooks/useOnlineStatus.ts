'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Hook pour détecter le statut online/offline du navigateur
 * Utilise l'API Navigator.onLine et les events 'online'/'offline'
 *
 * @returns {boolean} true si online, false si offline
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isOnline = useOnlineStatus();
 *
 *   return (
 *     <div>
 *       {isOnline ? '🟢 Online' : '🔴 Offline'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOnlineStatus(): boolean {
  // Utiliser useSyncExternalStore pour une meilleure compatibilité avec React 18+
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return isOnline;
}

/**
 * S'abonne aux événements online/offline du navigateur
 */
function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

/**
 * Récupère l'état actuel du statut online (client-side)
 */
function getSnapshot() {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Récupère l'état initial pour le rendu serveur (SSR)
 * Toujours true côté serveur
 */
function getServerSnapshot() {
  return true;
}

/**
 * Hook alternatif avec callback pour réagir aux changements de statut
 *
 * @param onOnline - Callback appelé quand la connexion est rétablie
 * @param onOffline - Callback appelé quand la connexion est perdue
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useOnlineStatusWithCallbacks(
 *     () => console.log('Back online!'),
 *     () => console.log('Connection lost!')
 *   );
 * }
 * ```
 */
export function useOnlineStatusWithCallbacks(
  onOnline?: () => void,
  onOffline?: () => void
) {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      console.log('🟢 Connection restored');
      onOnline?.();
    };

    const handleOffline = () => {
      console.log('🔴 Connection lost');
      onOffline?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOnline, onOffline]);

  return isOnline;
}
