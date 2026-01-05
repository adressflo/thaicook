/**
 * Script pour créer les comptes de test Playwright via Better Auth API
 *
 * Usage: npx tsx scripts/create-test-accounts-api.ts
 *
 * Ce script utilise l'API Better Auth pour créer les comptes,
 * évitant ainsi les conflits avec Prisma en cours d'exécution.
 */

const BASE_URL = 'http://localhost:3001';

const TEST_ACCOUNTS = [
  {
    email: 'client-test@example.com',
    password: 'TestClient123!',
    name: 'Client Test',
    role: 'client' as const,
  },
  {
    email: 'admin-test@example.com',
    password: 'TestAdmin123!',
    name: 'Admin Test',
    role: 'admin' as const,
  },
];

async function signUp(account: typeof TEST_ACCOUNTS[0]) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: account.email,
        password: account.password,
        name: account.name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Vérifier si le compte existe déjà
      if (data.error && data.error.includes('already exists')) {
        console.log(`⚠️  [${account.role.toUpperCase()}] Compte ${account.email} existe déjà`);
        return { exists: true, account };
      }

      throw new Error(data.error || `HTTP ${response.status}`);
    }

    console.log(`✅ [${account.role.toUpperCase()}] Compte créé : ${account.email}`);
    console.log(`   Password: ${account.password}`);
    console.log(`   User ID: ${data.user?.id || 'N/A'}`);

    return { success: true, data, account };
  } catch (error) {
    console.error(`❌ [${account.role.toUpperCase()}] Erreur création ${account.email}:`, error);
    return { error: true, account };
  }
}

async function updateRole(userId: string, role: 'client' | 'admin') {
  // Note: Cette fonction nécessite une API admin pour mettre à jour le rôle
  // Pour l'instant, le rôle doit être défini manuellement dans la DB
  console.log(`⚠️  Note: Le rôle "${role}" doit être défini manuellement dans client_db pour userId: ${userId}`);
}

async function createTestAccounts() {
  console.log('🔐 Création des comptes de test Playwright via API...\n');
  console.log(`📍 Server: ${BASE_URL}\n`);

  // Vérifier que le serveur est accessible
  try {
    const healthCheck = await fetch(`${BASE_URL}/`);
    if (!healthCheck.ok) {
      throw new Error(`Server returned ${healthCheck.status}`);
    }
  } catch (error) {
    console.error('❌ Erreur: Le serveur dev n\'est pas accessible');
    console.error('   Lancer d\'abord: npm run dev');
    process.exit(1);
  }

  console.log('✅ Serveur accessible\n');

  const results = [];

  for (const account of TEST_ACCOUNTS) {
    const result = await signUp(account);
    results.push(result);

    // Attendre un peu entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Résumé:');
  console.log('='.repeat(60));

  const created = results.filter(r => r.success).length;
  const existing = results.filter(r => r.exists).length;
  const failed = results.filter(r => r.error).length;

  console.log(`✅ Créés: ${created}`);
  console.log(`⚠️  Déjà existants: ${existing}`);
  console.log(`❌ Échecs: ${failed}`);

  console.log('\n' + '='.repeat(60));
  console.log('📝 Prochaines étapes:');
  console.log('='.repeat(60));

  if (created > 0 || existing > 0) {
    console.log('\n1. ⚠️  Mettre à jour les rôles manuellement dans la DB:');
    console.log('   - client-test@example.com → role: "client"');
    console.log('   - admin-test@example.com → role: "admin"');
    console.log('   Table: client_db (colonne: role)');

    console.log('\n2. Exécuter les tests d\'authentification:');
    console.log('   npx playwright test tests/auth.setup.ts --project=setup');

    console.log('\n3. Vérifier les fichiers de storage state créés:');
    console.log('   tests/.auth/client.json');
    console.log('   tests/.auth/admin.json');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

createTestAccounts().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
