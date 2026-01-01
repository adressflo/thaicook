"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import React from "react"

interface MyCalendarIconProps {
  date: Date
  className?: string
  // Taille
  size?: "sm" | "md" | "lg" | "xl" | "custom"
  customSize?: number // en pixels (largeur)
  // Bordure
  borderColor?: "thai-orange" | "thai-green" | "blue" | "red" | "custom"
  customBorderColor?: string
  borderHoverColor?: "thai-gold" | "thai-green" | "blue" | "red" | "custom"
  customBorderHoverColor?: string
  borderWidth?: 1 | 2 | 4 | "custom"
  customBorderWidth?: number
  // Animations
  hoverAnimation?: boolean
  // Affichage
  showTime?: boolean
  // Style header
  headerColor?: "gradient" | "solid-orange" | "solid-green" | "custom"
  customHeaderColor?: string
  headerHoverColor?: "gradient-gold" | "solid-gold" | "solid-emerald" | "custom"
  customHeaderHoverColor?: string
  // Couleur badge heure
  timeBadgeColor?: "thai-orange" | "thai-green" | "thai-gold" | "blue" | "red" | "custom"
  customTimeBadgeColor?: string
  timeBadgeHoverColor?: "thai-gold" | "thai-green" | "thai-orange" | "blue" | "custom"
  customTimeBadgeHoverColor?: string
}

const sizeConfig: Record<
  string,
  { width: string; dayText: string; monthText: string; timeText: string; headerPy: string }
> = {
  sm: {
    width: "w-[60px]",
    dayText: "text-xl",
    monthText: "text-[8px]",
    timeText: "text-[8px]",
    headerPy: "py-1",
  },
  md: {
    width: "w-[90px]",
    dayText: "text-3xl",
    monthText: "text-[10px]",
    timeText: "text-[10px]",
    headerPy: "py-1.5",
  },
  lg: {
    width: "w-[120px]",
    dayText: "text-4xl",
    monthText: "text-xs",
    timeText: "text-xs",
    headerPy: "py-2",
  },
  xl: {
    width: "w-[150px]",
    dayText: "text-5xl",
    monthText: "text-sm",
    timeText: "text-sm",
    headerPy: "py-2.5",
  },
}

const borderColorConfig: Record<string, string> = {
  "thai-orange": "border-thai-orange",
  "thai-green": "border-thai-green",
  blue: "border-blue-500",
  red: "border-red-500",
}

const borderWidthConfig: Record<number, string> = {
  1: "border",
  2: "border-2",
  4: "border-4",
}

const headerColorConfig: Record<string, string> = {
  gradient: "from-thai-orange to-thai-orange/90 bg-linear-to-r",
  "solid-orange": "bg-thai-orange",
  "solid-green": "bg-thai-green",
}

const headerHoverConfig: Record<string, string> = {
  "gradient-gold": "from-thai-orange/90 to-thai-gold bg-linear-to-r",
  "solid-gold": "bg-thai-gold",
  "solid-emerald": "bg-emerald-600",
}

const timeBadgeColorConfig: Record<string, string> = {
  "thai-orange": "bg-thai-orange",
  "thai-green": "bg-thai-green",
  "thai-gold": "bg-thai-gold",
  blue: "bg-blue-500",
  red: "bg-red-500",
}

export const MyCalendarIcon = React.memo<MyCalendarIconProps>(
  ({
    date,
    className = "",
    size = "md",
    customSize,
    borderColor = "thai-orange",
    customBorderColor,
    borderHoverColor,
    customBorderHoverColor,
    borderWidth = 2,
    customBorderWidth,
    hoverAnimation = true,
    showTime = true,
    headerColor = "gradient",
    customHeaderColor,
    headerHoverColor = "gradient-gold",
    customHeaderHoverColor,
    timeBadgeColor = "thai-orange",
    customTimeBadgeColor,
    timeBadgeHoverColor = "thai-gold",
    customTimeBadgeHoverColor,
  }) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const dayNumber = format(date, "d")
    const monthName = format(date, "MMM", { locale: fr }).toLowerCase().substring(0, 4)
    const dayName = format(date, "EEE", { locale: fr }).toUpperCase().substring(0, 3)
    const timeString = format(date, "HH:mm")

    // Size styles
    const sizeStyles =
      size === "custom" && customSize
        ? {
            width: "",
            dayText: "text-3xl",
            monthText: "text-[10px]",
            timeText: "text-[10px]",
            headerPy: "py-1.5",
          }
        : sizeConfig[size] || sizeConfig.md
    const customWidthStyle =
      size === "custom" && customSize ? { width: `${customSize}px` } : undefined

    // Border color (with hover support)
    const borderColorClass =
      isHovered && hoverAnimation && borderHoverColor
        ? borderHoverColor === "custom" && customBorderHoverColor
          ? customBorderHoverColor
          : borderColorConfig[borderHoverColor] || borderColorConfig["thai-gold"]
        : borderColor === "custom" && customBorderColor
          ? customBorderColor
          : borderColorConfig[borderColor] || borderColorConfig["thai-orange"]

    // Border width
    const borderWidthClass =
      borderWidth === "custom" && customBorderWidth
        ? ""
        : borderWidthConfig[borderWidth as number] || borderWidthConfig[2]
    const customBorderStyle =
      borderWidth === "custom" && customBorderWidth
        ? { borderWidth: `${customBorderWidth}px`, borderStyle: "solid" }
        : undefined

    // Header color (with hover support)
    const headerClass =
      isHovered && hoverAnimation
        ? headerHoverColor === "custom" && customHeaderHoverColor
          ? customHeaderHoverColor
          : headerHoverConfig[headerHoverColor] || headerHoverConfig["gradient-gold"]
        : headerColor === "custom" && customHeaderColor
          ? customHeaderColor
          : headerColorConfig[headerColor] || headerColorConfig.gradient

    // Time badge color (with hover support)
    const timeBadgeClass =
      isHovered && hoverAnimation
        ? timeBadgeHoverColor === "custom" && customTimeBadgeHoverColor
          ? customTimeBadgeHoverColor
          : timeBadgeColorConfig[timeBadgeHoverColor] || timeBadgeColorConfig["thai-gold"]
        : timeBadgeColor === "custom" && customTimeBadgeColor
          ? customTimeBadgeColor
          : timeBadgeColorConfig[timeBadgeColor] || timeBadgeColorConfig["thai-orange"]

    return (
      <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
        {/* Calendar body */}
        <div
          className={`${sizeStyles.width} ${borderColorClass} ${borderWidthClass} cursor-pointer rounded-lg bg-white shadow-md transition-all duration-300 ${
            isHovered && hoverAnimation ? "-translate-y-1 scale-105 shadow-xl" : ""
          }`}
          style={{ ...customWidthStyle, ...customBorderStyle }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Calendar header - Day name */}
          <div
            className={`rounded-t-md ${sizeStyles.headerPy} text-center ${sizeStyles.monthText} font-bold text-white transition-all duration-300 ${headerClass}`}
          >
            {dayName}
          </div>

          {/* Calendar body */}
          <div className="to-thai-cream/30 bg-linear-to-b from-white px-3 py-2 text-center">
            {/* Day number */}
            <div
              className={`mb-1 ${sizeStyles.dayText} leading-none font-bold transition-all duration-300 ${
                isHovered && hoverAnimation ? "text-thai-orange scale-110" : "text-thai-green"
              }`}
            >
              {dayNumber}
            </div>

            {/* Month name */}
            <div
              className={`mb-1 ${sizeStyles.monthText} leading-none font-medium transition-colors duration-300 ${
                isHovered && hoverAnimation ? "text-thai-green" : "text-gray-600"
              }`}
            >
              {monthName}
            </div>

            {/* Time */}
            {showTime && (
              <div
                className={`rounded px-2 py-0.5 ${sizeStyles.timeText} leading-none font-bold text-white transition-colors duration-300 ${timeBadgeClass}`}
              >
                {timeString}
              </div>
            )}
          </div>

          {/* Subtle glow effect */}
          {hoverAnimation && (
            <div
              className={`from-thai-orange/20 to-thai-gold/20 absolute inset-0 -z-10 scale-110 rounded-lg bg-linear-to-r blur-sm transition-opacity duration-300 ${
                isHovered ? "opacity-30" : "opacity-0"
              }`}
            />
          )}
        </div>
      </div>
    )
  }
)

MyCalendarIcon.displayName = "MyCalendarIcon"
