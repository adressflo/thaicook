import { cn } from "@/lib/utils"
import { CommandeUI, EvenementUI } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"
import Image from "next/image"

interface CalendarDayProps {
  date: Date
  commandes: CommandeUI[]
  evenements: EvenementUI[]
  isToday?: boolean
  isSelected?: boolean
  onClick?: () => void
}

// Helper pour récupérer le chemin de l'icône SVG selon le statut de la commande
const getCommandeIconPath = (statut: string | null | undefined): string => {
  switch (statut) {
    case "En attente de confirmation":
      return "/media/statut/enattentedeconfirmation/enattentedeconfirmation.svg"
    case "Confirmée":
      return "/media/statut/confirmee/confirmeestatut.svg"
    case "En préparation":
      return "/media/statut/enpreparation/enpreparation1.svg"
    case "Prête à récupérer":
      return "/media/statut/pretearecuperer/pretearecuperer.svg"
    case "Récupérée":
      return "/media/statut/recuperee/recuperee.svg"
    case "Annulée":
      return "/media/statut/annule/annule.svg"
    default:
      // Fallback si pas de statut (ou statut inconnu), utiliser l'icône d'attente par défaut
      return "/media/statut/enattentedeconfirmation/enattentedeconfirmation.svg"
  }
}

// Helper pour récupérer le chemin de l'icône SVG pour les événements (unique pour le moment)
const getEvenementIconPath = (): string => {
  return "/media/statut/evenement/evenement.svg"
}

// Couleurs de bordure par statut de commande
const getCommandeBorderColor = (statut: string | null | undefined): string => {
  switch (statut) {
    case "En attente de confirmation":
      return "border-amber-500"
    case "Confirmée":
      return "border-emerald-500"
    case "En préparation":
      return "border-orange-500"
    case "Prête à récupérer":
      return "border-yellow-400"
    case "Récupérée":
      return "border-green-600"
    case "Annulée":
      return "border-red-500"
    default:
      return "border-gray-400"
  }
}

// Couleurs de bordure par statut d'événement
const getEvenementBorderColor = (statut: string | null | undefined): string => {
  const s = statut as unknown as string
  switch (s) {
    case "Demande initiale":
    case "Demande_initiale":
      return "border-violet-500"
    case "Contact établi":
    case "Contact__tabli":
      return "border-indigo-500"
    case "En préparation":
    case "En_pr_paration":
      return "border-purple-500"
    case "Confirmé / Acompte reçu":
    case "Confirm____Acompte_re_u":
      return "border-fuchsia-500"
    case "Réalisé":
    case "R_alis_":
      return "border-teal-500"
    case "Annulé":
    case "Annul_":
      return "border-rose-500"
    default:
      return "border-purple-400"
  }
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
  const isInteractive = !!onClick

  // Noms de jours et mois courts
  const dayName = format(date, "EEE", { locale: fr }).toUpperCase().replace(".", "")
  const dayNumber = format(date, "d")
  const monthName = format(date, "MMM", { locale: fr }).toLowerCase().replace(".", "")

  // Prendre le statut le plus prioritaire pour la bordure et l'icône de fond
  const primaryCommandeStatus = commandes[0]?.statut_commande
  const primaryEvenementStatus = evenements[0]?.statut_evenement

  // Déterminer l'icône principale à afficher en fond
  const backgroundIcon = hasCommandes
    ? getCommandeIconPath(primaryCommandeStatus)
    : hasEvenements
      ? getEvenementIconPath()
      : null

  return (
    <motion.div
      whileHover={isInteractive ? { scale: 1.05, zIndex: 10 } : {}}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={cn(
        "relative flex min-h-[80px] flex-col items-center justify-start overflow-hidden rounded-xl border-2 p-1 transition-colors duration-200 md:min-h-[100px] md:p-2",
        isInteractive ? "cursor-pointer" : "cursor-default opacity-75",
        // Fond orange + bordure statut pour commandes (sans icône de fond, on garde la couleur légère)
        hasCommandes &&
          !hasEvenements &&
          cn(
            "bg-thai-orange/5 hover:bg-thai-orange/10",
            getCommandeBorderColor(primaryCommandeStatus)
          ),
        // Fond violet + bordure statut pour événements
        hasEvenements &&
          !hasCommandes &&
          cn(
            "bg-purple-500/5 hover:bg-purple-500/10",
            getEvenementBorderColor(primaryEvenementStatus)
          ),
        // Style mixte si les deux
        hasCommandes &&
          hasEvenements &&
          cn(
            "from-thai-orange/5 bg-linear-to-br to-purple-500/5",
            getCommandeBorderColor(primaryCommandeStatus)
          ),
        // Style Aujourd'hui
        isToday && "ring-thai-orange bg-white shadow-md ring-2",
        // Style Sélectionné
        isSelected && "bg-thai-cream ring-thai-green shadow-lg ring-2",
        // Style vide par défaut
        !hasCommandes &&
          !hasEvenements &&
          !isToday &&
          !isSelected &&
          "border-transparent bg-white/50 hover:bg-white"
      )}
    >
      {/* Image de fond (Watermark) - Pleine opacité */}
      {backgroundIcon && (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-100 grayscale-0 transition-transform hover:scale-105">
          <Image src={backgroundIcon} alt="Statut" fill className="object-cover" priority />
        </div>
      )}

      {/* Date Header: LUN 12 janv - Masqué si image de fond présente */}
      {!backgroundIcon && (
        <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 drop-shadow-sm">
          {/* Jour semaine */}
          <span className="text-thai-green text-[9px] font-black tracking-[0.2em] uppercase md:text-[10px]">
            {dayName}
          </span>

          {/* Numéro */}
          <span
            className={cn(
              "text-3xl font-black tracking-tighter transition-colors md:text-4xl",
              isToday ? "text-thai-orange" : "text-thai-green drop-shadow-sm"
            )}
          >
            {dayNumber}
          </span>

          {/* Mois */}
          <span className="text-thai-green/90 text-[9px] font-bold tracking-wider uppercase md:text-[10px]">
            {monthName}
          </span>
        </div>
      )}

      {/* Indicateur "Plus" si nécessaire (discret) */}
      {commandes.length + evenements.length > 1 && (
        <div className="absolute right-2 bottom-1 z-10 rounded-full bg-white/50 px-1 py-0.5 text-[8px] font-bold text-gray-500 backdrop-blur-sm">
          +{commandes.length + evenements.length - 1}
        </div>
      )}
    </motion.div>
  )
}
