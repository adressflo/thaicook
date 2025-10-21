import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { customSession } from "better-auth/plugins";
import { sendVerificationEmail, sendResetPasswordEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    modelName: "client_db",
    fields: {
      id: "idclient",
      name: "nom",
      email: "email",
      image: "photo_client"
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Mettre à true pour forcer la vérification d'email
    sendVerificationEmail: async ({ email, url }) => {
      try {
        await sendVerificationEmail(email, url);
      } catch (error) {
        console.error('Échec de l\'envoi de l\'email de vérification:', error);
        // Better Auth handle l'erreur, on log seulement
      }
    },
    sendResetPassword: async ({ email, url }) => {
      try {
        await sendResetPasswordEmail(email, url);
      } catch (error) {
        console.error('Échec de l\'envoi de l\'email de réinitialisation:', error);
        // Better Auth handle l'erreur, on log seulement
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  },
  plugins: [
    customSession(async ({ user, session }) => {
      if (!user) {
        return { user, session };
      }
      // Find the full user profile in our own database
      const userDetails = await prisma.client_db.findUnique({
        where: { 
          // The id from the base user object corresponds to the idclient
          idclient: user.id as any 
        },
      });

      // If no details are found, something is wrong, but we return the base user for now
      if (!userDetails) {
        return { user, session };
      }

      // Merge the base user with our detailed profile
      const fullUser = { ...user, ...userDetails };

      return {
        session,
        user: fullUser,
      };
    }),
  ],
});
