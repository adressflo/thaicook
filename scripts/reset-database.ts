import prisma from '../lib/prisma';

async function resetDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // 1. Delete details_commande_db (depends on commande_db)
    const deletedDetails = await prisma.details_commande_db.deleteMany({});
    console.log(`✅ Deleted ${deletedDetails.count} command details`);

    // 2. Delete commande_db (depends on client_db)
    const deletedCommandes = await prisma.commande_db.deleteMany({});
    console.log(`✅ Deleted ${deletedCommandes.count} commands`);

    // 3. Delete evenements_db (if exists)
    const deletedEvenements = await prisma.evenements_db.deleteMany({});
    console.log(`✅ Deleted ${deletedEvenements.count} events`);

    // 4. Delete sessions (depends on user)
    const deletedSessions = await prisma.session.deleteMany({});
    console.log(`✅ Deleted ${deletedSessions.count} sessions`);

    // 5. Delete verification tokens
    const deletedVerifications = await prisma.verification.deleteMany({});
    console.log(`✅ Deleted ${deletedVerifications.count} verification tokens`);

    // 6. Delete accounts (if exists)
    try {
      const deletedAccounts = await prisma.account.deleteMany({});
      console.log(`✅ Deleted ${deletedAccounts.count} accounts`);
    } catch (error) {
      console.log('ℹ️  No accounts table');
    }

    // 7. Delete client_db
    const deletedClients = await prisma.client_db.deleteMany({});
    console.log(`✅ Deleted ${deletedClients.count} client profiles`);

    // 8. Delete users (Better Auth)
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${deletedUsers.count} users`);

    console.log('\n✅ Database cleanup completed! Ready for fresh tests.');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
