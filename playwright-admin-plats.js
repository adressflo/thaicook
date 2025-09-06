const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto('http://localhost:3000/profil');

  // Fill in the email and password
  await page.fill('input[type="email"]', 'fouquet_florian@hotmail.com');
  await page.fill('input[type="password"]', 'sylliam');

  // Click the login button
  const loginButtonSelector = 'button:has-text("Se connecter")';
  await page.waitForSelector(loginButtonSelector);
  await page.click(loginButtonSelector);

  // Wait for a moment to ensure authentication state is updated
  await page.waitForTimeout(2000);

  // Navigate to the admin plats page
  await page.goto('http://localhost:3000/admin/plats');

  // Wait for the main content to be visible
  await page.waitForSelector('h3:has-text("Gestion des Plats")');

  // Take a screenshot
  await page.screenshot({ path: 'admin-plats-screenshot.png' });

  await browser.close();
})();