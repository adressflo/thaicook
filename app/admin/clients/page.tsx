'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Eye, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  ShoppingCart,
  Filter,
  Download,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { useClients, useCommandes } from '@/hooks/useSupabaseData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ClientUI } from '@/types/app';

export default function AdminClients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedClient, setSelectedClient] = useState<ClientUI | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const { data: clients, refetch } = useClients();
  const { data: commandes } = useCommandes();

  // Filtrage et recherche des clients
  const filteredClients = clients?.filter(client => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      client.nom?.toLowerCase().includes(term) ||
      client.prenom?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.numero_de_telephone?.includes(term)
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`);
      case 'email':
        return (a.email || '').localeCompare(b.email || '');
      case 'recent':
      default:
        // Utiliser idclient comme critère de tri pour les clients récents
        return (b.idclient || 0) - (a.idclient || 0);
    }
  }) || [];

  // Calculer les statistiques pour chaque client
  const getClientStats = (clientId: number) => {
    const clientCommandes = commandes?.filter(c => c.client_r_id === clientId) || [];
    const totalCommandes = clientCommandes.length;
    const totalSpent = clientCommandes.reduce((sum, commande) => {
      if (!commande.details) return sum;
      return sum + commande.details.reduce((detailSum, detail) => {
        return detailSum + ((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0));
      }, 0);
    }, 0);
    
    const derniereCommande = clientCommandes.length > 0 
      ? new Date(Math.max(...clientCommandes.map(c => new Date(c.date_de_prise_de_commande || 0).getTime())))
      : null;

    return {
      totalCommandes,
      totalSpent,
      derniereCommande
    };
  };

  const stats = {
    total: clients?.length || 0,
    nouveaux: clients?.filter(c => {
      // Utiliser idclient comme proxy pour déterminer les nouveaux clients (IDs plus élevés = plus récents)
      const totalClients = clients.length;
      const recentThreshold = Math.max(1, totalClients - Math.floor(totalClients * 0.1)); // 10% les plus récents
      return (c.idclient || 0) >= recentThreshold;
    }).length || 0,
    actifs: clients?.filter(c => {
      const stats = getClientStats(c.idclient);
      return stats.totalCommandes > 0;
    }).length || 0
  };

  const openClientDetails = (client: ClientUI) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  const closeClientDetails = () => {
    setSelectedClient(null);
    setShowDetails(false);
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Clients</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.nouveaux}</div>
            <div className="text-sm text-green-600">Nouveaux (7j)</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{stats.actifs}</div>
            <div className="text-sm text-purple-600">Clients Actifs</div>
          </CardContent>
        </Card>
      </div>

      {/* Header et filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-thai-green flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestion des Clients ({filteredClients.length})
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
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher client, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="name">Nom A-Z</SelectItem>
                <SelectItem value="email">Email A-Z</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSortBy('recent');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Liste des clients */}
          <div className="space-y-4">
            {filteredClients.map((client) => {
              const clientStats = getClientStats(client.idclient);
              const isNewClient = clients ? (client.idclient || 0) >= Math.max(1, clients.length - Math.floor(clients.length * 0.1)) : false;
              
              return (
                <Card key={client.idclient} className="border-l-4 border-l-thai-orange hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-thai-green">
                              {client.prenom} {client.nom}
                            </h3>
                            {isNewClient && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                <UserPlus className="w-3 h-3 mr-1" />
                                Nouveau
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Informations de contact */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {client.email || 'Email non renseigné'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {client.numero_de_telephone || 'Téléphone non renseigné'}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {client.adresse_numero_et_rue || 'Adresse non renseignée'}
                          </div>
                        </div>
                        
                        {/* Statistiques client */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <ShoppingCart className="w-4 h-4 text-thai-orange" />
                            <span className="font-medium">{clientStats.totalCommandes}</span>
                            <span className="text-gray-600">commandes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-thai-gold">{clientStats.totalSpent.toFixed(2)}€</span>
                            <span className="text-gray-600">total dépensé</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {clientStats.derniereCommande ? (
                              <span className="text-gray-600">
                                Dernière: {format(clientStats.derniereCommande, 'dd/MM/yyyy', { locale: fr })}
                              </span>
                            ) : (
                              <span className="text-gray-400">Aucune commande</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Date d'inscription */}
                        <div className="text-xs text-gray-500">
                          Client #{client.idclient || 'Inconnu'}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openClientDetails(client)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        
                        <Badge 
                          variant={clientStats.totalCommandes > 0 ? "default" : "outline"}
                          className={clientStats.totalCommandes > 0 ? "bg-green-100 text-green-800" : ""}
                        >
                          {clientStats.totalCommandes > 0 ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Aucun client trouvé
                </h3>
                <p className="text-gray-400">
                  {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Les nouveaux clients apparaîtront ici'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal détails client */}
      {showDetails && selectedClient && (
        <ClientDetailsModal 
          client={selectedClient}
          clientStats={getClientStats(selectedClient.idclient)}
          commandes={commandes?.filter(c => c.client_r_id === selectedClient.idclient) || []}
          onClose={closeClientDetails}
        />
      )}
    </div>
  );
}

// Modal de détails client
const ClientDetailsModal = ({ 
  client, 
  clientStats, 
  commandes, 
  onClose 
}: {
  client: ClientUI;
  clientStats: { totalCommandes: number; totalSpent: number; derniereCommande: Date | null };
  commandes: any[];
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-thai-green">
              Détails Client - {client.prenom} {client.nom}
            </h2>
            <Button variant="ghost" onClick={onClose}>
              <span className="sr-only">Fermer</span>
              ✕
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <Users className="w-5 h-5" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Nom complet</p>
                <p className="text-gray-600">{client.prenom} {client.nom}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{client.email || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-gray-600">{client.numero_de_telephone || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="font-medium">Date d'inscription</p>
                <p className="text-gray-600">
                  Client #{client.idclient || 'Inconnu'}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium">Adresse</p>
                <p className="text-gray-600">{client.adresse_numero_et_rue || 'Non renseignée'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Statistiques de Commandes
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{clientStats.totalCommandes}</div>
                <div className="text-sm text-blue-600">Commandes Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{clientStats.totalSpent.toFixed(2)}€</div>
                <div className="text-sm text-green-600">Total Dépensé</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-700">
                  {clientStats.derniereCommande 
                    ? format(clientStats.derniereCommande, 'dd/MM/yyyy', { locale: fr })
                    : 'Jamais'
                  }
                </div>
                <div className="text-sm text-purple-600">Dernière Commande</div>
              </div>
            </CardContent>
          </Card>

          {/* Historique des commandes */}
          {commandes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-thai-green">Historique des Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {commandes.slice(0, 10).map((commande, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Commande #{commande.idcommande}</p>
                        <p className="text-sm text-gray-600">
                          {commande.date_de_prise_de_commande ? format(new Date(commande.date_de_prise_de_commande), 'dd/MM/yyyy à HH:mm', { locale: fr }) : 'Date inconnue'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{commande.statut_commande}</Badge>
                        <p className="text-sm font-medium text-thai-orange mt-1">
                          {commande.details?.reduce((sum: number, detail: any) => {
                            return sum + ((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0));
                          }, 0).toFixed(2) || '0.00'}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};