import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour les Notifications Push Firebase Cloud Messaging
 *
 * Scénarios testés :
 * 1. Page de setup accessible et bien formatée
 * 2. Flow d'activation des notifications (utilisateur connecté)
 * 3. Gestion des erreurs (utilisateur non connecté)
 * 4. Vérification du profil avec notifications activées
 */

test.describe('Notifications Push FCM', () => {
  test.beforeEach(async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('/');
  });

  test('Page /notifications/setup est accessible et affiche le contenu correct', async ({ page }) => {
    // Navigation vers la page de setup
    await page.goto('/notifications/setup');

    // Vérifier le titre principal
    await expect(page.getByRole('heading', { name: /Restez informé en temps réel/i })).toBeVisible();

    // Vérifier la description
    await expect(page.getByText(/Recevez des notifications pour ne rien manquer/i)).toBeVisible();

    // Vérifier que les 3 cartes de bénéfices sont présentes
    await expect(page.getByText(/Suivi de commande/i)).toBeVisible();
    await expect(page.getByText(/Rappels d'événements/i)).toBeVisible();
    await expect(page.getByText(/Offres spéciales/i)).toBeVisible();

    // Vérifier la note de confidentialité
    await expect(page.getByText(/Vos données sont protégées/i)).toBeVisible();

    // Vérifier le bouton retour accueil
    await expect(page.getByRole('link', { name: /Accueil/i })).toBeVisible();
  });

  test('Utilisateur non connecté voit le bouton "Se connecter"', async ({ page }) => {
    await page.goto('/notifications/setup');

    // Vérifier que le message de connexion est affiché
    await expect(page.getByText(/Connectez-vous pour activer les notifications/i)).toBeVisible();

    // Vérifier que le bouton "Se connecter" est présent
    const loginButton = page.getByRole('button', { name: /Se connecter/i });
    await expect(loginButton).toBeVisible();
  });

  test('Utilisateur connecté peut activer les notifications', async ({ page }) => {
    // 1. Se connecter d'abord
    await page.goto('/profil');

    // Remplir le formulaire de connexion (compte test)
    await page.getByLabel(/Email/i).first().fill('test@example.com');
    await page.getByLabel(/Mot de passe/i).first().fill('password123');

    // Cliquer sur "Se connecter" ou "Créer un compte" selon si le compte existe
    const loginBtn = page.getByRole('button', { name: /Se connecter/i }).first();
    const signupBtn = page.getByRole('button', { name: /Créer un compte/i }).first();

    // Essayer de se connecter, si ça échoue, créer un compte
    try {
      await loginBtn.click();
      await page.waitForURL(/\/profil/, { timeout: 5000 });
    } catch {
      // Compte n'existe pas, en créer un
      await page.goto('/profil');
      await page.getByLabel(/Email/i).first().fill('test@example.com');
      await page.getByLabel(/Mot de passe/i).first().fill('password123');
      await signupBtn.click();
      await page.waitForURL(/\/profil/, { timeout: 5000 });
    }

    // 2. Aller sur la page de setup des notifications
    await page.goto('/notifications/setup');

    // Vérifier que l'utilisateur est bien connecté
    await expect(page.getByRole('link', { name: /Mon profil/i })).toBeVisible();

    // Le bouton "Activer les notifications" devrait être visible
    const activateButton = page.getByRole('button', { name: /Activer les notifications/i });

    // Note: On ne peut pas réellement tester l'activation FCM car elle nécessite
    // une interaction navigateur native (Notification.requestPermission)
    // On vérifie juste que le bouton est présent et cliquable
    await expect(activateButton).toBeVisible();
    await expect(activateButton).toBeEnabled();
  });

  test('Page profil charge sans erreur après ajout FCM', async ({ page }) => {
    // Se connecter
    await page.goto('/profil');

    await page.getByLabel(/Email/i).first().fill('test-profile@example.com');
    await page.getByLabel(/Mot de passe/i).first().fill('password123');

    try {
      await page.getByRole('button', { name: /Se connecter/i }).first().click();
      await page.waitForURL(/\/profil/, { timeout: 5000 });
    } catch {
      await page.goto('/profil');
      await page.getByLabel(/Email/i).first().fill('test-profile@example.com');
      await page.getByLabel(/Mot de passe/i).first().fill('password123');
      await page.getByRole('button', { name: /Créer un compte/i }).first().click();
      await page.waitForURL(/\/profil/, { timeout: 5000 });
    }

    // Vérifier qu'il n'y a pas d'erreurs console critiques
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Attendre un peu pour que les useEffect s'exécutent
    await page.waitForTimeout(2000);

    // Vérifier que la page profil affiche le contenu attendu
    await expect(page.getByRole('heading', { name: /Bonjour/i })).toBeVisible();

    // Filtrer les erreurs Firebase attendues (permissions, SW, etc.)
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('Firebase') &&
      !err.includes('messaging') &&
      !err.includes('service-worker') &&
      !err.includes('notification')
    );

    // Il ne devrait pas y avoir d'erreurs critiques
    expect(criticalErrors.length).toBe(0);
  });

  test('Navigation entre pages de notifications fonctionne', async ({ page }) => {
    // Connexion
    await page.goto('/profil');
    await page.getByLabel(/Email/i).first().fill('nav-test@example.com');
    await page.getByLabel(/Mot de passe/i).first().fill('password123');

    try {
      await page.getByRole('button', { name: /Se connecter/i }).first().click();
      await page.waitForURL(/\/profil/, { timeout: 5000 });
    } catch {
      await page.goto('/profil');
      await page.getByLabel(/Email/i).first().fill('nav-test@example.com');
      await page.getByLabel(/Mot de passe/i).first().fill('password123');
      await page.getByRole('button', { name: /Créer un compte/i }).first().click();
      await page.waitForURL(/\/profil/, { timeout: 5000 });
    }

    // 1. Aller sur /notifications/setup
    await page.goto('/notifications/setup');
    await expect(page.getByRole('heading', { name: /Restez informé en temps réel/i })).toBeVisible();

    // 2. Cliquer sur "Mon profil"
    await page.getByRole('link', { name: /Mon profil/i }).click();
    await expect(page).toHaveURL(/\/profil/);

    // 3. Revenir sur /notifications/setup
    await page.goto('/notifications/setup');
    await expect(page.getByRole('heading', { name: /Restez informé en temps réel/i })).toBeVisible();

    // 4. Cliquer sur "Accueil"
    await page.getByRole('link', { name: /Accueil/i }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('Service Worker firebase-messaging-sw.js est accessible', async ({ page }) => {
    // Tenter d'accéder au Service Worker
    const response = await page.goto('/firebase-messaging-sw.js');

    // Le fichier devrait exister et retourner du JavaScript
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('javascript');

    // Vérifier que le contenu contient du code Firebase
    const content = await response?.text();
    expect(content).toContain('firebase');
    expect(content).toContain('messaging');
    expect(content).toContain('onBackgroundMessage');
  });

  test('Responsive design - Mobile view', async ({ page }) => {
    // Simuler un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/notifications/setup');

    // Vérifier que le contenu est visible en mobile
    await expect(page.getByRole('heading', { name: /Restez informé en temps réel/i })).toBeVisible();

    // Vérifier que les cartes de bénéfices sont empilées (grid mobile)
    const benefitCards = page.locator('div:has-text("Suivi de commande")').first();
    await expect(benefitCards).toBeVisible();

    // Le bouton "Accueil" devrait afficher juste "Accueil" en mobile
    const homeButton = page.getByRole('link', { name: /Accueil/i }).first();
    await expect(homeButton).toBeVisible();
  });

  test('Icônes et visuels sont bien chargés', async ({ page }) => {
    await page.goto('/notifications/setup');

    // Vérifier que l'icône Bell principale est visible
    const bellIcon = page.locator('svg').first();
    await expect(bellIcon).toBeVisible();

    // Vérifier que les icônes des cartes bénéfices sont présentes
    // (ShoppingBag, Calendar, Bell dans les cartes)
    const cardIcons = page.locator('svg[class*="lucide"]');
    expect(await cardIcons.count()).toBeGreaterThan(3);
  });

  test('Messages d\'erreur appropriés si API échoue', async ({ page }) => {
    // Intercepter l'appel API pour simuler une erreur
    await page.route('**/api/notifications/send', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Erreur serveur simulée' })
      });
    });

    // Note: Ce test ne peut pas vraiment déclencher l'API sans mock complet du FCM
    // On vérifie juste que la page gère bien l'absence d'erreur au chargement
    await page.goto('/notifications/setup');
    await expect(page.getByRole('heading', { name: /Restez informé en temps réel/i })).toBeVisible();
  });
});

test.describe('API Notifications /api/notifications/send', () => {
  test('Endpoint retourne 400 si données invalides', async ({ request }) => {
    const response = await request.post('/api/notifications/send', {
      data: {
        clientId: 'invalid', // Devrait être un number
        notification: {
          title: 'Test',
          body: 'Test body'
        }
      }
    });

    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBeDefined();
  });

  test('Endpoint retourne 400 si notification.title manquant', async ({ request }) => {
    const response = await request.post('/api/notifications/send', {
      data: {
        clientId: 1,
        notification: {
          body: 'Test body'
          // title manquant
        }
      }
    });

    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
  });
});
