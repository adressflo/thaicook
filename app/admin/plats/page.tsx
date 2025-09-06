'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit2, 
  Save, 
  X, 
  Package,
  Euro,
  Image,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle,
  Check,
  Calendar,
  Utensils,
  ChefHat
} from 'lucide-react';
import { usePlats, useCreatePlat, useUpdatePlat } from '@/hooks/useSupabaseData';
import type { PlatUI as Plat } from '@/types/app';
import { EditableField } from '@/components/ui/EditableField';
import { DateRuptureManager } from '@/components/admin/DateRuptureManager';

// Fonction pour formater le prix à la française
const formatPrice = (price: number): string => {
  return price.toLocaleString('fr-FR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }) + '€';
};

interface PlatForm {
  plat: string;
  description: string;
  prix: number;
  photo_du_plat: string;
  lundi_dispo: 'oui' | 'non';
  mardi_dispo: 'oui' | 'non';
  mercredi_dispo: 'oui' | 'non';
  jeudi_dispo: 'oui' | 'non';
  vendredi_dispo: 'oui' | 'non';
  samedi_dispo: 'oui' | 'non';
  dimanche_dispo: 'oui' | 'non';
}

const initialForm: PlatForm = {
  plat: '',
  description: '',
  prix: 0,
  photo_du_plat: '',
  lundi_dispo: 'oui',
  mardi_dispo: 'oui',
  mercredi_dispo: 'oui',
  jeudi_dispo: 'oui',
  vendredi_dispo: 'oui',
  samedi_dispo: 'oui',
  dimanche_dispo: 'oui'
};

export default function AdminGestionPlats() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PlatForm>(initialForm);
  const [filtreDisponibilite, setFiltreDisponibilite] = useState<'tous' | 'disponibles' | 'indisponibles'>('tous');
  const [activeTab, setActiveTab] = useState<'plats' | 'complements'>('plats');
  const [showRuptureManager, setShowRuptureManager] = useState<{platId: number; platNom: string} | null>(null);
  const [isEditingPlat, setIsEditingPlat] = useState<Plat | null>(null);
  
  const { data: allPlats, refetch } = usePlats();
  const createPlatMutation = useCreatePlat();
  const updatePlatMutation = useUpdatePlat();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditingPlat) {
      startEditing(isEditingPlat);
    }
  }, [isEditingPlat]);

  // Séparer les plats principaux des compléments
  const plats = allPlats?.filter(p => p.categorie !== 'complement_divers') || [];
  const complements = allPlats?.filter(p => p.categorie === 'complement_divers') || [];
  
  const currentItems = activeTab === 'plats' ? plats : complements;

  // Fonctions utilitaires
  const marquerDisponible = async (platId: number) => {
    const updates = {
      lundi_dispo: 'oui' as const,
      mardi_dispo: 'oui' as const,
      mercredi_dispo: 'oui' as const,
      jeudi_dispo: 'oui' as const,
      vendredi_dispo: 'oui' as const,
      samedi_dispo: 'oui' as const,
      dimanche_dispo: 'oui' as const
    };
    await handleInlineUpdate(platId, updates);
  };

  const marquerIndisponible = async (platId: number) => {
    const updates = {
      lundi_dispo: 'non' as const,
      mardi_dispo: 'non' as const,
      mercredi_dispo: 'non' as const,
      jeudi_dispo: 'non' as const,
      vendredi_dispo: 'non' as const,
      samedi_dispo: 'non' as const,
      dimanche_dispo: 'non' as const
    };
    await handleInlineUpdate(platId, updates);
  };

  const handleInlineUpdate = async (platId: number, updateData: any) => {
    try {
      await updatePlatMutation.mutateAsync({
        id: platId,
        updateData: typeof updateData === 'object' && !Array.isArray(updateData) 
          ? updateData 
          : { [Object.keys(updateData)[0]]: Object.values(updateData)[0] }
      });
      toast({
        title: "Succès",
        description: "Plat modifié avec succès"
      });
      refetch();
    } catch (error) {
      console.error('Erreur inline update:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le plat",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleDayToggle = async (platId: number, jour: string, newValue: boolean) => {
    return handleInlineUpdate(platId, { [jour]: newValue ? 'oui' : 'non' });
  };

  const handleSubmit = async () => {
    if (!form.plat.trim() || !form.description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isCreating) {
        await createPlatMutation.mutateAsync({
          data: {
            ...form,
            categorie: activeTab === 'complements' ? 'complement_divers' : 'plat_principal'
          }
        });
        toast({
          title: "Succès",
          description: "Nouveau plat créé avec succès"
        });
        setIsCreating(false);
        setForm(initialForm);
      } else if (editingId) {
        await updatePlatMutation.mutateAsync({
          id: editingId,
          updateData: form
        });
        toast({
          title: "Succès",
          description: "Plat modifié avec succès"
        });
        setEditingId(null);
        setForm(initialForm);
      }
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le plat",
        variant: "destructive"
      });
    }
  };

  const startEditing = (plat: Plat) => {
    setForm({
      plat: plat.plat,
      description: plat.description || '',
      prix: plat.prix || 0,
      photo_du_plat: plat.photo_du_plat || '',
      lundi_dispo: plat.lundi_dispo === 'oui' ? 'oui' : 'non',
      mardi_dispo: plat.mardi_dispo === 'oui' ? 'oui' : 'non',
      mercredi_dispo: plat.mercredi_dispo === 'oui' ? 'oui' : 'non',
      jeudi_dispo: plat.jeudi_dispo === 'oui' ? 'oui' : 'non',
      vendredi_dispo: plat.vendredi_dispo === 'oui' ? 'oui' : 'non',
      samedi_dispo: plat.samedi_dispo === 'oui' ? 'oui' : 'non',
      dimanche_dispo: plat.dimanche_dispo === 'oui' ? 'oui' : 'non'
    });
    setEditingId(plat.idplats);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setForm(initialForm);
    setEditingId(null);
    setIsCreating(false);
  };

  // Calculer le nombre de jours disponibles pour un plat
  const countJoursDisponibles = (plat: Plat) => {
    const joursDispos = [
      plat.lundi_dispo,
      plat.mardi_dispo,
      plat.mercredi_dispo,
      plat.jeudi_dispo,
      plat.vendredi_dispo,
      plat.samedi_dispo,
      plat.dimanche_dispo
    ];
    return joursDispos.filter(jour => jour === 'oui').length;
  };

  // Filtrer les items selon la disponibilité
  const itemsFiltered = currentItems?.filter(plat => {
    if (filtreDisponibilite === 'disponibles') {
      return countJoursDisponibles(plat) > 0;
    } else if (filtreDisponibilite === 'indisponibles') {
      return countJoursDisponibles(plat) === 0;
    }
    return true; // tous
  }) || [];

  // Trier pour afficher les plats disponibles en premier
  itemsFiltered.sort((a, b) => {
    const aDispo = countJoursDisponibles(a) > 0;
    const bDispo = countJoursDisponibles(b) > 0;
    if (aDispo && !bDispo) {
      return -1;
    }
    if (!aDispo && bDispo) {
      return 1;
    }
    return 0;
  });

  const stats = {
    total: currentItems?.length || 0,
    disponibles: currentItems?.filter(plat => countJoursDisponibles(plat) > 0).length || 0,
    indisponibles: currentItems?.filter(plat => countJoursDisponibles(plat) === 0).length || 0
  };

  // Afficher le gestionnaire de ruptures
  if (showRuptureManager) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button
          onClick={() => setShowRuptureManager(null)}
          variant="outline"
          className="mb-4 border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
        >
          ← Retour aux plats
        </Button>
        <DateRuptureManager
          platId={showRuptureManager.platId}
          platNom={showRuptureManager.platNom}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="border-2 border-thai-orange/20 shadow-xl bg-gradient-to-br from-white to-thai-cream/30">
        <CardHeader className="border-b border-thai-orange/20 bg-gradient-to-r from-thai-cream/20 to-white">
          <CardTitle className="flex items-center gap-3 text-thai-green text-xl">
            <ChefHat className="w-6 h-6 text-thai-orange" />
            Gestion des Plats ({stats.total} plats)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          

          {/* Onglets avec design Thai */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-thai-cream/30 border-2 border-thai-orange/20">
              <TabsTrigger 
                value="plats" 
                className="data-[state=active]:bg-thai-orange data-[state=active]:text-white transition-all duration-300 hover:bg-thai-orange/20 font-semibold"
              >
                <Utensils className="w-4 h-4 mr-2" />
                Plats du Menu ({plats.length})
              </TabsTrigger>
              <TabsTrigger 
                value="complements" 
                className="data-[state=active]:bg-thai-gold data-[state=active]:text-white transition-all duration-300 hover:bg-thai-gold/20 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Extras Admin ({complements.length})
              </TabsTrigger>
            </TabsList>

            

            <TabsContent value="plats" className="space-y-4">
              {/* Filtres de disponibilité */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <Button
                      variant={filtreDisponibilite === 'tous' ? 'default' : 'outline'}
                      onClick={() => setFiltreDisponibilite('tous')}
                      className={filtreDisponibilite === 'tous' ? 'bg-thai-orange hover:bg-thai-orange/90' : 'border-thai-orange/40 text-thai-orange hover:bg-thai-orange hover:text-white'}
                    >
                      <Package className="w-4 h-4 mr-1" />
                      Tous ({stats.total})
                    </Button>
                    <Button
                      variant={filtreDisponibilite === 'disponibles' ? 'default' : 'outline'}
                      onClick={() => setFiltreDisponibilite('disponibles')}
                      className={filtreDisponibilite === 'disponibles' ? 'bg-thai-green hover:bg-thai-green/90' : 'border-thai-green/40 text-thai-green hover:bg-thai-green hover:text-white'}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Disponibles ({stats.disponibles})
                    </Button>
                    <Button
                      variant={filtreDisponibilite === 'indisponibles' ? 'default' : 'outline'}
                      onClick={() => setFiltreDisponibilite('indisponibles')}
                      className={filtreDisponibilite === 'indisponibles' ? 'bg-thai-red hover:bg-thai-red/90' : 'border-thai-red/40 text-thai-red hover:bg-thai-red hover:text-white'}
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      Indisponibles ({stats.indisponibles})
                    </Button>
                </div>
                <Button
                    onClick={() => {
                      setIsCreating(true);
                      setForm(initialForm);
                      setEditingId(null);
                    }}
                    className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau {activeTab === 'plats' ? 'Plat' : 'Complément'}
                  </Button>
              </div>

              {/* Formulaire de création */}
              {isCreating && (
                <Card className="border-2 border-thai-orange bg-gradient-to-r from-thai-cream/30 to-white">
                  <CardHeader className="bg-thai-orange/10">
                    <CardTitle className="text-thai-green flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Créer un Nouveau Plat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plat">Nom du plat *</Label>
                        <Input
                          id="plat"
                          value={form.plat}
                          onChange={(e) => setForm(prev => ({ ...prev, plat: e.target.value }))}
                          placeholder="Ex: Pad Thai aux crevettes"
                          className="border-thai-orange/20 focus:border-thai-orange"
                        />
                      </div>
                      <div>
                        <Label htmlFor="prix">Prix (€) *</Label>
                        <Input
                          id="prix"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.prix}
                          onChange={(e) => setForm(prev => ({ ...prev, prix: parseFloat(e.target.value) || 0 }))}
                          className="border-thai-orange/20 focus:border-thai-orange"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description du plat..."
                        rows={3}
                        className="border-thai-orange/20 focus:border-thai-orange"
                      />
                    </div>
                    <div>
                      <Label htmlFor="photo">Photo (URL)</Label>
                      <Input
                        id="photo"
                        value={form.photo_du_plat}
                        onChange={(e) => setForm(prev => ({ ...prev, photo_du_plat: e.target.value }))}
                        placeholder="https://..."
                        className="border-thai-orange/20 focus:border-thai-orange"
                      />
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={createPlatMutation.isPending || updatePlatMutation.isPending}
                        className="bg-thai-green hover:bg-thai-green/90 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Créer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Modal de modification */}
              <Dialog open={!!isEditingPlat} onOpenChange={() => setIsEditingPlat(null)}>
                <DialogContent className="sm:max-w-[425px] bg-white border border-thai-orange shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-thai-orange">Modifier le plat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="plat-edit">Nom du plat *</Label>
                      <Input
                        id="plat-edit"
                        value={form.plat}
                        onChange={(e) => setForm(prev => ({ ...prev, plat: e.target.value }))}
                        placeholder="Ex: Pad Thai aux crevettes"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="prix-edit">Prix (€) *</Label>
                      <Input
                        id="prix-edit"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.prix}
                        onChange={(e) => setForm(prev => ({ ...prev, prix: parseFloat(e.target.value) || 0 }))}
                        placeholder="Ex: 12.90"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description-edit">Description *</Label>
                      <Textarea
                        id="description-edit"
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description du plat..."
                        rows={3}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="photo-edit">Photo (URL)</Label>
                      <Input
                        id="photo-edit"
                        value={form.photo_du_plat}
                        onChange={(e) => setForm(prev => ({ ...prev, photo_du_plat: e.target.value }))}
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingPlat(null)}
                        disabled={updatePlatMutation.isPending}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={updatePlatMutation.isPending}
                        className="bg-thai-green hover:bg-thai-green/90 text-white"
                      >
                        {updatePlatMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Liste des plats */}
              <div className="grid gap-4">
                {itemsFiltered.map((plat) => {
                  const joursDispos = countJoursDisponibles(plat);
                  const isDisponible = joursDispos > 0;
                  
                  return (
                    <Card 
                      key={plat.idplats} 
                      className={`border-l-4 ${isDisponible ? 'border-thai-green bg-green-50/30' : 'border-thai-red bg-red-50/30'} hover:shadow-xl hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform transition-all duration-300`}
                    >
                      <CardContent className="p-0">
                        <div className="p-6 border-b rounded-t-lg bg-white">
                          <div className="flex gap-4 items-start">
                          {/* Image du plat - Éditable inline */}
                          <div className="flex-shrink-0">
                          <EditableField
                            value={plat.photo_du_plat || ''}
                            onSave={(newValue) => handleInlineUpdate(plat.idplats, { photo_du_plat: newValue })}
                            type="image"
                            placeholder="Ajouter une image"
                          />
                        </div>

                          {/* Informations du plat */}
                          <div className="flex-1 space-y-2">
                          {/* Nom du plat - Éditable inline */}
                          <div className="flex justify-between items-start">
                            <EditableField
                              value={plat.plat}
                              onSave={(newValue) => handleInlineUpdate(plat.idplats, { plat: newValue })}
                              type="text"
                              placeholder="Nom du plat"
                              className="text-lg font-semibold text-thai-green flex-1 mr-2"
                              validation={(value) => {
                                if (!value || value.trim().length < 2) {
                                  return "Le nom doit contenir au moins 2 caractères";
                                }
                                return true;
                              }}
                            />
                            <Badge variant={isDisponible ? "default" : "destructive"} className={isDisponible ? "bg-thai-green" : ""}>
                              {joursDispos} jour{joursDispos > 1 ? 's' : ''} dispo
                            </Badge>
                          </div>

                          {/* Description - Éditable inline */}
                          <EditableField
                            value={plat.description || ''}
                            onSave={(newValue) => handleInlineUpdate(plat.idplats, { description: newValue })}
                            type="textarea"
                            placeholder="Description du plat"
                            className="text-sm text-gray-600"
                          />

                          {/* Prix - Éditable inline */}
                          <div className="flex items-center gap-2">
                            <EditableField
                              value={plat.prix || 0}
                              onSave={(newValue) => handleInlineUpdate(plat.idplats, { prix: parseFloat(newValue) || 0 })}
                              type="number"
                              placeholder="0,00€"
                              validation={(value) => {
                                const num = parseFloat(value);
                                if (isNaN(num) || num < 0) {
                                  return "Le prix doit être un nombre positif";
                                }
                                return true;
                              }}
                              formatDisplay={(value) => formatPrice(value)}
                              className="text-thai-green font-medium"
                            />
                          </div>

                          

                          
                        </div>
                        </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-b-lg">
                          {/* Disponibilité par jour */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-thai-green flex items-center gap-1 mb-2">
                              <Calendar className="w-4 h-4" />
                              Disponibilité hebdomadaire:
                            </h4>
                            <div className="grid grid-cols-7 gap-2 text-xs">
                              {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((jour) => {
                                const dayKey = `${jour}_dispo` as keyof typeof plat;
                                const isAvailable = plat[dayKey] === 'oui';
                                return (
                                  <Button
                                    key={jour}
                                    size="sm"
                                    variant={isAvailable ? 'default' : 'outline'}
                                    onClick={() => handleDayToggle(plat.idplats, dayKey, !isAvailable)}
                                    className={`w-full h-10 text-xs capitalize ${isAvailable ? 'bg-thai-green hover:bg-thai-green/90' : 'border-gray-300'}`}
                                  >
                                    {jour.slice(0,3)}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex gap-2 pt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIsEditingPlat(plat)}
                              className="flex-1 text-xs text-thai-green border-thai-green/40 hover:bg-thai-green hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowRuptureManager({platId: plat.idplats, platNom: plat.plat})}
                              className="flex-1 text-xs text-thai-orange border-thai-orange/40 hover:bg-thai-orange hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Ruptures
                            </Button>
                            
                            {activeTab === 'plats' && (
                              isDisponible ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => marquerIndisponible(plat.idplats)}
                                  className="h-10 text-base w-auto min-w-[150px] border-2 border-thai-red/40 bg-gradient-to-r from-white to-red-50/20 hover:from-thai-red/10 hover:to-thai-red/20 hover:border-thai-red focus:border-thai-red shadow-lg hover:shadow-xl transition-all duration-300 font-bold rounded-xl backdrop-blur-sm hover:scale-105 group"
                                >
                                  <EyeOff className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                  Désactiver
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => marquerDisponible(plat.idplats)}
                                  className="h-10 text-base w-auto min-w-[150px] border-2 border-thai-green/40 bg-gradient-to-r from-white to-green-50/20 hover:from-thai-green/10 hover:to-thai-green/20 hover:border-thai-green focus:border-thai-green shadow-lg hover:shadow-xl transition-all duration-300 font-bold rounded-xl backdrop-blur-sm hover:scale-105 group"
                                >
                                  <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                  Activer
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {itemsFiltered.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      {filtreDisponibilite === 'disponibles' ? `Aucun ${activeTab} disponible` :
                       filtreDisponibilite === 'indisponibles' ? `Aucun ${activeTab} indisponible` :
                       `Aucun ${activeTab} trouvé`}
                    </h3>
                    <p className="text-gray-400">
                      {filtreDisponibilite === 'tous' && `Commencez par créer votre premier ${activeTab === 'plats' ? 'plat' : 'complément'}`}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="complements" className="space-y-4">
              {/* Même structure pour les compléments */}
              <div className="grid gap-4">
                {complements.map((plat) => {
                  const joursDispos = countJoursDisponibles(plat);
                  const isDisponible = joursDispos > 0;
                  
                  return (
                    <Card 
                      key={plat.idplats} 
                      className={`border-l-4 border-thai-gold hover:shadow-xl hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-2 hover:ring-thai-orange/30 hover:scale-[1.02] transform transition-all duration-300 bg-gradient-to-r from-white to-thai-gold/10`}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <EditableField
                              value={plat.plat}
                              onSave={(newValue) => handleInlineUpdate(plat.idplats, { plat: newValue })}
                              type="text"
                              placeholder="Nom du complément"
                              className="text-lg font-semibold text-thai-gold flex-1 mr-2"
                            />
                            <Badge className="bg-thai-gold/20 text-thai-gold">
                              Extra Admin
                            </Badge>
                          </div>

                          <EditableField
                            value={plat.description || ''}
                            onSave={(newValue) => handleInlineUpdate(plat.idplats, { description: newValue })}
                            type="textarea"
                            placeholder="Description du complément"
                            className="text-sm text-gray-600"
                          />

                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4 text-thai-gold" />
                            <EditableField
                              value={plat.prix?.toString() || '0'}
                              onSave={(newValue) => handleInlineUpdate(plat.idplats, { prix: parseFloat(newValue) || 0 })}
                              type="number"
                              placeholder="0.00"
                              className="text-thai-gold font-medium"
                            />
                            <span className="text-thai-gold">€</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {complements.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      Aucun complément trouvé
                    </h3>
                    <p className="text-gray-400">
                      Commencez par créer votre premier complément
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}