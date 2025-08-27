import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, ShoppingCart, Hash, Euro, Calculator } from 'lucide-react';
import type { DetailCommande, Plat } from '@/types/app';

interface DishDetailsModalComplexProps {
  detail: DetailCommande & { plat: Plat | null };
  children: React.ReactNode;
  formatPrix: (prix: number) => string;
}

export const DishDetailsModalComplex = React.memo<DishDetailsModalComplexProps>(({ detail, children, formatPrix }) => {
  const [open, setOpen] = React.useState(false);
  const platName = detail.plat?.plat || 'Plat supprimé';
  const quantite = detail.quantite_plat_commande || 0;
  const prixUnitaire = detail.plat?.prix || 0;
  const sousTotal = prixUnitaire * quantite;
  const isDeleted = !detail.plat?.plat;

  const handleModalClick = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="max-w-lg mx-auto bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden animate-scaleIn transform transition-all duration-300 cursor-pointer [&>button]:hidden"
        onClick={handleModalClick}
      >
        <div className="relative">
          {/* Header avec photo */}
          <div className="relative h-64 md:h-72 bg-gradient-to-br from-thai-orange/10 to-thai-gold/10">
            {detail.plat?.photo_du_plat && !isDeleted ? (
              <img
                src={detail.plat.photo_du_plat}
                alt={platName}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                title="Cliquer pour fermer"
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
            
            {/* Badge statut */}
            <div className="absolute top-3 left-3">
              <Badge 
                variant={isDeleted ? "destructive" : "default"}
                className={`${
                  isDeleted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-thai-green text-white shadow-md'
                } font-semibold px-3 py-1`}
              >
                {isDeleted ? 'Supprimé' : 'Disponible'}
              </Badge>
            </div>

          </div>

          {/* Contenu */}
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className={`text-xl font-bold ${
                isDeleted ? 'text-gray-600' : 'text-thai-green'
              }`}>
                {platName}
              </DialogTitle>
            </DialogHeader>

            {/* Description */}
            {detail.plat?.description && !isDeleted && (
              <div className="space-y-2 animate-fadeIn">
                <h4 className="text-sm font-semibold text-thai-orange flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-thai-cream/30 p-3 rounded-lg border border-thai-orange/20 hover:bg-thai-cream/50 transition-colors duration-200">
                  {detail.plat.description}
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
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-thai-orange/20 hover:shadow-md hover:border-thai-orange/50 transition-all duration-200 hover:scale-105">
                    <div className="text-2xl font-bold text-thai-orange mb-1 group-hover:scale-110 transition-transform duration-200">{quantite}</div>
                    <div className="text-xs text-gray-600 font-medium flex items-center justify-center gap-1">
                      <Hash className="h-3 w-3" />
                      Quantité
                    </div>
                  </div>
                </div>

                {/* Prix unitaire */}
                <div className="text-center group">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-thai-orange/20 hover:shadow-md hover:border-thai-orange/50 transition-all duration-200 hover:scale-105">
                    <div className="text-lg font-bold text-thai-green mb-1 group-hover:scale-110 transition-transform duration-200">
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
              <div className="bg-white rounded-lg p-4 border-2 border-thai-orange shadow-md hover:shadow-lg hover:border-thai-orange/80 transition-all duration-200 hover:scale-105 group">
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

            {/* Message pour plats supprimés */}
            {isDeleted && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ Ce plat n'est plus disponible au menu
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