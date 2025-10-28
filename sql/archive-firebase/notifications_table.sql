-- Table des notifications pour ChanthanaThaiCook
-- À exécuter dans Supabase SQL Editor plus tard

-- Créer la table notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- Firebase UID
    type VARCHAR(20) NOT NULL CHECK (type IN ('success', 'warning', 'info', 'error')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('order', 'event', 'system', 'promotion', 'cart')),
    action_url VARCHAR(500),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);

-- Fonction pour mettre à jour automatically updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politique RLS: Les utilisateurs peuvent seulement voir leurs propres notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Politique RLS: Les utilisateurs peuvent mettre à jour leurs propres notifications
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Politique RLS: Les utilisateurs peuvent supprimer leurs propres notifications
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Politique RLS: Seul le système peut insérer des notifications (via service_role ou fonctions)
CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Fonction pour créer une notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id VARCHAR(255),
    p_type VARCHAR(20),
    p_title VARCHAR(255),
    p_message TEXT,
    p_category VARCHAR(20),
    p_action_url VARCHAR(500) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, message, category, action_url)
    VALUES (p_user_id, p_type, p_title, p_message, p_category, p_action_url)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour marquer toutes les notifications d'un utilisateur comme lues
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id VARCHAR(255))
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE notifications 
    SET read = TRUE, updated_at = NOW()
    WHERE user_id = p_user_id AND read = FALSE;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les anciennes notifications (garder les 100 plus récentes par utilisateur)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    DELETE FROM notifications 
    WHERE id IN (
        SELECT id FROM (
            SELECT id, 
                   ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
            FROM notifications
        ) ranked 
        WHERE rn > 100
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Exemples de notifications pour tester
-- INSERT INTO notifications (user_id, type, title, message, category, action_url) VALUES
-- ('firebase_user_id_1', 'info', 'Bienvenue !', 'Bienvenue chez ChanthanaThaiCook !', 'system', '/commander'),
-- ('firebase_user_id_1', 'success', 'Commande confirmée', 'Votre commande #CMD001 a été confirmée', 'order', '/suivi'),
-- ('firebase_user_id_1', 'warning', 'Événement à confirmer', 'N''oubliez pas de confirmer votre événement', 'event', '/evenements');

-- Comment utiliser ces fonctions:
-- SELECT create_notification('user_id', 'success', 'Titre', 'Message', 'order', '/action-url');
-- SELECT mark_all_notifications_read('user_id');
-- SELECT cleanup_old_notifications();