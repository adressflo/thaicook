-- Script SQL pour ajouter des médias de test au Hero Carousel
-- À exécuter dans Supabase SQL Editor ou via psql

-- Nettoyer les médias existants
DELETE FROM hero_media;

-- Insérer 3 médias de test
INSERT INTO hero_media (id, type, url, titre, description, ordre, active, created_at, updated_at)
VALUES
  (
    'hero-1',
    'image',
    '/pourcommander.svg',
    'Découvrez Notre Menu',
    'Cuisine Thaïlandaise Authentique',
    1,
    true,
    NOW(),
    NOW()
  ),
  (
    'hero-2',
    'image',
    '/pourvosevenement.svg',
    'Pour Vos Événements',
    'Organisez des moments inoubliables',
    2,
    true,
    NOW(),
    NOW()
  ),
  (
    'hero-3',
    'image',
    '/nous trouver.svg',
    'Nous Trouver',
    'Venez nous rendre visite à Marigny-Marmande',
    3,
    true,
    NOW(),
    NOW()
  );

-- Vérifier les médias créés
SELECT id, type, titre, url, ordre, active FROM hero_media ORDER BY ordre;
