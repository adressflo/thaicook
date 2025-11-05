/**
 * Script pour vérifier les erreurs console avec Playwright
 * Usage: node scripts/check-console-errors.js
 */

const { chromium } = require('playwright');

async function checkConsoleErrors() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = {
    errors: [],
    warnings: [],
    logs: [],
  };

  // Capturer tous les messages console
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();

    const entry = {
      type,
      text,
      url: location.url,
      line: location.lineNumber,
    };

    if (type === 'error') {
      consoleMessages.errors.push(entry);
      console.error(`❌ [ERROR] ${text}`);
      if (location.url) {
        console.error(`   at ${location.url}:${location.lineNumber}`);
      }
    } else if (type === 'warning') {
      consoleMessages.warnings.push(entry);
      console.warn(`⚠️  [WARNING] ${text}`);
    } else if (type === 'log' && (text.includes('✅') || text.includes('⚠️') || text.includes('❌'))) {
      consoleMessages.logs.push(entry);
      console.log(`ℹ️  [LOG] ${text}`);
    }
  });

  // Capturer les erreurs de page (exceptions non gérées)
  page.on('pageerror', (error) => {
    console.error(`❌ [PAGE ERROR] ${error.message}`);
    console.error(error.stack);
    consoleMessages.errors.push({
      type: 'pageerror',
      text: error.message,
      stack: error.stack,
    });
  });

  console.log('🚀 Navigation vers http://localhost:3000...\n');

  try {
    // Naviguer vers la page d'accueil
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('✅ Page chargée avec succès\n');

    // Attendre 2 secondes pour laisser le temps aux scripts de s'exécuter
    await page.waitForTimeout(2000);

    // Naviguer vers /commander
    console.log('🚀 Navigation vers /commander...\n');
    await page.goto('http://localhost:3000/commander', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);

    // Naviguer vers /historique
    console.log('🚀 Navigation vers /historique...\n');
    await page.goto('http://localhost:3000/historique', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('❌ Erreur pendant la navigation:', error.message);
  }

  await browser.close();

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DES ERREURS CONSOLE');
  console.log('='.repeat(60));
  console.log(`❌ Erreurs: ${consoleMessages.errors.length}`);
  console.log(`⚠️  Warnings: ${consoleMessages.warnings.length}`);
  console.log(`ℹ️  Logs: ${consoleMessages.logs.length}`);

  if (consoleMessages.errors.length > 0) {
    console.log('\n❌ DÉTAILS DES ERREURS:');
    consoleMessages.errors.forEach((err, i) => {
      console.log(`\n${i + 1}. ${err.text}`);
      if (err.url) console.log(`   Source: ${err.url}:${err.line}`);
      if (err.stack) console.log(`   Stack: ${err.stack.split('\n')[0]}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ Aucune erreur console détectée !');
    process.exit(0);
  }
}

checkConsoleErrors().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
