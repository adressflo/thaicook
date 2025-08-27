/**
 * Intégration n8n - Webhooks pour automatisation restaurant
 * Contexte: Restaurant emporter uniquement (pas de livraison)
 * Workflow automation pour commandes, notifications et gestion
 */

interface N8nWebhookConfig {
  baseUrl: string;
  authToken?: string;
  enabled: boolean;
}

interface CommandeWebhookPayload {
  orderId: number;
  status: string;
  previousStatus?: string;
  timestamp: string;
  customerEmail?: string;
  customerPhone?: string;
  pickupTime?: string;
  total?: number;
  items?: any[];
  specialInstructions?: string;
  paymentStatus?: string;
  deliveryType?: string;
}

interface NotificationWebhookPayload {
  type: 'new_order' | 'status_change' | 'urgent_order' | 'payment_update';
  orderId: number;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  metadata?: any;
}

// Configuration n8n (à adapter selon l'environnement)
const N8N_CONFIG: N8nWebhookConfig = {
  baseUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook',
  authToken: process.env.N8N_WEBHOOK_TOKEN,
  enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_N8N_ENABLED === 'true'
};

/**
 * Client n8n pour gérer les webhooks
 */
export class N8nWebhookClient {
  private config: N8nWebhookConfig;

  constructor(config?: Partial<N8nWebhookConfig>) {
    this.config = { ...N8N_CONFIG, ...config };
  }

  /**
   * Déclencher webhook générique
   */
  private async triggerWebhook(endpoint: string, payload: any): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('[n8n] Webhook désactivé:', endpoint, payload);
      return true; // Mode développement - simule succès
    }

    try {
      const url = `${this.config.baseUrl}/${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.config.authToken) {
        headers['Authorization'] = `Bearer ${this.config.authToken}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('[n8n] Erreur webhook:', response.status, response.statusText);
        return false;
      }

      console.log('[n8n] Webhook déclenché avec succès:', endpoint);
      return true;
    } catch (error) {
      console.error('[n8n] Erreur réseau webhook:', error);
      return false;
    }
  }

  /**
   * 🆕 Nouvelle commande reçue
   * Déclenche: Email admin + SMS cuisine + Mise à jour dashboard
   */
  async notifyNewOrder(orderData: CommandeWebhookPayload): Promise<boolean> {
    return this.triggerWebhook('commande/nouvelle', {
      ...orderData,
      workflow: 'new_order_notification',
      actions: ['email_admin', 'sms_kitchen', 'update_dashboard'],
      restaurant_mode: 'takeaway_only' // Context important
    });
  }

  /**
   * 🔄 Changement statut commande
   * Déclenche: Email client + Notifications équipe + Mise à jour temps réel
   */
  async notifyStatusChange(orderData: CommandeWebhookPayload): Promise<boolean> {
    const workflowActions = this.getStatusWorkflowActions(orderData.status);

    return this.triggerWebhook('commande/statut-change', {
      ...orderData,
      workflow: 'status_change_automation',
      actions: workflowActions,
      restaurant_mode: 'takeaway_only'
    });
  }

  /**
   * 💰 Changement statut paiement
   * Déclenche: Confirmation paiement + Notification comptabilité
   */
  async notifyPaymentUpdate(orderData: CommandeWebhookPayload): Promise<boolean> {
    return this.triggerWebhook('commande/paiement', {
      ...orderData,
      workflow: 'payment_update',
      actions: ['payment_confirmation', 'accounting_update'],
      restaurant_mode: 'takeaway_only'
    });
  }

  /**
   * ⚠️ Commande urgente (retrait < 2h)
   * Déclenche: Alerte équipe + Priorisation cuisine
   */
  async notifyUrgentOrder(orderData: CommandeWebhookPayload): Promise<boolean> {
    return this.triggerWebhook('commande/urgent', {
      ...orderData,
      workflow: 'urgent_order_alert',
      actions: ['team_alert', 'kitchen_priority', 'manager_notification'],
      restaurant_mode: 'takeaway_only',
      urgency_level: 'high'
    });
  }

  /**
   * 📊 Mise à jour statistiques
   * Déclenche: Analytics + Rapports + Dashboard mise à jour
   */
  async updateStatistics(statsData: any): Promise<boolean> {
    return this.triggerWebhook('stats/update', {
      ...statsData,
      workflow: 'statistics_update',
      actions: ['update_analytics', 'generate_reports', 'refresh_dashboard'],
      timestamp: new Date().toISOString(),
      restaurant_mode: 'takeaway_only'
    });
  }

  /**
   * 🎯 Actions contextuelles selon statut
   */
  private getStatusWorkflowActions(status: string): string[] {
    switch (status) {
      case 'Confirmée':
        return ['email_client_confirmation', 'kitchen_notification', 'prep_scheduler'];
      
      case 'En préparation':
        return ['kitchen_started', 'prep_timer', 'client_notification_started'];
      
      case 'Prête à récupérer':
        return ['client_ready_sms', 'client_ready_email', 'pickup_notification'];
      
      case 'Récupérée':
        return ['order_completed', 'customer_feedback_request', 'cleanup_notification'];
      
      case 'Annulée':
        return ['cancellation_notification', 'refund_process', 'inventory_restore'];
      
      default:
        return ['status_log'];
    }
  }

  /**
   * 🔗 Webhook de test pour vérifier la connexion
   */
  async testConnection(): Promise<boolean> {
    return this.triggerWebhook('test', {
      message: 'Test connexion n8n depuis APPCHANTHANA',
      timestamp: new Date().toISOString(),
      restaurant_mode: 'takeaway_only'
    });
  }
}

/**
 * Instance globale du client n8n
 */
export const n8nClient = new N8nWebhookClient();

/**
 * 🚀 Fonctions utilitaires pour l'interface admin
 */

/**
 * Déclencher notification nouvelle commande avec données complètes
 */
export async function triggerNewOrderWorkflow(commande: any): Promise<void> {
  try {
    const payload: CommandeWebhookPayload = {
      orderId: commande.idcommande,
      status: commande.statut_commande,
      timestamp: new Date().toISOString(),
      customerEmail: commande.client?.email,
      customerPhone: commande.client?.numero_de_telephone,
      pickupTime: commande.date_et_heure_de_retrait_souhaitees,
      specialInstructions: commande.demande_special_pour_la_commande,
      paymentStatus: commande.statut_paiement,
      deliveryType: commande.type_livraison
    };

    await n8nClient.notifyNewOrder(payload);
  } catch (error) {
    console.error('Erreur déclenchement workflow nouvelle commande:', error);
  }
}

/**
 * Déclencher workflow changement de statut
 */
export async function triggerStatusChangeWorkflow(
  commande: any, 
  newStatus: string, 
  previousStatus?: string
): Promise<void> {
  try {
    const payload: CommandeWebhookPayload = {
      orderId: commande.idcommande,
      status: newStatus,
      previousStatus,
      timestamp: new Date().toISOString(),
      customerEmail: commande.client?.email,
      customerPhone: commande.client?.numero_de_telephone,
      pickupTime: commande.date_et_heure_de_retrait_souhaitees,
      paymentStatus: commande.statut_paiement,
      deliveryType: commande.type_livraison
    };

    await n8nClient.notifyStatusChange(payload);

    // Déclencher alerte urgente si nécessaire
    if (isUrgentOrder(commande)) {
      await n8nClient.notifyUrgentOrder(payload);
    }
  } catch (error) {
    console.error('Erreur déclenchement workflow changement statut:', error);
  }
}

/**
 * Déclencher workflow mise à jour paiement
 */
export async function triggerPaymentUpdateWorkflow(
  commande: any, 
  newPaymentStatus: string
): Promise<void> {
  try {
    const payload: CommandeWebhookPayload = {
      orderId: commande.idcommande,
      status: commande.statut_commande,
      timestamp: new Date().toISOString(),
      paymentStatus: newPaymentStatus,
      customerEmail: commande.client?.email,
      deliveryType: commande.type_livraison
    };

    await n8nClient.notifyPaymentUpdate(payload);
  } catch (error) {
    console.error('Erreur déclenchement workflow paiement:', error);
  }
}

/**
 * Vérifier si une commande est urgente
 */
function isUrgentOrder(commande: any): boolean {
  if (!commande.date_et_heure_de_retrait_souhaitees) return false;
  
  const retraitDate = new Date(commande.date_et_heure_de_retrait_souhaitees);
  const maintenant = new Date();
  const dansDeuzeHeures = new Date(maintenant.getTime() + 2 * 60 * 60 * 1000);
  
  return retraitDate <= dansDeuzeHeures && 
         retraitDate >= maintenant && 
         !['Récupérée', 'Annulée'].includes(commande.statut_commande || '');
}

/**
 * 🎯 Configuration pour tests et développement
 */
export function configureN8nForDevelopment(): void {
  console.log('🛠️ Configuration n8n mode développement:');
  console.log('- Webhooks simulés localement');
  console.log('- Logs détaillés activés');
  console.log('- Mode restaurant: emporter uniquement');
  console.log('- Base URL:', N8N_CONFIG.baseUrl);
  console.log('- Activé:', N8N_CONFIG.enabled);
}

/**
 * 📊 Statistiques d'utilisation des webhooks
 */
export class N8nWebhookStats {
  private static instance: N8nWebhookStats;
  private stats = {
    total_calls: 0,
    successful_calls: 0,
    failed_calls: 0,
    last_call: '',
    endpoints_used: {} as Record<string, number>
  };

  static getInstance(): N8nWebhookStats {
    if (!N8nWebhookStats.instance) {
      N8nWebhookStats.instance = new N8nWebhookStats();
    }
    return N8nWebhookStats.instance;
  }

  recordCall(endpoint: string, success: boolean): void {
    this.stats.total_calls++;
    this.stats.last_call = new Date().toISOString();
    
    if (success) {
      this.stats.successful_calls++;
    } else {
      this.stats.failed_calls++;
    }

    this.stats.endpoints_used[endpoint] = (this.stats.endpoints_used[endpoint] || 0) + 1;
  }

  getStats() {
    return { ...this.stats };
  }

  reset(): void {
    this.stats = {
      total_calls: 0,
      successful_calls: 0,
      failed_calls: 0,
      last_call: '',
      endpoints_used: {}
    };
  }
}

export const webhookStats = N8nWebhookStats.getInstance();