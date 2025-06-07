import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useClients } from '@/hooks/useAirtable'; // Utilise notre fichier de hooks unifié
import type { Client } from '@/types/airtable'; // Utilise notre fichier de types unifié

// Définit la forme des données que notre contexte va fournir
interface AuthContextType {
  currentUser: FirebaseUser | null;
  isLoadingAuth: boolean;
  currentUserAirtableData: Client | undefined;
  currentUserRole: Client['Role'];
  isLoadingUserRole: boolean;
  refetchClient: () => void;
}

// Nous exportons le Contexte pour que le hook useAuth puisse l'utiliser
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Le composant "Provider" qui englobe l'application et fournit les données
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // On récupère la liste de tous les clients et la fonction pour rafraîchir
  const { clients, isLoading: isLoadingClients, refetch } = useClients();

  useEffect(() => {
    // Met en place un observateur pour l'état de connexion de Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    // Nettoie l'observateur quand le composant est démonté
    return unsubscribe;
  }, []);
  
  // On cherche le client Airtable qui correspond à l'utilisateur Firebase connecté
  const currentUserAirtableData = currentUser && clients ? clients.find(c => c.FirebaseUID === currentUser.uid) : undefined;
  
  // On prépare la valeur à fournir au reste de l'application
  const value = {
    currentUser,
    isLoadingAuth,
    currentUserAirtableData,
    currentUserRole: currentUserAirtableData?.Role,
    isLoadingUserRole: isLoadingClients,
    refetchClient: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};