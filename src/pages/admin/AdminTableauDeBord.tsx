import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  ShoppingBasket, 
  Users, 
  DollarSign,
  Clock,
  AlertCircle,
  Package,
  Calendar
} from 'lucide-react';
import { useCommandes, useClients, usePlats, useCommandesStats } from '@/hooks/useSupabaseData';
import { format, isToday, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminTableauDeBord = () => {
  const { data: commandes } = useCommandes();
  const { data: clients } = useClients();
  const { data: plats } = usePlats();
  const { data: stats } = useCommandesStats();

  // Calculs statistiques
  const commandesAujourdhui = commandes?.filter(cmd => 
    cmd.date_et_heure_de_retrait_souhaitees && 
    isToday(new Date(cmd.date_et_heure_de_retrait_souhaitees))
  ) || [];

  const commandesFutures = commandes?.filter(cmd => 
    cmd.date_et_heure_de_retrait_souhaitees && 
    isFuture(new Date(cmd.date_et_heure_de_retrait_souhaitees))
  ) || [];

  const commandesEnAttente = commandes?.filter(cmd => 
    cmd.statut === 'en_attente' || cmd.statut === 'en_preparation'
  ) || [];

  const chiffreAffairesHebdo = commandes
    ?.filter(cmd => cmd.prix_total && cmd.statut === 'terminee')
    ?.reduce((total, cmd) => total + (cmd.prix_total || 0), 0) || 0;

  const statCards = [
    {
      title: 'Commandes Aujourd\'hui',
      value: commandesAujourdhui.length,
      icon: Calendar,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'En Attente',
      value: commandesEnAttente.length,
      icon: Clock,
      color: 'bg-orange-500',
      urgent: commandesEnAttente.length > 5
    },
    {
      title: 'Clients Actifs',
      value: clients?.length || 0,
      icon: Users,
      color: 'bg-green-500',
      trend: '+5%'
    },
    {
      title: 'CA Semaine',
      value: `${chiffreAffairesHebdo.toFixed(2)}€`,
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: '+18%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-thai-green mt-2">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {stat.trend}
                      </p>
                    )}
                    {stat.urgent && (
                      <Badge variant="destructive" className="mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-thai-green">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-thai-orange hover:bg-thai-orange/90 h-20 flex-col gap-2"
              onClick={() => window.location.href = '/admin/commandes'}
            >
              <ShoppingBasket className="w-6 h-6" />
              Voir les Commandes
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-thai-green text-thai-green hover:bg-thai-green/10"
              onClick={() => window.location.href = '/admin/plats'}
            >
              <Package className="w-6 h-6" />
              Gérer les Plats
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-thai-green text-thai-green hover:bg-thai-green/10"
              onClick={() => window.location.href = '/admin/clients'}
            >
              <Users className="w-6 h-6" />
              Voir les Clients
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Commandes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-thai-green">Commandes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commandes?.slice(0, 5).map((commande) => (
                <div key={commande.idcommande} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Commande #{commande.idcommande}</p>
                    <p className="text-sm text-gray-600">
                      {commande.date_et_heure_de_retrait_souhaitees && 
                        format(new Date(commande.date_et_heure_de_retrait_souhaitees), 'dd/MM/yyyy HH:mm', { locale: fr })
                      }
                    </p>
                  </div>
                  <Badge 
                    variant={commande.statut === 'terminee' ? 'default' : 'secondary'}
                    className={
                      commande.statut === 'terminee' ? 'bg-green-100 text-green-800' :
                      commande.statut === 'en_preparation' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {commande.statut}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-thai-green">Plats Populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plats?.slice(0, 5).map((plat) => (
                <div key={plat.idplats} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {plat.url_photo && (
                      <img 
                        src={plat.url_photo} 
                        alt={plat.nom_plat}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{plat.nom_plat}</p>
                      <p className="text-sm text-gray-600">{plat.prix}€</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {plat.disponible ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AdminTableauDeBord;