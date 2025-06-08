// src/types/airtable.ts

export interface Plat {
  id: string;
  Plat: string;
  Description: string;
  Prix: number;
  'Prix vu': string;
  'Photo du Plat'?: { url: string }[];
  lundi_dispo: string;
  mercredi_dispo: string;
  vendredi_dispo: string;
  samedi_dispo: string;
}

export interface PlatPanier {
    id: string;
    nom: string;
    prix: number;
    quantite: number;
}

export interface Client {
    id: string;
    Nom: string;
    Prénom: string;
    'Préférence client'?: string;
    'Numéro de téléphone'?: string;
    'e-mail'?: string;
    'Adresse (numéro et rue)'?: string;
    'Code postal'?: number;
    Ville?: string;
    'Comment avez-vous connu ChanthanaThaiCook ?'?: string[];
    'Souhaitez-vous recevoir les actualités et offres par e-mail ?'?: 'Oui' | 'Non/Pas de réponse';
    'Date de naissance'?: string;
    'Photo Client'?: { url: string }[];
    Role: 'client' | 'admin';
    FirebaseUID: string;
}

export interface ClientInputData {
    [key: string]: any;
}

export type CommandeStatus = 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée';

export interface Commande {
    id: string;
    createdTime: string;
    'Numéro de Commande': string;
    'Date & Heure de retrait': string;
    'Statut Commande': CommandeStatus;
    'Client R': string[];
    'Total Commande': number;
    Total: number;
    FirebaseUID?: string[];
}
