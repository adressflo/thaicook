import React, { createContext, useContext, ReactNode } from 'react';
import { useClients, usePlats, useCommandes, useEvenements, useIngredients } from '@/hooks/useAirtable';
import type { Client, Plat, Commande, Evenement, Ingredient } from '@/types/airtable';
import { Loader2 } from 'lucide-react';

interface DataContextType {
    clients: Client[];
    plats: Plat[];
    commandes: Commande[];
    evenements: Evenement[];
    ingredients: Ingredient[];
    isLoading: boolean;
    error: Error | null; // Ajout de la propriété d'erreur
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { clients, isLoading: isLoadingClients, error: errorClients } = useClients();
    const { plats, isLoading: isLoadingPlats, error: errorPlats } = usePlats();
    const { commandes, isLoading: isLoadingCommandes, error: errorCommandes } = useCommandes();
    const { evenements, isLoading: isLoadingEvenements, error: errorEvenements } = useEvenements();
    const { ingredients, isLoading: isLoadingIngredients, error: errorIngredients } = useIngredients();

    const isLoading = isLoadingClients || isLoadingPlats || isLoadingCommandes || isLoadingEvenements || isLoadingIngredients;
    // On prend la première erreur rencontrée
    const error = errorClients || errorPlats || errorCommandes || errorEvenements || errorIngredients || null;

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gradient-thai">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-thai-orange mx-auto mb-4" />
                    <p className="text-thai-green font-semibold">Chargement des données...</p>
                </div>
            </div>
        );
    }
    
    const value = {
        clients,
        plats,
        commandes,
        evenements,
        ingredients,
        isLoading,
        error, // On fournit l'erreur au contexte
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};