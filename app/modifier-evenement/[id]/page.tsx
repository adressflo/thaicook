'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
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
  ArrowLeft,
  Loader2,
  AlertCircle as AlertCircleIcon,
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
import { usePrismaEvenementById, usePrismaUpdateEvenement } from "@/hooks/usePrismaData";
import type { PlatUI as Plat, EvenementInputData } from '@/types/app';
import { useSession } from '@/lib/auth-client';
import { getClientProfile } from '@/app/profil/actions';

const ModifierEvenement = memo(() => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const updateEvenement = usePrismaUpdateEvenement();

  const { plats, isLoading: dataIsLoading } = useData();
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [clientProfile, setClientProfile] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile);
    } else {
      setClientProfile(null);
    }
  }, [currentUser?.id]);

  const {
    data: evenement,
    isLoading: isLoadingEvenement,
    error,
  } = usePrismaEvenementById(id ? Number(id) : undefined);

  const [dateEvenement, setDateEvenement] = useState<Date | undefined>();
  const [heureEvenement, setHeureEvenement] = useState<string>('');
  const [platsPreSelectionnes, setPlatsPreSelectionnes] = useState<string[]>(
    []
  );
  const [autreTypeEvenementPrecision, setAutreTypeEvenementPrecision] =
    useState<string>('');
  const [formData, setFormData] = useState({
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: '',
  });

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

  // Charger les données de l'événement
  useEffect(() => {
    if (evenement) {
      setFormData({
        typeEvenement: evenement.type_d_evenement || '',
        nombrePersonnes: evenement.nombre_de_personnes?.toString() || '',
        budgetClient: evenement.budget_client?.toString() || '',
        demandesSpeciales: evenement.demandes_speciales_evenement || '',
      });

      // Si type "Autre", remplir le champ de précision
      if (evenement.type_d_evenement === 'Autre') {
        setAutreTypeEvenementPrecision(evenement.nom_evenement || '');
      }

      // Date et heure
      if (evenement.date_evenement) {
        const date = new Date(evenement.date_evenement);
        setDateEvenement(date);
        setHeureEvenement(format(date, 'HH:mm'));
      }

      // Plats présélectionnés
      if (evenement.plats_preselectionnes) {
        setPlatsPreSelectionnes(
          evenement.plats_preselectionnes.map(id => id.toString())
        );
      }
    }
  }, [evenement]);

  // Gérer la redirection si l'utilisateur n'est pas autorisé
  useEffect(() => {
    if (
      !isLoadingEvenement &&
      evenement &&
      clientProfile?.idclient !== evenement.contact_client_r
    ) {
      router.replace('/historique');
    }
  }, [isLoadingEvenement, evenement, clientProfile, router]);

  const isLoading = isLoadingEvenement || dataIsLoading;

  if (isLoading) {
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
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            Impossible de charger cet événement. Il n'existe peut-être pas ou a été supprimé.
          </AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/historique">Retour à l'historique</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  // Vérifier si l'événement peut être modifié
  const canEdit =
    (evenement.statut_evenement as any) !== 'Réalisé' &&
    (evenement.statut_evenement as any) !== 'Payé intégralement';

  if (!canEdit) {
    return (
      <div className="p-8">
        <Alert className="max-w-md">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            Cet événement ne peut plus être modifié car il est{' '}
            {evenement.statut_evenement?.toLowerCase()}.
          </AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/historique">Retour à l'historique</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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

    const validEventTypes = [
      'Anniversaire',
      "Repas d'entreprise",
      'Fête de famille',
      'Cocktail dînatoire',
      'Buffet traiteur',
      'Autre',
    ] as const;
    const typeEvenement = validEventTypes.includes(
      formData.typeEvenement as (typeof validEventTypes)[number]
    )
      ? (formData.typeEvenement as (typeof validEventTypes)[number])
      : ('Autre' as const);

    const updateData: Partial<EvenementInputData> = {
      nom_evenement:
        formData.typeEvenement === 'Autre'
          ? autreTypeEvenementPrecision.trim()
          : formData.typeEvenement,
      date_evenement: dateEvenementISO,
      type_d_evenement: typeEvenement,
      nombre_de_personnes: parseInt(formData.nombrePersonnes),
      budget_client: formData.budgetClient
        ? parseFloat(formData.budgetClient)
        : undefined,
      demandes_speciales_evenement: formData.demandesSpeciales,
      plats_preselectionnes: platsPreSelectionnes.map(id => parseInt(id)),
    };

    try {
      await updateEvenement.mutateAsync({
        id: evenement.idevenements,
        data: updateData as any,
      });
      toast({
        title: 'Événement modifié !',
        description: 'Vos modifications ont été sauvegardées.',
      });
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

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai">
        {/* Bouton retour optimisé */}
        <div className="py-6 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-6 flex justify-start">
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
            </div>

            <TooltipProvider>
              <div>
                <Card className="shadow-xl border-thai-orange/20">
                  <CardHeader className="text-center bg-gradient-to-r from-thai-green to-thai-orange text-white rounded-t-lg py-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl md:text-4xl font-bold">
                        Modifier l'Événement
                      </CardTitle>
                    </div>
                    <CardDescription className="text-white/90 px-4 text-lg max-w-2xl mx-auto">
                      Modifiez les détails de votre événement selon vos besoins.
                    </CardDescription>
                    <div className="flex items-center justify-center mt-4 text-white/80 text-sm">
                      <CalendarIconLucide className="w-4 h-4 mr-2" />
                      <span>
                        Statut: {evenement.statut_evenement} • Minimum 10 personnes
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 md:p-8">
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

                      <div className="border-t border-thai-orange/20 pt-6">
                        <Button
                          type="submit"
                          disabled={updateEvenement.isPending}
                          className="
                          w-full h-14 text-lg font-semibold
                          bg-gradient-to-r from-thai-green to-thai-orange
                          hover:from-thai-green/90 hover:to-thai-orange/90
                          transition-all duration-300 hover:scale-105 hover:shadow-xl
                          border-0 disabled:opacity-50 disabled:hover:scale-100 text-white
                        "
                        >
                          {updateEvenement.isPending ? (
                            <>
                              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                              Sauvegarde en cours...
                            </>
                          ) : (
                            <>
                              <Users className="mr-3 h-6 w-6" />
                              Sauvegarder les modifications
                            </>
                          )}
                        </Button>

                        <div className="text-center mt-4 space-y-2">
                          <p className="text-sm text-thai-green/70 font-medium">
                            ✨ Modifications sauvegardées immédiatement
                          </p>
                          <p className="text-xs text-thai-green/60">
                            🎉 Événement personnalisé • 👨‍🍳 Service professionnel • 📞 Support dédié
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

ModifierEvenement.displayName = 'ModifierEvenement';
export default ModifierEvenement;
