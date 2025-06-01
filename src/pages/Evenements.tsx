
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Users, Database, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { usePlats, useAirtableConfig, useCreateEvenement } from '@/hooks/useAirtable';

const Evenements = () => {
  const { toast } = useToast();
  const { config } = useAirtableConfig();
  const { plats } = usePlats();
  const createEvenement = useCreateEvenement();
  
  const [dateEvenement, setDateEvenement] = useState<Date>();
  const [heureEvenement, setHeureEvenement] = useState<string>('');
  const [platsPreSelectionnes, setPlatsPreSelectionnes] = useState<string[]>([]);
  
  // Formulaire basé sur la structure exacte de Événements DB
  const [formData, setFormData] = useState({
    nomEvenement: '',
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpecialesEvenement: '',
    contactEmail: ''
  });

  // Types d'événements selon la structure exacte
  const typesEvenements = [
    'Anniversaire',
    'Repas d\'entreprise', 
    'Fête de famille',
    'Cocktail dînatoire',
    'Buffet traiteur',
    'Autre'
  ];

  const heuresDisponibles = [
    '12:00', '12:30', '13:00', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePlatSelection = (platId: string) => {
    setPlatsPreSelectionnes(prev => 
      prev.includes(platId)
        ? prev.filter(id => id !== platId)
        : [...prev, platId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateEvenement || !formData.contactEmail || !formData.nomEvenement || !formData.typeEvenement || !formData.nombrePersonnes) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Formatage de la date avec heure si spécifiée
      const dateEvenementComplete = new Date(dateEvenement);
      if (heureEvenement) {
        const [heures, minutes] = heureEvenement.split(':');
        dateEvenementComplete.setHours(parseInt(heures), parseInt(minutes));
      }

      await createEvenement.mutateAsync({
        nomEvenement: formData.nomEvenement,
        contactEmail: formData.contactEmail,
        dateEvenement: dateEvenementComplete.toISOString(),
        typeEvenement: formData.typeEvenement,
        nombrePersonnes: parseInt(formData.nombrePersonnes),
        budgetClient: formData.budgetClient ? parseFloat(formData.budgetClient) : undefined,
        demandesSpeciales: formData.demandesSpecialesEvenement,
        platsPreSelectionnes: platsPreSelectionnes.length > 0 ? platsPreSelectionnes : undefined
      });
      
      toast({
        title: "Demande envoyée avec succès !",
        description: "Nous vous contacterons sous 24h pour discuter de votre événement.",
      });
      
      // Réinitialiser le formulaire
      setFormData({
        nomEvenement: '',
        typeEvenement: '',
        nombrePersonnes: '',
        budgetClient: '',
        demandesSpecialesEvenement: '',
        contactEmail: ''
      });
      setDateEvenement(undefined);
      setHeureEvenement('');
      setPlatsPreSelectionnes([]);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    }
  };

  // Configuration Airtable manquante
  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert className="border-amber-200 bg-amber-50">
            <Database className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Configuration requise :</strong> Veuillez d'abord configurer votre connexion Airtable pour traiter les demandes d'événements.
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
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">Demande pour Groupe ou Événement</CardTitle>
            </div>
            <CardDescription className="text-white/90">
              Organisez votre événement avec nos menus personnalisés
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Service traiteur :</strong> Nous vous contacterons pour établir un menu personnalisé et un devis détaillé selon vos besoins.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de contact */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-thai-green font-medium">Email de contact *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  required
                  className="border-thai-orange/30 focus:border-thai-orange"
                  placeholder="votre.email@example.com"
                />
                <p className="text-xs text-thai-green/60">
                  Utilisez l'email de votre profil client
                </p>
              </div>

              {/* Informations de base selon structure Événements DB */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomEvenement" className="text-thai-green font-medium">Nom de l'événement *</Label>
                  <Input
                    id="nomEvenement"
                    value={formData.nomEvenement}
                    onChange={(e) => handleInputChange('nomEvenement', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Ex: Anniversaire de Marie"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="typeEvenement" className="text-thai-green font-medium">Type d'événement *</Label>
                  <Select value={formData.typeEvenement} onValueChange={(value) => handleInputChange('typeEvenement', value)}>
                    <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {typesEvenements.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date et heure de l'événement */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-thai-green font-medium">Date de l'événement *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-thai-orange/30",
                          !dateEvenement && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateEvenement ? format(dateEvenement, "PPP", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={dateEvenement}
                        onSelect={setDateEvenement}
                        disabled={(date) => {
                          const twoWeeksFromNow = new Date();
                          twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
                          return date < twoWeeksFromNow;
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-thai-green/60">
                    Minimum 2 semaines de préavis requis
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-thai-green font-medium">Heure souhaitée</Label>
                  <Select value={heureEvenement} onValueChange={setHeureEvenement}>
                    <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                      <SelectValue placeholder="Sélectionnez une heure" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {heuresDisponibles.map(heure => (
                        <SelectItem key={heure} value={heure}>{heure}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nombre de personnes et budget */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombrePersonnes" className="text-thai-green font-medium">Nombre de personnes *</Label>
                  <Input
                    id="nombrePersonnes"
                    type="number"
                    min="1"
                    value={formData.nombrePersonnes}
                    onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Ex: 15"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budgetClient" className="text-thai-green font-medium">Budget approximatif (€)</Label>
                  <Input
                    id="budgetClient"
                    type="number"
                    step="0.01"
                    value={formData.budgetClient}
                    onChange={(e) => handleInputChange('budgetClient', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Ex: 500"
                  />
                </div>
              </div>

              {/* Pré-sélection des plats */}
              {plats.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-thai-green">
                    Plats pré-sélectionnés (optionnel) :
                  </Label>
                  <div className="grid md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {plats.map(plat => (
                      <div key={plat.id} className="flex items-start space-x-3 p-3 border border-thai-orange/20 rounded-lg hover:bg-thai-cream/30 transition-colors">
                        <Checkbox
                          id={`plat-${plat.id}`}
                          checked={platsPreSelectionnes.includes(plat.id)}
                          onCheckedChange={() => togglePlatSelection(plat.id)}
                          className="border-thai-orange data-[state=checked]:bg-thai-orange mt-1"
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={`plat-${plat.id}`} 
                            className="font-medium text-thai-green cursor-pointer"
                          >
                            {plat.plat}
                          </Label>
                          {plat.description && (
                            <p className="text-sm text-thai-green/70 mt-1">{plat.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {platsPreSelectionnes.length > 0 && (
                    <p className="text-sm text-thai-green/70">
                      {platsPreSelectionnes.length} plat(s) pré-sélectionné(s)
                    </p>
                  )}
                </div>
              )}

              {/* Demandes spéciales */}
              <div className="space-y-2">
                <Label htmlFor="demandesSpecialesEvenement" className="text-thai-green font-medium">Demandes spéciales événement</Label>
                <Textarea
                  id="demandesSpecialesEvenement"
                  value={formData.demandesSpecialesEvenement}
                  onChange={(e) => handleInputChange('demandesSpecialesEvenement', e.target.value)}
                  rows={4}
                  className="border-thai-orange/30 focus:border-thai-orange"
                  placeholder="Allergies du groupe, préférences particulières, équipements nécessaires, lieu de livraison, etc."
                />
              </div>

              {/* Note d'information */}
              <div className="bg-thai-cream/50 border border-thai-gold/30 rounded-lg p-4">
                <h4 className="font-semibold text-thai-green mb-2">📞 Processus de confirmation</h4>
                <p className="text-sm text-thai-green/80">
                  Après réception de votre demande, nous vous contacterons sous 24h pour :
                </p>
                <ul className="text-sm text-thai-green/80 mt-2 ml-4 list-disc space-y-1">
                  <li>Affiner le menu selon vos préférences</li>
                  <li>Établir un devis personnalisé</li>
                  <li>Confirmer les détails logistiques</li>
                  <li>Planifier la livraison ou le service</li>
                  <li>Définir les modalités d'acompte si nécessaire</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                disabled={createEvenement.isPending || !formData.nomEvenement || !formData.typeEvenement || !dateEvenement || !formData.nombrePersonnes || !formData.contactEmail}
                className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createEvenement.isPending ? 'Envoi en cours...' : 'Envoyer ma demande d\'événement'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Evenements;
