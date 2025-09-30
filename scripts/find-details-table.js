// Script pour trouver la vraie table des détails de commandes
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function findDetailsTable() {
  console.log('🔍 RECHERCHE DE LA VRAIE TABLE DES DÉTAILS');
  console.log('==========================================');

  // Tables candidates pour les détails de commandes
  const candidateTables = [
    'details_commande_db',    // Table actuelle (vide)
    'detail_commande_db',     // Possible variation
    'commande_details',       // Possible autre nom
    'order_details',          // Nom anglais
    'commande_items',         // Autre variation
    'items_commande',         // Autre variation
    'plats_commande',         // Si direct
    'commande_plats',         // Si direct
    'lignes_commande',        // Autre nom possible
    'articles_commande'       // Autre nom possible
  ];

  console.log('\n1. 🔍 TEST DES TABLES CANDIDATES:');
  for (const table of candidateTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: EXISTE ! (${data?.length || 0} rows)`);
        if (data && data.length > 0) {
          console.log(`   📄 Structure:`, Object.keys(data[0]));
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: Exception - ${err.message}`);
    }
  }

  // Rechercher dans les types Supabase générés pour trouver les vraies tables
  console.log('\n2. 🔍 ANALYSE DES COMMANDES EXISTANTES:');

  // Prendre une commande et essayer de trouver ses détails
  const { data: commandes } = await supabase
    .from('commande_db')
    .select('*')
    .limit(3);

  if (commandes && commandes.length > 0) {
    console.log(`✅ ${commandes.length} commandes trouvées pour analyse`);

    for (const commande of commandes) {
      console.log(`\n📋 Commande ${commande.idcommande}:`);
      console.log(`   Client: ${commande.client_r}`);
      console.log(`   Date: ${commande.date_de_prise_de_commande}`);

      // Essayer de trouver les détails par différentes clés
      const possibleKeys = [
        { table: 'details_commande_db', key: 'commande_r', value: commande.idcommande },
        { table: 'details_commande_db', key: 'commande_id', value: commande.idcommande },
        { table: 'details_commande_db', key: 'idcommande', value: commande.idcommande },
        { table: 'plats_commande', key: 'commande_id', value: commande.idcommande },
        { table: 'lignes_commande', key: 'commande_id', value: commande.idcommande }
      ];

      for (const { table, key, value } of possibleKeys) {
        try {
          const { data: details, error } = await supabase
            .from(table)
            .select('*')
            .eq(key, value);

          if (!error && details && details.length > 0) {
            console.log(`   ✅ TROUVÉ ! ${table}.${key} = ${value} → ${details.length} détails`);
            console.log(`   📄 Exemple:`, details[0]);
            return; // On a trouvé !
          }
        } catch (err) {
          // Table n'existe pas, continuer
        }
      }
    }
  }

  console.log('\n3. 🔍 VÉRIFICATION DES RELATIONS DANS LES TYPES:');
  console.log('Vérifiez le fichier types/supabase.ts pour voir les vraies tables...');

  console.log('\n🏁 RECHERCHE TERMINÉE');
}

findDetailsTable().catch(console.error);