// Types d'application basés sur la nouvelle structure Supabase
import type { Database } from './supabase'

// Types de base extraits de Supabase
export type Client = Database['public']['Tables']['client_db']['Row']
export type Plat = Database['public']['Tables']['plats_db']['Row']
export type Commande = Database['public']['Tables']['commande_db']['Row']
export type DetailCommande = Database['public']['Tables']['details_commande_db']['Row'] & {
  // Extensions pour les extras
  prix_unitaire?: number | null // Prix custom pour les extras
  nom_plat?: string | null // Nom custom pour les extras
  type?: 'plat' | 'extra' | 'complement_divers' | null // Type pour distinguer plats vs extras (complement_divers pour compatibilité)
}
export type Evenement = Database['public']['Tables']['evenements_db']['Row']
export type Extra = Database['public']['Tables']['extras_db']['Row']

// Types d'approvisionnement
export type ListeCourse = Database['public']['Tables']['listes_courses']['Row']
export type ArticleListeCourse = Database['public']['Tables']['articles_liste_courses']['Row']

// Types pour les insertions
export type ClientInputData = Database['public']['Tables']['client_db']['Insert']
export type CommandeInputData = Database['public']['Tables']['commande_db']['Insert']
export type EvenementInputData = Database['public']['Tables']['evenements_db']['Insert']
export type ExtraInputData = Database['public']['Tables']['extras_db']['Insert']

// Type pour l'interface utilisateur des plats
export interface PlatUI extends Plat {
  id: number // Mappage de idplats vers id pour l'UI
  nom_plat?: string // Alias pour `plat`
  url_photo?: string // Alias pour `photo_du_plat`
  disponible?: boolean // Calculé depuis les jours et est_epuise
  categorie?: string // Catégorie du plat (plat principal, extra, etc.)
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
  type?: 'plat' | 'extra' | 'complement_divers' // Type de l'item (compatible avec DetailCommande)
}

// Type pour l'interface utilisateur des commandes
export interface CommandeUI extends Omit<Commande, 'statut_commande' | 'statut_paiement' | 'type_livraison'> {
  id: number // Mappage de idcommande vers id pour l'UI
  client_r: string // Assurer la compatibilité
  client?: Pick<Client, 'nom' | 'prenom' | 'numero_de_telephone' | 'email' | 'preference_client' | 'photo_client' | 'firebase_uid' | 'adresse_numero_et_rue' | 'code_postal' | 'ville'> | null // Données du client jointes (partielles)
  details?: Array<DetailCommande & {
    plat?: Plat
  }>
  // Propriétés compatibles avec l'ancien système
  'Numéro de Commande'?: string // Calculé depuis idcommande
  'Date & Heure de retrait'?: string | undefined // Alias pour date_et_heure_de_retrait_souhaitees
  'Statut Commande'?: string | undefined // Alias pour statut_commande
  statut?: string | undefined // Alias pour statut_commande
  statut_commande?: 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée' | null // Pour compatibilité directe avec DB
  statut_paiement?: 'En attente sur place' | 'Payé sur place' | 'Payé en ligne' | 'Non payé' | 'Payée' | null // Pour compatibilité directe
  type_livraison?: 'À emporter' | 'Livraison' | 'Sur place' | null // Pour compatibilité directe
  prix_total?: number // Calculé depuis les détails
  Total?: number // Alias pour prix_total
  FirebaseUID?: string // Alias pour client_r
  createdTime?: string | undefined // Alias pour date_de_prise_de_commande
}

// Type pour une commande avec ses détails (alias pour CommandeUI)
export type CommandeWithDetails = CommandeUI

// Type pour une commande avec ses détails complets
export interface CommandeAvecDetails extends Commande {
  id: number // Mappage de idcommande vers id pour l'UI
  client_db?: Client | undefined // Données du client jointes (peut être null)
  details_commande_db: Array<DetailCommande & {
    plats_db: Pick<Plat, 'plat' | 'prix' | 'photo_du_plat' | 'description' | 'dimanche_dispo' | 'idplats' | 'jeudi_dispo' | 'lundi_dispo' | 'mardi_dispo' | 'mercredi_dispo' | 'samedi_dispo' | 'vendredi_dispo' | 'est_epuise'>
  }>
}

// Type pour l'interface utilisateur des événements
export interface EvenementUI extends Evenement {
  id: number // Mappage de idevenements vers id pour l'UI
}

// Type pour l'interface utilisateur des extras
export interface ExtraUI extends Extra {
  id: number // Mappage de idextra vers id pour l'UI
}

// Type pour l'interface utilisateur des clients
export interface ClientUI extends Client {
  id: string // Utiliser firebase_uid comme id pour compatibilité
  // Propriétés compatibles avec l'ancien système Airtable
  Nom?: string | undefined // Alias pour nom
  Prénom?: string | undefined // Alias pour prenom
  'Numéro de téléphone'?: string | undefined // Alias pour numero_de_telephone
  'e-mail'?: string | undefined // Alias pour email
  'Adresse (numéro et rue)'?: string | undefined // Alias pour adresse_numero_et_rue
  'Code postal'?: number | undefined // Alias pour code_postal
  Ville?: string | undefined // Alias pour ville
  'Préférence client'?: string | undefined // Alias pour preference_client
  'Comment avez-vous connu ChanthanaThaiCook ?'?: string[] | undefined // Alias pour comment_avez_vous_connu
  'Souhaitez-vous recevoir les actualités et offres par e-mail ?'?: string | undefined // Calculé depuis souhaitez_vous_recevoir_actualites
  'Date de naissance'?: string | undefined // Alias pour date_de_naissance
  'Photo Client'?: Array<{ url: string }> | undefined // Transformé depuis photo_client
  FirebaseUID?: string | undefined // Alias pour firebase_uid
  Role?: string | undefined // Alias pour role
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
  contact_client_r?: string // firebase_uid (optionnel maintenant)
  contact_client_r_id: number // idclient (obligatoire maintenant)
  date_evenement: string
  type_d_evenement: string
  nombre_de_personnes: number
  budget_client?: number
  demandes_speciales_evenement?: string
  plats_preselectionnes?: number[] // Array de idplats
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

// Types pour les listes de courses - Correction des propriétés manquantes
export interface ListeAvecArticles {
  id: number
  nom_liste: string
  description: string | null
  date_creation: string | null
  date_derniere_modification: string | null
  statut: string | null
  created_by: string | null
  total_estimatif: number | null
  articles: ArticleListeCourse[]
  articles_count?: number // Propriété calculée
}

// Type pour les recommandations IA
export interface PlatRecommandation extends Omit<Plat, 'photo_du_plat'> {
  photo_du_plat?: string | null // Permettre null comme dans Plat
  note_moyenne?: number
  nb_commandes?: number
  score?: number
  confidence?: number
  reason?: string
  disponible_aujourd_hui?: boolean
}

// Type pour les mises à jour de commande
export interface CommandeUpdate {
  statut_commande?: 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée' | undefined
  statut_paiement?: 'En attente sur place' | 'Payé sur place' | 'Payé en ligne' | 'Non payé' | 'Payée' | undefined
  type_livraison?: 'À emporter' | 'Livraison' | undefined
  date_et_heure_de_retrait_souhaitees?: string
  demande_special_pour_la_commande?: string
  notes_internes?: string
  adresse_specifique?: string
}

// Type pour les détails de plat modifiables
export interface ModifiablePlatDetail extends DetailCommande {
  plat?: Plat | undefined
  quantite_plat_commande: number // Requis et jamais null
}
