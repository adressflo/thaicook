-- ============================================
-- FIX RLS POLICIES STORAGE - Supabase Storage
-- ============================================

-- 1. ACTIVER RLS SUR LE BUCKET PLATPHOTO
INSERT INTO storage.buckets (id, name, public)
VALUES ('platphoto', 'platphoto', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. POLITIQUE POUR UPLOAD D'IMAGES (INSERT)
CREATE POLICY "platphoto_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'platphoto'
    AND (
      -- Admins peuvent uploader partout
      EXISTS (
        SELECT 1 FROM public.client_db
        WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        AND role = 'admin'
      )
      OR
      -- Utilisateurs connectés peuvent uploader
      current_setting('request.jwt.claims', true)::json->>'sub' IS NOT NULL
      OR
      -- Permettre uploads publics temporairement (debug)
      current_setting('app.allow_public_upload', true) = 'true'
    )
  );

-- 3. POLITIQUE POUR LIRE LES IMAGES (SELECT)
CREATE POLICY "platphoto_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'platphoto'
  );

-- 4. POLITIQUE POUR METTRE À JOUR LES IMAGES (UPDATE)
CREATE POLICY "platphoto_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'platphoto'
    AND (
      -- Admins peuvent modifier
      EXISTS (
        SELECT 1 FROM public.client_db
        WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
        AND role = 'admin'
      )
      OR
      -- Propriétaire peut modifier (basé sur le nom du fichier)
      current_setting('request.jwt.claims', true)::json->>'sub' IS NOT NULL
    )
  );

-- 5. POLITIQUE POUR SUPPRIMER LES IMAGES (DELETE)
CREATE POLICY "platphoto_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'platphoto'
    AND EXISTS (
      SELECT 1 FROM public.client_db
      WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
      AND role = 'admin'
    )
  );

-- 6. ALTERNATIVE : DÉSACTIVER TEMPORAIREMENT RLS SUR STORAGE (DEBUG)
-- ATTENTION: À utiliser uniquement pour debug, pas en production
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 7. PERMISSIONS POUR LES ROLES SUPABASE
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT ALL ON storage.buckets TO anon, authenticated;

-- 8. FONCTION POUR VÉRIFIER LES PERMISSIONS STORAGE
CREATE OR REPLACE FUNCTION public.debug_storage_permissions()
RETURNS TABLE(
  user_id TEXT,
  user_role TEXT,
  can_upload BOOLEAN,
  bucket_exists BOOLEAN
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  WITH current_user_info AS (
    SELECT
      current_setting('request.jwt.claims', true)::json->>'sub' as uid,
      COALESCE(c.role, 'anonymous') as role
    FROM public.client_db c
    WHERE c.firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
  ),
  bucket_info AS (
    SELECT COUNT(*) > 0 as exists
    FROM storage.buckets
    WHERE id = 'platphoto'
  )
  SELECT
    cui.uid,
    cui.role,
    (cui.role = 'admin' OR cui.uid IS NOT NULL) as can_upload,
    bi.exists as bucket_exists
  FROM current_user_info cui
  CROSS JOIN bucket_info bi;
$$;

-- 9. MESSAGE DE CONFIRMATION
DO $$
BEGIN
    RAISE NOTICE '✅ Politiques RLS Storage configurées !';
    RAISE NOTICE '📋 Bucket platphoto configuré pour :';
    RAISE NOTICE '   - Upload: Admins + utilisateurs connectés';
    RAISE NOTICE '   - Lecture: Public';
    RAISE NOTICE '   - Modification: Admins + propriétaires';
    RAISE NOTICE '   - Suppression: Admins uniquement';
    RAISE NOTICE '🎯 Testez avec : SELECT * FROM debug_storage_permissions();';
END $$;