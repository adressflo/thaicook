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

/**
 * Récupère tous les clients
 */
export async function getClients(): Promise<ClientUI[]> {
  try {
    const clients = await prisma.client_db.findMany({
      orderBy: { idclient: 'desc' },
    })

    return clients.map((c) => ({
      ...c,
      id: c.auth_user_id, // ClientUI attend id = auth_user_id
      idclient: Number(c.idclient),
      code_postal: c.code_postal || null,
    } as any)) // Cast pour éviter erreur de type Date
  } catch (error) {
    console.error('❌ Error in getClients:', error)
    throw new Error('Impossible de récupérer les clients')
  }
}

/**
 * Récupère un client par auth_user_id
 */
export async function getClientByAuthUserId(
  authUserId: string
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
export async function createClient(data: {
  auth_user_id: string
  email: string
  nom?: string
  prenom?: string
  numero_de_telephone?: string
  adresse_numero_et_rue?: string
  code_postal?: number
  ville?: string
  date_de_naissance?: Date
  role?: 'client' | 'admin'
}): Promise<ClientUI> {
  try {
    const client = await prisma.client_db.create({
      data: {
        auth_user_id: data.auth_user_id,
        email: data.email,
        nom: data.nom || null,
        prenom: data.prenom || null,
        numero_de_telephone: data.numero_de_telephone || null,
        adresse_numero_et_rue: data.adresse_numero_et_rue || null,
        code_postal: data.code_postal || null,
        ville: data.ville || null,
        date_de_naissance: data.date_de_naissance || null,
        role: data.role || 'client',
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
    }
  } catch (error) {
    console.error('❌ Error in createClient:', error)
    throw new Error('Impossible de créer le client')
  }
}

/**
 * Met à jour un client existant
 */
export async function updateClient(
  authUserId: string,
  data: Partial<{
    nom: string
    prenom: string
    email: string
    numero_de_telephone: string
    adresse_numero_et_rue: string
    code_postal: number
    ville: string
    date_de_naissance: Date
    preference_client: string
    souhaitez_vous_recevoir_actualites: boolean
    photo_client: string
    comment_avez_vous_connu: string[]
  }>
): Promise<ClientUI> {
  try {
    const client = await prisma.client_db.update({
      where: { auth_user_id: authUserId },
      data,
    })

    revalidatePath('/admin/clients')
    revalidatePath('/profil')

    return {
      ...client,
      id: client.auth_user_id,
      idclient: Number(client.idclient),
      code_postal: client.code_postal || null,
    }
  } catch (error) {
    console.error('❌ Error in updateClient:', error)
    throw new Error('Impossible de mettre à jour le client')
  }
}

/**
 * Recherche des clients par nom/email
 */
export async function searchClients(searchTerm: string): Promise<ClientUI[]> {
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

    return clients.map((c) => ({
      ...c,
      id: c.auth_user_id,
      idclient: Number(c.idclient),
      code_postal: c.code_postal || null,
    }))
  } catch (error) {
    console.error('❌ Error in searchClients:', error)
    throw new Error('Impossible de rechercher les clients')
  }
}
