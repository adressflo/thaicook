-- ============================================================
-- ACTIVATION SUPABASE REAL-TIME POUR CHANTHANA
-- ============================================================
-- Projet: lkaiwnkyoztebplqoifc
-- URL: https://lkaiwnkyoztebplqoifc.supabase.co
-- Date: 2025-09-30
--
-- Ce script active Real-time sur les tables critiques pour
-- permettre les mises à jour en temps réel dans l'application.
-- ============================================================

BEGIN;

-- ============================================================
-- ÉTAPE 1: Configuration REPLICA IDENTITY
-- ============================================================
-- REPLICA IDENTITY FULL permet de capturer toutes les colonnes
-- pour les opérations UPDATE et DELETE dans les subscriptions

ALTER TABLE commande_db REPLICA IDENTITY FULL;
ALTER TABLE details_commande_db REPLICA IDENTITY FULL;

-- ============================================================
-- ÉTAPE 2: Ajout des tables à la publication Real-time
-- ============================================================
-- La publication 'supabase_realtime' est créée automatiquement
-- par Supabase. On y ajoute nos tables pour activer Real-time.

ALTER PUBLICATION supabase_realtime ADD TABLE commande_db;
ALTER PUBLICATION supabase_realtime ADD TABLE details_commande_db;

COMMIT;

-- ============================================================
-- VÉRIFICATION DE LA CONFIGURATION
-- ============================================================
-- Exécutez cette requête APRÈS le commit pour vérifier
-- que Real-time est bien activé sur les tables

SELECT
    schemaname,
    tablename,
    pubinsert,
    pubupdate,
    pubdelete,
    pubtruncate
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('commande_db', 'details_commande_db')
ORDER BY tablename;

-- ============================================================
-- RÉSULTAT ATTENDU
-- ============================================================
-- schemaname | tablename            | pubinsert | pubupdate | pubdelete | pubtruncate
-- -----------+----------------------+-----------+-----------+-----------+------------
-- public     | commande_db          | t         | t         | t         | t
-- public     | details_commande_db  | t         | t         | t         | t
--
-- Si vous voyez ces 2 lignes avec tous les flags à 't' (true),
-- Real-time est correctement activé!
-- ============================================================

-- ============================================================
-- VÉRIFICATION SUPPLÉMENTAIRE: REPLICA IDENTITY
-- ============================================================
-- Cette requête confirme que REPLICA IDENTITY est bien configuré

SELECT
    schemaname,
    tablename,
    CASE relreplident
        WHEN 'd' THEN 'DEFAULT'
        WHEN 'n' THEN 'NOTHING'
        WHEN 'f' THEN 'FULL'
        WHEN 'i' THEN 'INDEX'
    END as replica_identity
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
JOIN pg_catalog.pg_publication_tables pt ON pt.tablename = c.relname
WHERE pt.pubname = 'supabase_realtime'
  AND c.relname IN ('commande_db', 'details_commande_db')
ORDER BY c.relname;

-- ============================================================
-- RÉSULTAT ATTENDU
-- ============================================================
-- schemaname | tablename            | replica_identity
-- -----------+----------------------+-----------------
-- public     | commande_db          | FULL
-- public     | details_commande_db  | FULL
-- ============================================================