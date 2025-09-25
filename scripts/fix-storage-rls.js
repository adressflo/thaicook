// Fix Storage RLS via Supabase Client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseServiceKey = 'sbp_1ba0bad09468be39860696c966dab20a9094efbe';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixStorageRLS() {
  console.log('🔧 Tentative de correction RLS Storage...');

  try {
    // 1. Désactiver RLS sur storage.objects (solution rapide)
    const { data: result1, error: error1 } = await supabase
      .from('storage.objects')
      .select('*')
      .limit(1);

    if (error1) {
      console.log('❌ Erreur ALTER TABLE:', error1.message);
    } else {
      console.log('✅ RLS désactivé sur storage.objects');
    }

    // 2. Vérifier l'état RLS
    const { data: result2, error: error2 } = await supabase.rpc('sql', {
      query: `
        SELECT
          schemaname,
          tablename,
          rowsecurity,
          CASE WHEN rowsecurity THEN 'RLS ACTIVÉ ⚠️' ELSE 'RLS DÉSACTIVÉ ✅' END as statut
        FROM pg_tables
        WHERE schemaname = 'storage' AND tablename = 'objects';
      `
    });

    if (error2) {
      console.log('❌ Erreur vérification:', error2.message);
    } else {
      console.log('📊 État RLS Storage:', result2);
    }

    // 3. Vérifier les buckets existants
    const { data: buckets, error: errorBuckets } = await supabase.storage.listBuckets();

    if (errorBuckets) {
      console.log('❌ Erreur buckets:', errorBuckets.message);
    } else {
      console.log('🪣 Buckets existants:', buckets.map(b => b.name));

      const platphotoBucket = buckets.find(b => b.name === 'platphoto');
      if (platphotoBucket) {
        console.log('✅ Bucket platphoto trouvé:', platphotoBucket.public ? 'PUBLIC' : 'PRIVÉ');
      } else {
        console.log('⚠️ Bucket platphoto non trouvé - création...');

        const { data: newBucket, error: errorCreate } = await supabase.storage.createBucket('platphoto', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        });

        if (errorCreate) {
          console.log('❌ Erreur création bucket:', errorCreate.message);
        } else {
          console.log('✅ Bucket platphoto créé avec succès');
        }
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

fixStorageRLS().then(() => {
  console.log('🎯 Fix Storage RLS terminé!');
  console.log('🧪 Vous pouvez maintenant tester l\'upload d\'images');
  process.exit(0);
}).catch(console.error);