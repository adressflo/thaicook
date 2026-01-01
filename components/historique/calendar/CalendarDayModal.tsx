import { EventHistoryCard } from "@/components/historique/EventHistoryCard"
import { OrderHistoryCard } from "@/components/historique/OrderHistoryCard"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { CommandeUI, EvenementUI, ExtraUI } from "@/types/app"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Calendar } from "lucide-react"

interface CalendarDayModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  commandes: CommandeUI[]
  evenements: EvenementUI[]
  extras: ExtraUI[]
}

export function CalendarDayModal({
  isOpen,
  onOpenChange,
  date,
  commandes,
  evenements,
  extras,
}: CalendarDayModalProps) {
  if (!date) return null

  const hasContent = commandes.length > 0 || evenements.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-thai-orange max-h-[90vh] w-[95vw] max-w-none overflow-y-auto border-2 bg-white p-4 shadow-2xl md:w-[700px] lg:w-[800px]">
        <VisuallyHidden>
          <DialogTitle>Détails du jour</DialogTitle>
          <DialogDescription>Commandes et événements</DialogDescription>
        </VisuallyHidden>

        {!hasContent ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Calendar className="mb-4 h-12 w-12 text-gray-300" />
            <p>Aucune commande ou événement pour ce jour.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Commandes */}
            {commandes.map((commande) => {
              const canEdit =
                commande.statut_commande !== "Prête à récupérer" &&
                commande.statut_commande !== "Récupérée" &&
                commande.statut_commande !== "Annulée"

              return (
                <OrderHistoryCard
                  key={commande.idcommande}
                  commande={commande}
                  canEdit={canEdit}
                  extras={extras}
                />
              )
            })}

            {/* Événements */}
            {evenements.map((event) => {
              const canEdit =
                event.statut_evenement !== "R_alis_" &&
                event.statut_evenement !== "Pay__int_gralement" &&
                event.statut_evenement !== "Annul_"

              return (
                <EventHistoryCard key={event.idevenements} evenement={event} canEdit={canEdit} />
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
