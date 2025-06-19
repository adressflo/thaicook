// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Utiliser les variables d'environnement (CORRIGÉ)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lkaiwnkyoztebplqoifc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Configuration optimisée pour performance
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'chanthanathaicook'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Types d'erreur personnalisés
export class SupabaseError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message)
    this.name = 'SupabaseError'
  }
}

// Fonction utilitaire pour gérer les erreurs Supabase
export const handleSupabaseError = (error: any, context: string): never => {
  console.error(`Erreur Supabase dans ${context}:`, error)
  
  if (error?.code === 'PGRST116') {
    throw new SupabaseError('Aucun résultat trouvé', error.code, error)
  }
  
  if (error?.code === '23505') {
    throw new SupabaseError('Cette donnée existe déjà', error.code, error)
  }
  
  if (error?.code === '42501') {
    throw new SupabaseError('Permissions insuffisantes', error.code, error)
  }
  
  throw new SupabaseError(
    error?.message || `Erreur dans ${context}`,
    error?.code,
    error
  )
}

// Fonction utilitaire pour les réponses Supabase
export const handleSupabaseResponse = <T>(
  response: { data: T | null; error: any }, 
  context: string
): T => {
  if (response.error) {
    handleSupabaseError(response.error, context)
  }
  
  if (response.data === null) {
    throw new SupabaseError(`Aucune donnée retournée pour ${context}`)
  }
  
  return response.data
}

// Configuration des politiques de cache
export const CACHE_TIMES = {
  PLATS: 1000 * 60 * 15,      // 15 minutes
  CLIENTS: 1000 * 60 * 5,     // 5 minutes
  COMMANDES: 1000 * 60 * 2,   // 2 minutes
  EVENEMENTS: 1000 * 60 * 10  // 10 minutes
} as const
