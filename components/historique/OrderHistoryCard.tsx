"use client"

import { updateCommande } from "@/app/actions/commandes"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { CommandePlatModal } from "@/components/shared/CommandePlatModal"
import { MyCalendarIcon } from "@/components/shared/MyCalendarIcon"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toSafeNumber } from "@/lib/serialization"
import type { CommandeUI, ExtraUI } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ChefHat,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  PackageCheck,
  Store,
  XCircle,
} from "lucide-react"
import React, { useMemo, useState } from "react"
import { CommandeActionButtons } from "./ActionButtons"

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
    const heureRetrait = dateRetrait ? format(dateRetrait, "HH:mm") : null

    // Collapsible state pour longues commandes
    const [isExpanded, setIsExpanded] = useState(false)
    const [isVideoOpen, setIsVideoOpen] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedDetail, setSelectedDetail] = useState<any>(null)
    const maxVisibleItems = 3
    const hasMoreItems = (commande.details?.length || 0) > maxVisibleItems

    const statusStyles = useMemo(() => {
      switch (commande.statut_commande) {
        case "En attente de confirmation":
          return {
            borderColor: "border-amber-200",
            accentColor: "bg-amber-500",
            textColor: "text-amber-900",
            badgeBg: "bg-white/80",
            badgeTextColor: "text-amber-800",
            hoverBorder: "hover:border-amber-300",
            header: "bg-amber-50",
            headerTextColor: "text-amber-800",
            dateCommandeColor: "text-amber-600",
            contentBg: "bg-amber-50",
            showCalendar: false,
            customIcon: "/media/statut/enattentedeconfirmation/enattentedeconfirmation.svg",
            customVideo: "/media/statut/enattentedeconfirmation/enattentemontre.mp4",
          }
        case "Confirmée":
          return {
            borderColor: "border-emerald-200",
            accentColor: "bg-emerald-500",
            textColor: "text-emerald-900",
            badgeBg: "bg-white/80",
            badgeTextColor: "text-emerald-800",
            hoverBorder: "hover:border-emerald-300",
            header: "bg-emerald-50",
            headerTextColor: "text-emerald-800",
            dateCommandeColor: "text-emerald-600",
            contentBg: "bg-emerald-50",
            showCalendar: false,
            customIcon: "/media/statut/confirmee/confirmeestatut.svg",
            customVideo: "/media/statut/confirmee/confirmerimprimente.mp4",
          }
        case "En préparation":
          return {
            borderColor: "border-orange-200",
            accentColor: "bg-orange-500",
            textColor: "text-orange-900",
            badgeBg: "bg-white/80",
            badgeTextColor: "text-orange-800",
            hoverBorder: "hover:border-orange-300",
            header: "bg-orange-50",
            headerTextColor: "text-orange-800",
            dateCommandeColor: "text-orange-600",
            contentBg: "bg-orange-50",
            showCalendar: false,
            customIcon: "/media/statut/enpreparation/enpreparation1.svg",
            customVideo: "/media/statut/enpreparation/chanthanacuisine.mp4",
          }
        case "Prête à récupérer":
          return {
            borderColor: "border-yellow-200",
            accentColor: "bg-yellow-500",
            textColor: "text-yellow-900",
            badgeBg: "bg-white/80",
            badgeTextColor: "text-yellow-800",
            hoverBorder: "hover:border-yellow-300",
            header: "bg-yellow-50",
            headerTextColor: "text-yellow-800",
            dateCommandeColor: "text-yellow-600",
            contentBg: "bg-yellow-50",
            showCalendar: false,
            customIcon: "/media/statut/pretearecuperer/pretearecuperer.svg",
            customVideo: "/media/statut/pretearecuperer/gong.mp4",
          }
        case "Récupérée":
          return {
            borderColor: "border-green-200",
            accentColor: "bg-green-500",
            textColor: "text-green-900",
            badgeBg: "bg-white/80",
            badgeTextColor: "text-green-800",
            hoverBorder: "hover:border-green-300",
            header: "bg-green-50",
            headerTextColor: "text-green-800",
            dateCommandeColor: "text-green-600",
            contentBg: "bg-green-50",
            showCalendar: false,
            customIcon: "/media/statut/recuperee/recuperee.svg",
            customVideo: "/media/statut/recuperee/recuperee.mp4",
          }
        case "Annulée":
          return {
            borderColor: "border-red-200",
            accentColor: "bg-red-500",
            textColor: "text-red-900",
            badgeBg: "bg-white/80",
            badgeTextColor: "text-red-800",
            hoverBorder: "hover:border-red-300",
            header: "bg-red-50",
            headerTextColor: "text-red-800",
            dateCommandeColor: "text-red-600",
            contentBg: "bg-red-50",
            showCalendar: false,
            customIcon: "/media/statut/annule/annule.svg",
            customVideo: "/media/animations/toasts/poubelleok.mp4",
          }
        default:
          return {
            borderColor: "border-gray-200",
            accentColor: "bg-gray-500",
            textColor: "text-gray-600",
            badgeBg: "bg-gray-50",
            badgeTextColor: "text-gray-800",
            hoverBorder: "hover:border-gray-300",
            header: "bg-gray-100",
            headerTextColor: "text-gray-800",
            dateCommandeColor: "text-gray-500",
            contentBg: "bg-gray-50",
            showCalendar: true,
          }
      }
    }, [commande.statut_commande])

    const handleCancelOrder = async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (
        typeof window !== "undefined" &&
        window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")
      ) {
        try {
          await updateCommande({ id: commande.idcommande, statut_commande: "Annulée" })
        } catch (error) {
          console.error("Erreur lors de l'annulation:", error)
          alert("Impossible d'annuler la commande.")
        }
      }
    }

    return (
      <>
        <Card
          className={`relative overflow-hidden border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${statusStyles.borderColor} group`}
        >
          <CardContent className="p-0">
            {/* Header Premium : Image (Gauche) | Date (Centre) | Statut & N° (Droite) */}
            <div
              className={`relative flex flex-col gap-4 border-b-2 border-dashed px-3 py-4 md:grid md:min-h-[120px] md:grid-cols-3 md:items-stretch md:gap-2 md:px-4 md:py-6 ${statusStyles.borderColor} ${statusStyles.header}`}
            >
              {/* Bouton Annuler (Croix) - Visible seulement si annulable */}
              {/* Bouton Annuler supprimé selon demande utilisateur */}

              {/* Colonne 1 : Média (Image/Video/Calendrier) - REVENU A GAUCHE */}
              <div className="relative flex w-full shrink-0 items-center justify-center pl-0 md:w-auto md:justify-start md:pl-2">
                {statusStyles.showCalendar ? (
                  dateRetrait ? (
                    <MyCalendarIcon
                      date={dateRetrait}
                      size="sm"
                      borderWidth={1}
                      borderColor="custom"
                      customBorderColor="border-white/30"
                      hoverAnimation={false}
                      headerColor="custom"
                      customHeaderColor="bg-linear-to-b from-[#FFB74D] to-[#FF7043]"
                      timeBadgeColor="custom"
                      customTimeBadgeColor="bg-[#FBC02D]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 text-white">
                      <Clock className="h-8 w-8" />
                    </div>
                  )
                ) : statusStyles.customIcon ? (
                  statusStyles.customVideo ? (
                    <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                      <DialogTrigger asChild>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={statusStyles.customIcon}
                          alt="Statut"
                          className={`h-24 w-40 cursor-pointer rounded-lg object-cover shadow-md transition-transform hover:scale-105 ${statusStyles.headerTextColor.includes("amber") ? "border-2 border-amber-200" : ""}`}
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-md overflow-hidden rounded-xl p-0">
                        <video
                          src={statusStyles.customVideo}
                          autoPlay
                          muted
                          playsInline
                          onEnded={() => setIsVideoOpen(false)}
                          className="w-full"
                        />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={statusStyles.customIcon}
                      alt="Statut"
                      className={`h-24 w-40 rounded-lg object-cover shadow-md ${statusStyles.headerTextColor.includes("amber") ? "border-2 border-amber-200" : ""}`}
                    />
                  )
                ) : null}
              </div>

              {/* Colonne 2 : Date & Heure (Centre) */}
              <div
                className={`flex flex-col items-center justify-center pt-2 text-center ${statusStyles.headerTextColor || "text-white"}`}
              >
                <h3 className="text-xl font-black whitespace-nowrap capitalize drop-shadow-sm md:text-2xl lg:text-3xl">
                  {dateRetrait
                    ? format(dateRetrait, "EEEE d MMMM yyyy", { locale: fr })
                    : "Date inconnue"}
                </h3>
                <span className="text-lg font-bold drop-shadow-sm md:text-xl lg:text-2xl">
                  {heureRetrait || "--:--"}
                </span>

                {/* Date de commande en petit */}
                {commande.date_de_prise_de_commande && (
                  <span
                    className={`mt-1 text-xs font-medium ${statusStyles.dateCommandeColor || (statusStyles.headerTextColor === "text-white" ? "text-white/80" : "opacity-70")}`}
                  >
                    (Commandé le{" "}
                    {format(new Date(commande.date_de_prise_de_commande), "dd/MM/yy 'à' HH:mm", {
                      locale: fr,
                    })}
                    )
                  </span>
                )}
              </div>

              {/* Colonne 3 : Statut & Badge N° (Droite) */}
              <div className="flex w-full flex-col items-center justify-between gap-2 py-1 md:w-auto md:items-end md:gap-0">
                {/* Badge Statut (Maintenant en premier) */}
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm ring-1 backdrop-blur-sm ${
                    statusStyles.badgeTextColor
                      ? `${statusStyles.badgeBg} ${statusStyles.badgeTextColor} ring-orange-200`
                      : "bg-white/20 text-white ring-white/30"
                  } ${commande.statut_commande === "Prête à récupérer" ? "animate-pulse" : ""}`}
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
                  {commande.statut_commande === "Annulée" && <XCircle className="h-4 w-4" />}
                  <span className="text-base font-extrabold whitespace-nowrap">
                    {commande.statut_commande}
                  </span>
                </div>

                {/* Badge N° Commande (Maintenant en dessous) */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${statusStyles.headerTextColor?.includes("amber") ? "text-amber-800/70" : "text-white/80"}`}
                  >
                    N°
                  </span>
                  <div className="bg-thai-green flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-white">
                    {commande.idcommande}
                  </div>
                </div>
              </div>
            </div>
            {/* Fin du Header */}

            {/* Corps de la carte */}
            <div className={`px-4 py-2 ${statusStyles.contentBg || "bg-gray-50/30"}`}>
              {/* Liste des plats (Collapsible) */}
              <div className="space-y-2">
                {commande.details
                  ?.slice(0, isExpanded ? undefined : maxVisibleItems)
                  .map((detail, index) => {
                    const isExtra = detail.type === "extra"
                    const platName = isExtra
                      ? detail.nom_plat || "Extra"
                      : detail.plat?.plat || "Plat supprimé"
                    const imageUrl = isExtra ? detail.extra?.photo_url : detail.plat?.photo_du_plat
                    const prixUnitaire = isExtra
                      ? toSafeNumber(detail.prix_unitaire)
                      : toSafeNumber(detail.prix_unitaire || detail.plat?.prix)

                    const quantite = detail.quantite_plat_commande || 1
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const platData = detail.plat as any
                    const niveauEpice = platData?.niveau_epice ?? 0
                    const isSpicy = niveauEpice > 0

                    // Fallback distribution si manquante pour les plats épicés
                    let spiceDist = detail.spice_distribution as number[]
                    if (
                      isSpicy &&
                      (!spiceDist || spiceDist.length === 0 || spiceDist.every((v) => v === 0))
                    ) {
                      const safeLevel = Math.min(Math.max(0, niveauEpice), 3)
                      spiceDist = [0, 0, 0, 0]
                      spiceDist[safeLevel] = quantite
                    }

                    return (
                      <div
                        key={`${detail.iddetails || index}`}
                        className="w-full cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                        onClick={() => setSelectedDetail(detail)}
                      >
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
                          desktopImageWidth="w-24"
                          className="w-full"
                          cardClassName={statusStyles.hoverBorder}
                        />
                      </div>
                    )
                  })}
              </div>

              {/* Bouton Voir Plus/Moins */}
              {hasMoreItems && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Voir moins
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Voir {(commande.details?.length || 0) - maxVisibleItems} plat
                      {(commande.details?.length || 0) - maxVisibleItems > 1 ? "s" : ""} de plus
                    </>
                  )}
                </button>
              )}

              {/* Demandes Spéciales (En bas) */}
              {commande.demande_special_pour_la_commande && (
                <div className="mt-4 mb-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-1 text-sm font-semibold text-amber-800">📝 Demandes Spéciales</p>
                  <p className="text-sm text-amber-700">
                    {commande.demande_special_pour_la_commande}
                  </p>
                </div>
              )}

              {/* Total Bar */}
              <div
                className={`mt-6 flex items-center justify-between border-y-2 border-dashed py-5 ${statusStyles.borderColor}`}
              >
                <span className="text-lg font-extrabold text-amber-800 opacity-90">
                  Total de la commande
                </span>
                <span className="text-2xl font-black text-orange-600">
                  {total.toFixed(2).replace(".", ",")}€
                </span>
              </div>

              {/* Barre d'actions (Footer) */}
              <div className="mt-4 flex justify-center pb-2 md:mt-6">
                <CommandeActionButtons
                  commandeId={commande.idcommande}
                  canEdit={
                    canEdit &&
                    !["En préparation", "Prête à récupérer", "Récupérée", "Annulée"].includes(
                      commande.statut_commande || ""
                    )
                  }
                  commande={commande}
                  onCancel={handleCancelOrder}
                />
              </div>
            </div>
          </CardContent>

          {/* Overlay Croix Rouge pour Statut Annulé */}
          {commande.statut_commande === "Annulée" && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[0.5px]">
              <div className="relative rotate-[-15deg] transform rounded-xl border-[6px] border-red-600/80 px-10 py-4 opacity-90 shadow-2xl transition-transform select-none hover:scale-105">
                <span className="text-5xl font-black tracking-[0.2em] text-red-600/90 uppercase drop-shadow-sm">
                  Annulée
                </span>
              </div>
            </div>
          )}
        </Card>

        <CommandePlatModal
          plat={selectedDetail?.plat || null}
          detail={selectedDetail}
          isOpen={!!selectedDetail}
          onOpenChange={(open) => !open && setSelectedDetail(null)}
          formatPrix={(prix) => `${toSafeNumber(prix).toFixed(2).replace(".", ",")}€`}
          mode="readonly"
          showPriceDetails={true}
          currentQuantity={selectedDetail?.quantite_plat_commande || 0}
          showQuantitySelector={false}
          showAddToCartButton={false}
        />
      </>
    )
  }
)

OrderHistoryCard.displayName = "OrderHistoryCard"
