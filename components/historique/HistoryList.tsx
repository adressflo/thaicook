"use client"

import { CommandeUI, EvenementUI, ExtraUI } from "@/types/app"
import { useMemo } from "react"
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

export function HistoryList({
  commandes,
  evenements = [],
  emptyType = "commandes-historique",
  onSelectDate,
}: HistoryListProps) {
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

  if (combinedList.length === 0) {
    return <EmptyState type={emptyType} />
  }

  return (
    <div className="space-y-4">
      {combinedList.map((item) => {
        if (item.type === "commande") {
          const c = item.data as CommandeUI
          return (
            <OrderListCard
              key={`cmd-${c.idcommande}`}
              commande={c}
              onClick={() => {
                if (c.date_et_heure_de_retrait_souhaitees && onSelectDate) {
                  onSelectDate(new Date(c.date_et_heure_de_retrait_souhaitees))
                }
              }}
            />
          )
        } else {
          const e = item.data as EvenementUI
          return (
            <EventListCard
              key={`evt-${e.idevenements}`}
              evenement={e}
              onClick={() => {
                if (e.date_evenement && onSelectDate) {
                  onSelectDate(new Date(e.date_evenement))
                }
              }}
            />
          )
        }
      })}
    </div>
  )
}
