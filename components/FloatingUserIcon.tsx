'use client';

import { useState, useRef, useEffect, memo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import { 
  User, 
  LogOut, 
  Bell,
  ChevronDown,
  History,
  Calendar,
  ShoppingCart,
  MapPin,
  Clock,
  Home,
  ShoppingBag,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

const FloatingUserIcon = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { currentUser, currentUserProfile } = useAuth()
  const { panier } = useCart()
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const router = useRouter()

  // Vérifier si le panier a des articles non validés
  const hasUnvalidatedCart = panier.length > 0

  // Utiliser les 5 dernières notifications pour le dropdown
  const dropdownNotifications = notifications.slice(0, 5);

  // Fonction pour formater le temps
  const formatTime = (timestamp: Date) => {
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

  // Gérer le clic sur une notification
  const handleNotificationClick = useCallback((notification: any) => {
    // Marquer comme lu
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Fermer le dropdown
    setShowNotifications(false);
    
    // Naviguer vers la page d'action avec un léger délai pour laisser le dropdown se fermer
    if (notification.actionUrl) {
      setTimeout(() => {
        router.push(notification.actionUrl);
      }, 100);
    }
  }, [markAsRead, router]);

  // Fermer les dropdowns si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth)
      setIsOpen(false)
      router.push('/')
    } catch (error) {
      // En production, on pourrait logger vers un service de monitoring
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur lors de la déconnexion:', error)
      }
    }
  }, [router])

  const getInitials = (name?: string, firstName?: string) => {
    if (firstName) {
      return firstName.charAt(0).toUpperCase()
    }
    if (!name) return 'U'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const displayName = currentUserProfile?.prenom && currentUserProfile?.nom 
    ? `${currentUserProfile.prenom} ${currentUserProfile.nom}`
    : currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Utilisateur'
  const firstName = currentUserProfile?.prenom || currentUser?.displayName?.split(' ')[0]

  return (
    <div className="fixed top-4 right-4 z-[70] floating-user-icon" ref={dropdownRef}>
      {/* Icône utilisateur plus grande avec contour ondulé amélioré */}
      <div className="relative">
        
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsOpen(!isOpen)
            setShowNotifications(false)
          }}
          className="relative z-10 h-32 w-32 flex items-center justify-center !outline-none !ring-0 !border-0 hover:bg-transparent active:bg-transparent focus-visible:!ring-0 focus-visible:!ring-offset-0 !shadow-none group"
          aria-label="Ouvrir le menu"
        >
          <img 
            src="/logo.svg" 
            alt="Logo Chanthana" 
            className="w-full h-full object-contain animate-pulse-soft hover:rotate-6 hover:scale-110 active:scale-95 transition-all duration-300 group-hover:animate-none" 
          />
        </Button>

        {/* Cloche de notifications positionnée en haut à droite du FloatingUserIcon */}
        <div className="absolute -top-1 -right-1 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setShowNotifications(!showNotifications)
              setIsOpen(false)
            }}
            className="h-12 w-12 rounded-full bg-white/95 shadow-md flex items-center justify-center focus:outline-none focus:ring-0 focus:border-0 hover:bg-white/100 hover:shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-thai-orange" />
            
            {/* Badge de notification avec numéro plus grand */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 h-7 w-7 bg-red-500 text-white text-base font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* Dropdown notifications - repositionné */}
          {showNotifications && (
            <Card className="absolute top-10 right-0 w-80 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200 z-50">
              <CardContent className="p-0">
                <div className="p-4 bg-gradient-to-r from-thai-orange/10 to-thai-gold/10 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-thai-green">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {unreadCount} non lues
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {dropdownNotifications.length > 0 ? (
                    dropdownNotifications.map((notification) => (
                      notification.actionUrl ? (
                        <Link
                          key={notification.id}
                          href={notification.actionUrl}
                          onClick={() => {
                            if (!notification.read) {
                              markAsRead(notification.id);
                            }
                            setShowNotifications(false);
                          }}
                          className={`block p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50 border-l-4 border-l-thai-orange' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-thai-orange rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{formatTime(notification.timestamp)}</p>
                        </Link>
                      ) : (
                        <div 
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50 border-l-4 border-l-thai-orange' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-thai-orange rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{formatTime(notification.timestamp)}</p>
                        </div>
                      )
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Aucune notification</p>
                    </div>
                  )}
                </div>
                
                {dropdownNotifications.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-b-lg border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-thai-orange hover:bg-thai-orange/10"
                      onClick={() => {
                        setShowNotifications(false);
                        router.push('/notifications');
                      }}
                    >
                      Voir toutes les notifications
                      {notifications.length > 5 && (
                        <Badge className="ml-2 bg-thai-orange/20 text-thai-orange">
                          +{notifications.length - 5}
                        </Badge>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dropdown menu utilisateur */}
        {isOpen && (
          <Card className="absolute top-22 right-0 w-72 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200 z-50">
            <CardContent className="p-0">
              {/* Header utilisateur */}
              <div className={cn("p-4 rounded-t-lg", (currentUser?.photoURL || currentUserProfile?.photo_client) && "bg-gradient-to-r from-thai-orange/10 to-thai-gold/10")}>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/profil"
                    onClick={() => setIsOpen(false)}
                    className="group cursor-pointer"
                    aria-label="Aller au profil"
                  >
                    {(currentUser?.photoURL || currentUserProfile?.photo_client) ? (
                      <img 
                        src={currentUserProfile?.photo_client ?? currentUser?.photoURL ?? ''} 
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover hover:scale-105 hover:ring-2 hover:ring-thai-orange/50 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold hover:scale-105 hover:bg-thai-orange-dark transition-all duration-200">
                        {getInitials(displayName, firstName)}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href="/profil"
                      onClick={() => setIsOpen(false)}
                      className="hover:text-thai-orange transition-colors cursor-pointer"
                    >
                      <p className="font-semibold text-thai-green truncate hover:text-thai-orange transition-colors">
                        {displayName}
                      </p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Menu principal */}
              <div className="p-2">
                {currentUser ? (
                  <>
                    {/* Actions principales mises en avant */}
                    <Link
                      href="/commander"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-3 text-sm rounded-lg bg-thai-orange/10 hover:bg-thai-orange/20 transition-all w-full font-semibold text-thai-green hover:text-thai-orange border border-thai-orange/20 hover:border-thai-orange/40 mb-2"
                    >
                      <ShoppingCart className="h-5 w-5 mr-3 text-thai-orange" />
                      Commander maintenant
                    </Link>
                    
                    <Link
                      href="/panier"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full relative"
                    >
                      <ShoppingBag className="h-4 w-4 mr-3 text-thai-orange" />
                      Mon panier
                      {hasUnvalidatedCart && (
                        <span className="ml-auto bg-thai-orange text-white text-xs px-2 py-1 rounded-full font-medium">
                          {panier.reduce((total, item) => total + item.quantite, 0)}
                        </span>
                      )}
                    </Link>
                    
                    <Separator className="my-2" />
                    
                    {/* Navigation principale */}
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <Home className="h-4 w-4 mr-3 text-thai-orange" />
                      Accueil
                    </Link>
                    
                    <Link
                      href="/suivi"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <Clock className="h-4 w-4 mr-3 text-thai-orange" />
                      Mes commandes en cours
                    </Link>
                    
                    <Link
                      href="/historique"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <History className="h-4 w-4 mr-3 text-thai-orange" />
                      Historique des commandes
                    </Link>
                    
                    <Link
                      href="/evenements"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <Calendar className="h-4 w-4 mr-3 text-thai-orange" />
                      Événements
                    </Link>
                    
                    <Link
                      href="/nous-trouver"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <MapPin className="h-4 w-4 mr-3 text-thai-orange" />
                      Nous trouver
                    </Link>
                    
                    <Separator className="my-2" />
                    
                    {/* Profil utilisateur */}
                    <Link
                      href="/profil"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <User className="h-4 w-4 mr-3 text-thai-orange" />
                      Mon profil
                    </Link>

                    {/* Accès administrateur - visible uniquement pour les admins */}
                    {currentUserProfile?.role === 'admin' && (
                      <>
                        <Separator className="my-2" />
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-3 py-3 text-sm rounded-lg bg-thai-green/10 hover:bg-thai-green/20 transition-all w-full font-semibold text-thai-green hover:text-thai-green border border-thai-green/20 hover:border-thai-green/40"
                        >
                          <Shield className="h-5 w-5 mr-3 text-thai-green" />
                          Accès Administrateur
                        </Link>
                      </>
                    )}

                    <Separator className="my-2" />
                    
                    {/* Actions */}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Se déconnecter
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Action principale mise en avant pour non connectés */}
                    <Link
                      href="/commander"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-3 text-sm rounded-lg bg-thai-orange/10 hover:bg-thai-orange/20 transition-all w-full font-semibold text-thai-green hover:text-thai-orange border border-thai-orange/20 hover:border-thai-orange/40 mb-2"
                    >
                      <ShoppingCart className="h-5 w-5 mr-3 text-thai-orange" />
                      Commander maintenant
                    </Link>
                    
                    <Link
                      href="/panier"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full relative"
                    >
                      <ShoppingBag className="h-4 w-4 mr-3 text-thai-orange" />
                      Mon panier
                      {hasUnvalidatedCart && (
                        <span className="ml-auto bg-thai-orange text-white text-xs px-2 py-1 rounded-full font-medium">
                          {panier.reduce((total, item) => total + item.quantite, 0)}
                        </span>
                      )}
                    </Link>
                    
                    <Separator className="my-2" />
                    
                    {/* Navigation pour visiteurs */}
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <Home className="h-4 w-4 mr-3 text-thai-orange" />
                      Accueil
                    </Link>
                    
                    <Link
                      href="/evenements"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <Calendar className="h-4 w-4 mr-3 text-thai-orange" />
                      Événements
                    </Link>
                    
                    <Link
                      href="/nous-trouver"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <MapPin className="h-4 w-4 mr-3 text-thai-orange" />
                      Nous trouver
                    </Link>
                    
                    <Separator className="my-2" />
                    
                    {/* Connexion */}
                    <Link
                      href="/profil"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                    >
                      <User className="h-4 w-4 mr-3 text-thai-orange" />
                      Se connecter / S'inscrire
                    </Link>
                  </>
                )}
              </div>

              {/* Footer optimisé avec lien vers l'accueil */}
              <div className="px-4 py-3 bg-gradient-to-r from-thai-cream/30 to-thai-gold/20 rounded-b-lg border-t border-thai-orange/10">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block text-center hover:bg-thai-orange/5 rounded-lg p-2 -m-2 transition-all duration-200 hover:scale-[1.02] group"
                >
                  <p className="text-xs font-medium text-thai-green group-hover:text-thai-orange transition-colors">
                    ChanthanaThaiCook
                  </p>
                  <p className="text-xs text-thai-orange/80 group-hover:text-thai-orange transition-colors">
                    Cuisine thaï authentique
                  </p>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
})

FloatingUserIcon.displayName = 'FloatingUserIcon'

export { FloatingUserIcon }
export default FloatingUserIcon
