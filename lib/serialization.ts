/**
 * Recursively converts Decimal-like and Date objects within an object or array to strings.
 * This is necessary for JSON serialization when passing data from server to client.
 * @param data The object or array to process.
 * @returns A new object or array with Decimal and Date instances converted to strings.
 */
export function serializeData<T>(data: T): T {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // Handle top-level Date
  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  // Handle Decimal-like objects without importing Prisma
  if (typeof data === 'object' && data !== null &&
      'toString' in data && typeof (data as any).toString === 'function' &&
      (data.constructor?.name === 'Decimal' || 'toFixed' in data)) {
    return (data as any).toString() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item)) as unknown as T;
  }

  const newObj: { [key: string]: any } = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = (data as any)[key];
      // Check for Decimal-like object without importing Prisma
      if (typeof value === 'object' && value !== null &&
          'toString' in value && typeof value.toString === 'function' &&
          (value.constructor?.name === 'Decimal' || 'toFixed' in value)) {
        newObj[key] = value.toString();
      } else if (value instanceof Date) {
        newObj[key] = value.toISOString();
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = serializeData(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj as T;
}

/**
 * Vérifie si une valeur est un objet Decimal-like (sans importer Prisma)
 * Utile pour la détection de type avant conversion
 */
export function isDecimal(value: any): boolean {
  if (!value) return false
  if (typeof value !== 'object') return false
  // Détecte un objet Decimal-like par ses méthodes caractéristiques
  if (value.constructor?.name === 'Decimal') return true
  if ('toFixed' in value && 'toString' in value && typeof value.toString === 'function') {
    return true
  }
  return false
}

/**
 * Convertit une valeur (Decimal-like, string, number) en number safe
 * Gère tous les cas: objets Decimal-like, string, number, null, undefined
 * Fonctionne SANS importer Prisma - compatible Client Components
 *
 * @param value - Valeur à convertir
 * @param defaultValue - Valeur par défaut si conversion échoue (défaut: 0)
 * @returns Number converti
 *
 * @example
 * toSafeNumber(decimalObject) // 24.99 (détecté par ses méthodes)
 * toSafeNumber("24.99") // 24.99
 * toSafeNumber(null) // 0
 * toSafeNumber(undefined, 10) // 10
 */
export function toSafeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue
  if (typeof value === 'number' && !isNaN(value)) return value

  // Détecte un objet Decimal-like et le convertit
  if (typeof value === 'object' && value !== null && typeof value.toString === 'function') {
    const parsed = parseFloat(value.toString())
    return isNaN(parsed) ? defaultValue : parsed
  }

  // Fallback pour string ou autres types
  const parsed = parseFloat(String(value))
  return isNaN(parsed) ? defaultValue : parsed
}