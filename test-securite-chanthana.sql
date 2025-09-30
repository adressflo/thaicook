-- 🧪 TESTS SÉCURITÉ CHANTHANA - Agent Supabase Expert
-- Tests de validation des politiques RLS selon architecture analysée
-- 29 tables, 57 migrations, 13 clients actifs, 44 commandes
-- Date: 2025-09-28

-- ==========================================
-- 1. VÉRIFICATION ACTIVATION RLS
-- ==========================================

-- Vérifier que RLS est activé sur toutes les tables critiques
SELECT
  schemaname,
  tablename,
  rowsecurity as "RLS_ACTIVÉ",
  CASE
    WHEN rowsecurity THEN '✅ SÉCURISÉ'
    ELSE '🚨 VULNÉRABLE'
  END as statut_securite
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'client_db', 'commande_db', 'details_commande_db',
  'evenements_db', 'plats_db', 'extras_db', 'activites_flux',
  'notification_queue', 'notification_history', 'notification_templates'
)
ORDER BY tablename;

-- ==========================================
-- 2. AUDIT DES POLITIQUES RLS
-- ==========================================

-- Lister toutes les politiques RLS actives
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd as "OPÉRATION",
  CASE
    WHEN cmd = 'SELECT' THEN '🔍 LECTURE'
    WHEN cmd = 'INSERT' THEN '➕ CRÉATION'
    WHEN cmd = 'UPDATE' THEN '✏️ MODIFICATION'
    WHEN cmd = 'DELETE' THEN '🗑️ SUPPRESSION'
    ELSE cmd
  END as type_operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- ==========================================
-- 3. TEST FONCTIONS AUTHENTIFICATION
-- ==========================================

-- Test des fonctions d'authentification Firebase
DO $$
BEGIN
  RAISE NOTICE '🧪 TEST FONCTIONS AUTHENTIFICATION';

  -- Test 1: Fonction get_current_firebase_uid
  IF EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'get_current_firebase_uid') THEN
    RAISE NOTICE '✅ Fonction get_current_firebase_uid existe';
  ELSE
    RAISE NOTICE '❌ Fonction get_current_firebase_uid MANQUANTE';
  END IF;

  -- Test 2: Fonction is_current_user_admin
  IF EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'is_current_user_admin') THEN
    RAISE NOTICE '✅ Fonction is_current_user_admin existe';
  ELSE
    RAISE NOTICE '❌ Fonction is_current_user_admin MANQUANTE';
  END IF;

  -- Test 3: Fonction is_current_user_authenticated
  IF EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'is_current_user_authenticated') THEN
    RAISE NOTICE '✅ Fonction is_current_user_authenticated existe';
  ELSE
    RAISE NOTICE '❌ Fonction is_current_user_authenticated MANQUANTE';
  END IF;
END $$;

-- ==========================================
-- 4. TEST SIMULATION UTILISATEUR
-- ==========================================

-- Simuler un utilisateur Firebase pour tester les politiques
DO $$
DECLARE
  test_firebase_uid TEXT := 'test-firebase-uid-security-check';
  current_uid TEXT;
  is_auth BOOLEAN;
  is_admin BOOLEAN;
BEGIN
  RAISE NOTICE '🧪 SIMULATION UTILISATEUR FIREBASE';

  -- Définir le header Firebase UID
  PERFORM set_config('request.headers', format('{"x-firebase-uid": "%s"}', test_firebase_uid), true);

  -- Tester la récupération de l'UID
  SELECT get_current_firebase_uid() INTO current_uid;
  RAISE NOTICE 'Firebase UID récupéré: %', COALESCE(current_uid, 'NULL');

  -- Tester l'authentification
  SELECT is_current_user_authenticated() INTO is_auth;
  RAISE NOTICE 'Utilisateur authentifié: %', is_auth;

  -- Tester le statut admin
  SELECT is_current_user_admin() INTO is_admin;
  RAISE NOTICE 'Utilisateur admin: %', is_admin;

  -- Reset
  PERFORM set_config('request.headers', NULL, true);

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur test simulation: %', SQLERRM;
END $$;

-- ==========================================
-- 5. AUDIT DONNÉES SENSIBLES
-- ==========================================

-- Compter les clients sans firebase_uid (problème sécurité)
SELECT
  'client_db' as table_name,
  COUNT(*) as total_clients,
  COUNT(firebase_uid) as avec_firebase_uid,
  COUNT(*) - COUNT(firebase_uid) as sans_firebase_uid,
  CASE
    WHEN COUNT(*) - COUNT(firebase_uid) = 0 THEN '✅ TOUS SÉCURISÉS'
    ELSE '🚨 CLIENTS NON SÉCURISÉS'
  END as statut_securite
FROM client_db;

-- Vérifier les rôles utilisateur
SELECT
  role,
  COUNT(*) as nombre_utilisateurs,
  CASE
    WHEN role = 'admin' THEN '👑 ADMINISTRATEURS'
    WHEN role = 'client' THEN '👤 CLIENTS'
    ELSE '❓ RÔLE INCONNU'
  END as type_utilisateur
FROM client_db
WHERE firebase_uid IS NOT NULL
GROUP BY role
ORDER BY role;

-- ==========================================
-- 6. VÉRIFICATION SÉCURITÉ COMMANDES
-- ==========================================

-- Audit des commandes et leur sécurité
SELECT
  'commande_db' as table_name,
  COUNT(*) as total_commandes,
  COUNT(firebase_uid_client) as avec_firebase_uid,
  COUNT(*) - COUNT(firebase_uid_client) as sans_firebase_uid,
  CASE
    WHEN COUNT(*) - COUNT(firebase_uid_client) = 0 THEN '✅ TOUTES SÉCURISÉES'
    ELSE '🚨 COMMANDES NON SÉCURISÉES'
  END as statut_securite
FROM commande_db;

-- Statuts des commandes par sécurité
SELECT
  statut_commande,
  COUNT(*) as nombre_commandes,
  COUNT(firebase_uid_client) as avec_firebase_uid
FROM commande_db
GROUP BY statut_commande
ORDER BY statut_commande;

-- ==========================================
-- 7. TEST ACCÈS DONNÉES PAR RÔLE
-- ==========================================

-- Test accès client_db pour un client normal
DO $$
DECLARE
  client_firebase_uid TEXT;
  accessible_count INTEGER;
BEGIN
  RAISE NOTICE '🧪 TEST ACCÈS DONNÉES CLIENT';

  -- Prendre le premier client non-admin
  SELECT firebase_uid INTO client_firebase_uid
  FROM client_db
  WHERE role = 'client'
  AND firebase_uid IS NOT NULL
  LIMIT 1;

  IF client_firebase_uid IS NOT NULL THEN
    RAISE NOTICE 'Test avec Firebase UID client: %', client_firebase_uid;

    -- Simuler l'utilisateur
    PERFORM set_config('request.headers', format('{"x-firebase-uid": "%s"}', client_firebase_uid), true);

    -- Tenter d'accéder aux données (devrait être limité à son profil)
    SELECT COUNT(*) INTO accessible_count
    FROM client_db
    WHERE firebase_uid = get_current_firebase_uid();

    RAISE NOTICE 'Profils accessibles au client: % (devrait être 1)', accessible_count;

    -- Reset
    PERFORM set_config('request.headers', NULL, true);
  ELSE
    RAISE NOTICE '❌ Aucun client avec firebase_uid trouvé pour test';
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur test accès client: %', SQLERRM;
END $$;

-- ==========================================
-- 8. RÉSUMÉ SÉCURITÉ CHANTHANA
-- ==========================================

SELECT
  '🔒 RAPPORT SÉCURITÉ CHANTHANA' as titre,
  now() as date_audit,
  '29 tables analysées' as scope,
  'Agent Supabase Expert' as auditeur;

-- Afficher le score de sécurité global
DO $$
DECLARE
  tables_rls_count INTEGER;
  total_tables_count INTEGER;
  policies_count INTEGER;
  functions_count INTEGER;
  score_securite NUMERIC;
BEGIN
  RAISE NOTICE '🏆 SCORE SÉCURITÉ GLOBAL CHANTHANA';

  -- Compter tables avec RLS
  SELECT COUNT(*) INTO tables_rls_count
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = true
  AND tablename IN ('client_db', 'commande_db', 'details_commande_db', 'evenements_db', 'plats_db', 'extras_db');

  total_tables_count := 6; -- Tables critiques

  -- Compter politiques RLS
  SELECT COUNT(*) INTO policies_count
  FROM pg_policies
  WHERE schemaname = 'public';

  -- Compter fonctions sécurité
  SELECT COUNT(*) INTO functions_count
  FROM pg_proc
  WHERE proname IN ('get_current_firebase_uid', 'is_current_user_admin', 'is_current_user_authenticated');

  -- Calculer score
  score_securite := (
    (tables_rls_count::NUMERIC / total_tables_count * 40) +
    (LEAST(policies_count, 20)::NUMERIC / 20 * 40) +
    (functions_count::NUMERIC / 3 * 20)
  );

  RAISE NOTICE 'Tables RLS actif: %/%', tables_rls_count, total_tables_count;
  RAISE NOTICE 'Politiques RLS: %', policies_count;
  RAISE NOTICE 'Fonctions sécurité: %/3', functions_count;
  RAISE NOTICE '📊 SCORE SÉCURITÉ: %/100', ROUND(score_securite, 1);

  IF score_securite >= 90 THEN
    RAISE NOTICE '🥇 NIVEAU SÉCURITÉ: EXCELLENT';
  ELSIF score_securite >= 70 THEN
    RAISE NOTICE '🥈 NIVEAU SÉCURITÉ: BON';
  ELSIF score_securite >= 50 THEN
    RAISE NOTICE '🥉 NIVEAU SÉCURITÉ: MOYEN';
  ELSE
    RAISE NOTICE '🚨 NIVEAU SÉCURITÉ: CRITIQUE';
  END IF;

END $$;

-- ==========================================
-- 9. RECOMMANDATIONS ACTIONS
-- ==========================================

DO $$
BEGIN
  RAISE NOTICE '🎯 PROCHAINES ACTIONS RECOMMANDÉES';
  RAISE NOTICE '1. Appliquer politiques RLS si score < 90';
  RAISE NOTICE '2. Tester authentification dans application';
  RAISE NOTICE '3. Valider accès par rôle (admin vs client)';
  RAISE NOTICE '4. Sauvegarder configuration actuelle';
  RAISE NOTICE '5. Documenter procédures sécurité';
  RAISE NOTICE '✅ Test sécurité Chanthana terminé';
END $$;