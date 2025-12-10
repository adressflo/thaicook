"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { z } from "zod"

// Schema validation
const saveTokenSchema = z.object({
  device_token: z.string().min(10, "Token invalide"),
  device_type: z.enum(["web", "ios", "android"]).default("web"),
})

const revokeTokenSchema = z.object({
  device_token: z.string().min(10, "Token invalide"),
})

/**
 * Sauvegarde ou met à jour le token FCM de l'utilisateur
 * @param token Token FCM généré par Firebase
 * @returns true si succès, false sinon
 */
export async function saveNotificationToken(
  token: string,
  deviceType: "web" | "ios" | "android" = "web"
): Promise<{ success: boolean; error?: string }> {
  try {
    // Valider input
    const validation = saveTokenSchema.safeParse({
      device_token: token,
      device_type: deviceType,
    })

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation échouée",
      }
    }

    // Récupérer session Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" }
    }

    // Récupérer client_id depuis auth_user_id
    const client = await prisma.client_db.findUnique({
      where: { auth_user_id: session.user.id },
      select: { idclient: true },
    })

    if (!client) {
      return { success: false, error: "Profil client introuvable" }
    }

    // Upsert token dans notification_tokens
    await prisma.notification_tokens.upsert({
      where: {
        client_id_device_token: {
          client_id: client.idclient,
          device_token: token,
        },
      },
      create: {
        client_id: client.idclient,
        device_token: token,
        device_type: deviceType,
        is_active: true,
        last_used: new Date(),
      },
      update: {
        is_active: true,
        last_used: new Date(),
        device_type: deviceType,
      },
    })

    console.log("✅ Token FCM sauvegardé:", {
      clientId: client.idclient,
      tokenPreview: token.substring(0, 20) + "...",
    })

    return { success: true }
  } catch (error) {
    console.error("❌ Erreur saveNotificationToken:", error)
    return {
      success: false,
      error: "Erreur lors de la sauvegarde du token",
    }
  }
}

/**
 * Révoque le token FCM (lors déconnexion)
 * @param token Token FCM à révoquer
 * @returns true si succès
 */
export async function revokeNotificationToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Valider input
    const validation = revokeTokenSchema.safeParse({ device_token: token })

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation échouée",
      }
    }

    // Récupérer session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" }
    }

    // Marquer token comme inactif (soft delete)
    await prisma.notification_tokens.updateMany({
      where: {
        device_token: token,
      },
      data: {
        is_active: false,
      },
    })

    console.log("✅ Token FCM révoqué:", token.substring(0, 20) + "...")

    return { success: true }
  } catch (error) {
    console.error("❌ Erreur revokeNotificationToken:", error)
    return {
      success: false,
      error: "Erreur lors de la révocation du token",
    }
  }
}

/**
 * Récupère les tokens actifs de l'utilisateur
 * @returns Liste des tokens actifs
 */
export async function getUserNotificationTokens(): Promise<{
  tokens: Array<{ device_token: string; device_type: string; last_used: Date }>
  error?: string
}> {
  try {
    // Récupérer session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { tokens: [], error: "Utilisateur non authentifié" }
    }

    // Récupérer client_id
    const client = await prisma.client_db.findUnique({
      where: { auth_user_id: session.user.id },
      select: { idclient: true },
    })

    if (!client) {
      return { tokens: [], error: "Profil client introuvable" }
    }

    // Récupérer tokens actifs
    const tokens = await prisma.notification_tokens.findMany({
      where: {
        client_id: client.idclient,
        is_active: true,
      },
      select: {
        device_token: true,
        device_type: true,
        last_used: true,
      },
      orderBy: {
        last_used: "desc",
      },
    })

    return {
      tokens: tokens.map((t) => ({
        device_token: t.device_token,
        device_type: t.device_type || "web",
        last_used: t.last_used || new Date(),
      })),
    }
  } catch (error) {
    console.error("❌ Erreur getUserNotificationTokens:", error)
    return {
      tokens: [],
      error: "Erreur lors de la récupération des tokens",
    }
  }
}

/**
 * Vérifie si l'utilisateur a au moins un token actif
 * @returns true si tokens actifs existent
 */
export async function hasActiveNotifications(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) return false

    const client = await prisma.client_db.findUnique({
      where: { auth_user_id: session.user.id },
      select: { idclient: true },
    })

    if (!client) return false

    const count = await prisma.notification_tokens.count({
      where: {
        client_id: client.idclient,
        is_active: true,
      },
    })

    return count > 0
  } catch (error) {
    console.error("❌ Erreur hasActiveNotifications:", error)
    return false
  }
}

// Types pour les préférences
export type NotificationPreferences = {
  id: number
  client_id: number
  notifications_enabled: boolean
  commande_confirmee: boolean
  commande_preparation: boolean
  commande_prete: boolean
  commande_retard: boolean
  evenement_confirme: boolean
  evenement_rappel_48h: boolean
  evenement_rappel_24h: boolean
  evenement_preparation: boolean
  promotions: boolean
  nouveautes: boolean
  newsletter: boolean
  rappel_paiement: boolean
  message_admin: boolean
  quiet_hours_start: Date | null
  quiet_hours_end: Date | null
  timezone: string
}

const updatePreferencesSchema = z.object({
  notifications_enabled: z.boolean().optional(),
  commande_confirmee: z.boolean().optional(),
  commande_preparation: z.boolean().optional(),
  commande_prete: z.boolean().optional(),
  commande_retard: z.boolean().optional(),
  evenement_confirme: z.boolean().optional(),
  evenement_rappel_48h: z.boolean().optional(),
  evenement_rappel_24h: z.boolean().optional(),
  evenement_preparation: z.boolean().optional(),
  promotions: z.boolean().optional(),
  nouveautes: z.boolean().optional(),
  newsletter: z.boolean().optional(),
  rappel_paiement: z.boolean().optional(),
  message_admin: z.boolean().optional(),
  quiet_hours_start: z.string().optional(),
  quiet_hours_end: z.string().optional(),
  timezone: z.string().optional(),
})

/**
 * Récupère les préférences de notifications de l'utilisateur
 * Crée des préférences par défaut si elles n'existent pas
 */
export async function getNotificationPreferences(): Promise<{
  preferences: NotificationPreferences | null
  error?: string
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { preferences: null, error: "Utilisateur non authentifié" }
    }

    const client = await prisma.client_db.findUnique({
      where: { auth_user_id: session.user.id },
      select: { idclient: true },
    })

    if (!client) {
      return { preferences: null, error: "Profil client introuvable" }
    }

    // Récupérer ou créer les préférences
    let prefs = await prisma.notification_preferences.findUnique({
      where: { client_id: client.idclient },
    })

    // Créer préférences par défaut si inexistantes
    if (!prefs) {
      prefs = await prisma.notification_preferences.create({
        data: {
          client_id: client.idclient,
          notifications_enabled: true,
          commande_confirmee: true,
          commande_preparation: true,
          commande_prete: true,
          commande_retard: true,
          evenement_confirme: true,
          evenement_rappel_48h: true,
          evenement_rappel_24h: true,
          evenement_preparation: true,
          promotions: false,
          nouveautes: false,
          newsletter: false,
          rappel_paiement: true,
          message_admin: true,
          timezone: "Europe/Paris",
        },
      })
    }

    return {
      preferences: {
        id: Number(prefs.id),
        client_id: Number(prefs.client_id),
        notifications_enabled: prefs.notifications_enabled ?? true,
        commande_confirmee: prefs.commande_confirmee ?? true,
        commande_preparation: prefs.commande_preparation ?? true,
        commande_prete: prefs.commande_prete ?? true,
        commande_retard: prefs.commande_retard ?? true,
        evenement_confirme: prefs.evenement_confirme ?? true,
        evenement_rappel_48h: prefs.evenement_rappel_48h ?? true,
        evenement_rappel_24h: prefs.evenement_rappel_24h ?? true,
        evenement_preparation: prefs.evenement_preparation ?? true,
        promotions: prefs.promotions ?? false,
        nouveautes: prefs.nouveautes ?? false,
        newsletter: prefs.newsletter ?? false,
        rappel_paiement: prefs.rappel_paiement ?? true,
        message_admin: prefs.message_admin ?? true,
        quiet_hours_start: prefs.quiet_hours_start,
        quiet_hours_end: prefs.quiet_hours_end,
        timezone: prefs.timezone ?? "Europe/Paris",
      },
    }
  } catch (error) {
    console.error("❌ Erreur getNotificationPreferences:", error)
    return {
      preferences: null,
      error: "Erreur lors de la récupération des préférences",
    }
  }
}

/**
 * Met à jour les préférences de notifications de l'utilisateur
 */
export async function updateNotificationPreferences(
  updates: Partial<NotificationPreferences>
): Promise<{ success: boolean; error?: string }> {
  try {
    const validation = updatePreferencesSchema.safeParse(updates)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation échouée",
      }
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" }
    }

    const client = await prisma.client_db.findUnique({
      where: { auth_user_id: session.user.id },
      select: { idclient: true },
    })

    if (!client) {
      return { success: false, error: "Profil client introuvable" }
    }

    // Convertir les heures quiet_hours si présentes
    const quietHoursData: { quiet_hours_start?: Date; quiet_hours_end?: Date } = {}
    if (updates.quiet_hours_start) {
      quietHoursData.quiet_hours_start = new Date(`1970-01-01T${updates.quiet_hours_start}:00Z`)
    }
    if (updates.quiet_hours_end) {
      quietHoursData.quiet_hours_end = new Date(`1970-01-01T${updates.quiet_hours_end}:00Z`)
    }

    // Mettre à jour ou créer les préférences
    await prisma.notification_preferences.upsert({
      where: { client_id: client.idclient },
      create: {
        client_id: client.idclient,
        ...updates,
        ...quietHoursData,
      },
      update: {
        ...updates,
        ...quietHoursData,
      },
    })

    console.log("✅ Préférences notifications mises à jour:", {
      clientId: client.idclient,
      updates: Object.keys(updates),
    })

    return { success: true }
  } catch (error) {
    console.error("❌ Erreur updateNotificationPreferences:", error)
    return {
      success: false,
      error: "Erreur lors de la mise à jour des préférences",
    }
  }
}
