"use client";

import { createAuthClient } from "better-auth/react";
// Importez les plugins client si vous en utilisez côté serveur
// import { organizationClient, twoFactorClient, passkeyClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  fetchOptions: {
    onError(error) {
      // Log complet de l'erreur pour debugging
      console.error("🔴 Better Auth Error (Full Object):", error);
      console.error("🔴 Error details:", {
        status: error.error?.status,
        statusText: error.error?.statusText,
        message: error.error?.message,
        body: error.error?.body,
      });

      if (error.error.status === 429) {
        console.error("Too many requests. Please try again later.");
      } else if (error.error.status === 401) {
        console.error("Unauthorized");
      } else {
        console.error("Auth action failed:", error.error.message || "Unknown error");
      }
    },
    onSuccess(data) {
      console.log("✅ Auth action successful:", data);
    },
  },

  plugins: [
    // Ajoutez les plugins client ici si vous les avez activés côté serveur
    // organizationClient(),
    // twoFactorClient({
    //   twoFactorPage: "/two-factor",
    //   onTwoFactorRedirect() {
    //     window.location.href = "/two-factor";
    //   },
    // }),
    // passkeyClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  // Exportez les fonctions des plugins si vous les utilisez
  // organization,
  // twoFactor,
  // passkey,
} = authClient;