'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ShoppingBasket,
  Clock,
  CheckCircle,
  Eye,
  Search,
  Calendar,
  Euro,
  User,
  AlertTriangle,
  Package,
  Download,
  RefreshCw,
  X,
  ChefHat,
  MessageSquare,
  MessageCircle,
  Plus,
  Trash2,
  ClipboardCheck,
  Package2,
  PackageCheck,
  ArrowLeft,
  MapPin,
  Phone,
  Check,
} from 'lucide-react';
import {
  useCommandesByClient,
  useCommandeById,
  useClient,
  useUpdateCommande,
  useUpdatePlatQuantite,
  useRemovePlatFromCommande,
  useAddPlatToCommande,
  usePlats,
} from '@/hooks/useSupabaseData';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { CommandeUI, CommandeUpdate } from '@/types/app';
import type { StatutCommandeAffichage } from '@/types/supabase';

// Composant pour les actions rapides selon le statut
const QuickActionButtons = ({
  commande,
  onStatusChange,
}: {
  commande: CommandeUI;
  onStatusChange: (id: number, status: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const currentStatus = commande.statut_commande;
  // Gérer la transition Récupérée → Terminée
  const displayStatus =
    currentStatus === 'Récupérée' ? 'Terminée' : (currentStatus || 'En attente de confirmation');

  const handleStatusChange = async (newStatus: string) => {
    // Ne rien faire si c'est le même statut
    if (newStatus === currentStatus) {
      return;
    }

    // Confirmation spéciale pour l'annulation
    if (newStatus === 'Annulée') {
      const clientName =
        commande.client?.nom && commande.client?.prenom
          ? `${commande.client.prenom} ${commande.client.nom}`
          : 'ce client';

      const isConfirmed = window.confirm(
        `⚠️ Êtes-vous sûr de vouloir annuler la commande #${commande.idcommande} de ${clientName} ?\n\n` +
          `Cette action ne peut pas être annulée et le client sera notifié automatiquement.`
      );

      if (!isConfirmed) {
        return; // L'utilisateur a annulé
      }
    }

    setIsLoading(true);
    try {
      // Convertir Terminée → Récupérée pour la base de données
      const dbStatus = newStatus === 'Terminée' ? 'Récupérée' : newStatus;
      await onStatusChange(commande.idcommande, dbStatus);
    } finally {
      setIsLoading(false);
    }
  };

  // Toutes les commandes restent modifiables

  // Menu déroulant avec tous les statuts disponibles
  return (
    <div className="min-h-[32px] flex items-center">
      <Select
        value={displayStatus}
        onValueChange={handleStatusChange}
        disabled={isLoading}
      >
        <SelectTrigger className="h-12 text-xl w-auto min-w-[200px] max-w-[250px] border-2 border-thai-orange/40 bg-gradient-to-r from-white to-thai-cream/20 hover:from-thai-orange/10 hover:to-thai-orange/20 hover:border-thai-orange focus:border-thai-orange shadow-lg hover:shadow-xl transition-all duration-300 font-bold rounded-xl backdrop-blur-sm hover:scale-105 group">
          <SelectValue />
          {isLoading && (
            <RefreshCw className="w-4 h-4 ml-2 animate-spin text-thai-orange" />
          )}
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-thai-orange/20 shadow-xl rounded-xl overflow-hidden">
          <SelectItem
            value="En attente de confirmation"
            className="bg-thai-orange/10 hover:bg-thai-orange/20 border-l-4 border-thai-orange transition-all duration-200 cursor-pointer my-1"
          >
            <div className="flex items-center gap-3 py-2">
              <Clock className="w-5 h-5 text-thai-orange animate-pulse transition-all duration-300 group-hover:scale-110" />
              <span className="font-semibold text-lg text-thai-orange">
                En Attente
              </span>
            </div>
          </SelectItem>
          <SelectItem
            value="Confirmée"
            className="bg-blue-50/90 hover:bg-blue-100/90 border-l-4 border-blue-500 transition-all duration-200 cursor-pointer my-1"
          >
            <div className="flex items-center gap-3 py-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="font-semibold text-lg text-blue-700">
                Confirmée
              </span>
            </div>
          </SelectItem>
          <SelectItem
            value="En préparation"
            className="bg-yellow-50/90 hover:bg-yellow-100/90 border-l-4 border-yellow-500 transition-all duration-200 cursor-pointer my-1"
          >
            <div className="flex items-center gap-3 py-2">
              <ChefHat className="w-5 h-5 text-yellow-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <span className="font-semibold text-lg text-yellow-700">
                En Préparation
              </span>
            </div>
          </SelectItem>
          <SelectItem
            value="Prête à récupérer"
            className="bg-thai-gold/10 hover:bg-thai-gold/20 border-l-4 border-thai-gold transition-all duration-200 cursor-pointer my-1"
          >
            <div className="flex items-center gap-3 py-2">
              <Package2 className="w-5 h-5 text-thai-gold animate-bounce transition-all duration-300 group-hover:scale-110" />
              <span className="font-semibold text-lg text-thai-gold">
                Prête
              </span>
            </div>
          </SelectItem>
          <SelectItem
            value="Terminée"
            className="bg-thai-green/10 hover:bg-thai-green/20 border-l-4 border-thai-green transition-all duration-200 cursor-pointer my-1"
          >
            <div className="flex items-center gap-3 py-2">
              <PackageCheck className="w-5 h-5 text-thai-green transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <span className="font-semibold text-lg text-thai-green">
                Terminée
              </span>
            </div>
          </SelectItem>
          <SelectItem
            value="Annulée"
            className="bg-red-50/80 hover:bg-red-100/90 border-l-4 border-red-500 transition-all duration-200 cursor-pointer my-1"
          >
            <div className="flex items-center gap-3 py-2">
              <X className="w-5 h-5 text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
              <span className="font-semibold text-lg text-red-600">
                Annulée
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

// Composant pour les actions de paiement et notes rapides
const QuickPaymentActions = ({
  commande,
  onStatusChange,
}: {
  commande: CommandeUI;
  onStatusChange: (
    id: number,
    status: string,
    updates?: CommandeUpdate
  ) => void;
}) => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const updateCommandeMutation = useUpdateCommande();

  const handlePaymentToggle = async () => {
    setIsPaymentLoading(true);
    try {
      const currentPaymentStatus = commande.statut_paiement;
      const newPaymentStatus =
        currentPaymentStatus === 'En attente sur place'
          ? 'Payé sur place'
          : 'En attente sur place';

      await updateCommandeMutation.mutateAsync({
        id: commande.idcommande,
        updates: {
          statut_paiement: newPaymentStatus as
            | 'En attente sur place'
            | 'Payé sur place'
            | 'Payé en ligne'
            | 'Non payé'
            | 'Payée',
        },
      });
    } catch (error) {
      console.error('Erreur mise à jour paiement:', error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const getPaymentStatusColor = () => {
    switch (commande.statut_paiement) {
      case 'Payé sur place':
      case 'Payé en ligne':
      case 'Payée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente sur place':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Non payé':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Afficher seulement si la commande n'est pas annulée
  if (commande.statut_commande === 'Annulée') {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Toggle paiement */}
      <Button
        size="sm"
        variant="outline"
        className={`text-xs px-2 py-1 ${getPaymentStatusColor()}`}
        onClick={handlePaymentToggle}
        disabled={isPaymentLoading}
      >
        {isPaymentLoading ? (
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
        ) : (
          <Euro className="w-3 h-3 mr-1" />
        )}
        {commande.statut_paiement === 'En attente sur place'
          ? 'Marquer Payé'
          : 'En attente'}
      </Button>
    </div>
  );
};

// Modal pour actions avancées
const QuickActionsModal = ({
  commande,
  onStatusChange,
}: {
  commande: CommandeUI;
  onStatusChange: (
    id: number,
    status: string,
    updates?: CommandeUpdate
  ) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(commande.notes_internes || '');
  const [isLoading, setIsLoading] = useState(false);
  const updateCommandeMutation = useUpdateCommande();
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    setIsLoading(true);
    try {
      await updateCommandeMutation.mutateAsync({
        id: commande.idcommande,
        updates: { notes_internes: notes },
      });
      toast({
        title: 'Notes mises à jour',
        description: 'Les notes internes ont été sauvegardées',
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les notes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateOrder = async () => {
    toast({
      title: 'Fonction à venir',
      description: 'La duplication de commande sera disponible prochainement',
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-xs px-2 py-1 border-thai-orange text-thai-green hover:bg-thai-orange hover:text-white"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Actions+
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white border border-thai-orange shadow-lg">
        <DialogHeader>
          <DialogTitle>Actions Commande #{commande.idcommande}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Notes internes */}
          <div>
            <Label htmlFor="notes">Notes internes</Label>
            <Textarea
              id="notes"
              placeholder="Ajoutez des notes pour l'équipe..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Actions rapides */}
          <div className="space-y-2">
            <Label>Actions rapides</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDuplicateOrder}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Dupliquer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.print();
                  setIsOpen(false);
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                Imprimer
              </Button>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Créée:</strong>{' '}
              {commande.date_de_prise_de_commande
                ? format(
                    new Date(commande.date_de_prise_de_commande),
                    'dd/MM/yyyy à HH:mm',
                    { locale: fr }
                  )
                : 'N/A'}
            </p>
            <p>
              <strong>Client ID:</strong> {commande.client_r}
            </p>
            {commande.demande_special_pour_la_commande && (
              <p>
                <strong>Demande spéciale:</strong>{' '}
                {commande.demande_special_pour_la_commande}
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveNotes}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Sauvegarder
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant pour chaque plat dans une commande avec contrôles de modification
const PlatCommandeCard = ({
  item,
  commandeId,
  toast,
}: {
  item: any;
  commandeId: number;
  toast: any;
}) => {
  const updateQuantiteMutation = useUpdatePlatQuantite();
  const removePlatMutation = useRemovePlatFromCommande();
  const [isModifying, setIsModifying] = useState(false);

  // Fonction formatPrix identique à celle du panier
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  const handleQuantiteChange = async (newQuantite: number) => {
    if (newQuantite <= 0) {
      handleRemovePlat();
      return;
    }

    setIsModifying(true);
    try {
      await updateQuantiteMutation.mutateAsync({
        detailId: item.iddetails,
        quantite: newQuantite,
      });
    } finally {
      setIsModifying(false);
    }
  };

  const handleRemovePlat = async () => {
    const isConfirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer "${
        item.type === 'extra'
          ? item.nom_plat
          : item.plat?.plat
      }" de cette commande ?`
    );

    if (!isConfirmed) return;

    setIsModifying(true);
    try {
      await removePlatMutation.mutateAsync(item.iddetails);
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform">
      {/* Image du plat ou extra */}
      {item.type === 'extra' ? (
        <img
          src="https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
          alt="Extra"
          className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      ) : item.plat?.photo_du_plat ? (
        <img
          src={item.plat.photo_du_plat}
          alt={
            item.type === 'extra'
              ? item.nom_plat || 'Extra'
              : item.plat?.plat || 'Plat'
          }
          className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      ) : (
        <div className="w-24 h-16 bg-thai-cream/30 border border-thai-orange/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-thai-cream/50 transition-colors duration-200">
          <span className="text-thai-orange text-lg">🍽️</span>
        </div>
      )}

      {/* Informations du plat - exactement comme dans le panier */}
      <div className="flex-1">
        <h4 className="font-medium text-thai-green text-lg mb-1 cursor-pointer hover:text-thai-orange transition-colors duration-200 hover:underline decoration-thai-orange/50">
          {item.type === 'extra'
            ? item.nom_plat
            : item.plat?.plat}
          {item.type === 'extra' && (
            <span className="ml-2 text-xs bg-thai-orange/20 text-thai-orange px-2 py-1 rounded-full">
              Extra
            </span>
          )}
        </h4>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="font-medium">Quantité:</span>
            <span className="bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full font-medium">
              {item.quantite_plat_commande || 0}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium">Prix unitaire:</span>
            <span className="text-thai-green font-semibold">
              {formatPrix(item.prix_unitaire || item.plat?.prix || 0)}
            </span>
          </span>
        </div>
      </div>

      {/* Prix total et contrôles - exactement comme dans le panier */}
      <div className="text-right">
        <div className="text-2xl font-bold text-thai-orange mb-4">
          {formatPrix(
            (item.prix_unitaire ?? item.plat?.prix ?? 0) *
              (item.quantite_plat_commande || 0)
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
            onClick={e => {
              e.stopPropagation();
              handleQuantiteChange((item.quantite_plat_commande || 1) - 1);
            }}
            disabled={isModifying || (item.quantite_plat_commande || 0) <= 0}
          >
            -
          </Button>
          <span className="w-8 text-center font-medium">
            {isModifying ? (
              <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              item.quantite_plat_commande || 0
            )}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
            onClick={e => {
              e.stopPropagation();
              handleQuantiteChange((item.quantite_plat_commande || 0) + 1);
            }}
            disabled={isModifying}
          >
            +
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={e => {
              e.stopPropagation();
              handleRemovePlat();
            }}
            disabled={isModifying}
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-red-300"
            aria-label="Supprimer l'article"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Modal pour ajouter un Extra à une commande
const AddComplementModal = ({
  commandeId,
  isOpen,
  onClose,
  toast,
}: {
  commandeId: number | null;
  isOpen: boolean;
  onClose: () => void;
  toast: any;
}) => {
  const [nomComplement, setNomComplement] = useState('');
  const [prixComplement, setPrixComplement] = useState('');
  const addPlatMutation = useAddPlatToCommande();
  const isLoading = addPlatMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !commandeId ||
      !nomComplement.trim() ||
      !prixComplement ||
      parseFloat(prixComplement) <= 0
    ) {
      toast({
        title: 'Erreur',
        description:
          'Veuillez saisir un nom et un prix valide pour le complément',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Utiliser le hook existant pour ajouter le complément comme un "plat" spécial
      await addPlatMutation.mutateAsync({
        commandeId: commandeId,
        platId: null, // Pas d'ID plat pour un Extra
        nomPlat: nomComplement.trim(),
        prixUnitaire: parseFloat(prixComplement),
        quantite: 1,
        type: 'extra',
      });

      toast({
        title: 'Succès',
        description: `Complément "${nomComplement}" ajouté à la commande`,
      });

      onClose();
      setNomComplement('');
      setPrixComplement('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du complément:", error);
      toast({
        title: 'Erreur',
        description: "Erreur lors de l'ajout du complément",
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setNomComplement('');
    setPrixComplement('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-thai-orange shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-thai-orange">
            Ajouter un Extra
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nom-extra" className="text-sm font-medium">
              Nom de l'extra *
            </Label>
            <Input
              id="nom-extra"
              value={nomComplement}
              onChange={e => setNomComplement(e.target.value)}
              placeholder="Ex: Sauce supplémentaire, Riz jasmin..."
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="prix-extra" className="text-sm font-medium">
              Prix (€) *
            </Label>
            <Input
              id="prix-extra"
              type="number"
              step="0.01"
              min="0.01"
              value={prixComplement}
              onChange={e => setPrixComplement(e.target.value)}
              placeholder="Ex: 3.00"
              className="mt-1"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white"
            >
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Modal pour ajouter des plats à une commande
const AddPlatModal = ({
  commandeId,
  isOpen,
  onClose,
  toast,
}: {
  commandeId: number;
  isOpen: boolean;
  onClose: () => void;
  toast: any;
}) => {
  const { data: plats, isLoading: platsLoading } = usePlats();
  const addPlatMutation = useAddPlatToCommande();
  const [selectedPlats, setSelectedPlats] = useState<{ [key: number]: number }>(
    {}
  );

  // Fonction formatPrix identique à celle du panier
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  const handleAddPlat = async (platId: number, quantite: number) => {
    if (quantite <= 0) return;

    try {
      await addPlatMutation.mutateAsync({
        commandeId,
        platId,
        quantite,
      });

      toast({
        title: '✅ Plat ajouté',
        description: `${quantite} ${
          plats?.find(p => p.idplats === platId)?.plat
        } ajouté(s) à la commande`,
      });

      // Réinitialiser la sélection pour ce plat
      setSelectedPlats(prev => ({ ...prev, [platId]: 0 }));
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible d'ajouter le plat: ${
          (error as Error).message || 'Erreur inconnue'
        }`,
        variant: 'destructive',
      });
    }
  };

  const updateQuantite = (platId: number, quantite: number) => {
    setSelectedPlats(prev => ({
      ...prev,
      [platId]: Math.max(0, quantite),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-2 border-thai-orange shadow-lg">
        <DialogHeader>
          <DialogTitle>
            Ajouter des plats à la commande #{commandeId}
          </DialogTitle>
        </DialogHeader>

        {platsLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-8 h-8 animate-spin text-thai-orange" />
            <span className="ml-2 text-gray-600">Chargement des plats...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {plats && plats.length > 0 ? (
              <div className="space-y-4">
                {plats.map(plat => (
                  <div
                    key={plat.idplats}
                    className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:bg-yellow-50 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform"
                  >
                    {/* Image du plat - exactement comme dans le panier */}
                    {plat.photo_du_plat ? (
                      <img
                        src={plat.photo_du_plat}
                        alt={plat.plat}
                        className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      />
                    ) : (
                      <div className="w-24 h-16 bg-thai-cream/30 border border-thai-orange/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-thai-cream/50 transition-colors duration-200">
                        <span className="text-thai-orange text-lg">🍽️</span>
                      </div>
                    )}

                    {/* Informations du plat - exactement comme dans le panier */}
                    <div className="flex-1">
                      <h4 className="font-medium text-thai-green text-lg mb-1 cursor-pointer hover:text-thai-orange transition-colors duration-200 hover:underline decoration-thai-orange/50">
                        {plat.plat}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Quantité:</span>
                          <span className="bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full font-medium">
                            {selectedPlats[plat.idplats] || 0}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Prix unitaire:</span>
                          <span className="text-thai-green font-semibold">
                            {formatPrix(plat.prix || 0)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Prix total et contrôles - exactement comme dans le panier */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-thai-orange mb-4">
                        {formatPrix(
                          (plat.prix || 0) * (selectedPlats[plat.idplats] || 0)
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
                          onClick={e => {
                            e.stopPropagation();
                            updateQuantite(
                              plat.idplats,
                              (selectedPlats[plat.idplats] || 0) - 1
                            );
                          }}
                          disabled={
                            !selectedPlats[plat.idplats] ||
                            selectedPlats[plat.idplats] <= 0
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {selectedPlats[plat.idplats] || 0}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
                          onClick={e => {
                            e.stopPropagation();
                            updateQuantite(
                              plat.idplats,
                              (selectedPlats[plat.idplats] || 0) + 1
                            );
                          }}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          className="ml-2 bg-thai-green hover:bg-thai-green/90 text-white px-4 py-2"
                          style={{ zIndex: 9999, position: 'relative' }}
                          onClick={e => {
                            e.stopPropagation();
                            handleAddPlat(
                              plat.idplats,
                              selectedPlats[plat.idplats] || 0
                            );
                          }}
                          disabled={
                            !selectedPlats[plat.idplats] ||
                            selectedPlats[plat.idplats] <= 0 ||
                            addPlatMutation.isPending
                          }
                        >
                          {addPlatMutation.isPending ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                          ) : null}
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun plat disponible</p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function ClientOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState<CommandeUI | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [addPlatModal, setAddPlatModal] = useState<{
    isOpen: boolean;
    commandeId: number | null;
  }>({
    isOpen: false,
    commandeId: null,
  });
  const [addComplementModal, setAddComplementModal] = useState<{
    isOpen: boolean;
    commandeId: number | null;
  }>({
    isOpen: false,
    commandeId: null,
  });

  // Récupérer les données du client et ses commandes
  const { data: client } = useClient(clientId);
  const { data: commandes, refetch } = useCommandesByClient(clientId);
  const updateCommandeMutation = useUpdateCommande();
  const { toast } = useToast();

  // Filtrage par recherche et tri par date
  const filteredAndSortedCommandes =
    commandes
      ?.filter(commande => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        const clientName = `${commande.client?.prenom || ''} ${
          commande.client?.nom || ''
        }`.toLowerCase();
        const dateFormatted = commande.date_et_heure_de_retrait_souhaitees
          ? format(
              new Date(commande.date_et_heure_de_retrait_souhaitees),
              'dd/MM/yyyy',
              { locale: fr }
            )
          : '';

        return (
          commande.idcommande.toString().includes(searchTerm) ||
          clientName.includes(searchLower) ||
          dateFormatted.includes(searchTerm)
        );
      })
      ?.sort((a, b) => {
        const dateA = a.date_et_heure_de_retrait_souhaitees
          ? new Date(a.date_et_heure_de_retrait_souhaitees)
          : new Date(0);
        const dateB = b.date_et_heure_de_retrait_souhaitees
          ? new Date(b.date_et_heure_de_retrait_souhaitees)
          : new Date(0);

        return dateA.getTime() - dateB.getTime();
      }) || [];

  // Statistiques pour les onglets
  const stats = {
    enAttente:
      commandes?.filter(c => c.statut_commande === 'En attente de confirmation')
        .length || 0,
    confirmees:
      commandes?.filter(c => c.statut_commande === 'Confirmée').length || 0,
    enCours:
      commandes?.filter(
        c =>
          c.statut_commande !== 'Annulée' && c.statut_commande !== 'Récupérée'
      ).length || 0,
    terminees:
      commandes?.filter(c => c.statut_commande === 'Récupérée').length || 0,
    passees:
      commandes?.filter(
        c =>
          c.date_et_heure_de_retrait_souhaitees &&
          isPast(new Date(c.date_et_heure_de_retrait_souhaitees)) &&
          c.statut_commande !== 'Annulée'
      ).length || 0,
    aujourd_hui:
      commandes?.filter(
        c =>
          c.date_et_heure_de_retrait_souhaitees &&
          isToday(new Date(c.date_et_heure_de_retrait_souhaitees)) &&
          c.statut_commande !== 'Annulée'
      ).length || 0,
    futur:
      commandes?.filter(
        c =>
          c.date_et_heure_de_retrait_souhaitees &&
          isFuture(new Date(c.date_et_heure_de_retrait_souhaitees)) &&
          c.statut_commande !== 'Annulée'
      ).length || 0,
    annulees:
      commandes?.filter(c => c.statut_commande === 'Annulée').length || 0,
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Terminée':
      case 'Récupérée':
        return 'bg-thai-green/20 text-thai-green border-thai-green';
      case 'Prête à récupérer':
        return 'bg-thai-gold/20 text-thai-gold border-thai-gold animate-pulse';
      case 'En préparation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'Confirmée':
        return 'bg-blue-100 text-blue-700 border-blue-500';
      case 'En attente de confirmation':
        return 'bg-thai-orange/20 text-thai-orange border-thai-orange animate-pulse';
      case 'Annulée':
        return 'bg-red-100 text-red-700 border-red-500 line-through';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBgColor = (statut: string) => {
    switch (statut) {
      case 'Terminée':
      case 'Récupérée':
        return 'bg-thai-green/10 border-l-thai-green';
      case 'Prête à récupérer':
        return 'bg-thai-gold/10 border-l-thai-gold';
      case 'En préparation':
        return 'bg-yellow-50 border-l-yellow-500';
      case 'Confirmée':
        return 'bg-blue-50 border-l-blue-500';
      case 'En attente de confirmation':
        return 'bg-thai-orange/10 border-l-thai-orange';
      case 'Annulée':
        return 'bg-red-50 border-l-red-500';
      default:
        return 'bg-white border-l-gray-300';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'Terminée':
      case 'Récupérée':
        return <CheckCircle className="w-4 h-4" />;
      case 'En préparation':
        return <Package className="w-4 h-4" />;
      case 'En attente de confirmation':
        return <Clock className="w-4 h-4" />;
      case 'Annulée':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <ShoppingBasket className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (commandeId: number, newStatus: string) => {
    try {
      await updateCommandeMutation.mutateAsync({
        id: commandeId,
        updates: {
          statut_commande: newStatus as
            | 'En attente de confirmation'
            | 'Confirmée'
            | 'En préparation'
            | 'Prête à récupérer'
            | 'Récupérée'
            | 'Annulée',
        },
      });

      toast({
        title: '✅ Succès',
        description: `Statut mis à jour vers "${newStatus}"`,
      });

      refetch();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  };

  const openDetails = (commande: CommandeUI) => {
    setSelectedCommande(commande);
    setIsDetailsOpen(true);
  };

  const handleAddPlat = (commandeId: number) => {
    setAddPlatModal({
      isOpen: true,
      commandeId: commandeId,
    });
  };

  const handleAddComplement = (commandeId: number) => {
    setAddComplementModal({
      isOpen: true,
      commandeId: commandeId,
    });
  };

  // Fonction utilitaire pour obtenir le nom complet du client
  const getClientFullName = () => {
    if (client?.prenom && client?.nom) {
      return `${client.prenom} ${client.nom}`;
    }
    if (client?.nom) return client.nom;
    if (client?.prenom) return client.prenom;
    return 'Client non défini';
  };

  // Si aucune commande n'existe pour ce client
  if (commandes && commandes.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5" />
                Commandes de {getClientFullName()}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Aucune commande trouvée
              </h3>
              <p className="text-gray-600">
                Ce client n'a pas encore passé de commande.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5" />
                Commandes de {getClientFullName()} ({filteredAndSortedCommandes.length})
              </CardTitle>

              {/* Bouton de recherche */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white transition-all duration-200"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>

                {/* Menu de recherche déroulant */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-thai-orange/30 rounded-lg shadow-xl z-50 p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-thai-green mb-2 block">
                          Rechercher par client ou date :
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-thai-orange w-4 h-4" />
                          <Input
                            placeholder="Nom client ou dd/mm/yyyy..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 border-2 border-thai-orange/30 focus:border-thai-orange"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSearchTerm('');
                          }}
                          className="text-thai-red border-thai-red hover:bg-thai-red hover:text-white"
                        >
                          Effacer
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setIsSearchOpen(false)}
                          className="bg-thai-green hover:bg-thai-green/90 text-white"
                        >
                          Fermer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Onglets par statut et date */}
          <Tabs defaultValue="en_cours" className="w-full">
            <TabsList className="w-full grid grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="En attente de confirmation">
                Attente ({stats.enAttente})
              </TabsTrigger>
              <TabsTrigger value="Confirmée">
                Confirmée ({stats.confirmees})
              </TabsTrigger>
              <TabsTrigger value="en_cours">
                En cours ({stats.enCours})
              </TabsTrigger>
              <TabsTrigger value="Terminée">
                Terminées ({stats.terminees})
              </TabsTrigger>
              <TabsTrigger value="past">Passées ({stats.passees})</TabsTrigger>
              <TabsTrigger value="today">
                Aujourd'hui ({stats.aujourd_hui})
              </TabsTrigger>
              <TabsTrigger value="future">Futur ({stats.futur})</TabsTrigger>
              <TabsTrigger value="Annulée">
                Annulées ({stats.annulees})
              </TabsTrigger>
            </TabsList>

            {/* Onglet En Attente */}
            <TabsContent
              value="En attente de confirmation"
              className="space-y-4 mt-6"
            >
              {filteredAndSortedCommandes
                ?.filter(
                  c => c.statut_commande === 'En attente de confirmation'
                )
                .sort((a, b) => {
                  const dateA = a.date_et_heure_de_retrait_souhaitees
                    ? new Date(a.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  const dateB = b.date_et_heure_de_retrait_souhaitees
                    ? new Date(b.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  return dateA.getTime() - dateB.getTime();
                })
                .map(commande => (
                  <CommandeCard
                    key={commande.idcommande}
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onViewDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusBgColor={getStatusBgColor}
                    toast={toast}
                    onAddPlat={handleAddPlat}
                    onAddComplement={handleAddComplement}
                    updateCommandeMutation={updateCommandeMutation}
                    clientFullName={getClientFullName()}
                    clientId={clientId}
                    router={router}
                  />
                ))}
            </TabsContent>

            {/* Onglet Confirmée */}
            <TabsContent value="Confirmée" className="space-y-4 mt-6">
              {filteredAndSortedCommandes
                ?.filter(c => c.statut_commande === 'Confirmée')
                .sort((a, b) => {
                  const dateA = a.date_et_heure_de_retrait_souhaitees
                    ? new Date(a.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  const dateB = b.date_et_heure_de_retrait_souhaitees
                    ? new Date(b.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  return dateA.getTime() - dateB.getTime();
                })
                .map(commande => (
                  <CommandeCard
                    key={commande.idcommande}
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onViewDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusBgColor={getStatusBgColor}
                    toast={toast}
                    onAddPlat={handleAddPlat}
                    onAddComplement={handleAddComplement}
                    updateCommandeMutation={updateCommandeMutation}
                    clientFullName={getClientFullName()}
                    clientId={clientId}
                    router={router}
                  />
                ))}
            </TabsContent>

            {/* Onglet En cours */}
            <TabsContent value="en_cours" className="space-y-4 mt-6">
              {filteredAndSortedCommandes
                ?.filter(
                  c =>
                    c.statut_commande !== 'Annulée' &&
                    c.statut_commande !== 'Récupérée'
                )
                .sort((a, b) => {
                  const dateA = a.date_et_heure_de_retrait_souhaitees
                    ? new Date(a.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  const dateB = b.date_et_heure_de_retrait_souhaitees
                    ? new Date(b.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  return dateA.getTime() - dateB.getTime();
                })
                .map(commande => (
                  <CommandeCard
                    key={commande.idcommande}
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onViewDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusBgColor={getStatusBgColor}
                    toast={toast}
                    onAddPlat={handleAddPlat}
                    onAddComplement={handleAddComplement}
                    updateCommandeMutation={updateCommandeMutation}
                    clientFullName={getClientFullName()}
                    clientId={clientId}
                    router={router}
                  />
                ))}
            </TabsContent>

            {/* Onglet Terminées */}
            <TabsContent value="Terminée" className="space-y-4 mt-6">
              {filteredAndSortedCommandes
                ?.filter(c => c.statut_commande === 'Récupérée')
                .sort((a, b) => {
                  const dateA = a.date_et_heure_de_retrait_souhaitees
                    ? new Date(a.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  const dateB = b.date_et_heure_de_retrait_souhaitees
                    ? new Date(b.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  return dateB.getTime() - dateA.getTime(); // Plus récentes en premier
                })
                .map(commande => (
                  <CommandeCard
                    key={commande.idcommande}
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onViewDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusBgColor={getStatusBgColor}
                    toast={toast}
                    onAddPlat={handleAddPlat}
                    onAddComplement={handleAddComplement}
                    updateCommandeMutation={updateCommandeMutation}
                    clientFullName={getClientFullName()}
                    clientId={clientId}
                    router={router}
                  />
                ))}
            </TabsContent>

            {/* Onglet Aujourd'hui */}
            <TabsContent value="today" className="space-y-4 mt-6">
              {filteredAndSortedCommandes
                ?.filter(
                  c =>
                    c.date_et_heure_de_retrait_souhaitees &&
                    isToday(new Date(c.date_et_heure_de_retrait_souhaitees)) &&
                    c.statut_commande !== 'Annulée'
                )
                .sort((a, b) => {
                  const dateA = new Date(
                    a.date_et_heure_de_retrait_souhaitees!
                  );
                  const dateB = new Date(
                    b.date_et_heure_de_retrait_souhaitees!
                  );
                  return dateA.getTime() - dateB.getTime();
                })
                .map(commande => (
                  <CommandeCard
                    key={commande.idcommande}
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onViewDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusBgColor={getStatusBgColor}
                    toast={toast}
                    onAddPlat={handleAddPlat}
                    onAddComplement={handleAddComplement}
                    updateCommandeMutation={updateCommandeMutation}
                    clientFullName={getClientFullName()}
                    clientId={clientId}
                    router={router}
                  />
                ))}
            </TabsContent>

            {/* Onglet Futur */}
            <TabsContent value="future" className="space-y-4 mt-6">
              {filteredAndSortedCommandes
                ?.filter(
                  c =>
                    c.date_et_heure_de_retrait_souhaitees &&
                    isFuture(new Date(c.date_et_heure_de_retrait_souhaitees)) &&
                    c.statut_commande !== 'Annulée'
                )
                .sort((a, b) => {
                  const dateA = new Date(
                    a.date_et_heure_de_retrait_souhaitees!
                  );
                  const dateB = new Date(
                    b.date_et_heure_de_retrait_souhaitees!
                  );
                  return dateA.getTime() - dateB.getTime();
                })
                .map(commande => (
                  <CommandeCard
                    key={commande.idcommande}
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onViewDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusBgColor={getStatusBgColor}
                    toast={toast}
                    onAddPlat={handleAddPlat}
                    onAddComplement={handleAddComplement}
                    updateCommandeMutation={updateCommandeMutation}
                    clientFullName={getClientFullName()}
                    clientId={clientId}
                    router={router}
                  />
                ))}
            </TabsContent>

            {/* Onglet Passées */}
            <TabsContent value="past" className="space-y-4 mt-6">
              {filteredAndSortedCommandes
                ?.filter(
                  c =>
                    c.date_et_heure_de_retrait_souhaitees &&
                    isPast(new Date(c.date_et_heure_de_retrait_souhaitees)) &&
                    c.statut_commande !== 'Annulée'
                )
                .sort((a, b) => {
                  const dateA = new Date(
                    a.date_et_heure_de_retrait_souhaitees!
                  );
                  const dateB = new Date(
                    b.date_et_heure_de_retrait_souhaitees!
                  );
                  return dateB.getTime() - dateA.getTime(); // Plus récentes en premier
                })
                .map(commande => (
                  <CommandeCard
                    key={commande.idcommande}
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onViewDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusBgColor={getStatusBgColor}
                    toast={toast}
                    onAddPlat={handleAddPlat}
                    onAddComplement={handleAddComplement}
                    updateCommandeMutation={updateCommandeMutation}
                    clientFullName={getClientFullName()}
                    clientId={clientId}
                    router={router}
                  />
                ))}
            </TabsContent>

            {/* Onglet Annulées */}
            <TabsContent value="Annulée" className="space-y-4 mt-6">
              {filteredAndSortedCommandes
                ?.filter(c => c.statut_commande === 'Annulée')
                .sort((a, b) => {
                  const dateA = a.date_et_heure_de_retrait_souhaitees
                    ? new Date(a.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  const dateB = b.date_et_heure_de_retrait_souhaitees
                    ? new Date(b.date_et_heure_de_retrait_souhaitees)
                    : new Date(0);
                  return dateB.getTime() - dateA.getTime(); // Plus récentes en premier
                })
                .map(commande => (
                  <CommandeCard
                    key={commande.idcommande}
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onViewDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusBgColor={getStatusBgColor}
                    toast={toast}
                    onAddPlat={handleAddPlat}
                    onAddComplement={handleAddComplement}
                    updateCommandeMutation={updateCommandeMutation}
                    clientFullName={getClientFullName()}
                    clientId={clientId}
                    router={router}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal Détails Commande */}
      {isDetailsOpen && selectedCommande && (
        <CommandeDetailsModal
          commandeId={selectedCommande.idcommande}
          onClose={() => setIsDetailsOpen(false)}
          onStatusChange={handleStatusChange}
          router={router}
          toast={toast}
        />
      )}

      {/* Modal Ajouter Plat */}
      {addPlatModal.isOpen && addPlatModal.commandeId && (
        <AddPlatModal
          commandeId={addPlatModal.commandeId}
          isOpen={addPlatModal.isOpen}
          onClose={() => setAddPlatModal({ isOpen: false, commandeId: null })}
          toast={toast}
        />
      )}

      {/* Modal Ajouter Complément Divers */}
      {addComplementModal.isOpen && addComplementModal.commandeId && (
        <AddComplementModal
          commandeId={addComplementModal.commandeId}
          isOpen={addComplementModal.isOpen}
          onClose={() =>
            setAddComplementModal({ isOpen: false, commandeId: null })
          }
          toast={toast}
        />
      )}
    </div>
  );
}

// Composant Card pour chaque commande
const CommandeCard = ({
  commande,
  onStatusChange,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
  getStatusBgColor,
  toast,
  onAddPlat,
  onAddComplement,
  updateCommandeMutation,
  clientFullName,
  clientId,
  router,
}: {
  commande: CommandeUI;
  onStatusChange: (id: number, status: string) => void;
  onViewDetails: (commande: CommandeUI) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBgColor: (status: string) => string;
  toast: any;
  onAddPlat: (commandeId: number) => void;
  onAddComplement: (commandeId: number) => void;
  updateCommandeMutation: any;
  clientFullName: string;
  clientId: string;
  router: any;
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [isLoadingTime, setIsLoadingTime] = useState(false);

  const isUrgent =
    commande.date_et_heure_de_retrait_souhaitees &&
    new Date(commande.date_et_heure_de_retrait_souhaitees) <
      new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h

  // Fonctions pour l'édition d'heure
  const handleTimeEdit = () => {
    if (commande.date_et_heure_de_retrait_souhaitees) {
      const currentTime = format(
        new Date(commande.date_et_heure_de_retrait_souhaitees),
        'HH:mm'
      );
      setNewTime(currentTime);
      setIsEditingTime(true);
    }
  };

  const handleTimeSave = async () => {
    if (!newTime || !commande.date_et_heure_de_retrait_souhaitees) return;

    setIsLoadingTime(true);
    try {
      const currentDate = new Date(
        commande.date_et_heure_de_retrait_souhaitees
      );
      const [hours, minutes] = newTime.split(':');
      currentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await updateCommandeMutation.mutateAsync({
        id: commande.idcommande,
        updates: {
          date_et_heure_de_retrait_souhaitees: currentDate.toISOString(),
        },
      });

      toast({
        title: '✅ Heure modifiée',
        description: `Nouvelle heure de retrait: ${newTime}`,
      });

      setIsEditingTime(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de modifier l'heure",
        variant: 'destructive',
      });
    } finally {
      setIsLoadingTime(false);
    }
  };

  const handleTimeCancel = () => {
    setIsEditingTime(false);
    setNewTime('');
  };

  // Calculer le prix total
  const calculateTotal = () => {
    if (!commande.details || !Array.isArray(commande.details)) return 0;
    return commande.details.reduce((sum, detail) => {
      // Pour les compléments divers, utiliser prix_unitaire, sinon utiliser le prix du plat
      const prix = detail.prix_unitaire ?? detail.plat?.prix ?? 0;
      const quantite = detail.quantite_plat_commande ?? 0;
      return sum + prix * quantite;
    }, 0);
  };

  // Obtenir le nom complet du client
  const getClientName = () => {
    return clientFullName;
  };

  // Obtenir les initiales du client (similaire à FloatingUserIcon)
  const getClientInitials = () => {
    const firstName = commande.client?.prenom;
    const lastName = commande.client?.nom;

    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (lastName) {
      return lastName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  // Obtenir la couleur du point selon le statut
  const getStatusPointColor = (status: StatutCommandeAffichage) => {
    switch (status) {
      case 'En attente de confirmation':
        return 'bg-thai-orange animate-pulse';
      case 'Confirmée':
        return 'bg-blue-500';
      case 'En préparation':
        return 'bg-yellow-500 animate-pulse';
      case 'Prête à récupérer':
        return 'bg-thai-gold animate-bounce';
      case 'Terminée':
      case 'Récupérée':
        return 'bg-thai-green';
      case 'Annulée':
        return 'bg-red-500';
      default:
        return 'bg-thai-orange animate-pulse';
    }
  };

  return (
    <Card
      className={`border-l-4 ${getStatusBgColor(
        commande.statut_commande || ''
      )} hover:shadow-lg transition-shadow`}
    >
      <CardContent className="p-0">
        {/* En-tête de la commande */}
        <div className="bg-white p-4 border-b border-gray-100 relative min-h-[180px]">
          <div className="flex justify-between items-start">
            {/* Informations client à gauche */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {commande.client?.photo_client ? (
                  <img
                    src={commande.client.photo_client}
                    alt={getClientName()}
                    className="w-12 h-12 rounded-full object-cover hover:scale-105 hover:ring-2 hover:ring-thai-orange/50 transition-all duration-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold hover:scale-105 hover:bg-thai-orange/90 transition-all duration-200">
                    {getClientInitials()}
                  </div>
                )}
                <span className="font-bold text-gray-800 text-xl">
                  {getClientName()}
                </span>
              </div>

              

              

              {/* Préférences client et demandes spéciales */}
              <div className="space-y-2">
                {commande.client?.preference_client && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-thai-green" />
                    <span className="text-sm text-gray-600 font-medium">
                      Préférence client:
                    </span>
                    <span className="italic text-thai-green bg-thai-green/10 px-3 py-2 rounded text-sm font-medium">
                      "{commande.client.preference_client}"
                    </span>
                  </div>
                )}

                {commande.demande_special_pour_la_commande && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-thai-orange" />
                    <span className="text-sm text-gray-600 font-medium">
                      Demande spéciale:
                    </span>
                    <span className="italic text-thai-orange bg-thai-orange/10 px-3 py-2 rounded text-sm font-medium">
                      "{commande.demande_special_pour_la_commande}"
                    </span>
                  </div>
                )}
              </div>

              {isUrgent && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="destructive"
                    className="animate-pulse px-3 py-1"
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    URGENT
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Date au centre avec format français complet - Positionnement absolu */}
          {commande.date_et_heure_de_retrait_souhaitees && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="group relative">
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-thai-green to-thai-orange text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:-rotate-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-2xl font-black text-center">
                      {format(
                        new Date(commande.date_et_heure_de_retrait_souhaitees),
                        'eeee dd MMMM',
                        { locale: fr }
                      )}
                    </div>
                  </div>

                  {/* Heure - affichage simple */}
                  <div className="border-t border-white/30 pt-2 mt-2 w-full">
                    <div className="text-2xl font-black text-center">
                      {format(
                        new Date(commande.date_et_heure_de_retrait_souhaitees),
                        'HH:mm',
                        { locale: fr }
                      )}
                    </div>
                  </div>
                  
                  {/* Commande passée le - Ajouté ici */}
                  {commande.date_de_prise_de_commande && (
                    <div className="text-xs text-white/80 text-center mt-2">
                      (Commandé le {format(new Date(commande.date_de_prise_de_commande), 'dd/MM/yy à HH:mm')})
                    </div>
                  )}
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-thai-green/60 to-thai-orange/60 rounded-xl opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
              </div>
            </div>
          )}

          {/* Interface de modification d'heure - design Thai */}
          {commande.date_et_heure_de_retrait_souhaitees && isEditingTime && (
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-br from-thai-cream to-white rounded-xl shadow-xl p-4 flex flex-col items-center gap-3 border-2 border-thai-orange/20">
                <div className="text-sm font-medium text-thai-green mb-1">
                  Nouvelle heure de retrait
                </div>
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="bg-white border-2 border-thai-orange/30 rounded-lg px-4 py-3 text-xl font-bold text-thai-green text-center focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-thai-orange shadow-sm"
                />
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={handleTimeSave}
                    disabled={isLoadingTime}
                    className="bg-thai-green hover:bg-thai-green/90 text-white px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoadingTime ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    )}
                    Sauvegarder
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTimeCancel}
                    disabled={isLoadingTime}
                    className="border-2 border-thai-red text-thai-red hover:bg-thai-red hover:text-white px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Dropdown de changement de statut en haut à droite - Style Premium */}
          <div className="absolute right-4 top-4 z-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-thai-orange/20 hover:shadow-xl transition-all duration-300 relative">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusPointColor(
                    (commande.statut_commande ||
                      'En attente de confirmation') as StatutCommandeAffichage
                  )}`}
                ></div>
                <span className="text-sm font-medium text-thai-green">
                  Commande n° <span className="font-bold text-red-500">{commande.idcommande}</span>
                </span>
                {/* Croix verte Thai pour fermer */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-thai-green text-white hover:bg-thai-green/80 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                  onClick={e => {
                    e.stopPropagation();
                    onStatusChange(commande.idcommande, 'Annulée');
                  }}
                  title="Annuler la commande"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <QuickActionButtons
                commande={commande}
                onStatusChange={onStatusChange}
              />
            </div>
          </div>
        </div>

        {/* Section actions */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between w-full">
            {/* Bouton Contacter à gauche */}
            <Button
              size="sm"
              variant="outline"
              className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/admin/clients/${clientId}/contact`);
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Contacter</span>
            </Button>

            {/* Bouton modifier l'heure au centre */}
            <div className="flex justify-center">
              {commande.date_et_heure_de_retrait_souhaitees &&
                !isEditingTime && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white transition-colors duration-200"
                    onClick={handleTimeEdit}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Modifier l'heure</span>
                  </Button>
                )}
            </div>

            {/* Bouton Détails à droite */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(commande)}
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Détails</span>
            </Button>
          </div>
        </div>

        {/* Plats commandés - Style inspiré du panier */}
        {commande.details && commande.details.length > 0 && (
          <div className="border-t border-gray-100">
            <div className="p-4">
              <div className="border border-thai-orange/20 rounded-lg p-4 bg-thai-cream/20">
                {/* En-tête avec date de retrait comme dans le panier */}
                {commande.date_et_heure_de_retrait_souhaitees &&
                  (() => {
                    const dateRetrait = new Date(
                      commande.date_et_heure_de_retrait_souhaitees
                    );
                    const dateFormatee = format(
                      dateRetrait,
                      'eeee dd MMMM yyyy',
                      { locale: fr }
                    );
                    const dateCapitalisee =
                      dateFormatee.charAt(0).toUpperCase() +
                      dateFormatee.slice(1);
                    const heureFormatee = format(dateRetrait, 'HH:mm');

                    return (
                      <div className="mb-3 pb-2 border-b border-thai-orange/10">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-thai-green flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-thai-orange" />
                            Retrait prévu le{' '}
                            <span className="text-thai-orange font-bold">
                              {dateCapitalisee} à {heureFormatee}
                            </span>
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white border-dashed"
                            onClick={() => onAddComplement(commande.idcommande)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Extra
                          </Button>
                        </div>
                      </div>
                    );
                  })()}

                <div className="space-y-4">
                  {commande.details.map((item, index: number) => (
                    <PlatCommandeCard
                      key={index}
                      item={item}
                      commandeId={commande.idcommande}
                      toast={toast}
                    />
                  ))}

                  {/* Bouton ajouter plat */}
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-thai-green text-thai-green hover:bg-thai-green hover:text-white border-dashed"
                      onClick={() => onAddPlat(commande.idcommande)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un plat
                    </Button>
                  </div>
                </div>

                {/* Total final */}
                <div className="bg-thai-green/10 border border-thai-green/20 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      Total de la commande
                    </span>
                    <span className="text-2xl font-bold text-thai-green">
                      {calculateTotal().toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composant pour chaque plat dans le modal avec contrôles identiques à PlatCommandeCard
const ModalPlatCard = ({
  item,
  commandeId,
  toast,
  formatPrix,
}: {
  item: any;
  commandeId: number;
  toast: any;
  formatPrix: (prix: number) => string;
}) => {
  const updateQuantiteMutation = useUpdatePlatQuantite();
  const removePlatMutation = useRemovePlatFromCommande();
  const [isModifying, setIsModifying] = useState(false);

  const handleQuantiteChange = async (nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0 || nouvelleQuantite === item.quantite_plat_commande) {
      return;
    }

    setIsModifying(true);
    try {
      await updateQuantiteMutation.mutateAsync({
        detailId: item.iddetails,
        quantite: nouvelleQuantite,
      });
    } finally {
      setIsModifying(false);
    }
  };

  const handleRemovePlat = async () => {
    const isConfirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer "${
        (item.nom_plat && item.prix_unitaire && !item.plat) || item.type === 'extra'
          ? item.nom_plat
          : item.plat?.plat
      }" de cette commande ?`
    );

    if (!isConfirmed) return;

    setIsModifying(true);
    try {
      await removePlatMutation.mutateAsync(item.iddetails);
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform">
      {/* Image du plat ou extra */}
      {(item.nom_plat && item.prix_unitaire && !item.plat) || item.type === 'extra' ? (
        <img
          src="https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
          alt="Extra"
          className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      ) : item.plat?.photo_du_plat ? (
        <img
          src={item.plat.photo_du_plat}
          alt={item.plat?.plat || item.nom_plat || 'Plat'}
          className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      ) : (
        <div className="w-24 h-16 bg-thai-cream/30 border border-thai-orange/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-thai-cream/50 transition-colors duration-200">
          <span className="text-thai-orange text-lg">🍽️</span>
        </div>
      )}

      {/* Informations du plat - exactement comme dans le panier */}
      <div className="flex-1">
        <h4 className="font-medium text-thai-green text-lg mb-1 cursor-pointer hover:text-thai-orange transition-colors duration-200 hover:underline decoration-thai-orange/50">
          {(item.nom_plat && item.prix_unitaire && !item.plat) || item.type === 'extra'
            ? item.nom_plat
            : item.plat?.plat || item.nom_plat}
          {((item.nom_plat && item.prix_unitaire && !item.plat) || item.type === 'extra') && (
            <span className="ml-2 text-xs bg-thai-orange/20 text-thai-orange px-2 py-1 rounded-full">
              Extra
            </span>
          )}
        </h4>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="font-medium">Quantité:</span>
            <span className="bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full font-medium">
              {item.quantite_plat_commande || 0}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium">Prix unitaire:</span>
            <span className="text-thai-green font-semibold">
              {formatPrix(item.prix_unitaire || item.plat?.prix || 0)}
            </span>
          </span>
        </div>
      </div>

      {/* Prix total et contrôles - exactement comme dans le panier */}
      <div className="text-right">
        <div className="text-2xl font-bold text-thai-orange mb-4">
          {formatPrix(
            (item.prix_unitaire ?? item.plat?.prix ?? 0) *
              (item.quantite_plat_commande || 0)
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantiteChange((item.quantite_plat_commande || 1) - 1);
            }}
            disabled={isModifying || (item.quantite_plat_commande || 0) <= 0}
          >
            -
          </Button>
          <span className="w-8 text-center font-medium">
            {isModifying ? (
              <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              item.quantite_plat_commande || 0
            )}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantiteChange((item.quantite_plat_commande || 0) + 1);
            }}
            disabled={isModifying}
          >
            +
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleRemovePlat();
            }}
            disabled={isModifying}
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-red-300"
            aria-label="Supprimer l'article"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Modal Détails Commande
const CommandeDetailsModal = ({
  commandeId,
  onClose,
  onStatusChange,
  router,
  toast,
}: {
  commandeId: number;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
  router: any;
  toast: any;
}) => {
  // Tous les hooks doivent être appelés avant tout return conditionnel
  const { data: commande, isLoading, error } = useCommandeById(commandeId);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [isAddingPlat, setIsAddingPlat] = useState(false);
  const [showAddPlatDialog, setShowAddPlatDialog] = useState(false);
  const [selectedPlatToAdd, setSelectedPlatToAdd] = useState<any>(null);
  const [quantiteToAdd, setQuantiteToAdd] = useState(1);
  const [showAddComplementModal, setShowAddComplementModal] = useState(false);
  const [nomComplement, setNomComplement] = useState('');
  const [prixComplement, setPrixComplement] = useState('');
  
  // États pour la modification d'heure
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [isLoadingTime, setIsLoadingTime] = useState(false);
  
  // Hooks pour la gestion des plats
  const { data: plats } = usePlats();
  const addPlatMutation = useAddPlatToCommande();
  const updateCommandeMutation = useUpdateCommande();
  
  // Fonctions pour la modification d'heure
  const handleTimeEdit = () => {
    if (commande?.date_et_heure_de_retrait_souhaitees) {
      const currentTime = format(
        new Date(commande.date_et_heure_de_retrait_souhaitees),
        'HH:mm'
      );
      setNewTime(currentTime);
      setIsEditingTime(true);
    }
  };

  const handleTimeSave = async () => {
    if (!newTime || !commande?.date_et_heure_de_retrait_souhaitees) return;

    setIsLoadingTime(true);
    try {
      const currentDate = new Date(
        commande.date_et_heure_de_retrait_souhaitees
      );
      const [hours, minutes] = newTime.split(':');
      currentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await updateCommandeMutation.mutateAsync({
        id: commande.idcommande,
        updates: {
          date_et_heure_de_retrait_souhaitees: currentDate.toISOString(),
        },
      });

      toast({
        title: '✅ Heure modifiée',
        description: `Nouvelle heure de retrait: ${newTime}`,
      });

      setIsEditingTime(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de modifier l'heure",
        variant: 'destructive',
      });
    } finally {
      setIsLoadingTime(false);
    }
  };
  
  // Afficher un loading si les données ne sont pas encore chargées
  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-thai-orange" />
            <span className="text-lg">Chargement des détails...</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Afficher une erreur si le chargement a échoué
  if (error || !commande) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <X className="w-12 h-12 mx-auto text-red-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
            <p className="text-gray-600 mb-4">Impossible de charger les détails de la commande</p>
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </div>
    );
  }

  // Fonction formatPrix identique à celle de la page principale
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  // Calculer le prix total
  const calculateTotal = () => {
    if (!commande.details || !Array.isArray(commande.details)) return 0;
    return commande.details.reduce((sum, detail) => {
      // Pour les compléments divers, utiliser prix_unitaire, sinon utiliser le prix du plat
      const prix = detail.prix_unitaire ?? detail.plat?.prix ?? 0;
      const quantite = detail.quantite_plat_commande ?? 0;
      return sum + prix * quantite;
    }, 0);
  };

  // Gérer le changement de statut avec loading
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === commande.statut_commande) return;
    
    setIsStatusLoading(true);
    try {
      await onStatusChange(commande.idcommande, newStatus);
    } finally {
      setIsStatusLoading(false);
    }
  };


  const handleAddPlat = async () => {
    if (!selectedPlatToAdd || quantiteToAdd <= 0) return;
    
    setIsAddingPlat(true);
    try {
      await addPlatMutation.mutateAsync({
        commandeId: commande.idcommande,
        platId: selectedPlatToAdd.idplats,
        quantite: quantiteToAdd
      });
      
      toast({
        title: "✅ Plat ajouté",
        description: `${selectedPlatToAdd.plat} (x${quantiteToAdd}) a été ajouté à la commande`,
      });
      
      // Réinitialiser le formulaire
      setSelectedPlatToAdd(null);
      setQuantiteToAdd(1);
      setShowAddPlatDialog(false);
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible d'ajouter le plat",
        variant: "destructive",
      });
    } finally {
      setIsAddingPlat(false);
    }
  };

  const handleAddComplement = async () => {
    if (!nomComplement.trim() || !prixComplement || parseFloat(prixComplement) <= 0) {
      toast({
        title: "❌ Erreur",
        description: "Veuillez saisir un nom et un prix valide pour l'extra",
        variant: "destructive",
      });
      return;
    }

    try {
      await addPlatMutation.mutateAsync({
        commandeId: commande.idcommande,
        platId: null,
        quantite: 1,
        nomPlat: nomComplement.trim(),
        prixUnitaire: parseFloat(prixComplement),
        type: 'extra'
      });

      toast({
        title: "✅ Extra ajouté",
        description: `${nomComplement} a été ajouté à la commande`,
      });

      // Réinitialiser le formulaire
      setNomComplement('');
      setPrixComplement('');
      setShowAddComplementModal(false);
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible d'ajouter l'extra",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Fermer le modal si on clique sur l'arrière-plan
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-thai-green">
              Détails Commande #{commande.idcommande}
            </h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations client - Disposition améliorée */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-thai-orange/10 to-thai-gold/10 rounded-lg">
                {/* Photo/Avatar */}
                {commande.client?.photo_client ? (
                  <img 
                    src={commande.client.photo_client} 
                    alt={`${commande.client?.prenom || ''} ${commande.client?.nom || ''}`.trim()}
                    className="w-16 h-16 rounded-full object-cover border-2 border-thai-orange/20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold text-xl border-2 border-thai-orange/20 flex-shrink-0">
                    {commande.client?.prenom ? commande.client.prenom.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                
                {/* Informations principales */}
                <div className="flex-1 space-y-2">
                  {/* 1. Nom Prénom */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {commande.client?.prenom && commande.client?.nom 
                        ? `${commande.client.prenom} ${commande.client.nom}`
                        : commande.client?.nom || commande.client?.prenom || 'Client non défini'
                      }
                    </h3>
                  </div>
                  
                  {/* 2. Adresse postale */}
                  {(commande.client?.adresse_numero_et_rue || commande.client?.code_postal || commande.client?.ville) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-thai-orange mt-0.5 flex-shrink-0" />
                      <div className="text-gray-700 text-sm">
                        {commande.client?.adresse_numero_et_rue && (
                          <div className="font-medium">{commande.client.adresse_numero_et_rue}</div>
                        )}
                        {(commande.client?.code_postal || commande.client?.ville) && (
                          <div className="text-gray-600">
                            {commande.client?.code_postal && commande.client.code_postal}
                            {commande.client?.code_postal && commande.client?.ville && ' '}
                            {commande.client?.ville && commande.client.ville}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* 3. Email */}
                  {commande.client?.email && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-thai-green flex-shrink-0" />
                      <a 
                        href={`mailto:${commande.client.email}`}
                        className="text-thai-green hover:text-thai-green-dark text-sm font-medium hover:underline transition-colors"
                      >
                        {commande.client.email}
                      </a>
                    </div>
                  )}
                  
                  {/* 4. Numéro de téléphone avec lien d'appel */}
                  {commande.client?.numero_de_telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-thai-orange flex-shrink-0" />
                      <a 
                        href={`tel:${commande.client.numero_de_telephone}`}
                        className="text-thai-orange hover:text-thai-orange-dark text-sm font-medium hover:underline transition-colors flex items-center gap-1"
                      >
                        {commande.client.numero_de_telephone}
                        <span className="text-xs text-gray-500">(cliquer pour appeler)</span>
                      </a>
                    </div>
                  )}
                </div>
                {/* Bouton Contact */}
                <Button
                  size="sm"
                  className="bg-thai-green hover:bg-thai-green-dark text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const clientFirebaseUID = commande.client_r || commande.FirebaseUID || commande.client?.firebase_uid;
                    if (clientFirebaseUID) {
                      router.push(`/admin/clients/${clientFirebaseUID}/contact`);
                      onClose(); // Fermer le modal
                    } else {
                      toast({
                        title: '❌ Erreur',
                        description: "Impossible de trouver l'ID du client",
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contact
                </Button>
              </div>
              
              {/* Adresse si disponible */}
              {commande.adresse_specifique && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-thai-orange mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-700">Adresse de livraison</p>
                    <p className="text-gray-600 text-sm">{commande.adresse_specifique}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date au centre avec format français complet */}
          {commande?.date_et_heure_de_retrait_souhaitees && (
            <div className="mb-6">
              <div className="group relative">
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-thai-green to-thai-orange text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:-rotate-1 min-w-[200px] mx-auto">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-2xl font-black text-center">
                      {format(
                        new Date(commande.date_et_heure_de_retrait_souhaitees),
                        'eeee dd MMMM',
                        { locale: fr }
                      )}
                    </div>
                  </div>

                  {/* Heure - affichage simple */}
                  <div className="border-t border-white/30 pt-2 mt-2 w-full">
                    <div className="text-2xl font-black text-center">
                      {format(
                        new Date(commande.date_et_heure_de_retrait_souhaitees),
                        'HH:mm',
                        { locale: fr }
                      )}
                    </div>
                  </div>
                  
                  {/* Commande passée le */}
                  {commande?.date_de_prise_de_commande && (
                    <div className="text-xs text-white/80 text-center mt-2">
                      (Commandé le {format(new Date(commande.date_de_prise_de_commande), 'dd/MM/yy à HH:mm')})
                    </div>
                  )}
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-thai-green/60 to-thai-orange/60 rounded-xl opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
              </div>
            </div>
          )}

          {/* Interface de modification d'heure dans le modal */}
          {commande?.date_et_heure_de_retrait_souhaitees && isEditingTime && (
            <div className="mb-6 flex justify-center">
              <div className="bg-gradient-to-br from-thai-cream to-white rounded-xl shadow-xl p-4 flex flex-col items-center gap-3 border-2 border-thai-orange/20 min-w-[280px]">
                <div className="text-sm font-medium text-thai-green mb-1">
                  Nouvelle heure de retrait
                </div>
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="bg-white border-2 border-thai-orange/30 rounded-lg px-4 py-3 text-xl font-bold text-thai-green text-center focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-thai-orange shadow-sm"
                />
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={handleTimeSave}
                    disabled={isLoadingTime}
                    className="bg-thai-green hover:bg-thai-green/90 text-white px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoadingTime ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    Valider
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingTime(false)}
                    disabled={isLoadingTime}
                    className="border-2 border-thai-red text-thai-red hover:bg-thai-red hover:text-white px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Détails commande */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <ShoppingBasket className="w-5 h-5" />
                  Détails de la Commande
                </CardTitle>
                
                <div className="flex items-center gap-3">
                  {/* Bouton modifier l'heure - Entre titre et statut */}
                  {commande?.date_et_heure_de_retrait_souhaitees && !isEditingTime && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white transition-colors duration-200"
                      onClick={handleTimeEdit}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Modifier l'heure
                    </Button>
                  )}
                  
                  {/* Changement de Statut - Déplacé à droite */}
                <Select
                  value={commande?.statut_commande === 'Récupérée' ? 'Terminée' : (commande?.statut_commande || 'En attente de confirmation')}
                  onValueChange={(newStatus) => {
                    const dbStatus = newStatus === 'Terminée' ? 'Récupérée' : newStatus;
                    if (commande?.idcommande) {
                      onStatusChange(commande.idcommande, dbStatus);
                    }
                  }}
                  disabled={isStatusLoading}
                >
                  <SelectTrigger className="h-10 text-sm w-auto min-w-[160px] max-w-[200px] border-2 border-thai-orange/40 bg-gradient-to-r from-white to-thai-cream/20 hover:from-thai-orange/10 hover:to-thai-orange/20 hover:border-thai-orange focus:border-thai-orange shadow-lg hover:shadow-xl transition-all duration-300 font-bold rounded-xl backdrop-blur-sm hover:scale-105 group">
                    <SelectValue />
                    {isStatusLoading && (
                      <RefreshCw className="w-4 h-4 ml-2 animate-spin text-thai-orange" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-thai-orange/20 shadow-xl rounded-xl overflow-hidden">
                    <SelectItem
                      value="En attente de confirmation"
                      className="bg-thai-orange/10 hover:bg-thai-orange/20 border-l-4 border-thai-orange transition-all duration-200 cursor-pointer my-1"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <Clock className="w-4 h-4 text-thai-orange animate-pulse transition-all duration-300 group-hover:scale-110" />
                        <span className="font-semibold text-thai-orange">
                          En Attente
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="Confirmée"
                      className="bg-blue-50/90 hover:bg-blue-100/90 border-l-4 border-blue-500 transition-all duration-200 cursor-pointer my-1"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <ClipboardCheck className="w-4 h-4 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        <span className="font-semibold text-blue-700">
                          Confirmée
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="En préparation"
                      className="bg-yellow-50/90 hover:bg-yellow-100/90 border-l-4 border-yellow-500 transition-all duration-200 cursor-pointer my-1"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <ChefHat className="w-4 h-4 text-yellow-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        <span className="font-semibold text-yellow-700">
                          En Préparation
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="Prête à récupérer"
                      className="bg-thai-gold/10 hover:bg-thai-gold/20 border-l-4 border-thai-gold transition-all duration-200 cursor-pointer my-1"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <Package2 className="w-4 h-4 text-thai-gold animate-bounce transition-all duration-300 group-hover:scale-110" />
                        <span className="font-semibold text-thai-gold">
                          Prête
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="Terminée"
                      className="bg-thai-green/10 hover:bg-thai-green/20 border-l-4 border-thai-green transition-all duration-200 cursor-pointer my-1"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <PackageCheck className="w-4 h-4 text-thai-green transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="font-semibold text-thai-green">
                          Terminée
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="Annulée"
                      className="bg-red-50/80 hover:bg-red-100/90 border-l-4 border-red-500 transition-all duration-200 cursor-pointer my-1"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <X className="w-4 h-4 text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
                        <span className="font-semibold text-red-600">
                          Annulée
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Section Plats Commandés - Structure identique à CommandeCard */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-thai-green flex items-center gap-2">
                    <ShoppingBasket className="w-5 h-5" />
                    Plats commandés
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white border-dashed"
                      onClick={() => setShowAddPlatDialog(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un plat
                    </Button>
                    <Button
                      variant="outline"
                      className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white border-dashed"
                      onClick={() => setShowAddComplementModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Extra
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {commande.details && commande.details.length > 0 ? (
                    commande.details.map((item, index: number) => (
                      <ModalPlatCard
                        key={index}
                        item={item}
                        commandeId={commande.idcommande}
                        toast={toast}
                        formatPrix={formatPrix}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                      <ShoppingBasket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun plat dans cette commande</p>
                      <p className="text-sm">Utilisez le bouton "Ajouter un plat" pour commencer</p>
                    </div>
                  )}
                </div>

                {/* Total final - Structure identique à CommandeCard */}
                {commande.details && commande.details.length > 0 && (
                  <div className="bg-thai-green/10 border border-thai-green/20 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        Total de la commande
                      </span>
                      <span className="text-2xl font-bold text-thai-green">
                        {formatPrix(calculateTotal())}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions spéciales */}
              {commande.demande_special_pour_la_commande && (
                <div>
                  <p className="font-medium">Instructions spéciales</p>
                  <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg">
                    {commande.demande_special_pour_la_commande}
                  </p>
                </div>
              )}

              {/* Préférence client */}
              {commande.client?.preference_client && (
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-thai-green" />
                    Préférence client
                  </p>
                  <p className="text-gray-600 bg-thai-green/10 p-3 rounded-lg">
                    {commande.client.preference_client}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>

      {/* Dialog d'ajout de plat */}
      {showAddPlatDialog && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            // Fermer le modal si on clique sur l'arrière-plan
            if (e.target === e.currentTarget) {
              setShowAddPlatDialog(false);
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-thai-green">Ajouter un plat</h3>
                <Button variant="ghost" onClick={() => setShowAddPlatDialog(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Sélection du plat */}
              <div>
                <Label htmlFor="plat-select">Choisir un plat</Label>
                <Select
                  value={selectedPlatToAdd?.idplats?.toString() || ''}
                  onValueChange={(value) => {
                    const plat = plats?.find(p => p.idplats.toString() === value);
                    setSelectedPlatToAdd(plat || null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un plat..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {plats?.map((plat) => (
                      <SelectItem key={plat.idplats} value={plat.idplats.toString()}>
                        <div className="flex items-center gap-3">
                          {plat.photo_du_plat ? (
                            <img
                              src={plat.photo_du_plat}
                              alt={plat.plat}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-thai-cream rounded flex items-center justify-center">
                              🍽️
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{plat.plat}</div>
                            <div className="text-sm text-gray-500">
                              {formatPrix(plat.prix || 0)}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Aperçu du plat sélectionné */}
              {selectedPlatToAdd && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    {selectedPlatToAdd.photo_du_plat ? (
                      <img
                        src={selectedPlatToAdd.photo_du_plat}
                        alt={selectedPlatToAdd.plat}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-thai-cream rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{selectedPlatToAdd.plat}</h4>
                      <p className="text-thai-green font-semibold">
                        {formatPrix(selectedPlatToAdd.prix)}
                      </p>
                      {selectedPlatToAdd.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedPlatToAdd.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantité */}
              <div>
                <Label htmlFor="quantite">Quantité</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantiteToAdd(Math.max(1, quantiteToAdd - 1))}
                    disabled={quantiteToAdd <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="quantite"
                    type="number"
                    min="1"
                    value={quantiteToAdd}
                    onChange={(e) => setQuantiteToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantiteToAdd(quantiteToAdd + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Total */}
              {selectedPlatToAdd && (
                <div className="p-3 bg-thai-green/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total à ajouter:</span>
                    <span className="text-xl font-bold text-thai-green">
                      {formatPrix(selectedPlatToAdd.prix * quantiteToAdd)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddPlatDialog(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleAddPlat}
                disabled={!selectedPlatToAdd || isAddingPlat}
                className="bg-thai-orange hover:bg-thai-orange-dark text-white"
              >
                {isAddingPlat ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter le plat
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter un Extra */}
      {showAddComplementModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
          onClick={(e) => {
            // Fermer le modal si on clique sur l'arrière-plan
            if (e.target === e.currentTarget) {
              setShowAddComplementModal(false);
              setNomComplement('');
              setPrixComplement('');
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-thai-green">Ajouter un Extra</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowAddComplementModal(false);
                    setNomComplement('');
                    setPrixComplement('');
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Nom de l'Extra */}
              <div>
                <Label htmlFor="nom-extra">Nom de l'Extra</Label>
                <Input
                  id="nom-extra"
                  type="text"
                  placeholder="Ex: Riz supplémentaire, Sauce, etc."
                  value={nomComplement}
                  onChange={(e) => setNomComplement(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Prix de l'Extra */}
              <div>
                <Label htmlFor="prix-extra">Prix (€)</Label>
                <Input
                  id="prix-extra"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={prixComplement}
                  onChange={(e) => setPrixComplement(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Aperçu */}
              {nomComplement && prixComplement && (
                <div className="p-3 bg-thai-orange/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{nomComplement}</span>
                    <span className="text-lg font-bold text-thai-orange">
                      {formatPrix(parseFloat(prixComplement) || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddComplementModal(false);
                  setNomComplement('');
                  setPrixComplement('');
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddComplement}
                disabled={!nomComplement.trim() || !prixComplement || parseFloat(prixComplement) <= 0}
                className="bg-thai-orange hover:bg-thai-orange-dark text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter l'Extra
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
