"use server"

import type { client_db, evenements_db } from "@/generated/prisma/client"
import { Prisma } from "@/generated/prisma/client"
import { Decimal } from "@/generated/prisma/client/runtime/library"
import { prisma } from "@/lib/prisma"
import { authAction } from "@/lib/safe-action"
import { evenementSchema, evenementUpdateSchema, getByIdSchema } from "@/lib/validations"
import type { EvenementUI } from "@/types/app"
import { revalidatePath } from "next/cache"
import { z } from "zod"

type EvenementWithRelations = evenements_db & {
  client_db: client_db | null
}

function convertEvenementToUI(evenement: EvenementWithRelations): EvenementUI {
  return {
    ...evenement,
    id: evenement.idevenements,
    contact_client_r_id: evenement.contact_client_r_id
      ? Number(evenement.contact_client_r_id)
      : null,
    budget_client: evenement.budget_client?.toString() || null,
    prix_total_devise: evenement.prix_total_devise?.toString() || null,
    acompte_demande: evenement.acompte_demande?.toString() || null,
    acompte_recu: evenement.acompte_recu?.toString() || null,
    date_evenement: evenement.date_evenement?.toISOString() || null,
    date_acompte_recu: evenement.date_acompte_recu?.toISOString() || null,
    created_at: evenement.created_at?.toISOString() || null,
    updated_at: evenement.updated_at?.toISOString() || null,
    client_r_id: evenement.contact_client_r_id ? Number(evenement.contact_client_r_id) : null,
    type_evenement: evenement.type_d_evenement || null,
    budget_estime: evenement.budget_client?.toString() || null,
    demandes_speciales: evenement.demandes_speciales_evenement || null,
    statut: evenement.statut_evenement || null,
    notes_internes: evenement.notes_internes_evenement || null,
    client: evenement.client_db
      ? {
          nom: evenement.client_db.nom || null,
          prenom: evenement.client_db.prenom || null,
          email: evenement.client_db.email || null,
          numero_de_telephone: evenement.client_db.numero_de_telephone || null,
        }
      : null,
  } as EvenementUI
}

export async function getEvenementsByClient(clientId: number): Promise<EvenementUI[]> {
  try {
    const evenements = await prisma.evenements_db.findMany({
      where: { contact_client_r_id: BigInt(clientId) },
      include: {
        client_db: true,
      },
      orderBy: { date_evenement: "desc" },
    })

    return evenements.map(convertEvenementToUI)
  } catch (error) {
    console.error("❌ Error in getEvenementsByClient:", error)
    throw new Error("Impossible de récupérer les événements du client")
  }
}

export async function getEvenementById(id: number): Promise<EvenementUI | null> {
  try {
    const evenement = await prisma.evenements_db.findUnique({
      where: { idevenements: id },
      include: {
        client_db: true,
      },
    })

    return evenement ? convertEvenementToUI(evenement) : null
  } catch (error) {
    console.error("❌ Error in getEvenementById:", error)
    throw new Error("Impossible de récupérer l'événement")
  }
}

export const createEvenement = authAction
  .schema(evenementSchema.extend({ contact_client_r_id: z.number() }))
  .action(async ({ parsedInput: data }) => {
    try {
      // Destructure and map fields explicitly to avoid passing unknown arguments to Prisma

      const { budget_approximatif, description_evenement, type_d_evenement, ...rest } = data

      // Map Zod fields to Prisma fields
      const createData: Prisma.evenements_dbUncheckedCreateInput = {
        nom_evenement: rest.nom_evenement,
        contact_client_r: rest.contact_client_r,
        contact_client_r_id: BigInt(rest.contact_client_r_id),
        date_evenement: new Date(rest.date_evenement),
        type_d_evenement: type_d_evenement, // Ajout du mapping
        nombre_de_personnes: rest.nombre_personnes,
        budget_client: budget_approximatif ? new Decimal(budget_approximatif) : null,
        demandes_speciales_evenement: description_evenement || null,
        statut_evenement: "Demande_initiale",
        plats_preselectionnes: rest.plats_preselectionnes,
      }

      const evenement = await prisma.evenements_db.create({
        data: createData,
        include: {
          client_db: true,
        },
      })

      revalidatePath("/evenements")
      revalidatePath("/historique")
      revalidatePath("/suivi")

      return convertEvenementToUI(evenement)
    } catch (error) {
      console.error("❌ Error in createEvenement:", error)
      throw new Error("Impossible de créer l'événement")
    }
  })

export const updateEvenement = authAction
  .schema(evenementUpdateSchema.extend({ id: z.number() }))
  .action(async ({ parsedInput: { id, ...data } }) => {
    try {
      // Destructure to separate special handling and remove unknown fields

      const {
        budget_approximatif,
        date_evenement,
        description_evenement,
        type_d_evenement,
        ...rest
      } = data

      const updateData: Prisma.evenements_dbUpdateInput = {}

      // Only add fields if they are defined in 'rest' and exist in DB
      if (rest.nom_evenement) updateData.nom_evenement = rest.nom_evenement
      if (rest.nombre_personnes) updateData.nombre_de_personnes = rest.nombre_personnes
      if (rest.contact_client_r) updateData.contact_client_r = rest.contact_client_r
      if (rest.plats_preselectionnes) updateData.plats_preselectionnes = rest.plats_preselectionnes

      // Handle mapped fields
      if (type_d_evenement) {
        updateData.type_d_evenement = type_d_evenement
      }

      if (description_evenement !== undefined) {
        updateData.demandes_speciales_evenement = description_evenement
      }

      if (date_evenement) {
        updateData.date_evenement = new Date(date_evenement)
      }
      if (budget_approximatif) {
        updateData.budget_client = new Decimal(budget_approximatif)
      }

      const evenement = await prisma.evenements_db.update({
        where: { idevenements: id },
        data: updateData,
        include: {
          client_db: true,
        },
      })

      revalidatePath("/evenements")
      revalidatePath("/historique")
      revalidatePath("/suivi")
      revalidatePath("/modifier-evenement")

      return convertEvenementToUI(evenement)
    } catch (error) {
      console.error("❌ Error in updateEvenement:", error)
      throw new Error("Impossible de mettre à jour l'événement")
    }
  })

export const deleteEvenement = authAction
  .schema(getByIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      await prisma.evenements_db.delete({
        where: { idevenements: id },
      })

      revalidatePath("/evenements")
      revalidatePath("/historique")
      revalidatePath("/suivi")

      return { success: true, id }
    } catch (error) {
      console.error("❌ Error in deleteEvenement:", error)
      throw new Error("Impossible de supprimer l'événement")
    }
  })

export async function getAllEvenements(): Promise<EvenementUI[]> {
  try {
    const evenements = await prisma.evenements_db.findMany({
      include: {
        client_db: true,
      },
      orderBy: { date_evenement: "desc" },
    })

    return evenements.map(convertEvenementToUI)
  } catch (error) {
    console.error("❌ Error in getAllEvenements:", error)
    throw new Error("Impossible de récupérer tous les événements")
  }
}
