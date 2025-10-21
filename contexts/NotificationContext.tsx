'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  category: 'order' | 'event' | 'system' | 'promotion' | 'cart';
  userId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'userId'>) => void;
  markAsRead: (notificationId: string) => void;
  markAsUnread: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  getNotificationsByCategory: (category: Notification['category']) => Notification[];
  getUnreadNotifications: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { panier } = useCart();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialiser avec des notifications d'exemple
  useEffect(() => {
    if (currentUser) {
      const initialNotifications: Notification[] = [
        {
          id: 'welcome-1',
          type: 'info',
          title: 'Bienvenue chez ChanthanaThaiCook !',
          message: 'Découvrez nos spécialités thaïlandaises authentiques et nos promotions exclusives.',
          timestamp: new Date(),
          read: false,
          category: 'system',
          actionUrl: '/commander',
          userId: currentUser.id
        },
        {
          id: 'promo-weekend',
          type: 'info',
          title: 'Promotion weekend',
          message: 'Profitez de -15% sur tous nos plats principaux ce weekend !',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // Il y a 1h
          read: false,
          category: 'promotion',
          actionUrl: '/commander',
          userId: currentUser.id
        },
        {
          id: 'order-ready-demo',
          type: 'success',
          title: 'Commande prête !',
          message: 'Votre dernière commande est prête à être récupérée au restaurant.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2h
          read: true,
          category: 'order',
          actionUrl: '/historique',
          userId: currentUser.id
        }
      ];
      
      setNotifications(initialNotifications);
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  // Notification automatique pour le panier
  useEffect(() => {
    if (!currentUser) return;

    const hasUnvalidatedCart = panier.length > 0;
    
    setNotifications(prev => {
      const cartNotificationExists = prev.some(n => n.id === 'cart-pending');
      
      if (hasUnvalidatedCart && !cartNotificationExists) {
        // Ajouter la notification de panier
        const cartNotification: Notification = {
          id: 'cart-pending',
          type: 'warning',
          title: 'Panier en attente',
          message: `Vous avez ${panier.reduce((total, item) => total + item.quantite, 0)} plat${panier.reduce((total, item) => total + item.quantite, 0) > 1 ? 's' : ''} en attente de validation dans votre panier`,
          timestamp: new Date(),
          read: false,
          category: 'cart',
          actionUrl: '/panier',
          userId: currentUser.id
        };
        return [cartNotification, ...prev];
      } else if (!hasUnvalidatedCart && cartNotificationExists) {
        // Supprimer la notification de panier
        return prev.filter(n => n.id !== 'cart-pending');
      } else if (hasUnvalidatedCart && cartNotificationExists) {
        // Mettre à jour le message de la notification existante
        return prev.map(n => 
          n.id === 'cart-pending' 
            ? {
                ...n,
                message: `Vous avez ${panier.reduce((total, item) => total + item.quantite, 0)} plat${panier.reduce((total, item) => total + item.quantite, 0) > 1 ? 's' : ''} en attente de validation dans votre panier`,
                timestamp: new Date()
              }
            : n
        );
      }
      return prev;
    });
  }, [panier, currentUser]);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  // Actions sur les notifications
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'userId'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: currentUser?.id || 'anonymous'
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Garder max 100 notifications
  }, [currentUser]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  const markAsUnread = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: false } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByCategory = useCallback((category: Notification['category']) => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  // Simuler des notifications en temps réel (à remplacer par Supabase subscriptions)
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      // 20% de chance d'avoir une nouvelle notification toutes les 2 minutes
      if (Math.random() < 0.2) {
        const sampleNotifications = [
          {
            type: 'success' as const,
            title: 'Commande confirmée',
            message: 'Votre nouvelle commande a été confirmée et sera prête bientôt',
            category: 'order' as const,
            actionUrl: '/suivi'
          },
          {
            type: 'info' as const,
            title: 'Nouveau plat disponible',
            message: 'Découvrez notre nouveau plat : Pad Thai aux crevettes royales',
            category: 'system' as const,
            actionUrl: '/commander'
          },
          {
            type: 'warning' as const,
            title: 'Événement à confirmer',
            message: 'N\'oubliez pas de confirmer votre prochain événement',
            category: 'event' as const,
            actionUrl: '/evenements'
          }
        ];

        const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
        
        addNotification({
          ...randomNotification,
          read: false
        });
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [currentUser, addNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getNotificationsByCategory,
    getUnreadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Hook pour ajouter facilement des notifications spécifiques
export const useNotificationActions = () => {
  const { addNotification } = useNotifications();

  return {
    notifyOrderConfirmed: (orderId: string) => {
      addNotification({
        type: 'success',
        title: 'Commande confirmée',
        message: `Votre commande #${orderId} a été confirmée et sera prête bientôt`,
        category: 'order',
        actionUrl: '/suivi',
        read: false
      });
    },

    notifyOrderReady: (orderId: string) => {
      addNotification({
        type: 'success',
        title: 'Commande prête !',
        message: `Votre commande #${orderId} est prête à être récupérée`,
        category: 'order',
        actionUrl: '/historique',
        read: false
      });
    },

    notifyEventConfirmed: (eventName: string, date: string) => {
      addNotification({
        type: 'success',
        title: 'Événement confirmé',
        message: `Votre événement "${eventName}" a été confirmé pour le ${date}`,
        category: 'event',
        actionUrl: '/evenements',
        read: false
      });
    },

    notifyPromotion: (title: string, message: string) => {
      addNotification({
        type: 'info',
        title,
        message,
        category: 'promotion',
        actionUrl: '/commander',
        read: false
      });
    },

    notifySystem: (title: string, message: string, actionUrl?: string) => {
      addNotification({
        type: 'info',
        title,
        message,
        category: 'system',
        actionUrl,
        read: false
      });
    }
  };
};