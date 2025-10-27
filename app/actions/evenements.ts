'use server'

/**
 * SERVER ACTIONS - EVENEMENTS
 *
 * Actions serveur pour la gestion des événements.
 * Utilisées par les hooks TanStack Query côté client.
 *
 * Schéma Prisma: evenements_db
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { EvenementUI, CreateEvenementData } from '@/types/app'
import type { evenements_db, client_db } from '@/generated/prisma/client'

/**
 * Type pour événement avec relations incluses
 */
type EvenementWithRelations = evenements_db & {
  client_db: client_db | null
}

/**
 * Convertit un événement Prisma en format EvenementUI
 */
function convertEvenementToUI(evenement: EvenementWithRelations): EvenementUI {
  return {
    ...evenement,
    id: evenement.idevenements,
    contact_client_r_id: evenement.contact_client_r_id
      ? Number(evenement.contact_client_r_id)
      : null,
    budget_client: evenement.budget_client
      ? Number(evenement.budget_client)
      : null,
    prix_total_devise: evenement.prix_total_devise
      ? Number(evenement.prix_total_devise)
      : null,
    acompte_demande: evenement.acompte_demande
      ? Number(evenement.acompte_demande)
      : null,
    acompte_recu: evenement.acompte_recu ? Number(evenement.acompte_recu) : null,
    date_evenement: evenement.date_evenement?.toISOString() || null,
    date_acompte_recu: evenement.date_acompte_recu?.toISOString() || null,
    created_at: evenement.created_at?.toISOString() || null,
    updated_at: evenement.updated_at?.toISOString() || null,
    // Aliases pour compatibilité
    client_r_id: evenement.contact_client_r_id
      ? Number(evenement.contact_client_r_id)
      : null,
    type_evenement: evenement.type_d_evenement || null,
    budget_estime: evenement.budget_client
      ? Number(evenement.budget_client)
      : null,
    demandes_speciales: evenement.demandes_speciales_evenement || null,
    statut: evenement.statut_evenement || null,
    notes_internes: evenement.notes_internes_evenement || null,
    client: evenement.client_db
      ? {
          nom: evenement.client_db.nom || null,
          prenom: evenement.client_db.prenom || null,
          email: evenement.client_db.email || null,
          numero_de_telephone: evenement.client_db.numero_de_telephone || null,
        }
      : null,
  } as EvenementUI
}

/**
 * Récupère les événements d'un client
 */
export async function getEvenementsByClient(
  clientId: number
): Promise<EvenementUI[]> {
  try {
    const evenements = await prisma.evenements_db.findMany({
      where: { contact_client_r_id: BigInt(clientId) },
      include: {
        client_db: true,
      },
      orderBy: { date_evenement: 'desc' },
    })

    return evenements.map(convertEvenementToUI)
  } catch (error) {
    console.error('❌ Error in getEvenementsByClient:', error)
    throw new Error('Impossible de récupérer les événements du client')
  }
}

/**
 * Récupère un événement par ID
 */
export async function getEvenementById(id: number): Promise<EvenementUI | null> {
  try {
    const evenement = await prisma.evenements_db.findUnique({
      where: { idevenements: id },
      include: {
        client_db: true,
      },
    })

    return evenement ? convertEvenementToUI(evenement) : null
  } catch (error) {
    console.error('❌ Error in getEvenementById:', error)
    throw new Error("Impossible de récupérer l'événement")
  }
}

/**
 * Crée un nouvel événement
 */
export async function createEvenement(
  data: CreateEvenementData
): Promise<EvenementUI> {
  try {
    const evenement = await prisma.evenements_db.create({
      data: {
        nom_evenement: data.nom_evenement,
        contact_client_r: data.contact_client_r || null,
        contact_client_r_id: BigInt(data.contact_client_r_id),
        date_evenement: new Date(data.date_evenement),
        type_d_evenement: data.type_d_evenement as any,
        nombre_de_personnes: data.nombre_de_personnes,
        budget_client: data.budget_client || null,
        demandes_speciales_evenement: data.demandes_speciales_evenement || null,
        plats_preselectionnes: data.plats_preselectionnes || [],
        statut_evenement: 'Demande_initiale',
      },
      include: {
        client_db: true,
      },
    })

    revalidatePath('/evenements')
    revalidatePath('/historique')
    revalidatePath('/suivi')

    return convertEvenementToUI(evenement)
  } catch (error) {
    console.error('❌ Error in createEvenement:', error)
    throw new Error("Impossible de créer l'événement")
  }
}

/**
 * Met à jour un événement existant
 */
export async function updateEvenement(
  id: number,
  data: Partial<{
    date_evenement: string
    type_d_evenement: string
    nombre_de_personnes: number
    budget_client: number
    demandes_speciales_evenement: string
    statut_evenement: string
    plats_preselectionnes: number[]
    notes_internes_evenement: string
  }>
): Promise<EvenementUI> {
  try {
    const updateData: any = {}

    if (data.date_evenement)
      updateData.date_evenement = new Date(data.date_evenement)
    if (data.type_d_evenement) updateData.type_d_evenement = data.type_d_evenement
    if (data.nombre_de_personnes !== undefined)
      updateData.nombre_de_personnes = data.nombre_de_personnes
    if (data.budget_client !== undefined)
      updateData.budget_client = data.budget_client
    if (data.demandes_speciales_evenement !== undefined)
      updateData.demandes_speciales_evenement = data.demandes_speciales_evenement
    if (data.statut_evenement) updateData.statut_evenement = data.statut_evenement
    if (data.plats_preselectionnes !== undefined)
      updateData.plats_preselectionnes = data.plats_preselectionnes
    if (data.notes_internes_evenement !== undefined)
      updateData.notes_internes_evenement = data.notes_internes_evenement

    const evenement = await prisma.evenements_db.update({
      where: { idevenements: id },
      data: updateData,
      include: {
        client_db: true,
      },
    })

    revalidatePath('/evenements')
    revalidatePath('/historique')
    revalidatePath('/suivi')
    revalidatePath('/modifier-evenement')

    return convertEvenementToUI(evenement)
  } catch (error) {
    console.error('❌ Error in updateEvenement:', error)
    throw new Error("Impossible de mettre à jour l'événement")
  }
}

/**
 * Supprime un événement
 */
export async function deleteEvenement(id: number): Promise<void> {
  try {
    await prisma.evenements_db.delete({
      where: { idevenements: id },
    })

    revalidatePath('/evenements')
    revalidatePath('/historique')
    revalidatePath('/suivi')
  } catch (error) {
    console.error('❌ Error in deleteEvenement:', error)
    throw new Error("Impossible de supprimer l'événement")
  }
}

/**
 * Récupère tous les événements (admin)
 */
export async function getAllEvenements(): Promise<EvenementUI[]> {
  try {
    const evenements = await prisma.evenements_db.findMany({
      include: {
        client_db: true,
      },
      orderBy: { date_evenement: 'desc' },
    })

    return evenements.map(convertEvenementToUI)
  } catch (error) {
    console.error('❌ Error in getAllEvenements:', error)
    throw new Error('Impossible de récupérer tous les événements')
  }
}
