export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      activites_flux: {
        Row: {
          client_id: number | null;
          commande_id: number | null;
          description: string;
          evenement_id: number | null;
          id: number;
          lu: boolean | null;
          timestamp: string | null;
          type_activite: string;
        };
        Insert: {
          client_id?: number | null;
          commande_id?: number | null;
          description: string;
          evenement_id?: number | null;
          id?: number;
          lu?: boolean | null;
          timestamp?: string | null;
          type_activite: string;
        };
        Update: {
          client_id?: number | null;
          commande_id?: number | null;
          description?: string;
          evenement_id?: number | null;
          id?: number;
          lu?: boolean | null;
          timestamp?: string | null;
          type_activite?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'activites_flux_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'client_db';
            referencedColumns: ['idclient'];
          },
          {
            foreignKeyName: 'activites_flux_commande_id_fkey';
            columns: ['commande_id'];
            isOneToOne: false;
            referencedRelation: 'commande_db';
            referencedColumns: ['idcommande'];
          },
          {
            foreignKeyName: 'activites_flux_evenement_id_fkey';
            columns: ['evenement_id'];
            isOneToOne: false;
            referencedRelation: 'evenements_db';
            referencedColumns: ['idevenements'];
          }
        ];
      };
      announcements: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          id: number;
          is_active: boolean | null;
          message: string;
          priority: string | null;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          id?: number;
          is_active?: boolean | null;
          message: string;
          priority?: string | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          id?: number;
          is_active?: boolean | null;
          message?: string;
          priority?: string | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      articles_liste_courses: {
        Row: {
          achete: boolean | null;
          commentaire: string | null;
          created_at: string | null;
          date_achat: string | null;
          id: number;
          liste_id: number | null;
          nom_article: string;
          ordre_affichage: number | null;
          prix_total_estime: number | null;
          prix_unitaire_estime: number | null;
          quantite: number;
          unite: string | null;
        };
        Insert: {
          achete?: boolean | null;
          commentaire?: string | null;
          created_at?: string | null;
          date_achat?: string | null;
          id?: number;
          liste_id?: number | null;
          nom_article: string;
          ordre_affichage?: number | null;
          prix_total_estime?: number | null;
          prix_unitaire_estime?: number | null;
          quantite: number;
          unite?: string | null;
        };
        Update: {
          achete?: boolean | null;
          commentaire?: string | null;
          created_at?: string | null;
          date_achat?: string | null;
          id?: number;
          liste_id?: number | null;
          nom_article?: string;
          ordre_affichage?: number | null;
          prix_total_estime?: number | null;
          prix_unitaire_estime?: number | null;
          quantite?: number;
          unite?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'articles_liste_courses_liste_id_fkey';
            columns: ['liste_id'];
            isOneToOne: false;
            referencedRelation: 'listes_courses';
            referencedColumns: ['id'];
          }
        ];
      };
      catalogue_articles: {
        Row: {
          categorie: string | null;
          created_at: string | null;
          derniere_utilisation: string | null;
          fournisseur_habituel: string | null;
          frequence_utilisation: number | null;
          id: number;
          nom_article: string;
          prix_moyen: number | null;
          unite_habituelle: string | null;
        };
        Insert: {
          categorie?: string | null;
          created_at?: string | null;
          derniere_utilisation?: string | null;
          fournisseur_habituel?: string | null;
          frequence_utilisation?: number | null;
          id?: number;
          nom_article: string;
          prix_moyen?: number | null;
          unite_habituelle?: string | null;
        };
        Update: {
          categorie?: string | null;
          created_at?: string | null;
          derniere_utilisation?: string | null;
          fournisseur_habituel?: string | null;
          frequence_utilisation?: number | null;
          id?: number;
          nom_article?: string;
          prix_moyen?: number | null;
          unite_habituelle?: string | null;
        };
        Relationships: [];
      };
      categories_articles: {
        Row: {
          couleur: string | null;
          icone: string | null;
          id: number;
          nom_categorie: string;
          ordre_affichage: number | null;
        };
        Insert: {
          couleur?: string | null;
          icone?: string | null;
          id?: number;
          nom_categorie: string;
          ordre_affichage?: number | null;
        };
        Update: {
          couleur?: string | null;
          icone?: string | null;
          id?: number;
          nom_categorie?: string;
          ordre_affichage?: number | null;
        };
        Relationships: [];
      };
      client_db: {
        Row: {
          adresse_numero_et_rue: string | null;
          code_postal: number | null;
          comment_avez_vous_connu: Database['public']['Enums']['source_connaissance'][] | null;
          date_de_naissance: string | null;
          email: string | null;
          firebase_uid: string;
          idclient: number;
          nom: string | null;
          numero_de_telephone: string | null;
          photo_client: string | null;
          preference_client: string | null;
          prenom: string | null;
          role: Database['public']['Enums']['role_client'] | null;
          souhaitez_vous_recevoir_actualites: boolean | null;
          ville: string | null;
        };
        Insert: {
          adresse_numero_et_rue?: string | null;
          code_postal?: number | null;
          comment_avez_vous_connu?: Database['public']['Enums']['source_connaissance'][] | null;
          date_de_naissance?: string | null;
          email?: string | null;
          firebase_uid: string;
          idclient: number;
          nom?: string | null;
          numero_de_telephone?: string | null;
          photo_client?: string | null;
          preference_client?: string | null;
          prenom?: string | null;
          role?: Database['public']['Enums']['role_client'] | null;
          souhaitez_vous_recevoir_actualites?: boolean | null;
          ville?: string | null;
        };
        Update: {
          adresse_numero_et_rue?: string | null;
          code_postal?: number | null;
          comment_avez_vous_connu?: Database['public']['Enums']['source_connaissance'][] | null;
          date_de_naissance?: string | null;
          email?: string | null;
          firebase_uid?: string;
          idclient?: number;
          nom?: string | null;
          numero_de_telephone?: string | null;
          photo_client?: string | null;
          preference_client?: string | null;
          prenom?: string | null;
          role?: Database['public']['Enums']['role_client'] | null;
          souhaitez_vous_recevoir_actualites?: boolean | null;
          ville?: string | null;
        };
        Relationships: [];
      };
      commande_db: {
        Row: {
          adresse_specifique: string | null;
          client_r: string | null;
          client_r_id: number | null;
          date_de_prise_de_commande: string | null;
          date_et_heure_de_retrait_souhaitees: string | null;
          demande_special_pour_la_commande: string | null;
          idcommande: number;
          nom_evenement: string | null;
          notes_internes: string | null;
          statut_commande: Database['public']['Enums']['statut_commande'] | null;
          statut_paiement: Database['public']['Enums']['statut_paiement'] | null;
          type_livraison: Database['public']['Enums']['type_livraison'] | null;
        };
        Insert: {
          adresse_specifique?: string | null;
          client_r?: string | null;
          client_r_id?: number | null;
          date_de_prise_de_commande?: string | null;
          date_et_heure_de_retrait_souhaitees?: string | null;
          demande_special_pour_la_commande?: string | null;
          idcommande?: number;
          nom_evenement?: string | null;
          notes_internes?: string | null;
          statut_commande?: Database['public']['Enums']['statut_commande'] | null;
          statut_paiement?: Database['public']['Enums']['statut_paiement'] | null;
          type_livraison?: Database['public']['Enums']['type_livraison'] | null;
        };
        Update: {
          adresse_specifique?: string | null;
          client_r?: string | null;
          client_r_id?: number | null;
          date_de_prise_de_commande?: string | null;
          date_et_heure_de_retrait_souhaitees?: string | null;
          demande_special_pour_la_commande?: string | null;
          idcommande?: number;
          nom_evenement?: string | null;
          notes_internes?: string | null;
          statut_commande?: Database['public']['Enums']['statut_commande'] | null;
          statut_paiement?: Database['public']['Enums']['statut_paiement'] | null;
          type_livraison?: Database['public']['Enums']['type_livraison'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'commande_db_client_r_id_fkey';
            columns: ['client_r_id'];
            isOneToOne: false;
            referencedRelation: 'client_db';
            referencedColumns: ['idclient'];
          }
        ];
      };
      details_commande_db: {
        Row: {
          commande_r: number;
          iddetails: number;
          plat_r: number;
          quantite_plat_commande: number | null;
        };
        Insert: {
          commande_r: number;
          iddetails?: number;
          plat_r: number;
          quantite_plat_commande?: number | null;
        };
        Update: {
          commande_r?: number;
          iddetails?: number;
          plat_r?: number;
          quantite_plat_commande?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'détails_commande_db_commande_r_fkey';
            columns: ['commande_r'];
            isOneToOne: false;
            referencedRelation: 'commande_db';
            referencedColumns: ['idcommande'];
          },
          {
            foreignKeyName: 'détails_commande_db_plat_r_fkey';
            columns: ['plat_r'];
            isOneToOne: false;
            referencedRelation: 'plats_db';
            referencedColumns: ['idplats'];
          }
        ];
      };
      evenements_db: {
        Row: {
          acompte_demande: number | null;
          acompte_recu: number | null;
          budget_client: number | null;
          contact_client_r: string | null;
          contact_client_r_id: number | null;
          created_at: string | null;
          date_acompte_recu: string | null;
          date_evenement: string | null;
          demandes_speciales_evenement: string | null;
          email_contact: string | null;
          idevenements: number;
          lien_devis_pdf: string | null;
          menu_final_convenu: string | null;
          menu_type_suggere_r: number | null;
          nom_evenement: string | null;
          nombre_de_personnes: number | null;
          notes_internes_evenement: string | null;
          numero_de_telephone: string | null;
          plats_preselectionnes: number[] | null;
          prix_total_devise: number | null;
          statut_acompte: Database['public']['Enums']['statut_acompte'] | null;
          statut_evenement: Database['public']['Enums']['statut_evenement'] | null;
          statut_paiement_final: Database['public']['Enums']['statut_paiement_final'] | null;
          type_d_evenement: Database['public']['Enums']['type_evenement'] | null;
          updated_at: string | null;
        };
        Insert: {
          acompte_demande?: number | null;
          acompte_recu?: number | null;
          budget_client?: number | null;
          contact_client_r?: string | null;
          contact_client_r_id?: number | null;
          created_at?: string | null;
          date_acompte_recu?: string | null;
          date_evenement?: string | null;
          demandes_speciales_evenement?: string | null;
          email_contact?: string | null;
          idevenements?: number;
          lien_devis_pdf?: string | null;
          menu_final_convenu?: string | null;
          menu_type_suggere_r?: number | null;
          nom_evenement?: string | null;
          nombre_de_personnes?: number | null;
          notes_internes_evenement?: string | null;
          numero_de_telephone?: string | null;
          plats_preselectionnes?: number[] | null;
          prix_total_devise?: number | null;
          statut_acompte?: Database['public']['Enums']['statut_acompte'] | null;
          statut_evenement?: Database['public']['Enums']['statut_evenement'] | null;
          statut_paiement_final?: Database['public']['Enums']['statut_paiement_final'] | null;
          type_d_evenement?: Database['public']['Enums']['type_evenement'] | null;
          updated_at?: string | null;
        };
        Update: {
          acompte_demande?: number | null;
          acompte_recu?: number | null;
          budget_client?: number | null;
          contact_client_r?: string | null;
          contact_client_r_id?: number | null;
          created_at?: string | null;
          date_acompte_recu?: string | null;
          date_evenement?: string | null;
          demandes_speciales_evenement?: string | null;
          email_contact?: string | null;
          idevenements?: number;
          lien_devis_pdf?: string | null;
          menu_final_convenu?: string | null;
          menu_type_suggere_r?: number | null;
          nom_evenement?: string | null;
          nombre_de_personnes?: number | null;
          notes_internes_evenement?: string | null;
          numero_de_telephone?: string | null;
          plats_preselectionnes?: number[] | null;
          prix_total_devise?: number | null;
          statut_acompte?: Database['public']['Enums']['statut_acompte'] | null;
          statut_evenement?: Database['public']['Enums']['statut_evenement'] | null;
          statut_paiement_final?: Database['public']['Enums']['statut_paiement_final'] | null;
          type_d_evenement?: Database['public']['Enums']['type_evenement'] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'evenements_db_contact_client_r_id_fkey';
            columns: ['contact_client_r_id'];
            isOneToOne: false;
            referencedRelation: 'client_db';
            referencedColumns: ['idclient'];
          },
          {
            foreignKeyName: 'evenements_db_menu_type_suggere_r_fkey';
            columns: ['menu_type_suggere_r'];
            isOneToOne: false;
            referencedRelation: 'menus_evenementiels_types_db';
            referencedColumns: ['idevenementiels'];
          }
        ];
      };
      evenements_plats_r: {
        Row: {
          evenement_id: number;
          plat_id: number;
        };
        Insert: {
          evenement_id: number;
          plat_id: number;
        };
        Update: {
          evenement_id?: number;
          plat_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'Événements_plats_r_evenement_id_fkey';
            columns: ['evenement_id'];
            isOneToOne: false;
            referencedRelation: 'evenements_db';
            referencedColumns: ['idevenements'];
          },
          {
            foreignKeyName: 'Événements_plats_r_plat_id_fkey';
            columns: ['plat_id'];
            isOneToOne: false;
            referencedRelation: 'plats_db';
            referencedColumns: ['idplats'];
          }
        ];
      };
      historique_communication: {
        Row: {
          canal: string | null;
          client_id: number | null;
          envoye_par: string | null;
          id: number;
          message: string;
          statut: string | null;
          timestamp: string | null;
        };
        Insert: {
          canal?: string | null;
          client_id?: number | null;
          envoye_par?: string | null;
          id?: number;
          message: string;
          statut?: string | null;
          timestamp?: string | null;
        };
        Update: {
          canal?: string | null;
          client_id?: number | null;
          envoye_par?: string | null;
          id?: number;
          message?: string;
          statut?: string | null;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'historique_communication_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'client_db';
            referencedColumns: ['idclient'];
          }
        ];
      };
      ingredients_db: {
        Row: {
          categorie: Database['public']['Enums']['categorie_ingredient'][] | null;
          fournisseur: string[] | null;
          idingredients: number;
          ingredient: string;
          notes: string | null;
          seuil_d_alerte: number | null;
          stock_actuel: number | null;
          unite: Database['public']['Enums']['unite_ingredient'][] | null;
        };
        Insert: {
          categorie?: Database['public']['Enums']['categorie_ingredient'][] | null;
          fournisseur?: string[] | null;
          idingredients?: number;
          ingredient: string;
          notes?: string | null;
          seuil_d_alerte?: number | null;
          stock_actuel?: number | null;
          unite?: Database['public']['Enums']['unite_ingredient'][] | null;
        };
        Update: {
          categorie?: Database['public']['Enums']['categorie_ingredient'][] | null;
          fournisseur?: string[] | null;
          idingredients?: number;
          ingredient?: string;
          notes?: string | null;
          seuil_d_alerte?: number | null;
          stock_actuel?: number | null;
          unite?: Database['public']['Enums']['unite_ingredient'][] | null;
        };
        Relationships: [];
      };
      listes_courses: {
        Row: {
          created_by: string | null;
          date_creation: string | null;
          date_derniere_modification: string | null;
          description: string | null;
          id: number;
          nom_liste: string;
          statut: string | null;
          total_estimatif: number | null;
        };
        Insert: {
          created_by?: string | null;
          date_creation?: string | null;
          date_derniere_modification?: string | null;
          description?: string | null;
          id?: number;
          nom_liste: string;
          statut?: string | null;
          total_estimatif?: number | null;
        };
        Update: {
          created_by?: string | null;
          date_creation?: string | null;
          date_derniere_modification?: string | null;
          description?: string | null;
          id?: number;
          nom_liste?: string;
          statut?: string | null;
          total_estimatif?: number | null;
        };
        Relationships: [];
      };
      menus_evenementiels_types_db: {
        Row: {
          adapte_pour_types_evenement: Database['public']['Enums']['type_evenement'][] | null;
          description: string | null;
          idevenementiels: number;
          nom_menu_type: string;
          nombre_de_convives_suggere: string | null;
          notes_internes_menu_type: string | null;
          photo_d_ambiance_menu: string | null;
          prix_indicatif_par_personne_interne: number | null;
        };
        Insert: {
          adapte_pour_types_evenement?: Database['public']['Enums']['type_evenement'][] | null;
          description?: string | null;
          idevenementiels?: number;
          nom_menu_type: string;
          nombre_de_convives_suggere?: string | null;
          notes_internes_menu_type?: string | null;
          photo_d_ambiance_menu?: string | null;
          prix_indicatif_par_personne_interne?: number | null;
        };
        Update: {
          adapte_pour_types_evenement?: Database['public']['Enums']['type_evenement'][] | null;
          description?: string | null;
          idevenementiels?: number;
          nom_menu_type?: string;
          nombre_de_convives_suggere?: string | null;
          notes_internes_menu_type?: string | null;
          photo_d_ambiance_menu?: string | null;
          prix_indicatif_par_personne_interne?: number | null;
        };
        Relationships: [];
      };
      menus_types_plats_r: {
        Row: {
          menu_type_id: number;
          plat_id: number;
        };
        Insert: {
          menu_type_id: number;
          plat_id: number;
        };
        Update: {
          menu_type_id?: number;
          plat_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'menus_types_plats_r_menu_type_id_fkey';
            columns: ['menu_type_id'];
            isOneToOne: false;
            referencedRelation: 'menus_evenementiels_types_db';
            referencedColumns: ['idevenementiels'];
          },
          {
            foreignKeyName: 'menus_types_plats_r_plat_id_fkey';
            columns: ['plat_id'];
            isOneToOne: false;
            referencedRelation: 'plats_db';
            referencedColumns: ['idplats'];
          }
        ];
      };
      notification_preferences: {
        Row: {
          client_id: number | null;
          commande_confirmee: boolean | null;
          commande_preparation: boolean | null;
          commande_prete: boolean | null;
          commande_retard: boolean | null;
          created_at: string | null;
          evenement_confirme: boolean | null;
          evenement_preparation: boolean | null;
          evenement_rappel_24h: boolean | null;
          evenement_rappel_48h: boolean | null;
          id: number;
          message_admin: boolean | null;
          newsletter: boolean | null;
          notifications_enabled: boolean | null;
          nouveautes: boolean | null;
          promotions: boolean | null;
          quiet_hours_end: string | null;
          quiet_hours_start: string | null;
          rappel_paiement: boolean | null;
          timezone: string | null;
          updated_at: string | null;
        };
        Insert: {
          client_id?: number | null;
          commande_confirmee?: boolean | null;
          commande_preparation?: boolean | null;
          commande_prete?: boolean | null;
          commande_retard?: boolean | null;
          created_at?: string | null;
          evenement_confirme?: boolean | null;
          evenement_preparation?: boolean | null;
          evenement_rappel_24h?: boolean | null;
          evenement_rappel_48h?: boolean | null;
          id?: number;
          message_admin?: boolean | null;
          newsletter?: boolean | null;
          notifications_enabled?: boolean | null;
          nouveautes?: boolean | null;
          promotions?: boolean | null;
          quiet_hours_end?: string | null;
          quiet_hours_start?: string | null;
          rappel_paiement?: boolean | null;
          timezone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          client_id?: number | null;
          commande_confirmee?: boolean | null;
          commande_preparation?: boolean | null;
          commande_prete?: boolean | null;
          commande_retard?: boolean | null;
          created_at?: string | null;
          evenement_confirme?: boolean | null;
          evenement_preparation?: boolean | null;
          evenement_rappel_24h?: boolean | null;
          evenement_rappel_48h?: boolean | null;
          id?: number;
          message_admin?: boolean | null;
          newsletter?: boolean | null;
          notifications_enabled?: boolean | null;
          nouveautes?: boolean | null;
          promotions?: boolean | null;
          quiet_hours_end?: string | null;
          quiet_hours_start?: string | null;
          rappel_paiement?: boolean | null;
          timezone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_preferences_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: true;
            referencedRelation: 'client_db';
            referencedColumns: ['idclient'];
          }
        ];
      };
      notification_queue: {
        Row: {
          client_id: number | null;
          created_at: string | null;
          error_message: string | null;
          id: number;
          max_retries: number | null;
          priority: string | null;
          processed_at: string | null;
          retry_count: number | null;
          scheduled_for: string | null;
          status: string | null;
          template_code: string | null;
          variables: Json | null;
        };
        Insert: {
          client_id?: number | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: number;
          max_retries?: number | null;
          priority?: string | null;
          processed_at?: string | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
          status?: string | null;
          template_code?: string | null;
          variables?: Json | null;
        };
        Update: {
          client_id?: number | null;
          created_at?: string | null;
          error_message?: string | null;
          id?: number;
          max_retries?: number | null;
          priority?: string | null;
          processed_at?: string | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
          status?: string | null;
          template_code?: string | null;
          variables?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_queue_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'client_db';
            referencedColumns: ['idclient'];
          },
          {
            foreignKeyName: 'notification_queue_template_code_fkey';
            columns: ['template_code'];
            isOneToOne: false;
            referencedRelation: 'notification_templates';
            referencedColumns: ['code'];
          }
        ];
      };
      notification_templates: {
        Row: {
          auto_trigger: boolean | null;
          body_template: string;
          code: string;
          created_at: string | null;
          delay_minutes: number | null;
          id: number;
          is_active: boolean | null;
          nom: string;
          priority: string | null;
          title_template: string;
          type_evenement: string;
          updated_at: string | null;
          variables_disponibles: string[] | null;
        };
        Insert: {
          auto_trigger?: boolean | null;
          body_template: string;
          code: string;
          created_at?: string | null;
          delay_minutes?: number | null;
          id?: number;
          is_active?: boolean | null;
          nom: string;
          priority?: string | null;
          title_template: string;
          type_evenement: string;
          updated_at?: string | null;
          variables_disponibles?: string[] | null;
        };
        Update: {
          auto_trigger?: boolean | null;
          body_template?: string;
          code?: string;
          created_at?: string | null;
          delay_minutes?: number | null;
          id?: number;
          is_active?: boolean | null;
          nom?: string;
          priority?: string | null;
          title_template?: string;
          type_evenement?: string;
          updated_at?: string | null;
          variables_disponibles?: string[] | null;
        };
        Relationships: [];
      };
      notification_tokens: {
        Row: {
          auth_key: string | null;
          client_id: number | null;
          created_at: string | null;
          device_token: string;
          device_type: string | null;
          endpoint_url: string | null;
          id: number;
          is_active: boolean | null;
          last_used: string | null;
          p256dh_key: string | null;
          user_agent: string | null;
        };
        Insert: {
          auth_key?: string | null;
          client_id?: number | null;
          created_at?: string | null;
          device_token: string;
          device_type?: string | null;
          endpoint_url?: string | null;
          id?: number;
          is_active?: boolean | null;
          last_used?: string | null;
          p256dh_key?: string | null;
          user_agent?: string | null;
        };
        Update: {
          auth_key?: string | null;
          client_id?: number | null;
          created_at?: string | null;
          device_token?: string;
          device_type?: string | null;
          endpoint_url?: string | null;
          id?: number;
          is_active?: boolean | null;
          last_used?: string | null;
          p256dh_key?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_tokens_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'client_db';
            referencedColumns: ['idclient'];
          }
        ];
      };
      notifications_history: {
        Row: {
          body: string;
          client_id: number | null;
          commande_id: number | null;
          completed_at: string | null;
          created_at: string | null;
          data: Json | null;
          device_tokens_failed: number | null;
          device_tokens_sent: number | null;
          device_tokens_success: number | null;
          error_message: string | null;
          evenement_id: number | null;
          id: number;
          priority: string | null;
          sent_at: string | null;
          statut: string | null;
          title: string;
          type_notification: string;
        };
        Insert: {
          body: string;
          client_id?: number | null;
          commande_id?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          data?: Json | null;
          device_tokens_failed?: number | null;
          device_tokens_sent?: number | null;
          device_tokens_success?: number | null;
          error_message?: string | null;
          evenement_id?: number | null;
          id?: number;
          priority?: string | null;
          sent_at?: string | null;
          statut?: string | null;
          title: string;
          type_notification: string;
        };
        Update: {
          body?: string;
          client_id?: number | null;
          commande_id?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          data?: Json | null;
          device_tokens_failed?: number | null;
          device_tokens_sent?: number | null;
          device_tokens_success?: number | null;
          error_message?: string | null;
          evenement_id?: number | null;
          id?: number;
          priority?: string | null;
          sent_at?: string | null;
          statut?: string | null;
          title?: string;
          type_notification?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_history_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'client_db';
            referencedColumns: ['idclient'];
          },
          {
            foreignKeyName: 'notifications_history_commande_id_fkey';
            columns: ['commande_id'];
            isOneToOne: false;
            referencedRelation: 'commande_db';
            referencedColumns: ['idcommande'];
          },
          {
            foreignKeyName: 'notifications_history_evenement_id_fkey';
            columns: ['evenement_id'];
            isOneToOne: false;
            referencedRelation: 'evenements_db';
            referencedColumns: ['idevenements'];
          }
        ];
      };
      plats_db: {
        Row: {
          description: string | null;
          dimanche_dispo: Database['public']['Enums']['jour_dispo'] | null;
          epuise_depuis: string | null;
          epuise_jusqu_a: string | null;
          est_epuise: boolean | null;
          idplats: number;
          jeudi_dispo: Database['public']['Enums']['jour_dispo'];
          lundi_dispo: Database['public']['Enums']['jour_dispo'];
          mardi_dispo: Database['public']['Enums']['jour_dispo'];
          mercredi_dispo: Database['public']['Enums']['jour_dispo'];
          photo_du_plat: string | null;
          plat: string;
          prix: number | null;
          raison_epuisement: string | null;
          samedi_dispo: Database['public']['Enums']['jour_dispo'] | null;
          vendredi_dispo: Database['public']['Enums']['jour_dispo'] | null;
        };
        Insert: {
          description?: string | null;
          dimanche_dispo?: Database['public']['Enums']['jour_dispo'] | null;
          epuise_depuis?: string | null;
          epuise_jusqu_a?: string | null;
          est_epuise?: boolean | null;
          idplats?: number;
          jeudi_dispo: Database['public']['Enums']['jour_dispo'];
          lundi_dispo: Database['public']['Enums']['jour_dispo'];
          mardi_dispo: Database['public']['Enums']['jour_dispo'];
          mercredi_dispo: Database['public']['Enums']['jour_dispo'];
          photo_du_plat?: string | null;
          plat: string;
          prix?: number | null;
          raison_epuisement?: string | null;
          samedi_dispo?: Database['public']['Enums']['jour_dispo'] | null;
          vendredi_dispo?: Database['public']['Enums']['jour_dispo'] | null;
        };
        Update: {
          description?: string | null;
          dimanche_dispo?: Database['public']['Enums']['jour_dispo'] | null;
          epuise_depuis?: string | null;
          epuise_jusqu_a?: string | null;
          est_epuise?: boolean | null;
          idplats?: number;
          jeudi_dispo?: Database['public']['Enums']['jour_dispo'];
          lundi_dispo?: Database['public']['Enums']['jour_dispo'];
          mardi_dispo?: Database['public']['Enums']['jour_dispo'];
          mercredi_dispo?: Database['public']['Enums']['jour_dispo'];
          photo_du_plat?: string | null;
          plat?: string;
          prix?: number | null;
          raison_epuisement?: string | null;
          samedi_dispo?: Database['public']['Enums']['jour_dispo'] | null;
          vendredi_dispo?: Database['public']['Enums']['jour_dispo'] | null;
        };
        Relationships: [];
      };
      plats_ingredients_r: {
        Row: {
          ingredient_id: number;
          plat_id: number;
        };
        Insert: {
          ingredient_id: number;
          plat_id: number;
        };
        Update: {
          ingredient_id?: number;
          plat_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'plats_ingredients_r_ingredient_id_fkey';
            columns: ['ingredient_id'];
            isOneToOne: false;
            referencedRelation: 'ingredients_db';
            referencedColumns: ['idingredients'];
          },
          {
            foreignKeyName: 'plats_ingredients_r_plat_id_fkey';
            columns: ['plat_id'];
            isOneToOne: false;
            referencedRelation: 'plats_db';
            referencedColumns: ['idplats'];
          }
        ];
      };
      restaurant_settings: {
        Row: {
          description: string | null;
          id: number;
          setting_key: string;
          setting_type: string | null;
          setting_value: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          description?: string | null;
          id?: number;
          setting_key: string;
          setting_type?: string | null;
          setting_value: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          description?: string | null;
          id?: number;
          setting_key?: string;
          setting_type?: string | null;
          setting_value?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      system_settings: {
        Row: {
          description: string | null;
          id: number;
          setting_key: string;
          setting_type: string | null;
          setting_value: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          description?: string | null;
          id?: number;
          setting_key: string;
          setting_type?: string | null;
          setting_value: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          description?: string | null;
          id?: number;
          setting_key?: string;
          setting_type?: string | null;
          setting_value?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      categorie_ingredient:
        | 'Fruits'
        | 'Légumes'
        | 'Viandes'
        | 'Poissons'
        | 'Produits laitiers'
        | 'Épicerie'
        | 'Surgelés'
        | 'Boissons'
        | 'Boulangerie'
        | 'Autre';
      jour_dispo: 'oui' | 'non' | 'sur commande';
      role_client: 'client' | 'admin' | 'visiteur';
      source_connaissance:
        | "Bouche à oreille"
        | "Réseaux sociaux"
        | "Recherche Google"
        | "En passant devant"
        | "Recommandation d'un ami"
        | "Autre";
      statut_acompte: 'En attente' | 'Payé' | 'Partiellement payé' | 'Non applicable';
      statut_commande:
        | 'En attente de confirmation'
        | 'Confirmée'
        | 'En préparation'
        | 'Prête pour retrait'
        | 'En cours de livraison'
        | 'Livrér'
        | 'Annulée'
        | 'Terminée';
      statut_evenement:
        | 'Demande initiale'
        | 'Devis envoyé'
        | 'Confirmé'
        | 'En préparation'
        | 'Terminé'
        | 'Annulé';
      statut_paiement: 'En attente sur place' | 'Payé en ligne' | 'Payé sur place' | 'Remboursé';
      statut_paiement_final: 'En attente' | 'Payé' | 'Partiellement payé';
      type_evenement: 'Mariage' | 'Anniversaire' | 'Entreprise' | 'Famille' | 'Autre';
      type_livraison: 'À emporter' | 'Livraison';
      unite_ingredient: 'kg' | 'g' | 'L' | 'ml' | 'pièce' | 'botte' | 'barquette';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never;
