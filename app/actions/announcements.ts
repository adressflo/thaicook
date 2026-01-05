"use server"

import { prisma } from "@/lib/prisma"

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

/**
 * Récupérer l'annonce active (côté serveur uniquement)
 */
export async function getActiveAnnouncementAction(): Promise<Announcement | null> {
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

/**
 * Récupérer toutes les annonces
 */
export async function getAllAnnouncementsAction(): Promise<Announcement[]> {
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

/**
 * Créer une nouvelle annonce
 */
export async function createAnnouncementAction(
  announcement: Omit<Announcement, "id" | "created_at" | "updated_at">
): Promise<boolean> {
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

/**
 * Activer une seule annonce (désactive toutes les autres)
 */
export async function activateSingleAnnouncementAction(id: number): Promise<boolean> {
  try {
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

/**
 * Supprimer une annonce
 */
export async function deleteAnnouncementAction(id: number): Promise<boolean> {
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
