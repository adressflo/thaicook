// src/services/supabaseService.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { 
  Client, ClientUI, ClientInputData,
  Plat, PlatUI, 
  Commande, CommandeUI, CommandeInputData,
  DetailCommande,
  Evenement, EvenementInputData,
  PlatPanier 
} from '@/types/app'

// Configuration Supabase
const SUPABASE_URL = 'https://lkaiwnkyoztebplqoifc.supabase.co'
const SUPABASE_ANON_KEY = typeof import.meta !== 'undefined' 
  ? import.meta.env?.VITE_SUPABASE_ANON_KEY 
  : process.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw'

// Initialisation du client Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

class SupabaseService {
  // ========== CLIENTS ==========
  async fetchClients(): Promise<ClientUI[]> {
    const { data, error } = await supabase
      .from('client_db')
      .select('*')
      .order('nom', { ascending: true })

    if (error) throw error
    
    // Transformation pour compatibilité avec l'interface
    return (data || []).map(client => ({
      ...client,      id: client.firebase_uid, // Pour compatibilité
      Nom: client.nom,
      Prénom: client.prenom,
      'Numéro de téléphone': client.numero_de_telephone,
      'e-mail': client.email,
      'Adresse (numéro et rue)': client.adresse_numero_et_rue,
      'Code postal': client.code_postal,
      Ville: client.ville,
      'Préférence client': client.preference_client,
      'Comment avez-vous connu ChanthanaThaiCook ?': client.comment_avez_vous_connu,
      'Souhaitez-vous recevoir les actualités et offres par e-mail ?': 
        client.souhaitez_vous_recevoir_actualites ? 'Oui' : 'Non/Pas de réponse',
      'Date de naissance': client.date_de_naissance,
      'Photo Client': client.photo_client ? [{ url: client.photo_client }] : undefined,
      FirebaseUID: client.firebase_uid,
      Role: client.role || 'client'
    }))
  }

  async getClientByFirebaseUID(firebase_uid: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('client_db')
      .select('*')
      .eq('firebase_uid', firebase_uid)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async createClient(clientData: ClientInputData): Promise<Client> {    const { data, error } = await supabase
      .from('client_db')
      .insert({
        firebase_uid: clientData.firebase_uid || '',
        role: 'client',
        nom: clientData.nom,
        prenom: clientData.prenom,
        preference_client: clientData.preference_client,
        numero_de_telephone: clientData.numero_de_telephone,
        email: clientData.email,
        adresse_numero_et_rue: clientData.adresse_numero_et_rue,
        code_postal: clientData.code_postal,
        ville: clientData.ville,
        comment_avez_vous_connu: clientData.comment_avez_vous_connu,
        souhaitez_vous_recevoir_actualites: clientData.souhaitez_vous_recevoir_actualites,
        date_de_naissance: clientData.date_de_naissance,
        photo_client: clientData.photo_client
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateClient(firebase_uid: string, clientData: Partial<ClientInputData>): Promise<Client> {
    const { data, error } = await supabase
      .from('client_db')
      .update(clientData)
      .eq('firebase_uid', firebase_uid)      .select()
      .single()

    if (error) throw error
    return data
  }

  // ========== PLATS ==========
  async fetchPlats(): Promise<PlatUI[]> {
    const { data, error } = await supabase
      .from('plats_db')
      .select('*')
      .order('plat', { ascending: true })

    if (error) throw error
    
    // Transformation pour compatibilité
    return (data || []).map(plat => ({
      ...plat,
      id: plat.idplats, // Ajouter le champ id requis
      // Champs de compatibilité
      Plat: plat.plat,
      Description: plat.description,
      Prix: plat.prix || 0,
      'Prix vu': plat.prix ? `${plat.prix} €` : '',
      'Photo du Plat': plat.photo_du_plat ? [{ url: plat.photo_du_plat }] : undefined
    }))
  }

  async getPlatById(id: number): Promise<Plat | null> {
    const { data, error } = await supabase      .from('plats_db')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // ========== COMMANDES ==========
  async fetchCommandes(): Promise<CommandeUI[]> {
    const { data, error } = await supabase
      .from('commande_db')
      .select(`
        *,
        details:details_commande_db!details_commande_db_commande_r_fkey (
          *,
          plat:plats_db!details_commande_db_plat_r_fkey (*)
        )
      `)
      .order('date_de_prise_de_commande', { ascending: false })

    if (error) throw error
    
    // Transformation pour compatibilité
    return (data || []).map(commande => ({
      ...commande,
      id: commande.idcommande, // Mappage pour l'UI
      'Numéro de Commande': `CMD-${commande.idcommande}`,
      'Date & Heure de retrait': commande.date_et_heure_de_retrait_souhaitees,
      'Statut Commande': commande.statut_commande,
      'Client R': commande.client_r ? [commande.client_r] : [],
      Total: 0, // À calculer avec les détails
      createdTime: commande.date_de_prise_de_commande    }))
  }

  async getCommandeById(id: number): Promise<CommandeUI | null> {
    const { data, error } = await supabase
      .from('commande_db')
      .select(`
        *,
        client:client_db!commande_db_client_r_fkey (*),
        details:details_commande_db (
          *,
          plat:plats_db (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null
    
    // Calculer le total
    const total = data.details?.reduce((sum: number, detail: any) => {
      const prix = detail.plat?.prix || 0
      const quantite = detail.quantite_plat_commande || 0
      return sum + (prix * quantite)
    }, 0) || 0
    
    return {
      ...data,
      id: data.idcommande, // Ajouter le champ id requis
      'Numéro de Commande': `CMD-${data.idcommande}`,      'Date & Heure de retrait': data.date_et_heure_de_retrait_souhaitees,
      'Statut Commande': data.statut_commande,
      'Client R': data.client_r ? [data.client_r] : [],
      Total: total,
      createdTime: data.date_de_prise_de_commande
    }
  }

  async createCommande(commandeData: CommandeInputData): Promise<Commande> {
    const { data, error } = await supabase
      .from('commande_db')
      .insert({
        client_r: commandeData.client_r,
        date_et_heure_de_retrait_souhaitees: commandeData.date_et_heure_de_retrait_souhaitees,
        statut_commande: 'En attente de confirmation',
        demande_special_pour_la_commande: commandeData.demande_special_pour_la_commande,
        statut_paiement: 'En attente sur place',
        type_livraison: commandeData.type_livraison || 'À emporter'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateCommande(idcommande: number, updates: Partial<Commande>): Promise<Commande> {
    const { data, error } = await supabase
      .from('commande_db')
      .update(updates)
      .eq('idcommande', idcommande)
      .select(`
        *,
        client:client_db!commande_db_client_r_id_fkey (*),
        details:details_commande_db (
          *,
          plat:plats_db (*)
        )
      `)
      .single()

    if (error) throw error
    return data
  }

  // ========== DÉTAILS DE COMMANDE ==========
  async createDetailCommande(detailData: {
    commande_r: number
    plat_r: number
    quantite_plat_commande: number
  }): Promise<DetailCommande> {
    const { data, error } = await supabase
      .from('details_commande_db')
      .insert(detailData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ========== ÉVÉNEMENTS ==========
  async fetchEvenements(): Promise<Evenement[]> {
    const { data, error } = await supabase
      .from('evenements_db')
      .select(`
        *,        client:client_db!evenements_db_contact_client_r_fkey (*),
        menu_type:menus_evenementiels_types_db (*)
      `)
      .order('date_evenement', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createEvenement(evenementData: EvenementInputData): Promise<Evenement> {
    const { data, error } = await supabase
      .from('evenements_db')
      .insert({
        ...evenementData,
        statut_evenement: 'Demande initiale',
        statut_acompte: 'Non applicable',
        statut_paiement_final: 'En attente'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateEvenement(id: number, updates: Partial<Evenement>): Promise<Evenement> {
    const { data, error } = await supabase
      .from('evenements_db')
      .update(updates)
      .eq('id', id)      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const supabaseService = new SupabaseService()