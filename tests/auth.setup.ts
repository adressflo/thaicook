/**
 * Playwright Auth Setup - Better Auth
 *
 * Ce fichier configure l'authentification pour les tests E2E.
 * Il crée 2 fichiers de storage state (client et admin) réutilisables.
 *
 * Usage dans tests:
 * ```typescript
 * test.use({ storageState: 'tests/.auth/client.json' });
 * ```
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authDir = path.join(__dirname, '.auth');

// Comptes de test (à créer manuellement dans la DB ou via signup)
const CLIENT_ACCOUNT = {
  email: 'client-test@example.com',
  password: 'TestClient123!',
};

const ADMIN_ACCOUNT = {
  email: 'admin-test@example.com',
  password: 'TestAdmin123!',
};

/**
 * Setup Client Authentication
 * Crée un fichier storage state pour le compte client
 */
setup('authenticate as client', async ({ page }) => {
  console.log('🔐 [CLIENT] Login en cours...');

  // Naviguer vers la page de login
  await page.goto('http://localhost:3000/auth/login');
  await page.waitForLoadState('networkidle');

  // Remplir le formulaire de connexion
  await page.fill('#email', CLIENT_ACCOUNT.email);
  await page.fill('#password', CLIENT_ACCOUNT.password);

  // Soumettre le formulaire
  await page.click('button[type="submit"]');

  // Attendre un peu pour laisser le temps à la requête
  await page.waitForTimeout(2000);

  // Vérifier l'URL actuelle et les cookies
  const currentUrl = page.url();
  const cookies = await page.context().cookies();
  console.log(`   URL actuelle: ${currentUrl}`);
  console.log(`   Cookies:`, cookies.map(c => c.name).join(', '));

  // Chercher un message d'erreur
  const errorMsg = await page.locator('[role="alert"], .text-red-600, .text-red-500').first().textContent().catch(() => null);
  if (errorMsg) {
    console.log(`   ⚠️  Message d'erreur détecté: ${errorMsg}`);
  }

  // Vérifier que la session est active via les cookies du context (httpOnly cookies)
  const sessionCookie = cookies.find(c => c.name === 'better-auth.session_token');
  const isAuthenticated = !!sessionCookie;

  if (!isAuthenticated) {
    console.log(`   ❌ Cookie de session non trouvé`);
    console.log(`   📸 Capturing screenshot for debugging...`);
    await page.screenshot({ path: `test-results/auth-client-failed-${Date.now()}.png` });
  } else {
    console.log(`   ✅ Cookie de session trouvé`);
  }

  expect(isAuthenticated).toBe(true);

  console.log('✅ [CLIENT] Authentifié avec succès');

  // Sauvegarder le storage state (cookies + localStorage)
  await page.context().storageState({ path: path.join(authDir, 'client.json') });
});

/**
 * Setup Admin Authentication
 * Crée un fichier storage state pour le compte admin
 */
setup('authenticate as admin', async ({ page }) => {
  console.log('🔐 [ADMIN] Login en cours...');

  // Naviguer vers la page de login
  await page.goto('http://localhost:3000/auth/login');
  await page.waitForLoadState('networkidle');

  // Remplir le formulaire de connexion
  await page.fill('#email', ADMIN_ACCOUNT.email);
  await page.fill('#password', ADMIN_ACCOUNT.password);

  // Soumettre le formulaire
  await page.click('button[type="submit"]');

  // Attendre un peu pour laisser le temps à la requête
  await page.waitForTimeout(2000);

  // Vérifier l'URL actuelle et les cookies
  const currentUrl = page.url();
  const cookies = await page.context().cookies();
  console.log(`   URL actuelle: ${currentUrl}`);
  console.log(`   Cookies:`, cookies.map(c => c.name).join(', '));

  // Chercher un message d'erreur
  const errorMsg = await page.locator('[role="alert"], .text-red-600, .text-red-500').first().textContent().catch(() => null);
  if (errorMsg) {
    console.log(`   ⚠️  Message d'erreur détecté: ${errorMsg}`);
  }

  // Vérifier que la session est active via les cookies du context (httpOnly cookies)
  const sessionCookie = cookies.find(c => c.name === 'better-auth.session_token');
  const isAuthenticated = !!sessionCookie;

  if (!isAuthenticated) {
    console.log(`   ❌ Cookie de session non trouvé`);
    console.log(`   📸 Capturing screenshot for debugging...`);
    await page.screenshot({ path: `test-results/auth-admin-failed-${Date.now()}.png` });
  } else {
    console.log(`   ✅ Cookie de session trouvé`);
  }

  expect(isAuthenticated).toBe(true);

  // Vérifier le rôle admin (optionnel, dépend de votre implémentation)
  const isAdmin = await page.evaluate(async () => {
    try {
      // Tenter d'accéder à une page admin
      const response = await fetch('/api/auth/get-session');
      const session = await response.json();
      return session?.user?.role === 'admin';
    } catch {
      return false;
    }
  });

  console.log(`✅ [ADMIN] Authentifié (role admin: ${isAdmin})`);

  // Sauvegarder le storage state
  await page.context().storageState({ path: path.join(authDir, 'admin.json') });
});
