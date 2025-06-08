import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import type { Plat, Client, Commande, ClientInputData, PlatPanier } from '@/types/airtable';

// --- Configuration ---
// Hook pour gérer la configuration de l'API Airtable (clé et base ID)
interface AirtableConfig {
  apiKey: string;
  baseId: string;
}

export const useAirtableConfig = () => {
  const [config, setConfig] = useState<AirtableConfig | null>(null);
  useEffect(() => {
    // Au chargement, essaie de récupérer la config depuis le localStorage
    const apiKey = localStorage.getItem('airtableApiKey');
    const baseId = localStorage.getItem('airtableBaseId');
    if (apiKey && baseId) setConfig({ apiKey, baseId });
  }, []);

  const saveConfig = (apiKey: string, baseId: string) => {
    localStorage.setItem('airtableApiKey', apiKey);
    localStorage.setItem('airtableBaseId', baseId);
    setConfig({ apiKey, baseId });
  };
  return { config, saveConfig };
};

// --- API Fetcher Générique ---
// Une fonction centrale pour tous les appels à l'API Airtable
const fetchAirtable = async (config: AirtableConfig, path: string, options: RequestInit = {}) => {
    const response = await fetch(`https://api.airtable.com/v0/${config.baseId}/${path}`, {
        ...options,
        headers: { ...options.headers, 'Authorization': `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur Airtable (${response.status}): ${errorData.error?.message || 'Erreur inconnue'}`);
    }
    return response.json();
};

// --- Hooks Spécifiques ---

// Hook pour récupérer la liste de tous les plats
export const usePlats = () => {
  const { config } = useAirtableConfig();
  return useQuery<Plat[], Error>({
    queryKey: ['plats'],
    queryFn: async () => {
      if (!config) throw new Error('Config Airtable manquante');
      const data = await fetchAirtable(config, 'Plats%20DB');
      return data.records.map((record: any) => ({ id: record.id, ...record.fields }));
    },
    enabled: !!config,
  });
};

// Hook pour récupérer la liste de tous les clients
export const useClients = () => {
  const { config } = useAirtableConfig();
  return useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!config) throw new Error('Config Airtable manquante');
      const data = await fetchAirtable(config, 'Client%20DB');
      return data.records.map((record: any) => ({ id: record.id, ...record.fields }));
    },
    enabled: !!config,
  });
};

// Hook pour récupérer la liste de toutes les commandes
export const useCommandes = () => {
    const { config } = useAirtableConfig();
    return useQuery<Commande[], Error>({
        queryKey: ['commandes'],
        queryFn: async () => {
            if (!config) throw new Error('Config Airtable manquante');
            const data = await fetchAirtable(config, 'Commandes%20DB');
            // Mappe le nom de champ Airtable 'Total Commande' vers la propriété 'Total'
            return data.records.map((record: any) => ({ id: record.id, ...record.fields, createdTime: record.createdTime, Total: record.fields['Total Commande'] }));
        },
        enabled: !!config,
    });
};

// Hook pour récupérer un client spécifique via son UID Firebase
export const useClientByFirebaseUID = (uid?: string | null) => {
  const { config } = useAirtableConfig();
  return useQuery<Client | null, Error>({
    queryKey: ['client', uid],
    queryFn: async () => {
      if (!config || !uid) return null;
      const filter = encodeURIComponent(`{FirebaseUID} = '${uid}'`);
      const data = await fetchAirtable(config, `Client%20DB?filterByFormula=${filter}&maxRecords=1`);
      return data.records.length > 0 ? { id: data.records[0].id, ...data.records[0].fields } : null;
    },
    enabled: !!config && !!uid, // Ne s'active que si la config et l'UID sont présents
  });
};

// Hook pour créer un nouveau client
export const useCreateClient = () => {
  const { config } = useAirtableConfig();
  const queryClient = useQueryClient();
  return useMutation<any, Error, ClientInputData>({
    mutationFn: (clientData) => {
      if (!config) throw new Error("Config Airtable manquante");
      return fetchAirtable(config, 'Client%20DB', { method: 'POST', body: JSON.stringify({ fields: clientData }) });
    },
    // Après succès, invalide les données en cache pour forcer un rechargement
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['client', variables.FirebaseUID] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });
};

// Hook pour mettre à jour un client existant
export const useUpdateClient = () => {
  const { config } = useAirtableConfig();
  const queryClient = useQueryClient();
  return useMutation<any, Error, { recordId: string, clientData: ClientInputData }>({
    mutationFn: ({ recordId, clientData }) => {
      if (!config) throw new Error("Config Airtable manquante");
      return fetchAirtable(config, `Client%20DB/${recordId}`, { method: 'PATCH', body: JSON.stringify({ fields: clientData }) });
    },
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['client', variables.clientData.FirebaseUID] });
        queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

// Hook pour récupérer les commandes d'un client spécifique
export const useCommandesByClient = (clientRecordId?: string) => {
    const { config } = useAirtableConfig();
    return useQuery<Commande[], Error>({
        queryKey: ['commandesByClient', clientRecordId],
        queryFn: async () => {
        if (!config || !clientRecordId) return [];
        const filter = encodeURIComponent(`{Client R} = '${clientRecordId}'`);
        const data = await fetchAirtable(config, `Commandes%20DB?filterByFormula=${filter}`);
        return data.records.map((record: any) => ({ id: record.id, ...record.fields, createdTime: record.createdTime, Total: record.fields['Total Commande'] || 0 }));
        },
        enabled: !!config && !!clientRecordId,
    });
};

// Hook pour récupérer une commande par son ID unique
export const useCommandeById = (recordId?: string) => {
    const { config } = useAirtableConfig();
    return useQuery<Commande, Error>({
        queryKey: ['commande', recordId],
        queryFn: async () => {
        if (!config || !recordId) throw new Error('Config ou ID manquant');
        const data = await fetchAirtable(config, `Commandes%20DB/${recordId}`);
        return { id: data.id, ...data.fields, createdTime: data.createdTime, Total: data.fields['Total Commande'] || 0 };
        },
        enabled: !!config && !!recordId,
    });
};

// Hook pour créer une nouvelle commande
export const useCreateCommande = () => {
    const { config } = useAirtableConfig();
    const queryClient = useQueryClient();
    return useMutation<any, Error, { clientAirtableId: string, panier: PlatPanier[], dateHeureRetrait: string, demandesSpeciales: string, firebaseUID: string }>({
        mutationFn: async ({ clientAirtableId, panier, dateHeureRetrait, demandesSpeciales, firebaseUID }) => {
        if (!config) throw new Error('Config Airtable manquante');
        const total = panier.reduce((acc, item) => acc + (item.prix * item.quantite), 0);
        const data = { fields: { 'Client R': [clientAirtableId], 'Date & Heure de retrait': dateHeureRetrait, 'Statut Commande': 'En attente de confirmation', 'Demandes spéciales': demandesSpeciales, 'Total Commande': total, FirebaseUID: firebaseUID }};
        return fetchAirtable(config, 'Commandes%20DB', { method: 'POST', body: JSON.stringify(data) });
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['commandes'] }) },
    });
};

// Hook pour créer une nouvelle demande d'événement
export const useCreateEvenement = () => {
  const { config } = useAirtableConfig();
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: async (evenementData: any) => {
          if (!config) throw new Error("Config Airtable manquante");
          return fetchAirtable(config, 'Événements DB', {
              method: 'POST',
              body: JSON.stringify({ fields: evenementData })
          });
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['evenements'] });
      }
  });
};
