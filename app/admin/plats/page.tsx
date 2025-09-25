'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Calendar,
  Utensils,
  ChefHat
} from 'lucide-react';
import { usePlats, useCreatePlat, useUpdatePlat, useExtras, useCreateExtra, useUpdateExtra, useDeleteExtra } from '@/hooks/useSupabaseData';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { PlatUI as Plat, ExtraUI } from '@/types/app';
import { EditableField } from '@/components/ui/EditableField';
import { DateRuptureManager } from '@/components/admin/DateRuptureManager';

// Fonction pour formater le prix à la française
const formatPrice = (price: number): string => {
  return price.toLocaleString('fr-FR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }) + '€';
};

// Composant pour créer un nouvel extra
const NewExtraButton = () => {
  const { toast } = useToast();
  const createExtraMutation = useCreateExtra();
  const { refetch: refetchExtras } = useExtras();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExtraForm, setNewExtraForm] = useState({
    nom_extra: '',
    prix: '',
    description: '',
    photo_url: 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png'
  });

  // Hook réutilisable pour l&apos;upload d&apos;images
  const { uploadState, uploadFile, resetUpload } = useImageUpload(
    'extras',
    'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png'
  );

  // Fonction simplifiée utilisant le hook réutilisable
  const handleImageUpload = async (file: File) => {
    await uploadFile(file, (url) => {
      setNewExtraForm(prev => ({ ...prev, photo_url: url }));
    });
  };

  const handleCreateExtra = async () => {
    if (!newExtraForm.nom_extra || !newExtraForm.prix) {
      toast({
        title: "Erreur",
        description: "Le nom et le prix sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      await createExtraMutation.mutateAsync({
        nom_extra: newExtraForm.nom_extra,
        description: newExtraForm.description,
        prix: parseFloat(newExtraForm.prix),
        photo_url: newExtraForm.photo_url
      });

      toast({
        title: "Succès",
        description: `Extra "${newExtraForm.nom_extra}" créé avec succès`,
        variant: "default"
      });

      // Rafraîchir les données
      refetchExtras();

      // Réinitialiser le formulaire
      setIsModalOpen(false);
      setNewExtraForm({
        nom_extra: '',
        prix: '',
        description: '',
        photo_url: 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png'
      });
      resetUpload();
    } catch (error) {
      console.error('Erreur création extra:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l&apos;extra",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="bg-thai-green hover:bg-thai-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nouvel Extra
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border border-thai-orange shadow-xl" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle className="text-thai-green text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-thai-orange" />
              Créer un Nouvel Extra Thai
            </DialogTitle>
          </DialogHeader>
          <div id="dialog-description" className="sr-only">Formulaire de création d'un nouvel extra pour le menu</div>
          
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-thai-green font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4 text-thai-orange" />
                  Nom de l&apos;extra
                </Label>
                <Input
                  value={newExtraForm.nom_extra}
                  onChange={(e) => setNewExtraForm(prev => ({ ...prev, nom_extra: e.target.value }))}
                  className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green font-medium"
                  placeholder="Ex: Coca Cola, Thé Thaï..."
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-thai-green font-semibold flex items-center gap-2">
                  <Euro className="w-4 h-4 text-thai-orange" />
                  Prix (€)
                </Label>
                <Input
                  value={newExtraForm.prix}
                  onChange={(e) => setNewExtraForm(prev => ({ ...prev, prix: e.target.value }))}
                  type="number"
                  step="0.01"
                  className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green font-medium"
                  placeholder="25.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-thai-green font-semibold">Photo</Label>
              
              {/* Aperçu de l&apos;image */}
              <div className="mb-3">
                <img
                  src={newExtraForm.photo_url}
                  alt="Aperçu"
                  className="w-20 h-20 rounded-lg object-cover border-2 border-thai-orange/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png';
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Input
                  value={newExtraForm.photo_url}
                  onChange={(e) => setNewExtraForm(prev => ({ ...prev, photo_url: e.target.value }))}
                  className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 flex-1"
                  placeholder="https://..."
                  disabled={uploadState.isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white disabled:opacity-50"
                  disabled={uploadState.isUploading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    };
                    input.click();
                  }}
                >
                  {uploadState.isUploading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Image className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* État de l&apos;upload */}
              {uploadState.isUploading && (
                <p className="text-sm text-thai-orange animate-pulse">
                  Upload en cours...
                </p>
              )}
              {uploadState.error && (
                <p className="text-sm text-red-500">
                  {uploadState.error}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-thai-green font-semibold">Description</Label>
              <Textarea
                value={newExtraForm.description}
                onChange={(e) => setNewExtraForm(prev => ({ ...prev, description: e.target.value }))}
                className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20"
                rows={3}
                placeholder="Description de l&apos;extra..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateExtra}
                disabled={createExtraMutation.isPending}
                className="bg-thai-green hover:bg-thai-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {createExtraMutation.isPending ? (
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {createExtraMutation.isPending ? 'Création...' : 'Créer l\'Extra'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white transition-all duration-300"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Composant pour afficher et éditer les extras existants avec design Thai
const ExistingExtrasDisplay = ({ refetchPlats }: { refetchPlats?: () => void }) => {
  const { data: extras, isLoading, error, refetch: refetchExtras } = useExtras();
  const updateExtraMutation = useUpdateExtra();
  const deleteExtraMutation = useDeleteExtra();
  const createPlatMutation = useCreatePlat();
  const [editingExtra, setEditingExtra] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    nom_extra: '',
    prix: '',
    description: '',
    photo_url: ''
  });
  const [extraToDelete, setExtraToDelete] = useState<{id: number, name: string} | null>(null);

  // Hook réutilisable pour l&apos;upload d&apos;images en mode édition
  const { uploadState: editUploadState, uploadFile: uploadEditFile, resetUpload: resetEditUpload } = useImageUpload('extras');

  const handleStartEdit = (extra: ExtraUI) => {
    setEditForm({
      nom_extra: extra.nom_extra || '',
      prix: extra.prix?.toString() || '',
      description: extra.description || '',
      photo_url: extra.photo_url || 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png'
    });
    setEditingExtra(extra.idextra);
    // Réinitialiser l&apos;état d&apos;upload
    resetEditUpload();
  };

  const { toast } = useToast();

  // Fonction simplifiée utilisant le hook réutilisable pour l&apos;édition
  const handleEditImageUpload = async (file: File) => {
    await uploadEditFile(file, (url) => {
      setEditForm(prev => ({ ...prev, photo_url: url }));
    });
  };

  const handleSaveEdit = async () => {
    if (!editingExtra) return;
    
    try {
      await updateExtraMutation.mutateAsync({
        id: editingExtra,
        updates: {
          nom_extra: editForm.nom_extra,
          prix: parseFloat(editForm.prix),
          description: editForm.description,
          photo_url: editForm.photo_url
        }
      });

      setEditingExtra(null);
      resetEditUpload();
    } catch (error) {
      console.error('Erreur sauvegarde extra:', error);
    }
  };

  const handleDeleteExtra = (extraId: number, extraName: string) => {
    setExtraToDelete({ id: extraId, name: extraName });
  };

  const confirmDeleteExtra = async () => {
    if (!extraToDelete) return;

    try {
      await deleteExtraMutation.mutateAsync(extraToDelete.id);
      setExtraToDelete(null);
    } catch (error) {
      console.error('Erreur suppression extra:', error);
    }
  };

  const handleTransformToPlat = async (extra: ExtraUI) => {
    try {
      console.log('🔄 DÉBUT: Transformation extra → plat:', extra);

      // 1. CRÉER LE NOUVEAU PLAT avec la signature correcte useCreatePlat
      const platData = {
        plat: extra.nom_extra,
        description: extra.description || `Plat créé depuis l'extra ${extra.nom_extra}`,
        prix: extra.prix || 0,
        photo_du_plat: extra.photo_url || 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png',
        // ✅ TOUS LES JOURS OBLIGATOIRES avec valeurs correctes 'oui'/'non'
        lundi_dispo: 'oui',
        mardi_dispo: 'oui',
        mercredi_dispo: 'oui',
        jeudi_dispo: 'oui',
        vendredi_dispo: 'oui',
        samedi_dispo: 'oui',
        dimanche_dispo: 'oui',
        est_epuise: false
      };

      console.log('📤 Création plat avec données:', platData);

      // ✅ SIGNATURE CORRECTE useCreatePlat({ data: ... })
      await createPlatMutation.mutateAsync({ data: platData });
      console.log('✅ Plat créé avec succès');

      // 2. SUPPRIMER L'EXTRA (devient plat maintenant)
      console.log('🗑️ Suppression extra ID:', extra.idextra);
      await deleteExtraMutation.mutateAsync(extra.idextra);
      console.log('✅ Extra supprimé avec succès');

      // 3. RAFRAÎCHIR LES DEUX LISTES (plats + extras)
      if (refetchPlats) await refetchPlats(); // Rafraîchir plats
      await refetchExtras(); // Rafraîchir extras

      toast({
        title: "🎉 Extra transformé en plat menu !",
        description: `"${extra.nom_extra}" est maintenant disponible dans le menu principal`,
        variant: "default"
      });
    } catch (error) {
      console.error('❌ ERREUR transformation extra → plat:', error);
      toast({
        title: "❌ Erreur de transformation",
        description: `Impossible de transformer "${extra.nom_extra}" en plat menu`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="relative">
          <div className="animate-spin w-12 h-12 border-4 border-thai-orange/20 border-t-thai-orange rounded-full mx-auto"></div>
          <div className="absolute inset-0 animate-pulse">
            <div className="w-6 h-6 bg-thai-cream rounded-full mx-auto mt-3"></div>
          </div>
        </div>
        <p className="text-thai-green mt-4 font-medium">Chargement de vos extras Thai...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-thai-red/30 bg-gradient-to-br from-thai-red/5 to-white">
        <CardContent className="p-6 text-center">
          <div className="text-thai-red text-4xl mb-3">⚠️</div>
          <p className="text-thai-red font-medium">Erreur lors du chargement des extras</p>
          <p className="text-thai-red/70 text-sm mt-2">Veuillez rafraîchir la page</p>
        </CardContent>
      </Card>
    );
  }

  if (!extras || extras.length === 0) {
    return (
      <Card className="border-dashed border-2 border-thai-orange/40 hover:border-thai-orange/60 transition-all duration-500 bg-gradient-to-br from-thai-cream/20 via-white to-thai-orange/5 hover:shadow-xl group">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4 group-hover:animate-bounce">🍜</div>
          <h3 className="text-thai-green font-bold text-lg mb-2">Aucun extra créé</h3>
          <p className="text-thai-green/70 mb-1">Créez vos premiers extras Thai</p>
          <p className="text-sm text-thai-orange/70">Utilisez le bouton &quot;Nouvel Extra&quot; ci-dessus</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        {extras.map((extra) => {
        const isEditing = editingExtra === extra.idextra;
        
        return (
          <Card 
            key={extra.idextra} 
            className="group border-l-4 border-thai-orange hover:border-thai-green transition-all duration-500 hover:shadow-2xl hover:shadow-thai-orange/10 bg-gradient-to-r from-white via-thai-cream/10 to-thai-orange/5 hover:from-thai-cream/20 hover:to-thai-orange/10 transform hover:scale-[1.02] hover:-translate-y-1"
          >
            <CardContent className="p-6">
              {isEditing ? (
                // Mode édition avec design Thai
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-4 pb-4 border-b border-thai-orange/20">
                    <div className="relative group">
                      <img
                        src={editForm.photo_url}
                        alt="Extra"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-thai-orange/30 group-hover:border-thai-orange transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
                        <Edit2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <Badge className="bg-thai-orange/20 text-thai-orange border-thai-orange/30 animate-pulse">
                      Edition Thai
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-thai-green font-semibold flex items-center gap-2">
                        <Package className="w-4 h-4 text-thai-orange" />
                        Nom de l'extra
                      </Label>
                      <Input
                        value={editForm.nom_extra}
                        onChange={(e) => setEditForm(prev => ({ ...prev, nom_extra: e.target.value }))}
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green font-medium"
                        placeholder="Ex: Coca Cola, Thé Thaï..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-thai-green font-semibold flex items-center gap-2">
                        <Euro className="w-4 h-4 text-thai-orange" />
                        Prix (€)
                      </Label>
                      <Input
                        value={editForm.prix}
                        onChange={(e) => setEditForm(prev => ({ ...prev, prix: e.target.value }))}
                        type="number"
                        step="0.01"
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green font-medium"
                        placeholder="25.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-thai-green font-semibold">Description</Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green"
                      placeholder="Description de l'extra..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-thai-green font-semibold">Photo</Label>
                    
                    {/* Aperçu de l&apos;image */}
                    <div className="mb-3">
                      <img
                        src={editForm.photo_url}
                        alt="Aperçu"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-thai-orange/30"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png';
                        }}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        value={editForm.photo_url}
                        onChange={(e) => setEditForm(prev => ({ ...prev, photo_url: e.target.value }))}
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 flex-1"
                        placeholder="https://..."
                        disabled={editUploadState.isUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white disabled:opacity-50"
                        disabled={editUploadState.isUploading}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handleEditImageUpload(file);
                            }
                          };
                          input.click();
                        }}
                      >
                        {editUploadState.isUploading ? (
                          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Image className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* État de l&apos;upload */}
                    {editUploadState.isUploading && (
                      <p className="text-sm text-thai-orange animate-pulse">
                        Upload en cours...
                      </p>
                    )}
                    {editUploadState.error && (
                      <p className="text-sm text-red-500">
                        {editUploadState.error}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-thai-green font-semibold">Description</Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20"
                      rows={2}
                      placeholder="Description de l'extra..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-thai-green hover:bg-thai-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder Thai
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingExtra(null);
                        resetEditUpload();
                      }}
                      className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white transition-all duration-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                // Mode affichage avec design Thai amélioré
                <div className="flex items-center gap-6 animate-slideInUp">
                  <div className="relative group cursor-pointer" onClick={() => handleStartEdit(extra)}>
                    <img
                      src={extra.photo_url || "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"}
                      alt={extra.nom_extra}
                      className="w-20 h-20 rounded-xl object-cover border-3 border-thai-orange/40 group-hover:border-thai-orange shadow-lg group-hover:shadow-thai-orange/20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-thai-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                    <div className="absolute top-1 right-1 w-6 h-6 bg-thai-orange/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Edit2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-thai-green capitalize group-hover:text-thai-orange transition-colors duration-300">
                        {extra.nom_extra}
                      </h4>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-gradient-to-r from-thai-orange to-thai-red text-white shadow-lg animate-pulse">
                          {formatPrice(extra.prix)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-thai-green/70 italic">
                      {extra.description || "Extra Thai authentique"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStartEdit(extra)}
                      variant="outline"
                      size="sm"
                      className="border-thai-orange/50 text-thai-orange hover:bg-thai-orange hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteExtra(extra.idextra, extra.nom_extra)}
                      variant="outline"
                      size="sm"
                      className="border-thai-red/50 text-thai-red hover:bg-thai-red hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
                      title="Supprimer l&apos;extra"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleTransformToPlat(extra)}
                      variant="outline"
                      size="sm"
                      className="border-thai-green/50 text-thai-green hover:bg-thai-green hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
                      title="Transformer en plat menu"
                    >
                      <Utensils className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          );
        })}
      </div>

      <AlertDialog open={!!extraToDelete} onOpenChange={(open) => !open && setExtraToDelete(null)}>
        <AlertDialogContent className="bg-white border-thai-orange/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-thai-red">
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer l&apos;extra &quot;<span className="font-semibold text-thai-orange">{extraToDelete?.name}</span>&quot; ?
              <br />
              <span className="text-sm text-thai-red mt-2 block">
                Cette action est irréversible.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteExtra}
              className="bg-thai-red hover:bg-thai-red/90 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
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
  const [activeTab, setActiveTab] = useState<'plats' | 'extras'>('plats');
  const [showRuptureManager, setShowRuptureManager] = useState<{platId: number; platNom: string} | null>(null);
  const [isEditingPlat, setIsEditingPlat] = useState<Plat | null>(null);
  
  const { data: allPlats, refetch } = usePlats();
  const { data: extras } = useExtras(); // Récupérer les extras de la table extras_db
  const createPlatMutation = useCreatePlat();
  const updatePlatMutation = useUpdatePlat();
  const deleteExtraMutation = useDeleteExtra();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditingPlat) {
      startEditing(isEditingPlat);
    }
  }, [isEditingPlat]);

  // Séparer les plats principaux des extras
  const plats = allPlats?.filter(p => p.idplats !== 0) || [];

  // Utiliser uniquement la nouvelle méthode extras_db
  const totalExtras = extras?.length || 0;

  const currentItems = activeTab === 'plats' ? plats : [];

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

  const handleInlineUpdate = async (platId: number, updateData: Record<string, unknown>) => {
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
            categorie: activeTab === 'extras' ? 'extra' : 'plat_principal'
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'plats' | 'extras')} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-thai-cream/30 border-2 border-thai-orange/20">
              <TabsTrigger 
                value="plats" 
                className="data-[state=active]:bg-thai-orange data-[state=active]:text-white transition-all duration-300 hover:bg-thai-orange/20 font-semibold"
              >
                <Utensils className="w-4 h-4 mr-2" />
                Plats du Menu ({plats.length})
              </TabsTrigger>
              <TabsTrigger
                value="extras"
                className="data-[state=active]:bg-thai-orange data-[state=active]:text-white transition-all duration-300 hover:bg-thai-orange/20 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Extras Thai ({totalExtras})
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
                    Nouveau {activeTab === 'plats' ? 'Plat' : 'Extra Thai'}
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
                <DialogContent className="sm:max-w-[425px] bg-white border border-thai-orange shadow-lg" aria-describedby="edit-dialog-description">
                  <DialogHeader>
                    <DialogTitle className="text-thai-orange">Modifier le plat</DialogTitle>
                  </DialogHeader>
                  <div id="edit-dialog-description" className="sr-only">Formulaire de modification d'un plat existant</div>
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
                      {filtreDisponibilite === 'tous' && `Commencez par créer votre premier ${activeTab === 'plats' ? 'plat' : 'extra Thai'}`}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="extras" className="space-y-4">
              {/* Section Extras Thai (extras_db uniquement) */}
              <div className="mb-8 animate-fadeIn">
                <div className="bg-gradient-to-r from-thai-cream/30 to-thai-orange/10 p-6 rounded-2xl border border-thai-orange/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-thai-green flex items-center gap-3">
                      <div className="p-2 bg-thai-orange/20 rounded-xl">
                        <Package className="w-6 h-6 text-thai-orange" />
                      </div>
                      Extras Thai ({totalExtras})
                    </h3>
                    <div className="flex gap-3">
                      <NewExtraButton />
                    </div>
                  </div>
                  <ExistingExtrasDisplay refetchPlats={refetch} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}