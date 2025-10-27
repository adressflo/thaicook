export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      account: {
        Row: {
          accessToken: string | null
          accessTokenExpiresAt: string | null
          accountId: string
          createdAt: string
          id: string
          idToken: string | null
          password: string | null
          provider: string
          providerId: string
          refreshTokenExpiresAt: string | null
          scope: string | null
          type: string
          updatedAt: string
          userId: string
        }
        Insert: {
          accessToken?: string | null
          accessTokenExpiresAt?: string | null
          accountId: string
          createdAt?: string
          id: string
          idToken?: string | null
          password?: string | null
          provider: string
          providerId: string
          refreshTokenExpiresAt?: string | null
          scope?: string | null
          type: string
          updatedAt: string
          userId: string
        }
        Update: {
          accessToken?: string | null
          accessTokenExpiresAt?: string | null
          accountId?: string
          createdAt?: string
          id?: string
          idToken?: string | null
          password?: string | null
          provider?: string
          providerId?: string
          refreshTokenExpiresAt?: string | null
          scope?: string | null
          type?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: [
          {
            foreignKeyName: "activites_flux_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "activites_flux_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_clients_actifs"
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
          {
            foreignKeyName: "activites_flux_evenement_id_fkey"
            columns: ["evenement_id"]
            isOneToOne: false
            referencedRelation: "mv_evenements_dashboard"
            referencedColumns: ["idevenements"]
          },
        ]
      }
      announcements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          message: string
          priority: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          message: string
          priority?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          message?: string
          priority?: string | null
          type?: string | null
          updated_at?: string | null
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
        Relationships: [
          {
            foreignKeyName: "articles_liste_courses_liste_id_fkey"
            columns: ["liste_id"]
            isOneToOne: false
            referencedRelation: "listes_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogue_articles: {
        Row: {
          categorie: string | null
          created_at: string | null
          derniere_utilisation: string | null
          fournisseur_habituel: string | null
          frequence_utilisation: number | null
          id: number
          nom_article: string
          prix_moyen: number | null
          unite_habituelle: string | null
        }
        Insert: {
          categorie?: string | null
          created_at?: string | null
          derniere_utilisation?: string | null
          fournisseur_habituel?: string | null
          frequence_utilisation?: number | null
          id?: number
          nom_article: string
          prix_moyen?: number | null
          unite_habituelle?: string | null
        }
        Update: {
          categorie?: string | null
          created_at?: string | null
          derniere_utilisation?: string | null
          fournisseur_habituel?: string | null
          frequence_utilisation?: number | null
          id?: number
          nom_article?: string
          prix_moyen?: number | null
          unite_habituelle?: string | null
        }
        Relationships: []
      }
      categories_articles: {
        Row: {
          couleur: string | null
          icone: string | null
          id: number
          nom_categorie: string
          ordre_affichage: number | null
        }
        Insert: {
          couleur?: string | null
          icone?: string | null
          id?: number
          nom_categorie: string
          ordre_affichage?: number | null
        }
        Update: {
          couleur?: string | null
          icone?: string | null
          id?: number
          nom_categorie?: string
          ordre_affichage?: number | null
        }
        Relationships: []
      }
      client_db: {
        Row: {
          adresse_numero_et_rue: string | null
          auth_user_id: string | null
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
          role: Database["public"]["Enums"]["role_client"] | null
          souhaitez_vous_recevoir_actualites: boolean | null
          ville: string | null
        }
        Insert: {
          adresse_numero_et_rue?: string | null
          auth_user_id?: string | null
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
          role?: Database["public"]["Enums"]["role_client"] | null
          souhaitez_vous_recevoir_actualites?: boolean | null
          ville?: string | null
        }
        Update: {
          adresse_numero_et_rue?: string | null
          auth_user_id?: string | null
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
          nom_evenement: string | null
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
          nom_evenement?: string | null
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
          nom_evenement?: string | null
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
          {
            foreignKeyName: "commande_db_client_r_id_fkey"
            columns: ["client_r_id"]
            isOneToOne: false
            referencedRelation: "mv_clients_actifs"
            referencedColumns: ["idclient"]
          },
        ]
      }
      details_commande_db: {
        Row: {
          commande_r: number
          extra_id: number | null
          iddetails: number
          nom_plat: string | null
          plat_r: number
          prix_unitaire: number | null
          quantite_plat_commande: number | null
          type: string | null
        }
        Insert: {
          commande_r: number
          extra_id?: number | null
          iddetails?: number
          nom_plat?: string | null
          plat_r: number
          prix_unitaire?: number | null
          quantite_plat_commande?: number | null
          type?: string | null
        }
        Update: {
          commande_r?: number
          extra_id?: number | null
          iddetails?: number
          nom_plat?: string | null
          plat_r?: number
          prix_unitaire?: number | null
          quantite_plat_commande?: number | null
          type?: string | null
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
            foreignKeyName: "details_commande_db_extra_id_fkey"
            columns: ["extra_id"]
            isOneToOne: false
            referencedRelation: "extras_db"
            referencedColumns: ["idextra"]
          },
          {
            foreignKeyName: "détails_commande_db_plat_r_fkey"
            columns: ["plat_r"]
            isOneToOne: false
            referencedRelation: "mv_plats_populaires"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "détails_commande_db_plat_r_fkey"
            columns: ["plat_r"]
            isOneToOne: false
            referencedRelation: "plats_db"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "détails_commande_db_plat_r_fkey"
            columns: ["plat_r"]
            isOneToOne: false
            referencedRelation: "plats_disponibilite_view"
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
          updated_at?: string | null
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
            foreignKeyName: "evenements_db_contact_client_r_id_fkey"
            columns: ["contact_client_r_id"]
            isOneToOne: false
            referencedRelation: "mv_clients_actifs"
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
            foreignKeyName: "├ëvénements_plats_r_evenement_id_fkey"
            columns: ["evenement_id"]
            isOneToOne: false
            referencedRelation: "evenements_db"
            referencedColumns: ["idevenements"]
          },
          {
            foreignKeyName: "├ëvénements_plats_r_evenement_id_fkey"
            columns: ["evenement_id"]
            isOneToOne: false
            referencedRelation: "mv_evenements_dashboard"
            referencedColumns: ["idevenements"]
          },
          {
            foreignKeyName: "├ëvénements_plats_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "mv_plats_populaires"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "├ëvénements_plats_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_db"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "├ëvénements_plats_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_disponibilite_view"
            referencedColumns: ["idplats"]
          },
        ]
      }
      extras_db: {
        Row: {
          actif: boolean | null
          created_at: string | null
          description: string | null
          idextra: number
          nom_extra: string
          photo_url: string | null
          prix: number
          updated_at: string | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          description?: string | null
          idextra?: number
          nom_extra: string
          photo_url?: string | null
          prix?: number
          updated_at?: string | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          description?: string | null
          idextra?: number
          nom_extra?: string
          photo_url?: string | null
          prix?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      historique_communication: {
        Row: {
          canal: string | null
          client_id: number | null
          envoye_par: string | null
          id: number
          message: string
          statut: string | null
          timestamp: string | null
        }
        Insert: {
          canal?: string | null
          client_id?: number | null
          envoye_par?: string | null
          id?: number
          message: string
          statut?: string | null
          timestamp?: string | null
        }
        Update: {
          canal?: string | null
          client_id?: number | null
          envoye_par?: string | null
          id?: number
          message?: string
          statut?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historique_communication_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "historique_communication_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_clients_actifs"
            referencedColumns: ["idclient"]
          },
        ]
      }
      ingredients_db: {
        Row: {
          categorie:
            | Database["public"]["Enums"]["categorie_ingredient"][]
            | null
          fournisseur: string[] | null
          idingredients: number
          ingredient: string
          notes: string | null
          seuil_d_alerte: number | null
          stock_actuel: number | null
          unite: Database["public"]["Enums"]["unite_ingredient"][] | null
        }
        Insert: {
          categorie?:
            | Database["public"]["Enums"]["categorie_ingredient"][]
            | null
          fournisseur?: string[] | null
          idingredients?: number
          ingredient: string
          notes?: string | null
          seuil_d_alerte?: number | null
          stock_actuel?: number | null
          unite?: Database["public"]["Enums"]["unite_ingredient"][] | null
        }
        Update: {
          categorie?:
            | Database["public"]["Enums"]["categorie_ingredient"][]
            | null
          fournisseur?: string[] | null
          idingredients?: number
          ingredient?: string
          notes?: string | null
          seuil_d_alerte?: number | null
          stock_actuel?: number | null
          unite?: Database["public"]["Enums"]["unite_ingredient"][] | null
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
      menus_evenementiels_types_db: {
        Row: {
          adapte_pour_types_evenement:
            | Database["public"]["Enums"]["type_evenement"][]
            | null
          description: string | null
          idevenementiels: number
          nom_menu_type: string
          nombre_de_convives_suggere: string | null
          notes_internes_menu_type: string | null
          photo_d_ambiance_menu: string | null
          prix_indicatif_par_personne_interne: number | null
        }
        Insert: {
          adapte_pour_types_evenement?:
            | Database["public"]["Enums"]["type_evenement"][]
            | null
          description?: string | null
          idevenementiels?: number
          nom_menu_type: string
          nombre_de_convives_suggere?: string | null
          notes_internes_menu_type?: string | null
          photo_d_ambiance_menu?: string | null
          prix_indicatif_par_personne_interne?: number | null
        }
        Update: {
          adapte_pour_types_evenement?:
            | Database["public"]["Enums"]["type_evenement"][]
            | null
          description?: string | null
          idevenementiels?: number
          nom_menu_type?: string
          nombre_de_convives_suggere?: string | null
          notes_internes_menu_type?: string | null
          photo_d_ambiance_menu?: string | null
          prix_indicatif_par_personne_interne?: number | null
        }
        Relationships: []
      }
      menus_types_plats_r: {
        Row: {
          menu_type_id: number
          plat_id: number
        }
        Insert: {
          menu_type_id: number
          plat_id: number
        }
        Update: {
          menu_type_id?: number
          plat_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "menus_types_plats_r_menu_type_id_fkey"
            columns: ["menu_type_id"]
            isOneToOne: false
            referencedRelation: "menus_evenementiels_types_db"
            referencedColumns: ["idevenementiels"]
          },
          {
            foreignKeyName: "menus_types_plats_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "mv_plats_populaires"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "menus_types_plats_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_db"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "menus_types_plats_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_disponibilite_view"
            referencedColumns: ["idplats"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          client_id: number | null
          commande_confirmee: boolean | null
          commande_preparation: boolean | null
          commande_prete: boolean | null
          commande_retard: boolean | null
          created_at: string | null
          evenement_confirme: boolean | null
          evenement_preparation: boolean | null
          evenement_rappel_24h: boolean | null
          evenement_rappel_48h: boolean | null
          id: number
          message_admin: boolean | null
          newsletter: boolean | null
          notifications_enabled: boolean | null
          nouveautes: boolean | null
          promotions: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          rappel_paiement: boolean | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          commande_confirmee?: boolean | null
          commande_preparation?: boolean | null
          commande_prete?: boolean | null
          commande_retard?: boolean | null
          created_at?: string | null
          evenement_confirme?: boolean | null
          evenement_preparation?: boolean | null
          evenement_rappel_24h?: boolean | null
          evenement_rappel_48h?: boolean | null
          id?: number
          message_admin?: boolean | null
          newsletter?: boolean | null
          notifications_enabled?: boolean | null
          nouveautes?: boolean | null
          promotions?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          rappel_paiement?: boolean | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          commande_confirmee?: boolean | null
          commande_preparation?: boolean | null
          commande_prete?: boolean | null
          commande_retard?: boolean | null
          created_at?: string | null
          evenement_confirme?: boolean | null
          evenement_preparation?: boolean | null
          evenement_rappel_24h?: boolean | null
          evenement_rappel_48h?: boolean | null
          id?: number
          message_admin?: boolean | null
          newsletter?: boolean | null
          notifications_enabled?: boolean | null
          nouveautes?: boolean | null
          promotions?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          rappel_paiement?: boolean | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "notification_preferences_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "mv_clients_actifs"
            referencedColumns: ["idclient"]
          },
        ]
      }
      notification_queue: {
        Row: {
          client_id: number | null
          created_at: string | null
          error_message: string | null
          id: number
          max_retries: number | null
          priority: string | null
          processed_at: string | null
          retry_count: number | null
          scheduled_for: string | null
          status: string | null
          template_code: string | null
          variables: Json | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: number
          max_retries?: number | null
          priority?: string | null
          processed_at?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          status?: string | null
          template_code?: string | null
          variables?: Json | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: number
          max_retries?: number | null
          priority?: string | null
          processed_at?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          status?: string | null
          template_code?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "notification_queue_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_clients_actifs"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "notification_queue_template_code_fkey"
            columns: ["template_code"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["code"]
          },
        ]
      }
      notification_templates: {
        Row: {
          auto_trigger: boolean | null
          body_template: string
          code: string
          created_at: string | null
          delay_minutes: number | null
          id: number
          is_active: boolean | null
          nom: string
          priority: string | null
          title_template: string
          type_evenement: string
          updated_at: string | null
          variables_disponibles: string[] | null
        }
        Insert: {
          auto_trigger?: boolean | null
          body_template: string
          code: string
          created_at?: string | null
          delay_minutes?: number | null
          id?: number
          is_active?: boolean | null
          nom: string
          priority?: string | null
          title_template: string
          type_evenement: string
          updated_at?: string | null
          variables_disponibles?: string[] | null
        }
        Update: {
          auto_trigger?: boolean | null
          body_template?: string
          code?: string
          created_at?: string | null
          delay_minutes?: number | null
          id?: number
          is_active?: boolean | null
          nom?: string
          priority?: string | null
          title_template?: string
          type_evenement?: string
          updated_at?: string | null
          variables_disponibles?: string[] | null
        }
        Relationships: []
      }
      notification_tokens: {
        Row: {
          auth_key: string | null
          client_id: number | null
          created_at: string | null
          device_token: string
          device_type: string | null
          endpoint_url: string | null
          id: number
          is_active: boolean | null
          last_used: string | null
          p256dh_key: string | null
          user_agent: string | null
        }
        Insert: {
          auth_key?: string | null
          client_id?: number | null
          created_at?: string | null
          device_token: string
          device_type?: string | null
          endpoint_url?: string | null
          id?: number
          is_active?: boolean | null
          last_used?: string | null
          p256dh_key?: string | null
          user_agent?: string | null
        }
        Update: {
          auth_key?: string | null
          client_id?: number | null
          created_at?: string | null
          device_token?: string
          device_type?: string | null
          endpoint_url?: string | null
          id?: number
          is_active?: boolean | null
          last_used?: string | null
          p256dh_key?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_tokens_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "notification_tokens_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_clients_actifs"
            referencedColumns: ["idclient"]
          },
        ]
      }
      notifications_history: {
        Row: {
          body: string
          client_id: number | null
          commande_id: number | null
          completed_at: string | null
          created_at: string | null
          data: Json | null
          device_tokens_failed: number | null
          device_tokens_sent: number | null
          device_tokens_success: number | null
          error_message: string | null
          evenement_id: number | null
          id: number
          priority: string | null
          sent_at: string | null
          statut: string | null
          title: string
          type_notification: string
        }
        Insert: {
          body: string
          client_id?: number | null
          commande_id?: number | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          device_tokens_failed?: number | null
          device_tokens_sent?: number | null
          device_tokens_success?: number | null
          error_message?: string | null
          evenement_id?: number | null
          id?: number
          priority?: string | null
          sent_at?: string | null
          statut?: string | null
          title: string
          type_notification: string
        }
        Update: {
          body?: string
          client_id?: number | null
          commande_id?: number | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          device_tokens_failed?: number | null
          device_tokens_sent?: number | null
          device_tokens_success?: number | null
          error_message?: string | null
          evenement_id?: number | null
          id?: number
          priority?: string | null
          sent_at?: string | null
          statut?: string | null
          title?: string
          type_notification?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_db"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "notifications_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_clients_actifs"
            referencedColumns: ["idclient"]
          },
          {
            foreignKeyName: "notifications_history_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commande_db"
            referencedColumns: ["idcommande"]
          },
          {
            foreignKeyName: "notifications_history_evenement_id_fkey"
            columns: ["evenement_id"]
            isOneToOne: false
            referencedRelation: "evenements_db"
            referencedColumns: ["idevenements"]
          },
          {
            foreignKeyName: "notifications_history_evenement_id_fkey"
            columns: ["evenement_id"]
            isOneToOne: false
            referencedRelation: "mv_evenements_dashboard"
            referencedColumns: ["idevenements"]
          },
        ]
      }
      plats_db: {
        Row: {
          description: string | null
          dimanche_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          epuise_depuis: string | null
          epuise_jusqu_a: string | null
          est_epuise: boolean | null
          idplats: number
          jeudi_dispo: Database["public"]["Enums"]["jour_dispo"]
          lundi_dispo: Database["public"]["Enums"]["jour_dispo"]
          mardi_dispo: Database["public"]["Enums"]["jour_dispo"]
          mercredi_dispo: Database["public"]["Enums"]["jour_dispo"]
          photo_du_plat: string | null
          plat: string
          prix: number | null
          raison_epuisement: string | null
          samedi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          vendredi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
        }
        Insert: {
          description?: string | null
          dimanche_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          epuise_depuis?: string | null
          epuise_jusqu_a?: string | null
          est_epuise?: boolean | null
          idplats?: number
          jeudi_dispo?: Database["public"]["Enums"]["jour_dispo"]
          lundi_dispo?: Database["public"]["Enums"]["jour_dispo"]
          mardi_dispo: Database["public"]["Enums"]["jour_dispo"]
          mercredi_dispo?: Database["public"]["Enums"]["jour_dispo"]
          photo_du_plat?: string | null
          plat: string
          prix?: number | null
          raison_epuisement?: string | null
          samedi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          vendredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
        }
        Update: {
          description?: string | null
          dimanche_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          epuise_depuis?: string | null
          epuise_jusqu_a?: string | null
          est_epuise?: boolean | null
          idplats?: number
          jeudi_dispo?: Database["public"]["Enums"]["jour_dispo"]
          lundi_dispo?: Database["public"]["Enums"]["jour_dispo"]
          mardi_dispo?: Database["public"]["Enums"]["jour_dispo"]
          mercredi_dispo?: Database["public"]["Enums"]["jour_dispo"]
          photo_du_plat?: string | null
          plat?: string
          prix?: number | null
          raison_epuisement?: string | null
          samedi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          vendredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
        }
        Relationships: []
      }
      plats_ingredients_r: {
        Row: {
          ingredient_id: number
          plat_id: number
        }
        Insert: {
          ingredient_id: number
          plat_id: number
        }
        Update: {
          ingredient_id?: number
          plat_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plats_ingredients_r_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients_db"
            referencedColumns: ["idingredients"]
          },
          {
            foreignKeyName: "plats_ingredients_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "mv_plats_populaires"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "plats_ingredients_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_db"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "plats_ingredients_r_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_disponibilite_view"
            referencedColumns: ["idplats"]
          },
        ]
      }
      plats_rupture_dates: {
        Row: {
          created_at: string | null
          created_by: string | null
          date_rupture: string
          id: number
          is_active: boolean | null
          notes_rupture: string | null
          plat_id: number
          raison_rupture: string | null
          type_rupture: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date_rupture: string
          id?: number
          is_active?: boolean | null
          notes_rupture?: string | null
          plat_id: number
          raison_rupture?: string | null
          type_rupture?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date_rupture?: string
          id?: number
          is_active?: boolean | null
          notes_rupture?: string | null
          plat_id?: number
          raison_rupture?: string | null
          type_rupture?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plats_rupture_dates_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "mv_plats_populaires"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "plats_rupture_dates_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_db"
            referencedColumns: ["idplats"]
          },
          {
            foreignKeyName: "plats_rupture_dates_plat_id_fkey"
            columns: ["plat_id"]
            isOneToOne: false
            referencedRelation: "plats_disponibilite_view"
            referencedColumns: ["idplats"]
          },
        ]
      }
      restaurant_settings: {
        Row: {
          description: string | null
          id: number
          setting_key: string
          setting_type: string | null
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          setting_key: string
          setting_type?: string | null
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          setting_key?: string
          setting_type?: string | null
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      session: {
        Row: {
          createdAt: string
          expiresAt: string
          id: string
          ipAddress: string | null
          token: string
          updatedAt: string
          userAgent: string | null
          userId: string
        }
        Insert: {
          createdAt?: string
          expiresAt: string
          id: string
          ipAddress?: string | null
          token: string
          updatedAt: string
          userAgent?: string | null
          userId: string
        }
        Update: {
          createdAt?: string
          expiresAt?: string
          id?: string
          ipAddress?: string | null
          token?: string
          updatedAt?: string
          userAgent?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: number
          setting_key: string
          setting_type: string | null
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          setting_key: string
          setting_type?: string | null
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          setting_key?: string
          setting_type?: string | null
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user: {
        Row: {
          createdAt: string
          email: string
          emailVerified: boolean
          id: string
          image: string | null
          name: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          emailVerified?: boolean
          id: string
          image?: string | null
          name?: string | null
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: boolean
          id?: string
          image?: string | null
          name?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      verification: {
        Row: {
          createdAt: string
          expiresAt: string
          id: string
          identifier: string
          updatedAt: string
          value: string
        }
        Insert: {
          createdAt?: string
          expiresAt: string
          id: string
          identifier: string
          updatedAt: string
          value: string
        }
        Update: {
          createdAt?: string
          expiresAt?: string
          id?: string
          identifier?: string
          updatedAt?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      admins_list: {
        Row: {
          email: string | null
          firebase_uid: string | null
          nom: string | null
          prenom: string | null
          role: string | null
        }
        Insert: {
          email?: string | null
          firebase_uid?: string | null
          nom?: string | null
          prenom?: string | null
          role?: never
        }
        Update: {
          email?: string | null
          firebase_uid?: string | null
          nom?: string | null
          prenom?: string | null
          role?: never
        }
        Relationships: []
      }
      monitoring_index_usage: {
        Row: {
          index_name: unknown
          index_scans: number | null
          table_name: unknown
          tuples_fetched: number | null
          tuples_read: number | null
          usage_status: string | null
        }
        Relationships: []
      }
      monitoring_rls_policies: {
        Row: {
          operation: string | null
          permissive: string | null
          policy_type: string | null
          policyname: unknown
          roles: unknown[] | null
          schemaname: unknown
          tablename: unknown
        }
        Relationships: []
      }
      mv_clients_actifs: {
        Row: {
          commandes_30j: number | null
          derniere_commande: string | null
          email: string | null
          idclient: number | null
          nb_commandes_total: number | null
          nb_evenements_total: number | null
          nom_complet: string | null
          numero_de_telephone: string | null
          segment_client: string | null
          statut_activite: string | null
          ville: string | null
        }
        Relationships: []
      }
      mv_commandes_stats: {
        Row: {
          commandes_payees: number | null
          date_commande: string | null
          id: number | null
          nombre_commandes: number | null
          statut_commande: Database["public"]["Enums"]["statut_commande"] | null
          type_livraison: Database["public"]["Enums"]["type_livraison"] | null
        }
        Relationships: []
      }
      mv_evenements_dashboard: {
        Row: {
          date_evenement: string | null
          email_client: string | null
          idevenements: number | null
          jours_restants: number | null
          nom_complet_client: string | null
          nom_evenement: string | null
          nombre_de_personnes: number | null
          numero_de_telephone: string | null
          periode: string | null
          prix_total_devise: number | null
          statut_evenement:
            | Database["public"]["Enums"]["statut_evenement"]
            | null
          type_d_evenement: Database["public"]["Enums"]["type_evenement"] | null
        }
        Relationships: []
      }
      mv_kpi_dashboard: {
        Row: {
          commandes_jour: number | null
          commandes_payees_jour: number | null
          commandes_semaine: number | null
          derniere_maj: string | null
          evenements_semaine: number | null
          id: number | null
          notifications_pending: number | null
          plats_epuises: number | null
          total_clients: number | null
        }
        Relationships: []
      }
      mv_plats_populaires: {
        Row: {
          derniere_commande: string | null
          est_epuise: boolean | null
          idplats: number | null
          nb_commandes_30j: number | null
          niveau_popularite: string | null
          photo_du_plat: string | null
          plat: string | null
          prix: number | null
          quantite_totale_30j: number | null
        }
        Relationships: []
      }
      plats_disponibilite_view: {
        Row: {
          description: string | null
          dimanche_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          epuise_depuis: string | null
          epuise_jusqu_a: string | null
          est_epuise: boolean | null
          idplats: number | null
          jeudi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          jours_disponibles_standard: number | null
          lundi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          mardi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          mercredi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          photo_du_plat: string | null
          plat: string | null
          prix: number | null
          raison_epuisement: string | null
          samedi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
          statut_disponibilite: string | null
          vendredi_dispo: Database["public"]["Enums"]["jour_dispo"] | null
        }
        Insert: {
          description?: string | null
          dimanche_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          epuise_depuis?: string | null
          epuise_jusqu_a?: string | null
          est_epuise?: boolean | null
          idplats?: number | null
          jeudi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          jours_disponibles_standard?: never
          lundi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          mardi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          mercredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          photo_du_plat?: string | null
          plat?: string | null
          prix?: number | null
          raison_epuisement?: string | null
          samedi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          statut_disponibilite?: never
          vendredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
        }
        Update: {
          description?: string | null
          dimanche_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          epuise_depuis?: string | null
          epuise_jusqu_a?: string | null
          est_epuise?: boolean | null
          idplats?: number | null
          jeudi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          jours_disponibles_standard?: never
          lundi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          mardi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          mercredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          photo_du_plat?: string | null
          plat?: string | null
          prix?: number | null
          raison_epuisement?: string | null
          samedi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
          statut_disponibilite?: never
          vendredi_dispo?: Database["public"]["Enums"]["jour_dispo"] | null
        }
        Relationships: []
      }
      v_notification_dashboard: {
        Row: {
          info: string | null
          last_updated: string | null
          total_notifications: number | null
        }
        Relationships: []
      }
      v_restaurant_info: {
        Row: {
          info: string | null
          type: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      v_system_status: {
        Row: {
          info: string | null
          last_check: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_single_announcement: {
        Args: { announcement_id: number }
        Returns: boolean
      }
      auto_maintenance: { Args: never; Returns: Json }
      broadcast_notification: {
        Args: {
          p_filter_preferences?: boolean
          p_template_code: string
          p_variables?: Json
        }
        Returns: {
          clients_cibles: number
          notifications_envoyees: number
          notifications_ignorees: number
        }[]
      }
      bypass_rls_update_plat: {
        Args: { plat_id: number; update_data: Json }
        Returns: {
          description: string
          dimanche_dispo: string
          epuise_depuis: string
          epuise_jusqu_a: string
          est_epuise: boolean
          idplats: number
          jeudi_dispo: string
          lundi_dispo: string
          mardi_dispo: string
          mercredi_dispo: string
          photo_du_plat: string
          plat: string
          prix: number
          raison_epuisement: string
          samedi_dispo: string
          vendredi_dispo: string
        }[]
      }
      check_notification_preferences: {
        Args: { p_client_id: number; p_template_code: string }
        Returns: boolean
      }
      cleanup_inactive_tokens: { Args: never; Returns: number }
      cleanup_old_activities: { Args: never; Returns: number }
      create_notification: {
        Args: {
          p_client_id: number
          p_commande_id?: number
          p_evenement_id?: number
          p_template_code: string
          p_variables?: Json
        }
        Returns: number
      }
      create_or_promote_admin: {
        Args: {
          user_email: string
          user_firebase_uid?: string
          user_nom?: string
          user_prenom?: string
        }
        Returns: string
      }
      demote_to_client: { Args: { user_email: string }; Returns: string }
      est_plat_disponible: {
        Args: {
          check_date?: string
          plat_record: Database["public"]["Tables"]["plats_db"]["Row"]
        }
        Returns: boolean
      }
      get_active_announcement: {
        Args: never
        Returns: {
          created_at: string
          id: number
          is_active: boolean
          message: string
          priority: string
          type: string
        }[]
      }
      get_all_ingredients_simple: {
        Args: never
        Returns: {
          categorie: string[]
          fournisseur: string[]
          idingredients: number
          ingredient: string
          notes: string
          seuil_d_alerte: number
          stock_actuel: number
          unite: string[]
        }[]
      }
      get_current_firebase_uid: { Args: never; Returns: string }
      get_firebase_uid: { Args: never; Returns: string }
      get_ingredients_with_stock: {
        Args: never
        Returns: {
          categorie: string[]
          fournisseur: string[]
          idingredients: number
          ingredient: string
          notes: string
          seuil_d_alerte: number
          stock_actuel: number
          unite: string[]
        }[]
      }
      get_notification_stats: {
        Args: { p_periode_jours?: number }
        Returns: {
          derniere_notification: string
          taux_succes: number
          total_echecs: number
          total_envoyes: number
          total_reussis: number
          type_notification: string
        }[]
      }
      get_performance_stats: {
        Args: never
        Returns: {
          last_analyze: string
          row_count: number
          size_mb: number
          table_name: string
        }[]
      }
      get_restaurant_setting: { Args: { key_name: string }; Returns: string }
      get_user_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_current_user_admin: { Args: never; Returns: boolean }
      is_current_user_authenticated: { Args: never; Returns: boolean }
      is_plat_available_on_date: {
        Args: { p_date: string; p_plat_id: number }
        Returns: boolean
      }
      maintain_notification_system: { Args: never; Returns: Json }
      process_notification_queue: { Args: never; Returns: number }
      promote_to_admin: { Args: { user_email: string }; Returns: string }
      queue_notification: {
        Args: {
          p_client_id: number
          p_delay_minutes?: number
          p_priority?: string
          p_template_code: string
          p_variables?: Json
        }
        Returns: number
      }
      refresh_all_views: { Args: never; Returns: Json }
      refresh_critical_views: { Args: never; Returns: string }
      register_notification_token: {
        Args: {
          p_auth_key?: string
          p_client_id: number
          p_device_token: string
          p_device_type?: string
          p_endpoint_url?: string
          p_p256dh_key?: string
          p_user_agent?: string
        }
        Returns: number
      }
      schedule_automatic_reminders: { Args: never; Returns: number }
      update_ingredient_stock: {
        Args: { ingredient_id: number; new_stock: number }
        Returns: undefined
      }
      update_restaurant_setting: {
        Args: { key_name: string; new_value: string }
        Returns: boolean
      }
      update_total_estimatif: {
        Args: { liste_id_param: number }
        Returns: undefined
      }
    }
    Enums: {
      categorie_ingredient:
        | "Légumes"
        | "├ëpices & Herbes"
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
        | "Payée"
      statut_paiement_final: "En attente" | "Payé" | "En retard"
      type_evenement:
        | "Anniversaire"
        | "Repas d'entreprise"
        | "Fête de famille"
        | "Cocktail dînatoire"
        | "Buffet traiteur"
        | "Autre"
      type_livraison: "À emporter" | "Livraison" | "Sur place"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categorie_ingredient: [
        "Légumes",
        "├ëpices & Herbes",
        "Viandes & Volailles",
        "Produits Secs",
        "Sauces & Condiments",
        "Poisson",
        "Fruit",
        "Produit Laitier",
        "Boisson",
      ],
      jour_dispo: ["oui", "non"],
      role_client: ["client", "admin"],
      source_connaissance: [
        "Bouche à oreille",
        "Réseaux sociaux",
        "Recherche Google",
        "En passant devant",
        "Recommandation d'un ami",
        "Autre",
      ],
      statut_acompte: ["Non applicable", "Demandé", "Reçu"],
      statut_commande: [
        "En attente de confirmation",
        "Confirmée",
        "En préparation",
        "Prête à récupérer",
        "Récupérée",
        "Annulée",
      ],
      statut_evenement: [
        "Contact établi",
        "Demande initiale",
        "Menu en discussion",
        "Devis à faire",
        "Devis envoyé",
        "Confirmé / Acompte en attente",
        "Confirmé / Acompte reçu",
        "En préparation",
        "Réalisé",
        "Facturé / Solde à payer",
        "Payé intégralement",
        "Annulé",
      ],
      statut_paiement: [
        "En attente sur place",
        "Payé sur place",
        "Payé en ligne",
        "Non payé",
        "Payée",
      ],
      statut_paiement_final: ["En attente", "Payé", "En retard"],
      type_evenement: [
        "Anniversaire",
        "Repas d'entreprise",
        "Fête de famille",
        "Cocktail dînatoire",
        "Buffet traiteur",
        "Autre",
      ],
      type_livraison: ["À emporter", "Livraison", "Sur place"],
      unite_ingredient: [
        "g",
        "L",
        "ml",
        "pièce",
        "botte",
        "bouteille",
        "pack",
        "boite",
      ],
    },
  },
} as const
