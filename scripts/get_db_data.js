require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function getData() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Fetching plats...');
  const { data: plats, error: platsError } = await supabase.from('plats_db').select('*');
  if (platsError) {
    console.error('Error fetching plats:', platsError);
  } else {
    console.log('Plats:', JSON.stringify(plats, null, 2));
  }

  console.log('\nFetching extras...');
  const { data: extras, error: extrasError } = await supabase.from('extras_db').select('*');
  if (extrasError) {
    console.error('Error fetching extras:', extrasError);
  } else {
    console.log('Extras:', JSON.stringify(extras, null, 2));
  }
}

getData();
