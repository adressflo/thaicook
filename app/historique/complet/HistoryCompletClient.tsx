"use client"

import { getPaginatedHistory } from "@/app/actions/historique"
import { FilterSearchBar } from "@/components/historique/FilterSearchBar"
import { HistoryList } from "@/components/historique/HistoryList"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrismaExtras } from "@/hooks/usePrismaData"
import { toSafeNumber } from "@/lib/serialization"
import { CommandeUI, ExtraUI } from "@/types/app"
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useCallback, useEffect } from "react"

export default function HistoryCompletClient() {
  const router = useRouter()

  // URL State with nuqs
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [searchTerm, setSearchTerm] = useQueryState("search", parseAsString.withDefault(""))
  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString)
  const [typeFilter, setTypeFilter] = useQueryState("type", parseAsString)
  const [minAmount, setMinAmount] = useQueryState("minAmount", parseAsString.withDefault(""))
  const [maxAmount, setMaxAmount] = useQueryState("maxAmount", parseAsString.withDefault(""))

  // Date range state (handled as strings in URL for simplicity)
  const [startDate, setStartDate] = useQueryState("from", parseAsString)
  const [endDate, setEndDate] = useQueryState("to", parseAsString)

  const pageSize = 10

  const { execute, result, status } = useAction(getPaginatedHistory)
  const { data: extras } = usePrismaExtras()

  // Derived state for FilterSearchBar
  const dateRange = {
    from: startDate ? new Date(startDate) : null,
    to: endDate ? new Date(endDate) : null,
  }

  const activeFiltersCount = [
    searchTerm,
    statusFilter,
    typeFilter,
    startDate,
    endDate,
    minAmount,
    maxAmount,
  ].filter(Boolean).length

  const isFiltered = activeFiltersCount > 0

  useEffect(() => {
    execute({
      page,
      pageSize,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    })
  }, [
    page,
    searchTerm,
    statusFilter,
    typeFilter,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    execute,
  ])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleClearAllFilters = () => {
    setSearchTerm(null)
    setStatusFilter(null)
    setTypeFilter(null)
    setStartDate(null)
    setEndDate(null)
    setMinAmount(null)
    setMaxAmount(null)
    setPage(1)
  }

  // Handlers for FilterSearchBar
  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    setStartDate(range.from ? range.from.toISOString() : null)
    setEndDate(range.to ? range.to.toISOString() : null)
    setPage(1) // Reset to page 1 on filter change
  }

  const handleFilterChange = (setter: (val: string | null) => void) => (val: string | null) => {
    setter(val)
    setPage(1)
  }

  // Helper functions (reused from HistoriquePage)
  const formatPrix = useCallback((prix: number): string => {
    const numericPrix = toSafeNumber(prix)
    return numericPrix % 1 === 0
      ? `${numericPrix}€`
      : `${numericPrix.toFixed(2).replace(".", ",")}€`
  }, [])

  const calculateTotal = useCallback(
    (commande: CommandeUI): number => {
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
    },
    [extras]
  )

  const isLoading = status === "executing"
  // Safe extraction of data from next-safe-action v7 result object
  const actionResult = result.data
  const historyData = actionResult?.data || []
  const totalPages = actionResult?.totalPages || 1

  return (
    <AppLayout>
      <div className="bg-gradient-thai min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-7xl space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-thai-green hover:bg-thai-green/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>

          <Card className="border-thai-orange/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-thai-green text-3xl font-bold">
                Historique Complet
              </CardTitle>
              <CardDescription>Retrouvez l'ensemble de vos commandes passées.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <FilterSearchBar
                  searchTerm={searchTerm}
                  onSearchChange={handleFilterChange(setSearchTerm)}
                  statusFilter={statusFilter}
                  onStatusFilterChange={handleFilterChange(setStatusFilter)}
                  typeFilter={typeFilter}
                  onTypeFilterChange={handleFilterChange(setTypeFilter)}
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                  minAmount={minAmount}
                  onMinAmountChange={handleFilterChange(setMinAmount)}
                  maxAmount={maxAmount}
                  onMaxAmountChange={handleFilterChange(setMaxAmount)}
                  activeFiltersCount={activeFiltersCount}
                  onClearAllFilters={handleClearAllFilters}
                  isFiltered={isFiltered}
                />
              </div>

              {isLoading && historyData.length === 0 ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="text-thai-orange h-12 w-12 animate-spin" />
                </div>
              ) : (
                <>
                  <HistoryList
                    commandes={historyData}
                    extras={extras}
                    formatPrix={formatPrix}
                    calculateTotal={calculateTotal}
                  />

                  {/* Pagination Controls */}
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1 || isLoading}
                      className="border-thai-green/30 text-thai-green hover:bg-thai-green/10"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Précédent
                    </Button>
                    <span className="text-thai-green font-medium">
                      Page {page} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages || isLoading}
                      className="border-thai-green/30 text-thai-green hover:bg-thai-green/10"
                    >
                      Suivant
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
