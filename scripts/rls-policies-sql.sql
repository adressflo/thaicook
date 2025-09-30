-- 🔒 SCRIPT SQL POUR SÉCURISER LES POLICIES RLS
-- Chanthana Thai Restaurant - Application Next.js + Supabase
--
-- INSTRUCTIONS:
-- 1. Copiez chaque section et exécutez-la dans le SQL Editor de Supabase
-- 2. Testez votre application après chaque modification
-- 3. En cas de problème, utilisez les commandes de rollback en fin de fichier

-- ============================================================================
-- ÉTAPE 1: ACTIVER RLS SUR TOUTES LES TABLES PRINCIPALES
-- ============================================================================

-- Activation RLS sur les tables critiques
ALTER TABLE client_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE plats_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE commande_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE details_commande_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE activites_flux ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ÉTAPE 2: SUPPRIMER LES ANCIENNES POLICIES TROP PERMISSIVES
-- ============================================================================

-- Supprimer toutes les policies existantes (remplacez "Allow all for XXX" par le nom exact de vos policies)
DROP POLICY IF EXISTS "Allow all for client_db" ON client_db;
DROP POLICY IF EXISTS "Allow all for plats_db" ON plats_db;
DROP POLICY IF EXISTS "Allow all for commande_db" ON commande_db;
DROP POLICY IF EXISTS "Allow all for details_commande_db" ON details_commande_db;
DROP POLICY IF EXISTS "Allow all for evenements_db" ON evenements_db;
DROP POLICY IF EXISTS "Allow all for extras_db" ON extras_db;
DROP POLICY IF EXISTS "Allow all for activites_flux" ON activites_flux;

-- ============================================================================
-- ÉTAPE 3: CRÉER LES NOUVELLES POLICIES SÉCURISÉES
-- ============================================================================

-- 🧑‍🤝‍🧑 CLIENTS: Peuvent voir/modifier uniquement leurs propres données
CREATE POLICY "client_select_own" ON client_db
FOR SELECT
USING (firebase_uid = auth.jwt() ->> 'sub');

CREATE POLICY "client_update_own" ON client_db
FOR UPDATE
USING (firebase_uid = auth.jwt() ->> 'sub');

CREATE POLICY "client_insert_authenticated" ON client_db
FOR INSERT
TO authenticated
WITH CHECK (firebase_uid = auth.jwt() ->> 'sub');

-- 🍜 PLATS: Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "plats_select_authenticated" ON plats_db
FOR SELECT
TO authenticated
USING (true);

-- 📋 COMMANDES: Clients voient uniquement leurs commandes
CREATE POLICY "commandes_select_own" ON commande_db
FOR SELECT
USING (
  client_id IN (
    SELECT id FROM client_db
    WHERE firebase_uid = auth.jwt() ->> 'sub'
  )
);

CREATE POLICY "commandes_insert_own" ON commande_db
FOR INSERT
TO authenticated
WITH CHECK (
  client_id IN (
    SELECT id FROM client_db
    WHERE firebase_uid = auth.jwt() ->> 'sub'
  )
);

CREATE POLICY "commandes_update_own" ON commande_db
FOR UPDATE
USING (
  client_id IN (
    SELECT id FROM client_db
    WHERE firebase_uid = auth.jwt() ->> 'sub'
  )
);

-- 🛒 DÉTAILS COMMANDES: Liés aux commandes du client
CREATE POLICY "details_select_own" ON details_commande_db
FOR SELECT
USING (
  commande_id IN (
    SELECT id FROM commande_db
    WHERE client_id IN (
      SELECT id FROM client_db
      WHERE firebase_uid = auth.jwt() ->> 'sub'
    )
  )
);

CREATE POLICY "details_insert_own" ON details_commande_db
FOR INSERT
TO authenticated
WITH CHECK (
  commande_id IN (
    SELECT id FROM commande_db
    WHERE client_id IN (
      SELECT id FROM client_db
      WHERE firebase_uid = auth.jwt() ->> 'sub'
    )
  )
);

-- 🎉 ÉVÉNEMENTS: Lecture pour authentifiés, création pour tous (avec contact_client_r)
CREATE POLICY "events_select_authenticated" ON evenements_db
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "events_insert_authenticated" ON evenements_db
FOR INSERT
TO authenticated
WITH CHECK (
  contact_client_r IS NOT NULL AND
  contact_client_r = auth.jwt() ->> 'sub'
);

CREATE POLICY "events_update_own" ON evenements_db
FOR UPDATE
USING (contact_client_r = auth.jwt() ->> 'sub');

-- 🧩 EXTRAS: Lecture pour tous les authentifiés
CREATE POLICY "extras_select_authenticated" ON extras_db
FOR SELECT
TO authenticated
USING (true);

-- 📊 ACTIVITÉS: Lecture pour authentifiés (logs système)
CREATE POLICY "activites_select_authenticated" ON activites_flux
FOR SELECT
TO authenticated
USING (true);

-- 🔔 NOTIFICATIONS: Utilisateurs voient leurs propres notifications
CREATE POLICY "notifications_select_own" ON notification_history
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM client_db
    WHERE firebase_uid = auth.jwt() ->> 'sub'
  )
);

-- 📋 TEMPLATES NOTIFICATIONS: Lecture pour authentifiés
CREATE POLICY "notification_templates_select_authenticated" ON notification_templates
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- ÉTAPE 4: POLICIES ADMIN (OPTIONNEL - POUR LES UTILISATEURS ADMIN)
-- ============================================================================

-- Ces policies permettent aux admins d'accéder à toutes les données
-- Remplacez 'your-admin-email@domain.com' par votre email admin réel

-- Admin peut tout voir/modifier
CREATE POLICY "admin_all_access" ON client_db
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'admin@chanthana.com' OR
  auth.jwt() ->> 'email' = 'contact@chanthana.com'
);

CREATE POLICY "admin_plats_all" ON plats_db
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'admin@chanthana.com' OR
  auth.jwt() ->> 'email' = 'contact@chanthana.com'
);

CREATE POLICY "admin_commandes_all" ON commande_db
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'admin@chanthana.com' OR
  auth.jwt() ->> 'email' = 'contact@chanthana.com'
);

CREATE POLICY "admin_details_all" ON details_commande_db
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'admin@chanthana.com' OR
  auth.jwt() ->> 'email' = 'contact@chanthana.com'
);

CREATE POLICY "admin_events_all" ON evenements_db
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'admin@chanthana.com' OR
  auth.jwt() ->> 'email' = 'contact@chanthana.com'
);

-- ============================================================================
-- ÉTAPE 5: VÉRIFICATION ET TESTS
-- ============================================================================

-- Vérifier que RLS est activé
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN (
  'client_db', 'plats_db', 'commande_db', 'details_commande_db',
  'evenements_db', 'extras_db'
)
AND rowsecurity = true;

-- Lister toutes les policies créées
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN (
  'client_db', 'plats_db', 'commande_db', 'details_commande_db',
  'evenements_db', 'extras_db'
)
ORDER BY tablename, policyname;

-- ============================================================================
-- ROLLBACK: EN CAS DE PROBLÈME, UTILISEZ CES COMMANDES
-- ============================================================================

/*
-- DÉSACTIVER RLS (TEMPORAIREMENT POUR DEBUG)
ALTER TABLE client_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE plats_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE commande_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE details_commande_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE evenements_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE extras_db DISABLE ROW LEVEL SECURITY;

-- OU SUPPRIMER TOUTES LES POLICIES
DROP POLICY IF EXISTS "client_select_own" ON client_db;
DROP POLICY IF EXISTS "client_update_own" ON client_db;
DROP POLICY IF EXISTS "client_insert_authenticated" ON client_db;
DROP POLICY IF EXISTS "plats_select_authenticated" ON plats_db;
DROP POLICY IF EXISTS "commandes_select_own" ON commande_db;
DROP POLICY IF EXISTS "commandes_insert_own" ON commande_db;
DROP POLICY IF EXISTS "commandes_update_own" ON commande_db;
DROP POLICY IF EXISTS "details_select_own" ON details_commande_db;
DROP POLICY IF EXISTS "details_insert_own" ON details_commande_db;
DROP POLICY IF EXISTS "events_select_authenticated" ON evenements_db;
DROP POLICY IF EXISTS "events_insert_authenticated" ON evenements_db;
DROP POLICY IF EXISTS "events_update_own" ON evenements_db;
DROP POLICY IF EXISTS "extras_select_authenticated" ON extras_db;
*/

-- ============================================================================
-- NOTES IMPORTANTES
-- ============================================================================

/*
🔑 AUTHENTIFICATION FIREBASE + SUPABASE:
- Les policies utilisent auth.jwt() ->> 'sub' pour récupérer le Firebase UID
- Assurez-vous que vos utilisateurs Firebase sont bien synchronisés avec client_db
- Le champ firebase_uid de client_db doit correspondre au UID Firebase

🎯 PERMISSIONS PAR RÔLE:
- Clients authentifiés: Voient leurs propres données + catalogue public
- Admins: Accès complet (vérifiez l'email dans les policies admin)
- Non-authentifiés: Aucun accès (RLS bloque tout)

🧪 TESTS RECOMMANDÉS:
1. Testez avec un utilisateur client normal
2. Testez avec un compte admin
3. Testez les opérations CRUD sur chaque table
4. Vérifiez que les jointures fonctionnent toujours

⚠️ IMPORTANT:
- Exécutez ces commandes par sections, pas toutes d'un coup
- Testez votre application après chaque section
- Gardez un backup de votre base avant modification
*/