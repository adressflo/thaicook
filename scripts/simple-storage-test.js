// Simple Storage Test avec clé correcte
const { createClient } = require('@supabase/supabase-js');

// Utilisation de la clé ANON (pas service key)
const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorage() {
  console.log('🧪 Test connexion Supabase Storage...');

  try {
    // 1. Lister les buckets
    const { data: buckets, error: errorBuckets } = await supabase.storage.listBuckets();

    if (errorBuckets) {
      console.log('❌ Erreur listBuckets:', errorBuckets);
    } else {
      console.log('✅ Buckets trouvés:', buckets.map(b => `${b.name} (${b.public ? 'PUBLIC' : 'PRIVÉ'})`));
    }

    // 2. Test upload dans platphoto
    console.log('\n🔼 Test upload fichier dans platphoto...');

    // Créer un fichier test simple
    const testFile = new Blob(['Hello Storage Test'], { type: 'text/plain' });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('platphoto')
      .upload(`test/test-${Date.now()}.txt`, testFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.log('❌ Erreur upload:', uploadError);
      if (uploadError.message.includes('row-level security policy')) {
        console.log('🚨 PROBLÈME RLS CONFIRMÉ - Les politiques bloquent l\'upload');
      }
    } else {
      console.log('✅ Upload réussi:', uploadData);

      // 3. Obtenir URL publique
      const { data: urlData } = supabase.storage
        .from('platphoto')
        .getPublicUrl(uploadData.path);

      console.log('🔗 URL publique:', urlData.publicUrl);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testStorage().then(() => {
  console.log('\n🏁 Test terminé');
  process.exit(0);
}).catch(console.error);