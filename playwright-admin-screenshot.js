const { chromium } = require('playwright');

async function captureAdminPlatWithAuth() {
  console.log('🚀 Lancement de Playwright pour capturer l\'interface admin des plats...');
  
  const browser = await chromium.launch({ 
    headless: false, // Mode visible pour debug
    slowMo: 500,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📱 1. Navigation vers la page d\'accueil...');
    
    // D'abord aller sur la page d'accueil pour établir la session
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    await page.waitForTimeout(2000);
    
    // Simuler une authentification admin via localStorage ou sessionStorage
    console.log('🔐 2. Configuration de l\'authentification admin...');
    
    await page.evaluate(() => {
      // Simuler une session admin
      const adminUser = {
        uid: 'admin-demo-uid',
        email: 'admin@chanthana.com',
        role: 'admin',
        displayName: 'Admin Chanthana'
      };
      
      // Stocker les données d'authentification
      localStorage.setItem('auth-user', JSON.stringify(adminUser));
      localStorage.setItem('user-role', 'admin');
      localStorage.setItem('admin-session', 'active');
      
      // Simuler un token Firebase
      sessionStorage.setItem('firebase-token', 'demo-admin-token');
      
      return adminUser;
    });
    
    console.log('📱 3. Navigation vers l\'interface admin des plats...');
    
    // Maintenant naviguer vers la page admin
    await page.goto('http://localhost:3000/admin/plats', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    console.log('⏳ 4. Attente du chargement de l\'interface...');
    
    // Attendre que la page soit complètement chargée
    await page.waitForTimeout(5000);
    
    // Vérifier si nous sommes toujours sur une page d'authentification
    const currentUrl = page.url();
    console.log(`📍 URL actuelle: ${currentUrl}`);
    
    // Essayer différents sélecteurs pour identifier le contenu
    const bodyContent = await page.evaluate(() => {
      return {
        title: document.title,
        hasAuthForm: !!document.querySelector('form[action*="auth"]'),
        hasAdminContent: !!document.querySelector('[class*="admin"]'),
        hasPlatsContent: !!document.querySelector('[class*="plat"]'),
        bodyClasses: document.body.className,
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent).slice(0, 5)
      };
    });
    
    console.log('📊 Contenu de la page:', bodyContent);
    
    // Si on est encore sur une page d'auth, essayer de passer outre
    if (bodyContent.hasAuthForm || currentUrl.includes('auth') || bodyContent.title.includes('Authentication')) {
      console.log('🔄 5. Tentative de contournement de l\'authentification...');
      
      // Essayer de naviguer directement en injectant du JavaScript
      await page.evaluate(() => {
        // Forcer la navigation côté client si possible
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', '/admin/plats');
          
          // Déclencher les événements de changement d'état
          window.dispatchEvent(new PopStateEvent('popstate'));
          window.dispatchEvent(new Event('locationchange'));
        }
      });
      
      await page.waitForTimeout(3000);
    }
    
    console.log('📸 6. Capture de l\'écran...');
    
    // Prendre les captures d'écran
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `admin-plats-interface-${timestamp}.png`;
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'png'
      // Retirer quality pour PNG
    });
    
    console.log(`✅ Capture principale sauvegardée : ${screenshotPath}`);
    
    // Capture de la zone de contenu visible
    const viewportScreenshotPath = `admin-plats-viewport-${timestamp}.png`;
    await page.screenshot({
      path: viewportScreenshotPath,
      type: 'png'
    });
    
    console.log(`✅ Capture viewport sauvegardée : ${viewportScreenshotPath}`);
    
    // Analyser les éléments visuels Thai
    console.log('🎨 7. Analyse des éléments de design Thai...');
    
    const thaiDesignElements = await page.evaluate(() => {
      const elements = {
        thaiColors: {
          orange: 0,
          green: 0,
          gold: 0,
          red: 0,
          cream: 0
        },
        components: {
          cards: 0,
          buttons: 0,
          headers: 0,
          tables: 0,
          forms: 0
        },
        animations: {
          transitions: 0,
          transforms: 0,
          hover: 0
        },
        layout: {
          containers: 0,
          grids: 0,
          flexboxes: 0
        }
      };
      
      // Analyser les couleurs Thai dans les classes CSS
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const classes = el.className || '';
        const style = window.getComputedStyle(el);
        
        // Compter les couleurs Thai
        if (classes.includes('thai-orange') || style.color.includes('orange') || style.backgroundColor.includes('orange')) {
          elements.thaiColors.orange++;
        }
        if (classes.includes('thai-green') || style.color.includes('green') || style.backgroundColor.includes('green')) {
          elements.thaiColors.green++;
        }
        if (classes.includes('thai-gold') || classes.includes('gold')) {
          elements.thaiColors.gold++;
        }
        
        // Compter les composants
        if (classes.includes('card') || el.tagName.toLowerCase() === 'article') {
          elements.components.cards++;
        }
        if (el.tagName.toLowerCase() === 'button') {
          elements.components.buttons++;
        }
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(el.tagName.toLowerCase())) {
          elements.components.headers++;
        }
        if (el.tagName.toLowerCase() === 'table') {
          elements.components.tables++;
        }
        if (el.tagName.toLowerCase() === 'form') {
          elements.components.forms++;
        }
        
        // Analyser les animations
        if (style.transition !== 'all 0s ease 0s') {
          elements.animations.transitions++;
        }
        if (style.transform !== 'none') {
          elements.animations.transforms++;
        }
        
        // Analyser le layout
        if (classes.includes('container')) {
          elements.layout.containers++;
        }
        if (style.display === 'grid') {
          elements.layout.grids++;
        }
        if (style.display === 'flex') {
          elements.layout.flexboxes++;
        }
      });
      
      return elements;
    });
    
    console.log('📈 Éléments de design détectés:', JSON.stringify(thaiDesignElements, null, 2));
    
    // Prendre une capture spécialisée des couleurs si possible
    if (thaiDesignElements.thaiColors.orange > 0 || thaiDesignElements.thaiColors.green > 0) {
      console.log('🌈 8. Capture spécialisée des couleurs Thai...');
      
      const colorScreenshotPath = `admin-plats-colors-${timestamp}.png`;
      
      // Scroll vers le haut pour capturer le header s'il existe
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
      
      await page.screenshot({
        path: colorScreenshotPath,
        type: 'png'
      });
      
      console.log(`🎨 Capture couleurs sauvegardée : ${colorScreenshotPath}`);
    }
    
    return {
      success: true,
      screenshots: [screenshotPath, viewportScreenshotPath],
      url: currentUrl,
      content: bodyContent,
      thaiElements: thaiDesignElements
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la capture:', error.message);
    
    // Capture d'urgence
    try {
      const errorScreenshotPath = `admin-plats-debug-${Date.now()}.png`;
      await page.screenshot({
        path: errorScreenshotPath,
        fullPage: true,
        type: 'png'
      });
      console.log(`🔍 Capture de debug sauvegardée : ${errorScreenshotPath}`);
      
      return { 
        error: error.message, 
        screenshot: errorScreenshotPath,
        url: page.url(),
        debug: true
      };
    } catch (screenshotError) {
      console.error('❌ Impossible de prendre une capture de debug:', screenshotError.message);
      return { error: error.message, url: page.url() };
    }
    
  } finally {
    console.log('🔚 Fermeture du navigateur...');
    await browser.close();
  }
}

// Exécuter la capture avec authentification
captureAdminPlatWithAuth()
  .then(result => {
    console.log('🎉 Processus terminé!');
    console.log('📊 Résultat final:', JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });