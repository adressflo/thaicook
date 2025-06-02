// src/hooks/useAirtable.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { airtableService } from '@/services/airtableService';
import {
  AirtableConfig,
  Client,
  Plat,
  Commande,
  PassageCommande,
  Evenement,
  AirtableRecord,
  AirtableResponse
} from '@/types/airtable';

// --- Configuration Hook ---
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

// --- Generic Data Fetching Hook ---
export const useAirtableData = (tableName: string, options?: { enabled?: boolean }) => {
  const { config } = useAirtableConfig();
  const queryKey = ['airtable', tableName, config?.baseId, config?.apiKey];

  const queryResult = useQuery<AirtableResponse, Error, AirtableResponse, unknown[]>({ // Type pour queryKey
    queryKey,
    queryFn: async () => {
      if (!config || !config.apiKey || !config.baseId) {
        console.warn(`Tentative d'appel à fetchRecords pour ${tableName} sans config valide.`);
        return { records: [] };
      }
      return airtableService.fetchRecords({ ...config, tableName });
    },
    enabled: !!(config && config.apiKey && config.baseId && (options?.enabled !== undefined ? options.enabled : true)),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};

// --- Client Hooks ---
export type MappedClientData = Omit<Client, 'id' | 'createdTime' | 'client' | 'commandesR' | 'evenementsR' | 'photoClient' | 'newsletterActualites'> & {
  id?: string;
  newsletterPreference?: string;
  photoClientUrl?: string;
  firebaseUID?: string;
};

export type ClientInputData = {
  nom: string;
  prenom: string;
  preferenceClient?: string;
  numeroTelephone?: string;
  email: string;
  adresseNumeroRue?: string;
  codePostal?: number;
  ville?: string;
  commentConnuChanthana?: string[];
  newsletterOptIn?: 'Oui, j\'accepte' | 'non';
  dateNaissance?: string;
  firebaseUID: string;
  'Photo Client'?: any[];
};

export const useClientByFirebaseUID = (firebaseUID?: string) => {
  const { config } = useAirtableConfig();
  const { data: allClientsData, isLoading: isLoadingAllClients, error: fetchError, refetch } =
    useAirtableData('Client DB', { enabled: !!firebaseUID && !!config });

  const [clientData, setClientData] = useState<MappedClientData | undefined>(undefined);
  const [airtableRecordId, setAirtableRecordId] = useState<string | undefined>(undefined);
  const [isLoadingClient, setIsLoadingClient] = useState(true);

  useEffect(() => {
    setIsLoadingClient(true);
    if (firebaseUID && config) {
      if (!isLoadingAllClients && allClientsData) {
        const record = allClientsData.records.find((r) => r.fields.FirebaseUID === firebaseUID);
        if (record) {
          setAirtableRecordId(record.id);
          setClientData({
            id: record.id,
            nom: record.fields.Nom || '',
            prenom: record.fields.Prénom || '',
            preferenceClient: record.fields['Préférence client'],
            numeroTelephone: record.fields['Numéro de téléphone'],
            email: record.fields['e-mail'] || '',
            adresseNumeroRue: record.fields['Adresse (Numéro et rue)'],
            codePostal: record.fields['Code Postal'],
            ville: record.fields.Ville,
            commentConnuChanthana: record.fields['Comment avez-vous connu ChanthanaThaiCook ?'] || [],
            newsletterPreference: record.fields['Souhaitez-vous recevoir les actualités et offres par e-mail ?'] || 'non',
            dateNaissance: record.fields['Date de naissance'],
            firebaseUID: record.fields.FirebaseUID,
            photoClientUrl: record.fields['Photo Client']?.[0]?.url || undefined,
          });
        } else {
          setClientData(undefined);
          setAirtableRecordId(undefined);
        }
        setIsLoadingClient(false);
      } else if (isLoadingAllClients) {
        setIsLoadingClient(true);
      } else {
        setIsLoadingClient(false);
        setClientData(undefined);
        setAirtableRecordId(undefined);
      }
    } else {
      setIsLoadingClient(false);
      setClientData(undefined);
      setAirtableRecordId(undefined);
    }
  }, [allClientsData, firebaseUID, isLoadingAllClients, config]);

  const refetchClient = () => {
    if (firebaseUID && config) refetch();
  };

  return { client: clientData, airtableRecordId, isLoading: isLoadingClient, error: fetchError, refetchClient };
};

export const useClients = () => {
  const { data, isLoading, error, refetch } = useAirtableData('Client DB');
  const clients: Client[] = data?.records.map(record => ({
    id: record.id,
    client: record.fields.Client || `${record.fields.Prénom || ''} ${record.fields.Nom || ''}`,
    nom: record.fields.Nom || '',
    prenom: record.fields.Prénom || '',
    preferenceClient: record.fields['Préférence client'],
    numeroTelephone: record.fields['Numéro de téléphone'],
    email: record.fields['e-mail'] || '',
    adresseNumeroRue: record.fields['Adresse (Numéro et rue)'],
    codePostal: record.fields['Code Postal'],
    ville: record.fields.Ville,
    commentConnuChanthana: record.fields['Comment avez-vous connu ChanthanaThaiCook ?'],
    newsletterActualites: record.fields['Souhaitez-vous recevoir les actualités et offres par e-mail ?'] === "Oui, j'accepte",
    dateNaissance: record.fields['Date de naissance'],
    photoClient: record.fields['Photo Client']?.[0]?.url,
    firebaseUID: record.fields.FirebaseUID,
    commandesR: record.fields['Commandes R'],
    evenementsR: record.fields['Événements R'],
    createdTime: record.createdTime,
  })) || [];
  return { clients, isLoading, error, refetch };
};

const createClientMutationFn: UseMutationOptions<AirtableRecord, Error, ClientInputData>['mutationFn'] = 
  async (clientData) => {
    // Note: getConfigHook n'est pas disponible ici, il faut le passer ou le redéfinir.
    // Pour simplifier, nous allons le chercher à l'intérieur comme avant, mais ce n'est pas idéal pour la pureté de cette fonction.
    // Idéalement, la config serait passée en argument ou le hook `useAirtableConfig` serait appelé plus haut.
    const localConfig = JSON.parse(localStorage.getItem('airtable-config') || 'null') as AirtableConfig | null;
    if (!localConfig || !localConfig.baseId || !localConfig.apiKey) {
      throw new Error('Configuration Airtable invalide (createClientMutationFn)');
    }

    const fields: Record<string, any> = {
      'Nom': clientData.nom, 'Prénom': clientData.prenom,
      'Préférence client': clientData.preferenceClient, 'Numéro de téléphone': clientData.numeroTelephone,
      'e-mail': clientData.email, 'Adresse (Numéro et rue)': clientData.adresseNumeroRue,
      'Code Postal': clientData.codePostal, 'Ville': clientData.ville,
      'Comment avez-vous connu ChanthanaThaiCook ?': clientData.commentConnuChanthana,
      'Souhaitez-vous recevoir les actualités et offres par e-mail ?': clientData.newsletterOptIn,
      'Date de naissance': clientData.dateNaissance, 'FirebaseUID': clientData.firebaseUID,
    };
    Object.keys(fields).forEach(key => { const v = fields[key]; if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0)) delete fields[key]; });
    return airtableService.createRecord({ ...localConfig, tableName: 'Client DB' }, fields);
};

export const useCreateClient = () => {
  const getConfigHook = useAirtableConfig(); // Utilisé pour onSuccess
  const queryClient = useQueryClient();
  return useMutation<AirtableRecord, Error, ClientInputData>({
    mutationFn: createClientMutationFn, // Utilisation de la fonction séparée
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB', getConfigHook.config?.baseId, getConfigHook.config?.apiKey] });
    },
    onError: (error: Error) => {
      console.error('Erreur dans useCreateClient:', error);
      throw error; // Rethrow pour que le composant puisse le gérer
    }
  });
};

const updateClientMutationFn: UseMutationOptions<AirtableRecord, Error, { recordId: string; clientData: Partial<ClientInputData> }>['mutationFn'] =
 async ({ recordId, clientData }) => {
    const localConfig = JSON.parse(localStorage.getItem('airtable-config') || 'null') as AirtableConfig | null;
    if (!localConfig || !localConfig.baseId || !localConfig.apiKey) {
        throw new Error('Configuration Airtable invalide (updateClientMutationFn)');
    }
    const fieldsToUpdate: Record<string, any> = {};
    if (clientData.nom !== undefined) fieldsToUpdate['Nom'] = clientData.nom;
    if (clientData.prenom !== undefined) fieldsToUpdate['Prénom'] = clientData.prenom;
    if (clientData.preferenceClient !== undefined) fieldsToUpdate['Préférence client'] = clientData.preferenceClient;
    if (clientData.numeroTelephone !== undefined) fieldsToUpdate['Numéro de téléphone'] = clientData.numeroTelephone;
    if (clientData.email !== undefined) fieldsToUpdate['e-mail'] = clientData.email;
    if (clientData.adresseNumeroRue !== undefined) fieldsToUpdate['Adresse (Numéro et rue)'] = clientData.adresseNumeroRue;
    if (clientData.codePostal !== undefined) fieldsToUpdate['Code Postal'] = clientData.codePostal;
    if (clientData.ville !== undefined) fieldsToUpdate['Ville'] = clientData.ville;
    if (clientData.commentConnuChanthana !== undefined) fieldsToUpdate['Comment avez-vous connu ChanthanaThaiCook ?'] = clientData.commentConnuChanthana;
    if (clientData.newsletterOptIn !== undefined) fieldsToUpdate['Souhaitez-vous recevoir les actualités et offres par e-mail ?'] = clientData.newsletterOptIn;
    if (clientData.dateNaissance !== undefined) fieldsToUpdate['Date de naissance'] = clientData.dateNaissance;
    
    Object.keys(clientData).forEach(key => {
      const typedKey = key as keyof Partial<ClientInputData>;
      if (clientData[typedKey] === null) {
        if (typedKey === 'nom') fieldsToUpdate['Nom'] = null;
        // ... autres champs à nullifier
      }
    });
    return airtableService.updateRecord({ ...localConfig, tableName: 'Client DB' }, recordId, fieldsToUpdate);
};

export const useUpdateClient = () => {
  const getConfigHook = useAirtableConfig();
  const queryClient = useQueryClient();
  return useMutation<AirtableRecord, Error, { recordId: string; clientData: Partial<ClientInputData> }>({
    mutationFn: updateClientMutationFn,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB', getConfigHook.config?.baseId, getConfigHook.config?.apiKey] });
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB', variables.recordId, getConfigHook.config?.baseId, getConfigHook.config?.apiKey] });
    },
    onError: (error: Error) => {
      console.error('Erreur dans useUpdateClient:', error);
      throw error;
    }
  });
};

// --- Plats Hooks ---
export const usePlats = () => {
  const { data, isLoading, error, refetch } = useAirtableData('Plats DB');
  const plats: Plat[] = data?.records.map(record => ({
    id: record.id, plat: record.fields.Plat || '', description: record.fields.Description,
    prix: parseFloat(record.fields.Prix || 0), prixVu: record.fields['Prix vu'],
    lundiDispo: record.fields.lundi_dispo as 'oui' | 'non', mardiDispo: record.fields.mardi_dispo as 'oui' | 'non',
    mercrediDispo: record.fields.mercredi_dispo as 'oui' | 'non', jeudiDispo: record.fields.jeudi_dispo as 'oui' | 'non',
    vendrediDispo: record.fields.vendredi_dispo as 'oui' | 'non', samediDispo: record.fields.samedi_dispo as 'oui' | 'non',
    dimancheDispo: record.fields.dimanche_dispo as 'oui' | 'non',
    scoreDisponibilite: record.fields['Score Disponibilité'], photoDuPlat: record.fields['Photo du Plat']?.[0]?.url,
    passageCommandeR: record.fields['passage commande R'], menusEvenementielsR: record.fields['Menus Événementiels R'],
    evenementsR: record.fields['Événements R'], createdTime: record.createdTime
  })) || [];
  const getPlatsDisponibles = (jour?: string) => {
    if (!jour) return plats;
    const champDispo = `${jour}Dispo` as keyof Plat;
    return plats.filter(plat => plat[champDispo] === 'oui');
  };
  return { plats, getPlatsDisponibles, isLoading, error, refetch };
};

// --- Commandes Hooks ---
export const useCommandes = () => {
  const { data, isLoading, error, refetch } = useAirtableData('Commandes DB');
  const commandes: Commande[] = data?.records.map(record => ({
    id: record.id, nCommande: record.fields['N commande'], compteurCommande: record.fields['compteur commande'],
    clientR: record.fields['Client R']?.[0], dateHeureRetraitSouhaitees: record.fields['Date et Heure de Retrait Souhaitées'],
    datePriseCommande: record.fields['Date de Prise de Commande'], statutCommande: record.fields['Statut Commande'],
    passageCommandeR: record.fields['Passage Commande R'], demandeSpecialCommande: record.fields['Demande spécial pour la commande'],
    statutPaiement: record.fields['Statut Paiement'], totalCommande: record.fields['Total Commande'],
    totalCommandeVu: record.fields['Total Commande vu'], notesInternes: record.fields['Notes Internes'],
    createdTime: record.createdTime
  })) || [];
  return { commandes, isLoading, error, refetch };
};

export interface PlatPanier {
  id: string; nom: string; prix: number; quantite: number;
}
export type CommandeInputData = {
  clientAirtableId: string; panier: PlatPanier[]; dateHeureRetrait: string; demandesSpeciales?: string;
};

const createCommandeMutationFn: UseMutationOptions<AirtableRecord, Error, CommandeInputData>['mutationFn'] =
  async (commandeData) => {
    const localConfig = JSON.parse(localStorage.getItem('airtable-config') || 'null') as AirtableConfig | null;
    if (!localConfig || !localConfig.baseId || !localConfig.apiKey) {
      throw new Error('Configuration Airtable invalide (createCommandeMutationFn)');
    }
    const commandeFields: Record<string, any> = {
      'Client R': [commandeData.clientAirtableId],
      'Date et Heure de Retrait Souhaitées': commandeData.dateHeureRetrait,
      'Demande spécial pour la commande': commandeData.demandesSpeciales,
      'Statut Commande': 'En attente de confirmation', 'Statut Paiement': 'En attente sur place',
    };
    Object.keys(commandeFields).forEach(key => commandeFields[key] === undefined && delete commandeFields[key]);
    const nouvelleCommande = await airtableService.createRecord({ ...localConfig, tableName: 'Commandes DB' }, commandeFields);
    if (nouvelleCommande && nouvelleCommande.id && commandeData.panier) {
      const passageCommandePromises = commandeData.panier.map(item => {
        const passageFields: Record<string, any> = {
          'Commande R': [nouvelleCommande.id], 'Plat R': [item.id], 'Quantité Plat Commandé': item.quantite,
        };
        return airtableService.createRecord({ ...localConfig, tableName: 'Passage Commande DB' }, passageFields);
      });
      await Promise.all(passageCommandePromises);
    }
    return nouvelleCommande;
};

export const useCreateCommande = () => {
  const getConfigHook = useAirtableConfig();
  const queryClient = useQueryClient();
  return useMutation<AirtableRecord, Error, CommandeInputData>({
    mutationFn: createCommandeMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Commandes DB', getConfigHook.config?.baseId, getConfigHook.config?.apiKey] });
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Passage Commande DB', getConfigHook.config?.baseId, getConfigHook.config?.apiKey] });
    },
    onError: (error: Error) => {
      console.error('Erreur dans useCreateCommande:', error);
      throw error;
    }
  });
};

// --- Événements Hooks ---
export const useEvenements = () => {
  const { data, isLoading, error, refetch } = useAirtableData('Événements DB');
  const evenements: Evenement[] = data?.records.map(record => ({
    id: record.id, nEvenement: record.fields['N Événement'], idAutonumEvenement: record.fields['ID Autonum Événement'],
    nomEvenement: record.fields['Nom Événement'], contactClientR: record.fields['Contact Client R']?.[0],
    dateEvenement: record.fields['Date Événement'], typeEvenement: record.fields['Type d\'Événement'],
    nombrePersonnes: record.fields['Nombre de personnes'], budgetClient: record.fields['Budget Client'],
    demandesSpecialesEvenement: record.fields['Demandes Spéciales Événement'],
    platsPreSelectionnesR: record.fields['Plats Pré-sélectionnés (par client) R'],
    menuFinalConvenu: record.fields['Menu Final Convenu'], statutEvenement: record.fields['Statut Événement'],
    prixTotalDevise: record.fields['Prix Total Devisé'], lienDevisPDF: record.fields['Lien Devis PDF'],
    acompteDemande: record.fields['Acompte Demandé'], acompteRecu: record.fields['Acompte Reçu'],
    dateAcompteRecu: record.fields['Date Acompte Reçu'], statutAcompte: record.fields['Statut Acompte'],
    notesInternesEvenement: record.fields['Notes Internes Événement'],
    menuTypeSuggereR: record.fields['Menu Type Suggéré (interne) R']?.[0], createdTime: record.createdTime,
  })) || [];
  return { evenements, isLoading, error, refetch };
};

export type EvenementInputData = {
  nomEvenement: string; contactEmail: string; dateEvenement: string; typeEvenement: string;
  nombrePersonnes: number; budgetClient?: number; demandesSpecialesEvenement?: string;
  platsPreSelectionnesR?: string[];
};

// Séparation de la mutationFn pour la clarté et pour éviter les problèmes de scope avec les hooks à l'intérieur.
const createEvenementMutationFn: UseMutationOptions<AirtableRecord, Error, EvenementInputData>['mutationFn'] =
  async (evenementData: EvenementInputData) => {
    // IMPORTANT: `useAirtableConfig` et `useAirtableData` ne peuvent pas être appelés ici directement
    // car ce n'est pas un hook React. La config et les clientsData doivent être obtenus autrement ou passés.
    // Pour cette version, nous allons chercher la config depuis localStorage et nous ne pouvons pas utiliser
    // clientsData directement ici sans le passer en argument ou le récupérer de manière non-hook.
    // Cela signifie que la recherche de client par email DANS CETTE FONCTION est problématique.
    // La logique de recherche de client devrait idéalement être faite AVANT d'appeler mutateAsync,
    // et l'ID client devrait être passé dans EvenementInputData.

    // Temporairement, on récupère la config du localStorage. Ce n'est PAS idéal.
    const localConfig = JSON.parse(localStorage.getItem('airtable-config') || 'null') as AirtableConfig | null;
    if (!localConfig || !localConfig.baseId || !localConfig.apiKey) {
        throw new Error('Configuration Airtable invalide (createEvenementMutationFn)');
    }
    // La recherche de clientsData ici n'est pas possible de manière réactive.
    // On va donc simplifier et supposer que le composant a déjà fourni un ID client si possible,
    // ou alors le champ 'Contact Client R' ne sera pas rempli si on ne trouve pas le client
    // par une autre méthode (par exemple, un appel API séparé pour chercher par email).

    // Solution simplifiée: Si vous ne pouvez pas passer l'ID client, vous ne pourrez pas le lier ici facilement
    // sans rendre cette fonction plus complexe ou dépendante d'un état externe.
    // Pour l'instant, on va juste construire les champs sans la recherche client complexe ici.
    // Le hook useCreateEvenement (ci-dessous) essaiera de gérer cela.


    const fields: Record<string, any> = {
      'Nom Événement': evenementData.nomEvenement, 'Date Événement': evenementData.dateEvenement,
      'Type d\'Événement': evenementData.typeEvenement, 'Nombre de personnes': evenementData.nombrePersonnes,
      'Budget Client': evenementData.budgetClient,
      'Demandes Spéciales Événement': evenementData.demandesSpecialesEvenement,
      'Plats Pré-sélectionnés (par client) R': evenementData.platsPreSelectionnesR,
      'Statut Événement': 'Demande initiale',
    };
    // Le champ 'Contact Client R' sera ajouté dans le hook useCreateEvenement ci-dessous.

    Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key]);
    return airtableService.createRecord({ ...localConfig, tableName: 'Événements DB' }, fields);
};


export const useCreateEvenement = () => {
  const getConfigHook = useAirtableConfig(); // Pour config et onSuccess
  const queryClient = useQueryClient();
  const { data: clientsData, isLoading: isLoadingClients } = useAirtableData('Client DB', {
    enabled: !!getConfigHook.config?.apiKey && !!getConfigHook.config?.baseId, // Activer seulement si la config est chargée
  });

  const mutationOptions: UseMutationOptions<AirtableRecord, Error, EvenementInputData, unknown> = {
    mutationFn: async (evenementData: EvenementInputData) => {
      const { config } = getConfigHook;
      if (!config || !config.baseId || !config.apiKey) {
        throw new Error('Configuration Airtable invalide ou manquante (useCreateEvenement)');
      }

      if (isLoadingClients && evenementData.contactEmail) {
         // Optionnel: attendre la fin du chargement des clients si une recherche par email est nécessaire
         // Ceci pourrait être géré par une désactivation du bouton de soumission dans l'UI
         // ou en attendant ici avec une promesse, mais cela peut complexifier.
         console.warn("Les données clients sont en cours de chargement, la recherche d'email peut être incomplète.");
         // Pour cet exemple, on continue, mais dans un cas réel, il faudrait une meilleure gestion.
      }

      let contactClientId: string | undefined = undefined;
      if (evenementData.contactEmail && clientsData?.records) {
        const clientRecord = clientsData.records.find(
          (record) => record.fields['e-mail'] === evenementData.contactEmail
        );
        if (clientRecord) {
          contactClientId = clientRecord.id;
        } else {
          console.warn(`Client avec l'email ${evenementData.contactEmail} non trouvé pour l'événement. L'événement sera créé sans lien client si l'ID n'est pas fourni autrement.`);
        }
      }

      // Utilise la fonction séparée createEvenementMutationFn mais enrichit les `fields` avec `contactClientId`
      const fields: Record<string, any> = {
        'Nom Événement': evenementData.nomEvenement, 'Date Événement': evenementData.dateEvenement,
        'Type d\'Événement': evenementData.typeEvenement, 'Nombre de personnes': evenementData.nombrePersonnes,
        'Budget Client': evenementData.budgetClient,
        'Demandes Spéciales Événement': evenementData.demandesSpecialesEvenement,
        'Plats Pré-sélectionnés (par client) R': evenementData.platsPreSelectionnesR,
        'Statut Événement': 'Demande initiale',
      };
      if (contactClientId) {
        fields['Contact Client R'] = [contactClientId];
      }
      Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key]);
      return airtableService.createRecord({ ...config, tableName: 'Événements DB' }, fields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Événements DB', getConfigHook.config?.baseId, getConfigHook.config?.apiKey] });
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Événements DB'] });
    },
    onError: (error: Error) => {
      console.error('Erreur dans useCreateEvenement:', error);
      throw error;
    }
  };
  
  return useMutation(mutationOptions);
};


// --- Analytics Hook (Placeholder) ---
export const useAirtableAnalytics = () => {
  const { isLoading: commandesLoading } = useCommandes();
  const { isLoading: evenementsLoading } = useEvenements();
  return { isLoading: commandesLoading || evenementsLoading };
};