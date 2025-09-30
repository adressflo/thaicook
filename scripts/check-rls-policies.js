const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLS() {
  console.log('🔍 Vérification RLS policies sur details_commande_db...\n');

  // Test 1: SELECT
  const { data: selectData, error: selectError } = await supabase
    .from('details_commande_db')
    .select('iddetails')
    .limit(1);

  console.log('📖 SELECT:', selectError ? `❌ ${selectError.message}` : `✅ ${selectData?.length} rows`);

  // Test 2: UPDATE sans auth
  const { error: updateError } = await supabase
    .from('details_commande_db')
    .update({ quantite_plat_commande: 999 })
    .eq('iddetails', 99999); // ID qui n'existe pas

  console.log('✏️ UPDATE:', updateError ? `❌ ${updateError.message} (code: ${updateError.code})` : '✅ OK');

  // Test 3: INSERT sans auth
  const { error: insertError } = await supabase
    .from('details_commande_db')
    .insert({
      commande_r: 999,
      plat_r: 1,
      quantite_plat_commande: 1
    });

  console.log('➕ INSERT:', insertError ? `❌ ${insertError.message} (code: ${insertError.code})` : '✅ OK');

  console.log('\n💡 Note: Les erreurs 42501 indiquent que RLS est actif et bloque les opérations');
}

checkRLS().catch(console.error);
