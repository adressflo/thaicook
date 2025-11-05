'use server'

/**
 * SERVER ACTIONS - PLATS
 *
 * Actions serveur pour la gestion des plats.
 * Utilisées par les hooks TanStack Query côté client.
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { PlatUI } from '@/types/app'
import { z } from 'zod'
import { action } from '@/lib/safe-action'
import {
  platSchema,
  platUpdateSchema,
  getByIdSchema,
} from '@/lib/validations'

/**
 * Récupère tous les plats actifs (non épuisés)
 * Note: Cette fonction reste une Server Action classique car elle ne modifie pas de données
 * et n'a pas besoin de la validation d'entrée complexe de next-safe-action.
 */
export async function getPlats(): Promise<PlatUI[]> {
  try {
    const plats = await prisma.plats_db.findMany({
      where: { est_epuise: false },
      orderBy: { plat: 'asc' },
    })

    return plats.map(plat => ({
      ...plat,
      id: plat.idplats,
      prix: plat.prix?.toString() ?? null,
      epuise_depuis: plat.epuise_depuis?.toISOString() ?? null,
      epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() ?? null,
    }))
  } catch (error) {
    console.error('❌ Error in getPlats:', error)
    throw new Error('Impossible de récupérer les plats')
  }
}

/**
 * Crée un nouveau plat avec validation Zod via next-safe-action.
 */
export const createPlat = action
  .schema(platSchema)
  .action(async ({ parsedInput }) => {
    try {
      const plat = await prisma.plats_db.create({
        data: {
          ...parsedInput,
          est_epuise: false, // Valeur par défaut à la création
        },
      })

      revalidatePath('/admin/plats')
      revalidatePath('/commander')

      return {
        ...plat,
        id: plat.idplats,
        prix: plat.prix?.toString() ?? null,
        epuise_depuis: plat.epuise_depuis?.toISOString() ?? null,
        epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() ?? null,
      } as PlatUI
    } catch (error) {
      console.error('❌ Error in createPlat:', error)
      throw new Error('Impossible de créer le plat')
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
    }),
  )
  .action(async ({ parsedInput: { id, ...data } }) => {
    try {
      const plat = await prisma.plats_db.update({
        where: { idplats: id },
        data: data,
      })

      revalidatePath('/admin/plats')
      revalidatePath('/commander')

      return {
        ...plat,
        id: plat.idplats,
        prix: plat.prix?.toString() ?? null,
        epuise_depuis: plat.epuise_depuis?.toISOString() ?? null,
        epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() ?? null,
      } as PlatUI
    } catch (error) {
      console.error('❌ Error in updatePlat:', error)
      throw new Error('Impossible de mettre à jour le plat')
    }
  })

/**
 * Supprime un plat (soft delete) avec validation Zod via next-safe-action.
 */
export const deletePlat = action
  .schema(getByIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      await prisma.plats_db.update({
        where: { idplats: id },
        data: { est_epuise: true },
      })

      revalidatePath('/admin/plats')
      revalidatePath('/commander')

      return { success: true, id }
    } catch (error) {
      console.error('❌ Error in deletePlat:', error)
      throw new Error('Impossible de supprimer le plat')
    }
  })
