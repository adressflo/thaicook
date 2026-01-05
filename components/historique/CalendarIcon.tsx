import { format } from "date-fns"
import { fr } from "date-fns/locale"
import React from "react"

interface CalendarIconProps {
  date: Date
  className?: string
}

export const CalendarIcon = React.memo<CalendarIconProps>(({ date, className = "" }) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const dayNumber = format(date, "d")
  const monthName = format(date, "MMM", { locale: fr }).toLowerCase().substring(0, 4)
  const dayName = format(date, "EEE", { locale: fr }).toUpperCase().substring(0, 3)
  const timeString = format(date, "HH:mm")

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      {/* Calendar body */}
      <div
        className={`border-thai-orange w-[90px] cursor-pointer rounded-lg border-2 bg-white shadow-md transition-all duration-300 ${
          isHovered ? "-translate-y-1 scale-105 shadow-xl" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Calendar header - Day name */}
        <div
          className={`rounded-t-md py-1.5 text-center text-xs font-bold transition-all duration-300 ${
            isHovered
              ? "from-thai-orange/90 to-thai-gold bg-linear-to-r text-white"
              : "from-thai-orange to-thai-orange/90 bg-linear-to-r text-white"
          }`}
        >
          {dayName}
        </div>

        {/* Calendar body */}
        <div className="to-thai-cream/30 bg-linear-to-b from-white px-3 py-2 text-center">
          {/* Day number - Plus grand et centré */}
          <div
            className={`mb-1 text-3xl leading-none font-bold transition-all duration-300 ${
              isHovered ? "text-thai-orange scale-110" : "text-thai-green"
            }`}
          >
            {dayNumber}
          </div>

          {/* Month name - Plus petit */}
          <div
            className={`mb-1 text-[10px] leading-none font-medium transition-colors duration-300 ${
              isHovered ? "text-thai-green" : "text-gray-600"
            }`}
          >
            {monthName}
          </div>

          {/* Time - Compact */}
          <div
            className={`rounded px-2 py-0.5 text-[10px] leading-none font-bold text-white transition-colors duration-300 ${
              isHovered ? "bg-thai-gold" : "bg-thai-orange"
            }`}
          >
            {timeString}
          </div>
        </div>

        {/* Subtle glow effect */}
        <div
          className={`from-thai-orange/20 to-thai-gold/20 absolute inset-0 -z-10 scale-110 rounded-lg bg-linear-to-r blur-sm transition-opacity duration-300 ${
            isHovered ? "opacity-30" : "opacity-0"
          }`}
        />
      </div>
    </div>
  )
})

CalendarIcon.displayName = "CalendarIcon"
