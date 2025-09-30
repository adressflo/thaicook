'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { supabase } from '../lib/supabase'; // AJOUT: Import de supabase
// Utilisation des hooks Supabase
import { useClient, useCreateClientAutomatic } from '../hooks/useSupabaseData';
import type { ClientUI } from '../types/app'

// Admin detection utility
const isAdminUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return email === 'fouquet_florian@hotmail.com' ||
         email.includes('admin') ||
         email === 'votre-email@example.com';
};

// 1. Définir la structure des données que le contexte va fournir
interface AuthContextType {
  currentUser: FirebaseUser | null;
  currentUserProfile: ClientUI | null; // Données utilisateur depuis Supabase
  currentUserRole: 'client' | 'admin' | null;
  isLoadingAuth: boolean;
  isLoadingUserRole: boolean;
  refetchClient: () => void;
}

// 2. Créer le contexte (cette variable reste interne au fichier)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Créer et exporter le hook personnalisé qui sera utilisé partout dans l'application
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

// 4. Créer et exporter le "Fournisseur" qui enveloppera l'application
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [adminProfile, setAdminProfile] = useState<ClientUI | null>(null);
  const [isLoadingAdminProfile, setIsLoadingAdminProfile] = useState(false);

  // Check if current user is admin
  const isCurrentUserAdmin = isAdminUser(currentUser?.email);

  // For non-admin users: use authenticated client
  // For admin users: skip authenticated client to avoid multiple GoTrueClient instances
  const {
    data: clientUserProfile,
    isLoading: isLoadingClientUserRole,
    refetch: refetchClient
  } = useClient(!isCurrentUserAdmin ? currentUser?.uid : undefined);

  // Hook pour créer un client automatiquement (optimisé pour placeholders)
  const createClientMutation = useCreateClientAutomatic();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setIsLoadingAuth(true);
      if (user) {
        try {
          // Récupérer le token Firebase pour les headers personnalisés
          const token = await user.getIdToken();

          // Synchronisation manuelle : on stocke le Firebase UID pour Supabase
          // sans passer par l'auth Supabase qui ne supporte pas le provider 'firebase'
          console.log('✅ Utilisateur Firebase authentifié:', user.email);
          console.log('🔗 Firebase UID:', user.uid);

          // Optionnel : Vérifier la connectivité Supabase
          try {
            const { data, error } = await supabase.from('client_db').select('firebase_uid').limit(1);
            if (error && error.code !== 'PGRST116') {
              console.warn('⚠️ Problème de connexion Supabase:', error.message);
            } else {
              console.log('✅ Connexion Supabase OK');
            }
          } catch (e) {
            console.warn('⚠️ Test connexion Supabase échoué:', e);
          }

          setCurrentUser(user);
        } catch (e) {
          console.error('❌ Erreur lors de la récupération du token Firebase:', e);
          setCurrentUser(user); // On garde l'utilisateur même si le token échoue
        }
      } else {
        // User is signed out
        console.log('👋 Utilisateur déconnecté de Firebase');
        setCurrentUser(null);
      }
      setIsLoadingAuth(false);
    });

    return unsubscribe;
  }, []);

  // Fetch admin profile using global Supabase client when user is admin
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (currentUser && isCurrentUserAdmin && !isLoadingAuth) {
        setIsLoadingAdminProfile(true);
        try {
          const { data, error } = await supabase
            .from('client_db')
            .select('*')
            .eq('firebase_uid', currentUser.uid)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Erreur lors de la récupération du profil admin:', error);
          } else if (data) {
            setAdminProfile({
              id: data.firebase_uid, // Utiliser firebase_uid comme id pour ClientUI
              idclient: data.idclient,
              firebase_uid: data.firebase_uid,
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
        // Clear admin profile if user is not admin
        setAdminProfile(null);
        setIsLoadingAdminProfile(false);
      }
    };

    fetchAdminProfile();
  }, [currentUser, isCurrentUserAdmin, isLoadingAuth]);

  // Créer automatiquement le profil Supabase si l'utilisateur Firebase existe mais pas le profil
  useEffect(() => {
    const currentProfile = isCurrentUserAdmin ? adminProfile : clientUserProfile;
    const isLoadingProfile = isCurrentUserAdmin ? isLoadingAdminProfile : isLoadingClientUserRole;

    if (currentUser && !isLoadingProfile && !currentProfile && !isLoadingAuth) {
      // L'utilisateur Firebase existe mais pas son profil Supabase
      console.log('Création automatique du profil Supabase pour:', currentUser.email);

      // ⚠️ ATTENTION : Création profil temporaire avec placeholders
      // Ces données devront être complétées par l'utilisateur via le formulaire profil
      const clientData = {
        firebase_uid: currentUser.uid,
        email: currentUser.email || '',
        nom: 'Temporaire', // Placeholder temporaire pour passer validation Zod
        prenom: 'Temporaire', // Placeholder temporaire pour passer validation Zod
        role: isCurrentUserAdmin ? 'admin' : 'client'
      };

      console.log('Données client à créer:', clientData);

      createClientMutation.mutate(clientData, {
        onError: (error) => {
          console.error('Erreur lors de la création automatique du profil:', error);
        },
        onSuccess: (data) => {
          console.log('Profil créé automatiquement avec succès:', data);
          if (isCurrentUserAdmin) {
            // Refresh admin profile manually
            setAdminProfile({
              id: data.firebase_uid, // Utiliser firebase_uid comme id pour ClientUI
              idclient: data.idclient,
              firebase_uid: data.firebase_uid,
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
            // Refresh client profile via hook
            refetchClient();
          }
        }
      });
    }
  }, [currentUser, adminProfile, clientUserProfile, isLoadingAdminProfile, isLoadingClientUserRole, isLoadingAuth, isCurrentUserAdmin, createClientMutation, refetchClient]);

  // Determine current profile and loading state based on user type
  const currentProfile = isCurrentUserAdmin ? adminProfile : clientUserProfile;
  const isLoadingProfile = isCurrentUserAdmin ? isLoadingAdminProfile : isLoadingClientUserRole;

  const refetchProfile = () => {
    if (isCurrentUserAdmin) {
      // For admin, trigger a manual refetch by clearing and refetching
      const fetchAdminProfile = async () => {
        if (currentUser) {
          setIsLoadingAdminProfile(true);
          try {
            const { data, error } = await supabase
              .from('client_db')
              .select('*')
              .eq('firebase_uid', currentUser.uid)
              .single();

            if (error && error.code !== 'PGRST116') {
              console.error('Erreur lors de la récupération du profil admin:', error);
            } else if (data) {
              setAdminProfile({
                id: data.firebase_uid, // Utiliser firebase_uid comme id pour ClientUI
                idclient: data.idclient,
                firebase_uid: data.firebase_uid,
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
      // For clients, use the existing refetch function
      refetchClient();
    }
  };

  const value = {
    currentUser,
    currentUserProfile: currentProfile ? {
      ...currentProfile,
      id: currentProfile.firebase_uid
    } : null,
    currentUserRole: (currentProfile?.role === 'admin' || currentProfile?.role === 'client')
      ? currentProfile.role as 'admin' | 'client'
      : null,
    isLoadingAuth,
    isLoadingUserRole: isLoadingProfile || createClientMutation.isPending,
    refetchClient: refetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
