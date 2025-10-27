'use server'

/**
 * SERVER ACTIONS - EXTRAS
 *
 * Actions serveur pour la gestion des extras.
 * Utilisées par les hooks TanStack Query côté client.
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { ExtraUI } from '@/types/app'

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
      prix: Number(extra.prix),
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
 */
export async function createExtra(data: {
  nom_extra: string
  description?: string
  prix: number
  photo_url?: string
  actif?: boolean
}): Promise<ExtraUI> {
  try {
    const extra = await prisma.extras_db.create({
      data: {
        nom_extra: data.nom_extra,
        description: data.description || null,
        prix: data.prix,
        photo_url: data.photo_url || null,
        actif: data.actif ?? true,
      },
    })

    revalidatePath('/admin/commandes')

    return {
      id: extra.idextra,
      idextra: extra.idextra,
      nom_extra: extra.nom_extra,
      description: extra.description,
      prix: Number(extra.prix),
      photo_url: extra.photo_url,
      actif: extra.actif,
      est_disponible: extra.actif ?? true,
      created_at: extra.created_at?.toISOString() || null,
      updated_at: extra.updated_at?.toISOString() || null,
    }
  } catch (error) {
    console.error('❌ Error in createExtra:', error)
    throw new Error('Impossible de créer l\'extra')
  }
}

/**
 * Met à jour un extra existant
 */
export async function updateExtra(
  id: number,
  data: Partial<{
    nom_extra: string
    description: string
    prix: number
    photo_url: string
    actif: boolean
  }>
): Promise<ExtraUI> {
  try {
    const extra = await prisma.extras_db.update({
      where: { idextra: id },
      data,
    })

    revalidatePath('/admin/commandes')

    return {
      id: extra.idextra,
      idextra: extra.idextra,
      nom_extra: extra.nom_extra,
      description: extra.description,
      prix: Number(extra.prix),
      photo_url: extra.photo_url,
      actif: extra.actif,
      est_disponible: extra.actif ?? true,
      created_at: extra.created_at?.toISOString() || null,
      updated_at: extra.updated_at?.toISOString() || null,
    }
  } catch (error) {
    console.error('❌ Error in updateExtra:', error)
    throw new Error('Impossible de mettre à jour l\'extra')
  }
}

/**
 * Supprime un extra (soft delete - met actif à false)
 */
export async function deleteExtra(id: number): Promise<void> {
  try {
    await prisma.extras_db.update({
      where: { idextra: id },
      data: { actif: false },
    })

    revalidatePath('/admin/commandes')
  } catch (error) {
    console.error('❌ Error in deleteExtra:', error)
    throw new Error('Impossible de supprimer l\'extra')
  }
}
