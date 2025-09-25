import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, ShoppingCart, Hash, Euro, Calculator } from 'lucide-react';
import type { DetailCommande, Plat, Extra } from '@/types/app';

interface DishDetailsModalComplexProps {
  detail: DetailCommande & { plat: Plat | null; extra: Extra | null };
  children: React.ReactNode;
  formatPrix: (prix: number) => string;
}

export const DishDetailsModalComplex = React.memo<DishDetailsModalComplexProps>(({ detail, children, formatPrix }) => {
  const [open, setOpen] = React.useState(false);

  // Détection si c'est un extra
  const isExtra = detail.type === 'extra' || (!detail.plat && (detail.plat_r === 0 || detail.extra || detail.nom_plat));

  // Nom de l'item
  const platName = isExtra
    ? (detail.nom_plat || detail.extra?.nom_extra || 'Extra')
    : (detail.plat?.plat || 'Plat supprimé');

  const quantite = detail.quantite_plat_commande || 0;

  // Prix unitaire selon le type
  const prixUnitaire = isExtra
    ? (detail.prix_unitaire || detail.extra?.prix || 0)
    : (detail.plat?.prix || 0);

  const sousTotal = prixUnitaire * quantite;

  // Un item est considéré comme supprimé s'il n'y a ni plat ni extra
  const isDeleted = !isExtra && !detail.plat?.plat;

  const handleModalClick = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="max-w-lg mx-auto bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden animate-scaleIn transform transition-all duration-500 cursor-pointer [&>button]:hidden hover:shadow-3xl group"
        onClick={handleModalClick}
      >
        <div className="relative">
          {/* Header avec photo */}
          <div className="relative h-64 md:h-72 bg-gradient-to-br from-thai-orange/10 to-thai-gold/10">
            {(detail.plat?.photo_du_plat || detail.extra?.photo_url || isExtra) ? (
              <img
                src={
                  isExtra
                    ? (detail.extra?.photo_url || 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png')
                    : (detail.plat?.photo_du_plat || '')
                }
                alt={platName}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 filter group-hover:brightness-110"
                title="Cliquer pour fermer"
                onError={(e) => {
                  // Fallback pour les extras si l'image ne charge pas
                  if (isExtra) {
                    e.currentTarget.src = 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png';
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-thai-cream to-thai-orange/20">
                <div className="text-8xl text-thai-orange/50">
                  {isDeleted ? '❌' : '🍽️'}
                </div>
              </div>
            )}
            
            {/* Overlay gradient plus subtil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Effet brillance Thai pour les extras */}
            {isExtra && (
              <div className="absolute inset-0 bg-gradient-to-tr from-thai-gold/30 via-transparent to-thai-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
            

          </div>

          {/* Contenu */}
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-thai-green">
                {platName}
              </DialogTitle>
            </DialogHeader>

            {/* Description */}
            {((detail.plat?.description || detail.extra?.description) && !isDeleted) && (
              <div className="space-y-2 animate-fadeIn">
                <h4 className="text-sm font-semibold text-thai-orange flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-thai-cream/30 p-3 rounded-lg border border-thai-orange/20 hover:bg-thai-cream/50 transition-colors duration-200">
                  {detail.plat?.description || detail.extra?.description}
                </p>
              </div>
            )}

            {/* Détails de commande */}
            <div className="bg-gradient-to-r from-thai-cream/40 to-thai-orange/10 p-4 rounded-lg space-y-3 animate-fadeIn border border-thai-orange/20">
              <h4 className="text-sm font-semibold text-thai-green mb-3 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Détails de la commande
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Quantité */}
                <div className="text-center group">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-thai-orange/20 hover:shadow-lg hover:border-thai-orange/60 transition-all duration-300 hover:scale-105 relative overflow-hidden group/card">
                    <div className="text-2xl font-bold text-thai-orange mb-1 group-hover:scale-110 transition-transform duration-300">{quantite}</div>
                    <div className="text-xs text-gray-600 font-medium flex items-center justify-center gap-1">
                      <Hash className="h-3 w-3" />
                      Quantité
                    </div>
                  </div>
                </div>

                {/* Prix unitaire */}
                <div className="text-center group">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-thai-orange/20 hover:shadow-lg hover:border-thai-orange/60 transition-all duration-300 hover:scale-105 relative overflow-hidden group/card">
                    <div className="text-lg font-bold text-thai-green mb-1 group-hover:scale-110 transition-transform duration-300">
                      {formatPrix(prixUnitaire)}
                    </div>
                    <div className="text-xs text-gray-600 font-medium flex items-center justify-center gap-1">
                      <Euro className="h-3 w-3" />
                      Prix unitaire
                    </div>
                  </div>
                </div>
              </div>

              {/* Sous-total */}
              <div className="bg-white rounded-lg p-4 border-2 border-thai-orange shadow-md hover:shadow-xl hover:border-thai-orange transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium mb-1 flex items-center justify-center gap-1">
                    <Calculator className="h-3 w-3" />
                    <span>SOUS-TOTAL</span>
                  </div>
                  <div className="text-2xl font-bold text-thai-orange group-hover:scale-110 transition-transform duration-200">
                    {formatPrix(sousTotal)}
                  </div>
                  {quantite > 1 && (
                    <div className="text-xs text-gray-500 mt-1 bg-thai-cream/50 rounded-full px-2 py-1">
                      {quantite} × {formatPrix(prixUnitaire)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message pour plats/extras supprimés */}
            {isDeleted && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ Cet {isExtra ? 'extra' : 'article'} n'est plus disponible
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

DishDetailsModalComplex.displayName = 'DishDetailsModalComplex';