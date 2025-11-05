import prisma from '../lib/prisma';

async function deleteAccount() {
  const email = 'fouquet_florian@hotmail.com';

  console.log('🧹 Suppression du compte:', email);

  try {
    // 1. Trouver le client
    const client = await prisma.client_db.findFirst({
      where: { email }
    });

    if (client) {
      console.log('✅ Client trouvé:', client.idclient);

      // 2. Supprimer les sessions associées
      if (client.auth_user_id) {
        const deletedSessions = await prisma.session.deleteMany({
          where: { userId: client.auth_user_id }
        });
        console.log(`✅ ${deletedSessions.count} session(s) supprimée(s)`);

        // 3. Supprimer l'utilisateur Better Auth
        const deletedUser = await prisma.user.deleteMany({
          where: { id: client.auth_user_id }
        });
        console.log(`✅ ${deletedUser.count} utilisateur(s) Better Auth supprimé(s)`);
      }

      // 4. Supprimer le profil client
      await prisma.client_db.delete({
        where: { idclient: client.idclient }
      });
      console.log('✅ Profil client supprimé');
    } else {
      console.log('ℹ️  Aucun compte trouvé avec cet email');
    }

    console.log('\n✅ Suppression terminée! Prêt pour le test.');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAccount();
