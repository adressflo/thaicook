/**
 * Utilitaire pour extraire les paramètres de route de manière sûre avec Next.js 15
 * Évite les erreurs de mutation d'objets read-only
 */

export function extractRouteParam(param: string | string[] | undefined): string | undefined {
  if (!param) return undefined;
  if (Array.isArray(param)) return param[0];
  return param;
}

export function extractRouteParamAsNumber(param: string | string[] | undefined): number | undefined {
  const stringParam = extractRouteParam(param);
  if (!stringParam) return undefined;
  const num = Number(stringParam);
  return isNaN(num) ? undefined : num;
}