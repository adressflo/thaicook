import { memo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvenementById } from '@/hooks/useSupabaseData';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, ArrowLeft, Calendar, Users, Edit, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { PlatUI as Plat } from '@/types/app';

const SuiviEvenement = memo(() => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isLoadingAuth } = useAuth();
  const { data: evenement, isLoading: isLoadingEvenement, error } = useEvenementById(id ? Number(id) : undefined);
  const { plats, isLoading: platsLoading } = useData();

  if (isLoadingAuth || isLoadingEvenement || platsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-thai-orange" />
      </div>
    );
  }

  if (error || !evenement) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-thai p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les détails de cet événement. Il n'existe peut-être pas ou a été supprimé.
          </AlertDescription>
           <Button asChild variant="secondary" className="mt-4">
             <Link to="/historique">Retour à l'historique</Link>
           </Button>
        </Alert>
      </div>
    );
  }

  // Vérifie que l'utilisateur connecté est bien le propriétaire de l'événement
  if (currentUser?.uid !== evenement.contact_client_r) {
    return <Navigate to="/historique" replace />;
  }

  // Vérifier si l'événement peut être modifié
  const canEdit = evenement.statut_evenement !== 'Réalisé' && evenement.statut_evenement !== 'Payé intégralement';

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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <Button asChild variant="outline" className="group">
              <Link to="/historique">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour à l'historique
              </Link>
            </Button>
            
            {canEdit && (
              <Button asChild variant="default" className="bg-thai-green hover:bg-thai-green/80">
                <Link to={`/modifier-evenement/${evenement.idevenements}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            )}
          </div>

          <Card className="shadow-xl border-thai-green/20">
            <CardHeader className="text-center bg-gradient-to-r from-thai-green to-thai-orange text-white rounded-t-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-8 w-8 mr-2" />
                <CardTitle className="text-3xl font-bold">Suivi de votre Événement</CardTitle>
              </div>
              <CardDescription className="text-white/90 px-4">
                Statut: {evenement.statut_evenement || 'Demande initiale'}
              </CardDescription>
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
                <Card className="border-thai-orange/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-thai-green mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-thai-orange" />
                      Plats présélectionnés ({platsSelectionnes.length})
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {platsSelectionnes.map((plat: Plat) => (
                        <Tooltip key={plat.id}>
                          <TooltipTrigger asChild>
                            <Card className="border-thai-orange/20 hover:shadow-md transition-shadow cursor-pointer">
                              {plat.photo_du_plat && (
                                <div className="aspect-video overflow-hidden rounded-t-lg">
                                  <img 
                                    src={plat.photo_du_plat} 
                                    alt={plat.plat} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <CardContent className="p-3">
                                <h4 className="font-semibold text-thai-green text-sm">{plat.plat}</h4>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent className="w-64 bg-white border-thai-orange p-2 rounded-md shadow-lg">
                            {plat.photo_du_plat && (
                              <img src={plat.photo_du_plat} alt={plat.plat} className="w-full h-32 object-cover rounded-md mb-2" />
                            )}
                            <p className="text-sm font-semibold">{plat.plat}</p>
                            {plat.description && (
                              <p className="text-xs text-gray-600 mt-1">{plat.description}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Demandes spéciales */}
              {evenement.demandes_speciales_evenement && (
                <Card className="border-thai-orange/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-thai-green mb-3">Demandes spéciales / Thème</h3>
                    <div className="p-4 bg-thai-cream/50 rounded-lg">
                      <p className="text-sm text-gray-700">{evenement.demandes_speciales_evenement}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Statut et informations pratiques */}
              <Card className="border-thai-green/20 bg-gradient-to-r from-thai-cream/30 to-thai-gold/10">
                <CardContent className="p-4">
                  <div className="text-center space-y-4">
                    {(evenement.statut_evenement === 'Demande initiale' || 
                      evenement.statut_evenement === 'En préparation' || 
                      evenement.statut_evenement === 'Contact établi') && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 text-center font-medium">
                          🎉 Votre demande d'événement est en cours de traitement. Nous vous recontacterons prochainement pour finaliser les détails.
                        </p>
                      </div>
                    )}

                    {evenement.statut_evenement === 'Confirmé / Acompte reçu' && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 text-center font-medium">
                          ✅ Votre événement est confirmé ! Nous préparons tout pour que ce soit parfait.
                        </p>
                      </div>
                    )}

                    {evenement.statut_evenement === 'Réalisé' && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 text-center font-medium">
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
    </TooltipProvider>
  );
});

SuiviEvenement.displayName = 'SuiviEvenement';
export default SuiviEvenement;
