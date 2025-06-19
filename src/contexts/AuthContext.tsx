import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
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
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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
      
      createClientMutation.mutate({
        firebase_uid: currentUser.uid,
        email: currentUser.email || '',
        nom: '',
        prenom: '',
        role: 'client'
      });
    }
  }, [currentUser, currentUserProfile, isLoadingUserRole, createClientMutation]);

  const value = {
    currentUser,
    currentUserProfile: currentUserProfile || null,
    currentUserRole: currentUserProfile?.role || null,
    isLoadingAuth,
    isLoadingUserRole: isLoadingUserRole || createClientMutation.isPending,
    refetchClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
