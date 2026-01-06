// Types d'application basés sur Prisma ORM
import type {
  client_db,
  commande_db,
  details_commande_db,
  evenements_db,
  extras_db,
  jour_dispo,
  plats_db,
} from "../generated/prisma/client"
import type { Database } from "../lib/database.types"

// Types de base depuis Prisma (auth_user_id remplace firebase_uid)
export type Client = client_db
export type Plat = plats_db
export type Commande = commande_db
export type Evenement = evenements_db
export type Extra = extras_db

// Type pour l'interface utilisateur des extras
export interface ExtraUI {
  idextra: number
  nom_extra: string
  description: string | null
  prix: string // Converti de Decimal vers string
  photo_url: string | null
  actif: boolean | null
  created_at: string | null // Converti de DateTime vers ISO string
  updated_at: string | null // Converti de DateTime vers ISO string
  est_disponible?: boolean // Alias pour actif
}

// Type simplifié pour Plat dans DetailCommande (évite conflit Decimal)
export interface PlatSimpleUI {
  id: number
  idplats: number
  plat: string
  description: string | null
  prix: string | null // Converti de Decimal
  lundi_dispo: jour_dispo
  mardi_dispo: jour_dispo
  mercredi_dispo: jour_dispo
  jeudi_dispo: jour_dispo
  vendredi_dispo: jour_dispo | null
  samedi_dispo: jour_dispo | null
  dimanche_dispo: jour_dispo | null
  photo_du_plat: string | null
  est_epuise: boolean | null
  epuise_depuis: string | null // Converti de DateTime
  epuise_jusqu_a: string | null // Converti de DateTime
  raison_epuisement: string | null
}

// Type pour les détails de commande avec types UI
export type DetailCommande = Omit<details_commande_db, "prix_unitaire"> & {
  // Extensions pour les extras et plats
  prix_unitaire?: string | null // Prix custom pour les extras (converti de Decimal)
  nom_plat?: string | null // Nom custom pour les extras
  type?: "plat" | "extra" | null // Type pour distinguer plats vs extras
  est_offert?: boolean | null // Indique si le plat est offert
  preference_epice_niveau?: number | null // Niveau épicé choisi par le client (0-3)
  spice_distribution?: number[] | null // Distribution épicée [nonEpice, peuEpice, epice, tresEpice]
  extra?: ExtraUI | null // Données de l'extra lié si applicable (type UI)
  plat?: PlatSimpleUI | null // Données du plat lié si applicable (type UI)
}

// Types d'approvisionnement
export type ListeCourse = Database["public"]["Tables"]["listes_courses"]["Row"]
export type ArticleListeCourse = Database["public"]["Tables"]["articles_liste_courses"]["Row"]

// Types pour les insertions
export type ClientInputData = Database["public"]["Tables"]["client_db"]["Insert"]
export type CommandeInputData = Database["public"]["Tables"]["commande_db"]["Insert"]
export type EvenementInputData = Database["public"]["Tables"]["evenements_db"]["Insert"]
export type ExtraInputData = Database["public"]["Tables"]["extras_db"]["Insert"]

// Type pour l'interface utilisateur des plats
export interface PlatUI
  extends Omit<
    Plat,
    "epuise_depuis" | "epuise_jusqu_a" | "prix" | "est_vegetarien" | "niveau_epice"
  > {
  id: number // Mappage de idplats vers id pour l'UI
  idplats: number
  plat: string
  prix: string | null // Converti de Decimal vers string
  description: string | null
  photo_du_plat: string | null
  epuise_depuis: string | null // Converti de Date vers ISO string
  epuise_jusqu_a: string | null // Converti de Date vers ISO string
  nom_plat?: string // Alias pour `plat`
  url_photo?: string // Alias pour `photo_du_plat`
  disponible?: boolean // Calculé depuis les jours et est_epuise
  categorie: string | null // Catégorie du plat (plat principal, extra, etc.)
  niveau_epice?: number | null // Niveau d'épice (0-4)
  est_vegetarien?: boolean | number | null // Indicateur végétarien
}

// Type pour un plat dans le panier
export interface PlatPanier {
  id: string
  nom: string
  prix: string
  quantite: number
  jourCommande?: string // Jour pour lequel le plat est commandé
  dateRetrait?: Date // Date de retrait associée
  uniqueId?: string // ID unique pour chaque article dans le panier
  type?: "plat" | "extra" // Type de l'item (plat normal ou extra)
  demandeSpeciale?: string // Demandes spéciales (niveau épicé, etc.)
  spiceDistribution?: number[] // Distribution épicée [nonEpice, peuEpice, epice, tresEpice]
}

// Type pour l'interface utilisateur des commandes
export interface CommandeUI
  extends Omit<
    Commande,
    | "statut_commande"
    | "statut_paiement"
    | "type_livraison"
    | "client_r_id"
    | "date_et_heure_de_retrait_souhaitees"
    | "date_de_prise_de_commande"
  > {
  id: number // Mappage de idcommande vers id pour l'UI
  client_r: string | null // Assurer la compatibilité
  client_r_id: number | null // Converti de bigint vers number
  date_et_heure_de_retrait_souhaitees: string | null // Converti de Date vers ISO string
  date_de_prise_de_commande: string | null // Converti de Date vers ISO string
  client?: {
    idclient: number
    nom: string | null
    prenom: string | null
    numero_de_telephone: string | null
    email: string | null
    preference_client: string | null
    photo_client: string | null
    auth_user_id: string
    adresse_numero_et_rue: string | null
    code_postal: number | null
    ville: string | null
  } | null
  details?: DetailCommande[]
  // Propriétés compatibles avec l'ancien système
  "Numéro de Commande"?: string // Calculé depuis idcommande
  "Date & Heure de retrait"?: string | undefined // Alias pour date_et_heure_de_retrait_souhaitees
  "Statut Commande"?: string | undefined // Alias pour statut_commande
  statut?: string | undefined // Alias pour statut_commande
  statut_commande?:
    | "En attente de confirmation"
    | "Confirmée"
    | "En préparation"
    | "Prête à récupérer"
    | "Récupérée"
    | "Annulée"
    | null // Pour compatibilité directe avec DB
  statut_paiement?:
    | "En attente sur place"
    | "Payé sur place"
    | "Payé en ligne"
    | "Non payé"
    | "Payée"
    | null // Pour compatibilité directe
  type_livraison?: "À emporter" | "Livraison" | "Sur place" | null // Pour compatibilité directe
  prix_total?: string // Calculé depuis les détails
  Total?: string // Alias pour prix_total
  total?: number // Calculé pour l'UI
  createdTime?: string | undefined // Alias pour date_de_prise_de_commande
  created_at?: string | null // ISO string
  updated_at?: string | null // ISO string
  epingle: boolean | null // Indique si la commande est épinglée en haut de la liste
}

// Type pour une commande avec ses détails (alias pour CommandeUI)
export type CommandeWithDetails = CommandeUI

// Type pour une commande avec ses détails complets
export interface CommandeAvecDetails extends Commande {
  id: number // Mappage de idcommande vers id pour l'UI
  client_db?: Client | undefined // Données du client jointes (peut être null)
  details_commande_db: Array<
    DetailCommande & {
      plats_db: Pick<
        Plat,
        | "plat"
        | "prix"
        | "photo_du_plat"
        | "description"
        | "dimanche_dispo"
        | "idplats"
        | "jeudi_dispo"
        | "lundi_dispo"
        | "mardi_dispo"
        | "mercredi_dispo"
        | "samedi_dispo"
        | "vendredi_dispo"
        | "est_epuise"
      >
    }
  >
}

// Type pour l'interface utilisateur des événements
export interface EvenementUI
  extends Omit<
    Evenement,
    | "contact_client_r_id"
    | "budget_client"
    | "prix_total_devise"
    | "acompte_demande"
    | "acompte_recu"
    | "date_evenement"
    | "date_acompte_recu"
    | "created_at"
    | "updated_at"
  > {
  id: number // Mappage de idevenements vers id pour l'UI
  contact_client_r_id: number | null // Converti de bigint vers number
  budget_client: string | null // Converti de Decimal vers string
  prix_total_devise: string | null // Converti de Decimal vers string
  acompte_demande: string | null // Converti de Decimal vers string
  acompte_recu: string | null // Converti de Decimal vers string
  date_evenement: string | null // Converti de Date vers ISO string
  date_acompte_recu: string | null // Converti de Date vers ISO string
  created_at: string | null // Converti de Date vers ISO string
  updated_at: string | null // Converti de Date vers ISO string
  // Aliases pour compatibilité
  client_r_id?: number | null
  date_evenement_formatee?: string
  budget_estime?: number | null
  demandes_speciales?: string | null
  statut?: string | null
  notes_internes?: string | null
  type_evenement?: string | null
  client?: Pick<Client, "nom" | "prenom" | "email" | "numero_de_telephone"> | null
}

// Type pour l'interface utilisateur des clients, directement basé sur le type Prisma
export interface ClientUI extends Omit<Client, "idclient"> {
  id: string // Utiliser auth_user_id comme id pour compatibilité
  idclient: number // Converti de bigint vers number pour l'UI
  // Note: firebase_uid n'existe plus - utiliser auth_user_id à la place
}

// Types pour les requêtes API
export interface CreateCommandeData {
  client_r?: string // auth_user_id (optionnel)
  client_r_id?: number // idclient (optionnel pour compatibilité backward)
  date_et_heure_de_retrait_souhaitees?: string
  demande_special_pour_la_commande?: string
  type_livraison?: "À emporter" | "Livraison" | "Sur place"
  adresse_specifique?: string
  // Accepter les deux formats pour compatibilité
  details?: Array<{
    plat_r: string | number | null // ancien format - null pour les extras
    quantite_plat_commande?: number
    extra_id?: number | null // ID de l'extra si c'est un extra, null pour les plats
    nom_plat?: string // Nom pour les extras
    prix_unitaire?: string | number // Prix pour les extras
    type?: string // 'plat' ou 'extra'
    preference_epice_niveau?: number // Niveau épicé choisi (0-3)
  }>
  plats?: Array<{
    plat_r_id: number // nouveau format
    quantite?: number
  }>
}

export interface CreateEvenementData {
  nom_evenement: string // Obligatoire - nom personnalisé de l'événement (min 3 car)
  type_d_evenement: string // Obligatoire - type d'événement (Anniversaire, Repas d'entreprise, etc.)
  contact_client_r: string // auth_user_id (obligatoire selon schema)
  contact_client_r_id: number // idclient (pour extend du schema)
  date_evenement: string // Obligatoire - date dans le futur
  nombre_personnes: number // Obligatoire - Nom correct selon schema
  lieu_evenement: string // Obligatoire selon schema
  budget_approximatif?: number // Number optionnel selon schema
  description_evenement?: string // String optionnel selon schema
  is_public?: boolean // Boolean optionnel selon schema
  statut?: "En attente" | "Confirmé" | "Annulé" // Enum optionnel selon schema
  plats_preselectionnes?: number[] // Array de idplats (custom field)
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
  total_estimatif: string | null
  articles: ArticleListeCourse[]
  articles_count?: number // Propriété calculée
}

// Type pour les recommandations IA
export interface PlatRecommandation extends Omit<Plat, "photo_du_plat"> {
  photo_du_plat?: string | null // Permettre null comme dans Plat
  note_moyenne?: string
  nb_commandes?: number
  score?: string
  confidence?: number
  reason?: string
  disponible_aujourd_hui?: boolean
}

// Type pour les mises à jour de commande
export interface CommandeUpdate {
  statut_commande?:
    | "En attente de confirmation"
    | "Confirmée"
    | "En préparation"
    | "Prête à récupérer"
    | "Récupérée"
    | "Annulée"
    | undefined
  statut_paiement?:
    | "En attente sur place"
    | "Payé sur place"
    | "Payé en ligne"
    | "Non payé"
    | "Payée"
    | undefined
  type_livraison?: "À emporter" | "Livraison" | undefined
  date_et_heure_de_retrait_souhaitees?: string
  demande_special_pour_la_commande?: string
  notes_internes?: string
  adresse_specifique?: string
}

// Type pour les détails de plat modifiables
export interface ModifiablePlatDetail extends DetailCommande {
  plat?: PlatSimpleUI | undefined
  quantite_plat_commande: number // Requis et jamais null
}
