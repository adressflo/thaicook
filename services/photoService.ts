/**
 * PHOTO SERVICE - Utilitaires pour le traitement d'images côté client
 *
 * Les opérations de storage (upload/delete) sont gérées via Server Actions dans app/profil/actions.ts
 * Ce fichier contient uniquement les fonctions de traitement d'image côté client.
 */

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Redimensionne une image côté client
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          } else {
            reject(new Error("Impossible de créer le blob"))
          }
        },
        "image/jpeg",
        quality
      )
    }

    img.onerror = () => reject(new Error("Impossible de charger l'image"))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Recadre une image selon les paramètres de crop
 */
export async function getCroppedImg(
  image: HTMLImageElement,
  crop: any,
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Impossible d'obtenir le contexte 2D")
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = crop.width
  canvas.height = crop.height

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
  )

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          })
          resolve(file)
        }
      },
      "image/jpeg",
      0.9
    )
  })
}
