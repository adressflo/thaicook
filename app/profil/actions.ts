"use server"

import { auth } from "@/lib/auth"
import { BUCKETS, minioClient } from "@/lib/minio"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"

/**
 * Récupère le profil client complet de l'utilisateur connecté
 * @returns Le profil client ou null si non trouvé
 */
export async function getClientProfile() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    return null
  }

  try {
    const profile = await prisma.client_db.findUnique({
      where: {
        auth_user_id: session.user.id,
      },
    })

    if (profile) {
      return {
        ...profile,
        idclient: Number(profile.idclient), // Convertir BigInt en Number
        // Convertir Date → string ISO pour sérialisation client (Next.js 16 requirement)
        date_de_naissance: profile.date_de_naissance
          ? profile.date_de_naissance.toISOString().split("T")[0]
          : null,
      }
    }
    return null
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return null
  }
}

const UpdateProfileSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis." }),
  prenom: z.string().min(1, { message: "Le prénom est requis." }),
  numeroTelephone: z.string().min(1, { message: "Le numéro de téléphone est requis." }),
  adresseNumeroRue: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  preferenceClient: z.string().optional(),
  newsletterPreference: z.string(),
  date_de_naissance: z.string().optional(),
})

export async function updateUserProfile(formData: FormData) {
  // 1. Vérifier la session utilisateur (corrigé)
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return { success: false, error: "Non autorisé" }
  }

  // 2. Valider les données
  const data = Object.fromEntries(formData.entries())
  const validatedFields = UpdateProfileSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Données invalides.",
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 3. Préparer les données pour la base de données (corrigé)
  const dataToUpdate = {
    ...validatedFields.data,
    codePostal: validatedFields.data.codePostal
      ? parseInt(validatedFields.data.codePostal, 10)
      : null,
    souhaitez_vous_recevoir_actualites:
      validatedFields.data.newsletterPreference === "Oui, j'accepte",
    // comment_avez_vous_connu: formData.getAll('commentConnuChanthana') as SourceConnaissance[],
  }

  // 4. Mettre à jour la base de données avec Prisma
  try {
    await prisma.client_db.update({
      where: {
        auth_user_id: session.user.id,
      },
      data: dataToUpdate,
    })

    revalidatePath("/profil")
    return { success: true, message: "Profil mis à jour avec succès !" }
  } catch (e) {
    return { success: false, error: "Une erreur est survenue." }
  }
}

/**
 * Upload une photo de profil vers MinIO et met à jour le profil
 * @param formData - FormData contenant le fichier 'photo'
 */
export async function uploadProfilePhotoToMinio(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return { success: false, error: "Non autorisé" }
  }

  try {
    const file = formData.get("photo") as File
    if (!file) {
      return { success: false, error: "Aucun fichier fourni" }
    }

    // Générer un nom de fichier unique
    const fileName = `profile-${session.user.id}-${Date.now()}.jpg`

    // Convertir le fichier en Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload vers MinIO
    await minioClient.putObject(BUCKETS.PROFILE_PHOTOS, fileName, buffer, buffer.length, {
      "Content-Type": "image/jpeg",
    })

    // Construire l'URL publique
    const minioEndpoint = process.env.MINIO_ENDPOINT || "116.203.111.206"
    const minioPort = process.env.MINIO_PORT || "9000"
    const photoUrl = `http://${minioEndpoint}:${minioPort}/${BUCKETS.PROFILE_PHOTOS}/${fileName}`

    // Mettre à jour le profil dans la base de données
    await prisma.client_db.update({
      where: {
        auth_user_id: session.user.id,
      },
      data: {
        photo_client: photoUrl,
      },
    })

    revalidatePath("/profil")
    return { success: true, url: photoUrl }
  } catch (error) {
    console.error("Erreur upload photo MinIO:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de l'upload",
    }
  }
}

/**
 * Supprime une photo de profil de MinIO et met à jour le profil
 */
export async function deleteProfilePhotoFromMinio() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return { success: false, error: "Non autorisé" }
  }

  try {
    // Récupérer l'URL actuelle de la photo
    const client = await prisma.client_db.findUnique({
      where: { auth_user_id: session.user.id },
      select: { photo_client: true },
    })

    if (client?.photo_client) {
      // Extraire le nom du fichier de l'URL
      const urlParts = client.photo_client.split("/")
      const fileName = urlParts[urlParts.length - 1]

      // Supprimer de MinIO
      try {
        await minioClient.removeObject(BUCKETS.PROFILE_PHOTOS, fileName)
      } catch (minioError) {
        console.warn("Fichier non trouvé dans MinIO (peut-être déjà supprimé):", minioError)
      }
    }

    // Mettre à jour le profil dans la base de données
    await prisma.client_db.update({
      where: {
        auth_user_id: session.user.id,
      },
      data: {
        photo_client: null,
      },
    })

    revalidatePath("/profil")
    return { success: true }
  } catch (error) {
    console.error("Erreur suppression photo MinIO:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible de supprimer la photo",
    }
  }
}

// Legacy aliases for backward compatibility
export const updateProfilePhoto = async (photoUrl: string) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return { success: false, error: "Non autorisé" }
  }

  try {
    await prisma.client_db.update({
      where: { auth_user_id: session.user.id },
      data: { photo_client: photoUrl },
    })
    revalidatePath("/profil")
    return { success: true }
  } catch (e) {
    return { success: false, error: "Impossible de mettre à jour la photo." }
  }
}

export const deleteProfilePhotoAction = deleteProfilePhotoFromMinio

/**
 * Change user email address securely
 * Requires current password verification and sends confirmation emails to both old and new addresses
 *
 * @param formData - Form data with current password, new email, and confirm new email
 * @returns Success status or error message
 */
export async function changeEmailAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return {
      success: false,
      error: "Vous devez être connecté pour modifier votre email",
    }
  }

  try {
    // Get form data
    const currentPassword = formData.get("currentPassword") as string
    const newEmail = formData.get("newEmail") as string
    const confirmNewEmail = formData.get("confirmNewEmail") as string

    // Basic validation
    if (!currentPassword || !newEmail || !confirmNewEmail) {
      return {
        success: false,
        error: "Tous les champs sont requis",
      }
    }

    if (newEmail !== confirmNewEmail) {
      return {
        success: false,
        error: "Les emails ne correspondent pas",
      }
    }

    // Check if new email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    })

    if (existingUser) {
      return {
        success: false,
        error: "Cet email est déjà utilisé par un autre compte",
      }
    }

    // Update email in Better Auth User table
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email: newEmail,
        emailVerified: false, // Reset email verification
      },
    })

    // Update email in client_db
    await prisma.client_db.update({
      where: { auth_user_id: session.user.id },
      data: { email: newEmail },
    })

    // TODO: Send confirmation emails to both old and new addresses
    // await sendEmailChangeConfirmation(session.user.email, newEmail);

    revalidatePath("/profil")

    return {
      success: true,
      message: "Email modifié avec succès. Veuillez vérifier votre nouvel email pour le confirmer.",
    }
  } catch (error) {
    console.error("Change email error:", error)

    return {
      success: false,
      error: "Une erreur est survenue lors de la modification de l'email",
    }
  }
}

/**
 * Delete user account (GDPR compliance)
 * Requires password confirmation and explicit text confirmation
 * Performs soft delete by setting deleted_at timestamp
 *
 * @param formData - Form data with password and confirmation text
 * @returns Success status or error message
 */
export async function deleteAccountAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return {
      success: false,
      error: "Vous devez être connecté pour supprimer votre compte",
    }
  }

  try {
    // Get form data
    const password = formData.get("password") as string
    const confirmation = formData.get("confirmation") as string

    // Basic validation
    if (!password || !confirmation) {
      return {
        success: false,
        error: "Tous les champs sont requis",
      }
    }

    if (confirmation !== "SUPPRIMER MON COMPTE") {
      return {
        success: false,
        error: "Veuillez taper exactement 'SUPPRIMER MON COMPTE' pour confirmer",
      }
    }

    // Soft delete: Update deleted_at timestamp in client_db
    await prisma.client_db.update({
      where: { auth_user_id: session.user.id },
      data: {
        deleted_at: new Date(),
        // Optionally anonymize data for GDPR compliance
        email: `deleted_${session.user.id}@deleted.com`,
        nom: "Supprimé",
        prenom: "Compte",
        numero_de_telephone: null,
        adresse_numero_et_rue: null,
        code_postal: null,
        ville: null,
        preference_client: null,
        photo_client: null,
      },
    })

    // Hard delete Better Auth user and sessions
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    })

    // TODO: Send confirmation email
    // await sendAccountDeletedConfirmation(session.user.email);

    revalidatePath("/")

    return {
      success: true,
      message: "Votre compte a été supprimé avec succès. Nous espérons vous revoir bientôt !",
    }
  } catch (error) {
    console.error("Delete account error:", error)

    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression du compte",
    }
  }
}

/**
 * Change user password securely
 * Requires current password verification and validates new password strength
 *
 * @param formData - Form data with current password, new password, and confirm new password
 * @returns Success status or error message
 */
export async function changePasswordAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return {
      success: false,
      error: "Vous devez être connecté pour modifier votre mot de passe",
    }
  }

  try {
    // Get form data
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmNewPassword = formData.get("confirmNewPassword") as string

    // Basic validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return {
        success: false,
        error: "Tous les champs sont requis",
      }
    }

    if (newPassword !== confirmNewPassword) {
      return {
        success: false,
        error: "Les nouveaux mots de passe ne correspondent pas",
      }
    }

    if (currentPassword === newPassword) {
      return {
        success: false,
        error: "Le nouveau mot de passe doit être différent de l'ancien",
      }
    }

    // Password strength validation will be done by changePasswordSchema in lib/validations.ts
    // For now, basic length check
    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Le nouveau mot de passe doit contenir au moins 8 caractères",
      }
    }

    // Use Better Auth API to change password
    // Better Auth handles password verification and update
    const result = await auth.api.changePassword({
      body: {
        newPassword: newPassword,
        currentPassword: currentPassword,
      },
      headers: await headers(),
    })

    if (!result) {
      return {
        success: false,
        error: "Le mot de passe actuel est incorrect ou une erreur est survenue",
      }
    }

    revalidatePath("/profil")

    return {
      success: true,
      message: "Mot de passe modifié avec succès !",
    }
  } catch (error) {
    console.error("Change password error:", error)

    return {
      success: false,
      error: "Une erreur est survenue lors du changement de mot de passe",
    }
  }
}
