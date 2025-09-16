'use client';

import { useEffect, useCallback } from 'react';
import { useNotifications, useNotificationActions, type Notification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Types pour les notifications Supabase (à créer dans la DB plus tard)
interface SupabaseNotification {
  id: string;
  user_id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  category: 'order' | 'event' | 'system' | 'promotion' | 'cart';
  action_url?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

// Hook pour synchroniser les notifications avec Supabase
export const useSupabaseNotifications = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const {
    notifyOrderConfirmed,
    notifyOrderReady,
    notifyEventConfirmed,
    notifyPromotion,
    notifySystem
  } = useNotificationActions();

  // Charger les notifications depuis Supabase (à implémenter plus tard)
  const loadNotifications = useCallback(async () => {
    if (!currentUser) return;

    try {
      // TODO: Activer quand la table 'notifications' sera créée dans Supabase
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', currentUser.uid)
      //   .order('created_at', { ascending: false });

      // if (error) {
      //   // Table doesn't exist yet - this is expected during development
      //   if (process.env.NODE_ENV === 'development') {
      //     console.warn('Notifications table not found - using local context only');
      //   }
      //   return;
      // }

      // Table doesn't exist yet - using local context only
      if (process.env.NODE_ENV === 'development') {
        console.warn('Notifications table not found - using local context only');
      }
      return;

      // TODO: Réactiver quand la table 'notifications' sera créée
      // Convertir et ajouter les notifications
      // data?.forEach((supabaseNotification: any) => {
      //   const notification: Notification = {
      //     id: supabaseNotification.id,
      //     type: supabaseNotification.type,
      //     title: supabaseNotification.title,
      //     message: supabaseNotification.message,
      //     category: supabaseNotification.category,
      //     actionUrl: supabaseNotification.action_url,
      //     read: supabaseNotification.read,
      //     timestamp: new Date(supabaseNotification.created_at),
      //     userId: supabaseNotification.user_id
      //   };
      //   addNotification(notification);
      // });
    } catch (error) {
      // Silent fail - notifications are not critical for app functionality
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    }
  }, [currentUser, addNotification]);

  // Sauvegarder une notification dans Supabase (à implémenter plus tard)
  const saveNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    if (!currentUser) return;

    try {
      // TODO: Implémenter la sauvegarde dans Supabase
      // const { error } = await supabase
      //   .from('notifications')
      //   .insert({
      //     user_id: currentUser.uid,
      //     type: notification.type,
      //     title: notification.title,
      //     message: notification.message,
      //     category: notification.category,
      //     action_url: notification.actionUrl,
      //     read: notification.read
      //   });

      // if (error) {
      //   console.error('Erreur lors de la sauvegarde de la notification:', error);
      // }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la notification:', error);
    }
  }, [currentUser]);

  // Marquer comme lu dans Supabase (à implémenter plus tard)
  const markAsReadInSupabase = useCallback(async (notificationId: string) => {
    try {
      // TODO: Implémenter la mise à jour dans Supabase
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ read: true, updated_at: new Date().toISOString() })
      //   .eq('id', notificationId);

      // if (error) {
      //   console.error('Erreur lors de la mise à jour de la notification:', error);
      // }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
    }
  }, []);

  // Supprimer de Supabase (à implémenter plus tard)
  const deleteFromSupabase = useCallback(async (notificationId: string) => {
    try {
      // TODO: Implémenter la suppression dans Supabase
      // const { error } = await supabase
      //   .from('notifications')
      //   .delete()
      //   .eq('id', notificationId);

      // if (error) {
      //   console.error('Erreur lors de la suppression de la notification:', error);
      // }
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  }, []);

  // Écouter les changements en temps réel (à implémenter plus tard)
  useEffect(() => {
    if (!currentUser) return;

    // TODO: Implémenter les subscriptions Supabase en temps réel
    // const subscription = supabase
    //   .channel(`notifications:user_id=eq.${currentUser.uid}`)
    //   .on('postgres_changes', 
    //     { 
    //       event: 'INSERT', 
    //       schema: 'public', 
    //       table: 'notifications',
    //       filter: `user_id=eq.${currentUser.uid}`
    //     }, 
    //     (payload) => {
    //       const newNotification = payload.new as SupabaseNotification;
    //       const notification: Notification = {
    //         id: newNotification.id,
    //         type: newNotification.type,
    //         title: newNotification.title,
    //         message: newNotification.message,
    //         category: newNotification.category,
    //         actionUrl: newNotification.action_url,
    //         read: newNotification.read,
    //         timestamp: new Date(newNotification.created_at),
    //         userId: newNotification.user_id
    //       };
    //       addNotification(notification);
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(subscription);
    // };
  }, [currentUser, addNotification]);

  // Fonctions utilitaires pour déclencher des notifications spécifiques
  const triggerOrderNotifications = useCallback(async (orderId: string, status: string) => {
    switch (status) {
      case 'confirmed':
        notifyOrderConfirmed(orderId);
        break;
      case 'ready':
        notifyOrderReady(orderId);
        break;
      default:
        break;
    }
  }, [notifyOrderConfirmed, notifyOrderReady]);

  const triggerEventNotifications = useCallback(async (eventName: string, date: string, status: string) => {
    switch (status) {
      case 'confirmed':
        notifyEventConfirmed(eventName, date);
        break;
      default:
        break;
    }
  }, [notifyEventConfirmed]);

  const triggerPromotionNotification = useCallback(async (title: string, message: string) => {
    notifyPromotion(title, message);
  }, [notifyPromotion]);

  const triggerSystemNotification = useCallback(async (title: string, message: string, actionUrl?: string) => {
    notifySystem(title, message, actionUrl);
  }, [notifySystem]);

  return {
    loadNotifications,
    saveNotification,
    markAsReadInSupabase,
    deleteFromSupabase,
    triggerOrderNotifications,
    triggerEventNotifications,
    triggerPromotionNotification,
    triggerSystemNotification
  };
};

// Hook pour intégrer les notifications avec les actions existantes
export const useIntegratedNotifications = () => {
  const {
    triggerOrderNotifications,
    triggerEventNotifications,
    triggerPromotionNotification,
    triggerSystemNotification
  } = useSupabaseNotifications();

  // Intégrations avec les actions existantes de l'app
  const onOrderStatusChange = useCallback(async (orderId: string, newStatus: string) => {
    await triggerOrderNotifications(orderId, newStatus);
  }, [triggerOrderNotifications]);

  const onEventStatusChange = useCallback(async (eventName: string, date: string, newStatus: string) => {
    await triggerEventNotifications(eventName, date, newStatus);
  }, [triggerEventNotifications]);

  const onNewPromotion = useCallback(async (title: string, message: string) => {
    await triggerPromotionNotification(title, message);
  }, [triggerPromotionNotification]);

  const onSystemUpdate = useCallback(async (title: string, message: string, actionUrl?: string) => {
    await triggerSystemNotification(title, message, actionUrl);
  }, [triggerSystemNotification]);

  return {
    onOrderStatusChange,
    onEventStatusChange,
    onNewPromotion,
    onSystemUpdate
  };
};