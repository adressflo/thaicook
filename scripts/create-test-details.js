// Script pour créer des données de test dans details_commande_db
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createTestDetails() {
  console.log('🔨 CRÉATION DE DONNÉES DE TEST POUR DÉTAILS COMMANDES');
  console.log('====================================================');

  // 1. Récupérer les commandes existantes
  const { data: commandes } = await supabase
    .from('commande_db')
    .select('idcommande')
    .limit(10);

  if (!commandes || commandes.length === 0) {
    console.log('❌ Aucune commande trouvée !');
    return;
  }

  console.log(`✅ ${commandes.length} commandes trouvées`);

  // 2. Récupérer les plats disponibles
  const { data: plats } = await supabase
    .from('plats_db')
    .select('idplats, plat, prix')
    .limit(10);

  if (!plats || plats.length === 0) {
    console.log('❌ Aucun plat trouvé !');
    return;
  }

  console.log(`✅ ${plats.length} plats disponibles`);

  // 3. Créer des détails de test pour chaque commande
  console.log('\\n🔨 Création des détails...');

  for (const commande of commandes) {
    // Ajouter 2-4 plats aléatoires par commande
    const nbPlats = Math.floor(Math.random() * 3) + 2; // 2 à 4 plats

    console.log(`\\n📋 Commande ${commande.idcommande} - Ajout de ${nbPlats} plats:`);

    for (let i = 0; i < nbPlats; i++) {
      const randomPlat = plats[Math.floor(Math.random() * plats.length)];
      const quantite = Math.floor(Math.random() * 3) + 1; // 1 à 3 quantité

      const detailData = {
        commande_r: commande.idcommande,
        plat_r: randomPlat.idplats,
        quantite_plat_commande: quantite,
        nom_plat: randomPlat.plat,
        prix_unitaire: randomPlat.prix,
        type: 'plat'
      };

      try {
        const { data, error } = await supabase
          .from('details_commande_db')
          .insert(detailData)
          .select();

        if (error) {
          console.log(`   ❌ Erreur: ${error.message}`);
        } else {
          console.log(`   ✅ ${quantite}x ${randomPlat.plat} (${randomPlat.prix}€)`);
        }
      } catch (err) {
        console.log(`   ❌ Exception: ${err.message}`);
      }
    }
  }

  // 4. Vérifier le résultat
  console.log('\\n🔍 VÉRIFICATION FINALE:');
  const { data: details } = await supabase
    .from('details_commande_db')
    .select('*')
    .limit(5);

  console.log(`✅ ${details?.length || 0} détails créés`);
  if (details && details.length > 0) {
    console.log('📄 Exemples:', details);
  }

  // 5. Test de la requête complète
  console.log('\\n🧪 TEST REQUÊTE COMPLÈTE:');
  const { data: testCommandes } = await supabase
    .from('commande_db')
    .select(`
      *,
      details_commande_db (
        *,
        plats_db (*)
      )
    `)
    .limit(1);

  if (testCommandes && testCommandes.length > 0) {
    const commande = testCommandes[0];
    console.log(`✅ Commande ${commande.idcommande}:`);
    console.log(`   Détails: ${commande.details_commande_db?.length || 0}`);
    if (commande.details_commande_db && commande.details_commande_db.length > 0) {
      console.log(`   Premier plat: ${commande.details_commande_db[0].plats_db?.plat || 'N/A'}`);
    }
  }

  console.log('\\n🏁 CRÉATION TERMINÉE - Rechargez votre page admin !');
}

createTestDetails().catch(console.error);