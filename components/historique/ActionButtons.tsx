import { Button } from "@/components/ui/button"
import type { CommandeUI } from "@/types/app"
import { Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import React from "react"
import BoutonCommanderNouveau from "./BoutonCommanderNouveau"
import BoutonTelechargerFacture from "./BoutonTelechargerFacture"

interface CommandeActionButtonsProps {
  commandeId: number
  canEdit: boolean
  commande?: CommandeUI
  onCancel?: (e: React.MouseEvent) => void
}

export const CommandeActionButtons = React.memo<CommandeActionButtonsProps>((props) => {
  const { commandeId, canEdit, commande } = props
  return (
    <div className="relative flex w-full min-w-[140px] flex-wrap items-center justify-center gap-2">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="group hover:border-thai-orange/50 min-w-[60px] transform-gpu border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
      >
        <Link href={`/suivi-commande/${commandeId}`}>
          <Eye className="mr-1 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-medium">Voir</span>
        </Link>
      </Button>
      {canEdit && (
        <Button
          asChild
          variant="default"
          size="sm"
          className="group from-thai-orange to-thai-orange/90 hover:from-thai-orange/90 hover:to-thai-orange min-w-[60px] transform-gpu bg-linear-to-r shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
        >
          <Link href={`/modifier-commande/${commandeId}`}>
            <Edit className="mr-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
            <span className="font-medium">Modifier</span>
          </Link>
        </Button>
      )}

      {/* Bouton Poubelle (Annuler) - Coin Droite */}
      {props.onCancel &&
        commande &&
        ["En attente de confirmation", "Confirmée"].includes(commande.statut_commande || "") && (
          <Button
            variant="destructive"
            size="sm"
            onClick={props.onCancel}
            className="group min-w-[40px] transform-gpu border-2 border-red-200 bg-white text-red-500 transition-all duration-200 hover:scale-[1.02] hover:border-red-500 hover:bg-red-50 hover:shadow-md"
            title="Annuler la commande"
          >
            <Trash2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          </Button>
        )}

      {commande &&
        (commande.statut_commande === "Récupérée" || commande.statut_commande === "Annulée") && (
          <BoutonCommanderNouveau
            commande={commande}
            className="hover:border-thai-orange/50 border-2"
          />
        )}
      {commande && commande.statut_commande === "Récupérée" && (
        <BoutonTelechargerFacture commande={commande} />
      )}
    </div>
  )
})

CommandeActionButtons.displayName = "CommandeActionButtons"

interface EvenementActionButtonsProps {
  evenementId: number
  canEdit: boolean
}

export const EvenementActionButtons = React.memo<EvenementActionButtonsProps>(
  ({ evenementId, canEdit }) => (
    <div className="flex w-full min-w-[140px] flex-wrap items-center justify-center gap-2">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="group hover:border-thai-green/50 min-w-[60px] transform-gpu border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
      >
        <Link href={`/suivi-evenement/${evenementId}`}>
          <Eye className="mr-1 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-medium">Voir</span>
        </Link>
      </Button>
      {canEdit && (
        <Button
          asChild
          variant="default"
          size="sm"
          className="group from-thai-green to-thai-green/90 hover:from-thai-green/90 hover:to-thai-green min-w-[60px] transform-gpu bg-linear-to-r shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
        >
          <Link href={`/modifier-evenement/${evenementId}`}>
            <Edit className="mr-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
            <span className="font-medium">Modifier</span>
          </Link>
        </Button>
      )}
    </div>
  )
)

EvenementActionButtons.displayName = "EvenementActionButtons"
