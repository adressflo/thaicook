'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { supabase } from '../lib/supabase'; // AJOUT: Import de supabase
// Utilisation des hooks Supabase
import { useClient, useCreateClient } from '../hooks/useSupabaseData';
import type { ClientUI } from '../types/app'

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

  // Ce hook récupère les données Supabase du client quand l'utilisateur Firebase est connu
  const { 
    data: currentUserProfile, 
    isLoading: isLoadingUserRole, 
    refetch: refetchClient 
  } = useClient(currentUser?.uid);

  // Hook pour créer un client automatiquement
  const createClientMutation = useCreateClient();

  // Met en place un "écouteur" qui réagit aux changements de connexion/déconnexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // IMPORTANT: Pour cette architecture hybride Firebase + Supabase,
      // nous utilisons les données utilisateur Firebase mais stockons les données métier dans Supabase
      // Les politiques RLS sont désactivées temporairement
      if (user) {
        console.log('✅ Utilisateur Firebase connecté:', user.email);
        console.log('🔑 UID Firebase:', user.uid);
      } else {
        console.log('❌ Utilisateur Firebase déconnecté');
      }
      
      setIsLoadingAuth(false);
    });
    // Nettoie l'écouteur quand le composant est retiré
    return unsubscribe;
  }, []);

  // Créer automatiquement le profil Supabase si l'utilisateur Firebase existe mais pas le profil
  useEffect(() => {
    if (currentUser && !isLoadingUserRole && !currentUserProfile) {
      // L'utilisateur Firebase existe mais pas son profil Supabase
      console.log('Création automatique du profil Supabase pour:', currentUser.email);
      
      // Créer un admin par défaut pour les premiers tests
      const isFirstAdmin = currentUser.email?.includes('admin') || 
                          currentUser.email === 'votre-email@example.com'; // Remplacez par votre email
      
      const clientData = {
        firebase_uid: currentUser.uid,
        email: currentUser.email || '',
        nom: '',
        prenom: '',
        role: isFirstAdmin ? 'admin' : 'client'
      };
      
      console.log('Données client à créer:', clientData);
      
      createClientMutation.mutate(clientData, {
        onError: (error) => {
          console.error('Erreur lors de la création automatique du profil:', error);
        },
        onSuccess: (data) => {
          console.log('Profil créé automatiquement avec succès:', data);
          refetchClient();
        }
      });
    }
  }, [currentUser, currentUserProfile, isLoadingUserRole, createClientMutation, refetchClient]);

  const value = {
    currentUser,
    currentUserProfile: currentUserProfile ? {
      ...currentUserProfile,
      id: currentUserProfile.firebase_uid
    } : null,
    currentUserRole: (currentUserProfile?.role === 'admin' || currentUserProfile?.role === 'client') 
      ? currentUserProfile.role as 'admin' | 'client' 
      : null,
    isLoadingAuth,
    isLoadingUserRole: isLoadingUserRole || createClientMutation.isPending,
    refetchClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
