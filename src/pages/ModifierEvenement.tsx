import { useState, useEffect, useMemo, memo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, Users, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parse, type Locale } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useData } from '@/contexts/DataContext';
import { useEvenementById, useUpdateEvenement } from '@/hooks/useSupabaseData';
import type { PlatUI as Plat, EvenementInputData } from '@/types/app';
import { useAuth } from '@/contexts/AuthContext';

const ModifierEvenement = memo(() => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const updateEvenement = useUpdateEvenement();

  const { plats, isLoading: dataIsLoading } = useData();
  const { currentUser } = useAuth();
  const { data: evenement, isLoading: isLoadingEvenement, error } = useEvenementById(id ? Number(id) : undefined);

  const [dateEvenement, setDateEvenement] = useState<Date | undefined>();
  const [heureEvenement, setHeureEvenement] = useState<string>('');
  const [platsPreSelectionnes, setPlatsPreSelectionnes] = useState<string[]>([]);
  const [autreTypeEvenementPrecision, setAutreTypeEvenementPrecision] = useState<string>('');
  const [formData, setFormData] = useState({
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: '',
  });

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
        setPlatsPreSelectionnes(evenement.plats_preselectionnes.map(id => id.toString()));
      }
    }
  }, [evenement]);

  if (isLoadingEvenement || dataIsLoading) {
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
          <AlertDescription>
            Impossible de charger cet événement. Il n'existe peut-être pas ou a été supprimé.
          </AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link to="/historique">Retour à l'historique</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  // Vérifier si l'utilisateur peut modifier cet événement
  if (currentUser?.uid !== evenement.contact_client_r) {
    return <Navigate to="/historique" replace />;
  }

  // Vérifier si l'événement peut être modifié
  const canEdit = evenement.statut_evenement !== 'Réalisé' && evenement.statut_evenement !== 'Payé intégralement';

  if (!canEdit) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-thai p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cet événement ne peut plus être modifié car il est {evenement.statut_evenement?.toLowerCase()}.
          </AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link to="/historique">Retour à l'historique</Link>
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
    
    if (!dateEvenement || !formData.typeEvenement || !formData.nombrePersonnes) {
      toast({ 
        title: "Champs manquants", 
        description: "Veuillez remplir tous les champs obligatoires (*).", 
        variant: "destructive" 
      }); 
      return;
    }

    if (formData.typeEvenement === 'Autre' && !autreTypeEvenementPrecision.trim()) {
      toast({ 
        title: "Précision requise", 
        description: "Veuillez préciser le type d'événement.", 
        variant: "destructive" 
      }); 
      return;
    }

    if (parseInt(formData.nombrePersonnes) < 10) {
      toast({ 
        title: "Nombre de personnes", 
        description: "Le nombre de personnes doit être d'au moins 10.", 
        variant: "destructive"
      }); 
      return;
    }

    let dateEvenementISO = dateEvenement.toISOString();
    if (heureEvenement) {
      const [heures, minutes] = heureEvenement.split(':');
      dateEvenement.setHours(parseInt(heures), parseInt(minutes), 0, 0);
      dateEvenementISO = dateEvenement.toISOString();
    }

    const validEventTypes = ["Anniversaire", "Repas d'entreprise", "Fête de famille", "Cocktail dînatoire", "Buffet traiteur", "Autre"] as const;
    const typeEvenement = validEventTypes.includes(formData.typeEvenement as any) 
      ? (formData.typeEvenement as typeof validEventTypes[number]) 
      : "Autre" as const;

    const updateData: Partial<EvenementInputData> = {
      nom_evenement: formData.typeEvenement === 'Autre' ? autreTypeEvenementPrecision.trim() : formData.typeEvenement,
      date_evenement: dateEvenementISO,
      type_d_evenement: typeEvenement,
      nombre_de_personnes: parseInt(formData.nombrePersonnes),
      budget_client: formData.budgetClient ? parseFloat(formData.budgetClient) : undefined,
      demandes_speciales_evenement: formData.demandesSpeciales,
      plats_preselectionnes: platsPreSelectionnes.map(id => parseInt(id))
    };

    try {
      await updateEvenement.mutateAsync({ 
        id: evenement.idevenements, 
        data: updateData 
      });
      toast({ 
        title: "Événement modifié !", 
        description: "Vos modifications ont été sauvegardées." 
      });
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: error instanceof Error ? error.message : "Une erreur est survenue.", 
        variant: "destructive"
      });
    }
  };

  const getDateLocale = (): Locale => fr;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <Button asChild variant="outline" className="mb-4 group">
            <Link to="/historique">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour à l'historique
            </Link>
          </Button>

          <Card className="shadow-xl border-thai-orange/20">
            <CardHeader className="text-center bg-gradient-to-r from-thai-green to-thai-orange text-white rounded-t-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 mr-2" />
                <CardTitle className="text-3xl font-bold">Modifier l'Événement</CardTitle>
              </div>
              <CardDescription className="text-white/90 px-4">
                Statut: {evenement.statut_evenement}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="typeEvenement">Type d'événement *</Label>
                    <Select value={formData.typeEvenement} onValueChange={(value) => handleInputChange('typeEvenement', value)}>
                      <SelectTrigger id="typeEvenement">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {typesEvenements.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.typeEvenement === 'Autre' && (
                    <div className="space-y-2">
                      <Label htmlFor="autreTypeEvenementPrecision">Précisez *</Label>
                      <Input 
                        id="autreTypeEvenementPrecision" 
                        value={autreTypeEvenementPrecision} 
                        onChange={(e) => setAutreTypeEvenementPrecision(e.target.value)} 
                        placeholder="Ex: Baptême, Crémaillère..."
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de l'événement *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateEvenement && "text-muted-foreground")}>
                          <CalendarIconLucide className="mr-2 h-4 w-4" />
                          {dateEvenement ? format(dateEvenement, "PPP", { locale: getDateLocale() }) : <span>Sélectionner une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar 
                          mode="single" 
                          selected={dateEvenement} 
                          onSelect={setDateEvenement} 
                          disabled={(date) => date < new Date()} 
                          initialFocus 
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureEvenement">Heure de l'événement</Label>
                    <Select value={heureEvenement} onValueChange={setHeureEvenement}>
                      <SelectTrigger id="heureEvenement">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {heuresDisponibles.map(h => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombrePersonnes">Nombre de personnes *</Label>
                    <Input 
                      id="nombrePersonnes" 
                      type="number" 
                      min="10" 
                      value={formData.nombrePersonnes} 
                      onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetClient">Budget indicatif (€)</Label>
                    <Input 
                      id="budgetClient" 
                      type="number" 
                      step="1" 
                      min="0" 
                      value={formData.budgetClient} 
                      onChange={(e) => handleInputChange('budgetClient', e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demandesSpeciales">Demandes spéciales / Thème</Label>
                  <Textarea 
                    id="demandesSpeciales" 
                    value={formData.demandesSpeciales} 
                    onChange={(e) => handleInputChange('demandesSpeciales', e.target.value)} 
                    rows={4} 
                    placeholder="Allergies, régimes spécifiques..." 
                  />
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <Label className="text-lg font-semibold text-thai-green">Les plats désirés</Label>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-2">
                    {plats.map((plat: Plat) => (
                      <div key={plat.id} className="flex items-center space-x-3">
                        <Checkbox 
                          id={`plat-event-${plat.id}`} 
                          checked={platsPreSelectionnes.includes(plat.id.toString())} 
                          onCheckedChange={(checked) => handlePlatSelectionChange(plat.id.toString(), !!checked)} 
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor={`plat-event-${plat.id}`} className="font-medium cursor-pointer hover:text-thai-orange">
                              {plat.plat}
                            </Label>
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
                      </div>
                    ))}
                  </div>
                  {platsPreSelectionnes.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {platsPreSelectionnes.length} plat(s) sélectionné(s)
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={updateEvenement.isPending} 
                  className="w-full bg-thai-green hover:bg-thai-green/80"
                >
                  {updateEvenement.isPending ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
});

ModifierEvenement.displayName = 'ModifierEvenement';
export default ModifierEvenement;