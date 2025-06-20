// Types d'application basés sur la nouvelle structure Supabase
import type { Database } from './supabase'

// Types de base extraits de Supabase
export type Client = Database['public']['Tables']['client_db']['Row']
export type Plat = Database['public']['Tables']['plats_db']['Row']
export type Commande = Database['public']['Tables']['commande_db']['Row']
export type DetailCommande = Database['public']['Tables']['details_commande_db']['Row']
export type Evenement = Database['public']['Tables']['evenements_db']['Row']

// Types pour les insertions
export type ClientInputData = Database['public']['Tables']['client_db']['Insert']
export type CommandeInputData = Database['public']['Tables']['commande_db']['Insert']
export type EvenementInputData = Database['public']['Tables']['evenements_db']['Insert']

// Type pour l'interface utilisateur des plats
export interface PlatUI extends Plat {
  id: number // Mappage de idplats vers id pour l'UI
}

// Type pour un plat dans le panier
export interface PlatPanier {
  id: string
  nom: string
  prix: number
  quantite: number
  jourCommande?: string // Jour pour lequel le plat est commandé
  dateRetrait?: Date // Date de retrait associée
  uniqueId?: string // ID unique pour chaque article dans le panier
}

// Type pour l'interface utilisateur des commandes
export interface CommandeUI extends Commande {
  id: number // Mappage de idcommande vers id pour l'UI
  client_r: string // Assurer la compatibilité
  client?: Client // Données du client jointes
  details?: Array<DetailCommande & {
    plat?: Plat
  }>
  // Propriétés compatibles avec l'ancien système
  Total?: number
  FirebaseUID?: string
  createdTime?: string
}

// Type pour une commande avec ses détails (alias pour CommandeUI)
export type CommandeWithDetails = CommandeUI

// Type pour l'interface utilisateur des événements
export interface EvenementUI extends Evenement {
  id: number // Mappage de idevenements vers id pour l'UI
}

// Type pour l'interface utilisateur des clients
export interface ClientUI extends Client {
  id: string // Utiliser firebase_uid comme id pour compatibilité
  // Propriétés compatibles avec l'ancien système Airtable
  Nom?: string
  Prénom?: string
  'Numéro de téléphone'?: string
  'e-mail'?: string
  'Adresse (numéro et rue)'?: string
  'Code postal'?: number
  Ville?: string
  'Préférence client'?: string
  'Comment avez-vous connu ChanthanaThaiCook ?'?: string[]
  'Souhaitez-vous recevoir les actualités et offres par e-mail ?'?: string
  'Date de naissance'?: string
  'Photo Client'?: Array<{ url: string }>
  FirebaseUID?: string
  Role?: string
}

// Types pour les requêtes API
export interface CreateCommandeData {
  client_r: string // firebase_uid
  client_r_id?: number // idclient
  date_et_heure_de_retrait_souhaitees: string
  demande_special_pour_la_commande?: string
  type_livraison?: 'À emporter' | 'Livraison' | 'Sur place'
  adresse_specifique?: string
  details: Array<{
    plat_r: number | string // idplats - accepter string et number pour conversion
    quantite_plat_commande: number
  }>
}

export interface CreateEvenementData {
  nom_evenement: string
  contact_client_r: string // firebase_uid
  contact_client_r_id?: number // idclient
  date_evenement: string
  type_d_evenement: string
  nombre_de_personnes: number
  budget_client?: number
  demandes_speciales_evenement?: string
  plats_pre_selectionnes?: number[] // Array de idplats
}

// Type pour la réponse d'authentification
export interface AuthResponse {
  user: {
    uid: string
    email: string | null
    displayName: string | null
  }
  profile: Client | null
}
