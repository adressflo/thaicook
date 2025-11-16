'use client'

/**
 * PRISMA ORM HOOKS - Architecture Server Actions
 *
 * Ce fichier contient les hooks TanStack Query qui appellent les Server Actions.
 * Les Server Actions (app/actions/*.ts) gèrent Prisma côté serveur.
 *
 * Architecture:
 * - Client (hooks) → Server Actions → Prisma → PostgreSQL
 * - TanStack Query pour cache et optimistic updates
 * - Toast notifications pour UX
 *
 * Migration Status:
 * - ✅ Plat hooks (usePrismaPlats, usePrismaCreatePlat, etc.)
 * - ✅ Client hooks (usePrismaClients, usePrismaCreateClient, etc.)
 * - ✅ Commande hooks (usePrismaCommandes, usePrismaCreateCommande, etc.)
 * - ✅ Extra hooks (usePrismaExtras, usePrismaCreateExtra, etc.)
 * - ✅ Evenement hooks (usePrismaEvenementsByClient, usePrismaCreateEvenement, etc.)
 */

import { useToast } from '@/hooks/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Helper pour extraire data des SafeActionResult de next-safe-action
 * Gère les erreurs de validation et serveur automatiquement
 */
async function unwrapSafeAction<T>(actionPromise: Promise<any>): Promise<T> {
  const result = await actionPromise

  // Si l'action a retourné directement les données (anciennes actions)
  if (result && !('data' in result)) {
    return result as T
  }

  // next-safe-action format: { data, serverError, validationErrors }
  if (result.serverError) {
    console.error('❌ Server error dans unwrapSafeAction:', result.serverError);
    throw new Error(result.serverError)
  }

  if (result.validationErrors) {
    console.error('❌ Validation errors dans unwrapSafeAction:', result.validationErrors);
    const firstError = Object.values(result.validationErrors)[0]
    throw new Error(Array.isArray(firstError) ? firstError[0] : String(firstError))
  }

  if (!result.data) {
    console.error('❌ Pas de données dans unwrapSafeAction, result:', result);
    throw new Error('Action échouée sans données')
  }

  return result.data as T
}

// Import Server Actions
import {
  getPlats,
  createPlat,
  updatePlat,
  deletePlat,
} from '@/app/actions/plats'

import {
  getClients,
  getClientByAuthUserId,
  getClientById,
  createClient,
  updateClient,
  searchClients,
} from '@/app/actions/clients'

import {
  getCommandes,
  getCommandeById,
  getCommandesByClient,
  createCommande,
  updateCommande,
  toggleEpingleCommande,
  toggleOffertDetail,
  deleteCommande,
  addPlatToCommande,
  updatePlatQuantite,
  updateSpiceLevel,
  removePlatFromCommande,
  addExtraToCommande,
} from '@/app/actions/commandes'

import {
  getExtras,
  createExtra,
  updateExtra,
  deleteExtra,
} from '@/app/actions/extras'

import {
  getEvenementsByClient,
  getEvenementById,
  createEvenement,
  updateEvenement,
  deleteEvenement,
  getAllEvenements,
} from '@/app/actions/evenements'

import type {
  ClientUI,
  CommandeUI,
  CreateCommandeData,
  DetailCommande,
  PlatUI,
  ExtraUI,
  EvenementUI,
  CreateEvenementData,
} from '@/types/app'

// ============================================
// PLAT HOOKS
// ============================================

/**
 * Récupère tous les plats actifs
 */
export const usePrismaPlats = () => {
  return useQuery({
    queryKey: ['prisma-plats'],
    queryFn: async (): Promise<PlatUI[]> => {
      return await getPlats()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Crée un nouveau plat
 */
export const usePrismaCreatePlat = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      nom_plat: string
      description?: string
      prix: string // <-- Changé en string
      photo_url?: string
      categorie?: string
      actif?: boolean
    }) => {
      // Mapper les noms de propriétés pour l'API
      return await unwrapSafeAction<PlatUI>(createPlat({
        plat: data.nom_plat,
        description: data.description,
        prix: data.prix,
        photo_du_plat: data.photo_url,
      }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-plats'] })
      toast({
        title: 'Plat créé',
        description: 'Le plat a été créé avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Met à jour un plat
 */
export const usePrismaUpdatePlat = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{
      plat?: string
      description?: string
      prix?: string // Changed to string
      photo_du_plat?: string
      est_epuise?: boolean
      lundi_dispo?: any
      mardi_dispo?: any
      mercredi_dispo?: any
      jeudi_dispo?: any
      vendredi_dispo?: any
      samedi_dispo?: any
      dimanche_dispo?: any
    }> }) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<PlatUI>(updatePlat({ id, ...data }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-plats'] })
      toast({
        title: 'Plat modifié',
        description: 'Le plat a été modifié avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Supprime un plat
 */
export const usePrismaDeletePlat = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: number) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<{ success: boolean; id: number }>(deletePlat({ id }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-plats'] })
      toast({
        title: 'Plat supprimé',
        description: 'Le plat a été supprimé avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// CLIENT HOOKS
// ============================================

/**
 * Récupère tous les clients
 */
export const usePrismaClients = () => {
  return useQuery({
    queryKey: ['prisma-clients'],
    queryFn: async (): Promise<ClientUI[]> => {
      return await getClients()
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

/**
 * Récupère un client par auth_user_id
 */
export const usePrismaClient = (authUserId?: string) => {
  return useQuery({
    queryKey: ['prisma-client', authUserId],
    queryFn: async (): Promise<ClientUI | null> => {
      if (!authUserId) return null
      return await getClientByAuthUserId(authUserId)
    },
    enabled: !!authUserId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

/**
 * Récupère un client par ID
 */
export const usePrismaClientById = (id?: number) => {
  return useQuery({
    queryKey: ['prisma-client-id', id],
    queryFn: async (): Promise<ClientUI | null> => {
      if (!id) return null
      return await getClientById(id)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

/**
 * Crée un nouveau client
 */
export const usePrismaCreateClient = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      auth_user_id: string
      email: string
      nom?: string
      prenom?: string
      numero_de_telephone?: string
    }) => {
      const clientData = {
        ...data,
        nom: data.nom || '',
        prenom: data.prenom || '',
      };
      return await unwrapSafeAction<ClientUI>(createClient(clientData))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-clients'] })
      toast({
        title: 'Client créé',
        description: 'Le client a été créé avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Met à jour un client
 */
export const usePrismaUpdateClient = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      // next-safe-action attend seulement data (authUserId vient du ctx)
      return await unwrapSafeAction<ClientUI>(updateClient(data))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-clients'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-client'] })
      toast({
        title: 'Client modifié',
        description: 'Le client a été modifié avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Recherche des clients
 */
export const usePrismaSearchClients = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['prisma-search-clients', searchTerm],
    queryFn: async (): Promise<ClientUI[]> => {
      if (!searchTerm || searchTerm.length < 2) return []
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<ClientUI[]>(searchClients({ searchTerm }))
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 1000 * 60 * 2,
  })
}

// ============================================
// COMMANDE HOOKS
// ============================================

/**
 * Récupère toutes les commandes
 */
export const usePrismaCommandes = () => {
  return useQuery({
    queryKey: ['prisma-commandes'],
    queryFn: async (): Promise<CommandeUI[]> => {
      return await getCommandes()
    },
    staleTime: 1000 * 60 * 2, // 2 minutes (données plus volatiles)
    gcTime: 1000 * 60 * 5,
  })
}

/**
 * Récupère une commande par ID
 */
export const usePrismaCommandeById = (id?: number) => {
  return useQuery({
    queryKey: ['prisma-commande', id],
    queryFn: async (): Promise<CommandeUI | null> => {
      if (!id) return null
      return await getCommandeById(id)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  })
}

/**
 * Récupère les commandes d'un client
 */
export const usePrismaCommandesByClient = (clientId?: number) => {
  return useQuery({
    queryKey: ['prisma-commandes-client', clientId],
    queryFn: async (): Promise<CommandeUI[]> => {
      if (!clientId) return []
      return await getCommandesByClient(clientId)
    },
    enabled: !!clientId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  })
}

/**
 * Crée une nouvelle commande
 */
export const usePrismaCreateCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateCommandeData) => {
      // Filter out details with null plat_r and ensure required fields
      const cleanedData = {
        ...data,
        details: data.details?.filter(d => d.plat_r !== null).map(d => ({
          ...d,
          plat_r: d.plat_r!,
          quantite_plat_commande: d.quantite_plat_commande ?? 1,
        })),
        plats: data.plats?.map(p => ({
          ...p,
          quantite: p.quantite ?? 1,
        })),
      };
      return await unwrapSafeAction<CommandeUI>(createCommande(cleanedData))
    },
    onSuccess: () => {
      // Invalider toutes les requêtes de commandes (exact: false pour matcher les sous-clés)
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes-client'], exact: false })
      toast({
        title: 'Commande créée',
        description: 'Votre commande a été créée avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Met à jour une commande
 */
export const usePrismaUpdateCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      console.log('🔵 CLIENT usePrismaUpdateCommande - Avant appel:', { id, data });
      // next-safe-action attend un seul objet
      const payload = { id, ...data };
      console.log('🔵 CLIENT - Payload final envoyé:', payload);
      return await unwrapSafeAction<CommandeUI>(updateCommande(payload))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-commande'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes-client'] })
      toast({
        title: 'Commande modifiée',
        description: 'La commande a été modifiée avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Toggle le statut épinglé d'une commande
 */
export const usePrismaToggleEpingleCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: number) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<CommandeUI>(toggleEpingleCommande({ id }))
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-commande', data.idcommande] })
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes-client'] })
      toast({
        title: data.epingle ? 'Commande épinglée' : 'Commande désépinglée',
        description: data.epingle
          ? 'La commande restera en haut de la liste'
          : 'La commande reprend sa position normale',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Toggle le statut offert d'un détail de commande
 */
export const usePrismaToggleOffertDetail = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ detailId, prixOriginal }: { detailId: number; prixOriginal?: string }) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<DetailCommande>(toggleOffertDetail({ detailId, prixOriginal }))
    },
    onSuccess: (data) => {
      // Invalider toutes les queries liées aux commandes
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-commande'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes-client'] })

      toast({
        title: data.est_offert ? 'Plat offert' : 'Offre annulée',
        description: data.est_offert
          ? 'Le plat a été marqué comme offert'
          : 'Le prix original a été restauré',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Supprime une commande
 */
export const usePrismaDeleteCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: number) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<{ success: boolean; id: number }>(deleteCommande({ id }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-commandes-client'] })
      toast({
        title: 'Commande supprimée',
        description: 'La commande a été supprimée avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Ajoute un plat à une commande
 */
export const usePrismaAddPlatToCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      commandeId,
      platId,
      quantite = 1,
    }: {
      commandeId: number
      platId: number
      quantite?: number
    }) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<{ success: boolean }>(addPlatToCommande({ commandeId, platId, quantite }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commande'] })
      toast({
        title: 'Plat ajouté',
        description: 'Le plat a été ajouté à la commande',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Ajoute un extra à une commande
 */
export const usePrismaAddExtraToCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      commandeId,
      extraId,
      quantite = 1,
    }: {
      commandeId: number
      extraId: number
      quantite?: number
    }) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<{ success: boolean }>(addExtraToCommande({ commandeId, extraId, quantite }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commande'] })
      toast({
        title: 'Extra ajouté',
        description: 'L\'extra a été ajouté à la commande',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Met à jour la quantité d'un plat
 */
export const usePrismaUpdatePlatQuantite = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      detailId,
      quantite,
    }: {
      detailId: number
      quantite: number
    }) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<{ success: boolean }>(updatePlatQuantite({ detailId, quantite }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commande'] })
      toast({
        title: 'Quantité modifiée',
        description: 'La quantité a été modifiée avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Met à jour le niveau épicé d'un détail de commande
 */
export const usePrismaUpdateSpiceLevel = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      detailId,
      spiceLevel,
    }: {
      detailId: number
      spiceLevel: number
    }) => {
      return await unwrapSafeAction<{ success: boolean }>(updateSpiceLevel({ detailId, spiceLevel }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commande'] })
      toast({
        title: 'Niveau épicé modifié',
        description: 'Le niveau épicé a été modifié avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Retire un plat d'une commande
 */
export const usePrismaRemovePlatFromCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (detailId: number) => {
      // next-safe-action attend un seul objet avec 'id'
      return await unwrapSafeAction<{ success: boolean; detailId: number }>(removePlatFromCommande({ id: detailId }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-commande'] })
      toast({
        title: 'Plat retiré',
        description: 'Le plat a été retiré de la commande',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// EXTRA HOOKS
// ============================================

/**
 * Récupère tous les extras actifs
 */
export const usePrismaExtras = () => {
  return useQuery({
    queryKey: ['prisma-extras'],
    queryFn: async (): Promise<ExtraUI[]> => {
      return await getExtras()
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

/**
 * Crée un nouvel extra
 */
export const usePrismaCreateExtra = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      nom_extra: string
      description?: string
      prix: string // <-- Changé en string
      photo_url?: string
      actif?: boolean
    }) => {
      return await unwrapSafeAction<ExtraUI>(createExtra(data))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-extras'] })
      toast({
        title: 'Extra créé',
        description: 'L\'extra a été créé avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Met à jour un extra
 */
export const usePrismaUpdateExtra = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{
      nom_extra?: string
      description?: string
      prix?: string // Changed to string
      photo_url?: string
      actif?: boolean
    }> }) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<ExtraUI>(updateExtra({ id, data }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-extras'] })
      toast({
        title: 'Extra modifié',
        description: 'L\'extra a été modifié avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Supprime un extra
 */
export const usePrismaDeleteExtra = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: number) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<{ success: boolean }>(deleteExtra({ id }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-extras'] })
      toast({
        title: 'Extra supprimé',
        description: 'L\'extra a été supprimé avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// EVENEMENT HOOKS
// ============================================

/**
 * Récupère les événements d'un client
 */
export const usePrismaEvenementsByClient = (clientId?: number) => {
  return useQuery({
    queryKey: ['prisma-evenements-client', clientId],
    queryFn: async (): Promise<EvenementUI[]> => {
      if (!clientId) return []
      return await getEvenementsByClient(clientId)
    },
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

/**
 * Récupère un événement par ID
 */
export const usePrismaEvenementById = (id?: number) => {
  return useQuery({
    queryKey: ['prisma-evenement', id],
    queryFn: async (): Promise<EvenementUI | null> => {
      if (!id) return null
      return await getEvenementById(id)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

/**
 * Crée un nouvel événement
 */
export const usePrismaCreateEvenement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateEvenementData) => {
      return await unwrapSafeAction<EvenementUI>(createEvenement(data))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-evenements'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-evenements-client'] })
      toast({
        title: 'Événement créé',
        description: 'Votre événement a été créé avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Met à jour un événement
 */
export const usePrismaUpdateEvenement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{
      date_evenement?: string
      type_d_evenement?: string
      nombre_de_personnes?: number
      budget_client?: string // Changed to string
      demandes_speciales_evenement?: string
      statut_evenement?: string
      plats_preselectionnes?: number[]
      notes_internes_evenement?: string
    }> }) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<EvenementUI>(updateEvenement({ id, ...data }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-evenements'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-evenement'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-evenements-client'] })
      toast({
        title: 'Événement modifié',
        description: 'L\'événement a été modifié avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Supprime un événement
 */
export const usePrismaDeleteEvenement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: number) => {
      // next-safe-action attend un seul objet
      return await unwrapSafeAction<{ success: boolean; id: number }>(deleteEvenement({ id }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-evenements'] })
      queryClient.invalidateQueries({ queryKey: ['prisma-evenements-client'] })
      toast({
        title: 'Événement supprimé',
        description: 'L\'événement a été supprimé avec succès',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

/**
 * Récupère tous les événements (admin)
 */
export const usePrismaAllEvenements = () => {
  return useQuery({
    queryKey: ['prisma-all-evenements'],
    queryFn: async (): Promise<EvenementUI[]> => {
      return await getAllEvenements()
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
