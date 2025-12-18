import { CommandeUI, EvenementUI } from "@/types/app"
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarDay } from "./CalendarDay"

interface CalendarGridProps {
  currentDate: Date
  commandes: CommandeUI[]
  evenements: EvenementUI[]
  onDayClick: (date: Date) => void
}

export function CalendarGrid({
  currentDate,
  commandes,
  evenements,
  onDayClick,
}: CalendarGridProps) {
  // Calculer la plage de dates à afficher (mois + débordements début/fin)
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { locale: fr })
  const endDate = endOfWeek(monthEnd, { locale: fr })

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Jours de la semaine pour l'en-tête (Lun, Mar, etc.)
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  return (
    <div className="flex flex-col gap-4">
      {/* En-tête des jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 text-center md:gap-4">
        {weekDays.map((day) => (
          <div key={day} className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-2 md:gap-4">
        {days.map((day, idx) => {
          // Filtrer les commandes pour ce jour
          const dayCommandes = commandes.filter((c) => {
            if (!c.date_et_heure_de_retrait_souhaitees) return false
            return isSameDay(new Date(c.date_et_heure_de_retrait_souhaitees), day)
          })

          // Filtrer les événements pour ce jour
          const dayEvenements = evenements.filter((e) => {
            if (!e.date_evenement) return false
            return isSameDay(new Date(e.date_evenement), day)
          })

          // Vérifier si le jour est dans le mois courant
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div key={day.toString()} className={!isCurrentMonth ? "opacity-40 grayscale" : ""}>
              <CalendarDay
                date={day}
                commandes={dayCommandes}
                evenements={dayEvenements}
                isToday={isToday(day)}
                onClick={() => onDayClick(day)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
