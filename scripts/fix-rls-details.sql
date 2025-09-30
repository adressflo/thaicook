-- ============================================
-- CORRECTION URGENTE RLS POUR DÉTAILS COMMANDES
-- ============================================

-- 1. DÉSACTIVER TEMPORAIREMENT RLS SUR details_commande_db
-- Cela permettra de récupérer et insérer des détails de commandes

ALTER TABLE public.details_commande_db DISABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER LES POLITIQUES DÉFAILLANTES (si elles existent)
-- Ces politiques utilisent probablement get_current_firebase_uid() qui n'existe plus

DROP POLICY IF EXISTS "Users can view their order details" ON public.details_commande_db;
DROP POLICY IF EXISTS "Users can insert their order details" ON public.details_commande_db;
DROP POLICY IF EXISTS "Users can update their order details" ON public.details_commande_db;
DROP POLICY IF EXISTS "Users can delete their order details" ON public.details_commande_db;
DROP POLICY IF EXISTS "Admin can view all order details" ON public.details_commande_db;
DROP POLICY IF EXISTS "Admin can manage all order details" ON public.details_commande_db;

-- 3. VÉRIFIER L'ÉTAT DES TABLES CRITIQUES
-- Afficher l'état RLS des tables importantes

SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  policies.count as policy_count
FROM pg_tables
LEFT JOIN (
  SELECT schemaname, tablename, COUNT(*) as count
  FROM pg_policies
  GROUP BY schemaname, tablename
) policies USING (schemaname, tablename)
WHERE schemaname = 'public'
  AND tablename IN ('commande_db', 'details_commande_db', 'client_db', 'plats_db', 'extras_db')
ORDER BY tablename;

-- 4. CRÉER DES POLITIQUES RLS SIMPLES ET FONCTIONNELLES
-- Remplacer les politiques défaillantes par des versions qui marchent

-- Pour les admins : accès complet sans restrictions
CREATE POLICY "Admin full access" ON public.details_commande_db
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Pour les clients : accès uniquement à leurs propres détails de commandes
-- Note: Cette politique nécessitera une fonction auth.uid() qui fonctionne
CREATE POLICY "Client own details" ON public.details_commande_db
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.commande_db
      WHERE commande_db.idcommande = details_commande_db.commande_r
        AND commande_db.client_r = auth.uid()::text
    )
  );

-- 5. RÉACTIVER RLS AVEC LES NOUVELLES POLITIQUES
-- Une fois les politiques corrigées, réactiver la sécurité

-- ALTER TABLE public.details_commande_db ENABLE ROW LEVEL SECURITY;

-- ============================================
-- INSTRUCTIONS D'EXÉCUTION
-- ============================================

-- ÉTAPE 1: Exécuter ce script dans Supabase SQL Editor
-- ÉTAPE 2: Tester la récupération des détails dans l'application
-- ÉTAPE 3: Si OK, créer des données de test
-- ÉTAPE 4: Réactiver RLS en décommentant la dernière ligne

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

-- ⚠️  RLS TEMPORAIREMENT DÉSACTIVÉ sur details_commande_db
-- ⚠️  À réactiver en production après tests
-- ⚠️  Vérifier que auth.uid() fonctionne avant réactivation
-- ⚠️  Ajuster les politiques selon l'architecture Firebase + Supabase