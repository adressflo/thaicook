// Script pour déboguer le lien entre commande_db et client_db
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY non trouvé');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugClientLinks() {
  console.log('🔍 Vérification des liens client_r dans commande_db...\n');

  // 1. Récupérer dernières commandes
  const { data: commandes, error: cmdError } = await supabase
    .from('commande_db')
    .select('idcommande, client_r, client_r_id')
    .order('date_de_prise_de_commande', { ascending: false })
    .limit(10);

  if (cmdError) {
    console.error('❌ Erreur récupération commandes:', cmdError);
    return;
  }

  console.log(`✅ ${commandes.length} dernières commandes récupérées\n`);

  // 2. Pour chaque commande, vérifier si le client existe
  for (const cmd of commandes) {
    console.log(`\n📦 Commande #${cmd.idcommande}`);
    console.log(`   client_r (firebase_uid): ${cmd.client_r || 'NON DÉFINI'}`);
    console.log(`   client_r_id: ${cmd.client_r_id || 'NON DÉFINI'}`);

    if (cmd.client_r) {
      // Chercher par firebase_uid
      const { data: clientByUID, error: uidError } = await supabase
        .from('client_db')
        .select('idclient, nom, prenom, firebase_uid')
        .eq('firebase_uid', cmd.client_r)
        .single();

      if (uidError) {
        console.log(`   ❌ Client firebase_uid="${cmd.client_r}" introuvable:`, uidError.message);
      } else {
        console.log(`   ✅ Client trouvé: ${clientByUID.prenom} ${clientByUID.nom} (ID: ${clientByUID.idclient})`);
      }
    }

    if (cmd.client_r_id && cmd.client_r_id !== 0) {
      // Chercher par idclient
      const { data: clientByID, error: idError } = await supabase
        .from('client_db')
        .select('idclient, nom, prenom, firebase_uid')
        .eq('idclient', cmd.client_r_id)
        .single();

      if (idError) {
        console.log(`   ❌ Client idclient=${cmd.client_r_id} introuvable:`, idError.message);
      } else {
        console.log(`   ✅ Client par ID: ${clientByID.prenom} ${clientByID.nom} (UID: ${clientByID.firebase_uid})`);
      }
    }
  }

  console.log('\n\n🔍 Test JOIN Supabase (comme useCommandesAdmin)...\n');

  // 3. Tester le JOIN exact de useCommandesAdmin
  const { data: joinTest, error: joinError } = await supabase
    .from('commande_db')
    .select(`
      idcommande,
      client_r,
      client_r_id,
      client_db (
        nom,
        prenom,
        firebase_uid,
        idclient
      )
    `)
    .order('date_de_prise_de_commande', { ascending: false })
    .limit(5);

  if (joinError) {
    console.error('❌ Erreur JOIN test:', joinError);
    return;
  }

  console.log('✅ Résultat JOIN:');
  joinTest.forEach((cmd) => {
    console.log(`\n   Commande #${cmd.idcommande}:`);
    console.log(`   - client_r: ${cmd.client_r || 'NULL'}`);
    console.log(`   - client_r_id: ${cmd.client_r_id || 'NULL'}`);
    console.log(`   - client_db JOIN: ${cmd.client_db ? JSON.stringify(cmd.client_db) : 'NULL (pas de relation)'}`);
  });
}

debugClientLinks().catch(console.error);
