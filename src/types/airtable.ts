
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

// Table 1: Client DB - Structure exacte selon cahier des charges
export interface Client {
  id: string;
  // Champ principal (formule): CONCATENATE({Prénom}, " ", {Nom})
  client: string;
  nom: string;
  prenom: string;
  preferenceClient?: string; // Allergies, végan, plat préféré, etc.
  numeroTelephone?: string;
  email: string;
  adresseNumeroRue?: string;
  codePostal?: number;
  ville?: string;
  commentConnuChanthana?: string[]; // Liste déroulante à choix multiples
  newsletterActualites?: boolean; // Checkbox
  dateNaissance?: string;
  photoClient?: string; // Pièce jointe
  // Champs de relation (apparaîtront automatiquement)
  commandesR?: string[]; // Lien vers Commandes DB
  evenementsR?: string[]; // Lien vers Événements DB
  createdTime: string;
}

// Table 2: Plats DB - Structure exacte selon cahier des charges
export interface Plat {
  id: string;
  plat: string; // Champ principal
  description?: string;
  prix?: number; // Type Nombre avec devise €
  prixVu?: string; // Formule d'affichage formaté
  // Disponibilité par jour (Liste déroulante: "oui"/"non")
  lundiDispo?: 'oui' | 'non';
  mardiDispo?: 'oui' | 'non';
  mercrediDispo?: 'oui' | 'non';
  jeudiDispo?: 'oui' | 'non';
  vendrediDispo?: 'oui' | 'non';
  samediDispo?: 'oui' | 'non';
  dimancheDispo?: 'oui' | 'non';
  scoreDisponibilite?: number; // Formule de comptage
  photoDuPlat?: string; // Pièce jointe
  // Champs de relation
  passageCommandeR?: string[];
  menusEvenementielsR?: string[];
  evenementsR?: string[];
  createdTime: string;
}

// Table 3: Commandes DB - Structure exacte selon cahier des charges
export interface Commande {
  id: string;
  nCommande?: string; // Formule: CONCATENATE("CMD : ", {compteur commande})
  compteurCommande?: number; // Numéro automatique
  clientR?: string; // Lien vers Client DB (un seul client)
  dateHeureRetraitSouhaitees?: string; // Date avec heure
  datePriseCommande?: string; // Date de création automatique
  statutCommande?: 'En attente de confirmation' | 'Confirmée' | 'En préparation' | 'Prête à récupérer' | 'Récupérée' | 'Annulée';
  passageCommandeR?: string[]; // Lien vers Passage Commande DB (plusieurs lignes)
  demandeSpecialCommande?: string;
  statutPaiement?: 'En attente sur place' | 'Payé sur place' | 'Payé en ligne (futur)' | 'Non payé';
  totalCommande?: number; // Rollup SUM depuis Passage Commande DB
  totalCommandeVu?: string; // Formule d'affichage formaté
  notesInternes?: string;
  createdTime: string;
}

// Table 4: Passage Commande DB - Structure exacte selon cahier des charges
export interface PassageCommande {
  id: string;
  nPassageCommande?: string; // Formule avec Client + Commande + Plat
  clientCommandeR?: string; // Lookup depuis Commande R -> Client R
  commandeR?: string; // Lien vers Commandes DB
  platR?: string; // Lien vers Plats DB
  quantitePlatCommande?: number;
  prixDuPlat?: number; // Lookup depuis Plat R -> Prix
  prixDuPlatVue?: string; // Formule d'affichage formaté
  sousTotalPlatCommande?: number; // Formule: quantité * prix
  sousTotalPlatCommandeVue?: string; // Formule d'affichage formaté
  createdTime: string;
}

// Table 5: Événements DB - Structure exacte selon cahier des charges
export interface Evenement {
  id: string;
  nEvenement?: string; // Formule: CONCATENATE("EVT-", {ID Autonum Événement})
  idAutonumEvenement?: number; // Numéro automatique masqué
  nomEvenement?: string;
  contactClientR?: string; // Lien vers Client DB
  dateEvenement?: string; // Date avec heure
  typeEvenement?: 'Anniversaire' | 'Repas d\'entreprise' | 'Fête de famille' | 'Cocktail dînatoire' | 'Buffet traiteur' | 'Autre';
  nombrePersonnes?: number;
  budgetClient?: number;
  demandesSpecialesEvenement?: string;
  platsPreSelectionnesR?: string[]; // Lien vers Plats DB (plusieurs)
  menuFinalConvenu?: string;
  statutEvenement?: 'Demande initiale' | 'Menu en discussion' | 'Devis à faire' | 'Devis envoyé' | 'Confirmé / Acompte en attente' | 'Confirmé / Acompte reçu' | 'En préparation' | 'Réalisé' | 'Facturé / Solde à payer' | 'Payé intégralement' | 'Annulé';
  prixTotalDevise?: number;
  lienDevisPDF?: string;
  acompteDemande?: number;
  acompteRecu?: number;
  dateAcompteRecu?: string;
  statutAcompte?: 'Non applicable' | 'Demandé' | 'Reçu';
  notesInternesEvenement?: string;
  menuTypeSuggereR?: string; // Lien vers Menus Événementiels Types DB
  createdTime: string;
}

// Table 6: Menus Événementiels Types DB - Structure exacte selon cahier des charges
export interface MenuEvenementielType {
  id: string;
  nomMenuType: string; // Champ principal
  description?: string;
  suggestionPlatsInclusR?: string[]; // Lien vers Plats DB (plusieurs)
  adaptePourTypesEvenement?: string[]; // Liste déroulante à choix multiples
  prixIndicatifParPersonne?: number;
  nombreConvivesSuggere?: string; // Ex: "10-20 pers."
  photoAmbianceMenu?: string; // Pièce jointe
  notesInternesMenuType?: string;
  evenementsAssociesR?: string[]; // Lien vers Événements DB
  createdTime: string;
}

// Types pour analytics et évolutions futures
export interface Analytics {
  totalCommandes: number;
  commandesAujourdhui: number;
  totalClients: number;
  totalEvenements: number;
  chiffreAffairesMois: number;
  timestamp: string;
}

// Types pour la sécurité et l'authentification (Firebase)
export interface UtilisateurApp {
  uid: string;
  email: string;
  role: 'client' | 'admin';
  clientAirtableId?: string; // Lien vers l'enregistrement Client DB
  dernierAcces: string;
}

// Types pour les workflows n8n
export interface WebhookResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface N8nWorkflowTrigger {
  workflowName: string;
  data: Record<string, any>;
  timestamp: string;
  source: 'profil' | 'commande' | 'evenement' | 'admin';
}
