// lib/announcements.ts
// Types et configurations pour les annonces (côté client)
// Les fonctions CRUD sont dans app/actions/announcements.ts

// Re-export types depuis actions
export type { Announcement } from "@/app/actions/announcements"

// Re-export functions depuis actions pour compatibilité
export {
  activateSingleAnnouncementAction as activateSingleAnnouncement,
  createAnnouncementAction as createAnnouncement,
  deleteAnnouncementAction as deleteAnnouncement,
  getActiveAnnouncementAction as getActiveAnnouncement,
  getAllAnnouncementsAction as getAllAnnouncements,
} from "@/app/actions/announcements"

// Configuration par défaut de l'annonce
export const defaultAnnouncement = {
  message: "Bienvenue chez ChanthanaThaiCook - Cuisine thaïlandaise authentique",
  is_active: false,
  type: "info" as const,
  priority: "normal" as const,
}

// Configuration des types d'annonces (utilisable côté client)
export const announcementTypeConfig = {
  info: {
    bgColor: "bg-blue-600/90",
    textColor: "text-white",
    iconColor: "text-white",
    label: "Information",
  },
  warning: {
    bgColor: "bg-orange-600/90",
    textColor: "text-white",
    iconColor: "text-white",
    label: "Attention",
  },
  error: {
    bgColor: "bg-red-600/90",
    textColor: "text-white",
    iconColor: "text-white",
    label: "Urgent/Fermeture",
  },
  success: {
    bgColor: "bg-green-600/90",
    textColor: "text-white",
    iconColor: "text-white",
    label: "Promotion/Bonne nouvelle",
  },
}

// Messages prédéfinis pour faciliter la création d'annonces
export const predefinedAnnouncementMessages = [
  {
    message: "Fermeture exceptionnelle lundi - Merci de votre compréhension",
    type: "warning" as const,
    priority: "high" as const,
  },
  {
    message: "Nouveau menu disponible ! Découvrez nos spécialités d'automne",
    type: "success" as const,
    priority: "normal" as const,
  },
  {
    message: "Promotion spéciale : -10% sur toutes les commandes ce week-end",
    type: "success" as const,
    priority: "normal" as const,
  },
  {
    message: "Attention : délais de livraison rallongés en raison de l'affluence",
    type: "warning" as const,
    priority: "normal" as const,
  },
  {
    message: "Joyeuses fêtes ! Pensez à commander à l'avance pour les fêtes de fin d'année",
    type: "info" as const,
    priority: "normal" as const,
  },
]
