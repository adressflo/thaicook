'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

/**
 * Récupère le profil client complet de l'utilisateur connecté
 * @returns Le profil client ou null si non trouvé
 */
export async function getClientProfile() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return null;
  }

  try {
    const profile = await prisma.client_db.findUnique({
      where: {
        auth_user_id: session.user.id,
      },
    });

    return profile;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
}



const UpdateProfileSchema = z.object({
  nom: z.string().min(1, { message: 'Le nom est requis.' }),
  prenom: z.string().min(1, { message: 'Le prénom est requis.' }),
  numeroTelephone: z.string().min(1, { message: 'Le numéro de téléphone est requis.' }),
  adresseNumeroRue: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  preferenceClient: z.string().optional(),
  newsletterPreference: z.string(),
  date_de_naissance: z.string().optional(),
});

export async function updateUserProfile(formData: FormData) {
  // 1. Vérifier la session utilisateur (corrigé)
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: 'Non autorisé' };
  }

  // 2. Valider les données
  const data = Object.fromEntries(formData.entries());
  const validatedFields = UpdateProfileSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Données invalides.',
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 3. Préparer les données pour la base de données (corrigé)
  const dataToUpdate = {
    ...validatedFields.data,
    codePostal: validatedFields.data.codePostal ? parseInt(validatedFields.data.codePostal, 10) : null,
    souhaitez_vous_recevoir_actualites: validatedFields.data.newsletterPreference === "Oui, j'accepte",
    // comment_avez_vous_connu: formData.getAll('commentConnuChanthana') as SourceConnaissance[],
  };

  // 4. Mettre à jour la base de données avec Prisma
  try {
    await prisma.client_db.update({
      where: {
        auth_user_id: session.user.id,
      },
      data: dataToUpdate,
    });

    revalidatePath('/profil');
    return { success: true, message: 'Profil mis à jour avec succès !' };
  } catch (e) {
    return { success: false, error: 'Une erreur est survenue.' };
  }
}

export async function updateProfilePhoto(photoUrl: string) {
  'use server';

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: 'Non autorisé' };
  }

  try {
    await prisma.client_db.update({
      where: {
        auth_user_id: session.user.id,
      },
      data: {
        photo_client: photoUrl,
      },
    });

    revalidatePath('/profil');
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Impossible de mettre à jour la photo.' };
  }
}

export async function deleteProfilePhotoAction() {
  'use server';

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: 'Non autorisé' };
  }

  try {
    await prisma.client_db.update({
      where: {
        auth_user_id: session.user.id,
      },
      data: {
        photo_client: null,
      },
    });

    revalidatePath('/profil');
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Impossible de supprimer la photo.' };
  }
}
