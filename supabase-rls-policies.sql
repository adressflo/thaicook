-- 🔥 POLITIQUES RLS SÉCURISÉES - CHANTHANA SUPABASE EXPERT
-- Agent Supabase Expert Chanthana - Architecture optimisée
-- Version corrigée et sécurisée par Gemini
-- Date: 2025-09-28

-- =========================================
-- 1. ACTIVATION RLS SUR TOUTES LES TABLES
-- =========================================

ALTER TABLE client_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE commande_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE details_commande_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE plats_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE activites_flux ENABLE ROW LEVEL SECURITY;

-- =========================================
-- 2. FONCTIONS UTILITAIRES POUR L'AUTHENTIFICATION (SÉCURISÉES)
-- =========================================

-- Fonction pour récupérer le Firebase UID depuis les headers personnalisés
CREATE OR REPLACE FUNCTION get_current_firebase_uid()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.headers', true)::json->>'x-firebase-uid';
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = '';

-- Fonction pour vérifier si l'utilisateur actuel est admin
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_firebase_uid TEXT;
  user_role TEXT;
BEGIN
  current_firebase_uid := get_current_firebase_uid();
  IF current_firebase_uid IS NULL THEN
    RETURN FALSE;
  END IF;
  SELECT role INTO user_role
  FROM public.client_db
  WHERE firebase_uid = current_firebase_uid;
  RETURN user_role = 'admin';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = '';

-- Fonction pour vérifier si l'utilisateur actuel est authentifié
CREATE OR REPLACE FUNCTION is_current_user_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_current_firebase_uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = '';

-- =========================================
-- 3. POLITIQUES POUR LA TABLE client_db
-- =========================================

DROP POLICY IF EXISTS "client_db_select_policy" ON client_db;
DROP POLICY IF EXISTS "client_db_insert_policy" ON client_db;
DROP POLICY IF EXISTS "client_db_update_policy" ON client_db;
DROP POLICY IF EXISTS "client_db_delete_policy" ON client_db;

CREATE POLICY "client_db_select_policy" ON client_db
  FOR SELECT USING (is_current_user_admin() OR firebase_uid = get_current_firebase_uid());

CREATE POLICY "client_db_insert_policy" ON client_db
  FOR INSERT WITH CHECK (is_current_user_authenticated() AND firebase_uid = get_current_firebase_uid());

CREATE POLICY "client_db_update_policy" ON client_db
  FOR UPDATE USING (is_current_user_admin() OR firebase_uid = get_current_firebase_uid())
  WITH CHECK (is_current_user_admin() OR firebase_uid = get_current_firebase_uid());

CREATE POLICY "client_db_delete_policy" ON client_db
  FOR DELETE USING (is_current_user_admin());

-- =========================================
-- 4. POLITIQUES POUR LA TABLE commande_db (CORRIGÉ)
-- =========================================

DROP POLICY IF EXISTS "commande_db_select_policy" ON commande_db;
DROP POLICY IF EXISTS "commande_db_insert_policy" ON commande_db;
DROP POLICY IF EXISTS "commande_db_update_policy" ON commande_db;
DROP POLICY IF EXISTS "commande_db_delete_policy" ON commande_db;

-- LECTURE : Admins voient tout, clients voient leurs commandes
CREATE POLICY "commande_db_select_policy" ON commande_db
  FOR SELECT USING (is_current_user_admin() OR client_r = get_current_firebase_uid());

-- INSERTION : Utilisateurs authentifiés peuvent créer des commandes pour eux-mêmes
CREATE POLICY "commande_db_insert_policy" ON commande_db
  FOR INSERT WITH CHECK (is_current_user_authenticated() AND client_r = get_current_firebase_uid());

-- MISE À JOUR : Admins modifient tout, clients modifient leurs commandes non finalisées
CREATE POLICY "commande_db_update_policy" ON commande_db
  FOR UPDATE USING (is_current_user_admin() OR (client_r = get_current_firebase_uid() AND statut_commande NOT IN ('Récupérée', 'Annulée')))
  WITH CHECK (is_current_user_admin() OR (client_r = get_current_firebase_uid() AND statut_commande NOT IN ('Récupérée', 'Annulée')));

-- SUPPRESSION : Seulement les admins
CREATE POLICY "commande_db_delete_policy" ON commande_db
  FOR DELETE USING (is_current_user_admin());

-- =========================================
-- 5. POLITIQUES POUR LA TABLE details_commande_db (CORRIGÉ)
-- =========================================

DROP POLICY IF EXISTS "details_commande_db_select_policy" ON details_commande_db;
DROP POLICY IF EXISTS "details_commande_db_insert_policy" ON details_commande_db;
DROP POLICY IF EXISTS "details_commande_db_update_policy" ON details_commande_db;
DROP POLICY IF EXISTS "details_commande_db_delete_policy" ON details_commande_db;

-- LECTURE : Basé sur l'accès aux commandes parentes
CREATE POLICY "details_commande_db_select_policy" ON details_commande_db
  FOR SELECT USING (
    is_current_user_admin()
    OR EXISTS (
      SELECT 1 FROM public.commande_db
      WHERE commande_db.idcommande = details_commande_db.commande_r
      AND commande_db.client_r = get_current_firebase_uid()
    )
  );

-- INSERTION : Utilisateurs peuvent ajouter des détails à leurs commandes
CREATE POLICY "details_commande_db_insert_policy" ON details_commande_db
  FOR INSERT WITH CHECK (
    is_current_user_authenticated()
    AND EXISTS (
      SELECT 1 FROM public.commande_db
      WHERE commande_db.idcommande = details_commande_db.commande_r
      AND commande_db.client_r = get_current_firebase_uid()
    )
  );

-- MISE À JOUR : Admins ou propriétaires de commandes non finalisées
CREATE POLICY "details_commande_db_update_policy" ON details_commande_db
  FOR UPDATE USING (
    is_current_user_admin()
    OR EXISTS (
      SELECT 1 FROM public.commande_db
      WHERE commande_db.idcommande = details_commande_db.commande_r
      AND commande_db.client_r = get_current_firebase_uid()
      AND commande_db.statut_commande NOT IN ('Récupérée', 'Annulée')
    )
  );

-- SUPPRESSION : Seulement les admins
CREATE POLICY "details_commande_db_delete_policy" ON details_commande_db
  FOR DELETE USING (is_current_user_admin());

-- =========================================
-- 6. POLITIQUES POUR LA TABLE evenements_db
-- =========================================

DROP POLICY IF EXISTS "evenements_db_select_policy" ON evenements_db;
DROP POLICY IF EXISTS "evenements_db_insert_policy" ON evenements_db;
DROP POLICY IF EXISTS "evenements_db_update_policy" ON evenements_db;
DROP POLICY IF EXISTS "evenements_db_delete_policy" ON evenements_db;

CREATE POLICY "evenements_db_select_policy" ON evenements_db
  FOR SELECT USING (is_current_user_admin() OR contact_client_r = get_current_firebase_uid() OR is_current_user_authenticated());

CREATE POLICY "evenements_db_insert_policy" ON evenements_db
  FOR INSERT WITH CHECK (is_current_user_authenticated() AND contact_client_r = get_current_firebase_uid());

CREATE POLICY "evenements_db_update_policy" ON evenements_db
  FOR UPDATE USING (is_current_user_admin() OR contact_client_r = get_current_firebase_uid());

CREATE POLICY "evenements_db_delete_policy" ON evenements_db
  FOR DELETE USING (is_current_user_admin());

-- =========================================
-- 7. POLITIQUES POUR LES TABLES PUBLIQUES (plats_db, extras_db)
-- =========================================

DROP POLICY IF EXISTS "plats_db_select_policy" ON plats_db;
DROP POLICY IF EXISTS "plats_db_insert_policy" ON plats_db;
DROP POLICY IF EXISTS "plats_db_update_policy" ON plats_db;
DROP POLICY IF EXISTS "plats_db_delete_policy" ON plats_db;

CREATE POLICY "plats_db_select_policy" ON plats_db FOR SELECT USING (true);
CREATE POLICY "plats_db_insert_policy" ON plats_db FOR INSERT WITH CHECK (is_current_user_admin());
CREATE POLICY "plats_db_update_policy" ON plats_db FOR UPDATE USING (is_current_user_admin());
CREATE POLICY "plats_db_delete_policy" ON plats_db FOR DELETE USING (is_current_user_admin());

DROP POLICY IF EXISTS "extras_db_select_policy" ON extras_db;
DROP POLICY IF EXISTS "extras_db_insert_policy" ON extras_db;
DROP POLICY IF EXISTS "extras_db_update_policy" ON extras_db;
DROP POLICY IF EXISTS "extras_db_delete_policy" ON extras_db;

CREATE POLICY "extras_db_select_policy" ON extras_db FOR SELECT USING (true);
CREATE POLICY "extras_db_insert_policy" ON extras_db FOR INSERT WITH CHECK (is_current_user_admin());
CREATE POLICY "extras_db_update_policy" ON extras_db FOR UPDATE USING (is_current_user_admin());
CREATE POLICY "extras_db_delete_policy" ON extras_db FOR DELETE USING (is_current_user_admin());

-- =========================================
-- 8. POLITIQUES POUR LA TABLE activites_flux
-- =========================================

DROP POLICY IF EXISTS "activites_flux_select_policy" ON activites_flux;
DROP POLICY IF EXISTS "activites_flux_insert_policy" ON activites_flux;
DROP POLICY IF EXISTS "activites_flux_update_policy" ON activites_flux;
DROP POLICY IF EXISTS "activites_flux_delete_policy" ON activites_flux;

CREATE POLICY "activites_flux_select_policy" ON activites_flux
  FOR SELECT USING (
    is_current_user_admin()
    OR EXISTS (
      SELECT 1 FROM public.client_db
      WHERE client_db.idclient = activites_flux.client_id
      AND client_db.firebase_uid = get_current_firebase_uid()
    )
  );

CREATE POLICY "activites_flux_insert_policy" ON activites_flux
  FOR INSERT WITH CHECK (is_current_user_admin());

CREATE POLICY "activites_flux_update_policy" ON activites_flux
  FOR UPDATE USING (
    is_current_user_admin()
    OR EXISTS (
      SELECT 1 FROM public.client_db
      WHERE client_db.idclient = activites_flux.client_id
      AND client_db.firebase_uid = get_current_firebase_uid()
    )
  );

CREATE POLICY "activites_flux_delete_policy" ON activites_flux
  FOR DELETE USING (is_current_user_admin());

-- =========================================
-- 9. COMMENTAIRES ET NOTES
-- =========================================

COMMENT ON FUNCTION get_current_firebase_uid() IS 'Récupère le Firebase UID depuis les headers personnalisés x-firebase-uid';
COMMENT ON FUNCTION is_current_user_admin() IS 'Vérifie si l''utilisateur actuel a le rôle admin dans client_db';
COMMENT ON FUNCTION is_current_user_authenticated() IS 'Vérifie si l''utilisateur actuel est authentifié (Firebase UID présent)';
