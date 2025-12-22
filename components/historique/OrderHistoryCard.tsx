"use client"

import { CommandeActionButtons } from "@/components/historique/ActionButtons"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { Card, CardContent } from "@/components/ui/card"
import { toSafeNumber } from "@/lib/serialization"
import type { CommandeUI, ExtraUI } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, ChefHat, ClipboardCheck, Clock, PackageCheck, Store } from "lucide-react"
import React, { useMemo } from "react"

interface OrderHistoryCardProps {
  commande: CommandeUI
  canEdit: boolean
  extras?: ExtraUI[]
}

export const OrderHistoryCard = React.memo<OrderHistoryCardProps>(
  ({ commande, canEdit, extras }) => {
    // Calcul du total
    const total = useMemo(() => {
      if (commande.prix_total != null) return toSafeNumber(commande.prix_total)
      return (
        commande.details?.reduce((acc, detail) => {
          const quantite = detail.quantite_plat_commande || 0
          let prixUnitaire = 0
          if (detail.type === "extra" && detail.plat_r && extras) {
            const extraData = extras.find((e: ExtraUI) => e.idextra === detail.plat_r)
            prixUnitaire = toSafeNumber(extraData?.prix || detail.prix_unitaire)
          } else {
            prixUnitaire = toSafeNumber(detail.prix_unitaire || detail.plat?.prix)
          }
          return acc + prixUnitaire * quantite
        }, 0) || 0
      )
    }, [commande, extras])

    const dateRetrait = commande.date_et_heure_de_retrait_souhaitees
      ? new Date(commande.date_et_heure_de_retrait_souhaitees)
      : null

    const statusStyles = useMemo(() => {
      switch (commande.statut_commande) {
        case "En attente de confirmation":
          return {
            border: "border-thai-orange",
            header: "bg-linear-to-r from-thai-orange to-orange-400 text-white",
            footer: "bg-thai-orange text-white",
            textTotal: "text-white",
            badge: "bg-white/20 text-white",
            hoverBorder: "hover:border-thai-orange",
          }
        case "Confirmée":
          return {
            border: "border-blue-500",
            header: "bg-linear-to-r from-blue-600 to-blue-500 text-white",
            footer: "bg-blue-600 text-white",
            textTotal: "text-white",
            badge: "bg-white/20 text-white",
            hoverBorder: "hover:border-blue-500",
          }
        case "En préparation":
          return {
            border: "border-yellow-500",
            header: "bg-linear-to-r from-yellow-500 to-amber-500 text-white",
            footer: "bg-yellow-500 text-white",
            textTotal: "text-white",
            badge: "bg-white/20 text-white",
            hoverBorder: "hover:border-yellow-500",
          }
        case "Prête à récupérer":
          return {
            border: "border-yellow-400",
            header: "bg-linear-to-r from-yellow-400 to-yellow-300 text-yellow-950",
            footer: "bg-yellow-400 text-yellow-950",
            textTotal: "text-yellow-950",
            badge: "bg-yellow-900/10 text-yellow-950",
            hoverBorder: "hover:border-yellow-400",
          }
        case "Récupérée":
          return {
            border: "border-thai-green",
            header: "bg-linear-to-r from-thai-green to-emerald-600 text-white",
            footer: "bg-thai-green text-white",
            textTotal: "text-white",
            badge: "bg-white/20 text-white",
            hoverBorder: "hover:border-thai-green",
          }
        default:
          return {
            border: "border-gray-200",
            header: "bg-gray-100 text-gray-700",
            footer: "bg-gray-100 text-gray-700",
            textTotal: "text-gray-900",
            badge: "bg-black/10 text-gray-700",
            hoverBorder: "hover:border-gray-300",
          }
      }
    }, [commande.statut_commande])

    return (
      <Card
        className={`overflow-hidden border-2 shadow-xl transition-all duration-300 hover:shadow-2xl ${statusStyles.border}`}
      >
        <CardContent className="p-0">
          {/* En-tête "Admin Style" */}
          {/* En-tête Pleine Largeur Coloré (Nouveau Design) */}
          <div
            className={`relative flex flex-col items-center justify-between gap-4 overflow-hidden px-6 py-5 shadow-sm transition-all duration-300 md:flex-row ${statusStyles.header}`}
          >
            {/* Décoration d'arrière-plan (légère texture) */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/5 blur-2xl" />

            {/* Gauche : DATE + HEURE */}
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-1 text-center md:w-auto md:items-start md:text-left">
              {dateRetrait && (
                <div className="flex flex-col text-white drop-shadow-md">
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <Calendar className="h-6 w-6" />
                    <span className="text-2xl leading-tight font-black capitalize">
                      {format(dateRetrait, "EEEE d MMMM HH:mm", { locale: fr })}
                    </span>
                  </div>
                  {commande.date_de_prise_de_commande && (
                    <span className="pl-8 text-sm font-medium opacity-90">
                      (Commandé le{" "}
                      {format(new Date(commande.date_de_prise_de_commande), "dd/MM/yy à HH:mm", {
                        locale: fr,
                      })}
                      )
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Droite : Info Commande & Statut (Style Card Blanc "Image 1") */}
            <div className="relative z-10 flex w-full flex-col items-center md:w-auto md:items-end">
              <div className="flex min-w-[200px] flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-lg">
                {/* Statut Badge (En Premier) */}
                <div
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-1.5 ${
                    commande.statut_commande === "En attente de confirmation"
                      ? "bg-orange-50 text-orange-600"
                      : commande.statut_commande === "Confirmée"
                        ? "bg-blue-50 text-blue-600"
                        : commande.statut_commande === "En préparation"
                          ? "bg-amber-50 text-amber-600"
                          : commande.statut_commande === "Prête à récupérer"
                            ? "bg-yellow-50 text-yellow-700"
                            : commande.statut_commande === "Récupérée"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {commande.statut_commande === "En attente de confirmation" && (
                    <Clock className="h-4 w-4" />
                  )}
                  {commande.statut_commande === "Confirmée" && (
                    <ClipboardCheck className="h-4 w-4" />
                  )}
                  {commande.statut_commande === "En préparation" && <ChefHat className="h-4 w-4" />}
                  {commande.statut_commande === "Prête à récupérer" && (
                    <Store className="h-4 w-4" />
                  )}
                  {commande.statut_commande === "Récupérée" && <PackageCheck className="h-4 w-4" />}

                  <span className="font-bold whitespace-nowrap">
                    {commande.statut_commande || "Inconnu"}
                  </span>
                </div>

                {/* Commande N° (En Dessous) */}
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-thai-green text-sm font-bold tracking-wide uppercase">
                    Commande n°
                  </span>
                  <span className="text-thai-orange-dark text-xl font-black">
                    {commande.idcommande}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Barre d'actions (Séparée, en dessous de header comme Image 3) */}
          <div className="flex justify-end border-b border-gray-100 bg-gray-50/40 px-6 py-3">
            <CommandeActionButtons
              commandeId={commande.idcommande}
              canEdit={canEdit}
              commande={commande}
            />
          </div>

          {/* Corps de la carte */}
          <div className="bg-gray-50/30 p-6">
            {/* Liste des plats (Vertical List comme Admin) */}
            <div className="space-y-3">
              {commande.details?.map((detail, index) => {
                const isExtra = detail.type === "extra"
                const platName = isExtra
                  ? detail.nom_plat || "Extra"
                  : detail.plat?.plat || "Plat supprimé"
                const imageUrl = isExtra ? detail.extra?.photo_url : detail.plat?.photo_du_plat
                const prixUnitaire = isExtra
                  ? toSafeNumber(detail.prix_unitaire)
                  : toSafeNumber(detail.prix_unitaire || detail.plat?.prix)

                const quantite = detail.quantite_plat_commande || 1
                const platData = detail.plat as any
                const niveauEpice = platData?.niveau_epice ?? 0
                const isSpicy = niveauEpice > 0

                // Fallback distribution si manquante pour les plats épicés
                let spiceDist = detail.spice_distribution as number[]
                if (
                  isSpicy &&
                  (!spiceDist || spiceDist.length === 0 || spiceDist.every((v) => v === 0))
                ) {
                  // Créer une distribution par défaut basée sur le niveau d'épice du plat
                  // Assumant SmartSpice supporte 4 niveaux (0, 1, 2, 3)
                  const safeLevel = Math.min(Math.max(0, niveauEpice), 3)
                  spiceDist = [0, 0, 0, 0]
                  spiceDist[safeLevel] = quantite
                }

                return (
                  <div key={`${detail.iddetails || index}`} className="w-full">
                    {/* CartItemCard forcée en pleine largeur pour faire "Row" */}
                    <CartItemCard
                      name={platName}
                      imageUrl={imageUrl || undefined}
                      unitPrice={prixUnitaire}
                      quantity={quantite}
                      isVegetarian={!!platData?.est_vegetarien}
                      isSpicy={isSpicy}
                      readOnly={true}
                      showSpiceSelector={isSpicy}
                      spiceDistribution={spiceDist}
                      onQuantityChange={() => {}}
                      onRemove={() => {}}
                      desktopImageWidth="w-24" // Image un peu plus grande pour la liste
                      className="w-full"
                      cardClassName={statusStyles.hoverBorder}
                    />
                  </div>
                )
              })}
            </div>

            {/* Total Bar (Style Admin) */}
            <div
              className={`mt-6 flex items-center justify-between rounded-lg p-5 ${statusStyles.footer}`}
            >
              <span className={`text-lg font-semibold opacity-90 ${statusStyles.textTotal}`}>
                Total de la commande
              </span>
              <span className={`text-2xl font-bold ${statusStyles.textTotal}`}>
                {total.toFixed(2).replace(".", ",")}€
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

OrderHistoryCard.displayName = "OrderHistoryCard"
