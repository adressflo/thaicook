import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Bell,
  ChevronDown,
  History,
  Calendar,
  ShoppingCart,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const FloatingUserIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { currentUser, currentUserRole, currentUserProfile, logout } = useAuth()
  const navigate = useNavigate()

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const getInitials = (name?: string, firstName?: string) => {
    // Priorité au prénom si disponible
    if (firstName) {
      return firstName.charAt(0).toUpperCase()
    }
    // Sinon utiliser le nom complet
    if (!name) return 'U'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const displayName = currentUserProfile?.prenom && currentUserProfile?.nom 
    ? `${currentUserProfile.prenom} ${currentUserProfile.nom}`
    : currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Utilisateur'
  const userEmail = currentUser?.email
  const firstName = currentUserProfile?.prenom || currentUser?.displayName?.split(' ')[0]

  return (
    <div className="fixed top-4 right-4 z-[70]" ref={dropdownRef}>
      {/* Icône principale */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 transition-all duration-200 hover:shadow-xl group",
          currentUserRole === 'admin' 
            ? "border-thai-green hover:border-thai-green/80" 
            : "border-thai-orange hover:border-thai-orange/80",
          isOpen && "ring-2 ring-offset-2 ring-thai-orange/30"
        )}
        aria-label="Menu utilisateur"
      >
        {(currentUser?.photoURL || currentUserProfile?.photo_client) ? (
          <img 
            src={currentUserProfile?.photo_client || currentUser?.photoURL} 
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm",
            currentUserRole === 'admin' ? "bg-thai-green" : "bg-thai-orange"
          )}>
            {getInitials(displayName, firstName)}
          </div>
        )}
        
        {/* Indicateur d'ouverture */}
        <ChevronDown className={cn(
          "absolute -bottom-1 -right-1 h-4 w-4 bg-white rounded-full p-0.5 transition-transform duration-200",
          currentUserRole === 'admin' ? "text-thai-green" : "text-thai-orange",
          isOpen && "rotate-180"
        )} />
        
        {/* Badge de statut admin */}
        {currentUserRole === 'admin' && (
          <div className="absolute -top-1 -left-1 h-4 w-4 bg-thai-green rounded-full flex items-center justify-center">
            <Shield className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </Button>

      {/* Dropdown menu */}
      {isOpen && (
        <Card className="absolute top-14 right-0 w-72 shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          <CardContent className="p-0">
            {/* Header utilisateur */}
            <div className="p-4 bg-gradient-to-r from-thai-orange/10 to-thai-gold/10 rounded-t-lg">
              <div className="flex items-center space-x-3">
                {(currentUser?.photoURL || currentUserProfile?.photo_client) ? (
                  <img 
                    src={currentUserProfile?.photo_client || currentUser?.photoURL} 
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold",
                    currentUserRole === 'admin' ? "bg-thai-green" : "bg-thai-orange"
                  )}>
                    {getInitials(displayName, firstName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-thai-green truncate">{displayName}</p>
                  {currentUserRole === 'admin' && (
                    <Badge className="mt-1 bg-thai-green text-white text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrateur
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Menu principal */}
            <div className="p-2">
              {currentUser ? (
                <>
                  {/* Liens utilisateur connecté */}
                  <Link
                    to="/profil"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                  >
                    <User className="h-4 w-4 mr-3 text-thai-orange" />
                    Mon Profil
                  </Link>
                  
                  <Link
                    to="/historique"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                  >
                    <History className="h-4 w-4 mr-3 text-thai-orange" />
                    Mes Commandes
                  </Link>
                  
                  <Link
                    to="/commander"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-3 text-thai-orange" />
                    Commander
                  </Link>
                  
                  <Link
                    to="/evenements"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                  >
                    <Calendar className="h-4 w-4 mr-3 text-thai-orange" />
                    Événements
                  </Link>
                  
                  <Link
                    to="/nous-trouver"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                  >
                    <MapPin className="h-4 w-4 mr-3 text-thai-orange" />
                    Nous Trouver
                  </Link>

                  {/* Section Admin */}
                  {currentUserRole === 'admin' && (
                    <>
                      <Separator className="my-2" />
                      <div className="px-3 py-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Administration</p>
                      </div>
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-green/10 transition-colors w-full"
                      >
                        <Shield className="h-4 w-4 mr-3 text-thai-green" />
                        Tableau de Bord
                      </Link>
                      <Link
                        to="/admin/commandes"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-green/10 transition-colors w-full"
                      >
                        <Settings className="h-4 w-4 mr-3 text-thai-green" />
                        Gestion
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
                  {/* Liens utilisateur non connecté */}
                  <Link
                    to="/profil"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                  >
                    <User className="h-4 w-4 mr-3 text-thai-orange" />
                    Se connecter
                  </Link>
                  <Link
                    to="/commander"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-3 text-thai-orange" />
                    Commander
                  </Link>
                  <Link
                    to="/nous-trouver"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-thai-orange/10 transition-colors w-full"
                  >
                    <MapPin className="h-4 w-4 mr-3 text-thai-orange" />
                    Nous Trouver
                  </Link>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t">
              <p className="text-xs text-gray-500 text-center">
                ChanthanaThaiCook • Cuisine authentique
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FloatingUserIcon