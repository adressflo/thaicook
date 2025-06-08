
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCommandes } from '@/hooks/useAirtable';
import { ArrowLeft, Save, User, Clock, CreditCard, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminCommandeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: commandes, isLoading } = useCommandes();
  
  const commande = commandes?.find(c => c.id === id);
  
  const [statutCommande, setStatutCommande] = useState(commande?.['Statut Commande'] || '');
  const [statutPaiement, setStatutPaiement] = useState(commande?.['Statut Paiement'] || ''); // Supposant que 'Statut Paiement' est le nom du champ
  const [notesInternes, setNotesInternes] = useState(commande?.['Notes Internes'] || ''); // Supposant que 'Notes Internes' est le nom du champ

  const statutCommandeOptions = [
    'En attente de confirmation',
    'Confirmée',
    'En préparation',
    'Prête à récupérer',
    'Récupérée',
    'Annulée'
  ];

  const statutPaiementOptions = [
    'En attente sur place',
    'Payé sur place',
    'Payé en ligne (futur)',
    'Non payé'
  ];

  const handleSave = async () => {
    // Ici vous intégrerez l'appel webhook n8n pour mettre à jour Airtable
    console.log('Mise à jour commande:', {
      id,
      statutCommande,
      statutPaiement,
      notesInternes
    });
    
    toast({
      title: "Commande mise à jour",
      description: "Les modifications ont été sauvegardées avec succès.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-thai-green">Chargement de la commande...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-red-600">Commande non trouvée</p>
            <Button onClick={() => navigate('/admin/commandes')} className="mt-4">
              Retour aux commandes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/commandes')}
              className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-thai-green">{commande['Numéro de Commande']}</h1>
              <p className="text-thai-green/70">Détail de la commande</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-thai-orange hover:bg-thai-orange/90">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Informations générales */}
          <Card className="border-thai-orange/20">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-thai-green">Client</label>
                <p className="text-thai-green">{commande['Client R']?.join(', ') || 'N/A'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-thai-green">Date de prise de commande</label>
                <p className="text-thai-green">
                  {commande.createdTime ? // Utilisation de createdTime qui est disponible
                    new Date(commande.createdTime).toLocaleDateString('fr-FR') : 'N/A'
                  }
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-thai-green">Date et heure de retrait souhaitées</label>
                <p className="text-thai-green">
                  {commande['Date & Heure de retrait'] ?
                    new Date(commande['Date & Heure de retrait']).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'
                  }
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-thai-green">Total commande</label>
                <p className="text-xl font-bold text-thai-orange">{commande['Total Commande'] ? `${commande['Total Commande'].toFixed(2)} €` : '0,00 €'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des statuts */}
          <Card className="border-thai-orange/20">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Gestion des Statuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-thai-green">Statut de la commande</label>
                <Select value={statutCommande} onValueChange={setStatutCommande}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statutCommandeOptions.map(statut => (
                      <SelectItem key={statut} value={statut}>
                        {statut}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-thai-green">Statut de paiement</label>
                <Select value={statutPaiement} onValueChange={setStatutPaiement}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statutPaiementOptions.map(statut => (
                      <SelectItem key={statut} value={statut}>
                        {statut}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-thai-green">Notes internes</label>
                <Textarea
                  value={notesInternes}
                  onChange={(e) => setNotesInternes(e.target.value)}
                  placeholder="Ajouter des notes internes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Demandes spéciales */}
          {commande['Demandes spéciales'] && ( // Correction du nom du champ
            <Card className="border-thai-orange/20 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Demandes Spéciales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-thai-green">{commande['Demandes spéciales']}</p>
              </CardContent>
            </Card>
          )}

          {/* Détail des plats - À implémenter avec Passage Commande DB */}
          <Card className="border-thai-orange/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-thai-green">Détail des Plats Commandés</CardTitle>
              <CardDescription>
                Cette section affichera les plats commandés (via Passage Commande DB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-thai-green/70">
                Intégration avec Passage Commande DB à venir
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCommandeDetail;
