"use client"

import { hasActiveNotifications, saveNotificationToken } from "@/app/actions/notifications"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/lib/auth-client"
import {
  getNotificationPermission,
  isNotificationSupported,
  requestNotificationPermission,
} from "@/lib/fcm"
import {
  AlertCircle,
  Bell,
  BellOff,
  Calendar,
  CheckCircle2,
  Home,
  Info,
  Loader2,
  ShoppingBag,
} from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotificationSetupPage() {
  const { toast } = useToast()
  const { data: session, isPending: isLoadingAuth } = useSession()
  const currentUser = session?.user

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default")
  const [isRequesting, setIsRequesting] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [hasActiveToken, setHasActiveToken] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(true)

  // Vérifier le support et le statut initial
  useEffect(() => {
    setIsSupported(isNotificationSupported())
    setPermissionStatus(getNotificationPermission())

    // Vérifier si l'utilisateur a déjà un token actif
    if (currentUser) {
      hasActiveNotifications().then((hasToken) => {
        setHasActiveToken(hasToken)
        setIsCheckingToken(false)
      })
    } else {
      setIsCheckingToken(false)
    }
  }, [currentUser])

  const handleRequestPermission = async () => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour activer les notifications",
        variant: "destructive",
      })
      return
    }

    setIsRequesting(true)
    try {
      const token = await requestNotificationPermission()

      if (token) {
        // Sauvegarder le token
        const result = await saveNotificationToken(token, "web")

        if (result.success) {
          setPermissionStatus("granted")
          setHasActiveToken(true)
          toast({
            title: "🎉 Notifications activées !",
            description: "Vous recevrez désormais les mises à jour importantes",
          })
        } else {
          throw new Error(result.error || "Erreur lors de la sauvegarde du token")
        }
      } else {
        setPermissionStatus(getNotificationPermission())

        if (getNotificationPermission() === "denied") {
          toast({
            title: "Permission refusée",
            description:
              "Vous avez refusé les notifications. Vous pouvez les réactiver dans les paramètres de votre navigateur.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Erreur activation notifications:", error)
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Impossible d'activer les notifications",
        variant: "destructive",
      })
    } finally {
      setIsRequesting(false)
    }
  }

  if (isLoadingAuth || isCheckingToken) {
    return (
      <div className="bg-gradient-thai flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="text-thai-orange mb-4 h-16 w-16 animate-spin" />
        <p className="text-thai-green font-medium">Chargement...</p>
      </div>
    )
  }

  if (!isSupported) {
    return (
      <div className="bg-gradient-thai min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-2 border-red-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <BellOff className="mx-auto mb-4 h-16 w-16 text-red-500" />
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Notifications non supportées
              </h2>
              <p className="mb-6 text-gray-600">
                Votre navigateur ne supporte pas les notifications push. Essayez avec Chrome,
                Firefox, Edge ou Safari.
              </p>
              <Link href="/" passHref>
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isAlreadyEnabled = permissionStatus === "granted" && hasActiveToken

  return (
    <div className="bg-gradient-thai min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        {/* Header avec bouton retour */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" passHref>
            <Button
              variant="outline"
              size="sm"
              className="border-thai-orange/20 hover:border-thai-orange/40 bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </Link>

          {currentUser && (
            <Link href={"/profil" as Route} passHref>
              <Button
                variant="ghost"
                size="sm"
                className="text-thai-green hover:text-thai-green/80"
              >
                Mon profil
              </Button>
            </Link>
          )}
        </div>

        {/* Carte principale */}
        <Card className="mb-6 shadow-xl">
          <CardHeader className="pb-4 text-center">
            <div className="bg-thai-orange/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <Bell className="text-thai-orange h-10 w-10" />
            </div>
            <CardTitle className="text-thai-green mb-2 text-3xl font-bold">
              Restez informé en temps réel
            </CardTitle>
            <CardDescription className="text-base">
              Recevez des notifications pour ne rien manquer
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Statut actuel */}
            {isAlreadyEnabled ? (
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">✅ Notifications activées</p>
                    <p className="text-sm text-green-700">
                      Vous recevez les notifications push sur cet appareil
                    </p>
                  </div>
                </div>
              </div>
            ) : permissionStatus === "denied" ? (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-6 w-6 text-red-600" />
                  <div>
                    <p className="mb-1 font-semibold text-red-900">Permission refusée</p>
                    <p className="mb-2 text-sm text-red-700">
                      Vous avez bloqué les notifications. Pour les réactiver :
                    </p>
                    <ol className="list-inside list-decimal space-y-1 text-xs text-red-600">
                      <li>Cliquez sur l'icône 🔒 ou ⓘ dans la barre d'adresse</li>
                      <li>Cherchez "Notifications" dans les paramètres</li>
                      <li>Changez "Bloquer" en "Autoriser"</li>
                      <li>Rechargez cette page</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Avantages */}
            <div className="space-y-4">
              <h3 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
                <Info className="h-5 w-5" />
                Pourquoi activer les notifications ?
              </h3>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <div>
                    <p className="font-medium text-amber-900">Suivi de commande</p>
                    <p className="text-sm text-amber-700">
                      Recevez une alerte quand votre commande change de statut (préparation, prête,
                      livrée)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                  <div>
                    <p className="font-medium text-blue-900">Rappels d'événements</p>
                    <p className="text-sm text-blue-700">
                      Ne manquez plus vos réservations grâce à des rappels 24h et 48h avant
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <Bell className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                  <div>
                    <p className="font-medium text-green-900">Offres spéciales</p>
                    <p className="text-sm text-green-700">
                      Soyez le premier informé des nouveaux plats et promotions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            {!isAlreadyEnabled && permissionStatus !== "denied" && (
              <div className="pt-4">
                {!currentUser ? (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-gray-600">
                      Connectez-vous pour activer les notifications
                    </p>
                    <Link href={"/profil" as Route} passHref>
                      <Button className="h-12 w-full text-base">Se connecter</Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    onClick={handleRequestPermission}
                    disabled={isRequesting}
                    className="h-12 w-full text-base font-semibold"
                  >
                    {isRequesting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Activation en cours...
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-5 w-5" />
                        Activer les notifications
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Note de confidentialité */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-center text-xs text-gray-500">
                🔒 Vos données sont protégées. Vous pouvez désactiver les notifications à tout
                moment dans les paramètres de votre navigateur.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lien vers le profil si connecté */}
        {currentUser && isAlreadyEnabled && (
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Gérer mes préférences</p>
                  <p className="text-sm text-gray-600">
                    Personnalisez les notifications que vous recevez
                  </p>
                </div>
                <Link href={"/profil" as Route} passHref>
                  <Button variant="outline" size="sm">
                    Paramètres
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
