'use server'

// Cache optimisé pour les données Supabase
export class SupabaseCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  static set(key: string, data: any, ttlMinutes: number = 60) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    })
  }
  
  static get(key: string) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    // Vérifier si le cache a expiré
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  static clear(pattern?: string) {
    if (pattern) {
      // Supprimer les clés qui matchent le pattern
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }
  
  static invalidateOnMutation(keys: string[]) {
    keys.forEach(key => this.cache.delete(key))
  }
}

// Patterns de cache pour les différents types de données
export const CACHE_KEYS = {
  PLATS: 'plats',
  CLIENTS: 'clients', 
  COMMANDES: 'commandes',
  MENU_CATEGORIES: 'menu_categories'
} as const

// TTL par type de données (en minutes)
export const CACHE_TTL = {
  PLATS: 120,        // 2 heures - données peu changeantes
  CLIENTS: 30,       // 30 minutes - données utilisateur
  COMMANDES: 5,      // 5 minutes - données temps réel
  MENU_CATEGORIES: 240 // 4 heures - données très statiques
} as const