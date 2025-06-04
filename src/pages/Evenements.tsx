// src/pages/Evenements.tsx
import { useState, useEffect, memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, Users, Database, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, startOfDay, type Locale } from 'date-fns';
import { fr, enUS, th } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { usePlats, useAirtableConfig, useCreateEvenement, useClientByFirebaseUID, type EvenementInputData } from '@/hooks/useAirtable';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Evenements = memo(() => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { config } = useAirtableConfig();
  const { plats, isLoading: platsLoading, error: platsError } = usePlats();
  const createEvenement = useCreateEvenement();

  const [dateEvenement, setDateEvenement] = useState<Date | undefined>();
  const [heureEvenement, setHeureEvenement] = useState<string>('');
  const [platsPreSelectionnes, setPlatsPreSelectionnes] = useState<string[]>([]);
  const [autreTypeEvenementPrecision, setAutreTypeEvenementPrecision] = useState<string>('');

  const initialFormData = {
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const { currentUser, isLoadingAuth } = useAuth();
  const { isLoading: isLoadingAirtableClient, airtableRecordId } =
    useClientByFirebaseUID(currentUser?.uid);

  const typesEvenements = [
    t('events.eventTypes.birthday', 'Anniversaire'),
    t('events.eventTypes.corporateMeal', 'Repas d\'entreprise'),
    t('events.eventTypes.familyParty', 'Fête de famille'),
    t('events.eventTypes.cocktail', 'Cocktail dînatoire'),
    t('events.eventTypes.cateringBuffet', 'Buffet traiteur'),
    t('events.eventTypes.other', 'Autre')
  ];

  const heuresDisponibles = useMemo(() => {
    const heures: string[] = [];
    const heureDebut = 11; const heureFin = 22;
    for (let h = heureDebut; h <= heureFin; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === heureFin && m > 0) break;
        heures.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return heures;
  }, []);

  const handleInputChange = (field: keyof typeof initialFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'typeEvenement' && value !== t('events.eventTypes.other', 'Autre')) {
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
    if (!currentUser?.email) {
      toast({ title: t('common.error'), description: t('events.toasts.profileRequired'), variant: "destructive" }); return;
    }
    if (!airtableRecordId) {
      toast({ title: t('common.error'), description: t('events.toasts.completeProfile'), variant: "destructive" }); return;
    }
    if (!dateEvenement || !formData.typeEvenement || !formData.nombrePersonnes) {
      toast({ title: t('common.error'), description: t('events.toasts.missingInfo'), variant: "destructive" }); return;
    }
    if (formData.typeEvenement === t('events.eventTypes.other', 'Autre') && !autreTypeEvenementPrecision.trim()) {
        toast({ title: t('common.error'), description: t('events.form.specifyOtherType'), variant: "destructive" }); return;
    }
    if (parseInt(formData.nombrePersonnes) < 10) {
        toast({ title: t('common.error'), description: t('events.form.guestCountMinError', 'Le nombre de personnes doit être d\'au moins 10.'), variant: "destructive"}); return;
    }

    let dateEvenementISO = dateEvenement.toISOString().split('T')[0];
    if (heureEvenement) {
        const [heures, minutes] = heureEvenement.split(':');
        const dateAvecHeure = new Date(dateEvenement);
        dateAvecHeure.setHours(parseInt(heures), parseInt(minutes), 0, 0);
        dateEvenementISO = dateAvecHeure.toISOString();
    }
    
    let nomEvenementAirtable: string | undefined;
    let typeEvenementAirtable = formData.typeEvenement;

    if (formData.typeEvenement === t('events.eventTypes.other', 'Autre')) {
        typeEvenementAirtable = t('events.eventTypes.other', 'Autre');
        nomEvenementAirtable = autreTypeEvenementPrecision.trim() || `Événement ${format(dateEvenement, 'dd/MM/yyyy')}`;
    } else {
        nomEvenementAirtable = formData.typeEvenement;
    }
    
    const evenementData: EvenementInputData = {
        nomEvenement: nomEvenementAirtable,
        contactEmail: currentUser.email,
        dateEvenement: dateEvenementISO,
        typeEvenement: typeEvenementAirtable,
        nombrePersonnes: parseInt(formData.nombrePersonnes),
        budgetClient: formData.budgetClient ? parseFloat(formData.budgetClient) : undefined,
        demandesSpecialesEvenement: formData.demandesSpeciales,
        platsPreSelectionnesR: platsPreSelectionnes.length > 0 ? platsPreSelectionnes : undefined,
    };

    try {
      await createEvenement.mutateAsync(evenementData);
      toast({ title: t('events.toasts.success') });
      setFormData(initialFormData);
      setDateEvenement(undefined); setHeureEvenement(''); setPlatsPreSelectionnes([]); setAutreTypeEvenementPrecision('');
    } catch (error) {
      toast({ title: t('common.error'), description: error instanceof Error ? error.message : t('events.toasts.errorSubmit'), variant: "destructive"});
    }};

  const getDateLocale = (): Locale => {
    const lang = i18n.language;
    if (lang.startsWith('en')) return enUS;
    if (lang.startsWith('th')) return th;
    return fr;
   };

  if (isLoadingAuth || (currentUser && isLoadingAirtableClient)) { 
    return <div className="flex items-center justify-center min-h-screen bg-gradient-thai"><div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin"></div><span className="ml-3 text-thai-green">{t('common.loading')}</span></div>;
  }
  if (!config) { 
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert className="border-amber-200 bg-amber-50">
            <Database className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800"><strong>{t('common.configRequired')} :</strong> {t('common.configAirtableEvents')}</AlertDescription>
          </Alert>
          <div className="text-center mt-6"><Link to="/admin"><Button className="bg-thai-orange">{t('common.configureAirtable')}</Button></Link></div>
        </div>
      </div>
    );
  }
  
  const showProfileAlert = !currentUser || !airtableRecordId;

  if (platsError) { 
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert variant="destructive"><AlertCircleIcon className="h-4 w-4" /><AlertDescription>{platsError.message || t('common.errorLoadingDishes')}</AlertDescription></Alert>
        </div>
      </div>
    );
   }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="shadow-xl border-thai-orange/20">
            <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
              <div className="flex items-center justify-center mb-2"><Users className="h-8 w-8 mr-2" /><CardTitle className="text-3xl font-bold">{t('events.title')}</CardTitle></div>
              <CardDescription className="text-white/90 px-4">
                {t('events.subtitle', "Si vous avez une occasion spéciale à célébrer, organisez votre événement avec nos menus personnalisés.")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {showProfileAlert && (
                  <Alert className="mb-6 border-blue-200 bg-blue-50">
                      <AlertCircleIcon className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                          <strong>{t('events.alerts.profileRequired.title')}</strong>{' '}
                          {t('events.alerts.profileRequired.description')}
                          {!currentUser && <Link to="/profil" className="ml-1 underline font-medium">{t('events.alerts.profileRequired.loginLink')}</Link>}
                          {currentUser && !airtableRecordId && <Link to="/profil" className="ml-1 underline font-medium">{t('events.alerts.profileRequired.completeProfileLink')}</Link>}
                      </AlertDescription>
                  </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="typeEvenement">{t('events.form.eventType')} *</Label>
                    <Select value={formData.typeEvenement} onValueChange={(value) => handleInputChange('typeEvenement', value)} >
                      <SelectTrigger id="typeEvenement"><SelectValue placeholder={t('events.form.selectType')} /></SelectTrigger>
                      <SelectContent>{typesEvenements.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  {formData.typeEvenement === t('events.eventTypes.other', 'Autre') ? (
                    <div className="space-y-2">
                      <Label htmlFor="autreTypeEvenementPrecision">{t('events.form.specifyOtherTypeLabel')} *</Label>
                      <Input id="autreTypeEvenementPrecision" value={autreTypeEvenementPrecision} onChange={(e) => setAutreTypeEvenementPrecision(e.target.value)} placeholder={t('events.form.specifyOtherTypePlaceholder')} />
                    </div>
                  ) : <div className="md:block hidden"></div> }
                </div>
                
                {formData.typeEvenement === t('events.eventTypes.other', 'Autre') && typeof window !== 'undefined' && window.innerWidth < 768 && (
                    <div className="space-y-2 md:col-span-2 pt-4">
                      <Label htmlFor="autreTypeEvenementPrecisionMobile">{t('events.form.specifyOtherTypeLabel')} *</Label>
                      <Input id="autreTypeEvenementPrecisionMobile" value={autreTypeEvenementPrecision} onChange={(e) => setAutreTypeEvenementPrecision(e.target.value)} placeholder={t('events.form.specifyOtherTypePlaceholder')} />
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('events.form.eventDate')} *</Label>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal",!dateEvenement && "text-muted-foreground")}><CalendarIconLucide className="mr-2 h-4 w-4" />{dateEvenement ? format(dateEvenement, "PPP", { locale: getDateLocale() }) : <span>{t('events.form.selectDate')}</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateEvenement} onSelect={setDateEvenement} disabled={(date) => { const fourteenDaysFromNow = new Date(); fourteenDaysFromNow.setDate(startOfDay(new Date()).getDate() + 13); return date < startOfDay(fourteenDaysFromNow); }} initialFocus locale={getDateLocale()}/></PopoverContent></Popover>
                    <p className="text-xs text-gray-500">{t('events.form.noticePeriod')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureEvenement">{t('events.form.eventTimeLabel')}</Label>
                    <Select value={heureEvenement} onValueChange={setHeureEvenement} >
                      <SelectTrigger id="heureEvenement"><SelectValue placeholder={t('events.form.selectTime')} /></SelectTrigger>
                      <SelectContent>{heuresDisponibles.map(heure => (<SelectItem key={heure} value={heure}>{heure}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombrePersonnes">{t('events.form.guestCount')} *</Label>
                    <Input id="nombrePersonnes" type="number" min="10" value={formData.nombrePersonnes} onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)} placeholder={t('events.form.guestCountPlaceholder')}/>
                    <p className="text-xs text-gray-500">{t('events.form.guestCountMinInfo')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetClient">{t('events.form.budget')}</Label>
                    {/* MODIFIÉ : step="1" pour le budget */}
                    <Input id="budgetClient" type="number" step="1" min="0" value={formData.budgetClient} onChange={(e) => handleInputChange('budgetClient', e.target.value)} placeholder={t('events.form.budgetPlaceholder')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demandesSpeciales">{t('events.form.specialRequests')}</Label>
                  <Textarea id="demandesSpeciales" value={formData.demandesSpeciales} onChange={(e) => handleInputChange('demandesSpeciales', e.target.value)} rows={4} placeholder={t('events.form.specialRequestsPlaceholderEvent')} />
                </div>

                {!platsLoading && plats && plats.length > 0 && (
                  <div className="space-y-4 border-t pt-6">
                    <Label className="text-lg font-semibold text-thai-green">{t('events.form.desiredDishes', 'Les plats désirés')}</Label>
                    {/* MODIFIÉ : La grille des plats ne scrolle plus, elle s'étend */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-2">
                      {plats.map(plat => (
                        <div key={plat.id} className="flex items-center space-x-3"> {/* items-center pour un meilleur alignement vertical */}
                          <Checkbox
                            id={`plat-event-${plat.id}`}
                            checked={platsPreSelectionnes.includes(plat.id)}
                            onCheckedChange={(checked) => handlePlatSelectionChange(plat.id, !!checked)}
                            className="mt-0.5" // Ajustement pour l'alignement
                          />
                          <div className="flex-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Label htmlFor={`plat-event-${plat.id}`} className="font-medium cursor-pointer hover:text-thai-orange">
                                  {plat.plat}
                                </Label>
                              </TooltipTrigger>
                              <TooltipContent className="w-64 bg-white border-thai-orange text-thai-green p-2 rounded-md shadow-lg z-50">
                                {plat.photoDuPlat && (
                                  <img src={plat.photoDuPlat} alt={plat.plat} className="w-full h-32 object-cover rounded-md mb-2" />
                                )}
                                <p className="text-sm font-semibold">{plat.plat}</p>
                                {plat.description && (
                                  <p className="text-xs text-gray-600 mt-1">{plat.description}</p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                    </div>
                    {platsPreSelectionnes.length > 0 && (<p className="text-sm text-muted-foreground">{t('events.form.dishesSelected', { count: platsPreSelectionnes.length })}</p>)}
                  </div>
                )}
                {platsLoading && <div className="flex items-center justify-center pt-4"><div className="w-6 h-6 border-2 border-thai-orange border-t-transparent rounded-full animate-spin mr-2"></div>{t('common.loading')}</div>}


                <div className="bg-thai-cream/50 border border-thai-gold/30 rounded-lg p-4">
                  <h4 className="font-semibold text-thai-green mb-2">{t('events.confirmationProcess.title')}</h4>
                  <p className="text-sm text-thai-green/80">{t('events.confirmationProcess.description')}</p>
                  <ul className="text-sm text-thai-green/80 mt-2 ml-4 list-disc space-y-1">
                    <li>{t('events.confirmationProcess.step1')}</li><li>{t('events.confirmationProcess.step2')}</li><li>{t('events.confirmationProcess.step3')}</li><li>{t('events.confirmationProcess.step4')}</li><li>{t('events.confirmationProcess.step5')}</li>
                  </ul>
                </div>
                <Button 
                  type="submit" 
                  disabled={createEvenement.isPending || !formData.typeEvenement || !dateEvenement || !formData.nombrePersonnes || (formData.typeEvenement === t('events.eventTypes.other', 'Autre') && !autreTypeEvenementPrecision.trim()) || !currentUser || !airtableRecordId} 
                  className="w-full bg-thai-orange"
                >
                  {createEvenement.isPending ? t('events.form.sending') : t('events.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
});
Evenements.displayName = 'Evenements';
export default Evenements;