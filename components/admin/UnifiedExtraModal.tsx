'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Package, Euro } from 'lucide-react';
import { useExtras, useCreateExtra, useAddPlatToCommande } from '@/hooks/useSupabaseData';
import type { ExtraUI } from '@/types/app';

interface UnifiedExtraModalProps {
  isOpen: boolean;
  onClose: () => void;
  commandeId: number;
}

export const UnifiedExtraModal = ({ isOpen, onClose, commandeId }: UnifiedExtraModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' ou 'create'

  // Hooks pour les données
  const { data: extras, isLoading: extrasLoading } = useExtras();
  const createExtraMutation = useCreateExtra();
  const addToCommandeMutation = useAddPlatToCommande();

  // États pour la sélection d'extra existant
  const [selectedExtraId, setSelectedExtraId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // États pour la création d'extra
  const [newExtraForm, setNewExtraForm] = useState({
    nom_extra: '',
    description: '',
    prix: '',
    photo_url: 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png'
  });

  // Filtrer les extras selon la recherche
  const filteredExtras = extras?.filter(extra =>
    extra.nom_extra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extra.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const resetForm = () => {
    setSelectedExtraId(null);
    setSearchTerm('');
    setNewExtraForm({
      nom_extra: '',
      description: '',
      prix: '',
      photo_url: 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png'
    });
    setActiveTab('existing');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Ajouter un extra existant à la commande
  const handleAddExistingExtra = async () => {
    if (!selectedExtraId) {
      toast({
        title: "⚠️ Sélection requise",
        description: "Veuillez sélectionner un extra",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCommandeMutation.mutateAsync({
        commandeId,
        extraId: selectedExtraId,
        quantite: 1,
        type: 'extra',
      });

      const selectedExtra = extras?.find((e: any) => e.idextra === selectedExtraId);
      toast({
        title: "✅ Extra ajouté",
        description: `"${selectedExtra?.nom_extra}" a été ajouté à la commande`,
      });

      handleClose();
    } catch (error) {
      console.error('Erreur ajout extra:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible d'ajouter l'extra à la commande",
        variant: "destructive",
      });
    }
  };

  // Créer un nouvel extra et l'ajouter à la commande
  const handleCreateAndAddExtra = async () => {
    if (!newExtraForm.nom_extra.trim() || !newExtraForm.prix) {
      toast({
        title: "⚠️ Champs requis",
        description: "Veuillez remplir le nom et le prix",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Créer l'extra dans le catalogue
      const newExtra = await createExtraMutation.mutateAsync({
        nom_extra: newExtraForm.nom_extra.trim(),
        description: newExtraForm.description.trim() || `Extra: ${newExtraForm.nom_extra}`,
        prix: parseFloat(newExtraForm.prix),
        photo_url: newExtraForm.photo_url,
        actif: true,
      });

      // 2. Ajouter l'extra à la commande
      await addToCommandeMutation.mutateAsync({
        commandeId,
        extraId: newExtra.idextra,
        quantite: 1,
        type: 'extra',
      });

      toast({
        title: "🎉 Extra créé et ajouté",
        description: `"${newExtra.nom_extra}" a été créé dans le catalogue et ajouté à la commande`,
      });

      handleClose();
    } catch (error) {
      console.error('Erreur création extra:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de créer et ajouter l'extra",
        variant: "destructive",
      });
    }
  };

  const formatPrix = (prix: number) => prix.toFixed(2) + '€';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-thai-orange" />
            Ajouter un Extra à la Commande
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Catalogue ({extras?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Créer Nouveau
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Sélectionner depuis le catalogue */}
          <TabsContent value="existing" className="mt-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un extra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Liste des extras */}
              {extrasLoading ? (
                <p className="text-center py-8">Chargement des extras...</p>
              ) : filteredExtras.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Aucun extra trouvé pour cette recherche' : 'Aucun extra dans le catalogue'}
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredExtras.map((extra: any) => (
                    <Card
                      key={extra.idextra}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedExtraId === extra.idextra
                          ? 'border-thai-orange bg-thai-orange/5'
                          : 'border-gray-200 hover:border-thai-orange/50'
                      }`}
                      onClick={() => setSelectedExtraId(extra.idextra)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={extra.photo_url || '/images/default-extra.jpg'}
                            alt={extra.nom_extra}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{extra.nom_extra}</h3>
                            <p className="text-gray-600 text-sm">{extra.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-thai-orange">
                                <Euro className="w-3 h-3 mr-1" />
                                {formatPrix(extra.prix)}
                              </Badge>
                              {extra.actif && (
                                <Badge className="bg-green-100 text-green-700">Actif</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Bouton d'ajout */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleAddExistingExtra}
                  disabled={!selectedExtraId || addToCommandeMutation.isPending}
                  className="bg-thai-orange hover:bg-thai-orange/90"
                >
                  {addToCommandeMutation.isPending ? 'Ajout...' : 'Ajouter à la commande'}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Créer un nouvel extra */}
          <TabsContent value="create" className="mt-4">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="nom_extra">Nom de l'extra *</Label>
                  <Input
                    id="nom_extra"
                    value={newExtraForm.nom_extra}
                    onChange={(e) => setNewExtraForm(prev => ({ ...prev, nom_extra: e.target.value }))}
                    placeholder="Ex: Sauce piquante, Boisson..."
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newExtraForm.description}
                    onChange={(e) => setNewExtraForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de l'extra..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="prix">Prix (€) *</Label>
                  <Input
                    id="prix"
                    type="number"
                    step="0.01"
                    value={newExtraForm.prix}
                    onChange={(e) => setNewExtraForm(prev => ({ ...prev, prix: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="photo_url">URL Photo (optionnel)</Label>
                  <Input
                    id="photo_url"
                    value={newExtraForm.photo_url}
                    onChange={(e) => setNewExtraForm(prev => ({ ...prev, photo_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Bouton de création */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleCreateAndAddExtra}
                  disabled={createExtraMutation.isPending || addToCommandeMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {(createExtraMutation.isPending || addToCommandeMutation.isPending)
                    ? 'Création...'
                    : 'Créer et Ajouter'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};