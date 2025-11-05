/**
 * Firebase Cloud Messaging - Server Side (Firebase Admin SDK)
 *
 * Ce fichier gère l'envoi de notifications push depuis le serveur Next.js
 * vers les devices clients via Firebase Cloud Messaging.
 *
 * IMPORTANT: Nécessite une clé de service Firebase Admin
 * Pour obtenir la clé de service:
 * 1. Console Firebase → Paramètres du projet (⚙️) → Comptes de service
 * 2. Cliquer sur "Générer une nouvelle clé privée"
 * 3. Télécharger le fichier JSON
 * 4. Ajouter les variables d'environnement dans .env:
 *    FIREBASE_ADMIN_PROJECT_ID=xxx
 *    FIREBASE_ADMIN_CLIENT_EMAIL=xxx
 *    FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 */

import * as admin from 'firebase-admin';

// Singleton pour éviter de réinitialiser Firebase Admin à chaque requête
let firebaseAdminApp: admin.app.App | null = null;

/**
 * Initialise Firebase Admin SDK (une seule fois)
 */
function initializeFirebaseAdmin(): admin.app.App {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  try {
    // Vérifier que les variables d'environnement existent
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.error('❌ Variables Firebase Admin manquantes dans .env');
      throw new Error(
        'Firebase Admin credentials missing. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in .env'
      );
    }

    // Remplacer les \\n par de vrais retours à la ligne
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    // Initialiser Firebase Admin
    firebaseAdminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });

    console.log('✅ Firebase Admin SDK initialisé');
    return firebaseAdminApp;
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase Admin:', error);
    throw error;
  }
}

/**
 * Récupère l'instance Firebase Messaging (Admin)
 */
function getMessagingInstance(): admin.messaging.Messaging {
  const app = initializeFirebaseAdmin();
  return admin.messaging(app);
}

// Types pour les notifications
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, string>; // Firebase n'accepte que des strings dans data
  tag?: string;
  requireInteraction?: boolean;
}

export interface SendNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envoie une notification à un seul token FCM
 *
 * @param token Token FCM du destinataire
 * @param notification Payload de la notification
 * @returns Résultat de l'envoi
 */
export async function sendNotificationToToken(
  token: string,
  notification: NotificationPayload
): Promise<SendNotificationResult> {
  try {
    const messaging = getMessagingInstance();

    // Construire le message Firebase
    const message: admin.messaging.Message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.icon,
      },
      data: notification.data || {},
      webpush: notification.icon || notification.badge || notification.tag || notification.requireInteraction
        ? {
            notification: {
              icon: notification.icon || '/icons/icon-192x192.png',
              badge: notification.badge || '/icons/icon-72x72.png',
              tag: notification.tag || 'default',
              requireInteraction: notification.requireInteraction || false,
              vibrate: [200, 100, 200],
            },
          }
        : undefined,
    };

    // Envoyer
    const messageId = await messaging.send(message);

    console.log('✅ Notification envoyée:', {
      messageId,
      tokenPreview: token.substring(0, 20) + '...',
    });

    return {
      success: true,
      messageId,
    };
  } catch (error: unknown) {
    console.error('❌ Erreur envoi notification:', error);

    // Détecter les erreurs connues
    let errorMessage = 'Erreur inconnue';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Cas spécifiques Firebase
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === 'messaging/invalid-registration-token' ||
          firebaseError.code === 'messaging/registration-token-not-registered') {
        errorMessage = 'Token invalide ou expiré';
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Envoie une notification à plusieurs tokens FCM (multicast)
 *
 * @param tokens Liste de tokens FCM
 * @param notification Payload de la notification
 * @returns Nombre de succès et d'échecs
 */
export async function sendNotificationToMultipleTokens(
  tokens: string[],
  notification: NotificationPayload
): Promise<{
  successCount: number;
  failureCount: number;
  invalidTokens: string[];
}> {
  if (tokens.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokens: [] };
  }

  try {
    const messaging = getMessagingInstance();

    // Construire le message multicast
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.icon,
      },
      data: notification.data || {},
      webpush: notification.icon || notification.badge || notification.tag || notification.requireInteraction
        ? {
            notification: {
              icon: notification.icon || '/icons/icon-192x192.png',
              badge: notification.badge || '/icons/icon-72x72.png',
              tag: notification.tag || 'default',
              requireInteraction: notification.requireInteraction || false,
              vibrate: [200, 100, 200],
            },
          }
        : undefined,
    };

    // Envoyer
    const response = await messaging.sendEachForMulticast(message);

    // Identifier les tokens invalides
    const invalidTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const error = resp.error;
        if (
          error?.code === 'messaging/invalid-registration-token' ||
          error?.code === 'messaging/registration-token-not-registered'
        ) {
          invalidTokens.push(tokens[idx]);
        }
      }
    });

    console.log('✅ Multicast notification envoyée:', {
      successCount: response.successCount,
      failureCount: response.failureCount,
      totalTokens: tokens.length,
      invalidTokensCount: invalidTokens.length,
    });

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokens,
    };
  } catch (error) {
    console.error('❌ Erreur envoi multicast:', error);
    return {
      successCount: 0,
      failureCount: tokens.length,
      invalidTokens: [],
    };
  }
}

/**
 * Envoie une notification à un client spécifique (tous ses devices actifs)
 *
 * @param clientId ID du client dans client_db
 * @param notification Payload de la notification
 * @returns Résultat de l'envoi
 */
export async function sendNotificationToClient(
  clientId: number,
  notification: NotificationPayload
): Promise<{
  success: boolean;
  sentCount: number;
  error?: string;
}> {
  try {
    // Importer Prisma pour récupérer les tokens
    const { prisma } = await import('@/lib/prisma');

    // Récupérer tous les tokens actifs du client
    const tokenRecords = await prisma.notification_tokens.findMany({
      where: {
        client_id: clientId,
        is_active: true,
      },
      select: {
        device_token: true,
      },
    });

    if (tokenRecords.length === 0) {
      console.log(`ℹ️ Aucun token actif pour client ${clientId}`);
      return {
        success: false,
        sentCount: 0,
        error: 'Aucun appareil enregistré pour ce client',
      };
    }

    const tokens = tokenRecords.map((r) => r.device_token);

    // Envoyer multicast
    const result = await sendNotificationToMultipleTokens(tokens, notification);

    // Désactiver les tokens invalides dans la base
    if (result.invalidTokens.length > 0) {
      await prisma.notification_tokens.updateMany({
        where: {
          device_token: {
            in: result.invalidTokens,
          },
        },
        data: {
          is_active: false,
        },
      });

      console.log(`🗑️ ${result.invalidTokens.length} tokens invalides désactivés`);
    }

    return {
      success: result.successCount > 0,
      sentCount: result.successCount,
    };
  } catch (error) {
    console.error('❌ Erreur sendNotificationToClient:', error);
    return {
      success: false,
      sentCount: 0,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
