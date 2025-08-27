'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  DollarSign, 
  Users, 
  Package, 
  AlertCircle,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Euro,
  ShoppingCart,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useCommandes, useClients, usePlats } from '@/hooks/useSupabaseData';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface StatsData {
  commandesAujourdhui: number;
  commandesDemain: number;
  chiffreAffairesJour: number;
  chiffreAffairesSemaine: number;
  clientsActifs: number;
  platsEpuises: number;
  commandesEnAttente: number;
  commandesEnPreparation: number;
  evolutionSemaine: number;
}

interface CommandeChart {
  date: string;
  commandes: number;
  revenus: number;
}

interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export default function AdminCentreCommandement() {
  const [filtreStatut, setFiltreStatut] = useState<string>('tous');
  const [recherche, setRecherche] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Utilisation de React Query hooks - pas de boucles infinies
  const { data: commandes = [], isLoading: commandesLoading, refetch: refetchCommandes } = useCommandes();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: plats = [], isLoading: platsLoading } = usePlats();

  const loading = commandesLoading || clientsLoading || platsLoading;

  // Mise à jour de l'heure toutes les minutes
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calcul des statistiques avancées
  const stats: StatsData = useMemo(() => {
    const aujourd = new Date();
    const debutSemaine = startOfWeek(aujourd, { weekStartsOn: 1 });
    const finSemaine = endOfWeek(aujourd, { weekStartsOn: 1 });
    const semainePrecedente = subDays(debutSemaine, 7);

    // Commandes aujourd'hui et demain
    const commandesAujourdhui = commandes.filter(cmd => {
      if (!cmd.date_et_heure_de_retrait_souhaitees) return false;
      return isToday(new Date(cmd.date_et_heure_de_retrait_souhaitees));
    }).length;

    const commandesDemain = commandes.filter(cmd => {
      if (!cmd.date_et_heure_de_retrait_souhaitees) return false;
      return isTomorrow(new Date(cmd.date_et_heure_de_retrait_souhaitees));
    }).length;

    // Calcul des chiffres d'affaires
    const calculateRevenue = (cmdList: typeof commandes) => {
      return cmdList.reduce((sum, commande) => {
        if (!commande.details) return sum;
        return sum + commande.details.reduce((detailSum, detail) => {
          return detailSum + ((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0));
        }, 0);
      }, 0);
    };

    const commandesJour = commandes.filter(cmd => {
      if (!cmd.date_et_heure_de_retrait_souhaitees) return false;
      return isToday(new Date(cmd.date_et_heure_de_retrait_souhaitees));
    });

    const commandesSemaine = commandes.filter(cmd => {
      if (!cmd.date_et_heure_de_retrait_souhaitees) return false;
      const dateCmd = new Date(cmd.date_et_heure_de_retrait_souhaitees);
      return dateCmd >= debutSemaine && dateCmd <= finSemaine;
    });

    const commandesSemainePrecedente = commandes.filter(cmd => {
      if (!cmd.date_et_heure_de_retrait_souhaitees) return false;
      const dateCmd = new Date(cmd.date_et_heure_de_retrait_souhaitees);
      return dateCmd >= semainePrecedente && dateCmd < debutSemaine;
    });

    const chiffreAffairesJour = calculateRevenue(commandesJour);
    const chiffreAffairesSemaine = calculateRevenue(commandesSemaine);
    
    // Évolution par rapport à la semaine précédente
    const evolutionSemaine = commandesSemainePrecedente.length > 0 
      ? ((commandesSemaine.length - commandesSemainePrecedente.length) / commandesSemainePrecedente.length) * 100
      : 0;

    // Statistiques de statuts
    const commandesEnAttente = commandes.filter(cmd => 
      cmd.statut_commande === 'En attente de confirmation').length;
    const commandesEnPreparation = commandes.filter(cmd => 
      cmd.statut_commande === 'En préparation').length;

    const platsEpuises = plats.filter(plat => plat.est_epuise).length;

    return {
      commandesAujourdhui,
      commandesDemain,
      chiffreAffairesJour,
      chiffreAffairesSemaine,
      clientsActifs: clients.length,
      platsEpuises,
      commandesEnAttente,
      commandesEnPreparation,
      evolutionSemaine
    };
  }, [commandes, clients, plats]);

  // Données pour les graphiques
  const chartData: CommandeChart[] = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayCommandes = commandes.filter(cmd => {
        if (!cmd.date_et_heure_de_retrait_souhaitees) return false;
        const cmdDate = new Date(cmd.date_et_heure_de_retrait_souhaitees);
        return cmdDate.toDateString() === date.toDateString();
      });

      const revenus = dayCommandes.reduce((sum, cmd) => {
        if (!cmd.details) return sum;
        return sum + cmd.details.reduce((detailSum, detail) => {
          return detailSum + ((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0));
        }, 0);
      }, 0);

      last7Days.push({
        date: format(date, 'dd/MM', { locale: fr }),
        commandes: dayCommandes.length,
        revenus: parseFloat(revenus.toFixed(2))
      });
    }
    return last7Days;
  }, [commandes]);

  // Distribution des statuts
  const statusDistribution: StatusDistribution[] = useMemo(() => {
    const statusCounts = {
      'En attente de confirmation': { count: 0, color: '#f59e0b' },
      'Confirmée': { count: 0, color: '#3b82f6' },
      'En préparation': { count: 0, color: '#f97316' },
      'Prête à récupérer': { count: 0, color: '#8b5cf6' },
      'Récupérée': { count: 0, color: '#10b981' },
      'Annulée': { count: 0, color: '#ef4444' }
    };

    commandes.forEach(cmd => {
      if (statusCounts[cmd.statut_commande as keyof typeof statusCounts]) {
        statusCounts[cmd.statut_commande as keyof typeof statusCounts].count++;
      }
    });

    const total = commandes.length;
    return Object.entries(statusCounts).map(([status, data]) => ({
      status,
      count: data.count,
      percentage: total > 0 ? (data.count / total) * 100 : 0,
      color: data.color
    })).filter(item => item.count > 0);
  }, [commandes]);

  // Filtrage des commandes
  const commandesFiltrees = useMemo(() => {
    return commandes.filter(commande => {
      // Filtre par statut
      if (filtreStatut !== 'tous' && commande.statut_commande !== filtreStatut) {
        return false;
      }

      // Filtre par recherche
      if (recherche) {
        const termeRecherche = recherche.toLowerCase();
        const matchId = commande.idcommande.toString().includes(termeRecherche);
        const matchClient = commande.client_r?.toLowerCase().includes(termeRecherche);
        return matchId || matchClient;
      }

      return true;
    });
  }, [commandes, filtreStatut, recherche]);

  const handleRefresh = () => {
    refetchCommandes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-thai min-h-screen">
      {/* Header avec horloge temps réel */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-thai-green">Centre de Commandement</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{format(currentTime, 'HH:mm - dd/MM/yyyy', { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span>Mise à jour en temps réel</span>
            </div>
          </div>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* KPI Cards améliorés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Commandes Aujourd'hui</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{stats.commandesAujourdhui}</div>
            <p className="text-xs text-blue-600 mt-1">
              +{stats.commandesDemain} prévues demain
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">CA Aujourd'hui</CardTitle>
            <Euro className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.chiffreAffairesJour.toFixed(2)}€</div>
            <p className="text-xs text-green-600 mt-1">
              {stats.chiffreAffairesSemaine.toFixed(2)}€ cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">En Attente</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{stats.commandesEnAttente}</div>
            <p className="text-xs text-orange-600 mt-1">
              {stats.commandesEnPreparation} en préparation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Évolution</CardTitle>
            {stats.evolutionSemaine >= 0 ? 
              <TrendingUp className="h-5 w-5 text-purple-600" /> : 
              <TrendingDown className="h-5 w-5 text-purple-600" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.evolutionSemaine >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.evolutionSemaine >= 0 ? '+' : ''}{stats.evolutionSemaine.toFixed(1)}%
            </div>
            <p className="text-xs text-purple-600 mt-1">
              vs semaine précédente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et visualisations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des commandes sur 7 jours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Tendance 7 derniers jours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{day.date}</span>
                    <div className="flex gap-4">
                      <span className="text-blue-600">{day.commandes} cmd</span>
                      <span className="text-green-600">{day.revenus}€</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-thai-orange to-thai-green h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((day.commandes / Math.max(...chartData.map(d => d.commandes))) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribution des statuts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Répartition des Statuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusDistribution.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm font-medium">{status.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{status.count}</span>
                    <span className="text-xs text-gray-500">({status.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
              
              {statusDistribution.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune donnée de statut disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et notifications */}
      {(stats.platsEpuises > 0 || stats.commandesEnAttente > 5) && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Alertes Système</h3>
                <div className="mt-2 space-y-1 text-sm text-red-700">
                  {stats.platsEpuises > 0 && (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>{stats.platsEpuises} plat(s) épuisé(s) - Action requise</span>
                    </div>
                  )}
                  {stats.commandesEnAttente > 5 && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{stats.commandesEnAttente} commande(s) en attente de confirmation</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Clients Actifs</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.clientsActifs}</div>
            <p className="text-sm text-gray-600">Total des comptes clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-700">Stock & Menu</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{plats.length - stats.platsEpuises}</div>
            <p className="text-sm text-gray-600">
              Plats disponibles sur {plats.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">Taux de Service</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {commandes.length > 0 ? 
                (((commandes.length - stats.commandesEnAttente) / commandes.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-sm text-gray-600">Commandes traitées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par ID ou client..."
                className="pl-10"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="tous">Tous les statuts</option>
              <option value="En attente de confirmation">En attente</option>
              <option value="Confirmée">Confirmée</option>
              <option value="En préparation">En préparation</option>
              <option value="Prête à récupérer">Prête</option>
              <option value="Récupérée">Récupérée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>

          {/* Liste des commandes */}
          <div className="space-y-4">
            {commandesFiltrees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Aucune commande trouvée</p>
              </div>
            ) : (
              commandesFiltrees.map((commande) => (
                <Card key={commande.idcommande} className="border-l-4 border-l-thai-orange">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Commande #{commande.idcommande}</h3>
                        <p className="text-sm text-gray-600">
                          Client: {commande.client_r || 'Non spécifié'}
                        </p>
                        {commande.date_et_heure_de_retrait_souhaitees && (
                          <p className="text-sm text-gray-600">
                            Retrait: {format(new Date(commande.date_et_heure_de_retrait_souhaitees), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          commande.statut_commande === 'En préparation' ? 'default' :
                          commande.statut_commande === 'Prête à récupérer' ? 'secondary' :
                          commande.statut_commande === 'Récupérée' ? 'outline' : 'destructive'
                        }>
                          {commande.statut_commande}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {commande.type_livraison}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}