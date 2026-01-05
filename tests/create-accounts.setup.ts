/**
 * Playwright Setup - Création des comptes de test
 *
 * Ce script utilise l'interface de signup pour créer les comptes.
 * À exécuter une seule fois avant les tests d'authentification.
 *
 * Usage: npx playwright test tests/create-accounts.setup.ts
 */

import { test as setup, expect } from '@playwright/test';

const TEST_ACCOUNTS = [
  {
    email: 'client-test@example.com',
    password: 'TestClient123!',
    nom: 'Test',
    prenom: 'Client',
    telephone: '0612345678',
    role: 'client',
  },
  {
    email: 'admin-test@example.com',
    password: 'TestAdmin123!',
    nom: 'Test',
    prenom: 'Admin',
    telephone: '0687654321',
    role: 'admin',
  },
];

setup.describe('Création des comptes de test', () => {
  for (const account of TEST_ACCOUNTS) {
    setup(`Créer compte ${account.role}`, async ({ page }) => {
      console.log(`🔐 [${account.role.toUpperCase()}] Création du compte ${account.email}...`);

      // Naviguer vers la page de signup
      await page.goto('http://localhost:3001/auth/signup');
      await page.waitForLoadState('networkidle');

      // Remplir le formulaire obligatoire
      await page.fill('#email', account.email);
      await page.fill('#password', account.password);
      await page.fill('#confirmPassword', account.password);
      await page.fill('#nom', account.nom);
      await page.fill('#prenom', account.prenom);
      await page.fill('#numero_de_telephone', account.telephone);

      // La newsletter est "Oui, j'accepte" par défaut - on laisse tel quel

      // Soumettre le formulaire
      await page.click('button[type="submit"]');

      // Attendre soit une redirection, soit un message d'erreur
      try {
        // Si succès : redirection vers /commander ou autre page
        await page.waitForURL(/\/(commander|historique|profil)/, { timeout: 10000 });
        console.log(`✅ [${account.role.toUpperCase()}] Compte créé avec succès`);
      } catch (error) {
        // Si échec, vérifier s'il y a un message d'erreur "already exists"
        const errorText = await page.locator('text=/already exists|existe déjà/i').textContent().catch(() => null);
        if (errorText) {
          console.log(`⚠️  [${account.role.toUpperCase()}] Le compte ${account.email} existe déjà`);
        } else {
          // Autre erreur
          const pageContent = await page.content();
          console.error(`❌ [${account.role.toUpperCase()}] Erreur lors de la création:`);
          console.error(`   URL: ${page.url()}`);
          throw error;
        }
      }
    });
  }
});

setup('Résumé de la création', async ({}) => {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Comptes de test créés/vérifiés:');
  console.log('='.repeat(60));
  console.log('✅ client-test@example.com (password: TestClient123!)');
  console.log('✅ admin-test@example.com (password: TestAdmin123!)');
  console.log('\n⚠️  IMPORTANT: Mettre à jour les rôles dans la DB:');
  console.log('   - client-test@example.com → role: "client"');
  console.log('   - admin-test@example.com → role: "admin"');
  console.log('   Table: client_db (colonne: role)');
  console.log('\n📝 Prochaine étape:');
  console.log('   npx playwright test tests/auth.setup.ts --project=setup');
  console.log('='.repeat(60) + '\n');
});
