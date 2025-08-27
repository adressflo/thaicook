import { supabase } from '@/lib/supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadProfilePhoto(
  file: File,
  userId: string
): Promise<UploadResult> {
  try {
    const fileName = `profile-${userId}-${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Erreur upload:', error);
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Erreur upload:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

export async function deleteProfilePhoto(userId: string): Promise<boolean> {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from('profile-photos')
      .list('', {
        search: `profile-${userId}`,
      });

    if (listError) {
      console.error('Erreur liste fichiers:', listError);
      return false;
    }

    if (files.length > 0) {
      const fileNames = files.map(f => f.name);
      const { error: deleteError } = await supabase.storage
        .from('profile-photos')
        .remove(fileNames);

      if (deleteError) {
        console.error('Erreur suppression:', deleteError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erreur suppression:', error);
    return false;
  }
}

export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
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

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Impossible de créer le blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error("Impossible de charger l'image"));
    img.src = URL.createObjectURL(file);
  });
}

export async function getCroppedImg(
  image: HTMLImageElement,
  crop: any,
  fileName: string
): Promise<File> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error("Impossible d'obtenir le contexte 2D");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise(resolve => {
    canvas.toBlob(
      blob => {
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
}
