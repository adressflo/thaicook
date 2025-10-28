-- SOLUTION RAPIDE : Désactiver RLS sur Storage (DEBUG SEULEMENT)
-- ATTENTION: Ne pas utiliser en production

-- Désactiver RLS sur les objets storage
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Vérifier que c'est bien désactivé
SELECT
  schemaname,
  tablename,
  rowsecurity,
  CASE WHEN rowsecurity THEN 'RLS ACTIVÉ ⚠️' ELSE 'RLS DÉSACTIVÉ ✅' END as statut
FROM pg_tables
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '⚠️ RLS DÉSACTIVÉ sur storage.objects';
    RAISE NOTICE '✅ Upload d''images maintenant possible';
    RAISE NOTICE '🚨 ATTENTION: Réactiver RLS en production !';
    RAISE NOTICE '📝 Commande pour réactiver: ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;';
END $$;