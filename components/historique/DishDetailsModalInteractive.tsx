import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Minus, ShoppingCart } from 'lucide-react';
import type { PlatUI as Plat } from '@/types/app';
import { SpiceDistributionSelector, getDistributionText } from '@/components/commander/SpiceDistributionSelector';

interface DishDetailsModalInteractiveProps {
  plat: Plat;
  children: React.ReactNode;
  formatPrix: (prix: number) => string;
  onAddToCart?: (plat: Plat, quantity: number, spicePreference?: string, spiceDistribution?: number[]) => void;
  currentQuantity?: number;
  dateRetrait?: Date;
}

export const DishDetailsModalInteractive = React.memo<DishDetailsModalInteractiveProps>(({ 
  plat, 
  children, 
  formatPrix,
  onAddToCart,
  currentQuantity = 0,
  dateRetrait
}) => {
  const [open, setOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  // Par défaut, toutes les portions sont "Non épicé"
  const [spiceDistribution, setSpiceDistribution] = React.useState<number[]>([1, 0, 0, 0]);
  const prixUnitaire = parseFloat(plat.prix || '0');
  const sousTotal = prixUnitaire * quantity;

  // Niveau d'épice maximum du plat (0 = pas épicé, 1-3 = niveaux d'épice)
  const maxSpiceLevel = plat.niveau_epice || 0;

  const handleModalClick = () => {
    setOpen(false);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      // Ne passer la distribution épicée que si le plat a l'option épicée activée
      const spicePreference = maxSpiceLevel > 0 ? getDistributionText(spiceDistribution) : undefined;
      const distribution = maxSpiceLevel > 0 ? spiceDistribution : undefined;
      onAddToCart(plat, quantity, spicePreference, distribution);
      setOpen(false);
      // Reset pour la prochaine ouverture
      setQuantity(1);
      setSpiceDistribution([1, 0, 0, 0]);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => {
      const newQty = prev + 1;
      // Par défaut, toutes les portions sont "Non épicé"
      setSpiceDistribution([newQty, 0, 0, 0]);
      return newQty;
    });
  };

  const decrementQuantity = () => {
    setQuantity(prev => {
      const newQty = Math.max(1, prev - 1);
      // Par défaut, toutes les portions sont "Non épicé"
      setSpiceDistribution([newQty, 0, 0, 0]);
      return newQty;
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        className="max-w-lg mx-auto bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden animate-scaleIn transform transition-all duration-300 [&>button]:hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-1 overflow-y-auto">
          {/* Header avec photo */}
          <div className="relative h-48 md:h-56 bg-gradient-to-br from-thai-orange/10 to-thai-gold/10 flex-shrink-0">
            {plat.photo_du_plat ? (
              <img
                src={plat.photo_du_plat}
                alt={plat.plat}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-thai-cream to-thai-orange/20">
                <div className="text-8xl text-thai-orange/50">🍽️</div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Badge disponible */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-thai-green text-white shadow-md font-semibold px-3 py-1">
                Disponible
              </Badge>
            </div>

            {/* Badge quantité actuelle dans le panier */}
            {currentQuantity > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-thai-orange text-white shadow-md font-semibold px-3 py-1">
                  Dans le panier: {currentQuantity}
                </Badge>
              </div>
            )}
          </div>

          {/* Contenu scrollable */}
          <div className="p-4 space-y-3">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-thai-green">
                {plat.plat}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Ajouter {plat.plat} au panier - Prix: {formatPrix(prixUnitaire)}
              </DialogDescription>
            </DialogHeader>

            {/* Description */}
            {plat.description && (
              <div className="space-y-1.5 animate-fadeIn">
                <h4 className="text-xs font-semibold text-thai-orange flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Description
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed bg-thai-cream/30 p-2.5 rounded-lg border border-thai-orange/20">
                  {plat.description}
                </p>
              </div>
            )}

            {/* Prix */}
            {prixUnitaire > 0 && (
              <div className="bg-gradient-to-r from-thai-cream/40 to-thai-orange/10 p-3 rounded-lg border border-thai-orange/20">
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium mb-0.5">
                    PRIX UNITAIRE
                  </div>
                  <div className="text-xl font-bold text-thai-orange">
                    {formatPrix(prixUnitaire)}
                  </div>
                </div>
              </div>
            )}

            {/* Sélecteur de quantité et actions */}
            {onAddToCart && (
              <div className="space-y-3">
                {/* Sélecteur de quantité */}
                <div className="bg-white rounded-lg p-3 border-2 border-thai-orange/20 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-thai-green text-sm">Quantité :</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="h-7 w-7 p-0 border-thai-orange/30 hover:border-thai-orange hover:bg-thai-orange hover:text-white transition-all duration-200"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-10 text-center font-bold text-base text-thai-orange">
                        {quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={incrementQuantity}
                        className="h-7 w-7 p-0 border-thai-orange/30 hover:border-thai-orange hover:bg-thai-orange hover:text-white transition-all duration-200"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Sous-total */}
                  {quantity > 1 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-thai-orange/20">
                      <span className="font-medium text-thai-green text-sm">Sous-total :</span>
                      <span className="text-lg font-bold text-thai-orange">
                        {formatPrix(sousTotal)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sélecteur de répartition épicée (uniquement si le plat est épicé) */}
                {maxSpiceLevel > 0 && (
                  <div className="bg-white rounded-lg p-3 border-2 border-thai-orange/20 shadow-sm animate-fadeIn">
                    <SpiceDistributionSelector
                      totalQuantity={quantity}
                      distribution={spiceDistribution}
                      onDistributionChange={setSpiceDistribution}
                    />
                  </div>
                )}

                {/* Informations sur la date de retrait */}
                {dateRetrait && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                    <p className="text-xs text-blue-800 font-medium">
                      📅 Sera ajouté pour le retrait du {dateRetrait.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'ajout au panier - sticky en bas */}
        {onAddToCart && (
          <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-thai-orange hover:bg-thai-orange/90 text-white text-base py-5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Ajouter au panier ({formatPrix(sousTotal)})
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

DishDetailsModalInteractive.displayName = 'DishDetailsModalInteractive';