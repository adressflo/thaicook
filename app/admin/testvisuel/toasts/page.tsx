"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { toastVideo } from "@/hooks/use-toast-video"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Heart,
  Info,
  Monitor,
  Settings,
  ShoppingCart,
  Smartphone,
  Square,
  Trash2,
  User,
  Zap,
} from "lucide-react"

function NumberBadge({ number }: { number: number }) {
  return (
    <Badge variant="outline" className="h-6 w-6 justify-center rounded-full p-0">
      {number}
    </Badge>
  )
}

export default function ToastPage() {
  const { toast } = useToast()
  const [count, setCount] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isIncline, setIsIncline] = useState(false)
  const [scrollDuration, setScrollDuration] = useState(10)

  const incrementCount = () => setCount((prev) => prev + 1)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tests des Toasts</h1>
          <p className="text-muted-foreground">
            Page de test pour valider les différents types de notifications (Toasts).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg">
            Compteur: {count}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Section 1: Toasts Standards */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>1. Toasts Standards (shadcn/ui)</CardTitle>
              <CardDescription className="mt-1.5">
                Utilisation du hook standard <code>useToast</code>
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Info className="h-4 w-4" />
                  Props
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Propriétés de toast()</DialogTitle>
                  <DialogDescription>
                    Documentation des propriétés pour la fonction toast standard.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>title</strong> (string): Titre du toast
                    </li>
                    <li>
                      <strong>description</strong> (string | ReactNode): Contenu
                    </li>
                    <li>
                      <strong>variant</strong> ("default" | "destructive"): Style visuel
                    </li>
                    <li>
                      <strong>duration</strong> (number): Durée en ms (défaut: 5000)
                    </li>
                    <li>
                      <strong>action</strong> (ToastAction): Bouton d'action optionnel
                    </li>
                    <li>
                      <strong>tilted</strong> (boolean): Active l'inclinaison (rotation négative)
                    </li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Toast simple - Info */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={1} />
                <Button
                  onClick={() => {
                    toast({
                      title: "Information",
                      description: "Ceci est un message d'information simple",
                    })
                    incrementCount()
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Info className="mr-2 h-4 w-4" />
                  Toast simple
                </Button>
              </div>

              {/* Toast succès - Validation */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={2} />
                <Button
                  onClick={() => {
                    toast({
                      title: "Succès !",
                      description: "L'opération a été effectuée avec succès",
                      className: "border-thai-green text-thai-green",
                    })
                    incrementCount()
                  }}
                  className="bg-thai-green hover:bg-thai-green/90 w-full"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Toast succès
                </Button>
              </div>

              {/* Toast erreur - Suppression */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={3} />
                <Button
                  onClick={() => {
                    toast({
                      title: "Erreur",
                      description: "Impossible de supprimer cet élément",
                      variant: "destructive",
                    })
                    incrementCount()
                  }}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Toast erreur
                </Button>
              </div>

              {/* Toast avec description longue */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={4} />
                <Button
                  onClick={() => {
                    toast({
                      title: "Mise à jour disponible",
                      description:
                        "Une nouvelle version de l'application est disponible. Veuillez rafraîchir la page pour en profiter.",
                    })
                    incrementCount()
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Description longue
                </Button>
              </div>

              {/* Toast warning custom */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={5} />
                <Button
                  onClick={() => {
                    toast({
                      title: "Attention",
                      description: "Votre session va bientôt expirer",
                      className: "border-yellow-500 text-yellow-600",
                    })
                    incrementCount()
                  }}
                  className="w-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
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

              {/* Toast incliné */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={7} />
                <Button
                  onClick={() => {
                    toast({
                      description: "Ce toast est légèrement incliné",
                      tilted: true,
                    })
                    incrementCount()
                  }}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Toast incliné
                </Button>
              </div>
            </div>

            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Durée personnalisée :</p>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  <NumberBadge number={8} />
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
                  <NumberBadge number={9} />
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
                  <NumberBadge number={10} />
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

        {/* Section 2: Toasts Vidéo */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>2. Toasts Vidéo (Custom)</CardTitle>
              <CardDescription className="mt-1.5">
                Utilisation du hook personnalisé <code>toastVideo</code>
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Info className="h-4 w-4" />
                  Props
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Propriétés de toastVideo</DialogTitle>
                  <DialogDescription>
                    Documentation des propriétés pour la fonction toastVideo().
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>title</strong> (string): Titre du toast
                    </li>
                    <li>
                      <strong>description</strong> (string | ReactNode): Contenu
                    </li>
                    <li>
                      <strong>media</strong> (string): URL de la vidéo (.mp4) ou image
                    </li>
                    <li>
                      <strong>duration</strong> (number): Durée en ms (défaut: 5000)
                    </li>
                    <li>
                      <strong>position</strong> ("bottom-right" | "center" | "bottom-left"):
                      Position du toast
                    </li>
                    <li>
                      <strong>scrollingText</strong> (boolean): Active le défilement du texte
                    </li>
                    <li>
                      <strong>scrollDuration</strong> (number): Durée du défilement en secondes
                      (défaut: 10)
                    </li>
                    <li>
                      <strong>polaroid</strong> (boolean): Applique le style Polaroid
                    </li>
                    <li>
                      <strong>aspectRatio</strong> ("16:9" | "4:5" | "1:1"): Format de l'image/vidéo
                    </li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      media: "/media/avatars/phonevalid.svg",
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
                      media: "/media/avatars/phonevalid.svg",
                    })
                    incrementCount()
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Image - Bienvenue
                </Button>
              </div>

              {/* Toast vidéo - Texte défilant */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <NumberBadge number={5} />
                  <Button
                    onClick={() => {
                      toastVideo({
                        title: "Texte défilant",
                        description:
                          "Ceci est un exemple de texte très long qui va défiler horizontalement pour permettre de lire tout le contenu sans agrandir le toast.",
                        media: "/media/animations/toasts/ajoutpaniernote.mp4",
                        scrollingText: true,
                        scrollDuration: scrollDuration,
                      })
                      incrementCount()
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Vidéo - Texte défilant
                  </Button>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs whitespace-nowrap text-gray-500">
                    Vitesse: {scrollDuration}s
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={scrollDuration}
                    onChange={(e) => setScrollDuration(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Toast vidéo - Polaroid */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={6} />
                <Button
                  onClick={() => {
                    toastVideo({
                      title: "Vidéo - Polaroid",
                      description: "Un style rétro avec vidéo",
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                      polaroid: true,
                    })
                    incrementCount()
                  }}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Vidéo - Polaroid
                </Button>
              </div>

              {/* Toast vidéo - Polaroid - Image */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={7} />
                <Button
                  onClick={() => {
                    toastVideo({
                      title: "Polaroid Image",
                      description: "Un style rétro avec image",
                      media: "/media/avatars/phonevalid.svg",
                      polaroid: true,
                    })
                    incrementCount()
                  }}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Polaroid - Image
                </Button>
              </div>

              {/* Toast vidéo - Format 16:9 */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={8} />
                <Button
                  onClick={() => {
                    toastVideo({
                      title: "Format 16:9",
                      description: "Vidéo au format cinéma",
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                      aspectRatio: "16:9",
                    })
                    incrementCount()
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  Format 16:9
                </Button>
              </div>

              {/* Toast vidéo - Format 4:5 */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={9} />
                <Button
                  onClick={() => {
                    toastVideo({
                      title: "Format 4:5",
                      description: "Format portrait (réseaux sociaux)",
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                      aspectRatio: "4:5",
                    })
                    incrementCount()
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Format 4:5
                </Button>
              </div>

              {/* Toast vidéo - Format 1:1 */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={10} />
                <Button
                  onClick={() => {
                    toastVideo({
                      title: "Format 1:1",
                      description: "Format carré classique",
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                      aspectRatio: "1:1",
                    })
                    incrementCount()
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Format 1:1
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Aperçu Visuel */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="pl-2 text-sm font-medium text-gray-600">Aperçu Visuel</span>
              </div>
              <div className="flex flex-wrap justify-center gap-8 rounded-lg border border-dashed bg-gray-50 p-8">
                {/* Video Toast Mockup */}
                <div className="border-thai-green/20 relative flex w-[300px] flex-col overflow-hidden rounded-md border bg-white p-0 shadow-lg">
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gray-100">
                    <video
                      src="/media/animations/toasts/ajoutpaniernote.mp4"
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="grid gap-1 p-4">
                    <div className="text-sm font-semibold">Notification Vidéo</div>
                    <div className="text-sm text-gray-600 opacity-90">
                      Exemple avec animation vidéo
                    </div>
                  </div>
                </div>

                {/* Image Toast Mockup */}
                <div className="border-thai-green/20 relative flex w-[300px] flex-col overflow-hidden rounded-md border bg-white p-0 shadow-lg">
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gray-100">
                    <img
                      src="/media/avatars/phonevalid.svg"
                      alt="Validation"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="grid gap-1 p-4">
                    <div className="text-sm font-semibold">Notification Image</div>
                    <div className="text-sm text-gray-600 opacity-90">
                      Exemple avec image statique
                    </div>
                  </div>
                </div>

                {/* Polaroid Toast Mockup */}
                <div className="border-thai-green flex w-[300px] flex-col items-center border bg-white p-[10px_10px_20px_10px] shadow-2xl transition-all duration-300">
                  <div className="border-thai-green w-full border">
                    <video
                      src="/media/animations/toasts/ajoutpaniernote.mp4"
                      className="h-auto w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="mt-4 flex w-full flex-col items-center gap-3 p-0">
                    <div className="text-thai-green text-center text-xl font-bold">
                      Vidéo - Polaroid
                    </div>
                    <div className="text-thai-green text-center text-sm leading-relaxed font-bold">
                      Un style rétro avec vidéo
                    </div>
                  </div>
                </div>

                {/* 16:9 Mockup */}
                <div className="border-thai-orange/20 relative flex w-[300px] flex-col overflow-hidden rounded-xl border-2 bg-white p-0 shadow-lg">
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <video
                      src="/media/animations/toasts/ajoutpaniernote.mp4"
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="grid gap-1 p-4">
                    <div className="text-sm font-semibold">Format 16:9</div>
                    <div className="text-sm text-gray-600 opacity-90">Standard Cinéma</div>
                  </div>
                </div>

                {/* 4:5 Mockup */}
                <div className="border-thai-orange/20 relative flex w-[300px] flex-col overflow-hidden rounded-xl border-2 bg-white p-0 shadow-lg">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
                    <video
                      src="/media/animations/toasts/ajoutpaniernote.mp4"
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="grid gap-1 p-4">
                    <div className="text-sm font-semibold">Format 4:5</div>
                    <div className="text-sm text-gray-600 opacity-90">Portrait Social</div>
                  </div>
                </div>

                {/* 1:1 Mockup */}
                <div className="border-thai-orange/20 relative flex w-[300px] flex-col overflow-hidden rounded-xl border-2 bg-white p-0 shadow-lg">
                  <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <video
                      src="/media/animations/toasts/ajoutpaniernote.mp4"
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="grid gap-1 p-4">
                    <div className="text-sm font-semibold">Format 1:1</div>
                    <div className="text-sm text-gray-600 opacity-90">Carré Classique</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Toasts Vidéo Centrés (toastervideo.tsx) */}
        <Card className="border-thai-orange/20">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-thai-green">3. Toasts Vidéo Centrés</CardTitle>
              <CardDescription className="mt-1.5">
                Toasts avec vidéo/image en plein centre de l'écran - Impact visuel maximal
                <br />
                <code className="text-xs text-gray-500">components\ui\toastervideo.tsx</code>
                <br />
                <code className="text-xs text-gray-500">hooks\use-toast-video.ts</code>
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Info className="h-4 w-4" />
                  Props
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Propriétés de toastVideo (Centré)</DialogTitle>
                  <DialogDescription>
                    Utilisation de toastVideo() avec la propriété position: "center".
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>title</strong> (string): Titre du toast
                    </li>
                    <li>
                      <strong>description</strong> (string | ReactNode): Contenu
                    </li>
                    <li>
                      <strong>media</strong> (string): URL de la vidéo (.mp4) ou image
                    </li>
                    <li>
                      <strong>duration</strong> (number): Durée en ms (défaut: 5000)
                    </li>
                    <li>
                      <strong>position</strong>: "center"
                    </li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Toast centré vidéo - Commande */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={1} />
                <Button
                  onClick={() => {
                    toastVideo({
                      title: "Commande validée !",
                      description: (
                        <span>
                          <span className="text-thai-green font-medium">Commande </span>
                          <span className="text-thai-orange font-medium">Pad Thai</span>
                          <span className="text-thai-green font-medium"> validée</span>
                        </span>
                      ),
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                      position: "center",
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
                    toastVideo({
                      title: "Compte créé !",
                      description: (
                        <span>
                          <span className="text-thai-green font-medium">
                            Votre compte a été créé avec succès
                          </span>
                        </span>
                      ),
                      media: "/media/avatars/phonevalid.svg",
                      position: "center",
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
                    toastVideo({
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
                      position: "center",
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

            <Separator className="my-4" />

            {/* Aperçu Visuel */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="pl-2 text-sm font-medium text-gray-600">Aperçu Visuel</span>
              </div>
              <div className="flex justify-center rounded-lg border border-dashed bg-gray-50 p-8">
                {/* Video Centered Toast Mockup */}
                <div className="border-thai-orange/20 relative flex w-[300px] flex-col items-center gap-4 overflow-hidden rounded-xl border bg-white p-6 text-center shadow-2xl">
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    <video
                      src="/media/animations/toasts/ajoutpaniernote.mp4"
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="text-thai-green text-lg font-bold">Titre Centré</div>
                    <div className="text-sm text-gray-600">
                      Exemple avec animation vidéo centrée
                    </div>
                  </div>
                </div>
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
                      toastVideo({
                        title: "Commande confirmée !",
                        description: (
                          <span>
                            <span className="text-thai-green font-medium">
                              Commande #12345 validée
                            </span>
                            <br />
                            <span className="text-sm text-gray-500">
                              Un email de confirmation vous a été envoyé
                            </span>
                          </span>
                        ),
                        media: "/media/animations/toasts/ajoutpaniernote.mp4",
                        position: "center",
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
