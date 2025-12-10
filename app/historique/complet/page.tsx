"use client"

import { getPaginatedHistory } from "@/app/actions/historique"
import { HistoryList } from "@/components/historique/HistoryList"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrismaExtras } from "@/hooks/usePrismaData"
import { toSafeNumber } from "@/lib/serialization"
import { CommandeUI, ExtraUI } from "@/types/app"
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect } from "react"

export const dynamic = "force-dynamic"

export default function HistoriqueCompletPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1
  const pageSize = 10

  const { execute, result, status } = useAction(getPaginatedHistory)
  const { data: extras } = usePrismaExtras()

  useEffect(() => {
    execute({ page, pageSize })
  }, [page, execute])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`/historique/complet?${params.toString()}`)
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
  const historyData = result.data?.data || []
  const totalPages = result.data?.totalPages || 1

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
