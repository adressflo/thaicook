// lib/prisma.ts
// Prisma Client configuration for Next.js 15 App Router
// Implements singleton pattern to prevent multiple instances in development
// Updated for Prisma 7 with driver adapter pattern

import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// ============================================
// TYPE EXTENSIONS AND CUSTOM TYPES
// ============================================

// Create Prisma Client with driver adapter (Prisma 7 requirement)
const prismaClientSingleton = () => {
  // Create PostgreSQL adapter with connection string
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  })

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  })

  // ============================================
  // EXTENSIONS - Prisma v5+ replaces middleware with extensions
  // ============================================

  // Note: Extensions will be added here if needed for:
  // - Auto-timestamp updates
  // - Query logging
  // - Soft deletes

  return prisma
}

// ============================================
// GLOBAL SINGLETON PATTERN
// ============================================

// Prevent multiple instances of Prisma Client in development
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
}

export { prisma }

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Gracefully disconnect Prisma Client
 * Useful for serverless cleanup or testing
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

/**
 * Check database connection health
 * @returns true if connected, false otherwise
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

/**
 * Get database statistics
 * Useful for monitoring and debugging
 */
export async function getDatabaseStats() {
  try {
    const [clients, plats, commandes, evenements] = await Promise.all([
      prisma.client_db.count(),
      prisma.plats_db.count(),
      prisma.commande_db.count(),
      prisma.evenements_db.count(),
    ])

    return {
      clients,
      plats,
      commandes,
      evenements,
      total: clients + plats + commandes + evenements,
    }
  } catch (error) {
    console.error("❌ Failed to get database stats:", error)
    return null
  }
}

// ============================================
// ERROR HANDLING UTILITIES
// ============================================

/**
 * Custom Prisma error class
 */
export class PrismaError extends Error {
  constructor(
    message: string,
    public code?: string,
    public meta?: unknown
  ) {
    super(message)
    this.name = "PrismaError"
  }
}

/**
 * Handle Prisma errors with contextual messages
 */
export function handlePrismaError(error: unknown, context: string): never {
  console.error(`❌ Prisma error in ${context}:`, error)

  const prismaError = error as { code?: string; meta?: unknown; message?: string }

  // Unique constraint violation
  if (prismaError?.code === "P2002") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = (prismaError.meta as any)?.target
    throw new PrismaError(
      `Cette donnée existe déjà${target ? ` (${target.join(", ")})` : ""}`,
      prismaError.code,
      prismaError.meta
    )
  }

  // Record not found
  if (prismaError?.code === "P2025") {
    throw new PrismaError("Enregistrement non trouvé", prismaError.code, prismaError.meta)
  }

  // Foreign key constraint violation
  if (prismaError?.code === "P2003") {
    throw new PrismaError(
      "Impossible de supprimer: des données liées existent",
      prismaError.code,
      prismaError.meta
    )
  }

  // Connection error
  if (prismaError?.code === "P1001" || prismaError?.code === "P1002") {
    throw new PrismaError(
      "Erreur de connexion à la base de données",
      prismaError.code,
      prismaError.meta
    )
  }

  // Generic error
  throw new PrismaError(
    prismaError?.message || `Erreur dans ${context}`,
    prismaError?.code,
    prismaError.meta
  )
}

// Export Prisma types for advanced usage
export type { Prisma } from "@/generated/prisma/client"

// Export default for convenience
export default prisma
