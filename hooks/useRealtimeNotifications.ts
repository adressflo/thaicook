'use client'

import { useEffect, useRef } from 'react';
import { supabase } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const lastNotificationTime = useRef<number>(Date.now());

  useEffect(() => {
    // Canal pour les nouvelles commandes
    const commandesChannel = supabase
      .channel('commandes-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'commande_db',
        },
        (payload) => {
          console.log('Nouvelle commande détectée:', payload);
          
          // Éviter les notifications en rafale
          const now = Date.now();
          if (now - lastNotificationTime.current > 5000) { // 5 secondes minimum entre notifications
            toast({
              title: "🎉 Nouvelle commande !",
              description: `Commande #${payload.new.idcommande} reçue`,
              duration: 5000,
            });
            lastNotificationTime.current = now;
          }
          
          // Invalider les caches pour refresh automatique
          queryClient.invalidateQueries({ queryKey: ['commandes'] });
          queryClient.invalidateQueries({ queryKey: ['commandes-stats'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'commande_db',
        },
        (payload) => {
          console.log('Commande mise à jour:', payload);
          
          // Notification seulement pour les changements de statut importants
          const oldStatus = payload.old?.statut_commande;
          const newStatus = payload.new?.statut_commande;
          
          if (oldStatus !== newStatus && newStatus === 'Confirmée') {
            toast({
              title: "✅ Commande confirmée",
              description: `Commande #${payload.new.idcommande} confirmée`,
              duration: 3000,
            });
          }
          
          // Invalider les caches
          queryClient.invalidateQueries({ queryKey: ['commandes'] });
          queryClient.invalidateQueries({ queryKey: ['commande', payload.new.idcommande] });
          queryClient.invalidateQueries({ queryKey: ['commandes-stats'] });
        }
      )
      .subscribe();

    // Canal pour les nouveaux événements
    const evenementsChannel = supabase
      .channel('evenements-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'evenements_db',
        },
        (payload) => {
          console.log('Nouvel événement détecté:', payload);
          
          const now = Date.now();
          if (now - lastNotificationTime.current > 5000) {
            toast({
              title: "🎊 Nouvel événement !",
              description: `Demande d'événement "${payload.new.nom_evenement}" reçue`,
              duration: 5000,
            });
            lastNotificationTime.current = now;
          }
          
          queryClient.invalidateQueries({ queryKey: ['evenements'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commandesChannel);
      supabase.removeChannel(evenementsChannel);
    };
  }, [toast, queryClient]);

  return null; // Ce hook ne retourne rien, il fonctionne en arrière-plan
};

// Hook pour les notifications push (optionnel, pour le futur)
export const useWebPushNotifications = () => {
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  };

  return {
    requestPermission,
    showNotification
  };
};