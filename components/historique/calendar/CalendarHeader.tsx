import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  const monthLabel = format(currentDate, "MMMM yyyy", { locale: fr })
  // Capitalize first letter
  const formattedTitle = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="shadow-thai-orange/5 relative flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-5 shadow-lg backdrop-blur-md md:flex-row"
    >
      {/* Gradient accent line */}
      <div className="from-thai-green via-thai-orange to-thai-green absolute bottom-0 left-0 h-1 w-full bg-linear-to-r opacity-60" />

      <div className="flex items-center gap-3">
        <div className="from-thai-orange to-thai-orange/70 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br shadow-md">
          <CalendarIcon className="h-5 w-5 text-white" />
        </div>
        <h2 className="from-thai-green to-thai-green/80 bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent">
          {formattedTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevMonth}
          className="border-thai-green/20 text-thai-green hover:bg-thai-green/10 h-10 w-10 rounded-full border bg-white/50 shadow-sm transition-all hover:scale-105 hover:shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="border-thai-orange/30 from-thai-orange/10 to-thai-cream text-thai-orange hover:from-thai-orange/20 hover:to-thai-cream rounded-full bg-linear-to-r px-4 font-semibold shadow-sm transition-all hover:scale-105 hover:shadow-md"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Aujourd&apos;hui
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNextMonth}
          className="border-thai-green/20 text-thai-green hover:bg-thai-green/10 h-10 w-10 rounded-full border bg-white/50 shadow-sm transition-all hover:scale-105 hover:shadow-md"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}
