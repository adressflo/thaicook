'use client';

import React, { memo, useState, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNotifications, type Notification } from '@/contexts/NotificationContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ShoppingCart,
  Calendar,
  Users,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Home
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppLayout } from '@/components/AppLayout';

export const dynamic = 'force-dynamic';

const NotificationsPage = memo(() => {
  const { currentUser } = useAuth();
  const { panier } = useCart();
  const { notifications, unreadCount, markAsRead, markAsUnread, markAllAsRead, deleteNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtrage des notifications depuis le Context
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = searchTerm === '' || 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'unread' && !notification.read) ||
        (statusFilter === 'read' && notification.read);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [notifications, searchTerm, categoryFilter, statusFilter]);


  // Utilitaires d'affichage
  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-orange-500`} />;
      case 'error':
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    const iconClass = "h-4 w-4 text-thai-orange";
    switch (category) {
      case 'order':
        return <ShoppingCart className={iconClass} />;
      case 'event':
        return <Calendar className={iconClass} />;
      case 'cart':
        return <ShoppingCart className={iconClass} />;
      case 'promotion':
        return <Info className={iconClass} />;
      default:
        return <Settings className={iconClass} />;
    }
  };

  const getCategoryLabel = (category: Notification['category']) => {
    switch (category) {
      case 'order': return 'Commande';
      case 'event': return 'Événement';
      case 'cart': return 'Panier';
      case 'promotion': return 'Promotion';
      case 'system': return 'Système';
      default: return 'Autre';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return timestamp.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
  };

  const filteredUnreadCount = filteredNotifications.filter(n => !n.read).length;
  const totalCount = filteredNotifications.length;

  if (!currentUser) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-thai p-4">
          <Alert className="max-w-md">
            <AlertDescription>
              Veuillez vous{' '}
              <Link href="/profil" className="font-bold underline">
                connecter
              </Link>{' '}
              pour voir vos notifications.
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-6xl space-y-8 animate-fadeIn">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Bell className="h-8 w-8 text-thai-orange" />
              <h1 className="text-4xl font-bold text-thai-green">
                Mes Notifications
              </h1>
            </div>
            <p className="text-thai-green/80 max-w-2xl mx-auto">
              Restez informé de l'état de vos commandes, événements et des dernières nouvelles de ChanthanaThaiCook.
            </p>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-thai-orange/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Bell className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Non lues</p>
                    <p className="text-2xl font-bold text-thai-green">{filteredUnreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-thai-orange/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-thai-orange/10 rounded-lg">
                    <Bell className="h-5 w-5 text-thai-orange" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-thai-green">{totalCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-thai-orange/20">
              <CardContent className="p-4">
                <Button 
                  onClick={markAllAsRead}
                  className="w-full bg-thai-orange hover:bg-thai-orange/90"
                  disabled={filteredUnreadCount === 0}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marquer tout comme lu
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et recherche */}
          <Card className="border-thai-orange/20">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans les notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filtre par catégorie */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="order">Commandes</SelectItem>
                    <SelectItem value="event">Événements</SelectItem>
                    <SelectItem value="cart">Panier</SelectItem>
                    <SelectItem value="promotion">Promotions</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtre par statut */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="unread">Non lues</SelectItem>
                    <SelectItem value="read">Lues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des notifications */}
          <Card className="shadow-xl border-thai-orange/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-thai-green">
                {filteredNotifications.length > 0 ? 
                  `${filteredNotifications.length} notification${filteredNotifications.length > 1 ? 's' : ''}` :
                  'Aucune notification'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length > 0 ? (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border border-gray-100 rounded-lg transition-all hover:shadow-md hover:border-thai-orange/30 ${
                        !notification.read ? 'bg-thai-cream/20 border-thai-orange/20' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Contenu principal */}
                        <div className="flex items-start gap-3 flex-1">
                          {/* Icônes */}
                          <div className="flex items-center gap-1 pt-1">
                            {getCategoryIcon(notification.category)}
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          {/* Texte */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-medium text-thai-green ${
                                !notification.read ? 'font-semibold' : ''
                              }`}>
                                {notification.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryLabel(notification.category)}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-thai-orange rounded-full" />
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="text-thai-orange hover:bg-thai-orange/10"
                            >
                              <Link href={notification.actionUrl as any}>
                                <Home className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                            className="text-gray-500 hover:text-thai-orange"
                          >
                            {notification.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune notification trouvée
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ? 
                      'Essayez de modifier vos filtres de recherche.' :
                      'Vous êtes à jour ! Aucune nouvelle notification.'
                    }
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                      setStatusFilter('all');
                    }}
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liens rapides */}
          <Card className="bg-thai-cream/30 border-thai-orange/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-thai-green mb-4 text-center">
                Accès rapide
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  href="/suivi"
                  className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-thai-orange/5 transition-colors text-center"
                >
                  <ShoppingCart className="h-6 w-6 text-thai-orange mb-2" />
                  <span className="text-sm text-thai-green">Mes commandes</span>
                </Link>
                
                <Link 
                  href="/evenements"
                  className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-thai-orange/5 transition-colors text-center"
                >
                  <Calendar className="h-6 w-6 text-thai-orange mb-2" />
                  <span className="text-sm text-thai-green">Événements</span>
                </Link>
                
                <Link 
                  href="/panier"
                  className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-thai-orange/5 transition-colors text-center"
                >
                  <ShoppingCart className="h-6 w-6 text-thai-orange mb-2" />
                  <span className="text-sm text-thai-green">Mon panier</span>
                </Link>
                
                <Link 
                  href="/commander"
                  className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-thai-orange/5 transition-colors text-center"
                >
                  <Settings className="h-6 w-6 text-thai-orange mb-2" />
                  <span className="text-sm text-thai-green">Commander</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
});

NotificationsPage.displayName = 'NotificationsPage';

export default NotificationsPage;