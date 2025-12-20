// lib/announcements.ts
// Migré vers Prisma - Supabase supprimé

import { prisma } from "./prisma"

export interface Announcement {
  id?: number | bigint
  message: string
  is_active: boolean | null
  type: "info" | "warning" | "error" | "success"
  priority: "low" | "normal" | "high"
  created_at?: string | Date | null
  updated_at?: string | Date | null
  created_by?: string | null
}

export interface RestaurantSettings {
  restaurant_name: string
  restaurant_address: string
  restaurant_phone: string
  restaurant_email: string
  restaurant_hours: string
  restaurant_days: string
  restaurant_description: string
}

export interface SystemSettings {
  maintenance_mode: boolean
  allow_new_orders: boolean
  max_orders_per_day: number
  order_lead_time: number
  notifications_enabled: boolean
  site_title: string
  welcome_message: string
}

// Configuration par défaut de l'annonce
export const defaultAnnouncement: Announcement = {
  message: "Bienvenue chez ChanthanaThaiCook - Cuisine thaïlandaise authentique",
  is_active: false,
  type: "info",
  priority: "normal",
}

// =====================================
// FONCTIONS POUR LES ANNONCES
// =====================================

// Récupérer l'annonce active
export const getActiveAnnouncement = async (): Promise<Announcement | null> => {
  try {
    const announcement = await prisma.announcements.findFirst({
      where: { is_active: true },
      orderBy: [{ priority: "desc" }, { created_at: "desc" }],
    })

    if (!announcement) return null

    return {
      id: announcement.id,
      message: announcement.message,
      is_active: announcement.is_active,
      type: (announcement.type || "info") as Announcement["type"],
      priority: (announcement.priority || "normal") as Announcement["priority"],
      created_at: announcement.created_at,
      updated_at: announcement.updated_at,
      created_by: announcement.created_by,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'annonce:", error)
    return null
  }
}

// Récupérer toutes les annonces
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const announcements = await prisma.announcements.findMany({
      orderBy: { created_at: "desc" },
    })

    return announcements.map((a) => ({
      id: a.id,
      message: a.message,
      is_active: a.is_active,
      type: (a.type || "info") as Announcement["type"],
      priority: (a.priority || "normal") as Announcement["priority"],
      created_at: a.created_at,
      updated_at: a.updated_at,
      created_by: a.created_by,
    }))
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces:", error)
    return []
  }
}

// Créer une nouvelle annonce
export const createAnnouncement = async (
  announcement: Omit<Announcement, "id" | "created_at" | "updated_at">
): Promise<boolean> => {
  try {
    await prisma.announcements.create({
      data: {
        message: announcement.message,
        is_active: announcement.is_active,
        type: announcement.type,
        priority: announcement.priority,
        created_by: announcement.created_by || "admin",
      },
    })
    return true
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce:", error)
    return false
  }
}

// Mettre à jour une annonce
export const updateAnnouncement = async (
  id: number,
  announcement: Partial<Announcement>
): Promise<boolean> => {
  try {
    await prisma.announcements.update({
      where: { id: BigInt(id) },
      data: {
        message: announcement.message,
        is_active: announcement.is_active,
        type: announcement.type,
        priority: announcement.priority,
        updated_at: new Date(),
      },
    })
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'annonce:", error)
    return false
  }
}

// Activer une seule annonce (désactive toutes les autres)
export const activateSingleAnnouncement = async (id: number): Promise<boolean> => {
  try {
    // Transaction : désactiver toutes puis activer celle-ci
    await prisma.$transaction([
      prisma.announcements.updateMany({
        data: { is_active: false },
      }),
      prisma.announcements.update({
        where: { id: BigInt(id) },
        data: { is_active: true },
      }),
    ])
    return true
  } catch (error) {
    console.error("Erreur lors de l'activation de l'annonce:", error)
    return false
  }
}

// Supprimer une annonce
export const deleteAnnouncement = async (id: number): Promise<boolean> => {
  try {
    await prisma.announcements.delete({
      where: { id: BigInt(id) },
    })
    return true
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce:", error)
    return false
  }
}

// =====================================
// FONCTIONS POUR LES PARAMÈTRES RESTAURANT
// =====================================

// Récupérer tous les paramètres du restaurant
export const getRestaurantSettings = async (): Promise<RestaurantSettings | null> => {
  try {
    const settings = await prisma.restaurant_settings.findMany()

    const result: Record<string, string> = {}
    settings.forEach((s) => {
      result[s.setting_key] = s.setting_value || ""
    })

    return {
      restaurant_name: result.restaurant_name || "",
      restaurant_address: result.restaurant_address || "",
      restaurant_phone: result.restaurant_phone || "",
      restaurant_email: result.restaurant_email || "",
      restaurant_hours: result.restaurant_hours || "",
      restaurant_days: result.restaurant_days || "",
      restaurant_description: result.restaurant_description || "",
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres restaurant:", error)
    return null
  }
}

// Mettre à jour les paramètres du restaurant
export const updateRestaurantSettings = async (
  settings: Partial<RestaurantSettings>
): Promise<boolean> => {
  try {
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.restaurant_settings.upsert({
        where: { setting_key: key },
        update: { setting_value: value, updated_at: new Date() },
        create: { setting_key: key, setting_value: value },
      })
    )

    await prisma.$transaction(updates)
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres restaurant:", error)
    return false
  }
}

// =====================================
// FONCTIONS POUR LES PARAMÈTRES SYSTÈME
// =====================================

// Récupérer les paramètres système
export const getSystemSettings = async (): Promise<SystemSettings | null> => {
  try {
    const settings = await prisma.system_settings.findMany()

    const result: Record<string, boolean | number | string> = {}
    settings.forEach((s) => {
      const value = s.setting_value
      if (value === "true" || value === "false") {
        result[s.setting_key] = value === "true"
      } else if (!isNaN(Number(value))) {
        result[s.setting_key] = Number(value)
      } else {
        result[s.setting_key] = value
      }
    })

    return result as unknown as SystemSettings
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres système:", error)
    return null
  }
}

// Mettre à jour les paramètres système
export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<boolean> => {
  try {
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.system_settings.upsert({
        where: { setting_key: key },
        update: { setting_value: String(value), updated_at: new Date() },
        create: { setting_key: key, setting_value: String(value) },
      })
    )

    await prisma.$transaction(updates)
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres système:", error)
    return false
  }
}

// =====================================
// CONFIGURATION DES TYPES D'ANNONCES
// =====================================

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
