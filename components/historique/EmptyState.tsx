import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageSearch, Calendar, History } from 'lucide-react';

interface EmptyStateProps {
  type: 'commandes-en-cours' | 'commandes-historique' | 'evenements-en-cours' | 'evenements-historique';
}

export const EmptyState = React.memo<EmptyStateProps>(({ type }) => {
  const config = React.useMemo(() => {
    switch (type) {
      case 'commandes-en-cours':
        return {
          icon: <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />,
          title: 'Aucune commande en cours',
          description: 'Vous n\'avez pas de commande en cours de traitement.',
          action: {
            href: '/commander',
            label: 'Commencer à commander',
            className: 'bg-thai-orange'
          }
        };
      case 'commandes-historique':
        return {
          icon: <History className="mx-auto h-8 w-8 text-gray-400" />,
          title: null,
          description: 'Aucun historique de commande pour le moment.',
          action: null
        };
      case 'evenements-en-cours':
        return {
          icon: <Calendar className="mx-auto h-12 w-12 text-gray-400" />,
          title: 'Aucun événement en cours',
          description: 'Vous n\'avez pas d\'événement en cours de traitement.',
          action: {
            href: '/evenements',
            label: 'Organiser un événement',
            className: 'bg-thai-green'
          }
        };
      case 'evenements-historique':
        return {
          icon: <History className="mx-auto h-8 w-8 text-gray-400" />,
          title: null,
          description: 'Aucun historique d\'événement pour le moment.',
          action: null
        };
    }
  }, [type]);

  if (config.title) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
        {config.icon}
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {config.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {config.description}
        </p>
        {config.action && (
          <div className="mt-6">
            <Button asChild className={config.action.className}>
              <Link href={config.action.href as any}>{config.action.label}</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-gray-500">
      {config.icon}
      <p className="mt-2 text-sm">
        {config.description}
      </p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';