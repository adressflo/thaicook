"use client"

import { CommandeUI, ExtraUI } from "@/types/app"
import { BarChart3, Calendar, Euro, Utensils } from "lucide-react"
import { CommandeActionButtons } from "./ActionButtons"
import { EmptyState } from "./EmptyState"
import { DishList, FormattedDate, FormattedPrice } from "./FormattedDisplay"
import { StatusBadge } from "./StatusBadge"

interface HistoryListProps {
  commandes: CommandeUI[]
  extras: ExtraUI[] | undefined
  formatPrix: (prix: number) => string
  calculateTotal: (commande: CommandeUI) => number
  emptyType?:
    | "commandes-en-cours"
    | "commandes-historique"
    | "evenements-en-cours"
    | "evenements-historique"
}

export function HistoryList({
  commandes,
  extras,
  formatPrix,
  calculateTotal,
  emptyType = "commandes-historique",
}: HistoryListProps) {
  if (commandes.length === 0) {
    return <EmptyState type={emptyType} />
  }

  return (
    <div className="space-y-4">
      {/* En-têtes avec icônes */}
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
        {commandes.map((c: CommandeUI) => {
          const canEdit =
            c.statut_commande !== "Prête à récupérer" &&
            c.statut_commande !== "Récupérée" &&
            c.statut_commande !== "Annulée"

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
                  <DishList details={c.details || []} formatPrix={formatPrix} extras={extras} />
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
                  <CommandeActionButtons commandeId={c.idcommande} canEdit={canEdit} commande={c} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
