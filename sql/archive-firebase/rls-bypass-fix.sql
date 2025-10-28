-- ====================================
-- FIX RLS POLICIES - Row Level Security
-- ====================================

-- 1. FONCTION POUR VÉRIFIER SI UN UTILISATEUR EST ADMIN
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.client_db
    WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
    AND role = 'admin'
  );
$$;

-- 2. FONCTION POUR OBTENIR LE FIREBASE UID ACTUEL
CREATE OR REPLACE FUNCTION public.get_current_firebase_uid()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'firebase_uid',
    ''
  );
$$;

-- 3. POLITIQUE UNIVERSELLE POUR CLIENTS
-- Permet aux utilisateurs de voir leurs propres données ou aux admins de tout voir
CREATE OR REPLACE FUNCTION public.can_access_client_data(client_firebase_uid TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    -- L'utilisateur peut accéder à ses propres données
    get_current_firebase_uid() = client_firebase_uid
    OR
    -- Ou c'est un admin
    is_admin_user()
    OR
    -- Ou politiques désactivées pour debug
    current_setting('app.bypass_rls', true) = 'true'
  );
$$;

-- 4. RECRÉER LES POLITIQUES CLIENT_DB
DROP POLICY IF EXISTS "clients_read" ON public.client_db;
DROP POLICY IF EXISTS "clients_insert" ON public.client_db;
DROP POLICY IF EXISTS "clients_update" ON public.client_db;

CREATE POLICY "clients_read" ON public.client_db
  FOR SELECT USING (can_access_client_data(firebase_uid));

CREATE POLICY "clients_insert" ON public.client_db
  FOR INSERT WITH CHECK (can_access_client_data(firebase_uid));

CREATE POLICY "clients_update" ON public.client_db
  FOR UPDATE USING (can_access_client_data(firebase_uid));

-- 5. POLITIQUE POUR ÉVÉNEMENTS
DROP POLICY IF EXISTS "evenements_read" ON public.evenements_db;
DROP POLICY IF EXISTS "evenements_insert" ON public.evenements_db;

CREATE POLICY "evenements_read" ON public.evenements_db
  FOR SELECT USING (true); -- Lecture libre pour tous

CREATE POLICY "evenements_insert" ON public.evenements_db
  FOR INSERT WITH CHECK (
    -- Seuls les clients connectés peuvent créer des événements
    get_current_firebase_uid() != ''
    AND get_current_firebase_uid() = contact_client_r
  );

-- 6. POLITIQUE POUR COMMANDES
DROP POLICY IF EXISTS "commandes_read" ON public.commande_db;
DROP POLICY IF EXISTS "commandes_insert" ON public.commande_db;

CREATE POLICY "commandes_read" ON public.commande_db
  FOR SELECT USING (
    can_access_client_data(client_r) OR is_admin_user()
  );

CREATE POLICY "commandes_insert" ON public.commande_db
  FOR INSERT WITH CHECK (
    can_access_client_data(client_r) OR is_admin_user()
  );

-- 7. GRANT PERMISSIONS
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_firebase_uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_client_data(TEXT) TO anon, authenticated;

-- 8. MESSAGE DE CONFIRMATION
DO $$
BEGIN
    RAISE NOTICE '✅ RLS Policies corrigées !';
    RAISE NOTICE '📋 Fonctions ajoutées :';
    RAISE NOTICE '   - is_admin_user()';
    RAISE NOTICE '   - get_current_firebase_uid()';
    RAISE NOTICE '   - can_access_client_data()';
    RAISE NOTICE '🎯 Politiques RLS mise à jour pour client_db, evenements_db, commande_db';
END $$;