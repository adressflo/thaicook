import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useClientByFirebaseUID } from '../hooks/useAirtable';
import type { Client } from '../types/airtable';

// 1. Définir la structure des données que le contexte va fournir
interface AuthContextType {
  currentUser: FirebaseUser | null;
  currentUserAirtableData: Client | null;
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

  // Ce hook récupère les données Airtable du client quand l'utilisateur Firebase est connu
  const { 
    data: currentUserAirtableData, 
    isLoading: isLoadingUserRole, 
    refetch: refetchClient 
  } = useClientByFirebaseUID(currentUser?.uid);

  // Met en place un "écouteur" qui réagit aux changements de connexion/déconnexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    // Nettoie l'écouteur quand le composant est retiré
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    currentUserAirtableData: currentUserAirtableData || null,
    currentUserRole: currentUserAirtableData?.Role || null,
    isLoadingAuth,
    isLoadingUserRole,
    refetchClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
