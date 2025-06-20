import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabaseService, supabase } from '@/services/supabaseService'
import type { Client, Plat, Commande, Evenement, ClientInputData, CommandeInputData, EvenementInputData } from '@/types/supabase'
import type { PlatUI, CommandeUI, EvenementUI, ClientUI, CreateCommandeData, CreateEvenementData } from '@/types/app'
import { useToast } from '@/hooks/use-toast'

// Types pour les mises à jour
export type CommandeUpdate = {
  statut_commande?: 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée'
  statut_paiement?: 'En attente sur place' | 'Payé sur place' | 'Payé en ligne' | 'Non payé' | 'Payée'
  notes_internes?: string
  date_et_heure_de_retrait_souhaitees?: string
  type_livraison?: 'À emporter' | 'Livraison'
  adresse_specifique?: string
}

// Hook pour récupérer les clients par firebase_uid
export const useClient = (firebase_uid?: string) => {
  return useQuery({
    queryKey: ['client', firebase_uid],
    queryFn: async () => {
      if (!firebase_uid) return null
      const { data, error } = await supabase
        .from('client_db')
        .select('*')
        .eq('firebase_uid', firebase_uid)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!firebase_uid,
  })
}

// Hook pour créer un client
export const useCreateClient = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async (clientData: ClientInputData) => {
      const { data, error } = await supabase
        .from('client_db')
        .insert(clientData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client', data.firebase_uid] })
      toast({ title: "Profil créé avec succès" })
    },
    onError: (error) => {
      console.error('Erreur création client:', error)
      toast({ 
        title: "Erreur", 
        description: "Impossible de créer le profil",
        variant: "destructive" 
      })
    }
  })
}

// Hook pour mettre à jour un client
export const useUpdateClient = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({ firebase_uid, data }: { firebase_uid: string, data: Partial<ClientInputData> }) => {
      const { data: updatedData, error } = await supabase
        .from('client_db')
        .update(data)
        .eq('firebase_uid', firebase_uid)
        .select()
        .single()
      
      if (error) throw error
      return updatedData
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client', data.firebase_uid] })
      toast({ title: "Profil mis à jour" })
    },
    onError: (error) => {
      console.error('Erreur mise à jour client:', error)
      toast({ 
        title: "Erreur", 
        description: "Impossible de mettre à jour le profil",
        variant: "destructive" 
      })
    }
  })
}

// Hook pour récupérer les plats avec mapping des IDs
export const usePlats = () => {
  return useQuery({
    queryKey: ['plats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plats_db')
        .select('*')
        .order('plat', { ascending: true })
      
      if (error) throw error
      
      // Mapper idplats vers id pour l'UI
      return (data || []).map(plat => ({
        ...plat,
        id: plat.idplats
      })) as PlatUI[]
    },
    refetchOnWindowFocus: true,
    staleTime: 0 // Force le refresh à chaque fois
  })
}

// Hook pour récupérer une commande par ID
export const useCommandeById = (idcommande?: number) => {
  return useQuery({
    queryKey: ['commande', idcommande],
    queryFn: async () => {
      if (!idcommande) return null
      
      const { data, error } = await supabase
        .from('commande_db')
        .select(`
          *,
          client:client_db!commande_db_client_r_id_fkey (*),
          details:details_commande_db (
            *,
            plat:plats_db (*)
          )
        `)
        .eq('idcommande', idcommande)
        .single()
      
      if (error) throw error
      
      // Mapper idcommande vers id pour l'UI
      return {
        ...data,
        id: data.idcommande,
        client: data.client || null
      } as CommandeUI
    },
    enabled: !!idcommande
  })
}

// Hook pour récupérer les commandes d'un client
export const useCommandesByClient = (firebase_uid?: string) => {
  return useQuery({
    queryKey: ['commandes', 'client', firebase_uid],
    queryFn: async () => {
      if (!firebase_uid) return []
      
      const { data, error } = await supabase
        .from('commande_db')
        .select(`
          *,
          details:details_commande_db (
            *,
            plat:plats_db (*)
          )
        `)
        .eq('client_r', firebase_uid)
        .order('date_de_prise_de_commande', { ascending: false })
      
      if (error) throw error
      
      // Mapper idcommande vers id pour l'UI
      return (data || []).map(commande => ({
        ...commande,
        id: commande.idcommande
      })) as CommandeUI[]
    },
    enabled: !!firebase_uid
  })
}

// Hook pour récupérer toutes les commandes (admin)
export const useCommandes = () => {
  return useQuery({
    queryKey: ['commandes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commande_db')
        .select(`
          *,
          client_db!commande_db_client_r_id_fkey (*),
          details_commande_db (
            *,
            plats_db (*)
          )
        `)
        .order('idcommande', { ascending: false })
      
      if (error) throw error
      
      // Mapper les données pour l'UI avec calcul du prix total
      return (data || []).map(commande => {
        // Calculer le prix total depuis les détails
        const prix_total = commande.details_commande_db?.reduce((total: number, detail: any) => {
          return total + (detail.quantite_plat_commande * (detail.plats_db?.prix || 0))
        }, 0) || 0
        
        return {
          ...commande,
          id: commande.idcommande,
          statut: mapStatutCommande(commande.statut_commande),
          prix_total,
          client_db: {
            nom: commande.client_db?.nom,
            prenom: commande.client_db?.prenom, 
            email: commande.client_db?.email,
            telephone: commande.client_db?.numero_de_telephone,
            adresse: commande.client_db?.adresse_numero_et_rue
          },
          contient_liaison: commande.details_commande_db?.map((detail: any) => ({
            quantite: detail.quantite_plat_commande,
            plats: {
              nom_plat: detail.plats_db?.plat,
              prix: detail.plats_db?.prix,
              url_photo: detail.plats_db?.photo_du_plat
            }
          })) || []
        }
      }) as CommandeUI[]
    }
  })
}

// Hook pour créer une commande
export const useCreateCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async (commandeData: CreateCommandeData) => {
      // Récupérer l'idclient si on a le firebase_uid
      let client_r_id = commandeData.client_r_id
      
      if (!client_r_id && commandeData.client_r) {
        const { data: client } = await supabase
          .from('client_db')
          .select('idclient')
          .eq('firebase_uid', commandeData.client_r)
          .single()
        
        if (client) {
          client_r_id = client.idclient
        }
      }
      
      // Créer la commande
      const { data: commande, error: commandeError } = await supabase
        .from('commande_db')
        .insert({
          client_r: commandeData.client_r,
          client_r_id,
          date_et_heure_de_retrait_souhaitees: commandeData.date_et_heure_de_retrait_souhaitees,
          demande_special_pour_la_commande: commandeData.demande_special_pour_la_commande,
          type_livraison: commandeData.type_livraison || "À emporter",
          adresse_specifique: commandeData.adresse_specifique
        })
        .select()
        .single()
      
      if (commandeError) {
        console.error('Erreur création commande:', commandeError);
        throw commandeError;
      }
      
      // Créer les détails de la commande avec conversion des IDs
      const detailsData = commandeData.details.map(detail => ({
        commande_r: commande.idcommande,
        plat_r: typeof detail.plat_r === 'string' ? parseInt(detail.plat_r) : detail.plat_r,
        quantite_plat_commande: detail.quantite_plat_commande
      }))
      
      const { error: detailsError } = await supabase
        .from('details_commande_db')
        .insert(detailsData)
      
      if (detailsError) {
        console.error('Erreur création détails:', detailsError);
        throw detailsError;
      }
      
      return commande
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
    },
    onError: (error) => {
      console.error('Erreur création commande complète:', error)
    }
  })
}

// Hook pour créer un événement
export const useCreateEvenement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async (evenementData: CreateEvenementData) => {
      // Récupérer l'idclient si on a le firebase_uid
      let contact_client_r_id = evenementData.contact_client_r_id
      
      if (!contact_client_r_id && evenementData.contact_client_r) {
        const { data: client } = await supabase
          .from('client_db')
          .select('idclient')
          .eq('firebase_uid', evenementData.contact_client_r)
          .single()
        
        if (client) {
          contact_client_r_id = client.idclient
        }
      }
      
      // Créer l'événement
      const validEventTypes = ["Anniversaire", "Repas d'entreprise", "Fête de famille", "Cocktail dînatoire", "Buffet traiteur", "Autre"];
      const eventType = validEventTypes.includes(evenementData.type_d_evenement || '') 
        ? (evenementData.type_d_evenement as "Autre" | "Anniversaire" | "Repas d'entreprise" | "Fête de famille" | "Cocktail dînatoire" | "Buffet traiteur")
        : "Autre" as const;

      const { data: evenement, error: evenementError } = await supabase
        .from('evenements_db')
        .insert({
          nom_evenement: evenementData.nom_evenement,
          contact_client_r: evenementData.contact_client_r,
          contact_client_r_id,
          date_evenement: evenementData.date_evenement,
          type_d_evenement: eventType,
          nombre_de_personnes: evenementData.nombre_de_personnes,
          budget_client: evenementData.budget_client,
          demandes_speciales_evenement: evenementData.demandes_speciales_evenement
        })
        .select()
        .single()
      
      if (evenementError) throw evenementError
      
      // Créer les liens avec les plats pré-sélectionnés
      if (evenementData.plats_pre_selectionnes && evenementData.plats_pre_selectionnes.length > 0) {
        const platsData = evenementData.plats_pre_selectionnes.map(plat_id => ({
          evenement_id: evenement.idevenements,
          plat_id: plat_id
        }))
        
        const { error: platsError } = await supabase
          .from('evenements_plats_r')
          .insert(platsData)
        
        if (platsError) {
          console.warn('Erreur lors de la liaison des plats:', platsError)
          // Ne pas faire échouer toute la création pour cette erreur
        }
      }
      
      return evenement
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] })
      toast({ 
        title: "Demande d'événement envoyée",
        description: "Nous vous contacterons bientôt pour discuter des détails"
      })
    },
    onError: (error) => {
      console.error('Erreur création événement:', error)
      toast({ 
        title: "Erreur", 
        description: "Impossible d'envoyer la demande",
        variant: "destructive" 
      })
    }
  })
}

// Hook pour récupérer un événement par ID
export const useEvenementById = (idevenements?: number) => {
  return useQuery({
    queryKey: ['evenement', idevenements],
    queryFn: async () => {
      if (!idevenements) return null
      
      const { data, error } = await supabase
        .from('evenements_db')
        .select('*')
        .eq('idevenements', idevenements)
        .single()
      
      if (error) throw error
      
      // Mapper idevenements vers id pour l'UI
      return {
        ...data,
        id: data.idevenements
      } as EvenementUI
    },
    enabled: !!idevenements
  })
}

// Hook pour supprimer un détail de commande spécifique
export const useDeleteDetail = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (iddetails: number) => {
      const { error } = await supabase
        .from('details_commande_db')
        .delete()
        .eq('iddetails', iddetails)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
    }
  })
}

// Hook pour créer un détail de commande spécifique
export const useCreateDetail = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (detail: {commande_r: number, plat_r: number, quantite_plat_commande: number}) => {
      const { data, error } = await supabase
        .from('details_commande_db')
        .insert(detail)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
    }
  })
}

// Hook pour supprimer des détails de commande
export const useDeleteDetailsCommande = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (commandeId: number) => {
      const { error } = await supabase
        .from('details_commande_db')
        .delete()
        .eq('commande_r', commandeId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
    }
  })
}

// Hook pour créer de nouveaux détails de commande
export const useCreateDetailsCommande = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (details: Array<{commande_r: number, plat_r: number, quantite_plat_commande: number}>) => {
      const { data, error } = await supabase
        .from('details_commande_db')
        .insert(details)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
    }
  })
}

// Hook pour mettre à jour un événement
export const useUpdateEvenement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<EvenementInputData> }) => {
      const { data: updatedData, error } = await supabase
        .from('evenements_db')
        .update(data)
        .eq('idevenements', id)
        .select()
        .single()
      
      if (error) throw error
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] })
      toast({ 
        title: "Événement mis à jour",
        description: "Vos modifications ont été sauvegardées"
      })
    },
    onError: (error) => {
      console.error('Erreur mise à jour événement:', error)
      toast({ 
        title: "Erreur", 
        description: "Impossible de mettre à jour l'événement",
        variant: "destructive" 
      })
    }
  })
}

// Hook pour récupérer les événements d'un client
export const useEvenementsByClient = (firebase_uid?: string) => {
  return useQuery({
    queryKey: ['evenements', 'client', firebase_uid],
    queryFn: async () => {
      if (!firebase_uid) return []
      
      const { data, error } = await supabase
        .from('evenements_db')
        .select('*')
        .eq('contact_client_r', firebase_uid)
        .order('date_evenement', { ascending: false })
      
      if (error) throw error
      
      // Mapper idevenements vers id pour l'UI
      return (data || []).map(evenement => ({
        ...evenement,
        id: evenement.idevenements
      })) as EvenementUI[]
    },
    enabled: !!firebase_uid
  })
}

// Hook pour créer un nouveau plat
export const useCreatePlat = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const { data: result, error } = await supabase
        .from('plats_db')
        .insert(data)
        .select()
        .single()
      
      if (error) {
        console.error('Erreur Supabase dans useCreatePlat:', error);
        throw error;
      }
      
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plats'] })
    }
  })
}

// Hook pour mettre à jour un plat
export const useUpdatePlat = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updateData }: { id: number, updateData: any }) => {
      const { data, error } = await supabase
        .from('plats_db')
        .update(updateData)
        .eq('idplats', id)
      
      if (error) {
        console.error('Erreur Supabase dans useUpdatePlat:', error);
        throw error;
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plats'] })
    }
  })
}

// Hook principal pour les données
export const useData = () => {
  const { data: plats, isLoading, error } = usePlats()
  
  return {
    plats: plats || [],
    isLoading,
    error
  }
}

// Hook pour récupérer tous les clients (ADMIN)
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_db')
        .select('*')
        .order('nom', { ascending: true })
      
      if (error) throw error
      
      return (data || []).map(client => ({
        ...client,
        id: client.firebase_uid // Pour compatibilité
      })) as ClientUI[]
    }
  })
}

// Hook pour mettre à jour une commande (ADMIN) - Version moderne
export const useUpdateCommande = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: { statut?: string } }) => {
      // Mapper le statut vers la base de données
      const dbUpdates: any = {}
      if (updates.statut) {
        dbUpdates.statut_commande = mapStatutToDatabase(updates.statut)
      }
      
      const { data, error } = await supabase
        .from('commande_db')
        .update(dbUpdates)
        .eq('idcommande', id)
        .select(`
          *,
          client_db!commande_db_client_r_id_fkey (*),
          details_commande_db (
            *,
            plats_db (*)
          )
        `)
        .single()
      
      if (error) throw error
      
      // Calculer le prix total
      const prix_total = data.details_commande_db?.reduce((total: number, detail: any) => {
        return total + (detail.quantite_plat_commande * (detail.plats_db?.prix || 0))
      }, 0) || 0
      
      return {
        ...data,
        id: data.idcommande,
        statut: mapStatutCommande(data.statut_commande),
        prix_total,
        contient_liaison: data.details_commande_db?.map((detail: any) => ({
          quantite: detail.quantite_plat_commande,
          plats: {
            nom_plat: detail.plats_db?.plat,
            prix: detail.plats_db?.prix,
            url_photo: detail.plats_db?.photo_du_plat
          }
        })) || []
      } as CommandeUI
    },
    onSuccess: (data) => {
      // Invalider toutes les requêtes de commandes
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
      queryClient.invalidateQueries({ queryKey: ['commande', data.id] })
      
      toast({ 
        title: "Commande mise à jour", 
        description: "Les modifications ont été sauvegardées avec succès" 
      })
    },
    onError: (error) => {
      console.error('Erreur mise à jour commande:', error)
      toast({ 
        title: "Erreur", 
        description: "Impossible de mettre à jour la commande",
        variant: "destructive" 
      })
    }
  })
}

// Hook pour mettre à jour une commande (LEGACY) - Pour compatibilité avec ModifierCommande.tsx
export const useUpdateCommandeLegacy = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: number; [key: string]: any }) => {
      const { data: updatedData, error } = await supabase
        .from('commande_db')
        .update(updateData)
        .eq('idcommande', id)
        .select()
        .single()
      
      if (error) throw error
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] })
      toast({ 
        title: "Commande mise à jour",
        description: "Vos modifications ont été sauvegardées"
      })
    },
    onError: (error) => {
      console.error('Erreur mise à jour commande:', error)
      toast({ 
        title: "Erreur", 
        description: "Impossible de mettre à jour la commande",
        variant: "destructive" 
      })
    }
  })
}

// Hook pour récupérer les statistiques des commandes (ADMIN)
export const useCommandesStats = () => {
  return useQuery({
    queryKey: ['commandes-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commande_db')
        .select('statut_commande, statut_paiement, date_de_prise_de_commande')
      
      if (error) throw error
      
      const total = data.length
      const parStatut = data.reduce((acc, cmd) => {
        acc[cmd.statut_commande || 'Inconnu'] = (acc[cmd.statut_commande || 'Inconnu'] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const parPaiement = data.reduce((acc, cmd) => {
        acc[cmd.statut_paiement || 'Inconnu'] = (acc[cmd.statut_paiement || 'Inconnu'] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const aujourdhui = new Date().toISOString().split('T')[0]
      const commandesAujourdhui = data.filter(cmd => 
        cmd.date_de_prise_de_commande?.startsWith(aujourdhui)
      ).length
      
      return {
        total,
        parStatut,
        parPaiement,
        commandesAujourdhui
      }
    }
  })
}

// Hook pour activer la mise à jour en temps réel des commandes
export const useCommandesRealtime = () => {
  const queryClient = useQueryClient()
  
  return useQuery({
    queryKey: ['commandes-realtime'],
    queryFn: async () => {
      // Écouter les changements en temps réel
      const channel = supabase
        .channel('commandes-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'commande_db',
          },
          (payload) => {
            console.log('Changement détecté dans commande_db:', payload)
            // Invalider les queries pour refetch les données
            queryClient.invalidateQueries({ queryKey: ['commandes'] })
            queryClient.invalidateQueries({ queryKey: ['commandes-stats'] })
          }
        )
        .subscribe()
      
      return channel
    },
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
// Fonction pour mapper les statuts de la base vers l'UI
const mapStatutCommande = (statut: string): string => {
  switch (statut) {
    case 'En attente de confirmation': return 'en_attente'
    case 'Confirmée': return 'en_attente'
    case 'En préparation': return 'en_preparation'
    case 'Prête à récupérer': return 'en_preparation'
    case 'Récupérée': return 'terminee'
    case 'Annulée': return 'annulee'
    default: return 'en_attente'
  }
}

// Fonction pour mapper les statuts de l'UI vers la base
const mapStatutToDatabase = (statut: string): string => {
  switch (statut) {
    case 'en_attente': return 'En attente de confirmation'
    case 'en_preparation': return 'En préparation'
    case 'terminee': return 'Récupérée'
    case 'annulee': return 'Annulée'
    default: return 'En attente de confirmation'
  }
}
