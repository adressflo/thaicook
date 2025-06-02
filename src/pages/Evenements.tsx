// src/pages/Evenements.tsx
import { useState, useEffect, memo, ChangeEvent } from 'react';
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
import { format, parse, isValid, startOfDay, type Locale } from 'date-fns'; // MODIFIÉ : isValid importé directement
import { fr, enUS, th } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { usePlats, useAirtableConfig, useCreateEvenement, useClientByFirebaseUID } from '@/hooks/useAirtable';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Evenements = memo(() => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { config } = useAirtableConfig(); 
  const { plats, isLoading: platsLoading, error: platsError } = usePlats(); // Assure-toi que usePlats retourne bien ces clés
  const createEvenement = useCreateEvenement(); // Assure-toi que ce hook retourne bien un objet avec mutateAsync et isPending
  
  const [dateEvenement, setDateEvenement] = useState<Date | undefined>();
  const [heureEvenement, setHeureEvenement] = useState<string>('');
  const [platsPreSelectionnes, setPlatsPreSelectionnes] = useState<string[]>([]);
  
  const initialFormData = {
    nomEvenement: '',
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: '', 
    contactEmail: ''
  };
  const [formData, setFormData] = useState(initialFormData);

  const { currentUser, isLoadingAuth } = useAuth(); 
  const { client: airtableClient, isLoading: isLoadingAirtableClient, airtableRecordId } = 
    useClientByFirebaseUID(currentUser?.uid);

  const typesEvenements = [
    t('events.eventTypes.birthday', 'Anniversaire'),
    t('events.eventTypes.corporateMeal', 'Repas d\'entreprise'), 
    t('events.eventTypes.familyParty', 'Fête de famille'),
    t('events.eventTypes.cocktail', 'Cocktail dînatoire'),
    t('events.eventTypes.cateringBuffet', 'Buffet traiteur'),
    t('events.eventTypes.other', 'Autre')
  ];

  const heuresDisponibles = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];
  
  useEffect(() => {
    if (currentUser?.email && !formData.contactEmail) {
      setFormData(prev => ({ ...prev, contactEmail: currentUser.email! }));
    }
  }, [currentUser, formData.contactEmail]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatSelectionChange = (platId: string, checked: boolean) => {
    setPlatsPreSelectionnes(prev => 
      checked ? [...prev, platId] : prev.filter(id => id !== platId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: t('common.error'), description: t('events.toasts.profileRequired', "Veuillez vous connecter pour faire une demande."), variant: "destructive" });
      return;
    }
    if (!airtableRecordId && currentUser) { 
      toast({ title: t('common.error'), description: t('events.toasts.completeProfile', "Veuillez d'abord compléter votre profil."), variant: "destructive" });
      return;
    }
    if (!dateEvenement || !formData.contactEmail || !formData.nomEvenement || !formData.typeEvenement || !formData.nombrePersonnes) {
      toast({ title: t('common.error'), description: t('events.toasts.missingInfo', "Veuillez remplir tous les champs obligatoires (*)."), variant: "destructive" });
      return;
    }
    let dateEvenementISO = dateEvenement.toISOString().split('T')[0];
    if (heureEvenement) {
        const [heures, minutes] = heureEvenement.split(':');
        const dateAvecHeure = new Date(dateEvenement);
        dateAvecHeure.setHours(parseInt(heures), parseInt(minutes), 0, 0);
        dateEvenementISO = dateAvecHeure.toISOString();
    }
    try {
      await createEvenement.mutateAsync({
        nomEvenement: formData.nomEvenement,
        contactEmail: formData.contactEmail,
        dateEvenement: dateEvenementISO,
        typeEvenement: formData.typeEvenement,
        nombrePersonnes: parseInt(formData.nombrePersonnes),
        budgetClient: formData.budgetClient ? parseFloat(formData.budgetClient) : undefined,
        demandesSpecialesEvenement: formData.demandesSpeciales, 
        platsPreSelectionnesR: platsPreSelectionnes.length > 0 ? platsPreSelectionnes : undefined
      });
      toast({ title: t('events.toasts.success', "Demande envoyée ! Nous vous recontacterons.") });
      setFormData({ ...initialFormData, contactEmail: currentUser.email || '' });
      setDateEvenement(undefined); setHeureEvenement(''); setPlatsPreSelectionnes([]);
    } catch (error) {
      toast({ title: t('common.error'), description: error instanceof Error ? error.message : t('events.toasts.errorSubmit', "Erreur lors de l'envoi."), variant: "destructive"});
    }};

  const getDateLocale = (): Locale => {
    const lang = i18n.language;
    if (lang.startsWith('en')) return enUS;
    if (lang.startsWith('th')) return th;
    return fr;
  };

  if (isLoadingAuth || (currentUser && isLoadingAirtableClient)) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-thai"><div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin"></div><span className="ml-3 text-thai-green">{t('common.loading', 'Chargement...')}</span></div>;
  }

  if (!config) { 
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert className="border-amber-200 bg-amber-50">
            <Database className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800"><strong>{t('common.configRequired', 'Configuration requise')} :</strong> {t('common.configAirtableEvents', 'Veuillez configurer Airtable.')}</AlertDescription>
          </Alert>
          <div className="text-center mt-6"><Link to="/admin"><Button className="bg-thai-orange">{t('common.configureAirtable', 'Configurer Airtable')}</Button></Link></div>
        </div>
      </div>
    );
  }
  
  if (currentUser && !airtableRecordId && !isLoadingAirtableClient && !isLoadingAuth) { 
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircleIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800"><strong>{t('events.toasts.profileRequired', 'Profil requis')} :</strong> {t('events.toasts.completeProfileForEvent', 'Veuillez compléter votre profil avant de demander un événement.')}</AlertDescription>
          </Alert>
          <div className="text-center"><Link to="/profil"><Button className="bg-thai-orange">{t('events.toasts.completeProfileButton', 'Compléter mon profil')}</Button></Link></div>
        </div>
      </div>
    );
  }
  
  if (platsError) { 
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert variant="destructive"><AlertCircleIcon className="h-4 w-4" /><AlertDescription>{platsError.message || t('common.errorLoadingDishes', "Erreur chargement des plats.")}</AlertDescription></Alert>
        </div>
      </div>
    );
   }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2"><Users className="h-8 w-8 mr-2" /><CardTitle className="text-3xl font-bold">{t('events.title')}</CardTitle></div>
            <CardDescription className="text-white/90">{t('events.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertCircleIcon className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800"><strong>{t('events.cateringInfo.title')}:</strong> {t('events.cateringInfo.description')}</AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">{t('events.form.contactEmail')} *</Label>
                <Input id="contactEmail" type="email" value={formData.contactEmail} onChange={(e) => handleInputChange('contactEmail', e.target.value)} required readOnly={!!currentUser?.email} placeholder="votreadresse@email.com"/>
                {currentUser?.email && formData.contactEmail === currentUser.email && <p className="text-xs text-gray-500">{t('events.form.emailFromProfile')}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomEvenement">{t('events.form.eventName')} *</Label>
                  <Input id="nomEvenement" value={formData.nomEvenement} onChange={(e) => handleInputChange('nomEvenement', e.target.value)} required placeholder={t('events.form.eventNamePlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeEvenement">{t('events.form.eventType')} *</Label>
                  <Select value={formData.typeEvenement} onValueChange={(value) => handleInputChange('typeEvenement', value)} required>
                    <SelectTrigger><SelectValue placeholder={t('events.form.selectType')} /></SelectTrigger>
                    <SelectContent>{typesEvenements.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('events.form.eventDate')} *</Label>
                  <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal",!dateEvenement && "text-muted-foreground")}><CalendarIconLucide className="mr-2 h-4 w-4" />{dateEvenement ? format(dateEvenement, "PPP", { locale: getDateLocale() }) : <span>{t('events.form.selectDate')}</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateEvenement} onSelect={setDateEvenement} disabled={(date) => { const fourteenDaysFromNow = new Date(); fourteenDaysFromNow.setDate(startOfDay(new Date()).getDate() + 13); /* +13 pour permettre J+14 inclus */ return date < startOfDay(fourteenDaysFromNow); }} initialFocus locale={getDateLocale()}/></PopoverContent></Popover>
                  <p className="text-xs text-gray-500">{t('events.form.noticePeriod')}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t('events.form.eventTime')}</Label>
                  <Select value={heureEvenement} onValueChange={setHeureEvenement}>
                    <SelectTrigger><SelectValue placeholder={t('events.form.selectTime')} /></SelectTrigger>
                    <SelectContent>{heuresDisponibles.map(heure => (<SelectItem key={heure} value={heure}>{heure}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombrePersonnes">{t('events.form.guestCount')} *</Label>
                  <Input id="nombrePersonnes" type="number" min="1" value={formData.nombrePersonnes} onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)} required placeholder="Ex: 15"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetClient">{t('events.form.budget')}</Label>
                  <Input id="budgetClient" type="number" step="0.01" value={formData.budgetClient} onChange={(e) => handleInputChange('budgetClient', e.target.value)} placeholder={t('events.form.budgetPlaceholder')} />
                </div>
              </div>
              {plats && plats.length > 0 && !platsLoading && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">{t('events.form.preSelectedDishesOptional')}</Label>
                  <div className="grid md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-md">
                    {plats.map(plat => (<div key={plat.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-stone-100"><Checkbox id={`plat-${plat.id}`} checked={platsPreSelectionnes.includes(plat.id)} onCheckedChange={(checked) => handlePlatSelectionChange(plat.id, !!checked)} /><div className="flex-1"><Label htmlFor={`plat-${plat.id}`} className="font-medium cursor-pointer">{plat.plat}</Label>{plat.description && (<p className="text-sm text-muted-foreground mt-1">{plat.description}</p>)}</div></div>))}
                  </div>
                  {platsPreSelectionnes.length > 0 && (<p className="text-sm text-muted-foreground">{t('events.form.dishesSelected', { count: platsPreSelectionnes.length })}</p>)}
                </div>
              )}
              {platsLoading && <div className="flex items-center justify-center"><div className="w-6 h-6 border-2 border-thai-orange border-t-transparent rounded-full animate-spin mr-2"></div>{t('common.loading')}</div>}
              <div className="space-y-2">
                <Label htmlFor="demandesSpeciales">{t('events.form.specialRequests')}</Label>
                <Textarea id="demandesSpeciales" value={formData.demandesSpeciales} onChange={(e) => handleInputChange('demandesSpeciales', e.target.value)} rows={4} placeholder={t('events.form.specialRequestsPlaceholderEvent')} />
              </div>
              <div className="bg-thai-cream/50 border border-thai-gold/30 rounded-lg p-4">
                <h4 className="font-semibold text-thai-green mb-2">{t('events.confirmationProcess.title')}</h4>
                <p className="text-sm text-thai-green/80">{t('events.confirmationProcess.description')}</p>
                <ul className="text-sm text-thai-green/80 mt-2 ml-4 list-disc space-y-1">
                  <li>{t('events.confirmationProcess.step1')}</li><li>{t('events.confirmationProcess.step2')}</li><li>{t('events.confirmationProcess.step3')}</li><li>{t('events.confirmationProcess.step4')}</li><li>{t('events.confirmationProcess.step5')}</li>
                </ul>
              </div>
              <Button type="submit" disabled={createEvenement.isPending || !formData.nomEvenement || !formData.typeEvenement || !dateEvenement || !formData.nombrePersonnes || !formData.contactEmail} className="w-full bg-thai-orange">{createEvenement.isPending ? t('events.form.sending') : t('events.form.submit')}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
Evenements.displayName = 'Evenements';
export default Evenements;