// Test de création de client pour diagnostiquer le problème
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testClientCreation() {
  console.log('🧪 Test de création de client...\n');

  const testClientData = {
    firebase_uid: 'test-user-' + Date.now(),
    email: 'test@example.com',
    nom: 'Test',
    prenom: 'User',
    role: 'client'
  };

  console.log('📝 Données du client à insérer:', testClientData);

  try {
    console.log('⏳ Tentative d\'insertion...');
    
    const { data, error } = await supabase
      .from('client_db')
      .insert(testClientData)
      .select()
      .single();

    if (error) {
      console.log('❌ ERREUR DÉTECTÉE:');
      console.log('Type d\'erreur:', typeof error);
      console.log('Erreur complète:', JSON.stringify(error, null, 2));
      console.log('Properties de l\'erreur:');
      console.log('- message:', error?.message);
      console.log('- code:', error?.code);
      console.log('- details:', error?.details);
      console.log('- hint:', error?.hint);
      console.log('- status:', error?.status);
      console.log('- statusText:', error?.statusText);
      
      console.log('\n🔍 Analyse:');
      if (error?.code === '42501') {
        console.log('✅ C\'est bien un problème de RLS Policy (42501)');
        console.log('💡 Solution: Exécuter les requêtes SQL dans le Dashboard Supabase');
      } else if (Object.keys(error).length === 0) {
        console.log('⚠️  Objet error vide - problème de sérialisation');
      } else {
        console.log('🤷 Autre type d\'erreur');
      }
    } else {
      console.log('✅ Insertion réussie!');
      console.log('📊 Données retournées:', data);
      
      // Nettoyer le client test
      await supabase
        .from('client_db')
        .delete()
        .eq('firebase_uid', testClientData.firebase_uid);
      console.log('🧹 Client test supprimé');
    }

  } catch (networkError) {
    console.log('💥 Erreur réseau/exception:');
    console.log('Type:', typeof networkError);
    console.log('Message:', networkError.message);
    console.log('Stack:', networkError.stack);
  }
}

// Test avec avez-vous exécuté les requêtes SQL?
async function checkPolicies() {
  console.log('\n🔍 Vérification des policies RLS...');
  
  try {
    // Essayer de lire les données (cela devrait marcher)
    const { data: readTest, error: readError } = await supabase
      .from('client_db')
      .select('firebase_uid, email, role')
      .limit(1);
    
    if (readError) {
      console.log('❌ Problème de lecture:', readError);
    } else {
      console.log('✅ Lecture OK - ' + (readTest?.length || 0) + ' clients trouvés');
    }
    
  } catch (err) {
    console.log('💥 Erreur lors de la vérification:', err.message);
  }
}

// Lancer les tests
async function runTests() {
  await checkPolicies();
  await testClientCreation();
  
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Si erreur 42501: Exécuter les requêtes SQL dans Dashboard Supabase');
  console.log('2. Si erreur différente: Analyser les détails ci-dessus');
  console.log('3. Retester après correction');
}

runTests();