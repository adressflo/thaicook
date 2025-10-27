/**
 * SUPABASE CLIENT EXPORT
 *
 * Export du client Supabase singleton pour :
 * - Supabase Realtime (synchronisation live des commandes)
 * - Supabase Storage (upload d'images)
 *
 * ⚠️ IMPORTANT : Toutes les opérations CRUD utilisent Prisma ORM
 * Voir app/actions/* pour les Server Actions (Clients, Plats, Commandes, Extras, Evenements)
 */

export { supabase } from '@/lib/supabase'
