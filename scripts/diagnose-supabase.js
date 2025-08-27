// Script de diagnostic pour les problèmes RLS Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseRLSPolicies() {
  console.log('🔍 Diagnostic des policies RLS pour client_db...\n');

  try {
    // Test 1: Vérifier la connexion
    console.log('1️⃣ Test de connexion...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('client_db')
      .select('count')
      .limit(0);
    
    if (connectionError) {
      console.log('❌ Erreur de connexion:', connectionError.message);
      return;
    }
    console.log('✅ Connexion OK\n');

    // Test 2: Essayer de lire des données
    console.log('2️⃣ Test de lecture...');
    const { data: readData, error: readError } = await supabase
      .from('client_db')
      .select('firebase_uid, email, role')
      .limit(5);
    
    if (readError) {
      console.log('❌ Erreur de lecture:', readError.message);
      console.log('Code:', readError.code);
    } else {
      console.log('✅ Lecture OK. Clients trouvés:', readData?.length || 0);
      if (readData?.length > 0) {
        console.log('Exemple:', readData[0]);
      }
    }
    console.log();

    // Test 3: Essayer d'insérer un client test
    console.log('3️⃣ Test d\'insertion...');
    const testClientData = {
      firebase_uid: 'test-firebase-uid-' + Date.now(),
      email: 'test@example.com',
      nom: 'Test',
      prenom: 'User',
      role: 'client'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('client_db')
      .insert(testClientData)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Erreur d\'insertion (c\'est le problème!)');
      console.log('Message:', insertError.message);
      console.log('Code:', insertError.code);
      console.log('Détails:', insertError.details);
      console.log('Hint:', insertError.hint);
      
      if (insertError.code === '42501') {
        console.log('\n🎯 PROBLÈME IDENTIFIÉ: Row Level Security Policy');
        console.log('Les policies RLS empêchent la création de nouveaux clients.');
        console.log('\nSOLUTIONS POSSIBLES:');
        console.log('1. Modifier les policies RLS dans Supabase Dashboard');
        console.log('2. Utiliser la clé service role au lieu de la clé anon');
        console.log('3. Désactiver temporairement RLS pour les tests');
      }
    } else {
      console.log('✅ Insertion OK! Client créé:', insertData);
      
      // Nettoyer le client test
      await supabase
        .from('client_db')
        .delete()
        .eq('firebase_uid', testClientData.firebase_uid);
      console.log('🧹 Client test supprimé');
    }

    // Test 4: Vérifier les informations sur les policies (nécessite des privilèges élevés)
    console.log('\n4️⃣ Tentative de récupération des informations sur les policies...');
    try {
      const { data: policies, error: policiesError } = await supabase.rpc('get_policies_info');
      if (policiesError) {
        console.log('ℹ️  Impossible de récupérer les infos des policies (normal avec clé anon)');
      } else {
        console.log('📋 Policies trouvées:', policies);
      }
    } catch (rpcError) {
      console.log('ℹ️  RPC non disponible (normal avec clé anon)');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Lancer le diagnostic
diagnoseRLSPolicies();