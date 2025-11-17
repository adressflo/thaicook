/**
 * Helper functions for spice level management
 */

/**
 * Convertit le texte de préférence épicée en niveau numérique (0-3)
 * @param text - Texte de la préférence (ex: "Niveau épicé : Un peu épicé 🔥")
 * @returns Niveau numérique: 0 = Non épicé, 1 = Un peu épicé, 2 = Épicé, 3 = Très épicé
 */
export function spiceTextToLevel(text?: string | null): number {
  if (!text) return 0;

  const lowerText = text.toLowerCase();

  // Vérifier "non épicé" en premier pour éviter les faux positifs
  if (lowerText.includes("non épicé") || lowerText.includes("🍃")) {
    return 0;
  }

  if (lowerText.includes("très épicé") || lowerText.includes("🔥🔥🔥")) {
    return 3;
  }

  if (lowerText.includes("un peu") || (lowerText.includes("🔥") && !lowerText.includes("🔥🔥"))) {
    return 1;
  }

  // "Épicé" sans "un peu" ni "très" ni "non"
  if (lowerText.includes("épicé") && !lowerText.includes("un peu") && !lowerText.includes("très")) {
    return 2;
  }

  return 0;
}

/**
 * Convertit un niveau numérique en texte (sans emojis)
 * @param level - Niveau numérique (0-3)
 * @returns Texte formaté sans emojis
 */
export function spiceLevelToText(level: number): string {
  switch (level) {
    case 1:
      return "Un peu épicé";
    case 2:
      return "Épicé";
    case 3:
      return "Très épicé";
    default:
      return "Non épicé";
  }
}

/**
 * Retourne le nombre de flammes pour un niveau donné
 * Utiliser avec les icônes Lucide (Flame/Leaf)
 * @param level - Niveau numérique (0-3)
 * @returns Nombre de flammes (0 = utiliser Leaf)
 */
export function getSpiceFlameCount(level: number): number {
  return Math.min(Math.max(level, 0), 3);
}
