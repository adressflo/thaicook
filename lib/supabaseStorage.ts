// lib/supabaseStorage.ts
import { supabase } from './supabase';

// Configuration pour l'upload d'images
export const STORAGE_CONFIG = {
  BUCKET_NAME: 'platphoto',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  QUALITY: 0.8,
  MAX_WIDTH: 800,
  MAX_HEIGHT: 600,
  DEFAULT_EXTRA_IMAGE: 'extra.png'
} as const;

// Fonction pour récupérer l'URL de l'image par défaut des extras
export const getExtraImageUrl = (): string => {
  const { data } = supabase.storage
    .from('plats-images')
    .getPublicUrl(STORAGE_CONFIG.DEFAULT_EXTRA_IMAGE);
  
  return data.publicUrl;
};

// Types pour la gestion des erreurs
export interface UploadResult {
  success: boolean;
  data?: {
    url: string;
    path: string;
  };
  error?: string;
}

// Fonction pour valider le fichier
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Vérifier le type de fichier
  if (!STORAGE_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `Type de fichier non autorisé. Types acceptés: ${STORAGE_CONFIG.ALLOWED_TYPES.join(', ')}`
    };
  }

  // Vérifier la taille du fichier
  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Fichier trop volumineux. Taille maximale: ${STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  return { isValid: true };
};

// Fonction pour générer un nom de fichier unique
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `extra_${timestamp}_${randomString}.${extension}`;
};

// Fonction pour redimensionner une image
export const resizeImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculer les nouvelles dimensions en maintenant le ratio
      let { width, height } = img;
      const maxWidth = STORAGE_CONFIG.MAX_WIDTH;
      const maxHeight = STORAGE_CONFIG.MAX_HEIGHT;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      // Configurer le canvas
      canvas.width = width;
      canvas.height = height;
      
      // Dessiner l'image redimensionnée
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convertir en blob avec compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            resolve(file); // Fallback vers le fichier original
          }
        },
        file.type,
        STORAGE_CONFIG.QUALITY
      );
    };
    
    img.onerror = () => resolve(file); // Fallback vers le fichier original
    img.src = URL.createObjectURL(file);
  });
};

// Fonction principale pour uploader une image vers Supabase Storage
export const uploadImageToStorage = async (file: File, folder: string = 'extras'): Promise<UploadResult> => {
  try {
    // 1. Valider le fichier
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // 2. Redimensionner l'image si nécessaire
    let processedFile = file;
    if (file.size > 1024 * 1024) { // Redimensionner si > 1MB
      processedFile = await resizeImage(file);
    }

    // 3. Générer un nom unique pour le fichier
    const fileName = generateUniqueFileName(processedFile.name);
    const filePath = `${folder}/${fileName}`;

    // 4. Uploader vers Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .upload(filePath, processedFile, {
        cacheControl: '3600', // Cache pendant 1 heure
        upsert: false // Ne pas écraser les fichiers existants
      });

    if (uploadError) {
      console.error('Erreur upload Supabase:', uploadError);
      return {
        success: false,
        error: `Erreur d'upload: ${uploadError.message}`
      };
    }

    // 5. Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return {
        success: false,
        error: 'Impossible de générer l\'URL publique'
      };
    }

    return {
      success: true,
      data: {
        url: urlData.publicUrl,
        path: filePath
      }
    };

  } catch (error) {
    console.error('Erreur inattendue lors de l\'upload:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction pour supprimer une image du storage
export const deleteImageFromStorage = async (filePath: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Erreur suppression Supabase:', error);
      return {
        success: false,
        error: `Erreur de suppression: ${error.message}`
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur inattendue lors de la suppression:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction utilitaire pour extraire le chemin d'une URL Supabase
export const extractPathFromSupabaseUrl = (url: string): string | null => {
  try {
    const match = url.match(/\/storage\/v1\/object\/public\/platphoto\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

// Hook pour la gestion d'état de l'upload
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
}

// Fonction pour créer un aperçu temporaire du fichier
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Fonction pour nettoyer les aperçus temporaires
export const revokeImagePreview = (previewUrl: string) => {
  if (previewUrl && previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl);
  }
};