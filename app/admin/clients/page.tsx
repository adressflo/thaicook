'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  ShoppingCart,
  Edit,
  Save,
  X,
  Euro,
  ChevronRight,
  MessageCircle,
  Video,
  GamepadIcon,
  ExternalLink,
  User,
  Clock,
  Package,
  RefreshCw,
  BarChart3,
  Headphones,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useClients, useCommandes, useUpdateClient, useEvenementsByClient } from '@/hooks/useSupabaseData';
import { format, parse, isValid as isValidDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ClientUI, CommandeUI, ClientInputData } from '@/types/app';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/historique/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DATE_FORMAT_DB = 'yyyy-MM-dd';

// --- Sous-composant : Fiche Client Détaillée ---
const FicheClient = ({ client, commandes, onBack, router }: { client: ClientUI, commandes: CommandeUI[], onBack: () => void, router: any }) => {
  const [formData, setFormData] = useState({
    nom: client.nom || '',
    prenom: client.prenom || '',
    email: client.email || '',
    numero_de_telephone: client.numero_de_telephone || '',
    adresse_numero_et_rue: client.adresse_numero_et_rue || '',
    code_postal: client.code_postal?.toString() || '',
    ville: client.ville || '',
    preference_client: client.preference_client || ''
  });

  const [birthDate, setBirthDate] = useState<Date | undefined>(() => {
    if (client.date_de_naissance) {
      const parsedDate = parse(client.date_de_naissance, DATE_FORMAT_DB, new Date());
      if (isValidDate(parsedDate)) {
        return parsedDate;
      }
    }
    return undefined;
  });
  
  const updateClientMutation = useUpdateClient();
  const { toast } = useToast();
  
  // Hook pour récupérer les événements du client
  const { data: evenements } = useEvenementsByClient(client.firebase_uid);

  // Fonction pour gérer les changements de date de naissance avec sauvegarde automatique
  const handleBirthDateChange = async (newDate: Date | undefined) => {
    setBirthDate(newDate);
    
    try {
      const dataToUpdate: Partial<ClientInputData> = {
        date_de_naissance: newDate && !isNaN(newDate.getTime()) 
          ? format(newDate, DATE_FORMAT_DB) 
          : null
      };

      await updateClientMutation.mutateAsync({
        firebase_uid: client.firebase_uid,
        data: dataToUpdate,
      });

      toast({ 
        title: 'Sauvegardé', 
        description: 'Date de naissance mise à jour automatiquement.',
        duration: 1500
      });
    } catch (error) {
      toast({ 
        title: 'Erreur', 
        description: 'Impossible de sauvegarder la date de naissance.', 
        variant: 'destructive' 
      });
      console.error('Error updating birth date:', error);
    }
  };

  // Calcul des 5 dernières commandes modifiables et dernier événement
  const commandesRecentes = useMemo(() => {
    return commandes
      .filter(c => c.date_de_prise_de_commande)
      .sort((a, b) => new Date(b.date_de_prise_de_commande!).getTime() - new Date(a.date_de_prise_de_commande!).getTime())
      .slice(0, 5);
  }, [commandes]);

  const dernierEvenement = useMemo(() => {
    return evenements && evenements.length > 0 
      ? evenements.sort((a, b) => new Date(b.date_evenement || 0).getTime() - new Date(a.date_evenement || 0).getTime())[0]
      : null;
  }, [evenements]);

  // Fonction pour sauvegarder automatiquement lors des changements
  const handleFieldChange = async (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    try {
      const dataToUpdate: Partial<ClientInputData> = {
        [field]: field === 'code_postal' 
          ? (value && !isNaN(parseInt(value)) ? parseInt(value) : null)
          : (value || null)
      };

      await updateClientMutation.mutateAsync({
        firebase_uid: client.firebase_uid,
        data: dataToUpdate,
      });

      toast({ 
        title: 'Sauvegardé', 
        description: `${field} mis à jour automatiquement.`,
        duration: 1500
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder automatiquement.',
        variant: 'destructive',
      });
    }
  };

  // Fonctions de navigation vers les pages dédiées
  const navigateToStats = () => {
    router.push(`/admin/clients/${client.firebase_uid}/stats`);
  };

  const navigateToContact = () => {
    router.push(`/admin/clients/${client.firebase_uid}/contact`);
  };

  const navigateToOrders = () => {
    router.push(`/admin/clients/${client.firebase_uid}/orders`);
  };

  const navigateToEvents = () => {
    router.push(`/admin/clients/${client.firebase_uid}/events`);
  };

  return (
    <div className="space-y-6">
      {/* Header avec photo et infos principales - SANS ID */}
      <Card className="shadow-xl border-thai-orange/20 animate-in fade-in-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-thai-cream/30 to-white border-b border-thai-orange/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Photo de profil */}
              <div className="relative">
                {client.photo_client ? (
                  <img 
                    src={client.photo_client} 
                    alt="Photo client" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-thai-orange shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold text-2xl border-4 border-thai-orange shadow-lg">
                    {client.prenom?.charAt(0) || 'C'}{client.nom?.charAt(0) || 'L'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-thai-green rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-thai-green">
                  {client.prenom} {client.nom}
                </h2>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            
            <Button onClick={onBack} variant="outline" className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white">
              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
              Retour à la recherche
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne de gauche - Informations principales */}
        <div className="space-y-6">
          {/* Informations personnelles - ÉDITION DIRECTE */}
          <Card className="border-thai-orange/20 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations personnelles
                <div className="ml-auto text-xs bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full">
                  Sauvegarde auto
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom" className="text-thai-green font-medium">Prénom</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleFieldChange('prenom', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="Prénom du client"
                  />
                </div>
                <div>
                  <Label htmlFor="nom" className="text-thai-green font-medium">Nom</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleFieldChange('nom', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="Nom de famille"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-thai-green font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telephone" className="text-thai-green font-medium">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.numero_de_telephone}
                    onChange={(e) => handleFieldChange('numero_de_telephone', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="adresse" className="text-thai-green font-medium">Adresse</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse_numero_et_rue}
                    onChange={(e) => handleFieldChange('adresse_numero_et_rue', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="123 Rue de la République"
                  />
                </div>
                <div>
                  <Label htmlFor="code_postal" className="text-thai-green font-medium">Code postal</Label>
                  <Input
                    id="code_postal"
                    value={formData.code_postal}
                    onChange={(e) => handleFieldChange('code_postal', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="47200"
                  />
                </div>
                <div>
                  <Label htmlFor="ville" className="text-thai-green font-medium">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleFieldChange('ville', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="Marmande"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 text-thai-green font-medium">
                    <Calendar className="h-4 w-4" />
                    Date de naissance
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={
                        birthDate
                          ? birthDate.getDate().toString().padStart(2, '0')
                          : ''
                      }
                      onValueChange={day => {
                        if (birthDate) {
                          const newDate = new Date(birthDate);
                          newDate.setDate(parseInt(day));
                          // Vérifier si la date est valide après modification
                          if (!isNaN(newDate.getTime())) {
                            handleBirthDateChange(newDate);
                          }
                        } else {
                          handleBirthDateChange(new Date(1990, 0, parseInt(day)));
                        }
                      }}
                    >
                      <SelectTrigger className="w-20 text-center [&>span]:text-center">
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
                        birthDate
                          ? (birthDate.getMonth() + 1)
                              .toString()
                              .padStart(2, '0')
                          : ''
                      }
                      onValueChange={month => {
                        if (birthDate) {
                          const newDate = new Date(birthDate);
                          newDate.setMonth(parseInt(month) - 1);
                          // Vérifier si la date est valide après modification
                          if (!isNaN(newDate.getTime())) {
                            handleBirthDateChange(newDate);
                          }
                        } else {
                          handleBirthDateChange(
                            new Date(1990, parseInt(month) - 1, 1)
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="w-32 text-center [&>span]:text-center [&>span]:w-full [&>span]:block">
                        <SelectValue placeholder="Mois" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01" className="justify-center">
                          Janvier
                        </SelectItem>
                        <SelectItem value="02" className="justify-center">
                          Février
                        </SelectItem>
                        <SelectItem value="03" className="justify-center">
                          Mars
                        </SelectItem>
                        <SelectItem value="04" className="justify-center">
                          Avril
                        </SelectItem>
                        <SelectItem value="05" className="justify-center">
                          Mai
                        </SelectItem>
                        <SelectItem value="06" className="justify-center">
                          Juin
                        </SelectItem>
                        <SelectItem value="07" className="justify-center">
                          Juillet
                        </SelectItem>
                        <SelectItem value="08" className="justify-center">
                          Août
                        </SelectItem>
                        <SelectItem value="09" className="justify-center">
                          Septembre
                        </SelectItem>
                        <SelectItem value="10" className="justify-center">
                          Octobre
                        </SelectItem>
                        <SelectItem value="11" className="justify-center">
                          Novembre
                        </SelectItem>
                        <SelectItem value="12" className="justify-center">
                          Décembre
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={
                        birthDate ? birthDate.getFullYear().toString() : ''
                      }
                      onValueChange={year => {
                        if (birthDate) {
                          const newDate = new Date(birthDate);
                          newDate.setFullYear(parseInt(year));
                          // Vérifier si la date est valide après modification
                          if (!isNaN(newDate.getTime())) {
                            handleBirthDateChange(newDate);
                          }
                        } else {
                          handleBirthDateChange(new Date(parseInt(year), 0, 1));
                        }
                      }}
                    >
                      <SelectTrigger className="w-24 text-center [&>span]:text-center">
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: new Date().getFullYear() - 1900 + 1 },
                          (_, i) => new Date().getFullYear() - i
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
                  <p className="text-sm text-gray-600 mt-2">
                    Sélectionnez le jour, mois et année de naissance dans les menus déroulants ci-dessus.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="preferences" className="text-thai-green font-medium">Préférences & Allergies</Label>
                  <Textarea
                    id="preferences"
                    value={formData.preference_client}
                    onChange={(e) => handleFieldChange('preference_client', e.target.value)}
                    rows={3}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="Allergies, plats préférés, remarques spéciales..."
                  />
                </div>
                
                {/* Boutons Contact et Stats - Déplacés en bas */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex gap-3 p-4 bg-thai-cream/10 rounded-lg border border-thai-orange/20">
                    <Button 
                      onClick={navigateToContact}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Headphones className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-semibold text-sm">Communication</div>
                      </div>
                    </Button>

                    <Button 
                      onClick={navigateToStats}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-semibold text-sm">Statistiques</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 5 Dernières commandes MODIFIABLES */}
          <Card className="border-thai-green/20 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  5 Dernières Commandes
                </div>
                <Button 
                  onClick={navigateToOrders}
                  variant="outline" 
                  size="sm"
                  className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir Toutes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commandesRecentes.length > 0 ? (
                <div className="space-y-3">
                  {commandesRecentes.map((commande) => (
                    <div key={commande.idcommande} className="border border-thai-green/20 rounded-lg p-4 hover:bg-thai-green/5 transition-colors group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-thai-green">#{commande.idcommande}</span>
                            <StatusBadge statut={commande.statut_commande} type="commande" />
                            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-thai-green hover:bg-thai-green/20">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="w-3 h-3" />
                              {commande.date_de_prise_de_commande ? format(new Date(commande.date_de_prise_de_commande), 'dd/MM/yyyy à HH:mm', { locale: fr }) : 'Date inconnue'}
                            </div>
                            {commande.details && commande.details.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {commande.details.length} article{commande.details.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-thai-orange">
                            {(commande.details?.reduce((sum, d) => sum + ((d.plat?.prix || 0) * (d.quantite_plat_commande || 0)), 0) || 0).toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune commande trouvée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite - Dernier événement + Navigation */}
        <div className="space-y-6">
          {/* Dernier événement - LECTURE SEULE */}
          <Card className="border-thai-gold/20 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Dernier Événement
                </div>
                <Button 
                  onClick={navigateToEvents}
                  variant="outline" 
                  size="sm"
                  className="border-thai-gold text-thai-gold hover:bg-thai-gold hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir Tous
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dernierEvenement ? (
                <div className="border border-thai-gold/20 rounded-lg p-4 bg-thai-cream/5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-thai-green text-lg">
                          {dernierEvenement.nom_evenement}
                        </h4>
                        <p className="text-sm text-thai-gold font-medium">
                          {dernierEvenement.type_d_evenement}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-thai-gold" />
                        <span>
                          {dernierEvenement.date_evenement 
                            ? format(new Date(dernierEvenement.date_evenement), 'dd/MM/yyyy', { locale: fr })
                            : 'Date non définie'
                          }
                        </span>
                      </div>
                      
                      {dernierEvenement.nombre_de_personnes && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4 text-thai-gold" />
                          <span>{dernierEvenement.nombre_de_personnes} personnes</span>
                        </div>
                      )}
                      
                      {dernierEvenement.budget_client && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Euro className="w-4 h-4 text-thai-gold" />
                          <span>{dernierEvenement.budget_client}€</span>
                        </div>
                      )}
                    </div>
                    
                    {dernierEvenement.demandes_speciales_evenement && (
                      <div className="mt-3 p-3 bg-thai-cream/10 rounded-lg">
                        <p className="text-xs text-gray-600 italic">
                          {dernierEvenement.demandes_speciales_evenement}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucun événement trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

// --- Composant Principal ---
export default function AdminClients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientUI | null>(null);
  const router = useRouter();
  
  const { data: clients } = useClients();
  const { data: commandes } = useCommandes();

  // Fonction pour obtenir les initiales comme dans FloatingUserIcon
  const getInitials = (nom?: string, prenom?: string) => {
    if (prenom) {
      return prenom.charAt(0).toUpperCase()
    }
    if (!nom) return 'C'
    return nom.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  // Fonction pour obtenir le nom d'affichage comme dans FloatingUserIcon
  const getDisplayName = (client: ClientUI) => {
    return client.prenom && client.nom 
      ? `${client.prenom} ${client.nom}`
      : client.nom || client.email?.split('@')[0] || 'Client'
  }

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchTerm) return []; // Ne rien afficher si la recherche est vide
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.nom?.toLowerCase().includes(term) ||
      client.prenom?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  const selectClient = (client: ClientUI) => {
    setSelectedClient(client);
  };

  if (selectedClient) {
    return (
      <FicheClient 
        client={selectedClient} 
        commandes={commandes?.filter(c => c.client_r_id === selectedClient.idclient) || []}
        onBack={() => setSelectedClient(null)}
        router={router}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Recherche Premium */}
      <Card className="shadow-xl border-thai-orange/20 animate-in fade-in-0 hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-thai-cream/30 to-white border-b border-thai-orange/10">
          <CardTitle className="text-thai-green flex items-center gap-3">
            <div className="p-2 bg-thai-orange/10 rounded-lg border border-thai-orange/20 shadow-sm">
              <Search className="w-6 h-6 text-thai-orange" />
            </div>
            <div>
              <span className="text-xl font-bold">Recherche Intelligente</span>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Recherchez par nom, prénom, email ou ID client
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-thai-orange transition-all duration-200 group-hover:scale-110">
              <Search className="w-5 h-5" />
            </div>
            <Input
              placeholder="Taper le nom, prénom, email ou ID du client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-14 text-lg border-2 border-thai-orange/30 rounded-xl bg-white/50 backdrop-blur-sm focus:border-thai-orange focus:ring-2 focus:ring-thai-orange/30 focus:bg-white transition-all duration-300 hover:border-thai-orange/60"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-thai-red transition-colors duration-200 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Statistiques de recherche */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Total clients: <span className="font-bold text-thai-green">{clients?.length || 0}</span>
              </span>
              {searchTerm && (
                <span className="text-thai-orange font-medium">
                  Résultats trouvés: <span className="font-bold">{filteredClients.length}</span>
                </span>
              )}
            </div>
            {searchTerm && (
              <div className="flex items-center gap-2 text-thai-orange">
                <div className="w-2 h-2 bg-thai-orange rounded-full animate-pulse"></div>
                Recherche active
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Sélection Premium */}
      <Card className="shadow-xl border-thai-green/20 animate-in fade-in-0 hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-thai-green/5 to-thai-cream/20 border-b border-thai-green/10">
          <CardTitle className="text-thai-green flex items-center gap-3">
            <div className="p-2 bg-thai-green/10 rounded-lg border border-thai-green/20 shadow-sm">
              <Users className="w-6 h-6 text-thai-green" />
            </div>
            <div>
              <span className="text-xl font-bold">Sélection Rapide</span>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Accès direct à tous les clients enregistrés
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Select onValueChange={(value) => {
            const client = clients?.find(c => c.idclient.toString() === value);
            if (client) selectClient(client);
          }}>
            <SelectTrigger className="w-full h-16 text-lg border-2 border-thai-green/30 rounded-xl bg-white/50 backdrop-blur-sm hover:border-thai-green hover:bg-white focus:border-thai-green focus:ring-2 focus:ring-thai-green/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
              <div className="flex items-center gap-3 w-full">
                <div className="p-2 bg-thai-green/10 rounded-lg border border-thai-green/20 shadow-sm group-hover:bg-thai-green/20 transition-colors duration-200">
                  <Users className="w-5 h-5 text-thai-green" />
                </div>
                <SelectValue placeholder="Choisir un client dans la liste complète..." />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-thai-green/20 shadow-2xl rounded-xl overflow-hidden max-h-80">
              {clients?.map((client) => (
                <SelectItem 
                  key={client.idclient} 
                  value={client.idclient.toString()}
                  className="hover:bg-thai-green/10 focus:bg-thai-green/10 transition-all duration-200 cursor-pointer py-3 px-4 my-1 mx-1 rounded-lg"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Avatar avec hover effect */}
                    <div className="relative group-hover:scale-110 transition-transform duration-200">
                      {client.photo_client ? (
                        <img 
                          src={client.photo_client} 
                          alt={getDisplayName(client)}
                          className="w-10 h-10 rounded-full object-cover border-2 border-thai-green/30 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-thai-green text-white text-sm font-bold shadow-sm">
                          {getInitials(client.nom, client.prenom)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-thai-green rounded-full flex items-center justify-center shadow-sm">
                        <User className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    
                    {/* Informations client */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-thai-green text-base truncate">
                        {getDisplayName(client)}
                      </div>
                      {client.email && (
                        <div className="text-gray-500 text-sm truncate">
                          {client.email}
                        </div>
                      )}
                      <div className="flex flex-col gap-1 mt-1 text-xs text-gray-500">
                        {client.numero_de_telephone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-thai-green" />
                            <span>{client.numero_de_telephone}</span>
                          </div>
                        )}
                        {client.adresse_numero_et_rue && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-thai-green" />
                            <span className="truncate">{client.adresse_numero_et_rue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Indicateur de sélection */}
                    <ChevronRight className="w-5 h-5 text-thai-green/50 group-hover:text-thai-green group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Actions rapides */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-thai-green rounded-full"></div>
              <span>Clients disponibles: {clients?.length || 0}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchTerm && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-600">Résultats de la recherche ({filteredClients.length})</h3>
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <Card 
                key={client.idclient} 
                className="hover:bg-thai-cream/50 cursor-pointer transition-colors"
                onClick={() => selectClient(client)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {client.photo_client ? (
                      <img 
                        src={client.photo_client} 
                        alt={getDisplayName(client)}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold">
                        {getInitials(client.nom, client.prenom)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-thai-green">{getDisplayName(client)}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Aucun client ne correspond à votre recherche.</p>
          )}
        </div>
      )}

      {!searchTerm && (
        <div className="text-center py-16 text-gray-500">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium">Commencez par rechercher un client</h2>
          <p>Utilisez la barre de recherche ci-dessus pour trouver une fiche client.</p>
        </div>
      )}
    </div>
  );
}