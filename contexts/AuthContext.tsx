'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from '@/lib/auth-client';
import { supabase } from '../lib/supabase';
import { useClient, useCreateClientAutomatic } from '../hooks/useSupabaseData';
import type { ClientUI } from '../types/app';

// Admin detection utility
const isAdminUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return email === 'fouquet_florian@hotmail.com' ||
         email.includes('admin') ||
         email === 'votre-email@example.com';
};

// Better Auth user type
interface BetterAuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  currentUser: BetterAuthUser | null;
  currentUserProfile: ClientUI | null;
  currentUserRole: 'client' | 'admin' | null;
  isLoadingAuth: boolean;
  isLoadingUserRole: boolean;
  refetchClient: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Better Auth session hook
  const { data: session, isPending: isLoadingSession } = useSession();

  const [adminProfile, setAdminProfile] = useState<ClientUI | null>(null);
  const [isLoadingAdminProfile, setIsLoadingAdminProfile] = useState(false);

  // Extract user from session
  const currentUser = session?.user as BetterAuthUser | null;

  // Check if current user is admin
  const isCurrentUserAdmin = isAdminUser(currentUser?.email);

  // For non-admin users: use authenticated client
  // For admin users: skip authenticated client to avoid multiple GoTrueClient instances
  const {
    data: clientUserProfile,
    isLoading: isLoadingClientUserRole,
    refetch: refetchClient
  } = useClient(!isCurrentUserAdmin && currentUser ? currentUser.id : undefined);

  // Hook pour créer un client automatiquement
  const createClientMutation = useCreateClientAutomatic();

  // Fetch admin profile using global Supabase client when user is admin
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (currentUser && isCurrentUserAdmin && !isLoadingSession) {
        setIsLoadingAdminProfile(true);
        try {
          const { data, error } = await supabase
            .from('client_db')
            .select('*')
            .eq('idclient', currentUser.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Erreur lors de la récupération du profil admin:', error);
          } else if (data) {
            setAdminProfile({
              id: data.idclient,
              idclient: data.idclient,
              firebase_uid: data.firebase_uid || data.idclient,
              email: data.email,
              nom: data.nom || '',
              prenom: data.prenom || '',
              numero_de_telephone: data.numero_de_telephone || '',
              adresse_numero_et_rue: data.adresse_numero_et_rue || '',
              date_de_naissance: data.date_de_naissance || '',
              role: data.role as 'admin' | 'client',
              code_postal: data.code_postal,
              ville: data.ville,
              preference_client: data.preference_client,
              comment_avez_vous_connu: data.comment_avez_vous_connu,
              souhaitez_vous_recevoir_actualites: data.souhaitez_vous_recevoir_actualites,
              photo_client: data.photo_client
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du profil admin:', error);
        } finally {
          setIsLoadingAdminProfile(false);
        }
      } else if (!isCurrentUserAdmin) {
        setAdminProfile(null);
        setIsLoadingAdminProfile(false);
      }
    };

    fetchAdminProfile();
  }, [currentUser, isCurrentUserAdmin, isLoadingSession]);

  // Créer automatiquement le profil Supabase si l'utilisateur existe mais pas le profil
  useEffect(() => {
    const currentProfile = isCurrentUserAdmin ? adminProfile : clientUserProfile;
    const isLoadingProfile = isCurrentUserAdmin ? isLoadingAdminProfile : isLoadingClientUserRole;

    if (currentUser && !isLoadingProfile && !currentProfile && !isLoadingSession) {
      console.log('Création automatique du profil Supabase pour:', currentUser.email);

      const clientData = {
        firebase_uid: currentUser.id, // Better Auth ID utilisé comme firebase_uid pour compatibilité
        email: currentUser.email || '',
        nom: currentUser.name?.split(' ')[1] || 'Temporaire',
        prenom: currentUser.name?.split(' ')[0] || 'Temporaire',
        role: (isCurrentUserAdmin ? 'admin' : 'client') as 'admin' | 'client',
        photo_client: currentUser.image || null
      };

      console.log('Données client à créer:', clientData);

      createClientMutation.mutate(clientData, {
        onError: (error) => {
          console.error('Erreur lors de la création automatique du profil:', error);
        },
        onSuccess: (data) => {
          console.log('Profil créé automatiquement avec succès:', data);
          if (isCurrentUserAdmin) {
            setAdminProfile({
              id: data.idclient,
              idclient: data.idclient,
              firebase_uid: data.firebase_uid || data.idclient,
              email: data.email,
              nom: data.nom || '',
              prenom: data.prenom || '',
              numero_de_telephone: data.numero_de_telephone || '',
              adresse_numero_et_rue: data.adresse_numero_et_rue || '',
              date_de_naissance: data.date_de_naissance || '',
              role: data.role as 'admin' | 'client',
              code_postal: data.code_postal,
              ville: data.ville,
              preference_client: data.preference_client,
              comment_avez_vous_connu: data.comment_avez_vous_connu,
              souhaitez_vous_recevoir_actualites: data.souhaitez_vous_recevoir_actualites,
              photo_client: data.photo_client
            });
          } else {
            refetchClient();
          }
        }
      });
    }
  }, [currentUser, adminProfile, clientUserProfile, isLoadingAdminProfile, isLoadingClientUserRole, isLoadingSession, isCurrentUserAdmin, createClientMutation, refetchClient]);

  // Determine current profile and loading state based on user type
  const currentProfile = isCurrentUserAdmin ? adminProfile : clientUserProfile;
  const isLoadingProfile = isCurrentUserAdmin ? isLoadingAdminProfile : isLoadingClientUserRole;

  const refetchProfile = () => {
    if (isCurrentUserAdmin) {
      const fetchAdminProfile = async () => {
        if (currentUser) {
          setIsLoadingAdminProfile(true);
          try {
            const { data, error } = await supabase
              .from('client_db')
              .select('*')
              .eq('idclient', currentUser.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              console.error('Erreur lors de la récupération du profil admin:', error);
            } else if (data) {
              setAdminProfile({
                id: data.idclient,
                idclient: data.idclient,
                firebase_uid: data.firebase_uid || data.idclient,
                email: data.email,
                nom: data.nom || '',
                prenom: data.prenom || '',
                numero_de_telephone: data.numero_de_telephone || '',
                adresse_numero_et_rue: data.adresse_numero_et_rue || '',
                date_de_naissance: data.date_de_naissance || '',
                role: data.role as 'admin' | 'client',
                code_postal: data.code_postal,
                ville: data.ville,
                preference_client: data.preference_client,
                comment_avez_vous_connu: data.comment_avez_vous_connu,
                souhaitez_vous_recevoir_actualites: data.souhaitez_vous_recevoir_actualites,
                photo_client: data.photo_client
              });
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du profil admin:', error);
          } finally {
            setIsLoadingAdminProfile(false);
          }
        }
      };
      fetchAdminProfile();
    } else {
      refetchClient();
    }
  };

  const value = {
    currentUser,
    currentUserProfile: currentProfile ? {
      ...currentProfile,
      id: currentProfile.idclient
    } : null,
    currentUserRole: (currentProfile?.role === 'admin' || currentProfile?.role === 'client')
      ? currentProfile.role as 'admin' | 'client'
      : null,
    isLoadingAuth: isLoadingSession,
    isLoadingUserRole: isLoadingProfile || createClientMutation.isPending,
    refetchClient: refetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
