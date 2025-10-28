// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Utiliser les variables d'environnement Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkaiwnkyoztebplqoifc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ============================================
// ARCHITECTURE SINGLETON SUPABASE 2.58.0
// ============================================

// Instance unique globale - Solution 2025 pour éviter multiple GoTrueClient
let globalSupabaseInstance: SupabaseClient<Database> | null = null;

// Factory pour instance unique Supabase pour Realtime + Storage
const createSingletonSupabaseClient = (): SupabaseClient<Database> => {
  if (globalSupabaseInstance) {
    return globalSupabaseInstance;
  }

  console.log('🏗️ Création instance Supabase unique (Singleton Pattern 2.58.0)');

  globalSupabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Auth désactivé - Better Auth gère l'authentification
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'chanthanathaicook',
        'x-client-version': '2025.10.27',
        'x-architecture': 'better-auth-prisma-supabase'
      }
    },
    realtime: {
      // Optimisations 2.58.0 pour performance
      params: {
        eventsPerSecond: 10,
        heartbeatIntervalMs: 30000
      } as any
    }
  });

  return globalSupabaseInstance;
};

// Export de l'instance unique
// Utilisé uniquement pour Supabase Realtime + Storage
// Toutes les opérations CRUD utilisent Prisma ORM via Server Actions
export const supabase = createSingletonSupabaseClient();

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
    console.error('🚨 RLS Policy Violation:', {
      context,
      error: supabaseError,
      message: supabaseError.message
    })
    throw new SupabaseError(`Permissions insuffisantes pour ${context}`, supabaseError.code, error)
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
