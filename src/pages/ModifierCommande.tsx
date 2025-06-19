import { useState, useMemo, useEffect, memo } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, AlertCircle, ShoppingCart, CreditCard, Loader2, Search, Trash2, MapPin, Phone, ArrowLeft, Edit, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, isSameDay, isFuture, getDay, startOfDay, addDays, startOfMonth, endOfMonth, addMonths, type Day } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useCommandeById, useUpdateCommande, useDeleteDetail, useCreateDetail } from '@/hooks/useSupabaseData';
import type { PlatUI as Plat, CommandeWithDetails } from '@/types/app';

const dayNameToNumber: { [key: string]: Day } = {
  dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6,
};

const joursDispoMapping = [
    { key: 'lundi_dispo', value: 'lundi', label: 'Lundi' },
    { key: 'mardi_dispo', value: 'mardi', label: 'Mardi' },
    { key: 'mercredi_dispo', value: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi_dispo', value: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi_dispo', value: 'vendredi', label: 'Vendredi' },
    { key: 'samedi_dispo', value: 'samedi', label: 'Samedi' },
    { key: 'dimanche_dispo', value: 'dimanche', label: 'Dimanche' },
];

interface ModifiablePlatDetail {
  iddetails: number;
  plat_r: number;
  quantite_plat_commande: number;
  plat?: Plat;
  modified?: boolean;
  toDelete?: boolean;
}

interface NewPlatDetail {
  plat_r: number;
  quantite_plat_commande: number;
  isNew: true;
}

const ModifierCommande = memo(() => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { plats, isLoading: dataIsLoading, error: dataError } = useData();
  const { currentUser, isLoadingAuth } = useAuth();
  const { data: commande, isLoading: isLoadingCommande, error } = useCommandeById(id ? Number(id) : undefined);
  const updateCommande = useUpdateCommande();
  const deleteDetail = useDeleteDetail();
  const createDetail = useCreateDetail();

  // États pour la modification
  const [dateRetrait, setDateRetrait] = useState<Date | undefined>();
  const [heureRetrait, setHeureRetrait] = useState<string>('');
  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');
  
  // États pour la gestion des plats
  const [details, setDetails] = useState<ModifiablePlatDetail[]>([]);
  const [nouveauxPlats, setNouveauxPlats] = useState<NewPlatDetail[]>([]);
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(startOfDay(new Date()));
  const [recherche, setRecherche] = useState('');
  const [isModifying, setIsModifying] = useState(false);

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  // Initialisation des données de la commande
  useEffect(() => {
    if (commande) {
      // Initialiser la date et l'heure
      if (commande.date_et_heure_de_retrait_souhaitees) {
        const dateRetrait = new Date(commande.date_et_heure_de_retrait_souhaitees);
        setDateRetrait(dateRetrait);
        setHeureRetrait(format(dateRetrait, 'HH:mm'));
        
        // Déterminer le jour de la semaine
        const dayNumber = getDay(dateRetrait);
        const dayName = Object.keys(dayNameToNumber).find(key => dayNameToNumber[key] === dayNumber);
        if (dayName) {
          setJourSelectionne(dayName);
        }
      }
      
      // Initialiser les demandes spéciales
      setDemandesSpeciales(commande.demande_special_pour_la_commande || '');
      
      // Initialiser les détails
      if (commande.details && plats) {
        const detailsWithPlat = commande.details.map(detail => ({
          ...detail,
          plat: plats.find(p => p.idplats === detail.plat_r)
        }));
        setDetails(detailsWithPlat);
      }
    }
  }, [commande, plats]);

  const platsFiltres = useMemo(() => {
      if (!recherche) return [];
      if (!plats) return [];
      return plats.filter(plat =>
          plat.plat?.toLowerCase().includes(recherche.toLowerCase())
      );
  }, [recherche, plats]);

  const platsDisponibles = useMemo(() => {
    if (!jourSelectionne || !plats) return [];
    const champDispoKey = `${jourSelectionne.toLowerCase()}_dispo` as keyof Plat;
    return plats.filter(plat => plat[champDispoKey] === 'oui');
  }, [jourSelectionne, plats]);

  const joursOuverture = useMemo(() => {
    if (!plats) return [];
    return joursDispoMapping.filter(jour => 
      plats.some(plat => plat[jour.key as keyof typeof plat] === 'oui')
    );
  }, [plats]);

  const heuresDisponibles = useMemo(() => {
    const heures: string[] = [];
    let heureActuelle = new Date(0);
    heureActuelle.setHours(18, 0, 0, 0);
    const heureFin = new Date(0);
    heureFin.setHours(20, 30, 0, 0);
    while (heureActuelle <= heureFin) {
      heures.push(format(heureActuelle, 'HH:mm'));
      heureActuelle.setMinutes(heureActuelle.getMinutes() + 5);
    }
    return heures;
  }, []);

  // Calcul des dates autorisées
  useEffect(() => {
    if (jourSelectionne && dayNameToNumber.hasOwnProperty(jourSelectionne)) {
      const targetDayNumber = dayNameToNumber[jourSelectionne];
      const today = startOfDay(new Date());
      const calculatedDates: Date[] = [];
      const startMonth = startOfMonth(currentCalendarMonth);
      const endNextMonth = endOfMonth(addMonths(startMonth, 1));
      let currentDateIterator = startMonth;
      while (currentDateIterator <= endNextMonth) {
        if (getDay(currentDateIterator) === targetDayNumber) {
          if (isSameDay(currentDateIterator, today) || isFuture(currentDateIterator)) {
            calculatedDates.push(startOfDay(currentDateIterator));
          }
        }
        currentDateIterator = addDays(currentDateIterator, 1);
      }
      setAllowedDates(calculatedDates);
      if (dateRetrait && !calculatedDates.some(d => isSameDay(d, dateRetrait))) {
        setDateRetrait(undefined);
      }
    } else {
      setAllowedDates([]);
    }
  }, [jourSelectionne, currentCalendarMonth, dateRetrait]);

  // Fonction pour modifier la quantité d'un plat existant
  const modifierQuantiteDetail = (iddetails: number, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) {
      // Marquer pour suppression au lieu de supprimer immédiatement
      setDetails(prev => prev.map(detail => 
        detail.iddetails === iddetails 
          ? { ...detail, toDelete: true, modified: true }
          : detail
      ));
    } else {
      setDetails(prev => prev.map(detail => 
        detail.iddetails === iddetails 
          ? { ...detail, quantite_plat_commande: nouvelleQuantite, modified: true, toDelete: false }
          : detail
      ));
    }
  };

  // Fonction pour supprimer un plat
  const supprimerDetail = (iddetails: number) => {
    setDetails(prev => prev.map(detail => 
      detail.iddetails === iddetails 
        ? { ...detail, toDelete: true, modified: true }
        : detail
    ));
  };

  // Fonction pour ajouter un nouveau plat
  const ajouterNouveauPlat = (plat: Plat) => {
    if (!plat.idplats || !dateRetrait || !heureRetrait) {
      toast({ 
        title: "Informations requises", 
        description: "Veuillez d'abord sélectionner une date et une heure de retrait.", 
        variant: "destructive" 
      });
      return;
    }

    // Vérifier si le plat est déjà dans les nouveaux plats
    const existingIndex = nouveauxPlats.findIndex(np => np.plat_r === plat.idplats);
    if (existingIndex !== -1) {
      // Augmenter la quantité
      setNouveauxPlats(prev => prev.map((item, index) => 
        index === existingIndex 
          ? { ...item, quantite_plat_commande: item.quantite_plat_commande + 1 }
          : item
      ));
    } else {
      // Ajouter un nouveau plat
      setNouveauxPlats(prev => [...prev, {
        plat_r: plat.idplats,
        quantite_plat_commande: 1,
        isNew: true
      }]);
    }
    
    toast({ 
      title: "Plat ajouté !", 
      description: `${plat.plat} a été ajouté à votre commande modifiée.` 
    });
  };

  // Fonction pour modifier la quantité d'un nouveau plat
  const modifierQuantiteNouveauPlat = (platId: number, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) {
      setNouveauxPlats(prev => prev.filter(item => item.plat_r !== platId));
    } else {
      setNouveauxPlats(prev => prev.map(item => 
        item.plat_r === platId 
          ? { ...item, quantite_plat_commande: nouvelleQuantite }
          : item
      ));
    }
  };

  // Fonction pour calculer le nouveau total
  const calculerNouveauTotal = (): number => {
    const totalExistants = details
      .filter(detail => !detail.toDelete)
      .reduce((total, detail) => {
        const prix = detail.plat?.prix || 0;
        return total + (prix * detail.quantite_plat_commande);
      }, 0);
    
    const totalNouveaux = nouveauxPlats.reduce((total, item) => {
      const plat = plats?.find(p => p.idplats === item.plat_r);
      const prix = plat?.prix || 0;
      return total + (prix * item.quantite_plat_commande);
    }, 0);
    
    return totalExistants + totalNouveaux;
  };

  // Fonction pour sauvegarder les modifications
  const sauvegarderModifications = async () => {
    if (!commande || !currentUser) {
      toast({ title: "Erreur", description: "Commande ou utilisateur non trouvé.", variant: "destructive" });
      return;
    }

    if (!dateRetrait || !heureRetrait) {
      toast({ title: "Informations requises", description: "Veuillez sélectionner une date et une heure de retrait.", variant: "destructive" });
      return;
    }

    setIsModifying(true);

    try {
      // Créer la nouvelle date avec l'heure
      const dateCompleteRetrait = new Date(dateRetrait);
      const [heures, minutes] = heureRetrait.split(':');
      dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0);

      // 1. Mettre à jour les informations de la commande
      await updateCommande.mutateAsync({
        id: commande.idcommande,
        date_et_heure_de_retrait_souhaitees: dateCompleteRetrait.toISOString(),
        demande_special_pour_la_commande: demandesSpeciales,
        statut_commande: 'En attente de confirmation' // Remettre en attente lors de la modification
      });

      // 2. Supprimer les détails marqués pour suppression
      for (const detail of details.filter(d => d.toDelete)) {
        await deleteDetail.mutateAsync(detail.iddetails);
      }

      // 3. Ajouter les nouveaux plats
      for (const nouveauPlat of nouveauxPlats) {
        await createDetail.mutateAsync({
          commande_r: commande.idcommande,
          plat_r: nouveauPlat.plat_r,
          quantite_plat_commande: nouveauPlat.quantite_plat_commande
        });
      }

      toast({ 
        title: "Modifications sauvegardées !", 
        description: "Votre commande a été modifiée avec succès." 
      });

      // Rediriger vers le suivi de commande
      navigate(`/suivi-commande/${commande.idcommande}`);

    } catch (error: any) {
      console.error('Erreur modification commande:', error);
      toast({ 
        title: "Erreur", 
        description: error.message || "Erreur lors de la modification de la commande.", 
        variant: "destructive" 
      });
    } finally {
      setIsModifying(false);
    }
  };

  if (isLoadingAuth || isLoadingCommande || dataIsLoading) {
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
            Impossible de charger les détails de cette commande.
          </AlertDescription>
           <Button asChild variant="secondary" className="mt-4">
             <Link to="/historique">Retour à l'historique</Link>
           </Button>
        </Alert>
      </div>
    );
  }

  // Vérifier que l'utilisateur connecté est bien le propriétaire de la commande
  if (currentUser?.uid !== commande.client_r) {
    return <Navigate to="/historique" replace />;
  }

  // Vérifier que la commande peut être modifiée
  if (commande.statut_commande && !['En attente de confirmation', 'Confirmée'].includes(commande.statut_commande)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-thai p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Modification impossible</AlertTitle>
          <AlertDescription>
            Cette commande ne peut plus être modifiée car elle est en statut "{commande.statut_commande}".
          </AlertDescription>
           <Button asChild variant="secondary" className="mt-4">
             <Link to={`/suivi-commande/${commande.idcommande}`}>Voir la commande</Link>
           </Button>
        </Alert>
      </div>
    );
  }

  if (dataError) {
    return <div className="p-8"><Alert variant="destructive">Erreur de chargement: {dataError.message}</Alert></div>;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="outline" className="mb-6 group">
            <Link to={`/suivi-commande/${commande.idcommande}`}>
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour au suivi
            </Link>
          </Button>

          <Card className="shadow-xl border-thai-orange/20 mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg py-4">
              <div className="flex items-center justify-center mb-1">
                <Edit className="h-7 w-7 mr-2" />
                <CardTitle className="text-2xl font-bold">Modifier ma Commande</CardTitle>
              </div>
              <p className="text-white/90 text-sm">Commande N°{commande.idcommande} • Statut: {commande.statut_commande}</p>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              {/* Avertissement */}
              <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Attention :</strong> Modifier votre commande remettra son statut à "En attente de confirmation".
                </AlertDescription>
              </Alert>

              {/* Section modification date et heure */}
              <div className="mb-8 pb-8 border-b border-thai-orange/10">
                <h3 className="text-lg font-semibold text-thai-green mb-4 flex items-center gap-2">
                  <CalendarIconLucide className="h-5 w-5 text-thai-orange" />
                  Modifier la date et l'heure de retrait
                </h3>
                
                <div className="mb-4">
                  <Label className="text-md font-semibold text-thai-green mb-3 block">Choisissez un jour :</Label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {joursOuverture.map(jour => (
                      <Button 
                        key={jour.value} 
                        variant={jourSelectionne === jour.value ? "default" : "outline"} 
                        onClick={() => setJourSelectionne(jour.value)}
                        className={cn(
                          "px-4 py-2 text-sm sm:px-5 sm:py-2.5 rounded-md transition-all duration-200", 
                          jourSelectionne === jour.value 
                            ? "bg-thai-orange text-white" 
                            : "border-thai-orange text-thai-orange bg-white"
                        )}
                      >
                        {jour.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {jourSelectionne && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateRetrait">Nouvelle date de retrait *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateRetrait && "text-muted-foreground")}>
                            <CalendarIconLucide className="mr-2 h-4 w-4"/>
                            {dateRetrait ? format(dateRetrait, 'eeee dd MMMM yyyy', {locale: fr}) : <span className="text-green-700">Sélectionner une date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateRetrait} onSelect={setDateRetrait} disabled={(date) => !allowedDates.some(d => isSameDay(d, date))}/>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="heureRetrait">Nouvelle heure de retrait *</Label>
                      <Select onValueChange={setHeureRetrait} value={heureRetrait}>
                        <SelectTrigger className={cn(!heureRetrait && "text-green-700")}>
                          <SelectValue placeholder="Sélectionner"/>
                        </SelectTrigger>
                        <SelectContent>
                          {heuresDisponibles.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {dateRetrait && heureRetrait && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      ✓ Nouveau retrait prévu le {format(dateRetrait, 'eeee dd MMMM yyyy', {locale: fr})} à {heureRetrait}
                    </p>
                  </div>
                )}
              </div>

              {/* Section plats existants */}
              <div className="mb-8 pb-8 border-b border-thai-orange/10">
                <h3 className="text-lg font-semibold text-thai-green mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-thai-orange" />
                  Plats actuels de votre commande
                </h3>
                
                {details.length > 0 ? (
                  <div className="space-y-3">
                    {details.filter(detail => !detail.toDelete).map((detail) => (
                      <div key={detail.iddetails} className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-thai-orange/20">
                        <div className="flex-1">
                          <h4 className="font-medium text-thai-green">{detail.plat?.plat}</h4>
                          <p className="text-sm text-gray-600">{formatPrix(detail.plat?.prix || 0)} × {detail.quantite_plat_commande} = {formatPrix((detail.plat?.prix || 0) * detail.quantite_plat_commande)}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 w-7 p-0" 
                              onClick={() => modifierQuantiteDetail(detail.iddetails, detail.quantite_plat_commande - 1)}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center text-base font-medium">{detail.quantite_plat_commande}</span>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 w-7 p-0" 
                              onClick={() => modifierQuantiteDetail(detail.iddetails, detail.quantite_plat_commande + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => supprimerDetail(detail.iddetails)}
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">Aucun plat dans cette commande</p>
                )}
              </div>

              {/* Section ajouter de nouveaux plats */}
              {jourSelectionne && dateRetrait && heureRetrait && (
                <div className="mb-8 pb-8 border-b border-thai-orange/10">
                  <h3 className="text-lg font-semibold text-thai-green mb-4">Ajouter des plats pour le {jourSelectionne}</h3>
                  
                  {/* Recherche de plats */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Rechercher un plat à ajouter..." 
                        value={recherche} 
                        onChange={(e) => setRecherche(e.target.value)} 
                        className="pl-10" 
                      />
                    </div>
                  </div>

                  {/* Plats disponibles */}
                  {recherche ? (
                    // Résultats de recherche
                    <div className="space-y-2">
                      {platsFiltres.filter(plat => {
                        const champDispoKey = `${jourSelectionne.toLowerCase()}_dispo` as keyof Plat;
                        return plat[champDispoKey] === 'oui';
                      }).map(plat => (
                        <div key={plat.id} className="flex items-center justify-between p-3 rounded-lg bg-thai-cream/30 border border-thai-orange/20">
                          <div>
                            <h4 className="font-medium text-thai-green">{plat.plat}</h4>
                            <p className="text-sm text-gray-600">{plat.description}</p>
                            <Badge variant="secondary">{formatPrix(plat.prix)}</Badge>
                          </div>
                          <Button 
                            onClick={() => ajouterNouveauPlat(plat)} 
                            size="sm" 
                            className="bg-thai-orange"
                          >
                            Ajouter
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Tous les plats disponibles pour le jour
                    <div className="grid md:grid-cols-2 gap-4">
                      {platsDisponibles.map(plat => (
                        <Card key={plat.id} className="border-thai-orange/20 flex flex-col">
                          {plat.photo_du_plat && (
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                              <img src={plat.photo_du_plat} alt={plat.plat} className="w-full h-full object-cover"/>
                            </div>
                          )}
                          <CardContent className="p-3 flex flex-col flex-grow">
                            <h4 className="font-semibold text-thai-green mb-1">{plat.plat}</h4>
                            <p className="text-xs text-gray-600 mb-2 flex-grow">{plat.description}</p>
                            <div className="flex items-center justify-between mt-auto pt-2">
                              <Badge variant="secondary">{formatPrix(plat.prix)}</Badge>
                              <Button onClick={() => ajouterNouveauPlat(plat)} size="sm" className="bg-thai-orange">
                                Ajouter
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Section nouveaux plats ajoutés */}
              {nouveauxPlats.length > 0 && (
                <div className="mb-8 pb-8 border-b border-thai-orange/10">
                  <h3 className="text-lg font-semibold text-thai-green mb-4 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-thai-orange" />
                    Nouveaux plats ajoutés ({nouveauxPlats.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {nouveauxPlats.map((item) => {
                      const plat = plats?.find(p => p.idplats === item.plat_r);
                      return (
                        <div key={item.plat_r} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="flex-1">
                            <h4 className="font-medium text-thai-green">{plat?.plat}</h4>
                            <p className="text-sm text-gray-600">
                              {formatPrix(plat?.prix || 0)} × {item.quantite_plat_commande} = {formatPrix((plat?.prix || 0) * item.quantite_plat_commande)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 w-7 p-0" 
                                onClick={() => modifierQuantiteNouveauPlat(item.plat_r, item.quantite_plat_commande - 1)}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center text-base font-medium">{item.quantite_plat_commande}</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 w-7 p-0" 
                                onClick={() => modifierQuantiteNouveauPlat(item.plat_r, item.quantite_plat_commande + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => modifierQuantiteNouveauPlat(item.plat_r, 0)}
                              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section demandes spéciales */}
              <div className="mb-8 pb-8 border-b border-thai-orange/10">
                <h3 className="text-lg font-semibold text-thai-green mb-4">Demandes spéciales</h3>
                <Textarea 
                  placeholder="Allergies, préférences particulières..." 
                  value={demandesSpeciales} 
                  onChange={(e) => setDemandesSpeciales(e.target.value)} 
                  rows={3}
                />
              </div>

              {/* Récapitulatif des modifications */}
              <div className="mb-8 p-4 bg-thai-cream/30 rounded-lg border border-thai-orange/20">
                <h3 className="text-lg font-semibold text-thai-green mb-4">Récapitulatif des modifications</h3>
                
                <div className="space-y-3">
                  {/* Date et heure */}
                  {dateRetrait && heureRetrait && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-thai-orange" />
                      <span className="text-sm">
                        <strong>Nouveau retrait :</strong> {format(dateRetrait, 'eeee dd MMMM yyyy', {locale: fr})} à {heureRetrait}
                      </span>
                    </div>
                  )}
                  
                  {/* Plats supprimés */}
                  {details.filter(d => d.toDelete).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-1">Plats supprimés :</p>
                      <ul className="text-sm text-red-600 ml-4">
                        {details.filter(d => d.toDelete).map(detail => (
                          <li key={detail.iddetails}>• {detail.plat?.plat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Plats modifiés */}
                  {details.filter(d => d.modified && !d.toDelete).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Quantités modifiées :</p>
                      <ul className="text-sm text-blue-600 ml-4">
                        {details.filter(d => d.modified && !d.toDelete).map(detail => (
                          <li key={detail.iddetails}>• {detail.plat?.plat} : {detail.quantite_plat_commande}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Nouveaux plats */}
                  {nouveauxPlats.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Nouveaux plats ajoutés :</p>
                      <ul className="text-sm text-green-600 ml-4">
                        {nouveauxPlats.map(item => {
                          const plat = plats?.find(p => p.idplats === item.plat_r);
                          return (
                            <li key={item.plat_r}>• {plat?.plat} × {item.quantite_plat_commande}</li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  
                  {/* Nouveau total */}
                  <div className="pt-3 border-t border-thai-orange/20">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-thai-green">Nouveau total :</span>
                      <span className="text-xl font-bold text-thai-orange">
                        {formatPrix(calculerNouveauTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de paiement */}
              <Alert className="bg-green-50/50 border-green-200 text-green-800 mb-6">
                <CreditCard className="h-4 w-4 !text-green-700" />
                <AlertDescription className="font-medium">
                  Paiement sur place : Nous acceptons la carte bleue.
                </AlertDescription>
              </Alert>

              {/* Adresse et contact */}
              <div className="text-center text-sm text-thai-green/80 p-3 bg-thai-cream/50 rounded-lg mb-6">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4 text-thai-orange" />
                  <span>Adresse de retrait : 2 impasse de la poste 37120 Marigny Marmande</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-thai-orange" />
                  <span>Contact : 07 49 28 37 07</span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-4">
                <Button 
                  asChild 
                  variant="outline" 
                  className="flex-1"
                >
                  <Link to={`/suivi-commande/${commande.idcommande}`}>
                    Annuler les modifications
                  </Link>
                </Button>
                
                <Button 
                  onClick={sauvegarderModifications} 
                  disabled={isModifying || (!dateRetrait || !heureRetrait)} 
                  className="flex-1 bg-thai-orange text-lg py-6"
                >
                  {isModifying ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4"/> 
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4"/>
                      Sauvegarder les modifications
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
});

ModifierCommande.displayName = 'ModifierCommande';

export default ModifierCommande;