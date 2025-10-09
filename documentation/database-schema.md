# Database Schema - APPChanthana

**Date**: 2025-10-06
**Version**: 1.0.0
**Database**: Supabase PostgreSQL 15
**Status**: ✅ Production

## Vue d'Ensemble

APPChanthana utilise **Supabase PostgreSQL** avec 6 tables principales pour gérer clients, commandes, plats, extras et événements.

### Tables Principales

| Table | Lignes (approx) | Rôle | Relations |
|-------|-----------------|------|-----------|
| **client_db** | ~500 | Profils clients/admin | → commande_db, evenements_db |
| **commande_db** | ~2,000 | Commandes restaurant | → client_db, details_commande_db |
| **details_commande_db** | ~8,000 | Lignes de commande | → commande_db, plats_db, extras_db |
| **plats_db** | ~80 | Menu restaurant | → details_commande_db |
| **extras_db** | ~40 | Options supplémentaires | → details_commande_db |
| **evenements_db** | ~50 | Événements restaurant | → client_db |

---

## Schéma Complet

```sql
┌─────────────────────┐
│    client_db        │
│  (Profils)          │
├─────────────────────┤
│ id (PK)             │
│ firebase_uid (UQ)   │◄─┐ Lien Firebase Auth
│ email               │  │
│ nom                 │  │
│ prenom              │  │
│ role                │  │ ('admin' | 'client')
│ created_at          │  │
└──────┬──────────────┘  │
       │                 │
       │ 1:N             │
       ▼                 │
┌─────────────────────┐  │
│   commande_db       │  │
│  (Commandes)        │  │
├─────────────────────┤  │
│ id (PK)             │  │
│ contact_client_r (FK)──┘ → client_db.id
│ statut              │
│ total               │
│ type_paiement       │
│ created_at          │
└──────┬──────────────┘
       │
       │ 1:N
       ▼
┌─────────────────────┐
│details_commande_db  │
│ (Lignes commande)   │
├─────────────────────┤
│ id (PK)             │
│ commande_r (FK)     │──► commande_db.id
│ plat_r (FK)         │──► plats_db.id
│ quantite            │
│ prix_unitaire       │
│ total_ligne         │
│ extras (JSONB)      │──► [extras_db.id, ...]
└─────────────────────┘

┌─────────────────────┐
│     plats_db        │
│  (Menu)             │
├─────────────────────┤
│ id (PK)             │
│ nom                 │
│ description         │
│ prix                │
│ categorie           │
│ image_url           │
│ disponible          │
└─────────────────────┘

┌─────────────────────┐
│    extras_db        │
│  (Options)          │
├─────────────────────┤
│ id (PK)             │
│ nom                 │
│ prix                │
│ categorie           │
│ disponible          │
└─────────────────────┘

┌─────────────────────┐
│  evenements_db      │
│  (Événements)       │
├─────────────────────┤
│ id (PK)             │
│ contact_client_r (FK)──► client_db.id
│ titre               │
│ description         │
│ date_evenement      │
│ nombre_personnes    │
│ statut              │
└─────────────────────┘
```

---

## Tables Détaillées

### 1. client_db (Profils Clients/Admin)

```sql
CREATE TABLE client_db (
  id SERIAL PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,  -- Lien Firebase Auth (UNIQUE)
  email TEXT NOT NULL,
  nom TEXT,
  prenom TEXT,
  telephone TEXT,
  adresse TEXT,
  date_naissance DATE,
  role TEXT DEFAULT 'client',  -- 'admin' | 'client'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_client_firebase_uid ON client_db(firebase_uid);
CREATE INDEX idx_client_email ON client_db(email);
CREATE INDEX idx_client_role ON client_db(role);
```

**Colonnes clés**:
- `firebase_uid`: **UNIQUE**, lien avec Firebase Authentication
- `role`: Détermine accès admin vs client (détecté via pattern email)
- `email`: Hérité de Firebase Auth lors de signup
- `created_at`, `updated_at`: Timestamps auto

**Relations**:
- **1:N** avec `commande_db` (un client → plusieurs commandes)
- **1:N** avec `evenements_db` (un client → plusieurs événements)

---

### 2. commande_db (Commandes Restaurant)

```sql
CREATE TABLE commande_db (
  id SERIAL PRIMARY KEY,
  contact_client_r INTEGER REFERENCES client_db(id),  -- FK vers client
  statut TEXT DEFAULT 'en_attente',  -- 'en_attente' | 'confirmee' | 'en_preparation' | 'prete' | 'livree' | 'annulee'
  total DECIMAL(10,2),  -- Total commande en €
  type_paiement TEXT,  -- 'carte' | 'especes' | 'cheque'
  notes_client TEXT,
  notes_admin TEXT,
  adresse_livraison TEXT,
  date_livraison TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_commande_client ON commande_db(contact_client_r);
CREATE INDEX idx_commande_statut ON commande_db(statut);
CREATE INDEX idx_commande_created_at ON commande_db(created_at DESC);

-- ⚠️ MANQUANT (Phase 4: à ajouter)
ALTER TABLE commande_db ADD COLUMN firebase_uid TEXT;
ALTER TABLE commande_db
  ADD CONSTRAINT fk_commande_firebase_uid
  FOREIGN KEY (firebase_uid)
  REFERENCES client_db(firebase_uid);
```

**Colonnes clés**:
- `contact_client_r`: **FK** vers `client_db.id`
- `statut`: Workflow commande (6 états)
- `total`: Calculé depuis `details_commande_db.total_ligne`
- `type_paiement`: Mode de paiement sélectionné

**Relations**:
- **N:1** avec `client_db` (plusieurs commandes → un client)
- **1:N** avec `details_commande_db` (une commande → plusieurs lignes)

**Statuts Workflow**:
```
en_attente → confirmee → en_preparation → prete → livree
                  ↓
              annulee (à tout moment)
```

---

### 3. details_commande_db (Lignes de Commande)

```sql
CREATE TABLE details_commande_db (
  id SERIAL PRIMARY KEY,
  commande_r INTEGER REFERENCES commande_db(id) ON DELETE CASCADE,  -- FK cascade
  plat_r INTEGER REFERENCES plats_db(id),  -- FK vers plat
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(10,2) NOT NULL,  -- Prix du plat au moment de la commande
  total_ligne DECIMAL(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
  extras JSONB,  -- [{ "id": 1, "nom": "Riz gluant", "prix": 2.5 }, ...]
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_details_commande ON details_commande_db(commande_r);
CREATE INDEX idx_details_plat ON details_commande_db(plat_r);
CREATE INDEX idx_details_extras ON details_commande_db USING GIN(extras);  -- Index JSONB
```

**Colonnes clés**:
- `commande_r`: **FK CASCADE** vers `commande_db.id` (suppression commande → supprime lignes)
- `plat_r`: **FK** vers `plats_db.id`
- `prix_unitaire`: **Snapshot** du prix au moment de la commande (historique)
- `total_ligne`: **Computed column** (`quantite * prix_unitaire`)
- `extras`: **JSONB** array d'objets extras sélectionnés

**Relations**:
- **N:1** avec `commande_db` (plusieurs lignes → une commande)
- **N:1** avec `plats_db` (plusieurs lignes → un plat)
- **Soft relation** avec `extras_db` via JSONB (pas FK stricte)

**Exemple JSONB extras**:
```json
[
  {
    "id": 1,
    "nom": "Riz gluant",
    "prix": 2.5,
    "categorie": "accompagnement"
  },
  {
    "id": 5,
    "nom": "Sauce piquante",
    "prix": 1.0,
    "categorie": "sauce"
  }
]
```

---

### 4. plats_db (Menu Restaurant)

```sql
CREATE TABLE plats_db (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  categorie TEXT,  -- 'entrees' | 'plats' | 'desserts' | 'boissons'
  image_url TEXT,  -- URL Supabase Storage
  disponible BOOLEAN DEFAULT TRUE,
  allergenes TEXT[],  -- Array PostgreSQL ['gluten', 'lactose', ...]
  temps_preparation INTEGER,  -- Minutes
  ordre_affichage INTEGER,  -- Ordre dans le menu
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_plats_categorie ON plats_db(categorie);
CREATE INDEX idx_plats_disponible ON plats_db(disponible);
CREATE INDEX idx_plats_ordre ON plats_db(ordre_affichage);
```

**Colonnes clés**:
- `nom`, `prix`: Champs obligatoires
- `categorie`: Organise menu par sections
- `image_url`: Lien vers Supabase Storage bucket `plats`
- `disponible`: Toggle admin pour masquer plat temporairement
- `allergenes`: **PostgreSQL array** pour filtres allergies

**Relations**:
- **1:N** avec `details_commande_db` (un plat → plusieurs lignes commandes)

**Catégories Standard**:
- `entrees`: Entrées (Rouleaux de printemps, etc.)
- `plats`: Plats principaux (Pad Thai, etc.)
- `desserts`: Desserts (Mangue sticky rice, etc.)
- `boissons`: Boissons (Thé Thai, etc.)

---

### 5. extras_db (Options Supplémentaires)

```sql
CREATE TABLE extras_db (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  prix DECIMAL(10,2) NOT NULL,
  categorie TEXT,  -- 'accompagnement' | 'sauce' | 'boisson'
  disponible BOOLEAN DEFAULT TRUE,
  description TEXT,
  ordre_affichage INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_extras_categorie ON extras_db(categorie);
CREATE INDEX idx_extras_disponible ON extras_db(disponible);
```

**Colonnes clés**:
- `nom`, `prix`: Champs obligatoires
- `categorie`: Groupe extras par type
- `disponible`: Toggle admin

**Relations**:
- **Soft M:N** avec `details_commande_db` via JSONB (pas FK stricte)

**Exemples Extras**:
```sql
INSERT INTO extras_db (nom, prix, categorie) VALUES
  ('Riz gluant', 2.50, 'accompagnement'),
  ('Riz jasmin', 2.00, 'accompagnement'),
  ('Sauce piquante', 1.00, 'sauce'),
  ('Sauce soja sucrée', 1.00, 'sauce'),
  ('Thé Thai glacé', 3.50, 'boisson');
```

---

### 6. evenements_db (Événements Restaurant)

```sql
CREATE TABLE evenements_db (
  id SERIAL PRIMARY KEY,
  contact_client_r INTEGER REFERENCES client_db(id),  -- FK vers organisateur
  titre TEXT NOT NULL,
  description TEXT,
  date_evenement TIMESTAMPTZ NOT NULL,
  nombre_personnes INTEGER,
  budget_estime DECIMAL(10,2),
  statut TEXT DEFAULT 'demande',  -- 'demande' | 'confirme' | 'annule'
  notes_client TEXT,
  notes_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_evenements_client ON evenements_db(contact_client_r);
CREATE INDEX idx_evenements_date ON evenements_db(date_evenement);
CREATE INDEX idx_evenements_statut ON evenements_db(statut);
```

**Colonnes clés**:
- `contact_client_r`: **FK** vers `client_db.id` (organisateur)
- `date_evenement`: Date/heure événement
- `statut`: Workflow validation admin

**Relations**:
- **N:1** avec `client_db` (plusieurs événements → un organisateur)

---

## Relations Visuelles Complètes

```
client_db (1) ────┬──── (N) commande_db (1) ──── (N) details_commande_db
                  │                                          │
                  │                                          ├──► (N:1) plats_db
                  │                                          │
                  │                                          └──► (Soft) extras_db (JSONB)
                  │
                  └──── (N) evenements_db
```

---

## Types PostgreSQL & Validation

### Types Personnalisés

```sql
-- Enum statut commande
CREATE TYPE statut_commande AS ENUM (
  'en_attente',
  'confirmee',
  'en_preparation',
  'prete',
  'livree',
  'annulee'
);

-- Enum type paiement
CREATE TYPE type_paiement AS ENUM (
  'carte',
  'especes',
  'cheque'
);

-- Enum categorie plat
CREATE TYPE categorie_plat AS ENUM (
  'entrees',
  'plats',
  'desserts',
  'boissons'
);
```

### Contraintes Check

```sql
-- Validation prix positifs
ALTER TABLE plats_db
  ADD CONSTRAINT check_prix_positif CHECK (prix > 0);

ALTER TABLE extras_db
  ADD CONSTRAINT check_prix_positif CHECK (prix >= 0);

-- Validation quantité
ALTER TABLE details_commande_db
  ADD CONSTRAINT check_quantite_positive CHECK (quantite > 0);

-- Validation total commande
ALTER TABLE commande_db
  ADD CONSTRAINT check_total_positif CHECK (total >= 0);

-- Validation nombre personnes événement
ALTER TABLE evenements_db
  ADD CONSTRAINT check_nb_personnes_positif CHECK (nombre_personnes > 0);
```

---

## RLS Policies (Row Level Security)

**Status actuel**: 🔴 **DÉSACTIVÉ** → Phase 4: réactivation avec `scripts/rls-policies.sql`

### Policies Clients

```sql
-- Policy 1: Clients voient seulement leurs propres données
CREATE POLICY "clients_own_data" ON client_db
  FOR ALL USING (firebase_uid = auth.uid());

-- Policy 2: Clients voient seulement leurs commandes
CREATE POLICY "clients_own_orders" ON commande_db
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM client_db
      WHERE client_db.id = commande_db.contact_client_r
      AND client_db.firebase_uid = auth.uid()
    )
  );

-- Policy 3: Clients voient détails de leurs commandes
CREATE POLICY "clients_own_order_details" ON details_commande_db
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM commande_db
      JOIN client_db ON client_db.id = commande_db.contact_client_r
      WHERE commande_db.id = details_commande_db.commande_r
      AND client_db.firebase_uid = auth.uid()
    )
  );

-- Policy 4: Lecture publique plats disponibles
CREATE POLICY "public_read_plats" ON plats_db
  FOR SELECT USING (disponible = TRUE);

-- Policy 5: Lecture publique extras disponibles
CREATE POLICY "public_read_extras" ON extras_db
  FOR SELECT USING (disponible = TRUE);
```

### Policies Admin

```sql
-- Policy 6: Admin accès total client_db
CREATE POLICY "admin_full_access_clients" ON client_db
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM client_db admin
      WHERE admin.firebase_uid = auth.uid()
      AND admin.role = 'admin'
    )
  );

-- Policy 7: Admin accès total commandes
CREATE POLICY "admin_full_access_orders" ON commande_db
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM client_db admin
      WHERE admin.firebase_uid = auth.uid()
      AND admin.role = 'admin'
    )
  );

-- Policy 8: Admin gestion plats
CREATE POLICY "admin_manage_plats" ON plats_db
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM client_db admin
      WHERE admin.firebase_uid = auth.uid()
      AND admin.role = 'admin'
    )
  );
```

---

## Storage (Supabase Storage)

### Bucket `plats` (Images Menu)

```sql
-- Configuration bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('plats', 'plats', TRUE);

-- RLS Policy bucket (lecture publique)
CREATE POLICY "public_read_plats_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'plats');

-- RLS Policy bucket (admin upload)
CREATE POLICY "admin_upload_plats_images" ON storage.objects
  FOR INSERT USING (
    bucket_id = 'plats'
    AND EXISTS (
      SELECT 1 FROM client_db
      WHERE client_db.firebase_uid = auth.uid()
      AND client_db.role = 'admin'
    )
  );
```

**URLs Images**:
```
https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/plats/{filename}.jpg
```

---

## Real-time Configuration

**Status actuel**: 🔴 **NON ACTIVÉ** → Phase 4: activation avec `ACTIVER-REALTIME-SUPABASE.md`

### Tables avec Real-time

```sql
-- Activer publications Real-time
ALTER TABLE commande_db REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE commande_db;

ALTER TABLE details_commande_db REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE details_commande_db;
```

### Vérification

```sql
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';

-- Résultat attendu:
--  schemaname | tablename
-- ------------+-------------------
--  public     | commande_db
--  public     | details_commande_db
```

---

## Migrations & Versioning

### Script Migration Complet

**Fichier**: `scripts/schema-migration-v1.sql`

```sql
-- Version 1.0.0 - Initial schema
BEGIN;

-- 1. Create tables
CREATE TABLE client_db (...);
CREATE TABLE commande_db (...);
CREATE TABLE details_commande_db (...);
CREATE TABLE plats_db (...);
CREATE TABLE extras_db (...);
CREATE TABLE evenements_db (...);

-- 2. Create indexes
CREATE INDEX ...;

-- 3. Add foreign keys
ALTER TABLE commande_db ADD CONSTRAINT ...;

-- 4. Enable RLS
ALTER TABLE client_db ENABLE ROW LEVEL SECURITY;
-- (répéter pour toutes tables)

-- 5. Create policies
CREATE POLICY ...;

-- 6. Create storage bucket
INSERT INTO storage.buckets ...;

-- 7. Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE ...;

COMMIT;
```

---

## Requêtes SQL Utiles

### Statistiques Tables

```sql
-- Nombre de lignes par table
SELECT
  schemaname,
  tablename,
  n_tup_ins AS insertions,
  n_tup_upd AS updates,
  n_tup_del AS deletions
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Top 10 Plats Vendus

```sql
SELECT
  p.nom,
  COUNT(dc.id) AS nb_ventes,
  SUM(dc.quantite) AS quantite_totale,
  SUM(dc.total_ligne) AS chiffre_affaires
FROM plats_db p
JOIN details_commande_db dc ON dc.plat_r = p.id
JOIN commande_db c ON c.id = dc.commande_r
WHERE c.statut != 'annulee'
GROUP BY p.id, p.nom
ORDER BY quantite_totale DESC
LIMIT 10;
```

### Commandes par Statut

```sql
SELECT
  statut,
  COUNT(*) AS nb_commandes,
  SUM(total) AS total_euros
FROM commande_db
GROUP BY statut
ORDER BY nb_commandes DESC;
```

---

## Références

- **Supabase Database Docs**: https://supabase.com/docs/guides/database
- **PostgreSQL 15 Docs**: https://www.postgresql.org/docs/15/
- **RLS Tutorial**: https://supabase.com/docs/guides/auth/row-level-security

---

**Prochaine lecture recommandée**: [State Management](./state-management.md)
