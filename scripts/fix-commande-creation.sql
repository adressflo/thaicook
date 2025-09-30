-- ============================================
-- DIAGNOSTIC ET CORRECTION CRÉATION COMMANDES
-- ============================================

-- 1. VÉRIFIER LES POLITIQUES ACTUELLES SUR commande_db
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'commande_db'
ORDER BY policyname;

-- 2. DÉSACTIVER TEMPORAIREMENT RLS SUR commande_db POUR TESTS
-- (Si les politiques utilisent des fonctions manquantes)

-- ALTER TABLE public.commande_db DISABLE ROW LEVEL SECURITY;

-- 3. SUPPRIMER LES POLITIQUES POTENTIELLEMENT DÉFAILLANTES
-- (Décommentez si nécessaire après avoir vu les politiques ci-dessus)

/*
DROP POLICY IF EXISTS "Users can view their orders" ON public.commande_db;
DROP POLICY IF EXISTS "Users can insert their orders" ON public.commande_db;
DROP POLICY IF EXISTS "Users can update their orders" ON public.commande_db;
DROP POLICY IF EXISTS "Admin can view all orders" ON public.commande_db;
DROP POLICY IF EXISTS "Admin can manage all orders" ON public.commande_db;
*/

-- 4. CRÉER POLITIQUES SIMPLES ET FONCTIONNELLES
-- (Remplacer par des politiques qui fonctionnent)

/*
-- Pour les admins : accès complet
CREATE POLICY "Admin full access commandes" ON public.commande_db
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Pour les clients : leurs propres commandes uniquement
CREATE POLICY "Client own commandes" ON public.commande_db
  FOR ALL
  TO authenticated
  USING (client_r = auth.uid()::text)
  WITH CHECK (client_r = auth.uid()::text);
*/

-- 5. TEST DE CRÉATION MANUELLE
-- Tester la création d'une commande basique

/*
INSERT INTO public.commande_db (
  client_r,
  date_de_prise_de_commande,
  statut_commande,
  statut_paiement,
  type_livraison
) VALUES (
  'test-uid-123',
  NOW(),
  'En attente de confirmation',
  'En attente sur place',
  'À emporter'
);
*/

-- 6. VÉRIFIER LES CONTRAINTES ET TRIGGERS
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.commande_db'::regclass;

-- 7. VÉRIFIER LES TRIGGERS
SELECT
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'commande_db'
  AND event_object_schema = 'public';

-- ============================================
-- INSTRUCTIONS
-- ============================================

-- ÉTAPE 1: Exécuter les requêtes 1, 6, 7 pour diagnostiquer
-- ÉTAPE 2: Si des fonctions manquantes, décommenter la ligne "ALTER TABLE ... DISABLE"
-- ÉTAPE 3: Tester la création de commande dans l'app
-- ÉTAPE 4: Si OK, créer des politiques simples et réactiver RLS

-- ============================================
-- NOTES
-- ============================================

-- Le problème peut venir de :
-- ✓ Politiques RLS utilisant des fonctions manquantes (comme get_current_firebase_uid)
-- ✓ Contraintes de clés étrangères strict
-- ✓ Triggers défaillants
-- ✓ Validation de données stricte