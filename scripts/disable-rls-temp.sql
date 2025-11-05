-- ⚠️ TEMPORAIRE : Désactivation RLS pour tests
-- À RÉACTIVER avant production !

-- Tables principales
ALTER TABLE commande_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE details_commande_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE plats_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE extras_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE evenement_db DISABLE ROW LEVEL SECURITY;

-- Better Auth tables
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Verification" DISABLE ROW LEVEL SECURITY;

-- Confirmation
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'commande_db',
    'details_commande_db',
    'client_db',
    'plats_db',
    'extras_db',
    'evenement_db',
    'User',
    'Session',
    'Account',
    'Verification'
  )
ORDER BY tablename;
