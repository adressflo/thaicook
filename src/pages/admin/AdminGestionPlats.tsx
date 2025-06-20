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
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { usePlats, useCreatePlat, useUpdatePlat } from '@/hooks/useSupabaseData';

interface PlatForm {
  plat: string;
  description: string;
  prix: number;
  photo_du_plat: string;
  // Utiliser les vrais noms de champs de la base
  lundi: boolean;
  mardi: boolean;
  mercredi: boolean;
  jeudi: boolean;
  vendredi: boolean;
  samedi: boolean;
  dimanche: boolean;
}

const initialForm: PlatForm = {
  plat: '',
  description: '',
  prix: 0,
  photo_du_plat: '',
  lundi: true,
  mardi: true,
  mercredi: true,
  jeudi: true,
  vendredi: true,
  samedi: true,
  dimanche: true
};

const AdminGestionPlats = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PlatForm>(initialForm);
  const [filtreDisponibilite, setFiltreDisponibilite] = useState<'tous' | 'disponibles' | 'indisponibles'>('tous');
  
  const { data: plats, refetch } = usePlats();
  const createPlatMutation = useCreatePlat();
  const updatePlatMutation = useUpdatePlat();
  const { toast } = useToast();

  const jours = [
    { key: 'lundi', label: 'Lun' },
    { key: 'mardi', label: 'Mar' },
    { key: 'mercredi', label: 'Mer' },
    { key: 'jeudi', label: 'Jeu' },
    { key: 'vendredi', label: 'Ven' },
    { key: 'samedi', label: 'Sam' },
    { key: 'dimanche', label: 'Dim' }
  ];

  // Fonction pour changer rapidement la disponibilité
  const toggleDisponibilite = async (platId: number, nouveauStatut: boolean) => {
    try {
      await updatePlatMutation.mutateAsync({
        id: platId,
        updateData: { disponible: nouveauStatut }
      });
      
      toast({
        title: "Succès",
        description: nouveauStatut ? "Plat rendu disponible" : "Plat rendu indisponible"
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

  // Statistiques avec vérification des propriétés
  const platsFiltres = plats?.filter(plat => {
    // @ts-ignore - propriété disponible peut ne pas exister sur tous les plats
    const isDisponible = plat.disponible !== false; // par défaut disponible si propriété manquante
    if (filtreDisponibilite === 'disponibles') return isDisponible;
    if (filtreDisponibilite === 'indisponibles') return !isDisponible;
    return true;
  }) || [];

  const stats = {
    total: plats?.length || 0,
    // @ts-ignore
    disponibles: plats?.filter(p => p.disponible !== false).length || 0,
    // @ts-ignore
    indisponibles: plats?.filter(p => p.disponible === false).length || 0
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleEdit = (plat: any) => {
    setEditingId(plat.idplats);
    setIsCreating(false);
    setForm({
      plat: plat.plat || '',
      description: plat.description || '',
      prix: plat.prix || 0,
      photo_du_plat: plat.photo_du_plat || '',
      lundi: plat.lundi !== false,
      mardi: plat.mardi !== false,
      mercredi: plat.mercredi !== false,
      jeudi: plat.jeudi !== false,
      vendredi: plat.vendredi !== false,
      samedi: plat.samedi !== false,
      dimanche: plat.dimanche !== false
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async () => {
    if (!form.plat.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du plat est requis",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isCreating) {
        await createPlatMutation.mutateAsync({ data: form });
        toast({
          title: "Succès",
          description: "Plat créé avec succès"
        });
      } else if (editingId) {
        await updatePlatMutation.mutateAsync({
          id: editingId,
          updateData: form
        });
        toast({
          title: "Succès",
          description: "Plat modifié avec succès"
        });
      }

      handleCancel();
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le plat",
        variant: "destructive"
      });
    }
  };

  const updateForm = (field: keyof PlatForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Statistiques en haut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.disponibles}</div>
                <div className="text-sm text-gray-600">Plats disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.indisponibles}</div>
                <div className="text-sm text-gray-600">Plats indisponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-thai-orange/20 rounded-lg">
                <Package className="w-6 h-6 text-thai-orange" />
              </div>
              <div>
                <div className="text-2xl font-bold text-thai-orange">{stats.total}</div>
                <div className="text-sm text-gray-600">Total des plats</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton créer + Formulaire */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-thai-green flex items-center gap-2">
              <Package className="w-5 h-5" />
              {isCreating ? 'Créer un Nouveau Plat' : editingId ? 'Modifier le Plat' : 'Gestion des Plats'}
            </CardTitle>
            {!isCreating && !editingId && (
              <Button onClick={handleCreate} className="bg-thai-orange hover:bg-thai-orange/90">
                <Plus className="w-4 h-4 mr-2" />
                Créer un Nouveau Plat
              </Button>
            )}
          </div>
        </CardHeader>

        {(isCreating || editingId) && (
          <CardContent className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plat">Nom du plat *</Label>
                <Input
                  id="plat"
                  value={form.plat}
                  onChange={(e) => updateForm('plat', e.target.value)}
                  placeholder="Ex: Pad Thaï"
                />
              </div>
              <div>
                <Label htmlFor="prix">Prix (€) *</Label>
                <Input
                  id="prix"
                  type="number"
                  step="0.50"
                  min="0"
                  value={form.prix}
                  onChange={(e) => updateForm('prix', parseFloat(e.target.value) || 0)}
                  placeholder="12.90"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Description du plat..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="photo_du_plat">URL de la photo</Label>
              <Input
                id="photo_du_plat"
                value={form.photo_du_plat}
                onChange={(e) => updateForm('photo_du_plat', e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Disponibilité par jour */}
            <div>
              <Label className="text-base font-medium">Disponibilité par jour</Label>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {jours.map((jour) => (
                  <div key={jour.key} className="flex flex-col items-center gap-2">
                    <Label className="text-sm">{jour.label}</Label>
                    <Switch
                      checked={form[jour.key as keyof PlatForm] as boolean}
                      onCheckedChange={(checked) => updateForm(jour.key as keyof PlatForm, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} className="bg-thai-orange hover:bg-thai-orange/90">
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Créer le Plat' : 'Modifier le Plat'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filtres de disponibilité */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filtreDisponibilite === 'tous' ? 'default' : 'outline'}
          onClick={() => setFiltreDisponibilite('tous')}
          className={filtreDisponibilite === 'tous' ? 'bg-thai-orange hover:bg-thai-orange/90' : ''}
        >
          Tous les plats ({stats.total})
        </Button>
        <Button
          variant={filtreDisponibilite === 'disponibles' ? 'default' : 'outline'}
          onClick={() => setFiltreDisponibilite('disponibles')}
          className={filtreDisponibilite === 'disponibles' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          <Eye className="w-4 h-4 mr-2" />
          Disponibles ({stats.disponibles})
        </Button>
        <Button
          variant={filtreDisponibilite === 'indisponibles' ? 'default' : 'outline'}
          onClick={() => setFiltreDisponibilite('indisponibles')}
          className={filtreDisponibilite === 'indisponibles' ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          <EyeOff className="w-4 h-4 mr-2" />
          Indisponibles ({stats.indisponibles})
        </Button>
      </div>

      {/* Liste des plats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-thai-green">
            Plats Existants ({platsFiltres.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platsFiltres.map((plat) => {
              // @ts-ignore - vérification de la propriété disponible
              const estDisponible = plat.disponible !== false;
              
              return (
                <Card 
                  key={plat.idplats} 
                  className={`overflow-hidden transition-all ${
                    !estDisponible ? 'opacity-75 grayscale' : ''
                  }`}
                >
                  <div className="aspect-video relative">
                    {plat.photo_du_plat ? (
                      <img 
                        src={plat.photo_du_plat} 
                        alt={plat.plat}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        estDisponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {estDisponible ? 'Disponible' : 'Indisponible'}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-thai-green mb-2">{plat.plat}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{plat.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-thai-orange flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        {plat.prix}€
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plat)}
                        className="text-thai-green hover:bg-thai-green/10"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                    </div>

                    {/* Toggle rapide de disponibilité */}
                    <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        {estDisponible ? 'Disponible' : 'Indisponible'}
                      </span>
                      <Switch
                        checked={estDisponible}
                        onCheckedChange={(checked) => toggleDisponibilite(plat.idplats, checked)}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>

                    {/* Jours de disponibilité */}
                    <div className="flex flex-wrap gap-1">
                      {jours.map((jour) => {
                        // @ts-ignore
                        const jourDisponible = plat[jour.key] !== false;
                        return (
                          <Badge
                            key={jour.key}
                            variant={jourDisponible ? "default" : "secondary"}
                            className={`text-xs ${
                              jourDisponible
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {jour.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGestionPlats;