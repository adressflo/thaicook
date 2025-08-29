'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  ShoppingCart,
  Star,
  X,
  Euro,
  ChevronRight
} from 'lucide-react';
import { useClients, useCommandes } from '@/hooks/useSupabaseData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ClientUI, CommandeUI } from '@/types/app';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/historique/StatusBadge';

// --- Sous-composant : Fiche Client Détaillée ---
const FicheClient = ({ client, commandes, onBack }: { client: ClientUI, commandes: CommandeUI[], onBack: () => void }) => {
  const clientStats = useMemo(() => {
    const totalCommandes = commandes.length;
    const totalSpent = commandes.reduce((sum, commande) => {
      const orderTotal = commande.details?.reduce((detailSum, detail) => {
        return detailSum + ((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0));
      }, 0) || 0;
      return sum + orderTotal;
    }, 0);
    const derniereCommande = commandes.length > 0 
      ? new Date(Math.max(...commandes.map(c => new Date(c.date_de_prise_de_commande || 0).getTime())))
      : null;
    return { totalCommandes, totalSpent, derniereCommande };
  }, [commandes]);

  return (
    <Card className="shadow-xl border-thai-orange/20 animate-in fade-in-0">
      <CardHeader className="bg-gradient-to-r from-thai-cream/30 to-white border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold text-2xl">
              {client.prenom?.charAt(0)}{client.nom?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-thai-green">{client.prenom} {client.nom}</h2>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          <Button onClick={onBack} variant="outline">Retour à la recherche</Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Contact & Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-thai-orange"/> {client.email || 'Non fourni'}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-thai-orange"/> {client.numero_de_telephone || 'Non fourni'}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-thai-orange"/> {client.adresse_numero_et_rue || 'Non fournie'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Préférences</CardTitle></CardHeader>
            <CardContent>
              {client.preference_client ? 
                <p className="text-sm italic">{client.preference_client}</p> : 
                <p className="text-sm text-gray-500">Aucune préférence enregistrée.</p>
              }
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-700">{clientStats.totalCommandes}</div>
              <div className="text-sm text-blue-600 mt-1">Commandes</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-700">{clientStats.totalSpent.toFixed(2)}€</div>
              <div className="text-sm text-green-600 mt-1">Total Dépensé</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-base font-bold text-purple-700">
                {clientStats.derniereCommande ? format(clientStats.derniereCommande, 'dd MMM yyyy', { locale: fr }) : 'Jamais'}
              </div>
              <div className="text-sm text-purple-600 mt-1">Dernière Commande</div>
            </div>
        </div>

        {/* Historique */}
        <Card>
          <CardHeader><CardTitle>Historique des Commandes</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commandes.map(c => (
                    <TableRow key={c.idcommande}>
                      <TableCell>#{c.idcommande}</TableCell>
                      <TableCell>{format(new Date(c.date_de_prise_de_commande || 0), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell>{(c.details?.reduce((sum, d) => sum + ((d.plat?.prix || 0) * (d.quantite_plat_commande || 0)), 0) || 0).toFixed(2)}€</TableCell>
                      <TableCell><StatusBadge statut={c.statut_commande} type="commande" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

// --- Composant Principal ---
export default function AdminClients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientUI | null>(null);
  
  const { data: clients } = useClients();
  const { data: commandes } = useCommandes();

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchTerm) return []; // Ne rien afficher si la recherche est vide
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.nom?.toLowerCase().includes(term) ||
      client.prenom?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  const selectClient = (client: ClientUI) => {
    setSelectedClient(client);
  };

  if (selectedClient) {
    return (
      <FicheClient 
        client={selectedClient} 
        commandes={commandes?.filter(c => c.client_r_id === selectedClient.idclient) || []}
        onBack={() => setSelectedClient(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-thai-green flex items-center gap-2">
            <Search className="w-5 h-5" />
            Rechercher une Fiche Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Taper le nom, prénom ou email du client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {searchTerm && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-600">Résultats de la recherche ({filteredClients.length})</h3>
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <Card 
                key={client.idclient} 
                className="hover:bg-thai-cream/50 cursor-pointer transition-colors"
                onClick={() => selectClient(client)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-thai-cream text-thai-orange font-bold">
                      {client.prenom?.charAt(0)}{client.nom?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-thai-green">{client.prenom} {client.nom}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Aucun client ne correspond à votre recherche.</p>
          )}
        </div>
      )}

      {!searchTerm && (
        <div className="text-center py-16 text-gray-500">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium">Commencez par rechercher un client</h2>
          <p>Utilisez la barre de recherche ci-dessus pour trouver une fiche client.</p>
        </div>
      )}
    </div>
  );
}