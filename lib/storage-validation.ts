// lib/storage-validation.ts
// Utilitaires de validation pour l'upload d'images (indépendant du provider)

// Configuration pour l'upload d'images
export const STORAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
  QUALITY: 0.8,
  MAX_WIDTH: 800,
  MAX_HEIGHT: 600,
} as const

// Types pour la gestion de l'upload
export interface UploadResult {
  success: boolean
  data?: {
    url: string
    path: string
  }
  error?: string
}

// État de l'upload
export interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  url: string | null
}

// Fonction pour valider le fichier
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Vérifier le type de fichier
  if (!STORAGE_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `Type de fichier non autorisé. Types acceptés: ${STORAGE_CONFIG.ALLOWED_TYPES.join(", ")}`,
    }
  }

  // Vérifier la taille du fichier
  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Fichier trop volumineux. Taille maximale: ${STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  }

  return { isValid: true }
}

// Fonction pour générer un nom de fichier unique
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = new Date().getTime()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split(".").pop()?.toLowerCase() || "jpg"
  return `${timestamp}_${randomString}.${extension}`
}

// Fonction pour créer un aperçu temporaire du fichier
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

// Fonction pour nettoyer les aperçus temporaires
export const revokeImagePreview = (previewUrl: string) => {
  if (previewUrl && previewUrl.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl)
  }
}
