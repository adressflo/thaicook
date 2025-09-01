export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Types pour les énumérations
export type StatutCommande = 
  | 'En attente de confirmation'
  | 'Confirmée' 
  | 'En préparation'
  | 'Prête à récupérer'
  | 'Récupérée'
  | 'Annulée'

// Type étendu pour l'affichage (inclut "Terminée" pour l'interface)
export type StatutCommandeAffichage = StatutCommande | 'Terminée'

export type Database = {
  public: {
    Tables: {
      activites_flux: {
        Row: {
          client_id: number | null
          commande_id: number | null
          description: string
          evenement_id: number | null
          id: number
          lu: boolean | null
          timestamp: string | null
          type_activite: string
        }
        Insert: {
          client_id?: number | null
          commande_id?: number | null
          description: string
          evenement_id?: number | null
          id?: number
          lu?: boolean | null
          timestamp?: string | null
          type_activite: string
        }
        Update: {
          client_id?: number | null
          commande_id?: number | null
          description?: string
          evenement_id?: number | null
          id?: number
          lu?: boolean | null
          timestamp?: string | null
          type_activite?: string
        }
        Relationships: []
      }
      client_db: {
        Row: {
          adresse_numero_et_rue: string | null
          code_postal: number | null
          comment_avez_vous_connu: string[] | null
          date_de_naissance: string | null
          email: string | null
          firebase_uid: string
          idclient: number
          nom: string | null
          numero_de_telephone: string | null
          photo_client: string | null
          preference_client: string | null
          prenom: string | null
          role: string | null
          souhaitez_vous_recevoir_actualites: boolean | null
          ville: string | null
        }
        Insert: {
          adresse_numero_et_rue?: string | null
          code_postal?: number | null
          comment_avez_vous_connu?: string[] | null
          date_de_naissance?: string | null
          email?: string | null
          firebase_uid?: string
          idclient?: number
          nom?: string | null
          numero_de_telephone?: string | null
          photo_client?: string | null
          preference_client?: string | null
          prenom?: string | null
          role?: string | null
          souhaitez_vous_recevoir_actualites?: boolean | null
          ville?: string | null
        }
        Update: {
          adresse_numero_et_rue?: string | null
          code_postal?: number | null
          comment_avez_vous_connu?: string[] | null
          date_de_naissance?: string | null
          email?: string | null
          firebase_uid?: string
          idclient?: number
          nom?: string | null
          numero_de_telephone?: string | null
          photo_client?: string | null
          preference_client?: string | null
          prenom?: string | null
          role?: string | null
          souhaitez_vous_recevoir_actualites?: boolean | null
          ville?: string | null
        }
        Relationships: []
      }
      plats_db: {
        Row: {
          description: string | null
          dimanche_dispo: string | null
          epuise_depuis: string | null
          epuise_jusqu_a: string | null
          est_epuise: boolean | null
          idplats: number
          jeudi_dispo: string
          lundi_dispo: string
          mardi_dispo: string
          mercredi_dispo: string
          photo_du_plat: string | null
          plat: string
          prix: number | null
          raison_epuisement: string | null
          samedi_dispo: string | null
          vendredi_dispo: string | null
        }
        Insert: {
          description?: string | null
          dimanche_dispo?: string | null
          epuise_depuis?: string | null
          epuise_jusqu_a?: string | null
          est_epuise?: boolean | null
          idplats?: number
          jeudi_dispo?: string
          lundi_dispo?: string
          mardi_dispo: string
          mercredi_dispo?: string
          photo_du_plat?: string | null
          plat: string
          prix?: number | null
          raison_epuisement?: string | null
          samedi_dispo?: string | null
          vendredi_dispo?: string | null
        }
        Update: {
          description?: string | null
          dimanche_dispo?: string | null
          epuise_depuis?: string | null
          epuise_jusqu_a?: string | null
          est_epuise?: boolean | null
          idplats?: number
          jeudi_dispo?: string
          lundi_dispo?: string
          mardi_dispo?: string
          mercredi_dispo?: string
          photo_du_plat?: string | null
          plat?: string
          prix?: number | null
          raison_epuisement?: string | null
          samedi_dispo?: string | null
          vendredi_dispo?: string | null
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
          nom_evenement: string | null
          notes_internes: string | null
          statut_commande: StatutCommande | null
          statut_paiement: string | null
          type_livraison: string | null
        }
        Insert: {
          adresse_specifique?: string | null
          client_r?: string | null
          client_r_id?: number | null
          date_de_prise_de_commande?: string | null
          date_et_heure_de_retrait_souhaitees?: string | null
          demande_special_pour_la_commande?: string | null
          idcommande?: number
          nom_evenement?: string | null
          notes_internes?: string | null
          statut_commande?: StatutCommande | null
          statut_paiement?: string | null
          type_livraison?: string | null
        }
        Update: {
          adresse_specifique?: string | null
          client_r?: string | null
          client_r_id?: number | null
          date_de_prise_de_commande?: string | null
          date_et_heure_de_retrait_souhaitees?: string | null
          demande_special_pour_la_commande?: string | null
          idcommande?: number
          nom_evenement?: string | null
          notes_internes?: string | null
          statut_commande?: StatutCommande | null
          statut_paiement?: string | null
          type_livraison?: string | null
        }
        Relationships: []
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
        Relationships: []
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
          statut_acompte: string | null
          statut_evenement: string | null
          statut_paiement_final: string | null
          type_d_evenement: string | null
          updated_at: string | null
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
          statut_acompte?: string | null
          statut_evenement?: string | null
          statut_paiement_final?: string | null
          type_d_evenement?: string | null
          updated_at?: string | null
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
          statut_acompte?: string | null
          statut_evenement?: string | null
          statut_paiement_final?: string | null
          type_d_evenement?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      listes_courses: {
        Row: {
          created_by: string | null
          date_creation: string | null
          date_derniere_modification: string | null
          description: string | null
          id: number
          nom_liste: string
          statut: string | null
          total_estimatif: number | null
        }
        Insert: {
          created_by?: string | null
          date_creation?: string | null
          date_derniere_modification?: string | null
          description?: string | null
          id?: number
          nom_liste: string
          statut?: string | null
          total_estimatif?: number | null
        }
        Update: {
          created_by?: string | null
          date_creation?: string | null
          date_derniere_modification?: string | null
          description?: string | null
          id?: number
          nom_liste?: string
          statut?: string | null
          total_estimatif?: number | null
        }
        Relationships: []
      }
      articles_liste_courses: {
        Row: {
          achete: boolean | null
          commentaire: string | null
          created_at: string | null
          date_achat: string | null
          id: number
          liste_id: number | null
          nom_article: string
          ordre_affichage: number | null
          prix_total_estime: number | null
          prix_unitaire_estime: number | null
          quantite: number
          unite: string | null
        }
        Insert: {
          achete?: boolean | null
          commentaire?: string | null
          created_at?: string | null
          date_achat?: string | null
          id?: number
          liste_id?: number | null
          nom_article: string
          ordre_affichage?: number | null
          prix_total_estime?: number | null
          prix_unitaire_estime?: number | null
          quantite?: number
          unite?: string | null
        }
        Update: {
          achete?: boolean | null
          commentaire?: string | null
          created_at?: string | null
          date_achat?: string | null
          id?: number
          liste_id?: number | null
          nom_article?: string
          ordre_affichage?: number | null
          prix_total_estime?: number | null
          prix_unitaire_estime?: number | null
          quantite?: number
          unite?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}