"use server"

import { action } from "@/lib/safe-action"
import { prisma } from "@/lib/prisma"
import { platVedetteSchema, restaurantSettingSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

// ============================================
// PLAT VEDETTE (Featured Dish)
// ============================================

/**
 * Définir le plat vedette de la semaine
 */
export const setFeaturedDish = action
  .schema(platVedetteSchema)
  .action(async ({ parsedInput }) => {
    const { plat_id } = parsedInput

    try {
      // Vérifier que le plat existe et récupérer ses jours disponibles
      if (plat_id) {
        const plat = await prisma.plats_db.findUnique({
          where: { idplats: plat_id },
          select: {
            idplats: true,
            plat: true,
            lundi_dispo: true,
            mardi_dispo: true,
            mercredi_dispo: true,
            jeudi_dispo: true,
            vendredi_dispo: true,
            samedi_dispo: true,
            dimanche_dispo: true,
          },
        })

        if (!plat) {
          return {
            success: false,
            error: "Plat introuvable",
          }
        }

        // Vérifier qu'il est disponible au moins un jour
        const aucunJourDispo = [
          plat.lundi_dispo,
          plat.mardi_dispo,
          plat.mercredi_dispo,
          plat.jeudi_dispo,
          plat.vendredi_dispo,
          plat.samedi_dispo,
          plat.dimanche_dispo,
        ].every((jour) => jour === "non")

        if (aucunJourDispo) {
          return {
            success: false,
            error: "Ce plat n'est disponible aucun jour de la semaine",
          }
        }
      }

      // Mise à jour ou création du setting
      await prisma.restaurant_settings.upsert({
        where: {
          setting_key: "plat_vedette_id",
        },
        update: {
          setting_value: plat_id ? plat_id.toString() : "",
          updated_at: new Date(),
        },
        create: {
          setting_key: "plat_vedette_id",
          setting_value: plat_id ? plat_id.toString() : "",
          setting_type: "number",
          description: "ID du plat vedette de la semaine",
        },
      })

      revalidatePath("/commander")
      revalidatePath("/admin/plats")

      return {
        success: true,
        message: plat_id
          ? "Plat vedette défini avec succès"
          : "Plat vedette retiré",
      }
    } catch (error) {
      console.error("Error setting featured dish:", error)
      return {
        success: false,
        error: "Erreur lors de la définition du plat vedette",
      }
    }
  })

/**
 * Obtenir le plat vedette actuel avec toutes ses informations
 */
export const getFeaturedDish = async () => {
  try {
    const setting = await prisma.restaurant_settings.findUnique({
      where: {
        setting_key: "plat_vedette_id",
      },
    })

    if (!setting || !setting.setting_value) {
      return null
    }

    const platId = parseInt(setting.setting_value, 10)

    if (isNaN(platId)) {
      return null
    }

    const plat = await prisma.plats_db.findUnique({
      where: {
        idplats: platId,
        est_epuise: false, // Exclure les plats épuisés
      },
      include: {
        details_commande_db: {
          take: 1, // Pour vérifier s'il est populaire
        },
      },
    })

    if (!plat) {
      return null
    }

    // Calculer les jours disponibles
    const joursDisponibles = []
    if (plat.lundi_dispo === "oui") joursDisponibles.push("lundi")
    if (plat.mardi_dispo === "oui") joursDisponibles.push("mardi")
    if (plat.mercredi_dispo === "oui") joursDisponibles.push("mercredi")
    if (plat.jeudi_dispo === "oui") joursDisponibles.push("jeudi")
    if (plat.vendredi_dispo === "oui") joursDisponibles.push("vendredi")
    if (plat.samedi_dispo === "oui") joursDisponibles.push("samedi")
    if (plat.dimanche_dispo === "oui") joursDisponibles.push("dimanche")

    // Explicit mapping to avoid Decimal serialization errors
    return {
      idplats: plat.idplats,
      plat: plat.plat,
      description: plat.description,
      prix: plat.prix?.toString() ?? null,
      lundi_dispo: plat.lundi_dispo,
      mardi_dispo: plat.mardi_dispo,
      mercredi_dispo: plat.mercredi_dispo,
      jeudi_dispo: plat.jeudi_dispo,
      vendredi_dispo: plat.vendredi_dispo,
      samedi_dispo: plat.samedi_dispo,
      dimanche_dispo: plat.dimanche_dispo,
      photo_du_plat: plat.photo_du_plat,
      est_epuise: plat.est_epuise,
      epuise_depuis: plat.epuise_depuis,
      epuise_jusqu_a: plat.epuise_jusqu_a,
      raison_epuisement: plat.raison_epuisement,
      est_vegetarien: plat.est_vegetarien,
      niveau_epice: plat.niveau_epice,
      categorie: plat.categorie,
      // Serialize details_commande_db to avoid Decimal errors
      details_commande_db: plat.details_commande_db.map(detail => ({
        iddetails: detail.iddetails,
        commande_r: detail.commande_r,
        plat_r: detail.plat_r,
        quantite_plat_commande: detail.quantite_plat_commande,
        prix_unitaire: detail.prix_unitaire?.toString() ?? null,
        nom_plat: detail.nom_plat,
        type: detail.type,
        extra_id: detail.extra_id,
        est_offert: detail.est_offert,
        preference_epice_niveau: detail.preference_epice_niveau,
      })),
      joursDisponibles,
    }
  } catch (error) {
    console.error("Error getting featured dish:", error)
    return null
  }
}

/**
 * Vérifier si un plat est le plat vedette
 */
export const isFeaturedDish = async (platId: number): Promise<boolean> => {
  try {
    const setting = await prisma.restaurant_settings.findUnique({
      where: {
        setting_key: "plat_vedette_id",
      },
    })

    if (!setting || !setting.setting_value) {
      return false
    }

    return parseInt(setting.setting_value, 10) === platId
  } catch (error) {
    console.error("Error checking featured dish:", error)
    return false
  }
}

// ============================================
// RESTAURANT SETTINGS GÉNÉRIQUES
// ============================================

/**
 * Obtenir un paramètre du restaurant
 */
export const getRestaurantSetting = async (key: string) => {
  try {
    const setting = await prisma.restaurant_settings.findUnique({
      where: {
        setting_key: key,
      },
    })

    return setting
  } catch (error) {
    console.error(`Error getting restaurant setting ${key}:`, error)
    return null
  }
}

/**
 * Définir un paramètre du restaurant
 */
export const setRestaurantSetting = action
  .schema(restaurantSettingSchema)
  .action(async ({ parsedInput }) => {
    const { setting_key, setting_value, setting_type, description } = parsedInput

    try {
      await prisma.restaurant_settings.upsert({
        where: {
          setting_key,
        },
        update: {
          setting_value,
          setting_type,
          description,
          updated_at: new Date(),
        },
        create: {
          setting_key,
          setting_value,
          setting_type,
          description,
        },
      })

      revalidatePath("/")

      return {
        success: true,
        message: "Paramètre mis à jour avec succès",
      }
    } catch (error) {
      console.error("Error setting restaurant setting:", error)
      return {
        success: false,
        error: "Erreur lors de la mise à jour du paramètre",
      }
    }
  })
