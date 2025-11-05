"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { type SignupInput } from "@/lib/validations";
import { z } from "zod";

/**
 * Type for signup profile data (without password fields)
 * Used to create client profile after Better Auth user creation
 */
export type SignUpProfileInput = Omit<SignupInput, 'password' | 'confirmPassword'>;

/**
 * Create a client profile in client_db after Better Auth user creation
 * Called from signup page after successful signUp.email()
 *
 * Note: Validation is done by signupSchema in lib/validations.ts before calling this function
 *
 * @param authUserId - The Better Auth user ID (from session.user.id)
 * @param data - Client profile data from signup form (already validated)
 */
export async function createClientProfile(
  authUserId: string,
  data: SignUpProfileInput
) {
  try {
    // Check if profile already exists
    const existing = await prisma.client_db.findUnique({
      where: { auth_user_id: authUserId }
    });

    if (existing) {
      return {
        success: false,
        error: "Un profil existe déjà pour cet utilisateur"
      };
    }

    // Validate and parse date_de_naissance
    let parsedDate: Date | null = null;
    if (data.date_de_naissance) {
      if (typeof data.date_de_naissance !== 'string') {
        return {
          success: false,
          error: "Format de date invalide"
        };
      }
      const tempDate = new Date(data.date_de_naissance);
      if (isNaN(tempDate.getTime())) {
        return {
          success: false,
          error: "Date de naissance invalide"
        };
      }
      parsedDate = tempDate;
    }

    // Create client profile
    await prisma.client_db.create({
      data: {
        auth_user_id: authUserId,
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        numero_de_telephone: data.numero_de_telephone,
        date_de_naissance: parsedDate,
        adresse_numero_et_rue: data.adresse_numero_et_rue,
        code_postal: data.code_postal ? parseInt(data.code_postal, 10) : null,
        ville: data.ville,
        preference_client: data.preference_client,
        souhaitez_vous_recevoir_actualites: data.souhaitez_vous_recevoir_actualites ?? false,
        comment_avez_vous_connu: data.comment_avez_vous_connu || [],
        role: 'client', // Default role for new signups
      }
    });

    revalidatePath('/profil');

    return {
      success: true,
      message: "Profil créé avec succès"
    };
  } catch (error) {
    console.error("Error creating client profile:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Données invalides",
        details: error.flatten().fieldErrors
      };
    }

    return {
      success: false,
      error: "Une erreur est survenue lors de la création du profil"
    };
  }
}
