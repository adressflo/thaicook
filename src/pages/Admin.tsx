// src/pages/Admin.tsx
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
  Settings,
  ClipboardList,
  Utensils,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  PlusCircle
} from 'lucide-react';
import { format, isToday } from 'date-fns';

const Admin = () => {
  const navigate = useNavigate();
  const { commandes, isLoading: commandesLoading } = useCommandes();
  const { evenements, isLoading: evenementsLoading } = useEvenements();
  const { clients, isLoading: clientsLoading } = useClients();

  // --- Indicateurs Clés (KPIs) ---
  const nouvellesCommandes = commandes?.filter(c => c.statutCommande === 'En attente de confirmation').length || 0;
  const commandesARetirerAujourdhui = commandes?.filter(c => {
    if (!c.dateHeureRetraitSouhaitees) return false;
    // Vérifie si la date de retrait est aujourd'hui
    return isToday(new Date(c.dateHeureRetraitSouhaitees));
  }).length || 0;
  const nouvellesDemandesEvenements = evenements?.filter(e => e.statutEvenement === 'Demande initiale').length || 0;
  const totalClients = clients?.length || 0;

  // --- Sections de Navigation Rapide ---
  const quickNavSections = [
    {
      title: "Gestion des Commandes",
      description: "Voir, créer ou annuler les commandes",
      icon: ShoppingCart,
      linkTo: "/admin/commandes",
      notificationCount: nouvellesCommandes,
    },
    {
      title: "Gestion des Événements",
      description: "Gérer les demandes pour les groupes",
      icon: Calendar,
      linkTo: "/admin/evenements", // Page à créer
      notificationCount: nouvellesDemandesEvenements,
    },
    {
      title: "Gestion des Clients",
      description: "Voir, créer ou modifier les profils clients",
      icon: Users,
      linkTo: "/admin/clients", // Page à créer
    },
    {
      title: "Gestion des Plats",
      description: "Modifier les plats, prix et disponibilités",
      icon: Utensils,
      linkTo: "/admin/plats", // Page à créer
    },
    {
      title: "Liste de Courses",
      description: "Gérer les ingrédients à acheter",
      icon: ClipboardList,
      linkTo: "/admin/liste-courses", // Page à créer
    },
    {
      title: "Configuration Générale",
      description: "Paramètres du site et de la connexion Airtable",
      icon: Settings,
      linkTo: "/airtable-config",
    },
  ];

  if (commandesLoading || evenementsLoading || clientsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-thai">
        <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-thai-orange mx-auto mb-4" />
            <p className="text-thai-green font-semibold">Chargement des données d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* En-tête de la page */}
        <div className="mb-8 flex flex-col items-center text-center">
          <BarChart3 className="w-12 h-12 text-thai-orange mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-thai-green mb-2">
            Administration ChanthanaThaiCook
          </h1>
          <p className="text-lg text-thai-green/80">
            Tableau de bord et gestion de l'activité
          </p>
        </div>

        {/* Cartes des indicateurs clés (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="border-thai-orange/30 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-thai-green">Nouvelles Commandes</CardTitle>
                    <AlertCircle className="h-4 w-4 text-thai-orange" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-thai-orange">{nouvellesCommandes}</div>
                    <p className="text-xs text-thai-green/70">En attente de confirmation</p>
                </CardContent>
            </Card>
            <Card className="border-thai-orange/30 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-thai-green">Retraits Aujourd'hui</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-thai-orange" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-thai-orange">{commandesARetirerAujourdhui}</div>
                    <p className="text-xs text-thai-green/70">Commandes à préparer/livrer</p>
                </CardContent>
            </Card>
             <Card className="border-thai-orange/30 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-thai-green">Demandes Événements</CardTitle>
                    <Calendar className="h-4 w-4 text-thai-orange" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-thai-orange">{nouvellesDemandesEvenements}</div>
                    <p className="text-xs text-thai-green/70">Nouvelles demandes à traiter</p>
                </CardContent>
            </Card>
            <Card className="border-thai-orange/30 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-thai-green">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-thai-orange" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-thai-orange">{totalClients}</div>
                    <p className="text-xs text-thai-green/70">Clients enregistrés</p>
                </CardContent>
            </Card>
        </div>

        {/* Sections de Navigation Rapide */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-thai-green mb-4">Navigation rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickNavSections.map((section) => (
              <Card 
                key={section.title} 
                className="group border-thai-orange/20 hover:shadow-xl hover:border-thai-orange transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => navigate(section.linkTo)}
              >
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <div className="p-3 bg-thai-orange/10 rounded-lg group-hover:bg-thai-orange group-hover:text-white transition-colors">
                    <section.icon className="w-6 h-6 text-thai-orange group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <CardTitle className="text-thai-green text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-sm">{section.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto">
                    <Button className="w-full bg-thai-orange hover:bg-thai-orange/90">
                        Accéder
                        {section.notificationCount && section.notificationCount > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-white text-thai-orange">{section.notificationCount}</Badge>
                        )}
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Aperçu rapide des dernières activités */}
        <div>
          <h2 className="text-2xl font-bold text-thai-green mb-4">Aperçu rapide</h2>
          <Tabs defaultValue="commandes" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="commandes">Dernières Commandes</TabsTrigger>
              <TabsTrigger value="evenements">Derniers Événements</TabsTrigger>
              <TabsTrigger value="clients">Nouveaux Clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="commandes">
              <Card>
                <CardHeader className="relative">
                  <CardTitle className="text-thai-green">Dernières Commandes</CardTitle>
                   <Button size="sm" className="absolute top-4 right-4" onClick={() => navigate('/admin/commandes')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Créer
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commandes?.slice(0, 5).map((commande) => (
                    <div key={commande.id} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-thai-green">{commande.nCommande}</p>
                        <p className="text-sm text-thai-green/70">
                          Pour: {commande.clientR ? 'Client enregistré' : 'N/A'} - Retrait le {commande.dateHeureRetraitSouhaitees ? format(new Date(commande.dateHeureRetraitSouhaitees), 'dd/MM/yy HH:mm') : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={commande.statutCommande === 'En attente de confirmation' ? 'destructive' : 'default'}>
                          {commande.statutCommande}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/commandes/${commande.id}`)}><Eye className="h-4 w-4"/></Button>
                        {commande.statutCommande === 'En attente de confirmation' && (
                          <Button size="sm" variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                            <CheckCircle className="h-4 w-4"/>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!commandes || commandes.length === 0) && <p className="text-center text-gray-500 py-4">Aucune commande récente.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evenements">
               <Card>
                <CardHeader className="relative">
                  <CardTitle className="text-thai-green">Dernières Demandes d'Événements</CardTitle>
                   <Button size="sm" className="absolute top-4 right-4" onClick={() => navigate('/admin/evenements')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Créer
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {evenements?.slice(0, 5).map((evenement) => (
                    <div key={evenement.id} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md hover:bg-gray-50">
                       <div>
                        <p className="font-semibold text-thai-green">{evenement.nomEvenement}</p>
                        <p className="text-sm text-thai-green/70">
                          {evenement.nombrePersonnes} personnes - Le {evenement.dateEvenement ? format(new Date(evenement.dateEvenement), 'dd/MM/yy') : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={evenement.statutEvenement === 'Demande initiale' ? 'destructive' : 'default'}>
                          {evenement.statutEvenement}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/evenements/${evenement.id}`)}><Eye className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  ))}
                  {(!evenements || evenements.length === 0) && <p className="text-center text-gray-500 py-4">Aucune demande d'événement récente.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients">
              <Card>
                <CardHeader className="relative">
                  <CardTitle className="text-thai-green">Nouveaux Clients</CardTitle>
                   <Button size="sm" className="absolute top-4 right-4" onClick={() => navigate('/admin/clients')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Créer
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clients?.slice(0, 5).map((client) => (
                     <div key={client.id} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md hover:bg-gray-50">
                       <div>
                        <p className="font-semibold text-thai-green">{client.prenom} {client.nom}</p>
                        <p className="text-sm text-thai-green/70">{client.email}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/admin/clients/${client.id}`)}><Eye className="h-4 w-4"/></Button>
                    </div>
                  ))}
                  {(!clients || clients.length === 0) && <p className="text-center text-gray-500 py-4">Aucun nouveau client.</p>}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
