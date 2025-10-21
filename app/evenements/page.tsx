'use client';
import { AppLayout } from '@/components/AppLayout';
import { useState, useMemo, memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar as CalendarIconLucide,
  Users,
  AlertCircle as AlertCircleIcon,
  Loader2,
  Clock,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format, type Locale } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useData } from '@/contexts/DataContext';
import { useCreateEvenement } from '@/hooks/useSupabaseData';
import type { PlatUI as Plat, CreateEvenementData } from '@/types/app';
import { useAuth } from '@/contexts/AuthContext';

export const dynamic = 'force-dynamic';

const Evenements = memo(() => {
  const { toast } = useToast();
  const createEvenement = useCreateEvenement();

  const { plats, isLoading: dataIsLoading, error: dataError } = useData();
  const { currentUser, currentUserProfile } = useAuth();

  const [dateEvenement, setDateEvenement] = useState<Date | undefined>();
  const [heureEvenement, setHeureEvenement] = useState<string>('');
  const [platsPreSelectionnes, setPlatsPreSelectionnes] = useState<string[]>(
    []
  );
  const [autreTypeEvenementPrecision, setAutreTypeEvenementPrecision] =
    useState<string>('');
  const initialFormData = {
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const typesEvenements = useMemo(
    () => [
      'Anniversaire',
      "Repas d'entreprise",
      'Fête de famille',
      'Cocktail dînatoire',
      'Buffet traiteur',
      'Autre',
    ],
    []
  );

  const heuresDisponibles = useMemo(() => {
    const heures: string[] = [];
    for (let h = 9; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 23 && m > 0) break;
        heures.push(
          `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
        );
      }
    }
    return heures;
  }, []);

  const handleInputChange = (
    field: keyof typeof initialFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'typeEvenement' && value !== 'Autre') {
      setAutreTypeEvenementPrecision('');
    }
  };

  const handlePlatSelectionChange = (platId: string, checked: boolean) => {
    setPlatsPreSelectionnes(prev =>
      checked ? [...prev, platId] : prev.filter(id => id !== platId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id || !currentUserProfile?.idclient) {
      toast({
        title: 'Profil requis',
        description:
          'Veuillez vous connecter et compléter votre profil pour faire une demande.',
        variant: 'destructive',
      });
      return;
    }
    if (
      !dateEvenement ||
      !formData.typeEvenement ||
      !formData.nombrePersonnes
    ) {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs obligatoires (*).',
        variant: 'destructive',
      });
      return;
    }
    if (
      formData.typeEvenement === 'Autre' &&
      !autreTypeEvenementPrecision.trim()
    ) {
      toast({
        title: 'Précision requise',
        description: "Veuillez préciser le type d'événement.",
        variant: 'destructive',
      });
      return;
    }
    if (parseInt(formData.nombrePersonnes) < 10) {
      toast({
        title: 'Nombre de personnes',
        description: "Le nombre de personnes doit être d'au moins 10.",
        variant: 'destructive',
      });
      return;
    }

    let dateEvenementISO = dateEvenement.toISOString();
    if (heureEvenement) {
      const [heures, minutes] = heureEvenement.split(':');
      dateEvenement.setHours(parseInt(heures), parseInt(minutes), 0, 0);
      dateEvenementISO = dateEvenement.toISOString();
    }

    // Adaptation pour Supabase
    const evenementData: CreateEvenementData = {
      nom_evenement:
        formData.typeEvenement === 'Autre'
          ? autreTypeEvenementPrecision.trim()
          : formData.typeEvenement,
      contact_client_r: currentUser.id, // UID Firebase pour le lien utilisateur
      contact_client_r_id: currentUserProfile!.idclient,
      date_evenement: dateEvenementISO,
      type_d_evenement: formData.typeEvenement,
      nombre_de_personnes: parseInt(formData.nombrePersonnes),
      budget_client: formData.budgetClient
        ? parseFloat(formData.budgetClient)
        : undefined,
      demandes_speciales_evenement: formData.demandesSpeciales,
      plats_preselectionnes: platsPreSelectionnes.map(id => parseInt(id)),
    };

    try {
      await createEvenement.mutateAsync(evenementData);
      toast({
        title: 'Demande envoyée !',
        description: 'Nous vous recontacterons bientôt.',
      });
      setFormData(initialFormData);
      setDateEvenement(undefined);
      setHeureEvenement('');
      setPlatsPreSelectionnes([]);
      setAutreTypeEvenementPrecision('');
    } catch (error) {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Une erreur est survenue.',
        variant: 'destructive',
      });
    }
  };

  const getDateLocale = (): Locale => fr;

  const isLoading = dataIsLoading;
  const showProfileAlert = !currentUser || !currentUserProfile;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-thai-orange" />
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{dataError.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai">
        {/* Bouton retour optimisé */}
        <div className="py-6 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-6 flex justify-start">
              <Link href="/" passHref>
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
                  <CalendarIconLucide className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline">Retour à l'accueil</span>
                  <span className="sm:hidden">Accueil</span>
                </Button>
              </Link>
            </div>

            <TooltipProvider>
              <div>
                <Card className="shadow-xl border-thai-orange/20">
                  <CardHeader className="text-center bg-gradient-to-r from-thai-green to-thai-orange text-white rounded-t-lg py-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <CalendarIconLucide className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl md:text-4xl font-bold">
                        Pour vos Événements
                      </CardTitle>
                    </div>
                    <CardDescription className="text-white/90 px-4 text-lg max-w-2xl mx-auto">
                      Créez des moments inoubliables avec nos saveurs authentiques thaïlandaises.
                    </CardDescription>
                    <div className="flex items-center justify-center mt-4 text-white/80 text-sm">
                      <CalendarIconLucide className="w-4 h-4 mr-2" />
                      <span>
                        Minimum 10 personnes • Service professionnel • Devis gratuit
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    {showProfileAlert && (
                      <Alert className="mb-6 border-thai-orange/30 bg-thai-cream/50">
                        <AlertCircleIcon className="h-4 w-4 text-thai-orange" />
                        <AlertDescription className="text-thai-green">
                          <strong>Connexion requise :</strong> Veuillez vous connecter pour faire une demande d'événement.
                          {!currentUser && (
                            <Link
                              href="/profil"
                              className="ml-1 underline font-medium text-thai-orange hover:text-thai-orange/80"
                            >
                              Se connecter / Créer un profil
                            </Link>
                          )}
                          {currentUser && !currentUserProfile && (
                            <Link
                              href="/profil"
                              className="ml-1 underline font-medium text-thai-orange hover:text-thai-orange/80"
                            >
                              Compléter mon profil
                            </Link>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="typeEvenement">
                            Type d'événement *
                          </Label>
                          <Select
                            value={formData.typeEvenement}
                            onValueChange={value =>
                              handleInputChange('typeEvenement', value)
                            }
                          >
                            <SelectTrigger id="typeEvenement">
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                            <SelectContent>
                              {typesEvenements.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.typeEvenement === 'Autre' && (
                          <div className="space-y-2">
                            <Label htmlFor="autreTypeEvenementPrecision">
                              Précisez *
                            </Label>
                            <Input
                              id="autreTypeEvenementPrecision"
                              value={autreTypeEvenementPrecision}
                              onChange={e =>
                                setAutreTypeEvenementPrecision(e.target.value)
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center text-lg font-medium text-thai-green">
                            <CalendarIconLucide className="mr-2 h-5 w-5 text-thai-orange" />
                            Date de l'événement *
                          </Label>
                          <div className="flex gap-2">
                            <Select
                              value={
                                dateEvenement
                                  ? dateEvenement.getDate().toString().padStart(2, '0')
                                  : ''
                              }
                              onValueChange={day => {
                                if (dateEvenement) {
                                  const newDate = new Date(dateEvenement);
                                  newDate.setDate(parseInt(day));
                                  setDateEvenement(newDate);
                                } else {
                                  const today = new Date();
                                  setDateEvenement(new Date(today.getFullYear(), today.getMonth(), parseInt(day)));
                                }
                              }}
                            >
                              <SelectTrigger className="w-28 text-center [&>span]:text-center">
                                <SelectValue placeholder="Jour" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(
                                  day => (
                                    <SelectItem
                                      key={day}
                                      value={day.toString().padStart(2, '0')}
                                      className="justify-center"
                                    >
                                      {day}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <Select
                              value={
                                dateEvenement
                                  ? (dateEvenement.getMonth() + 1)
                                      .toString()
                                      .padStart(2, '0')
                                  : ''
                              }
                              onValueChange={month => {
                                if (dateEvenement) {
                                  const newDate = new Date(dateEvenement);
                                  newDate.setMonth(parseInt(month) - 1);
                                  setDateEvenement(newDate);
                                } else {
                                  const today = new Date();
                                  setDateEvenement(new Date(today.getFullYear(), parseInt(month) - 1, 1));
                                }
                              }}
                            >
                              <SelectTrigger className="w-36 text-center [&>span]:text-center [&>span]:w-full [&>span]:block">
                                <SelectValue placeholder="Mois" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="01" className="justify-center">Janvier</SelectItem>
                                <SelectItem value="02" className="justify-center">Février</SelectItem>
                                <SelectItem value="03" className="justify-center">Mars</SelectItem>
                                <SelectItem value="04" className="justify-center">Avril</SelectItem>
                                <SelectItem value="05" className="justify-center">Mai</SelectItem>
                                <SelectItem value="06" className="justify-center">Juin</SelectItem>
                                <SelectItem value="07" className="justify-center">Juillet</SelectItem>
                                <SelectItem value="08" className="justify-center">Août</SelectItem>
                                <SelectItem value="09" className="justify-center">Septembre</SelectItem>
                                <SelectItem value="10" className="justify-center">Octobre</SelectItem>
                                <SelectItem value="11" className="justify-center">Novembre</SelectItem>
                                <SelectItem value="12" className="justify-center">Décembre</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={
                                dateEvenement ? dateEvenement.getFullYear().toString() : ''
                              }
                              onValueChange={year => {
                                if (dateEvenement) {
                                  const newDate = new Date(dateEvenement);
                                  newDate.setFullYear(parseInt(year));
                                  setDateEvenement(newDate);
                                } else {
                                  setDateEvenement(new Date(parseInt(year), 0, 1));
                                }
                              }}
                            >
                              <SelectTrigger className="w-28 text-center [&>span]:text-center">
                                <SelectValue placeholder="Année" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  { length: 5 },
                                  (_, i) => new Date().getFullYear() + i
                                ).map(year => (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                    className="justify-center"
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="heureEvenement"
                            className="flex items-center text-lg font-medium text-thai-green"
                          >
                            <Clock className="mr-2 h-5 w-5 text-thai-orange" />
                            Heure de l'événement *
                          </Label>
                          <Select
                            value={heureEvenement}
                            onValueChange={setHeureEvenement}
                          >
                            <SelectTrigger
                              id="heureEvenement"
                              className="h-12 border-thai-orange/30 hover:border-thai-orange transition-colors duration-200"
                            >
                              <SelectValue
                                placeholder="🕐 Sélectionner une heure"
                                className="text-thai-green/60"
                              />
                            </SelectTrigger>
                            <SelectContent className="border-thai-orange/20">
                              {heuresDisponibles.map(h => (
                                <SelectItem
                                  key={h}
                                  value={h}
                                  className="hover:bg-thai-orange/10"
                                >
                                  <span className="flex items-center">
                                    🕐 {h}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombrePersonnes">
                            Nombre de personnes *
                          </Label>
                          <Input
                            id="nombrePersonnes"
                            type="number"
                            min="10"
                            value={formData.nombrePersonnes}
                            onChange={e =>
                              handleInputChange(
                                'nombrePersonnes',
                                e.target.value
                              )
                            }
                          />
                          <p className="text-xs text-gray-500">
                            Minimum de 10 personnes.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budgetClient">
                            Budget indicatif (€)
                          </Label>
                          <Input
                            id="budgetClient"
                            type="number"
                            step="1"
                            min="0"
                            value={formData.budgetClient}
                            onChange={e =>
                              handleInputChange('budgetClient', e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="demandesSpeciales">
                          Demandes spéciales / Thème
                        </Label>
                        <Textarea
                          id="demandesSpeciales"
                          value={formData.demandesSpeciales}
                          onChange={e =>
                            handleInputChange(
                              'demandesSpeciales',
                              e.target.value
                            )
                          }
                          rows={4}
                          placeholder="Allergies, régimes spécifiques..."
                        />
                      </div>

                      <div className="space-y-4 border-t pt-6">
                        <Label className="text-lg font-semibold text-thai-green">
                          Les plats désirés
                        </Label>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-2">
                          {plats?.map((plat: Plat) => (
                            <div
                              key={plat.id}
                              className="flex items-center space-x-3"
                            >
                              <Checkbox
                                id={`plat-event-${plat.id}`}
                                checked={platsPreSelectionnes.includes(
                                  plat.id.toString()
                                )}
                                onCheckedChange={checked =>
                                  handlePlatSelectionChange(
                                    plat.id.toString(),
                                    !!checked
                                  )
                                }
                              />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Label
                                    htmlFor={`plat-event-${plat.id}`}
                                    className="font-medium cursor-pointer hover:text-thai-orange"
                                  >
                                    {plat.plat}
                                  </Label>
                                </TooltipTrigger>
                                <TooltipContent className="w-64 bg-white border-thai-orange p-2 rounded-md shadow-lg">
                                  {plat.photo_du_plat && (
                                    <img
                                      src={plat.photo_du_plat}
                                      alt={plat.plat}
                                      className="w-full h-32 object-cover rounded-md mb-2"
                                    />
                                  )}
                                  <p className="text-sm font-semibold">
                                    {plat.plat}
                                  </p>
                                  {plat.description && (
                                    <p className="text-xs text-gray-600 mt-1">
                                      {plat.description}
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ))}
                        </div>
                        {platsPreSelectionnes.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {platsPreSelectionnes.length} plat(s) sélectionné(s)
                          </p>
                        )}
                      </div>

                      <div className="bg-gradient-to-r from-thai-cream/50 to-thai-gold/10 border border-thai-orange/20 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-thai-orange/10 rounded-full flex items-center justify-center mr-3">
                            <CalendarIconLucide className="w-4 h-4 text-thai-orange" />
                          </div>
                          <h4 className="font-bold text-thai-green text-lg">
                            Comment ça marche ?
                          </h4>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm text-thai-green/80">
                          <div className="flex items-start space-x-2">
                            <span className="bg-thai-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                            <span>Envoyez votre demande avec vos préférences</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="bg-thai-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                            <span>Nous vous appelons sous 24h pour les détails</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="bg-thai-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                            <span>Devis gratuit personnalisé selon vos besoins</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="bg-thai-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                            <span>Confirmation et préparation de votre événement</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-thai-orange/20 pt-6">
                        <Button
                          type="submit"
                          disabled={
                            createEvenement.isPending || showProfileAlert
                          }
                          className="
                          w-full h-14 text-lg font-semibold
                          bg-gradient-to-r from-thai-green to-thai-orange
                          hover:from-thai-green/90 hover:to-thai-orange/90
                          transition-all duration-300 hover:scale-105 hover:shadow-xl
                          border-0 disabled:opacity-50 disabled:hover:scale-100 text-white
                        "
                        >
                          {createEvenement.isPending ? (
                            <>
                              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <CalendarIconLucide className="mr-3 h-6 w-6" />
                              Envoyer ma demande d'événement
                            </>
                          )}
                        </Button>

                        <div className="text-center mt-4 space-y-2">
                          <p className="text-sm text-thai-green/70 font-medium">
                            ✨ Réponse garantie sous 24h
                          </p>
                          <p className="text-xs text-thai-green/60">
                            💰 Devis gratuit • 🍽️ Service professionnel • 📞 Support personnalisé
                          </p>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </AppLayout>
  );
});

Evenements.displayName = 'Evenements';

export default Evenements;
