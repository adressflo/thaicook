-- ============================================
-- POLITIQUES RLS PRODUCTION SUPABASE 2.58.0
-- ============================================
-- APPCHANTHANA - Architecture Hybride Firebase + Supabase
-- Date: 2025-01-28
-- Optimisé pour : Supabase 2.58.0 + Firebase Auth + Next.js 15

-- IMPORTANT: Ces politiques doivent être activées en production
-- Actuellement désactivées pour développement

-- ============================================
-- 1. ACTIVATION RLS SUR TOUTES LES TABLES
-- ============================================

-- Activer RLS sur la table clients
ALTER TABLE client_db ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur la table commandes
ALTER TABLE commande_db ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur la table détails commande
ALTER TABLE details_commande_db ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur la table événements
ALTER TABLE evenements_db ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur la table plats (admin seulement)
ALTER TABLE plats_db ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur la table extras (admin seulement)
ALTER TABLE extras_db ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLITIQUES POUR TABLE CLIENT_DB
-- ============================================

-- Politique de lecture: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "client_select_own_profile" ON client_db
    FOR SELECT
    USING (
        -- Firebase UID dans les headers ou en paramètre
        firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR firebase_uid = current_setting('app.firebase_uid', true)
    );

-- Politique d'insertion: Création automatique de profil avec Firebase UID
CREATE POLICY "client_insert_with_firebase_uid" ON client_db
    FOR INSERT
    WITH CHECK (
        firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR firebase_uid = current_setting('app.firebase_uid', true)
    );

-- Politique de mise à jour: Modification de son propre profil uniquement
CREATE POLICY "client_update_own_profile" ON client_db
    FOR UPDATE
    USING (
        firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR firebase_uid = current_setting('app.firebase_uid', true)
    )
    WITH CHECK (
        firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR firebase_uid = current_setting('app.firebase_uid', true)
    );

-- Politique admin: Les admins peuvent tout voir et modifier
CREATE POLICY "client_admin_full_access" ON client_db
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    );

-- ============================================
-- 3. POLITIQUES POUR TABLE COMMANDE_DB
-- ============================================

-- Politique de lecture: Les clients voient leurs commandes, les admins voient tout
CREATE POLICY "commande_select_policy" ON commande_db
    FOR SELECT
    USING (
        -- Client voit ses propres commandes
        client_firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR
        -- Admin voit toutes les commandes
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    );

-- Politique d'insertion: Les clients peuvent créer des commandes pour eux-mêmes
CREATE POLICY "commande_insert_policy" ON commande_db
    FOR INSERT
    WITH CHECK (
        client_firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR
        -- Admin peut créer des commandes pour n'importe qui
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    );

-- Politique de mise à jour: Admins peuvent modifier, clients peuvent modifier leurs commandes non confirmées
CREATE POLICY "commande_update_policy" ON commande_db
    FOR UPDATE
    USING (
        -- Admin peut modifier toutes les commandes
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
        OR
        -- Client peut modifier ses commandes non confirmées
        (
            client_firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND statut_commande = 'En attente de confirmation'
        )
    )
    WITH CHECK (
        -- Même logique pour WITH CHECK
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
        OR
        (
            client_firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND statut_commande = 'En attente de confirmation'
        )
    );

-- ============================================
-- 4. POLITIQUES POUR TABLE DETAILS_COMMANDE_DB
-- ============================================

-- Politique de lecture: Basée sur les permissions de la commande parent
CREATE POLICY "details_commande_select_policy" ON details_commande_db
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM commande_db
            WHERE commande_db.idcommande = details_commande_db.commande_r
            AND (
                commande_db.client_firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
                OR
                EXISTS (
                    SELECT 1 FROM client_db admin_client
                    WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
                    AND admin_client.role = 'admin'
                )
            )
        )
    );

-- Politique d'insertion: Basée sur les permissions de la commande parent
CREATE POLICY "details_commande_insert_policy" ON details_commande_db
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM commande_db
            WHERE commande_db.idcommande = details_commande_db.commande_r
            AND (
                commande_db.client_firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
                OR
                EXISTS (
                    SELECT 1 FROM client_db admin_client
                    WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
                    AND admin_client.role = 'admin'
                )
            )
        )
    );

-- ============================================
-- 5. POLITIQUES POUR TABLE EVENEMENTS_DB
-- ============================================

-- Politique de lecture: Événements publics visibles par tous, privés par le créateur et admins
CREATE POLICY "evenements_select_policy" ON evenements_db
    FOR SELECT
    USING (
        is_public = true
        OR contact_client_r = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    );

-- Politique d'insertion: Les utilisateurs connectés peuvent créer des événements
CREATE POLICY "evenements_insert_policy" ON evenements_db
    FOR INSERT
    WITH CHECK (
        contact_client_r = current_setting('request.headers', true)::json->>'x-firebase-uid'
    );

-- Politique de mise à jour: Créateur et admins peuvent modifier
CREATE POLICY "evenements_update_policy" ON evenements_db
    FOR UPDATE
    USING (
        contact_client_r = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    )
    WITH CHECK (
        contact_client_r = current_setting('request.headers', true)::json->>'x-firebase-uid'
        OR
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    );

-- ============================================
-- 6. POLITIQUES POUR TABLES ADMIN (PLATS_DB, EXTRAS_DB)
-- ============================================

-- Politique de lecture pour plats: Tous peuvent lire, seuls les admins peuvent modifier
CREATE POLICY "plats_select_public" ON plats_db
    FOR SELECT
    USING (true); -- Lecture publique des plats

CREATE POLICY "plats_admin_modify" ON plats_db
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    );

-- Politique similaire pour extras
CREATE POLICY "extras_select_public" ON extras_db
    FOR SELECT
    USING (true); -- Lecture publique des extras

CREATE POLICY "extras_admin_modify" ON extras_db
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM client_db admin_client
            WHERE admin_client.firebase_uid = current_setting('request.headers', true)::json->>'x-firebase-uid'
            AND admin_client.role = 'admin'
        )
    );

-- ============================================
-- 7. FONCTION UTILITAIRE POUR DÉFINIR FIREBASE UID
-- ============================================

-- Fonction pour définir le Firebase UID dans le contexte de session
CREATE OR REPLACE FUNCTION set_firebase_uid(uid text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM set_config('app.firebase_uid', uid, true);
END;
$$;

-- ============================================
-- 8. INSTRUCTIONS D'ACTIVATION POUR PRODUCTION
-- ============================================

/*
ÉTAPES POUR ACTIVER EN PRODUCTION :

1. Exécuter ce script SQL dans l'éditeur Supabase
2. Tester avec un utilisateur non-admin
3. Vérifier que les politiques bloquent les accès non autorisés
4. Mettre à jour getContextualSupabaseClient() pour inclure :

   headers: {
     'x-firebase-uid': firebaseUid,
     'x-user-context': 'authenticated'
   }

5. Tester toutes les fonctionnalités :
   - Connexion utilisateur
   - Création profil automatique
   - Création commande
   - Modification profil
   - Dashboard admin

6. Vérifier les logs Supabase pour les erreurs 42501 (RLS denied)

DÉSACTIVATION TEMPORAIRE POUR DEBUG :
Pour désactiver temporairement (développement uniquement) :

ALTER TABLE client_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE commande_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE details_commande_db DISABLE ROW LEVEL SECURITY;
ALTER TABLE evenements_db DISABLE ROW LEVEL SECURITY;

*/

-- ============================================
-- 9. TEST DE VALIDATION DES POLITIQUES
-- ============================================

-- Test 1: Vérifier qu'un utilisateur ne peut voir que ses propres données
-- Test 2: Vérifier qu'un admin peut voir toutes les données
-- Test 3: Vérifier que la création automatique de profil fonctionne
-- Test 4: Vérifier les permissions sur les commandes

/*
TESTS MANUELS RECOMMANDÉS :

1. Se connecter comme client normal
2. Essayer d'accéder aux données d'un autre client (doit échouer)
3. Se connecter comme admin
4. Vérifier l'accès complet aux données
5. Tester la création de nouvelles commandes
6. Vérifier les modifications de profil

*/