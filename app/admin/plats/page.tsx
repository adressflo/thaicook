'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Check
} from 'lucide-react';
import { usePlats, useCreatePlat, useUpdatePlat } from '@/hooks/useSupabaseData';
import type { PlatUI as Plat } from '@/types/app';

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
  
  const { data: plats, refetch } = usePlats();
  const createPlatMutation = useCreatePlat();
  const updatePlatMutation = useUpdatePlat();
  const { toast } = useToast();

  const jours = [
    { key: 'lundi_dispo', label: 'Lun' },
    { key: 'mardi_dispo', label: 'Mar' },
    { key: 'mercredi_dispo', label: 'Mer' },
    { key: 'jeudi_dispo', label: 'Jeu' },
    { key: 'vendredi_dispo', label: 'Ven' },
    { key: 'samedi_dispo', label: 'Sam' },
    { key: 'dimanche_dispo', label: 'Dim' }
  ];

  // Fonction pour marquer un plat indisponible (tous les jours à "non")
  const marquerIndisponible = async (platId: number) => {
    try {
      await updatePlatMutation.mutateAsync({
        id: platId,
        updateData: { 
          lundi_dispo: 'non' as const,
          mardi_dispo: 'non' as const,
          mercredi_dispo: 'non' as const,
          jeudi_dispo: 'non' as const,
          vendredi_dispo: 'non' as const,
          samedi_dispo: 'non' as const,
          dimanche_dispo: 'non' as const
        }
      });
      
      toast({
        title: "Succès",
        description: "Plat marqué comme indisponible"
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la disponibilité",
        variant: "destructive"
      });
    }
  };

  // Fonction pour marquer un plat disponible (tous les jours à "oui")
  const marquerDisponible = async (platId: number) => {
    try {
      await updatePlatMutation.mutateAsync({
        id: platId,
        updateData: { 
          lundi_dispo: 'oui' as const,
          mardi_dispo: 'oui' as const,
          mercredi_dispo: 'oui' as const,
          jeudi_dispo: 'oui' as const,
          vendredi_dispo: 'oui' as const,
          samedi_dispo: 'oui' as const,
          dimanche_dispo: 'oui' as const
        }
      });
      
      toast({
        title: "Succès",
        description: "Plat marqué comme disponible"
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la disponibilité",
        variant: "destructive"
      });
    }
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
          data: form
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

  // Filtrer les plats selon la disponibilité
  const platsFiltered = plats?.filter(plat => {
    if (filtreDisponibilite === 'disponibles') {
      return countJoursDisponibles(plat) > 0;
    } else if (filtreDisponibilite === 'indisponibles') {
      return countJoursDisponibles(plat) === 0;
    }
    return true; // tous
  }) || [];

  const stats = {
    total: plats?.length || 0,
    disponibles: plats?.filter(plat => countJoursDisponibles(plat) > 0).length || 0,
    indisponibles: plats?.filter(plat => countJoursDisponibles(plat) === 0).length || 0
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Plats</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.disponibles}</div>
            <div className="text-sm text-green-600">Disponibles</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-700">{stats.indisponibles}</div>
            <div className="text-sm text-red-600">Indisponibles</div>
          </CardContent>
        </Card>
      </div>

      {/* Header avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-thai-green">Gestion des Plats</h1>
          <p className="text-sm text-gray-600">Gérez votre menu et la disponibilité des plats</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFiltreDisponibilite('tous')}
            className={filtreDisponibilite === 'tous' ? 'bg-thai-orange text-white' : ''}
          >
            Tous ({stats.total})
          </Button>
          <Button
            variant="outline"
            onClick={() => setFiltreDisponibilite('disponibles')}
            className={filtreDisponibilite === 'disponibles' ? 'bg-green-500 text-white' : ''}
          >
            Disponibles ({stats.disponibles})
          </Button>
          <Button
            variant="outline"
            onClick={() => setFiltreDisponibilite('indisponibles')}
            className={filtreDisponibilite === 'indisponibles' ? 'bg-red-500 text-white' : ''}
          >
            Indisponibles ({stats.indisponibles})
          </Button>
          <Button
            onClick={() => {
              setIsCreating(true);
              setForm(initialForm);
              setEditingId(null);
            }}
            className="bg-thai-green hover:bg-thai-green/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Plat
          </Button>
        </div>
      </div>

      {/* Formulaire de création/édition */}
      {(isCreating || editingId) && (
        <Card className="border-2 border-thai-orange">
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center gap-2">
              {isCreating ? <Plus className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              {isCreating ? 'Créer un Nouveau Plat' : 'Modifier le Plat'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plat">Nom du plat *</Label>
                <Input
                  id="plat"
                  value={form.plat}
                  onChange={(e) => setForm({ ...form, plat: e.target.value })}
                  placeholder="Ex: Pad Thai"
                />
              </div>
              <div>
                <Label htmlFor="prix">Prix (€) *</Label>
                <Input
                  id="prix"
                  type="number"
                  step="0.01"
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: parseFloat(e.target.value) || 0 })}
                  placeholder="12.90"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description du plat..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="photo">URL de la photo</Label>
              <Input
                id="photo"
                value={form.photo_du_plat}
                onChange={(e) => setForm({ ...form, photo_du_plat: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Disponibilité par jour</Label>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {jours.map(({ key, label }) => (
                  <div key={key} className="text-center">
                    <Label className="text-xs">{label}</Label>
                    <Switch
                      checked={form[key as keyof PlatForm] === 'oui'}
                      onCheckedChange={(checked) => 
                        setForm({ ...form, [key]: checked ? 'oui' : 'non' })
                      }
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSubmit} className="bg-thai-green hover:bg-thai-green/90">
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Créer' : 'Sauvegarder'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des plats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platsFiltered.map((plat) => {
          const joursDispos = countJoursDisponibles(plat);
          const isDisponible = joursDispos > 0;
          
          return (
            <Card key={plat.idplats} className={`border-l-4 ${isDisponible ? 'border-green-500' : 'border-red-500'} hover:shadow-lg transition-shadow`}>
              <CardContent className="p-4">
                {/* Image du plat */}
                {plat.photo_du_plat && (
                  <div className="mb-4">
                    <img 
                      src={plat.photo_du_plat} 
                      alt={plat.plat}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Informations du plat */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-thai-green">{plat.plat}</h3>
                    <Badge variant={isDisponible ? "default" : "destructive"}>
                      {isDisponible ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          {joursDispos}/7 jours
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Indisponible
                        </>
                      )}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600">{plat.description}</p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-thai-gold">
                      <Euro className="w-3 h-3 mr-1" />
                      {formatPrice(plat.prix || 0)}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      #{plat.idplats}
                    </div>
                  </div>

                  {/* Jours disponibles */}
                  <div className="flex flex-wrap gap-1">
                    {jours.map(({ key, label }) => (
                      <Badge 
                        key={key}
                        variant={plat[key as keyof Plat] === 'oui' ? 'default' : 'outline'}
                        className={`text-xs ${plat[key as keyof Plat] === 'oui' ? 'bg-green-100 text-green-800' : 'text-gray-400'}`}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(plat)}
                      className="flex-1"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                    
                    {isDisponible ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => marquerIndisponible(plat.idplats)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <EyeOff className="w-3 h-3 mr-1" />
                        Désactiver
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => marquerDisponible(plat.idplats)}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Activer
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {platsFiltered.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              {filtreDisponibilite === 'disponibles' ? 'Aucun plat disponible' :
               filtreDisponibilite === 'indisponibles' ? 'Aucun plat indisponible' :
               'Aucun plat trouvé'}
            </h3>
            <p className="text-gray-400">
              {filtreDisponibilite === 'tous' && 'Commencez par créer votre premier plat'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}