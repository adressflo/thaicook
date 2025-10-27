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

/**
 * Récupère tous les plats actifs (non épuisés)
 */
export async function getPlats(): Promise<PlatUI[]> {
  try {
    const plats = await prisma.plats_db.findMany({
      where: { est_epuise: false },
      orderBy: { plat: 'asc' },
    })

    return plats.map((p) => ({
      ...p,
      id: p.idplats, // Ajout du champ id pour l'UI
      prix: p.prix ? Number(p.prix) : null,
      epuise_depuis: p.epuise_depuis?.toISOString() || null,
      epuise_jusqu_a: p.epuise_jusqu_a?.toISOString() || null,
    }))
  } catch (error) {
    console.error('❌ Error in getPlats:', error)
    throw new Error('Impossible de récupérer les plats')
  }
}

/**
 * Crée un nouveau plat
 */
export async function createPlat(data: {
  plat: string
  description?: string
  prix: number
  photo_du_plat?: string
  lundi_dispo?: any
  mardi_dispo?: any
  mercredi_dispo?: any
  jeudi_dispo?: any
  vendredi_dispo?: any
  samedi_dispo?: any
  dimanche_dispo?: any
}): Promise<PlatUI> {
  try {
    const plat = await prisma.plats_db.create({
      data: {
        plat: data.plat,
        description: data.description || null,
        prix: data.prix,
        photo_du_plat: data.photo_du_plat || null,
        lundi_dispo: data.lundi_dispo || 'non',
        mardi_dispo: data.mardi_dispo || 'non',
        mercredi_dispo: data.mercredi_dispo || 'non',
        jeudi_dispo: data.jeudi_dispo || 'non',
        vendredi_dispo: data.vendredi_dispo || 'non',
        samedi_dispo: data.samedi_dispo || 'non',
        dimanche_dispo: data.dimanche_dispo || 'non',
        est_epuise: false,
      },
    })

    revalidatePath('/admin/plats')
    revalidatePath('/commander')

    return {
      ...plat,
      id: plat.idplats,
      prix: plat.prix ? Number(plat.prix) : null,
      epuise_depuis: plat.epuise_depuis?.toISOString() || null,
      epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() || null,
    }
  } catch (error) {
    console.error('❌ Error in createPlat:', error)
    throw new Error('Impossible de créer le plat')
  }
}

/**
 * Met à jour un plat existant
 */
export async function updatePlat(
  id: number,
  data: Partial<{
    plat: string
    description: string
    prix: number
    photo_du_plat: string
    est_epuise: boolean
    lundi_dispo: any
    mardi_dispo: any
    mercredi_dispo: any
    jeudi_dispo: any
    vendredi_dispo: any
    samedi_dispo: any
    dimanche_dispo: any
  }>
): Promise<PlatUI> {
  try {
    const plat = await prisma.plats_db.update({
      where: { idplats: id },
      data,
    })

    revalidatePath('/admin/plats')
    revalidatePath('/commander')

    return {
      ...plat,
      id: plat.idplats,
      prix: plat.prix ? Number(plat.prix) : null,
      epuise_depuis: plat.epuise_depuis?.toISOString() || null,
      epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() || null,
    }
  } catch (error) {
    console.error('❌ Error in updatePlat:', error)
    throw new Error('Impossible de mettre à jour le plat')
  }
}

/**
 * Supprime un plat (soft delete - met est_epuise à true)
 */
export async function deletePlat(id: number): Promise<void> {
  try {
    await prisma.plats_db.update({
      where: { idplats: id },
      data: { est_epuise: true },
    })

    revalidatePath('/admin/plats')
    revalidatePath('/commander')
  } catch (error) {
    console.error('❌ Error in deletePlat:', error)
    throw new Error('Impossible de supprimer le plat')
  }
}
