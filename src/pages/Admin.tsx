
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCommandes, useEvenements, useClients } from '@/hooks/useAirtable';
import { 
  ShoppingCart, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { commandes, isLoading: commandesLoading } = useCommandes();
  const { evenements, isLoading: evenementsLoading } = useEvenements();
  const { clients, isLoading: clientsLoading } = useClients();

  // Calculs pour le tableau de bord
  const nouvellesCommandes = commandes?.filter(c => c.statutCommande === 'En attente de confirmation').length || 0;
  const commandesAujourdhui = commandes?.filter(c => {
    const today = new Date().toDateString();
    const commandeDate = new Date(c.dateHeureRetraitSouhaitees || '').toDateString();
    return commandeDate === today;
  }).length || 0;
  
  const nouvellesDemandesEvenements = evenements?.filter(e => e.statutEvenement === 'Demande initiale').length || 0;
  const totalClients = clients?.length || 0;

  if (commandesLoading || evenementsLoading || clientsLoading) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-thai-green">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <BarChart3 className="w-16 h-16 text-thai-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-thai-green mb-2">
            Administration ChanthanaThaiCook
          </h1>
          <p className="text-thai-green/70">
            Tableau de bord et gestion de l'activité
          </p>
        </div>

        {/* Tableau de bord */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-thai-orange/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-thai-green">
                Nouvelles Commandes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-thai-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-thai-orange">{nouvellesCommandes}</div>
              <p className="text-xs text-thai-green/70">En attente de confirmation</p>
            </CardContent>
          </Card>

          <Card className="border-thai-orange/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-thai-green">
                Commandes Aujourd'hui
              </CardTitle>
              <Clock className="h-4 w-4 text-thai-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-thai-orange">{commandesAujourdhui}</div>
              <p className="text-xs text-thai-green/70">À préparer</p>
            </CardContent>
          </Card>

          <Card className="border-thai-orange/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-thai-green">
                Demandes Événements
              </CardTitle>
              <Calendar className="h-4 w-4 text-thai-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-thai-orange">{nouvellesDemandesEvenements}</div>
              <p className="text-xs text-thai-green/70">Nouvelles demandes</p>
            </CardContent>
          </Card>

          <Card className="border-thai-orange/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-thai-green">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-thai-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-thai-orange">{totalClients}</div>
              <p className="text-xs text-thai-green/70">Clients enregistrés</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation rapide */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-thai-orange/20 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/commandes')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-thai-green">
                <ShoppingCart className="w-5 h-5" />
                <span>Gestion des Commandes</span>
              </CardTitle>
              <CardDescription>
                Voir et gérer toutes les commandes "À la carte"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thai-orange hover:bg-thai-orange/90">
                Accéder aux commandes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-thai-orange/20 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/evenements')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-thai-green">
                <Calendar className="w-5 h-5" />
                <span>Gestion des Événements</span>
              </CardTitle>
              <CardDescription>
                Traiter les demandes d'événements et générer les devis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thai-orange hover:bg-thai-orange/90">
                Accéder aux événements
              </Button>
            </CardContent>
          </Card>

          <Card className="border-thai-orange/20 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/clients')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-thai-green">
                <Users className="w-5 h-5" />
                <span>Gestion des Clients</span>
              </CardTitle>
              <CardDescription>
                Consulter et modifier les informations clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thai-orange hover:bg-thai-orange/90">
                Accéder aux clients
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu rapide des dernières activités */}
        <Tabs defaultValue="commandes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="commandes">Dernières Commandes</TabsTrigger>
            <TabsTrigger value="evenements">Derniers Événements</TabsTrigger>
            <TabsTrigger value="clients">Nouveaux Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="commandes">
            <Card>
              <CardHeader>
                <CardTitle className="text-thai-green">Dernières Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commandes?.slice(0, 5).map((commande) => (
                    <div key={commande.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium text-thai-green">{commande.nCommande}</p>
                        <p className="text-sm text-thai-green/70">
                          {new Date(commande.dateHeureRetraitSouhaitees || '').toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-thai-orange">{commande.totalCommandeVu}</p>
                        <Badge variant={
                          commande.statutCommande === 'En attente de confirmation' ? 'destructive' :
                          commande.statutCommande === 'Confirmée' ? 'default' : 'secondary'
                        }>
                          {commande.statutCommande}
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <p className="text-thai-green/70">Aucune commande trouvée</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evenements">
            <Card>
              <CardHeader>
                <CardTitle className="text-thai-green">Dernières Demandes d'Événements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evenements?.slice(0, 5).map((evenement) => (
                    <div key={evenement.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium text-thai-green">{evenement.nomEvenement}</p>
                        <p className="text-sm text-thai-green/70">
                          {evenement.nombrePersonnes} personnes • {evenement.typeEvenement}
                        </p>
                      </div>
                      <Badge variant={
                        evenement.statutEvenement === 'Demande initiale' ? 'destructive' :
                        evenement.statutEvenement === 'Confirmé / Acompte reçu' ? 'default' : 'secondary'
                      }>
                        {evenement.statutEvenement}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-thai-green/70">Aucune demande d'événement trouvée</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle className="text-thai-green">Nouveaux Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients?.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium text-thai-green">{client.prenom} {client.nom}</p>
                        <p className="text-sm text-thai-green/70">{client.email}</p>
                      </div>
                      <p className="text-sm text-thai-green/70">
                        {new Date(client.createdTime).toLocaleDateString()}
                      </p>
                    </div>
                  )) || (
                    <p className="text-thai-green/70">Aucun client trouvé</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
