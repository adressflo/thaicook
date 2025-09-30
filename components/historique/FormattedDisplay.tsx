import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, Calendar, Utensils, Sparkles, Receipt, Star } from 'lucide-react';
import type { Evenement, DetailCommande, Plat, Extra, CommandeUI } from '@/types/app';
import { DishDetailsModalComplex } from './DishDetailsModalComplex';
import { CalendarIcon } from './CalendarIcon';

interface FormattedPriceProps {
  prix: number;
  formatPrix: (prix: number) => string;
  details?: any[]; // Type simplifié pour éviter conflits TypeScript complexes
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
        
        {/* Tooltip moderne avec glassmorphism */}
        {details && details.length > 0 && isHovered && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 min-w-[240px] max-w-[260px] z-50 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="backdrop-blur-lg bg-white/95 dark:bg-slate-800/95 border border-white/20 rounded-2xl shadow-2xl shadow-thai-orange/10 p-3 relative overflow-hidden">

              {/* Fond dégradé subtil */}
              <div className="absolute inset-0 bg-gradient-to-br from-thai-cream/30 via-transparent to-thai-orange/10 rounded-2xl"></div>

              {/* Contenu */}
              <div className="relative z-10">
                {/* En-tête */}
                

                {/* Liste des plats */}
                <div className="space-y-1.5">
                  {details.map((detail, index) => {
                    const isExtra = detail.type === 'extra';
                    const platName = isExtra
                      ? (detail.nom_plat || 'Extra')
                      : (detail.plat?.plat || 'Plat supprimé');
                    const prixPlat = isExtra
                      ? (detail.prix_unitaire || 0)
                      : (detail.plat?.prix || 0);
                    const quantite = detail.quantite_plat_commande || 0;
                    const sousTotal = prixPlat * quantite;

                    return (
                      <div key={index} className="bg-gradient-to-r from-thai-cream/10 to-thai-orange/5 rounded-lg p-2 border border-thai-orange/15 hover:border-thai-orange/30 transition-colors duration-150">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            {/* Miniature photo du plat ou extra */}
                            <img
                              src={
                                isExtra
                                  ? 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png'
                                  : (detail.plat?.photo_du_plat || '')
                              }
                              alt={platName}
                              className="w-5 h-5 flex-shrink-0 rounded-full object-cover border border-thai-orange/60 shadow-sm"
                              onError={(e) => {
                                if (isExtra) {
                                  e.currentTarget.src = 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png';
                                } else {
                                  e.currentTarget.style.display = 'none';
                                }
                              }}
                            />
                            <span className="text-sm text-gray-800 font-bold truncate">{platName}</span>
                            <span className="text-xs bg-thai-orange/20 text-thai-orange px-1 py-0.5 rounded-full font-semibold shrink-0">×{quantite}</span>
                          </div>
                          <span className="text-xs font-medium text-thai-orange">{formatPrix(sousTotal)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Séparateur élégant */}
                <div className="my-2 h-px bg-gradient-to-r from-transparent via-thai-orange/30 to-transparent"></div>

                {/* Total avec style premium */}
                {/* Total avec style premium */}
                <div className="bg-gradient-to-r from-thai-green/10 to-thai-orange/10 rounded-xl p-3 border border-thai-orange/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-thai-green">
                      Total commande
                    </span>
                    <span className="text-lg font-black text-thai-orange">{formatPrix(prix)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flèche moderne avec ombre */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="w-3 h-3 bg-white/95 dark:bg-slate-800/95 border-r border-b border-white/20 rotate-45 shadow-lg"></div>
            </div>
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
  details: any[]; // Type simplifié pour éviter conflits TypeScript complexes
  formatPrix: (prix: number) => string;
  extras?: any[]; // Liste des extras pour résolution des noms
}

export const DishList = React.memo<DishListProps>(({ details, formatPrix, extras }) => {
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
        const isExtra = detail.type === 'extra';
        const platName = isExtra
          ? (detail.nom_plat || 'Extra')
          : (detail.plat?.plat || 'Plat supprimé');
        const quantite = detail.quantite_plat_commande || 0;
        const displayName = quantite > 1 ? `${platName} (x${quantite})` : platName;
        const isDeleted = !isExtra && !detail.plat?.plat;

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
                  relative inline-flex items-center gap-1.5 sm:gap-2 rounded-xl text-base font-semibold
                  px-3 py-2 transition-all duration-300 cursor-pointer border-2
                  transform hover:scale-105 hover:shadow-xl hover:-translate-y-1
                  w-[260px] sm:w-[280px] justify-center
                  ${isDeleted
                    ? 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                    : 'bg-thai-cream text-thai-green border-thai-green/30 hover:bg-white hover:border-thai-green hover:text-thai-orange shadow-lg hover:shadow-2xl hover:shadow-thai-orange/25'
                  }
                `}
              >
                {isExtra ? (
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-thai-gold to-thai-orange flex items-center justify-center border-2 border-thai-orange/60 shadow-md">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                ) : detail.plat?.photo_du_plat && !isDeleted ? (
                  <img
                    src={detail.plat.photo_du_plat}
                    alt={platName}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover border-2 border-thai-orange/60 shadow-md"
                  />
                ) : (
                  <Utensils className={`h-5 w-5 flex-shrink-0 ${isDeleted ? 'text-gray-400' : 'text-thai-green'}`} />
                )}
                <span className="font-bold truncate flex-1">{platName}</span>
                {quantite > 1 && (
                  <span className={`px-1.5 sm:px-2 py-0.5 text-xs rounded-full font-bold whitespace-nowrap ${
                    isDeleted
                      ? 'bg-gray-300 text-gray-600'
                      : 'bg-thai-green text-white'
                  }`}>
                    x{quantite}
                  </span>
                )}
                {isExtra ? (
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-thai-gold to-thai-orange flex items-center justify-center border-2 border-thai-orange/60 shadow-md">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                ) : detail.plat?.photo_du_plat && !isDeleted ? (
                  <img
                    src={detail.plat.photo_du_plat}
                    alt={platName}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover border-2 border-thai-orange/60 shadow-md"
                  />
                ) : null}
              </div>
              
              {/* Subtle hover glow effect */}
              {!isDeleted && (
                <div className="absolute inset-0 bg-gradient-to-br from-thai-green/15 via-transparent to-thai-red/15 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur-sm" />
              )}
            </div>
          </DishDetailsModalComplex>
        );
      })}
    </div>
  );
});

DishList.displayName = 'DishList';