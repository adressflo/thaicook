"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

/**
 * Schema pour la création d'un profil client lors de l'inscription
 * Champs obligatoires: email, nom, prenom, numero_de_telephone
 * Autres champs optionnels
 */
const SignUpProfileSchema = z.object({
  // Champs obligatoires
  email: z.string().email("Email invalide"),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  numero_de_telephone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),

  // Champs optionnels
  date_de_naissance: z.string().optional(),
  adresse_numero_et_rue: z.string().optional(),
  code_postal: z.string().optional(),
  ville: z.string().optional(),
  preference_client: z.string().optional(),
  souhaitez_vous_recevoir_actualites: z.boolean().default(false),
  comment_avez_vous_connu: z.array(z.enum([
    "BoucheAOreille",
    "ReseauxSociaux",
    "RechercheGoogle",
    "EnPassantDevant",
    "RecommandationAmi",
    "Autre"
  ])).optional(),
});

export type SignUpProfileInput = z.infer<typeof SignUpProfileSchema>;

/**
 * Create a client profile in client_db after Better Auth user creation
 * Called from signup page after successful signUp.email()
 *
 * @param authUserId - The Better Auth user ID (from session.user.id)
 * @param data - Client profile data from signup form
 */
export async function createClientProfile(
  authUserId: string,
  data: SignUpProfileInput
) {
  try {
    // Validate input data
    const validated = SignUpProfileSchema.parse(data);

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

    // Create client profile
    await prisma.client_db.create({
      data: {
        auth_user_id: authUserId,
        email: validated.email,
        nom: validated.nom,
        prenom: validated.prenom,
        numero_de_telephone: validated.numero_de_telephone,
        date_de_naissance: validated.date_de_naissance ? new Date(validated.date_de_naissance) : null,
        adresse_numero_et_rue: validated.adresse_numero_et_rue,
        code_postal: validated.code_postal ? parseInt(validated.code_postal, 10) : null,
        ville: validated.ville,
        preference_client: validated.preference_client,
        souhaitez_vous_recevoir_actualites: validated.souhaitez_vous_recevoir_actualites,
        comment_avez_vous_connu: validated.comment_avez_vous_connu || [],
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
