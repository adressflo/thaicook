'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Users,
  Euro,
  Clock,
  MapPin,
  FileText,
  Search,
  Filter,
  Eye,
  Save,
  X
} from 'lucide-react';
import { useClients, useEvenementsByClient, useCreateEvenement } from '@/hooks/useSupabaseData';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { ClientUI, EvenementUI, CreateEvenementData } from '@/types/app';

const typeEvenements = [
  'Anniversaire',
  "Repas d'entreprise",
  'Fête de famille',
  'Cocktail dînatoire',
  'Buffet traiteur',
  'Autre'
] as const;

const statutsEvenement = [
  'Devis demandé',
  'Devis envoyé',
  'Confirmé / Acompte reçu',
  'En préparation',
  'Payé intégralement',
  'Réalisé',
  'Annulé'
] as const;

export default function ClientEventsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const clientId = params.id as string;
  
  const { data: clients } = useClients();
  const { data: evenements } = useEvenementsByClient(clientId);
  const createEvenementMutation = useCreateEvenement();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EvenementUI | null>(null);
  
  const [formData, setFormData] = useState({
    nom_evenement: '',
    date_evenement: '',
    type_d_evenement: 'Autre' as any,
    nombre_de_personnes: '',
    budget_client: '',
    demandes_speciales_evenement: '',
    statut: 'Devis demandé'
  });

  // Trouver le client actuel
  const client = useMemo(() => {
    return clients?.find(c => c.firebase_uid === clientId);
  }, [clients, clientId]);

  // Filtrer les événements
  const filteredEvenements = useMemo(() => {
    if (!evenements) return [];
    
    let filtered = [...evenements];

    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.nom_evenement?.toLowerCase().includes(term) ||
        event.type_d_evenement?.toLowerCase().includes(term) ||
        event.demandes_speciales_evenement?.toLowerCase().includes(term)
      );
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type_d_evenement === typeFilter);
    }

    // Tri par date décroissante
    filtered.sort((a, b) => {
      const dateA = a.date_evenement ? new Date(a.date_evenement) : new Date(0);
      const dateB = b.date_evenement ? new Date(b.date_evenement) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return filtered;
  }, [evenements, searchTerm, statusFilter, typeFilter]);

  // Statistiques
  const stats = useMemo(() => {
    if (!evenements) return { total: 0, totalBudget: 0, parStatut: {}, parType: {} };

    const total = evenements.length;
    const totalBudget = evenements.reduce((sum, event) => sum + (event.budget_client || 0), 0);
    
    const parStatut = evenements.reduce((acc, event) => {
      // Utilisation du statut fictif pour la démo
      const status = formData.statut || 'Devis demandé';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parType = evenements.reduce((acc, event) => {
      const type = event.type_d_evenement || 'Autre';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, totalBudget, parStatut, parType };
  }, [evenements, formData.statut]);

  // Génération du calendrier
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dayEvents = filteredEvenements.filter(event => 
        event.date_evenement && isSameDay(new Date(event.date_evenement), day)
      );
      
      return {
        date: day,
        events: dayEvents,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isSameDay(day, new Date())
      };
    });
  }, [currentDate, filteredEvenements]);

  // Fonction pour créer un nouvel événement
  const handleCreateEvent = async () => {
    if (!formData.nom_evenement.trim()) {
      toast({
        title: 'Nom requis',
        description: 'Veuillez saisir un nom pour l\'événement.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const eventData: CreateEvenementData = {
        nom_evenement: formData.nom_evenement,
        contact_client_r: clientId,
        contact_client_r_id: client?.idclient || 0,
        date_evenement: formData.date_evenement || new Date().toISOString().split('T')[0],
        type_d_evenement: formData.type_d_evenement,
        nombre_de_personnes: formData.nombre_de_personnes ? parseInt(formData.nombre_de_personnes) : 1,
        budget_client: formData.budget_client ? parseFloat(formData.budget_client) : undefined,
        demandes_speciales_evenement: formData.demandes_speciales_evenement || undefined
      };

      await createEvenementMutation.mutateAsync(eventData);

      toast({
        title: 'Événement créé',
        description: 'L\'événement a été créé avec succès.',
      });

      // Reset du formulaire
      setFormData({
        nom_evenement: '',
        date_evenement: '',
        type_d_evenement: 'Autre',
        nombre_de_personnes: '',
        budget_client: '',
        demandes_speciales_evenement: '',
        statut: 'Devis demandé'
      });
      setShowCreateModal(false);

    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'événement.',
        variant: 'destructive'
      });
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la Fiche
            </Button>
            
            <div className="flex items-center gap-3">
              {client.photo_client ? (
                <img 
                  src={client.photo_client} 
                  alt="Photo client" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-thai-orange shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold">
                  {client.prenom?.charAt(0) || 'C'}{client.nom?.charAt(0) || 'L'}
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-thai-green">
                  Événements - {client.prenom} {client.nom}
                </h1>
                <p className="text-thai-green/70">Planning & calendrier</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Événement
            </Button>
            
            <div className="flex border border-thai-orange/30 rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-thai-orange text-white' : 'text-thai-orange'}
              >
                Liste
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={viewMode === 'calendar' ? 'bg-thai-orange text-white' : 'text-thai-orange'}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Calendrier
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Événements</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="w-6 h-6 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Budget Total</p>
                  <p className="text-2xl font-bold">{stats.totalBudget}€</p>
                </div>
                <Euro className="w-6 h-6 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Confirmés</p>
                  <p className="text-2xl font-bold">{stats.parStatut['Confirmé / Acompte reçu'] || 0}</p>
                </div>
                <Users className="w-6 h-6 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">En Attente</p>
                  <p className="text-2xl font-bold">{stats.parStatut['Devis demandé'] || 0}</p>
                </div>
                <Clock className="w-6 h-6 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres & Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-thai-orange w-4 h-4" />
                <Input
                  placeholder="Rechercher événements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {typeEvenements.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {statutsEvenement.map(statut => (
                    <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setStatusFilter('all');
                }}
                variant="outline"
                className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contenu principal selon le mode */}
        {viewMode === 'list' ? (
          /* Mode Liste */
          <div className="space-y-4">
            {filteredEvenements.length > 0 ? (
              filteredEvenements.map((evenement) => (
                <Card key={evenement.id} className="shadow-lg hover:shadow-xl transition-shadow bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header événement */}
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-thai-green">
                              {evenement.nom_evenement}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <span className="bg-thai-gold/20 text-thai-gold px-2 py-1 rounded-full font-medium">
                                {evenement.type_d_evenement}
                              </span>
                              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                                Devis demandé
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-thai-orange">
                              {evenement.budget_client ? `${evenement.budget_client}€` : 'Budget à définir'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {evenement.nombre_de_personnes ? `${evenement.nombre_de_personnes} personnes` : 'Nombre à définir'}
                            </div>
                          </div>
                        </div>

                        {/* Détails événement */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-thai-orange" />
                            <div>
                              <div className="font-medium">Date événement</div>
                              <div>
                                {evenement.date_evenement 
                                  ? format(new Date(evenement.date_evenement), 'dd/MM/yyyy', { locale: fr })
                                  : 'Date à définir'
                                }
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4 text-thai-orange" />
                            <div>
                              <div className="font-medium">Nombre de personnes</div>
                              <div>{evenement.nombre_de_personnes || 'À définir'}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Euro className="w-4 h-4 text-thai-orange" />
                            <div>
                              <div className="font-medium">Budget prévu</div>
                              <div>{evenement.budget_client ? `${evenement.budget_client}€` : 'À définir'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Demandes spéciales */}
                        {evenement.demandes_speciales_evenement && (
                          <div className="bg-thai-cream/10 rounded-lg p-4">
                            <div className="text-sm font-medium text-thai-green mb-2">Demandes spéciales:</div>
                            <div className="text-sm text-gray-700 italic">
                              {evenement.demandes_speciales_evenement}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
                          title="Modifier"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Modifier
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3"
                          title="Dupliquer"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Dupliquer
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-lg bg-white/95 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun événement trouvé</h3>
                  <p className="text-gray-500 mb-6">
                    Ce client n'a pas encore d'événement planifié.
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-thai-orange hover:bg-thai-orange/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un événement
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Mode Calendrier */
          <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendrier - {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </CardTitle>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addDays(startOfMonth(currentDate), -1))}
                  >
                    ← Mois précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
                  >
                    Aujourd'hui
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addDays(endOfMonth(currentDate), 1))}
                  >
                    Mois suivant →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 min-h-[80px] border border-gray-200 rounded-lg ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${
                      day.isToday ? 'ring-2 ring-thai-orange bg-thai-orange/5' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      day.isToday ? 'text-thai-orange' : 
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {format(day.date, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {day.events.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="text-xs p-1 bg-thai-gold/20 text-thai-gold rounded truncate cursor-pointer hover:bg-thai-gold/30 transition-colors"
                          title={event.nom_evenement || 'Événement'}
                        >
                          {event.nom_evenement}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal création événement */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-thai-green flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nouvel Événement
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom" className="text-thai-green font-medium">Nom de l'événement *</Label>
                    <Input
                      id="nom"
                      value={formData.nom_evenement}
                      onChange={(e) => setFormData(prev => ({ ...prev, nom_evenement: e.target.value }))}
                      placeholder="Anniversaire de Marie..."
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-thai-green font-medium">Date de l'événement</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date_evenement}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_evenement: e.target.value }))}
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-thai-green font-medium">Type d'événement</Label>
                    <Select value={formData.type_d_evenement} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type_d_evenement: value }))}>
                      <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {typeEvenements.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="personnes" className="text-thai-green font-medium">Nombre de personnes</Label>
                    <Input
                      id="personnes"
                      type="number"
                      value={formData.nombre_de_personnes}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre_de_personnes: e.target.value }))}
                      placeholder="50"
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget" className="text-thai-green font-medium">Budget client (€)</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      value={formData.budget_client}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget_client: e.target.value }))}
                      placeholder="500.00"
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="demandes" className="text-thai-green font-medium">Demandes spéciales</Label>
                  <Textarea
                    id="demandes"
                    value={formData.demandes_speciales_evenement}
                    onChange={(e) => setFormData(prev => ({ ...prev, demandes_speciales_evenement: e.target.value }))}
                    placeholder="Menu végétarien, décoration spéciale..."
                    rows={3}
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateEvent}
                    className="bg-thai-orange hover:bg-thai-orange/90 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Créer l'événement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}