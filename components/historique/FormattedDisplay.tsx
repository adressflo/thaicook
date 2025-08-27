import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, Calendar, Utensils } from 'lucide-react';
import type { Evenement, DetailCommande, Plat } from '@/types/app';
import { DishDetailsModalComplex } from './DishDetailsModalComplex';
import { CalendarIcon } from './CalendarIcon';

interface FormattedPriceProps {
  prix: number;
  formatPrix: (prix: number) => string;
  details?: Array<{ plat: { plat: string; prix: number } | null; quantite_plat_commande: number }>;
}

export const FormattedPrice = React.memo<FormattedPriceProps>(({ prix, formatPrix, details }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="flex justify-center">
      <div className="relative">
        <span 
          className="inline-flex items-center justify-center rounded-lg text-sm font-bold bg-thai-orange text-white px-4 py-2 min-w-[80px] shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 hover:-translate-y-0.5 cursor-help"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {formatPrix(prix)}
        </span>
        
        {/* Tooltip avec détail des sous-totaux */}
        {details && details.length > 0 && isHovered && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-thai-green text-white text-xs rounded-lg shadow-lg opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="space-y-1">
              {details.map((detail, index) => {
                const platName = detail.plat?.plat || 'Plat supprimé';
                const prixPlat = detail.plat?.prix || 0;
                const quantite = detail.quantite_plat_commande || 0;
                const sousTotal = prixPlat * quantite;
                
                return (
                  <div key={index} className="flex justify-between gap-4">
                    <span>{platName} (x{quantite})</span>
                    <span className="font-semibold">{formatPrix(sousTotal)}</span>
                  </div>
                );
              })}
              <div className="border-t border-thai-cream/30 pt-1 mt-1">
                <div className="flex justify-between gap-4 font-bold">
                  <span>Total:</span>
                  <span>{formatPrix(prix)}</span>
                </div>
              </div>
            </div>
            {/* Flèche du tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-thai-green rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
});

FormattedPrice.displayName = 'FormattedPrice';

interface FormattedDateProps {
  date: string | null;
}

export const FormattedDate = React.memo<FormattedDateProps>(({ date }) => {
  const { formattedDate, dateObj } = React.useMemo(() => {
    if (!date) {
      return { formattedDate: null, dateObj: null };
    }
    
    try {
      const dateObj = date.includes('T') ? parseISO(date) : new Date(date);
      const formattedDate = format(dateObj, 'eeee dd MMMM HH:mm', { locale: fr });
      return { formattedDate, dateObj };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { formattedDate: 'Date invalide', dateObj: null };
    }
  }, [date]);

  if (!formattedDate) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="text-gray-500 text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            Non définie
          </span>
        </div>
      </div>
    );
  }

  if (!dateObj) {
    return (
      <div className="flex justify-center">
        <div className="bg-thai-cream/30 p-3 rounded-lg border border-thai-orange/20">
          <div className="flex items-center gap-2 text-thai-green font-medium">
            <Calendar className="h-4 w-4 text-thai-orange" />
            <span className="text-sm">{formattedDate || 'Date invalide'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <CalendarIcon date={dateObj} className="flex-shrink-0" />
    </div>
  );
});

FormattedDate.displayName = 'FormattedDate';

interface FormattedEventProps {
  event: Evenement;
}

export const FormattedEvent = React.memo<FormattedEventProps>(({ event }) => (
  <div className="flex justify-center">
    <div className="group relative">
      <div className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 min-w-[120px] shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 hover:rotate-1">
        <span className="truncate max-w-[100px]">{event.nom_evenement}</span>
      </div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
    </div>
  </div>
));

FormattedEvent.displayName = 'FormattedEvent';

interface PersonCountProps {
  count: number | null;
}

export const PersonCount = React.memo<PersonCountProps>(({ count }) => (
  <div className="flex justify-center">
    <div className="group relative">
      <div className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-3 py-2 min-w-[70px] shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
        <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-bold">{count || 'N/A'}</span>
      </div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
    </div>
  </div>
));

PersonCount.displayName = 'PersonCount';

interface DishListProps {
  details: Array<DetailCommande & { plat: Plat | null }>;
  formatPrix: (prix: number) => string;
}

export const DishList = React.memo<DishListProps>(({ details, formatPrix }) => {
  if (!details?.length) {
    return (
      <div className="flex justify-center">
        <span className="text-gray-400 text-sm italic bg-gray-50/70 px-4 py-2 rounded-lg border border-gray-200">
          Aucun plat
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center max-w-sm sm:max-w-md lg:max-w-lg mx-auto p-2">
      {details.map((detail, index) => {
        const platName = detail.plat?.plat || 'Plat supprimé';
        const quantite = detail.quantite_plat_commande || 0;
        const displayName = quantite > 1 ? `${platName} (x${quantite})` : platName;
        const isDeleted = !detail.plat?.plat;

        return (
          <DishDetailsModalComplex
            key={`${detail.plat?.idplats || 'unknown'}-${index}`}
            detail={detail}
            formatPrix={formatPrix}
          >
            <div
              className="group relative animate-fadeIn hover:z-10 p-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`
                  relative inline-flex items-center gap-1.5 sm:gap-2 rounded-md text-sm font-medium
                  px-3 py-2 transition-all duration-300 cursor-pointer border
                  transform hover:scale-105 hover:shadow-xl hover:-translate-y-1
                  w-[140px] sm:w-[160px] justify-center
                  ${isDeleted 
                    ? 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 hover:border-gray-400' 
                    : 'bg-thai-cream text-thai-green border-thai-green/30 hover:bg-thai-gold/90 hover:border-thai-gold shadow-lg hover:shadow-xl'
                  }
                `}
              >
                <Utensils className={`h-4 w-4 flex-shrink-0 ${isDeleted ? 'text-gray-400' : 'text-thai-green'}`} />
                <span className="font-semibold truncate flex-1">{platName}</span>
                {quantite > 1 && (
                  <span className={`px-1.5 sm:px-2 py-0.5 text-xs rounded-full font-bold whitespace-nowrap ${
                    isDeleted 
                      ? 'bg-gray-300 text-gray-600' 
                      : 'bg-thai-green text-white'
                  }`}>
                    x{quantite}
                  </span>
                )}
              </div>
              
              {/* Subtle hover glow effect */}
              {!isDeleted && (
                <div className="absolute inset-0 bg-gradient-to-r from-thai-gold/40 to-thai-gold/60 rounded-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
              )}
            </div>
          </DishDetailsModalComplex>
        );
      })}
    </div>
  );
});

DishList.displayName = 'DishList';