// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Utiliser les variables d'environnement Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkaiwnkyoztebplqoifc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Configuration normale Supabase compatible avec AuthContext
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: typeof window !== 'undefined',
    flowType: 'pkce',
    // Optimisation pour Next.js SSR
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'chanthana-auth-token'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'chanthanathaicook',
      'x-client-version': '2025.1'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
      heartbeatIntervalMs: 30000
    }
  }
})

// Client Supabase avec authentification administrateur pour contourner temporairement RLS
export const createAuthenticatedClient = async (firebaseUid: string) => {
  // Créer une session temporaire avec le firebase_uid
  const customJWT = {
    sub: firebaseUid,
    firebase_uid: firebaseUid,
    role: 'authenticated',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 heure
  };
  
  // Pour le moment, utiliser le client normal avec headers personnalisés
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-application-name': 'chanthanathaicook',
        'x-client-version': '2025.1',
        'x-firebase-uid': firebaseUid
      }
    }
  });
}

// Types d'erreur personnalisés
export class SupabaseError extends Error {
  constructor(message: string, public code?: string, public details?: unknown) {
    super(message)
    this.name = 'SupabaseError'
  }
}

// Fonction utilitaire pour gérer les erreurs Supabase
export const handleSupabaseError = (error: unknown, context: string): never => {
  console.error(`Erreur Supabase dans ${context}:`, error)
  
  const supabaseError = error as { code?: string; message?: string }
  
  if (supabaseError?.code === 'PGRST116') {
    throw new SupabaseError('Aucun résultat trouvé', supabaseError.code, error)
  }
  
  if (supabaseError?.code === '23505') {
    throw new SupabaseError('Cette donnée existe déjà', supabaseError.code, error)
  }
  
  if (supabaseError?.code === '42501') {
    throw new SupabaseError('Permissions insuffisantes', supabaseError.code, error)
  }
  
  throw new SupabaseError(
    supabaseError?.message || `Erreur dans ${context}`,
    supabaseError?.code,
    error
  )
}

// Fonction utilitaire pour les réponses Supabase
export const handleSupabaseResponse = <T>(
  response: { data: T | null; error: unknown }, 
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
