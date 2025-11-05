'use server'

/**
 * ACTION DE TEST - next-safe-action
 *
 * Action simple pour valider que next-safe-action fonctionne correctement.
 * À appeler depuis un composant client pour tester la validation Zod.
 */

import { action, authAction } from '@/lib/safe-action'
import { z } from 'zod'

/**
 * Test action publique (pas d'authentification requise)
 */
export const testPublicAction = action
  .schema(
    z.object({
      name: z.string().min(2, "Nom trop court (min 2 caractères)"),
      age: z.number().int().positive("Âge doit être positif").max(150, "Âge maximum 150"),
    })
  )
  .action(async ({ parsedInput }) => {
    console.log('✅ Test action publique - Input validé:', parsedInput);

    return {
      success: true,
      message: `Bonjour ${parsedInput.name}, vous avez ${parsedInput.age} ans !`,
      timestamp: new Date().toISOString(),
    };
  });

/**
 * Test action authentifiée (Better Auth requis)
 */
export const testAuthAction = authAction
  .schema(
    z.object({
      message: z.string().min(1, "Message requis"),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    console.log('✅ Test action authentifiée - User:', ctx.userId);
    console.log('✅ Test action authentifiée - Input:', parsedInput);

    return {
      success: true,
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      message: parsedInput.message,
      timestamp: new Date().toISOString(),
    };
  });

/**
 * Test validation erreurs
 * Cette action doit échouer si age < 18
 */
export const testValidationErrors = action
  .schema(
    z.object({
      email: z.string().email("Email invalide"),
      age: z.number().int().min(18, "Vous devez avoir au moins 18 ans"),
      terms: z.boolean().refine((val) => val === true, "Vous devez accepter les conditions"),
    })
  )
  .action(async ({ parsedInput }) => {
    return {
      success: true,
      message: "Validation réussie !",
      data: parsedInput,
    };
  });
