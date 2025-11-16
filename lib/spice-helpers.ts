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

  if (lowerText.includes("très épicé") || lowerText.includes("🔥🔥🔥")) {
    return 3;
  }

  if (lowerText.includes("épicé") && !lowerText.includes("un peu") && !lowerText.includes("très")) {
    return 2;
  }

  if (lowerText.includes("un peu") || lowerText.includes("🔥") && !lowerText.includes("🔥🔥")) {
    return 1;
  }

  return 0;
}

/**
 * Convertit un niveau numérique en texte avec emojis
 * @param level - Niveau numérique (0-3)
 * @returns Texte formaté avec emojis
 */
export function spiceLevelToText(level: number): string {
  switch (level) {
    case 1:
      return "Un peu épicé 🔥";
    case 2:
      return "Épicé 🔥🔥";
    case 3:
      return "Très épicé 🔥🔥🔥";
    default:
      return "Non épicé 🍃";
  }
}

/**
 * Génère les emojis de niveau épicé
 * @param level - Niveau numérique (0-3)
 * @returns Emojis correspondants
 */
export function getSpiceEmojis(level: number): string {
  if (level === 0) return "🍃";
  return "🔥".repeat(Math.min(level, 3));
}
