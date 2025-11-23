"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { toastVideo } from "@/hooks/use-toast-video"
import { toastVideoCenter } from "@/hooks/use-toast-video-center"
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  Zap,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ToastsTestPage() {
  const { toast } = useToast()
  const [toastCount, setToastCount] = useState(0)

  const incrementCount = () => setToastCount((prev) => prev + 1)

  const NumberBadge = ({ number }: { number: number }) => (
    <span className="bg-thai-orange mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
      {number}
    </span>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">🍞 Test des Toasts</h1>
        <p className="text-gray-600">
          Système de notifications toast complet - 6 variantes (standard, vidéo, image, centrées)
        </p>
        <div className="mt-4 flex gap-2">
          <Badge variant="outline" className="border-thai-orange text-thai-orange">
            6 variantes
          </Badge>
          <Badge className="bg-thai-green">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Fonctionnel
          </Badge>
          <Badge variant="secondary">{toastCount} toasts déclenchés</Badge>
        </div>
      </div>

      {/* Section 1: Toasts Standard (toaster.tsx) */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">1. Toasts Standard (toaster.tsx)</CardTitle>
          <CardDescription>
            Toasts classiques avec bordure orange et animation verte - Position: bas droite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Toast par défaut */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Button
                onClick={() => {
                  toast({
                    title: "Notification",
                    description: "Ceci est un toast standard avec bordure orange",
                  })
                  incrementCount()
                }}
                className="bg-thai-orange hover:bg-thai-orange/90 w-full"
              >
                <Bell className="mr-2 h-4 w-4" />
                Toast par défaut
              </Button>
            </div>

            {/* Toast succès */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Button
                onClick={() => {
                  toast({
                    title: "Succès !",
                    description: "L'opération a été effectuée avec succès",
                  })
                  incrementCount()
                }}
                className="bg-thai-green hover:bg-thai-green/90 w-full"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Toast succès
              </Button>
            </div>

            {/* Toast erreur */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Button
                onClick={() => {
                  toast({
                    title: "Erreur !",
                    description: "Quelque chose s'est mal passé",
                    variant: "destructive",
                  })
                  incrementCount()
                }}
                variant="destructive"
                className="w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Toast erreur
              </Button>
            </div>

            {/* Toast info */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={4} />
              <Button
                onClick={() => {
                  toast({
                    title: "Information",
                    description: "Voici une information importante à noter",
                  })
                  incrementCount()
                }}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Info className="mr-2 h-4 w-4" />
                Toast info
              </Button>
            </div>

            {/* Toast warning */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={5} />
              <Button
                onClick={() => {
                  toast({
                    title: "Attention !",
                    description: "Cette action nécessite votre attention",
                  })
                  incrementCount()
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Toast warning
              </Button>
            </div>

            {/* Toast avec action */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={6} />
              <Button
                onClick={() => {
                  toast({
                    title: "Toast avec action",
                    description: "Cliquez sur Annuler pour fermer",
                    action: (
                      <Button size="sm" variant="outline">
                        Annuler
                      </Button>
                    ),
                  })
                  incrementCount()
                }}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                <Zap className="mr-2 h-4 w-4" />
                Avec action
              </Button>
            </div>
          </div>

          <Separator />

          {/* Toast longue durée */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Durée personnalisée :</p>
            <div className="flex gap-2">
              <div className="flex flex-col gap-1">
                <NumberBadge number={7} />
                <Button
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Toast rapide (1s)",
                      description: "Ce toast disparaît rapidement",
                      duration: 1000,
                    })
                    incrementCount()
                  }}
                  variant="outline"
                >
                  1 seconde
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <NumberBadge number={8} />
                <Button
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Toast moyen (3s)",
                      description: "Durée standard",
                      duration: 3000,
                    })
                    incrementCount()
                  }}
                  variant="outline"
                >
                  3 secondes
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <NumberBadge number={9} />
                <Button
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Toast long (10s)",
                      description: "Ce toast reste visible longtemps",
                      duration: 10000,
                    })
                    incrementCount()
                  }}
                  variant="outline"
                >
                  10 secondes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Toasts Vidéo (toastervideo.tsx) */}
      <Card className="border-thai-green/20">
        <CardHeader>
          <CardTitle className="text-thai-green">2. Toasts Vidéo (toastervideo.tsx)</CardTitle>
          <CardDescription>
            Toasts avec vidéo/image animée - Position: bas droite avec média
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Toast vidéo - Ajout panier */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Button
                onClick={() => {
                  toastVideo({
                    title: "Plat ajouté !",
                    description: (
                      <span>
                        <span className="text-thai-orange font-medium">Pad Thai</span>
                        <span className="text-thai-green font-medium"> ajouté au panier</span>
                      </span>
                    ),
                    media: "/media/animations/toasts/ajoutpaniernote.mp4",
                  })
                  incrementCount()
                }}
                className="bg-thai-green hover:bg-thai-green/90 w-full"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Vidéo - Ajout panier
              </Button>
            </div>

            {/* Toast vidéo - Commande validée */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Button
                onClick={() => {
                  toastVideo({
                    title: "Commande validée !",
                    description: (
                      <span>
                        <span className="text-thai-green font-medium">Votre commande </span>
                        <span className="text-thai-orange font-medium">#12345</span>
                        <span className="text-thai-green font-medium"> est confirmée</span>
                      </span>
                    ),
                    media: "/media/animations/toasts/ajoutpaniernote.mp4",
                  })
                  incrementCount()
                }}
                className="bg-thai-orange hover:bg-thai-orange/90 w-full"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Vidéo - Validation
              </Button>
            </div>

            {/* Toast image - Avatar */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Button
                onClick={() => {
                  toastVideo({
                    title: "Profil mis à jour",
                    description: (
                      <span>
                        <span className="text-thai-green font-medium">
                          Votre avatar a été modifié avec succès
                        </span>
                      </span>
                    ),
                    media: "/media/avatars/default.svg",
                  })
                  incrementCount()
                }}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                <User className="mr-2 h-4 w-4" />
                Image - Avatar
              </Button>
            </div>

            {/* Toast image - Logo */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={4} />
              <Button
                onClick={() => {
                  toastVideo({
                    title: "Bienvenue !",
                    description: (
                      <span>
                        <span className="text-thai-green font-medium">
                          Bienvenue chez ChanthanaThaiCook
                        </span>
                      </span>
                    ),
                    media: "/media/avatars/default.svg",
                  })
                  incrementCount()
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <Heart className="mr-2 h-4 w-4" />
                Image - Bienvenue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Toasts Centrés (toastervideocenter.tsx) */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">
            3. Toasts Vidéo Centrés (toastervideocenter.tsx)
          </CardTitle>
          <CardDescription>
            Toasts avec vidéo/image en plein centre de l'écran - Impact visuel maximal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Toast centré vidéo - Commande */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Button
                onClick={() => {
                  toastVideoCenter({
                    title: "Commande validée !",
                    description: (
                      <span>
                        <span className="text-thai-green font-medium">Commande </span>
                        <span className="text-thai-orange font-medium">Pad Thai</span>
                        <span className="text-thai-green font-medium"> validée</span>
                      </span>
                    ),
                    media: "/media/animations/toasts/ajoutpaniernote.mp4",
                  })
                  incrementCount()
                }}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Centré - Vidéo
              </Button>
            </div>

            {/* Toast centré image - Compte créé */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Button
                onClick={() => {
                  toastVideoCenter({
                    title: "Compte créé !",
                    description: (
                      <span>
                        <span className="text-thai-green font-medium">
                          Votre compte a été créé avec succès
                        </span>
                      </span>
                    ),
                    media: "/media/avatars/default.svg",
                  })
                  incrementCount()
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <User className="mr-2 h-4 w-4" />
                Centré - Image
              </Button>
            </div>

            {/* Toast centré vidéo - Événement */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Button
                onClick={() => {
                  toastVideoCenter({
                    title: "Événement réservé !",
                    description: (
                      <span>
                        <span className="text-thai-orange font-medium">Soirée Thai Cook</span>
                        <span className="text-thai-green font-medium">
                          {" "}
                          - 20 personnes confirmées
                        </span>
                      </span>
                    ),
                    media: "/media/animations/toasts/ajoutpaniernote.mp4",
                  })
                  incrementCount()
                }}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                <Bell className="mr-2 h-4 w-4" />
                Centré - Événement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Tests Combinés */}
      <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 bg-gradient-to-r">
        <CardHeader>
          <CardTitle className="text-thai-green">4. Tests Combinés & Scénarios Réels</CardTitle>
          <CardDescription>Simulations de cas d'usage réels de l'application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Scénario: Ajout au panier complet */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Button
                onClick={() => {
                  toastVideo({
                    title: "Pad Thai ajouté !",
                    description: (
                      <span>
                        <span className="text-thai-orange font-medium">1x Pad Thai (12.90€)</span>
                        <span className="text-thai-green font-medium"> + 2x Nems (5.00€)</span>
                      </span>
                    ),
                    media: "/media/animations/toasts/ajoutpaniernote.mp4",
                  })
                  setTimeout(() => {
                    toast({
                      title: "Panier mis à jour",
                      description: "Total: 22.90€ - 3 articles",
                    })
                  }, 1500)
                  incrementCount()
                  setTimeout(() => incrementCount(), 1500)
                }}
                className="bg-thai-orange hover:bg-thai-orange/90 w-full"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Scénario: Ajout panier complet
              </Button>
            </div>

            {/* Scénario: Validation commande */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Button
                onClick={() => {
                  toast({
                    title: "Validation en cours...",
                    description: "Vérification de votre commande",
                  })
                  setTimeout(() => {
                    toastVideoCenter({
                      title: "Commande confirmée !",
                      description: (
                        <span>
                          <span className="text-thai-green font-medium">
                            Commande #12345 validée
                          </span>
                          <br />
                          <span className="text-thai-orange font-medium">
                            Livraison estimée: 30-45 min
                          </span>
                        </span>
                      ),
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                    })
                  }, 2000)
                  incrementCount()
                  setTimeout(() => incrementCount(), 2000)
                }}
                className="bg-thai-green hover:bg-thai-green/90 w-full"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Scénario: Validation commande
              </Button>
            </div>

            {/* Scénario: Erreur puis succès */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Button
                onClick={() => {
                  toast({
                    title: "Erreur de paiement",
                    description: "La carte bancaire a été refusée",
                    variant: "destructive",
                  })
                  setTimeout(() => {
                    toast({
                      title: "Nouvelle tentative...",
                      description: "Traitement du paiement",
                    })
                  }, 2000)
                  setTimeout(() => {
                    toastVideoCenter({
                      title: "Paiement validé !",
                      description: (
                        <span className="text-thai-green font-medium">
                          Transaction effectuée avec succès
                        </span>
                      ),
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                    })
                  }, 4000)
                  incrementCount()
                  setTimeout(() => incrementCount(), 2000)
                  setTimeout(() => incrementCount(), 4000)
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                Scénario: Erreur puis succès
              </Button>
            </div>

            {/* Scénario: Multiple notifications */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={4} />
              <Button
                onClick={() => {
                  toast({ title: "Nouveau message", description: "Le chef a un message pour vous" })
                  setTimeout(
                    () =>
                      toast({
                        title: "Nouvelle offre",
                        description: "Promotion -20% sur les desserts",
                      }),
                    800
                  )
                  setTimeout(
                    () =>
                      toast({ title: "Rappel", description: "Votre commande arrive dans 10 min" }),
                    1600
                  )
                  incrementCount()
                  setTimeout(() => incrementCount(), 800)
                  setTimeout(() => incrementCount(), 1600)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Bell className="mr-2 h-4 w-4" />
                Scénario: Multiple notifications
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Toasts Spéciaux */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">5. Toasts Spéciaux</CardTitle>
          <CardDescription>Variantes uniques comme le style Polaroid</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Toast Polaroid */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Button
                onClick={() => {
                  toast({
                    title: "Souvenir !",
                    description: "Un instant capturé façon Polaroid",
                    variant: "polaroid",
                  })
                  incrementCount()
                }}
                className="text-thai-green border-thai-green w-full border-2 bg-white hover:bg-gray-50"
              >
                <Heart className="mr-2 h-4 w-4" />
                Toast Polaroid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">📊 Statistiques de Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border-thai-orange/20 bg-thai-cream/20 rounded-lg border p-4 text-center">
              <p className="text-thai-orange text-3xl font-bold">{toastCount}</p>
              <p className="text-sm text-gray-600">Toasts déclenchés</p>
            </div>
            <div className="border-thai-green/20 bg-thai-cream/20 rounded-lg border p-4 text-center">
              <p className="text-thai-green text-3xl font-bold">6</p>
              <p className="text-sm text-gray-600">Variantes disponibles</p>
            </div>
            <div className="border-thai-orange/20 bg-thai-cream/20 rounded-lg border p-4 text-center">
              <p className="text-thai-orange text-3xl font-bold">3</p>
              <p className="text-sm text-gray-600">Systèmes de toast</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
