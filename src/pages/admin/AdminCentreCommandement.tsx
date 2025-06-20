import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Clock,
  Phone,
  Edit,
  Trash2,
  ChevronDown,
  CheckCircle,
  User,
  ShoppingCart,
  Calendar,
  Eye,
  EyeOff,
  Utensils,
  Euro,
  Plus,
  Minus,
  BarChart3,
  Users,
  CookingPot,
  Settings,
  TrendingUp,
  ShoppingBasket,
  RefreshCw,
  ArrowUpRight,
  Package,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import type { Commande, DetailsCommande, Plat, Client, ActiviteFlux } from '@/types/supabase';

interface CommandeAvecDetails extends Commande {
  details_commande_db: (DetailsCommande & { plats_db: Plat })[];
  client_db?: Client;
}

interface PlatAvecStock extends Plat {
  stock_status: 'disponible' | 'epuise';
}

interface StatsData {
  commandesAujourdhui: number;
  commandesDemain: number;
  chiffreAffairesJour: number;
  clientsActifs: number;
  platsEpuises: number;
}

const AdminCentreCommandement = () => {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState<CommandeAvecDetails[]>([]);
  const [plats, setPlats] = useState<PlatAvecStock[]>([]);
  const [activites, setActivites] = useState<ActiviteFlux[]>([]);
  const [stats, setStats] = useState<StatsData>({
    commandesAujourdhui: 0,
    commandesDemain: 0,
    chiffreAffairesJour: 0,
    clientsActifs: 0,
    platsEpuises: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState<string>('tous');
  const [recherche, setRecherche] = useState('');

  // Charger les données initiales
  useEffect(() => {
    chargerDonnees();
    const interval = setInterval(chargerDonnees, 30000);
    return () => clearInterval(interval);
  }, []);

  // Raccourci clavier pour la recherche (Ctrl+K ou Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const chargerDonnees = async () => {
    try {
      await Promise.all([
        chargerCommandes(),
        chargerPlats(),
        chargerActivites(),
      ]);
      calculerStats();
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const chargerCommandes = async () => {
    const { data, error } = await supabase
      .from('commande_db')
      .select(`
        *,
        client_db (nom, prenom, numero_de_telephone, email),
        details_commande_db (
          *,
          plats_db (plat, prix, photo_du_plat)
        )
      `)
      .order('date_et_heure_de_retrait_souhaitees', { ascending: true });

    if (error) throw error;
    setCommandes(data || []);
  };

  const chargerPlats = async () => {
    const { data, error } = await supabase
      .from('plats_db')
      .select('*')
      .order('plat');

    if (error) throw error;
    setPlats((data || []).map(plat => ({
      ...plat,
      stock_status: plat.est_epuise ? 'epuise' : 'disponible'
    })));
  };

  const chargerActivites = async () => {
    const { data, error } = await supabase
      .from('activites_flux')
      .select('*')
      .eq('lu', false)
      .order('timestamp', { ascending: false })
      .limit(5);

    if (error) throw error;
    setActivites(data || []);
  };

  const calculerStats = () => {
    const commandesAujourdhui = commandes.filter(cmd => 
      cmd.date_et_heure_de_retrait_souhaitees && 
      isToday(new Date(cmd.date_et_heure_de_retrait_souhaitees))
    ).length;

    const commandesDemain = commandes.filter(cmd => 
      cmd.date_et_heure_de_retrait_souhaitees && 
      isTomorrow(new Date(cmd.date_et_heure_de_retrait_souhaitees))
    ).length;

    const chiffreAffairesJour = commandes
      .filter(cmd => cmd.date_et_heure_de_retrait_souhaitees && 
        isToday(new Date(cmd.date_et_heure_de_retrait_souhaitees)))
      .reduce((total, cmd) => {
        return total + (cmd.details_commande_db?.reduce((detailTotal, detail) => {
          return detailTotal + (detail.plats_db?.prix || 0) * (detail.quantite_plat_commande || 1);
        }, 0) || 0);
      }, 0);

    const platsEpuises = plats.filter(plat => plat.est_epuise).length;
    const clientsActifs = new Set(commandes.map(c => c.client_r_id).filter(Boolean)).size;

    // Calculer commandes urgentes
    const commandesUrgentes = commandes.filter(cmd => 
      cmd.date_et_heure_de_retrait_souhaitees && 
      getUrgenceCommande(cmd.date_et_heure_de_retrait_souhaitees) !== 'normal'
    ).length;

    setStats({
      commandesAujourdhui,
      commandesDemain,
      chiffreAffairesJour,
      clientsActifs,
      platsEpuises,
    });
  };

  const modifierStatutCommande = async (commandeId: number, nouveauStatut: string) => {
    const { error } = await supabase
      .from('commande_db')
      .update({ statut_commande: nouveauStatut })
      .eq('idcommande', commandeId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return;
    }

    toast.success(`Commande ${nouveauStatut.toLowerCase()}`);
    chargerCommandes();
  };

  const modifierQuantitePlat = async (detailId: number, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) return;

    const { error } = await supabase
      .from('details_commande_db')
      .update({ quantite_plat_commande: nouvelleQuantite })
      .eq('iddetails', detailId);

    if (error) {
      toast.error('Erreur lors de la modification');
      return;
    }

    toast.success('Quantité mise à jour');
    chargerCommandes();
  };

  const supprimerPlatCommande = async (detailId: number) => {
    const { error } = await supabase
      .from('details_commande_db')
      .delete()
      .eq('iddetails', detailId);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }

    toast.success('Plat supprimé de la commande');
    chargerCommandes();
  };

  const basculerDisponibilitePlat = async (platId: number, estEpuise: boolean) => {
    const { error } = await supabase
      .from('plats_db')
      .update({ est_epuise: estEpuise })
      .eq('idplats', platId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return;
    }

    setPlats(prev => prev.map(plat => 
      plat.idplats === platId 
        ? { ...plat, stock_status: estEpuise ? 'epuise' : 'disponible', est_epuise: estEpuise }
        : plat
    ));
    
    toast.success(`Plat ${estEpuise ? 'marqué comme épuisé' : 'réactivé'}`);
  };

  const reactiversTousLesPlats = async () => {
    const { error } = await supabase
      .from('plats_db')
      .update({ est_epuise: false });

    if (error) {
      toast.error('Erreur lors de la réactivation');
      return;
    }

    setPlats(prev => prev.map(plat => ({
      ...plat,
      stock_status: 'disponible',
      est_epuise: false
    })));
    
    toast.success('Tous les plats ont été réactivés');
  };

  const marquerActiviteCommeeLue = async (activiteId: number) => {
    const { error } = await supabase
      .from('activites_flux')
      .update({ lu: true })
      .eq('id', activiteId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return;
    }

    setActivites(prev => prev.filter(activite => activite.id !== activiteId));
  };

  const getUrgenceCommande = (dateRetrait: string) => {
    const maintenant = new Date();
    const retrait = new Date(dateRetrait);
    const diff = retrait.getTime() - maintenant.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes <= 5 && minutes >= 0) return 'urgent';
    if (minutes < 0) return 'retard';
    return 'normal';
  };

  // Filtrer les commandes selon les critères
  const commandesFiltrees = commandes.filter(commande => {
    // Filtre par statut
    if (filtreStatut !== 'tous' && commande.statut_commande !== filtreStatut) {
      return false;
    }
    
    // Filtre par recherche
    if (recherche.trim() !== '') {
      const terme = recherche.toLowerCase();
      const nomClient = commande.client_db 
        ? `${commande.client_db.prenom || ''} ${commande.client_db.nom || ''}`.toLowerCase()
        : (commande.client_r || '').toLowerCase();
      
      const platsNoms = commande.details_commande_db?.map(d => d.plats_db?.plat || '').join(' ').toLowerCase() || '';
      
      if (!nomClient.includes(terme) && 
          !platsNoms.includes(terme) && 
          !commande.idcommande.toString().includes(terme)) {
        return false;
      }
    }
    
    return true;
  });

  // Trier par urgence puis par heure
  const commandesTriees = commandesFiltrees.sort((a, b) => {
    if (!a.date_et_heure_de_retrait_souhaitees || !b.date_et_heure_de_retrait_souhaitees) return 0;
    
    const urgenceA = getUrgenceCommande(a.date_et_heure_de_retrait_souhaitees);
    const urgenceB = getUrgenceCommande(b.date_et_heure_de_retrait_souhaitees);
    
    // Priorité : retard > urgent > normal
    const priorite = { retard: 3, urgent: 2, normal: 1 };
    if (priorite[urgenceA] !== priorite[urgenceB]) {
      return priorite[urgenceB] - priorite[urgenceA];
    }
    
    // Si même urgence, trier par heure
    return new Date(a.date_et_heure_de_retrait_souhaitees).getTime() - 
           new Date(b.date_et_heure_de_retrait_souhaitees).getTime();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-thai-orange mx-auto mb-4"></div>
          <p>Chargement du centre de commandement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions rapides et statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {/* Stats Cards */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aujourd'hui</p>
              <p className="text-2xl font-bold text-thai-green">{stats.commandesAujourdhui}</p>
            </div>
            <Calendar className="w-8 h-8 text-thai-orange" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CA Jour</p>
              <p className="text-2xl font-bold text-thai-green">{stats.chiffreAffairesJour.toFixed(0)}€</p>
            </div>
            <Euro className="w-8 h-8 text-thai-orange" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Clients</p>
              <p className="text-2xl font-bold text-thai-green">{stats.clientsActifs}</p>
            </div>
            <Users className="w-8 h-8 text-thai-orange" />
          </div>
        </Card>

        {/* Carte urgences */}
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Urgences</p>
              <p className="text-2xl font-bold text-red-700">
                {commandes.filter(cmd => 
                  cmd.date_et_heure_de_retrait_souhaitees && 
                  getUrgenceCommande(cmd.date_et_heure_de_retrait_souhaitees) !== 'normal'
                ).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        {/* Actions rapides vers autres pages */}
        <Button 
          onClick={() => navigate('/admin/commandes')}
          className="h-full p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
          variant="ghost"
        >
          <div className="flex flex-col items-center gap-2">
            <ShoppingBasket className="w-6 h-6" />
            <span className="text-sm">Commandes</span>
          </div>
        </Button>

        <Button 
          onClick={() => navigate('/admin/plats')}
          className="h-full p-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
          variant="ghost"
        >
          <div className="flex flex-col items-center gap-2">
            <CookingPot className="w-6 h-6" />
            <span className="text-sm">Plats</span>
          </div>
        </Button>

        <Button 
          onClick={() => navigate('/admin/statistiques')}
          className="h-full p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
          variant="ghost"
        >
          <div className="flex flex-col items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm">Stats</span>
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Colonne principale - Toutes les commandes */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Toutes les Commandes ({commandesTriees.length})
                </CardTitle>
                <Button onClick={chargerDonnees} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              </div>
              
              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par client, plat ou n° commande... (Ctrl+K)"
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      {filtreStatut === 'tous' ? 'Tous les statuts' : filtreStatut}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFiltreStatut('tous')}>
                      Tous les statuts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFiltreStatut('En attente de confirmation')}>
                      En attente de confirmation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFiltreStatut('Confirmée')}>
                      Confirmée
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFiltreStatut('En préparation')}>
                      En préparation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFiltreStatut('Prête à récupérer')}>
                      Prête à récupérer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {commandesTriees.map((commande) => (
                    <CommandeDetailCard
                      key={commande.idcommande}
                      commande={commande}
                      onUpdateStatus={modifierStatutCommande}
                      onUpdateQuantity={modifierQuantitePlat}
                      onDeletePlat={supprimerPlatCommande}
                    />
                  ))}
                  {commandesTriees.length === 0 && commandes.length > 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune commande ne correspond aux critères de recherche
                    </p>
                  )}
                  {commandes.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune commande en cours
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale - Contrôles */}
        <div className="space-y-6">
          {/* Disponibilité des plats */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Stock Plats</CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={reactiversTousLesPlats}
                >
                  Tout Réactiver
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {plats.slice(0, 8).map((plat) => (
                    <div key={plat.idplats} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{plat.plat}</p>
                        <p className="text-xs text-muted-foreground">{plat.prix}€</p>
                      </div>
                      <Switch
                        checked={plat.stock_status === 'disponible'}
                        onCheckedChange={(checked) => 
                          basculerDisponibilitePlat(plat.idplats, !checked)
                        }
                      />
                    </div>
                  ))}
                  {plats.length > 8 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/admin/plats')}
                    >
                      Voir tous les plats ({plats.length})
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Flux d'activités */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activités</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {activites.map((activite) => (
                    <div 
                      key={activite.id} 
                      className="flex items-start justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{activite.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activite.timestamp && format(new Date(activite.timestamp), 'HH:mm', { locale: fr })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => marquerActiviteCommeeLue(activite.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {activites.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-4">
                      Aucune nouvelle activité
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Composant pour chaque carte de commande détaillée
interface CommandeDetailCardProps {
  commande: CommandeAvecDetails;
  onUpdateStatus: (id: number, status: string) => void;
  onUpdateQuantity: (detailId: number, quantity: number) => void;
  onDeletePlat: (detailId: number) => void;
}

const CommandeDetailCard: React.FC<CommandeDetailCardProps> = ({
  commande,
  onUpdateStatus,
  onUpdateQuantity,
  onDeletePlat,
}) => {
  const urgence = commande.date_et_heure_de_retrait_souhaitees 
    ? getUrgenceCommande(commande.date_et_heure_de_retrait_souhaitees)
    : 'normal';

  const heureRetrait = commande.date_et_heure_de_retrait_souhaitees
    ? format(new Date(commande.date_et_heure_de_retrait_souhaitees), 'dd/MM à HH:mm', { locale: fr })
    : 'Non définie';

  const nomClient = commande.client_db 
    ? `${commande.client_db.prenom || ''} ${commande.client_db.nom || ''}`.trim()
    : commande.client_r || 'Client anonyme';

  const montantTotal = commande.details_commande_db?.reduce((total, detail) => {
    return total + (detail.plats_db?.prix || 0) * (detail.quantite_plat_commande || 1);
  }, 0) || 0;

  const getBorderColor = () => {
    switch (urgence) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'retard': return 'border-red-700 bg-red-100';
      default: return 'border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'En attente de confirmation': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmée': return 'bg-blue-100 text-blue-800';
      case 'En préparation': return 'bg-orange-100 text-orange-800';
      case 'Prête à récupérer': return 'bg-green-100 text-green-800';
      case 'Récupérée': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${getBorderColor()}`}>
      <CardContent className="p-4">
        {/* En-tête de la commande */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold text-thai-green">
              #{commande.idcommande}
            </div>
            <div className="text-sm font-medium text-red-600">
              {heureRetrait}
            </div>
            <div className="font-medium">
              {nomClient}
            </div>
            {urgence === 'urgent' && (
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Badge className={`mr-2 ${getStatusBadgeColor(commande.statut_commande || '')}`}>
                    {commande.statut_commande}
                  </Badge>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onUpdateStatus(commande.idcommande, 'En attente de confirmation')}>
                  En attente de confirmation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(commande.idcommande, 'Confirmée')}>
                  Confirmée
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(commande.idcommande, 'En préparation')}>
                  En préparation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(commande.idcommande, 'Prête à récupérer')}>
                  Prête à récupérer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(commande.idcommande, 'Récupérée')}>
                  Récupérée
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-lg font-bold">
              {montantTotal.toFixed(2)}€
            </div>
          </div>
        </div>

        {/* Liste des plats avec actions */}
        <div className="space-y-3">
          {commande.details_commande_db?.map((detail) => (
            <div key={detail.iddetails} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {/* Photo du plat */}
              {detail.plats_db?.photo_du_plat ? (
                <img 
                  src={detail.plats_db.photo_du_plat} 
                  alt={detail.plats_db.plat}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-gray-400" />
                </div>
              )}

              {/* Détails du plat */}
              <div className="flex-1">
                <h4 className="font-medium">{detail.plats_db?.plat}</h4>
                <p className="text-sm text-muted-foreground">
                  {detail.plats_db?.prix}€ • Total: {((detail.plats_db?.prix || 0) * (detail.quantite_plat_commande || 1)).toFixed(2)}€
                </p>
              </div>

              {/* Contrôles quantité */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(detail.iddetails, (detail.quantite_plat_commande || 1) - 1)}
                  disabled={(detail.quantite_plat_commande || 1) <= 1}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="mx-2 min-w-[2rem] text-center font-medium">
                  {detail.quantite_plat_commande || 1}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(detail.iddetails, (detail.quantite_plat_commande || 1) + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              {/* Bouton supprimer */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le plat</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer "{detail.plats_db?.plat}" de cette commande ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDeletePlat(detail.iddetails)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>

        {/* Actions commande */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Contacter
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>
          {commande.demande_special_pour_la_commande && (
            <div className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
              <strong>Note:</strong> {commande.demande_special_pour_la_commande}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Fonction utilitaire pour calculer l'urgence
const getUrgenceCommande = (dateRetrait: string) => {
  const maintenant = new Date();
  const retrait = new Date(dateRetrait);
  const diff = retrait.getTime() - maintenant.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes <= 5 && minutes >= 0) return 'urgent';
  if (minutes < 0) return 'retard';
  return 'normal';
};

export default AdminCentreCommandement;