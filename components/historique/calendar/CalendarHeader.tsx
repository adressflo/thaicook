import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
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
    <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row">
      <div className="flex items-center gap-4">
        <h2 className="text-thai-green text-3xl font-bold capitalize">{formattedTitle}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevMonth}
          className="border-thai-green/30 hover:bg-thai-green/10 text-thai-green"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="border-thai-orange/30 hover:bg-thai-orange/10 text-thai-orange font-medium"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Aujourd'hui
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNextMonth}
          className="border-thai-green/30 hover:bg-thai-green/10 text-thai-green"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
