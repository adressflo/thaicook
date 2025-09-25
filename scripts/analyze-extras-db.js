// Analyser la table extras_db et le champ photo_url
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function analyzeExtrasDB() {
  console.log('🔍 ANALYSE DÉTAILLÉE DE LA TABLE extras_db...\n');

  try {
    // 1. Structure de la table
    console.log('📋 STRUCTURE DE LA TABLE extras_db:');
    console.log('================================================');

    // 2. Données existantes avec focus sur photo_url
    const { data: extras, error } = await supabase
      .from('extras_db')
      .select('*')
      .limit(10);

    if (error) {
      console.log('❌ Erreur lecture extras_db:', error.message);
      return;
    }

    if (!extras || extras.length === 0) {
      console.log('📊 TABLE VIDE - Aucun extra trouvé');
      return;
    }

    console.log(`📊 NOMBRE D'EXTRAS: ${extras.length}\n`);

    // 3. Analyser chaque extra et ses photo_url
    console.log('🖼️ ANALYSE DES PHOTOS (photo_url):');
    console.log('================================================');

    extras.forEach((extra, index) => {
      console.log(`\n[${index + 1}] EXTRA: ${extra.nom_extra || 'Sans nom'}`);
      console.log(`    ID: ${extra.idextra}`);
      console.log(`    Prix: ${extra.prix}€`);
      console.log(`    Photo URL: ${extra.photo_url || 'AUCUNE'}`);

      // Analyser l'URL
      if (extra.photo_url) {
        if (extra.photo_url.includes('supabase.co')) {
          if (extra.photo_url.includes('/platphoto/')) {
            console.log(`    ✅ URL Supabase Storage (bucket: platphoto)`);
          } else if (extra.photo_url.includes('/plats/')) {
            console.log(`    ✅ URL Supabase Storage (bucket: plats)`);
          } else {
            console.log(`    ⚠️  URL Supabase mais bucket inconnu`);
          }
        } else if (extra.photo_url.startsWith('http')) {
          console.log(`    🌐 URL externe`);
        } else if (extra.photo_url.startsWith('blob:')) {
          console.log(`    🔴 URL TEMPORAIRE (blob) - PROBLÈME !`);
        } else {
          console.log(`    ❓ Format d'URL non reconnu`);
        }
      } else {
        console.log(`    🚫 AUCUNE PHOTO`);
      }
    });

    // 4. Statistiques des URLs
    console.log('\n\n📈 STATISTIQUES DES PHOTOS:');
    console.log('================================================');

    const stats = {
      total: extras.length,
      withPhoto: extras.filter(e => e.photo_url).length,
      withoutPhoto: extras.filter(e => !e.photo_url).length,
      supabaseStorage: extras.filter(e => e.photo_url && e.photo_url.includes('supabase.co')).length,
      externalUrls: extras.filter(e => e.photo_url && e.photo_url.startsWith('http') && !e.photo_url.includes('supabase.co')).length,
      blobUrls: extras.filter(e => e.photo_url && e.photo_url.startsWith('blob:')).length,
      platphotoBucket: extras.filter(e => e.photo_url && e.photo_url.includes('/platphoto/')).length,
      platsBucket: extras.filter(e => e.photo_url && e.photo_url.includes('/plats/')).length
    };

    console.log(`📊 Total extras: ${stats.total}`);
    console.log(`🖼️  Avec photo: ${stats.withPhoto}`);
    console.log(`🚫 Sans photo: ${stats.withoutPhoto}`);
    console.log(`☁️  Supabase Storage: ${stats.supabaseStorage}`);
    console.log(`🌐 URLs externes: ${stats.externalUrls}`);
    console.log(`🔴 URLs temporaires (blob): ${stats.blobUrls}`);
    console.log(`📦 Bucket 'platphoto': ${stats.platphotoBucket}`);
    console.log(`📦 Bucket 'plats': ${stats.platsBucket}`);

    // 5. Recommandations
    console.log('\n\n💡 RECOMMANDATIONS:');
    console.log('================================================');

    if (stats.blobUrls > 0) {
      console.log(`🚨 CRITIQUE: ${stats.blobUrls} extras ont des URLs temporaires (blob:)`);
      console.log('   → Ces photos ne fonctionneront plus après refresh de la page');
      console.log('   → Il faut corriger l\'upload pour utiliser Supabase Storage');
    }

    if (stats.platphotoBucket > 0 && stats.platsBucket === 0) {
      console.log(`✅ Bucket 'platphoto' utilisé (${stats.platphotoBucket} extras)`);
      console.log('   → Vérifier que le bucket platphoto existe et a les bonnes permissions');
    } else if (stats.platsBucket > 0) {
      console.log(`✅ Bucket 'plats' utilisé (${stats.platsBucket} extras)`);
    }

    if (stats.withoutPhoto > 0) {
      console.log(`⚠️  ${stats.withoutPhoto} extras sans photo`);
      console.log('   → Utiliser l\'image par défaut ou permettre upload');
    }

    // 6. URLs par défaut utilisées
    const defaultUrls = extras
      .filter(e => e.photo_url && e.photo_url.includes('extra.png'))
      .map(e => e.photo_url);

    if (defaultUrls.length > 0) {
      console.log(`\n🖼️  ${defaultUrls.length} extras utilisent l'image par défaut (extra.png)`);
      console.log(`   URL: ${defaultUrls[0]}`);
    }

  } catch (error) {
    console.error('❌ Erreur analyse:', error.message);
  }
}

analyzeExtrasDB().then(() => {
  console.log('\n🏁 Analyse terminée');
  process.exit(0);
}).catch(console.error);