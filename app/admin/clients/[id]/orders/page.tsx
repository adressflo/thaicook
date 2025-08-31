'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Package,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Plus,
  Calendar,
  Euro,
  Clock,
  MapPin,
  Phone,
  Copy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
  RotateCcw,
  TrendingUp,
  Star,
  Users,
  ChefHat
} from 'lucide-react';
import { useClients, useCommandes, useUpdateCommande, useDeleteCommande } from '@/hooks/useSupabaseData';
import { StatusBadge } from '@/components/historique/StatusBadge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { ClientUI, CommandeUI } from '@/types/app';

export default function ClientOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const clientId = params.id as string;
  
  const { data: clients } = useClients();
  const { data: commandes } = useCommandes();
  const updateCommandeMutation = useUpdateCommande();
  const deleteCommandeMutation = useDeleteCommande();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // Trouver le client actuel
  const client = useMemo(() => {
    return clients?.find(c => c.firebase_uid === clientId);
  }, [clients, clientId]);

  // Filtrer les commandes du client
  const clientCommandes = useMemo(() => {
    return commandes?.filter(c => c.client_r === clientId) || [];
  }, [commandes, clientId]);

  // Appliquer les filtres et tri
  const filteredCommandes = useMemo(() => {
    let filtered = [...clientCommandes];

    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(commande => 
        commande.idcommande.toString().includes(term) ||
        commande.demande_special_pour_la_commande?.toLowerCase().includes(term) ||
        commande.details?.some(detail => 
          detail.plat?.plat?.toLowerCase().includes(term)
        )
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(commande => commande.statut_commande === statusFilter);
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(commande => 
            commande.date_de_prise_de_commande && 
            new Date(commande.date_de_prise_de_commande) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(commande => 
            commande.date_de_prise_de_commande && 
            new Date(commande.date_de_prise_de_commande) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(commande => 
            commande.date_de_prise_de_commande && 
            new Date(commande.date_de_prise_de_commande) >= filterDate
          );
          break;
      }
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date_de_prise_de_commande || 0).getTime() - new Date(a.date_de_prise_de_commande || 0).getTime();
        case 'date_asc':
          return new Date(a.date_de_prise_de_commande || 0).getTime() - new Date(b.date_de_prise_de_commande || 0).getTime();
        case 'amount_desc':
          const aTotal = a.details?.reduce((sum, d) => sum + ((d.plat?.prix || 0) * (d.quantite_plat_commande || 0)), 0) || 0;
          const bTotal = b.details?.reduce((sum, d) => sum + ((d.plat?.prix || 0) * (d.quantite_plat_commande || 0)), 0) || 0;
          return bTotal - aTotal;
        case 'amount_asc':
          const aTotal2 = a.details?.reduce((sum, d) => sum + ((d.plat?.prix || 0) * (d.quantite_plat_commande || 0)), 0) || 0;
          const bTotal2 = b.details?.reduce((sum, d) => sum + ((d.plat?.prix || 0) * (d.quantite_plat_commande || 0)), 0) || 0;
          return aTotal2 - bTotal2;
        case 'id_desc':
          return b.idcommande - a.idcommande;
        case 'id_asc':
          return a.idcommande - b.idcommande;
        default:
          return 0;
      }
    });

    return filtered;
  }, [clientCommandes, searchTerm, statusFilter, dateFilter, sortBy]);

  // Statistiques
  const stats = useMemo(() => {
    const total = clientCommandes.length;
    const totalAmount = clientCommandes.reduce((sum, commande) => {
      const orderTotal = commande.details?.reduce((detailSum, detail) => {
        return detailSum + ((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0));
      }, 0) || 0;
      return sum + orderTotal;
    }, 0);

    const byStatus = clientCommandes.reduce((acc, commande) => {
      const status = commande.statut_commande || 'Inconnu';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, totalAmount, byStatus };
  }, [clientCommandes]);

  // Fonction pour mettre à jour le statut d'une commande
  const handleStatusUpdate = async (commandeId: number, newStatus: string) => {
    try {
      await updateCommandeMutation.mutateAsync({
        id: commandeId,
        updates: { statut_commande: newStatus as any }
      });
      
      toast({
        title: 'Statut mis à jour',
        description: `Commande #${commandeId} mise à jour.`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut.',
        variant: 'destructive'
      });
    }
  };

  // Fonction pour supprimer une commande
  const handleDeleteOrder = async (commandeId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }

    try {
      await deleteCommandeMutation.mutateAsync(commandeId);
      
      toast({
        title: 'Commande supprimée',
        description: `Commande #${commandeId} supprimée avec succès.`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la commande.',
        variant: 'destructive'
      });
    }
  };

  // Fonction pour dupliquer une commande
  const handleDuplicateOrder = (commande: CommandeUI) => {
    toast({
      title: 'Duplication',
      description: 'Fonctionnalité de duplication à implémenter.',
    });
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la Fiche
            </Button>
            
            <div className="flex items-center gap-3">
              {client.photo_client ? (
                <img 
                  src={client.photo_client} 
                  alt="Photo client" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-thai-orange shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold">
                  {client.prenom?.charAt(0) || 'C'}{client.nom?.charAt(0) || 'L'}
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-thai-green">
                  Commandes - {client.prenom} {client.nom}
                </h1>
                <p className="text-thai-green/70">Historique & gestion complète</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <div className="flex items-center gap-2 text-thai-green">
              <Package className="w-6 h-6" />
              <span className="font-semibold">{filteredCommandes.length} commandes</span>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Package className="w-6 h-6 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold">{stats.totalAmount.toFixed(0)}€</p>
                </div>
                <Euro className="w-6 h-6 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">En attente</p>
                  <p className="text-2xl font-bold">{stats.byStatus['En attente de confirmation'] || 0}</p>
                </div>
                <Clock className="w-6 h-6 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Confirmées</p>
                  <p className="text-2xl font-bold">{stats.byStatus['Confirmée'] || 0}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres & Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-thai-orange w-4 h-4" />
                <Input
                  placeholder="Rechercher commandes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              {/* Filtre statut */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En attente de confirmation">En attente</SelectItem>
                  <SelectItem value="Confirmée">Confirmée</SelectItem>
                  <SelectItem value="En préparation">En préparation</SelectItem>
                  <SelectItem value="Prête à récupérer">Prête</SelectItem>
                  <SelectItem value="Récupérée">Récupérée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtre date */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Date (récent → ancien)</SelectItem>
                  <SelectItem value="date_asc">Date (ancien → récent)</SelectItem>
                  <SelectItem value="amount_desc">Montant (élevé → bas)</SelectItem>
                  <SelectItem value="amount_asc">Montant (bas → élevé)</SelectItem>
                  <SelectItem value="id_desc">ID (élevé → bas)</SelectItem>
                  <SelectItem value="id_asc">ID (bas → élevé)</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset */}
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('all');
                  setSortBy('date_desc');
                }}
                variant="outline"
                className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des commandes */}
        <div className="space-y-4">
          {filteredCommandes.length > 0 ? (
            <div className="space-y-4">
              {filteredCommandes.map((commande) => {
                const total = commande.details?.reduce((sum, d) => sum + ((d.plat?.prix || 0) * (d.quantite_plat_commande || 0)), 0) || 0;
              
                return (
                <Card key={commande.idcommande} className="group relative shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border border-thai-orange/10 hover:border-thai-orange/30 hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header commande avec design premium */}
                        <div className="relative flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {/* Badge commande avec effet premium */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-thai-green to-thai-orange rounded-xl opacity-20 blur-sm" />
                              <div className="relative bg-gradient-to-br from-thai-green to-thai-green/80 text-white px-4 py-2 rounded-xl shadow-lg">
                                <div className="text-lg font-bold">#{commande.idcommande}</div>
                                <div className="text-xs opacity-90">Commande</div>
                              </div>
                            </div>
                            
                            <StatusBadge statut={commande.statut_commande} type="commande" />
                            
                            {/* Indicateurs visuels */}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Users className="w-3 h-3" />
                              <span>{commande.details?.length || 0} article{(commande.details?.length || 0) > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          
                          {/* Prix avec animation premium */}
                          <div className="text-right">
                            <div className="relative">
                              <div className="absolute inset-0 bg-thai-orange/20 rounded-lg blur-sm" />
                              <div className="relative bg-gradient-to-br from-thai-orange to-thai-orange/80 text-white px-4 py-2 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                                <div className="text-2xl font-bold">
                                  {total.toFixed(2)}€
                                </div>
                                <div className="text-xs opacity-90">
                                  Prix total
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Effet de fond animé */}
                          <div className="absolute inset-0 bg-gradient-to-r from-thai-orange/5 via-thai-green/5 to-thai-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>

                        {/* Détails commande */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-thai-orange" />
                            <div>
                              <div className="font-medium">Commandé le</div>
                              <div>
                                {commande.date_de_prise_de_commande 
                                  ? format(new Date(commande.date_de_prise_de_commande), 'dd/MM/yyyy à HH:mm', { locale: fr })
                                  : 'Date inconnue'
                                }
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-thai-orange" />
                            <div>
                              <div className="font-medium">Retrait souhaité</div>
                              <div>
                                {commande.date_et_heure_de_retrait_souhaitees 
                                  ? format(new Date(commande.date_et_heure_de_retrait_souhaitees), 'dd/MM/yyyy à HH:mm', { locale: fr })
                                  : 'Non spécifié'
                                }
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-thai-orange" />
                            <div>
                              <div className="font-medium">Type livraison</div>
                              <div>{commande.type_livraison || 'À emporter'}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Euro className="w-4 h-4 text-thai-orange" />
                            <div>
                              <div className="font-medium">Paiement</div>
                              <div>{commande.statut_paiement || 'En attente'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Articles commandés avec design premium */}
                        {commande.details && commande.details.length > 0 && (
                          <div className="space-y-3">
                            <div className="text-sm font-medium text-thai-green flex items-center gap-2">
                              <ChefHat className="w-4 h-4" />
                              Articles commandés ({commande.details.length})
                            </div>
                            <div className="grid gap-3">
                              {commande.details.map((detail, index) => {
                                const unitPrice = detail.plat?.prix || 0;
                                const quantity = detail.quantite_plat_commande || 0;
                                const totalPrice = unitPrice * quantity;
                                
                                return (
                                  <div 
                                    key={index} 
                                    className="group relative bg-white/80 backdrop-blur-sm rounded-xl border border-thai-orange/10 p-4 hover:shadow-lg hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5"
                                  >
                                    <div className="flex items-center gap-4">
                                      {/* Image du plat */}
                                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-thai-cream/20 flex-shrink-0">
                                        {detail.plat?.photo_du_plat ? (
                                          <img 
                                            src={detail.plat.photo_du_plat} 
                                            alt={detail.plat.plat || 'Plat'}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center">
                                            <ChefHat className="w-6 h-6 text-thai-orange/40" />
                                          </div>
                                        )}
                                        
                                        {/* Badge quantité avec effet premium */}
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-thai-orange to-thai-orange/80 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 transform transition-transform duration-300 group-hover:scale-110">
                                          {quantity}
                                        </div>
                                      </div>
                                      
                                      {/* Informations du plat */}
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-thai-green text-sm truncate group-hover:text-thai-orange transition-colors duration-300">
                                          {detail.plat?.plat || 'Plat inconnu'}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className="text-xs text-gray-500">
                                            {unitPrice.toFixed(2)}€ × {quantity}
                                          </span>
                                          {detail.plat?.description && (
                                            <span className="text-xs text-gray-400 truncate max-w-32" title={detail.plat.description}>
                                              {detail.plat.description}
                                            </span>
                                          )}
                                        </div>
                                        
                                        {/* Statut plat */}
                                        <div className="flex items-center gap-2 mt-2">
                                          {detail.plat?.est_epuise && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                                              <AlertTriangle className="w-3 h-3" />
                                              Épuisé
                                            </span>
                                          )}
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-thai-green/10 text-thai-green">
                                            Plat #{detail.plat?.idplats}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {/* Prix total avec animation */}
                                      <div className="text-right">
                                        <div className="text-lg font-bold text-thai-orange group-hover:scale-105 transition-transform duration-300">
                                          {totalPrice.toFixed(2)}€
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Total ligne
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Effet de survol premium */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-thai-orange/5 to-thai-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Résumé total avec effet premium */}
                            <div className="bg-gradient-to-r from-thai-green/5 to-thai-orange/5 rounded-xl p-4 border border-thai-orange/20">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-thai-green">
                                  <TrendingUp className="w-5 h-5" />
                                  <span className="font-semibold">Total commande</span>
                                </div>
                                <div className="text-2xl font-bold text-thai-orange">
                                  {total.toFixed(2)}€
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 text-right">
                                {commande.details.length} article{commande.details.length > 1 ? 's' : ''} • Prix TTC
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Demande spéciale */}
                        {commande.demande_special_pour_la_commande && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="text-sm font-medium text-yellow-800 mb-1">Demande spéciale:</div>
                            <div className="text-sm text-yellow-700 italic">
                              {commande.demande_special_pour_la_commande}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions avec design premium */}
                      <div className="flex flex-col gap-3 ml-6">
                        {/* Sélecteur de statut premium */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-thai-green/10 to-thai-orange/10 rounded-lg blur-sm" />
                          <Select
                            value={commande.statut_commande || ''}
                            onValueChange={(value) => handleStatusUpdate(commande.idcommande, value)}
                          >
                            <SelectTrigger className="relative w-52 bg-white/90 backdrop-blur-sm border border-thai-orange/30 hover:border-thai-orange transition-colors duration-300 shadow-lg">
                              <SelectValue placeholder="Changer statut" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-sm">
                              <SelectItem value="En attente de confirmation">🕐 En attente</SelectItem>
                              <SelectItem value="Confirmée">✅ Confirmée</SelectItem>
                              <SelectItem value="En préparation">👨‍🍳 En préparation</SelectItem>
                              <SelectItem value="Prête à récupérer">📦 Prête</SelectItem>
                              <SelectItem value="Récupérée">🎉 Récupérée</SelectItem>
                              <SelectItem value="Annulée">❌ Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Boutons d'actions avec animations premium */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicateOrder(commande)}
                            className="group relative px-3 py-2 bg-white/80 backdrop-blur-sm border border-thai-green/30 hover:border-thai-green hover:bg-thai-green hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            title="Dupliquer commande"
                          >
                            <Copy className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="ml-1 text-xs">Dupliquer</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOrder(commande.idcommande)}
                            className="group relative px-3 py-2 bg-white/80 backdrop-blur-sm border border-red-300 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            title="Supprimer commande"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="ml-1 text-xs">Supprimer</span>
                          </Button>
                        </div>
                        
                        {/* Bouton historique/détails */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group relative px-3 py-2 bg-thai-orange/5 hover:bg-thai-orange/10 border border-thai-orange/20 hover:border-thai-orange/40 transition-all duration-300 hover:scale-105"
                          title="Voir détails complets"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span className="ml-1 text-xs">Détails</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}</div>
          ) : (
            <Card className="shadow-lg bg-white/95 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                    ? 'Essayez de modifier vos filtres de recherche.' 
                    : 'Ce client n\'a pas encore passé de commande.'
                  }
                </p>
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? (
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateFilter('all');
                    }}
                    className="bg-thai-orange hover:bg-thai-orange/90 text-white"
                  >
                    Réinitialiser les filtres
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}