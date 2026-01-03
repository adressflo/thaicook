"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
// Import Lucide icons used in badges
import { ChefHat, ClipboardCheck, Clock, PackageCheck, Store, X } from "lucide-react"
import React, { useState } from "react"

// Types definitions based on OrderHistoryCard
interface Styles {
  borderColor: string
  accentColor: string
  textColor: string
  badgeBg: string
  badgeTextColor: string
  header: string
  headerTextColor?: string
  contentBg: string
  customIcon: string
  customVideo?: string
  dateCommandeColor?: string
}

interface TimelineStep {
  id: string
  title: string
  description: string
  date?: Date | string | null
  styles: Styles
  status: "completed" | "current" | "pending" | "cancelled"
  badgeIcon: React.ReactNode
}

interface ProgressTimelineProps {
  currentStatus: string | null
  dateCommande?: Date | string | null
  dateRetrait?: Date | string | null
}

export function ProgressTimeline({
  currentStatus,
  dateCommande,
  dateRetrait,
}: ProgressTimelineProps) {
  const [openVideoId, setOpenVideoId] = useState<string | null>(null)

  // 1. Definition EXACTE des styles de OrderHistoryCard
  const stepStyles: Record<string, Styles> = {
    commande: {
      borderColor: "border-amber-200",
      accentColor: "bg-amber-500",
      textColor: "text-amber-900",
      badgeBg: "bg-white/80",
      badgeTextColor: "text-amber-800",
      header: "bg-amber-50",
      headerTextColor: "text-amber-800",
      dateCommandeColor: "text-amber-600",
      contentBg: "bg-amber-50",
      customIcon: "/media/statut/enattentedeconfirmation/enattentedeconfirmation.svg",
      customVideo: "/media/statut/enattentedeconfirmation/enattentemontre.mp4",
    },
    confirmation: {
      borderColor: "border-emerald-200",
      accentColor: "bg-emerald-500",
      textColor: "text-emerald-900",
      badgeBg: "bg-white/80",
      badgeTextColor: "text-emerald-800",
      header: "bg-emerald-50",
      headerTextColor: "text-emerald-800",
      dateCommandeColor: "text-emerald-600",
      contentBg: "bg-emerald-50",
      customIcon: "/media/statut/confirmee/confirmeestatut.svg",
      customVideo: "/media/statut/confirmee/confirmerimprimente.mp4",
    },
    preparation: {
      borderColor: "border-orange-200",
      accentColor: "bg-orange-500",
      textColor: "text-orange-900",
      badgeBg: "bg-white/80",
      badgeTextColor: "text-orange-800",
      header: "bg-orange-50",
      headerTextColor: "text-orange-800",
      dateCommandeColor: "text-orange-600",
      contentBg: "bg-orange-50",
      customIcon: "/media/statut/enpreparation/enpreparation1.svg",
      customVideo: "/media/statut/enpreparation/chanthanacuisine.mp4",
    },
    prete: {
      borderColor: "border-yellow-200",
      accentColor: "bg-yellow-500",
      textColor: "text-yellow-900",
      badgeBg: "bg-white/80",
      badgeTextColor: "text-yellow-800",
      header: "bg-yellow-50",
      headerTextColor: "text-yellow-800",
      dateCommandeColor: "text-yellow-600",
      contentBg: "bg-yellow-50",
      customIcon: "/media/statut/pretearecuperer/pretearecuperer.svg",
      customVideo: "/media/statut/pretearecuperer/gong.mp4",
    },
    recuperee: {
      borderColor: "border-green-200",
      accentColor: "bg-green-500",
      textColor: "text-green-900",
      badgeBg: "bg-white/80",
      badgeTextColor: "text-green-800",
      header: "bg-green-50",
      headerTextColor: "text-green-800",
      dateCommandeColor: "text-green-600",
      contentBg: "bg-green-50",
      customIcon: "/media/statut/recuperee/recuperee.svg",
      customVideo: "/media/statut/recuperee/recuperee.mp4",
    },
    annulee: {
      borderColor: "border-red-200",
      accentColor: "bg-red-500",
      textColor: "text-red-900",
      badgeBg: "bg-white/80",
      badgeTextColor: "text-red-800",
      header: "bg-red-50",
      headerTextColor: "text-red-800",
      dateCommandeColor: "text-red-600",
      contentBg: "bg-red-50",
      customIcon: "/media/statut/annule/annule.svg",
      customVideo: "/media/animations/toasts/poubelleok.mp4",
    },
    // Style grisé pour les étapes futures
    pending: {
      borderColor: "border-gray-200",
      accentColor: "bg-gray-500",
      textColor: "text-gray-400",
      badgeBg: "bg-gray-50",
      badgeTextColor: "text-gray-400",
      header: "bg-gray-50",
      headerTextColor: "text-gray-400",
      dateCommandeColor: "text-gray-400",
      contentBg: "bg-gray-50",
      customIcon: "", // Will use fallback
      customVideo: undefined,
    },
  }

  const getTimelineSteps = (): TimelineStep[] => {
    // Determine visuals based on step ID
    const stepsData = [
      {
        id: "commande",
        title: "Commande passée",
        description: "Enregistrée",
        date: dateCommande,
        styles: stepStyles.commande,
        badgeIcon: <Clock className="h-4 w-4" />,
      },
      {
        id: "confirmation",
        title: "Confirmation",
        description: "Validée",
        date: null,
        styles: stepStyles.confirmation,
        badgeIcon: <ClipboardCheck className="h-4 w-4" />,
      },
      {
        id: "preparation",
        title: "En préparation",
        description: "Aux fourneaux",
        date: null,
        styles: stepStyles.preparation,
        badgeIcon: <ChefHat className="h-4 w-4" />,
      },
      {
        id: "prete",
        title: "Prête",
        description: "À récupérer",
        date: null,
        styles: stepStyles.prete,
        badgeIcon: <Store className="h-4 w-4" />,
      },
      {
        id: "recuperee",
        title: "Récupérée",
        description: "Bon appétit !",
        date: dateRetrait,
        styles: stepStyles.recuperee,
        badgeIcon: <PackageCheck className="h-4 w-4" />,
      },
    ]

    const statusMap: Record<string, string[]> = {
      "En attente de confirmation": ["commande"],
      Confirmée: ["commande", "confirmation"],
      "En préparation": ["commande", "confirmation", "preparation"],
      "Prête à récupérer": ["commande", "confirmation", "preparation", "prete"],
      Récupérée: ["commande", "confirmation", "preparation", "prete", "recuperee"],
      Annulée: [],
    }

    const completedSteps = statusMap[currentStatus || ""] || ["commande"]
    const isCancelledOrder = currentStatus === "Annulée"

    return stepsData.map((stepData) => {
      let status: TimelineStep["status"] = "pending"

      if (isCancelledOrder) {
        status = stepData.id === "commande" ? "completed" : "cancelled"
      } else {
        if (completedSteps.includes(stepData.id)) {
          const lastCompletedId = completedSteps[completedSteps.length - 1]
          if (stepData.id === lastCompletedId && currentStatus !== "Récupérée") {
            status = "current"
          } else {
            status = "completed"
          }
        } else {
          status = "pending"
        }
      }

      if (currentStatus === "Récupérée" && stepData.id === "recuperee") {
        status = "current"
      } else if (currentStatus === "Récupérée") {
        status = "completed"
      }

      return { ...stepData, status }
    })
  }

  const steps = getTimelineSteps()
  const isGlobalCancelled = currentStatus === "Annulée"

  const formatDate = (date: Date | string | null) => {
    if (!date) return null
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      return dateObj.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return null
    }
  }

  return (
    <div className="relative space-y-4">
      {isGlobalCancelled && (
        <div className="animate-in fade-in slide-in-from-top-2 mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-red-800">Commande Annulée</h4>
            <p className="text-sm text-red-600">Cette commande a été annulée.</p>
          </div>
        </div>
      )}

      {/* 
         SCROLL CONTENEUR VERTICAL 
         - Hauteur dynamique
         - Masques de fondu
         - Scrollbar cachée
      */}
      <div className="relative h-[calc(100vh-320px)] min-h-[500px] w-full overflow-hidden rounded-xl border border-gray-100 bg-white/50 shadow-inner">
        {/* Masque Fondu Haut */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-linear-to-b from-white via-white/80 to-transparent" />

        {/* Zone de Scroll (Barre masquée) */}
        <div className="h-full overflow-y-auto px-1 pt-6 pb-16 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative space-y-6 px-1">
            {/* Ligne Background - ajusté pour scroll */}
            {/* <div className="absolute top-4 bottom-4 left-[3.5rem] w-0.5 bg-gray-200 md:left-[3.5rem] -z-10" /> */}

            {steps.map((step, _index) => {
              const isCurrent = step.status === "current"
              const isPending = step.status === "pending"
              const isCancelled = step.status === "cancelled"

              const effectiveStyle = isCancelled
                ? stepStyles.annulee
                : isPending
                  ? stepStyles.pending
                  : step.styles

              const displayIcon = step.styles.customIcon
              const displayVideo = step.styles.customVideo

              return (
                <Card
                  key={step.id}
                  className={cn(
                    "relative overflow-hidden border-2 bg-white transition-all duration-300",
                    effectiveStyle.borderColor,
                    // Animation pulse pour l'élément actif
                    isCurrent ? "scale-[1.01] shadow-lg ring-2 ring-offset-2" : "hover:shadow-md",
                    isCurrent ? effectiveStyle.borderColor.replace("border-", "ring-") : "",
                    isPending ? "scale-[0.98] opacity-60 grayscale" : ""
                  )}
                >
                  <CardContent className="p-0">
                    <div
                      className={cn(
                        "relative flex flex-col gap-4 px-3 py-4 md:grid md:min-h-[120px] md:grid-cols-3 md:items-stretch md:gap-2 md:px-4 md:py-6",
                        effectiveStyle.borderColor,
                        effectiveStyle.header
                      )}
                    >
                      {/* Colonne 1 : Média (Gauche) */}
                      <div className="relative flex w-full shrink-0 items-center justify-center pl-0 md:w-auto md:justify-start md:pl-2">
                        <Dialog
                          open={openVideoId === step.id}
                          onOpenChange={(open) => setOpenVideoId(open ? step.id : null)}
                        >
                          <DialogTrigger asChild disabled={!displayVideo || isPending}>
                            <div
                              className={cn(
                                "relative cursor-pointer transition-transform hover:scale-105",
                                isPending && "cursor-default hover:scale-100"
                              )}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={displayIcon}
                                alt={step.title}
                                className={cn(
                                  "h-24 w-40 rounded-lg object-cover shadow-md",
                                  effectiveStyle.headerTextColor?.includes("amber")
                                    ? "border-2 border-amber-200"
                                    : ""
                                )}
                              />
                              {/* Play overlay if video exists and usable */}
                              {displayVideo && !isPending && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/10 transition-colors hover:bg-black/0">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm">
                                    <div className="ml-1 border-t-6 border-b-6 border-l-8 border-transparent border-t-transparent border-b-transparent border-l-orange-500"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogTrigger>
                          {displayVideo && (
                            <DialogContent className="max-w-md overflow-hidden rounded-xl border-0 p-0">
                              <DialogTitle className="sr-only">Vidéo : {step.title}</DialogTitle>
                              <video
                                src={displayVideo}
                                autoPlay
                                muted
                                playsInline
                                loop
                                className="w-full"
                              />
                            </DialogContent>
                          )}
                        </Dialog>
                      </div>

                      {/* Colonne 2 : Titre & Description (Centre) */}
                      <div
                        className={cn(
                          "flex flex-col items-center justify-center pt-2 text-center",
                          effectiveStyle.headerTextColor || "text-gray-600"
                        )}
                      >
                        <h3 className="text-xl font-black whitespace-nowrap capitalize drop-shadow-sm md:text-2xl lg:text-3xl">
                          {step.title}
                        </h3>
                        <span className="text-sm font-medium opacity-90 drop-shadow-sm md:text-base">
                          {step.description}
                        </span>
                        {step.date && (
                          <span
                            className={cn(
                              "mt-2 rounded-full bg-white/40 px-2 py-0.5 text-xs font-bold",
                              effectiveStyle.dateCommandeColor
                            )}
                          >
                            {formatDate(step.date)}
                          </span>
                        )}
                      </div>

                      {/* Colonne 3 : Badge Statut (Droite) */}
                      <div className="flex w-full flex-col items-center justify-center gap-2 py-1 md:w-auto md:items-end">
                        <div
                          className={cn(
                            "flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm ring-1 backdrop-blur-sm",
                            effectiveStyle.badgeTextColor
                              ? `${effectiveStyle.badgeBg} ${effectiveStyle.badgeTextColor} ring-orange-200`
                              : "bg-white/20 text-white ring-white/30",
                            isCurrent && "animate-pulse"
                          )}
                        >
                          {step.badgeIcon}
                          <span className="text-base font-extrabold whitespace-nowrap">
                            {step.id === "commande" ? "Enregistrée" : step.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Masque Fondu Bas */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-linear-to-t from-white via-white/80 to-transparent" />
      </div>
    </div>
  )
}
