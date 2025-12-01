"use client"

import { getClientProfile } from "@/app/profil/actions"
import { DishDetailsModal } from "@/components/historique/DishDetailsModal"
import { AppLayout } from "@/components/layout/AppLayout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/contexts/DataContext"
import { usePrismaEvenementById } from "@/hooks/usePrismaData"
import { useSession } from "@/lib/auth-client"
import { extractRouteParam } from "@/lib/params-utils"
import { cn } from "@/lib/utils"
import type { PlatUI as Plat } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Loader2,
  PartyPopper,
  Users,
} from "lucide-react"
import Link from "next/link"
import { redirect, useParams } from "next/navigation"
import { memo, useEffect, useState } from "react"

const SuiviEvenement = memo(() => {
  const params = useParams()
  const id = extractRouteParam(params?.id)
  const { data: session, isPending: isLoadingAuth } = useSession()
  const currentUser = session?.user
  const [clientProfile, setClientProfile] = useState<any>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
  }, [currentUser?.id])

  const {
    data: evenement,
    isLoading: isLoadingEvenement,
    error,
  } = usePrismaEvenementById(id ? Number(id) : undefined)
  const { plats, isLoading: platsLoading } = useData()

  if (isLoadingAuth || isLoadingEvenement || platsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-thai-orange h-16 w-16 animate-spin" />
      </div>
    )
  }

  if (error || !evenement) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les détails de cet événement. Il n'existe peut-être pas ou a été
            supprimé.
          </AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/historique">Retour à l'historique</Link>
          </Button>
        </Alert>
      </div>
    )
  }

  // Vérifie que l'utilisateur connecté est bien le propriétaire de l'événement
  if (clientProfile?.idclient !== evenement.contact_client_r) {
    redirect("/historique")
  }

  // Vérifier si l'événement peut être modifié
  const canEdit =
    (evenement.statut_evenement as any) !== "Réalisé" &&
    (evenement.statut_evenement as any) !== "Payé intégralement"

  // Fonction pour obtenir la couleur du statut
  const getStatutColor = (statut: string | null) => {
    if (!statut) return "bg-gray-100 text-gray-800 border-gray-300"

    if (
      statut === "Confirmé / Acompte reçu" ||
      statut === "Payé intégralement" ||
      statut === "Réalisé"
    ) {
      return "bg-green-100 text-green-800 border-green-300"
    } else if (statut === "En préparation" || statut === "Contact établi") {
      return "bg-blue-100 text-blue-800 border-blue-300"
    } else if (statut === "Annulé") {
      return "bg-red-100 text-red-800 border-red-300"
    } else {
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    }
  }

  // Fonction pour obtenir les plats présélectionnés
  const getPlatsPreselectionnes = () => {
    if (!evenement.plats_preselectionnes || !plats) return []
    return plats.filter((plat) => evenement.plats_preselectionnes?.includes(plat.idplats))
  }

  const platsSelectionnes = getPlatsPreselectionnes()

  // Fonction pour formater les prix (ajout pour le modal)
  const formatPrix = (prix: number): string => {
    return prix % 1 === 0 ? `${prix}€` : `${prix.toFixed(2).replace(".", ",")}€`
  }

  return (
    <AppLayout>
      <div className="bg-gradient-thai min-h-screen">
        {/* Bouton retour et navigation */}
        <div className="px-4 py-6">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/historique" passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-thai-orange/20 hover:border-thai-orange/40 text-thai-green hover:text-thai-green group rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="hidden sm:inline">Retour à l'historique</span>
                  <span className="sm:hidden">Historique</span>
                </Button>
              </Link>

              {canEdit && (
                <Link href={`/modifier-evenement/${evenement.idevenements}`} passHref>
                  <Button
                    variant="default"
                    size="sm"
                    className="from-thai-green to-thai-orange hover:from-thai-green/90 hover:to-thai-orange/90 group rounded-full bg-linear-to-r px-4 py-2 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  >
                    <Edit className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                    <span className="hidden sm:inline">Modifier</span>
                    <span className="sm:hidden">Éditer</span>
                  </Button>
                </Link>
              )}
            </div>

            <div>
              <Card className="border-thai-green/20 shadow-xl">
                <CardHeader className="from-thai-green to-thai-orange rounded-t-lg bg-linear-to-r py-8 text-center text-white">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                      <PartyPopper className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold md:text-4xl">
                      Suivi de votre Événement
                    </CardTitle>
                  </div>
                  <CardDescription className="mx-auto max-w-2xl px-4 text-lg text-white/90">
                    Suivez l'évolution de votre événement en temps réel.
                  </CardDescription>
                  <div className="mt-4 flex items-center justify-center text-sm text-white/80">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Statut: {evenement.statut_evenement || "Demande initiale"}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 p-6 md:p-8">
                  {/* Informations principales */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-thai-orange/20">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-thai-orange h-5 w-5" />
                            <h3 className="text-thai-green font-semibold">
                              Détails de l'événement
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Nom de l'événement
                              </p>
                              <p className="text-thai-green font-semibold">
                                {evenement.nom_evenement}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Type d'événement</p>
                              <p className="text-thai-orange font-medium">
                                {evenement.type_d_evenement || "Non spécifié"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Date et heure prévues
                              </p>
                              <p className="flex items-center gap-2 text-lg font-semibold">
                                <Clock className="text-thai-orange h-4 w-4" />
                                {evenement.date_evenement
                                  ? format(
                                      new Date(evenement.date_evenement),
                                      "eeee dd MMMM yyyy à HH:mm",
                                      { locale: fr }
                                    )
                                  : "Date non définie"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-thai-orange/20">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Users className="text-thai-orange h-5 w-5" />
                            <h3 className="text-thai-green font-semibold">
                              Informations pratiques
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Statut actuel</p>
                              <Badge
                                className={cn(
                                  "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium",
                                  getStatutColor(evenement.statut_evenement)
                                )}
                              >
                                {evenement.statut_evenement || "Demande initiale"}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Nombre de personnes
                              </p>
                              <p className="text-thai-green flex items-center gap-1 text-lg font-semibold">
                                <Users className="h-4 w-4" />
                                {evenement.nombre_de_personnes || "Non spécifié"}
                              </p>
                            </div>
                            {evenement.budget_client && (
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Budget indicatif
                                </p>
                                <p className="text-thai-green font-semibold">
                                  {evenement.budget_client}€
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-500">Demande créée le</p>
                              <p className="text-sm">
                                {evenement.created_at
                                  ? format(
                                      new Date(evenement.created_at),
                                      "dd MMMM yyyy 'à' HH:mm",
                                      { locale: fr }
                                    )
                                  : "Date inconnue"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Plats présélectionnés */}
                  {platsSelectionnes.length > 0 && (
                    <Card className="border-thai-orange/20 animate-fadeIn shadow-lg transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-4">
                        <h3 className="text-thai-green mb-4 flex items-center gap-2 font-semibold">
                          <Calendar className="text-thai-orange h-5 w-5" />
                          Plats présélectionnés ({platsSelectionnes.length})
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {platsSelectionnes.map((plat: Plat, index: number) => {
                            // Préparer les données pour le modal
                            const detailForModal = {
                              commande_r: 0, // ID fictif pour les événements
                              iddetails: index, // Utiliser l'index comme ID fictif
                              plat_r: plat.idplats,
                              quantite_plat_commande: 1, // Quantité par défaut pour les événements
                              nom_plat: plat.plat || null,
                              prix_unitaire: plat.prix || null,
                              type: "plat" as const,
                              extra_id: null,
                              plat: {
                                idplats: plat.idplats,
                                plat: plat.plat,
                                prix: plat.prix || 0,
                                description: plat.description || null,
                                photo_du_plat: plat.photo_du_plat || null,
                                dimanche_dispo: plat.dimanche_dispo || null,
                                epuise_depuis: plat.epuise_depuis || null,
                                epuise_jusqu_a: plat.epuise_jusqu_a || null,
                                est_epuise: plat.est_epuise || false,
                                jeudi_dispo: plat.jeudi_dispo || "18:00-20:30",
                                lundi_dispo: plat.lundi_dispo || "18:00-20:30",
                                mardi_dispo: plat.mardi_dispo || "18:00-20:30",
                                mercredi_dispo: plat.mercredi_dispo || "18:00-20:30",
                                raison_epuisement: plat.raison_epuisement || null,
                                samedi_dispo: plat.samedi_dispo || null,
                                vendredi_dispo: plat.vendredi_dispo || null,
                              },
                            } as any // Type casting pour compatibilité Prisma types

                            return (
                              <DishDetailsModal
                                key={plat.id}
                                detail={detailForModal}
                                formatPrix={formatPrix}
                              >
                                <Card
                                  className="border-thai-orange/20 hover:border-thai-orange hover:ring-thai-orange/30 animate-fadeIn cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-2"
                                  style={{ animationDelay: `${index * 100}ms` }}
                                >
                                  {plat.photo_du_plat && (
                                    <div className="aspect-video overflow-hidden rounded-t-lg">
                                      <img
                                        src={plat.photo_du_plat}
                                        alt={plat.plat}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                      />
                                    </div>
                                  )}
                                  <CardContent className="p-3">
                                    <h4 className="text-thai-green hover:text-thai-orange text-sm font-semibold transition-colors duration-200">
                                      {plat.plat}
                                    </h4>
                                    {plat.prix && (
                                      <p className="text-thai-orange mt-1 text-xs font-medium">
                                        {formatPrix(parseFloat(plat.prix))}
                                      </p>
                                    )}
                                  </CardContent>
                                </Card>
                              </DishDetailsModal>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Demandes spéciales */}
                  {evenement.demandes_speciales_evenement && (
                    <Card className="border-thai-orange/20 animate-fadeIn shadow-lg transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                          <PartyPopper className="text-thai-orange h-5 w-5" />
                          <h3 className="text-thai-green text-lg font-semibold">
                            Demandes spéciales / Thème
                          </h3>
                        </div>
                        <div className="from-thai-cream/60 to-thai-gold/20 border-thai-orange/10 rounded-xl border bg-linear-to-br p-5 shadow-sm">
                          <p className="leading-relaxed font-medium text-gray-700">
                            {evenement.demandes_speciales_evenement}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Statut et informations pratiques */}
                  <Card className="border-thai-green/20 from-thai-cream/40 to-thai-gold/15 animate-fadeIn bg-linear-to-br shadow-xl">
                    <CardContent className="p-6">
                      <div className="space-y-6 text-center">
                        {((evenement.statut_evenement as any) === "Demande initiale" ||
                          (evenement.statut_evenement as any) === "En préparation" ||
                          (evenement.statut_evenement as any) === "Contact établi") && (
                          <div className="rounded-xl border-2 border-blue-200/60 bg-linear-to-r from-blue-50 to-blue-100/70 p-6 shadow-lg backdrop-blur-sm">
                            <p className="text-center text-lg leading-relaxed font-semibold text-blue-800">
                              🎉 Votre demande d'événement est en cours de traitement. Nous vous
                              recontacterons prochainement pour finaliser les détails.
                            </p>
                          </div>
                        )}

                        {(evenement.statut_evenement as any) === "Confirmé / Acompte reçu" && (
                          <div className="rounded-xl border-2 border-green-200/60 bg-linear-to-r from-green-50 to-green-100/70 p-6 shadow-lg backdrop-blur-sm">
                            <div className="mb-3 flex items-center justify-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200/50">
                                <PartyPopper className="h-6 w-6 text-green-600" />
                              </div>
                            </div>
                            <p className="text-center text-lg leading-relaxed font-semibold text-green-800">
                              ✅ Votre événement est confirmé ! Nous préparons tout pour que ce soit
                              parfait.
                            </p>
                          </div>
                        )}

                        {(evenement.statut_evenement as any) === "Réalisé" && (
                          <div className="rounded-xl border-2 border-emerald-200/60 bg-linear-to-r from-green-50 to-emerald-100/70 p-6 shadow-lg backdrop-blur-sm">
                            <div className="mb-3 flex items-center justify-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-200/50">
                                <PartyPopper className="h-6 w-6 animate-pulse text-emerald-600" />
                              </div>
                            </div>
                            <p className="text-center text-lg leading-relaxed font-semibold text-emerald-800">
                              🎊 Votre événement a été réalisé avec succès ! Merci de nous avoir
                              fait confiance.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
})

SuiviEvenement.displayName = "SuiviEvenement"
export default SuiviEvenement
