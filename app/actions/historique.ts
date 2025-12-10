"use server"

import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { authAction } from "@/lib/safe-action"
import type { CommandeUI } from "@/types/app"

function mapStatutCommande(statut: string | null): CommandeUI["statut_commande"] {
  if (!statut) return "En attente de confirmation"
  const mapping: Record<string, CommandeUI["statut_commande"]> = {
    En_attente_de_confirmation: "En attente de confirmation",
    Confirm_e: "Confirmée",
    En_preparation: "En préparation",
    En_pr_paration: "En préparation",
    Prete_a_recuperer: "Prête à récupérer",
    Pr_te___r_cup_rer: "Prête à récupérer",
    Recuperee: "Récupérée",
    R_cup_r_e: "Récupérée",
    Annulee: "Annulée",
    Annul_e: "Annulée",
    Refusee: "Refusée",
  }
  return mapping[statut] || "En attente de confirmation"
}

function mapStatutPaiement(statut: string | null): CommandeUI["statut_paiement"] {
  if (!statut) return "En attente (sur place)"
  const mapping: Record<string, CommandeUI["statut_paiement"]> = {
    En_attente_sur_place: "En attente (sur place)",
    Paye_en_ligne: "Payé en ligne",
    Pay__en_ligne: "Payé en ligne",
    Paye_sur_place: "Payé sur place",
    Pay__sur_place: "Payé sur place",
    Rembourse: "Remboursé",
    En_attente: "En attente",
    Non_pay_: "Non payé",
    Pay_e: "Payée",
  }
  return mapping[statut] || "En attente (sur place)"
}

function mapTypeLivraison(type: string | null): CommandeUI["type_livraison"] {
  if (!type) return null
  const mapping: Record<string, CommandeUI["type_livraison"]> = {
    emporter: "À emporter",
    A_emporter: "À emporter",
    Livraison: "Livraison",
    Sur_place: "Sur place",
  }
  return mapping[type] || null
}

export const getPaginatedHistory = authAction(
  getHistorySchema,
  async ({ page, pageSize, status }, { session }) => {
    // Check if user is authenticated
    if (!session?.user?.email) {
      throw new Error("Vous devez être connecté pour voir votre historique")
    }

    // Get client info
    const client = await prisma.client_db.findUnique({
      where: { auth_user_id: session.user.id },
    })

    if (!client) {
      throw new Error("Compte client introuvable")
    }

    // Build where clause
    const whereInput: Prisma.commande_dbWhereInput = {
      client_id: client.idclient,
    }

    // Optional: add status filtering if needed
    if (status) {
      // Need to reverse map UI status to DB status if we want to filter by status
      // For now, ignoring status filter in fetch, or assume 'status' is DB enum value
    }

    const skip = (page - 1) * pageSize

    const [commandes, total] = await prisma.$transaction([
      prisma.commande_db.findMany({
        where: whereInput,
        include: {
          client_db: true,
          details_commande_db: {
            include: {
              plats_db: true,
              extras_db: true,
            },
          },
        },
        orderBy: {
          date_de_prise_de_commande: "desc",
        },
        skip,
        take: pageSize,
      }),
      prisma.commande_db.count({ where: whereInput }),
    ])

    const totalPages = Math.ceil(total / pageSize)

    const mappedCommandes: CommandeUI[] = commandes.map((c) => {
      const prix_total = (
        c.details_commande_db?.reduce((sum: number, detail) => {
          return (
            sum +
            (parseFloat(detail.prix_unitaire?.toString() || "0") || 0) *
              (detail.quantite_plat_commande || 0)
          )
        }, 0) || 0
      ).toFixed(2)

      return {
        id: c.idcommande,
        idcommande: c.idcommande,
        created_at: c.date_de_prise_de_commande?.toISOString() || null,
        client_id: c.client_r_id ? Number(c.client_r_id) : null,
        statut_commande: mapStatutCommande(c.statut_commande),
        date_commande: c.date_de_prise_de_commande?.toISOString() || null,
        heure_retrait: c.date_et_heure_de_retrait_souhaitees?.toISOString() || null,
        total: Number(prix_total), // Keep it numeric if UI expects number, or string if needed
        prix_total: prix_total, // Add explicit string field if UI uses it
        notes: c.notes_internes || null,
        notes_internes: c.notes_internes || null,
        statut_paiement: mapStatutPaiement(c.statut_paiement),
        moyen_paiement: c.statut_paiement === "Sur_place" ? "Sur place" : "En ligne",
        type_livraison: mapTypeLivraison(c.type_livraison),
        frais_livraison: 0,
        adresse_livraison: c.adresse_specifique || null,
        code_promo: null,
        remise: 0,
        source_commande: "Web",
        est_paye: c.statut_paiement === "Paye_en_ligne" || c.statut_paiement === "Paye_sur_place",
        stripe_payment_intent_id: null,
        date_modification: null,
        modifie_par: null,
        version: 1,
        updated_at: null,
        date_et_heure_de_retrait_souhaitees:
          c.date_et_heure_de_retrait_souhaitees?.toISOString() || null,
        demande_special_pour_la_commande: c.demande_special_pour_la_commande || null,
        adresse_specifique: c.adresse_specifique || null,
        client_r: c.client_r || null,
        date_de_prise_de_commande: c.date_de_prise_de_commande?.toISOString() || null,
        nom_evenement: c.nom_evenement || null,
        epingle: c.epingle ?? false,

        client: c.client_db
          ? {
              idclient: Number(c.client_db.idclient),
              nom: c.client_db.nom || null,
              prenom: c.client_db.prenom || null,
              email: c.client_db.email || null,
              numero_de_telephone: c.client_db.numero_de_telephone || null,
              adresse_numero_et_rue: c.client_db.adresse_numero_et_rue || null,
              ville: c.client_db.ville || null,
              code_postal: c.client_db.code_postal || null,
              preference_client: c.client_db.preference_client || null,
              photo_client: c.client_db.photo_client || null,
              auth_user_id: c.client_db.auth_user_id,
            }
          : null,
        details: c.details_commande_db?.map((detail) => {
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
    })

    return {
      success: true,
      data: mappedCommandes,
      totalPages,
      total,
    }
  }
)
