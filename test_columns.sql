-- Vérifier que la colonne epingle existe dans commande_db
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'commande_db' AND column_name = 'epingle';

-- Vérifier que la colonne est_offert existe dans details_commande_db
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'details_commande_db' AND column_name = 'est_offert';
