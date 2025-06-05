// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useClientByFirebaseUID, type MappedClientData } from '@/hooks/useAirtable';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  isLoadingAuth: boolean;
  currentUserAirtableData: MappedClientData | undefined;
  currentUserRole: 'client' | 'admin' | undefined;
  isLoadingUserRole: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const { client: currentUserAirtableData, isLoading: isLoadingAirtableClient, error: airtableError } = useClientByFirebaseUID(currentUser?.uid);

  useEffect(() => {
    setIsLoadingAuth(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[AuthContext] onAuthStateChanged - Firebase user:', user?.uid);
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  const derivedUserRole = currentUserAirtableData?.role;

  // Logs pour débogage
  console.log('[AuthContext] currentUser:', currentUser?.uid);
  console.log('[AuthContext] isLoadingAuth:', isLoadingAuth);
  console.log('[AuthContext] currentUserAirtableData:', currentUserAirtableData);
  console.log('[AuthContext] isLoadingAirtableClient (isLoadingUserRole):', isLoadingAirtableClient);
  console.log('[AuthContext] Airtable Error (if any):', airtableError);
  console.log('[AuthContext] Derived currentUserRole:', derivedUserRole);


  const value = {
    currentUser,
    isLoadingAuth,
    currentUserAirtableData,
    currentUserRole: derivedUserRole,
    isLoadingUserRole: isLoadingAirtableClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};