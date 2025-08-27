import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';

interface CommandeActionButtonsProps {
  commandeId: number;
  canEdit: boolean;
}

export const CommandeActionButtons = React.memo<CommandeActionButtonsProps>(({ commandeId, canEdit }) => (
  <div className="flex gap-2 justify-center">
    <Button 
      asChild 
      variant="outline" 
      size="sm"
      className="group hover:scale-105 transition-all duration-200 hover:shadow-md border-2 hover:border-thai-orange/50"
    >
      <Link href={`/suivi-commande/${commandeId}`}>
        <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">Voir</span>
      </Link>
    </Button>
    {canEdit && (
      <Button
        asChild
        variant="default"
        size="sm"
        className="group bg-gradient-to-r from-thai-orange to-thai-orange/90 hover:from-thai-orange/90 hover:to-thai-orange shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <Link href={`/modifier-commande/${commandeId}`}>
          <Edit className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform duration-200" />
          <span className="font-medium">Modifier</span>
        </Link>
      </Button>
    )}
  </div>
));

CommandeActionButtons.displayName = 'CommandeActionButtons';

interface EvenementActionButtonsProps {
  evenementId: number;
  canEdit: boolean;
}

export const EvenementActionButtons = React.memo<EvenementActionButtonsProps>(({ evenementId, canEdit }) => (
  <div className="flex gap-2 justify-center">
    <Button 
      asChild 
      variant="outline" 
      size="sm"
      className="group hover:scale-105 transition-all duration-200 hover:shadow-md border-2 hover:border-thai-green/50"
    >
      <Link href={`/suivi-evenement/${evenementId}`}>
        <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">Voir</span>
      </Link>
    </Button>
    {canEdit && (
      <Button
        asChild
        variant="default"
        size="sm"
        className="group bg-gradient-to-r from-thai-green to-thai-green/90 hover:from-thai-green/90 hover:to-thai-green shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <Link href={`/modifier-evenement/${evenementId}`}>
          <Edit className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform duration-200" />
          <span className="font-medium">Modifier</span>
        </Link>
      </Button>
    )}
  </div>
));

EvenementActionButtons.displayName = 'EvenementActionButtons';