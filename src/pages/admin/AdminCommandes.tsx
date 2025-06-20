import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingBasket, 
  Clock, 
  CheckCircle, 
  Eye, 
  Edit3,
  Filter,
  Search,
  Calendar,
  Euro,
  User,
  Phone,
  MapPin,
  AlertTriangle,
  Package,
  Download,
  RefreshCw
} from 'lucide-react';
import { useCommandes, useUpdateCommande } from '@/hooks/useSupabaseData';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminCommandes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedCommande, setSelectedCommande] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: commandes, refetch } = useCommandes();
  const updateCommandeMutation = useUpdateCommande();
  const { toast } = useToast();

  // Filtres et recherche
  const filteredCommandes = commandes?.filter(commande => {
    const matchesSearch = 
      commande.idcommande.toString().includes(searchTerm) ||
      (commande.client_db?.nom?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (commande.client_db?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || commande.statut === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today' && commande.date_et_heure_de_retrait_souhaitees) {
      matchesDate = isToday(new Date(commande.date_et_heure_de_retrait_souhaitees));
    } else if (dateFilter === 'tomorrow' && commande.date_et_heure_de_retrait_souhaitees) {
      matchesDate = isTomorrow(new Date(commande.date_et_heure_de_retrait_souhaitees));
    } else if (dateFilter === 'past' && commande.date_et_heure_de_retrait_souhaitees) {
      matchesDate = isPast(new Date(commande.date_et_heure_de_retrait_souhaitees));
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  // Statistiques rapides
  const stats = {
    total: commandes?.length || 0,
    enAttente: commandes?.filter(c => c.statut === 'en_attente').length || 0,
    enPreparation: commandes?.filter(c => c.statut === 'en_preparation').length || 0,
    terminees: commandes?.filter(c => c.statut === 'terminee').length || 0,
    aujourd_hui: commandes?.filter(c => 
      c.date_et_heure_de_retrait_souhaitees && 
      isToday(new Date(c.date_et_heure_de_retrait_souhaitees))
    ).length || 0
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'terminee': return 'bg-green-100 text-green-800 border-green-200';
      case 'en_preparation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'en_attente': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'annulee': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'terminee': return <CheckCircle className="w-4 h-4" />;
      case 'en_preparation': return <Package className="w-4 h-4" />;
      case 'en_attente': return <Clock className="w-4 h-4" />;
      case 'annulee': return <AlertTriangle className="w-4 h-4" />;
      default: return <ShoppingBasket className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (commandeId: number, newStatus: string) => {
    try {
      await updateCommandeMutation.mutateAsync({
        id: commandeId,
        updates: { statut: newStatus }
      });
      
      toast({
        title: "Succès",
        description: `Statut mis à jour vers "${newStatus}"`
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const openDetails = (commande: any) => {
    setSelectedCommande(commande);
    setIsDetailsOpen(true);
  };  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
            <div className="text-sm text-blue-600">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">{stats.enAttente}</div>
            <div className="text-sm text-orange-600">En Attente</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">{stats.enPreparation}</div>
            <div className="text-sm text-yellow-600">En Préparation</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.terminees}</div>
            <div className="text-sm text-green-600">Terminées</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{stats.aujourd_hui}</div>
            <div className="text-sm text-purple-600">Aujourd'hui</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-thai-green flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5" />
              Gestion des Commandes ({filteredCommandes.length})
            </CardTitle>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche et filtres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher commande, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En Attente</SelectItem>
                <SelectItem value="en_preparation">En Préparation</SelectItem>
                <SelectItem value="terminee">Terminée</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="tomorrow">Demain</SelectItem>
                <SelectItem value="past">Passées</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>          {/* Onglets par statut */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
              <TabsTrigger value="en_attente">Attente ({stats.enAttente})</TabsTrigger>
              <TabsTrigger value="en_preparation">Préparation ({stats.enPreparation})</TabsTrigger>
              <TabsTrigger value="terminee">Terminées ({stats.terminees})</TabsTrigger>
              <TabsTrigger value="today">Aujourd'hui ({stats.aujourd_hui})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-6">
              {filteredCommandes.map((commande) => (
                <CommandeCard 
                  key={commande.idcommande} 
                  commande={commande}
                  onStatusChange={handleStatusChange}
                  onOpenDetails={openDetails}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </TabsContent>
            
            {/* Autres onglets avec filtres automatiques */}
            {['en_attente', 'en_preparation', 'terminee'].map(status => (
              <TabsContent key={status} value={status} className="space-y-4 mt-6">
                {commandes?.filter(c => c.statut === status).map((commande) => (
                  <CommandeCard 
                    key={commande.idcommande} 
                    commande={commande}
                    onStatusChange={handleStatusChange}
                    onOpenDetails={openDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </TabsContent>
            ))}
            
            <TabsContent value="today" className="space-y-4 mt-6">
              {commandes?.filter(c => 
                c.date_et_heure_de_retrait_souhaitees && 
                isToday(new Date(c.date_et_heure_de_retrait_souhaitees))
              ).map((commande) => (
                <CommandeCard 
                  key={commande.idcommande} 
                  commande={commande}
                  onStatusChange={handleStatusChange}
                  onOpenDetails={openDetails}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
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
    </div>
  );
};// Composant Card pour chaque commande
const CommandeCard = ({ 
  commande, 
  onStatusChange, 
  onOpenDetails, 
  getStatusColor, 
  getStatusIcon 
}: any) => {
  const isUrgent = commande.date_et_heure_de_retrait_souhaitees && 
    new Date(commande.date_et_heure_de_retrait_souhaitees) < new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h

  return (
    <Card className={`border-l-4 ${isUrgent ? 'border-red-500 bg-red-50' : 'border-thai-orange'} hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-thai-green">
                Commande #{commande.idcommande}
              </h3>
              
              <Badge className={`${getStatusColor(commande.statut)} flex items-center gap-1`}>
                {getStatusIcon(commande.statut)}
                {commande.statut}
              </Badge>
              
              {isUrgent && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  URGENT
                </Badge>
              )}
            </div>
            
            {/* Informations client */}
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {commande.client_db?.prenom} {commande.client_db?.nom}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {commande.client_db?.telephone || 'Non renseigné'}
              </p>
            </div>
            
            {/* Date et heure */}
            {commande.date_et_heure_de_retrait_souhaitees && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Retrait: {format(new Date(commande.date_et_heure_de_retrait_souhaitees), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </p>
            )}
            
            {/* Prix */}
            <p className="text-lg font-bold text-thai-orange flex items-center gap-1">
              <Euro className="w-4 h-4" />
              {commande.prix_total || 0}€
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Select
              value={commande.statut}
              onValueChange={(value) => onStatusChange(commande.idcommande, value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en_attente">En Attente</SelectItem>
                <SelectItem value="en_preparation">En Préparation</SelectItem>
                <SelectItem value="terminee">Terminée</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onOpenDetails(commande)}
              className="w-40"
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir Détails
            </Button>
          </div>
        </div>
        
        {/* Aperçu des plats */}
        {commande.contient_liaison && commande.contient_liaison.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Plats commandés :</h4>
            <div className="flex flex-wrap gap-2">
              {commande.contient_liaison.slice(0, 3).map((item: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item.quantite}x {item.plats?.nom_plat}
                </Badge>
              ))}
              {commande.contient_liaison.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{commande.contient_liaison.length - 3} autres
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};// Modal Détails Commande
const CommandeDetailsModal = ({ commande, onClose, onStatusChange }: any) => {
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
                <p className="font-medium">Nom complet</p>
                <p className="text-gray-600">{commande.client_db?.prenom} {commande.client_db?.nom}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{commande.client_db?.email}</p>
              </div>
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-gray-600">{commande.client_db?.telephone || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-gray-600">{commande.client_db?.adresse || 'Non renseignée'}</p>
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
                    value={commande.statut}
                    onValueChange={(value) => onStatusChange(commande.idcommande, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_attente">En Attente</SelectItem>
                      <SelectItem value="en_preparation">En Préparation</SelectItem>
                      <SelectItem value="terminee">Terminée</SelectItem>
                      <SelectItem value="annulee">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="font-medium">Date de retrait</p>
                  <p className="text-gray-600">
                    {commande.date_et_heure_de_retrait_souhaitees && 
                      format(new Date(commande.date_et_heure_de_retrait_souhaitees), 'dd/MM/yyyy à HH:mm', { locale: fr })
                    }
                  </p>
                </div>
                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-2xl font-bold text-thai-orange">{commande.prix_total || 0}€</p>
                </div>
              </div>
              
              {/* Liste des plats */}
              {commande.contient_liaison && commande.contient_liaison.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Plats commandés :</h4>
                  <div className="space-y-2">
                    {commande.contient_liaison.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.plats?.url_photo && (
                            <img 
                              src={item.plats.url_photo} 
                              alt={item.plats?.nom_plat}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.plats?.nom_plat}</p>
                            <p className="text-sm text-gray-600">Quantité: {item.quantite}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{(item.plats?.prix || 0) * item.quantite}€</p>
                          <p className="text-sm text-gray-600">{item.plats?.prix}€ × {item.quantite}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Instructions spéciales */}
              {commande.instructions && (
                <div>
                  <p className="font-medium">Instructions spéciales</p>
                  <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg">{commande.instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button className="bg-thai-orange hover:bg-thai-orange/90">
            <Edit3 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminCommandes;