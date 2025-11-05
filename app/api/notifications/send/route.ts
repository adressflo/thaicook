/**
 * API Route pour envoyer des notifications push via Firebase Cloud Messaging
 *
 * POST /api/notifications/send
 *
 * Body JSON:
 * {
 *   "clientId": number,
 *   "notification": {
 *     "title": string,
 *     "body": string,
 *     "icon"?: string,
 *     "data"?: Record<string, string>
 *   }
 * }
 *
 * Réponse:
 * {
 *   "success": boolean,
 *   "sentCount": number,
 *   "error"?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendNotificationToClient, type NotificationPayload } from '@/lib/fcm-admin';

// Schema de validation Zod pour la requête
const sendNotificationSchema = z.object({
  clientId: z.number().int().positive('Client ID invalide'),
  notification: z.object({
    title: z.string().min(1, 'Titre requis'),
    body: z.string().min(1, 'Message requis'),
    icon: z.string().optional(),
    badge: z.string().optional(),
    tag: z.string().optional(),
    requireInteraction: z.boolean().optional(),
    data: z.record(z.string(), z.string()).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Parser le body JSON
    const body = await request.json();

    // Valider le schema
    const validation = sendNotificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Validation échouée',
        },
        { status: 400 }
      );
    }

    const { clientId, notification } = validation.data;

    // Envoyer la notification via Firebase Admin
    const result = await sendNotificationToClient(clientId, notification as NotificationPayload);

    if (result.success) {
      return NextResponse.json({
        success: true,
        sentCount: result.sentCount,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          sentCount: 0,
          error: result.error || 'Erreur lors de l\'envoi',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Erreur API /api/notifications/send:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
