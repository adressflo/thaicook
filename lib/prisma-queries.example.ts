// lib/prisma-queries.example.ts
// Example Prisma queries for Chanthana Thai Cook
// Copy and adapt these patterns to your hooks/services

import { prisma, handlePrismaError, type Prisma } from '@/lib/prisma'

// ============================================
// CLIENT QUERIES - Profils clients
// ============================================

/**
 * Find client by Firebase UID
 * Equivalent to: useClient(firebase_uid)
 */
export async function findClientByFirebaseUid(firebaseUid: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { firebaseUid },
      include: {
        commandes: {
          take: 5,
          orderBy: { datePriseCommande: 'desc' },
        },
        evenements: {
          where: { statut: 'En attente' },
        },
      },
    })
    return client
  } catch (error) {
    handlePrismaError(error, 'findClientByFirebaseUid')
  }
}

/**
 * Create new client profile
 * Equivalent to: useCreateClient()
 */
export async function createClient(data: {
  firebaseUid: string
  email: string
  nom?: string
  prenom?: string
  telephone?: string
}) {
  try {
    const client = await prisma.client.create({
      data: {
        firebaseUid: data.firebaseUid,
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        role: 'client',
      },
    })
    return client
  } catch (error) {
    handlePrismaError(error, 'createClient')
  }
}

/**
 * Update client profile
 * Equivalent to: useUpdateClient()
 */
export async function updateClient(
  firebaseUid: string,
  data: Prisma.ClientUpdateInput
) {
  try {
    const client = await prisma.client.update({
      where: { firebaseUid },
      data,
    })
    return client
  } catch (error) {
    handlePrismaError(error, 'updateClient')
  }
}

/**
 * Get all clients with pagination
 * Equivalent to: useClients()
 */
export async function findAllClients(options?: {
  skip?: number
  take?: number
  orderBy?: Prisma.ClientOrderByWithRelationInput
}) {
  try {
    const clients = await prisma.client.findMany({
      skip: options?.skip ?? 0,
      take: options?.take ?? 50,
      orderBy: options?.orderBy ?? { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            commandes: true,
            evenements: true,
          },
        },
      },
    })
    return clients
  } catch (error) {
    handlePrismaError(error, 'findAllClients')
  }
}

// ============================================
// PLAT QUERIES - Menu items
// ============================================

/**
 * Get all available plats (dishes)
 * Equivalent to: usePlats()
 */
export async function findAllPlats(filters?: {
  disponible?: boolean
  categorie?: string
  vegetarien?: boolean
  vegan?: boolean
}) {
  try {
    const plats = await prisma.plat.findMany({
      where: {
        disponible: filters?.disponible ?? true,
        categorie: filters?.categorie,
        vegetarien: filters?.vegetarien,
        vegan: filters?.vegan,
      },
      orderBy: [{ categorie: 'asc' }, { nom: 'asc' }],
    })
    return plats
  } catch (error) {
    handlePrismaError(error, 'findAllPlats')
  }
}

/**
 * Get plat by ID
 * Equivalent to: usePlat(id)
 */
export async function findPlatById(id: number) {
  try {
    const plat = await prisma.plat.findUnique({
      where: { id },
    })
    return plat
  } catch (error) {
    handlePrismaError(error, 'findPlatById')
  }
}

/**
 * Create new plat
 */
export async function createPlat(data: Prisma.PlatCreateInput) {
  try {
    const plat = await prisma.plat.create({
      data,
    })
    return plat
  } catch (error) {
    handlePrismaError(error, 'createPlat')
  }
}

/**
 * Update plat
 */
export async function updatePlat(id: number, data: Prisma.PlatUpdateInput) {
  try {
    const plat = await prisma.plat.update({
      where: { id },
      data,
    })
    return plat
  } catch (error) {
    handlePrismaError(error, 'updatePlat')
  }
}

// ============================================
// COMMANDE QUERIES - Orders
// ============================================

/**
 * Get commandes for a client with full details
 * Equivalent to: useCommandes(firebase_uid)
 */
export async function findCommandesByClient(firebaseUid: string) {
  try {
    const commandes = await prisma.commande.findMany({
      where: { clientFirebaseUid: firebaseUid },
      include: {
        client: {
          select: {
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        details: {
          include: {
            plat: {
              select: {
                nom: true,
                prix: true,
                imageUrl: true,
              },
            },
            extra: {
              select: {
                nom: true,
                prix: true,
              },
            },
          },
        },
      },
      orderBy: { datePriseCommande: 'desc' },
    })
    return commandes
  } catch (error) {
    handlePrismaError(error, 'findCommandesByClient')
  }
}

/**
 * Get all commandes with filters
 * Equivalent to: useAdminCommandes()
 */
export async function findAllCommandes(filters?: {
  statutCommande?: string
  dateFrom?: Date
  dateTo?: Date
}) {
  try {
    const commandes = await prisma.commande.findMany({
      where: {
        statutCommande: filters?.statutCommande,
        datePriseCommande: {
          gte: filters?.dateFrom,
          lte: filters?.dateTo,
        },
      },
      include: {
        client: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
        details: {
          include: {
            plat: true,
            extra: true,
          },
        },
      },
      orderBy: { datePriseCommande: 'desc' },
    })
    return commandes
  } catch (error) {
    handlePrismaError(error, 'findAllCommandes')
  }
}

/**
 * Create commande with details (transaction)
 * Equivalent to: useCreateCommande()
 */
export async function createCommandeWithDetails(data: {
  clientFirebaseUid: string
  dateRetraitSouhaitee?: Date
  typeLivraison?: string
  adresseSpecifique?: string
  demandeSpeciale?: string
  details: Array<{
    platId?: number
    extraId?: number
    quantitePlat: number
    prixUnitaire: number
  }>
}) {
  try {
    // Calculate total amount
    const montantTotal = data.details.reduce(
      (sum, detail) => sum + detail.prixUnitaire * detail.quantitePlat,
      0
    )

    const commande = await prisma.commande.create({
      data: {
        clientFirebaseUid: data.clientFirebaseUid,
        dateRetraitSouhaitee: data.dateRetraitSouhaitee,
        typeLivraison: data.typeLivraison ?? 'À emporter',
        adresseSpecifique: data.adresseSpecifique,
        demandeSpeciale: data.demandeSpeciale,
        statutCommande: 'En attente de confirmation',
        statutPaiement: 'En attente sur place',
        montantTotal,
        details: {
          create: data.details.map((detail) => ({
            platId: detail.platId,
            extraId: detail.extraId,
            quantitePlat: detail.quantitePlat,
            prixUnitaire: detail.prixUnitaire,
            sousTotal: detail.prixUnitaire * detail.quantitePlat,
          })),
        },
      },
      include: {
        client: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
        details: {
          include: {
            plat: true,
            extra: true,
          },
        },
      },
    })
    return commande
  } catch (error) {
    handlePrismaError(error, 'createCommandeWithDetails')
  }
}

/**
 * Update commande status
 * Equivalent to: useUpdateCommande()
 */
export async function updateCommandeStatus(
  id: number,
  data: {
    statutCommande?: string
    statutPaiement?: string
    notesInternes?: string
  }
) {
  try {
    const commande = await prisma.commande.update({
      where: { id },
      data,
      include: {
        details: {
          include: {
            plat: true,
            extra: true,
          },
        },
      },
    })
    return commande
  } catch (error) {
    handlePrismaError(error, 'updateCommandeStatus')
  }
}

/**
 * Delete commande (cascade deletes details)
 */
export async function deleteCommande(id: number) {
  try {
    await prisma.commande.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    handlePrismaError(error, 'deleteCommande')
  }
}

// ============================================
// STATISTICS QUERIES - Dashboard
// ============================================

/**
 * Get commandes statistics
 * Equivalent to: useCommandesStats()
 */
export async function getCommandesStats() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const [total, todayCount, weekCount, monthCount, byStatus] = await Promise.all([
      // Total commandes
      prisma.commande.count(),

      // Commandes today
      prisma.commande.count({
        where: {
          datePriseCommande: { gte: today },
        },
      }),

      // Commandes this week
      prisma.commande.count({
        where: {
          datePriseCommande: { gte: thisWeek },
        },
      }),

      // Commandes this month
      prisma.commande.count({
        where: {
          datePriseCommande: { gte: thisMonth },
        },
      }),

      // Group by status
      prisma.commande.groupBy({
        by: ['statutCommande'],
        _count: true,
      }),
    ])

    // Calculate revenue
    const revenueData = await prisma.commande.aggregate({
      _sum: {
        montantTotal: true,
      },
      where: {
        statutPaiement: {
          in: ['Payé sur place', 'Payé en ligne', 'Payée'],
        },
      },
    })

    const todayRevenue = await prisma.commande.aggregate({
      _sum: {
        montantTotal: true,
      },
      where: {
        datePriseCommande: { gte: today },
        statutPaiement: {
          in: ['Payé sur place', 'Payé en ligne', 'Payée'],
        },
      },
    })

    return {
      total,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
      revenue: {
        total: revenueData._sum.montantTotal ?? 0,
        today: todayRevenue._sum.montantTotal ?? 0,
      },
      parStatut: Object.fromEntries(
        byStatus.map((s) => [s.statutCommande, s._count])
      ),
    }
  } catch (error) {
    handlePrismaError(error, 'getCommandesStats')
  }
}

// ============================================
// EVENEMENT QUERIES - Events
// ============================================

/**
 * Get evenements for a client
 * Equivalent to: useEvenements(firebase_uid)
 */
export async function findEvenementsByClient(firebaseUid: string) {
  try {
    const evenements = await prisma.evenement.findMany({
      where: { contactClientFirebaseUid: firebaseUid },
      include: {
        client: {
          select: {
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
      },
      orderBy: { dateDebut: 'desc' },
    })
    return evenements
  } catch (error) {
    handlePrismaError(error, 'findEvenementsByClient')
  }
}

/**
 * Create evenement
 * Equivalent to: useCreateEvenement()
 */
export async function createEvenement(
  data: Prisma.EvenementCreateInput
) {
  try {
    const evenement = await prisma.evenement.create({
      data,
      include: {
        client: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
    })
    return evenement
  } catch (error) {
    handlePrismaError(error, 'createEvenement')
  }
}

// ============================================
// ADVANCED QUERIES - Complex operations
// ============================================

/**
 * Search plats with full-text search
 */
export async function searchPlats(query: string) {
  try {
    const plats = await prisma.plat.findMany({
      where: {
        OR: [
          { nom: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          {
            ingredients: {
              hasSome: [query],
            },
          },
        ],
        disponible: true,
      },
      orderBy: { nom: 'asc' },
    })
    return plats
  } catch (error) {
    handlePrismaError(error, 'searchPlats')
  }
}

/**
 * Get best-selling plats
 */
export async function getBestSellingPlats(limit: number = 10) {
  try {
    const topPlats = await prisma.detailCommande.groupBy({
      by: ['platId'],
      _sum: {
        quantitePlat: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantitePlat: 'desc',
        },
      },
      take: limit,
      where: {
        platId: {
          not: null,
        },
      },
    })

    // Fetch plat details
    const platIds = topPlats.map((t) => t.platId).filter((id): id is number => id !== null)
    const plats = await prisma.plat.findMany({
      where: {
        id: { in: platIds },
      },
    })

    return topPlats.map((top) => ({
      plat: plats.find((p) => p.id === top.platId),
      totalQuantity: top._sum.quantitePlat ?? 0,
      orderCount: top._count.id,
    }))
  } catch (error) {
    handlePrismaError(error, 'getBestSellingPlats')
  }
}

/**
 * Transaction example: Transfer commande to another client
 */
export async function transferCommande(
  commandeId: number,
  newClientFirebaseUid: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Verify new client exists
      const newClient = await tx.client.findUnique({
        where: { firebaseUid: newClientFirebaseUid },
      })
      if (!newClient) {
        throw new Error('Client destination introuvable')
      }

      // Transfer commande
      const commande = await tx.commande.update({
        where: { id: commandeId },
        data: {
          clientFirebaseUid: newClientFirebaseUid,
          notesInternes: {
            set: `Transférée au client ${newClient.nom} ${newClient.prenom}`,
          },
        },
        include: {
          client: true,
          details: true,
        },
      })

      return commande
    })
    return result
  } catch (error) {
    handlePrismaError(error, 'transferCommande')
  }
}
