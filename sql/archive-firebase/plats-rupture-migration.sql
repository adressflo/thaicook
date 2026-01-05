-- Migration pour gestion ruptures de stock par date
-- Permet de marquer un plat indisponible pour des dates spécifiques

-- ============================================
-- ÉTAPE 1: Créer la table des ruptures par date
-- ============================================

CREATE TABLE IF NOT EXISTS public.plats_rupture_dates (
  id SERIAL PRIMARY KEY,
  plat_id INTEGER NOT NULL REFERENCES public.plats_db(idplats) ON DELETE CASCADE,
  date_rupture DATE NOT NULL,
  raison_rupture TEXT DEFAULT 'Rupture de stock',
  type_rupture TEXT DEFAULT 'stock' CHECK (type_rupture IN ('stock', 'conges', 'maintenance', 'autre')),
  notes_rupture TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT, -- Firebase UID de l'admin qui a créé
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_plats_rupture_dates_plat_date 
ON public.plats_rupture_dates(plat_id, date_rupture);

CREATE INDEX IF NOT EXISTS idx_plats_rupture_dates_date_active 
ON public.plats_rupture_dates(date_rupture, is_active);

-- ============================================
-- ÉTAPE 2: Fonction pour vérifier disponibilité par date
-- ============================================

CREATE OR REPLACE FUNCTION public.is_plat_available_on_date(
  p_plat_id INTEGER,
  p_date DATE
) RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  WITH jour_semaine AS (
    SELECT CASE EXTRACT(DOW FROM p_date)
      WHEN 1 THEN 'lundi_dispo'
      WHEN 2 THEN 'mardi_dispo' 
      WHEN 3 THEN 'mercredi_dispo'
      WHEN 4 THEN 'jeudi_dispo'
      WHEN 5 THEN 'vendredi_dispo'
      WHEN 6 THEN 'samedi_dispo'
      WHEN 0 THEN 'dimanche_dispo'
    END as jour_column
  ),
  disponibilite_jour AS (
    SELECT 
      CASE js.jour_column
        WHEN 'lundi_dispo' THEN p.lundi_dispo
        WHEN 'mardi_dispo' THEN p.mardi_dispo
        WHEN 'mercredi_dispo' THEN p.mercredi_dispo
        WHEN 'jeudi_dispo' THEN p.jeudi_dispo
        WHEN 'vendredi_dispo' THEN p.vendredi_dispo
        WHEN 'samedi_dispo' THEN p.samedi_dispo
        WHEN 'dimanche_dispo' THEN p.dimanche_dispo
      END as dispo_jour
    FROM public.plats_db p
    CROSS JOIN jour_semaine js
    WHERE p.idplats = p_plat_id
  ),
  rupture_date AS (
    SELECT COUNT(*) as ruptures_count
    FROM public.plats_rupture_dates prd
    WHERE prd.plat_id = p_plat_id 
    AND prd.date_rupture = p_date 
    AND prd.is_active = true
  )
  SELECT 
    CASE 
      WHEN dj.dispo_jour = 'oui' AND rd.ruptures_count = 0 THEN true
      ELSE false
    END
  FROM disponibilite_jour dj
  CROSS JOIN rupture_date rd;
$$;

-- ============================================
-- ÉTAPE 3: Vue pour disponibilité plats avec ruptures
-- ============================================

CREATE OR REPLACE VIEW public.plats_disponibilite_view AS
SELECT 
  p.*,
  -- Compter les jours de disponibilité standard
  (CASE WHEN p.lundi_dispo = 'oui' THEN 1 ELSE 0 END +
   CASE WHEN p.mardi_dispo = 'oui' THEN 1 ELSE 0 END +
   CASE WHEN p.mercredi_dispo = 'oui' THEN 1 ELSE 0 END +
   CASE WHEN p.jeudi_dispo = 'oui' THEN 1 ELSE 0 END +
   CASE WHEN p.vendredi_dispo = 'oui' THEN 1 ELSE 0 END +
   CASE WHEN p.samedi_dispo = 'oui' THEN 1 ELSE 0 END +
   CASE WHEN p.dimanche_dispo = 'oui' THEN 1 ELSE 0 END) as jours_disponibles_standard,
  
  -- Compter les ruptures actives futures
  COALESCE(r.ruptures_futures, 0) as ruptures_futures,
  
  -- Statut global de disponibilité
  CASE 
    WHEN p.est_epuise = true THEN 'epuise'
    WHEN (CASE WHEN p.lundi_dispo = 'oui' THEN 1 ELSE 0 END +
          CASE WHEN p.mardi_dispo = 'oui' THEN 1 ELSE 0 END +
          CASE WHEN p.mercredi_dispo = 'oui' THEN 1 ELSE 0 END +
          CASE WHEN p.jeudi_dispo = 'oui' THEN 1 ELSE 0 END +
          CASE WHEN p.vendredi_dispo = 'oui' THEN 1 ELSE 0 END +
          CASE WHEN p.samedi_dispo = 'oui' THEN 1 ELSE 0 END +
          CASE WHEN p.dimanche_dispo = 'oui' THEN 1 ELSE 0 END) = 0 THEN 'indisponible'
    ELSE 'disponible'
  END as statut_disponibilite
  
FROM public.plats_db p
LEFT JOIN (
  SELECT 
    plat_id,
    COUNT(*) as ruptures_futures
  FROM public.plats_rupture_dates 
  WHERE date_rupture >= CURRENT_DATE 
  AND is_active = true
  GROUP BY plat_id
) r ON p.idplats = r.plat_id;

-- ============================================
-- ÉTAPE 4: Politiques RLS pour sécurité
-- ============================================

-- Activer RLS sur la nouvelle table
ALTER TABLE public.plats_rupture_dates ENABLE ROW LEVEL SECURITY;

-- Lecture : Tous peuvent voir les ruptures actives
CREATE POLICY "plats_rupture_read_all" ON public.plats_rupture_dates
  FOR SELECT USING (is_active = true);

-- Modification : Admins seulement
CREATE POLICY "plats_rupture_admin_all" ON public.plats_rupture_dates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.client_db 
      WHERE firebase_uid = current_setting('request.jwt.claims')::json->>'sub'
      AND role = 'admin'
    )
  );

-- ============================================
-- ÉTAPE 5: Permissions et privilèges
-- ============================================

-- Donner accès aux rôles Supabase
GRANT ALL ON public.plats_rupture_dates TO anon, authenticated;
GRANT ALL ON SEQUENCE plats_rupture_dates_id_seq TO anon, authenticated;

-- Vue accessible en lecture
GRANT SELECT ON public.plats_disponibilite_view TO anon, authenticated;

-- ============================================
-- ÉTAPE 6: Données de test (optionnel)
-- ============================================

-- Insérer quelques ruptures de test
-- INSERT INTO public.plats_rupture_dates (plat_id, date_rupture, raison_rupture, type_rupture)
-- VALUES 
-- (1, '2025-01-15', 'Rupture stock tomates', 'stock'),
-- (2, '2025-01-20', 'Congés du chef', 'conges'),
-- (1, '2025-01-25', 'Maintenance équipement', 'maintenance');

-- ============================================
-- ÉTAPE 7: Trigger pour updated_at automatique
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plats_rupture_dates_updated_at
    BEFORE UPDATE ON public.plats_rupture_dates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration plats-rupture terminée avec succès !';
    RAISE NOTICE '📋 Fonctionnalités ajoutées :';
    RAISE NOTICE '   - Table plats_rupture_dates pour ruptures par date';
    RAISE NOTICE '   - Fonction is_plat_available_on_date()';
    RAISE NOTICE '   - Vue plats_disponibilite_view avec calculs';
    RAISE NOTICE '   - Politiques RLS sécurisées';
    RAISE NOTICE '   - Index optimisés pour performance';
    RAISE NOTICE '🎯 Prêt pour gestion fine des ruptures de stock !';
END $$;