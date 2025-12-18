import {
  CommandeActionButtons,
  EvenementActionButtons,
} from "@/components/historique/ActionButtons"
import { DishList, FormattedPrice, PersonCount } from "@/components/historique/FormattedDisplay"
import { StatusBadge } from "@/components/historique/StatusBadge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CommandeUI, EvenementUI, ExtraUI } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, PartyPopper, Utensils, X } from "lucide-react"

interface CalendarDayModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  commandes: CommandeUI[]
  evenements: EvenementUI[]
  extras: ExtraUI[]
  formatPrix: (prix: number) => string
  calculateTotal: (commande: CommandeUI) => number
}

export function CalendarDayModal({
  isOpen,
  onOpenChange,
  date,
  commandes,
  evenements,
  extras,
  formatPrix,
  calculateTotal,
}: CalendarDayModalProps) {
  if (!date) return null

  // Format date: Lundi 12 Janvier 2025
  const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: fr })
  const formattedDateCapitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  const hasContent = commandes.length > 0 || evenements.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-thai-orange max-w-2xl overflow-hidden border-2 bg-white p-0 shadow-2xl">
        <div className="from-thai-cream relative bg-linear-to-r to-white p-6">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="icon"
            className="hover:bg-thai-orange/10 text-thai-orange absolute top-4 right-4"
          >
            <X className="h-5 w-5" />
          </Button>

          <DialogHeader className="mb-6">
            <DialogTitle className="text-thai-green text-center text-2xl font-bold">
              {formattedDateCapitalized}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            {!hasContent ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Calendar className="mb-4 h-12 w-12 text-gray-300" />
                <p>Aucune commande ou événement pour ce jour.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Commandes */}
                {commandes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-thai-orange border-thai-orange/20 flex items-center gap-2 border-b pb-2 text-lg font-bold">
                      <Utensils className="h-5 w-5" />
                      Commandes ({commandes.length})
                    </h3>

                    <div className="space-y-3">
                      {commandes.map((commande) => {
                        const canEdit =
                          commande.statut_commande !== "Prête à récupérer" &&
                          commande.statut_commande !== "Récupérée" &&
                          commande.statut_commande !== "Annulée"

                        return (
                          <div
                            key={commande.idcommande}
                            className="border-thai-orange/20 rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 font-medium text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  {commande.date_et_heure_de_retrait_souhaitees &&
                                    format(
                                      new Date(commande.date_et_heure_de_retrait_souhaitees),
                                      "HH:mm"
                                    )}
                                </span>
                                <StatusBadge statut={commande.statut_commande} type="commande" />
                              </div>

                              <div className="border-thai-orange/10 border-l-2 pl-4">
                                <DishList
                                  details={commande.details || []}
                                  formatPrix={formatPrix}
                                  extras={extras}
                                />
                              </div>

                              <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
                                <FormattedPrice
                                  prix={calculateTotal(commande)}
                                  formatPrix={formatPrix}
                                  details={commande.details || []}
                                />

                                <CommandeActionButtons
                                  commandeId={commande.idcommande}
                                  canEdit={canEdit}
                                  commande={commande}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Événements */}
                {evenements.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 border-b border-purple-200 pb-2 text-lg font-bold text-purple-600">
                      <PartyPopper className="h-5 w-5" />
                      Événements ({evenements.length})
                    </h3>

                    <div className="space-y-3">
                      {evenements.map((event) => {
                        const canEdit =
                          (event.statut_evenement as any) !== "Réalisé" &&
                          (event.statut_evenement as any) !== "Payé intégralement" &&
                          (event.statut_evenement as any) !== "Annulé"

                        return (
                          <div
                            key={event.idevenements}
                            className="rounded-lg border border-purple-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <span className="text-thai-green text-lg font-bold">
                                  {event.nom_evenement}
                                </span>
                                <StatusBadge statut={event.statut_evenement} type="evenement" />
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-purple-500" />
                                  {event.type_evenement}
                                </div>
                                <div className="flex items-center gap-2">
                                  <PersonCount count={event.nombre_de_personnes} />
                                </div>
                              </div>

                              <div className="mt-1 flex items-center justify-end border-t border-gray-100 pt-3">
                                <EvenementActionButtons
                                  evenementId={event.idevenements}
                                  canEdit={canEdit}
                                  evenement={event}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
