import { z } from 'zod';

// ============================================
// SCHÉMAS DE VALIDATION ZOD POUR APPCHANTHANA
// ============================================

// Schéma de base pour les emails
const emailSchema = z.string().email("Email invalide");

// Schéma de base pour les téléphones français
const phoneSchema = z.string()
  .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, "Numéro de téléphone français invalide")
  .optional();

// Schéma de base pour les dates
const dateSchema = z.string()
  .refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate > new Date('1900-01-01');
  }, "Date invalide")
  .optional();

// ============================================
// VALIDATION PROFIL CLIENT
// ============================================

export const clientProfileSchema = z.object({
  firebase_uid: z.string().min(1, "UID Firebase requis"),
  nom: z.string()
    .min(1, "Nom requis")
    .max(100, "Nom trop long (max 100 caractères)")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"),
  prenom: z.string()
    .min(1, "Prénom requis") 
    .max(100, "Prénom trop long (max 100 caractères)")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets"),
  email: emailSchema,
  telephone: phoneSchema,
  adresse: z.string()
    .max(500, "Adresse trop longue (max 500 caractères)")
    .optional(),
  date_de_naissance: dateSchema,
  role: z.enum(['client', 'admin']).default('client'),
});

// Schéma pour mise à jour profil (tous champs optionnels sauf UID)
export const clientUpdateSchema = clientProfileSchema.partial().extend({
  firebase_uid: z.string().min(1, "UID Firebase requis"),
});

// ============================================
// VALIDATION ÉVÉNEMENTS
// ============================================

export const evenementSchema = z.object({
  nom_evenement: z.string()
    .min(3, "Nom événement trop court (min 3 caractères)")
    .max(200, "Nom événement trop long (max 200 caractères)"),
  date_evenement: z.string()
    .refine((date) => {
      const parsedDate = new Date(date);
      const now = new Date();
      return !isNaN(parsedDate.getTime()) && parsedDate >= now;
    }, "La date d'événement doit être dans le futur"),
  nombre_personnes: z.number()
    .int("Nombre de personnes doit être un entier")
    .min(1, "Minimum 1 personne")
    .max(500, "Maximum 500 personnes"),
  budget_approximatif: z.number()
    .min(0, "Budget ne peut être négatif")
    .max(100000, "Budget maximum 100,000€")
    .optional(),
  description_evenement: z.string()
    .max(2000, "Description trop longue (max 2000 caractères)")
    .optional(),
  lieu_evenement: z.string()
    .min(1, "Lieu requis")
    .max(300, "Lieu trop long (max 300 caractères)"),
  contact_client_r: z.string().min(1, "Contact client requis"),
  is_public: z.boolean().default(false),
  statut: z.enum(['En attente', 'Confirmé', 'Annulé']).default('En attente'),
});

// Schéma pour mise à jour événement
export const evenementUpdateSchema = evenementSchema.partial();

// ============================================
// VALIDATION COMMANDES
// ============================================

export const commandeSchema = z.object({
  client_firebase_uid: z.string().min(1, "Client requis"),
  type_livraison: z.enum(['À emporter', 'Livraison', 'Sur place']).optional(),
  date_et_heure_de_retrait_souhaitees: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true; // Optionnel
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Date de retrait invalide"),
  demande_special_pour_la_commande: z.string()
    .max(1000, "Demande spéciale trop longue (max 1000 caractères)")
    .optional(),
  adresse_specifique: z.string()
    .max(500, "Adresse trop longue (max 500 caractères)")
    .optional(),
  statut_commande: z.enum([
    'En attente de confirmation',
    'Confirmée', 
    'En préparation',
    'Prête à récupérer',
    'Récupérée',
    'Annulée'
  ]).optional().default('En attente de confirmation'),
  statut_paiement: z.enum([
    'En attente sur place',
    'Payé sur place',
    'Payé en ligne',
    'Non payé',
    'Payée'
  ]).optional().default('En attente sur place'),
});

// Schéma pour mise à jour commande
export const commandeUpdateSchema = commandeSchema.partial();

// ============================================  
// VALIDATION DÉTAILS COMMANDE
// ============================================

export const detailCommandeSchema = z.object({
  commande_r: z.number().int().positive("ID commande invalide"),
  plat_r: z.number().int().positive("ID plat invalide"), 
  quantite_plat_commande: z.number()
    .int("Quantité doit être un entier")
    .min(1, "Quantité minimum 1")
    .max(50, "Quantité maximum 50 par plat"),
});

// ============================================
// VALIDATION PLATS (ADMIN)
// ============================================

export const platSchema = z.object({
  plat: z.string()
    .min(2, "Nom plat trop court (min 2 caractères)")
    .max(200, "Nom plat trop long (max 200 caractères)"),
  prix: z.number()
    .min(0, "Prix ne peut être négatif")
    .max(500, "Prix maximum 500€"),
  description: z.string()
    .max(1000, "Description trop longue (max 1000 caractères)")
    .optional(),
  photo_du_plat: z.string().url("URL photo invalide").optional(),
  est_epuise: z.boolean().default(false),
  temps_preparation_minutes: z.number()
    .int("Temps doit être un entier")
    .min(1, "Temps minimum 1 minute")
    .max(300, "Temps maximum 5 heures")
    .optional(),
});

// ============================================
// TYPES TYPESCRIPT INFÉRÉS
// ============================================

export type ClientProfileInput = z.infer<typeof clientProfileSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
export type EvenementInput = z.infer<typeof evenementSchema>;
export type EvenementUpdateInput = z.infer<typeof evenementUpdateSchema>;
export type CommandeInput = z.infer<typeof commandeSchema>;
export type CommandeUpdateInput = z.infer<typeof commandeUpdateSchema>;
export type DetailCommandeInput = z.infer<typeof detailCommandeSchema>;
export type PlatInput = z.infer<typeof platSchema>;

// ============================================
// UTILITAIRES DE VALIDATION
// ============================================

export const validateClientProfile = (data: unknown): ClientProfileInput => {
  return clientProfileSchema.parse(data);
};

export const validateEvenement = (data: unknown): EvenementInput => {
  return evenementSchema.parse(data);
};

export const validateCommande = (data: unknown): CommandeInput => {
  return commandeSchema.parse(data);
};

export const validateDetailCommande = (data: unknown): DetailCommandeInput => {
  return detailCommandeSchema.parse(data);
};

// Validation sécurisée qui retourne soit les données validées, soit les erreurs
export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
};

// ============================================
// VALIDATION SPÉCIFIQUE DATES IMPOSSIBLES
// ============================================

// Validation spéciale pour les dates impossibles (ex: 31 février)
export const validateRealDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
};

// Schéma pour dates composées (jour/mois/année séparés)
export const composedDateSchema = z.object({
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(2150)
}).refine(
  (data) => validateRealDate(data.year, data.month, data.day),
  "Date impossible (ex: 31 février n'existe pas)"
);