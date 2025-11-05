import prisma from '../lib/prisma';

async function deleteTestAccount() {
  const email = 'adressflo@gmail.com';

  try {
    // 1. Find and delete from client_db
    const client = await prisma.client_db.findFirst({
      where: { email }
    });

    if (client) {
      await prisma.client_db.delete({
        where: { idclient: client.idclient }
      });
      console.log(`✅ Client profile deleted: ${email}`);
    }

    // 2. Find and delete user from Better Auth
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      // Delete sessions first
      await prisma.session.deleteMany({
        where: { userId: user.id }
      });

      // Delete user
      await prisma.user.delete({
        where: { id: user.id }
      });
      console.log(`✅ Better Auth user deleted: ${email}`);
    }

    console.log('✅ Test account cleanup completed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTestAccount();
