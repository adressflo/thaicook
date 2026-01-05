'use client';

import { createContext, useContext, ReactNode } from 'react';
// Migration Prisma - Utilisation des hooks Prisma
import { usePrismaPlats, usePrismaClients, usePrismaCommandes } from '../hooks/usePrismaData';
import type { PlatUI, ClientUI, CommandeUI } from '../types/app'

interface DataContextType {
  plats: PlatUI[] | undefined;
  clients: ClientUI[] | undefined;
  commandes: CommandeUI[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextType>({
  plats: [],
  clients: [],
  commandes: [],
  isLoading: true,
  error: null,
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { data: plats, isLoading: platsLoading, error: platsError } = usePrismaPlats();
  const { data: clients, isLoading: clientsLoading, error: clientsError } = usePrismaClients();
  const { data: commandes, isLoading: commandesLoading, error: commandesError } = usePrismaCommandes();

  const isLoading = platsLoading || clientsLoading || commandesLoading;
  const error = platsError || clientsError || commandesError;

  return (
    <DataContext.Provider value={{ plats, clients, commandes, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  return useContext(DataContext);
};
