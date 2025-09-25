// Test avec le bucket 'plats' existant
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPlatsStorage() {
  console.log('🧪 Test bucket PLATS...');

  try {
    // 1. Vérifier buckets disponibles
    const { data: buckets, error: errorBuckets } = await supabase.storage.listBuckets();
    console.log('📦 Buckets disponibles:', buckets?.map(b => b.name) || 'aucun');

    // 2. Test upload dans 'plats'
    console.log('\n🔼 Test upload dans bucket PLATS...');

    const testFile = new Blob(['Test Extra Image'], { type: 'text/plain' });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('plats')
      .upload(`extras/test-extra-${Date.now()}.txt`, testFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.log('❌ Erreur upload plats:', uploadError.message);

      // 3. Essayer avec un bucket différent si plats échoue
      console.log('\n🔄 Essai avec autre bucket...');

      for (const bucket of (buckets || [])) {
        console.log(`\n📁 Test bucket: ${bucket.name}`);

        const { data: testData, error: testError } = await supabase.storage
          .from(bucket.name)
          .upload(`test-${Date.now()}.txt`, testFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (!testError) {
          console.log(`✅ SUCCESS avec bucket: ${bucket.name}`);
          console.log(`🔗 Path: ${testData.path}`);

          // URL publique
          const { data: urlData } = supabase.storage
            .from(bucket.name)
            .getPublicUrl(testData.path);

          console.log(`🌐 URL: ${urlData.publicUrl}`);
          return bucket.name; // Retourner le bucket qui fonctionne
        } else {
          console.log(`❌ Échec ${bucket.name}:`, testError.message);
        }
      }
    } else {
      console.log('✅ Upload réussi dans PLATS:', uploadData);
      return 'plats';
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testPlatsStorage().then((workingBucket) => {
  console.log(`\n🏁 Bucket fonctionnel: ${workingBucket || 'AUCUN'}`);
  if (workingBucket) {
    console.log(`✅ SOLUTION: Changer BUCKET_NAME vers '${workingBucket}' dans votre code`);
  }
  process.exit(0);
}).catch(console.error);