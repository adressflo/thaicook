import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/lib/prisma";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email-sender";

export const auth = betterAuth({
  appName: "APPCHANTHANA", // Nom de votre application
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", // URL de base de votre application
  secret: process.env.BETTER_AUTH_SECRET!, // Clé secrète pour la sécurité

  // Autoriser plusieurs origines pour multi-instance en développement
  trustedOrigins: process.env.NODE_ENV === 'development'
    ? ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"]
    : undefined,

  database: prismaAdapter(prisma, {
    provider: "postgresql", // Ou le type de votre base de données si différent
    usePlural: false,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, // ⚠️ TEMPORAIRE : Désactivé pour tests - À réactiver en production
    sendResetPassword: sendPasswordResetEmail,
  },

  emailVerification: {
    sendOnSignUp: true, // Envoi automatique email vérification à l'inscription
    autoSignInAfterVerification: true, // Connexion automatique après vérification
    sendVerificationEmail: sendVerificationEmail,
  },

  // Next.js cookies plugin (MUST be last in the array)
  plugins: [
    nextCookies()
  ],
});

export type Session = typeof auth.$Infer.Session;