import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  CheckCircle, 
  Eye, 
  History, 
  CookingPot, 
  ShoppingBasket, 
  Users, 
  Settings, 
  Plus, 
  Save, 
  Edit2, 
  Check, 
  X,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { format, isToday, isFuture, isPast, differenceInDays, startOfToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

// Imports corrigés pour pointer vers le fichier unique
// Utilisation des hooks Supabase
import { 
  useCommandes, 
  useClients, 
  usePlats, 
  useUpdatePlat, 
  useCreatePlat,
  useCommandesStats 
} from '@/hooks/useSupabaseData';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { PermissionGuard } from '@/components/PermissionGuard';
import type { CommandeUI } from '@/types/app'

const Admin = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingPlatId, setLoadingPlatId] = useState<number | null>(null);
  const [creatingPlat, setCreatingPlat] = useState(false);
  const [editingPrix, setEditingPrix] = useState<{id: number, prix: string} | null>(null);

  // État pour la création de nouveau plat
  const [nouveauPlat, setNouveauPlat] = useState({
    plat: '',
    description: '',
    prix: '',
    photo_du_plat: '',
    lundi_dispo: 'non',
    mardi_dispo: 'non',
    mercredi_dispo: 'non',
    jeudi_dispo: 'non',
    vendredi_dispo: 'non',
    samedi_dispo: 'non',
    dimanche_dispo: 'non'
  });

  // Utilisation des hooks Supabase 
  const { data: commandes, isLoading: commandesLoading } = useCommandes();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: plats, isLoading: platsLoading, refetch: refetchPlats } = usePlats();
  const { data: stats } = useCommandesStats();
  const updatePlat = useUpdatePlat();
  const createPlat = useCreatePlat();
  
  // Activer les notifications en temps réel
  useRealtimeNotifications();
  
  const isLoading = commandesLoading || clientsLoading;

  // Filtrer les commandes futures
  const commandesFutures = commandes
    ?.filter(c => c.date_et_heure_de_retrait_souhaitees && isFuture(new Date(c.date_et_heure_de_retrait_souhaitees)))
    .sort((a, b) => new Date(a.date_et_heure_de_retrait_souhaitees!).getTime() - new Date(b.date_et_heure_de_retrait_souhaitees!).getTime()) 
    || [];
  
  const listeDeCourses: any[] = []; // À implémenter plus tard

  const groupCommandsByDate = (cmds: CommandeUI[]) => {
    const today = startOfToday();
    return cmds.reduce((acc, commande) => {
      const date = new Date(commande.date_et_heure_de_retrait_souhaitees!);
      const diff = differenceInDays(date, today);
      let key = format(date, "EEEE d MMMM", { locale: fr });
      if (diff === 0) key = 'Aujourd\'hui';
      else if (diff === 1) key = 'Demain';
      key = key.charAt(0).toUpperCase() + key.slice(1);
      if (!acc[key]) acc[key] = [];
      acc[key].push(commande);
      return acc;
    }, {} as Record<string, CommandeUI[]>);
  };

  const commandesFuturesGroupees = groupCommandsByDate(commandesFutures || []); // Assurer que commandesFutures est un tableau

  const joursMap = {
    'lundi_dispo': 'Lundi',
    'mardi_dispo': 'Mardi', 
    'mercredi_dispo': 'Mercredi',
    'jeudi_dispo': 'Jeudi',
    'vendredi_dispo': 'Vendredi',
    'samedi_dispo': 'Samedi',
    'dimanche_dispo': 'Dimanche'
  };

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  const toggleDisponibilite = async (platId: number, jour: string, nouvelleValeur: boolean) => {
    setLoadingPlatId(platId);
    try {
      const updateData = {
        [jour]: nouvelleValeur ? 'oui' : 'non'
      };
      
      const result = await updatePlat.mutateAsync({
        id: platId,
        updateData
      });

      console.log('Résultat mise à jour:', result);
      
      // Forcer le rafraîchissement des données
      await refetchPlats();

      toast({
        title: "Succès",
        description: `Disponibilité mise à jour pour ${joursMap[jour as keyof typeof joursMap]}`
      });
    } catch (error) {
      console.error('Erreur mise à jour disponibilité:', error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la disponibilité: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
    } finally {
      setLoadingPlatId(null);
    }
  };

  const toggleTousLesJours = async (platId: number, nouvelleValeur: boolean) => {
    setLoadingPlatId(platId);
    try {
      const updateData = Object.keys(joursMap).reduce((acc, jour) => {
        acc[jour] = nouvelleValeur ? 'oui' : 'non';
        return acc;
      }, {} as Record<string, string>);
      
      await updatePlat.mutateAsync({
        id: platId,
        updateData
      });

      // Forcer le rafraîchissement des données
      await refetchPlats();

      toast({
        title: "Succès",
        description: `Plat ${nouvelleValeur ? 'activé' : 'désactivé'} pour tous les jours`
      });
    } catch (error) {
      console.error('Erreur mise à jour disponibilité:', error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la disponibilité: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
    } finally {
      setLoadingPlatId(null);
    }
  };

  const creerNouveauPlat = async () => {
    if (!nouveauPlat.plat || !nouveauPlat.description || !nouveauPlat.prix) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setCreatingPlat(true);
    try {
      await createPlat.mutateAsync({
        data: {
          ...nouveauPlat,
          prix: parseFloat(nouveauPlat.prix)
        }
      });

      // Réinitialiser le formulaire
      setNouveauPlat({
        plat: '',
        description: '',
        prix: '',
        photo_du_plat: '',
        lundi_dispo: 'non',
        mardi_dispo: 'non',
        mercredi_dispo: 'non',
        jeudi_dispo: 'non',
        vendredi_dispo: 'non',
        samedi_dispo: 'non',
        dimanche_dispo: 'non'
      });

      // Forcer le rafraîchissement des données
      await refetchPlats();

      toast({
        title: "Succès",
        description: "Nouveau plat créé avec succès"
      });
    } catch (error) {
      console.error('Erreur création plat:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le plat",
        variant: "destructive"
      });
    } finally {
      setCreatingPlat(false);
    }
  };

  const modifierPrix = async (platId: number, nouveauPrix: string) => {
    const prix = parseFloat(nouveauPrix);
    if (isNaN(prix) || prix <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un prix valide",
        variant: "destructive"
      });
      return;
    }

    setLoadingPlatId(platId);
    try {
      await updatePlat.mutateAsync({
        id: platId,
        updateData: { prix }
      });

      // Forcer le rafraîchissement des données
      await refetchPlats();

      setEditingPrix(null);
      toast({
        title: "Succès",
        description: "Prix mis à jour avec succès"
      });
    } catch (error) {
      console.error('Erreur modification prix:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le prix",
        variant: "destructive"
      });
    } finally {
      setLoadingPlatId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-thai-orange" />
      </div>
    );
  }

  return (
    <PermissionGuard requireAdmin={true} fallback={
      <div className="min-h-screen bg-gradient-thai flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-thai-green mb-2">Accès Refusé</h2>
          <p className="text-thai-green/70">Vous devez être administrateur pour accéder à cette page.</p>
          <Button onClick={() => navigate('/')} className="mt-4 bg-thai-orange hover:bg-thai-orange/90">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-gradient-thai p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-thai-green">Administration</h1>
          <Button
            onClick={() => navigate('/admin/commandes')}
            className="bg-thai-orange hover:bg-thai-orange/90"
          >
            <Package className="w-4 h-4 mr-2" />
            Gestion Complète des Commandes
          </Button>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="futures">Commandes Futures</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="plats">Gestion Plats</TabsTrigger>
            <TabsTrigger value="courses">Liste de Courses</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistiques rapides */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Commandes récentes et actions rapides */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Commandes récentes */}
              <Card className="border-thai-orange/20">
                <CardHeader>
                  <CardTitle className="text-thai-green flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Commandes Récentes
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin/commandes')}
                      className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
                    >
                      Voir toutes
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {commandes && commandes.length > 0 ? (
                    <div className="space-y-3">
                      {commandes.slice(0, 5).map((commande) => (
                        <div 
                          key={commande.idcommande} 
                          className="flex items-center justify-between p-3 bg-thai-cream/30 rounded-lg hover:bg-thai-cream/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/admin/commandes/${commande.idcommande}`)}
                        >
                          <div>
                            <p className="font-medium text-thai-green">
                              Commande #{commande.idcommande}
                            </p>
                            <p className="text-sm text-thai-green/70">
                              {commande.client?.nom} {commande.client?.prenom}
                            </p>
                            <p className="text-xs text-thai-green/60">
                              {commande.date_et_heure_de_retrait_souhaitees ?
                                format(new Date(commande.date_et_heure_de_retrait_souhaitees), "dd/MM/yyyy à HH:mm") :
                                'Date non définie'
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                commande.statut_commande === 'En attente de confirmation' ? 'destructive' :
                                commande.statut_commande === 'Confirmée' ? 'default' :
                                commande.statut_commande === 'En préparation' ? 'secondary' :
                                'outline'
                              }
                            >
                              {commande.statut_commande}
                            </Badge>
                            <p className="text-sm font-medium text-thai-orange mt-1">
                              {commande.details?.reduce((sum: number, detail: any) => 
                                sum + (parseFloat(detail.plat?.prix || 0) * detail.quantite_plat_commande), 0
                              ).toFixed(2) || '0.00'} €
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-thai-green/70 text-center py-4">Aucune commande récente</p>
                  )}
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card className="border-thai-orange/20">
                <CardHeader>
                  <CardTitle className="text-thai-green flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button
                      onClick={() => navigate('/admin/commandes')}
                      className="w-full bg-thai-orange hover:bg-thai-orange/90 text-left justify-start"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Gérer toutes les commandes
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate('/commander')}
                      className="w-full border-thai-green text-thai-green hover:bg-thai-green/10 justify-start"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une commande
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate('/evenements')}
                      className="w-full border-thai-green text-thai-green hover:bg-thai-green/10 justify-start"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Gérer les événements
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-thai-green text-thai-green hover:bg-thai-green/10 justify-start"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Voir les rapports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commandes par statut */}
            {stats && Object.keys(stats.parStatut).length > 0 && (
              <Card className="border-thai-orange/20">
                <CardHeader>
                  <CardTitle className="text-thai-green flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Répartition des Commandes par Statut
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(stats.parStatut).map(([statut, count]) => (
                      <div key={statut} className="text-center p-4 bg-thai-cream/30 rounded-lg">
                        <p className="text-2xl font-bold text-thai-orange">{count}</p>
                        <p className="text-sm text-thai-green/70">{statut}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="futures">
            <Card>
              <CardHeader><CardTitle className="text-thai-green">Commandes Futures ({commandesFutures.length})</CardTitle></CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto space-y-4">
                {Object.keys(commandesFuturesGroupees).length > 0 ? Object.entries(commandesFuturesGroupees).map(([date, cmdsDuJour]) => (
                  <div key={date}>
                    <h3 className="text-md font-semibold text-gray-600 border-b pb-2 mb-3">{date}</h3>
                    {cmdsDuJour.map(commande => (
                      <div key={commande.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                        <div>
                          <p className="font-semibold text-thai-green">
                            Client ID: {commande.client_r || commande.client_r_id}
                          </p>
                          <p className="text-sm text-gray-500">
                            Commande #{commande.idcommande} - {format(new Date(commande.date_et_heure_de_retrait_souhaitees!), 'HH:mm')}
                          </p>
                        </div>
                        {commande.statut_commande === 'En attente de confirmation' && (
                           <Button size="sm" variant="secondary" 
                           className="bg-green-100 text-green-800 hover:bg-green-200">
                             <CheckCircle className="h-4 w-4 mr-1"/> Confirmer
                           </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )) : <p className="text-center text-gray-500 py-4">Aucune commande à venir.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader><CardTitle className="text-thai-green">Tous les Clients ({clients?.length || 0})</CardTitle></CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto space-y-2">
                {clients?.map(client => (
                   <div key={client.idclient} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                     <div>
                      <p className="font-semibold text-thai-green">{client.prenom} {client.nom}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/clients/${client.idclient}`)}><Eye className="h-4 w-4"/></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plats">
            <div className="space-y-6">
              {/* Section création de nouveau plat */}
              <Card className="border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Créer un Nouveau Plat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nom">Nom du plat *</Label>
                        <Input
                          id="nom"
                          value={nouveauPlat.plat}
                          onChange={(e) => setNouveauPlat({...nouveauPlat, plat: e.target.value})}
                          placeholder="Ex: Pad Thai"
                        />
                      </div>
                      <div>
                        <Label htmlFor="prix">Prix (€) *</Label>
                        <Input
                          id="prix"
                          type="number"
                          step="0.01"
                          value={nouveauPlat.prix}
                          onChange={(e) => setNouveauPlat({...nouveauPlat, prix: e.target.value})}
                          placeholder="12.90"
                        />
                      </div>
                      <div>
                        <Label htmlFor="photo">URL de la photo</Label>
                        <Input
                          id="photo"
                          value={nouveauPlat.photo_du_plat}
                          onChange={(e) => setNouveauPlat({...nouveauPlat, photo_du_plat: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={nouveauPlat.description}
                          onChange={(e) => setNouveauPlat({...nouveauPlat, description: e.target.value})}
                          placeholder="Description du plat..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Disponibilité par jour</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {Object.entries(joursMap).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Switch
                                checked={nouveauPlat[key as keyof typeof nouveauPlat] === 'oui'}
                                onCheckedChange={(checked) => 
                                  setNouveauPlat({...nouveauPlat, [key]: checked ? 'oui' : 'non'})
                                }
                              />
                              <Label className="text-sm">{label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={creerNouveauPlat}
                      disabled={creatingPlat}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {creatingPlat ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Créer le Plat
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Section gestion des plats existants */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-thai-green flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Gestion des Plats - Disponibilité par Jour ({plats?.length || 0})
                  </CardTitle>
                  <p className="text-sm text-gray-600">Classement par disponibilité (plats les plus disponibles en premier)</p>
                </CardHeader>
                <CardContent className="max-h-[70vh] overflow-y-auto">
                  {platsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-thai-orange" />
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {plats
                        ?.sort((a, b) => {
                          // Calculer le nombre de jours disponibles pour chaque plat
                          const joursDispoA = Object.keys(joursMap).filter(
                            jour => a[jour as keyof typeof a] === 'oui'
                          ).length;
                          const joursDispoB = Object.keys(joursMap).filter(
                            jour => b[jour as keyof typeof b] === 'oui'
                          ).length;
                          
                          // Trier par nombre de jours disponibles (décroissant), puis par nom
                          if (joursDispoB !== joursDispoA) {
                            return joursDispoB - joursDispoA;
                          }
                          return a.plat.localeCompare(b.plat);
                        })
                        .map(plat => {
                          const nombreJoursDisponibles = Object.keys(joursMap).filter(
                            jour => plat[jour as keyof typeof plat] === 'oui'
                          ).length;
                          
                          return (
                            <Card key={plat.idplats} className="border-l-4 border-l-thai-orange hover:shadow-lg transition-shadow">
                              <CardContent className="p-4">
                                {/* Badge de disponibilité */}
                                <div className="flex justify-between items-start mb-3">
                                  <Badge 
                                    variant={nombreJoursDisponibles >= 5 ? "default" : nombreJoursDisponibles >= 3 ? "secondary" : "outline"}
                                    className={`${
                                      nombreJoursDisponibles >= 5 
                                        ? "bg-green-500 text-white" 
                                        : nombreJoursDisponibles >= 3 
                                        ? "bg-yellow-500 text-white" 
                                        : "bg-red-100 text-red-700 border-red-300"
                                    }`}
                                  >
                                    {nombreJoursDisponibles}/7 jours
                                  </Badge>
                                  <div className="text-right text-xs text-gray-500">
                                    #{plat.idplats}
                                  </div>
                                </div>

                                {/* Image du plat */}
                                {plat.photo_du_plat && (
                                  <div className="mb-4">
                                    <img 
                                      src={plat.photo_du_plat} 
                                      alt={plat.plat}
                                      className="w-full h-48 object-cover rounded-lg"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                                
                                {/* Info du plat */}
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-thai-green">{plat.plat}</h3>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={loadingPlatId === plat.idplats}
                                        onClick={() => toggleTousLesJours(plat.idplats, true)}
                                        className="text-green-600 border-green-300 hover:bg-green-50"
                                      >
                                        ✓ Tout activer
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={loadingPlatId === plat.idplats}
                                        onClick={() => toggleTousLesJours(plat.idplats, false)}
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                      >
                                        ✗ Tout désactiver
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{plat.description}</p>
                                  <div className="flex items-center gap-2">
                                    {editingPrix?.id === plat.idplats ? (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={editingPrix.prix}
                                          onChange={(e) => setEditingPrix({...editingPrix, prix: e.target.value})}
                                          className="w-20 h-6 text-xs"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              modifierPrix(plat.idplats, editingPrix.prix);
                                            } else if (e.key === 'Escape') {
                                              setEditingPrix(null);
                                            }
                                          }}
                                          autoFocus
                                        />
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 w-6 p-0 text-green-600"
                                          onClick={() => modifierPrix(plat.idplats, editingPrix.prix)}
                                          disabled={loadingPlatId === plat.idplats}
                                        >
                                          {loadingPlatId === plat.idplats ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          ) : (
                                            <Check className="h-3 w-3" />
                                          )}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 w-6 p-0 text-red-600"
                                          onClick={() => setEditingPrix(null)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-thai-gold">{formatPrix(plat.prix)}</Badge>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 w-6 p-0 text-gray-600 hover:text-thai-orange"
                                          onClick={() => setEditingPrix({id: plat.idplats, prix: plat.prix.toString()})}
                                        >
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Gestion par jour */}
                                <div className="grid grid-cols-1 gap-2">
                                  {Object.entries(joursMap).map(([jourKey, jourLabel]) => {
                                    const isDisponible = plat[jourKey as keyof typeof plat] === 'oui';
                                    const isUpdating = loadingPlatId === plat.idplats;
                                    
                                    return (
                                      <div key={jourKey} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <Label className="text-sm font-medium">{jourLabel}</Label>
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            checked={isDisponible}
                                            disabled={isUpdating}
                                            onCheckedChange={(checked) => toggleDisponibilite(plat.idplats, jourKey, checked)}
                                          />
                                          {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
                                          <span className={`text-xs font-medium ${isDisponible ? 'text-green-600' : 'text-red-600'}`}>
                                            {isDisponible ? 'Oui' : 'Non'}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {/* Résumé des jours actifs */}
                                <div className="mt-4 pt-3 border-t">
                                  <div className="flex flex-wrap gap-1">
                                    <span className="text-sm text-gray-600">Disponible:</span>
                                    {Object.entries(joursMap)
                                      .filter(([key]) => plat[key as keyof typeof plat] === 'oui')
                                      .map(([_, label]) => (
                                        <Badge key={label} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                          {label}
                                        </Badge>
                                      ))}
                                    {Object.entries(joursMap).every(([key]) => plat[key as keyof typeof plat] !== 'oui') && (
                                      <Badge variant="destructive" className="text-xs">Aucun jour</Badge>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      
                      {!plats?.length && (
                        <div className="col-span-full text-center py-8">
                          <CookingPot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Aucun plat trouvé</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader><CardTitle className="text-thai-green">Liste de Courses ({listeDeCourses.length})</CardTitle></CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto space-y-2">
                {listeDeCourses.map(ingredient => (
                   <div key={ingredient.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                     <div>
                      <p className="font-semibold text-thai-green">{ingredient.Ingrédient}</p>
                      <p className="text-sm text-gray-500">{ingredient.Catégorie}</p>
                    </div>
                    <Badge variant="outline">{ingredient.Fournisseur}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </PermissionGuard>
  );
});

export default Admin;