-- CreateEnum
CREATE TYPE "categorie_ingredient" AS ENUM ('Légumes', 'Épices & Herbes', 'Viandes & Volailles', 'Produits Secs', 'Sauces & Condiments', 'Poisson', 'Fruit', 'Produit Laitier', 'Boisson');

-- CreateEnum
CREATE TYPE "jour_dispo" AS ENUM ('oui', 'non');

-- CreateEnum
CREATE TYPE "role_client" AS ENUM ('client', 'admin');

-- CreateEnum
CREATE TYPE "statut_acompte" AS ENUM ('Non applicable', 'Demandé', 'Reçu');

-- CreateEnum
CREATE TYPE "statut_commande" AS ENUM ('En attente de confirmation', 'Confirmée', 'En préparation', 'Prête à récupérer', 'Récupérée', 'Annulée');

-- CreateEnum
CREATE TYPE "statut_evenement" AS ENUM ('Contact établi', 'Demande initiale', 'Menu en discussion', 'Devis à faire', 'Devis envoyé', 'Confirmé / Acompte en attente', 'Confirmé / Acompte reçu', 'En préparation', 'Réalisé', 'Facturé / Solde à payer', 'Payé intégralement', 'Annulé');

-- CreateEnum
CREATE TYPE "statut_paiement" AS ENUM ('En attente sur place', 'Payé sur place', 'Payé en ligne', 'Non payé', 'Payée');

-- CreateEnum
CREATE TYPE "statut_paiement_final" AS ENUM ('En attente', 'Payé', 'En retard');

-- CreateEnum
CREATE TYPE "type_evenement" AS ENUM ('Anniversaire', 'Repas d entreprise', 'Fête de famille', 'Cocktail dînatoire', 'Buffet traiteur', 'Autre');

-- CreateEnum
CREATE TYPE "type_livraison" AS ENUM ('À emporter', 'Livraison', 'Sur place');

-- CreateEnum
CREATE TYPE "unite_ingredient" AS ENUM ('g', 'L', 'ml', 'pièce', 'botte', 'bouteille', 'pack', 'boite');

-- CreateEnum
CREATE TYPE "source_connaissance" AS ENUM ('Bouche à oreille', 'Réseaux sociaux', 'Recherche Google', 'En passant devant', 'Recommandation d un ami', 'Autre');

-- CreateTable
CREATE TABLE "activites_flux" (
    "id" BIGSERIAL NOT NULL,
    "type_activite" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "client_id" BIGINT,
    "commande_id" INTEGER,
    "evenement_id" INTEGER,
    "timestamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "lu" BOOLEAN DEFAULT false,

    CONSTRAINT "activites_flux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" BIGSERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT false,
    "type" VARCHAR(20) DEFAULT 'info',
    "priority" VARCHAR(20) DEFAULT 'normal',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'admin',

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles_liste_courses" (
    "id" BIGSERIAL NOT NULL,
    "liste_id" BIGINT,
    "nom_article" VARCHAR(255) NOT NULL,
    "quantite" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unite" VARCHAR(50) DEFAULT 'pièce',
    "prix_unitaire_estime" DECIMAL(10,2),
    "prix_total_estime" DECIMAL(10,2),
    "achete" BOOLEAN DEFAULT false,
    "date_achat" TIMESTAMPTZ(6),
    "commentaire" TEXT,
    "ordre_affichage" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_liste_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogue_articles" (
    "id" BIGSERIAL NOT NULL,
    "nom_article" VARCHAR(255) NOT NULL,
    "unite_habituelle" VARCHAR(50) DEFAULT 'pièce',
    "prix_moyen" DECIMAL(10,2),
    "categorie" VARCHAR(100),
    "fournisseur_habituel" VARCHAR(255),
    "frequence_utilisation" INTEGER DEFAULT 1,
    "derniere_utilisation" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogue_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_articles" (
    "id" BIGSERIAL NOT NULL,
    "nom_categorie" VARCHAR(100) NOT NULL,
    "couleur" VARCHAR(7) DEFAULT '#6B7280',
    "icone" VARCHAR(50) DEFAULT 'package',
    "ordre_affichage" INTEGER DEFAULT 0,

    CONSTRAINT "categories_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_db" (
    "role" "role_client" DEFAULT 'client',
    "nom" TEXT,
    "prenom" TEXT,
    "preference_client" TEXT,
    "numero_de_telephone" TEXT,
    "email" TEXT,
    "adresse_numero_et_rue" TEXT,
    "code_postal" INTEGER,
    "ville" TEXT,
    "comment_avez_vous_connu" TEXT[],
    "souhaitez_vous_recevoir_actualites" BOOLEAN DEFAULT false,
    "date_de_naissance" DATE,
    "photo_client" TEXT,
    "idclient" BIGSERIAL NOT NULL,
    "auth_user_id" TEXT NOT NULL,

    CONSTRAINT "client_db_pkey" PRIMARY KEY ("idclient")
);

-- CreateTable
CREATE TABLE "commande_db" (
    "idcommande" SERIAL NOT NULL,
    "client_r" TEXT,
    "date_et_heure_de_retrait_souhaitees" TIMESTAMPTZ(6),
    "date_de_prise_de_commande" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "statut_commande" "statut_commande" DEFAULT 'En attente de confirmation',
    "demande_special_pour_la_commande" TEXT,
    "statut_paiement" "statut_paiement" DEFAULT 'En attente sur place',
    "notes_internes" TEXT,
    "type_livraison" "type_livraison" DEFAULT 'À emporter',
    "adresse_specifique" TEXT,
    "client_r_id" BIGINT,
    "nom_evenement" TEXT,

    CONSTRAINT "commande_db_pkey" PRIMARY KEY ("idcommande")
);

-- CreateTable
CREATE TABLE "details_commande_db" (
    "iddetails" SERIAL NOT NULL,
    "commande_r" INTEGER NOT NULL,
    "plat_r" INTEGER,
    "quantite_plat_commande" INTEGER DEFAULT 1,
    "nom_plat" TEXT,
    "prix_unitaire" DECIMAL(10,2),
    "type" TEXT,
    "extra_id" INTEGER,

    CONSTRAINT "détails_commande_db_pkey" PRIMARY KEY ("iddetails")
);

-- CreateTable
CREATE TABLE "evenements_db" (
    "idevenements" SERIAL NOT NULL,
    "nom_evenement" TEXT,
    "contact_client_r" TEXT,
    "date_evenement" TIMESTAMPTZ(6),
    "type_d_evenement" "type_evenement",
    "nombre_de_personnes" INTEGER,
    "budget_client" DECIMAL(10,2),
    "demandes_speciales_evenement" TEXT,
    "menu_final_convenu" TEXT,
    "statut_evenement" "statut_evenement" DEFAULT 'Demande initiale',
    "prix_total_devise" DECIMAL(10,2),
    "lien_devis_pdf" TEXT,
    "acompte_demande" DECIMAL(10,2),
    "acompte_recu" DECIMAL(10,2),
    "date_acompte_recu" DATE,
    "statut_acompte" "statut_acompte" DEFAULT 'Non applicable',
    "notes_internes_evenement" TEXT,
    "menu_type_suggere_r" INTEGER,
    "statut_paiement_final" "statut_paiement_final" DEFAULT 'En attente',
    "contact_client_r_id" BIGINT,
    "email_contact" TEXT,
    "numero_de_telephone" TEXT,
    "plats_preselectionnes" INTEGER[],
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Événements_db_pkey" PRIMARY KEY ("idevenements")
);

-- CreateTable
CREATE TABLE "evenements_plats_r" (
    "evenement_id" INTEGER NOT NULL,
    "plat_id" INTEGER NOT NULL,

    CONSTRAINT "Événements_plats_r_pkey" PRIMARY KEY ("evenement_id","plat_id")
);

-- CreateTable
CREATE TABLE "extras_db" (
    "idextra" SERIAL NOT NULL,
    "nom_extra" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "prix" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "photo_url" TEXT DEFAULT 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png',
    "actif" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "extras_db_pkey" PRIMARY KEY ("idextra")
);

-- CreateTable
CREATE TABLE "historique_communication" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT,
    "message" TEXT NOT NULL,
    "canal" VARCHAR(20),
    "timestamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "envoye_par" TEXT DEFAULT 'admin',
    "statut" VARCHAR(20) DEFAULT 'envoyé',

    CONSTRAINT "historique_communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients_db" (
    "idingredients" SERIAL NOT NULL,
    "ingredient" TEXT NOT NULL,
    "categorie" "categorie_ingredient"[],
    "unite" "unite_ingredient"[],
    "stock_actuel" INTEGER,
    "seuil_d_alerte" INTEGER,
    "fournisseur" TEXT[],
    "notes" TEXT,

    CONSTRAINT "ingrédients_db_pkey" PRIMARY KEY ("idingredients")
);

-- CreateTable
CREATE TABLE "listes_courses" (
    "id" BIGSERIAL NOT NULL,
    "nom_liste" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date_creation" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "date_derniere_modification" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "statut" VARCHAR(20) DEFAULT 'en_cours',
    "created_by" TEXT DEFAULT 'admin',
    "total_estimatif" DECIMAL(10,2) DEFAULT 0,

    CONSTRAINT "listes_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus_evenementiels_types_db" (
    "idevenementiels" SERIAL NOT NULL,
    "nom_menu_type" TEXT NOT NULL,
    "description" TEXT,
    "adapte_pour_types_evenement" "type_evenement"[],
    "prix_indicatif_par_personne_interne" DECIMAL(10,2),
    "nombre_de_convives_suggere" TEXT,
    "photo_d_ambiance_menu" TEXT,
    "notes_internes_menu_type" TEXT,

    CONSTRAINT "menus_Événementiels_types_db_pkey" PRIMARY KEY ("idevenementiels")
);

-- CreateTable
CREATE TABLE "menus_types_plats_r" (
    "menu_type_id" INTEGER NOT NULL,
    "plat_id" INTEGER NOT NULL,

    CONSTRAINT "menus_types_plats_r_pkey" PRIMARY KEY ("menu_type_id","plat_id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT,
    "commande_confirmee" BOOLEAN DEFAULT true,
    "commande_preparation" BOOLEAN DEFAULT true,
    "commande_prete" BOOLEAN DEFAULT true,
    "commande_retard" BOOLEAN DEFAULT true,
    "evenement_confirme" BOOLEAN DEFAULT true,
    "evenement_rappel_48h" BOOLEAN DEFAULT true,
    "evenement_rappel_24h" BOOLEAN DEFAULT true,
    "evenement_preparation" BOOLEAN DEFAULT true,
    "promotions" BOOLEAN DEFAULT false,
    "nouveautes" BOOLEAN DEFAULT false,
    "newsletter" BOOLEAN DEFAULT false,
    "rappel_paiement" BOOLEAN DEFAULT true,
    "message_admin" BOOLEAN DEFAULT true,
    "notifications_enabled" BOOLEAN DEFAULT true,
    "quiet_hours_start" TIME(6) DEFAULT '22:00:00'::time without time zone,
    "quiet_hours_end" TIME(6) DEFAULT '08:00:00'::time without time zone,
    "timezone" VARCHAR(50) DEFAULT 'Europe/Paris',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_queue" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT,
    "template_code" VARCHAR(50),
    "variables" JSONB DEFAULT '{}',
    "scheduled_for" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "priority" VARCHAR(10) DEFAULT 'normal',
    "max_retries" INTEGER DEFAULT 3,
    "retry_count" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "error_message" TEXT,

    CONSTRAINT "notification_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "title_template" VARCHAR(255) NOT NULL,
    "body_template" TEXT NOT NULL,
    "type_evenement" VARCHAR(50) NOT NULL,
    "priority" VARCHAR(10) DEFAULT 'normal',
    "variables_disponibles" TEXT[],
    "auto_trigger" BOOLEAN DEFAULT false,
    "delay_minutes" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_tokens" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT,
    "device_token" TEXT NOT NULL,
    "device_type" VARCHAR(20) DEFAULT 'web',
    "user_agent" TEXT,
    "endpoint_url" TEXT,
    "p256dh_key" TEXT,
    "auth_key" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications_history" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT,
    "commande_id" INTEGER,
    "evenement_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "type_notification" VARCHAR(50) NOT NULL,
    "priority" VARCHAR(10) DEFAULT 'normal',
    "data" JSONB DEFAULT '{}',
    "device_tokens_sent" INTEGER DEFAULT 0,
    "device_tokens_success" INTEGER DEFAULT 0,
    "device_tokens_failed" INTEGER DEFAULT 0,
    "statut" VARCHAR(20) DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "error_message" TEXT,

    CONSTRAINT "notifications_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plats_db" (
    "idplats" SERIAL NOT NULL,
    "plat" TEXT NOT NULL,
    "description" TEXT,
    "prix" DECIMAL(10,2),
    "lundi_dispo" "jour_dispo" NOT NULL DEFAULT 'non',
    "mardi_dispo" "jour_dispo" NOT NULL,
    "mercredi_dispo" "jour_dispo" NOT NULL DEFAULT 'non',
    "jeudi_dispo" "jour_dispo" NOT NULL DEFAULT 'non',
    "vendredi_dispo" "jour_dispo" DEFAULT 'non',
    "samedi_dispo" "jour_dispo" DEFAULT 'non',
    "dimanche_dispo" "jour_dispo" DEFAULT 'non',
    "photo_du_plat" TEXT,
    "est_epuise" BOOLEAN DEFAULT false,
    "epuise_depuis" TIMESTAMPTZ(6),
    "epuise_jusqu_a" TIMESTAMPTZ(6),
    "raison_epuisement" TEXT,

    CONSTRAINT "plats_db_pkey" PRIMARY KEY ("idplats")
);

-- CreateTable
CREATE TABLE "plats_ingredients_r" (
    "plat_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,

    CONSTRAINT "plats_ingredients_r_pkey" PRIMARY KEY ("plat_id","ingredient_id")
);

-- CreateTable
CREATE TABLE "plats_rupture_dates" (
    "id" SERIAL NOT NULL,
    "plat_id" INTEGER NOT NULL,
    "date_rupture" DATE NOT NULL,
    "raison_rupture" TEXT DEFAULT 'Rupture de stock',
    "type_rupture" TEXT DEFAULT 'stock',
    "notes_rupture" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plats_rupture_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_settings" (
    "id" BIGSERIAL NOT NULL,
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" TEXT NOT NULL,
    "setting_type" VARCHAR(50) DEFAULT 'text',
    "description" TEXT,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'admin',

    CONSTRAINT "restaurant_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" BIGSERIAL NOT NULL,
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" TEXT NOT NULL,
    "setting_type" VARCHAR(50) DEFAULT 'text',
    "description" TEXT,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT DEFAULT 'admin',

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'credential',
    "provider" TEXT NOT NULL DEFAULT 'credential',
    "accessToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_activites_client" ON "activites_flux"("client_id");

-- CreateIndex
CREATE INDEX "idx_activites_flux_timestamp" ON "activites_flux"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "idx_activites_lu" ON "activites_flux"("lu");

-- CreateIndex
CREATE INDEX "idx_activites_timestamp" ON "activites_flux"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "idx_activites_type" ON "activites_flux"("type_activite");

-- CreateIndex
CREATE INDEX "idx_announcements_active" ON "announcements"("is_active", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_articles_achete" ON "articles_liste_courses"("achete");

-- CreateIndex
CREATE INDEX "idx_articles_liste_courses_achete" ON "articles_liste_courses"("achete");

-- CreateIndex
CREATE INDEX "idx_articles_liste_courses_liste_id" ON "articles_liste_courses"("liste_id");

-- CreateIndex
CREATE INDEX "idx_articles_liste_id" ON "articles_liste_courses"("liste_id");

-- CreateIndex
CREATE UNIQUE INDEX "catalogue_articles_nom_article_key" ON "catalogue_articles"("nom_article");

-- CreateIndex
CREATE INDEX "idx_catalogue_articles_frequence" ON "catalogue_articles"("frequence_utilisation" DESC);

-- CreateIndex
CREATE INDEX "idx_catalogue_articles_nom" ON "catalogue_articles"("nom_article");

-- CreateIndex
CREATE INDEX "idx_catalogue_derniere_utilisation" ON "catalogue_articles"("derniere_utilisation" DESC);

-- CreateIndex
CREATE INDEX "idx_catalogue_frequence" ON "catalogue_articles"("frequence_utilisation" DESC);

-- CreateIndex
CREATE INDEX "idx_catalogue_nom" ON "catalogue_articles"("nom_article");

-- CreateIndex
CREATE UNIQUE INDEX "categories_articles_nom_categorie_key" ON "categories_articles"("nom_categorie");

-- CreateIndex
CREATE UNIQUE INDEX "client_db_idclient_key" ON "client_db"("idclient");

-- CreateIndex
CREATE UNIQUE INDEX "client_db_auth_user_id_key" ON "client_db"("auth_user_id");

-- CreateIndex
CREATE INDEX "idx_client_db_auth_user_id_role" ON "client_db"("auth_user_id", "role");

-- CreateIndex
CREATE INDEX "idx_client_email" ON "client_db"("email");

-- CreateIndex
CREATE INDEX "idx_client_auth_user_id" ON "client_db"("auth_user_id");

-- CreateIndex
CREATE INDEX "idx_client_role" ON "client_db"("role");

-- CreateIndex
CREATE INDEX "idx_client_telephone" ON "client_db"("numero_de_telephone");

-- CreateIndex
CREATE INDEX "idx_commande_client" ON "commande_db"("client_r");

-- CreateIndex
CREATE INDEX "idx_commande_client_id" ON "commande_db"("client_r_id");

-- CreateIndex
CREATE INDEX "idx_commande_client_r_id" ON "commande_db"("client_r_id");

-- CreateIndex
CREATE INDEX "idx_commande_client_r_status" ON "commande_db"("client_r", "statut_commande");

-- CreateIndex
CREATE INDEX "idx_commande_client_statut" ON "commande_db"("client_r_id", "statut_commande");

-- CreateIndex
CREATE INDEX "idx_commande_date_prise" ON "commande_db"("date_de_prise_de_commande");

-- CreateIndex
CREATE INDEX "idx_commande_date_retrait" ON "commande_db"("date_et_heure_de_retrait_souhaitees");

-- CreateIndex
CREATE INDEX "idx_commande_statut" ON "commande_db"("statut_commande");

-- CreateIndex
CREATE INDEX "idx_commande_statut_date" ON "commande_db"("statut_commande", "date_de_prise_de_commande" DESC);

-- CreateIndex
CREATE INDEX "idx_commande_statut_paiement" ON "commande_db"("statut_paiement");

-- CreateIndex
CREATE INDEX "idx_commande_type_livraison" ON "commande_db"("type_livraison");

-- CreateIndex
CREATE INDEX "idx_details_commande" ON "details_commande_db"("commande_r");

-- CreateIndex
CREATE INDEX "idx_details_commande_commande_r" ON "details_commande_db"("commande_r");

-- CreateIndex
CREATE INDEX "idx_details_commande_id" ON "details_commande_db"("commande_r");

-- CreateIndex
CREATE INDEX "idx_details_commande_plat_r" ON "details_commande_db"("plat_r");

-- CreateIndex
CREATE INDEX "idx_details_plat_id" ON "details_commande_db"("plat_r");

-- CreateIndex
CREATE INDEX "idx_evenements_client" ON "evenements_db"("contact_client_r");

-- CreateIndex
CREATE INDEX "idx_evenements_client_id" ON "evenements_db"("contact_client_r_id");

-- CreateIndex
CREATE INDEX "idx_evenements_client_status" ON "evenements_db"("contact_client_r", "statut_evenement");

-- CreateIndex
CREATE INDEX "idx_evenements_contact_client_r_id" ON "evenements_db"("contact_client_r_id");

-- CreateIndex
CREATE INDEX "idx_evenements_date" ON "evenements_db"("date_evenement");

-- CreateIndex
CREATE INDEX "idx_evenements_menu_type_suggere_r" ON "evenements_db"("menu_type_suggere_r");

-- CreateIndex
CREATE INDEX "idx_evenements_statut" ON "evenements_db"("statut_evenement");

-- CreateIndex
CREATE INDEX "idx_evenements_statut_date" ON "evenements_db"("statut_evenement", "date_evenement" DESC);

-- CreateIndex
CREATE INDEX "idx_evenements_type" ON "evenements_db"("type_d_evenement");

-- CreateIndex
CREATE INDEX "idx_evenements_plats_r_plat_id" ON "evenements_plats_r"("plat_id");

-- CreateIndex
CREATE INDEX "idx_historique_canal" ON "historique_communication"("canal");

-- CreateIndex
CREATE INDEX "idx_historique_client" ON "historique_communication"("client_id");

-- CreateIndex
CREATE INDEX "idx_historique_communication_client" ON "historique_communication"("client_id");

-- CreateIndex
CREATE INDEX "idx_historique_communication_timestamp" ON "historique_communication"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "idx_historique_timestamp" ON "historique_communication"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "idx_listes_courses_date" ON "listes_courses"("date_creation" DESC);

-- CreateIndex
CREATE INDEX "idx_listes_courses_statut" ON "listes_courses"("statut");

-- CreateIndex
CREATE INDEX "idx_menus_types_plats_r_plat_id" ON "menus_types_plats_r"("plat_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_client_id_key" ON "notification_preferences"("client_id");

-- CreateIndex
CREATE INDEX "idx_notification_preferences_client" ON "notification_preferences"("client_id");

-- CreateIndex
CREATE INDEX "idx_notification_queue_status" ON "notification_queue"("status");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_code_key" ON "notification_templates"("code");

-- CreateIndex
CREATE INDEX "idx_notification_tokens_client_active" ON "notification_tokens"("client_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "notification_tokens_client_id_device_token_key" ON "notification_tokens"("client_id", "device_token");

-- CreateIndex
CREATE INDEX "idx_notifications_history_client_date" ON "notifications_history"("client_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_notifications_history_type_date" ON "notifications_history"("type_notification", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_plats_disponibilite" ON "plats_db"("lundi_dispo", "mardi_dispo", "mercredi_dispo", "jeudi_dispo", "vendredi_dispo", "samedi_dispo", "dimanche_dispo");

-- CreateIndex
CREATE INDEX "idx_plats_epuise" ON "plats_db"("est_epuise");

-- CreateIndex
CREATE INDEX "idx_plats_prix" ON "plats_db"("prix");

-- CreateIndex
CREATE INDEX "idx_plats_ingredients_r_ingredient_id" ON "plats_ingredients_r"("ingredient_id");

-- CreateIndex
CREATE INDEX "idx_plats_rupture_dates_date_active" ON "plats_rupture_dates"("date_rupture", "is_active");

-- CreateIndex
CREATE INDEX "idx_plats_rupture_dates_plat_date" ON "plats_rupture_dates"("plat_id", "date_rupture");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_settings_setting_key_key" ON "restaurant_settings"("setting_key");

-- CreateIndex
CREATE INDEX "idx_restaurant_settings_key" ON "restaurant_settings"("setting_key");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_setting_key_key" ON "system_settings"("setting_key");

-- CreateIndex
CREATE INDEX "idx_system_settings_key" ON "system_settings"("setting_key");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_value_key" ON "verification"("value");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");

-- AddForeignKey
ALTER TABLE "activites_flux" ADD CONSTRAINT "activites_flux_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client_db"("idclient") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activites_flux" ADD CONSTRAINT "activites_flux_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "commande_db"("idcommande") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activites_flux" ADD CONSTRAINT "activites_flux_evenement_id_fkey" FOREIGN KEY ("evenement_id") REFERENCES "evenements_db"("idevenements") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articles_liste_courses" ADD CONSTRAINT "articles_liste_courses_liste_id_fkey" FOREIGN KEY ("liste_id") REFERENCES "listes_courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "commande_db" ADD CONSTRAINT "commande_db_client_r_id_fkey" FOREIGN KEY ("client_r_id") REFERENCES "client_db"("idclient") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "details_commande_db" ADD CONSTRAINT "details_commande_db_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "extras_db"("idextra") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "details_commande_db" ADD CONSTRAINT "détails_commande_db_commande_r_fkey" FOREIGN KEY ("commande_r") REFERENCES "commande_db"("idcommande") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "details_commande_db" ADD CONSTRAINT "détails_commande_db_plat_r_fkey" FOREIGN KEY ("plat_r") REFERENCES "plats_db"("idplats") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evenements_db" ADD CONSTRAINT "evenements_db_contact_client_r_id_fkey" FOREIGN KEY ("contact_client_r_id") REFERENCES "client_db"("idclient") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evenements_db" ADD CONSTRAINT "evenements_db_menu_type_suggere_r_fkey" FOREIGN KEY ("menu_type_suggere_r") REFERENCES "menus_evenementiels_types_db"("idevenementiels") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evenements_plats_r" ADD CONSTRAINT "Événements_plats_r_evenement_id_fkey" FOREIGN KEY ("evenement_id") REFERENCES "evenements_db"("idevenements") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evenements_plats_r" ADD CONSTRAINT "Événements_plats_r_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "plats_db"("idplats") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historique_communication" ADD CONSTRAINT "historique_communication_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client_db"("idclient") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_types_plats_r" ADD CONSTRAINT "menus_types_plats_r_menu_type_id_fkey" FOREIGN KEY ("menu_type_id") REFERENCES "menus_evenementiels_types_db"("idevenementiels") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menus_types_plats_r" ADD CONSTRAINT "menus_types_plats_r_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "plats_db"("idplats") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client_db"("idclient") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_queue" ADD CONSTRAINT "notification_queue_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client_db"("idclient") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_queue" ADD CONSTRAINT "notification_queue_template_code_fkey" FOREIGN KEY ("template_code") REFERENCES "notification_templates"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_tokens" ADD CONSTRAINT "notification_tokens_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client_db"("idclient") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications_history" ADD CONSTRAINT "notifications_history_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client_db"("idclient") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications_history" ADD CONSTRAINT "notifications_history_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "commande_db"("idcommande") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications_history" ADD CONSTRAINT "notifications_history_evenement_id_fkey" FOREIGN KEY ("evenement_id") REFERENCES "evenements_db"("idevenements") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plats_ingredients_r" ADD CONSTRAINT "plats_ingredients_r_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients_db"("idingredients") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plats_ingredients_r" ADD CONSTRAINT "plats_ingredients_r_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "plats_db"("idplats") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plats_rupture_dates" ADD CONSTRAINT "plats_rupture_dates_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "plats_db"("idplats") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
