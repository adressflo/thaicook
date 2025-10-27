'use server'

/**
 * SERVER ACTIONS - COMMANDES
 *
 * Actions serveur pour la gestion des commandes.
 * Utilisées par les hooks TanStack Query côté client.
 *
 * Schéma Prisma: commande_db, details_commande_db
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { CommandeUI, CreateCommandeData } from '@/types/app'
import type { commande_db, details_commande_db, client_db, plats_db, extras_db } from '@/generated/prisma/client'

/**
 * Type pour commande avec relations incluses
 */
type CommandeWithRelations = commande_db & {
  client_db: client_db | null
  details_commande_db: (details_commande_db & {
    plats_db: plats_db | null
    extras_db: extras_db | null
  })[]
}

/**
 * Mapper les statuts Prisma (underscores) vers UI (espaces)
 */
function mapStatutCommande(statut: string | null): CommandeUI['statut_commande'] {
  if (!statut) return null
  const mapping: Record<string, CommandeUI['statut_commande']> = {
    'En_attente_de_confirmation': 'En attente de confirmation',
    'Confirmée': 'Confirmée',
    'En_préparation': 'En préparation',
    'Prête_à_récupérer': 'Prête à récupérer',
    'Récupérée': 'Récupérée',
    'Annulée': 'Annulée',
  }
  return mapping[statut] || null
}

function mapStatutPaiement(statut: string | null): CommandeUI['statut_paiement'] {
  if (!statut) return null
  const mapping: Record<string, CommandeUI['statut_paiement']> = {
    'En_attente_sur_place': 'En attente sur place',
    'Payé_sur_place': 'Payé sur place',
    'Payé_en_ligne': 'Payé en ligne',
    'Non_payé': 'Non payé',
    'Payée': 'Payée',
  }
  return mapping[statut] || null
}

function mapTypeLivraison(type: string | null): CommandeUI['type_livraison'] {
  if (!type) return null
  const mapping: Record<string, CommandeUI['type_livraison']> = {
    'emporter': 'À emporter',
    'Livraison': 'Livraison',
    'Sur_place': 'Sur place',
  }
  return mapping[type] || null
}

/**
 * Convertit une commande Prisma en format CommandeUI
 */
function convertCommandeToUI(commande: CommandeWithRelations): CommandeUI {
  // Calculer prix_total depuis les détails
  const prix_total = commande.details_commande_db?.reduce((sum: number, detail) => {
    return sum + (Number(detail.prix_unitaire) || 0) * (detail.quantite_plat_commande || 0)
  }, 0) || 0

  return {
    id: commande.idcommande,
    idcommande: commande.idcommande,
    client_r_id: commande.client_r_id ? Number(commande.client_r_id) : null,
    date_et_heure_de_retrait_souhaitees:
      commande.date_et_heure_de_retrait_souhaitees?.toISOString() || null,
    demande_special_pour_la_commande:
      commande.demande_special_pour_la_commande || null,
    type_livraison: mapTypeLivraison(commande.type_livraison),
    adresse_specifique: commande.adresse_specifique || null,
    statut_commande: mapStatutCommande(commande.statut_commande),
    statut_paiement: mapStatutPaiement(commande.statut_paiement),
    prix_total, // Calculé dynamiquement
    notes_internes: commande.notes_internes || null,
    created_at: commande.date_de_prise_de_commande?.toISOString() || null,
    updated_at: null,
    // Champs spécifiques au schéma actuel
    client_r: commande.client_r || null,
    date_de_prise_de_commande: commande.date_de_prise_de_commande?.toISOString() || null,
    nom_evenement: commande.nom_evenement || null,
    client: commande.client_db
      ? {
          nom: commande.client_db.nom || null,
          prenom: commande.client_db.prenom || null,
          email: commande.client_db.email || null,
          numero_de_telephone: commande.client_db.numero_de_telephone || null,
          adresse_numero_et_rue: commande.client_db.adresse_numero_et_rue || null,
          ville: commande.client_db.ville || null,
          code_postal: commande.client_db.code_postal || null,
          preference_client: commande.client_db.preference_client || null,
          photo_client: commande.client_db.photo_client || null,
          auth_user_id: commande.client_db.auth_user_id,
        }
      : null,
    details: commande.details_commande_db?.map((detail) => ({
      ...detail,
      prix_unitaire: Number(detail.prix_unitaire),
      plat: detail.plats_db || undefined,
    })) as any, // Simplified pour éviter les erreurs de type complexes
  }
}

/**
 * Récupère toutes les commandes
 */
export async function getCommandes(): Promise<CommandeUI[]> {
  try {
    const commandes = await prisma.commande_db.findMany({
      include: {
        client_db: true,
        details_commande_db: {
          include: {
            plats_db: true,
            extras_db: true,
          },
        },
      },
      orderBy: { date_de_prise_de_commande: 'desc' },
    })

    return commandes.map(convertCommandeToUI)
  } catch (error) {
    console.error('❌ Error in getCommandes:', error)
    throw new Error('Impossible de récupérer les commandes')
  }
}

/**
 * Récupère une commande par ID
 */
export async function getCommandeById(id: number): Promise<CommandeUI | null> {
  try {
    const commande = await prisma.commande_db.findUnique({
      where: { idcommande: id },
      include: {
        client_db: true,
        details_commande_db: {
          include: {
            plats_db: true,
            extras_db: true,
          },
        },
      },
    })

    return commande ? convertCommandeToUI(commande) : null
  } catch (error) {
    console.error('❌ Error in getCommandeById:', error)
    throw new Error('Impossible de récupérer la commande')
  }
}

/**
 * Récupère les commandes d'un client
 */
export async function getCommandesByClient(
  clientId: number
): Promise<CommandeUI[]> {
  try {
    const commandes = await prisma.commande_db.findMany({
      where: { client_r_id: BigInt(clientId) },
      include: {
        client_db: true,
        details_commande_db: {
          include: {
            plats_db: true,
            extras_db: true,
          },
        },
      },
      orderBy: { date_de_prise_de_commande: 'desc' },
    })

    return commandes.map(convertCommandeToUI)
  } catch (error) {
    console.error('❌ Error in getCommandesByClient:', error)
    throw new Error('Impossible de récupérer les commandes du client')
  }
}

/**
 * Crée une nouvelle commande
 */
export async function createCommande(
  data: CreateCommandeData
): Promise<CommandeUI> {
  try {
    // Déterminer client_r_id depuis data.client_r_id OU récupérer depuis auth_user_id
    let clientRId: bigint
    if (data.client_r_id) {
      clientRId = BigInt(data.client_r_id)
    } else if (data.client_r) {
      // Récupérer idclient depuis auth_user_id
      const client = await prisma.client_db.findUnique({
        where: { auth_user_id: data.client_r },
      })
      if (!client) throw new Error('Client introuvable')
      clientRId = client.idclient
    } else {
      throw new Error('client_r_id ou client_r requis')
    }

    // 1. Créer la commande
    const commande = await prisma.commande_db.create({
      data: {
        client_r: data.client_r || null,
        client_r_id: clientRId,
        date_et_heure_de_retrait_souhaitees: data.date_et_heure_de_retrait_souhaitees
          ? new Date(data.date_et_heure_de_retrait_souhaitees)
          : null,
        demande_special_pour_la_commande:
          data.demande_special_pour_la_commande || null,
        type_livraison: (data.type_livraison as any) || 'emporter',
        adresse_specifique: data.adresse_specifique || null,
        statut_commande: 'En_attente_de_confirmation',
        statut_paiement: 'En_attente_sur_place',
      },
    })

    // 2. Créer les détails de commande (accepter details OU plats)
    const items = data.details || data.plats || []
    if (items.length > 0) {
      for (const item of items) {
        // Gérer les deux formats: details.plat_r OU plats.plat_r_id
        const platId = 'plat_r' in item
          ? (typeof item.plat_r === 'string' ? parseInt(item.plat_r) : item.plat_r)
          : item.plat_r_id

        const platData = await prisma.plats_db.findUnique({
          where: { idplats: platId },
        })

        if (!platData) continue

        const quantite = 'quantite_plat_commande' in item
          ? item.quantite_plat_commande
          : ('quantite' in item ? item.quantite : 1)

        await prisma.details_commande_db.create({
          data: {
            commande_r: commande.idcommande,
            plat_r: platId,
            quantite_plat_commande: quantite || 1,
            prix_unitaire: platData.prix,
            nom_plat: platData.plat,
            type: 'plat',
          },
        })
      }
    }

    revalidatePath('/admin/commandes')
    revalidatePath('/historique')
    revalidatePath('/suivi')

    // 3. Récupérer la commande complète
    const commandeComplete = await prisma.commande_db.findUnique({
      where: { idcommande: commande.idcommande },
      include: {
        client_db: true,
        details_commande_db: {
          include: {
            plats_db: true,
            extras_db: true,
          },
        },
      },
    })

    return convertCommandeToUI(commandeComplete!)
  } catch (error) {
    console.error('❌ Error in createCommande:', error)
    throw new Error('Impossible de créer la commande')
  }
}

/**
 * Met à jour une commande existante
 */
export async function updateCommande(
  id: number,
  data: Partial<{
    statut_commande: string
    statut_paiement: string
    notes_internes: string
    date_et_heure_de_retrait_souhaitees: string
    demande_special_pour_la_commande: string
    type_livraison: string
    adresse_specifique: string
  }>
): Promise<CommandeUI> {
  try {
    const updateData: any = {}

    if (data.statut_commande) updateData.statut_commande = data.statut_commande
    if (data.statut_paiement) updateData.statut_paiement = data.statut_paiement
    if (data.notes_internes !== undefined)
      updateData.notes_internes = data.notes_internes
    if (data.date_et_heure_de_retrait_souhaitees)
      updateData.date_et_heure_de_retrait_souhaitees = new Date(
        data.date_et_heure_de_retrait_souhaitees
      )
    if (data.demande_special_pour_la_commande !== undefined)
      updateData.demande_special_pour_la_commande =
        data.demande_special_pour_la_commande
    if (data.type_livraison) updateData.type_livraison = data.type_livraison
    if (data.adresse_specifique !== undefined)
      updateData.adresse_specifique = data.adresse_specifique

    const commande = await prisma.commande_db.update({
      where: { idcommande: id },
      data: updateData,
      include: {
        client_db: true,
        details_commande_db: {
          include: {
            plats_db: true,
            extras_db: true,
          },
        },
      },
    })

    revalidatePath('/admin/commandes')
    revalidatePath('/historique')
    revalidatePath('/suivi')

    return convertCommandeToUI(commande)
  } catch (error) {
    console.error('❌ Error in updateCommande:', error)
    throw new Error('Impossible de mettre à jour la commande')
  }
}

/**
 * Supprime une commande
 */
export async function deleteCommande(id: number): Promise<void> {
  try {
    // 1. Supprimer les détails de commande (cascade devrait le faire automatiquement)
    await prisma.details_commande_db.deleteMany({
      where: { commande_r: id },
    })

    // 2. Supprimer la commande
    await prisma.commande_db.delete({
      where: { idcommande: id },
    })

    revalidatePath('/admin/commandes')
    revalidatePath('/historique')
    revalidatePath('/suivi')
  } catch (error) {
    console.error('❌ Error in deleteCommande:', error)
    throw new Error('Impossible de supprimer la commande')
  }
}

/**
 * Ajoute un plat à une commande
 */
export async function addPlatToCommande(
  commandeId: number,
  platId: number,
  quantite: number = 1
): Promise<void> {
  try {
    const plat = await prisma.plats_db.findUnique({
      where: { idplats: platId },
    })

    if (!plat) throw new Error('Plat introuvable')

    await prisma.details_commande_db.create({
      data: {
        commande_r: commandeId,
        plat_r: platId,
        quantite_plat_commande: quantite,
        prix_unitaire: plat.prix,
        nom_plat: plat.plat,
        type: 'plat',
      },
    })

    revalidatePath('/admin/commandes')
    revalidatePath('/modifier-commande')
  } catch (error) {
    console.error('❌ Error in addPlatToCommande:', error)
    throw new Error("Impossible d'ajouter le plat à la commande")
  }
}

/**
 * Met à jour la quantité d'un plat dans une commande
 */
export async function updatePlatQuantite(
  detailId: number,
  quantite: number
): Promise<void> {
  try {
    await prisma.details_commande_db.update({
      where: { iddetails: detailId },
      data: { quantite_plat_commande: quantite },
    })

    revalidatePath('/admin/commandes')
    revalidatePath('/modifier-commande')
  } catch (error) {
    console.error('❌ Error in updatePlatQuantite:', error)
    throw new Error('Impossible de mettre à jour la quantité')
  }
}

/**
 * Retire un plat d'une commande
 */
export async function removePlatFromCommande(detailId: number): Promise<void> {
  try {
    await prisma.details_commande_db.delete({
      where: { iddetails: detailId },
    })

    revalidatePath('/admin/commandes')
    revalidatePath('/modifier-commande')
  } catch (error) {
    console.error('❌ Error in removePlatFromCommande:', error)
    throw new Error('Impossible de retirer le plat de la commande')
  }
}
