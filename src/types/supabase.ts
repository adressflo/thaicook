export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_db: {
        Row: {
          adresse_numero_et_rue: string | null
          code_postal: number | null
          comment_avez_vous_connu:
            | Database["public"]["Enums"]["source_connaissance"][]
            | null
          date_de_naissance: string | null
          email: string | null
          firebase_uid: string
          idclient: number
          nom: string | null
          numero_de_telephone: string | null
          photo_client: string | null
          preference_client: string | null
          prenom: string | null
          role: Database["public"]["Enums"]["role_client"] | null
          souhaitez_vous_recevoir_actualites: boolean | null
          ville: string | null
        }
        Insert: {
          adresse_numero_et_rue?: string | null
          code_postal?: number | null
          comment_avez_vous_connu?:
            | Database["public"]["Enums"]["source_connaissance"][]
            | null
          date_de_naissance?: string | null
          email?: string | null
          firebase_uid?: string
          idclient?: number
          nom?: string | null
          numero_de_telephone?: string | null
          photo_client?: string | null
          preference_client?: string | null
          prenom?: string | null
          role?: Database["public"]["Enums"]["role_client"] | null
          souhaitez_vous_recevoir_actualites?: boolean | null
          ville?: string | null
        }
        Update: {
          adresse_numero_et_rue?: string | null
          code_postal?: number | null
          comment_avez_vous_connu?:
            | Database["public"]["Enums"]["source_connaissance"][]
            | null
          date_de_naissance?: string | null
          email?: string | null
          firebase_uid?: string
          idclient?: number
          nom?: string | null
          numero_de_telephone?: string | null
          photo_client?: string | null
          preference_client?: string | null
          prenom?: string | null
          role?: Database["public"]["Enums"]["role_client"] | null
          souhaitez_vous_recevoir_actualites?: boolean | null
          ville?: string | null
        }
        Relationships: []
      }
      commande_db: {
        Row: {
          adresse_specifique: string | null
          client_r: string | null
          client_r_id: number | null
          date_de_prise_de_commande: string | null
          date_et_heure_de_retrait_souhaitees: string | null
          demande_special_pour_la_commande: string | null
          idcommande: number
          notes_internes: string | null
          statut_commande: Database["public"]["Enums"]["statut_commande"] | null
          statut_paiement: Database["public"]["Enums"]["statut_paiement"] | null
          type_livraison: Database["public"]["Enums"]["type_livraison"] | null
        }
        Insert: {
          adresse_specifique?: string | null
          client_r?: string | null
          client_r_id?: number | null
          date_de_prise_de_commande?: string | null
          date_et_heure_de_retrait_souhaitees?: string | null
          demande_special_pour_la_commande?: string | null
          idcommande?: number
          notes_internes?: string | null
          statut_commande?:
            | Database["public"]["Enums"]["statut_commande"]
            | null
          statut_paiement?:
            | Database["public"]["Enums"]["statut_paiement"]
            | null
          type_livraison?: Database["public"]["Enums"]["type_livraison"] | null
        }
        Update: {
          adresse_specifique?: string | null
          client_r?: string | null
          client_r_id?: number | null
          date_de_prise_de_commande?: string | null
          date_et_heure_de_retrait_souhaitees?: string | null
          demande_special_pour_la_commande?: string | null
          idcommande?: number
          notes_internes?: string | null
          statut_commande?:
            | Database["public"]["Enums"]["statut_commande"]
            | null
          statut_paiement?:
            | Database["public"]["Enums"]["statut_paiement"]
            | null
          type_livraison?: Database["public"]["Enums"]["type_livraison"] | null
        }
        Relationships: [
          {
            foreignKeyName: "commande_db_client_r_id_fkey"
            columns: ["client_r_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
        ]
      }
      details_commande_db: {
        Row: {
          commande_r: number
          iddetails: number
          plat_r: number
          quantite_plat_commande: number | null
        }
        Insert: {
          commande_r: number
          iddetails?: number
          plat_r: number
          quantite_plat_commande?: number | null
        }
        Update: {
          commande_r?: number
          iddetails?: number
          plat_r?: number
          quantite_plat_commande?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "détails_commande_db_commande_r_fkey"
            columns: ["commande_r"]
            isOneToOne: false
            referencedRelation: "commande_db"
            referencedColumns: ["idcommande"]
          },
          {
            foreignKeyName: "détails_commande_db_plat_r_fkey"
            columns: ["plat_r"]
            isOneToOne: false
            referencedRelation: "plats_db"
            referencedColumns: ["idplats"]
          },
        ]
      }
      evenements_db: {
        Row: {
          acompte_demande: number | null
          acompte_recu: number | null
          budget_client: number | null
          contact_client_r: string | null
          contact_client_r_id: number | null
          created_at: string | null
          date_acompte_recu: string | null
          date_evenement: string | null
          demandes_speciales_evenement: string | null
          email_contact: string | null
          idevenements: number
          lien_devis_pdf: string | null
          menu_final_convenu: string | null
          menu_type_suggere_r: number | null
          nom_evenement: string | null
          nombre_de_personnes: number | null
          notes_internes_evenement: string | null
          numero_de_telephone: string | null
          plats_preselectionnes: number[] | null
          prix_total_devise: number | null
          statut_acompte: Database["public"]["Enums"]["statut_acompte"] | null
          statut_evenement:
            | Database["public"]["Enums"]["statut_evenement"]
            | null
          statut_paiement_final:
            | Database["public"]["Enums"]["statut_paiement_final"]
            | null
          type_d_evenement: Database["public"]["Enums"]["type_evenement"] | null
        }
        Insert: {
          acompte_demande?: number | null
          acompte_recu?: number | null
          budget_client?: number | null
          contact_client_r?: string | null
          contact_client_r_id?: number | null
          created_at?: string | null
          date_acompte_recu?: string | null
          date_evenement?: string | null
          demandes_speciales_evenement?: string | null
          email_contact?: string | null
          idevenements?: number
          lien_devis_pdf?: string | null
          menu_final_convenu?: string | null
          menu_type_suggere_r?: number | null
          nom_evenement?: string | null
          nombre_de_personnes?: number | null
          notes_internes_evenement?: string | null
          numero_de_telephone?: string | null
          plats_preselectionnes?: number[] | null
          prix_total_devise?: number | null
          statut_acompte?: Database["public"]["Enums"]["statut_acompte"] | null
          statut_evenement?:
            | Database["public"]["Enums"]["statut_evenement"]
            | null
          statut_paiement_final?:
            | Database["public"]["Enums"]["statut_paiement_final"]
            | null
          type_d_evenement?:
            | Database["public"]["Enums"]["type_evenement"]
            | null
        }
        Update: {
          acompte_demande?: number | null
          acompte_recu?: number | null
          budget_client?: number | null
          contact_client_r?: string | null
          contact_client_r_id?: number | null
          created_at?: string | null
          date_acompte_recu?: string | null
          date_evenement?: string | null
          demandes_speciales_evenement?: string | null
          email_contact?: string | null
          idevenements?: number
          lien_devis_pdf?: string | null
          menu_final_convenu?: string | null
          menu_type_suggere_r?: number | null
          nom_evenement?: string | null
          nombre_de_personnes?: number | null
          notes_internes_evenement?: string | null
          numero_de_telephone?: string | null
          plats_preselectionnes?: number[] | null
          prix_total_devise?: number | null
          statut_acompte?: Database["public"]["Enums"]["statut_acompte"] | null
          statut_evenement?:
            | Database["public"]["Enums"]["statut_evenement"]
            | null
          statut_paiement_final?:
            | Database["public"]["Enums"]["statut_paiement_final"]
            | null
          type_d_evenement?:
            | Database["public"]["Enums"]["type_evenement"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "evenements_db_contact_client_r_id_fkey"
            columns: ["contact_client_r_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "evenements_db_menu_type_suggere_r_fkey"
            columns: ["menu_type_suggere_r"]
            isOneToOne: false
            referencedRelation: "menus_evenementiels_types_db"
            referencedColumns: ["idevenementiels"]
          },
        ]
      }
      evenements_plats_r: {
        Row: {
          evenement_id: number
          plat_id: number
        }
        Insert: {
          evenement_id: number
          plat_id: number
        }
        Update: {
          evenement_id?: number
          plat_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Événements_plats_r_evenement_id_fkey"
            columns: ["evenement_id"]
            isOneToOne: false
            referencedRelation: "evenements_db"
            referencedColumns: ["idevenements"]
          },
          {
            foreignKeyName: "Événements_plats_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_db"
            referencedColumns: ["idplats"]
          },
        ]
      }
      historique_communication: {
        Row: {
          id: number
          client_id: number | null
          message: string
          canal: string | null
          timestamp: string | null
          envoye_par: string | null
          statut: string | null
        }
        Insert: {
          id?: number
          client_id?: number | null
          message: string
          canal?: string | null
          timestamp?: string | null
          envoye_par?: string | null
          statut?: string | null
        }
        Update: {
          id?: number
          client_id?: number | null
          message?: string
          canal?: string | null
          timestamp?: string | null
          envoye_par?: string | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historique_communication_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
        ]
      }
      activites_flux: {
        Row: {
          id: number
          type_activite: string
          description: string
          client_id: number | null
          commande_id: number | null
          evenement_id: number | null
          timestamp: string | null
          lu: boolean | null
        }
        Insert: {
          id?: number
          type_activite: string
          description: string
          client_id?: number | null
          commande_id?: number | null
          evenement_id?: number | null
          timestamp?: string | null
          lu?: boolean | null
        }
        Update: {
          id?: number
          type_activite?: string
          description?: string
          client_id?: number | null
          commande_id?: number | null
          evenement_id?: number | null
          timestamp?: string | null
          lu?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "activites_flux_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "activites_flux_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commande_db"
            referencedColumns: ["idcommande"]
          },
          {
            foreignKeyName: "activites_flux_evenement_id_fkey"
            columns: ["evenement_id"]
            isOneToOne: false
            referencedRelation: "evenements_db"
            referencedColumns: ["idevenements"]
          },
        ]
      }
      plats_db: {
        Row: {
          description: string | null
          dimanche_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          idplats: number
          jeudi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          lundi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          mardi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          mercredi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          photo_du_plat: string | null
          plat: string
          prix: number | null
          samedi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          vendredi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          est_epuise: boolean | null
        }
        Insert: {
          description?: string | null
          dimanche_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          idplats?: number
          jeudi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          lundi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          mardi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          mercredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          photo_du_plat?: string | null
          plat: string
          prix?: number | null
          samedi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          vendredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
        }
        Update: {
          description?: string | null
          dimanche_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          idplats?: number
          jeudi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          lundi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          mardi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          mercredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          photo_du_plat?: string | null
          plat?: string
          prix?: number | null
          samedi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          vendredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      categorie_ingredient:
        | "Légumes"
        | "Épices & Herbes"
        | "Viandes & Volailles"
        | "Produits Secs"
        | "Sauces & Condiments"
        | "Poisson"
        | "Fruit"
        | "Produit Laitier"
        | "Boisson"
      jour_dispo: "oui" | "non"
      role_client: "client" | "admin"
      source_connaissance:
        | "Bouche à oreille"
        | "Réseaux sociaux"
        | "Recherche Google"
        | "En passant devant"
        | "Recommandation d'un ami"
        | "Autre"
      statut_acompte: "Non applicable" | "Demandé" | "Reçu"
      statut_commande:
        | "En attente de confirmation"
        | "Confirmée"
        | "En préparation"
        | "Prête à récupérer"
        | "Récupérée"
        | "Annulée"
      statut_evenement:
        | "Contact établi"
        | "Demande initiale"
        | "Menu en discussion"
        | "Devis à faire"
        | "Devis envoyé"
        | "Confirmé / Acompte en attente"
        | "Confirmé / Acompte reçu"
        | "En préparation"
        | "Réalisé"
        | "Facturé / Solde à payer"
        | "Payé intégralement"
        | "Annulé"
      statut_paiement:
        | "En attente sur place"
        | "Payé sur place"
        | "Payé en ligne"
        | "Non payé"
      statut_paiement_final: "En attente" | "Payé" | "En retard"
      type_evenement:
        | "Anniversaire"
        | "Repas d'entreprise"
        | "Fête de famille"
        | "Cocktail dînatoire"
        | "Buffet traiteur"
        | "Autre"
      type_livraison: "À emporter" | "Livraison"
      unite_ingredient:
        | "g"
        | "L"
        | "ml"
        | "pièce"
        | "botte"
        | "bouteille"
        | "pack"
        | "boite"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Aliases pour maintenir la compatibilité
export type Client = Database['public']['Tables']['client_db']['Row']
export type Plat = Database['public']['Tables']['plats_db']['Row']
export type Commande = Database['public']['Tables']['commande_db']['Row']
export type DetailsCommande = Database['public']['Tables']['details_commande_db']['Row']
export type Evenement = Database['public']['Tables']['evenements_db']['Row']
export type HistoriqueCommunication = Database['public']['Tables']['historique_communication']['Row']
export type ActiviteFlux = Database['public']['Tables']['activites_flux']['Row']

// Nouveaux types pour l'approvisionnement
export type ListeCourse = {
  id: number
  nom_liste: string
  description?: string
  date_creation?: string
  date_derniere_modification?: string
  statut?: 'en_cours' | 'terminee' | 'archivee'
  created_by?: string
  total_estimatif?: number
}

export type ArticleListeCourse = {
  id: number
  liste_id: number
  nom_article: string
  quantite: number
  unite?: string
  prix_unitaire_estime?: number
  prix_total_estime?: number
  achete?: boolean
  date_achat?: string
  commentaire?: string
  ordre_affichage?: number
  created_at?: string
}

export type CatalogueArticle = {
  id: number
  nom_article: string
  unite_habituelle?: string
  prix_moyen?: number
  categorie?: string
  fournisseur_habituel?: string
  frequence_utilisation?: number
  derniere_utilisation?: string
  created_at?: string
}

export type CategorieArticle = {
  id: number
  nom_categorie: string
  couleur?: string
  icone?: string
  ordre_affichage?: number
}

// Types d'entrée
export type ClientInputData = Database['public']['Tables']['client_db']['Insert']
export type PlatInputData = Database['public']['Tables']['plats_db']['Insert']
export type CommandeInputData = Database['public']['Tables']['commande_db']['Insert']
export type EvenementInputData = Database['public']['Tables']['evenements_db']['Insert']
export type HistoriqueCommunicationInputData = Database['public']['Tables']['historique_communication']['Insert']
export type ActiviteFluxInputData = Database['public']['Tables']['activites_flux']['Insert']

export type ListeCourseInputData = Omit<ListeCourse, 'id' | 'date_creation' | 'date_derniere_modification'>
export type ArticleListeCourseInputData = Omit<ArticleListeCourse, 'id' | 'created_at'>
export type CatalogueArticleInputData = Omit<CatalogueArticle, 'id' | 'created_at' | 'derniere_utilisation'>