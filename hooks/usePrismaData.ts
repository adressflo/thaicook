'use client'

/**
 * PRISMA ORM HOOKS - Migration depuis useSupabaseData.ts
 *
 * Ce fichier contient les hooks TanStack Query utilisant Prisma ORM
 * pour remplacer progressivement les requêtes Supabase directes.
 *
 * Architecture:
 * - Prisma Client singleton depuis lib/prisma.ts
 * - TanStack Query pour cache et optimistic updates
 * - Validation Zod maintenue pour sécurité
 * - Toast notifications pour UX
 *
 * Migration Status:
 * - ✅ Client hooks (useClient, useCreateClient, useUpdateClient, useClients)
 * - ✅ Plat hooks (usePlats, useCreatePlat, useUpdatePlat, useDeletePlat)
 * - ✅ Commande hooks (useCommandeById, useCommandesByClient, useCreateCommande)
 * - ⏭️ Evenement hooks (à migrer)
 * - ⏭️ Extras hooks (à migrer)
 */

import { useToast } from '@/hooks/use-toast'
import { prisma, handlePrismaError } from '@/lib/prisma'
import {
  safeValidate,
  clientProfileSchema,
  evenementSchema,
  commandeSchema,
} from '@/lib/validations'
import type {
  ClientInputData,
  ClientUI,
  CommandeUI,
  CreateCommandeData,
  PlatUI,
} from '@/types/app'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// ============================================
// TYPES PRISMA
// ============================================

// Types extraits du Prisma Client généré
import type { client_db, plats_db, commande_db, details_commande_db, evenements_db, extras_db } from '@prisma/client'

// Types avec relations pour les queries complexes
type ClientWithRelations = client_db & {
  commande_db?: commande_db[]
  evenements_db?: evenements_db[]
}

type CommandeWithDetails = commande_db & {
  client_db?: client_db | null
  details_commande_db?: (details_commande_db & {
    plats_db?: plats_db | null
    extras_db?: extras_db | null
  })[]
}

type PlatWithRelations = plats_db

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Convertit un client Prisma en format ClientUI pour l'interface
 */
const convertClientToUI = (client: client_db): ClientUI => {
  return {
    idclient: Number(client.idclient),
    firebase_uid: client.firebase_uid,
    role: client.role || 'client',
    nom: client.nom || '',
    prenom: client.prenom || '',
    email: client.email || '',
    numero_de_telephone: client.numero_de_telephone || '',
    adresse_numero_et_rue: client.adresse_numero_et_rue || '',
    code_postal: client.code_postal || null,
    ville: client.ville || '',
    date_de_naissance: client.date_de_naissance?.toISOString() || null,
    photo_client: client.photo_client || null,
    preference_client: client.preference_client || '',
    comment_avez_vous_connu: client.comment_avez_vous_connu || [],
    souhaitez_vous_recevoir_actualites: client.souhaitez_vous_recevoir_actualites || false,
  }
}

/**
 * Convertit un plat Prisma en format PlatUI pour l'interface
 */
const convertPlatToUI = (plat: plats_db): PlatUI => {
  return {
    idplats: plat.idplats,
    plat: plat.plat,
    description: plat.description || '',
    prix: plat.prix ? Number(plat.prix) : 0,
    photo_du_plat: plat.photo_du_plat || null,
    lundi_dispo: plat.lundi_dispo === 'oui',
    mardi_dispo: plat.mardi_dispo === 'oui',
    mercredi_dispo: plat.mercredi_dispo === 'oui',
    jeudi_dispo: plat.jeudi_dispo === 'oui',
    vendredi_dispo: plat.vendredi_dispo === 'oui',
    samedi_dispo: plat.samedi_dispo === 'oui',
    dimanche_dispo: plat.dimanche_dispo === 'oui',
    est_epuise: plat.est_epuise || false,
    epuise_depuis: plat.epuise_depuis?.toISOString() || null,
    epuise_jusqu_a: plat.epuise_jusqu_a?.toISOString() || null,
    raison_epuisement: plat.raison_epuisement || null,
  }
}

/**
 * Convertit une commande Prisma avec détails en format CommandeUI
 */
const convertCommandeToUI = (commande: CommandeWithDetails): CommandeUI => {
  return {
    idcommande: commande.idcommande,
    client_r: commande.client_r || '',
    date_et_heure_de_retrait_souhaitees: commande.date_et_heure_de_retrait_souhaitees?.toISOString() || null,
    date_de_prise_de_commande: commande.date_de_prise_de_commande?.toISOString() || null,
    statut_commande: commande.statut_commande || 'En_attente_de_confirmation',
    demande_special_pour_la_commande: commande.demande_special_pour_la_commande || '',
    statut_paiement: commande.statut_paiement || 'En_attente_sur_place',
    notes_internes: commande.notes_internes || '',
    type_livraison: commande.type_livraison || 'emporter',
    adresse_specifique: commande.adresse_specifique || '',
    nom_evenement: commande.nom_evenement || '',
    details_commande_db: commande.details_commande_db?.map(detail => ({
      iddetails: detail.iddetails,
      commande_r: detail.commande_r,
      plat_r: detail.plat_r,
      quantite_plat_commande: detail.quantite_plat_commande || 1,
      nom_plat: detail.nom_plat || '',
      prix_unitaire: detail.prix_unitaire ? Number(detail.prix_unitaire) : 0,
      type: detail.type || 'plat',
      extra_id: detail.extra_id || null,
      plats_db: detail.plats_db ? convertPlatToUI(detail.plats_db) : null,
      extras_db: detail.extras_db ? {
        idextra: detail.extras_db.idextra,
        nom_extra: detail.extras_db.nom_extra,
        description: detail.extras_db.description || '',
        prix: Number(detail.extras_db.prix),
        photo_url: detail.extras_db.photo_url || null,
        actif: detail.extras_db.actif || false,
      } : null,
    })) || [],
  }
}

// ============================================
// CLIENT HOOKS
// ============================================

/**
 * Hook pour récupérer un client par son Firebase UID
 * Équivalent: useClient() de useSupabaseData.ts
 */
export const usePrismaClient = (firebaseUid?: string) => {
  return useQuery({
    queryKey: ['prisma-client', firebaseUid],
    queryFn: async (): Promise<ClientUI | null> => {
      if (!firebaseUid) return null

      try {
        const client = await prisma.client_db.findUnique({
          where: { firebase_uid: firebaseUid },
        })

        return client ? convertClientToUI(client) : null
      } catch (error) {
        handlePrismaError(error, 'usePrismaClient')
      }
    },
    enabled: !!firebaseUid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook pour créer un nouveau client
 * Équivalent: useCreateClient() de useSupabaseData.ts
 */
export const usePrismaCreateClient = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (clientData: ClientInputData): Promise<ClientUI> => {
      // Validation Zod sécurisée
      const validation = safeValidate(clientProfileSchema, clientData)
      if (!validation.success) {
        const errorMessages = validation.errors?.issues
          ?.map((err: any) => `${err.path.join('.')}: ${err.message}`)
          .join('; ') || 'Erreur de validation inconnue'
        throw new Error(`Données client invalides: ${errorMessages}`)
      }

      const validatedData = validation.data

      try {
        // Vérifier si le client existe déjà
        const existingClient = await prisma.client_db.findUnique({
          where: { firebase_uid: validatedData.firebase_uid },
        })

        if (existingClient) {
          console.log('Client existant trouvé:', existingClient.idclient)
          return convertClientToUI(existingClient)
        }

        // Créer le nouveau client avec conversion BigInt
        const newClient = await prisma.client_db.create({
          data: {
            firebase_uid: validatedData.firebase_uid,
            email: validatedData.email || null,
            nom: validatedData.nom || null,
            prenom: validatedData.prenom || null,
            numero_de_telephone: validatedData.numero_de_telephone || null,
            adresse_numero_et_rue: validatedData.adresse_numero_et_rue || null,
            code_postal: validatedData.code_postal || null,
            ville: validatedData.ville || null,
            date_de_naissance: validatedData.date_de_naissance
              ? new Date(validatedData.date_de_naissance)
              : null,
            photo_client: validatedData.photo_client || null,
            preference_client: validatedData.preference_client || null,
            comment_avez_vous_connu: validatedData.comment_avez_vous_connu || [],
            souhaitez_vous_recevoir_actualites: validatedData.souhaitez_vous_recevoir_actualites || false,
            role: 'client',
          },
        })

        console.log('✅ Client créé avec Prisma:', newClient.idclient)
        return convertClientToUI(newClient)
      } catch (error) {
        handlePrismaError(error, 'usePrismaCreateClient')
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prisma-client', data.firebase_uid] })
      queryClient.invalidateQueries({ queryKey: ['prisma-clients'] })
      toast({ title: 'Profil créé avec succès' })
    },
    onError: (error) => {
      console.error('Erreur création client Prisma:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook pour mettre à jour un client
 * Équivalent: useUpdateClient() de useSupabaseData.ts
 */
export const usePrismaUpdateClient = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      firebase_uid,
      data,
    }: {
      firebase_uid: string
      data: Partial<ClientInputData>
    }): Promise<ClientUI> => {
      try {
        const updatedClient = await prisma.client_db.update({
          where: { firebase_uid },
          data: {
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            numero_de_telephone: data.numero_de_telephone,
            adresse_numero_et_rue: data.adresse_numero_et_rue,
            code_postal: data.code_postal,
            ville: data.ville,
            date_de_naissance: data.date_de_naissance
              ? new Date(data.date_de_naissance)
              : undefined,
            photo_client: data.photo_client,
            preference_client: data.preference_client,
            comment_avez_vous_connu: data.comment_avez_vous_connu,
            souhaitez_vous_recevoir_actualites: data.souhaitez_vous_recevoir_actualites,
          },
        })

        console.log('✅ Client mis à jour avec Prisma:', updatedClient.idclient)
        return convertClientToUI(updatedClient)
      } catch (error) {
        handlePrismaError(error, 'usePrismaUpdateClient')
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prisma-client', data.firebase_uid] })
      queryClient.invalidateQueries({ queryKey: ['prisma-clients'] })
      toast({ title: 'Profil mis à jour avec succès' })
    },
    onError: (error) => {
      console.error('Erreur mise à jour client Prisma:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook pour récupérer tous les clients (admin)
 * Équivalent: useClients() de useSupabaseData.ts
 */
export const usePrismaClients = () => {
  return useQuery({
    queryKey: ['prisma-clients'],
    queryFn: async (): Promise<ClientUI[]> => {
      try {
        const clients = await prisma.client_db.findMany({
          orderBy: { idclient: 'desc' },
        })

        return clients.map(convertClientToUI)
      } catch (error) {
        handlePrismaError(error, 'usePrismaClients')
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// ============================================
// PLAT HOOKS
// ============================================

/**
 * Hook pour récupérer tous les plats
 * Équivalent: usePlats() de useSupabaseData.ts
 */
export const usePrismaPlats = () => {
  return useQuery({
    queryKey: ['prisma-plats'],
    queryFn: async (): Promise<PlatUI[]> => {
      try {
        const plats = await prisma.plats_db.findMany({
          orderBy: { idplats: 'asc' },
        })

        return plats.map(convertPlatToUI)
      } catch (error) {
        handlePrismaError(error, 'usePrismaPlats')
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

/**
 * Hook pour créer un nouveau plat
 * Équivalent: useCreatePlat() de useSupabaseData.ts
 */
export const usePrismaCreatePlat = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (platData: Omit<PlatUI, 'idplats'>): Promise<PlatUI> => {
      try {
        const newPlat = await prisma.plats_db.create({
          data: {
            plat: platData.plat,
            description: platData.description || null,
            prix: platData.prix,
            photo_du_plat: platData.photo_du_plat || null,
            lundi_dispo: platData.lundi_dispo ? 'oui' : 'non',
            mardi_dispo: platData.mardi_dispo ? 'oui' : 'non',
            mercredi_dispo: platData.mercredi_dispo ? 'oui' : 'non',
            jeudi_dispo: platData.jeudi_dispo ? 'oui' : 'non',
            vendredi_dispo: platData.vendredi_dispo ? 'oui' : 'non',
            samedi_dispo: platData.samedi_dispo ? 'oui' : 'non',
            dimanche_dispo: platData.dimanche_dispo ? 'oui' : 'non',
            est_epuise: platData.est_epuise || false,
          },
        })

        console.log('✅ Plat créé avec Prisma:', newPlat.idplats)
        return convertPlatToUI(newPlat)
      } catch (error) {
        handlePrismaError(error, 'usePrismaCreatePlat')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-plats'] })
      toast({ title: 'Plat créé avec succès' })
    },
    onError: (error) => {
      console.error('Erreur création plat Prisma:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook pour mettre à jour un plat
 * Équivalent: useUpdatePlat() de useSupabaseData.ts
 */
export const usePrismaUpdatePlat = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      idplats,
      data,
    }: {
      idplats: number
      data: Partial<PlatUI>
    }): Promise<PlatUI> => {
      try {
        const updatedPlat = await prisma.plats_db.update({
          where: { idplats },
          data: {
            plat: data.plat,
            description: data.description,
            prix: data.prix,
            photo_du_plat: data.photo_du_plat,
            lundi_dispo: data.lundi_dispo !== undefined ? (data.lundi_dispo ? 'oui' : 'non') : undefined,
            mardi_dispo: data.mardi_dispo !== undefined ? (data.mardi_dispo ? 'oui' : 'non') : undefined,
            mercredi_dispo: data.mercredi_dispo !== undefined ? (data.mercredi_dispo ? 'oui' : 'non') : undefined,
            jeudi_dispo: data.jeudi_dispo !== undefined ? (data.jeudi_dispo ? 'oui' : 'non') : undefined,
            vendredi_dispo: data.vendredi_dispo !== undefined ? (data.vendredi_dispo ? 'oui' : 'non') : undefined,
            samedi_dispo: data.samedi_dispo !== undefined ? (data.samedi_dispo ? 'oui' : 'non') : undefined,
            dimanche_dispo: data.dimanche_dispo !== undefined ? (data.dimanche_dispo ? 'oui' : 'non') : undefined,
            est_epuise: data.est_epuise,
            epuise_depuis: data.epuise_depuis ? new Date(data.epuise_depuis) : undefined,
            epuise_jusqu_a: data.epuise_jusqu_a ? new Date(data.epuise_jusqu_a) : undefined,
            raison_epuisement: data.raison_epuisement,
          },
        })

        console.log('✅ Plat mis à jour avec Prisma:', updatedPlat.idplats)
        return convertPlatToUI(updatedPlat)
      } catch (error) {
        handlePrismaError(error, 'usePrismaUpdatePlat')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-plats'] })
      toast({ title: 'Plat mis à jour avec succès' })
    },
    onError: (error) => {
      console.error('Erreur mise à jour plat Prisma:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook pour supprimer un plat
 * Équivalent: useDeletePlat() de useSupabaseData.ts
 */
export const usePrismaDeletePlat = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (idplats: number): Promise<void> => {
      try {
        await prisma.plats_db.delete({
          where: { idplats },
        })

        console.log('✅ Plat supprimé avec Prisma:', idplats)
      } catch (error) {
        handlePrismaError(error, 'usePrismaDeletePlat')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-plats'] })
      toast({ title: 'Plat supprimé avec succès' })
    },
    onError: (error) => {
      console.error('Erreur suppression plat Prisma:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// COMMANDE HOOKS
// ============================================

/**
 * Hook pour récupérer une commande par ID avec détails
 * Équivalent: useCommandeById() de useSupabaseData.ts
 */
export const usePrismaCommandeById = (idcommande?: number) => {
  return useQuery({
    queryKey: ['prisma-commande', idcommande],
    queryFn: async (): Promise<CommandeUI | null> => {
      if (!idcommande) return null

      try {
        const commande = await prisma.commande_db.findUnique({
          where: { idcommande },
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
        handlePrismaError(error, 'usePrismaCommandeById')
      }
    },
    enabled: !!idcommande,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook pour récupérer toutes les commandes d'un client
 * Équivalent: useCommandesByClient() de useSupabaseData.ts
 */
export const usePrismaCommandesByClient = (firebaseUid?: string) => {
  return useQuery({
    queryKey: ['prisma-commandes-client', firebaseUid],
    queryFn: async (): Promise<CommandeUI[]> => {
      if (!firebaseUid) return []

      try {
        // Récupérer d'abord le client pour obtenir son ID
        const client = await prisma.client_db.findUnique({
          where: { firebase_uid: firebaseUid },
        })

        if (!client) return []

        const commandes = await prisma.commande_db.findMany({
          where: { client_r_id: client.idclient },
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
        handlePrismaError(error, 'usePrismaCommandesByClient')
      }
    },
    enabled: !!firebaseUid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook pour créer une nouvelle commande avec détails (transaction)
 * Équivalent: useCreateCommande() de useSupabaseData.ts
 */
export const usePrismaCreateCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (commandeData: CreateCommandeData): Promise<CommandeUI> => {
      try {
        // Récupérer le client pour obtenir son idclient (BigInt)
        const client = await prisma.client_db.findUnique({
          where: { firebase_uid: commandeData.client_r },
        })

        if (!client) {
          throw new Error('Client non trouvé')
        }

        // Transaction Prisma pour créer commande + détails atomiquement
        const newCommande = await prisma.commande_db.create({
          data: {
            client_r: commandeData.client_r,
            client_r_id: client.idclient, // BigInt correctement typé
            date_et_heure_de_retrait_souhaitees: commandeData.date_et_heure_de_retrait_souhaitees
              ? new Date(commandeData.date_et_heure_de_retrait_souhaitees)
              : null,
            demande_special_pour_la_commande: commandeData.demande_special_pour_la_commande || null,
            type_livraison: commandeData.type_livraison || 'emporter',
            adresse_specifique: commandeData.adresse_specifique || null,
            statut_commande: 'En_attente_de_confirmation',
            statut_paiement: 'En_attente_sur_place',
            details_commande_db: {
              create: commandeData.details.map(detail => ({
                plat_r: detail.plat_r,
                quantite_plat_commande: detail.quantite_plat_commande,
                nom_plat: detail.nom_plat,
                prix_unitaire: detail.prix_unitaire,
                type: detail.type || 'plat',
                extra_id: detail.extra_id || null,
              })),
            },
          },
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

        console.log('✅ Commande créée avec Prisma:', newCommande.idcommande)
        return convertCommandeToUI(newCommande)
      } catch (error) {
        handlePrismaError(error, 'usePrismaCreateCommande')
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes-client', data.client_r] })
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes'] })
      toast({ title: 'Commande créée avec succès' })
    },
    onError: (error) => {
      console.error('Erreur création commande Prisma:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook pour récupérer toutes les commandes (admin)
 * Équivalent: useCommandes() de useSupabaseData.ts
 */
export const usePrismaCommandes = () => {
  return useQuery({
    queryKey: ['prisma-commandes'],
    queryFn: async (): Promise<CommandeUI[]> => {
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
        handlePrismaError(error, 'usePrismaCommandes')
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Client hooks
  usePrismaClient,
  usePrismaCreateClient,
  usePrismaUpdateClient,
  usePrismaClients,

  // Plat hooks
  usePrismaPlats,
  usePrismaCreatePlat,
  usePrismaUpdatePlat,
  usePrismaDeletePlat,

  // Commande hooks
  usePrismaCommandeById,
  usePrismaCommandesByClient,
  usePrismaCreateCommande,
  usePrismaCommandes,
}
