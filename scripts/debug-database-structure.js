// Script de diagnostic pour vérifier la structure de la base de données
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugDatabase() {
  console.log('🔍 DIAGNOSTIC DATABASE CHANTHANA');
  console.log('================================');

  // 1. Vérifier les commandes existantes
  console.log('\n1. 📋 COMMANDES EXISTANTES:');
  const { data: commandes, error: commandesError } = await supabase
    .from('commande_db')
    .select('idcommande, date_de_prise_de_commande, client_r')
    .limit(5);

  if (commandesError) {
    console.error('❌ Erreur commandes:', commandesError);
  } else {
    console.log(`✅ ${commandes?.length || 0} commandes trouvées`);
    if (commandes && commandes.length > 0) {
      console.log('📄 Exemple:', commandes[0]);
    }
  }

  // 2. Vérifier les détails de commandes
  console.log('\n2. 🍽️ DÉTAILS COMMANDES:');
  const { data: details, error: detailsError } = await supabase
    .from('details_commande_db')
    .select('*')
    .limit(5);

  if (detailsError) {
    console.error('❌ Erreur détails:', detailsError);
  } else {
    console.log(`✅ ${details?.length || 0} détails trouvés`);
    if (details && details.length > 0) {
      console.log('📄 Exemple:', details[0]);
    }
  }

  // 3. Vérifier la relation commande -> détails
  if (commandes && commandes.length > 0) {
    const premierCommandeId = commandes[0].idcommande;
    console.log(`\n3. 🔗 RELATION Commande ${premierCommandeId} -> Détails:`);

    const { data: detailsCommande, error: relationError } = await supabase
      .from('details_commande_db')
      .select('*')
      .eq('commande_r', premierCommandeId);

    if (relationError) {
      console.error('❌ Erreur relation:', relationError);
    } else {
      console.log(`✅ ${detailsCommande?.length || 0} détails pour commande ${premierCommandeId}`);
      if (detailsCommande && detailsCommande.length > 0) {
        console.log('📄 Exemple détail:', detailsCommande[0]);
      }
    }
  }

  // 4. Tester la requête complète comme dans useCommandesAdmin
  console.log('\n4. 🧪 TEST REQUÊTE COMPLÈTE:');
  const { data: testCommandes, error: testError } = await supabase
    .from('commande_db')
    .select(`
      *,
      client_db (
        nom,
        prenom,
        email
      ),
      details_commande_db (
        *,
        plats_db (*),
        extras_db (*)
      )
    `)
    .limit(1);

  if (testError) {
    console.error('❌ Erreur requête complète:', testError);
  } else {
    console.log(`✅ Test réussi - ${testCommandes?.length || 0} commandes`);
    if (testCommandes && testCommandes.length > 0) {
      const commande = testCommandes[0];
      console.log('📊 Structure:', {
        idcommande: commande.idcommande,
        client_db: commande.client_db ? 'Présent' : 'Absent',
        details_commande_db: commande.details_commande_db ? {
          count: commande.details_commande_db.length,
          exemple: commande.details_commande_db[0] || 'Aucun'
        } : 'Absent'
      });
    }
  }

  // 5. Vérifier les tables disponibles
  console.log('\n5. 📋 TABLES DISPONIBLES:');
  const tables = ['commande_db', 'details_commande_db', 'plats_db', 'extras_db', 'client_db'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Accessible (${data?.length || 0} rows test)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Exception - ${err.message}`);
    }
  }

  console.log('\n🏁 DIAGNOSTIC TERMINÉ');
}

debugDatabase().catch(console.error);