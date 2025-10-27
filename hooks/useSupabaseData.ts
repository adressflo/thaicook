'use client'

/**
 * SUPABASE HOOKS - Fonctionnalités spécifiques Supabase
 *
 * Ce fichier contient UNIQUEMENT les hooks pour les fonctionnalités qui utilisent Supabase :
 * - Realtime (synchronisation live des commandes)
 * - Ruptures de plats (gestion des disponibilités)
 * - Listes de courses (fonctionnalité shopping)
 *
 * ⚠️ IMPORTANT : Toutes les opérations CRUD standards utilisent Prisma ORM
 * Voir hooks/usePrismaData.ts pour les hooks CRUD (Clients, Plats, Commandes, Extras, Evenements)
 */

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, CACHE_TIMES } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ============================================
// TYPES
// ============================================

export type PlatRupture = {
  id: number;
  plat_id: number;
  date_rupture: string;
  raison_rupture?: string | null;
  type_rupture?: string | null;
  notes_rupture?: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

// ============================================
// HOOKS - RUPTURES DE PLATS
// ============================================

/**
 * Récupère les ruptures de stock pour un plat
 * @param platId - ID du plat
 */
export const usePlatRuptures = (platId?: number) => {
  return useQuery({
    queryKey: ['plat-ruptures', platId],
    queryFn: async (): Promise<PlatRupture[]> => {
      if (!platId) return [];

      const { data, error } = await supabase
        .from('plats_rupture_dates')
        .select('*')
        .eq('plat_id', platId)
        .eq('is_active', true)
        .gte('date_rupture', new Date().toISOString().split('T')[0])
        .order('date_rupture', { ascending: true });

      if (error) {
        const contextError = new Error(`Échec chargement ruptures plat (${platId}): ${error.message || 'Erreur base de données'}`);
        contextError.cause = error;
        throw contextError;
      }

      return data || [];
    },
    enabled: !!platId,
  });
};

/**
 * Crée une nouvelle rupture de stock
 */
export const useCreatePlatRupture = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ruptureData: {
      plat_id: number;
      date_rupture: string;
      raison_rupture?: string;
      type_rupture?: string;
      notes_rupture?: string;
    }) => {
      const { data, error } = await supabase
        .from('plats_rupture_dates')
        .insert([
          {
            plat_id: ruptureData.plat_id,
            date_rupture: ruptureData.date_rupture,
            raison_rupture: ruptureData.raison_rupture,
            type_rupture: ruptureData.type_rupture,
            notes_rupture: ruptureData.notes_rupture,
            is_active: true,
          }
        ])
        .select()
        .single();

      if (error) {
        const contextError = new Error(`Échec création rupture: ${error.message || 'Erreur base de données'}`);
        contextError.cause = error;
        throw contextError;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plat-ruptures', variables.plat_id] });
      queryClient.invalidateQueries({ queryKey: ['prisma-plats'] }); // Invalider aussi cache Prisma
      toast({
        title: "Succès",
        description: "Rupture de stock programmée"
      });
    },
    onError: (error) => {
      console.error('Erreur dans useCreatePlatRupture:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de programmer la rupture",
        variant: "destructive"
      });
    }
  });
};

/**
 * Supprime une rupture de stock
 */
export const useDeletePlatRupture = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ruptureId: number) => {
      const { error } = await supabase
        .from('plats_rupture_dates')
        .update({ is_active: false })
        .eq('id', ruptureId);

      if (error) {
        const contextError = new Error(`Échec suppression rupture: ${error.message || 'Erreur base de données'}`);
        contextError.cause = error;
        throw contextError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plat-ruptures'] });
      queryClient.invalidateQueries({ queryKey: ['prisma-plats'] });
      toast({
        title: "Succès",
        description: "Rupture annulée"
      });
    },
    onError: (error) => {
      console.error('Erreur dans useDeletePlatRupture:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'annuler la rupture",
        variant: "destructive"
      });
    }
  });
};

/**
 * Vérifie si un plat est disponible à une date donnée
 */
export const useCheckPlatAvailability = () => {
  return useMutation({
    mutationFn: async ({ platId, date }: { platId: number; date: string }): Promise<boolean> => {
      // Vérifier s'il existe une rupture active pour cette date
      const { data, error } = await supabase
        .from('plats_rupture_dates')
        .select('id')
        .eq('plat_id', platId)
        .eq('date_rupture', date)
        .eq('is_active', true)
        .limit(1);

      if (error) {
        console.error('Erreur vérification disponibilité:', error);
        return true; // Par défaut disponible si erreur
      }

      // Si data est vide, le plat est disponible
      return !data || data.length === 0;
    }
  });
};

// ============================================
// HOOKS - REALTIME SUPABASE
// ============================================

/**
 * Active la synchronisation en temps réel pour les commandes
 * Écoute les changements sur commande_db et details_commande_db
 * Invalide automatiquement les caches TanStack Query
 */
export const useCommandesRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Activation Real-time Supabase pour synchronisation admin ↔ client');

    // Channel pour les commandes (statut, modifications)
    const commandesChannel = supabase
      .channel('commandes-realtime-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'commande_db',
        },
        (payload) => {
          console.log('🔔 Changement commande détecté:', payload.eventType, payload.new || payload.old);

          // Invalider tous les caches de commandes (Prisma)
          queryClient.invalidateQueries({
            predicate: (query) => {
              const key = query.queryKey[0];
              return key === 'prisma-commandes' ||
                     key === 'prisma-commande' ||
                     key === 'prisma-commandes-client';
            }
          });

          console.log('✅ Caches commandes invalidés');
        }
      )
      .subscribe((status) => {
        console.log('📡 Statut subscription commandes:', status);
      });

    // Channel pour les détails de commandes (ajout/suppression plats, quantités)
    const detailsChannel = supabase
      .channel('details-realtime-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'details_commande_db',
        },
        (payload) => {
          console.log('🔔 Changement détails commande détecté:', payload.eventType);

          // Invalider tous les caches de commandes
          queryClient.invalidateQueries({
            predicate: (query) => {
              const key = query.queryKey[0];
              return key === 'prisma-commandes' ||
                     key === 'prisma-commande' ||
                     key === 'prisma-commandes-client';
            }
          });

          console.log('✅ Caches détails invalidés');
        }
      )
      .subscribe((status) => {
        console.log('📡 Statut subscription détails:', status);
      });

    // Cleanup : désinscription des channels quand le composant se démonte
    return () => {
      console.log('🔌 Déconnexion Real-time Supabase');
      supabase.removeChannel(commandesChannel);
      supabase.removeChannel(detailsChannel);
    };
  }, [queryClient]);
};

// ============================================
// HOOKS - LISTES DE COURSES
// ============================================

/**
 * Récupère toutes les listes de courses
 */
export const useListesCourses = () => {
  return useQuery({
    queryKey: ['listes-courses'],
    queryFn: async () => {
      console.log('🛒 Chargement des listes de courses...');

      const { data, error } = await supabase
        .from('listes_courses')
        .select('*')
        .order('date_creation', { ascending: false });

      if (error) {
        console.error('❌ Erreur chargement listes courses:', error);
        throw new Error(`Échec chargement listes courses: ${error.message}`);
      }

      console.log('✅ Listes courses chargées:', data?.length);
      return data || [];
    },
    staleTime: CACHE_TIMES.CLIENTS, // 5 minutes
  });
};

/**
 * Récupère le catalogue d'articles pour les courses
 */
export const useCatalogueArticles = () => {
  return useQuery({
    queryKey: ['catalogue-articles'],
    queryFn: async () => {
      console.log('📦 Chargement du catalogue articles...');

      const { data, error } = await supabase
        .from('catalogue_articles')
        .select('*')
        .order('nom_article');

      if (error) {
        console.error('❌ Erreur chargement catalogue:', error);
        throw new Error(`Échec chargement catalogue: ${error.message}`);
      }

      console.log('✅ Catalogue articles chargé:', data?.length);
      return data || [];
    },
    staleTime: CACHE_TIMES.PLATS, // 15 minutes
  });
};

/**
 * Récupère les articles d'une liste de courses spécifique
 * @param idListe - ID de la liste de courses
 */
export const useArticlesListeCourses = (idListe?: number) => {
  return useQuery({
    queryKey: ['articles-liste-courses', idListe],
    queryFn: async () => {
      if (!idListe) return [];

      console.log('📋 Chargement articles liste cours:', idListe);

      const { data, error } = await supabase
        .from('articles_liste_courses')
        .select('*')
        .eq('liste_id', idListe)
        .order('ordre_affichage', { ascending: true });

      if (error) {
        console.error('❌ Erreur chargement articles liste:', error);
        throw new Error(`Échec chargement articles liste: ${error.message}`);
      }

      console.log('✅ Articles liste chargés:', data?.length);
      return data || [];
    },
    enabled: !!idListe,
    staleTime: CACHE_TIMES.CLIENTS, // 5 minutes
  });
};
