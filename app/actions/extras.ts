'use server'

/**
 * SERVER ACTIONS - EXTRAS
 *
 * Actions serveur pour la gestion des extras avec next-safe-action.
 * Utilisées par les hooks TanStack Query côté client.
 *
 * ✅ Migré vers next-safe-action + Zod validation
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { ExtraUI } from '@/types/app'
import { action } from '@/lib/safe-action'
import {
  extraSchema,
  extraUpdateSchema,
  getByIdSchema
} from '@/lib/validations'
import { z } from 'zod'


/**
 * Récupère tous les extras actifs
 */
export async function getExtras(): Promise<ExtraUI[]> {
  try {
    const extras = await prisma.extras_db.findMany({
      where: { actif: true },
      orderBy: { nom_extra: 'asc' },
    })

    return extras.map((extra) => ({
      id: extra.idextra,
      idextra: extra.idextra,
      nom_extra: extra.nom_extra,
      description: extra.description || null,
      prix: extra.prix?.toString() || '0', // Convertir Decimal en string
      photo_url: extra.photo_url || null,
      actif: extra.actif || null,
      est_disponible: extra.actif ?? true,
      created_at: extra.created_at?.toISOString() || null,
      updated_at: extra.updated_at?.toISOString() || null,
    }))
  } catch (error) {
    console.error('❌ Error in getExtras:', error)
    throw new Error('Impossible de récupérer les extras')
  }
}

/**
 * Crée un nouvel extra
 * ✅ Migré vers next-safe-action
 */
export const createExtra = action
  .schema(extraSchema)
  .action(async ({ parsedInput }) => {
    try {
      const extra = await prisma.extras_db.create({
        data: {
          nom_extra: parsedInput.nom_extra,
          description: parsedInput.description || null,
          prix: parsedInput.prix,
          photo_url: parsedInput.photo_url || null,
          actif: parsedInput.actif ?? true,
        },
      })

      revalidatePath('/admin/commandes')

      return {
        id: extra.idextra,
        idextra: extra.idextra,
        nom_extra: extra.nom_extra,
        description: extra.description,
        prix: extra.prix?.toString() || '0',
        photo_url: extra.photo_url,
        actif: extra.actif,
        est_disponible: extra.actif ?? true,
        created_at: extra.created_at?.toISOString() || null,
        updated_at: extra.updated_at?.toISOString() || null,
      } as ExtraUI;
    } catch (error) {
      console.error('❌ Error in createExtra:', error)
      throw new Error('Impossible de créer l\'extra')
    }
  });

/**
 * Met à jour un extra existant
 * ✅ Migré vers next-safe-action
 */
export const updateExtra = action
  .schema(z.object({
    id: z.number().int().positive("ID extra invalide"),
    data: extraUpdateSchema
  }))
  .action(async ({ parsedInput }) => {
    try {
      const extra = await prisma.extras_db.update({
        where: { idextra: parsedInput.id },
        data: {
          ...parsedInput.data,
          prix: parsedInput.data.prix ? parsedInput.data.prix : undefined,
        },
      })

      revalidatePath('/admin/commandes')

      return {
        id: extra.idextra,
        idextra: extra.idextra,
        nom_extra: extra.nom_extra,
        description: extra.description,
        prix: extra.prix?.toString() || '0',
        photo_url: extra.photo_url,
        actif: extra.actif,
        est_disponible: extra.actif ?? true,
        created_at: extra.created_at?.toISOString() || null,
        updated_at: extra.updated_at?.toISOString() || null,
      } as ExtraUI;
    } catch (error) {
      console.error('❌ Error in updateExtra:', error)
      throw new Error('Impossible de mettre à jour l\'extra')
    }
  });

/**
 * Supprime un extra (soft delete - met actif à false)
 * ✅ Migré vers next-safe-action
 */
export const deleteExtra = action
  .schema(getByIdSchema)
  .action(async ({ parsedInput }) => {
    try {
      await prisma.extras_db.update({
        where: { idextra: parsedInput.id },
        data: { actif: false },
      })

      revalidatePath('/admin/commandes')

      return { success: true };
    } catch (error) {
      console.error('❌ Error in deleteExtra:', error)
      throw new Error('Impossible de supprimer l\'extra')
    }
  });
