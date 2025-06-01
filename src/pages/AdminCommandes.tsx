
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCommandes } from '@/hooks/useAirtable';
import { ArrowLeft, Search, Filter, Eye } from 'lucide-react';

const AdminCommandes = () => {
  const navigate = useNavigate();
  const { commandes, isLoading } = useCommandes();
  const [filtreStatut, setFiltreStatut] = useState<string>('tous');
  const [recherche, setRecherche] = useState('');

  // Filtrage des commandes
  const commandesFiltrees = commandes?.filter(commande => {
    const matchStatut = filtreStatut === 'tous' || commande.statutCommande === filtreStatut;
    const matchRecherche = !recherche || 
      commande.nCommande?.toLowerCase().includes(recherche.toLowerCase()) ||
      commande.clientR?.toLowerCase().includes(recherche.toLowerCase());
    return matchStatut && matchRecherche;
  }) || [];

  const statutOptions = [
    { value: 'tous', label: 'Tous les statuts' },
    { value: 'En attente de confirmation', label: 'En attente de confirmation' },
    { value: 'Confirmée', label: 'Confirmée' },
    { value: 'En préparation', label: 'En préparation' },
    { value: 'Prête à récupérer', label: 'Prête à récupérer' },
    { value: 'Récupérée', label: 'Récupérée' },
    { value: 'Annulée', label: 'Annulée' }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-thai-green">Chargement des commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
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
              <p className="text-thai-green/70">{commandesFiltrees.length} commande(s) trouvée(s)</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <Card className="border-thai-orange/20 mb-6">
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-thai-green">Statut</label>
                <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statutOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-thai-green">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-thai-green/50 w-4 h-4" />
                  <Input
                    placeholder="N° commande ou client..."
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
            <CardTitle className="text-thai-green">Liste des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            {commandesFiltrees.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-thai-green">N° Commande</TableHead>
                    <TableHead className="text-thai-green">Client</TableHead>
                    <TableHead className="text-thai-green">Date Retrait</TableHead>
                    <TableHead className="text-thai-green">Total</TableHead>
                    <TableHead className="text-thai-green">Statut</TableHead>
                    <TableHead className="text-thai-green">Paiement</TableHead>
                    <TableHead className="text-thai-green">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commandesFiltrees.map((commande) => (
                    <TableRow key={commande.id}>
                      <TableCell className="font-medium text-thai-green">
                        {commande.nCommande}
                      </TableCell>
                      <TableCell className="text-thai-green">
                        {commande.clientR || 'N/A'}
                      </TableCell>
                      <TableCell className="text-thai-green">
                        {commande.dateHeureRetraitSouhaitees ? 
                          new Date(commande.dateHeureRetraitSouhaitees).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'
                        }
                      </TableCell>
                      <TableCell className="font-medium text-thai-orange">
                        {commande.totalCommandeVu || '0,00 €'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(commande.statutCommande || '')}>
                          {commande.statutCommande}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={commande.statutPaiement === 'Payé sur place' ? 'default' : 'secondary'}>
                          {commande.statutPaiement}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/commandes/${commande.id}`)}
                          className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-thai-green/70">Aucune commande trouvée</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCommandes;
