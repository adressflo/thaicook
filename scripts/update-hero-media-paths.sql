-- Script SQL pour mettre à jour les chemins des médias hero
-- À exécuter dans l'éditeur SQL de Supabase

-- Mise à jour des vidéos hero
UPDATE hero_media
SET url = REPLACE(url, '/videohero/', '/media/hero/videos/')
WHERE url LIKE '/videohero/%';

-- Mise à jour des GIFs
UPDATE hero_media
SET url = REPLACE(url, '/videogif/', '/media/animations/ui/')
WHERE url LIKE '/videogif/%';

-- Mise à jour des SVG vers illustrations
UPDATE hero_media
SET url = '/illustrations' || url
WHERE url IN (
  '/pourcommander.svg',
  '/installapp.svg',
  '/pourvosevenement.svg',
  '/nous trouver.svg',
  '/suivihistorique.svg',
  '/apropos.svg',
  '/smartphone.svg'
);

-- Mise à jour des avatars
UPDATE hero_media
SET url = REPLACE(url, '/image avatar/', '/media/avatars/')
WHERE url LIKE '/image avatar/%';

-- Vérifier les mises à jour
SELECT id, type, url, titre, ordre, active
FROM hero_media
ORDER BY ordre;
