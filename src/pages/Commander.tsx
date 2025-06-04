// src/pages/Commander.tsx
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, Database, AlertCircle, Utensils, CreditCard } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  format, addDays, nextDay, isSameDay, isFuture, getDay, startOfDay,
  startOfMonth, endOfMonth, addMonths, type Day
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { usePlats, useAirtableConfig, useCreateCommande, useClientByFirebaseUID } from '@/hooks/useAirtable';
import { useAuth } from '@/contexts/AuthContext';

interface PlatPanier {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
}

const dayNameToNumber: { [key: string]: Day } = {
  dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6,
};

const Commander = () => {
  const { toast } = useToast();
  const { config } = useAirtableConfig();
  const { plats, getPlatsDisponibles, isLoading: platsLoading, error: platsError } = usePlats();
  const createCommande = useCreateCommande();
  const { currentUser } = useAuth();
  const { airtableRecordId } = useClientByFirebaseUID(currentUser?.uid);

  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [panier, setPanier] = useState<PlatPanier[]>([]);
  const [dateRetrait, setDateRetrait] = useState<Date | undefined>();
  const [heureRetrait, setHeureRetrait] = useState<string>('');
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(startOfDay(new Date()));

  const platsDisponibles = getPlatsDisponibles(jourSelectionne);

  const joursOuverture = [
    { value: 'lundi', label: 'Lundi', champ: 'lundiDispo' },
    { value: 'mercredi', label: 'Mercredi', champ: 'mercrediDispo' },
    { value: 'vendredi', label: 'Vendredi', champ: 'vendrediDispo' },
    { value: 'samedi', label: 'Samedi', champ: 'samediDispo' }
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
  

  const ajouterAuPanier = (plat: typeof plats[0]) => {
    if (!plat || !plat.id || typeof plat.plat === 'undefined' || typeof plat.prix === 'undefined') {
      console.error("Tentative d'ajout d'un plat avec des données invalides:", plat);
      toast({ title: "Erreur", description: "Impossible d'ajouter ce plat (données manquantes).", variant: "destructive" });
      return;
    }
    setPanier(prev => {
      const platExistant = prev.find(p => p.id === plat.id);
      if (platExistant) {
        return prev.map(p => p.id === plat.id ? { ...p, quantite: p.quantite + 1 } : p);
      } else {
        return [...prev, { id: plat.id, nom: plat.plat, prix: plat.prix, quantite: 1 }];
      }
    });
    toast({ title: "Plat ajouté !", description: `${plat.plat} a été ajouté à votre panier.` });
  };

  const modifierQuantite = (id: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite < 0) return;
    if (nouvelleQuantite === 0) {
      setPanier(prev => prev.filter(p => p.id !== id));
    } else {
      setPanier(prev => prev.map(p => p.id === id ? { ...p, quantite: nouvelleQuantite } : p));
    }
  };

  const calculerTotal = () => panier.reduce((total, plat) => total + (plat.prix * plat.quantite), 0).toFixed(2);

  const validerCommande = async () => {
    if (!currentUser) { toast({ title: "Connexion requise", variant: "destructive" }); return; }
    if (!airtableRecordId) { toast({ title: "Profil incomplet", variant: "destructive" }); return; }
    if (panier.length === 0) { toast({ title: "Panier vide", variant: "destructive" }); return; }
    if (!dateRetrait || !heureRetrait) { toast({ title: "Infos manquantes", description:"Date et heure de retrait requises.", variant: "destructive" }); return; }

    const tempDateRetrait = new Date(dateRetrait);
    const [heures, minutes] = heureRetrait.split(':');
    tempDateRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0);
    const dateHeureRetraitISO = tempDateRetrait.toISOString();
    
    // console.log("--- Données envoyées à createCommande.mutateAsync ---");
    // console.log("Client Airtable ID (airtableRecordId):", airtableRecordId);
    // console.log("Panier (pour Plat R):", JSON.stringify(panier.map(p => ({ id: p.id, nom: p.nom, quantite: p.quantite })), null, 2));
    // console.log("Date et Heure de Retrait (ISO):", dateHeureRetraitISO);
    // console.log("Demandes Spéciales:", demandesSpeciales);

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
      console.error("Erreur validation commande:", error);
      toast({ title: "Erreur commande", description: error.message || "Erreur inconnue.", variant: "destructive" });
    }
  }; // Point-virgule à la fin de la déclaration de fonction

  if (!config) {
    return ( // Premier bloc return
      <div className="min-h-screen bg-gradient-thai py-8 px-4 flex justify-center items-center">
        <Card className="max-w-md w-full"><CardHeader><CardTitle>Configuration Requise</CardTitle></CardHeader>
          <CardContent>
            <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>Veuillez configurer Airtable.</AlertDescription></Alert>
            <Button asChild className="mt-4 w-full"><Link to="/airtable-config">Configurer</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  } // Accolade fermante pour le if (!config)

  // Ligne 152 de l'erreur dans votre log (approximativement)
  return ( // Second bloc return (principal)
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {!currentUser || !airtableRecordId ? (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Profil requis :</strong> Pour commander, vous devez être connecté et avoir complété votre profil.
              {!currentUser && <Link to="/profil" className="ml-1 underline font-medium">Se connecter/Créer un profil</Link>}
              {currentUser && !airtableRecordId && <Link to="/profil" className="ml-1 underline font-medium">Compléter mon profil</Link>}
            </AlertDescription>
          </Alert>
        ) : null}

        <Card className="shadow-xl border-thai-orange/20 mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg py-4">
            <div className="flex items-center justify-center mb-1"><Utensils className="h-7 w-7 mr-2" /><CardTitle className="text-2xl font-bold">Pour Commander</CardTitle></div>
            <div className="flex items-center justify-center text-white/90 text-xs"><AlertCircle className="h-3 w-3 mr-1.5 flex-shrink-0" /><span>Horaires : Lun, Mer, Ven, Sam de 18h00 à 20h30</span></div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {platsError && (<Alert className="mb-4" variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{platsError.message || "Erreur chargement des plats."}</AlertDescription></Alert>)}
            <div className="mb-6">
              <Label className="text-md font-semibold text-thai-green mb-3 block">Choisissez un jour pour voir le menu :</Label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {joursOuverture.map(jour => (
                  <Button key={jour.value} variant={jourSelectionne === jour.value ? "default" : "outline"} onClick={() => setJourSelectionne(jour.value)}
                    className={cn("px-4 py-2 text-sm sm:px-5 sm:py-2.5 rounded-md transition-all duration-200 flex-grow sm:flex-grow-0", jourSelectionne === jour.value ? "bg-thai-orange text-white shadow-md hover:bg-thai-orange/90" : "border-thai-orange text-thai-orange bg-white hover:bg-thai-orange/10 hover:text-thai-orange")}>
                    {jour.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {jourSelectionne && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-thai-green mb-3">
                  Plats disponibles le {joursOuverture.find(j => j.value === jourSelectionne)?.label.toLowerCase()} :
                </h3>
                {platsLoading ? (<div className="text-center py-6"><p className="text-thai-green/70">Chargement des plats...</p></div>
                ) : platsDisponibles.length === 0 ? (<div className="text-center py-6 bg-thai-cream/30 rounded-lg"><p className="text-thai-green/70">Aucun plat disponible ce jour-là. Essayez un autre jour !</p></div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {platsDisponibles.map(plat => (
                      <Card key={plat.id} className="border-thai-orange/20 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        {plat.photoDuPlat && (<div className="aspect-video overflow-hidden rounded-t-lg"><img src={plat.photoDuPlat} alt={plat.plat} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop"; }}/></div>)}
                        <CardContent className="p-3 flex flex-col flex-grow">
                          <h4 className="font-semibold text-thai-green mb-1 text-base">{plat.plat}</h4>
                          {plat.description && (<p className="text-xs text-thai-green/70 mb-2 flex-grow">{plat.description}</p>)}
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <Badge variant="secondary" className="bg-thai-gold/20 text-thai-green text-xs px-2 py-0.5">{plat.prixVu || `${(plat.prix || 0).toFixed(2)}€`}</Badge>
                            <Button onClick={() => ajouterAuPanier(plat)} size="sm" className="bg-thai-orange hover:bg-thai-orange-dark text-xs px-3 py-1 h-auto">Ajouter</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {panier.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-thai-green mb-3">Mon Panier :</h3>
                <div className="space-y-2 mb-3">
                  {panier.map(plat => (
                    <div key={plat.id} className="flex items-center justify-between bg-thai-cream/50 p-2.5 rounded-lg text-sm">
                      <div><span className="font-medium text-thai-green">{plat.nom}</span><span className="text-thai-green/70 ml-2 text-xs">({plat.prix.toFixed(2)}€)</span></div>
                      <div className="flex items-center space-x-1.5">
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => modifierQuantite(plat.id, plat.quantite - 1)}>-</Button>
                        <span className="w-6 text-center text-sm">{plat.quantite}</span>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => modifierQuantite(plat.id, plat.quantite + 1)}>+</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right mb-3"><span className="text-lg font-bold text-thai-green">Total: {calculerTotal()}€</span></div>
                <Alert className="border-green-200 bg-green-50 text-sm"><CreditCard className="h-4 w-4 text-green-600" /><AlertDescription className="text-green-800"><strong>Paiement sur place :</strong> Nous acceptons la carte bleue</AlertDescription></Alert>
              </div>
            )}

            {panier.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-thai-green">Informations de retrait :</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="dateRetraitButton" className="text-thai-green font-medium text-sm">Date de retrait *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button id="dateRetraitButton" variant="outline" disabled={!jourSelectionne || allowedDates.length === 0} className={cn("w-full justify-start text-left font-normal border-thai-orange/30 h-9 px-3 py-2 text-sm", !dateRetrait && "text-muted-foreground")}>
                          <CalendarIconLucide className="mr-2 h-4 w-4" />{dateRetrait ? format(dateRetrait, "PPP", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                        <Calendar mode="single" selected={dateRetrait} onSelect={setDateRetrait}
                          disabled={(date) => {
                            const todayForCalendar = startOfDay(new Date());
                            if (allowedDates.length > 0) { return !allowedDates.some(allowedDate => isSameDay(date, allowedDate)) || date < todayForCalendar; }
                            return date < todayForCalendar;
                          }}
                          month={currentCalendarMonth} 
                          onMonthChange={setCurrentCalendarMonth} 
                          initialFocus 
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    {!jourSelectionne && <p className="text-xs text-gray-500 mt-1">Veuillez choisir un jour de menu.</p>}
                    {jourSelectionne && allowedDates.length === 0 && <p className="text-xs text-red-500 mt-1">Aucune date disponible pour ce jour.</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="heureRetrait" className="text-thai-green font-medium text-sm">Heure de retrait *</Label>
                    <select id="heureRetrait" value={heureRetrait} onChange={(e) => setHeureRetrait(e.target.value)} className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-thai-orange/30 focus:border-thai-orange" required>
                      <option value="" disabled>Sélectionnez</option>
                      {heuresDisponibles.map(heure => (<option key={heure} value={heure}>{heure}</option>))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Entre 18h00 et 20h30</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="demandesSpeciales" className="text-thai-green font-medium text-sm">Demandes spéciales</Label>
                  <Textarea id="demandesSpeciales" value={demandesSpeciales} onChange={(e) => setDemandesSpeciales(e.target.value)} rows={3} className="border-thai-orange/30 focus:border-thai-orange text-sm" placeholder="Allergies, préférences..."/>
                </div>
                <div className="bg-thai-cream/30 p-3 rounded-lg text-sm">
                  <p className="text-thai-green/80"><strong>📍 Adresse de retrait :</strong> 2 impasse de la poste, 37120 Marigny-Marmande</p>
                  <p className="text-thai-green/80"><strong>📞 Contact :</strong> 07 49 28 37 07</p>
                </div>
                <Button onClick={validerCommande} disabled={createCommande.isPending || !dateRetrait || !heureRetrait || panier.length === 0 || !currentUser || !airtableRecordId} className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-3 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  {createCommande.isPending ? 'Envoi...' : `Valider ma commande (${calculerTotal()}€)`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Commander;