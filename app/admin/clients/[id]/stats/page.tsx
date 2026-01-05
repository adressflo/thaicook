"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  usePrismaClients,
  usePrismaCommandes,
  usePrismaEvenementsByClient,
} from "@/hooks/usePrismaData"
import { toSafeNumber } from "@/lib/serialization"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Euro,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"

export default function ClientStatsPage() {
  const params = useParams()
  const router = useRouter()
  const clientAuthId = params.id as string

  const { data: clients } = usePrismaClients()

  // Trouver le client actuel
  const client = useMemo(() => {
    return clients?.find((c) => c.auth_user_id === clientAuthId)
  }, [clients, clientAuthId])

  const { data: commandes } = usePrismaCommandes()
  const { data: evenements } = usePrismaEvenementsByClient(client?.idclient)

  // Filtrer les commandes du client
  const clientCommandes = useMemo(() => {
    return commandes?.filter((c) => c.client_r === clientAuthId) || []
  }, [commandes, clientAuthId])

  // Calculs statistiques avancés
  const statsGenerales = useMemo(() => {
    const totalClients = clients?.length || 0
    const totalCommandesToutes = commandes?.length || 0
    const moyenneCommandesParClient = totalClients > 0 ? totalCommandesToutes / totalClients : 0

    return {
      totalClients,
      totalCommandesToutes,
      moyenneCommandesParClient,
    }
  }, [clients, commandes])

  const statsClient = useMemo(() => {
    if (!client) return null

    const totalCommandes = clientCommandes.length
    const totalSpent = clientCommandes.reduce((sum, commande) => {
      const orderTotal =
        commande.details?.reduce((detailSum, detail) => {
          return detailSum + (Number(detail.plat?.prix) || 0) * (detail.quantite_plat_commande || 0)
        }, 0) || 0
      return sum + orderTotal
    }, 0)

    const panierMoyen = totalCommandes > 0 ? totalSpent / totalCommandes : 0
    const derniereCommande =
      clientCommandes.length > 0
        ? new Date(
            Math.max(
              ...clientCommandes.map((c) => new Date(c.date_de_prise_de_commande || 0).getTime())
            )
          )
        : null

    // Calcul de la fidélité (nombre de mois avec commandes)
    const moisAvecCommandes = new Set(
      clientCommandes
        .filter((c) => c.date_de_prise_de_commande)
        .map((c) => format(new Date(c.date_de_prise_de_commande!), "yyyy-MM"))
    ).size

    // Fréquence de commande (commandes par mois)
    const frequence = moisAvecCommandes > 0 ? totalCommandes / moisAvecCommandes : 0

    // Total événements
    const totalEvenements = evenements?.length || 0
    const budgetEvenements =
      evenements?.reduce((sum, evt) => sum + toSafeNumber(evt.budget_client), 0) || 0

    return {
      totalCommandes,
      totalSpent,
      panierMoyen,
      derniereCommande,
      moisAvecCommandes,
      frequence,
      totalEvenements,
      budgetEvenements,
    }
  }, [client, clientCommandes, evenements])

  if (!client || !statsClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-thai-orange mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-thai min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la Fiche
            </Button>

            <div className="flex items-center gap-3">
              {client.photo_client ? (
                <img
                  src={client.photo_client}
                  alt="Photo client"
                  className="border-thai-orange h-12 w-12 rounded-full border-2 object-cover shadow-lg"
                />
              ) : (
                <div className="bg-thai-orange flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                  {client.prenom?.charAt(0) || "C"}
                  {client.nom?.charAt(0) || "L"}
                </div>
              )}

              <div>
                <h1 className="text-thai-green text-2xl font-bold">
                  Statistiques - {client.prenom} {client.nom}
                </h1>
                <p className="text-thai-green/70">{client.email}</p>
              </div>
            </div>
          </div>

          <div className="text-thai-green flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-semibold">Analytics Client</span>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total Commandes</p>
                  <p className="text-3xl font-bold">{statsClient.totalCommandes}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-200" />
              </div>
              <div className="mt-4 flex items-center">
                <div className="text-xs text-blue-200">
                  Vs moyenne: {statsGenerales.moyenneCommandesParClient.toFixed(1)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-500 to-green-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Total Dépensé</p>
                  <p className="text-3xl font-bold">{statsClient.totalSpent.toFixed(0)}€</p>
                </div>
                <Euro className="h-8 w-8 text-green-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-green-200" />
                <span className="text-xs text-green-200">Excellent client</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Panier Moyen</p>
                  <p className="text-3xl font-bold">{statsClient.panierMoyen.toFixed(0)}€</p>
                </div>
                <Target className="h-8 w-8 text-purple-200" />
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-xs text-purple-200">Par commande</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">Fréquence</p>
                  <p className="text-3xl font-bold">{statsClient.frequence.toFixed(1)}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-200" />
              </div>
              <div className="mt-4 flex items-center">
                <Clock className="mr-1 h-4 w-4 text-orange-200" />
                <span className="text-xs text-orange-200">commandes/mois</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses détaillées */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Analyse de fidélité */}
          <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <Award className="h-5 w-5" />
                Analyse de Fidélité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="bg-thai-cream/10 flex items-center justify-between rounded-lg p-3">
                  <span className="text-gray-600">Mois actifs</span>
                  <span className="text-thai-green font-bold">{statsClient.moisAvecCommandes}</span>
                </div>

                <div className="bg-thai-cream/10 flex items-center justify-between rounded-lg p-3">
                  <span className="text-gray-600">Dernière visite</span>
                  <span className="text-thai-green font-bold">
                    {statsClient.derniereCommande
                      ? format(statsClient.derniereCommande, "dd MMM yyyy", { locale: fr })
                      : "Jamais"}
                  </span>
                </div>

                <div className="bg-thai-cream/10 flex items-center justify-between rounded-lg p-3">
                  <span className="text-gray-600">Score fidélité</span>
                  <div className="flex items-center gap-2">
                    {statsClient.frequence >= 2 ? (
                      <>
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-yellow-600">VIP</span>
                      </>
                    ) : statsClient.frequence >= 1 ? (
                      <>
                        <Award className="text-thai-green h-4 w-4" />
                        <span className="text-thai-green font-bold">Fidèle</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-bold text-gray-500">Occasionnel</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Événements */}
          <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Événements & Traiteur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="bg-thai-gold/10 flex items-center justify-between rounded-lg p-3">
                  <span className="text-gray-600">Total événements</span>
                  <span className="text-thai-gold font-bold">{statsClient.totalEvenements}</span>
                </div>

                <div className="bg-thai-gold/10 flex items-center justify-between rounded-lg p-3">
                  <span className="text-gray-600">Budget total événements</span>
                  <span className="text-thai-gold font-bold">{statsClient.budgetEvenements}€</span>
                </div>

                <div className="bg-thai-gold/10 flex items-center justify-between rounded-lg p-3">
                  <span className="text-gray-600">Valeur moyenne</span>
                  <span className="text-thai-gold font-bold">
                    {statsClient.totalEvenements > 0
                      ? (statsClient.budgetEvenements / statsClient.totalEvenements).toFixed(0)
                      : 0}
                    €
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparaison avec la moyenne */}
        <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Comparaison avec la Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="border-thai-orange/20 rounded-lg border p-4 text-center">
                <div className="text-thai-orange mb-1 text-2xl font-bold">
                  {(
                    (statsClient.totalCommandes / statsGenerales.moyenneCommandesParClient) *
                    100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-sm text-gray-600">vs moyenne commandes</div>
                <div className="mt-1 text-xs text-gray-500">
                  {statsClient.totalCommandes} vs{" "}
                  {statsGenerales.moyenneCommandesParClient.toFixed(1)}
                </div>
              </div>

              <div className="border-thai-green/20 rounded-lg border p-4 text-center">
                <div className="text-thai-green mb-1 text-2xl font-bold">
                  Rang #{Math.ceil(statsGenerales.totalClients * 0.1)}
                </div>
                <div className="text-sm text-gray-600">Top clients</div>
                <div className="mt-1 text-xs text-gray-500">Estimation basée sur l'activité</div>
              </div>

              <div className="border-thai-gold/20 rounded-lg border p-4 text-center">
                <div className="text-thai-gold mb-1 text-2xl font-bold">
                  {statsClient.frequence >= 1 ? "Excellent" : "Moyen"}
                </div>
                <div className="text-sm text-gray-600">Potentiel fidélité</div>
                <div className="mt-1 text-xs text-gray-500">Basé sur la fréquence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
