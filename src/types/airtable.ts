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

export interface Client {
  id: string;
  client?: string;
  nom: string;
  prenom: string;
  preferenceClient?: string;
  numeroTelephone?: string;
  email: string;
  adresseNumeroRue?: string;
  codePostal?: number;
  ville?: string;
  commentConnuChanthana?: string[];
  newsletterActualites?: boolean;
  dateNaissance?: string;
  photoClient?: string;
  commandesR?: string[];
  evenementsR?: string[];
  FirebaseUID?: string;
  Role?: 'client' | 'admin'; // CORRECTION: Standardisé en 'Role' sans accent
  createdTime: string;
}

export interface Plat {
  id: string;
  plat: string;
  description?: string;
  prix?: number;
  prixVu?: string;
  lundiDispo?: 'oui' | 'non';
  mardiDispo?: 'oui' | 'non';
  mercrediDispo?: 'oui' | 'non';
  jeudiDispo?: 'oui' | 'non';
  vendrediDispo?: 'oui' | 'non';
  samediDispo?: 'oui' | 'non';
  dimancheDispo?: 'oui' | 'non';
  scoreDisponibilite?: number;
  photoDuPlat?: string;
  passageCommandeR?: string[];
  menusEvenementielsR?: string[];
  evenementsR?: string[];
  createdTime: string;
}

export interface Commande {
  id: string;
  nCommande?: string;
  compteurCommande?: number;
  clientR?: string[];
  dateHeureRetraitSouhaitees?: string;
  datePriseCommande?: string;
  statutCommande?: 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée';
  passageCommandeR?: string[];
  demandeSpecialCommande?: string;
  statutPaiement?: 'En attente sur place' | 'Payé sur place' | 'Payé en ligne (futur)' | 'Non payé';
  totalCommande?: number;
  totalCommandeVu?: string;
  notesInternes?: string;
  createdTime: string;
}

export interface PassageCommande {
  id: string;
  nPassageCommande?: string;
  clientCommandeR?: string;
  commandeR?: string[];
  platR?: string[];
  quantitePlatCommande?: number;
  prixDuPlat?: number;
  prixDuPlatVue?: string;
  sousTotalPlatCommande?: number;
  sousTotalPlatCommandeVue?: string;
  createdTime: string;
}

export interface Evenement {
  id: string;
  nEvenement?: string;
  idAutonumEvenement?: number;
  nomEvenement?: string;
  contactClientR?: string;
  dateEvenement?: string;
  typeEvenement?: 'Anniversaire' | 'Repas d\'entreprise' | 'Fête de famille' | 'Cocktail dînatoire' | 'Buffet traiteur' | 'Autre';
  nombrePersonnes?: number;
  budgetClient?: number;
  demandesSpecialesEvenement?: string;
  platsPreSelectionnesR?: string[];
  menuFinalConvenu?: string;
  statutEvenement?: 'Demande initiale' | 'Menu en discussion' | 'Devis à faire' | 'Devis envoyé' | 'Confirmé / Acompte en attente' | 'Confirmé / Acompte reçu' | 'En préparation' | 'Réalisé' | 'Facturé / Solde à payer' | 'Payé intégralement' | 'Annulé';
  prixTotalDevise?: number;
  lienDevisPDF?: string;
  acompteDemande?: number;
  acompteRecu?: number;
  dateAcompteRecu?: string;
  statutAcompte?: 'Non applicable' | 'Demandé' | 'Reçu';
  notesInternesEvenement?: string;
  menuTypeSuggereR?: string;
  createdTime: string;
}
