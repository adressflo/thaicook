const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdateQuantity() {
  console.log('🧪 Test de mise à jour de quantité...\n');

  // 1. Récupérer un détail de commande existant
  const { data: details, error: fetchError } = await supabase
    .from('details_commande_db')
    .select('iddetails, quantite_plat_commande, commande_r')
    .limit(1)
    .single();

  if (fetchError) {
    console.error('❌ Erreur récupération détail:', fetchError);
    return;
  }

  console.log('✅ Détail récupéré:', details);
  console.log(`   ID: ${details.iddetails}`);
  console.log(`   Quantité actuelle: ${details.quantite_plat_commande}`);
  console.log(`   Commande: ${details.commande_r}\n`);

  // 2. Tester l'update
  const newQuantity = details.quantite_plat_commande + 1;
  console.log(`🔄 Test update: ${details.quantite_plat_commande} → ${newQuantity}\n`);

  const { data: updateData, error: updateError } = await supabase
    .from('details_commande_db')
    .update({ quantite_plat_commande: newQuantity })
    .eq('iddetails', details.iddetails)
    .select();

  if (updateError) {
    console.error('❌ Erreur update:', updateError);
    console.error('   Message:', updateError.message);
    console.error('   Details:', updateError.details);
    console.error('   Hint:', updateError.hint);
    console.error('   Code:', updateError.code);
  } else {
    console.log('✅ Update réussi:', updateData);
  }

  // 3. Vérifier le résultat
  const { data: checkData } = await supabase
    .from('details_commande_db')
    .select('quantite_plat_commande')
    .eq('iddetails', details.iddetails)
    .single();

  console.log(`\n✅ Vérification: quantité = ${checkData?.quantite_plat_commande}`);

  // 4. Remettre l'ancienne valeur
  await supabase
    .from('details_commande_db')
    .update({ quantite_plat_commande: details.quantite_plat_commande })
    .eq('iddetails', details.iddetails);

  console.log(`🔄 Remise à la valeur originale: ${details.quantite_plat_commande}`);
}

testUpdateQuantity().catch(console.error);
