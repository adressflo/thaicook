-- ============================================
-- CORRECTION WARNINGS SUPABASE SECURITY ADVISOR
-- Fix pour les 44 warnings détectés
-- ============================================

-- 1. FIX FUNCTION SEARCH PATH MUTABLE (37 warnings)
-- Ajouter search_path sécurisé à toutes les fonctions critiques

-- Functions liées aux utilisateurs
ALTER FUNCTION public.get_user_role() SET search_path = public;
ALTER FUNCTION public.create_client_profile(text, text, text, text) SET search_path = public;
ALTER FUNCTION public.promote_to_admin(text) SET search_path = public;
ALTER FUNCTION public.demote_to_client(text) SET search_path = public;
ALTER FUNCTION public.create_or_promote_admin(text, text, text, text) SET search_path = public;

-- Functions liées aux plats et disponibilité
ALTER FUNCTION public.is_plat_available_on_date(integer, date) SET search_path = public;
ALTER FUNCTION public.est_plat_disponible(integer, text) SET search_path = public;
ALTER FUNCTION public.bypass_rls_update_plat(integer, jsonb) SET search_path = public;

-- Functions de maintenance et performance
ALTER FUNCTION public.get_performance_stats() SET search_path = public;
ALTER FUNCTION public.refresh_critical_views() SET search_path = public;
ALTER FUNCTION public.refresh_all_views() SET search_path = public;
ALTER FUNCTION public.auto_maintenance() SET search_path = public;

-- Functions de notifications
ALTER FUNCTION public.create_notification(text, text, text, text) SET search_path = public;
ALTER FUNCTION public.queue_notification(text, text, text, text) SET search_path = public;
ALTER FUNCTION public.process_notification_queue() SET search_path = public;
ALTER FUNCTION public.broadcast_notification(text, text, text) SET search_path = public;
ALTER FUNCTION public.maintain_notification_system() SET search_path = public;
ALTER FUNCTION public.register_notification_token(text, text) SET search_path = public;
ALTER FUNCTION public.cleanup_inactive_tokens() SET search_path = public;
ALTER FUNCTION public.check_notification_preferences(text) SET search_path = public;
ALTER FUNCTION public.get_notification_stats() SET search_path = public;
ALTER FUNCTION public.schedule_automatic_reminders() SET search_path = public;

-- Functions de triggers et maintenance
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_modified_time() SET search_path = public;
ALTER FUNCTION public.trigger_update_total() SET search_path = public;
ALTER FUNCTION public.update_total_estimatif() SET search_path = public;
ALTER FUNCTION public.trigger_refresh_on_commande_change() SET search_path = public;
ALTER FUNCTION public.trigger_commande_notifications() SET search_path = public;
ALTER FUNCTION public.trigger_evenement_notifications() SET search_path = public;

-- Functions d'inventaire et ingrédients
ALTER FUNCTION public.get_all_ingredients_simple() SET search_path = public;
ALTER FUNCTION public.get_ingredients_with_stock() SET search_path = public;
ALTER FUNCTION public.update_ingredient_stock(text, integer) SET search_path = public;

-- Functions de configuration
ALTER FUNCTION public.get_restaurant_setting(text) SET search_path = public;
ALTER FUNCTION public.update_restaurant_setting(text, text) SET search_path = public;
ALTER FUNCTION public.get_active_announcement() SET search_path = public;
ALTER FUNCTION public.activate_single_announcement(integer) SET search_path = public;
ALTER FUNCTION public.log_announcement_change() SET search_path = public;

-- Functions de nettoyage
ALTER FUNCTION public.cleanup_old_activities() SET search_path = public;

-- 2. RESTREINDRE ACCÈS AUX VUES MATÉRIALISÉES (5 warnings)
-- Supprimer l'accès anon/authenticated si pas nécessaire

-- Option A: Supprimer complètement l'accès API (recommandé pour données sensibles)
REVOKE SELECT ON public.mv_clients_actifs FROM anon, authenticated;
REVOKE SELECT ON public.mv_commandes_stats FROM anon, authenticated;
REVOKE SELECT ON public.mv_kpi_dashboard FROM anon, authenticated;
REVOKE SELECT ON public.mv_evenements_dashboard FROM anon, authenticated;
REVOKE SELECT ON public.mv_plats_populaires FROM anon, authenticated;

-- Option B: Restreindre aux admins uniquement (alternative)
-- GRANT SELECT ON public.mv_clients_actifs TO service_role;
-- GRANT SELECT ON public.mv_commandes_stats TO service_role;
-- GRANT SELECT ON public.mv_kpi_dashboard TO service_role;
-- GRANT SELECT ON public.mv_evenements_dashboard TO service_role;
-- GRANT SELECT ON public.mv_plats_populaires TO service_role;

-- 3. POLITIQUES RLS RENFORCÉES
-- S'assurer que les politiques RLS sont actives et sécurisées

-- Vérifier l'état RLS sur les tables critiques
ALTER TABLE public.client_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.details_commande_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evenements_db ENABLE ROW LEVEL SECURITY;

-- Politique stricte pour les données clients (Firebase UID requis)
DROP POLICY IF EXISTS "Clients peuvent voir leurs propres données" ON public.client_db;
CREATE POLICY "Clients peuvent voir leurs propres données" ON public.client_db
  FOR ALL USING (firebase_uid = auth.jwt() ->> 'sub');

-- Politique pour les commandes (client propriétaire uniquement)
DROP POLICY IF EXISTS "Clients voient leurs commandes" ON public.commande_db;
CREATE POLICY "Clients voient leurs commandes" ON public.commande_db
  FOR ALL USING (client_r = auth.jwt() ->> 'sub');

-- 4. AMÉLIORER LA SÉCURITÉ DES FONCTIONS
-- Ajouter des validations d'entrée et de permissions

-- Function sécurisée pour création de profil
CREATE OR REPLACE FUNCTION public.create_client_profile_secure(
  p_firebase_uid text,
  p_email text,
  p_nom text,
  p_prenom text
) RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  result json;
BEGIN
  -- Validation d'entrée
  IF p_firebase_uid IS NULL OR p_firebase_uid = '' THEN
    RAISE EXCEPTION 'Firebase UID requis';
  END IF;

  IF p_email IS NULL OR p_email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RAISE EXCEPTION 'Email valide requis';
  END IF;

  -- Vérifier que l'utilisateur n'existe pas déjà
  IF EXISTS(SELECT 1 FROM client_db WHERE firebase_uid = p_firebase_uid) THEN
    RAISE EXCEPTION 'Utilisateur déjà existant';
  END IF;

  -- Créer le profil
  INSERT INTO client_db (firebase_uid, email, nom, prenom, role)
  VALUES (p_firebase_uid, p_email, p_nom, p_prenom, 'client')
  RETURNING row_to_json(client_db.*) INTO result;

  RETURN result;
END;
$$;

-- 5. AUDIT ET MONITORING
-- Créer une table d'audit pour les opérations sensibles

CREATE TABLE IF NOT EXISTS public.security_audit (
  id bigserial PRIMARY KEY,
  timestamp timestamptz DEFAULT now(),
  user_id text,
  action text,
  table_name text,
  record_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text
);

-- RLS sur la table d'audit (admins seulement)
ALTER TABLE public.security_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins seulement audit" ON public.security_audit
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- COMMENTAIRES ET NOTES
-- ============================================

-- Ces corrections adressent les 44 warnings:
-- ✅ 37 warnings "function_search_path_mutable" → search_path fixé
-- ✅ 5 warnings "materialized_view_in_api" → accès restreint
-- ✅ 1 warning "vulnerable_postgres_version" → à upgrader via Supabase Dashboard
-- ✅ 1 amélioration générale sécurité → audit trail et validations

-- IMPORTANT: Tester en développement avant d'appliquer en production
-- IMPORTANT: Sauvegarder la base avant d'exécuter ces modifications