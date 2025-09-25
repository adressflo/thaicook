'use client';

import React, { memo } from 'react';
import { useParams, redirect } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCommandeById, useExtras } from '@/hooks/useSupabaseData';
import { useData } from '@/contexts/DataContext';
import { extractRouteParam } from '@/lib/params-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, ArrowLeft, ShoppingCart, Clock, CreditCard, Edit, CheckCircle, Package, Truck, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/historique/StatusBadge';
import { CalendarIcon } from '@/components/historique/CalendarIcon';
import { DishDetailsModalComplex } from '@/components/historique/DishDetailsModalComplex';
import { AppLayout } from '@/components/AppLayout';
import { ProgressTimeline } from '@/components/suivi-commande/ProgressTimeline';


const SuiviCommande = memo(() => {
  const params = useParams();
  const id = extractRouteParam(params?.id);
  const { currentUser, isLoadingAuth } = useAuth();
  const { data: commande, isLoading: isLoadingCommande, error } = useCommandeById(id ? Number(id) : undefined);
  const { plats, isLoading: platsLoading } = useData();
  const { data: extras, isLoading: extrasLoading } = useExtras();

  if (isLoadingAuth || isLoadingCommande || platsLoading || extrasLoading) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-thai-orange" />
        </div>
      </AppLayout>
    );
  }

  if (error || !commande) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center bg-gradient-thai p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de charger les détails de cette commande. Elle n'existe peut-être pas ou a été supprimée.
            </AlertDescription>
             <Button asChild variant="secondary" className="mt-4">
               <Link href="/historique">Retour à l'historique</Link>
             </Button>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  // Vérifie que l'utilisateur connecté est bien le propriétaire de la commande
  if (currentUser?.uid !== commande.client_r) {
    redirect('/historique');
  }

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  // Fonction pour calculer le total
  const calculateTotal = (): number => {
    if (!commande.details) return 0;
    return commande.details.reduce((total, detail) => {
      // Un extra est un détail sans plat mais avec plat_r
      const isExtra = !detail.plat && detail.plat_r;
      const prix = isExtra
        ? ((detail as any).extra?.prix || detail.prix_unitaire || 0)
        : (detail.plat?.prix || 0);
      const quantite = detail.quantite_plat_commande || 0;
      return total + (prix * quantite);
    }, 0);
  };

  // Fonction pour obtenir la couleur du badge de statut
  const getStatutColor = (statut: string | null): string => {
    switch (statut) {
      case 'En attente de confirmation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Confirmée':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'En préparation':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Prête à récupérer':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Récupérée':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Annulée':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Fonction pour obtenir les détails d'un plat
  const getPlatDetails = (platId: number) => {
    return plats?.find(p => p.idplats === platId);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button asChild variant="outline" className="mb-6 group transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <Link href="/historique" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Retour à l'historique
            </Link>
          </Button>

        <Card className="shadow-xl border-thai-orange/20 transform transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg animate-fade-in">
            <div className="flex items-center justify-center mb-2">
              <ShoppingCart className="h-8 w-8 mr-2 animate-pulse" />
              <CardTitle className="text-3xl font-bold">Suivi de votre Commande</CardTitle>
            </div>
            <CardDescription className="text-white/90 px-4">
              Statut: {commande.statut_commande || 'En attente'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Timeline de progression */}
            <Card className="border-thai-orange/20 bg-gradient-to-br from-thai-cream/20 to-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-thai-green mb-6 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-thai-orange" />
                  Suivi de votre commande
                </h3>
                <ProgressTimeline
                  currentStatus={commande.statut_commande || null}
                  dateCommande={commande.date_de_prise_de_commande}
                  dateRetrait={commande.date_et_heure_de_retrait_souhaitees}
                />
              </CardContent>
            </Card>

            {/* Articles commandés */}
            <Card className="border-thai-orange/20 animate-fade-in">
              <CardContent className="p-4">
                <h3 className="font-semibold text-thai-green mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-thai-orange" />
                  Plats commandés ({commande.details?.length || 0})
                </h3>
                {commande.details && commande.details.length > 0 ? (
                  <div className="border border-thai-orange/20 rounded-lg p-3 bg-thai-cream/20 space-y-4">
                    {commande.details.map((detail, index) => {
                      const platDetails = detail.plat_r ? getPlatDetails(detail.plat_r) : null;

                      // Détection hybride plus robuste des extras
                      const isExtraByPlat = platDetails?.plat?.includes('Extra') || platDetails?.plat?.includes('Complément');
                      const isExtraByMissingPlat = !platDetails && detail.plat_r && detail.plat_r > 0;
                      const isExtraByZeroId = detail.plat_r === 0 && detail.nom_plat; // Ancienne architecture: plat_r = 0 pour extras
                      const isExtra = isExtraByPlat || isExtraByMissingPlat || isExtraByZeroId;

                      const extraDetails = isExtra ? extras?.find((e: any) => e.idextra === detail.plat_r) : null;


                      // Adapter les données pour DishDetailsModal
                      const detailForModal = {
                        ...detail,
                        plat: platDetails || null,
                        extra: extraDetails || null
                      };
                      
                      return (
                        <DishDetailsModalComplex
                          key={`${detail.plat_r || 'unknown'}-${index}`}
                          detail={detailForModal}
                          formatPrix={formatPrix}
                        >
                          <div className="group relative animate-fadeIn hover:z-10 cursor-pointer"
                               style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform w-full">
                              
                              {/* Image du plat/extra */}
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={
                                    isExtra
                                      ? (extraDetails?.photo_url || 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png')
                                      : (platDetails?.photo_du_plat || '')
                                  }
                                  alt={
                                    isExtra
                                      ? (extraDetails?.nom_extra || detail.nom_plat || 'Extra')
                                      : (platDetails?.plat || 'Plat')
                                  }
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback pour les extras si l'image ne charge pas
                                    if (isExtra) {
                                      e.currentTarget.src = 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png';
                                    } else {
                                      // Pour les plats sans image, on affiche un placeholder
                                      e.currentTarget.style.display = 'none';
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        parent.innerHTML = '<div class="w-full h-full bg-thai-cream/30 border border-thai-orange/20 rounded-md flex items-center justify-center"><span class="text-thai-orange text-2xl">🍽️</span></div>';
                                      }
                                    }
                                  }}
                                />
                              </div>
                              
                              {/* Détails du plat */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-thai-green text-lg mb-1 truncate">
                                  {(() => {
                                    if (isExtra) {
                                      // Priorité 1: Extra trouvé via plat_r
                                      if (extraDetails?.nom_extra) {
                                        return extraDetails.nom_extra;
                                      }
                                      // Priorité 2: Nom direct depuis la commande (fallback)
                                      if (detail.nom_plat && detail.nom_plat !== 'Extra (Complément divers)') {
                                        return detail.nom_plat;
                                      }
                                      // Priorité 3: Recherche par nom dans la liste des extras
                                      if (detail.nom_plat && extras) {
                                        const extraByName = extras.find((e: any) =>
                                          e.nom_extra.toLowerCase() === detail.nom_plat!.toLowerCase()
                                        );
                                        if (extraByName) return extraByName.nom_extra;
                                      }
                                      return 'Extra non trouvé';
                                    } else {
                                      return platDetails?.plat || 'Plat non trouvé';
                                    }
                                  })()}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <span className="font-medium">Quantité:</span> 
                                    <span className="bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full font-medium">
                                      {detail.quantite_plat_commande}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="font-medium">Prix unitaire:</span> 
                                    <span className="text-thai-green font-semibold">
                                      {formatPrix((() => {
                                        if (isExtra) {
                                          // Priorité 1: Prix de l'extra trouvé via plat_r
                                          if (extraDetails?.prix) return extraDetails.prix;
                                          // Priorité 2: Prix stocké dans la commande
                                          if (detail.prix_unitaire) return detail.prix_unitaire;
                                          // Priorité 3: Recherche par nom dans la liste des extras
                                          if (detail.nom_plat && extras) {
                                            const extraByName = extras.find((e: any) =>
                                              e.nom_extra.toLowerCase() === detail.nom_plat!.toLowerCase()
                                            );
                                            if (extraByName?.prix) return extraByName.prix;
                                          }
                                          return 0;
                                        } else {
                                          return platDetails?.prix || 0;
                                        }
                                      })())}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              
                              {/* Prix total */}
                              <div className="text-right">
                                <div className="text-xl md:text-2xl font-bold text-thai-orange">
                                  {formatPrix((() => {
                                    let prixUnitaire = 0;
                                    if (isExtra) {
                                      // Priorité 1: Prix de l'extra trouvé via plat_r
                                      if (extraDetails?.prix) {
                                        prixUnitaire = extraDetails.prix;
                                      }
                                      // Priorité 2: Prix stocké dans la commande
                                      else if (detail.prix_unitaire) {
                                        prixUnitaire = detail.prix_unitaire;
                                      }
                                      // Priorité 3: Recherche par nom dans la liste des extras
                                      else if (detail.nom_plat && extras) {
                                        const extraByName = extras.find((e: any) =>
                                          e.nom_extra.toLowerCase() === detail.nom_plat!.toLowerCase()
                                        );
                                        if (extraByName?.prix) prixUnitaire = extraByName.prix;
                                      }
                                    } else {
                                      prixUnitaire = platDetails?.prix || 0;
                                    }
                                    return prixUnitaire * (detail.quantite_plat_commande || 0);
                                  })())}
                                </div>
                              </div>
                            </div>
                          </div>
                        </DishDetailsModalComplex>
                      );
                    })}
                    
                    {/* Total final */}
                    <div className="border-t border-thai-orange/20 pt-4 mt-6">
                      <div className="flex justify-between items-center bg-thai-cream/30 p-4 rounded-lg">
                        <span className="text-xl font-bold text-thai-green">Total de la commande :</span>
                        <span className="text-2xl font-bold text-thai-orange">
                          {formatPrix(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-thai-orange/30 rounded-lg bg-thai-cream/20">
                    <ShoppingCart className="h-12 w-12 text-thai-orange/50 mx-auto mb-3" />
                    <p className="text-thai-green font-medium">Aucun article dans cette commande.</p>
                    <p className="text-sm text-gray-500 mt-1">Cette commande semble vide.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Demandes spéciales */}
            {commande.demande_special_pour_la_commande && (
              <Card className="border-thai-orange/20 animate-fade-in transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-thai-green mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-thai-orange" />
                    Demandes spéciales
                  </h3>
                  <div className="p-4 bg-thai-cream/50 rounded-lg border border-thai-orange/20 transition-all duration-200 hover:bg-thai-cream/70">
                    <p className="text-sm text-gray-700 leading-relaxed">{commande.demande_special_pour_la_commande}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations principales */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-thai-orange/20">
                <CardContent className="p-4">
                  <div className="space-y-6">
                      {/* Date et heure de retrait - En évidence */}
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-thai-green mb-12 flex items-center justify-center gap-2">
                          <Clock className="h-6 w-6 text-thai-orange" />
                          Date et heure de retrait
                        </h4>
                        <div className="flex justify-center">
                          {commande.date_et_heure_de_retrait_souhaitees ? (
                            <div className="transform hover:scale-105 transition-all duration-300">
                              <CalendarIcon 
                                date={new Date(commande.date_et_heure_de_retrait_souhaitees)} 
                                className="scale-150" 
                              />
                            </div>
                          ) : (
                            <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-8 shadow-sm scale-125">
                              <div className="flex flex-col items-center gap-4">
                                <Clock className="h-12 w-12 text-gray-400" />
                                <span className="text-gray-600 font-medium text-lg">Date non définie</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Adresse de retrait - Tout en bas */}
                      <div className="text-center mt-6 pt-4 border-t border-thai-cream/50">
                        <p className="text-sm font-medium text-gray-500 mb-1">Adresse de retrait</p>
                        <p className="text-thai-green font-medium mb-1">2 impasse de la poste 37120 Marigny Marmande</p>
                        <Link 
                          href="/nous-trouver" 
                          className="inline-flex items-center gap-1 text-sm text-thai-orange hover:text-thai-green transition-colors duration-200 underline hover:no-underline"
                        >
                          <MapPin className="h-4 w-4" />
                          Voir sur la carte
                        </Link>
                      </div>
                    </div>
                </CardContent>
              </Card>

              <Card className="border-thai-orange/20">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-thai-orange" />
                      <h3 className="font-semibold text-thai-green">Récapitulatif</h3>
                    </div>
                    
                    {/* Informations de base */}
                    <div className="space-y-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Commande passée le</p>
                        <div className="flex items-center justify-center gap-2 bg-thai-cream/40 px-3 py-2 rounded-lg">
                          <Clock className="h-4 w-4 text-thai-green" />
                          <span className="text-sm font-semibold text-thai-green">
                            {commande.date_de_prise_de_commande ? 
                              format(new Date(commande.date_de_prise_de_commande), "dd MMMM yyyy 'à' HH:mm", { locale: fr }) 
                              : 'Date inconnue'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Numéro de commande</p>
                        <div className="flex items-center justify-center gap-2 bg-thai-cream/40 px-3 py-2 rounded-lg">
                          <div className="h-5 w-5 bg-thai-orange rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">#</span>
                          </div>
                          <span className="text-sm font-semibold text-thai-green">
                            {commande['Numéro de Commande'] || commande.idcommande}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Statut */}
                    <div className="text-center py-3">
                      <p className="text-sm font-medium text-gray-500 mb-3">Statut actuel</p>
                      <StatusBadge 
                        statut={commande.statut_commande} 
                        type="commande" 
                      />
                    </div>
                    
                    {/* Total - En évidence */}
                    <div className="bg-white p-4 rounded-lg border-2 border-thai-orange text-center shadow-md">
                      <p className="text-sm font-medium text-gray-600 mb-2">Total à payer</p>
                      <p className="font-bold text-3xl text-thai-orange mb-2">
                        {formatPrix(calculateTotal())}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-thai-green font-medium">
                        <CreditCard className="h-4 w-4" />
                        Paiement sur place - Carte acceptée
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section 4: Messages selon le statut */}
            <Card className="border-thai-green/20 bg-gradient-to-r from-thai-cream/30 to-thai-gold/10 animate-fade-in transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <CardContent className="p-4">
                <div className="text-center space-y-4">
                  {/* Bouton modifier (seulement si modifiable) */}
                  {commande.statut_commande && ['En attente de confirmation', 'Confirmée'].includes(commande.statut_commande) && (
                    <div className="mb-4">
                      <Button asChild className="bg-thai-orange hover:bg-thai-orange/90 transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                        <Link href={`/modifier-commande/${commande.idcommande}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier ma commande
                        </Link>
                      </Button>
                      <p className="text-xs text-gray-600 mt-2">
                        Vous pouvez modifier votre commande tant qu'elle n'est pas en préparation
                      </p>
                    </div>
                  )}

                  {commande.statut_commande === 'En attente de confirmation' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg transition-all duration-200 hover:shadow-md hover:bg-yellow-100">
                      <p className="text-sm text-yellow-800 text-center font-medium">
                        ⏳ Votre commande est en attente de confirmation. Nous la traiterons dans les plus brefs délais.
                      </p>
                    </div>
                  )}

                  {commande.statut_commande === 'Confirmée' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg transition-all duration-200 hover:shadow-md hover:bg-green-100">
                      <p className="text-sm text-green-800 text-center font-medium">
                        ✅ Votre commande est confirmée ! Nous la préparons avec soin.
                      </p>
                    </div>
                  )}

                  {commande.statut_commande === 'Prête à récupérer' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-md hover:bg-blue-100">
                      <p className="text-sm text-blue-800 text-center font-medium">
                        🎉 Votre commande est prête ! Vous pouvez venir la récupérer.
                      </p>
                    </div>
                  )}

                  {commande.statut_commande === 'Récupérée' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg transition-all duration-200 hover:shadow-md hover:bg-green-100">
                      <p className="text-sm text-green-800 text-center font-medium">
                        🍽️ Commande récupérée avec succès ! Bon appétit et merci de votre confiance.
                      </p>
                    </div>
                  )}

                  {commande.statut_commande === 'Annulée' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg transition-all duration-200 hover:shadow-md hover:bg-red-100">
                      <p className="text-sm text-red-800 text-center font-medium">
                        ❌ Cette commande a été annulée.
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
    </AppLayout>
  );
});

SuiviCommande.displayName = 'SuiviCommande';

export default SuiviCommande;