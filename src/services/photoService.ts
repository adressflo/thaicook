import { supabase } from './supabaseService';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadProfilePhoto = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  try {
    // Valider le fichier
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Le fichier doit être une image' };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'L\'image ne doit pas dépasser 5MB' };
    }

    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `profile-${userId}-${timestamp}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log('Upload vers:', filePath);

    // Supprimer l'ancienne photo si elle existe
    try {
      const { data: existingFiles } = await supabase.storage
        .from('profile-photos')
        .list(userId);

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(file => `${userId}/${file.name}`);
        console.log('Suppression des anciens fichiers:', filesToDelete);
        await supabase.storage
          .from('profile-photos')
          .remove(filesToDelete);
      }
    } catch (cleanupError) {
      console.warn('Erreur lors du nettoyage:', cleanupError);
      // Ne pas faire échouer l'upload pour cette erreur
    }

    // Uploader la nouvelle photo
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error('Erreur upload Supabase:', error);
      return { 
        success: false, 
        error: `Erreur d'upload: ${error.message}` 
      };
    }

    console.log('Upload réussi:', data);

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    console.log('URL publique:', publicUrl);

    return { success: true, url: publicUrl };

  } catch (error) {
    console.error('Erreur générale upload:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload' 
    };
  }
};

export const deleteProfilePhoto = async (userId: string): Promise<boolean> => {
  try {
    console.log('Suppression photos pour userId:', userId);
    
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('profile-photos')
      .list(userId);

    if (listError) {
      console.error('Erreur liste fichiers:', listError);
      return false;
    }

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(file => `${userId}/${file.name}`);
      console.log('Fichiers à supprimer:', filesToDelete);
      
      const { error } = await supabase.storage
        .from('profile-photos')
        .remove(filesToDelete);

      if (error) {
        console.error('Erreur suppression fichiers:', error);
        return false;
      }

      console.log('Suppression réussie');
    } else {
      console.log('Aucun fichier à supprimer');
    }

    return true;
  } catch (error) {
    console.error('Erreur service suppression:', error);
    return false;
  }
};

// Fonction pour redimensionner et compresser l'image
export const resizeImage = (
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Calculer les nouvelles dimensions en gardant les proportions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir en blob puis en file
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Fonction pour rogner l'image selon les paramètres de crop
export const getCroppedImg = (
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  fileName: string = 'cropped.jpg'
): Promise<File> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(file);
        }
      },
      'image/jpeg',
      0.9
    );
  });
};