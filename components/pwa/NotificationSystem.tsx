import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ShoppingCart,
  Calendar,
  Users,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  category: 'order' | 'event' | 'system' | 'user';
}

interface NotificationSystemProps {
  onNotificationAction?: (notification: Notification) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  onNotificationAction
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const notifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Nouvelle commande',
        message: 'Commande #1234 reçue de Marie Dubois',
        timestamp: new Date(),
        read: false,
        category: 'order'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Stock faible',
        message: 'Le stock de basilic est en dessous du seuil minimum',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        category: 'system'
      },
      {
        id: '3',
        type: 'success',
        title: 'Événement confirmé',
        message: 'L\'événement "Anniversaire Sophie" a été confirmé pour le 25/01',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
        category: 'event'
      },
      {
        id: '4',
        type: 'success',
        title: 'Paiement reçu',
        message: 'Paiement de 156€ reçu pour la commande #1230',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: true,
        category: 'order'
      }
    ];
    
    setNotifications(notifications);
  }, []);

  useEffect(() => {
    // Calculer le nombre de notifications non lues
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Simuler la réception de nouvelles notifications en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% de chance d'avoir une nouvelle notification
        const sampleNotificationTemplates = [
          { type: 'success' as const, title: 'Commande confirmée', message: 'Nouvelle commande reçue et confirmée' },
          { type: 'warning' as const, title: 'Stock faible', message: 'Certains ingrédients arrivent à épuisement' },
          { type: 'info' as const, title: 'Nouveau client', message: 'Un nouveau client s\'est inscrit' }
        ];
        
        const randomTemplate = sampleNotificationTemplates[Math.floor(Math.random() * 3)];
        const categories: Array<'order' | 'event' | 'system' | 'user'> = ['order', 'event', 'system', 'user'];
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomTemplate.type,
          title: randomTemplate.title,
          message: randomTemplate.message,
          timestamp: new Date(),
          read: false,
          category: categories[Math.floor(Math.random() * 4)]
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Garder max 50 notifications
      }
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return 'À l\'instant';
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      onNotificationAction?.(notification);
    }
  };

  return (
    <>
      {/* Bouton de notification flottant */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-thai-orange hover:bg-thai-orange/90 text-white rounded-full w-12 h-12 p-0"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Panel de notifications */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-50 w-80 max-h-96">
          <Card className="border-thai-orange/20 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-thai-green flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={markAllAsRead}
                      className="text-thai-orange hover:text-thai-orange/80"
                    >
                      Tout marquer lu
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3 border-b cursor-pointer hover:bg-thai-cream/50 transition-colors ${
                          !notification.read ? 'bg-thai-cream/30' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(notification.category)}
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium text-sm text-thai-green ${
                                !notification.read ? 'font-semibold' : ''
                              }`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-thai-orange rounded-full mt-2" />
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay pour fermer en cliquant à l'extérieur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default NotificationSystem;