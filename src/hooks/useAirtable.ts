import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableService } from '@/services/airtableService';
import type { AirtableConfig, AirtableResponse, Client, Plat, Commande, Evenement, Ingredient, ClientInputData, CommandeInputData, CommandeUpdateData, EvenementInputData, AirtableRecord } from '@/types/airtable';

// --- CONFIGURATION ---
export const useAirtableConfig = () => {
  const [config, setConfig] = useState<AirtableConfig | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('airtable-config');
      try {
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        console.error("Erreur parsing config Airtable depuis localStorage:", e);
        return null;
      }
    }
    return null;
  });

  const updateConfig = (newConfig: AirtableConfig) => {
    setConfig(newConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem('airtable-config', JSON.stringify(newConfig));
    }
  };

  const clearConfig = () => {
    setConfig(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('airtable-config');
    }
  };
  return { config, updateConfig, clearConfig };
};

// --- HOOKS DE LECTURE (un par table) ---
const useAirtableData = (tableName: string) => {
    const { config } = useAirtableConfig();
    return useQuery<AirtableRecord[], Error>({
        queryKey: ['airtable', tableName, config?.baseId],
        queryFn: async () => {
            if (!config) return [];
            const response = await airtableService.fetchRecords({ ...config, tableName });
            return response.records;
        },
        enabled: !!config,
        staleTime: 5 * 60 * 1000,
    });
};

export const useClients = () => {
    const { data, isLoading, error, refetch } = useAirtableData('Client DB');
    // Le mappage ici garantit que les données sont bien formatées pour l'application
    const clients: Client[] = data?.map(r => ({ ...r.fields, id: r.id, createdTime: r.createdTime } as Client)) || [];
    return { clients, isLoading, error, refetch };
};

export const usePlats = () => {
    const { data, isLoading, error, refetch } = useAirtableData('Plats DB');
    const plats: Plat[] = data?.map(r => ({ ...r.fields, id: r.id, createdTime: r.createdTime } as Plat)) || [];
    return { plats, isLoading, error, refetch };
};

export const useCommandes = () => {
    const { data, isLoading, error, refetch } = useAirtableData('Commandes DB');
    const { clients } = useClients();
    
    const commandes: Commande[] = data?.map(record => {
        const clientRecordId = record.fields['Client R']?.[0];
        const client = clients?.find(c => c.id === clientRecordId);
        const clientName = client ? `${client.Prénom || ''} ${client.Nom || ''}`.trim() : 'Client non trouvé';
        return { ...record.fields, id: record.id, createdTime: record.createdTime, clientName } as Commande;
    }) || [];

    return { commandes, isLoading, error, refetch };
};

export const useEvenements = () => {
    const { data, isLoading, error, refetch } = useAirtableData('Événements DB');
    const evenements: Evenement[] = data?.map(r => ({ ...r.fields, id: r.id, createdTime: r.createdTime } as Evenement)) || [];
    return { evenements, isLoading, error, refetch };
};

export const useIngredients = () => {
    const { data, isLoading, error, refetch } = useAirtableData('Ingrédients DB');
    const ingredients: Ingredient[] = data?.map(r => ({ ...r.fields, id: r.id } as Ingredient)) || [];
    return { ingredients, isLoading, error, refetch };
};


// --- HOOKS D'ÉCRITURE (MUTATIONS) ---

export const useCreateClient = () => {
    const queryClient = useQueryClient();
    const { config } = useAirtableConfig();
    return useMutation<AirtableRecord, Error, ClientInputData>({
        mutationFn: (data) => {
            if (!config) throw new Error("Config absente");
            return airtableService.createRecord({ ...config, tableName: 'Client DB' }, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB'] });
        },
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();
    const { config } = useAirtableConfig();
    return useMutation<AirtableRecord, Error, { recordId: string; clientData: ClientInputData }>({
        mutationFn: ({ recordId, clientData }) => {
            if (!config) throw new Error("Config absente");

            // CORRECTION : On s'assure que les clés correspondent EXACTEMENT à Airtable
            const fieldsToUpdate: Record<string, any> = {
                ...(clientData.Nom !== undefined && { 'Nom': clientData.Nom }),
                ...(clientData.Prénom !== undefined && { 'Prénom': clientData.Prénom }),
                ...(clientData['e-mail'] !== undefined && { 'e-mail': clientData['e-mail'] }),
                ...(clientData['Numéro de téléphone'] !== undefined && { 'Numéro de téléphone': clientData['Numéro de téléphone'] }),
                // ... etc pour les autres champs
                // Voici la correction pour l'adresse :
                ...(clientData['Adresse (numéro et rue)'] !== undefined && { 'Adresse (numéro et rue)': clientData['Adresse (numéro et rue)'] }),
            };

            return airtableService.updateRecord({ ...config, tableName: 'Client DB' }, recordId, fieldsToUpdate);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB'] });
        },
    });
};

export const useCreateCommande = () => {
    const queryClient = useQueryClient();
    const { config } = useAirtableConfig();
    return useMutation<AirtableRecord, Error, CommandeInputData>({
      mutationFn: async (commandeData) => {
          if (!config) throw new Error("Config absente");
          const cmdFields = {
              'Client R': [commandeData.clientAirtableId],
              'Date et Heure de Retrait Souhaitées': commandeData.dateHeureRetrait,
              'Demande spécial pour la commande': commandeData.demandesSpeciales,
              'Statut Commande': 'En attente de confirmation',
              'Statut Paiement': 'En attente sur place',
          };
          const newCmd = await airtableService.createRecord({ ...config, tableName: 'Commandes DB' }, cmdFields);
          const passageConfig = { ...config, tableName: 'Passage Commande DB' };
          const passagePromises = commandeData.panier.map(item => airtableService.createRecord(passageConfig, {
              'commande R': [newCmd.id], 'Plat R': [item.id], 'quantité plat commandé': item.quantite,
          }));
          await Promise.all(passagePromises);
          return newCmd;
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['airtable', 'Commandes DB'] });
          queryClient.invalidateQueries({ queryKey: ['airtable', 'Passage Commande DB'] });
      },
    });
};

export const useUpdateCommande = () => {
    const queryClient = useQueryClient();
    const { config } = useAirtableConfig();
    return useMutation<AirtableRecord, Error, { recordId: string; data: CommandeUpdateData }>({
      mutationFn: ({recordId, data}) => {
        if (!config) throw new Error("Config absente");
        return airtableService.updateRecord({ ...config, tableName: 'Commandes DB' }, recordId, data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['airtable', 'Commandes DB'] });
      },
    });
};

export const useCreateEvenement = () => {
    const queryClient = useQueryClient();
    const { config } = useAirtableConfig();
    const { clients } = useClients();
  
    return useMutation<AirtableRecord, Error, EvenementInputData>({
      mutationFn: async (evenementData) => {
        if (!config) throw new Error("Config absente");
        const clientRecord = clients.find(c => c['e-mail'] === evenementData.contactEmail);
        const fields = {
            'Nom Événement': evenementData['Nom Événement'],
            'Date Événement': evenementData['Date Événement'],
            'Type d\'Événement': evenementData['Type d\'Événement'],
            'Nombre de personnes': evenementData['Nombre de personnes'],
            'Budget Client': evenementData['Budget Client'],
            'Demandes Spéciales Événement': evenementData['Demandes Spéciales Événement'],
            'Plats Pré-sélectionnés (par client) R': evenementData['Plats Pré-sélectionnés (par client) R'],
            'Statut Événement': 'Demande initiale',
            ...(clientRecord && { 'Contact Client R': [clientRecord.id] }),
        };
        return airtableService.createRecord({ ...config, tableName: 'Événements DB' }, fields);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['airtable', 'Événements DB'] });
      },
    });
};