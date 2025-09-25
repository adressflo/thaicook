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
      // 3. Convertir l'image en base64 pour persistence
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64Url = e.target?.result as string;

        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          url: base64Url
        }));

        onSuccess(base64Url);

        toast({
          title: "Image chargée",
          description: "Image sélectionnée avec succès",
          variant: "default"
        });
      };

      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Erreur upload:', error);

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: 'Erreur lors de l\'upload'
      }));

      if (defaultImageUrl) {
        onSuccess(defaultImageUrl);
      }

      toast({
        title: "Erreur",
        description: "Erreur lors de la sélection d'image",
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