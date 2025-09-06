const { chromium } = require('playwright');

async function captureThaiDesign() {
  console.log('🚀 Lancement de Playwright pour capturer le design Thai...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    // 1. Capturer la page d'accueil avec le design Thai
    console.log('📱 1. Capture de la page d\'accueil...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: 'thai-design-homepage.png',
      fullPage: true,
      type: 'png'
    });
    console.log('✅ Homepage capturée : thai-design-homepage.png');
    
    // 2. Capturer la page Commander avec le menu Thai
    console.log('📱 2. Navigation vers /commander...');
    await page.goto('http://localhost:3000/commander', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    
    await page.screenshot({
      path: 'thai-design-commander.png',
      fullPage: true,
      type: 'png'
    });
    console.log('✅ Commander capturée : thai-design-commander.png');
    
    // 3. Capturer la page Événements
    console.log('📱 3. Navigation vers /evenements...');
    await page.goto('http://localhost:3000/evenements', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    
    await page.screenshot({
      path: 'thai-design-evenements.png',
      fullPage: true,
      type: 'png'
    });
    console.log('✅ Événements capturée : thai-design-evenements.png');
    
    // 4. Analyser les couleurs Thai présentes
    console.log('🎨 4. Analyse des couleurs Thai...');
    
    const thaiAnalysis = await page.evaluate(() => {
      const results = {
        colors: {
          thaiOrange: 0,
          thaiGreen: 0,
          thaiGold: 0,
          thaiRed: 0,
          thaiCream: 0
        },
        components: {
          gradients: 0,
          cards: 0,
          buttons: 0,
          animations: 0
        },
        cssVariables: [],
        backgroundStyles: []
      };
      
      // Analyser toutes les feuilles de style
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            const cssText = rule.cssText || '';
            
            // Chercher les variables CSS Thai
            if (cssText.includes('--thai-') || cssText.includes('thai-')) {
              results.cssVariables.push(cssText.substring(0, 200));
            }
            
            // Compter les couleurs Thai
            if (cssText.includes('thai-orange')) results.colors.thaiOrange++;
            if (cssText.includes('thai-green')) results.colors.thaiGreen++;
            if (cssText.includes('thai-gold')) results.colors.thaiGold++;
            if (cssText.includes('thai-red')) results.colors.thaiRed++;
            if (cssText.includes('thai-cream')) results.colors.thaiCream++;
            
            // Chercher les gradients
            if (cssText.includes('gradient')) results.components.gradients++;
          });
        } catch (e) {
          // Ignorer les erreurs de CORS
        }
      });
      
      // Analyser les éléments DOM
      document.querySelectorAll('*').forEach(el => {
        const classes = el.className.toString();
        const styles = window.getComputedStyle(el);
        
        if (classes.includes('card')) results.components.cards++;
        if (el.tagName === 'BUTTON') results.components.buttons++;
        if (styles.transition && styles.transition !== 'all 0s ease 0s') {
          results.components.animations++;
        }
        
        // Capturer les styles de background intéressants
        if (styles.background && (
          styles.background.includes('gradient') ||
          styles.background.includes('thai') ||
          styles.background.includes('orange') ||
          styles.background.includes('green')
        )) {
          results.backgroundStyles.push({
            tag: el.tagName,
            class: classes.substring(0, 50),
            background: styles.background.substring(0, 100)
          });
        }
      });
      
      return results;
    });
    
    console.log('📊 Analyse Thai Design:', JSON.stringify(thaiAnalysis, null, 2));
    
    // 5. Capturer une vue détaillée d'un composant Thai si trouvé
    console.log('🔍 5. Recherche de composants Thai spécifiques...');
    
    const thaiElement = await page.$('.thai-card, [class*="thai-"], .gradient-thai');
    if (thaiElement) {
      console.log('🎯 Composant Thai trouvé, capture détaillée...');
      await thaiElement.screenshot({
        path: 'thai-component-detail.png',
        type: 'png'
      });
      console.log('✅ Composant Thai capturé : thai-component-detail.png');
    }
    
    // 6. Capturer les éléments avec hover effects
    console.log('✨ 6. Test des effets hover...');
    
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      await buttons[0].hover();
      await page.waitForTimeout(1000);
      
      await page.screenshot({
        path: 'thai-hover-effects.png',
        type: 'png'
      });
      console.log('✅ Effets hover capturés : thai-hover-effects.png');
    }
    
    return {
      success: true,
      screenshots: [
        'thai-design-homepage.png',
        'thai-design-commander.png', 
        'thai-design-evenements.png'
      ],
      analysis: thaiAnalysis
    };
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return { error: error.message };
    
  } finally {
    await browser.close();
    console.log('🔚 Navigateur fermé');
  }
}

// Exécuter la capture
captureThaiDesign()
  .then(result => {
    console.log('🎉 Capture terminée!');
    console.log('📊 Résultats:', JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('💥 Erreur fatale:', error);
  });