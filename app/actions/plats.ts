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
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library' // Add this import for Decimal type checking

// Custom replacer function for JSON.stringify to handle Decimal and BigInt
function jsonReplacer(key: string, value: any): any {
  if (value instanceof Decimal) {
    return value.toString();
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

/**
 * Récupère tous les plats actifs (non épuisés)
 */
export async function getPlats(): Promise<PlatUI[]> {
  try {
    const plats = await prisma.plats_db.findMany({
      where: { est_epuise: false },
      orderBy: { plat: 'asc' },
    });

    // Manually map each field to ensure no non-serializable objects are passed.
    // This is a more explicit and safer way to prevent serialization errors.
    return plats.map((plat) => {
      const platData: PlatUI = {
        id: plat.idplats,
        idplats: plat.idplats,
        plat: plat.plat,
        description: plat.description ?? null,
        prix: plat.prix ? plat.prix.toString() : null,
        lundi_dispo: plat.lundi_dispo,
        mardi_dispo: plat.mardi_dispo,
        mercredi_dispo: plat.mercredi_dispo,
        jeudi_dispo: plat.jeudi_dispo,
        vendredi_dispo: plat.vendredi_dispo ?? null,
        samedi_dispo: plat.samedi_dispo ?? null,
        dimanche_dispo: plat.dimanche_dispo ?? null,
        photo_du_plat: plat.photo_du_plat ?? null,
        est_epuise: plat.est_epuise ?? null,
        epuise_depuis: plat.epuise_depuis?.toISOString() ?? null,
        epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() ?? null,
        raison_epuisement: plat.raison_epuisement ?? null,
      };
      return platData;
    });
  } catch (error) {
    console.error('❌ Error in getPlats:', error);
    throw new Error('Impossible de récupérer les plats');
  }
}

/**
 * Crée un nouveau plat
 */
export async function createPlat(data: {
  plat: string
  description?: string
  prix: string
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
      prix: plat.prix?.toString() || null,
      epuise_depuis: plat.epuise_depuis?.toISOString() || null,
      epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() || null,
    };
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
    prix: string
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
      data: {
        ...data,
        prix: data.prix ? data.prix : undefined, // Convert string to Decimal
      },
    })

    revalidatePath('/admin/plats')
    revalidatePath('/commander')

    return {
      ...plat,
      id: plat.idplats,
      prix: plat.prix?.toString() || null,
      epuise_depuis: plat.epuise_depuis?.toISOString() || null,
      epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() || null,
    };
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
