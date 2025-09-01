'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import {
  useCommandes,
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
    currentStatus === 'Récupérée' ? 'Terminée' : currentStatus;

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
        item.type === 'complement_divers'
          ? item.nom_plat || item.plat?.plat
          : item.plat?.plat || item.nom_plat
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
      {item.type === 'complement_divers' ? (
        <img
          src="https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
          alt="Extra"
          className="w-24 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      ) : item.plat?.photo_du_plat ? (
        <img
          src={item.plat.photo_du_plat}
          alt={
            item.type === 'complement_divers'
              ? item.nom_plat || item.plat?.plat || 'Extra'
              : item.plat?.plat || item.nom_plat || 'Plat'
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
          {item.type === 'complement_divers'
            ? item.nom_plat || item.plat?.plat
            : item.plat?.plat || item.nom_plat}
          {item.type === 'complement_divers' && (
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
        type: 'complement_divers',
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
            <Label htmlFor="nom-complement" className="text-sm font-medium">
              Nom du complément *
            </Label>
            <Input
              id="nom-complement"
              value={nomComplement}
              onChange={e => setNomComplement(e.target.value)}
              placeholder="Ex: Sauce supplémentaire, Riz jasmin..."
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="prix-complement" className="text-sm font-medium">
              Prix (€) *
            </Label>
            <Input
              id="prix-complement"
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
          error.message || 'Erreur inconnue'
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

export default function AdminCommandes() {
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

  const { data: commandes, refetch } = useCommandes();
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
          c.statut_commande !== 'Annulée' &&
          c.statut_commande !== 'Récupérée'
      ).length || 0,
    terminees:
      commandes?.filter(
        c =>
          c.statut_commande === 'Récupérée'
      ).length || 0,
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

  const getStatusColor = (statut: StatutCommandeAffichage) => {
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

  const getStatusBgColor = (statut: StatutCommandeAffichage) => {
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

  const getStatusIcon = (statut: StatutCommandeAffichage) => {
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

  return (
    <div className="space-y-6">
      {/* Filtres et Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-thai-green flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5" />
                Gestion des Commandes ({filteredAndSortedCommandes.length})
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
                  />
                ))}
            </TabsContent>

            {/* Onglet Terminées */}
            <TabsContent value="Terminée" className="space-y-4 mt-6">
              {filteredAndSortedCommandes
                ?.filter(
                  c =>
                    c.statut_commande === 'Récupérée'
                )
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
                  />
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal Détails Commande */}
      {isDetailsOpen && selectedCommande && (
        <CommandeDetailsModal
          commande={selectedCommande}
          onClose={() => setIsDetailsOpen(false)}
          onStatusChange={handleStatusChange}
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
    if (commande.client?.nom && commande.client?.prenom) {
      return `${commande.client.prenom} ${commande.client.nom}`;
    }
    if (commande.client?.nom) return commande.client.nom;
    if (commande.client?.prenom) return commande.client.prenom;
    return 'Client non défini';
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
        <div className="bg-white p-4 border-b border-gray-100 relative min-h-[120px]">
          <div className="flex justify-between items-start">
            {/* Informations client à gauche */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {commande.client?.photo_client ? (
                  <img
                    src={commande.client.photo_client}
                    alt={getClientName()}
                    className="w-12 h-12 rounded-full object-cover border-2 border-thai-orange/50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold">
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
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-lg font-bold text-center">
                      {format(
                        new Date(commande.date_et_heure_de_retrait_souhaitees),
                        'eeee dd MMMM',
                        { locale: fr }
                      )}
                    </div>
                  </div>

                  {/* Heure - affichage simple */}
                  <div className="border-t border-white/30 pt-2 mt-1 w-full">
                    <div className="text-2xl font-black text-center">
                      {format(
                        new Date(commande.date_et_heure_de_retrait_souhaitees),
                        'HH:mm',
                        { locale: fr }
                      )}
                    </div>
                  </div>
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
                    (commande.statut_commande || 'En attente de confirmation') as StatutCommandeAffichage
                  )}`}
                ></div>
                <span className="text-sm font-medium text-thai-green">
                  Changer le statut
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
              onClick={() => {
                const clientName = getClientName();
                if (commande.client?.numero_de_telephone) {
                  toast({
                    title: '📱 Contact à venir',
                    description: `WhatsApp avec ${clientName} sera disponible prochainement`,
                  });
                } else {
                  toast({
                    title: '❌ Pas de numéro',
                    description: "Ce client n'a pas de numéro de téléphone",
                  });
                }
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

// Modal Détails Commande
const CommandeDetailsModal = ({
  commande,
  onClose,
  onStatusChange,
}: {
  commande: CommandeUI;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Nom du client</p>
                <p className="text-gray-600">
                  {commande.client_r || 'Non défini'}
                </p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">
                  {commande.client?.email || 'Non renseigné'}
                </p>
              </div>
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-gray-600">
                  {commande.client?.numero_de_telephone || 'Non renseigné'}
                </p>
              </div>
              <div>
                <p className="font-medium">Type de livraison</p>
                <p className="text-gray-600">
                  {commande.type_livraison || 'Non spécifié'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Détails commande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5" />
                Détails de la Commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Statut</p>
                  <Select
                    value={commande.statut_commande}
                    onValueChange={value =>
                      onStatusChange(commande.idcommande, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En attente de confirmation">
                        En Attente
                      </SelectItem>
                      <SelectItem value="Confirmée">Confirmée</SelectItem>
                      <SelectItem value="En préparation">
                        En Préparation
                      </SelectItem>
                      <SelectItem value="Prête à récupérer">Prête</SelectItem>
                      <SelectItem value="Terminée">Terminée</SelectItem>
                      <SelectItem value="Annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="font-medium">Date de retrait</p>
                  <p className="text-gray-600">
                    {commande.date_et_heure_de_retrait_souhaitees &&
                      format(
                        new Date(commande.date_et_heure_de_retrait_souhaitees),
                        'dd/MM/yyyy à HH:mm',
                        { locale: fr }
                      )}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-2xl font-bold text-thai-orange">
                    {calculateTotal().toFixed(2)}€
                  </p>
                </div>
              </div>

              {/* Liste des plats */}
              {commande.details && commande.details.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Plats commandés :</h4>
                  <div className="space-y-2">
                    {commande.details.map((item, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.plat?.photo_du_plat && (
                            <img
                              src={item.plat.photo_du_plat}
                              alt={
                                item.type === 'complement_divers'
                                  ? item.nom_plat || item.plat?.plat || 'Extra'
                                  : item.plat?.plat || item.nom_plat || 'Plat'
                              }
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">
                              {item.type === 'complement_divers'
                                ? item.nom_plat || item.plat?.plat
                                : item.plat?.plat || item.nom_plat}
                              {item.type === 'complement_divers' && (
                                <span className="ml-2 text-xs bg-thai-orange/20 text-thai-orange px-2 py-1 rounded-full">
                                  Complément
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantité: {item.quantite_plat_commande || 0}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(
                              (item.prix_unitaire ?? item.plat?.prix ?? 0) *
                              (item.quantite_plat_commande || 0)
                            ).toFixed(2)}
                            €
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.prix_unitaire ?? item.plat?.prix ?? 0}€ ×{' '}
                            {item.quantite_plat_commande || 0}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions spéciales */}
              {commande.demande_special_pour_la_commande && (
                <div>
                  <p className="font-medium">Instructions spéciales</p>
                  <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg">
                    {commande.demande_special_pour_la_commande}
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
    </div>
  );
};
