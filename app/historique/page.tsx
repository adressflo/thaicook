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
import { useCommandesRealtime } from "@/hooks/useSupabaseData"
import { useSession } from "@/lib/auth-client"
import { toSafeNumber } from "@/lib/serialization"
import type { CommandeUI, EvenementUI, ExtraUI } from "@/types/app"
import { isWithinInterval, parseISO } from "date-fns"
import {
  BarChart3,
  Calendar,
  Clock,
  Euro,
  History,
  PartyPopper,
  Users,
  Utensils,
} from "lucide-react"
import Link from "next/link"
import { memo, useCallback, useEffect, useMemo, useState } from "react"

// Composants optimisés
import {
  CommandeActionButtons,
  EvenementActionButtons,
} from "@/components/historique/ActionButtons"
import { EmptyState } from "@/components/historique/EmptyState"
import { FilterSearchBar } from "@/components/historique/FilterSearchBar"
import {
  DishList,
  FormattedDate,
  FormattedEvent,
  FormattedPrice,
  PersonCount,
} from "@/components/historique/FormattedDisplay"
import { HistoriqueSkeleton } from "@/components/historique/HistoriqueSkeleton"
import { StatusBadge } from "@/components/historique/StatusBadge"

export const dynamic = "force-dynamic"

// Utilisation du type existant CommandeUI qui contient déjà les détails
type CommandeAvecDetails = CommandeUI

const HistoriquePage = memo(() => {
  // Better Auth session
  const { data: session } = useSession()
  const currentUser = session?.user
  const isOnline = useOnlineStatus()

  // Client profile (pour obtenir idclient)
  const [clientProfile, setClientProfile] = useState<any>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
  }, [currentUser?.id])

  // ✅ Activation Real-time Supabase pour synchronisation automatique
  useCommandesRealtime()

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

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  })
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(
    null
  )

  // Fonctions optimisées avec memoization
  const formatPrix = useCallback((prix: number): string => {
    const numericPrix = toSafeNumber(prix)
    return numericPrix % 1 === 0
      ? `${numericPrix}€`
      : `${numericPrix.toFixed(2).replace(".", ",")}€`
  }, [])

  const calculateTotal = useCallback(
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

  // Fonctions de filtrage
  const filterBySearch = useCallback(
    (commande: CommandeAvecDetails) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        commande.details?.some((detail) => {
          const nomPlat = detail.nom_plat || detail.plat?.plat || ""
          return nomPlat.toLowerCase().includes(searchLower)
        }) || false
      )
    },
    [searchTerm]
  )

  const filterByStatus = useCallback(
    (item: any) => {
      if (!statusFilter) return true
      const status = item.statut_commande || item.statut_evenement
      return status === statusFilter
    },
    [statusFilter]
  )

  const filterByDate = useCallback(
    (item: any) => {
      if (!dateRange.from && !dateRange.to) return true
      const itemDate = item.date_retrait || item.date_evenement
      if (!itemDate) return false

      try {
        const date = typeof itemDate === "string" ? parseISO(itemDate) : itemDate
        if (dateRange.from && dateRange.to) {
          return isWithinInterval(date, { start: dateRange.from, end: dateRange.to })
        } else if (dateRange.from) {
          return date >= dateRange.from
        } else if (dateRange.to) {
          return date <= dateRange.to
        }
      } catch {
        return false
      }
      return true
    },
    [dateRange]
  )

  const filterByAmount = useCallback(
    (commande: CommandeAvecDetails) => {
      const total = calculateTotal(commande)
      const min = parseFloat(minAmount) || 0
      const max = parseFloat(maxAmount) || Infinity
      return total >= min && total <= max
    },
    [minAmount, maxAmount, calculateTotal]
  )

  // Fonctions pour les filtres
  const clearAllFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter(null)
    setTypeFilter(null)
    setDateRange({ from: null, to: null })
    setMinAmount("")
    setMaxAmount("")
    setSortConfig(null)
  }, [])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchTerm) count++
    if (statusFilter) count++
    if (typeFilter) count++
    if (dateRange.from || dateRange.to) count++
    if (minAmount || maxAmount) count++
    return count
  }, [searchTerm, statusFilter, typeFilter, dateRange, minAmount, maxAmount])

  const isFiltered = activeFiltersCount > 0

  // Filtrer les données avec memoization pour optimiser les performances
  const {
    commandesEnCours,
    commandesHistorique,
    evenementsEnCours,
    evenementsHistorique,
    commandesFiltered,
    evenementsFiltered,
  } = useMemo(() => {
    // Appliquer les filtres de base
    let filteredCommandes = commandes || []
    let filteredEvenements = evenements || []

    // Filtrage par type
    if (typeFilter === "commande") {
      filteredEvenements = []
    } else if (typeFilter === "evenement") {
      filteredCommandes = []
    }

    // Appliquer les filtres sur les commandes
    filteredCommandes = filteredCommandes.filter(
      (c: CommandeUI) =>
        filterBySearch(c) && filterByStatus(c) && filterByDate(c) && filterByAmount(c)
    )

    // Appliquer les filtres sur les événements
    filteredEvenements = filteredEvenements.filter(
      (e: EvenementUI) => filterByStatus(e) && filterByDate(e)
    )

    // Séparer en cours/historique après filtrage
    const commandesEnCours = filteredCommandes.filter(
      (c: CommandeUI) => c.statut_commande !== "Annulée" && c.statut_commande !== "Récupérée"
    )

    const commandesHistorique = filteredCommandes
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

    const evenementsEnCours = filteredEvenements.filter(
      (e: EvenementUI) => !STATUS_TERMINES.includes(e.statut_evenement as any)
    )

    const evenementsHistorique = filteredEvenements.filter((e: EvenementUI) =>
      STATUS_TERMINES.includes(e.statut_evenement as any)
    )

    return {
      commandesEnCours,
      commandesHistorique,
      evenementsEnCours,
      evenementsHistorique,
      commandesFiltered: filteredCommandes,
      evenementsFiltered: filteredEvenements,
    }
  }, [
    commandes,
    evenements,
    filterBySearch,
    filterByStatus,
    filterByDate,
    filterByAmount,
    typeFilter,
    clientProfile,
  ])

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
      <div className="bg-gradient-thai min-h-screen px-4 py-8">
        <div className="animate-fadeIn container mx-auto max-w-7xl space-y-8">
          {/* Bannière offline */}
          <OfflineBannerCompact />

          {/* Barre de recherche et filtres */}
          <FilterSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            minAmount={minAmount}
            onMinAmountChange={setMinAmount}
            maxAmount={maxAmount}
            onMaxAmountChange={setMaxAmount}
            activeFiltersCount={activeFiltersCount}
            onClearAllFilters={clearAllFilters}
            isFiltered={isFiltered}
          />

          {/* Résumé des résultats */}
          {isFiltered && (
            <Card className="bg-thai-cream/30 border-thai-green/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-thai-green font-medium">
                    Résultats filtrés: {commandesFiltered.length + evenementsFiltered.length}{" "}
                    élément(s)
                  </span>
                  <span className="text-thai-green/70">
                    {commandesFiltered.length} commande(s) • {evenementsFiltered.length}{" "}
                    événement(s)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Suivi des Commandes */}
          <Card className="border-thai-orange/20 group shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2 text-2xl font-bold">
                <Clock className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                Suivi de vos commandes
              </CardTitle>
              <CardDescription>Commandes en cours de traitement ou confirmées.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCommandes || isLoadingExtras ? (
                <HistoriqueSkeleton />
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ) : commandesEnCours.length > 0 ? (
                <div className="space-y-4">
                  {/* En-têtes avec icônes - Harmonisés */}
                  <div className="bg-thai-cream/30 border-thai-orange/20 grid grid-cols-1 gap-4 rounded-lg border px-4 py-3 md:grid-cols-5">
                    <div className="text-thai-green text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="text-thai-orange h-4 w-4" />
                        <span>Date de retrait</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold md:col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <Utensils className="text-thai-orange h-4 w-4" />
                        <span>Plats commandés</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold md:-ml-16">
                      <div className="flex items-center justify-center gap-2">
                        <Euro className="text-thai-orange h-4 w-4" />
                        <span>Total</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold md:-ml-12">
                      <div className="flex items-center justify-center gap-2">
                        <BarChart3 className="text-thai-orange h-4 w-4" />
                        <span>Statut</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-thai-orange/20 bg-thai-cream/20 space-y-4 rounded-lg border p-3">
                    {commandesEnCours.map((c: CommandeUI) => {
                      const canEdit =
                        c.statut_commande !== "Prête à récupérer" &&
                        c.statut_commande !== "Récupérée"
                      return (
                        <div
                          key={c.idcommande}
                          className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 flex min-h-16 transform cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2"
                        >
                          <div className="grid flex-1 grid-cols-1 items-center gap-3 md:grid-cols-5">
                            <div className="flex min-h-10 flex-col items-center justify-center text-center">
                              <FormattedDate date={c.date_et_heure_de_retrait_souhaitees} />
                            </div>
                            <div className="flex min-h-10 flex-col items-center justify-center text-center md:col-span-2">
                              <DishList
                                details={c.details || []}
                                formatPrix={formatPrix}
                                extras={extras}
                              />
                            </div>
                            <div className="flex min-h-10 flex-col items-center justify-center text-center md:-ml-12">
                              <FormattedPrice
                                prix={calculateTotal(c)}
                                formatPrix={formatPrix}
                                details={c.details || []}
                              />
                            </div>
                            <div className="flex min-h-10 flex-col items-center justify-center gap-3 text-center md:-ml-8">
                              <StatusBadge statut={c.statut_commande} type="commande" />
                              <CommandeActionButtons
                                commandeId={c.idcommande}
                                canEdit={canEdit}
                                commande={c}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <EmptyState type="commandes-en-cours" />
              )}
            </CardContent>
          </Card>

          {/* Section Historique des Commandes */}
          <Card className="border-thai-orange/20 group shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2 text-2xl font-bold">
                <History className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                Historique de vos commandes
              </CardTitle>
              <CardDescription>
                Vos 10 dernières commandes terminées (récupérées ou annulées).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commandesHistorique.length > 0 ? (
                <div className="space-y-4">
                  {/* En-têtes avec icônes */}
                  <div className="bg-thai-cream/30 border-thai-orange/20 grid grid-cols-1 gap-4 rounded-lg border px-3 py-2 md:grid-cols-5">
                    <div className="text-thai-green text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="text-thai-orange h-4 w-4" />
                        <span>Date de retrait</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold md:col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <Utensils className="text-thai-orange h-4 w-4" />
                        <span>Plats commandés</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold md:-ml-16">
                      <div className="flex items-center justify-center gap-2">
                        <Euro className="text-thai-orange h-4 w-4" />
                        <span>Total</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold md:-ml-12">
                      <div className="flex items-center justify-center gap-2">
                        <BarChart3 className="text-thai-orange h-4 w-4" />
                        <span>Statut</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-thai-orange/20 bg-thai-cream/20 space-y-4 rounded-lg border p-3">
                    {commandesHistorique.map((c: CommandeUI) => (
                      <div
                        key={c.idcommande}
                        className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 flex transform cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2"
                      >
                        <div className="grid flex-1 grid-cols-1 items-center gap-3 md:grid-cols-5">
                          <div className="text-center">
                            <FormattedDate date={c.date_et_heure_de_retrait_souhaitees} />
                          </div>
                          <div className="text-center md:col-span-2">
                            <DishList
                              details={c.details || []}
                              formatPrix={formatPrix}
                              extras={extras}
                            />
                          </div>
                          <div className="text-center md:-ml-12">
                            <FormattedPrice
                              prix={calculateTotal(c)}
                              formatPrix={formatPrix}
                              details={c.details || []}
                            />
                          </div>
                          <div className="flex flex-col items-center justify-center gap-3 text-center md:-ml-8">
                            <StatusBadge statut={c.statut_commande} type="commande" />
                            <CommandeActionButtons
                              commandeId={c.idcommande}
                              canEdit={false}
                              commande={c}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState type="commandes-historique" />
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
            <CardContent>
              {isLoadingEvenements ? (
                <HistoriqueSkeleton />
              ) : errorEvenements ? (
                <Alert variant="destructive">
                  <AlertDescription>{errorEvenements.message}</AlertDescription>
                </Alert>
              ) : evenementsEnCours.length > 0 ? (
                <div className="space-y-4">
                  {/* En-têtes avec icônes */}
                  <div className="bg-thai-cream/30 border-thai-green/20 grid grid-cols-1 gap-4 rounded-lg border px-3 py-2 md:grid-cols-4">
                    <div className="text-thai-green text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <PartyPopper className="text-thai-orange h-4 w-4" />
                        <span>Événement</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="text-thai-orange h-4 w-4" />
                        <span>Date prévue</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="text-thai-orange h-4 w-4" />
                        <span>Personnes</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold md:-ml-12">
                      <div className="flex items-center justify-center gap-2">
                        <BarChart3 className="text-thai-orange h-4 w-4" />
                        <span>Statut</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-thai-green/20 bg-thai-cream/20 space-y-4 rounded-lg border p-3">
                    {evenementsEnCours.map((evt: EvenementUI) => {
                      const canEdit =
                        (evt.statut_evenement as any) !== "Réalisé" &&
                        (evt.statut_evenement as any) !== "Payé intégralement"
                      return (
                        <div
                          key={evt.idevenements}
                          className="hover:bg-thai-cream/20 hover:border-thai-green hover:ring-thai-green/30 flex min-h-16 transform cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2"
                        >
                          <div className="grid flex-1 grid-cols-1 items-center gap-6 md:grid-cols-4">
                            <div className="flex min-h-10 flex-col items-center justify-center text-center">
                              <FormattedEvent event={evt} />
                            </div>
                            <div className="flex min-h-10 flex-col items-center justify-center text-center">
                              <FormattedDate date={evt.date_evenement} />
                            </div>
                            <div className="flex min-h-10 flex-col items-center justify-center text-center">
                              <PersonCount count={evt.nombre_de_personnes} />
                            </div>
                            <div className="flex min-h-10 flex-col items-center justify-center text-center">
                              <StatusBadge statut={evt.statut_evenement} type="evenement" />
                              <div className="mt-2">
                                <EvenementActionButtons
                                  evenementId={evt.idevenements}
                                  canEdit={canEdit}
                                  evenement={evt}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <EmptyState type="evenements-en-cours" />
              )}
            </CardContent>
          </Card>

          {/* Section Historique des Événements */}
          <Card className="border-thai-green/20 group shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2 text-2xl font-bold">
                <History className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                Historique de vos événements
              </CardTitle>
              <CardDescription>Événements terminés (réalisés ou annulés).</CardDescription>
            </CardHeader>
            <CardContent>
              {evenementsHistorique.length > 0 ? (
                <div className="space-y-4">
                  {/* En-têtes avec icônes */}
                  <div className="bg-thai-cream/30 border-thai-green/20 grid grid-cols-1 gap-4 rounded-lg border px-3 py-2 md:grid-cols-4">
                    <div className="text-thai-green text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <PartyPopper className="text-thai-orange h-4 w-4" />
                        <span>Événement</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="text-thai-orange h-4 w-4" />
                        <span>Date prévue</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="text-thai-orange h-4 w-4" />
                        <span>Personnes</span>
                      </div>
                    </div>
                    <div className="text-thai-green text-center font-semibold md:-ml-12">
                      <div className="flex items-center justify-center gap-2">
                        <BarChart3 className="text-thai-orange h-4 w-4" />
                        <span>Statut</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-thai-green/20 bg-thai-cream/20 space-y-4 rounded-lg border p-3">
                    {evenementsHistorique.map((evt: EvenementUI) => (
                      <div
                        key={evt.idevenements}
                        className="hover:bg-thai-cream/20 hover:border-thai-green hover:ring-thai-green/30 flex min-h-16 transform cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2"
                      >
                        <div className="grid flex-1 grid-cols-1 items-center gap-6 md:grid-cols-4">
                          <div className="text-center">
                            <FormattedEvent event={evt} />
                          </div>
                          <div className="text-center">
                            <FormattedDate date={evt.date_evenement} />
                          </div>
                          <div className="text-center">
                            <PersonCount count={evt.nombre_de_personnes} />
                          </div>
                          <div className="text-center">
                            <StatusBadge statut={evt.statut_evenement} type="evenement" />
                            <div className="mt-2 flex items-center justify-center">
                              <EvenementActionButtons
                                evenementId={evt.idevenements}
                                canEdit={false}
                                evenement={evt}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState type="evenements-historique" />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center pb-8">
            <Link href="/historique/complet">
              <span className="bg-thai-orange hover:bg-thai-orange/90 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105">
                <History className="mr-2 h-5 w-5" />
                Voir tout l&apos;historique
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
