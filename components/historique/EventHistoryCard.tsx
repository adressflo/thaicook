"use client"

import { EvenementActionButtons } from "@/components/historique/ActionButtons"
import { MyCalendarIcon } from "@/components/shared/MyCalendarIcon"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toSafeNumber } from "@/lib/serialization"
import type { EvenementUI } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle,
  Clock,
  Euro,
  FileText,
  PartyPopper,
  Phone,
  Users,
  XCircle,
} from "lucide-react"
import React, { useMemo, useState } from "react"

interface EventHistoryCardProps {
  evenement: EvenementUI
  canEdit: boolean
}

export const EventHistoryCard = React.memo<EventHistoryCardProps>(({ evenement, canEdit }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const datePrevue = evenement.date_evenement ? new Date(evenement.date_evenement) : null
  const heurePrevue = datePrevue ? format(datePrevue, "HH:mm") : null

  // Styles basés sur le statut - PALETTE VIOLET/INDIGO pour événements
  const statusStyles = useMemo(() => {
    const statut = evenement.statut_evenement as unknown as string

    switch (statut) {
      case "Demande initiale":
      case "Demande_initiale":
        return {
          borderColor: "border-violet-200",
          accentColor: "bg-violet-500",
          textColor: "text-violet-900",
          badgeBg: "bg-white/80",
          badgeTextColor: "text-violet-800",
          hoverBorder: "hover:border-violet-300",
          header: "bg-violet-50",
          headerTextColor: "text-violet-800",
          dateColor: "text-violet-600",
          contentBg: "bg-violet-50/50",
          showCalendar: false,
          customIcon: "/media/statut/evenement/evenement.svg",
          customVideo: "/media/statut/evenement/evenementsiffet.mp4",
          icon: Clock,
        }
      case "Contact établi":
      case "Contact__tabli":
        return {
          borderColor: "border-indigo-200",
          accentColor: "bg-indigo-500",
          textColor: "text-indigo-900",
          badgeBg: "bg-white/80",
          badgeTextColor: "text-indigo-800",
          hoverBorder: "hover:border-indigo-300",
          header: "bg-indigo-50",
          headerTextColor: "text-indigo-800",
          dateColor: "text-indigo-600",
          contentBg: "bg-indigo-50/50",
          showCalendar: false,
          customIcon: "/media/statut/evenement/evenement.svg",
          customVideo: "/media/statut/evenement/evenementsiffet.mp4",
          icon: Phone,
        }
      case "En préparation":
      case "En_pr_paration":
        return {
          borderColor: "border-purple-200",
          accentColor: "bg-purple-500",
          textColor: "text-purple-900",
          badgeBg: "bg-white/80",
          badgeTextColor: "text-purple-800",
          hoverBorder: "hover:border-purple-300",
          header: "bg-purple-50",
          headerTextColor: "text-purple-800",
          dateColor: "text-purple-600",
          contentBg: "bg-purple-50/50",
          showCalendar: false,
          customIcon: "/media/statut/evenement/evenement.svg",
          customVideo: "/media/statut/evenement/evenementsiffet.mp4",
          icon: CalendarDays,
        }
      case "Confirmé / Acompte reçu":
      case "Confirm____Acompte_re_u":
        return {
          borderColor: "border-fuchsia-200",
          accentColor: "bg-fuchsia-500",
          textColor: "text-fuchsia-900",
          badgeBg: "bg-white/80",
          badgeTextColor: "text-fuchsia-800",
          hoverBorder: "hover:border-fuchsia-300",
          header: "bg-fuchsia-50",
          headerTextColor: "text-fuchsia-800",
          dateColor: "text-fuchsia-600",
          contentBg: "bg-fuchsia-50/50",
          showCalendar: false,
          customIcon: "/media/statut/evenement/evenement.svg",
          customVideo: "/media/statut/evenement/evenementsiffet.mp4",
          icon: CalendarCheck,
        }
      case "Réalisé":
      case "R_alis_":
        return {
          borderColor: "border-teal-200",
          accentColor: "bg-teal-500",
          textColor: "text-teal-900",
          badgeBg: "bg-white/80",
          badgeTextColor: "text-teal-800",
          hoverBorder: "hover:border-teal-300",
          header: "bg-teal-50",
          headerTextColor: "text-teal-800",
          dateColor: "text-teal-600",
          contentBg: "bg-teal-50/50",
          showCalendar: false,
          customIcon: "/media/statut/evenement/evenement.svg",
          customVideo: "/media/statut/evenement/evenementsiffet.mp4",
          icon: CheckCircle,
        }
      case "Annulé":
      case "Annul_":
        return {
          borderColor: "border-rose-200",
          accentColor: "bg-rose-500",
          textColor: "text-rose-900",
          badgeBg: "bg-white/80",
          badgeTextColor: "text-rose-800",
          hoverBorder: "hover:border-rose-300",
          header: "bg-rose-50",
          headerTextColor: "text-rose-800",
          dateColor: "text-rose-600",
          contentBg: "bg-rose-50/50",
          showCalendar: false,
          customIcon: "/media/statut/evenement/evenement.svg",
          customVideo: "/media/statut/evenement/evenementsiffet.mp4",
          icon: XCircle,
        }
      default:
        return {
          borderColor: "border-violet-200",
          accentColor: "bg-violet-500",
          textColor: "text-violet-900",
          badgeBg: "bg-white/80",
          badgeTextColor: "text-violet-800",
          hoverBorder: "hover:border-violet-300",
          header: "bg-violet-50",
          headerTextColor: "text-violet-800",
          dateColor: "text-violet-600",
          contentBg: "bg-violet-50/50",
          showCalendar: false,
          customIcon: "/media/statut/evenement/evenement.svg",
          customVideo: "/media/statut/evenement/evenementsiffet.mp4",
          icon: PartyPopper,
        }
    }
  }, [evenement.statut_evenement])

  const StatusIcon = statusStyles.icon

  return (
    <Card
      className={`relative overflow-hidden border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${statusStyles.borderColor} group`}
    >
      <CardContent className="p-0">
        {/* Header Premium : Image (Gauche) | Date (Centre) | Statut & N° (Droite) */}
        <div
          className={`relative flex flex-col gap-4 border-b-2 border-dashed px-3 py-4 md:grid md:min-h-[120px] md:grid-cols-3 md:items-stretch md:gap-2 md:px-4 md:py-6 ${statusStyles.borderColor} ${statusStyles.header}`}
        >
          {/* Colonne 1 : Média (Image/Video/Calendrier) */}
          <div className="relative flex w-full shrink-0 items-center justify-center pl-0 md:w-auto md:justify-start md:pl-2">
            {statusStyles.showCalendar ? (
              datePrevue ? (
                <MyCalendarIcon
                  date={datePrevue}
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
              {datePrevue
                ? format(datePrevue, "EEEE d MMMM yyyy", { locale: fr })
                : "Date à définir"}
            </h3>
            <span className="text-lg font-bold drop-shadow-sm md:text-xl lg:text-2xl">
              {heurePrevue || "--:--"}
            </span>

            {/* Date de création en petit */}
            {evenement.created_at && (
              <span
                className={`mt-1 text-xs font-medium ${statusStyles.dateColor || (statusStyles.headerTextColor === "text-white" ? "text-white/80" : "opacity-70")}`}
              >
                (Demandé le{" "}
                {format(new Date(evenement.created_at), "dd/MM/yy 'à' HH:mm", {
                  locale: fr,
                })}
                )
              </span>
            )}
          </div>

          {/* Colonne 3 : Statut & Badge N° (Droite) */}
          <div className="flex w-full flex-col items-center justify-between gap-2 py-1 md:w-auto md:items-end md:gap-0">
            {/* Badge Statut */}
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm ring-1 backdrop-blur-sm ${
                statusStyles.badgeTextColor
                  ? `${statusStyles.badgeBg} ${statusStyles.badgeTextColor} ring-orange-200`
                  : "bg-white/20 text-white ring-white/30"
              }`}
            >
              <StatusIcon className="h-4 w-4" />
              <span className="text-base font-extrabold whitespace-nowrap">
                {evenement.statut_evenement}
              </span>
            </div>

            {/* Badge N° Événement */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${statusStyles.headerTextColor?.includes("amber") ? "text-amber-800/70" : "text-white/80"}`}
              >
                N°
              </span>
              <div className="bg-thai-green flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-white">
                {evenement.idevenements}
              </div>
            </div>
          </div>
        </div>
        {/* Fin du Header */}

        {/* Corps de la carte */}
        <div className={`px-4 py-4 ${statusStyles.contentBg || "bg-gray-50/30"}`}>
          {/* Nom de l'événement - Affiché seulement s'il existe */}
          {evenement.nom_evenement && (
            <div className="mb-4 text-center">
              <h4 className={`text-xl font-bold ${statusStyles.textColor}`}>
                🎉 {evenement.nom_evenement}
              </h4>
            </div>
          )}

          {/* Infos de l'événement - Grille 4 colonnes avec icônes colorées */}
          <div
            className={`grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-4 ${statusStyles.borderColor} bg-white/60`}
          >
            {/* Type */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-1 flex h-10 w-10 items-center justify-center rounded-full ${statusStyles.accentColor}`}
              >
                <PartyPopper className="h-5 w-5 text-white" />
              </div>
              <p className={`text-xs font-medium ${statusStyles.dateColor}`}>Type</p>
              <p className={`text-lg font-bold ${statusStyles.textColor}`}>
                {evenement.type_d_evenement || "-"}
              </p>
            </div>

            {/* Personnes */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-1 flex h-10 w-10 items-center justify-center rounded-full ${statusStyles.accentColor}`}
              >
                <Users className="h-5 w-5 text-white" />
              </div>
              <p className={`text-xs font-medium ${statusStyles.dateColor}`}>Invités</p>
              <p className={`text-lg font-bold ${statusStyles.textColor}`}>
                {evenement.nombre_de_personnes}
              </p>
            </div>

            {/* Budget */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-1 flex h-10 w-10 items-center justify-center rounded-full ${statusStyles.accentColor}`}
              >
                <Euro className="h-5 w-5 text-white" />
              </div>
              <p className={`text-xs font-medium ${statusStyles.dateColor}`}>Budget</p>
              <p className={`text-lg font-bold ${statusStyles.textColor}`}>
                {evenement.budget_client ? `${toSafeNumber(evenement.budget_client)}€` : "-"}
              </p>
            </div>

            {/* Plats sélectionnés */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-1 flex h-10 w-10 items-center justify-center rounded-full ${statusStyles.accentColor}`}
              >
                <FileText className="h-5 w-5 text-white" />
              </div>
              <p className={`text-xs font-medium ${statusStyles.dateColor}`}>Plats</p>
              <p className={`text-lg font-bold ${statusStyles.textColor}`}>
                {evenement.plats_preselectionnes?.length || 0}
              </p>
            </div>
          </div>

          {/* Demandes Spéciales */}
          {evenement.demandes_speciales_evenement && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="mb-1 text-sm font-semibold text-amber-800">📝 Demandes Spéciales</p>
              <p className="text-sm text-amber-700">{evenement.demandes_speciales_evenement}</p>
            </div>
          )}

          {/* Barre d'actions (Footer) */}
          <div className="mt-6 flex justify-center border-t-2 border-dashed pt-4 pb-2">
            <EvenementActionButtons evenementId={evenement.idevenements} canEdit={canEdit} />
          </div>
        </div>
      </CardContent>

      {/* Overlay Croix Rouge pour Statut Annulé */}
      {(evenement.statut_evenement as unknown as string) === "Annulé" && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[0.5px]">
          <div className="relative rotate-[-15deg] transform rounded-xl border-[6px] border-red-600/80 px-10 py-4 opacity-90 shadow-2xl transition-transform select-none hover:scale-105">
            <span className="text-5xl font-black tracking-[0.2em] text-red-600/90 uppercase drop-shadow-sm">
              Annulé
            </span>
          </div>
        </div>
      )}
    </Card>
  )
})

EventHistoryCard.displayName = "EventHistoryCard"
