import { useState, useMemo, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, AlertCircle, ShoppingCart, CreditCard, Loader2, Search, Trash2, MapPin, Phone } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, isSameDay, isFuture, getDay, startOfDay, addDays, startOfMonth, endOfMonth, addMonths, type Day } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useAuth } from '@/contexts/AuthContext'; // CORRECTION: Le chemin d'import a été mis à jour
import { useData } from '@/contexts/DataContext';
import { useCreateCommande, useAirtableConfig } from '@/hooks/useAirtable';
import { useCart } from '@/contexts/CartContext';
import type { Plat, PlatPanier } from '@/types/airtable';

const dayNameToNumber: { [key: string]: Day } = {
  dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6,
};

const joursDispoMapping = [
    { key: 'lundi_dispo', value: 'lundi', label: 'Lundi' },
    { key: 'mercredi_dispo', value: 'mercredi', label: 'Mercredi' },
    { key: 'vendredi_dispo', value: 'vendredi', label: 'Vendredi' },
    { key: 'samedi_dispo', value: 'samedi', label: 'Samedi' },
];

const getAvailableDays = (plat: Plat): { value: string; label: string }[] => {
    return joursDispoMapping.filter(jour => plat[jour.key as keyof Plat] === 'oui');
}

const Commander = memo(() => {
  const { toast } = useToast();
  const { config } = useAirtableConfig();
  const { plats, isLoading: dataIsLoading, error: dataError } = useData();
  const createCommande = useCreateCommande();
  const { currentUser, currentUserAirtableData } = useAuth();
  const { panier, ajouterAuPanier, modifierQuantite, viderPanier, totalPrix } = useCart();
  
  const airtableRecordId = currentUserAirtableData?.id;

  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [dateRetrait, setDateRetrait] = useState<Date | undefined>();
  const [heureRetrait, setHeureRetrait] = useState<string>('');
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(startOfDay(new Date()));
  const [recherche, setRecherche] = useState('');

  const platsFiltres = useMemo(() => {
      if (!recherche) return [];
      if (!plats) return [];
      return plats.filter(plat =>
          plat.Plat?.toLowerCase().includes(recherche.toLowerCase())
      );
  }, [recherche, plats]);

  const platsDisponibles = useMemo(() => {
    if (!jourSelectionne || !plats) return [];
    const champDispoKey = `${jourSelectionne.toLowerCase()}_dispo` as keyof Plat;
    return plats.filter(plat => plat[champDispoKey] === 'oui');
  }, [jourSelectionne, plats]);

  const joursOuverture = useMemo(() => [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' }
  ], []);

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

  const handleAjouterAuPanier = (plat: Plat) => {
    if (!plat.id || !plat.Plat || plat.Prix === undefined) return;
    ajouterAuPanier({ id: plat.id, nom: plat.Plat, prix: plat.Prix, quantite: 1 });
    toast({ title: "Plat ajouté !", description: `${plat.Plat} a été ajouté à votre panier.` });
  };

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
      if (!currentUser?.uid) throw new Error("Utilisateur non identifié");
      await createCommande.mutateAsync({
        clientAirtableId: airtableRecordId,
        panier,
        dateHeureRetrait: dateHeureRetraitISO,
        demandesSpeciales,
        firebaseUID: currentUser.uid
      });
      toast({ title: "Commande envoyée !", description: `Votre commande de ${totalPrix.toFixed(2)}€ est enregistrée.` });
      viderPanier();
      setDateRetrait(undefined); setHeureRetrait(''); setDemandesSpeciales(''); setJourSelectionne('');
    } catch (error: any) {
      toast({ title: "Erreur commande", description: error.message || "Erreur inconnue.", variant: "destructive" });
    }
  };

  if (!config) {
    return <div className="p-8"><Alert variant="destructive">Configuration Airtable requise. Veuillez vous rendre sur la page <Link to="/airtable-config" className="underline">Configuration</Link>.</Alert></div>;
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
            <div className="flex items-center justify-center mb-1"><ShoppingCart className="h-7 w-7 mr-2" /><CardTitle className="text-2xl font-bold">Pour Commander</CardTitle></div>
            <p className="text-white/90 text-xs">Horaire : Lundi, Mercredi, Vendredi, Samedi de 18h00 à 20h30</p>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <div className="mb-8 pb-8 border-b border-thai-orange/10">
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

            <div className="mb-8">
              <Label htmlFor="recherche-plat" className="text-md font-semibold text-thai-green mb-3 block">
                Ou rechercher un plat pour voir sa disponibilité
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="recherche-plat" placeholder="Ex: Pad Thaï, Curry, Nems..." value={recherche} onChange={(e) => setRecherche(e.target.value)} className="pl-10" />
              </div>
              {recherche && platsFiltres.length > 0 && (
                <div className="mt-4 space-y-2 rounded-lg bg-thai-cream/30 p-4">
                  {platsFiltres.map(plat => (
                    <div key={plat.id} className="p-2 border-b last:border-b-0 border-thai-orange/20 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <span className="font-medium text-thai-green">{plat.Plat}</span>
                      <div className="flex gap-2 flex-wrap">
                        {getAvailableDays(plat).length > 0 ? (
                          getAvailableDays(plat).map(jour => (
                            <Badge key={jour.value} variant="secondary" className="cursor-pointer hover:bg-thai-orange/20" onClick={() => { setJourSelectionne(jour.value); setRecherche(''); }}>
                              {jour.label}
                            </Badge>
                          ))
                        ) : ( <Badge variant="destructive">Indisponible</Badge> )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
               {recherche && platsFiltres.length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-4">Aucun plat ne correspond à votre recherche.</p>
              )}
            </div>
            
            {jourSelectionne && (
              <div className="mb-6 pt-6 border-t border-thai-orange/10 animate-fade-in">
                <h3 className="text-lg font-semibold text-thai-green mb-3">Plats disponibles le {jourSelectionne} :</h3>
                 {dataIsLoading ? (<div className="text-center py-6"><Loader2 className="h-6 w-6 animate-spin mx-auto text-thai-orange" /></div>)
                 : platsDisponibles.length === 0 ? (<div className="text-center py-6 bg-thai-cream/30 rounded-lg"><p className="text-thai-green/70">Aucun plat disponible ce jour-là.</p></div>) 
                 : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {platsDisponibles.map(plat => (
                      <Card key={plat.id} className="border-thai-orange/20 flex flex-col">
                        {plat['Photo du Plat'] && (<div className="aspect-video overflow-hidden rounded-t-lg"><img src={plat['Photo du Plat'][0]?.url} alt={plat.Plat} className="w-full h-full object-cover"/></div>)}
                        <CardContent className="p-3 flex flex-col flex-grow">
                          <h4 className="font-semibold text-thai-green mb-1">{plat.Plat}</h4>
                          <p className="text-xs text-gray-600 mb-2 flex-grow">{plat.Description}</p>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <Badge variant="secondary">{plat['Prix vu']}</Badge>
                            <Button onClick={() => handleAjouterAuPanier(plat)} size="sm" className="bg-thai-orange">Ajouter</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {panier.length > 0 && (
              <div className="space-y-6 border-t pt-6 mt-6 animate-fade-in">
                <h3 className="text-xl font-semibold text-thai-green">Mon Panier</h3>
                <div className="space-y-2">
                  {panier.map(item => {
                    const platData = plats.find(p => p.id === item.id);
                    const imageUrl = platData?.['Photo du Plat']?.[0]?.url;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-thai-cream/60">
                        <div className="flex-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-thai-green text-base font-bold hover:text-thai-orange cursor-pointer underline decoration-dotted decoration-thai-orange/50">
                                {item.nom}
                              </p>
                            </TooltipTrigger>
                            {platData && (
                              <TooltipContent className="p-0 border-thai-orange bg-white">
                                <Card className="w-64">
                                  {imageUrl && <img src={imageUrl} alt={item.nom} className="w-full h-32 object-cover rounded-t-lg" />}
                                  <CardContent className="p-3">
                                      <p className="font-bold text-md text-thai-green">{platData.Plat}</p>
                                      {platData.Description && <p className="text-xs text-gray-600 mt-1 mb-3">{platData.Description}</p>}
                                      <div className="flex justify-between items-center">
                                          <Badge variant="secondary">{platData['Prix vu']}</Badge>
                                          <Button size="sm" onClick={() => handleAjouterAuPanier(platData)}>Ajouter</Button>
                                      </div>
                                  </CardContent>
                                </Card>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <p className="font-medium w-16 text-right text-base">{(item.prix * item.quantite).toFixed(2)}€</p>
                           <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => modifierQuantite(item.id, item.quantite - 1)}>-</Button>
                            <span className="w-6 text-center text-base font-medium">{item.quantite}</span>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => modifierQuantite(item.id, item.quantite + 1)}>+</Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              modifierQuantite(item.id, 0);
                              toast({
                                title: "Article supprimé",
                                description: `${item.nom} a été retiré de votre panier.`
                              });
                            }}
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            aria-label="Supprimer l'article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="text-right font-bold text-lg text-thai-green border-t pt-2">Total: {totalPrix.toFixed(2)}€</div>
                
                <Alert className="bg-green-50/50 border-green-200 text-green-800">
                  <CreditCard className="h-4 w-4 !text-green-700" />
                  <AlertDescription className="font-medium">
                    Paiement sur place : Nous acceptons la carte bleue.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-thai-green">Informations de retrait :</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="dateRetrait">Date de retrait *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateRetrait && "text-muted-foreground")}>
                                  <CalendarIconLucide className="mr-2 h-4 w-4"/>
                                  {dateRetrait ? format(dateRetrait, 'PPP', {locale: fr}) : <span className="text-green-700">Sélectionner une date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={dateRetrait} onSelect={setDateRetrait} disabled={(date) => !allowedDates.some(d => isSameDay(d, date))}/>
                              </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label htmlFor="heureRetrait">Heure de retrait *</Label>
                            <Select onValueChange={setHeureRetrait} value={heureRetrait}>
                              <SelectTrigger className={cn(!heureRetrait && "text-green-700")}>
                                <SelectValue placeholder="Sélectionner"/>
                              </SelectTrigger>
                              <SelectContent>
                                {heuresDisponibles.map(h=><SelectItem key={h} value={h}>{h}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">Entre 18h00 et 20h30 (par 5 min)</p>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="demandesSpeciales">Demandes spéciales</Label>
                        <Textarea id="demandesSpeciales" placeholder="Allergies, etc." value={demandesSpeciales} onChange={e => setDemandesSpeciales(e.target.value)} />
                    </div>
                </div>
                
                <div className="text-center text-sm text-thai-green/80 p-3 bg-thai-cream/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4 text-thai-orange" />
                    <span>Adresse de retrait : 2 impasse de la poste 37120 Marigny Marmande</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-thai-orange" />
                    <span>Contact : 07 49 28 37 07</span>
                  </div>
                </div>

                <Button onClick={validerCommande} disabled={createCommande.isPending || !currentUser || !airtableRecordId} className="w-full bg-thai-orange text-lg py-6">
                  {createCommande.isPending ? <Loader2 className="animate-spin mr-2"/> : <CreditCard className="mr-2"/>}
                  Valider ma commande ({totalPrix.toFixed(2)}€)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Commander.displayName = 'Commander';

export default Commander;
