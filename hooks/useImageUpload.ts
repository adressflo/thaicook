import { useState, useCallback } from 'react';
import {
  UploadState,
  validateImageFile,
  uploadImageToStorage,
  createImagePreview,
  revokeImagePreview
} from '@/lib/supabaseStorage';
import { useToast } from '@/hooks/use-toast';

// Interface pour le retour du hook
interface UseImageUploadReturn {
  uploadState: UploadState;
  uploadFile: (
    file: File,
    onSuccess: (url: string) => void,
    onError?: () => void
  ) => Promise<void>;
  resetUpload: () => void;
}

// Hook personnalisé pour la gestion d'upload d'images
export const useImageUpload = (
  folder: string = 'extras',
  defaultImageUrl?: string
): UseImageUploadReturn => {

  const { toast } = useToast();

  // État de l'upload
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null
  });

  // Fonction pour réinitialiser l'état d'upload
  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null
    });
  }, []);

  // Fonction principale d'upload avec callbacks
  const uploadFile = useCallback(async (
    file: File,
    onSuccess: (url: string) => void,
    onError?: () => void
  ) => {
    // 1. Validation du fichier
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Erreur",
        description: validation.error,
        variant: "destructive"
      });
      onError?.();
      return;
    }

    // 2. Début du processus d'upload
    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      error: null
    }));

    try {
      // 3. Créer un aperçu temporaire
      const previewUrl = createImagePreview(file);

      // 4. Appliquer immédiatement l'aperçu
      onSuccess(previewUrl);

      // 5. Upload vers Supabase Storage
      const result = await uploadImageToStorage(file, folder);

      if (result.success && result.data) {
        // 6. Succès : mettre à jour avec l'URL finale
        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          url: result.data!.url
        }));

        // 7. Appliquer l'URL finale
        onSuccess(result.data.url);

        // 8. Nettoyer l'aperçu temporaire
        revokeImagePreview(previewUrl);

        // 9. Notification de succès
        toast({
          title: "Succès",
          description: "Image uploadée avec succès",
          variant: "default"
        });

      } else {
        // 10. Erreur d'upload
        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          error: result.error || "Erreur d'upload inconnue"
        }));

        // 11. Restaurer l'image par défaut si disponible
        if (defaultImageUrl) {
          onSuccess(defaultImageUrl);
        }

        // 12. Nettoyer l'aperçu temporaire
        revokeImagePreview(previewUrl);

        // 13. Notification d'erreur
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de l'upload",
          variant: "destructive"
        });

        onError?.();
      }

    } catch (error) {
      // 14. Gestion d'erreur inattendue
      console.error('Erreur upload:', error);

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: 'Erreur inattendue lors de l\'upload'
      }));

      // 15. Restaurer l'image par défaut si disponible
      if (defaultImageUrl) {
        onSuccess(defaultImageUrl);
      }

      // 16. Notification d'erreur
      toast({
        title: "Erreur",
        description: "Erreur inattendue lors de l'upload",
        variant: "destructive"
      });

      onError?.();
    }
  }, [folder, defaultImageUrl, toast]);

  return {
    uploadState,
    uploadFile,
    resetUpload
  };
};