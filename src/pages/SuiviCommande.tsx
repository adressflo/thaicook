import { memo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCommandeById } from '@/hooks/useSupabaseData';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, ArrowLeft, ShoppingCart, Clock, CreditCard, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { PlatUI as Plat } from '@/types/app';

const SuiviCommande = memo(() => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isLoadingAuth } = useAuth();
  const { data: commande, isLoading: isLoadingCommande, error } = useCommandeById(id ? Number(id) : undefined);
  const { plats, isLoading: platsLoading } = useData();

  if (isLoadingAuth || isLoadingCommande || platsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-thai-orange" />
      </div>
    );
  }

  if (error || !commande) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-thai p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les détails de cette commande. Elle n'existe peut-être pas ou a été supprimée.
          </AlertDescription>
           <Button asChild variant="secondary" className="mt-4">
             <Link to="/historique">Retour à l'historique</Link>
           </Button>
        </Alert>
      </div>
    );
  }

  // Vérifie que l'utilisateur connecté est bien le propriétaire de la commande
  if (currentUser?.uid !== commande.client_r) {
    return <Navigate to="/historique" replace />;
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
      const prix = detail.plat?.prix || 0;
      const quantite = detail.quantite_plat_commande || 0;
      return total + (prix * quantite);
    }, 0);
  };

  // Fonction pour obtenir la couleur du statut
  const getStatutColor = (statut: string | null) => {
    if (!statut) return 'bg-gray-100 text-gray-800 border-gray-300';
    
    if (statut === 'Confirmée' || statut === 'Récupérée') {
      return 'bg-green-100 text-green-800 border-green-300';
    } else if (statut === 'En attente de confirmation') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    } else if (statut === 'Annulée') {
      return 'bg-red-100 text-red-800 border-red-300';
    } else if (statut === 'Prête à récupérer') {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Fonction pour obtenir les plats détaillés
  const getPlatDetails = (platId: number) => {
    if (!plats) return null;
    return plats.find(plat => plat.idplats === platId);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="outline" className="mb-6 group">
            <Link to="/historique">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour à l'historique
            </Link>
          </Button>

          <Card className="shadow-xl border-thai-orange/20">
            <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
              <div className="flex items-center justify-center mb-2">
                <ShoppingCart className="h-8 w-8 mr-2" />
                <CardTitle className="text-3xl font-bold">Suivi de votre Commande</CardTitle>
              </div>
              <CardDescription className="text-white/90 px-4">
                Statut: {commande.statut_commande || 'En attente'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Informations principales */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-thai-orange/20">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-thai-orange" />
                        <h3 className="font-semibold text-thai-green">Informations de retrait</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Date et heure de retrait</p>
                          <div className="flex justify-start">
                            <Badge className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-orange-100 text-orange-800 border-orange-300">
                              <Clock className="h-4 w-4 text-orange-600 mr-2 flex-shrink-0" />
                              {commande.date_et_heure_de_retrait_souhaitees ? 
                                format(new Date(commande.date_et_heure_de_retrait_souhaitees), 'eeee dd MMMM yyyy à HH:mm', { locale: fr })
                                : 'Date non définie'
                              }
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Commande passée le</p>
                          <div className="flex justify-start">
                            <Badge className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-green-100 text-green-800 border-green-300">
                              <Clock className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                              {commande.date_de_prise_de_commande ? 
                                format(new Date(commande.date_de_prise_de_commande), "dd MMMM yyyy 'à' HH:mm", { locale: fr }) 
                                : 'Date inconnue'
                              }
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Numéro de commande</p>
                          <div className="flex justify-start">
                            <Badge className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-blue-100 text-blue-800 border-blue-300">
                              <div className="h-4 w-4 bg-blue-600 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">N</span>
                              </div>
                              {commande['Numéro de Commande'] || commande.idcommande}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-thai-orange/20">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-thai-orange" />
                        <h3 className="font-semibold text-thai-green">Récapitulatif</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Statut actuel</p>
                          <Badge className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3", getStatutColor(commande.statut_commande))}>
                            {commande.statut_commande || 'En attente'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total à payer</p>
                          <p className="font-semibold text-2xl text-thai-green">
                            {formatPrix(calculateTotal())}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Paiement sur place - Carte acceptée
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Articles commandés */}
              <Card className="border-thai-orange/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-thai-green mb-4 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-thai-orange" />
                    Articles de votre commande ({commande.details?.length || 0})
                  </h3>
                  {commande.details && commande.details.length > 0 ? (
                    <div className="space-y-4">
                      {commande.details.map((detail, index) => {
                        const platDetails = getPlatDetails(detail.plat_r);
                        return (
                          <div key={index} className="group">
                            <div className="flex flex-col md:flex-row gap-3 p-4 bg-white border border-thai-orange/20 rounded-lg hover:shadow-md transition-all">
                              {/* Image du plat */}
                              {platDetails?.photo_du_plat && (
                                <div className="w-full md:w-24 h-20 md:h-16 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={platDetails.photo_du_plat} 
                                    alt={platDetails.plat}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              
                              {/* Détails du plat */}
                              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-thai-green text-lg mb-1">
                                    {detail.plat?.plat || 'Plat non trouvé'}
                                  </h4>
                                  {platDetails?.description && (
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                      {platDetails.description}
                                    </p>
                                  )}
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
                                        {formatPrix(detail.plat?.prix || 0)}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Prix total */}
                                <div className="text-right md:text-left md:ml-4">
                                  <div className="text-2xl font-bold text-thai-orange">
                                    {formatPrix((detail.plat?.prix || 0) * (detail.quantite_plat_commande || 0))}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatPrix(detail.plat?.prix || 0)} × {detail.quantite_plat_commande}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                <Card className="border-thai-orange/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-thai-green mb-3">Demandes spéciales</h3>
                    <div className="p-4 bg-thai-cream/50 rounded-lg">
                      <p className="text-sm text-gray-700">{commande.demande_special_pour_la_commande}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Messages selon le statut */}
              <Card className="border-thai-green/20 bg-gradient-to-r from-thai-cream/30 to-thai-gold/10">
                <CardContent className="p-4">
                  <div className="text-center space-y-4">
                    {/* Bouton modifier (seulement si modifiable) */}
                    {commande.statut_commande && ['En attente de confirmation', 'Confirmée'].includes(commande.statut_commande) && (
                      <div className="mb-4">
                        <Button asChild className="bg-thai-orange hover:bg-thai-orange/90">
                          <Link to={`/modifier-commande/${commande.idcommande}`}>
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
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 text-center font-medium">
                          ⏳ Votre commande est en attente de confirmation. Nous la traiterons dans les plus brefs délais.
                        </p>
                      </div>
                    )}

                    {commande.statut_commande === 'Confirmée' && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 text-center font-medium">
                          ✅ Votre commande est confirmée ! Nous la préparons avec soin.
                        </p>
                      </div>
                    )}

                    {commande.statut_commande === 'Prête à récupérer' && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 text-center font-medium">
                          🎉 Votre commande est prête ! Vous pouvez venir la récupérer.
                        </p>
                      </div>
                    )}

                    {commande.statut_commande === 'Récupérée' && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 text-center font-medium">
                          🍽️ Commande récupérée avec succès ! Bon appétit et merci de votre confiance.
                        </p>
                      </div>
                    )}

                    {commande.statut_commande === 'Annulée' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
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
    </TooltipProvider>
  );
});

SuiviCommande.displayName = 'SuiviCommande';
export default SuiviCommande;
