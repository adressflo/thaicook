import { cn } from "@/lib/utils"
import { CommandeUI, EvenementUI } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"

interface CalendarDayProps {
  date: Date
  commandes: CommandeUI[]
  evenements: EvenementUI[]
  isToday?: boolean
  isSelected?: boolean
  onClick: () => void
}

export function CalendarDay({
  date,
  commandes,
  evenements,
  isToday,
  isSelected,
  onClick,
}: CalendarDayProps) {
  const hasCommandes = commandes.length > 0
  const hasEvenements = evenements.length > 0

  // Noms de jours et mois courts
  const dayName = format(date, "EEE", { locale: fr }).toUpperCase().replace(".", "")
  const dayNumber = format(date, "d")
  const monthName = format(date, "MMM", { locale: fr }).toLowerCase().replace(".", "")

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative flex min-h-[80px] cursor-pointer flex-col items-center justify-start rounded-xl border border-transparent p-1 transition-colors duration-200 md:min-h-[100px] md:p-2",
        // Styles de base pour les jours avec contenu
        hasCommandes && "bg-thai-orange/10 hover:bg-thai-orange/20 border-thai-orange/20",
        hasEvenements && "border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20",
        // Style mixte si les deux
        hasCommandes && hasEvenements && "from-thai-orange/10 bg-linear-to-br to-purple-500/10",
        // Style Aujourd'hui
        isToday && "ring-thai-orange bg-white shadow-md ring-2",
        // Style Sélectionné
        isSelected && "bg-thai-cream ring-thai-green shadow-lg ring-2",
        // Style vide par défaut
        !hasCommandes && !hasEvenements && !isToday && !isSelected && "bg-white/50 hover:bg-white"
      )}
    >
      {/* Date Header: LUN 12 janv */}
      <div className="flex flex-col items-center leading-none">
        <span className="text-[9px] font-medium text-gray-500 md:text-[10px]">{dayName}</span>
        <span
          className={cn(
            "text-lg font-bold transition-colors md:text-2xl",
            hasCommandes ? "text-thai-orange" : "text-gray-700",
            hasEvenements && !hasCommandes && "text-purple-600",
            isToday && "text-thai-orange"
          )}
        >
          {dayNumber}
        </span>
        <span className="text-[9px] text-gray-400 md:text-[10px]">{monthName}</span>
      </div>

      {/* Badges / Indicateurs */}
      <div className="mt-1 flex w-full flex-col items-center gap-1 md:mt-2 md:items-stretch">
        {/* Mobile: Points colorés */}
        <div className="flex gap-1 md:hidden">
          {hasCommandes && <div className="bg-thai-orange h-2 w-2 rounded-full" />}
          {hasEvenements && <div className="h-2 w-2 rounded-full bg-purple-500" />}
        </div>

        {/* Desktop: Badges complets */}
        <div className="hidden flex-col gap-1 md:flex">
          {hasCommandes && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-thai-orange flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
            >
              {commandes.length} cmd
            </motion.div>
          )}

          {hasEvenements && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
            >
              {evenements.length} évt
            </motion.div>
          )}
        </div>
      </div>

      {/* Indicateur visuel "Plus" si trop d'éléments */}
      {commandes.length + evenements.length > 3 && (
        <div className="absolute right-2 bottom-1 text-[8px] text-gray-400">...</div>
      )}
    </motion.div>
  )
}
