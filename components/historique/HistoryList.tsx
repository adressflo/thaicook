"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CommandeUI, EvenementUI, ExtraUI } from "@/types/app"
import { getYear, isAfter, startOfToday, subDays, subMonths } from "date-fns"
import { Calendar, ShoppingBag } from "lucide-react"
import { useMemo, useState } from "react"
import { EmptyState } from "./EmptyState"
import { EventListCard } from "./EventListCard"
import { OrderListCard } from "./OrderListCard"

interface HistoryListProps {
  commandes: CommandeUI[]
  evenements?: EvenementUI[]
  extras: ExtraUI[] | undefined
  formatPrix: (prix: number) => string
  calculateTotal: (commande: CommandeUI) => number
  emptyType?:
    | "commandes-en-cours"
    | "commandes-historique"
    | "evenements-en-cours"
    | "evenements-historique"
  onSelectDate?: (date: Date) => void
}

type FilterType = "last_30_days" | "last_3_months" | string // string pour les années (ex: "2025")

export function HistoryList({
  commandes,
  evenements = [],
  emptyType = "commandes-historique",
  onSelectDate,
}: HistoryListProps) {
  const [filter, setFilter] = useState<FilterType>("last_3_months")

  const combinedList = useMemo(() => {
    const list = [
      ...commandes.map((c) => ({
        type: "commande",
        data: c,
        date: c.date_et_heure_de_retrait_souhaitees
          ? new Date(c.date_et_heure_de_retrait_souhaitees)
          : new Date(0),
      })),
      ...evenements.map((e) => ({
        type: "evenement",
        data: e,
        date: e.date_evenement ? new Date(e.date_evenement) : new Date(0),
      })),
    ]
    return list.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [commandes, evenements])

  // Générer la liste des années disponibles
  const availableYears = useMemo(() => {
    const years = new Set<string>()
    combinedList.forEach((item) => {
      years.add(getYear(item.date).toString())
    })
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
  }, [combinedList])

  const filteredList = useMemo(() => {
    const today = startOfToday()

    return combinedList.filter((item) => {
      const date = item.date

      if (filter === "last_30_days") {
        return isAfter(date, subDays(today, 30))
      }
      if (filter === "last_3_months") {
        return isAfter(date, subMonths(today, 3))
      }

      // Filtre par année
      if (!isNaN(Number(filter))) {
        const year = Number(filter)
        return getYear(date) === year
      }

      return true
    })
  }, [combinedList, filter])

  const groupedList = useMemo(() => {
    const groups: { title: string; items: typeof combinedList }[] = []

    filteredList.forEach((item) => {
      const title = item.date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
      let group = groups.find((g) => g.title === title)
      if (!group) {
        group = { title, items: [] }
        groups.push(group)
      }
      group.items.push(item)
    })
    return groups
  }, [filteredList])

  if (combinedList.length === 0) {
    return <EmptyState type={emptyType} />
  }

  return (
    <div className="space-y-6">
      {/* Header Filtres Amazon-style */}
      <div className="flex flex-col gap-4 bg-white/50 p-4 pb-0 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="border-thai-orange text-thai-green flex items-center gap-2 rounded-lg border-l-4 bg-white/90 px-4 py-2 text-lg font-bold shadow-sm backdrop-blur-md">
            <ShoppingBag className="text-thai-green h-5 w-5" />
            <span className="text-thai-orange text-lg font-bold">{filteredList.length}</span>
            <span className="font-bold">Commandes Passées</span>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Select value={filter} onValueChange={(v) => setFilter(v)}>
            <div className="from-thai-orange via-thai-green to-thai-orange rounded-lg bg-linear-to-r p-[2px] shadow-sm">
              <SelectTrigger className="text-thai-green h-auto w-full rounded-md border-0 bg-white/90 px-4 py-2 backdrop-blur-md focus:ring-0 focus:ring-offset-0 sm:w-[240px] [&>span]:flex [&>span]:flex-1 [&>span]:items-center [&>span]:justify-center [&>span]:gap-2 sm:[&>span]:justify-start">
                <SelectValue placeholder="Filtrer par période" />
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectItem value="last_30_days">
                <div className="flex items-center gap-2">
                  <Calendar className="text-thai-green h-4 w-4" />
                  <span className="text-thai-orange font-bold">30</span>
                  <span className="text-thai-green font-semibold">Derniers Jours</span>
                </div>
              </SelectItem>
              <SelectItem value="last_3_months">
                <div className="flex items-center gap-2">
                  <Calendar className="text-thai-green h-4 w-4" />
                  <span className="text-thai-orange font-bold">3</span>
                  <span className="text-thai-green font-semibold">Derniers Mois</span>
                </div>
              </SelectItem>
              {availableYears.length > 0 &&
                availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-thai-green h-4 w-4" />
                      <span className="text-thai-green font-semibold">en</span>
                      <span className="text-thai-orange font-bold">{year}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gradient Separator */}
      <div className="from-thai-green via-thai-orange to-thai-green h-1 w-full bg-linear-to-r opacity-60" />

      {filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
          <p className="text-lg font-medium text-gray-500">Aucune commande sur cette période.</p>
          <p className="text-sm text-gray-400">Essayez de changer les filtres.</p>
        </div>
      ) : (
        <div className="relative space-y-8 pl-4 md:pl-8">
          {/* Ligne verticale timeline */}
          <div className="from-thai-orange/20 via-thai-orange/50 to-thai-orange/5 absolute top-0 bottom-0 left-4 w-px bg-linear-to-b md:left-8" />

          {groupedList.map((group) => (
            <div key={group.title} className="relative">
              {/* Header du mois */}
              <div className="sticky top-0 z-10 mb-6 flex items-center">
                <div className="bg-thai-orange absolute -left-[25px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-md md:-left-[41px]">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <h3 className="text-thai-green border-thai-orange rounded-r-lg border-l-4 bg-white/90 px-4 py-1 text-lg font-bold capitalize shadow-sm backdrop-blur-md">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-6">
                {group.items.map((item, index) => (
                  <div key={`${item.type}-${index}`} className="relative pl-6">
                    {/* Point connecteur pour chaque carte */}
                    <div className="bg-thai-orange/50 absolute top-8 -left-[21px] h-3 w-3 rounded-full border-2 border-white ring-2 ring-orange-100 md:-left-[39px]" />

                    {item.type === "commande" ? (
                      <OrderListCard
                        commande={item.data as CommandeUI}
                        onClick={() => {
                          const cmd = item.data as CommandeUI
                          if (cmd.date_et_heure_de_retrait_souhaitees && onSelectDate) {
                            onSelectDate(new Date(cmd.date_et_heure_de_retrait_souhaitees))
                          }
                        }}
                      />
                    ) : (
                      <EventListCard
                        evenement={item.data as EvenementUI}
                        onClick={() => {
                          const evt = item.data as EvenementUI
                          if (evt.date_evenement && onSelectDate) {
                            onSelectDate(new Date(evt.date_evenement))
                          }
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
