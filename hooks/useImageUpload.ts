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
      // 3. Upload vers Supabase Storage
      const result = await uploadImageToStorage(file, folder);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Erreur lors de l\'upload');
      }

      // 4. Mise à jour de l'état avec l'URL Supabase
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        url: result.data!.url
      }));

      onSuccess(result.data.url);

      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès sur Supabase",
        variant: "default"
      });

    } catch (error) {
      console.error('Erreur upload:', error);

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'upload'
      }));

      if (defaultImageUrl) {
        onSuccess(defaultImageUrl);
      }

      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'upload d'image",
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