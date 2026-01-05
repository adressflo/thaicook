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
import { motion } from "framer-motion"
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
  const weekDays = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="shadow-thai-orange/5 flex flex-col gap-2 rounded-2xl bg-white/60 p-2 shadow-xl backdrop-blur-sm md:gap-4 md:p-6"
    >
      {/* En-tête des jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 md:gap-4">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={`flex items-center justify-center rounded-lg py-2 text-xs font-bold tracking-wider ${
              idx >= 5
                ? "bg-thai-orange/20 text-thai-orange font-black"
                : "bg-thai-cream text-thai-green font-black"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {days.map((day) => {
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
          const hasContent = dayCommandes.length > 0 || dayEvenements.length > 0

          return (
            <motion.div
              key={day.toString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isCurrentMonth ? 1 : 0.35, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={!isCurrentMonth ? "grayscale-30" : ""}
            >
              <CalendarDay
                date={day}
                commandes={dayCommandes}
                evenements={dayEvenements}
                isToday={isToday(day)}
                onClick={hasContent ? () => onDayClick(day) : undefined}
              />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
