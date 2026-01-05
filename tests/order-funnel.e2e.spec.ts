import { test, expect } from '@playwright/test';

test.describe('Application Navigation', () => {
  test('User can navigate through the main pages', async ({ page }) => {
    // Test de navigation simple pour vérifier que l'application fonctionne
    
    // 1. Navigate to the homepage
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /ChanthanaThaiCook/i })).toBeVisible();

    // 2. Test navigation to commander page
    await page.getByRole('button', { name: /commander/i }).click();
    await expect(page).toHaveURL('/commander');
    
    // 3. Test navigation to events page
    await page.goto('/');
    await page.getByRole('button', { name: /événements/i }).click();
    await expect(page).toHaveURL('/evenements');
    
    // 4. Test navigation to about page
    await page.goto('/');
    await page.getByRole('button', { name: /à propos/i }).click();
    await expect(page).toHaveURL('/a-propos');
    
    // 5. Test navigation to location page
    await page.goto('/');
    await page.getByRole('button', { name: /nous trouver/i }).click();
    await expect(page).toHaveURL('/nous-trouver');
    
    // 6. Test navigation to profile page
    await page.goto('/');
    await page.getByRole('button', { name: /mon profil/i }).click();
    await expect(page).toHaveURL('/profil');
  });
});
