'use server'

/**
 * SERVER ACTIONS - CLIENTS
 *
 * Actions serveur pour la gestion des clients.
 * Utilisées par les hooks TanStack Query côté client.
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { ClientUI } from '@/types/app'
import { z } from 'zod'
import { action, authAction } from '@/lib/safe-action'
import {
  clientProfileSchema,
  clientUpdateSchema,
  searchClientsSchema,
} from '@/lib/validations'

/**
 * Récupère tous les clients
 */
export async function getClients(): Promise<ClientUI[]> {
  try {
    const clients = await prisma.client_db.findMany({
      orderBy: { idclient: 'desc' },
    })

    return clients.map(c => ({
      ...c,
      id: c.auth_user_id, // ClientUI attend id = auth_user_id
      idclient: Number(c.idclient),
      code_postal: c.code_postal || null,
    }))
  } catch (error) {
    console.error('❌ Error in getClients:', error)
    throw new Error('Impossible de récupérer les clients')
  }
}

/**
 * Récupère un client par auth_user_id
 */
export async function getClientByAuthUserId(
  authUserId: string,
): Promise<ClientUI | null> {
  try {
    const client = await prisma.client_db.findUnique({
      where: { auth_user_id: authUserId },
    })

    if (!client) return null

    return {
      ...client,
      id: client.auth_user_id,
      idclient: Number(client.idclient),
      code_postal: client.code_postal || null,
    }
  } catch (error) {
    console.error('❌ Error in getClientByAuthUserId:', error)
    throw new Error('Impossible de récupérer le client')
  }
}

/**
 * Récupère un client par ID
 */
export async function getClientById(id: number): Promise<ClientUI | null> {
  try {
    const client = await prisma.client_db.findUnique({
      where: { idclient: BigInt(id) },
    })

    if (!client) return null

    return {
      ...client,
      id: client.auth_user_id,
      idclient: Number(client.idclient),
      code_postal: client.code_postal || null,
    }
  } catch (error) {
    console.error('❌ Error in getClientById:', error)
    throw new Error('Impossible de récupérer le client')
  }
}

/**
 * Crée un nouveau client
 */
export const createClient = action
  .schema(clientProfileSchema)
  .action(async ({ parsedInput }) => {
    try {
      const client = await prisma.client_db.create({
        data: {
          ...parsedInput,
          date_de_naissance: parsedInput.date_de_naissance
            ? new Date(parsedInput.date_de_naissance)
            : null,
          preference_client: null,
          comment_avez_vous_connu: [],
          souhaitez_vous_recevoir_actualites: false,
        },
      })

      revalidatePath('/admin/clients')
      revalidatePath('/profil')

      return {
        ...client,
        id: client.auth_user_id,
        idclient: Number(client.idclient),
        code_postal: client.code_postal || null,
      } as ClientUI
    } catch (error) {
      console.error('❌ Error in createClient:', error)
      throw new Error('Impossible de créer le client')
    }
  })

/**
 * Met à jour un client existant
 */
export const updateClient = authAction
  .schema(
    clientUpdateSchema.omit({ auth_user_id: true }), // Omettre auth_user_id du schéma de validation
  )
  .action(async ({ parsedInput, ctx }) => {
    try {
      const client = await prisma.client_db.update({
        where: { auth_user_id: ctx.userId }, // Utiliser l'ID de l'utilisateur authentifié
        data: {
          ...parsedInput,
          date_de_naissance: parsedInput.date_de_naissance
            ? new Date(parsedInput.date_de_naissance)
            : undefined,
        },
      })

      revalidatePath('/admin/clients')
      revalidatePath('/profil')

      return {
        ...client,
        id: client.auth_user_id,
        idclient: Number(client.idclient),
        code_postal: client.code_postal || null,
      } as ClientUI
    } catch (error) {
      console.error('❌ Error in updateClient:', error)
      throw new Error('Impossible de mettre à jour le client')
    }
  })

/**
 * Recherche des clients par nom/email
 */
export const searchClients = authAction
  .schema(searchClientsSchema)
  .action(async ({ parsedInput: { searchTerm } }) => {
    try {
      const clients = await prisma.client_db.findMany({
        where: {
          OR: [
            { nom: { contains: searchTerm, mode: 'insensitive' } },
            { prenom: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        orderBy: { nom: 'asc' },
      })

      return clients.map(
        c =>
          ({
            ...c,
            id: c.auth_user_id,
            idclient: Number(c.idclient),
            code_postal: c.code_postal || null,
          } as ClientUI),
      )
    } catch (error) {
      console.error('❌ Error in searchClients:', error)
      throw new Error('Impossible de rechercher les clients')
    }
  })
