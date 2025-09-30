const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc3MzUxNywiZXhwIjoyMDY1MzQ5NTE3fQ.kprjLfpXeQBWx4_W0Aq_-5xq8lJYGIoLPUwm_sV8c4c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function activateRealtime() {
  console.log('🔧 Activation Real-time Supabase via service_role key...\n');

  try {
    // Exécuter les commandes SQL pour activer Real-time
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        BEGIN;
        
        ALTER TABLE commande_db REPLICA IDENTITY FULL;
        ALTER TABLE details_commande_db REPLICA IDENTITY FULL;
        
        ALTER PUBLICATION supabase_realtime ADD TABLE commande_db;
        ALTER PUBLICATION supabase_realtime ADD TABLE details_commande_db;
        
        COMMIT;
      `
    });

    if (error) {
      console.error('❌ Erreur activation Real-time:', error);
      console.log('\n💡 Note: L\'API RPC exec_sql n\'existe peut-être pas.');
      console.log('📋 Veuillez exécuter le script SQL manuellement dans le SQL Editor:\n');
      console.log('scripts/activate-realtime-supabase.sql');
      return;
    }

    console.log('✅ Real-time activé avec succès !');
    console.log('📊 Résultat:', data);

    // Vérifier l'activation
    const { data: verification, error: verifyError } = await supabase
      .from('pg_publication_tables')
      .select('schemaname, tablename, pubinsert, pubupdate, pubdelete')
      .eq('pubname', 'supabase_realtime')
      .in('tablename', ['commande_db', 'details_commande_db']);

    if (verifyError) {
      console.warn('⚠️ Impossible de vérifier l\'activation:', verifyError.message);
    } else {
      console.log('\n✅ Vérification des publications:');
      console.table(verification);
    }

  } catch (err) {
    console.error('❌ Erreur:', err);
    console.log('\n📋 Veuillez exécuter manuellement le SQL dans scripts/activate-realtime-supabase.sql');
  }
}

activateRealtime();
