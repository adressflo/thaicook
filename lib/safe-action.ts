import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * This is our public action client.
 * It can be used to create actions that don't require authentication.
 */
export const action = createSafeActionClient();

/**
 * Authenticated action client.
 * Requires user to be logged in via Better Auth.
 *
 * Usage:
 * ```ts
 * export const updateProfile = authAction
 *   .schema(UpdateProfileSchema)
 *   .action(async ({ parsedInput, ctx }) => {
 *     // ctx.userId and ctx.userEmail are available
 *     await prisma.client_db.update({
 *       where: { auth_user_id: ctx.userId },
 *       data: parsedInput
 *     });
 *   });
 * ```
 */
export const authAction = createSafeActionClient().use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Non autorisé - Connexion requise");
  }

  return next({
    ctx: {
      userId: session.user.id,
      userEmail: session.user.email
    }
  });
});
