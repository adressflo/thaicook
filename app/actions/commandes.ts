"use server"

import type {
  client_db,
  commande_db,
  details_commande_db,
  extras_db,
  plats_db,
} from "@/generated/prisma/client"
import { Prisma, statut_commande, statut_paiement, type_livraison } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { authAction } from "@/lib/safe-action"
import {
  addExtraToCommandeSchema,
  addPlatToCommandeSchema,
  commandeUpdateSchema,
  getByIdSchema,
  toggleEpingleSchema,
  toggleOffertSchema,
  updatePlatQuantiteSchema,
  updateSpiceDistributionSchema,
  updateSpiceLevelSchema,
} from "@/lib/validations"
import type { CommandeUI, DetailCommande } from "@/types/app"
import { revalidatePath } from "next/cache"
import { z } from "zod"

type CommandeWithRelations = commande_db & {
  client_db: client_db | null
  details_commande_db: (details_commande_db & {
    plats_db: plats_db | null
    extras_db: extras_db | null
  })[]
}

function mapStatutCommande(statut: string | null): CommandeUI["statut_commande"] {
  if (!statut) return null
  const mapping: Record<string, CommandeUI["statut_commande"]> = {
    En_attente_de_confirmation: "En attente de confirmation",
    Confirm_e: "Confirmée",
    En_pr_paration: "En préparation",
    Pr_te___r_cup_rer: "Prête à récupérer",
    R_cup_r_e: "Récupérée",
    Annul_e: "Annulée",
  }
  if (Object.prototype.hasOwnProperty.call(mapping, statut)) {
    return mapping[statut]
  }
  return null
}

function mapStatutCommandeToDB(statutUI: CommandeUI["statut_commande"]): statut_commande | null {
  if (!statutUI) return null
  const reverseMapping: Record<string, statut_commande> = {
    "En attente de confirmation": statut_commande.En_attente_de_confirmation,
    Confirmée: statut_commande.Confirm_e,
    "En préparation": statut_commande.En_pr_paration,
    "Prête à récupérer": statut_commande.Pr_te___r_cup_rer,
    Récupérée: statut_commande.R_cup_r_e,
    Annulée: statut_commande.Annul_e,
  }
  if (Object.prototype.hasOwnProperty.call(reverseMapping, statutUI)) {
    return reverseMapping[statutUI]
  }
  return null
}

function mapStatutPaiementToDB(statutUI: CommandeUI["statut_paiement"]): statut_paiement | null {
  if (!statutUI) return null
  const reverseMapping: Record<string, statut_paiement> = {
    "En attente sur place": statut_paiement.En_attente_sur_place,
    "Payé sur place": statut_paiement.Pay__sur_place,
    "Payé en ligne": statut_paiement.Pay__en_ligne,
    "Non payé": statut_paiement.Non_pay_,
    Payée: statut_paiement.Pay_e,
  }
  if (Object.prototype.hasOwnProperty.call(reverseMapping, statutUI)) {
    return reverseMapping[statutUI]
  }
  return null
}

function mapStatutPaiement(statut: string | null): CommandeUI["statut_paiement"] {
  if (!statut) return null
  const mapping: Record<string, CommandeUI["statut_paiement"]> = {
    En_attente_sur_place: "En attente sur place",
    Pay__sur_place: "Payé sur place",
    Pay__en_ligne: "Payé en ligne",
    Non_pay_: "Non payé",
    Pay_e: "Payée",
  }
  if (Object.prototype.hasOwnProperty.call(mapping, statut)) {
    return mapping[statut]
  }
  return null
}

function mapTypeLivraison(type: string | null): CommandeUI["type_livraison"] {
  if (!type) return null
  const mapping: Record<string, CommandeUI["type_livraison"]> = {
    emporter: "À emporter",
    Livraison: "Livraison",
    Sur_place: "Sur place",
  }
  return mapping[type] || null
}

function mapTypeLivraisonToDB(typeUI: CommandeUI["type_livraison"]): type_livraison | null {
  if (!typeUI) return null
  const mapping: Record<string, type_livraison> = {
    "À emporter": type_livraison.emporter,
    Livraison: type_livraison.Livraison,
    "Sur place": type_livraison.Sur_place,
  }
  if (Object.prototype.hasOwnProperty.call(mapping, typeUI)) {
    return mapping[typeUI]
  }
  return null
}

function convertCommandeToUI(commande: CommandeWithRelations): CommandeUI {
  const prix_total = (
    commande.details_commande_db?.reduce((sum: number, detail) => {
      return (
        sum +
        (parseFloat(detail.prix_unitaire?.toString() || "0") || 0) *
          (detail.quantite_plat_commande || 0)
      )
    }, 0) || 0
  ).toFixed(2)

  return {
    id: commande.idcommande,
    idcommande: commande.idcommande,
    client_r_id: commande.client_r_id ? Number(commande.client_r_id) : null,
    date_et_heure_de_retrait_souhaitees:
      commande.date_et_heure_de_retrait_souhaitees?.toISOString() || null,
    demande_special_pour_la_commande: commande.demande_special_pour_la_commande || null,
    type_livraison: mapTypeLivraison(commande.type_livraison),
    adresse_specifique: commande.adresse_specifique || null,
    statut_commande: mapStatutCommande(commande.statut_commande),
    statut_paiement: mapStatutPaiement(commande.statut_paiement),
    prix_total,
    notes_internes: commande.notes_internes || null,
    created_at: commande.date_de_prise_de_commande?.toISOString() || null,
    updated_at: null,
    client_r: commande.client_r || null,
    date_de_prise_de_commande: commande.date_de_prise_de_commande?.toISOString() || null,
    nom_evenement: commande.nom_evenement || null,
    epingle: commande.epingle ?? false,
    client: commande.client_db
      ? {
          idclient: Number(commande.client_db.idclient),
          nom: commande.client_db.nom || null,
          prenom: commande.client_db.prenom || null,
          email: commande.client_db.email || null,
          numero_de_telephone: commande.client_db.numero_de_telephone || null,
          adresse_numero_et_rue: commande.client_db.adresse_numero_et_rue || null,
          ville: commande.client_db.ville || null,
          code_postal: commande.client_db.code_postal || null,
          preference_client: commande.client_db.preference_client || null,
          photo_client: commande.client_db.photo_client || null,
          auth_user_id: commande.client_db.auth_user_id,
        }
      : null,
    details: commande.details_commande_db?.map((detail) => {
      const prixUnitaireStr = detail.prix_unitaire
        ? typeof detail.prix_unitaire === "object" && "toString" in detail.prix_unitaire
          ? detail.prix_unitaire.toString()
          : String(detail.prix_unitaire)
        : null

      return {
        iddetails: detail.iddetails,
        commande_r: detail.commande_r,
        plat_r: detail.plat_r,
        quantite_plat_commande: detail.quantite_plat_commande ?? 1,
        nom_plat: detail.nom_plat ?? null,
        prix_unitaire: prixUnitaireStr,
        type: (detail.type ?? "plat") as "plat" | "extra" | null,
        extra_id: detail.extra_id ?? null,
        est_offert: detail.est_offert ?? false,
        spice_distribution: detail.spice_distribution ?? null,
        plat: detail.plats_db
          ? {
              id: detail.plats_db.idplats,
              idplats: detail.plats_db.idplats,
              plat: detail.plats_db.plat,
              description: detail.plats_db.description ?? null,
              prix: detail.plats_db.prix
                ? typeof detail.plats_db.prix === "object" && "toString" in detail.plats_db.prix
                  ? detail.plats_db.prix.toString()
                  : String(detail.plats_db.prix)
                : null,
              lundi_dispo: detail.plats_db.lundi_dispo,
              mardi_dispo: detail.plats_db.mardi_dispo,
              mercredi_dispo: detail.plats_db.mercredi_dispo,
              jeudi_dispo: detail.plats_db.jeudi_dispo,
              vendredi_dispo: detail.plats_db.vendredi_dispo ?? null,
              samedi_dispo: detail.plats_db.samedi_dispo ?? null,
              dimanche_dispo: detail.plats_db.dimanche_dispo ?? null,
              photo_du_plat: detail.plats_db.photo_du_plat ?? null,
              est_epuise: detail.plats_db.est_epuise ?? null,
              epuise_depuis: detail.plats_db.epuise_depuis?.toISOString() ?? null,
              epuise_jusqu_a: detail.plats_db.epuise_jusqu_a?.toISOString() ?? null,
              raison_epuisement: detail.plats_db.raison_epuisement ?? null,
              est_vegetarien: detail.plats_db.est_vegetarien ?? null,
              niveau_epice: detail.plats_db.niveau_epice ?? null,
              categorie: detail.plats_db.categorie ?? null,
            }
          : null,
        extra: detail.extras_db
          ? {
              idextra: detail.extras_db.idextra,
              nom_extra: detail.extras_db.nom_extra,
              description: detail.extras_db.description ?? null,
              prix:
                typeof detail.extras_db.prix === "object" && "toString" in detail.extras_db.prix
                  ? detail.extras_db.prix.toString()
                  : String(detail.extras_db.prix),
              photo_url: detail.extras_db.photo_url ?? null,
              actif: detail.extras_db.actif ?? null,
              created_at: detail.extras_db.created_at?.toISOString() ?? null,
              updated_at: detail.extras_db.updated_at?.toISOString() ?? null,
            }
          : null,
      }
    }) as import("@/types/app").DetailCommande[] | undefined,
  }
}

export async function getCommandes(): Promise<CommandeUI[]> {
  try {
    const commandes = await prisma.commande_db.findMany({
      include: {
        client_db: true,
        details_commande_db: {
          include: {
            plats_db: true,
            extras_db: true,
          },
        },
      },
      orderBy: { date_de_prise_de_commande: "desc" },
    })

    return commandes.map(convertCommandeToUI)
  } catch (error) {
    console.error("❌ Error in getCommandes:", error)
    throw new Error("Impossible de récupérer les commandes")
  }
}

export async function getCommandeById(id: number): Promise<CommandeUI | null> {
  try {
    const commande = await prisma.commande_db.findUnique({
      where: { idcommande: id },
      include: {
        client_db: true,
        details_commande_db: {
          include: {
            plats_db: true,
            extras_db: true,
          },
        },
      },
    })

    return commande ? convertCommandeToUI(commande) : null
  } catch (error) {
    console.error("❌ Error in getCommandeById:", error)
    throw new Error("Impossible de récupérer la commande")
  }
}

export async function getCommandesByClient(clientId: number): Promise<CommandeUI[]> {
  try {
    const commandes = await prisma.commande_db.findMany({
      where: { client_r_id: BigInt(clientId) },
      include: {
        client_db: true,
        details_commande_db: {
          include: {
            plats_db: true,
            extras_db: true,
          },
        },
      },
      orderBy: { date_de_prise_de_commande: "desc" },
    })

    return commandes.map(convertCommandeToUI)
  } catch (error) {
    console.error("❌ Error in getCommandesByClient:", error)
    throw new Error("Impossible de récupérer les commandes du client")
  }
}

const createCommandeSchema = z.object({
  client_r_id: z.number().optional(),
  client_r: z.string().optional(), // auth_user_id
  date_et_heure_de_retrait_souhaitees: z.string().optional(),
  demande_special_pour_la_commande: z.string().optional(),
  type_livraison: z.enum(["À emporter", "Livraison", "Sur place"]).optional(),
  adresse_specifique: z.string().optional(),
  details: z
    .array(
      z.object({
        plat_r: z.union([z.number(), z.string().transform(Number)]),
        quantite_plat_commande: z.number(),
        preference_epice_niveau: z.number().optional(), // Niveau d'épice souhaité (0-3)
        spice_distribution: z.array(z.number()).nullable().optional(), // Distribution épicée - accepte null, undefined ou array
      })
    )
    .optional(),
  plats: z
    .array(
      z.object({
        plat_r_id: z.number(),
        quantite: z.number(),
        spice_distribution: z.array(z.number()).nullable().optional(), // Distribution épicée - accepte null
      })
    )
    .optional(),
})

export const createCommande = authAction
  .schema(createCommandeSchema)
  .action(async ({ parsedInput: data }) => {
    // DEBUG: Log les données reçues
    console.log("📦 createCommande - Données reçues:", {
      client_r: data.client_r,
      client_r_id: data.client_r_id,
      date: data.date_et_heure_de_retrait_souhaitees,
      details_count: data.details?.length ?? 0,
      plats_count: data.plats?.length ?? 0,
      details: data.details,
      plats: data.plats,
    })

    try {
      let clientRId: bigint
      if (data.client_r_id) {
        clientRId = BigInt(data.client_r_id)
      } else if (data.client_r) {
        const client = await prisma.client_db.findUnique({
          where: { auth_user_id: data.client_r },
        })
        if (!client) throw new Error("Client introuvable")
        clientRId = client.idclient
      } else {
        throw new Error("client_r_id ou client_r requis")
      }

      const items = data.details || data.plats || []
      console.log("📦 createCommande - Items à traiter:", items.length, items)

      // VALIDATION: Empêcher la création de commande sans plats
      if (items.length === 0) {
        throw new Error("Impossible de créer une commande sans plats")
      }

      // VALIDATION: Vérifier que tous les plats existent AVANT de créer la commande
      const platsData: Map<number, plats_db> = new Map()
      for (const item of items) {
        const platId =
          "plat_r" in item
            ? typeof item.plat_r === "string"
              ? parseInt(item.plat_r)
              : item.plat_r
            : item.plat_r_id

        if (platId === null || platId === undefined || isNaN(platId)) {
          console.error("❌ Invalid platId:", item)
          throw new Error(`ID de plat invalide: ${JSON.stringify(item)}`)
        }

        if (!platsData.has(platId)) {
          const platData = await prisma.plats_db.findUnique({
            where: { idplats: platId },
          })

          if (!platData) {
            console.error("❌ Plat not found:", platId)
            throw new Error(`Plat introuvable: ID ${platId}`)
          }

          platsData.set(platId, platData)
        }
      }

      // Utiliser une transaction pour garantir l'intégrité des données
      const commandeComplete = await prisma.$transaction(async (tx) => {
        // Créer la commande
        const commande = await tx.commande_db.create({
          data: {
            client_r: data.client_r || null,
            client_r_id: clientRId,
            date_et_heure_de_retrait_souhaitees: data.date_et_heure_de_retrait_souhaitees
              ? new Date(data.date_et_heure_de_retrait_souhaitees)
              : null,
            demande_special_pour_la_commande: data.demande_special_pour_la_commande || null,
            type_livraison:
              mapTypeLivraisonToDB(data.type_livraison as CommandeUI["type_livraison"]) ||
              type_livraison.emporter,
            adresse_specifique: data.adresse_specifique || null,
            statut_commande: statut_commande.En_attente_de_confirmation,
            statut_paiement: statut_paiement.En_attente_sur_place,
          },
        })

        // Créer tous les détails
        for (const item of items) {
          const platId =
            "plat_r" in item
              ? typeof item.plat_r === "string"
                ? parseInt(item.plat_r)
                : item.plat_r
              : item.plat_r_id

          const platData = platsData.get(platId)!

          const quantite =
            "quantite_plat_commande" in item
              ? item.quantite_plat_commande
              : "quantite" in item
                ? item.quantite
                : 1

          const preferenceEpice: number =
            "preference_epice_niveau" in item && typeof item.preference_epice_niveau === "number"
              ? item.preference_epice_niveau
              : 0

          // Extraire la distribution épicée si présente
          const spiceDistribution =
            "spice_distribution" in item && Array.isArray(item.spice_distribution)
              ? item.spice_distribution
              : undefined

          await tx.details_commande_db.create({
            data: {
              commande_r: commande.idcommande,
              plat_r: platId,
              quantite_plat_commande: quantite || 1,
              prix_unitaire: platData.prix?.toString() || null,
              nom_plat: platData.plat,
              type: "plat",
              preference_epice_niveau: preferenceEpice,
              spice_distribution: spiceDistribution ?? Prisma.JsonNull,
            },
          })
        }

        // Récupérer la commande complète
        return await tx.commande_db.findUnique({
          where: { idcommande: commande.idcommande },
          include: {
            client_db: true,
            details_commande_db: {
              include: {
                plats_db: true,
                extras_db: true,
              },
            },
          },
        })
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/historique")
      revalidatePath("/suivi")
      revalidatePath("/commander")

      return convertCommandeToUI(commandeComplete!)
    } catch (error) {
      console.error("❌ Error in createCommande:", error)
      throw error instanceof Error ? error : new Error("Impossible de créer la commande")
    }
  })

export const updateCommande = authAction
  .schema(commandeUpdateSchema.extend({ id: z.number() }))
  .action(async ({ parsedInput: { id, ...data } }) => {
    console.log("🔄 updateCommande - Début:", { id, data })
    try {
      const updateData: Prisma.commande_dbUpdateInput = {}

      if (data.statut_commande) {
        const mappedStatus = mapStatutCommandeToDB(
          data.statut_commande as CommandeUI["statut_commande"]
        )
        if (mappedStatus) {
          updateData.statut_commande = mappedStatus
        }
      }
      if (data.statut_paiement) {
        const mappedPaiement = mapStatutPaiementToDB(
          data.statut_paiement as CommandeUI["statut_paiement"]
        )
        if (mappedPaiement) {
          updateData.statut_paiement = mappedPaiement
        }
      }
      if (data.notes_internes !== undefined) updateData.notes_internes = data.notes_internes
      if (data.date_et_heure_de_retrait_souhaitees)
        updateData.date_et_heure_de_retrait_souhaitees = new Date(
          data.date_et_heure_de_retrait_souhaitees
        )
      if (data.demande_special_pour_la_commande !== undefined)
        updateData.demande_special_pour_la_commande = data.demande_special_pour_la_commande
      if (data.type_livraison) {
        const mappedLivraison = mapTypeLivraisonToDB(
          data.type_livraison as CommandeUI["type_livraison"]
        )
        if (mappedLivraison) {
          updateData.type_livraison = mappedLivraison
        }
      }
      if (data.adresse_specifique !== undefined)
        updateData.adresse_specifique = data.adresse_specifique

      console.log("📝 updateCommande - updateData préparé:", updateData)

      const commande = await prisma.commande_db.update({
        where: { idcommande: id },
        data: updateData,
        include: {
          client_db: true,
          details_commande_db: {
            include: {
              plats_db: true,
              extras_db: true,
            },
          },
        },
      })

      console.log("✅ updateCommande - Prisma update réussi:", commande.idcommande)

      revalidatePath("/admin/commandes")
      revalidatePath("/historique")
      revalidatePath("/suivi")

      // Envoyer notification push si le statut commande a changé
      if (data.statut_commande && commande.client_db) {
        try {
          const statutUI = mapStatutCommande(commande.statut_commande)
          let notificationTitle = "Mise à jour de votre commande"
          let notificationBody = `Votre commande #${commande.idcommande} a été mise à jour.`

          // Messages personnalisés selon le statut
          if (statutUI === "Confirmée") {
            notificationTitle = "✅ Commande confirmée !"
            notificationBody = `Votre commande #${commande.idcommande} a été confirmée et est en cours de préparation.`
          } else if (statutUI === "En préparation") {
            notificationTitle = "👨‍🍳 Commande en préparation"
            notificationBody = `Votre commande #${commande.idcommande} est en cours de préparation par nos cuisiniers.`
          } else if (statutUI === "Prête à récupérer") {
            notificationTitle = "🎉 Commande prête !"
            notificationBody = `Votre commande #${commande.idcommande} est prête à être récupérée. Bon appétit !`
          } else if (statutUI === "Récupérée") {
            notificationTitle = "✅ Commande récupérée"
            notificationBody = `Merci d'avoir récupéré votre commande #${commande.idcommande}. Bon appétit !`
          } else if (statutUI === "Annulée") {
            notificationTitle = "❌ Commande annulée"
            notificationBody = `Votre commande #${commande.idcommande} a été annulée.`
          }

          // Appel API pour envoyer la notification
          await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notifications/send`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                clientId: commande.client_db.idclient,
                notification: {
                  title: notificationTitle,
                  body: notificationBody,
                  icon: "/icons/icon-192x192.png",
                  data: {
                    type: "order",
                    orderId: commande.idcommande.toString(),
                    url: `/suivi-commande/${commande.idcommande}`,
                  },
                },
              }),
            }
          )

          console.log("📬 Notification push envoyée pour commande:", commande.idcommande)
        } catch (notifError) {
          // Ne pas faire échouer la mise à jour si la notification échoue
          console.warn("⚠️ Erreur envoi notification (non bloquant):", notifError)
        }
      }

      return convertCommandeToUI(commande)
    } catch (error) {
      console.error("❌ Error in updateCommande:", error)
      throw new Error("Impossible de mettre à jour la commande")
    }
  })

export const toggleEpingleCommande = authAction
  .schema(toggleEpingleSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const currentCommande = await prisma.commande_db.findUnique({
        where: { idcommande: id },
        select: { epingle: true },
      })

      if (!currentCommande) {
        throw new Error("Commande introuvable")
      }

      const commande = await prisma.commande_db.update({
        where: { idcommande: id },
        data: { epingle: !currentCommande.epingle },
        include: {
          client_db: true,
          details_commande_db: {
            include: {
              plats_db: true,
              extras_db: true,
            },
          },
        },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/historique")

      return convertCommandeToUI(commande)
    } catch (error) {
      console.error("❌ Error in toggleEpingleCommande:", error)
      throw new Error("Impossible d'épingler/désépingler la commande")
    }
  })

export const toggleOffertDetail = authAction
  .schema(toggleOffertSchema)
  .action(async ({ parsedInput: { detailId, prixOriginal } }) => {
    try {
      const currentDetail = await prisma.details_commande_db.findUnique({
        where: { iddetails: detailId },
        include: {
          plats_db: true,
          extras_db: true,
        },
      })

      if (!currentDetail) {
        throw new Error("Détail de commande introuvable")
      }

      const isCurrentlyOffert = currentDetail.est_offert ?? false

      let newPrix: string | null = null
      if (!isCurrentlyOffert) {
        newPrix = "0.00"
      } else {
        if (prixOriginal) {
          newPrix = prixOriginal
        } else if (currentDetail.plats_db) {
          newPrix = currentDetail.plats_db.prix?.toString() || null
        } else if (currentDetail.extras_db) {
          newPrix = currentDetail.extras_db.prix.toString()
        }
      }

      const updatedDetail = await prisma.details_commande_db.update({
        where: { iddetails: detailId },
        data: {
          est_offert: !isCurrentlyOffert,
          prix_unitaire: newPrix,
        },
        include: {
          plats_db: true,
          extras_db: true,
        },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/historique")

      return {
        iddetails: updatedDetail.iddetails,
        commande_r: updatedDetail.commande_r,
        plat_r: updatedDetail.plat_r,
        quantite_plat_commande: updatedDetail.quantite_plat_commande ?? 1,
        nom_plat: updatedDetail.nom_plat ?? null,
        prix_unitaire: updatedDetail.prix_unitaire?.toString() ?? null,
        type: updatedDetail.type ?? "plat",
        extra_id: updatedDetail.extra_id ?? null,
        est_offert: updatedDetail.est_offert ?? false,
        plat: updatedDetail.plats_db
          ? {
              id: updatedDetail.plats_db.idplats,
              idplats: updatedDetail.plats_db.idplats,
              plat: updatedDetail.plats_db.plat,
              description: updatedDetail.plats_db.description ?? null,
              prix: updatedDetail.plats_db.prix ? updatedDetail.plats_db.prix.toString() : null,
              lundi_dispo: updatedDetail.plats_db.lundi_dispo,
              mardi_dispo: updatedDetail.plats_db.mardi_dispo,
              mercredi_dispo: updatedDetail.plats_db.mercredi_dispo,
              jeudi_dispo: updatedDetail.plats_db.jeudi_dispo,
              vendredi_dispo: updatedDetail.plats_db.vendredi_dispo ?? null,
              samedi_dispo: updatedDetail.plats_db.samedi_dispo ?? null,
              dimanche_dispo: updatedDetail.plats_db.dimanche_dispo ?? null,
              photo_du_plat: updatedDetail.plats_db.photo_du_plat ?? null,
              est_epuise: updatedDetail.plats_db.est_epuise ?? null,
              epuise_depuis: updatedDetail.plats_db.epuise_depuis?.toISOString() ?? null,
              epuise_jusqu_a: updatedDetail.plats_db.epuise_jusqu_a?.toISOString() ?? null,
              raison_epuisement: updatedDetail.plats_db.raison_epuisement ?? null,
              est_vegetarien: updatedDetail.plats_db.est_vegetarien ?? null,
              niveau_epice: updatedDetail.plats_db.niveau_epice ?? null,
              categorie: updatedDetail.plats_db.categorie ?? null,
            }
          : null,
        extra: updatedDetail.extras_db
          ? {
              idextra: updatedDetail.extras_db.idextra,
              nom_extra: updatedDetail.extras_db.nom_extra,
              description: updatedDetail.extras_db.description ?? null,
              prix: updatedDetail.extras_db.prix.toString(),
              photo_url: updatedDetail.extras_db.photo_url ?? null,
              actif: updatedDetail.extras_db.actif ?? null,
              created_at: updatedDetail.extras_db.created_at?.toISOString() ?? null,
              updated_at: updatedDetail.extras_db.updated_at?.toISOString() ?? null,
            }
          : null,
      } as DetailCommande
    } catch (error) {
      console.error("❌ Error in toggleOffertDetail:", error)
      throw new Error("Impossible de basculer le statut 'offert' du détail")
    }
  })

export const deleteCommande = authAction
  .schema(getByIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      await prisma.details_commande_db.deleteMany({
        where: { commande_r: id },
      })

      await prisma.commande_db.delete({
        where: { idcommande: id },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/historique")
      revalidatePath("/suivi")
      return { success: true, id }
    } catch (error) {
      console.error("❌ Error in deleteCommande:", error)
      throw new Error("Impossible de supprimer la commande")
    }
  })

export const addPlatToCommande = authAction
  .schema(addPlatToCommandeSchema)
  .action(async ({ parsedInput: { commandeId, platId, quantite } }) => {
    try {
      const plat = await prisma.plats_db.findUnique({
        where: { idplats: platId },
      })

      if (!plat) throw new Error("Plat introuvable")

      await prisma.details_commande_db.create({
        data: {
          commande_r: commandeId,
          plat_r: platId,
          quantite_plat_commande: quantite,
          prix_unitaire: plat.prix?.toString() || null,
          nom_plat: plat.plat,
          type: "plat",
        },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/modifier-commande")
      return { success: true }
    } catch (error) {
      console.error("❌ Error in addPlatToCommande:", error)
      throw new Error("Impossible d'ajouter le plat à la commande")
    }
  })

export const addExtraToCommande = authAction
  .schema(addExtraToCommandeSchema)
  .action(async ({ parsedInput: { commandeId, extraId, quantite } }) => {
    try {
      const extra = await prisma.extras_db.findUnique({
        where: { idextra: extraId },
      })

      if (!extra) throw new Error("Extra introuvable")

      await prisma.details_commande_db.create({
        data: {
          commande_r: commandeId,
          extra_id: extraId,
          plat_r: null,
          quantite_plat_commande: quantite,
          prix_unitaire: extra.prix.toString(),
          nom_plat: extra.nom_extra,
          type: "extra",
        },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/modifier-commande")
      return { success: true }
    } catch (error) {
      console.error("❌ Error in addExtraToCommande:", error)
      throw new Error("Impossible d'ajouter l'extra à la commande")
    }
  })

export const updatePlatQuantite = authAction
  .schema(updatePlatQuantiteSchema)
  .action(async ({ parsedInput: { detailId, quantite } }) => {
    try {
      await prisma.details_commande_db.update({
        where: { iddetails: detailId },
        data: { quantite_plat_commande: quantite },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/modifier-commande")
      return { success: true }
    } catch (error) {
      console.error("❌ Error in updatePlatQuantite:", error)
      throw new Error("Impossible de mettre à jour la quantité")
    }
  })

export const updateSpiceLevel = authAction
  .schema(updateSpiceLevelSchema)
  .action(async ({ parsedInput: { detailId, spiceLevel } }) => {
    try {
      await prisma.details_commande_db.update({
        where: { iddetails: detailId },
        data: { preference_epice_niveau: spiceLevel },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/modifier-commande")
      return { success: true }
    } catch (error) {
      console.error("❌ Error in updateSpiceLevel:", error)
      throw new Error("Impossible de mettre à jour le niveau épicé")
    }
  })

export const updateSpiceDistribution = authAction
  .schema(updateSpiceDistributionSchema)
  .action(async ({ parsedInput: { detailId, distribution } }) => {
    try {
      await prisma.details_commande_db.update({
        where: { iddetails: detailId },
        data: { spice_distribution: distribution },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/modifier-commande")
      return { success: true }
    } catch (error) {
      console.error("❌ Error in updateSpiceDistribution:", error)
      throw new Error("Impossible de mettre à jour la distribution épicée")
    }
  })

export const removePlatFromCommande = authAction
  .schema(getByIdSchema) // Assuming getByIdSchema validates `id` which we'll use as detailId
  .action(async ({ parsedInput: { id: detailId } }) => {
    try {
      await prisma.details_commande_db.delete({
        where: { iddetails: detailId },
      })

      revalidatePath("/admin/commandes")
      revalidatePath("/modifier-commande")
      return { success: true, detailId }
    } catch (error) {
      console.error("❌ Error in removePlatFromCommande:", error)
      throw new Error("Impossible de retirer le plat de la commande")
    }
  })
