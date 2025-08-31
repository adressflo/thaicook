'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Calendar,
  Euro,
  Target,
  Award,
  Clock,
  Activity
} from 'lucide-react';
import { useClients, useCommandes, useEvenementsByClient } from '@/hooks/useSupabaseData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import type { ClientUI, CommandeUI } from '@/types/app';

export default function ClientStatsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const { data: clients } = useClients();
  const { data: commandes } = useCommandes();
  const { data: evenements } = useEvenementsByClient(clientId);

  // Trouver le client actuel
  const client = useMemo(() => {
    return clients?.find(c => c.firebase_uid === clientId);
  }, [clients, clientId]);

  // Filtrer les commandes du client
  const clientCommandes = useMemo(() => {
    return commandes?.filter(c => c.client_r === clientId) || [];
  }, [commandes, clientId]);

  // Calculs statistiques avancés
  const statsGenerales = useMemo(() => {
    const totalClients = clients?.length || 0;
    const totalCommandesToutes = commandes?.length || 0;
    const moyenneCommandesParClient = totalClients > 0 ? totalCommandesToutes / totalClients : 0;
    
    return {
      totalClients,
      totalCommandesToutes,
      moyenneCommandesParClient
    };
  }, [clients, commandes]);

  const statsClient = useMemo(() => {
    if (!client) return null;

    const totalCommandes = clientCommandes.length;
    const totalSpent = clientCommandes.reduce((sum, commande) => {
      const orderTotal = commande.details?.reduce((detailSum, detail) => {
        return detailSum + ((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0));
      }, 0) || 0;
      return sum + orderTotal;
    }, 0);

    const panierMoyen = totalCommandes > 0 ? totalSpent / totalCommandes : 0;
    const derniereCommande = clientCommandes.length > 0 
      ? new Date(Math.max(...clientCommandes.map(c => new Date(c.date_de_prise_de_commande || 0).getTime())))
      : null;

    // Calcul de la fidélité (nombre de mois avec commandes)
    const moisAvecCommandes = new Set(
      clientCommandes
        .filter(c => c.date_de_prise_de_commande)
        .map(c => format(new Date(c.date_de_prise_de_commande!), 'yyyy-MM'))
    ).size;

    // Fréquence de commande (commandes par mois)
    const frequence = moisAvecCommandes > 0 ? totalCommandes / moisAvecCommandes : 0;

    // Total événements
    const totalEvenements = evenements?.length || 0;
    const budgetEvenements = evenements?.reduce((sum, evt) => sum + (evt.budget_client || 0), 0) || 0;

    return {
      totalCommandes,
      totalSpent,
      panierMoyen,
      derniereCommande,
      moisAvecCommandes,
      frequence,
      totalEvenements,
      budgetEvenements
    };
  }, [client, clientCommandes, evenements]);

  if (!client || !statsClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la Fiche
            </Button>
            
            <div className="flex items-center gap-3">
              {client.photo_client ? (
                <img 
                  src={client.photo_client} 
                  alt="Photo client" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-thai-orange shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold">
                  {client.prenom?.charAt(0) || 'C'}{client.nom?.charAt(0) || 'L'}
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-thai-green">
                  Statistiques - {client.prenom} {client.nom}
                </h1>
                <p className="text-thai-green/70">{client.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-thai-green">
            <BarChart3 className="w-6 h-6" />
            <span className="font-semibold">Analytics Client</span>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Commandes</p>
                  <p className="text-3xl font-bold">{statsClient.totalCommandes}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-200" />
              </div>
              <div className="mt-4 flex items-center">
                <div className="text-blue-200 text-xs">
                  Vs moyenne: {statsGenerales.moyenneCommandesParClient.toFixed(1)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Dépensé</p>
                  <p className="text-3xl font-bold">{statsClient.totalSpent.toFixed(0)}€</p>
                </div>
                <Euro className="w-8 h-8 text-green-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">Excellent client</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Panier Moyen</p>
                  <p className="text-3xl font-bold">{statsClient.panierMoyen.toFixed(0)}€</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-purple-200 text-xs">
                  Par commande
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Fréquence</p>
                  <p className="text-3xl font-bold">{statsClient.frequence.toFixed(1)}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-200" />
              </div>
              <div className="mt-4 flex items-center">
                <Clock className="w-4 h-4 text-orange-200 mr-1" />
                <span className="text-orange-200 text-xs">commandes/mois</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analyse de fidélité */}
          <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <Award className="w-5 h-5" />
                Analyse de Fidélité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-thai-cream/10 rounded-lg">
                  <span className="text-gray-600">Mois actifs</span>
                  <span className="font-bold text-thai-green">{statsClient.moisAvecCommandes}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-thai-cream/10 rounded-lg">
                  <span className="text-gray-600">Dernière visite</span>
                  <span className="font-bold text-thai-green">
                    {statsClient.derniereCommande 
                      ? format(statsClient.derniereCommande, 'dd MMM yyyy', { locale: fr })
                      : 'Jamais'
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-thai-cream/10 rounded-lg">
                  <span className="text-gray-600">Score fidélité</span>
                  <div className="flex items-center gap-2">
                    {statsClient.frequence >= 2 ? (
                      <>
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-yellow-600">VIP</span>
                      </>
                    ) : statsClient.frequence >= 1 ? (
                      <>
                        <Award className="w-4 h-4 text-thai-green" />
                        <span className="font-bold text-thai-green">Fidèle</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-500">Occasionnel</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Événements */}
          <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Événements & Traiteur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-thai-gold/10 rounded-lg">
                  <span className="text-gray-600">Total événements</span>
                  <span className="font-bold text-thai-gold">{statsClient.totalEvenements}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-thai-gold/10 rounded-lg">
                  <span className="text-gray-600">Budget total événements</span>
                  <span className="font-bold text-thai-gold">{statsClient.budgetEvenements}€</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-thai-gold/10 rounded-lg">
                  <span className="text-gray-600">Valeur moyenne</span>
                  <span className="font-bold text-thai-gold">
                    {statsClient.totalEvenements > 0 
                      ? (statsClient.budgetEvenements / statsClient.totalEvenements).toFixed(0)
                      : 0
                    }€
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparaison avec la moyenne */}
        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Comparaison avec la Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-thai-orange/20 rounded-lg">
                <div className="text-2xl font-bold text-thai-orange mb-1">
                  {((statsClient.totalCommandes / statsGenerales.moyenneCommandesParClient) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">vs moyenne commandes</div>
                <div className="text-xs text-gray-500 mt-1">
                  {statsClient.totalCommandes} vs {statsGenerales.moyenneCommandesParClient.toFixed(1)}
                </div>
              </div>

              <div className="text-center p-4 border border-thai-green/20 rounded-lg">
                <div className="text-2xl font-bold text-thai-green mb-1">
                  Rang #{Math.ceil(statsGenerales.totalClients * 0.1)}
                </div>
                <div className="text-sm text-gray-600">Top clients</div>
                <div className="text-xs text-gray-500 mt-1">
                  Estimation basée sur l'activité
                </div>
              </div>

              <div className="text-center p-4 border border-thai-gold/20 rounded-lg">
                <div className="text-2xl font-bold text-thai-gold mb-1">
                  {statsClient.frequence >= 1 ? 'Excellent' : 'Moyen'}
                </div>
                <div className="text-sm text-gray-600">Potentiel fidélité</div>
                <div className="text-xs text-gray-500 mt-1">
                  Basé sur la fréquence
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}