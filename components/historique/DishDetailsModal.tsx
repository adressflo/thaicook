import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import type { DetailCommande, Plat } from '@/types/app';

interface DishDetailsModalProps {
  detail: DetailCommande & { plat: Plat | null };
  children: React.ReactNode;
  formatPrix: (prix: number) => string;
}

export const DishDetailsModal = React.memo<DishDetailsModalProps>(({ detail, children, formatPrix }) => {
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

DishDetailsModal.displayName = 'DishDetailsModal';