"use server"

import { prisma } from "@/lib/prisma"
import { authAction } from "@/lib/safe-action"
import { documentSchema, documentUpdateSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

// --- CREATE ---
export const createDocument = authAction.schema(documentSchema).action(async ({ parsedInput }) => {
  // 1. Générer un numéro de référence unique (ex: D-2026-001)
  // Pour l'instant, on fait simple : TIMESTAMP + RANDOM.
  // TODO: Faire un vrai compteur séquentiel si demandé.
  const year = new Date().getFullYear()
  const count = await prisma.document_admin.count({
    where: {
      created_at: {
        gte: new Date(`${year}-01-01`),
      },
    },
  })
  const sequence = (count + 1).toString().padStart(3, "0")
  const prefix = parsedInput.type === "DEVIS" ? "D" : parsedInput.type === "FACTURE" ? "F" : "DOC"
  const ref = `${prefix}-${year}-${sequence}`

  // 2. Calculer les totaux (Sécurité serveur)
  const total_ht = parsedInput.lignes.reduce((acc, l) => acc + l.quantite * l.prix_unitaire, 0)
  const total_ttc = total_ht // TODO: Ajouter gestion TVA si > 0

  // 3. Sauvegarder
  const doc = await prisma.document_admin.create({
    data: {
      numero_ref: ref,
      type: parsedInput.type,
      statut: parsedInput.statut,
      client_id: parsedInput.client_id ? BigInt(parsedInput.client_id) : null,

      // Sauvegarde des infos "Snapshot"
      nom_client_snapshot: parsedInput.nom_client_snapshot,
      adresse_client_snapshot: parsedInput.adresse_client_snapshot,

      date_creation: parsedInput.date_creation,
      date_echeance: parsedInput.date_echeance,

      total_ht: total_ht,
      tva_montant: 0,
      total_ttc: total_ttc,

      lignes_json: JSON.stringify(parsedInput.lignes), // Stockage JSON

      notes_privees: parsedInput.notes_privees,
      mentions_legales: parsedInput.mentions_legales,
    },
  })

  revalidatePath("/admin/documents")
  return { success: true, document: doc }
})

// --- UPDATE ---
export const updateDocument = authAction
  .schema(documentUpdateSchema)
  .action(async ({ parsedInput }) => {
    const { id, lignes, ...data } = parsedInput

    // Recalcul si lignes modifiées
    let financialData = {}
    if (lignes) {
      const total_ht = lignes.reduce((acc, l) => acc + l.quantite * l.prix_unitaire, 0)
      financialData = {
        total_ht,
        total_ttc: total_ht, // + TVA
        lignes_json: JSON.stringify(lignes),
      }
    }

    const doc = await prisma.document_admin.update({
      where: { id },
      data: {
        ...data,
        ...financialData,
        client_id: data.client_id ? BigInt(data.client_id) : undefined,
        nom_client_snapshot: data.nom_client_snapshot,
        adresse_client_snapshot: data.adresse_client_snapshot,
      },
    })

    revalidatePath("/admin/documents")
    return { success: true, document: doc }
  })

// --- GET ALL ---
export const getDocuments = async () => {
  const docs = await prisma.document_admin.findMany({
    orderBy: { created_at: "desc" },
    include: { client: true },
  })

  // Serialization BigInt
  return docs.map((d) => ({
    ...d,
    client_id: d.client_id?.toString(),
    // @ts-ignore
    client: d.client ? { ...d.client, idclient: d.client.idclient.toString() } : null,
  }))
}

// --- GET ONE ---
export const getDocumentById = async (id: string) => {
  const doc = await prisma.document_admin.findUnique({
    where: { id },
    include: { client: true },
  })

  if (!doc) return null

  return {
    ...doc,
    client_id: doc.client_id?.toString(),
    // @ts-ignore
    client: doc.client ? { ...doc.client, idclient: doc.client.idclient.toString() } : null,
    lignes: doc.lignes_json ? JSON.parse(doc.lignes_json as string) : [],
  }
}
