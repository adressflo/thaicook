# Instructions - Création Manuelle des Comptes de Test Playwright

## Comptes à créer

### 1. Compte Client
- **Email**: `client-test@example.com`
- **Password**: `TestClient123!`
- **Nom**: Test
- **Prénom**: Client
- **Téléphone**: 0612345678

### 2. Compte Admin
- **Email**: `admin-test@example.com`
- **Password**: `TestAdmin123!`
- **Nom**: Test
- **Prénom**: Admin
- **Téléphone**: 0687654321

## Étapes

1. Ouvrir http://localhost:3001/auth/signup

2. Pour chaque compte, remplir le formulaire avec les infos ci-dessus

3. Soumettre le formulaire

4. Après création, mettre à jour les rôles dans Supabase:

```sql
-- Compte client
UPDATE client_db
SET role = 'client'
WHERE email = 'client-test@example.com';

-- Compte admin
UPDATE client_db
SET role = 'admin'
WHERE email = 'admin-test@example.com';
```

5. Exécuter les tests d'authentification:
```bash
npx playwright test tests/auth.setup.ts --project=setup
```

6. Vérifier que les fichiers ont été créés:
- `tests/.auth/client.json`
- `tests/.auth/admin.json`

## Prochaine étape

Une fois les comptes créés et les tests setup passés, vous pourrez exécuter les tests authentifiés:
- `npx playwright test --project=chromium-client`
- `npx playwright test --project=chromium-admin`
