'use client';

import { memo, useState, useEffect } from 'react';
import { useParams, redirect } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSession } from '@/lib/auth-client';
import { getClientProfile } from '@/app/profil/actions';
import { usePrismaEvenementById } from "@/hooks/usePrismaData";
import { useData } from '@/contexts/DataContext';
import { extractRouteParam } from '@/lib/params-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, ArrowLeft, Calendar, Users, Edit, Clock, PartyPopper } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DishDetailsModal } from '@/components/historique/DishDetailsModal';
import { cn } from '@/lib/utils';
import type { PlatUI as Plat } from '@/types/app';

const SuiviEvenement = memo(() => {
  const params = useParams();
  const id = extractRouteParam(params?.id);
  const { data: session, isPending: isLoadingAuth } = useSession();
  const currentUser = session?.user;
  const [clientProfile, setClientProfile] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile);
    } else {
      setClientProfile(null);
    }
  }, [currentUser?.id]);

  const { data: evenement, isLoading: isLoadingEvenement, error } = usePrismaEvenementById(id ? Number(id) : undefined);
  const { plats, isLoading: platsLoading } = useData();

  if (isLoadingAuth || isLoadingEvenement || platsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-thai-orange" />
      </div>
    );
  }

  if (error || !evenement) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les détails de cet événement. Il n'existe peut-être pas ou a été supprimé.
          </AlertDescription>
           <Button asChild variant="secondary" className="mt-4">
             <Link href="/historique">Retour à l'historique</Link>
           </Button>
        </Alert>
      </div>
    );
  }

  // Vérifie que l'utilisateur connecté est bien le propriétaire de l'événement
  if (clientProfile?.idclient !== evenement.contact_client_r) {
    redirect('/historique');
  }

  // Vérifier si l'événement peut être modifié
  const canEdit = (evenement.statut_evenement as any) !== 'Réalisé' && (evenement.statut_evenement as any) !== 'Payé intégralement';

  // Fonction pour obtenir la couleur du statut
  const getStatutColor = (statut: string | null) => {
    if (!statut) return 'bg-gray-100 text-gray-800 border-gray-300';

    if (statut === 'Confirmé / Acompte reçu' || statut === 'Payé intégralement' || statut === 'Réalisé') {
      return 'bg-green-100 text-green-800 border-green-300';
    } else if (statut === 'En préparation' || statut === 'Contact établi') {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (statut === 'Annulé') {
      return 'bg-red-100 text-red-800 border-red-300';
    } else {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  // Fonction pour obtenir les plats présélectionnés
  const getPlatsPreselectionnes = () => {
    if (!evenement.plats_preselectionnes || !plats) return [];
    return plats.filter(plat =>
      evenement.plats_preselectionnes?.includes(plat.idplats)
    );
  };

  const platsSelectionnes = getPlatsPreselectionnes();

  // Fonction pour formater les prix (ajout pour le modal)
  const formatPrix = (prix: number): string => {
    return prix % 1 === 0
      ? `${prix}€`
      : `${prix.toFixed(2).replace('.', ',')}€`;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai">
        {/* Bouton retour et navigation */}
        <div className="py-6 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-6 flex justify-between items-center">
              <Link href="/historique" passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className="
                    bg-white/90 backdrop-blur-sm hover:bg-white
                    border-thai-orange/20 hover:border-thai-orange/40
                    text-thai-green hover:text-thai-green
                    transition-all duration-200
                    shadow-md hover:shadow-lg
                    rounded-full px-4 py-2
                    group
                  "
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline">Retour à l'historique</span>
                  <span className="sm:hidden">Historique</span>
                </Button>
              </Link>

              {canEdit && (
                <Link href={`/modifier-evenement/${evenement.idevenements}`} passHref>
                  <Button
                    variant="default"
                    size="sm"
                    className="
                      bg-gradient-to-r from-thai-green to-thai-orange
                      hover:from-thai-green/90 hover:to-thai-orange/90
                      transition-all duration-200 hover:scale-105 hover:shadow-xl
                      rounded-full px-4 py-2
                      group
                    "
                  >
                    <Edit className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                    <span className="hidden sm:inline">Modifier</span>
                    <span className="sm:hidden">Éditer</span>
                  </Button>
                </Link>
              )}
            </div>

            <div>
              <Card className="shadow-xl border-thai-green/20">
                  <CardHeader className="text-center bg-gradient-to-r from-thai-green to-thai-orange text-white rounded-t-lg py-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <PartyPopper className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl md:text-4xl font-bold">
                        Suivi de votre Événement
                      </CardTitle>
                    </div>
                    <CardDescription className="text-white/90 px-4 text-lg max-w-2xl mx-auto">
                      Suivez l'évolution de votre événement en temps réel.
                    </CardDescription>
                    <div className="flex items-center justify-center mt-4 text-white/80 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Statut: {evenement.statut_evenement || 'Demande initiale'}
                      </span>
                    </div>
                  </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Informations principales */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-thai-orange/20">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-thai-orange" />
                        <h3 className="font-semibold text-thai-green">Détails de l'événement</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nom de l'événement</p>
                          <p className="font-semibold text-thai-green">{evenement.nom_evenement}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Type d'événement</p>
                          <p className="font-medium text-thai-orange">{evenement.type_d_evenement || 'Non spécifié'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date et heure prévues</p>
                          <p className="font-semibold text-lg flex items-center gap-2">
                            <Clock className="h-4 w-4 text-thai-orange" />
                            {evenement.date_evenement ?
                              format(new Date(evenement.date_evenement), 'eeee dd MMMM yyyy à HH:mm', { locale: fr })
                              : 'Date non définie'
                            }
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
                        <Users className="h-5 w-5 text-thai-orange" />
                        <h3 className="font-semibold text-thai-green">Informations pratiques</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Statut actuel</p>
                          <Badge className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3", getStatutColor(evenement.statut_evenement))}>
                            {evenement.statut_evenement || 'Demande initiale'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nombre de personnes</p>
                          <p className="font-semibold text-lg text-thai-green flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {evenement.nombre_de_personnes || 'Non spécifié'}
                          </p>
                        </div>
                        {evenement.budget_client && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Budget indicatif</p>
                            <p className="font-semibold text-thai-green">{evenement.budget_client}€</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-500">Demande créée le</p>
                          <p className="text-sm">{evenement.created_at ? format(new Date(evenement.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr }) : 'Date inconnue'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Plats présélectionnés */}
              {platsSelectionnes.length > 0 && (
                <Card className="border-thai-orange/20 animate-fadeIn shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-thai-green mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-thai-orange" />
                      Plats présélectionnés ({platsSelectionnes.length})
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {platsSelectionnes.map((plat: Plat, index: number) => {
                        // Préparer les données pour le modal
                        const detailForModal = {
                          commande_r: 0, // ID fictif pour les événements
                          iddetails: index, // Utiliser l'index comme ID fictif
                          plat_r: plat.idplats,
                          quantite_plat_commande: 1, // Quantité par défaut pour les événements
                          nom_plat: plat.plat || null,
                          prix_unitaire: plat.prix || null,
                          type: 'plat' as const,
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
                            jeudi_dispo: plat.jeudi_dispo || '18:00-20:30',
                            lundi_dispo: plat.lundi_dispo || '18:00-20:30',
                            mardi_dispo: plat.mardi_dispo || '18:00-20:30',
                            mercredi_dispo: plat.mercredi_dispo || '18:00-20:30',
                            raison_epuisement: plat.raison_epuisement || null,
                            samedi_dispo: plat.samedi_dispo || null,
                            vendredi_dispo: plat.vendredi_dispo || null
                          }
                        } as any; // Type casting pour compatibilité Prisma types

                        return (
                          <DishDetailsModal
                            key={plat.id}
                            detail={detailForModal}
                            formatPrix={formatPrix}
                          >
                            <Card
                              className="border-thai-orange/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 animate-fadeIn"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {plat.photo_du_plat && (
                                <div className="aspect-video overflow-hidden rounded-t-lg">
                                  <img
                                    src={plat.photo_du_plat}
                                    alt={plat.plat}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                  />
                                </div>
                              )}
                              <CardContent className="p-3">
                                <h4 className="font-semibold text-thai-green text-sm hover:text-thai-orange transition-colors duration-200">
                                  {plat.plat}
                                </h4>
                                {plat.prix && (
                                  <p className="text-xs text-thai-orange font-medium mt-1">
                                    {formatPrix(parseFloat(plat.prix))}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </DishDetailsModal>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Demandes spéciales */}
              {evenement.demandes_speciales_evenement && (
                <Card className="border-thai-orange/20 animate-fadeIn shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <PartyPopper className="h-5 w-5 text-thai-orange" />
                      <h3 className="font-semibold text-thai-green text-lg">Demandes spéciales / Thème</h3>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-thai-cream/60 to-thai-gold/20 rounded-xl border border-thai-orange/10 shadow-sm">
                      <p className="text-gray-700 leading-relaxed font-medium">{evenement.demandes_speciales_evenement}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Statut et informations pratiques */}
              <Card className="border-thai-green/20 bg-gradient-to-br from-thai-cream/40 to-thai-gold/15 animate-fadeIn shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center space-y-6">
                    {((evenement.statut_evenement as any) === 'Demande initiale' ||
                      (evenement.statut_evenement as any) === 'En préparation' ||
                      (evenement.statut_evenement as any) === 'Contact établi') && (
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100/70 border-2 border-blue-200/60 rounded-xl shadow-lg backdrop-blur-sm">
                        <p className="text-blue-800 text-center font-semibold text-lg leading-relaxed">
                          🎉 Votre demande d'événement est en cours de traitement. Nous vous recontacterons prochainement pour finaliser les détails.
                        </p>
                      </div>
                    )}

                    {(evenement.statut_evenement as any) === 'Confirmé / Acompte reçu' && (
                      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/70 border-2 border-green-200/60 rounded-xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-12 h-12 bg-green-200/50 rounded-full flex items-center justify-center">
                            <PartyPopper className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <p className="text-green-800 text-center font-semibold text-lg leading-relaxed">
                          ✅ Votre événement est confirmé ! Nous préparons tout pour que ce soit parfait.
                        </p>
                      </div>
                    )}

                    {(evenement.statut_evenement as any) === 'Réalisé' && (
                      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-100/70 border-2 border-emerald-200/60 rounded-xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-12 h-12 bg-emerald-200/50 rounded-full flex items-center justify-center">
                            <PartyPopper className="h-6 w-6 text-emerald-600 animate-pulse" />
                          </div>
                        </div>
                        <p className="text-emerald-800 text-center font-semibold text-lg leading-relaxed">
                          🎊 Votre événement a été réalisé avec succès ! Merci de nous avoir fait confiance.
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
  );
});

SuiviEvenement.displayName = 'SuiviEvenement';
export default SuiviEvenement;
