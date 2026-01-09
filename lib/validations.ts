import { z } from "zod"

// ============================================
// SCHÉMAS DE VALIDATION ZOD POUR APPCHANTHANA
// ============================================

// Schéma de base pour les emails
const emailSchema = z.string().email("Email invalide")

// Schéma de base pour les téléphones français
const phoneSchema = z
  .string()
  .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, "Numéro de téléphone français invalide")
  .optional()

// Schéma de base pour les dates
const dateSchema = z
  .string()
  .refine((date) => {
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime()) && parsedDate > new Date("1900-01-01")
  }, "Date invalide")
  .optional()

// Schéma de base pour les mots de passe avec force validation
const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(100, "Le mot de passe est trop long (max 100 caractères)")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
  .regex(
    /[^A-Za-z0-9]/,
    "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&* etc.)"
  )

// ============================================
// AUTHENTICATION SCHEMAS (Better Auth)
// ============================================

// Schema pour inscription (Signup)
export const signupSchema = z
  .object({
    // Credentials
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),

    // Profil obligatoire
    nom: z
      .string()
      .min(1, "Le nom est requis")
      .max(100, "Nom trop long (max 100 caractères)")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"
      ),
    prenom: z
      .string()
      .min(1, "Le prénom est requis")
      .max(100, "Prénom trop long (max 100 caractères)")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets"
      ),
    numero_de_telephone: z
      .string()
      .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères")
      .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, "Numéro de téléphone français invalide"),

    // Profil optionnel
    date_de_naissance: z.string().optional(),
    adresse_numero_et_rue: z.string().max(500, "Adresse trop longue").optional(),
    code_postal: z
      .string()
      .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)")
      .optional(),
    ville: z.string().max(200, "Ville trop longue").optional(),
    preference_client: z.string().max(1000, "Préférences trop longues").optional(),
    souhaitez_vous_recevoir_actualites: z.boolean().default(false),
    comment_avez_vous_connu: z
      .array(
        z.enum([
          "BoucheAOreille",
          "ReseauxSociaux",
          "RechercheGoogle",
          "EnPassantDevant",
          "RecommandationAmi",
          "Autre",
        ])
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

// Schema pour connexion (Login)
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis"),
  rememberMe: z.boolean().optional().default(false),
})

// Schema pour demande de réinitialisation de mot de passe
export const requestPasswordResetSchema = z.object({
  email: emailSchema,
})

// Schema pour réinitialisation de mot de passe avec token
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token de réinitialisation requis"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

// Schema pour vérification d'email
export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token de vérification requis"),
})

// Schema pour changement d'email
export const changeEmailSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis pour changer l'email"),
    newEmail: emailSchema,
    confirmNewEmail: emailSchema,
  })
  .refine((data) => data.newEmail === data.confirmNewEmail, {
    message: "Les emails ne correspondent pas",
    path: ["confirmNewEmail"],
  })

// Schema pour suppression de compte (GDPR)
export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Mot de passe requis pour supprimer le compte"),
  confirmation: z
    .string()
    .refine(
      (val) => val === "SUPPRIMER MON COMPTE",
      "Veuillez taper exactement 'SUPPRIMER MON COMPTE' pour confirmer"
    ),
})

// ============================================
// VALIDATION PROFIL CLIENT (Better Auth)
// ============================================

export const clientProfileSchema = z.object({
  auth_user_id: z.string().min(1, "UID utilisateur requis"),
  nom: z
    .string()
    .min(1, "Nom requis")
    .max(100, "Nom trop long (max 100 caractères)")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"
    ),
  prenom: z
    .string()
    .min(1, "Prénom requis")
    .max(100, "Prénom trop long (max 100 caractères)")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets"
    ),
  email: emailSchema,
  telephone: phoneSchema,
  adresse: z.string().max(500, "Adresse trop longue (max 500 caractères)").optional(),
  date_de_naissance: dateSchema,
  role: z.enum(["client", "admin"]).default("client"),
})

// Schéma pour mise à jour profil (tous champs optionnels sauf UID)
export const clientUpdateSchema = clientProfileSchema.partial().extend({
  auth_user_id: z.string().min(1, "UID utilisateur requis"),
})

// Schéma spécial pour création automatique de profils avec placeholders temporaires
export const clientAutoCreateSchema = z.object({
  auth_user_id: z.string().min(1, "UID utilisateur requis"),
  email: emailSchema,
  nom: z.string().min(1, "Nom requis").max(100, "Nom trop long (max 100 caractères)"),
  prenom: z.string().min(1, "Prénom requis").max(100, "Prénom trop long (max 100 caractères)"),
  role: z.enum(["client", "admin"]).default("client"),
  // Champs optionnels pour création automatique
  telephone: phoneSchema,
  adresse: z.string().max(500, "Adresse trop longue (max 500 caractères)").optional(),
  date_de_naissance: dateSchema,
})

// ============================================
// VALIDATION ÉVÉNEMENTS
// ============================================

export const evenementSchema = z.object({
  nom_evenement: z
    .string()
    .min(3, "Nom événement trop court (min 3 caractères)")
    .max(200, "Nom événement trop long (max 200 caractères)"),
  date_evenement: z.string().refine((date) => {
    const parsedDate = new Date(date)
    const now = new Date()
    return !isNaN(parsedDate.getTime()) && parsedDate >= now
  }, "La date d'événement doit être dans le futur"),
  nombre_personnes: z
    .number()
    .int("Nombre de personnes doit être un entier")
    .min(1, "Minimum 1 personne")
    .max(500, "Maximum 500 personnes"),
  budget_approximatif: z
    .number()
    .min(0, "Budget ne peut être négatif")
    .max(100000, "Budget maximum 100,000€")
    .optional(),
  description_evenement: z
    .string()
    .max(2000, "Description trop longue (max 2000 caractères)")
    .optional(),
  lieu_evenement: z.string().min(1, "Lieu requis").max(300, "Lieu trop long (max 300 caractères)"),
  contact_client_r: z.string().min(1, "Contact client requis"),
  is_public: z.boolean().default(false),
  statut: z.enum(["En attente", "Confirmé", "Annulé"]).default("En attente"),
  plats_preselectionnes: z.array(z.number().int()).default([]),
  type_d_evenement: z.string().min(1, "Type d'événement requis").max(100, "Type trop long"),
})

// Schéma pour mise à jour événement
export const evenementUpdateSchema = evenementSchema.partial()

// ============================================
// VALIDATION COMMANDES (Better Auth)
// ============================================

export const commandeSchema = z.object({
  client_r_id: z.number().int().positive("ID client requis"),
  type_livraison: z.enum(["À emporter", "Livraison", "Sur place"]).optional(),
  date_et_heure_de_retrait_souhaitees: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true // Optionnel
      const parsedDate = new Date(date)
      return !isNaN(parsedDate.getTime())
    }, "Date de retrait invalide"),
  demande_special_pour_la_commande: z
    .string()
    .max(1000, "Demande spéciale trop longue (max 1000 caractères)")
    .optional(),
  adresse_specifique: z.string().max(500, "Adresse trop longue (max 500 caractères)").optional(),
  notes_internes: z.string().max(2000, "Notes trop longues (max 2000 caractères)").optional(),
  statut_commande: z
    .enum([
      "En attente de confirmation",
      "Confirmée",
      "En préparation",
      "Prête à récupérer",
      "Récupérée",
      "Annulée",
    ])
    .optional()
    .default("En attente de confirmation"),
  statut_paiement: z
    .enum(["En attente sur place", "Payé sur place", "Payé en ligne", "Non payé", "Payée"])
    .optional()
    .default("En attente sur place"),
})

// Schéma pour mise à jour commande
export const commandeUpdateSchema = commandeSchema.partial()

// ============================================
// VALIDATION DÉTAILS COMMANDE
// ============================================

export const detailCommandeSchema = z.object({
  commande_r: z.number().int().positive("ID commande invalide"),
  plat_r: z.number().int().positive("ID plat invalide"),
  quantite_plat_commande: z
    .number()
    .int("Quantité doit être un entier")
    .min(1, "Quantité minimum 1")
    .max(50, "Quantité maximum 50 par plat"),
})

// ============================================
// VALIDATION PLATS (ADMIN)
// ============================================

export const platSchema = z.object({
  plat: z
    .string()
    .min(2, "Nom plat trop court (min 2 caractères)")
    .max(200, "Nom plat trop long (max 200 caractères)"),
  prix: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Prix invalide (format: 12.99)")
    .refine((val) => parseFloat(val) >= 0, "Prix ne peut être négatif")
    .refine((val) => parseFloat(val) <= 500, "Prix maximum 500€"),
  description: z.string().max(1000, "Description trop longue (max 1000 caractères)").optional(),
  photo_du_plat: z.string().url("URL photo invalide").optional(),
  est_epuise: z.boolean().default(false),
  est_vegetarien: z.boolean().default(false).optional(),
  niveau_epice: z
    .number()
    .int("Niveau épicé doit être un entier")
    .min(0, "Niveau minimum 0")
    .max(3, "Niveau maximum 3")
    .default(0)
    .optional(),
  categorie: z.enum(["Entrées", "Plats", "Desserts", "Boissons", "Extras"]).optional(),
  lundi_dispo: z.any().optional(),
  mardi_dispo: z.any().optional(),
  mercredi_dispo: z.any().optional(),
  jeudi_dispo: z.any().optional(),
  vendredi_dispo: z.any().optional(),
  samedi_dispo: z.any().optional(),
  dimanche_dispo: z.any().optional(),
})

// Schéma pour mise à jour plat
export const platUpdateSchema = z.object({
  plat: z.string().min(2, "Nom plat trop court").max(200, "Nom plat trop long").optional(),
  prix: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Prix invalide")
    .optional(),
  description: z.string().max(1000, "Description trop longue").optional(),
  photo_du_plat: z.string().url("URL photo invalide").optional(),
  est_epuise: z.boolean().optional(),
  est_vegetarien: z.boolean().optional(),
  niveau_epice: z
    .number()
    .int("Niveau épicé doit être un entier")
    .min(0, "Niveau minimum 0")
    .max(3, "Niveau maximum 3")
    .optional(),
  categorie: z.enum(["Entrées", "Plats", "Desserts", "Boissons", "Extras"]).optional(),
  lundi_dispo: z.any().optional(),
  mardi_dispo: z.any().optional(),
  mercredi_dispo: z.any().optional(),
  jeudi_dispo: z.any().optional(),
  vendredi_dispo: z.any().optional(),
  samedi_dispo: z.any().optional(),
  dimanche_dispo: z.any().optional(),
})

// ============================================
// VALIDATION EXTRAS
// ============================================

export const extraSchema = z.object({
  nom_extra: z
    .string()
    .min(2, "Nom extra trop court (min 2 caractères)")
    .max(200, "Nom extra trop long (max 200 caractères)"),
  description: z.string().max(1000, "Description trop longue (max 1000 caractères)").optional(),
  prix: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Prix invalide (format: 12.99)")
    .refine((val) => parseFloat(val) >= 0, "Prix ne peut être négatif")
    .refine((val) => parseFloat(val) <= 500, "Prix maximum 500€"),
  photo_url: z.string().url("URL photo invalide").optional(),
  actif: z.boolean().default(true),
})

// Schéma pour mise à jour extra
export const extraUpdateSchema = z.object({
  nom_extra: z.string().min(2, "Nom extra trop court").max(200, "Nom extra trop long").optional(),
  description: z.string().max(1000, "Description trop longue").optional(),
  prix: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Prix invalide")
    .optional(),
  photo_url: z.string().url("URL photo invalide").optional(),
  actif: z.boolean().optional(),
})

// ============================================
// VALIDATION PLAT VEDETTE (Restaurant Settings)
// ============================================

export const platVedetteSchema = z.object({
  plat_id: z.number().int("ID plat invalide").positive("ID plat doit être positif").nullable(),
})

export const restaurantSettingSchema = z.object({
  setting_key: z.string().min(1, "Clé de paramètre requise"),
  setting_value: z.string(),
  setting_type: z.enum(["text", "number", "boolean", "json"]).default("text"),
  description: z.string().optional(),
})

// ============================================
// VALIDATION ACTIONS SPÉCIFIQUES
// ============================================

// Recherche clients
export const searchClientsSchema = z.object({
  searchTerm: z.string().min(1, "Terme de recherche requis").max(200, "Terme trop long"),
})

// Toggle épingle commande
export const toggleEpingleSchema = z.object({
  id: z.number().int().positive("ID commande invalide"),
})

// Toggle offert detail
export const toggleOffertSchema = z.object({
  detailId: z.number().int().positive("ID détail invalide"),
  prixOriginal: z.string().optional(),
})

// Add plat to commande
export const addPlatToCommandeSchema = z.object({
  commandeId: z.number().int().positive("ID commande invalide"),
  platId: z.number().int().positive("ID plat invalide"),
  quantite: z.number().int().min(1, "Quantité minimum 1").default(1),
})

// Add extra to commande
export const addExtraToCommandeSchema = z.object({
  commandeId: z.number().int().positive("ID commande invalide"),
  extraId: z.number().int().positive("ID extra invalide"),
  quantite: z.number().int().min(1, "Quantité minimum 1").default(1),
})

// Update plat quantite
export const updatePlatQuantiteSchema = z.object({
  detailId: z.number().int().positive("ID détail invalide"),
  quantite: z.number().int().min(1, "Quantité minimum 1").max(50, "Quantité maximum 50"),
})

// Update spice level
export const updateSpiceLevelSchema = z.object({
  detailId: z.number().int().positive("ID détail invalide"),
  spiceLevel: z.number().int().min(0, "Niveau minimum 0").max(3, "Niveau maximum 3"),
})

// Update spice distribution
export const updateSpiceDistributionSchema = z.object({
  detailId: z.number().int().positive("ID détail invalide"),
  distribution: z.array(z.number().int().min(0)).length(4, "Distribution doit avoir 4 éléments"),
})

// Get by ID schemas
export const getByIdSchema = z.object({
  id: z.number().int().positive("ID invalide"),
})

export const getByAuthUserIdSchema = z.object({
  authUserId: z.string().min(1, "Auth User ID requis"),
})

// ============================================
// TYPES TYPESCRIPT INFÉRÉS
// ============================================

// Types Authentication
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>

// Types CRUD
export type ClientProfileInput = z.infer<typeof clientProfileSchema>
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>
export type ClientAutoCreateInput = z.infer<typeof clientAutoCreateSchema>
export type EvenementInput = z.infer<typeof evenementSchema>
export type EvenementUpdateInput = z.infer<typeof evenementUpdateSchema>
export type CommandeInput = z.infer<typeof commandeSchema>
export type CommandeUpdateInput = z.infer<typeof commandeUpdateSchema>
export type DetailCommandeInput = z.infer<typeof detailCommandeSchema>
export type PlatInput = z.infer<typeof platSchema>
export type PlatUpdateInput = z.infer<typeof platUpdateSchema>
export type ExtraInput = z.infer<typeof extraSchema>
export type ExtraUpdateInput = z.infer<typeof extraUpdateSchema>

// ============================================
// UTILITAIRES DE VALIDATION
// ============================================

export const validateClientProfile = (data: unknown): ClientProfileInput => {
  return clientProfileSchema.parse(data)
}

export const validateClientAutoCreate = (data: unknown): ClientAutoCreateInput => {
  return clientAutoCreateSchema.parse(data)
}

export const validateEvenement = (data: unknown): EvenementInput => {
  return evenementSchema.parse(data)
}

export const validateCommande = (data: unknown): CommandeInput => {
  return commandeSchema.parse(data)
}

export const validateDetailCommande = (data: unknown): DetailCommandeInput => {
  return detailCommandeSchema.parse(data)
}

// Validation sécurisée qui retourne soit les données validées, soit les erreurs
export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

// ============================================
// VALIDATION SPÉCIFIQUE DATES IMPOSSIBLES
// ============================================

// Validation spéciale pour les dates impossibles (ex: 31 février)
export const validateRealDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

// Schéma pour dates composées (jour/mois/année séparés)
export const composedDateSchema = z
  .object({
    day: z.number().int().min(1).max(31),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(1900).max(2150),
  })
  .refine(
    (data) => validateRealDate(data.year, data.month, data.day),
    "Date impossible (ex: 31 février n'existe pas)"
  )

// --- DOCUMENTS (Devis/Factures) ---

export const ligneDocumentSchema = z.object({
  type: z.enum(["PLAT", "CUSTOM"]),
  plat_id: z.number().optional(), // Si type=PLAT
  description: z.string().min(1, "La description est requise"),
  quantite: z.number().min(0.01, "Quantité positive requise"),
  prix_unitaire: z.number().min(0, "Prix positif requis"),
  tva_taux: z.number().default(0),
  total_ht: z.number(),
  photo_url: z.string().optional(),
})

export const documentSchema = z.object({
  type: z.enum(["DEVIS", "FACTURE", "AVOIR", "TICKET"]),
  client_id: z.number().optional(), // Optionnel si client de passage
  nom_client_snapshot: z.string().min(1, "Nom du client requis"), // On garde le nom même si le client est supprimé
  adresse_client_snapshot: z.string().optional(),
  date_creation: z.date(),
  date_echeance: z.date().optional(),
  statut: z.string().default("brouillon"),

  lignes: z.array(ligneDocumentSchema).min(1, "Au moins une ligne requise"),

  notes_privees: z.string().optional(),
  mentions_legales: z.string().optional(),
})

export const documentUpdateSchema = documentSchema.partial().extend({
  id: z.string(),
})
