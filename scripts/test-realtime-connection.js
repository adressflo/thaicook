const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Test de connexion Real-time Supabase...\n');

const channel = supabase
  .channel('test-realtime-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'commande_db',
    },
    (payload) => {
      console.log('🔔 Événement reçu:', payload);
    }
  )
  .subscribe((status) => {
    console.log('📡 Statut subscription:', status);
    
    if (status === 'SUBSCRIBED') {
      console.log('✅ Real-time connecté avec succès !');
      console.log('🔍 En attente d\'événements... (modifiez une commande pour tester)');
    } else if (status === 'CHANNEL_ERROR') {
      console.error('❌ Erreur de connexion au channel');
    } else if (status === 'TIMED_OUT') {
      console.error('⏱️ Timeout de connexion');
    }
  });

// Garder le script actif
setTimeout(() => {
  console.log('\n⏹️ Arrêt du test après 30 secondes');
  channel.unsubscribe();
  process.exit(0);
}, 30000);
