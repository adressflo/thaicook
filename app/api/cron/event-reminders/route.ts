/**
 * API Route CRON pour envoyer des rappels d'événements automatiques
 *
 * GET /api/cron/event-reminders
 *
 * Ce endpoint est appelé quotidiennement par Vercel Cron pour :
 * - Trouver les événements dans 24h et 48h
 * - Envoyer des notifications push aux clients concernés
 *
 * Configuration CRON dans vercel.json :
 * {
 *   "crons": [{
 *     "path": "/api/cron/event-reminders",
 *     "schedule": "0 9 * * *"  // Tous les jours à 9h UTC (10h FR été, 11h hiver)
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNotificationToClient, type NotificationPayload } from '@/lib/fcm-admin';
import type { evenements_db, client_db } from '@/generated/prisma/client';

// Type pour événement avec relation client_db
type EventWithClient = evenements_db & {
  client_db: client_db | null
};

/**
 * Sécurité CRON : Vérifier le header Authorization de Vercel Cron
 * https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
 */
function isAuthorizedCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // En développement, permettre les appels sans authentification
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // En production, vérifier le secret CRON
  if (!cronSecret) {
    console.error('❌ CRON_SECRET non défini en production');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  try {
    // ✅ Sécurité : Vérifier l'autorisation CRON
    if (!isAuthorizedCronRequest(request)) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('🔔 CRON Event Reminders - Démarrage');

    const now = new Date();

    // Calculer les plages de temps pour 24h et 48h
    const in24hStart = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23h
    const in24hEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);   // 25h

    const in48hStart = new Date(now.getTime() + 47 * 60 * 60 * 1000); // 47h
    const in48hEnd = new Date(now.getTime() + 49 * 60 * 60 * 1000);   // 49h

    // ✅ Récupérer les événements dans 24h
    const eventsIn24h = await prisma.evenements_db.findMany({
      where: {
        date_evenement: {
          gte: in24hStart,
          lte: in24hEnd,
        },
        // Ne notifier que les événements confirmés
        statut_evenement: {
          in: ['Confirm____Acompte_re_u', 'En_pr_paration'],
        },
      },
      include: {
        client_db: true, // Inclure les infos client
      },
    });

    // ✅ Récupérer les événements dans 48h
    const eventsIn48h = await prisma.evenements_db.findMany({
      where: {
        date_evenement: {
          gte: in48hStart,
          lte: in48hEnd,
        },
        statut_evenement: {
          in: ['Confirm____Acompte_re_u', 'En_pr_paration'],
        },
      },
      include: {
        client_db: true,
      },
    });

    console.log(`📅 Événements trouvés - 24h: ${eventsIn24h.length}, 48h: ${eventsIn48h.length}`);

    let sentCount24h = 0;
    let sentCount48h = 0;
    const errors: string[] = [];

    // ✅ Envoyer notifications pour événements dans 24h
    for (const event of eventsIn24h) {
      if (!event.client_db || !event.contact_client_r_id) {
        console.warn(`⚠️ Événement ${event.idevenements} sans client associé`);
        continue;
      }

      const notification: NotificationPayload = {
        title: '📅 Votre événement est demain !',
        body: `${event.nom_evenement || 'Votre événement'} aura lieu demain${event.date_evenement ? ` à ${new Date(event.date_evenement).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : ''}.`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        tag: `event-reminder-24h-${event.idevenements}`,
        requireInteraction: true,
        data: {
          type: 'event-reminder',
          eventId: String(event.idevenements),
          timeframe: '24h',
          url: `/evenements?id=${event.idevenements}`,
        },
      };

      const result = await sendNotificationToClient(
        Number(event.contact_client_r_id),
        notification
      );

      if (result.success) {
        sentCount24h += result.sentCount;
        console.log(`✅ Notification 24h envoyée pour événement ${event.idevenements}`);
      } else {
        errors.push(`Événement ${event.idevenements}: ${result.error}`);
        console.error(`❌ Erreur notification 24h événement ${event.idevenements}:`, result.error);
      }
    }

    // ✅ Envoyer notifications pour événements dans 48h
    for (const event of eventsIn48h) {
      if (!event.client_db || !event.contact_client_r_id) {
        console.warn(`⚠️ Événement ${event.idevenements} sans client associé`);
        continue;
      }

      const notification: NotificationPayload = {
        title: '📅 Rappel : événement dans 2 jours',
        body: `${event.nom_evenement || 'Votre événement'} aura lieu dans 2 jours${event.date_evenement ? ` le ${new Date(event.date_evenement).toLocaleDateString('fr-FR')}` : ''}.`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        tag: `event-reminder-48h-${event.idevenements}`,
        data: {
          type: 'event-reminder',
          eventId: String(event.idevenements),
          timeframe: '48h',
          url: `/evenements?id=${event.idevenements}`,
        },
      };

      const result = await sendNotificationToClient(
        Number(event.contact_client_r_id),
        notification
      );

      if (result.success) {
        sentCount48h += result.sentCount;
        console.log(`✅ Notification 48h envoyée pour événement ${event.idevenements}`);
      } else {
        errors.push(`Événement ${event.idevenements}: ${result.error}`);
        console.error(`❌ Erreur notification 48h événement ${event.idevenements}:`, result.error);
      }
    }

    const totalSent = sentCount24h + sentCount48h;

    console.log(`🔔 CRON Event Reminders - Terminé : ${totalSent} notifications envoyées`);

    return NextResponse.json({
      success: true,
      summary: {
        eventsIn24h: eventsIn24h.length,
        eventsIn48h: eventsIn48h.length,
        notificationsSent24h: sentCount24h,
        notificationsSent48h: sentCount48h,
        totalSent,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('❌ Erreur CRON Event Reminders:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
