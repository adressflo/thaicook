import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Clock,
  Database,
  Euro,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalClients: number;
  avgOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
  clientGrowth: number;
  popularDishes: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: Date;
  }>;
}

const SupabaseAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Données simulées pour la démonstration
  // ----- NOUVEAU BLOC CORRIGÉ -----
  const mockData = useMemo(
    (): AnalyticsData => ({
      totalRevenue: 15420.5,
      totalOrders: 89,
      totalClients: 7,
      avgOrderValue: 173.26,
      revenueGrowth: 12.5,
      orderGrowth: 8.3,
      clientGrowth: 15.7,
      popularDishes: [
        { name: 'Pad Thaï aux Crevettes', orders: 23, revenue: 1265.0 },
        { name: 'Curry Vert au Poulet', orders: 18, revenue: 990.0 },
        { name: 'Tom Yum Kung', orders: 15, revenue: 825.0 },
        { name: 'Salade de Papaye', orders: 12, revenue: 660.0 },
      ],
      ordersByStatus: [
        { status: 'En attente', count: 5, percentage: 25 },
        { status: 'En préparation', count: 8, percentage: 40 },
        { status: 'Prêt', count: 4, percentage: 20 },
        { status: 'Livré', count: 3, percentage: 15 },
      ],
      recentActivity: [
        {
          type: 'order',
          description: 'Nouvelle commande #1234 - Marie D.',
          timestamp: new Date(Date.now() - 5 * 60000),
        },
        {
          type: 'payment',
          description: 'Paiement reçu - 45.90€',
          timestamp: new Date(Date.now() - 10 * 60000),
        },
        {
          type: 'client',
          description: 'Nouveau client inscrit - Jean M.',
          timestamp: new Date(Date.now() - 20 * 60000),
        },
        {
          type: 'event',
          description: 'Événement confirmé - Anniversaire',
          timestamp: new Date(Date.now() - 30 * 60000),
        },
      ],
    }),
    []
  ); // Le tableau vide [] signifie que l'objet n'est créé qu'une seule fois.
  // 1. La fonction `loadData` est maintenant définie AVANT le `useEffect`
  // 2. Elle est enveloppée dans `useCallback` pour l'optimisation
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Simuler l'appel à l'API Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ajouter une petite variation aux données pour simuler les changements en temps réel
      const updatedData = {
        ...mockData,
        totalRevenue: mockData.totalRevenue + Math.random() * 100 - 50,
        totalOrders: mockData.totalOrders + Math.floor(Math.random() * 3),
      };

      setData(updatedData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  }, [mockData]); // On indique que cette fonction ne dépend que de `mockData`

  // 3. Le `useEffect` peut maintenant utiliser `loadData` en toute sécurité
  useEffect(() => {
    loadData();

    // Mise à jour automatique toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return timestamp.toLocaleDateString('fr-FR');
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className='w-4 h-4 text-green-500' />
    ) : (
      <TrendingDown className='w-4 h-4 text-red-500' />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-500' : 'text-red-500';
  };

  if (loading && !data) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-center p-8'>
          <RefreshCw className='w-8 h-8 animate-spin text-thai-orange' />
          <span className='ml-2 text-thai-green'>Chargement des analytics...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-thai-green flex items-center space-x-2'>
            <Database className='w-6 h-6' />
            <span>Analytics Supabase</span>
          </h2>
          <p className='text-gray-600 mt-1'>
            Données en temps réel - Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <Button
          onClick={loadData}
          disabled={loading}
          variant='outline'
          className='flex items-center space-x-2'
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </Button>
      </div>

      {/* KPIs principaux */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='border-thai-orange/20'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-thai-green'>
              Chiffre d'affaires
            </CardTitle>
            <Euro className='h-4 w-4 text-thai-orange' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-thai-green'>
              {formatCurrency(data.totalRevenue)}
            </div>
            <div className={`flex items-center text-xs ${getGrowthColor(data.revenueGrowth)}`}>
              {getGrowthIcon(data.revenueGrowth)}
              <span className='ml-1'>
                {data.revenueGrowth > 0 ? '+' : ''}
                {data.revenueGrowth.toFixed(1)}% ce mois
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='border-thai-orange/20'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-thai-green'>Commandes</CardTitle>
            <ShoppingCart className='h-4 w-4 text-thai-orange' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-thai-green'>{data.totalOrders}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(data.orderGrowth)}`}>
              {getGrowthIcon(data.orderGrowth)}
              <span className='ml-1'>
                {data.orderGrowth > 0 ? '+' : ''}
                {data.orderGrowth.toFixed(1)}% ce mois
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='border-thai-orange/20'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-thai-green'>Clients</CardTitle>
            <Users className='h-4 w-4 text-thai-orange' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-thai-green'>{data.totalClients}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(data.clientGrowth)}`}>
              {getGrowthIcon(data.clientGrowth)}
              <span className='ml-1'>
                {data.clientGrowth > 0 ? '+' : ''}
                {data.clientGrowth.toFixed(1)}% ce mois
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='border-thai-orange/20'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-thai-green'>Panier Moyen</CardTitle>
            <TrendingUp className='h-4 w-4 text-thai-orange' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-thai-green'>
              {formatCurrency(data.avgOrderValue)}
            </div>
            <p className='text-xs text-gray-600'>Par commande</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Plats populaires */}
        <Card>
          <CardHeader>
            <CardTitle className='text-thai-green'>Plats Populaires</CardTitle>
            <CardDescription>Top des ventes ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {data.popularDishes.map((dish, index) => (
                <div key={dish.name} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <Badge
                      variant='outline'
                      className='w-6 h-6 rounded-full p-0 flex items-center justify-center'
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <p className='font-medium text-thai-green'>{dish.name}</p>
                      <p className='text-sm text-gray-600'>{dish.orders} commandes</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold text-thai-green'>{formatCurrency(dish.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statut des commandes */}
        <Card>
          <CardHeader>
            <CardTitle className='text-thai-green'>Statut des Commandes</CardTitle>
            <CardDescription>Répartition actuelle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {data.ordersByStatus.map(status => (
                <div key={status.status} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-thai-green'>{status.status}</span>
                    <span className='text-sm text-gray-600'>{status.count} commandes</span>
                  </div>
                  <Progress value={status.percentage} className='h-2' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 text-thai-green'>
            <Activity className='w-5 h-5' />
            <span>Activité Récente</span>
          </CardTitle>
          <CardDescription>Événements en temps réel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {data.recentActivity.map((activity, index) => (
              <div
                key={index}
                className='flex items-center space-x-3 p-2 rounded-lg bg-thai-cream/30'
              >
                <div className='w-2 h-2 bg-thai-orange rounded-full' />
                <div className='flex-1'>
                  <p className='text-sm font-medium text-thai-green'>{activity.description}</p>
                </div>
                <div className='flex items-center space-x-1 text-xs text-gray-500'>
                  <Clock className='w-3 h-3' />
                  <span>{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseAnalytics;
