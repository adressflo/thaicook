// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Client admin avec service role (pour les opérations privilégiées)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkaiwnkyoztebplqoifc.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// ⚠️ IMPORTANT: La clé service role ne doit JAMAIS être exposée côté client
// Cette fonction ne doit être utilisée que dans les Server Actions ou API Routes
export const createAdminClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante')
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Fonction sécurisée pour créer un client
export async function createClientWithAdminPrivileges(clientData: {
  firebase_uid: string
  email?: string
  nom?: string
  prenom?: string
}) {
  const supabaseAdmin = createAdminClient()
  
  try {
    // Vérifier si le client existe déjà
    const { data: existingClient } = await supabaseAdmin
      .from('client_db')
      .select('*')
      .eq('firebase_uid', clientData.firebase_uid)
      .single()
    
    if (existingClient) {
      return { success: true, data: existingClient, message: 'Client already exists' }
    }
    
    // Créer le nouveau client
    const { data, error } = await supabaseAdmin
      .from('client_db')
      .insert({
        firebase_uid: clientData.firebase_uid,
        email: clientData.email || '',
        nom: clientData.nom || '',
        prenom: clientData.prenom || '',
        role: 'client'
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return { success: true, data, message: 'Client created successfully' }
    
  } catch (error) {
    console.error('Erreur lors de la création du client admin:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }
  }
}