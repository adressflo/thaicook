/**
 * Script pour générer toutes les icônes PWA à partir du logo
 * Utilise sharp pour redimensionner l'image
 *
 * Usage: npm install sharp --save-dev && node scripts/generate-pwa-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tailles d'icônes requises pour PWA
const ICON_SIZES = [
  72,   // Android Chrome
  96,   // Android Chrome
  128,  // Android Chrome
  144,  // Android Chrome
  152,  // iOS
  192,  // Android Chrome (minimum PWA)
  384,  // Android Chrome
  512,  // Android Chrome (splash screen)
];

// Tailles maskable (avec padding pour safe area)
const MASKABLE_SIZES = [192, 512];

const SOURCE_LOGO = path.join(__dirname, '../public/logo.png');
const ICONS_DIR = path.join(__dirname, '../public/icons');

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log('✅ Dossier /public/icons/ créé');
}

/**
 * Générer une icône standard
 */
async function generateIcon(size) {
  const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);

  try {
    await sharp(SOURCE_LOGO)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent
      })
      .png()
      .toFile(outputPath);

    console.log(`✅ Icône ${size}x${size} générée`);
  } catch (error) {
    console.error(`❌ Erreur pour ${size}x${size}:`, error.message);
  }
}

/**
 * Générer une icône maskable (avec padding 20% pour safe area)
 */
async function generateMaskableIcon(size) {
  const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}-maskable.png`);
  const padding = Math.floor(size * 0.2); // 20% padding
  const innerSize = size - (padding * 2);

  try {
    // Créer canvas avec background orange thaï
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 217, g: 119, b: 6, alpha: 1 } // #D97706
      }
    })
    .composite([{
      input: await sharp(SOURCE_LOGO)
        .resize(innerSize, innerSize, { fit: 'contain' })
        .toBuffer(),
      gravity: 'center'
    }])
    .png()
    .toFile(outputPath);

    console.log(`✅ Icône maskable ${size}x${size} générée`);
  } catch (error) {
    console.error(`❌ Erreur maskable ${size}x${size}:`, error.message);
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('🎨 Génération des icônes PWA...\n');

  // Vérifier que le logo source existe
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Logo source introuvable:', SOURCE_LOGO);
    process.exit(1);
  }

  // Générer toutes les icônes standard
  for (const size of ICON_SIZES) {
    await generateIcon(size);
  }

  console.log('\n🎭 Génération des icônes maskable...\n');

  // Générer les icônes maskable
  for (const size of MASKABLE_SIZES) {
    await generateMaskableIcon(size);
  }

  console.log('\n✅ Toutes les icônes PWA ont été générées!');
  console.log(`📁 Emplacement: ${ICONS_DIR}`);
}

main().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
