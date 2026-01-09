"use server"

/**
 * SERVER ACTIONS - PLATS
 *
 * Actions serveur pour la gestion des plats.
 * Utilisées par les hooks TanStack Query côté client.
 */

import { prisma } from "@/lib/prisma"
import { action } from "@/lib/safe-action"
import { getByIdSchema, platSchema, platUpdateSchema } from "@/lib/validations"
import type { PlatUI } from "@/types/app"
import { revalidatePath } from "next/cache"
import { z } from "zod"

/**
 * Récupère tous les plats actifs (non épuisés)
 * Note: Cette fonction reste une Server Action classique car elle ne modifie pas de données
 * et n'a pas besoin de la validation d'entrée complexe de next-safe-action.
 */
export async function getPlats(): Promise<PlatUI[]> {
  try {
    const plats = await prisma.plats_db.findMany({
      where: { est_epuise: false },
      orderBy: { plat: "asc" },
    })

    return plats.map((plat) => ({
      id: plat.idplats,
      idplats: plat.idplats,
      plat: plat.plat,
      description: plat.description,
      prix: plat.prix?.toString() ?? null,
      lundi_dispo: plat.lundi_dispo,
      mardi_dispo: plat.mardi_dispo,
      mercredi_dispo: plat.mercredi_dispo,
      jeudi_dispo: plat.jeudi_dispo,
      vendredi_dispo: plat.vendredi_dispo,
      samedi_dispo: plat.samedi_dispo,
      dimanche_dispo: plat.dimanche_dispo,
      photo_du_plat: plat.photo_du_plat,
      est_epuise: plat.est_epuise,
      epuise_depuis: plat.epuise_depuis?.toISOString() ?? null,
      epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() ?? null,
      raison_epuisement: plat.raison_epuisement,
      est_vegetarien: plat.est_vegetarien,
      niveau_epice: plat.niveau_epice,
      categorie: plat.categorie,
    }))
  } catch (error) {
    console.error("❌ Error in getPlats:", error)
    throw new Error("Impossible de récupérer les plats")
  }
}

/**
 * Récupère une liste légère des plats pour les sélecteurs (Combobox)
 */
export async function getPlatsList() {
  const plats = await prisma.plats_db.findMany({
    where: { est_epuise: false },
    select: {
      idplats: true,
      plat: true,
      prix: true,
      photo_du_plat: true,
    },
    orderBy: { plat: "asc" },
  })

  return plats.map((p) => ({
    id: p.idplats,
    label: p.plat,
    price: p.prix ? p.prix.toNumber() : 0,
    photo: p.photo_du_plat,
  }))
}

/**
 * Crée un nouveau plat avec validation Zod via next-safe-action.
 */
export const createPlat = action.schema(platSchema).action(async ({ parsedInput }) => {
  try {
    const plat = await prisma.plats_db.create({
      data: {
        ...parsedInput,
        est_epuise: false, // Valeur par défaut à la création
        // Valeurs par défaut pour jours obligatoires si non fournis
        mardi_dispo: parsedInput.mardi_dispo ?? "non",
      },
    })

    revalidatePath("/admin/plats")
    revalidatePath("/commander")

    // Explicit mapping to avoid Decimal serialization errors
    return {
      id: plat.idplats,
      idplats: plat.idplats,
      plat: plat.plat,
      description: plat.description,
      prix: plat.prix?.toString() ?? null,
      lundi_dispo: plat.lundi_dispo,
      mardi_dispo: plat.mardi_dispo,
      mercredi_dispo: plat.mercredi_dispo,
      jeudi_dispo: plat.jeudi_dispo,
      vendredi_dispo: plat.vendredi_dispo,
      samedi_dispo: plat.samedi_dispo,
      dimanche_dispo: plat.dimanche_dispo,
      photo_du_plat: plat.photo_du_plat,
      est_epuise: plat.est_epuise,
      epuise_depuis: plat.epuise_depuis?.toISOString() ?? null,
      epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() ?? null,
      raison_epuisement: plat.raison_epuisement,
      est_vegetarien: plat.est_vegetarien,
      niveau_epice: plat.niveau_epice,
      categorie: plat.categorie,
    } as PlatUI
  } catch (error) {
    console.error("❌ Error in createPlat:", error)
    throw new Error("Impossible de créer le plat")
  }
})

/**
 * Met à jour un plat existant avec validation Zod via next-safe-action.
 */
export const updatePlat = action
  .schema(
    z.object({
      id: z.number(),
      ...platUpdateSchema.shape,
    })
  )
  .action(async ({ parsedInput: { id, ...data } }) => {
    try {
      const plat = await prisma.plats_db.update({
        where: { idplats: id },
        data: data,
      })

      revalidatePath("/admin/plats")
      revalidatePath("/commander")

      // Explicit mapping to avoid Decimal serialization errors
      return {
        id: plat.idplats,
        idplats: plat.idplats,
        plat: plat.plat,
        description: plat.description,
        prix: plat.prix?.toString() ?? null,
        lundi_dispo: plat.lundi_dispo,
        mardi_dispo: plat.mardi_dispo,
        mercredi_dispo: plat.mercredi_dispo,
        jeudi_dispo: plat.jeudi_dispo,
        vendredi_dispo: plat.vendredi_dispo,
        samedi_dispo: plat.samedi_dispo,
        dimanche_dispo: plat.dimanche_dispo,
        photo_du_plat: plat.photo_du_plat,
        est_epuise: plat.est_epuise,
        epuise_depuis: plat.epuise_depuis?.toISOString() ?? null,
        epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() ?? null,
        raison_epuisement: plat.raison_epuisement,
        est_vegetarien: plat.est_vegetarien,
        niveau_epice: plat.niveau_epice,
        categorie: plat.categorie,
      } as PlatUI
    } catch (error) {
      console.error("❌ Error in updatePlat:", error)
      throw new Error("Impossible de mettre à jour le plat")
    }
  })

/**
 * Supprime un plat (soft delete) avec validation Zod via next-safe-action.
 */
export const deletePlat = action.schema(getByIdSchema).action(async ({ parsedInput: { id } }) => {
  try {
    await prisma.plats_db.update({
      where: { idplats: id },
      data: { est_epuise: true },
    })

    revalidatePath("/admin/plats")
    revalidatePath("/commander")

    return { success: true, id }
  } catch (error) {
    console.error("❌ Error in deletePlat:", error)
    throw new Error("Impossible de supprimer le plat")
  }
})
