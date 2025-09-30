-- Script pour activer Real-time Supabase sur les tables commandes
-- Exécution : psql ou SQL Editor Supabase

BEGIN;

-- 1. Activer REPLICA IDENTITY pour commande_db
ALTER TABLE commande_db REPLICA IDENTITY FULL;

-- 2. Activer REPLICA IDENTITY pour details_commande_db
ALTER TABLE details_commande_db REPLICA IDENTITY FULL;

-- 3. Ajouter commande_db à la publication Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE commande_db;

-- 4. Ajouter details_commande_db à la publication Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE details_commande_db;

COMMIT;

-- Vérifier l'activation
SELECT
  schemaname,
  tablename,
  pubinsert,
  pubupdate,
  pubdelete
FROM
  pg_publication_tables
WHERE
  pubname = 'supabase_realtime'
  AND tablename IN ('commande_db', 'details_commande_db')
ORDER BY tablename;
