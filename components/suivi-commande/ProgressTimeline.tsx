'use client';

import React from 'react';
import { CheckCircle, Clock, Package, Truck, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending' | 'cancelled';
  date?: Date | string | null;
}

interface ProgressTimelineProps {
  currentStatus: string | null;
  dateCommande?: Date | string | null;
  dateRetrait?: Date | string | null;
}

export function ProgressTimeline({ currentStatus, dateCommande, dateRetrait }: ProgressTimelineProps) {
  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        id: 'commande',
        title: 'Commande passée',
        description: 'Votre commande a été enregistrée',
        icon: <ShoppingCart className="h-4 w-4" />,
        status: 'completed',
        date: dateCommande
      },
      {
        id: 'confirmation',
        title: 'Confirmation',
        description: 'Commande confirmée par le restaurant',
        icon: <CheckCircle className="h-4 w-4" />,
        status: 'pending',
        date: null
      },
      {
        id: 'preparation',
        title: 'En préparation',
        description: 'Votre commande est en cours de préparation',
        icon: <Package className="h-4 w-4" />,
        status: 'pending',
        date: null
      },
      {
        id: 'prete',
        title: 'Prête à récupérer',
        description: 'Votre commande vous attend',
        icon: <Truck className="h-4 w-4" />,
        status: 'pending',
        date: null
      },
      {
        id: 'recuperee',
        title: 'Récupérée',
        description: 'Commande récupérée avec succès',
        icon: <MapPin className="h-4 w-4" />,
        status: 'pending',
        date: dateRetrait
      }
    ];

    // Mise à jour du statut basé sur la commande
    const statusMap: Record<string, string[]> = {
      'En attente de confirmation': ['commande'],
      'Confirmée': ['commande', 'confirmation'],
      'En préparation': ['commande', 'confirmation', 'preparation'],
      'Prête à récupérer': ['commande', 'confirmation', 'preparation', 'prete'],
      'Récupérée': ['commande', 'confirmation', 'preparation', 'prete', 'recuperee'],
      'Annulée': []
    };

    const completedSteps = statusMap[currentStatus || ''] || ['commande'];
    const iscancelled = currentStatus === 'Annulée';

    return steps.map((step, index) => {
      if (iscancelled) {
        if (step.id === 'commande') {
          return { ...step, status: 'completed' };
        } else {
          return { ...step, status: 'cancelled' };
        }
      }

      if (completedSteps.includes(step.id)) {
        return { ...step, status: 'completed' };
      } else if (index === completedSteps.length) {
        return { ...step, status: 'current' };
      } else {
        return { ...step, status: 'pending' };
      }
    });
  };

  const steps = getTimelineSteps();
  const isOlCancelled = currentStatus === 'Annulée';

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          container: 'bg-thai-green/10 border-thai-green/30',
          icon: 'bg-thai-green text-white',
          line: 'bg-thai-green',
          text: 'text-thai-green'
        };
      case 'current':
        return {
          container: 'bg-thai-orange/10 border-thai-orange/30 ring-2 ring-thai-orange/20',
          icon: 'bg-thai-orange text-white animate-pulse',
          line: 'bg-gray-300',
          text: 'text-thai-orange font-semibold'
        };
      case 'cancelled':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'bg-red-500 text-white',
          line: 'bg-red-300',
          text: 'text-red-600'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'bg-gray-300 text-gray-600',
          line: 'bg-gray-300',
          text: 'text-gray-600'
        };
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="relative">
      {isOlCancelled && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <X className="h-5 w-5 text-red-500" />
          <span className="text-red-700 font-medium">Commande annulée</span>
        </div>
      )}

      <div className="space-y-4">
        {steps.map((step, index) => {
          const styles = getStepStyles(step.status);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              <div className={cn(
                "flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-md",
                styles.container
              )}>
                {/* Icône */}
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                  styles.icon
                )}>
                  {step.status === 'cancelled' && step.id !== 'commande' ? (
                    <X className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={cn("font-medium", styles.text)}>
                      {step.title}
                    </h4>
                    {step.date && (
                      <span className="text-xs text-gray-500 hidden sm:block">
                        {formatDate(step.date)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                  {step.date && (
                    <span className="text-xs text-gray-500 block sm:hidden mt-1">
                      {formatDate(step.date)}
                    </span>
                  )}
                </div>
              </div>

              {/* Ligne de connexion */}
              {!isLast && (
                <div className="flex justify-start ml-5">
                  <div className={cn(
                    "w-0.5 h-4 transition-all duration-300",
                    styles.line
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

// Import ShoppingCart from lucide-react
import { ShoppingCart } from 'lucide-react';