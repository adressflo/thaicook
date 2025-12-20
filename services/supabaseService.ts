/**
 * SUPABASE CLIENT EXPORT
 *
 * Export du client Supabase singleton pour :
 * - Lectures directes de tables publiques (ruptures, listes courses)
 *
 * ⚠️ IMPORTANT :
 * - Authentification : Better Auth (lib/auth.ts)
 * - CRUD principal : Prisma ORM (app/actions/*.ts)
 * - Storage : MinIO self-hosted (lib/minio.ts)
 * - Realtime : Supprimé (incompatible avec Better Auth)
 */

export { supabase } from "@/lib/supabase"
