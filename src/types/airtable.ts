// src/types/airtable.ts

export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

// --- INTERFACES DE DONNÉES (ce que l'on reçoit d'Airtable) ---

export interface Client {
  id: string;
  createdTime: string;
  Client?: string;
  Nom?: string;
  Prénom?: string;
  'Préférence client'?: string;
  'Numéro de téléphone'?: string;
  'e-mail'?: string;
  'Adresse (numéro et rue)'?: string;
  'Code postal'?: number;
  Ville?: string;
  'Comment avez-vous connu ChanthanaThaiCook ?'?: string[];
  'Souhaitez-vous recevoir les actualités et offres par e-mail ?'?: 'Oui' | 'Non/Pas de réponse' | 'Oui, j\'accepte' | 'non';
  'Date de naissance'?: string;
  'Photo Client'?: any[];
  'Commandes R'?: string[];
  'Événements R'?: string[];
  FirebaseUID?: string;
  Role?: 'client' | 'admin';
}

export interface Plat {
  id: string;
  createdTime: string;
  Plat?: string;
  Description?: string;
  Prix?: number;
  'Prix vu'?: string;
  lundi_dispo?: 'oui' | 'non';
  mardi_dispo?: 'oui' | 'non';
  mercredi_dispo?: 'oui' | 'non';
  jeudi_dispo?: 'oui' | 'non';
  vendredi_dispo?: 'oui' | 'non';
  samedi_dispo?: 'oui' | 'non';
  dimanche_dispo?: 'oui' | 'non';
  'Photo du Plat'?: any[];
}

export interface Commande {
    id: string;
    createdTime: string;
    clientName?: string;
    'N commande'?: string;
    'Client R'?: string[];
    'Date et Heure de Retrait Souhaitées'?: string;
    'Statut Commande'?: 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée';
    'Statut Paiement'?: 'En attente sur place' | 'Payé sur place' | 'Payé en ligne (futur)' | 'Non payé';
    'Total Commande vu'?: string;
    'Notes Internes'?: string;
}

export interface Evenement {
    id: string;
    createdTime: string;
    'Nom Événement'?: string;
    'Nombre de personnes'?: number;
    'Date Événement'?: string;
    'Statut Événement'?: string;
}

export interface Ingredient {
    id: string;
    Ingrédient?: string;
    Catégorie?: string;
    Fournisseur?: string;
    Statut?: 'À acheter !' | 'En Stock';
}

// --- TYPES POUR LES FORMULAIRES (ce que l'on manipule dans le code) ---

export type ClientInputData = Partial<Omit<Client, 'id' | 'createdTime'>>;

export interface PlatPanier { 
  id: string; 
  nom: string; 
  prix: number; 
  quantite: number; 
}

export interface CommandeInputData { 
  clientAirtableId: string; 
  panier: PlatPanier[]; 
  dateHeureRetrait: string; 
  demandesSpeciales?: string; 
}

export interface CommandeUpdateData { 
  'Statut Commande'?: Commande['Statut Commande']; 
  'Statut Paiement'?: Commande['Statut Paiement']; 
  'Notes Internes'?: string; 
}

export interface EvenementInputData {
  contactEmail: string; 
  'Nom Événement'?: string; 
  'Date Événement': string; 
  'Type d\'Événement': string;
  'Nombre de personnes': number; 
  'Budget Client'?: number; 
  'Demandes Spéciales Événement'?: string; 
  'Plats Pré-sélectionnés (par client) R'?: string[];
}