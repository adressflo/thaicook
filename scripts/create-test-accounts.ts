/**
 * Script pour créer les comptes de test Playwright
 *
 * Usage: npx tsx scripts/create-test-accounts.ts
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const TEST_ACCOUNTS = [
  {
    email: 'client-test@example.com',
    password: 'TestClient123!',
    role: 'client' as const,
    name: 'Client Test',
    emailVerified: true,
  },
  {
    email: 'admin-test@example.com',
    password: 'TestAdmin123!',
    role: 'admin' as const,
    name: 'Admin Test',
    emailVerified: true,
  },
];

async function createTestAccounts() {
  console.log('🔐 Création des comptes de test Playwright...\n');

  for (const account of TEST_ACCOUNTS) {
    try {
      // Vérifier si le compte existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: account.email },
      });

      if (existingUser) {
        console.log(`⚠️  [${account.role.toUpperCase()}] Compte ${account.email} existe déjà`);
        continue;
      }

      // Hasher le mot de passe (Better Auth utilise bcrypt avec 10 rounds par défaut)
      const hashedPassword = await hash(account.password, 10);

      // Créer l'utilisateur Better Auth
      const user = await prisma.user.create({
        data: {
          email: account.email,
          name: account.name,
          emailVerified: account.emailVerified,
        },
      });

      // Créer l'account Better Auth (password)
      await prisma.account.create({
        data: {
          userId: user.id,
          accountId: user.id,
          providerId: 'credential',
          password: hashedPassword,
        },
      });

      // Créer le profil client_db lié
      await prisma.client_db.create({
        data: {
          auth_user_id: user.id,
          email: account.email,
          nom: 'Test',
          prenom: account.name,
          role: account.role,
          souhaitez_vous_recevoir_actualites: false,
        },
      });

      console.log(`✅ [${account.role.toUpperCase()}] Compte créé : ${account.email}`);
      console.log(`   Password: ${account.password}`);

    } catch (error) {
      console.error(`❌ [${account.role.toUpperCase()}] Erreur création ${account.email}:`, error);
    }
  }

  console.log('\n✅ Script terminé !');
  console.log('\n📝 Prochaine étape : Exécuter les tests setup');
  console.log('   npx playwright test tests/auth.setup.ts --project=setup\n');

  await prisma.$disconnect();
}

createTestAccounts().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
