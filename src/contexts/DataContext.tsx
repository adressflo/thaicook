import { createContext, useContext, ReactNode } from 'react';
import { usePlats, useClients, useCommandes } from '../hooks/useAirtable';
import type { Plat, Client, Commande } from '../types/airtable';

interface DataContextType {
  plats: Plat[] | undefined;
  clients: Client[] | undefined;
  commandes: Commande[] | undefined;
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

export const useData = () => {
  return useContext(DataContext);
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { data: plats, isLoading: platsLoading, error: platsError } = usePlats();
  // CORRECTION: 'useClientsList' a été remplacé par 'useClients'
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useClients(); 
  const { data: commandes, isLoading: commandesLoading, error: commandesError } = useCommandes();

  const isLoading = platsLoading || clientsLoading || commandesLoading;
  const error = platsError || clientsError || commandesError;

  return (
    <DataContext.Provider value={{ plats, clients, commandes, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};
