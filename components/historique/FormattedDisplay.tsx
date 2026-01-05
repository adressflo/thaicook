import { CommandePlatModalTrigger } from "@/components/shared/CommandePlatModal"
import type { EvenementUI } from "@/types/app"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Sparkles, Users, Utensils } from "lucide-react"
import Image from "next/image"
import React from "react"
import { CalendarIcon } from "./CalendarIcon"

interface FormattedPriceProps {
  prix: number
  formatPrix: (prix: number) => string
  details?: any[] // Type simplifié pour éviter conflits TypeScript complexes
}

export const FormattedPrice = React.memo<FormattedPriceProps>(({ prix, formatPrix, details }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div className="flex justify-center">
      <div className="relative">
        <span
          className="bg-thai-orange inline-flex min-w-[80px] transform cursor-help items-center justify-center rounded-lg px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {formatPrix(prix)}
        </span>

        {/* Tooltip moderne avec glassmorphism */}
        {details && details.length > 0 && isHovered && (
          <div className="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 z-50 mb-3 max-w-[260px] min-w-[240px] -translate-x-1/2 transform duration-200">
            <div className="shadow-thai-orange/10 relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-3 shadow-2xl backdrop-blur-lg dark:bg-slate-800/95">
              {/* Fond dégradé subtil */}
              <div className="from-thai-cream/30 to-thai-orange/10 absolute inset-0 rounded-2xl bg-linear-to-br via-transparent"></div>

              {/* Contenu */}
              <div className="relative z-10">
                {/* En-tête */}

                {/* Liste des plats */}
                <div className="space-y-1.5">
                  {details.map((detail, index) => {
                    const isExtra = detail.type === "extra"
                    const platName = isExtra
                      ? detail.nom_plat || "Extra"
                      : detail.plat?.plat || "Plat supprimé"
                    const prixPlat = isExtra ? detail.prix_unitaire || 0 : detail.plat?.prix || 0
                    const quantite = detail.quantite_plat_commande || 0
                    const sousTotal = prixPlat * quantite

                    return (
                      <div
                        key={index}
                        className="from-thai-cream/10 to-thai-orange/5 border-thai-orange/15 hover:border-thai-orange/30 rounded-lg border bg-linear-to-r p-2 transition-colors duration-150"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-1 items-center gap-2">
                            {/* Miniature photo du plat ou extra */}
                            <Image
                              src={
                                detail.extra?.photo_url ||
                                "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
                              }
                              alt={platName}
                              width={20}
                              height={20}
                              className="border-thai-orange/60 shrink-0 rounded-full border object-cover shadow-sm"
                            />
                            <span className="truncate text-sm font-bold text-gray-800">
                              {platName}
                            </span>
                            <span className="bg-thai-orange/20 text-thai-orange shrink-0 rounded-full px-1 py-0.5 text-xs font-semibold">
                              ×{quantite}
                            </span>
                          </div>
                          <span className="text-thai-orange text-xs font-medium">
                            {formatPrix(sousTotal)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Séparateur élégant */}
                <div className="via-thai-orange/30 my-2 h-px bg-linear-to-r from-transparent to-transparent"></div>

                {/* Total avec style premium */}
                {/* Total avec style premium */}
                <div className="from-thai-green/10 to-thai-orange/10 border-thai-orange/20 rounded-xl border bg-linear-to-r p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-thai-green text-sm font-bold">Total commande</span>
                    <span className="text-thai-orange text-lg font-black">{formatPrix(prix)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flèche moderne avec ombre */}
            <div className="absolute top-full left-1/2 -mt-px -translate-x-1/2 transform">
              <div className="h-3 w-3 rotate-45 border-r border-b border-white/20 bg-white/95 shadow-lg dark:bg-slate-800/95"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

FormattedPrice.displayName = "FormattedPrice"

interface FormattedDateProps {
  date: string | null
}

export const FormattedDate = React.memo<FormattedDateProps>(({ date }) => {
  const { formattedDate, dateObj } = React.useMemo(() => {
    if (!date) {
      return { formattedDate: null, dateObj: null }
    }

    try {
      const dateObj = date.includes("T") ? parseISO(date) : new Date(date)
      const formattedDate = format(dateObj, "eeee dd MMMM HH:mm", { locale: fr })
      return { formattedDate, dateObj }
    } catch (error) {
      console.error("Error formatting date:", error)
      return { formattedDate: "Date invalide", dateObj: null }
    }
  }, [date])

  if (!formattedDate) {
    return (
      <div className="flex justify-center">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 text-gray-400" />
            Non définie
          </span>
        </div>
      </div>
    )
  }

  if (!dateObj) {
    return (
      <div className="flex justify-center">
        <div className="bg-thai-cream/30 border-thai-orange/20 rounded-lg border p-3">
          <div className="text-thai-green flex items-center gap-2 font-medium">
            <Calendar className="text-thai-orange h-4 w-4" />
            <span className="text-sm">{formattedDate || "Date invalide"}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <CalendarIcon date={dateObj} className="shrink-0" />
    </div>
  )
})

FormattedDate.displayName = "FormattedDate"

interface FormattedEventProps {
  event: EvenementUI
}

export const FormattedEvent = React.memo<FormattedEventProps>(({ event }) => (
  <div className="flex justify-center">
    <div className="group relative">
      <div className="inline-flex min-w-[120px] transform items-center justify-center rounded-lg bg-linear-to-r from-purple-500 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:rotate-1 hover:shadow-lg">
        <span className="max-w-[100px] truncate">{event.nom_evenement}</span>
      </div>
      <div className="absolute -inset-0.5 rounded-lg bg-linear-to-r from-purple-400 to-pink-500 opacity-0 transition-opacity duration-200 group-hover:opacity-40" />
    </div>
  </div>
))

FormattedEvent.displayName = "FormattedEvent"

interface PersonCountProps {
  count: number | null
}

export const PersonCount = React.memo<PersonCountProps>(({ count }) => (
  <div className="flex justify-center">
    <div className="group relative">
      <div className="inline-flex min-w-[70px] transform items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-500 to-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg">
        <Users className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        <span className="font-bold">{count || "N/A"}</span>
      </div>
      <div className="absolute -inset-0.5 rounded-lg bg-linear-to-r from-teal-400 to-cyan-500 opacity-0 transition-opacity duration-200 group-hover:opacity-30" />
    </div>
  </div>
))

PersonCount.displayName = "PersonCount"

interface DishListProps {
  details: any[] // Type simplifié pour éviter conflits TypeScript complexes
  formatPrix: (prix: number) => string
  extras?: any[] // Liste des extras pour résolution des noms
}

export const DishList = React.memo<DishListProps>(({ details, formatPrix, extras }) => {
  if (!details?.length) {
    return (
      <div className="flex justify-center">
        <span className="rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-2 text-sm text-gray-400 italic">
          Aucun plat
        </span>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-sm flex-wrap justify-center gap-3 p-2 sm:max-w-md lg:max-w-lg">
      {details.map((detail, index) => {
        const isExtra = detail.type === "extra"
        const platName = isExtra ? detail.nom_plat || "Extra" : detail.plat?.plat || "Plat supprimé"
        const quantite = detail.quantite_plat_commande || 0
        const displayName = quantite > 1 ? `${platName} (x${quantite})` : platName
        const isDeleted = !isExtra && !detail.plat?.plat

        return (
          <CommandePlatModalTrigger
            key={`${detail.plat?.idplats || "unknown"}-${index}`}
            plat={detail.plat as any}
            extra={detail.extra as any}
            detail={detail as any}
            formatPrix={formatPrix}
            mode="readonly"
            showPriceDetails={true}
            showBadgePanier={false}
            modalSize="sm"
            disableScroll={true}
          >
            <div
              className="group animate-fadeIn relative p-1 hover:z-10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`relative inline-flex w-[260px] transform cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2 text-base font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl sm:w-[280px] sm:gap-2 ${
                  isDeleted
                    ? "border-2 border-gray-300 bg-gray-100 text-gray-600 hover:border-gray-400 hover:bg-gray-200"
                    : "bg-thai-cream text-thai-green border-thai-green/30 hover:border-thai-green hover:text-thai-orange hover:shadow-thai-orange/25 shadow-lg hover:bg-white hover:shadow-2xl"
                } `}
              >
                {detail.extra?.photo_url ? (
                  <img
                    src={detail.extra.photo_url}
                    alt={platName}
                    className="border-thai-orange/60 h-8 w-8 shrink-0 rounded-full border-2 object-cover shadow-md"
                  />
                ) : detail.plat?.photo_du_plat && !isDeleted ? (
                  <img
                    src={detail.plat.photo_du_plat}
                    alt={platName}
                    className="border-thai-orange/60 h-8 w-8 shrink-0 rounded-full border-2 object-cover shadow-md"
                  />
                ) : isExtra ? (
                  <div className="from-thai-gold to-thai-orange border-thai-orange/60 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-linear-to-br shadow-md">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <Utensils
                    className={`h-5 w-5 shrink-0 ${isDeleted ? "text-gray-400" : "text-thai-green"}`}
                  />
                )}
                <span className="flex-1 truncate font-bold">{platName}</span>
                {quantite > 1 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs font-bold whitespace-nowrap sm:px-2 ${
                      isDeleted ? "bg-gray-300 text-gray-600" : "bg-thai-green text-white"
                    }`}
                  >
                    x{quantite}
                  </span>
                )}
                {detail.extra?.photo_url ? (
                  <img
                    src={detail.extra.photo_url}
                    alt={platName}
                    className="border-thai-orange/60 h-8 w-8 shrink-0 rounded-full border-2 object-cover shadow-md"
                  />
                ) : detail.plat?.photo_du_plat && !isDeleted ? (
                  <img
                    src={detail.plat.photo_du_plat}
                    alt={platName}
                    className="border-thai-orange/60 h-8 w-8 shrink-0 rounded-full border-2 object-cover shadow-md"
                  />
                ) : isExtra ? (
                  <div className="from-thai-gold to-thai-orange border-thai-orange/60 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-linear-to-br shadow-md">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <Utensils
                    className={`h-5 w-5 shrink-0 ${isDeleted ? "text-gray-400" : "text-thai-green"}`}
                  />
                )}
              </div>

              {/* Subtle hover glow effect */}
              {!isDeleted && (
                <div className="from-thai-green/15 to-thai-red/15 absolute inset-0 -z-10 rounded-md bg-linear-to-br via-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />
              )}
            </div>
          </CommandePlatModalTrigger>
        )
      })}
    </div>
  )
})

DishList.displayName = "DishList"
