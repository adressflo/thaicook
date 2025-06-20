import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useCommandes, 
  useUpdateCommande, 
  useCommandesStats,
  useCommandesRealtime,
  type CommandeUpdate 
} from '@/hooks/useSupabaseData';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Save,
  RefreshCw,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminCommandes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Hooks pour les données
  const { data: commandes, isLoading, refetch } = useCommandes();
  const { data: stats } = useCommandesStats();
  const updateCommandeMutation = useUpdateCommande();
  
  // Activer la mise à jour en temps réel
  useRealtimeNotifications();
  
  // État local pour les filtres
  const [filtreStatut, setFiltreStatut] = useState<string>('tous');
  const [filtrePaiement, setFiltrePaiement] = useState<string>('tous');
  const [recherche, setRecherche] = useState('');
  const [selectedCommande, setSelectedCommande] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // État pour l'édition rapide
  const [quickEditData, setQuickEditData] = useState<CommandeUpdate>({});

  // Refresh automatique toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Filtrage des commandes
  const commandesFiltrees = commandes?.filter(commande => {
    const matchStatut = filtreStatut === 'tous' || commande.statut_commande === filtreStatut;
    const matchPaiement = filtrePaiement === 'tous' || commande.statut_paiement === filtrePaiement;
    const matchRecherche = !recherche || 
      commande.idcommande?.toString().includes(recherche) ||
      commande.client_r?.toLowerCase().includes(recherche.toLowerCase()) ||
      commande.client?.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      commande.client?.prenom?.toLowerCase().includes(recherche.toLowerCase());
    return matchStatut && matchPaiement && matchRecherche;
  }) || [];

  const statutCommandeOptions = [
    { value: 'tous', label: 'Tous les statuts', icon: BarChart3, color: 'text-gray-500' },
    { value: 'En attente de confirmation', label: 'En attente de confirmation', icon: Clock, color: 'text-yellow-500' },
    { value: 'Confirmée', label: 'Confirmée', icon: CheckCircle, color: 'text-blue-500' },
    { value: 'En préparation', label: 'En préparation', icon: RefreshCw, color: 'text-orange-500' },
    { value: 'Prête à récupérer', label: 'Prête à récupérer', icon: AlertCircle, color: 'text-purple-500' },
    { value: 'Récupérée', label: 'Récupérée', icon: CheckCircle, color: 'text-green-500' },
    { value: 'Annulée', label: 'Annulée', icon: XCircle, color: 'text-red-500' }
  ];

  const statutPaiementOptions = [
    { value: 'tous', label: 'Tous les paiements' },
    { value: 'En attente sur place', label: 'En attente sur place' },
    { value: 'Payé sur place', label: 'Payé sur place' },
    { value: 'Payé en ligne', label: 'Payé en ligne' },
    { value: 'Non payé', label: 'Non payé' },
    { value: 'Payée', label: 'Payée' }
  ];

  const getBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'En attente de confirmation':
        return 'destructive';
      case 'Confirmée':
        return 'default';
      case 'En préparation':
        return 'secondary';
      case 'Prête à récupérer':
        return 'default';
      case 'Récupérée':
        return 'outline';
      case 'Annulée':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPaiementVariant = (statut: string) => {
    if (statut?.includes('Payé') || statut === 'Payée') return 'default';
    if (statut?.includes('En attente')) return 'secondary';
    return 'destructive';
  };

  const handleQuickUpdate = async (commande: any, updates: CommandeUpdate) => {
    try {
      await updateCommandeMutation.mutateAsync({
        idcommande: commande.idcommande,
        updates
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur mise à jour rapide:', error);
    }
  };

  const calculateTotal = (commande: any) => {
    return commande.details?.reduce((sum: number, detail: any) => 
      sum + (parseFloat(detail.plat?.prix || 0) * detail.quantite_plat_commande), 0
    ) || 0;
  };

  const openEditDialog = (commande: any) => {
    setSelectedCommande(commande);
    setQuickEditData({
      statut_commande: commande.statut_commande,
      statut_paiement: commande.statut_paiement,
      notes_internes: commande.notes_internes || ''
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-thai-orange mx-auto mb-4" />
            <p className="text-thai-green">Chargement des commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header avec statistiques */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-thai-green">Gestion des Commandes</h1>
              <p className="text-thai-green/70">
                {commandesFiltrees.length} commande(s) • 
                {stats?.commandesAujourdhui || 0} aujourd'hui
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-thai-orange/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-thai-orange" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-thai-green/70">Total Commandes</p>
                    <p className="text-2xl font-bold text-thai-green">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-thai-orange/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-thai-green/70">En Attente</p>
                    <p className="text-2xl font-bold text-thai-green">
                      {stats.parStatut['En attente de confirmation'] || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-thai-orange/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <RefreshCw className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-thai-green/70">En Préparation</p>
                    <p className="text-2xl font-bold text-thai-green">
                      {stats.parStatut['En préparation'] || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-thai-orange/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-thai-green/70">Aujourd'hui</p>
                    <p className="text-2xl font-bold text-thai-green">{stats.commandesAujourdhui}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtres */}
        <Card className="border-thai-orange/20 mb-6">
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-thai-green">Statut Commande</Label>
                <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statutCommandeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <option.icon className={`w-4 h-4 mr-2 ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-thai-green">Statut Paiement</Label>
                <Select value={filtrePaiement} onValueChange={setFiltrePaiement}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statutPaiementOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-thai-green">Recherche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-thai-green/50 w-4 h-4" />
                  <Input
                    placeholder="N° commande, client..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des commandes */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">
              Liste des Commandes ({commandesFiltrees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {commandesFiltrees.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-thai-green">N° Commande</TableHead>
                      <TableHead className="text-thai-green">Client</TableHead>
                      <TableHead className="text-thai-green">Date Retrait</TableHead>
                      <TableHead className="text-thai-green">Total</TableHead>
                      <TableHead className="text-thai-green">Statut</TableHead>
                      <TableHead className="text-thai-green">Paiement</TableHead>
                      <TableHead className="text-thai-green">Type</TableHead>
                      <TableHead className="text-thai-green">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commandesFiltrees.map((commande) => (
                      <TableRow key={commande.idcommande} className="hover:bg-thai-cream/30">
                        <TableCell className="font-medium text-thai-green">
                          #{commande.idcommande}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-thai-green">
                              {commande.client?.nom || 'N/A'} {commande.client?.prenom || ''}
                            </p>
                            <p className="text-sm text-thai-green/70">
                              {commande.client?.email || commande.client_r}
                            </p>
                            {commande.client?.numero_de_telephone && (
                              <p className="text-sm text-thai-green/70 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {commande.client.numero_de_telephone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-thai-green flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {commande.date_et_heure_de_retrait_souhaitees ? 
                                new Date(commande.date_et_heure_de_retrait_souhaitees).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                }) : 'N/A'
                              }
                            </p>
                            <p className="text-sm text-thai-green/70">
                              {commande.date_et_heure_de_retrait_souhaitees ? 
                                new Date(commande.date_et_heure_de_retrait_souhaitees).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : ''
                              }
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-thai-orange">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {calculateTotal(commande).toFixed(2)} €
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(commande.statut_commande || '')}>
                            {commande.statut_commande}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaiementVariant(commande.statut_paiement || '')}>
                            <CreditCard className="w-3 h-3 mr-1" />
                            {commande.statut_paiement}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-thai-green">
                            {commande.type_livraison === 'Livraison' ? (
                              <MapPin className="w-4 h-4 mr-1" />
                            ) : (
                              <Package className="w-4 h-4 mr-1" />
                            )}
                            {commande.type_livraison || 'À emporter'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/commandes/${commande.idcommande}`)}
                              className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(commande)}
                              className="border-thai-green text-thai-green hover:bg-thai-green/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-thai-green/30 mx-auto mb-4" />
                <p className="text-thai-green/70 text-lg">Aucune commande trouvée</p>
                <p className="text-thai-green/50 text-sm">Modifiez les filtres pour afficher plus de résultats</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog d'édition rapide */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-thai-green">
                Modifier la commande #{selectedCommande?.idcommande}
              </DialogTitle>
              <DialogDescription>
                Modifiez rapidement les statuts et les notes de cette commande
              </DialogDescription>
            </DialogHeader>
            
            {selectedCommande && (
              <div className="space-y-6">
                {/* Informations client */}
                <Card className="border-thai-orange/20">
                  <CardHeader>
                    <CardTitle className="text-thai-green text-lg">Informations Client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-thai-green">
                          {selectedCommande.client?.nom} {selectedCommande.client?.prenom}
                        </p>
                        <p className="text-sm text-thai-green/70 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {selectedCommande.client?.email}
                        </p>
                        {selectedCommande.client?.numero_de_telephone && (
                          <p className="text-sm text-thai-green/70 flex items-center mt-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {selectedCommande.client.numero_de_telephone}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-thai-green/70">Total commande</p>
                        <p className="text-xl font-bold text-thai-orange">
                          {calculateTotal(selectedCommande).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statuts */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-thai-green">Statut de la commande</Label>
                    <Select 
                      value={quickEditData.statut_commande} 
                      onValueChange={(value) => setQuickEditData(prev => ({ ...prev, statut_commande: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statutCommandeOptions.slice(1).map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <option.icon className={`w-4 h-4 mr-2 ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-thai-green">Statut de paiement</Label>
                    <Select 
                      value={quickEditData.statut_paiement} 
                      onValueChange={(value) => setQuickEditData(prev => ({ ...prev, statut_paiement: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statutPaiementOptions.slice(1).map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes internes */}
                <div className="space-y-2">
                  <Label className="text-thai-green">Notes internes</Label>
                  <Textarea
                    value={quickEditData.notes_internes || ''}
                    onChange={(e) => setQuickEditData(prev => ({ ...prev, notes_internes: e.target.value }))}
                    placeholder="Ajouter des notes internes..."
                    rows={3}
                  />
                </div>

                {/* Détails de la commande */}
                <Card className="border-thai-orange/20">
                  <CardHeader>
                    <CardTitle className="text-thai-green text-lg">Détails de la commande</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCommande.details && selectedCommande.details.length > 0 ? (
                      <div className="space-y-2">
                        {selectedCommande.details.map((detail: any) => (
                          <div key={detail.iddetails} className="flex justify-between items-center p-3 bg-thai-cream/30 rounded-lg">
                            <div>
                              <p className="font-medium text-thai-green">{detail.plat?.plat}</p>
                              <p className="text-sm text-thai-green/70">Quantité: {detail.quantite_plat_commande}</p>
                            </div>
                            <p className="font-bold text-thai-orange">
                              {((parseFloat(detail.plat?.prix || 0)) * detail.quantite_plat_commande).toFixed(2)} €
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-thai-green/70 text-center py-4">Aucun détail disponible</p>
                    )}
                  </CardContent>
                </Card>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => handleQuickUpdate(selectedCommande, quickEditData)}
                    disabled={updateCommandeMutation.isPending}
                    className="bg-thai-orange hover:bg-thai-orange/90"
                  >
                    {updateCommandeMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCommandes;