// src/hooks/useAirtable.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableService } from '@/services/airtableService';
import {
  AirtableConfig,
  Client, 
  Plat,
  Commande,
  Evenement,
  AirtableRecord,
  AirtableResponse 
} from '@/types/airtable';

export const useAirtableConfig = () => {
  const [config, setConfig] = useState<AirtableConfig | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('airtable-config');
      try {
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        console.error("Erreur parsing config Airtable:", e);
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

  // console.log("useAirtableConfig est appelé, retourne :", { config, updateConfig, clearConfig }); // Log pour voir si le hook est appelé et ce qu'il retourne
  return { config, updateConfig, clearConfig };
};

export const useAirtableData = (tableName: string, options?: { enabled?: boolean }) => {
  const hookConfigResult = useAirtableConfig();
  if (!hookConfigResult) { // Vérification ajoutée
    console.error(`useAirtableConfig a retourné undefined dans useAirtableData pour la table ${tableName}`);
    throw new Error(`Erreur interne: useAirtableConfig n'a pas retourné de valeur pour la table ${tableName}.`);
  }
  const { config } = hookConfigResult;
  const queryKey = ['airtable', tableName, config?.baseId, config?.apiKey];

  return useQuery<AirtableResponse, Error>({
    queryKey,
    queryFn: async () => {
      if (!config || !config.apiKey || !config.baseId ) { 
        throw new Error('Configuration Airtable (apiKey ou baseId) manquante pour la table ' + tableName);
      }
      return airtableService.fetchRecords({ ...config, tableName });
    },
    enabled: !!config && !!config.apiKey && !!config.baseId && (options?.enabled !== undefined ? options.enabled : true),
    staleTime: 5 * 60 * 1000, 
    refetchInterval: 30 * 1000, 
  });
};

export type MappedClientData = Omit<Client, 'id' | 'createdTime' | 'client' | 'commandesR' | 'evenementsR' | 'photoClient' | 'newsletterActualites'> & { 
  id?: string;
  newsletterPreference?: string;
  photoClientUrl?: string;
  firebaseUID?: string;
};

export const useClientByFirebaseUID = (firebaseUID?: string) => {
  // ... (Code identique à 14:36 PM, mais s'assure que useAirtableConfig est bien appelé)
  const hookConfigResult = useAirtableConfig();
  if (!hookConfigResult) {
    console.error("useAirtableConfig a retourné undefined dans useClientByFirebaseUID");
    throw new Error("Erreur interne: useAirtableConfig n'a pas retourné de valeur.");
  }
  const { config } = hookConfigResult;

  const { data: allClientsData, isLoading, error, refetch } = useAirtableData('Client DB', { enabled: !!firebaseUID && !!config });
  const [clientData, setClientData] = useState<MappedClientData | undefined>(undefined);
  const [airtableRecordId, setAirtableRecordId] = useState<string | undefined>(undefined);
  const [isFetchingClient, setIsFetchingClient] = useState(true);

  useEffect(() => {
    setIsFetchingClient(true);
    const findClient = () => {
      if (allClientsData && firebaseUID) {
        const record = allClientsData.records.find((r) => r.fields.FirebaseUID === firebaseUID);
        if (record) {
          setAirtableRecordId(record.id);
          setClientData({
            id: record.id,
            nom: record.fields.Nom || '',
            prenom: record.fields.Prénom || record.fields.Prenom || '',
            preferenceClient: record.fields['Préférence client'],
            numeroTelephone: record.fields['Numéro de téléphone'],
            email: record.fields['e-mail'] || record.fields.email || '',
            adresseNumeroRue: record.fields['Adresse (Numéro et rue)'],
            codePostal: record.fields['Code Postal'],
            ville: record.fields.Ville,
            commentConnuChanthana: record.fields['Comment avez-vous connu ChanthanaThaiCook ?'] || [],
            newsletterPreference: record.fields['Souhaitez-vous recevoir les actualités et offres par e-mail?'] || 'non',
            dateNaissance: record.fields['Date de naissance'],
            firebaseUID: record.fields.FirebaseUID,
            photoClientUrl: record.fields['Photo Client']?.[0]?.url || undefined,
          });
        } else { setClientData(undefined); setAirtableRecordId(undefined); }
      } else if (!firebaseUID) { setClientData(undefined); setAirtableRecordId(undefined); }
      setIsFetchingClient(false);
    };
    if(firebaseUID && config && !isLoading) { findClient(); }
    else if (!firebaseUID || !config) { setIsFetchingClient(false); setClientData(undefined); setAirtableRecordId(undefined); }
    else if (isLoading) { setIsFetchingClient(true); }
  }, [allClientsData, firebaseUID, isLoading, config]);

  const refetchClient = () => { if (firebaseUID && config) refetch(); };
  return { client: clientData, airtableRecordId, isLoading: isFetchingClient, error, refetchClient };
};

export const useClients = () => { /* ... (Code identique) ... */ };
export const usePlats = () => { /* ... (Code identique) ... */ };
export const useCommandes = () => { /* ... (Code identique) ... */ };
export const useEvenements = () => { /* ... (Code identique) ... */ };

export type ClientInputData = { /* ... (Code identique) ... */ };

export const useCreateClient = () => {
  const hookConfigResult = useAirtableConfig(); // Vérification
  if (!hookConfigResult) {
    console.error("useAirtableConfig a retourné undefined dans useCreateClient");
    throw new Error("Erreur interne: useAirtableConfig n'a pas retourné de valeur.");
  }
  const { config } = hookConfigResult;
  const queryClient = useQueryClient();

  return useMutation<AirtableRecord, Error, ClientInputData>({
    mutationFn: async (clientData) => {
      if (!config) throw new Error('Configuration Airtable manquante DANS mutationFn de useCreateClient');
      const fields: Record<string, any> = { /* ... (Identique, avec les noms de champs corrigés) ... */ };
      Object.keys(fields).forEach(key => { /* ... (nettoyage identique) ... */ });
      console.log('DONNÉES POUR CRÉATION CLIENT AIRTABLE (useCreateClient):', JSON.stringify(fields, null, 2));
      return airtableService.createRecord({ ...config, tableName: 'Client DB' }, fields);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB'] }); },
    onError: (error: Error) => { console.error('Erreur dans useCreateClient:', error); throw error; }
  });
};

export const useUpdateClient = () => {
  const hookConfigResult = useAirtableConfig(); // Vérification
  if (!hookConfigResult) {
    console.error("useAirtableConfig a retourné undefined dans useUpdateClient");
    throw new Error("Erreur interne: useAirtableConfig n'a pas retourné de valeur.");
  }
  const { config } = hookConfigResult;
  const queryClient = useQueryClient();
  return useMutation<AirtableRecord, Error, { recordId: string; clientData: Partial<ClientInputData> }>({
    mutationFn: async ({ recordId, clientData }) => {
      if (!config) throw new Error('Configuration Airtable manquante DANS mutationFn de useUpdateClient');
      const fieldsToUpdate: Record<string, any> = { /* ... (Mappage explicite identique) ... */ };
      Object.keys(fieldsToUpdate).forEach(key => { /* ... (nettoyage identique) ... */ });
      console.log(`DONNÉES POUR MISE À JOUR CLIENT AIRTABLE (ID: ${recordId}):`, JSON.stringify(fieldsToUpdate, null, 2));
      return airtableService.updateRecord({ ...config, tableName: 'Client DB' }, recordId, fieldsToUpdate);
    },
    onSuccess: (data, variables) => { /* ... (Identique) ... */ },
    onError: (error: Error) => { console.error('Erreur dans useUpdateClient:', error); throw error;}
  });
};

export const useCreateCommande = () => { /* ... (Code identique, mais assure-toi que l'appel à useAirtableConfig est correct si 'config' est utilisé) ... */ };
export const useCreateEvenement = () => { /* ... (Code identique, mais assure-toi que l'appel à useAirtableConfig est correct si 'config' est utilisé) ... */ };
export const useAirtableAnalytics = () => { /* ... (Code identique, mais assure-toi que l'appel à useAirtableConfig est correct si 'config' est utilisé) ... */ };
