import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import React from "react"

interface StatusBadgeProps {
  statut: string | null | undefined
  type: "commande" | "evenement"
}

export const StatusBadge = React.memo<StatusBadgeProps>(({ statut, type }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  if (!statut) {
    return (
      <div className="flex justify-center">
        <span className="animate-fadeIn text-sm text-gray-500">Inconnu</span>
      </div>
    )
  }

  let colorClasses = ""
  let glowColor = ""
  let pulseColor = ""
  let variant: "default" | "destructive" | "secondary" | "outline" = "outline"

  if (type === "commande") {
    if (statut === "Confirmée" || statut === "Récupérée") {
      colorClasses =
        "bg-linear-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 hover:from-green-200 hover:to-emerald-200"
      glowColor = "shadow-green-500/30"
      pulseColor = "bg-green-400"
      variant = "default"
    } else if (statut === "En attente de confirmation") {
      colorClasses =
        "bg-linear-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 hover:from-yellow-200 hover:to-amber-200"
      glowColor = "shadow-yellow-500/30"
      pulseColor = "bg-yellow-400"
      variant = "secondary"
    } else if (statut === "Annulée") {
      colorClasses =
        "bg-linear-to-r from-red-100 to-rose-100 text-red-800 border-red-300 hover:from-red-200 hover:to-rose-200"
      glowColor = "shadow-red-500/30"
      pulseColor = "bg-red-400"
      variant = "destructive"
    } else {
      colorClasses =
        "bg-linear-to-r from-blue-100 to-sky-100 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-sky-200"
      glowColor = "shadow-blue-500/30"
      pulseColor = "bg-blue-400"
    }
  } else {
    if (
      statut === "Confirmé / Acompte reçu" ||
      statut === "Payé intégralement" ||
      statut === "Réalisé"
    ) {
      colorClasses =
        "bg-linear-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 hover:from-green-200 hover:to-emerald-200"
      glowColor = "shadow-green-500/30"
      pulseColor = "bg-green-400"
      variant = "default"
    } else if (statut === "En préparation" || statut === "Contact établi") {
      colorClasses =
        "bg-linear-to-r from-blue-100 to-sky-100 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-sky-200"
      glowColor = "shadow-blue-500/30"
      pulseColor = "bg-blue-400"
      variant = "secondary"
    } else if (statut === "Annulé") {
      colorClasses =
        "bg-linear-to-r from-red-100 to-rose-100 text-red-800 border-red-300 hover:from-red-200 hover:to-rose-200"
      glowColor = "shadow-red-500/30"
      pulseColor = "bg-red-400"
      variant = "destructive"
    } else {
      colorClasses =
        "bg-linear-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 hover:from-yellow-200 hover:to-amber-200"
      glowColor = "shadow-yellow-500/30"
      pulseColor = "bg-yellow-400"
    }
  }

  return (
    <div className="flex justify-center">
      <div className="relative">
        <Badge
          variant={variant}
          className={cn(
            "inline-flex h-10 min-w-[80px] transform cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-bold transition-all duration-500",
            colorClasses,
            "animate-fadeIn hover:-translate-y-1 hover:scale-110 hover:rotate-1",
            isHovered ? `shadow-xl ${glowColor}` : "shadow-md"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span
            className={`relative z-10 transition-all duration-300 ${isHovered ? "scale-105" : ""}`}
          >
            {statut}
          </span>

          {/* Effet de brillance au survol */}
          <div
            className={`absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 ${
              isHovered ? "opacity-20" : ""
            } skew-x-12 transform bg-linear-to-r from-white/40 via-transparent to-white/40`}
          />
        </Badge>

        {/* Effet de halo au survol */}
        {isHovered && (
          <div
            className={`absolute inset-0 rounded-lg ${pulseColor} scale-110 animate-pulse opacity-20 blur-md`}
          />
        )}
      </div>
    </div>
  )
})

StatusBadge.displayName = "StatusBadge"
