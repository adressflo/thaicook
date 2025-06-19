import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, Users, Database, AlertCircle as AlertCircleIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, startOfDay, addDays, type Locale } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from "@/components/ui/alert";

// CORRECTION : Imports mis à jour pour la nouvelle architecture
import { useData } from '@/contexts/DataContext';
// Utilisation des hooks Supabase
import { useCreateEvenement } from '@/hooks/useSupabaseData';
import type { PlatUI as Plat, CreateEvenementData } from '@/types/app'
import { useAuth } from '@/contexts/AuthContext'; // Ajout de l'import pour useAuth

const Evenements = memo(() => {
  const { toast } = useToast();
  const createEvenement = useCreateEvenement();

  const { plats, isLoading: dataIsLoading, error: dataError } = useData();
  const { currentUser, currentUserProfile } = useAuth();
  const clientFirebaseUID = currentUser?.uid;

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

  const typesEvenements = useMemo(() => [
    'Anniversaire',
    'Repas d\'entreprise',
    'Fête de famille',
    'Cocktail dînatoire',
    'Buffet traiteur',
    'Autre'
  ], []);

  const heuresDisponibles = useMemo(() => {
    const heures: string[] = [];
    for (let h = 11; h <= 22; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 22 && m > 0) break;
        heures.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return heures;
  }, []);

  const handleInputChange = (field: keyof typeof initialFormData, value: string) => {
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
    if (!currentUser?.uid) {
      toast({ title: "Profil requis", description: "Veuillez vous connecter et compléter votre profil pour faire une demande.", variant: "destructive" }); return;
    }
    if (!dateEvenement || !formData.typeEvenement || !formData.nombrePersonnes) {
      toast({ title: "Champs manquants", description: "Veuillez remplir tous les champs obligatoires (*).", variant: "destructive" }); return;
    }
    if (formData.typeEvenement === 'Autre' && !autreTypeEvenementPrecision.trim()) {
      toast({ title: "Précision requise", description: "Veuillez préciser le type d'événement.", variant: "destructive" }); return;
    }
    if (parseInt(formData.nombrePersonnes) < 10) {
      toast({ title: "Nombre de personnes", description: "Le nombre de personnes doit être d'au moins 10.", variant: "destructive"}); return;
    }

    let dateEvenementISO = dateEvenement.toISOString();
    if (heureEvenement) {
        const [heures, minutes] = heureEvenement.split(':');
        dateEvenement.setHours(parseInt(heures), parseInt(minutes), 0, 0);
        dateEvenementISO = dateEvenement.toISOString();
    }
    
    // Adaptation pour Supabase
    const evenementData: CreateEvenementData = {
        nom_evenement: formData.typeEvenement === 'Autre' ? autreTypeEvenementPrecision.trim() : formData.typeEvenement,
        contact_client_r: currentUser.uid,
        date_evenement: dateEvenementISO,
        type_d_evenement: formData.typeEvenement,
        nombre_de_personnes: parseInt(formData.nombrePersonnes),
        budget_client: formData.budgetClient ? parseFloat(formData.budgetClient) : undefined,
        demandes_speciales_evenement: formData.demandesSpeciales,
        plats_pre_selectionnes: platsPreSelectionnes.map(id => parseInt(id))
    };

    try {
      await createEvenement.mutateAsync(evenementData);
      toast({ title: "Demande envoyée !", description: "Nous vous recontacterons bientôt." });
      setFormData(initialFormData);
      setDateEvenement(undefined); setHeureEvenement(''); setPlatsPreSelectionnes([]); setAutreTypeEvenementPrecision('');
    } catch (error) {
      toast({ title: "Erreur", description: error instanceof Error ? error.message : "Une erreur est survenue.", variant: "destructive"});
    }
  };

  const getDateLocale = (): Locale => fr;
  
  const isLoading = dataIsLoading;
  const showProfileAlert = !currentUser || !currentUserProfile;

  if (isLoading) { return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-16 h-16 animate-spin text-thai-orange"/></div>; }
  if (dataError) { return <div className="p-8"><Alert variant="destructive"><AlertCircleIcon className="h-4 w-4" /><AlertDescription>{dataError.message}</AlertDescription></Alert></div> }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="shadow-xl border-thai-orange/20">
            <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
              <div className="flex items-center justify-center mb-2"><Users className="h-8 w-8 mr-2" /><CardTitle className="text-3xl font-bold">Pour vos Événements</CardTitle></div>
              <CardDescription className="text-white/90 px-4">
                Si vous avez une occasion spéciale à célébrer, organisez votre événement avec nos menus personnalisés.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {showProfileAlert && (
                  <Alert className="mb-6 border-blue-200 bg-blue-50">
                      <AlertCircleIcon className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                          <strong>Profil requis :</strong> Pour faire une demande d'événement, vous devez être connecté et avoir complété votre profil.
                          {!currentUser && <Link to="/profil" className="ml-1 underline font-medium">Se connecter / Créer un profil</Link>}
                          {currentUser && !currentUserProfile && <Link to="/profil" className="ml-1 underline font-medium">Compléter mon profil</Link>}
                      </AlertDescription>
                  </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="typeEvenement">Type d'événement *</Label>
                    <Select value={formData.typeEvenement} onValueChange={(value) => handleInputChange('typeEvenement', value)}>
                      <SelectTrigger id="typeEvenement"><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger>
                      <SelectContent>{typesEvenements.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  {formData.typeEvenement === 'Autre' && (
                    <div className="space-y-2">
                      <Label htmlFor="autreTypeEvenementPrecision">Précisez *</Label>
                      <Input id="autreTypeEvenementPrecision" value={autreTypeEvenementPrecision} onChange={(e) => setAutreTypeEvenementPrecision(e.target.value)} />
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de l'événement *</Label>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal",!dateEvenement && "text-muted-foreground")}><CalendarIconLucide className="mr-2 h-4 w-4" />{dateEvenement ? format(dateEvenement, "PPP", { locale: getDateLocale() }) : <span>Sélectionner une date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateEvenement} onSelect={setDateEvenement} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureEvenement">Heure de l'événement</Label>
                    <Select value={heureEvenement} onValueChange={setHeureEvenement}><SelectTrigger id="heureEvenement"><SelectValue placeholder="Sélectionner" /></SelectTrigger><SelectContent>{heuresDisponibles.map(h => (<SelectItem key={h} value={h}>{h}</SelectItem>))}</SelectContent></Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombrePersonnes">Nombre de personnes *</Label>
                    <Input id="nombrePersonnes" type="number" min="10" value={formData.nombrePersonnes} onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)} />
                    <p className="text-xs text-gray-500">Minimum de 10 personnes.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetClient">Budget indicatif (€)</Label>
                    <Input id="budgetClient" type="number" step="1" min="0" value={formData.budgetClient} onChange={(e) => handleInputChange('budgetClient', e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demandesSpeciales">Demandes spéciales / Thème</Label>
                  <Textarea id="demandesSpeciales" value={formData.demandesSpeciales} onChange={(e) => handleInputChange('demandesSpeciales', e.target.value)} rows={4} placeholder="Allergies, régimes spécifiques..." />
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <Label className="text-lg font-semibold text-thai-green">Les plats désirés</Label>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-2">
                    {plats.map((plat: Plat) => (
                      <div key={plat.id} className="flex items-center space-x-3">
                        <Checkbox id={`plat-event-${plat.id}`} checked={platsPreSelectionnes.includes(plat.id.toString())} onCheckedChange={(checked) => handlePlatSelectionChange(plat.id.toString(), !!checked)} />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor={`plat-event-${plat.id}`} className="font-medium cursor-pointer hover:text-thai-orange">{plat.plat}</Label>
                          </TooltipTrigger>
                          <TooltipContent className="w-64 bg-white border-thai-orange p-2 rounded-md shadow-lg">
                            {plat.photo_du_plat && (<img src={plat.photo_du_plat} alt={plat.plat} className="w-full h-32 object-cover rounded-md mb-2" />)}
                            <p className="text-sm font-semibold">{plat.plat}</p>
                            {plat.description && (<p className="text-xs text-gray-600 mt-1">{plat.description}</p>)}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                  {platsPreSelectionnes.length > 0 && (<p className="text-sm text-muted-foreground">{platsPreSelectionnes.length} plat(s) sélectionné(s)</p>)}
                </div>

                <div className="bg-thai-cream/50 border border-thai-gold/30 rounded-lg p-4">
                  <h4 className="font-semibold text-thai-green mb-2">Processus de Confirmation</h4>
                  <p className="text-sm text-thai-green/80">Une fois votre demande envoyée :</p>
                  <ul className="text-sm text-thai-green/80 mt-2 ml-4 list-disc space-y-1">
                    <li>Nous vous contacterons pour affiner vos besoins.</li>
                    <li>Un devis détaillé vous sera proposé.</li>
                    <li>Après acceptation du devis, un acompte pourra être demandé.</li>
                    <li>Nous préparons votre commande avec soin.</li>
                    <li>Vous profitez de votre événement !</li>
                  </ul>
                </div>

                <Button type="submit" disabled={createEvenement.isPending || showProfileAlert} className="w-full bg-thai-orange">
                  {createEvenement.isPending ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
});

export default Evenements;
