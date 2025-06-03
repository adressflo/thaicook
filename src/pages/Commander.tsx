// src/pages/Commander.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIconLucide, Database, AlertCircle, Utensils, CreditCard } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
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

const Commander = () => {
  const { toast } = useToast();
  const { config } = useAirtableConfig();
  const { plats, getPlatsDisponibles, isLoading: platsLoading, error: platsError } = usePlats();
  const createCommande = useCreateCommande();
  const { currentUser } = useAuth();
  const { airtableRecordId } = useClientByFirebaseUID(currentUser?.uid);

  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [panier, setPanier] = useState<PlatPanier[]>([]);
  const [dateRetrait, setDateRetrait] = useState<Date>();
  const [heureRetrait, setHeureRetrait] = useState<string>('');
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');

  const joursOuverture = [
    { value: 'lundi', label: 'Lundi', champ: 'lundiDispo' },
    { value: 'mercredi', label: 'Mercredi', champ: 'mercrediDispo' },
    { value: 'vendredi', label: 'Vendredi', champ: 'vendrediDispo' },
    { value: 'samedi', label: 'Samedi', champ: 'samediDispo' }
  ];

  const heuresDisponibles = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const platsDisponibles = getPlatsDisponibles(jourSelectionne);

  const ajouterAuPanier = (plat: typeof plats[0]) => {
    setPanier(prev => {
      const platExistant = prev.find(p => p.id === plat.id);
      if (platExistant) {
        return prev.map(p =>
          p.id === plat.id
            ? { ...p, quantite: p.quantite + 1 }
            : p
        );
      } else {
        return [...prev, {
          id: plat.id,
          nom: plat.plat,
          prix: plat.prix || 0,
          quantite: 1
        }];
      }
    });
    toast({
      title: "Plat ajouté !",
      description: `${plat.plat} a été ajouté à votre panier.`,
    });
  };

  const modifierQuantite = (id: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite === 0) {
      setPanier(prev => prev.filter(p => p.id !== id));
    } else {
      setPanier(prev => prev.map(p =>
        p.id === id
          ? { ...p, quantite: nouvelleQuantite }
          : p
      ));
    }
  };

  const calculerTotal = () => {
    return panier.reduce((total, plat) => total + (plat.prix * plat.quantite), 0).toFixed(2);
  };

  const validerCommande = async () => {
    if (!currentUser) {
      toast({ title: "Connexion requise", description: "Veuillez vous connecter et compléter votre profil pour commander.", variant: "destructive" });
      return;
    }
    if (!airtableRecordId) {
      toast({ title: "Profil incomplet", description: "Veuillez compléter votre profil client pour pouvoir commander. Rendez-vous sur la page Profil.", variant: "destructive" });
      return;
    }
    if (panier.length === 0) {
      toast({ title: "Panier vide", description: "Veuillez ajouter des plats à votre panier.", variant: "destructive" });
      return;
    }
    if (!dateRetrait || !heureRetrait) {
      toast({ title: "Informations manquantes", description: "Veuillez sélectionner une date et une heure de retrait.", variant: "destructive" });
      return;
    }

    console.log("--- Données envoyées à createCommande.mutateAsync ---");
    console.log("Client Airtable ID (airtableRecordId):", airtableRecordId);
    console.log("Panier (pour Plat R):", JSON.stringify(panier.map(p => ({ id: p.id, nom: p.nom, quantite: p.quantite })), null, 2));
    const dateHeureRetraitISO = dateRetrait ? new Date(dateRetrait.getFullYear(), dateRetrait.getMonth(), dateRetrait.getDate(), parseInt(heureRetrait.split(':')[0]), parseInt(heureRetrait.split(':')[1])).toISOString() : '';
    console.log("Date et Heure de Retrait (ISO):", dateHeureRetraitISO);
    console.log("Demandes Spéciales:", demandesSpeciales);


    try {
      await createCommande.mutateAsync({
        clientAirtableId: airtableRecordId,
        panier,
        dateHeureRetrait: dateHeureRetraitISO,
        demandesSpeciales
      });

      toast({
        title: "Commande envoyée !",
        description: `Votre commande de ${calculerTotal()}€ a été enregistrée. Paiement sur place par carte bleue.`,
      });

      setPanier([]);
      setDateRetrait(undefined);
      setHeureRetrait('');
      setDemandesSpeciales('');
      setJourSelectionne('');

    } catch (error: any) {
      console.error("Erreur validation commande:", error); // Log de l'erreur brute attrapée ici
      let errorMessage = "Une erreur est survenue lors de l'envoi de votre commande.";
      if (error && error.message) { // Si l'erreur a une propriété message (ce qui devrait être le cas pour les erreurs relancées)
        errorMessage = error.message;
      }
      toast({
        title: "Erreur de commande",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert className="border-amber-200 bg-amber-50">
            <Database className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Configuration requise :</strong> Veuillez d'abord configurer votre connexion Airtable pour accéder aux menus.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Link to="/airtable-config">
              <Button className="bg-thai-orange hover:bg-thai-orange-dark">
                Configurer Airtable
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {!currentUser || !airtableRecordId ? (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                <strong>Profil requis :</strong> Pour commander, vous devez être connecté et avoir complété votre profil client.
                {!currentUser && <Link to="/profil" className="ml-2 underline font-medium">Se connecter / Créer un profil</Link>}
                {currentUser && !airtableRecordId && <Link to="/profil" className="ml-2 underline font-medium">Compléter mon profil</Link>}
                </AlertDescription>
            </Alert>
        ) : null}

        <Card className="shadow-xl border-thai-orange/20 mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Utensils className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">Pour Commander</CardTitle>
            </div>
            <div className="flex items-center justify-center text-white/90 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Horaires d'ouverture : Lundi, Mercredi, Vendredi, Samedi de 18h00 à 20h30</span>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {platsError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Erreur lors du chargement des plats. Vérifiez votre configuration Airtable.
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-8">
              <Label className="text-lg font-semibold text-thai-green mb-4 block">
                Choisissez un jour pour voir le menu disponible :
              </Label>
              <div className="flex flex-wrap gap-3">
                {joursOuverture.map(jour => (
                  <Button
                    key={jour.value}
                    variant={jourSelectionne === jour.value ? "default" : "outline"}
                    onClick={() => setJourSelectionne(jour.value)}
                    className={cn(
                      "px-6 py-2 rounded-lg transition-all duration-200",
                      jourSelectionne === jour.value
                        ? "bg-thai-orange text-white shadow-md hover:bg-thai-orange/90"
                        : "border-thai-orange text-thai-orange bg-white hover:bg-thai-orange/10 hover:text-thai-orange"
                    )}
                  >
                    {jour.label}
                  </Button>
                ))}
              </div>
            </div>

            {jourSelectionne && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-thai-green mb-4">
                  Plats disponibles le {joursOuverture.find(j => j.value === jourSelectionne)?.label.toLowerCase()} :
                </h3>
                {platsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-thai-green/70">Chargement des plats...</p>
                  </div>
                ) : platsDisponibles.length === 0 ? (
                  <div className="text-center py-8 bg-thai-cream/30 rounded-lg">
                    <p className="text-thai-green/70">
                      Aucun plat disponible ce jour-là. Essayez un autre jour !
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {platsDisponibles.map(plat => (
                      <Card key={plat.id} className="border-thai-orange/20 hover:shadow-lg transition-shadow duration-300">
                        {plat.photoDuPlat && (
                          <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img
                              src={plat.photoDuPlat}
                              alt={plat.plat}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop";
                              }}
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-thai-green mb-2">{plat.plat}</h4>
                          {plat.description && (
                            <p className="text-sm text-thai-green/70 mb-3">{plat.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-thai-gold/20 text-thai-green">
                              {plat.prixVu || `${(plat.prix || 0).toFixed(2)}€`}
                            </Badge>
                            <Button
                              onClick={() => ajouterAuPanier(plat)}
                              size="sm"
                              className="bg-thai-orange hover:bg-thai-orange-dark"
                            >
                              Ajouter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {panier.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-thai-green mb-4">Mon Panier :</h3>
                <div className="space-y-3 mb-4">
                  {panier.map(plat => (
                    <div key={plat.id} className="flex items-center justify-between bg-thai-cream/50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium text-thai-green">{plat.nom}</span>
                        <span className="text-thai-green/70 ml-2">({plat.prix.toFixed(2)}€)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => modifierQuantite(plat.id, plat.quantite - 1)}>-</Button>
                        <span className="w-8 text-center">{plat.quantite}</span>
                        <Button size="sm" variant="outline" onClick={() => modifierQuantite(plat.id, plat.quantite + 1)}>+</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-thai-green">
                    Total: {calculerTotal()}€
                  </span>
                </div>
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Paiement sur place :</strong> Nous acceptons la carte bleue
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {panier.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-thai-green">Informations de retrait :</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-thai-green font-medium">Date de retrait *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-thai-orange/30",
                            !dateRetrait && "text-muted-foreground"
                          )}
                        >
                          <CalendarIconLucide className="mr-2 h-4 w-4" />
                          {dateRetrait ? format(dateRetrait, "PPP", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRetrait}
                          onSelect={setDateRetrait}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-thai-green font-medium">Heure de retrait *</Label>
                    <select
                      value={heureRetrait}
                      onChange={(e) => setHeureRetrait(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-thai-orange/30 focus:border-thai-orange"
                      required
                    >
                      <option value="" disabled>Sélectionnez une heure</option>
                      {heuresDisponibles.map(heure => (
                        <option key={heure} value={heure}>{heure}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">Entre 18h00 et 20h30</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-thai-green font-medium">Demandes spéciales</Label>
                  <Textarea
                    value={demandesSpeciales}
                    onChange={(e) => setDemandesSpeciales(e.target.value)}
                    rows={3}
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Allergies, préférences de cuisson, etc."
                  />
                </div>
                <div className="bg-thai-cream/30 p-4 rounded-lg">
                  <p className="text-sm text-thai-green/80">
                    <strong>📍 Adresse de retrait :</strong><br />
                    2 impasse de la poste, 37120 Marigny-Marmande, France<br />
                    <strong>📞 Contact :</strong> 07 49 28 37 07
                  </p>
                </div>
                <Button
                  onClick={validerCommande}
                  disabled={createCommande.isPending || !dateRetrait || !heureRetrait || panier.length === 0 || !currentUser || !airtableRecordId}
                  className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
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