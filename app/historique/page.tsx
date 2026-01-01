"use client"

import { getClientProfile } from "@/app/profil/actions"
import { AppLayout } from "@/components/layout/AppLayout"
import { OfflineBannerCompact } from "@/components/pwa/OfflineBanner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import {
  usePrismaCommandesByClient,
  usePrismaEvenementsByClient,
  usePrismaExtras,
} from "@/hooks/usePrismaData"

import { useSession } from "@/lib/auth-client"
import { toSafeNumber } from "@/lib/serialization"
import type { CommandeUI, EvenementUI, ExtraUI } from "@/types/app"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { memo, useCallback, useEffect, useMemo, useState } from "react"

// Composants optimisés
import { EmptyState } from "@/components/historique/EmptyState"
import { EventHistoryCard } from "@/components/historique/EventHistoryCard"
import { HistoriqueSkeleton } from "@/components/historique/HistoriqueSkeleton"
import { OrderHistoryCard } from "@/components/historique/OrderHistoryCard"

export const dynamic = "force-dynamic"

// Utilisation du type existant CommandeUI qui contient déjà les détails
type CommandeAvecDetails = CommandeUI

const HistoriquePage = memo(() => {
  // Better Auth session
  const { data: session } = useSession()
  const currentUser = session?.user
  const _isOnline = useOnlineStatus()

  // Client profile (pour obtenir idclient)
  const [clientProfile, setClientProfile] = useState<{ idclient?: number } | null>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
  }, [currentUser, currentUser?.id])

  const {
    data: commandes,
    isLoading: isLoadingCommandes,
    error,
  } = usePrismaCommandesByClient(clientProfile?.idclient)
  const {
    data: evenements,
    isLoading: isLoadingEvenements,
    error: errorEvenements,
  } = usePrismaEvenementsByClient(clientProfile?.idclient)
  const { data: extras, isLoading: isLoadingExtras } = usePrismaExtras()

  // Fonctions optimisées avec memoization
  const _formatPrix = useCallback((prix: number): string => {
    const numericPrix = toSafeNumber(prix)
    return numericPrix % 1 === 0
      ? `${numericPrix}€`
      : `${numericPrix.toFixed(2).replace(".", ",")}€`
  }, [])

  const _calculateTotal = useCallback(
    (commande: CommandeAvecDetails): number => {
      if (commande.prix_total != null) return toSafeNumber(commande.prix_total)

      return (
        commande.details?.reduce((acc, detail) => {
          const quantite = detail.quantite_plat_commande || 0

          // Architecture hybride: pour les extras, essayer de récupérer le prix depuis extras_db
          let prixUnitaire = 0
          if (detail.type === "extra" && detail.plat_r && extras) {
            const extraData = extras.find((e: ExtraUI) => e.idextra === detail.plat_r)
            // Correction ici : toSafeNumber pour convertir Decimal en number
            prixUnitaire = toSafeNumber(extraData?.prix || detail.prix_unitaire)
          } else {
            // Correction ici : toSafeNumber pour convertir Decimal en number
            prixUnitaire = toSafeNumber(detail.prix_unitaire || detail.plat?.prix)
          }

          return acc + prixUnitaire * quantite
        }, 0) || 0
      )
    },
    [extras]
  )

  // Traitement des données (Séparation En cours / Historique)
  const {
    commandesEnCours,
    commandesHistorique: _commandesHistorique,
    evenementsEnCours,
    evenementsHistorique: _evenementsHistorique,
  } = useMemo(() => {
    const allCommandes = commandes || []
    const allEvenements = evenements || []

    // Séparer en cours/historique
    const commandesEnCours = allCommandes.filter(
      (c: CommandeUI) => c.statut_commande !== "Annulée" && c.statut_commande !== "Récupérée"
    )

    const commandesHistorique = allCommandes
      .filter(
        (c: CommandeUI) => c.statut_commande === "Annulée" || c.statut_commande === "Récupérée"
      )
      .slice(0, 10)

    // FIX: Gestion robuste des status événements (clés Enum Prisma vs valeurs affichées)
    const STATUS_TERMINES = [
      "Réalisé",
      "R_alis_",
      "Annulé",
      "Annul_",
      "Payé intégralement",
      "Pay__int_gralement",
      "Facturé / Solde à payer",
      "Factur____Solde___payer",
    ]

    const evenementsEnCours = allEvenements.filter(
      (e: EvenementUI) => !STATUS_TERMINES.includes(e.statut_evenement as string)
    )

    const evenementsHistorique = allEvenements.filter((e: EvenementUI) =>
      STATUS_TERMINES.includes(e.statut_evenement as string)
    )

    return {
      commandesEnCours,
      commandesHistorique,
      evenementsEnCours,
      evenementsHistorique,
    }
  }, [commandes, evenements])

  if (!currentUser) {
    return (
      <AppLayout>
        <div className="bg-gradient-thai flex min-h-screen items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertDescription>
              Veuillez vous{" "}
              <Link href="/profil" className="font-bold underline">
                connecter
              </Link>{" "}
              pour voir votre historique de commandes.
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="bg-gradient-thai min-h-screen px-1 pt-1 pb-8 sm:px-4 sm:py-8">
        <div className="animate-fadeIn container mx-auto max-w-7xl space-y-8">
          {/* Bannière offline */}
          <OfflineBannerCompact />

          {/* Section Suivi des Commandes */}
          <Card className="border-thai-orange/20 group shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2 text-2xl font-bold">
                <Clock className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                Suivi de vos commandes
              </CardTitle>
              <CardDescription>Commandes en cours de traitement ou confirmées.</CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              {isLoadingCommandes || isLoadingExtras ? (
                <HistoriqueSkeleton />
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ) : commandesEnCours.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-6">
                    {commandesEnCours.map((c: CommandeUI) => {
                      const canEdit =
                        c.statut_commande !== "Prête à récupérer" &&
                        c.statut_commande !== "Récupérée"
                      return (
                        <OrderHistoryCard
                          key={c.idcommande}
                          commande={c}
                          canEdit={canEdit}
                          extras={extras || []}
                        />
                      )
                    })}
                  </div>
                </div>
              ) : (
                <EmptyState type="commandes-en-cours" />
              )}
            </CardContent>
          </Card>

          {/* Section Suivi des Événements */}
          <Card className="border-thai-green/20 group shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2 text-2xl font-bold">
                <Clock className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                Suivi de vos événements
              </CardTitle>
              <CardDescription>Événements en cours de traitement ou confirmés.</CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              {isLoadingEvenements ? (
                <HistoriqueSkeleton />
              ) : errorEvenements ? (
                <Alert variant="destructive">
                  <AlertDescription>{errorEvenements.message}</AlertDescription>
                </Alert>
              ) : evenementsEnCours.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-6">
                    {evenementsEnCours.map((evt: EvenementUI) => {
                      const canEdit =
                        (evt.statut_evenement as string) !== "Réalisé" &&
                        (evt.statut_evenement as string) !== "Payé intégralement"
                      return (
                        <EventHistoryCard
                          key={evt.idevenements}
                          evenement={evt}
                          canEdit={canEdit}
                        />
                      )
                    })}
                  </div>
                </div>
              ) : (
                <EmptyState type="evenements-en-cours" />
              )}
            </CardContent>
          </Card>

          {/* Bouton vers Vue Calendrier */}
          <div className="flex justify-center pt-4 pb-8">
            <Link href="/historique/complet">
              <span className="bg-thai-orange hover:bg-thai-orange/90 inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
                <Calendar className="mr-3 h-6 w-6" />
                Voir le calendrier complet
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
})

HistoriquePage.displayName = "HistoriquePage"

export default HistoriquePage
