/**
 * IndexedDB Offline Storage avec gestion TTL (Time-To-Live)
 * Utilisé pour cacher les données API en mode hors-ligne
 */

const DB_NAME = 'chanthana-offline-db';
const DB_VERSION = 1;

// Stores disponibles pour cacher différents types de données
export const STORES = {
  PLATS: 'plats',
  COMMANDES: 'commandes',
  USER_PROFILE: 'user_profile',
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

// Interface pour les données cachées avec métadonnées TTL
interface CachedData<T = any> {
  key: string;
  data: T;
  cachedAt: number; // timestamp
  ttl: number; // durée de vie en millisecondes
}

/**
 * Classe singleton pour gérer le stockage offline IndexedDB
 */
class OfflineStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialise la connexion IndexedDB
   */
  private async init(): Promise<void> {
    if (this.db) return;

    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Vérifier si IndexedDB est supporté
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB not supported');
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Créer les object stores si nécessaire
        if (!db.objectStoreNames.contains(STORES.PLATS)) {
          db.createObjectStore(STORES.PLATS, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORES.COMMANDES)) {
          db.createObjectStore(STORES.COMMANDES, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORES.USER_PROFILE)) {
          db.createObjectStore(STORES.USER_PROFILE, { keyPath: 'key' });
        }

        console.log('✅ IndexedDB stores created');
      };
    });

    await this.initPromise;
  }

  /**
   * Stocke des données avec TTL
   * @param store - Nom du store (plats, commandes, user_profile)
   * @param key - Clé unique pour identifier les données
   * @param data - Données à stocker
   * @param ttlMs - Durée de vie en millisecondes (par défaut: 24h)
   */
  async set<T>(
    store: StoreName,
    key: string,
    data: T,
    ttlMs: number = 24 * 60 * 60 * 1000
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const cachedData: CachedData<T> = {
      key,
      data,
      cachedAt: Date.now(),
      ttl: ttlMs,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(cachedData);

      request.onsuccess = () => {
        console.log(`✅ Cached ${key} in ${store}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ Error caching ${key}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Récupère des données du cache
   * Retourne null si les données n'existent pas ou sont expirées
   */
  async get<T>(store: StoreName, key: string): Promise<T | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);

      request.onsuccess = () => {
        const cached = request.result as CachedData<T> | undefined;

        if (!cached) {
          console.log(`⚠️ No cache found for ${key}`);
          resolve(null);
          return;
        }

        // Vérifier si le cache est expiré
        const now = Date.now();
        const isExpired = now - cached.cachedAt > cached.ttl;

        if (isExpired) {
          console.log(`⚠️ Cache expired for ${key}`);
          // Supprimer automatiquement les données expirées
          this.delete(store, key).catch(console.error);
          resolve(null);
          return;
        }

        console.log(`✅ Cache hit for ${key}`);
        resolve(cached.data);
      };

      request.onerror = () => {
        console.error(`❌ Error reading ${key}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Récupère toutes les données d'un store (non expirées)
   */
  async getAll<T>(store: StoreName): Promise<T[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const allCached = request.result as CachedData<T>[];
        const now = Date.now();

        // Filtrer les données non expirées
        const validData = allCached
          .filter((cached) => now - cached.cachedAt <= cached.ttl)
          .map((cached) => cached.data);

        console.log(`✅ Retrieved ${validData.length} items from ${store}`);
        resolve(validData);
      };

      request.onerror = () => {
        console.error(`❌ Error reading all from ${store}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Supprime une entrée du cache
   */
  async delete(store: StoreName, key: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);

      request.onsuccess = () => {
        console.log(`✅ Deleted ${key} from ${store}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ Error deleting ${key}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Vide complètement un store
   */
  async clear(store: StoreName): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log(`✅ Cleared ${store}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ Error clearing ${store}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Vide tous les stores (utile pour logout ou réinitialisation)
   */
  async clearAll(): Promise<void> {
    await this.init();
    if (!this.db) return;

    await Promise.all([
      this.clear(STORES.PLATS),
      this.clear(STORES.COMMANDES),
      this.clear(STORES.USER_PROFILE),
    ]);

    console.log('✅ All stores cleared');
  }

  /**
   * Vérifie si une entrée est expirée
   */
  async isExpired(store: StoreName, key: string): Promise<boolean> {
    await this.init();
    if (!this.db) return true;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);

      request.onsuccess = () => {
        const cached = request.result as CachedData | undefined;

        if (!cached) {
          resolve(true); // Pas de cache = expiré
          return;
        }

        const now = Date.now();
        const isExpired = now - cached.cachedAt > cached.ttl;
        resolve(isExpired);
      };

      request.onerror = () => {
        console.error(`❌ Error checking expiration for ${key}:`, request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Nettoie toutes les entrées expirées de tous les stores
   * Recommandé d'appeler périodiquement (ex: au démarrage de l'app)
   */
  async cleanup(): Promise<void> {
    await this.init();
    if (!this.db) return;

    const stores = [STORES.PLATS, STORES.COMMANDES, STORES.USER_PROFILE];
    const now = Date.now();

    for (const store of stores) {
      const transaction = this.db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.openCursor();

      await new Promise<void>((resolve, reject) => {
        let deletedCount = 0;

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

          if (cursor) {
            const cached = cursor.value as CachedData;
            const isExpired = now - cached.cachedAt > cached.ttl;

            if (isExpired) {
              cursor.delete();
              deletedCount++;
            }

            cursor.continue();
          } else {
            // Fin du cursor
            if (deletedCount > 0) {
              console.log(`✅ Cleaned ${deletedCount} expired items from ${store}`);
            }
            resolve();
          }
        };

        request.onerror = () => {
          console.error(`❌ Error cleaning ${store}:`, request.error);
          reject(request.error);
        };
      });
    }

    console.log('✅ Cleanup completed');
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();

// Helper pour nettoyer automatiquement au chargement de l'app
if (typeof window !== 'undefined') {
  // Nettoyer les données expirées au chargement
  offlineStorage.cleanup().catch(console.error);
}
