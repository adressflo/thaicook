// Créer le bucket platphoto et configurer ses permissions
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseServiceKey = 'sbp_1ba0bad09468be39860696c966dab20a9094efbe';

// Utiliser la service key pour avoir les droits d'admin
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createPlatphotoBucket() {
  console.log('🪣 CRÉATION DU BUCKET PLATPHOTO...\n');

  try {
    // 1. Vérifier les buckets existants
    console.log('📋 Vérification des buckets existants...');
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.log('❌ Erreur listBuckets:', listError.message);
      return;
    }

    console.log('📦 Buckets trouvés:', existingBuckets?.map(b => `${b.name} (${b.public ? 'PUBLIC' : 'PRIVÉ'})`) || 'aucun');

    const platphotoExists = existingBuckets?.find(b => b.name === 'platphoto');

    if (platphotoExists) {
      console.log('✅ Bucket platphoto existe déjà !');
      console.log(`   Status: ${platphotoExists.public ? 'PUBLIC ✅' : 'PRIVÉ ⚠️'}`);
    } else {
      console.log('🆕 Création du bucket platphoto...');

      // 2. Créer le bucket
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('platphoto', {
        public: true,
        allowedMimeTypes: [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/gif'
        ],
        fileSizeLimit: 5242880 // 5MB
      });

      if (createError) {
        console.log('❌ Erreur création bucket:', createError.message);
        return;
      }

      console.log('✅ Bucket platphoto créé avec succès !');
      console.log('📋 Configuration:', {
        name: 'platphoto',
        public: true,
        maxSize: '5MB',
        types: 'Images seulement'
      });
    }

    // 3. Créer le fichier extra.png par défaut s'il n'existe pas
    console.log('\n🖼️  Vérification de l\'image par défaut...');

    try {
      const { data: existingFile, error: downloadError } = await supabase.storage
        .from('platphoto')
        .download('extra.png');

      if (downloadError) {
        console.log('📁 Image par défaut manquante, création...');

        // Créer un fichier SVG simple comme image par défaut
        const defaultImageSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#f0f0f0"/>
  <circle cx="100" cy="80" r="30" fill="#ddd"/>
  <rect x="70" y="120" width="60" height="40" rx="5" fill="#ddd"/>
  <text x="100" y="175" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">
    Extra Thai
  </text>
</svg>`;

        const svgBlob = new Blob([defaultImageSVG], { type: 'image/svg+xml' });

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('platphoto')
          .upload('extra.png', svgBlob, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'image/svg+xml'
          });

        if (uploadError) {
          console.log('❌ Erreur upload image par défaut:', uploadError.message);
        } else {
          console.log('✅ Image par défaut créée:', uploadData.path);
        }
      } else {
        console.log('✅ Image par défaut existe déjà');
      }
    } catch (error) {
      console.log('⚠️  Erreur vérification image par défaut:', error.message);
    }

    // 4. Test d'upload dans le bucket
    console.log('\n🧪 Test d\'upload dans platphoto...');

    const testFile = new Blob(['Test Upload Platphoto'], { type: 'text/plain' });
    const testFileName = `test-upload-${Date.now()}.txt`;

    const { data: testUpload, error: testError } = await supabase.storage
      .from('platphoto')
      .upload(testFileName, testFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (testError) {
      console.log('❌ Test upload échoué:', testError.message);

      if (testError.message.includes('row-level security policy')) {
        console.log('🚨 PROBLÈME RLS DÉTECTÉ !');
        console.log('   → Il faut configurer les politiques RLS pour storage.objects');
        console.log('   → Solution: Exécuter les politiques RLS dans Supabase Dashboard');
      }
    } else {
      console.log('✅ Test upload réussi !');
      console.log(`📁 Fichier: ${testUpload.path}`);

      // URL publique
      const { data: publicUrl } = supabase.storage
        .from('platphoto')
        .getPublicUrl(testUpload.path);

      console.log(`🔗 URL publique: ${publicUrl.publicUrl}`);

      // Nettoyer le fichier test
      await supabase.storage.from('platphoto').remove([testUpload.path]);
      console.log('🧹 Fichier test supprimé');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

createPlatphotoBucket().then(() => {
  console.log('\n🏁 Configuration bucket platphoto terminée !');
  process.exit(0);
}).catch(console.error);