const { chromium } = require('playwright');

async function captureAdminPlatsPage() {
  console.log('🚀 Lancement de Playwright pour capturer l\'interface admin des plats...');
  
  // Lancer le navigateur
  const browser = await chromium.launch({ 
    headless: false, // Mode visible pour debug
    slowMo: 1000 // Ralentir pour voir les actions
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, // Full HD pour capturer tous les détails
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📱 Navigation vers http://localhost:3000/admin/plats...');
    
    // Naviguer vers la page admin des plats
    await page.goto('http://localhost:3000/admin/plats', {
      waitUntil: 'networkidle', // Attendre que toutes les requêtes soient terminées
      timeout: 30000
    });
    
    console.log('⏳ Attente du chargement complet de l\'interface...');
    
    // Attendre que les éléments principaux soient chargés
    await page.waitForSelector('[data-testid="admin-plats-container"]', { timeout: 10000 }).catch(() => {
      console.log('⚠️ Sélecteur admin-plats-container non trouvé, continuons...');
    });
    
    // Attendre que les cartes de plats soient chargées
    await page.waitForSelector('.thai-card', { timeout: 10000 }).catch(() => {
      console.log('⚠️ Sélecteur thai-card non trouvé, continuons...');
    });
    
    // Attendre que les statistiques soient chargées
    await page.waitForSelector('.stats-container', { timeout: 10000 }).catch(() => {
      console.log('⚠️ Sélecteur stats-container non trouvé, continuons...');
    });
    
    // Attendre un peu plus pour s'assurer que tout est rendu
    await page.waitForTimeout(3000);
    
    console.log('📸 Capture de l\'écran en cours...');
    
    // Prendre une capture d'écran de la page complète
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `admin-plats-thai-design-${timestamp}.png`;
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: true, // Capturer toute la page, pas seulement la vue
      quality: 100,
      type: 'png'
    });
    
    console.log(`✅ Capture d'écran sauvegardée : ${screenshotPath}`);
    
    // Capturer aussi une version centrée sur le contenu principal
    const contentScreenshotPath = `admin-plats-content-${timestamp}.png`;
    await page.screenshot({
      path: contentScreenshotPath,
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
      quality: 100,
      type: 'png'
    });
    
    console.log(`✅ Capture du contenu principal sauvegardée : ${contentScreenshotPath}`);
    
    // Analyser les éléments visuels présents
    console.log('🔍 Analyse des éléments visuels...');
    
    const thaiElements = await page.evaluate(() => {
      const elements = {};
      
      // Chercher les couleurs Thai
      const thaiOrangeElements = document.querySelectorAll('*[class*="thai-orange"], *[style*="thai-orange"]');
      const thaiGreenElements = document.querySelectorAll('*[class*="thai-green"], *[style*="thai-green"]');
      const thaiGoldElements = document.querySelectorAll('*[class*="thai-gold"], *[style*="thai-gold"]');
      
      elements.thaiOrange = thaiOrangeElements.length;
      elements.thaiGreen = thaiGreenElements.length;
      elements.thaiGold = thaiGoldElements.length;
      
      // Chercher les cartes et composants
      elements.cards = document.querySelectorAll('.thai-card, [class*="card"]').length;
      elements.buttons = document.querySelectorAll('button').length;
      elements.stats = document.querySelectorAll('[class*="stats"], [class*="metric"]').length;
      
      return elements;
    });
    
    console.log('📊 Éléments détectés:', thaiElements);
    
    return {
      screenshots: [screenshotPath, contentScreenshotPath],
      elements: thaiElements
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la capture:', error.message);
    
    // Prendre une capture d'écran d'urgence même en cas d'erreur
    try {
      const errorScreenshotPath = `admin-plats-error-${Date.now()}.png`;
      await page.screenshot({
        path: errorScreenshotPath,
        fullPage: true
      });
      console.log(`📸 Capture d'erreur sauvegardée : ${errorScreenshotPath}`);
      return { error: error.message, screenshot: errorScreenshotPath };
    } catch (screenshotError) {
      console.error('❌ Impossible de prendre une capture d\'erreur:', screenshotError.message);
      return { error: error.message };
    }
    
  } finally {
    await browser.close();
    console.log('🔚 Navigateur fermé');
  }
}

// Exécuter la capture
captureAdminPlatsPage()
  .then(result => {
    console.log('🎉 Capture terminée avec succès!');
    console.log('Résultat:', result);
  })
  .catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });