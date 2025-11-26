"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, Trash2, Settings, User, CreditCard, Info } from "lucide-react"
import { CommandePlatModal, CommandePlatContent } from "@/components/shared/CommandePlatModal"
import { ModalVideo } from "@/components/ui/ModalVideo"
import { useData } from "@/contexts/DataContext"
import { cn } from "@/lib/utils"

// Composant Playground interactif pour ModalVideo
function ModalVideoPlayground() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previewProps, setPreviewProps] = useState<{
    title: string
    description: string
    media: string
    aspectRatio: "16:9" | "4:5" | "1:1" | "auto"
    polaroid: boolean
    scrollingText: boolean
    scrollDuration: number
    loopCount: number
    buttonLayout: "none" | "single" | "double" | "triple"
    cancelText: string
    confirmText: string
    thirdButtonText: string
    rotation: boolean
    maxWidth: "sm" | "md" | "lg" | "xl" | "custom"
    customWidth: string
    customHeight: string
    borderColor: "thai-orange" | "thai-green" | "red" | "blue"
    borderWidth: number
    shadowSize: "sm" | "lg" | "2xl"
  }>({
    title: "Vidéo - Aperçu",
    description: "La vidéo tourne en boucle pour démonstration",
    media: "/media/animations/toasts/ajoutpaniernote.mp4",
    aspectRatio: "16:9",
    polaroid: false,
    scrollingText: false,
    scrollDuration: 10,
    loopCount: 0,
    buttonLayout: "double",
    cancelText: "Annuler",
    confirmText: "Confirmer",
    thirdButtonText: "Action",
    rotation: true,
    maxWidth: "md",
    customWidth: "600px",
    customHeight: "",
    borderColor: "thai-orange",
    borderWidth: 2,
    shadowSize: "2xl"
  })

  // Fonction pour générer le code JSX complet
  const generateCode = () => {
    return `<ModalVideo
  isOpen={isModalOpen}
  onOpenChange={setIsModalOpen}
  title="${previewProps.title}"
  description="${previewProps.description}"
  media="${previewProps.media}"
  aspectRatio="${previewProps.aspectRatio}"
  polaroid={${previewProps.polaroid}}
  scrollingText={${previewProps.scrollingText}}
  scrollDuration={${previewProps.scrollDuration}}
  loopCount={${previewProps.loopCount}}
  buttonLayout="${previewProps.buttonLayout}"
  cancelText="${previewProps.cancelText}"
  confirmText="${previewProps.confirmText}"
  thirdButtonText="${previewProps.thirdButtonText}"
  rotation={${previewProps.rotation}}
  maxWidth="${previewProps.maxWidth}"${previewProps.maxWidth === "custom" && previewProps.customWidth ? `\n  customWidth="${previewProps.customWidth}"` : ''}${previewProps.maxWidth === "custom" && previewProps.customHeight ? `\n  customHeight="${previewProps.customHeight}"` : ''}
  borderColor="${previewProps.borderColor}"
  borderWidth={${previewProps.borderWidth}}
  shadowSize="${previewProps.shadowSize}"
  onCancel={() => console.log("Annulé")}
  onConfirm={() => console.log("Confirmé")}
  onThirdButton={() => console.log("Troisième action")}
/>`
  }

  // Fonction pour copier le code dans le presse-papiers
  const handleCopyCode = async () => {
    const code = generateCode()
    try {
      await navigator.clipboard.writeText(code)
      // TODO: Add toast notification "✅ Code copié !"
      console.log("✅ Code copié dans le presse-papiers!")
    } catch (err) {
      console.error("Erreur lors de la copie:", err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Contrôles Interactifs */}
      <div className="space-y-4 rounded-lg border border-thai-orange/20 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg text-thai-green flex items-center gap-2">
            <span className="text-xl">🎮</span>
            Contrôles Interactifs
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
            >
              📋 Copier le Code
            </Button>
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🎬 Ouvrir Modal Réel
            </Button>
          </div>
        </div>

        {/* Section Contenu */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">📝 Contenu</label>
          <div className="space-y-2">
            <input
              type="text"
              value={previewProps.title}
              onChange={(e) => setPreviewProps({ ...previewProps, title: e.target.value })}
              placeholder="Titre du modal"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
            <textarea
              value={previewProps.description}
              onChange={(e) => setPreviewProps({ ...previewProps, description: e.target.value })}
              placeholder="Description"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent resize-none"
              rows={3}
            />
            <input
              type="text"
              value={previewProps.media}
              onChange={(e) => {
                let path = e.target.value
                // Nettoyer le chemin : enlever "public/" ou "public\" du début
                path = path.replace(/^public[\/\\]/, '/')
                // S'assurer qu'il commence par /
                if (path && !path.startsWith('/')) {
                  path = '/' + path
                }
                setPreviewProps({ ...previewProps, media: path })
              }}
              placeholder="/media/avatars/phonevalid.svg (ou public/media/...)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewProps({ ...previewProps, media: "/media/avatars/phonevalid.svg" })}
                className="flex-1 border-thai-green/30 text-thai-green hover:bg-thai-green/10"
              >
                🖼️ Image
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewProps({ ...previewProps, media: "/media/animations/toasts/ajoutpaniernote.mp4" })}
                className="flex-1 border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
              >
                🎬 Vidéo
              </Button>
            </div>
          </div>
        </div>

        {/* Section Style */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🎨 Style</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={previewProps.polaroid}
                onChange={(e) => setPreviewProps({ ...previewProps, polaroid: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Polaroid (cadre blanc + bordure configurée)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={previewProps.scrollingText}
                onChange={(e) => setPreviewProps({ ...previewProps, scrollingText: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Texte défilant (animation marquee)</span>
            </label>
            {previewProps.scrollingText && (
              <div className="flex items-center gap-2 ml-6">
                <label className="text-xs text-gray-600">Durée:</label>
                <input
                  type="number"
                  value={previewProps.scrollDuration}
                  onChange={(e) => setPreviewProps({ ...previewProps, scrollDuration: parseInt(e.target.value) || 10 })}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange"
                  min="1"
                  max="60"
                />
                <span className="text-xs text-gray-600">secondes</span>
              </div>
            )}
          </div>
        </div>

        {/* Section Format */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">📐 Format d'image</label>
          <div className="flex gap-2">
            {(["16:9", "4:5", "1:1", "auto"] as const).map((ratio) => (
              <Button
                key={ratio}
                size="sm"
                variant={previewProps.aspectRatio === ratio ? "default" : "outline"}
                onClick={() => setPreviewProps({ ...previewProps, aspectRatio: ratio })}
                className={previewProps.aspectRatio === ratio
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {ratio}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Lecture */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🎬 Nombre de lectures</label>
          <div className="flex gap-2">
            {[
              { label: "∞ Infini", value: 0 },
              { label: "1x", value: 1 },
              { label: "3x", value: 3 }
            ].map((loop) => (
              <Button
                key={loop.value}
                size="sm"
                variant={previewProps.loopCount === loop.value ? "default" : "outline"}
                onClick={() => setPreviewProps({ ...previewProps, loopCount: loop.value })}
                className={previewProps.loopCount === loop.value
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {loop.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Boutons d'action */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🔘 Layout des boutons</label>
          <div className="flex gap-2">
            {[
              { label: "Aucun", value: "none" as const },
              { label: "1 bouton", value: "single" as const },
              { label: "2 boutons", value: "double" as const },
              { label: "3 boutons", value: "triple" as const }
            ].map((layout) => (
              <Button
                key={layout.value}
                size="sm"
                variant={previewProps.buttonLayout === layout.value ? "default" : "outline"}
                onClick={() => setPreviewProps({ ...previewProps, buttonLayout: layout.value })}
                className={previewProps.buttonLayout === layout.value
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {layout.label}
              </Button>
            ))}
          </div>
          {previewProps.buttonLayout !== "none" && (
            <div className="space-y-2 mt-3">
              <div className="grid grid-cols-2 gap-2">
                {previewProps.buttonLayout !== "single" && (
                  <input
                    type="text"
                    value={previewProps.cancelText}
                    onChange={(e) => setPreviewProps({ ...previewProps, cancelText: e.target.value })}
                    placeholder="Texte bouton Annuler"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
                  />
                )}
                <input
                  type="text"
                  value={previewProps.confirmText}
                  onChange={(e) => setPreviewProps({ ...previewProps, confirmText: e.target.value })}
                  placeholder="Texte bouton Confirmer"
                  className={cn(
                    "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent",
                    previewProps.buttonLayout === "single" && "col-span-2"
                  )}
                />
              </div>
              {previewProps.buttonLayout === "triple" && (
                <input
                  type="text"
                  value={previewProps.thirdButtonText}
                  onChange={(e) => setPreviewProps({ ...previewProps, thirdButtonText: e.target.value })}
                  placeholder="Texte 3ème bouton"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
                />
              )}
            </div>
          )}
        </div>

        {/* Section Style Dialog */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🎨 Style Dialog</label>
          <div className="space-y-3">
            {/* Animation rotation - CHECKBOX */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={previewProps.rotation}
                onChange={(e) => setPreviewProps({ ...previewProps, rotation: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Animation rotation (rotate-[-2deg] hover:rotate-0)</span>
            </label>

            {/* Taille modal - BUTTON GROUP */}
            <div>
              <label className="text-xs text-gray-600">Taille modal</label>
              <div className="flex gap-2">
                {(["sm", "md", "lg", "xl", "custom"] as const).map((size) => (
                  <Button
                    key={size}
                    size="sm"
                    variant={previewProps.maxWidth === size ? "default" : "outline"}
                    onClick={() => setPreviewProps({ ...previewProps, maxWidth: size })}
                    className={previewProps.maxWidth === size
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              {previewProps.maxWidth === "custom" && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    type="text"
                    value={previewProps.customWidth}
                    onChange={(e) => setPreviewProps({ ...previewProps, customWidth: e.target.value })}
                    placeholder="Largeur (ex: 600px, 90vw)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={previewProps.customHeight}
                    onChange={(e) => setPreviewProps({ ...previewProps, customHeight: e.target.value })}
                    placeholder="Hauteur (ex: 400px, 80vh)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Couleur bordure - BUTTON GROUP */}
            <div>
              <label className="text-xs text-gray-600">Couleur bordure</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "🟠 Orange", value: "thai-orange" as const },
                  { label: "🟢 Vert", value: "thai-green" as const },
                  { label: "🔴 Rouge", value: "red" as const },
                  { label: "🔵 Bleu", value: "blue" as const }
                ].map((color) => (
                  <Button
                    key={color.value}
                    size="sm"
                    variant={previewProps.borderColor === color.value ? "default" : "outline"}
                    onClick={() => setPreviewProps({ ...previewProps, borderColor: color.value })}
                    className={previewProps.borderColor === color.value
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
                  >
                    {color.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Épaisseur bordure - BUTTON GROUP */}
            <div>
              <label className="text-xs text-gray-600">Épaisseur bordure</label>
              <div className="flex gap-2">
                {[1, 2, 4].map((width) => (
                  <Button
                    key={width}
                    size="sm"
                    variant={previewProps.borderWidth === width ? "default" : "outline"}
                    onClick={() => setPreviewProps({ ...previewProps, borderWidth: width })}
                    className={previewProps.borderWidth === width
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
                  >
                    {width}px
                  </Button>
                ))}
              </div>
            </div>

            {/* Ombre - BUTTON GROUP */}
            <div>
              <label className="text-xs text-gray-600">Ombre</label>
              <div className="flex gap-2">
                {(["sm", "lg", "2xl"] as const).map((shadow) => (
                  <Button
                    key={shadow}
                    size="sm"
                    variant={previewProps.shadowSize === shadow ? "default" : "outline"}
                    onClick={() => setPreviewProps({ ...previewProps, shadowSize: shadow })}
                    className={previewProps.shadowSize === shadow
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
                  >
                    {shadow}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Réel (avec backdrop et rotation) */}
      <ModalVideo
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={previewProps.title}
        description={previewProps.description}
        media={previewProps.media}
        aspectRatio={previewProps.aspectRatio}
        polaroid={previewProps.polaroid}
        scrollingText={previewProps.scrollingText}
        scrollDuration={previewProps.scrollDuration}
        loopCount={previewProps.loopCount}
        buttonLayout={previewProps.buttonLayout}
        cancelText={previewProps.cancelText}
        confirmText={previewProps.confirmText}
        thirdButtonText={previewProps.thirdButtonText}
        rotation={previewProps.rotation}
        maxWidth={previewProps.maxWidth}
        customWidth={previewProps.maxWidth === "custom" ? previewProps.customWidth : undefined}
        customHeight={previewProps.maxWidth === "custom" ? previewProps.customHeight : undefined}
        borderColor={previewProps.borderColor}
        borderWidth={previewProps.borderWidth}
        shadowSize={previewProps.shadowSize}
        onCancel={() => console.log("Annulé !")}
        onConfirm={() => console.log("Confirmé !")}
        onThirdButton={() => console.log("Troisième bouton cliqué !")}
      />
    </div>
  )
}

export default function ModalsTestPage() {
  const { plats, isLoading } = useData()

  const NumberBadge = ({ number }: { number: number }) => (
    <span className="bg-thai-orange mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
      {number}
    </span>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">🪟 Test des Modales</h1>
        <p className="text-gray-600">
          Composants Dialog et Alert Dialog pour les interactions utilisateur
        </p>
        <div className="mt-4 flex gap-2">
          <Badge variant="outline" className="border-thai-orange text-thai-orange">
            Dialog & Alert
          </Badge>
          <Badge className="bg-thai-green">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Fonctionnel
          </Badge>
        </div>
      </div>

      {/* Section 1: Dialogues Simples */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">1. Dialogues d'Information</CardTitle>
          <CardDescription>
            Modales simples pour afficher du contenu ou des formulaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Dialog */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Modifier le profil</DialogTitle>
                    <DialogDescription>
                      Faites des changements à votre profil ici. Cliquez sur sauvegarder une fois
                      terminé.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom
                      </Label>
                      <Input id="name" defaultValue="Chanthana" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="username"
                        defaultValue="contact@chanthana.fr"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-thai-green hover:bg-thai-green/90">
                      Sauvegarder
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Terms Dialog */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Conditions Générales
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Conditions Générales de Vente</DialogTitle>
                    <DialogDescription>Dernière mise à jour : 23 Novembre 2025</DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[300px] overflow-y-auto text-sm text-gray-600">
                    <p className="mb-4">
                      <strong>1. Objet</strong>
                      <br />
                      Les présentes conditions régissent les ventes par la société Chanthana Thai
                      Cook.
                    </p>
                    <p className="mb-4">
                      <strong>2. Prix</strong>
                      <br />
                      Les prix de nos produits sont indiqués en euros toutes taxes comprises (TVA et
                      autres taxes applicables au jour de la commande), sauf indication contraire et
                      hors frais de traitement et d'expédition.
                    </p>
                    <p className="mb-4">
                      <strong>3. Commandes</strong>
                      <br />
                      Vous pouvez passer commande sur Internet : www.chanthanathaicook.fr. Les
                      informations contractuelles sont présentées en langue française et feront
                      l'objet d'une confirmation au plus tard au moment de la validation de votre
                      commande.
                    </p>
                    <p>
                      <strong>4. Validation</strong>
                      <br />
                      Vous déclarez avoir pris connaissance et accepté les présentes Conditions
                      générales de vente avant la passation de votre commande. La validation de
                      votre commande vaut donc acceptation de ces Conditions générales de vente.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button className="bg-thai-orange hover:bg-thai-orange/90">J'accepte</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Payment Dialog */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Paiement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Détails du paiement</DialogTitle>
                    <DialogDescription>
                      Entrez vos informations de carte bancaire pour finaliser la commande.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="card">Numéro de carte</Label>
                      <Input id="card" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiration</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                      Payer 24.90€
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Alert Dialogs (Confirmations) */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">2. Confirmations (Alert Dialog)</CardTitle>
          <CardDescription>
            Modales bloquantes pour les actions critiques nécessitant une confirmation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Delete Confirmation */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={4} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer le compte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela supprimera définitivement votre
                      compte et effacera vos données de nos serveurs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Oui, supprimer mon compte
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Logout Confirmation */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={5} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange/10 w-full"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Se déconnecter ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous devrez vous reconnecter pour accéder à votre panier et vos commandes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Rester connecté</AlertDialogCancel>
                    <AlertDialogAction className="bg-thai-orange hover:bg-thai-orange/90">
                      Se déconnecter
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Order Confirmation */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={6} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Valider la commande
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la commande</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous allez valider votre commande de 3 articles pour un total de 45.90€.
                      Voulez-vous continuer ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Modifier</AlertDialogCancel>
                    <AlertDialogAction className="bg-thai-green hover:bg-thai-green/90">
                      Confirmer et payer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Modales Métier */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">3. Modales Métier</CardTitle>
            <CardDescription className="mt-1.5">
              Composants modaux spécifiques à l'application (ex: Détails Plat)
              <br />
              <code className="text-xs text-gray-500">components\shared\CommandePlatModal.tsx</code>
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
                <DialogTitle>Propriétés de CommandePlatModal</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>plat</strong> (Plat): Objet plat complet (Requis)
                  </li>
                  <li>
                    <strong>isOpen</strong> (boolean): État d'ouverture du modal
                  </li>
                  <li>
                    <strong>onOpenChange</strong> (function): Callback changement d'état
                  </li>
                  <li>
                    <strong>formatPrix</strong> (function): Fonction de formatage du prix
                  </li>
                  <li>
                    <strong>onAddToCart</strong> (function): Callback ajout au panier
                  </li>
                  <li>
                    <strong>currentQuantity</strong> (number): Quantité initiale (défaut: 0)
                  </li>
                  <li>
                    <strong>currentSpiceDistribution</strong> (number[]): Répartition épices
                  </li>
                  <li>
                    <strong>dateRetrait</strong> (Date): Date de retrait affichée
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {/* CommandePlatModal Example - Button Trigger */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <NumberBadge number={7} />
                <span className="text-sm font-medium text-gray-600">Test Interactif</span>
              </div>
              {isLoading ? (
                <div className="p-4 text-sm text-gray-500">Chargement des données...</div>
              ) : plats && plats.length > 0 ? (
                (() => {
                  const platExemple =
                    plats.find((p) => p.plat.toLowerCase().includes("ailes de poulet")) ||
                    plats.find((p) => p.plat.toLowerCase().includes("pad thaï")) ||
                    plats[0]

                  const [isModalOpen, setIsModalOpen] = useState(false)

                  return (
                    <div className="rounded-lg border border-dashed p-4">
                      <Button
                        className="bg-thai-orange hover:bg-thai-orange/90 w-full"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Ouvrir le modal "{platExemple.plat}"
                      </Button>

                      <CommandePlatModal
                        isOpen={isModalOpen}
                        onOpenChange={setIsModalOpen}
                        plat={platExemple}
                        formatPrix={(p) => `${p.toFixed(2)}€`}
                        currentQuantity={2}
                        currentSpiceDistribution={[0, 1, 1, 0]}
                        dateRetrait={new Date()}
                        onAddToCart={(p, q, s, d) =>
                          console.log("Ajout au panier (Réel):", { p, q, s, d })
                        }
                      />
                      <p className="mt-2 text-center text-xs text-gray-500">
                        Cliquez pour voir le comportement réel du modal
                      </p>
                    </div>
                  )
                })()
              ) : (
                <div className="p-4 text-sm text-red-500">Aucune donnée disponible</div>
              )}
            </div>

            {/* CommandePlatModal Example - Inline Preview */}
            <div className="flex flex-col gap-2">
              <div className="flex h-6 items-center gap-2">
                <span className="pl-2 text-sm font-medium text-gray-600">Aperçu Visuel</span>
              </div>
              {isLoading ? (
                <div className="p-4 text-sm text-gray-500">Chargement...</div>
              ) : plats && plats.length > 0 ? (
                (() => {
                  const platExemple =
                    plats.find((p) => p.plat.toLowerCase().includes("nems")) || plats[0]

                  return (
                    <div className="relative mx-auto flex h-[500px] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                      <div className="absolute top-2 right-2 z-10 rounded bg-black/50 px-2 py-1 text-xs text-white">
                        Mode Aperçu
                      </div>
                      <CommandePlatContent
                        onOpenChange={() => console.log("Close requested")}
                        plat={platExemple}
                        formatPrix={(p) => `${p.toFixed(2)}€`}
                        currentQuantity={1}
                        currentSpiceDistribution={[1, 0, 0, 0]}
                        dateRetrait={new Date()}
                        standalone={true}
                        onAddToCart={(p, q, s, d) =>
                          console.log("Ajout au panier (Preview):", { p, q, s, d })
                        }
                      />
                    </div>
                  )
                })()
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Modal Vidéo */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">4. Modal Vidéo</CardTitle>
            <CardDescription className="mt-1.5">
              Modal personnalisé avec support vidéo/image et propriétés configurables
              <br />
              <code className="text-xs text-gray-500">components\ui\ModalVideo.tsx</code>
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
                <DialogTitle>Propriétés de ModalVideo</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>title</strong> (string): Titre du modal
                  </li>
                  <li>
                    <strong>description</strong> (string | ReactNode): Texte explicatif
                  </li>
                  <li>
                    <strong>media</strong> (string): URL .mp4, .webm, .gif, .jpg, .png, .svg
                  </li>
                  <li>
                    <strong>aspectRatio</strong> ("16:9" | "4:5" | "1:1"): Format de l'image/vidéo
                  </li>
                  <li>
                    <strong>polaroid</strong> (boolean): Style Polaroid avec bordure verte
                  </li>
                  <li>
                    <strong>scrollingText</strong> (boolean): Active animation marquee
                  </li>
                  <li>
                    <strong>scrollDuration</strong> (number): Durée scroll en secondes
                  </li>
                  <li>
                    <strong>loopCount</strong> (number): 0 = infini, 1 = une fois, n = n fois
                  </li>
                  <li>
                    <strong>cancelText</strong> (string): Texte bouton Annuler (défaut: "Annuler")
                  </li>
                  <li>
                    <strong>confirmText</strong> (string): Texte bouton Confirmer (défaut: "Confirmer")
                  </li>
                  <li>
                    <strong>onCancel</strong> (function): Callback bouton Annuler
                  </li>
                  <li>
                    <strong>onConfirm</strong> (function): Callback bouton Confirmer
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Playground avec Aperçu Visuel + Contrôles Interactifs */}
          <ModalVideoPlayground />
        </CardContent>
      </Card>
    </div>
  )
}
