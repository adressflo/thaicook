import { useState, useMemo, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, AlertCircle, Utensils, CreditCard, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isSameDay, isFuture, getDay, startOfDay, addDays, startOfMonth, endOfMonth, addMonths, type Day } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/contexts/DataContext';
import { useCreateCommande, useAirtableConfig } from '@/hooks/useAirtable';
import type { Plat, PlatPanier } from '@/types/airtable';


const dayNameToNumber: { [key: string]: Day } = {
  dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6,
};

const Commander = memo(() => {
  const { toast } = useToast();
  const { config } = useAirtableConfig();
  const { plats, isLoading: dataIsLoading, error: dataError } = useData();
  const createCommande = useCreateCommande();
  const { currentUser, currentUserAirtableData } = useAuth();
  const airtableRecordId = currentUserAirtableData?.id;

  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [panier, setPanier] = useState<PlatPanier[]>([]);
  const [dateRetrait, setDateRetrait] = useState<Date | undefined>();
  const [heureRetrait, setHeureRetrait] = useState<string>('');
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(startOfDay(new Date()));

  const platsDisponibles = useMemo(() => {
    if (!jourSelectionne || !plats) return [];
    const champDispoKey = `${jourSelectionne.toLowerCase()}_dispo` as keyof Plat;
    return plats.filter(plat => plat[champDispoKey] === 'oui');
  }, [jourSelectionne, plats]);

  const joursOuverture = [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' }
  ];

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
  

  const ajouterAuPanier = (plat: Plat) => {
    if (!plat.id || !plat.Plat || plat.Prix === undefined) return;
    setPanier(prev => {
      const platExistant = prev.find(p => p.id === plat.id);
      if (platExistant) {
        return prev.map(p => p.id === plat.id ? { ...p, quantite: p.quantite + 1 } : p);
      }
      return [...prev, { id: plat.id, nom: plat.Plat, prix: plat.Prix, quantite: 1 }];
    });
    toast({ title: "Plat ajouté !", description: `${plat.Plat} a été ajouté à votre panier.` });
  };

  const modifierQuantite = (id: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite < 0) return;
    setPanier(prev => {
        if (nouvelleQuantite === 0) return prev.filter(p => p.id !== id);
        return prev.map(p => p.id === id ? { ...p, quantite: nouvelleQuantite } : p);
    });
  };

  const calculerTotal = () => panier.reduce((total, plat) => total + (plat.prix * plat.quantite), 0).toFixed(2);

  const validerCommande = async () => {
    if (!currentUser || !airtableRecordId) {
      toast({ title: "Profil incomplet", description: "Veuillez vous connecter et compléter votre profil.", variant: "destructive" });
      return;
    }
    if (panier.length === 0) { toast({ title: "Panier vide", variant: "destructive" }); return; }
    if (!dateRetrait || !heureRetrait) { toast({ title: "Infos manquantes", description:"Date et heure de retrait requises.", variant: "destructive" }); return; }

    const tempDateRetrait = new Date(dateRetrait);
    const [heures, minutes] = heureRetrait.split(':');
    tempDateRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0);
    const dateHeureRetraitISO = tempDateRetrait.toISOString();

    try {
      await createCommande.mutateAsync({
        clientAirtableId: airtableRecordId,
        panier,
        dateHeureRetrait: dateHeureRetraitISO,
        demandesSpeciales
      });
      toast({ title: "Commande envoyée !", description: `Votre commande de ${calculerTotal()}€ est enregistrée.` });
      setPanier([]); setDateRetrait(undefined); setHeureRetrait(''); setDemandesSpeciales(''); setJourSelectionne('');
    } catch (error: any) {
      toast({ title: "Erreur commande", description: error.message || "Erreur inconnue.", variant: "destructive" });
    }
  };

  if (!config) {
    return <div className="p-8"><Alert variant="destructive">Configuration Airtable requise.</Alert></div>;
  }
  if (dataError) {
    return <div className="p-8"><Alert variant="destructive">Erreur de chargement: {dataError.message}</Alert></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {!currentUser || !airtableRecordId ? (
          <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Profil requis :</strong> Pour commander, veuillez vous <Link to="/profil" className="underline font-medium">connecter et compléter votre profil</Link>.
            </AlertDescription>
          </Alert>
        ) : null}

        <Card className="shadow-xl border-thai-orange/20 mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg py-4">
            <div className="flex items-center justify-center mb-1"><Utensils className="h-7 w-7 mr-2" /><CardTitle className="text-2xl font-bold">Pour Commander</CardTitle></div>
            <p className="text-white/90 text-xs">Horaire : Lundi, Mercredi, Vendredi, Samedi de 18h00 à 20h30</p>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <div className="mb-6">
              <Label className="text-md font-semibold text-thai-green mb-3 block">Choisissez un jour pour voir le menu :</Label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {joursOuverture.map(jour => (
                  <Button key={jour.value} variant={jourSelectionne === jour.value ? "default" : "outline"} onClick={() => setJourSelectionne(jour.value)}
                    className={cn("px-4 py-2 text-sm sm:px-5 sm:py-2.5 rounded-md transition-all duration-200", jourSelectionne === jour.value ? "bg-thai-orange text-white" : "border-thai-orange text-thai-orange bg-white")}>
                    {jour.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {jourSelectionne && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-thai-green mb-3">Plats disponibles le {jourSelectionne} :</h3>
                {dataIsLoading ? (<div className="text-center py-6"><Loader2 className="h-6 w-6 animate-spin mx-auto text-thai-orange" /></div>
                ) : platsDisponibles.length === 0 ? (<div className="text-center py-6 bg-thai-cream/30 rounded-lg"><p className="text-thai-green/70">Aucun plat disponible ce jour-là.</p></div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {platsDisponibles.map(plat => (
                      <Card key={plat.id} className="border-thai-orange/20 flex flex-col">
                        {plat['Photo du Plat'] && (<div className="aspect-video overflow-hidden rounded-t-lg"><img src={plat['Photo du Plat'][0]?.url} alt={plat.Plat} className="w-full h-full object-cover"/></div>)}
                        <CardContent className="p-3 flex flex-col flex-grow">
                          <h4 className="font-semibold text-thai-green mb-1">{plat.Plat}</h4>
                          <p className="text-xs text-gray-600 mb-2 flex-grow">{plat.Description}</p>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <Badge variant="secondary">{plat['Prix vu']}</Badge>
                            <Button onClick={() => ajouterAuPanier(plat)} size="sm" className="bg-thai-orange">Ajouter</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {panier.length > 0 && (
              <div className="space-y-6 border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-thai-green">Mon Panier</h3>
                <div className="space-y-2">
                  {panier.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="text-thai-green font-medium">{item.nom}</p>
                        <p className="text-gray-500 text-xs">{(item.prix).toFixed(2)}€ / unité</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => modifierQuantite(item.id, item.quantite - 1)}>-</Button>
                        <span className="w-6 text-center text-sm">{item.quantite}</span>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => modifierQuantite(item.id, item.quantite + 1)}>+</Button>
                      </div>
                      <p className="font-medium w-20 text-right">{(item.prix * item.quantite).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>
                <div className="text-right font-bold text-lg text-thai-green border-t pt-2">Total: {calculerTotal()}€</div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-thai-green">Informations de retrait :</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="dateRetrait">Date de retrait *</Label>
                            <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start font-normal"><CalendarIconLucide className="mr-2 h-4 w-4"/>{dateRetrait ? format(dateRetrait, 'PPP', {locale: fr}) : "Sélectionner"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateRetrait} onSelect={setDateRetrait} disabled={(date) => !allowedDates.some(d => isSameDay(d, date))}/></PopoverContent></Popover>
                        </div>
                        <div>
                            <Label htmlFor="heureRetrait">Heure de retrait *</Label>
                            <Select onValueChange={setHeureRetrait} value={heureRetrait}><SelectTrigger><SelectValue placeholder="Sélectionner"/></SelectTrigger><SelectContent>{heuresDisponibles.map(h=><SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="demandesSpeciales">Demandes spéciales</Label>
                        <Textarea id="demandesSpeciales" placeholder="Allergies, etc." value={demandesSpeciales} onChange={e => setDemandesSpeciales(e.target.value)} />
                    </div>
                </div>
                
                <Button onClick={validerCommande} disabled={createCommande.isPending} className="w-full bg-thai-orange text-lg py-6">
                  {createCommande.isPending ? <Loader2 className="animate-spin mr-2"/> : <CreditCard className="mr-2"/>}
                  Valider ma commande
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default Commander;
