"use server"

import { BUCKETS, minioClient } from "@/lib/minio"
import { prisma } from "@/lib/prisma"
import { action } from "@/lib/safe-action"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema de validation pour un média hero
const heroMediaSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["image", "video"]),
  url: z.string().min(1, "URL requise"),
  titre: z.string().min(1, "Titre requis"),
  description: z.string().optional().nullable(),
  ordre: z.number().int().positive("L'ordre doit être un entier positif"),
  active: z.boolean().default(true),
})

// Schema pour la réorganisation
const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      ordre: z.number(),
    })
  ),
})

// Schema pour toggle active
const toggleActiveSchema = z.object({
  id: z.string(),
  active: z.boolean(),
})

// Schema pour suppression
const deleteSchema = z.object({
  id: z.string(),
  url: z.string(), // Pour supprimer le fichier de MinIO
})

/**
 * Récupérer tous les médias hero (actifs et inactifs)
 */
export const getAllHeroMedias = action.schema(z.object({})).action(async () => {
  const medias = await prisma.hero_media.findMany({
    orderBy: { ordre: "asc" },
  })
  return medias
})

/**
 * Créer un nouveau média hero
 */
export const createHeroMedia = action
  .schema(heroMediaSchema.omit({ id: true }))
  .action(async ({ parsedInput }) => {
    const newMedia = await prisma.hero_media.create({
      data: {
        type: parsedInput.type,
        url: parsedInput.url,
        titre: parsedInput.titre,
        description: parsedInput.description,
        ordre: parsedInput.ordre,
        active: parsedInput.active,
      },
    })

    revalidatePath("/")
    return newMedia
  })

/**
 * Mettre à jour un média hero
 */
export const updateHeroMedia = action.schema(heroMediaSchema).action(async ({ parsedInput }) => {
  if (!parsedInput.id) {
    throw new Error("ID requis pour la mise à jour")
  }

  const updatedMedia = await prisma.hero_media.update({
    where: { id: parsedInput.id },
    data: {
      type: parsedInput.type,
      url: parsedInput.url,
      titre: parsedInput.titre,
      description: parsedInput.description,
      ordre: parsedInput.ordre,
      active: parsedInput.active,
    },
  })

  revalidatePath("/")
  return updatedMedia
})

/**
 * Réorganiser les médias hero (drag & drop)
 */
export const reorderHeroMedias = action.schema(reorderSchema).action(async ({ parsedInput }) => {
  // Mettre à jour l'ordre de chaque média
  const updates = parsedInput.items.map((item) =>
    prisma.hero_media.update({
      where: { id: item.id },
      data: { ordre: item.ordre },
    })
  )

  await prisma.$transaction(updates)
  revalidatePath("/")

  return { success: true }
})

/**
 * Activer/désactiver un média hero
 */
export const toggleHeroMediaActive = action
  .schema(toggleActiveSchema)
  .action(async ({ parsedInput }) => {
    const updatedMedia = await prisma.hero_media.update({
      where: { id: parsedInput.id },
      data: { active: parsedInput.active },
    })

    revalidatePath("/")
    return updatedMedia
  })

/**
 * Supprimer un média hero
 */
export const deleteHeroMedia = action.schema(deleteSchema).action(async ({ parsedInput }) => {
  // Si c'est une URL MinIO, supprimer le fichier
  const minioEndpoint = process.env.MINIO_ENDPOINT || "116.203.111.206"
  if (parsedInput.url.includes(minioEndpoint)) {
    const pathMatch = parsedInput.url.match(/\/hero\/(.+)$/)
    if (pathMatch) {
      const filePath = pathMatch[1]
      try {
        await minioClient.removeObject(BUCKETS.HERO, filePath)
      } catch (error) {
        console.warn("Fichier non trouvé dans MinIO (peut-être déjà supprimé):", error)
      }
    }
  }

  // Supprimer l'entrée en base
  await prisma.hero_media.delete({
    where: { id: parsedInput.id },
  })

  revalidatePath("/")
  return { success: true }
})

/**
 * Upload un fichier vers MinIO
 */
export const uploadHeroFile = action
  .schema(
    z.object({
      fileName: z.string(),
      fileType: z.string(),
      fileBuffer: z.string(), // Base64 encoded
    })
  )
  .action(async ({ parsedInput }) => {
    // Décoder le buffer base64
    const buffer = Buffer.from(parsedInput.fileBuffer, "base64")

    // Générer un nom de fichier unique
    const uniqueFileName = `${Date.now()}-${parsedInput.fileName}`

    // Upload vers MinIO
    await minioClient.putObject(BUCKETS.HERO, uniqueFileName, buffer, buffer.length, {
      "Content-Type": parsedInput.fileType,
    })

    // Construire l'URL publique
    const minioEndpoint = process.env.MINIO_ENDPOINT || "116.203.111.206"
    const minioPort = process.env.MINIO_PORT || "9000"
    const publicUrl = `http://${minioEndpoint}:${minioPort}/${BUCKETS.HERO}/${uniqueFileName}`

    return {
      url: publicUrl,
      path: uniqueFileName,
    }
  })
