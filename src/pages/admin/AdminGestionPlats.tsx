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
  Clock
} from 'lucide-react';
import { usePlats, useCreatePlat, useUpdatePlat } from '@/hooks/useSupabaseData';

interface PlatForm {
  nom_plat: string;
  description: string;
  prix: number;
  url_photo: string;
  disponible: boolean;
  lundi: boolean;
  mardi: boolean;
  mercredi: boolean;
  jeudi: boolean;
  vendredi: boolean;
  samedi: boolean;
  dimanche: boolean;
}

const initialForm: PlatForm = {
  nom_plat: '',
  description: '',
  prix: 0,
  url_photo: '',
  disponible: true,
  lundi: true,
  mardi: true,
  mercredi: true,
  jeudi: true,
  vendredi: true,
  samedi: true,
  dimanche: true
};const AdminGestionPlats = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PlatForm>(initialForm);
  
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

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleEdit = (plat: any) => {
    setEditingId(plat.idplats);
    setIsCreating(false);
    setForm({
      nom_plat: plat.nom_plat || '',
      description: plat.description || '',
      prix: plat.prix || 0,
      url_photo: plat.url_photo || '',
      disponible: plat.disponible,
      lundi: plat.lundi,
      mardi: plat.mardi,
      mercredi: plat.mercredi,
      jeudi: plat.jeudi,
      vendredi: plat.vendredi,
      samedi: plat.samedi,
      dimanche: plat.dimanche
    });
  };  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async () => {
    if (!form.nom_plat.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du plat est requis",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isCreating) {
        await createPlatMutation.mutateAsync(form);
        toast({
          title: "Succès",
          description: "Plat créé avec succès"
        });
      } else if (editingId) {
        await updatePlatMutation.mutateAsync({
          id: editingId,
          updates: form
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
  };  return (
    <div className="space-y-6">
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
                <Label htmlFor="nom_plat">Nom du plat *</Label>
                <Input
                  id="nom_plat"
                  value={form.nom_plat}
                  onChange={(e) => updateForm('nom_plat', e.target.value)}
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
            </div>            <div>
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
              <Label htmlFor="url_photo">URL de la photo</Label>
              <Input
                id="url_photo"
                value={form.url_photo}
                onChange={(e) => updateForm('url_photo', e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Disponibilité */}
            <div className="flex items-center space-x-2">
              <Switch
                id="disponible"
                checked={form.disponible}
                onCheckedChange={(checked) => updateForm('disponible', checked)}
              />
              <Label htmlFor="disponible">Plat disponible</Label>
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
            </div>            {/* Actions */}
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

      {/* Liste des plats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-thai-green">
            Plats Existants ({plats?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plats?.map((plat) => (
              <Card key={plat.idplats} className="overflow-hidden">
                <div className="aspect-video relative">
                  {plat.url_photo ? (
                    <img 
                      src={plat.url_photo} 
                      alt={plat.nom_plat}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      plat.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {plat.disponible ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </div>                <CardContent className="p-4">
                  <h3 className="font-bold text-thai-green mb-2">{plat.nom_plat}</h3>
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

                  {/* Jours de disponibilité */}
                  <div className="flex flex-wrap gap-1">
                    {jours.map((jour) => (
                      <Badge
                        key={jour.key}
                        variant={plat[jour.key as keyof typeof plat] ? "default" : "secondary"}
                        className={`text-xs ${
                          plat[jour.key as keyof typeof plat] 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {jour.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminGestionPlats;