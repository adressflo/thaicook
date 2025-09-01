'use client'

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type {
  ClientInputData,
  ClientUI,
  CommandeUI,
  CreateCommandeData,
  CreateEvenementData,
  EvenementUI,
  PlatUI,
} from '@/types/app';
import type { Database } from '@/types/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Functions de validation pour les types enum
const validateStatutCommande = (statut: string | null | undefined): 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée' | null => {
  const validStatuts = ['En attente de confirmation', 'Confirmée', 'En préparation', 'Prête à récupérer', 'Récupérée', 'Annulée'];
  return validStatuts.includes(statut || '') ? statut as 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée' : null;
};

const validateStatutPaiement = (statut: string | null | undefined): 'En attente sur place' | 'Payé sur place' | 'Payé en ligne' | 'Non payé' | 'Payée' | null => {
  const validStatuts = ['En attente sur place', 'Payé sur place', 'Payé en ligne', 'Non payé', 'Payée'];
  return validStatuts.includes(statut || '') ? statut as 'En attente sur place' | 'Payé sur place' | 'Payé en ligne' | 'Non payé' | 'Payée' : null;
};

const validateTypeLivraison = (type: string | null | undefined): 'À emporter' | 'Livraison' | 'Sur place' | null => {
  const validTypes = ['À emporter', 'Livraison', 'Sur place'];
  return validTypes.includes(type || '') ? type as 'À emporter' | 'Livraison' | 'Sur place' : null;
};

// Types extraits de la base de données Supabase
type Client = Database['public']['Tables']['client_db']['Row'];
type Commande = Database['public']['Tables']['commande_db']['Row'];
type DetailsCommande = Database['public']['Tables']['details_commande_db']['Row'];
type Evenement = Database['public']['Tables']['evenements_db']['Row'];
type Plat = Database['public']['Tables']['plats_db']['Row'];

// Types pour les inputs
type EvenementInputData = Database['public']['Tables']['evenements_db']['Insert'];
export type CommandeUpdate = {
  statut_commande?:
    | 'En attente de confirmation'
    | 'Confirmée'
    | 'En préparation'
    | 'Prête à récupérer'
    | 'Récupérée'
    | 'Annulée';
  statut_paiement?:
    | 'En attente sur place'
    | 'Payé sur place'
    | 'Payé en ligne'
    | 'Non payé'
    | 'Payée';
  notes_internes?: string;
  date_et_heure_de_retrait_souhaitees?: string;
  demande_special_pour_la_commande?: string;
  type_livraison?: 'À emporter' | 'Livraison';
  adresse_specifique?: string;
  statut?: string; // Pour compatibilité avec l'ancien format
};

// Types étendus pour les jointures - supprimé car inutilisé

// Hook pour récupérer les clients par firebase_uid
export const useClient = (firebase_uid?: string) => {
  return useQuery({
    queryKey: ['client', firebase_uid],
    queryFn: async (): Promise<Client | null> => {
      if (!firebase_uid) return null;
      const { data, error } = await supabase
        .from('client_db')
        .select('*')
        .eq('firebase_uid', firebase_uid)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Pas trouvé
        throw error;
      }
      return data;
    },
    enabled: !!firebase_uid,
  });
};

// Hook pour créer un client
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clientData: ClientInputData): Promise<Client> => {
      // Validation des données obligatoires
      if (!clientData.firebase_uid) {
        throw new Error('Firebase UID est requis pour créer un client');
      }

      console.log('Données du client à insérer:', clientData);
      
      // Diagnostic de l'état de l'authentification Supabase
      const { data: { session } } = await supabase.auth.getSession();
      console.log('DIAGNOSTIC: Session Supabase actuelle:', {
        hasSession: !!session,
        userId: session?.user?.id,
        firebaseUid: clientData.firebase_uid,
        sessionMatch: session?.user?.id === clientData.firebase_uid
      });
      
      // Vérifier d'abord si le client existe déjà
      try {
        const { data: existingClient } = await supabase
          .from('client_db')
          .select('*')
          .eq('firebase_uid', clientData.firebase_uid)
          .single();
          
        if (existingClient) {
          console.log('Client existant trouvé:', existingClient);
          return existingClient;
        }
      } catch (checkError) {
        // Le client n'existe pas, on peut continuer avec la création
        console.log('Aucun client existant trouvé, création en cours...');
        console.log('Détails de l\'erreur de vérification:', checkError);
      }
      
      try {
        const { data, error } = await supabase
          .from('client_db')
          .insert(clientData)
          .select()
          .single();

        if (error) {
          console.error('Erreur Supabase lors de la création du client:', error);
          
          // Vérification si l'error est un objet vide ou null
          const isEmptyError = !error || (typeof error === 'object' && Object.keys(error).length === 0);
          
          if (isEmptyError) {
            console.error('DIAGNOSTIC: Erreur Supabase vide détectée');
            console.error('DIAGNOSTIC: Type de l\'erreur:', typeof error);
            console.error('DIAGNOSTIC: Contenu de l\'erreur:', JSON.stringify(error));
            throw new Error('Erreur Supabase inconnue: objet erreur vide. Vérifiez les politiques RLS et les permissions de la base de données.');
          }
          
          // Gestion robuste des erreurs normales
          const message = error?.message || 'Erreur inconnue';
          const code = error?.code || 'UNKNOWN';
          const details = error?.details || 'Aucun détail disponible';
          const hint = error?.hint || 'Aucune suggestion disponible';
          
          const errorDetails = { message, code, details, hint, fullError: error };
          console.error('Détails de l\'erreur Supabase:', errorDetails);
          
          // Gestion spécifique des codes d'erreur
          if (code === '42501') {
            throw new Error('Permissions insuffisantes: Les politiques RLS empêchent la création du profil. L\'utilisateur doit être authentifié avec Firebase.');
          }
          
          if (code === '23505') {
            throw new Error('Ce profil existe déjà. Connexion en cours...');
          }
          
          throw new Error(`Erreur Supabase: ${message} (Code: ${code})`);
        }
        
        if (!data) {
          throw new Error('Aucune donnée retournée après la création du client');
        }
        
        return data;
      } catch (networkError) {
        console.error('Erreur réseau ou de connexion:', networkError);
        throw new Error(`Erreur de connexion à la base de données: ${networkError.message}`);
      }
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['client', data.firebase_uid] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Profil créé avec succès' });
    },
    onError: error => {
      console.error('Erreur création client:', error);
      const errorMessage = error?.message || 'Erreur inconnue lors de la création du profil';
      console.error('Détails de l\'erreur:', {
        message: error?.message,
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        fullError: error
      });
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

// Hook pour mettre à jour un client
export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      firebase_uid,
      data,
    }: {
      firebase_uid: string;
      data: Partial<ClientInputData>;
    }): Promise<Client> => {
      console.log('Mise à jour profil pour:', firebase_uid, 'avec données:', data);
      
      // Diagnostic de l'état de l'authentification Supabase
      const { data: { session } } = await supabase.auth.getSession();
      console.log('DIAGNOSTIC UPDATE: Session Supabase:', {
        hasSession: !!session,
        userId: session?.user?.id,
        firebaseUid: firebase_uid,
        sessionMatch: session?.user?.id === firebase_uid
      });
      
      const { data: updatedData, error } = await supabase
        .from('client_db')
        .update(data)
        .eq('firebase_uid', firebase_uid)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase lors de la mise à jour du client:', error);
        
        // Vérification si l'error est un objet vide ou null
        const isEmptyError = !error || (typeof error === 'object' && Object.keys(error).length === 0);
        
        if (isEmptyError) {
          console.error('DIAGNOSTIC UPDATE: Erreur Supabase vide détectée');
          console.error('DIAGNOSTIC UPDATE: Type de l\'erreur:', typeof error);
          console.error('DIAGNOSTIC UPDATE: Contenu de l\'erreur:', JSON.stringify(error));
          throw new Error('Erreur Supabase inconnue lors de la mise à jour: objet erreur vide. Vérifiez les politiques RLS et les permissions UPDATE.');
        }
        
        // Gestion robuste des erreurs normales
        const message = error?.message || 'Erreur inconnue';
        const code = error?.code || 'UNKNOWN';
        const details = error?.details || 'Aucun détail disponible';
        const hint = error?.hint || 'Aucune suggestion disponible';
        
        console.error('Détails de l\'erreur UPDATE:', { message, code, details, hint, fullError: error });
        
        // Gestion spécifique des codes d'erreur
        if (code === '42501') {
          throw new Error('Permissions insuffisantes: Les politiques RLS empêchent la mise à jour du profil.');
        }
        
        if (code === 'PGRST116') {
          throw new Error('Profil non trouvé: Impossible de mettre à jour un profil qui n\'existe pas.');
        }
        
        throw new Error(`Erreur Supabase UPDATE: ${message} (Code: ${code})`);
      }
      
      if (!updatedData) {
        throw new Error('Aucune donnée retournée après la mise à jour du client');
      }
      
      return updatedData;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['client', data.firebase_uid] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Profil mis à jour' });
    },
    onError: error => {
      console.error('Erreur mise à jour client:', error);
      const errorMessage = error instanceof Error ? error.message : 
                          typeof error === 'object' && error && 'message' in error ? 
                          (error as any).message : 
                          'Erreur inconnue';
      toast({
        title: 'Erreur mise à jour profil',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

// Hook pour récupérer les plats avec mapping des IDs
export const usePlats = () => {
  return useQuery({
    queryKey: ['plats'],
    queryFn: async (): Promise<PlatUI[]> => {
      const { data, error } = await supabase
        .from('plats_db')
        .select('*')
        .order('plat', { ascending: true });

      if (error) throw error;

      // Mapper idplats vers id pour l'UI
      return (data || []).map(plat => ({
        ...plat,
        id: plat.idplats,
        nom_plat: plat.plat,
        url_photo: plat.photo_du_plat || undefined,
        disponible: !plat.est_epuise,
      }));
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Force le refresh à chaque fois
  });
};

// Hook pour récupérer une commande par ID
export const useCommandeById = (idcommande?: number) => {
  return useQuery({
    queryKey: ['commande', idcommande],
    queryFn: async (): Promise<CommandeUI | null> => {
      if (!idcommande) return null;

      const { data, error } = await supabase
        .from('commande_db')
        .select(
          `
          *,
          client_db (
            nom,
            prenom,
            numero_de_telephone,
            email,
            preference_client,
            photo_client,
            firebase_uid,
            adresse_numero_et_rue,
            code_postal,
            ville
          ),
          details_commande_db (
            *,
            plats_db (*)
          )
        `
        )
        .eq('idcommande', idcommande)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      // Validation des données Supabase avec gestion des erreurs de relation
      if (!data) return null;
      
      const commandeData = data as unknown;
      const commande = commandeData as {
        idcommande: number;
        client_r: string | null;
        client_r_id: number | null;
        adresse_specifique: string | null;
        date_de_prise_de_commande: string | null;
        date_et_heure_de_retrait_souhaitees: string | null;
        demande_special_pour_la_commande: string | null;
        nom_evenement: string | null;
        notes_internes: string | null;
        statut_commande: string | null;
        statut_paiement: string | null;
        type_livraison: string | null;
        client_db?: Client | null;
        details_commande_db?: Array<DetailsCommande & { plats_db?: Plat }>;
      };
      
      // Validation des propriétés critiques
      const validatedCommande = {
        ...commande,
        client_r: commande.client_r || '',
        client_r_id: commande.client_r_id || 0,
        adresse_specifique: commande.adresse_specifique || '',
        date_de_prise_de_commande: commande.date_de_prise_de_commande || new Date().toISOString(),
        date_et_heure_de_retrait_souhaitees: commande.date_et_heure_de_retrait_souhaitees || null,
        demande_special_pour_la_commande: commande.demande_special_pour_la_commande || null,
        nom_evenement: commande.nom_evenement || null,
        notes_internes: commande.notes_internes || null,
        details_commande_db: Array.isArray(commande.details_commande_db) ? commande.details_commande_db : []
      };

      // Calculer le prix total avec validation
      const prix_total = validatedCommande.details_commande_db.reduce((total: number, detail: DetailsCommande & { plats_db?: Plat }) => {
        const quantite = detail.quantite_plat_commande || 0;
        const prix = detail.plats_db?.prix || 0;
        return total + quantite * prix;
      }, 0) || 0;

      // Mapper idcommande vers id pour l'UI avec toutes les propriétés nécessaires
      return {
        ...validatedCommande,
        id: validatedCommande.idcommande,
        client: commande.client_db || null,
        details: validatedCommande.details_commande_db.map(detail => ({
          ...detail,
          plat: detail.plats_db
        })),
        prix_total,
        statut: mapStatutCommande(
          validatedCommande.statut_commande || 'En attente de confirmation'
        ),
        statut_commande: validateStatutCommande(validatedCommande.statut_commande),
        statut_paiement: validateStatutPaiement(validatedCommande.statut_paiement),
        type_livraison: validateTypeLivraison(validatedCommande.type_livraison),
      };
    },
    enabled: !!idcommande,
    staleTime: 0, // Toujours refetch pour éviter le cache
    gcTime: 0, // Ne pas garder en cache
  });
};

// Hook pour récupérer les commandes d'un client
export const useCommandesByClient = (firebase_uid?: string) => {
  return useQuery({
    queryKey: ['commandes', 'client', firebase_uid],
    queryFn: async (): Promise<CommandeUI[]> => {
      if (!firebase_uid) return [];

      const { data, error } = await supabase
        .from('commande_db')
        .select(
          `
          *,
          client_db (
            nom,
            prenom,
            numero_de_telephone,
            email,
            preference_client,
            photo_client,
            firebase_uid,
            adresse_numero_et_rue,
            code_postal,
            ville
          ),
          details_commande_db (
            *,
            plats_db (*)
          )
        `
        )
        .eq('client_r', firebase_uid)
        .order('date_de_prise_de_commande', { ascending: false });

      if (error) throw error;

      // Validation et mappage des données avec type safety
      return (data || []).map((commande: unknown) => {
        const commandeTyped = commande as {
          idcommande: number;
          client_r: string | null;
          client_r_id: number | null;
          adresse_specifique: string | null;
          date_de_prise_de_commande: string | null;
          date_et_heure_de_retrait_souhaitees: string | null;
          demande_special_pour_la_commande: string | null;
          nom_evenement: string | null;
          notes_internes: string | null;
          statut_commande: string | null;
          statut_paiement: string | null;
          type_livraison: string | null;
          client_db?: {
            nom: string | null;
            prenom: string | null;
            numero_de_telephone: string | null;
            email: string | null;
            preference_client: string | null;
            photo_client: string | null;
            firebase_uid: string | null;
            adresse_numero_et_rue: string | null;
            code_postal: number | null;
            ville: string | null;
          };
          details_commande_db?: Array<DetailsCommande & { plats_db?: Plat }>;
        };
        
        const validatedCommande = {
          ...commandeTyped,
          client_r: commandeTyped.client_r || '',
          client_r_id: commandeTyped.client_r_id || 0,
          adresse_specifique: commandeTyped.adresse_specifique || '',
          date_de_prise_de_commande: commandeTyped.date_de_prise_de_commande || new Date().toISOString(),
          date_et_heure_de_retrait_souhaitees: commandeTyped.date_et_heure_de_retrait_souhaitees || null,
          demande_special_pour_la_commande: commandeTyped.demande_special_pour_la_commande || null,
          nom_evenement: commandeTyped.nom_evenement || null,
          notes_internes: commandeTyped.notes_internes || null,
          details_commande_db: Array.isArray(commandeTyped.details_commande_db) ? commandeTyped.details_commande_db : []
        };

        const prix_total = validatedCommande.details_commande_db.reduce((total: number, detail: DetailsCommande & { plats_db?: Plat }) => {
          const quantite = detail.quantite_plat_commande || 0;
          const prix = detail.plats_db?.prix || 0;
          return total + quantite * prix;
        }, 0) || 0;

        return {
          ...validatedCommande,
          id: validatedCommande.idcommande,
          client: commandeTyped.client_db || null,
          details: validatedCommande.details_commande_db.map((detail: DetailsCommande & { plats_db?: Plat }) => ({
            ...detail,
            plat: detail.plats_db
          })),
          prix_total,
          statut: validateStatutCommande(validatedCommande.statut_commande) || undefined,
          statut_commande: validateStatutCommande(validatedCommande.statut_commande),
          statut_paiement: validateStatutPaiement(validatedCommande.statut_paiement),
          type_livraison: validateTypeLivraison(validatedCommande.type_livraison),
        };
      });
    },
    enabled: !!firebase_uid,
  });
};

// Hook pour récupérer toutes les commandes (admin)
export const useCommandes = () => {
  return useQuery({
    queryKey: ['commandes'],
    queryFn: async (): Promise<CommandeUI[]> => {
      const { data, error } = await supabase
        .from('commande_db')
        .select(
          `
          *,
          client_db (
            nom,
            prenom,
            numero_de_telephone,
            email,
            preference_client,
            photo_client,
            firebase_uid,
            adresse_numero_et_rue,
            code_postal,
            ville
          ),
          details_commande_db (
            *,
            plats_db (*)
          )
        `
        )
        .order('idcommande', { ascending: false });

      if (error) throw error;

      // Mapper les données pour l'UI avec validation
      return (data || []).map((commande: unknown) => {
        const commandeTyped = commande as {
          idcommande: number;
          client_r: string | null;
          client_r_id: number | null;
          adresse_specifique: string | null;
          date_de_prise_de_commande: string | null;
          date_et_heure_de_retrait_souhaitees: string | null;
          demande_special_pour_la_commande: string | null;
          nom_evenement: string | null;
          notes_internes: string | null;
          statut_commande: string | null;
          statut_paiement: string | null;
          type_livraison: string | null;
          client_db?: {
            nom: string | null;
            prenom: string | null;
            numero_de_telephone: string | null;
            email: string | null;
            preference_client: string | null;
          };
          details_commande_db?: Array<DetailsCommande & { plats_db?: Plat }>;
        };

        // Validation des données critiques
        const validatedCommande = {
          ...commandeTyped,
          client_r: commandeTyped.client_r || '',
          client_r_id: commandeTyped.client_r_id || 0,
          adresse_specifique: commandeTyped.adresse_specifique || '',
          date_de_prise_de_commande: commandeTyped.date_de_prise_de_commande || new Date().toISOString(),
          date_et_heure_de_retrait_souhaitees: commandeTyped.date_et_heure_de_retrait_souhaitees || null,
          demande_special_pour_la_commande: commandeTyped.demande_special_pour_la_commande || null,
          nom_evenement: commandeTyped.nom_evenement || null,
          notes_internes: commandeTyped.notes_internes || null,
          details_commande_db: Array.isArray(commandeTyped.details_commande_db) ? commandeTyped.details_commande_db : []
        };

        // Calculer le prix total depuis les détails validés
        const prix_total = validatedCommande.details_commande_db.reduce((total: number, detail: DetailsCommande & { plats_db?: Plat }) => {
          const quantite = detail.quantite_plat_commande || 0;
          const prix = detail.plats_db?.prix || 0;
          return total + Number(quantite) * Number(prix);
        }, 0) || 0;

        return {
          ...validatedCommande,
          id: validatedCommande.idcommande,
          client: commandeTyped.client_db || null,
          details: validatedCommande.details_commande_db.map(detail => ({
            ...detail,
            plat: detail.plats_db
          })),
          prix_total,
          statut: validateStatutCommande(validatedCommande.statut_commande),
          statut_commande: validateStatutCommande(validatedCommande.statut_commande),
          statut_paiement: validateStatutPaiement(validatedCommande.statut_paiement),
          type_livraison: validateTypeLivraison(validatedCommande.type_livraison),
          // Compatibilité avec l'ancien format
          'Numéro de Commande': validatedCommande.idcommande?.toString(),
          'Date & Heure de retrait': validatedCommande.date_et_heure_de_retrait_souhaitees || undefined,
          'Statut Commande': validateStatutCommande(validatedCommande.statut_commande) || undefined,
          Total: prix_total,
          FirebaseUID: validatedCommande.client_r || undefined,
        } as unknown as CommandeUI;
      });
    },
  });
};

// Hook pour récupérer les statistiques des commandes (admin)
export const useCommandesStats = () => {
  return useQuery({
    queryKey: ['commandes-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('commande_db').select(`
          *,
          details_commande_db (
            *,
            plats_db (prix)
          )
        `);

      if (error) throw error;

      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const stats = {
        total: data?.length || 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        revenue: {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
        },
        parStatut: {} as Record<string, number>,
        commandesAujourdhui: 0, // Nombre de commandes aujourd'hui au lieu d'un tableau
        commandesListeAujourdhui: [] as Array<{
          idcommande: number;
          statut_commande: string;
          date_de_prise_de_commande: string;
          details_commande_db?: Array<{
            quantite_plat_commande: number | null;
            plats_db?: { prix: number | null };
          }>;
        }>,
      };

      // Initialiser les compteurs de statut
      const statutsCommande = [
        'En attente de confirmation',
        'Confirmée', 
        'En préparation',
        'Prête à récupérer',
        'Récupérée',
        'Annulée'
      ];
      
      statutsCommande.forEach(statut => {
        stats.parStatut[statut] = 0;
      });

      (data || []).forEach((commande: unknown) => {
        const commandeTyped = commande as {
          idcommande: number;
          statut_commande: string | null;
          date_de_prise_de_commande: string | null;
          details_commande_db?: Array<{ quantite_plat_commande: number | null; plats_db?: { prix: number | null } }>;
        };

        const commandeDate = new Date(commandeTyped.date_de_prise_de_commande || '');
        const revenue = Array.isArray(commandeTyped.details_commande_db) 
          ? commandeTyped.details_commande_db.reduce((total: number, detail) => {
              return total + (detail.quantite_plat_commande || 0) * (detail.plats_db?.prix || 0);
            }, 0) 
          : 0;

        stats.revenue.total += revenue;

        // Compter par statut avec validation
        const statutValide = validateStatutCommande(commandeTyped.statut_commande);
        if (statutValide) {
          stats.parStatut[statutValide] = (stats.parStatut[statutValide] || 0) + 1;
        }

        if (commandeDate >= startOfToday) {
          stats.today++;
          stats.commandesAujourdhui++; // Incrémenter le compteur
          stats.revenue.today += revenue;
          stats.commandesListeAujourdhui.push({
            idcommande: commandeTyped.idcommande,
            statut_commande: statutValide || 'En attente de confirmation',
            date_de_prise_de_commande: commandeTyped.date_de_prise_de_commande || '',
            details_commande_db: commandeTyped.details_commande_db || []
          });
        }
        if (commandeDate >= thisWeek) {
          stats.thisWeek++;
          stats.revenue.thisWeek += revenue;
        }
        if (commandeDate >= thisMonth) {
          stats.thisMonth++;
          stats.revenue.thisMonth += revenue;
        }
      });

      return stats;
    },
  });
};

// Hook pour les commandes en temps réel (admin) - première définition
export const useCommandesRealtimeV1 = () => {
  return useQuery({
    queryKey: ['commandes-realtime'],
    queryFn: async (): Promise<CommandeUI[]> => {
      const { data, error } = await supabase
        .from('commande_db')
        .select(
          `
          *,
          details_commande_db (
            *,
            plats_db (*)
          )
        `
        )
        .order('date_de_prise_de_commande', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map((commande: unknown) => {
        const commandeTyped = commande as {
          idcommande: number;
          client_r: string | null;
          client_r_id: number | null;
          adresse_specifique: string | null;
          date_de_prise_de_commande: string | null;
          date_et_heure_de_retrait_souhaitees: string | null;
          demande_special_pour_la_commande: string | null;
          nom_evenement: string | null;
          notes_internes: string | null;
          statut_commande: string | null;
          statut_paiement: string | null;
          type_livraison: string | null;
          details_commande_db?: Array<DetailsCommande & { plats_db?: Plat }>;
        };

        return {
          ...commandeTyped,
          id: commandeTyped.idcommande,
          client_r: commandeTyped.client_r || '',
          client_r_id: commandeTyped.client_r_id || 0,
          adresse_specifique: commandeTyped.adresse_specifique || '',
          date_de_prise_de_commande: commandeTyped.date_de_prise_de_commande || new Date().toISOString(),
          date_et_heure_de_retrait_souhaitees: commandeTyped.date_et_heure_de_retrait_souhaitees || null,
          demande_special_pour_la_commande: commandeTyped.demande_special_pour_la_commande || null,
          nom_evenement: commandeTyped.nom_evenement || null,
          notes_internes: commandeTyped.notes_internes || null,
          details: Array.isArray(commandeTyped.details_commande_db) ? commandeTyped.details_commande_db.map(detail => ({
            ...detail,
            plat: detail.plats_db
          })) : [],
          'Date & Heure de retrait': commandeTyped.date_et_heure_de_retrait_souhaitees || undefined,
          'Statut Commande': validateStatutCommande(commandeTyped.statut_commande) || undefined,
          statut: validateStatutCommande(commandeTyped.statut_commande) || undefined,
          statut_commande: validateStatutCommande(commandeTyped.statut_commande),
          statut_paiement: validateStatutPaiement(commandeTyped.statut_paiement),
          type_livraison: validateTypeLivraison(commandeTyped.type_livraison),
        } as CommandeUI;
      });
    },
    refetchInterval: 30000, // Actualise toutes les 30 secondes
  });
};

// Hook pour mettre à jour une commande (admin) - première définition
export const useUpdateCommandeV1 = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: { statut?: string } }) => {
      const { data, error } = await supabase
        .from('commande_db')
        .update({
          statut_commande: updates.statut as
            | 'En attente de confirmation'
            | 'Confirmée'
            | 'En préparation'
            | 'Prête à récupérer'
            | 'Récupérée'
            | 'Annulée',
        })
        .eq('idcommande', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      queryClient.invalidateQueries({ queryKey: ['commandes-realtime'] });
      toast({ title: 'Commande mise à jour avec succès' });
    },
    onError: error => {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur lors de la mise à jour',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook pour les fonctions legacy (compatibilité)
export const useUpdateCommandeLegacy = useUpdateCommandeV1;
export const useDeleteDetailsCommande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (detailId: number) => {
      const { error } = await supabase
        .from('details_commande_db')
        .delete()
        .eq('iddetails', detailId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
    },
  });
};

export const useCreateDetailsCommande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: {
      commande_r: number;
      plat_r: number;
      quantite_plat_commande: number;
    }) => {
      const { data, error } = await supabase.from('details_commande_db').insert(details).select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
    },
  });
};

// Hook pour créer une commande
export const useCreateCommande = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (commandeData: CreateCommandeData): Promise<Commande> => {
      // Récupérer l'idclient si on a le firebase_uid
      let client_r_id = commandeData.client_r_id;

      if (!client_r_id && commandeData.client_r) {
        const { data: client } = await supabase
          .from('client_db')
          .select('idclient')
          .eq('firebase_uid', commandeData.client_r)
          .single();

        if (client) {
          client_r_id = client.idclient;
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
          type_livraison:
            (commandeData.type_livraison as 'À emporter' | 'Livraison') || 'À emporter',
          adresse_specifique: commandeData.adresse_specifique,
        })
        .select()
        .single();

      if (commandeError) {
        console.error('Erreur création commande:', commandeError);
        throw commandeError;
      }

      // Créer les détails de la commande avec conversion des IDs
      const detailsData = commandeData.details.map(detail => ({
        commande_r: commande.idcommande,
        plat_r: typeof detail.plat_r === 'string' ? parseInt(detail.plat_r) : detail.plat_r,
        quantite_plat_commande: detail.quantite_plat_commande,
      }));

      const { error: detailsError } = await supabase
        .from('details_commande_db')
        .insert(detailsData);

      if (detailsError) {
        console.error('Erreur création détails:', detailsError);
        throw detailsError;
      }

      return commande;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      toast({
        title: 'Commande créée',
        description: 'Votre commande a été enregistrée avec succès',
      });
    },
    onError: error => {
      console.error('Erreur création commande complète:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la commande',
        variant: 'destructive',
      });
    },
  });
};

// Hook pour supprimer une commande
export const useDeleteCommande = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (commandeId: number): Promise<void> => {
      console.log('Début suppression commande ID:', commandeId);
      
      // Supprimer d'abord les détails de la commande
      console.log('Suppression des détails de la commande...');
      const { error: detailsError } = await supabase
        .from('details_commande_db')
        .delete()
        .eq('commande_r', commandeId);

      if (detailsError) {
        console.error('Erreur suppression détails:', detailsError);
        throw detailsError;
      }
      console.log('Détails supprimés avec succès');

      // Ensuite supprimer la commande
      console.log('Suppression de la commande...');
      const { error: commandeError } = await supabase
        .from('commande_db')
        .delete()
        .eq('idcommande', commandeId);

      if (commandeError) {
        console.error('Erreur suppression commande:', commandeError);
        throw commandeError;
      }
      console.log('Commande supprimée avec succès');
    },
    onSuccess: (_, commandeId) => {
      console.log('Hook onSuccess: invalidation des queries pour commande:', commandeId);
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      queryClient.invalidateQueries({ queryKey: ['commande', commandeId] });
      queryClient.invalidateQueries({ queryKey: ['historique-commandes'] });
    },
    onError: error => {
      console.error('Hook onError - Erreur suppression commande:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la commande',
        variant: 'destructive',
      });
    },
  });
};

// Hook pour créer un événement
export const useCreateEvenement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (evenementData: CreateEvenementData): Promise<Evenement> => {
      console.log('🚀 DÉBUT: Création événement avec données:', evenementData);

      // DIAGNOSTIC: Architecture hybride Firebase + Supabase (RLS désactivé)
      console.log('🔐 MODE: RLS désactivé - test direct sans authentification Supabase');

      // Utiliser les vraies données maintenant, avec lien vers l'utilisateur
      const insertData = {
        nom_evenement: evenementData.nom_evenement || 'Événement sans nom',
        contact_client_r: evenementData.contact_client_r || null, // Firebase UID
        contact_client_r_id: evenementData.contact_client_r_id || null,
        date_evenement: evenementData.date_evenement || null,
        type_d_evenement: (evenementData.type_d_evenement || 'Autre') as 'Autre' | 'Anniversaire' | "Repas d'entreprise" | 'Fête de famille' | 'Cocktail dînatoire' | 'Buffet traiteur',
        nombre_de_personnes: evenementData.nombre_de_personnes || null,
        budget_client: evenementData.budget_client || null,
        demandes_speciales_evenement: evenementData.demandes_speciales_evenement || null,
      };

      console.log('🔥 TEST: Insertion avec données minimales:', insertData);

      // Test direct sans try-catch complexe
      const { data, error } = await supabase
        .from('evenements_db')
        .insert(insertData)
        .select()
        .single();

      console.log('📊 RÉSULTAT BRUT:', { data, error });
      console.log('📊 TYPE ERROR:', typeof error);
      console.log('📊 ERROR KEYS:', error ? Object.keys(error) : 'NO ERROR');
      console.log('📊 ERROR JSON:', JSON.stringify(error));
      console.log('📊 ERROR STRING:', String(error));
      console.log('📊 ERROR INSTANCEOF:', error instanceof Error);

      // Si l'erreur est vraiment un objet vide, utilisons une approche différente
      if (error) {
        // Au lieu de throw error qui donne {}, créons une erreur descriptive
        const errorMessage = error.message || error.code || 'Erreur Supabase sans détails';
        const fullErrorInfo = {
          originalError: error,
          type: typeof error,
          keys: Object.keys(error),
          stringified: JSON.stringify(error),
          isInstance: error instanceof Error
        };
        
        console.error('❌ ERREUR COMPLÈTE:', fullErrorInfo);
        throw new Error(`Erreur Supabase: ${errorMessage}. Détails: ${JSON.stringify(fullErrorInfo)}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
      toast({
        title: "Demande d'événement envoyée",
        description: 'Nous vous contacterons bientôt pour discuter des détails',
      });
    },
    onError: error => {
      console.error('Erreur création événement:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'envoyer la demande",
        variant: 'destructive',
      });
    },
  });
};

// Hook pour récupérer un événement par ID
export const useEvenementById = (idevenements?: number) => {
  return useQuery({
    queryKey: ['evenement', idevenements],
    queryFn: async (): Promise<EvenementUI | null> => {
      if (!idevenements) return null;

      const { data, error } = await supabase
        .from('evenements_db')
        .select('*')
        .eq('idevenements', idevenements)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      // Mapper idevenements vers id pour l'UI
      return {
        ...data,
        id: data.idevenements,
      };
    },
    enabled: !!idevenements,
  });
};

// Hook pour récupérer tous les clients (ADMIN)
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async (): Promise<ClientUI[]> => {
      const { data, error } = await supabase
        .from('client_db')
        .select('*')
        .order('nom', { ascending: true, nullsFirst: false });

      if (error) throw error;

      return (data || []).map(client => ({
        ...client,
        id: client.firebase_uid, // Pour compatibilité
        // Propriétés compatibles avec l'ancien système Airtable
        Nom: client.nom ?? undefined,
        Prénom: client.prenom ?? undefined,
        'Numéro de téléphone': client.numero_de_telephone ?? undefined,
        'e-mail': client.email ?? undefined,
        'Adresse (numéro et rue)': client.adresse_numero_et_rue ?? undefined,
        'Code postal': client.code_postal ?? undefined,
        Ville: client.ville ?? undefined,
        'Préférence client': client.preference_client ?? undefined,
        'Comment avez-vous connu ChanthanaThaiCook ?': client.comment_avez_vous_connu ?? undefined,
        'Souhaitez-vous recevoir les actualités et offres par e-mail ?':
          client.souhaitez_vous_recevoir_actualites ? 'Oui' : 'Non',
        'Date de naissance': client.date_de_naissance ?? undefined,
        'Photo Client': client.photo_client ? [{ url: client.photo_client }] : undefined,
        FirebaseUID: client.firebase_uid,
        Role: client.role ?? undefined,
      }));
    },
  });
};

// Hook pour récupérer les événements d'un client
export const useEvenementsByClient = (firebase_uid?: string) => {
  return useQuery({
    queryKey: ['evenements', 'client', firebase_uid],
    queryFn: async (): Promise<EvenementUI[]> => {
      if (!firebase_uid) return [];

      const { data, error } = await supabase
        .from('evenements_db')
        .select('*')
        .eq('contact_client_r', firebase_uid)
        .order('date_evenement', { ascending: false });

      if (error) throw error;

      // Mapper idevenements vers id pour l'UI
      return (data || []).map(evenement => ({
        ...evenement,
        id: evenement.idevenements,
      }));
    },
    enabled: !!firebase_uid,
  });
};

// Hook pour créer un nouveau plat
export const useCreatePlat = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ data }: { data: Partial<Plat> }): Promise<Plat> => {
      // Nettoyer les données avant insertion
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      ) as Partial<Plat>;

      const { data: result, error } = await supabase
        .from('plats_db')
        .insert(cleanedData as Database['public']['Tables']['plats_db']['Insert'])
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase dans useCreatePlat:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plats'] });
      toast({
        title: 'Plat créé',
        description: 'Le nouveau plat a été ajouté avec succès',
      });
    },
    onError: error => {
      console.error('Erreur création plat:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le plat',
        variant: 'destructive',
      });
    },
  });
};

// Hook pour mettre à jour un plat
export const useUpdatePlat = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updateData }: { id: number; updateData: Partial<Plat> }) => {
      // On garde votre logique de conversion initiale
      const convertedData: Partial<Plat> = { ...updateData };
      const dayFields = [
        'lundi_dispo',
        'mardi_dispo',
        'mercredi_dispo',
        'jeudi_dispo',
        'vendredi_dispo',
        'samedi_dispo',
        'dimanche_dispo',
      ] as const;

      dayFields.forEach(field => {
        const value = convertedData[field];
        if (value && typeof value === 'string') {
          convertedData[field] = value === 'oui' || value === 'non' ? value : 'non';
        }
      });

      // On nettoie l'objet final pour retirer les champs non définis
      const cleanedData = Object.fromEntries(
        Object.entries(convertedData).filter(([_, value]) => value !== undefined)
      );

      // On envoie à Supabase les données propres ET converties
      const { data, error } = await supabase
        .from('plats_db')
        .update(cleanedData)
        .eq('idplats', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase dans useUpdatePlat:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plats'] });
      toast({
        title: 'Plat mis à jour',
        description: 'Les modifications ont été sauvegardées',
      });
    },
    onError: error => {
      console.error('Erreur mise à jour plat:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le plat',
        variant: 'destructive',
      });
    },
  });
};

// Hook pour mettre à jour une commande (ADMIN) - Version moderne
export const useUpdateCommandeV2 = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: CommandeUpdate }) => {
      const cleanedUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const { data, error } = await supabase
        .from('commande_db')
        .update(cleanedUpdates)
        .eq('idcommande', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      queryClient.invalidateQueries({ queryKey: ['commandes-realtime'] });
      toast({ title: 'Commande mise à jour avec succès' });
    },
    onError: error => {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur lors de la mise à jour',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook principal pour les données
export const useData = () => {
  const { data: plats, isLoading, error } = usePlats();

  return {
    plats: plats || [],
    isLoading,
    error,
  };
};

// Hook pour mettre à jour une commande (ADMIN) - Version finale
export const useUpdateCommande = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: CommandeUpdate;
    }): Promise<CommandeUI> => {
      // Mapper le statut vers la base de données
      const dbUpdates: Partial<Commande> = {};
      if (updates.statut) {
        dbUpdates.statut_commande = mapStatutToDatabase(updates.statut) as
          | 'En attente de confirmation'
          | 'Confirmée'
          | 'En préparation'
          | 'Prête à récupérer'
          | 'Récupérée'
          | 'Annulée';
      }
      if (updates.statut_commande) {
        dbUpdates.statut_commande = updates.statut_commande;
      }
      if (updates.statut_paiement) {
        dbUpdates.statut_paiement = updates.statut_paiement;
      }
      if (updates.notes_internes) {
        dbUpdates.notes_internes = updates.notes_internes;
      }
      if (updates.date_et_heure_de_retrait_souhaitees) {
        dbUpdates.date_et_heure_de_retrait_souhaitees = updates.date_et_heure_de_retrait_souhaitees;
      }
      if (updates.type_livraison) {
        dbUpdates.type_livraison = updates.type_livraison;
      }
      if (updates.adresse_specifique) {
        dbUpdates.adresse_specifique = updates.adresse_specifique;
      }

      const { data, error } = await supabase
        .from('commande_db')
        .update(dbUpdates)
        .eq('idcommande', id)
        .select(
          `
          *,
          details_commande_db (
            *,
            plats_db (*)
          )
        `
        )
        .single();

      if (error) throw error;

      // Validation des données avec gestion des erreurs de relation
      if (!data) throw new Error('Aucune donnée retournée');

      const commandeData = data as unknown;
      const commande = commandeData as {
        idcommande: number;
        client_r: string | null;
        client_r_id: number | null;
        adresse_specifique: string | null;
        date_de_prise_de_commande: string | null;
        date_et_heure_de_retrait_souhaitees: string | null;
        demande_special_pour_la_commande: string | null;
        nom_evenement: string | null;
        notes_internes: string | null;
        statut_commande: string | null;
        statut_paiement: string | null;
        type_livraison: string | null;
        details_commande_db?: Array<DetailsCommande & { plats_db?: Plat }>;
      };

      // Validation des propriétés critiques
      const validatedCommande = {
        ...commande,
        client_r: commande.client_r || '',
        client_r_id: commande.client_r_id || 0,
        adresse_specifique: commande.adresse_specifique || '',
        date_de_prise_de_commande: commande.date_de_prise_de_commande || new Date().toISOString(),
        date_et_heure_de_retrait_souhaitees: commande.date_et_heure_de_retrait_souhaitees || null,
        demande_special_pour_la_commande: commande.demande_special_pour_la_commande || null,
        nom_evenement: commande.nom_evenement || null,
        notes_internes: commande.notes_internes || null,
        details_commande_db: Array.isArray(commande.details_commande_db) ? commande.details_commande_db : []
      };

      // Calculer le prix total
      const prix_total = validatedCommande.details_commande_db.reduce((total: number, detail: DetailsCommande & { plats_db?: Plat }) => {
        const quantite = detail.quantite_plat_commande || 0;
        const prix = detail.plats_db?.prix || 0;
        return total + quantite * prix;
      }, 0) || 0;

      return {
        ...validatedCommande,
        id: validatedCommande.idcommande,
        client: null, // Sera résolu par une requête séparée si nécessaire
        details: validatedCommande.details_commande_db.map(detail => ({
          ...detail,
          plat: detail.plats_db
        })),
        prix_total,
        statut: mapStatutCommande(
          validatedCommande.statut_commande || 'En attente de confirmation'
        ),
        statut_commande: validateStatutCommande(validatedCommande.statut_commande),
        statut_paiement: validateStatutPaiement(validatedCommande.statut_paiement),
        type_livraison: validateTypeLivraison(validatedCommande.type_livraison),
      };
    },
    onSuccess: data => {
      // Invalider toutes les requêtes de commandes
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      queryClient.invalidateQueries({ queryKey: ['commande', data.id] });

      toast({
        title: 'Commande mise à jour',
        description: 'Les modifications ont été sauvegardées avec succès',
      });
    },
    onError: error => {
      console.error('Erreur mise à jour commande:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la commande',
        variant: 'destructive',
      });
    },
  });
};

// Hook pour les commandes en temps réel (admin)
export const useCommandesRealtime = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['commandes-realtime'],
    queryFn: async () => {
      // Se connecter au channel des commandes
      const channel = supabase
        .channel('commandes-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'commande_db',
          },
          () => {
            // Invalider et recharger les commandes quand il y a des changements
            queryClient.invalidateQueries({ queryKey: ['commandes'] });
            queryClient.invalidateQueries({ queryKey: ['commandes-stats'] });
          }
        )
        .subscribe();

      return channel;
    },
    enabled: false, // Désactivé par défaut, à activer manuellement
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook pour mettre à jour un événement
export const useUpdateEvenement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<EvenementInputData>;
    }): Promise<Evenement> => {
      const { data: updatedData, error } = await supabase
        .from('evenements_db')
        .update(data)
        .eq('idevenements', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
      toast({
        title: 'Événement mis à jour',
        description: 'Vos modifications ont été sauvegardées',
      });
    },
    onError: error => {
      console.error('Erreur mise à jour événement:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour l'événement",
        variant: 'destructive',
      });
    },
  });
};

// Fonctions utilitaires pour mapper les statuts
const mapStatutCommande = (statut: string): string => {
  switch (statut) {
    case 'En attente de confirmation':
      return 'en_attente';
    case 'Confirmée':
      return 'en_attente';
    case 'En préparation':
      return 'en_preparation';
    case 'Prête à récupérer':
      return 'en_preparation';
    case 'Récupérée':
      return 'terminee';
    case 'Annulée':
      return 'annulee';
    default:
      return 'en_attente';
  }
};

const mapStatutToDatabase = (statut: string): string => {
  switch (statut) {
    case 'en_attente':
      return 'En attente de confirmation';
    case 'en_preparation':
      return 'En préparation';
    case 'terminee':
      return 'Récupérée';
    case 'annulee':
      return 'Annulée';
    default:
      return 'En attente de confirmation';
  }
};

// Hook pour ajouter un plat à une commande existante
export const useAddPlatToCommande = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      commandeId, 
      platId, 
      quantite,
      nomPlat,
      prixUnitaire,
      type
    }: { 
      commandeId: number; 
      platId?: number | null; 
      quantite: number;
      nomPlat?: string;
      prixUnitaire?: number;
      type?: string;
    }): Promise<void> => {
      console.log('Ajout plat à commande:', commandeId, 'plat:', platId, 'quantité:', quantite);
      
      // Ajout d'Extra (ancien complément divers) - VERSION TEMPORAIRE SIMPLIFIÉE
      if (type === 'complement_divers') {
        console.log('🥄 Ajout d\'Extra (simplifié):', {
          nomPlat,
          prixUnitaire,
          commandeId
        });

        // DIAGNOSTIC: Architecture hybride Firebase + Supabase pour les Extras
        console.log('🔐 AVERTISSEMENT: RLS peut être activé sur details_commande_db - considérer désactiver temporairement');

        // Insérer l'Extra avec toutes les données nécessaires
        const insertData = {
          commande_r: commandeId,
          plat_r: 0, // Valeur spéciale pour identifier les extras
          quantite_plat_commande: 1,
          nom_plat: nomPlat,
          prix_unitaire: prixUnitaire,
          type: 'complement_divers'
        };

        console.log('📦 Données à insérer (RLS bypass requis):', insertData);

        const { data, error } = await supabase
          .from('details_commande_db')
          .insert(insertData)
          .select('*')
          .single();

        if (error) {
          console.error('❌ Erreur lors de l\'ajout de l\'Extra:', error);
          console.error('❌ Détails de l\'erreur:', JSON.stringify(error, null, 2));
          throw new Error(`Erreur lors de l'ajout de l'Extra: ${error.message || 'Erreur inconnue'}`);
        }

        console.log('✅ Extra ajouté avec succès avec nom et prix personnalisés:', data);
        return;
      }
      
      // Code normal pour les plats réguliers
      const insertData: any = {
        commande_r: commandeId,
        plat_r: platId,
        quantite_plat_commande: quantite
      };
      
      const { error } = await supabase
        .from('details_commande_db')
        .insert(insertData);

      if (error) {
        console.error('Erreur ajout plat:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalider toutes les queries liées aux commandes
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === 'commandes' || query.queryKey[0] === 'commande';
        }
      });
      toast({
        title: '✅ Plat ajouté',
        description: 'Le plat a été ajouté à la commande',
      });
    },
    onError: error => {
      console.error('Erreur ajout plat:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le plat',
        variant: 'destructive',
      });
    },
  });
};

// Hook pour modifier la quantité d'un plat dans une commande
export const useUpdatePlatQuantite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      detailId, 
      quantite 
    }: { 
      detailId: number; 
      quantite: number;
    }): Promise<void> => {
      console.log('Modification quantité détail:', detailId, 'nouvelle quantité:', quantite);
      
      const { error } = await supabase
        .from('details_commande_db')
        .update({ quantite_plat_commande: quantite })
        .eq('iddetails', detailId); // Correction: utilise iddetails au lieu de iddetails_commande

      if (error) {
        console.error('Erreur modification quantité:', error);
        // Utiliser la même stratégie que pour les événements pour gérer les erreurs vides
        const errorMsg = error?.message || error?.details || JSON.stringify(error) || 'Erreur inconnue lors de la modification';
        throw new Error(`Erreur modification quantité: ${errorMsg}`);
      }
    },
    onSuccess: () => {
      // Invalider toutes les queries liées aux commandes
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === 'commandes' || query.queryKey[0] === 'commande';
        }
      });
      toast({
        title: '✅ Quantité modifiée',
        description: 'La quantité a été mise à jour avec succès',
      });
    },
    onError: error => {
      console.error('Erreur modification quantité:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de modifier la quantité: ${error.message || 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    },
  });
};

// Hook pour supprimer un plat d'une commande
export const useRemovePlatFromCommande = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (detailId: number): Promise<void> => {
      console.log('Suppression plat détail ID:', detailId);
      
      const { error } = await supabase
        .from('details_commande_db')
        .delete()
        .eq('iddetails', detailId); // Correction: utilise iddetails au lieu de iddetails_commande

      if (error) {
        console.error('Erreur suppression plat:', error);
        // Utiliser la même stratégie que pour les événements pour gérer les erreurs vides
        const errorMsg = error?.message || error?.details || JSON.stringify(error) || 'Erreur inconnue lors de la suppression';
        throw new Error(`Erreur suppression plat: ${errorMsg}`);
      }
    },
    onSuccess: () => {
      // Invalider toutes les queries liées aux commandes
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === 'commandes' || query.queryKey[0] === 'commande';
        }
      });
      toast({
        title: '✅ Plat supprimé',
        description: 'Le plat a été retiré de la commande',
      });
    },
    onError: error => {
      console.error('Erreur suppression plat:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de supprimer le plat: ${error.message || 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    },
  });
};
