import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Minus, ShoppingCart, Sparkles } from 'lucide-react';

interface ExtraData {
  idextra: number;
  nom_extra: string;
  prix: number;
  description?: string | null;
  photo_url?: string | null;
  est_disponible: boolean;
}

interface ExtraDetailsModalInteractiveProps {
  extra: ExtraData;
  children: React.ReactNode;
  formatPrix: (prix: number) => string;
  onAddToCart?: (extra: ExtraData, quantity: number) => void;
  currentQuantity?: number;
  dateRetrait?: Date;
}

export const ExtraDetailsModalInteractive = React.memo<ExtraDetailsModalInteractiveProps>(({
  extra,
  children,
  formatPrix,
  onAddToCart,
  currentQuantity = 0,
  dateRetrait
}) => {
  const [open, setOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const prixUnitaire = extra.prix || 0;
  const sousTotal = prixUnitaire * quantity;

  const handleModalClick = () => {
    setOpen(false);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(extra, quantity);
      setOpen(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        className="max-w-lg mx-auto bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden animate-scaleIn transform transition-all duration-300 [&>button]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Header avec photo */}
          <div className="relative h-64 md:h-72 bg-gradient-to-br from-thai-gold/20 to-thai-orange/20">
            {extra.photo_url ? (
              <img
                src={extra.photo_url}
                alt={extra.nom_extra}
                className="w-full h-full object-cover transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-thai-gold/20 to-thai-orange/20">
                <div className="text-8xl text-thai-gold/50">
                  <Sparkles className="h-20 w-20" />
                </div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Badge extra */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-thai-gold text-white shadow-md font-semibold px-3 py-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Extra
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

          {/* Contenu */}
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-thai-green flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-thai-gold" />
                {extra.nom_extra}
              </DialogTitle>
            </DialogHeader>

            {/* Description */}
            {extra.description && (
              <div className="space-y-2 animate-fadeIn">
                <h4 className="text-sm font-semibold text-thai-orange flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-thai-cream/30 p-3 rounded-lg border border-thai-orange/20">
                  {extra.description}
                </p>
              </div>
            )}

            {/* Prix */}
            {prixUnitaire > 0 && (
              <div className="bg-gradient-to-r from-thai-gold/20 to-thai-orange/10 p-4 rounded-lg border border-thai-gold/30">
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">
                    PRIX UNITAIRE
                  </div>
                  <div className="text-2xl font-bold text-thai-gold">
                    {formatPrix(prixUnitaire)}
                  </div>
                </div>
              </div>
            )}

            {/* Sélecteur de quantité et actions */}
            {onAddToCart && (
              <div className="space-y-4">
                {/* Sélecteur de quantité */}
                <div className="bg-white rounded-lg p-4 border-2 border-thai-gold/20 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-thai-green">Quantité :</span>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="h-8 w-8 p-0 border-thai-gold/30 hover:border-thai-gold hover:bg-thai-gold hover:text-white transition-all duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-bold text-lg text-thai-gold">
                        {quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={incrementQuantity}
                        className="h-8 w-8 p-0 border-thai-gold/30 hover:border-thai-gold hover:bg-thai-gold hover:text-white transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Sous-total */}
                  {quantity > 1 && (
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-thai-gold/20">
                      <span className="font-medium text-thai-green">Sous-total :</span>
                      <span className="text-xl font-bold text-thai-gold">
                        {formatPrix(sousTotal)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Informations sur la date de retrait */}
                {dateRetrait && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-blue-800 font-medium">
                      📅 Sera ajouté pour le retrait du {dateRetrait.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}

                {/* Bouton d'ajout au panier */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-thai-gold hover:bg-thai-gold/90 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier ({formatPrix(sousTotal)})
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ExtraDetailsModalInteractive.displayName = 'ExtraDetailsModalInteractive';