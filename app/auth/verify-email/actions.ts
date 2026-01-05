"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { verifyEmailSchema } from "@/lib/validations";

/**
 * Verify email address using token from email link
 * Called when user clicks verification link in email
 *
 * @param token - Verification token from email URL
 * @returns Success status or error message
 */
export async function verifyEmailToken(token: string) {
  try {
    // Validate token format
    verifyEmailSchema.parse({ token });

    // Verify email via Better Auth API
    const result = await auth.api.verifyEmail({
      query: {
        token,
      },
      headers: await headers(),
    });

    if (!result) {
      return {
        success: false,
        error: "Le lien de vérification est invalide ou a expiré"
      };
    }

    return {
      success: true,
      message: "Email vérifié avec succès ! Vous allez être redirigé..."
    };
  } catch (error) {
    console.error("Email verification error:", error);

    return {
      success: false,
      error: "Une erreur est survenue lors de la vérification de l'email"
    };
  }
}

/**
 * Resend verification email to user
 * Called when user clicks "Renvoyer l'email" button
 *
 * @param email - User's email address
 * @returns Success status or error message
 */
export async function resendVerificationEmail(email: string) {
  try {
    // Resend verification email via Better Auth
    const result = await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/verify-email`,
      },
    });

    if (!result) {
      return {
        success: false,
        error: "Impossible d'envoyer l'email de vérification"
      };
    }

    return {
      success: true,
      message: "Email de vérification renvoyé ! Vérifiez votre boîte de réception."
    };
  } catch (error) {
    console.error("Resend verification email error:", error);

    return {
      success: false,
      error: "Une erreur est survenue lors de l'envoi de l'email"
    };
  }
}
