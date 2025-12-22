"use client"

import { getClientProfile } from "@/app/profil/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { authClient, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import {
  Bell,
  Calendar,
  Clock,
  History,
  Home,
  LogOut,
  MapPin,
  Shield,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { memo, useCallback, useEffect, useRef, useState } from "react"

const FloatingUserIcon = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Better Auth session
  const { data: session } = useSession()
  const currentUser = session?.user

  // Client profile
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null)

  const { panier } = useCart()
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const router = useRouter()

  // Charger le profil client au montage
  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setCurrentUserProfile)
    } else {
      setCurrentUserProfile(null)
    }
  }, [currentUser?.id])

  // Vérifier si le panier a des articles non validés
  const hasUnvalidatedCart = panier.length > 0

  // Utiliser les 5 dernières notifications pour le dropdown
  const dropdownNotifications = notifications.slice(0, 5)

  // Fonction pour formater le temps
  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `Il y a ${days}j`
    if (hours > 0) return `Il y a ${hours}h`
    if (minutes > 0) return `Il y a ${minutes}min`
    return "À l'instant"
  }

  // Gérer le clic sur une notification
  const handleNotificationClick = useCallback(
    (notification: any) => {
      // Marquer comme lu
      if (!notification.read) {
        markAsRead(notification.id)
      }

      // Fermer le dropdown
      setShowNotifications(false)

      // Naviguer vers la page d'action avec un léger délai pour laisser le dropdown se fermer
      if (notification.actionUrl) {
        setTimeout(() => {
          router.push(notification.actionUrl)
        }, 100)
      }
    },
    [markAsRead, router]
  )

  // Fermer les dropdowns si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await authClient.signOut()
      setIsOpen(false)
      router.push("/")
    } catch (error) {
      // En production, on pourrait logger vers un service de monitoring
      if (process.env.NODE_ENV === "development") {
        console.error("Erreur lors de la déconnexion:", error)
      }
    }
  }, [router])

  const getInitials = (name?: string, firstName?: string) => {
    if (firstName) {
      return firstName.charAt(0).toUpperCase()
    }
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName =
    currentUserProfile?.prenom && currentUserProfile?.nom
      ? `${currentUserProfile.prenom} ${currentUserProfile.nom}`
      : currentUser?.name || currentUser?.email?.split("@")[0] || "Utilisateur"
  const firstName = currentUserProfile?.prenom || currentUser?.name?.split(" ")[0]

  return (
    <div className="floating-user-icon fixed top-4 right-4 z-70 hidden lg:block" ref={dropdownRef}>
      {/* Icône utilisateur plus grande avec contour ondulé amélioré */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsOpen(!isOpen)
            setShowNotifications(false)
          }}
          className="group relative z-10 flex h-32 w-32 items-center justify-center border-0! shadow-none! ring-0! outline-none! hover:bg-transparent focus-visible:ring-0! focus-visible:ring-offset-0! active:bg-transparent"
          aria-label="Ouvrir le menu"
        >
          <div className="relative h-full w-full">
            <Image
              src="/logo.svg"
              alt="Logo Chanthana"
              fill
              priority
              sizes="128px"
              className="animate-pulse-soft object-contain transition-all duration-300 group-hover:animate-none hover:scale-110 hover:rotate-6 active:scale-95"
            />
          </div>
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
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-md transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-lg focus:border-0 focus:ring-0 focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="text-thai-orange h-5 w-5" />

            {/* Badge de notification avec numéro plus grand */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500 text-base font-bold text-white shadow-lg">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Dropdown notifications - repositionné */}
          {showNotifications && (
            <Card className="animate-in slide-in-from-top-2 absolute top-10 right-0 z-50 w-80 border-0 bg-white/95 shadow-xl backdrop-blur-sm duration-200">
              <CardContent className="p-0">
                <div className="from-thai-orange/10 to-thai-gold/10 rounded-t-lg bg-linear-to-r p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-thai-green font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white">{unreadCount} non lues</Badge>
                    )}
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {dropdownNotifications.length > 0 ? (
                    dropdownNotifications.map((notification) =>
                      notification.actionUrl ? (
                        <Link
                          key={notification.id}
                          href={notification.actionUrl as any}
                          onClick={() => {
                            if (!notification.read) {
                              markAsRead(notification.id)
                            }
                            setShowNotifications(false)
                          }}
                          className={`block cursor-pointer border-b border-gray-100 p-3 transition-colors hover:bg-gray-50 ${
                            !notification.read ? "border-l-thai-orange border-l-4 bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="bg-thai-orange mt-1 ml-2 h-2 w-2 rounded-full"></div>
                            )}
                          </div>
                          <p className="mt-2 text-xs text-gray-400">
                            {formatTime(notification.timestamp)}
                          </p>
                        </Link>
                      ) : (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`cursor-pointer border-b border-gray-100 p-3 transition-colors hover:bg-gray-50 ${
                            !notification.read ? "border-l-thai-orange border-l-4 bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="bg-thai-orange mt-1 ml-2 h-2 w-2 rounded-full"></div>
                            )}
                          </div>
                          <p className="mt-2 text-xs text-gray-400">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <div className="p-6 text-center">
                      <Bell className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">Aucune notification</p>
                    </div>
                  )}
                </div>

                {dropdownNotifications.length > 0 && (
                  <div className="rounded-b-lg border-t bg-gray-50 p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-thai-orange hover:bg-thai-orange/10 w-full"
                      onClick={() => {
                        setShowNotifications(false)
                        router.push("/notifications" as any)
                      }}
                    >
                      Voir toutes les notifications
                      {notifications.length > 5 && (
                        <Badge className="bg-thai-orange/20 text-thai-orange ml-2">
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
          <Card className="animate-in slide-in-from-top-2 absolute top-22 right-0 z-50 w-72 border-0 bg-white/95 shadow-xl backdrop-blur-sm duration-200">
            <CardContent className="p-0">
              {/* Header utilisateur */}
              <div
                className={cn(
                  "rounded-t-lg p-4",
                  (currentUser?.image || currentUserProfile?.photo_client) &&
                    "from-thai-orange/10 to-thai-gold/10 bg-linear-to-r"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Link
                    href="/profil"
                    onClick={() => setIsOpen(false)}
                    className="group cursor-pointer"
                    aria-label="Aller au profil"
                  >
                    {currentUser?.image || currentUserProfile?.photo_client ? (
                      <img
                        src={currentUserProfile?.photo_client ?? currentUser?.image ?? ""}
                        alt={displayName}
                        className="hover:ring-thai-orange/50 h-12 w-12 rounded-full object-cover transition-all duration-200 hover:scale-105 hover:ring-2"
                      />
                    ) : (
                      <div className="bg-thai-orange hover:bg-thai-orange-dark flex h-12 w-12 items-center justify-center rounded-full font-bold text-white transition-all duration-200 hover:scale-105">
                        {getInitials(displayName, firstName)}
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href="/profil"
                      onClick={() => setIsOpen(false)}
                      className="hover:text-thai-orange cursor-pointer transition-colors"
                    >
                      <p className="text-thai-green hover:text-thai-orange truncate font-semibold transition-colors">
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
                      className="bg-thai-orange/10 hover:bg-thai-orange/20 text-thai-green hover:text-thai-orange border-thai-orange/20 hover:border-thai-orange/40 mb-2 flex w-full items-center rounded-lg border px-3 py-3 text-sm font-semibold transition-all"
                    >
                      <ShoppingCart className="text-thai-orange mr-3 h-5 w-5" />
                      Commander maintenant
                    </Link>

                    <Link
                      href="/panier"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 relative flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <ShoppingBag className="text-thai-orange mr-3 h-4 w-4" />
                      Mon panier
                      {hasUnvalidatedCart && (
                        <span className="bg-thai-orange ml-auto rounded-full px-2 py-1 text-xs font-medium text-white">
                          {panier.reduce((total, item) => total + item.quantite, 0)}
                        </span>
                      )}
                    </Link>

                    <Separator className="my-2" />

                    {/* Navigation principale */}
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <Home className="text-thai-orange mr-3 h-4 w-4" />
                      Accueil
                    </Link>

                    <Link
                      href="/suivi"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <Clock className="text-thai-orange mr-3 h-4 w-4" />
                      Mes commandes en cours
                    </Link>

                    <Link
                      href="/historique"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <History className="text-thai-orange mr-3 h-4 w-4" />
                      Historique des commandes
                    </Link>

                    <Link
                      href="/evenements"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <Calendar className="text-thai-orange mr-3 h-4 w-4" />
                      Événements
                    </Link>

                    <Link
                      href="/nous-trouver"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <MapPin className="text-thai-orange mr-3 h-4 w-4" />
                      Nous trouver
                    </Link>

                    <Separator className="my-2" />

                    {/* Profil utilisateur */}
                    <Link
                      href="/profil"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <User className="text-thai-orange mr-3 h-4 w-4" />
                      Mon profil
                    </Link>

                    {/* Accès administrateur - visible uniquement pour les admins */}
                    {currentUserProfile?.role === "admin" && (
                      <>
                        <Separator className="my-2" />
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="bg-thai-green/10 hover:bg-thai-green/20 text-thai-green hover:text-thai-green border-thai-green/20 hover:border-thai-green/40 flex w-full items-center rounded-lg border px-3 py-3 text-sm font-semibold transition-all"
                        >
                          <Shield className="text-thai-green mr-3 h-5 w-5" />
                          Accès Administrateur
                        </Link>
                      </>
                    )}

                    <Separator className="my-2" />

                    {/* Actions */}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Se déconnecter
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Action principale mise en avant pour non connectés */}
                    <Link
                      href="/commander"
                      onClick={() => setIsOpen(false)}
                      className="bg-thai-orange/10 hover:bg-thai-orange/20 text-thai-green hover:text-thai-orange border-thai-orange/20 hover:border-thai-orange/40 mb-2 flex w-full items-center rounded-lg border px-3 py-3 text-sm font-semibold transition-all"
                    >
                      <ShoppingCart className="text-thai-orange mr-3 h-5 w-5" />
                      Commander maintenant
                    </Link>

                    <Link
                      href="/panier"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 relative flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <ShoppingBag className="text-thai-orange mr-3 h-4 w-4" />
                      Mon panier
                      {hasUnvalidatedCart && (
                        <span className="bg-thai-orange ml-auto rounded-full px-2 py-1 text-xs font-medium text-white">
                          {panier.reduce((total, item) => total + item.quantite, 0)}
                        </span>
                      )}
                    </Link>

                    <Separator className="my-2" />

                    {/* Navigation pour visiteurs */}
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <Home className="text-thai-orange mr-3 h-4 w-4" />
                      Accueil
                    </Link>

                    <Link
                      href="/evenements"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <Calendar className="text-thai-orange mr-3 h-4 w-4" />
                      Événements
                    </Link>

                    <Link
                      href="/nous-trouver"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <MapPin className="text-thai-orange mr-3 h-4 w-4" />
                      Nous trouver
                    </Link>

                    <Separator className="my-2" />

                    {/* Connexion */}
                    <Link
                      href={"/auth/login" as Route}
                      passHref
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-thai-orange/10 flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <User className="text-thai-orange mr-3 h-4 w-4" />
                      Se connecter / S'inscrire
                    </Link>
                  </>
                )}
              </div>

              {/* Footer optimisé avec lien vers l'accueil */}
              <div className="from-thai-cream/30 to-thai-gold/20 border-thai-orange/10 rounded-b-lg border-t bg-linear-to-r px-4 py-3">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-thai-orange/5 group -m-2 block rounded-lg p-2 text-center transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-thai-green group-hover:text-thai-orange text-xs font-medium transition-colors">
                    ChanthanaThaiCook
                  </p>
                  <p className="text-thai-orange/80 group-hover:text-thai-orange text-xs transition-colors">
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

FloatingUserIcon.displayName = "FloatingUserIcon"

export { FloatingUserIcon }
export default FloatingUserIcon
