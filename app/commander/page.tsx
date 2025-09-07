'use client';

import { AppLayout } from '@/components/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import {
  AlertCircle,
  Calendar as CalendarIconLucide,
  ChevronRight,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  addDays,
  format,
  getDay,
  isFuture,
  isSameDay,
  startOfDay,
  type Day,
} from 'date-fns';
import { fr } from 'date-fns/locale';

import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
// Utilisation des hooks Supabase
import { useCart } from '@/contexts/CartContext';
import { useCreateCommande } from '@/hooks/useSupabaseData';
import type { PlatUI as Plat, PlatPanier } from '@/types/app';
import { DishDetailsModalInteractive } from '@/components/historique/DishDetailsModalInteractive';

export const dynamic = 'force-dynamic';

const dayNameToNumber: { [key: string]: Day } = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
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

const getAvailableDays = (plat: Plat): { value: string; label: string }[] => {
  return joursDispoMapping.filter(
    jour => plat[jour.key as keyof Plat] === 'oui'
  );
};

const Commander = memo(() => {
  const { toast } = useToast();
  const { plats, isLoading: dataIsLoading, error: dataError } = useData();
  const createCommande = useCreateCommande();
  const { currentUser } = useAuth();
  const {
    panier,
    ajouterAuPanier,
    modifierQuantite,
    supprimerDuPanier,
    viderPanier,
    totalPrix,
  } = useCart();
  const isMobile = useIsMobile();
  const platsSectionRef = useRef<HTMLDivElement>(null);

  const clientFirebaseUID = currentUser?.uid;

  // États pour la sidebar mobile
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartCollapsed, setIsCartCollapsed] = useState(true); // Default to collapsed
  const [highlightedPlatId, setHighlightedPlatId] = useState<string | null>(
    null
  );

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`;
    } else {
      return `${prix.toFixed(2).replace('.', ',')}€`;
    }
  };

  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [dateRetrait, setDateRetrait] = useState<Date | undefined>();
  const [heureRetrait, setHeureRetrait] = useState<string>('');
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);
  const [recherche, setRecherche] = useState('');

  const platsFiltres = useMemo(() => {
    if (!recherche) return [];
    if (!plats) return [];
    return plats.filter(plat =>
      plat.plat?.toLowerCase().includes(recherche.toLowerCase()) &&
      plat.idplats !== 0  // Exclure le plat "Extra (Complément divers)"
    );
  }, [recherche, plats]);

  const platsDisponibles = useMemo(() => {
    if (!jourSelectionne || !plats) return [];
    const champDispoKey =
      `${jourSelectionne.toLowerCase()}_dispo` as keyof Plat;
    return plats.filter(plat => 
      plat[champDispoKey] === 'oui' && 
      plat.idplats !== 0  // Exclure le plat "Extra (Complément divers)"
    );
  }, [jourSelectionne, plats]);

  const joursOuverture = useMemo(() => {
    const joursMap = [
      { key: 'lundi_dispo', value: 'lundi', label: 'Lundi' },
      { key: 'mardi_dispo', value: 'mardi', label: 'Mardi' },
      { key: 'mercredi_dispo', value: 'mercredi', label: 'Mercredi' },
      { key: 'jeudi_dispo', value: 'jeudi', label: 'Jeudi' },
      { key: 'vendredi_dispo', value: 'vendredi', label: 'Vendredi' },
      { key: 'samedi_dispo', value: 'samedi', label: 'Samedi' },
      { key: 'dimanche_dispo', value: 'dimanche', label: 'Dimanche' },
    ];

    // Filtrer uniquement les jours où au moins un plat est disponible
    return joursMap.filter(
      jour =>
        plats?.some(plat => plat[jour.key as keyof typeof plat] === 'oui') ||
        false
    );
  }, [plats]);

  const heuresDisponibles = useMemo(() => {
    const heures: string[] = [];
    const heureActuelle = new Date(0);
    heureActuelle.setHours(18, 0, 0, 0);
    const heureFin = new Date(0);
    heureFin.setHours(20, 30, 0, 0);
    while (heureActuelle <= heureFin) {
      heures.push(format(heureActuelle, 'HH:mm'));
      heureActuelle.setMinutes(heureActuelle.getMinutes() + 5);
    }
    return heures;
  }, []);

  useEffect(() => {
    if (jourSelectionne && jourSelectionne in dayNameToNumber) {
      const targetDayNumber = dayNameToNumber[jourSelectionne];
      const today = startOfDay(new Date());
      const calculatedDates: Date[] = [];

      // Générer les 8 prochaines occurrences du jour sélectionné
      let currentDate = today;
      let foundDates = 0;

      while (foundDates < 8) {
        if (
          getDay(currentDate) === targetDayNumber &&
          (isSameDay(currentDate, today) || isFuture(currentDate))
        ) {
          calculatedDates.push(startOfDay(currentDate));
          foundDates++;
        }
        currentDate = addDays(currentDate, 1);
      }

      setAllowedDates(calculatedDates);
      if (
        dateRetrait &&
        !calculatedDates.some(d => isSameDay(d, dateRetrait))
      ) {
        setDateRetrait(undefined);
      }
    } else {
      setAllowedDates([]);
    }
  }, [jourSelectionne, dateRetrait]);

  // Scroll automatique vers la section des plats
  useEffect(() => {
    if (
      jourSelectionne &&
      dateRetrait &&
      heureRetrait &&
      platsSectionRef.current
    ) {
      setTimeout(() => {
        platsSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [jourSelectionne, dateRetrait, heureRetrait]);

  // Calculer la quantité actuelle d'un plat dans le panier
  const getCurrentQuantity = (platId: number): number => {
    if (!dateRetrait || !jourSelectionne) return 0;
    
    const dateCompleteRetrait = new Date(dateRetrait);
    const [heures, minutes] = (heureRetrait || '18:00').split(':');
    dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0);
    
    return panier
      .filter(item => 
        item.id === platId.toString() && 
        item.dateRetrait?.getTime() === dateCompleteRetrait.getTime()
      )
      .reduce((total, item) => total + item.quantite, 0);
  };

  const handleAjouterAuPanier = (plat: Plat, quantite: number = 1) => {
    if (!plat.idplats || !plat.plat || plat.prix === undefined) return;

    // Vérifier qu'un jour, une date et une heure sont sélectionnés
    if (!jourSelectionne || !dateRetrait || !heureRetrait) {
      toast({
        title: 'Informations requises',
        description:
          "Veuillez d'abord sélectionner un jour, une date et une heure de retrait.",
        variant: 'destructive',
      });
      return;
    }

    // Créer une date complète avec l'heure
    const dateCompleteRetrait = new Date(dateRetrait);
    const [heures, minutes] = heureRetrait.split(':');
    dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0);

    // Ajouter le plat avec la quantité spécifiée
    for (let i = 0; i < quantite; i++) {
      ajouterAuPanier({
        id: plat.idplats.toString(),
        nom: plat.plat,
        prix: plat.prix ?? 0,
        quantite: 1,
        jourCommande: jourSelectionne,
        dateRetrait: dateCompleteRetrait,
      });
    }

    setIsCartCollapsed(false); // Open cart on add

    toast({
      title: 'Plat ajouté !',
      description: `${quantite} ${plat.plat}${quantite > 1 ? 's' : ''} ajouté${quantite > 1 ? 's' : ''} à votre panier pour le ${format(
        dateCompleteRetrait,
        'eeee dd MMMM',
        { locale: fr }
      )} à ${heureRetrait}.`,
    });
  };

  const validerCommande = async () => {
    if (!currentUser || !clientFirebaseUID) {
      toast({
        title: 'Profil incomplet',
        description: 'Veuillez vous connecter et compléter votre profil.',
        variant: 'destructive',
      });
      return;
    }
    if (panier.length === 0) {
      toast({ title: 'Panier vide', variant: 'destructive' });
      return;
    }

    // Grouper les articles par date de retrait
    const groupedByDate = panier.reduce((groups, item) => {
      const dateKey = item.dateRetrait?.toISOString() || '';
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
      return groups;
    }, {} as Record<string, PlatPanier[]>);

    try {
      let commandesCreees = 0;

      // Créer une commande pour chaque date de retrait
      for (const [dateKey, items] of Object.entries(groupedByDate)) {
        if (!dateKey) continue;

        await createCommande.mutateAsync({
          client_r: currentUser.uid,
          date_et_heure_de_retrait_souhaitees: dateKey,
          demande_special_pour_la_commande: demandesSpeciales,
          details: items.map(item => ({
            plat_r: item.id, // Garder comme string, sera converti dans le hook
            quantite_plat_commande: item.quantite,
          })),
        });

        commandesCreees++;
      }

      const totalGeneral = panier.reduce(
        (sum, item) => sum + item.prix * item.quantite,
        0
      );

      toast({
        title: 'Commande(s) envoyée(s) !',
        description: `${commandesCreees} commande${
          commandesCreees > 1 ? 's' : ''
        } d'un total de ${formatPrix(totalGeneral)} ${
          commandesCreees > 1 ? 'ont été enregistrées' : 'a été enregistrée'
        }.`,
      });

      viderPanier();
      setDateRetrait(undefined);
      setHeureRetrait('');
      setDemandesSpeciales('');
      setJourSelectionne('');
      setIsCartCollapsed(true);
    } catch (error: unknown) {
      console.error('Erreur validation commande:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'enregistrement de la commande.";
      toast({
        title: 'Erreur commande',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (dataError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          Erreur de chargement: {dataError.message}
        </Alert>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div
          className={`container mx-auto transition-all duration-500 ${
            panier.length > 0 && !isCartCollapsed
              ? 'max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6'
              : 'max-w-5xl'
          }`}
        >
          {/* Section principale - Menu */}
          <div
            className={
              panier.length > 0 && !isCartCollapsed ? 'md:col-span-1' : 'w-full'
            }
          >
            {!currentUser || !clientFirebaseUID ? (
              <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Profil requis :</strong> Pour commander, veuillez vous{' '}
                  <Link href="/profil" className="underline font-medium">
                    connecter et compléter votre profil
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            ) : null}

            {/* Section 1: Header Pour Commander */}
            <Card className="shadow-xl border-thai-orange/20 mb-6 relative">
              <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg py-4">
                <div className="flex items-center justify-center mb-1">
                  <ShoppingCart className="h-7 w-7 mr-2" />
                  <CardTitle className="text-2xl font-bold">
                    Pour Commander
                  </CardTitle>
                </div>
                <p className="text-white/90 text-xs">
                  Horaire : Lundi, Mercredi, Vendredi, Samedi de 18h00 à 20h30
                </p>
              </CardHeader>
              {!isMobile && isCartCollapsed && panier.length > 0 && (
                <div
                  className="absolute top-1/2 -right-10 -translate-y-1/2 cursor-pointer group"
                  onClick={() => setIsCartCollapsed(false)}
                >
                  <div className="relative flex items-center justify-center w-20 h-20 bg-thai-green backdrop-blur-sm rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-thai-green/80">
                    <ShoppingCart className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 bg-white text-thai-orange font-bold text-base w-8 h-8 rounded-full flex items-center justify-center border-2 border-thai-gold shadow-lg"
                  >
                    {panier.reduce((total, item) => total + item.quantite, 0)}
                  </Badge>
                </div>
              )}
            </Card>

            {/* Section 2: Sélection du jour et recherche */}
            <Card className="shadow-xl border-thai-orange/20 mb-6">
              <CardContent className="p-6">
                <div className="mb-6 pb-6 border-b border-thai-orange/10">
                  <Label
                    htmlFor="recherche-plat"
                    className="text-md font-semibold text-thai-green mb-3 block"
                  >
                    Rechercher un plat pour voir sa disponibilité
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="recherche-plat"
                      placeholder="Ex: Pad Thaï, Curry, Nems..."
                      value={recherche}
                      onChange={e => setRecherche(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {recherche && platsFiltres.length > 0 && (
                    <div className="mt-4 space-y-2 rounded-lg bg-thai-cream/30 p-4 transition-all duration-300 hover:shadow-md hover:bg-thai-cream/40">
                      {platsFiltres.map(plat => (
                        <div
                          key={plat.id}
                          className="p-2 border-b last:border-b-0 border-thai-orange/20 flex flex-col sm:flex-row justify-between sm:items-center gap-2 transition-all duration-300 hover:bg-thai-cream/20 hover:shadow-sm rounded"
                        >
                          <span className="font-medium text-thai-green">
                            {plat.plat}
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {getAvailableDays(plat).length > 0 ? (
                              getAvailableDays(plat).map(jour => (
                                <Badge
                                  key={jour.value}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-thai-orange/20 transition-all duration-200 hover:scale-105"
                                  onClick={() => {
                                    setJourSelectionne(jour.value);
                                    setRecherche('');
                                  }}
                                >
                                  {jour.label}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="destructive">Indisponible</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {recherche && platsFiltres.length === 0 && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Aucun plat ne correspond à votre recherche.
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-md font-semibold text-thai-green mb-3 block">
                    Ou choisissez un jour pour voir le menu :
                  </Label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {joursOuverture.map(jour => (
                      <Button
                        key={jour.value}
                        variant={
                          jourSelectionne === jour.value ? 'default' : 'outline'
                        }
                        onClick={() => setJourSelectionne(jour.value)}
                        className={cn(
                          'px-4 py-2 text-sm sm:px-5 sm:py-2.5 rounded-md transition-all duration-200 hover:scale-105',
                          jourSelectionne === jour.value
                            ? 'bg-thai-orange text-white'
                            : 'border-thai-orange text-thai-orange bg-white hover:bg-thai-orange/10'
                        )}
                      >
                        {jour.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Sélection date/heure */}
            {jourSelectionne && (
              <Card className="shadow-xl border-thai-orange/20 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-thai-green mb-3">
                    Choisissez votre date et heure de retrait :
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateRetrait">Date de retrait *</Label>
                      <Select
                        onValueChange={value => setDateRetrait(new Date(value))}
                        value={dateRetrait?.toISOString() || ''}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-full transition-all duration-300 hover:shadow-md hover:border-thai-orange/50',
                            !dateRetrait && 'text-green-700'
                          )}
                        >
                          <CalendarIconLucide className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Sélectionner">
                            {dateRetrait
                              ? format(dateRetrait, 'eeee dd MMMM', {
                                  locale: fr,
                                })
                              : 'Sélectionner une date'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {allowedDates.map(date => (
                            <SelectItem
                              key={date.toISOString()}
                              value={date.toISOString()}
                            >
                              {format(date, 'eeee dd MMMM', { locale: fr })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="heureRetrait">Heure de retrait *</Label>
                      <Select
                        onValueChange={setHeureRetrait}
                        value={heureRetrait}
                      >
                        <SelectTrigger
                          className={cn(
                            'transition-all duration-300 hover:shadow-md hover:border-thai-orange/50',
                            !heureRetrait && 'text-green-700'
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {heuresDisponibles.map(h => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Entre 18h00 et 20h30 (par 5 min)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 4: Liste des plats disponibles */}
            {jourSelectionne && dateRetrait && heureRetrait && (
              <Card
                ref={platsSectionRef}
                className="shadow-xl border-thai-orange/20 mb-6"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-thai-green mb-4">
                    Plats disponibles le{' '}
                    {jourSelectionne.charAt(0).toUpperCase() +
                      jourSelectionne.slice(1)}{' '}
                    :
                  </h3>

                  {dataIsLoading ? (
                    <div className="text-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-thai-orange" />
                    </div>
                  ) : platsDisponibles.length === 0 ? (
                    <div className="text-center py-6 bg-thai-cream/30 rounded-lg">
                      <p className="text-thai-green/70">
                        Aucun plat disponible ce jour-là.
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {platsDisponibles.map(plat => (
                        <DishDetailsModalInteractive
                          key={plat.id}
                          plat={plat}
                          formatPrix={formatPrix}
                          onAddToCart={handleAjouterAuPanier}
                          currentQuantity={getCurrentQuantity(plat.idplats)}
                          dateRetrait={dateRetrait}
                        >
                          <Card
                            className={`border-thai-orange/20 flex flex-col transition-all duration-300 cursor-pointer ${
                              highlightedPlatId === plat.id.toString()
                                ? 'ring-4 ring-thai-orange/50 border-thai-orange scale-105 shadow-lg'
                                : 'hover:shadow-md hover:border-thai-orange/40'
                            }`}
                            onMouseEnter={() =>
                              setHighlightedPlatId(plat.id.toString())
                            }
                            onMouseLeave={() => setHighlightedPlatId(null)}
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
                            <CardContent className="p-3 flex flex-col flex-grow">
                              <h4 className="font-semibold text-thai-green mb-1">
                                {plat.plat}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2 flex-grow">
                                {plat.description}
                              </p>
                              <div className="flex items-center justify-between mt-auto pt-2">
                                <Badge variant="secondary">
                                  {formatPrix(plat.prix || 0)}
                                </Badge>
                                <div className="flex items-center gap-2">
                                  {getCurrentQuantity(plat.idplats) > 0 && (
                                    <Badge className="bg-thai-orange text-white font-semibold">
                                      {getCurrentQuantity(plat.idplats)} dans le panier
                                    </Badge>
                                  )}
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAjouterAuPanier(plat, 1);
                                    }}
                                    size="sm"
                                    className="transition-all duration-200 hover:scale-105 hover:shadow-md"
                                  >
                                    Ajouter
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </DishDetailsModalInteractive>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-green-800 font-medium">
                      ✓ Retrait prévu le{' '}
                      {format(dateRetrait, 'eeee dd MMMM', { locale: fr })} à{' '}
                      {heureRetrait}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Section latérale droite - Panier */}
          {panier.length > 0 && !isCartCollapsed && (
            <div className="md:col-span-1">
              {/* Desktop Sidebar */}
              {!isMobile && (
                <div className="sticky top-8 h-fit w-full">
                  <Card className="shadow-xl border-thai-orange/20">
                    <CardHeader className="bg-gradient-to-r from-thai-orange to-thai-gold text-white py-4 relative rounded-t-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <ShoppingCart className="h-7 w-7 mr-2" />
                          <CardTitle className="text-2xl font-bold">
                            Mon Panier
                          </CardTitle>
                        </div>
                        <p className="text-white/90 text-xs">
                          {panier.reduce(
                            (total, item) => total + item.quantite,
                            0
                          )}{' '}
                          Plat
                          {panier.reduce(
                            (total, item) => total + item.quantite,
                            0
                          ) > 1
                            ? 's'
                            : ''}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsCartCollapsed(true)}
                          className="text-white hover:bg-white/20 p-1 absolute top-2 right-2"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      {(() => {
                        const groupedByDate = panier.reduce((groups, item) => {
                          const dateKey =
                            item.dateRetrait?.toDateString() || 'no-date';
                          if (!groups[dateKey]) {
                            groups[dateKey] = [];
                          }
                          groups[dateKey].push(item);
                          return groups;
                        }, {} as Record<string, PlatPanier[]>);

                        return Object.entries(groupedByDate).map(
                          ([dateKey, items]) => {
                            const dateRetrait = items[0]?.dateRetrait;

                            return (
                              <div
                                key={dateKey}
                                className="mb-4 border border-thai-orange/20 rounded-lg p-3 bg-thai-cream/20 animate-fade-in transition-all duration-300 hover:shadow-md hover:border-thai-orange/30 hover:bg-thai-cream/30"
                              >
                                {dateRetrait && (
                                  <div
                                    className="mb-2 pb-2 border-b border-thai-orange/10 cursor-pointer transition-all duration-300 hover:bg-thai-orange/5 hover:border-thai-orange/20 rounded-lg px-2 py-1"
                                    onMouseEnter={() => {
                                      const jourDate = format(
                                        dateRetrait,
                                        'eeee',
                                        {
                                          locale: fr,
                                        }
                                      ).toLowerCase();
                                      const heureDate = format(
                                        dateRetrait,
                                        'HH:mm'
                                      );
                                      setJourSelectionne(jourDate);
                                      setDateRetrait(dateRetrait);
                                      setHeureRetrait(heureDate);
                                    }}
                                  >
                                    <h4 className="font-semibold text-thai-green flex items-center gap-2 text-base">
                                      <CalendarIconLucide className="h-4 w-4 text-thai-orange" />
                                      Retrait prévu le{' '}
                                      <span className="text-thai-orange font-bold">
                                        {format(dateRetrait, 'eeee dd MMMM', {
                                          locale: fr,
                                        }).replace(/^\w/, c =>
                                          c.toUpperCase()
                                        )}{' '}
                                        à {format(dateRetrait, 'HH:mm')}
                                      </span>
                                    </h4>
                                  </div>
                                )}

                                <div className="space-y-3">
                                  {items.map(item => {
                                    const platData = plats?.find(
                                      p => p.id.toString() === item.id
                                    );
                                    const imageUrl = platData?.photo_du_plat;

                                    return platData ? (
                                      <DishDetailsModalInteractive
                                        key={item.uniqueId}
                                        plat={platData}
                                        formatPrix={formatPrix}
                                        onAddToCart={handleAjouterAuPanier}
                                        currentQuantity={getCurrentQuantity(platData.idplats)}
                                        dateRetrait={item.dateRetrait}
                                      >
                                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform cursor-pointer">
                                          {imageUrl ? (
                                            <img
                                              src={imageUrl}
                                              alt={item.nom}
                                              className="w-16 h-12 object-cover rounded-lg"
                                            />
                                          ) : (
                                            <div className="w-16 h-12 bg-thai-cream/30 border border-thai-orange/20 rounded-lg flex items-center justify-center">
                                              <span className="text-thai-orange text-lg">
                                                🍽️
                                              </span>
                                            </div>
                                          )}

                                          <div className="flex-1">
                                            <h4 className="font-medium text-thai-green text-base mb-1">
                                              {item.nom}
                                            </h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                              <span className="flex items-center gap-1">
                                                <span className="font-medium">
                                                  Quantité:
                                                </span>
                                                <span className="bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full font-medium">
                                                  {item.quantite}
                                                </span>
                                              </span>
                                              <span className="flex items-center gap-2">
                                                <span className="font-medium">
                                                  Prix unitaire:
                                                </span>
                                                <Badge variant="secondary">
                                                  {formatPrix(item.prix)}
                                                </Badge>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="text-right">
                                            <div className="text-lg font-bold text-thai-orange mb-3">
                                              {formatPrix(
                                                item.prix * item.quantite
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  modifierQuantite(
                                                    item.uniqueId!,
                                                    item.quantite - 1
                                                  );
                                                }}
                                              >
                                                -
                                              </Button>
                                              <span className="w-6 text-center font-medium text-sm">
                                                {item.quantite}
                                              </span>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  modifierQuantite(
                                                    item.uniqueId!,
                                                    item.quantite + 1
                                                  );
                                                }}
                                              >
                                                +
                                              </Button>
                                              <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  supprimerDuPanier(
                                                    item.uniqueId!
                                                  );
                                                  toast({
                                                    title: 'Article supprimé',
                                                    description: `${item.nom} a été retiré de votre panier.`,
                                                  });
                                                }}
                                                className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-red-300"
                                                aria-label="Supprimer l'article"
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </DishDetailsModalInteractive>
                                    ) : (
                                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 opacity-50">
                                          <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-400 text-lg">🍽️</span>
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium text-gray-500 text-base mb-1">
                                              {item.nom}
                                            </h4>
                                            <p className="text-sm text-gray-400">Plat supprimé</p>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-lg font-bold text-gray-400 mb-3">
                                              {formatPrix(item.prix * item.quantite)}
                                            </div>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              onClick={() => {
                                                supprimerDuPanier(item.uniqueId!);
                                                toast({
                                                  title: 'Article supprimé',
                                                  description: `${item.nom} a été retiré de votre panier.`,
                                                });
                                              }}
                                              className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }
                        );
                      })()}

                      <div className="flex justify-between items-center bg-thai-cream/30 p-3 rounded-lg mb-4">
                        <span className="text-lg font-bold text-thai-green">
                          Total de la commande :
                        </span>
                        <span className="text-xl font-bold text-thai-orange">
                          {formatPrix(totalPrix)}
                        </span>
                      </div>

                      <Alert className="bg-green-50/50 border-green-200 text-green-800 mb-4">
                        <CreditCard className="h-4 w-4 !text-green-700" />
                        <AlertDescription className="font-medium">
                          Paiement sur place : Nous acceptons la carte bleue.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-3 mb-4">
                        <div>
                          <Label
                            htmlFor="demandesSpecialesSidebar"
                            className="text-xs"
                          >
                            Demandes spéciales
                          </Label>
                          <Textarea
                            id="demandesSpecialesSidebar"
                            placeholder="Allergies, etc."
                            value={demandesSpeciales}
                            onChange={e => setDemandesSpeciales(e.target.value)}
                            className="h-16 text-xs border border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5"
                          />
                        </div>
                      </div>

                      <Card className="border-thai-green/20 bg-gradient-to-r from-thai-cream/30 to-thai-gold/10 mb-4 backdrop-blur-sm">
                        <CardContent className="p-3">
                          <div className="text-center space-y-3">
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-xs text-yellow-800 text-center font-medium">
                                ⏳ Votre commande sera mise en attente de
                                confirmation. Nous la traiterons dans les plus
                                brefs délais.
                              </p>
                            </div>

                            <div className="text-center text-xs text-thai-green/80 p-2 bg-thai-cream/50 rounded-lg">
                              <div className="flex items-center justify-center gap-2">
                                <MapPin className="h-3 w-3 text-thai-orange" />
                                <span>
                                  Adresse de retrait : 2 impasse de la poste
                                  37120 Marigny Marmande
                                </span>
                              </div>
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <Phone className="h-3 w-3 text-thai-orange" />
                                <span>Contact : 07 49 28 37 07</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>

                    <div className="border-t p-4">
                      <Button
                        onClick={validerCommande}
                        disabled={
                          createCommande.isPending ||
                          !currentUser ||
                          !clientFirebaseUID
                        }
                        className="w-full bg-thai-orange text-lg py-6 transition-all duration-200 hover:scale-105"
                      >
                        {createCommande.isPending ? (
                          <Loader2 className="animate-spin mr-2 h-6 w-6" />
                        ) : (
                          <CreditCard className="mr-2 h-6 w-6" />
                        )}
                        Valider ma commande ({formatPrix(totalPrix)})
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Mobile - Bouton flottant */}
              {isMobile && panier.length > 0 && (
                <Button
                  onClick={() => setIsCartOpen(true)}
                  className="fixed top-24 right-6 z-50 h-16 w-16 rounded-full bg-thai-orange hover:bg-thai-orange/90 shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <div className="flex flex-col items-center relative">
                    <ShoppingCart className="h-6 w-6" />
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-thai-gold text-thai-green font-bold text-xs flex items-center justify-center"
                    >
                      {panier.reduce((total, item) => total + item.quantite, 0)}
                    </Badge>
                  </div>
                </Button>
              )}

              {/* Mobile - Overlay Modal */}
              {isMobile && isCartOpen && (
                <div className="fixed inset-0 z-50 bg-black/50">
                  <div className="absolute inset-0 bg-white">
                    <div className="h-full flex flex-col">
                      <div className="bg-gradient-to-r from-thai-orange to-thai-gold text-white p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ShoppingCart className="h-6 w-6 mr-2" />
                            <h2 className="text-lg font-bold">Mon Panier</h2>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCartOpen(false)}
                            className="text-white hover:bg-white/20"
                          >
                            <X className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        {(() => {
                          const groupedByDate = panier.reduce(
                            (groups, item) => {
                              const dateKey =
                                item.dateRetrait?.toDateString() || 'no-date';
                              if (!groups[dateKey]) {
                                groups[dateKey] = [];
                              }
                              groups[dateKey].push(item);
                              return groups;
                            },
                            {} as Record<string, PlatPanier[]>
                          );

                          return Object.entries(groupedByDate).map(
                            ([dateKey, items]) => {
                              const dateRetrait = items[0]?.dateRetrait;
                              const totalGroupe = items.reduce(
                                (sum, item) => sum + item.prix * item.quantite,
                                0
                              );

                              return (
                                <div
                                  key={dateKey}
                                  className="mb-4 border border-thai-orange/20 rounded-lg p-4 bg-thai-cream/20"
                                >
                                  {dateRetrait && (
                                    <div className="mb-3 pb-2 border-b border-thai-orange/10">
                                      <h4 className="font-semibold text-thai-green flex items-center gap-2 text-lg">
                                        <CalendarIconLucide className="h-5 w-5 text-thai-orange" />
                                        {format(dateRetrait, 'cccc dd MMMM', {
                                          locale: fr,
                                        }).replace(/^\w/, c =>
                                          c.toUpperCase()
                                        )}{' '}
                                        à {format(dateRetrait, 'HH:mm')}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {formatPrix(totalGroupe)} (
                                        {items.reduce(
                                          (total, item) =>
                                            total + item.quantite,
                                          0
                                        )}{' '}
                                        plat
                                        {items.reduce(
                                          (total, item) =>
                                            total + item.quantite,
                                          0
                                        ) > 1
                                          ? 's'
                                          : ''}
                                        )
                                      </p>
                                    </div>
                                  )}

                                  <div className="space-y-3">
                                    {items.map(item => {
                                      const platData = plats?.find(
                                        p => p.id.toString() === item.id
                                      );
                                      const imageUrl = platData?.photo_du_plat;

                                      return platData ? (
                                        <DishDetailsModalInteractive
                                          key={item.uniqueId}
                                          plat={platData}
                                          formatPrix={formatPrix}
                                          onAddToCart={handleAjouterAuPanier}
                                          currentQuantity={getCurrentQuantity(platData.idplats)}
                                          dateRetrait={item.dateRetrait}
                                        >
                                          <div className="flex items-center gap-3 p-3 rounded bg-white/60 cursor-pointer hover:bg-white/80 transition-colors">
                                            {imageUrl ? (
                                              <img
                                                src={imageUrl}
                                                alt={item.nom}
                                                className="w-12 h-12 object-cover rounded border border-thai-orange/20"
                                              />
                                            ) : (
                                              <div className="w-12 h-12 bg-thai-cream/30 border border-thai-orange/20 rounded flex items-center justify-center">
                                                <span className="text-thai-orange">
                                                  🍽️
                                                </span>
                                              </div>
                                            )}

                                            <div className="flex-1">
                                              <p className="text-thai-green font-bold cursor-pointer hover:text-thai-orange transition-colors text-base"
                                                onMouseEnter={() =>
                                                  setHighlightedPlatId(item.id)
                                                }
                                                onMouseLeave={() =>
                                                  setHighlightedPlatId(null)
                                                }
                                              >
                                                {item.nom}
                                              </p>
                                              <p className="text-thai-orange font-medium text-sm">
                                                {formatPrix(
                                                  item.prix * item.quantite
                                                )}
                                              </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  modifierQuantite(
                                                    item.uniqueId!,
                                                    item.quantite - 1
                                                  );
                                                }}
                                              >
                                                -
                                              </Button>
                                              <span className="w-6 text-center font-medium">
                                                {item.quantite}
                                              </span>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  modifierQuantite(
                                                    item.uniqueId!,
                                                    item.quantite + 1
                                                  );
                                                }}
                                              >
                                                +
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  supprimerDuPanier(
                                                    item.uniqueId!
                                                  );
                                                  toast({
                                                    title: 'Article supprimé',
                                                    description: `${item.nom} retiré du panier.`,
                                                  });
                                                }}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </DishDetailsModalInteractive>
                                      ) : (
                                          <div className="flex items-center gap-3 p-3 rounded bg-white/60 opacity-50">
                                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                              <span className="text-gray-400">🍽️</span>
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-gray-500 font-bold text-base">
                                                {item.nom}
                                              </p>
                                              <p className="text-gray-400 text-sm">Plat supprimé</p>
                                            </div>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                supprimerDuPanier(item.uniqueId!);
                                                toast({
                                                  title: 'Article supprimé',
                                                  description: `${item.nom} retiré du panier.`,
                                                });
                                              }}
                                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            }
                          );
                        })()}
                      </div>

                      <div className="border-t p-4 bg-white">
                        <div className="text-center font-bold text-xl text-thai-green mb-4">
                          Total: {formatPrix(totalPrix)}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="demandesSpecialesMobile">
                              Demandes spéciales
                            </Label>
                            <Textarea
                              id="demandesSpecialesMobile"
                              placeholder="Allergies, etc."
                              value={demandesSpeciales}
                              onChange={e =>
                                setDemandesSpeciales(e.target.value)
                              }
                              className="h-20 border border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5"
                            />
                          </div>

                          <Button
                            onClick={() => {
                              validerCommande();
                              setIsCartOpen(false);
                            }}
                            disabled={
                              createCommande.isPending ||
                              !currentUser ||
                              !clientFirebaseUID
                            }
                            className="w-full bg-thai-orange text-xl py-8"
                          >
                            {createCommande.isPending ? (
                              <Loader2 className="animate-spin mr-2 h-6 w-6" />
                            ) : (
                              <CreditCard className="mr-2 h-6 w-6" />
                            )}
                            Valider ({formatPrix(totalPrix)})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
});

Commander.displayName = 'Commander';

export default Commander;
