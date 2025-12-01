import { Button } from "@/components/ui/button"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"
import React from "react"

interface CommandeActionButtonsProps {
  commandeId: number
  canEdit: boolean
}

export const CommandeActionButtons = React.memo<CommandeActionButtonsProps>(
  ({ commandeId, canEdit }) => (
    <div className="flex w-full min-w-[140px] items-center justify-center gap-2">
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
    </div>
  )
)

CommandeActionButtons.displayName = "CommandeActionButtons"

interface EvenementActionButtonsProps {
  evenementId: number
  canEdit: boolean
}

export const EvenementActionButtons = React.memo<EvenementActionButtonsProps>(
  ({ evenementId, canEdit }) => (
    <div className="flex w-full min-w-[140px] items-center justify-center gap-2">
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
