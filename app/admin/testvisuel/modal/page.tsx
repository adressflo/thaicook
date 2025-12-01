"use client"

import { useState, useEffect } from "react"
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
import type { PlatUI } from "@/types/app"
import { ModalVideoContent } from "@/components/ui/ModalVideo"

// Composant Playground pour CommandePlatModal
function CommandePlatPlayground({ plats }: { plats: PlatUI[] }) {
  // Sélection du plat de base
  const [selectedPlatId, setSelectedPlatId] = useState<string>(plats[0]?.id?.toString() || "")

  // État pour les propriétés personnalisées
  const [customProps, setCustomProps] = useState({
    plat: "",
    description: "",
    prix: "0",
    photo_du_plat: "",
    niveau_epice: 0,
  })

  // État pour le modal réel
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mettre à jour les props quand on change de plat
  useEffect(() => {
    const plat = plats.find((p) => p.id === Number(selectedPlatId))
    if (plat) {
      setCustomProps({
        plat: plat.plat,
        description: plat.description || "",
        prix: plat.prix || "0",
        photo_du_plat: plat.photo_du_plat || "",
        niveau_epice: plat.niveau_epice || 0,
      })
    }
  }, [selectedPlatId, plats])

  // Plat combiné pour le rendu
  const displayPlat: PlatUI = {
    ...(plats.find((p) => p.id === Number(selectedPlatId)) || plats[0]),
    ...customProps,
    id: Number(selectedPlatId) || 0,
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Colonne de gauche : Contrôles */}
      <div className="space-y-4">
        <div className="border-thai-orange/20 rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
              <span className="text-xl">🎛️</span>
              Contrôles
            </h4>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-md transition-all hover:shadow-lg"
            >
              🎬 Ouvrir Modal Réel
            </Button>
          </div>

          <div className="space-y-4">
            {/* Sélection du plat de base */}
            <div className="space-y-2">
              <Label>Basé sur le plat</Label>
              <select
                className="focus:border-thai-orange focus:ring-thai-orange w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-1 focus:outline-none"
                value={selectedPlatId}
                onChange={(e) => setSelectedPlatId(e.target.value)}
              >
                {plats.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.plat}
                  </option>
                ))}
              </select>
            </div>

            {/* Inputs Texte */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom du plat</Label>
                <Input
                  value={customProps.plat}
                  onChange={(e) => setCustomProps({ ...customProps, plat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prix (€)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={customProps.prix}
                  onChange={(e) => setCustomProps({ ...customProps, prix: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="focus:border-thai-orange focus:ring-thai-orange w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-1 focus:outline-none"
                rows={3}
                value={customProps.description}
                onChange={(e) => setCustomProps({ ...customProps, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>URL Image</Label>
              <div className="flex gap-2">
                <Input
                  value={customProps.photo_du_plat}
                  onChange={(e) =>
                    setCustomProps({ ...customProps, photo_du_plat: e.target.value })
                  }
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCustomProps({ ...customProps, photo_du_plat: "" })}
                  title="Supprimer l'image"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer">Niveau épice 🌶️</Label>
                <select
                  className="focus:border-thai-orange focus:ring-thai-orange rounded-md border border-gray-300 p-1 text-sm focus:ring-1 focus:outline-none"
                  value={customProps.niveau_epice}
                  onChange={(e) =>
                    setCustomProps({ ...customProps, niveau_epice: parseInt(e.target.value) })
                  }
                >
                  <option value={0}>0 - Non épicé</option>
                  <option value={1}>1 - Peu épicé</option>
                  <option value={2}>2 - Moyennement épicé</option>
                  <option value={3}>3 - Très épicé</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne de droite : Aperçu */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-600">
            <span className="text-xl">👁️</span>
            Aperçu Visuel
          </h4>
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            Mode Standalone
          </Badge>
        </div>

        <div className="relative mx-auto flex h-[600px] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <CommandePlatContent
            onOpenChange={() => {}}
            plat={displayPlat}
            formatPrix={(p) => `${parseFloat(p.toString()).toFixed(2)}€`}
            currentQuantity={1}
            currentSpiceDistribution={[1, 0, 0, 0]}
            dateRetrait={new Date()}
            standalone={true}
            onAddToCart={(p, q, s, d) =>
              console.log("🛒 Action Panier (Preview):", { plat: p.plat, q, s, d })
            }
          />
        </div>
      </div>

      {/* Modal Réel */}
      <CommandePlatModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        plat={displayPlat}
        formatPrix={(p) => `${parseFloat(p.toString()).toFixed(2)}€`}
        currentQuantity={1}
        currentSpiceDistribution={[1, 0, 0, 0]}
        dateRetrait={new Date()}
        onAddToCart={(p, q, s, d) => {
          console.log("🛒 Action Panier (Réel):", { plat: p.plat, q, s, d })
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

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
    hoverScale: boolean
    maxWidth: "sm" | "md" | "lg" | "xl" | "custom"
    customWidth: string
    customHeight: string
    borderColor: "thai-orange" | "thai-green" | "red" | "blue" | "custom"
    customBorderColor: string // Couleur Tailwind custom (ex: "border-purple-500")
    borderWidth: number | "custom"
    customBorderWidth: number // Épaisseur custom (ex: 3, 5, 8)
    shadowSize: "none" | "sm" | "md" | "lg" | "xl" | "2xl"
    // Polaroid cadre custom
    polaroidPaddingSides: number // Padding gauche/droite (défaut 3 = p-3)
    polaroidPaddingTop: number // Padding haut (défaut 3 = pt-3)
    polaroidPaddingBottom: number // Padding bas (défaut 8 = pb-8)
    // Toggle fermeture
    autoClose: boolean // Si true, affiche le bouton X de fermeture (défaut: true)
    // Navigation (liens de redirection)
    cancelLink: string // URL de redirection pour le bouton Annuler
    confirmLink: string // URL de redirection pour le bouton Confirmer
    thirdButtonLink: string // URL de redirection pour le 3ème bouton
    // Position du modal
    position: "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "custom"
    customX: string // Position X custom
    customY: string // Position Y custom
    // Couleurs personnalisées - IDENTIQUE à ToasterVideo
    titleColor: "thai-green" | "thai-orange" | "white" | "black" | "thai-gold"
    titleFontWeight: "normal" | "medium" | "semibold" | "bold"
    descriptionColor: "thai-green" | "thai-orange" | "white" | "black" | "thai-gold"
    descriptionFontWeight: "normal" | "medium" | "semibold" | "bold"
    // Animation typing
    typingAnimation: boolean
    typingSpeed: number
    // Synchronisation marquee avec vidéo
    scrollSyncWithVideo: boolean
    // Animation bordure
    animateBorder: boolean
  }>({
    title: "Vidéo - <orange>Aperçu</orange>",
    description:
      "La <bold><orange>vidéo</orange></bold> tourne en boucle pour <semi-bold><green>démonstration</green></semi-bold>",
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
    hoverScale: false,
    maxWidth: "md",
    customWidth: "600px",
    customHeight: "",
    borderColor: "thai-orange",
    customBorderColor: "border-purple-500",
    borderWidth: 2,
    customBorderWidth: 3,
    shadowSize: "2xl",
    polaroidPaddingSides: 3,
    polaroidPaddingTop: 3,
    polaroidPaddingBottom: 8,
    autoClose: true,
    cancelLink: "",
    confirmLink: "",
    thirdButtonLink: "",
    position: "center",
    customX: "50%",
    customY: "50%",
    titleColor: "thai-green",
    titleFontWeight: "bold",
    descriptionColor: "thai-green",
    descriptionFontWeight: "semibold",
    typingAnimation: false,
    typingSpeed: 100,
    scrollSyncWithVideo: false,
    animateBorder: false,
  })

  // Envoyer les props au BroadcastChannel à chaque changement pour mise à jour temps réel
  useEffect(() => {
    const channel = new BroadcastChannel("preview_channel")
    channel.postMessage({
      type: "UPDATE_PROPS",
      payload: {
        component: "ModalVideo",
        ...previewProps,
      },
    })
    channel.close()
  }, [previewProps])

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
  scrollDuration={${previewProps.scrollDuration}}${previewProps.scrollSyncWithVideo ? `\n  scrollSyncWithVideo={true}` : ""}
  loopCount={${previewProps.loopCount}}
  autoClose={${previewProps.autoClose}}
  buttonLayout="${previewProps.buttonLayout}"
  cancelText="${previewProps.cancelText}"
  confirmText="${previewProps.confirmText}"
  thirdButtonText="${previewProps.thirdButtonText}"${previewProps.cancelLink ? `\n  cancelLink="${previewProps.cancelLink}"` : ""}${previewProps.confirmLink ? `\n  confirmLink="${previewProps.confirmLink}"` : ""}${previewProps.thirdButtonLink ? `\n  thirdButtonLink="${previewProps.thirdButtonLink}"` : ""}
  rotation={${previewProps.rotation}}
  hoverScale={${previewProps.hoverScale}}
  maxWidth="${previewProps.maxWidth}"${previewProps.maxWidth === "custom" && previewProps.customWidth ? `\n  customWidth="${previewProps.customWidth}"` : ""}${previewProps.maxWidth === "custom" && previewProps.customHeight ? `\n  customHeight="${previewProps.customHeight}"` : ""}
  borderColor="${previewProps.borderColor}"
  borderWidth={${previewProps.borderWidth}}
  shadowSize="${previewProps.shadowSize}"${previewProps.animateBorder ? `\n  animateBorder={true}` : ""}${previewProps.position !== "center" ? `\n  position="${previewProps.position}"` : ""}${previewProps.position === "custom" && previewProps.customX ? `\n  customX="${previewProps.customX}"` : ""}${previewProps.position === "custom" && previewProps.customY ? `\n  customY="${previewProps.customY}"` : ""}${previewProps.titleColor !== "thai-green" ? `\n  titleColor="${previewProps.titleColor}"` : ""}${previewProps.titleFontWeight !== "bold" ? `\n  titleFontWeight="${previewProps.titleFontWeight}"` : ""}${previewProps.descriptionColor !== "thai-green" ? `\n  descriptionColor="${previewProps.descriptionColor}"` : ""}${previewProps.descriptionFontWeight !== "semibold" ? `\n  descriptionFontWeight="${previewProps.descriptionFontWeight}"` : ""}${previewProps.polaroid && previewProps.polaroidPaddingSides !== 3 ? `\n  polaroidPaddingSides={${previewProps.polaroidPaddingSides}}` : ""}${previewProps.polaroid && previewProps.polaroidPaddingTop !== 3 ? `\n  polaroidPaddingTop={${previewProps.polaroidPaddingTop}}` : ""}${previewProps.polaroid && previewProps.polaroidPaddingBottom !== 8 ? `\n  polaroidPaddingBottom={${previewProps.polaroidPaddingBottom}}` : ""}${previewProps.typingAnimation ? `\n  typingAnimation={true}` : ""}${previewProps.typingAnimation && previewProps.typingSpeed !== 100 ? `\n  typingSpeed={${previewProps.typingSpeed}}` : ""}
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
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        {/* Contrôles Interactifs */}
        <div className="border-thai-orange/20 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
              <span className="text-xl">🎮</span>
              Contrôles Interactifs
            </h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set("component", "ModalVideo")
                  params.set("title", previewProps.title)
                  params.set("description", previewProps.description)
                  params.set("media", previewProps.media)
                  params.set("aspectRatio", previewProps.aspectRatio)
                  params.set("polaroid", previewProps.polaroid.toString())
                  params.set("scrollingText", previewProps.scrollingText.toString())
                  params.set("scrollDuration", previewProps.scrollDuration.toString())
                  params.set("loopCount", previewProps.loopCount.toString())
                  params.set("buttonLayout", previewProps.buttonLayout)
                  params.set("cancelText", previewProps.cancelText)
                  params.set("confirmText", previewProps.confirmText)
                  params.set("thirdButtonText", previewProps.thirdButtonText)
                  params.set("rotation", previewProps.rotation.toString())
                  params.set("hoverScale", previewProps.hoverScale.toString())
                  params.set("maxWidth", previewProps.maxWidth)
                  params.set("customWidth", previewProps.customWidth)
                  params.set("customHeight", previewProps.customHeight)
                  params.set("borderColor", previewProps.borderColor)
                  params.set("customBorderColor", previewProps.customBorderColor)
                  params.set("borderWidth", previewProps.borderWidth.toString())
                  params.set("customBorderWidth", previewProps.customBorderWidth.toString())
                  params.set("shadowSize", previewProps.shadowSize)
                  params.set("polaroidPaddingSides", previewProps.polaroidPaddingSides.toString())
                  params.set("polaroidPaddingTop", previewProps.polaroidPaddingTop.toString())
                  params.set("polaroidPaddingBottom", previewProps.polaroidPaddingBottom.toString())
                  params.set("autoClose", previewProps.autoClose.toString())
                  params.set("cancelLink", previewProps.cancelLink)
                  params.set("confirmLink", previewProps.confirmLink)
                  params.set("thirdButtonLink", previewProps.thirdButtonLink)
                  params.set("position", previewProps.position)
                  params.set("customX", previewProps.customX)
                  params.set("customY", previewProps.customY)
                  params.set("titleColor", previewProps.titleColor)
                  params.set("typingAnimation", previewProps.typingAnimation.toString())
                  params.set("typingSpeed", previewProps.typingSpeed.toString())
                  params.set("scrollSyncWithVideo", previewProps.scrollSyncWithVideo.toString())
                  params.set("animateBorder", previewProps.animateBorder.toString())
                  params.set("titleFontWeight", previewProps.titleFontWeight)
                  params.set("descriptionColor", previewProps.descriptionColor)
                  params.set("descriptionFontWeight", previewProps.descriptionFontWeight)

                  const channel = new BroadcastChannel("preview_channel")
                  channel.postMessage({
                    type: "UPDATE_PROPS",
                    payload: {
                      component: "ModalVideo",
                      ...previewProps,
                    },
                  })

                  window.open(`/preview?${params.toString()}`, "_blank", "width=600,height=700")
                }}
                className="border-blue-500 text-blue-500 transition-all duration-200 hover:bg-blue-500 hover:text-white"
              >
                👁️ Visualisation
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyCode}
                className="border-thai-green text-thai-green hover:bg-thai-green transition-all duration-200 hover:text-white"
              >
                📋 Copier le Code
              </Button>
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
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
                placeholder="Titre du modal (balises : <orange>, <bold>, etc.)"
                className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <textarea
                value={previewProps.description}
                onChange={(e) => setPreviewProps({ ...previewProps, description: e.target.value })}
                placeholder="Description (balises : <orange>, <green>, <bold>, <semi-bold>, etc.)"
                className="focus:ring-thai-orange w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 italic">
                💡 Astuce : Utilisez des balises pour styliser le texte :{" "}
                <code className="rounded bg-gray-100 px-1">&lt;orange&gt;mot&lt;/orange&gt;</code>{" "}
                <code className="rounded bg-gray-100 px-1">&lt;bold&gt;mot&lt;/bold&gt;</code>
              </p>
              <input
                type="text"
                value={previewProps.media}
                onChange={(e) => {
                  let path = e.target.value
                  // Nettoyer le chemin : enlever "public/" ou "public\" du début
                  path = path.replace(/^public[\/\\]/, "/")
                  // S'assurer qu'il commence par /
                  if (path && !path.startsWith("/")) {
                    path = "/" + path
                  }
                  setPreviewProps({ ...previewProps, media: path })
                }}
                placeholder="/media/avatars/phonevalid.svg (ou public/media/...)"
                className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPreviewProps({ ...previewProps, media: "/media/avatars/phonevalid.svg" })
                  }
                  className="border-thai-green/30 text-thai-green hover:bg-thai-green/10 flex-1"
                >
                  🖼️ Image
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPreviewProps({
                      ...previewProps,
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                    })
                  }
                  className="border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10 flex-1"
                >
                  🎬 Vidéo
                </Button>
              </div>
            </div>
          </div>

          {/* Section Couleurs */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">🎨 Couleurs du Texte</label>
            <div className="space-y-3">
              {/* Couleur du titre */}
              <div>
                <label className="text-xs text-gray-600">Couleur du titre</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "🟢 Vert", value: "thai-green" as const },
                    { label: "🟠 Orange", value: "thai-orange" as const },
                    { label: "⚪ Blanc", value: "white" as const },
                    { label: "⚫ Noir", value: "black" as const },
                    { label: "🟡 Or", value: "thai-gold" as const },
                  ].map((color) => (
                    <Button
                      key={color.value}
                      size="sm"
                      variant={previewProps.titleColor === color.value ? "default" : "outline"}
                      onClick={() => setPreviewProps({ ...previewProps, titleColor: color.value })}
                      className={
                        previewProps.titleColor === color.value
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {color.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Poids police titre - IDENTIQUE à ToasterVideo */}
              <div>
                <label className="text-xs text-gray-600">Poids police titre</label>
                <div className="flex flex-wrap gap-2">
                  {(["normal", "medium", "semibold", "bold"] as const).map((weight) => (
                    <Button
                      key={weight}
                      size="sm"
                      variant={previewProps.titleFontWeight === weight ? "default" : "outline"}
                      onClick={() => setPreviewProps({ ...previewProps, titleFontWeight: weight })}
                      className={
                        previewProps.titleFontWeight === weight
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {weight}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Couleur description - IDENTIQUE à ToasterVideo */}
              <div>
                <label className="text-xs text-gray-600">Couleur description</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "🟢 Vert", value: "thai-green" as const },
                    { label: "🟠 Orange", value: "thai-orange" as const },
                    { label: "⚪ Blanc", value: "white" as const },
                    { label: "⚫ Noir", value: "black" as const },
                    { label: "🟡 Or", value: "thai-gold" as const },
                  ].map((color) => (
                    <Button
                      key={color.value}
                      size="sm"
                      variant={previewProps.descriptionColor === color.value ? "default" : "outline"}
                      onClick={() => setPreviewProps({ ...previewProps, descriptionColor: color.value })}
                      className={
                        previewProps.descriptionColor === color.value
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {color.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Poids police description - IDENTIQUE à ToasterVideo */}
              <div>
                <label className="text-xs text-gray-600">Poids police description</label>
                <div className="flex flex-wrap gap-2">
                  {(["normal", "medium", "semibold", "bold"] as const).map((weight) => (
                    <Button
                      key={weight}
                      size="sm"
                      variant={previewProps.descriptionFontWeight === weight ? "default" : "outline"}
                      onClick={() => setPreviewProps({ ...previewProps, descriptionFontWeight: weight })}
                      className={
                        previewProps.descriptionFontWeight === weight
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {weight}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Info balises - Bouton dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-thai-orange/30 text-thai-green hover:bg-thai-orange/10 w-full gap-2"
                  >
                    <Info className="h-4 w-4" />
                    💡 Comment colorer le texte ?
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-thai-orange max-w-2xl border-2 bg-white shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-thai-green text-2xl font-bold">
                      🎨 Balises de Coloration et Style
                    </DialogTitle>
                    <DialogDescription className="text-thai-green/80">
                      Utilisez ces balises dans le titre et la description pour personnaliser le
                      texte
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Balises couleur */}
                    <div className="space-y-3">
                      <h4 className="text-thai-orange text-sm font-semibold">🌈 Balises Couleur</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <code className="shrink-0 rounded border bg-gray-100 px-2 py-1 text-xs">
                            &lt;orange&gt;texte&lt;/orange&gt;
                          </code>
                          <span className="text-gray-400">→</span>
                          <span className="text-thai-orange font-medium">texte en orange</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="shrink-0 rounded border bg-gray-100 px-2 py-1 text-xs">
                            &lt;green&gt;texte&lt;/green&gt;
                          </code>
                          <span className="text-gray-400">→</span>
                          <span className="text-thai-green font-medium">texte en vert</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="shrink-0 rounded border bg-gray-100 px-2 py-1 text-xs">
                            &lt;gold&gt;texte&lt;/gold&gt;
                          </code>
                          <span className="text-gray-400">→</span>
                          <span className="text-thai-gold font-medium">texte en or</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="shrink-0 rounded border bg-gray-100 px-2 py-1 text-xs">
                            &lt;white&gt;texte&lt;/white&gt;
                          </code>
                          <span className="text-gray-400">→</span>
                          <span className="rounded bg-gray-800 px-2 py-0.5 font-medium text-white">
                            texte en blanc
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="shrink-0 rounded border bg-gray-100 px-2 py-1 text-xs">
                            &lt;black&gt;texte&lt;/black&gt;
                          </code>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-black">texte en noir</span>
                        </div>
                      </div>
                    </div>

                    {/* Balises style */}
                    <div className="space-y-3">
                      <h4 className="text-thai-orange text-sm font-semibold">✨ Balises Style</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <code className="shrink-0 rounded border bg-gray-100 px-2 py-1 text-xs">
                            &lt;bold&gt;texte&lt;/bold&gt;
                          </code>
                          <span className="text-gray-400">→</span>
                          <span className="font-bold">texte en gras</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="shrink-0 rounded border bg-gray-100 px-2 py-1 text-xs">
                            &lt;semi-bold&gt;texte&lt;/semi-bold&gt;
                          </code>
                          <span className="text-gray-400">→</span>
                          <span className="font-semibold">texte semi-gras</span>
                        </div>
                      </div>
                    </div>

                    {/* Exemples */}
                    <div className="bg-thai-cream/30 border-thai-orange/20 space-y-3 rounded-lg border p-4">
                      <h4 className="text-thai-green text-sm font-semibold">📝 Exemples</h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="mb-1 text-gray-600">Code :</p>
                          <code className="block rounded border bg-white px-2 py-1">
                            "La &lt;orange&gt;vidéo&lt;/orange&gt; tourne en
                            &lt;green&gt;boucle&lt;/green&gt;"
                          </code>
                          <p className="mt-1 mb-1 text-gray-600">Résultat :</p>
                          <p className="text-base">
                            La <span className="text-thai-orange">vidéo</span> tourne en{" "}
                            <span className="text-thai-green">boucle</span>
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-gray-600">Code :</p>
                          <code className="block rounded border bg-white px-2 py-1">
                            "Découvrez nos
                            &lt;bold&gt;&lt;orange&gt;plats&lt;/orange&gt;&lt;/bold&gt;
                            authentiques"
                          </code>
                          <p className="mt-1 mb-1 text-gray-600">Résultat :</p>
                          <p className="text-base">
                            Découvrez nos <span className="text-thai-orange font-bold">plats</span>{" "}
                            authentiques
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button className="bg-thai-orange hover:bg-thai-orange/90 text-white">
                      Compris !
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Section Style */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">🖼️ Style Visuel</label>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.polaroid}
                  onChange={(e) => setPreviewProps({ ...previewProps, polaroid: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Polaroid (cadre blanc + bordure configurée)
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.scrollingText}
                  onChange={(e) =>
                    setPreviewProps({ ...previewProps, scrollingText: e.target.checked })
                  }
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Texte défilant (animation marquee)</span>
              </label>
              {previewProps.scrollingText && (
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">Durée:</label>
                    <input
                      type="number"
                      value={previewProps.scrollDuration}
                      onChange={(e) =>
                        setPreviewProps({
                          ...previewProps,
                          scrollDuration: parseInt(e.target.value) || 10,
                        })
                      }
                      className="focus:ring-thai-orange w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                      min="1"
                      max="60"
                      disabled={previewProps.scrollSyncWithVideo}
                    />
                    <span className="text-xs text-gray-600">secondes</span>
                  </div>
                  {/* Option synchronisation avec vidéo */}
                  {previewProps.media?.endsWith('.mp4') || previewProps.media?.endsWith('.webm') ? (
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={previewProps.scrollSyncWithVideo}
                        onChange={(e) =>
                          setPreviewProps({ ...previewProps, scrollSyncWithVideo: e.target.checked })
                        }
                        className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                      />
                      <span className="text-xs text-gray-700">
                        🔄 Synchroniser avec la vidéo (durée = vidéo × lectures)
                      </span>
                    </label>
                  ) : null}
                </div>
              )}
              {/* Animation Typing */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.typingAnimation}
                  onChange={(e) =>
                    setPreviewProps({ ...previewProps, typingAnimation: e.target.checked })
                  }
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Animation dactylographie (typing)</span>
              </label>
              {previewProps.typingAnimation && (
                <div className="ml-6 flex items-center gap-2">
                  <label className="text-xs text-gray-600">Vitesse:</label>
                  <input
                    type="number"
                    value={previewProps.typingSpeed}
                    onChange={(e) =>
                      setPreviewProps({
                        ...previewProps,
                        typingSpeed: parseInt(e.target.value) || 100,
                      })
                    }
                    className="focus:ring-thai-orange w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                    min="10"
                    max="500"
                    step="10"
                  />
                  <span className="text-xs text-gray-600">ms/caractère</span>
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
                  className={
                    previewProps.aspectRatio === ratio
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
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
                { label: "3x", value: 3 },
              ].map((loop) => (
                <Button
                  key={loop.value}
                  size="sm"
                  variant={previewProps.loopCount === loop.value ? "default" : "outline"}
                  onClick={() => setPreviewProps({ ...previewProps, loopCount: loop.value })}
                  className={
                    previewProps.loopCount === loop.value
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {loop.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Section Fermeture du modal */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">🔒 Fermeture du modal</label>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.autoClose}
                  onChange={(e) =>
                    setPreviewProps({ ...previewProps, autoClose: e.target.checked })
                  }
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Afficher le bouton X de fermeture (croix)
                </span>
              </label>
              <p className="ml-6 text-xs text-gray-500 italic">
                Si décoché, l'utilisateur devra utiliser les boutons d'action pour fermer le modal
              </p>
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
                { label: "3 boutons", value: "triple" as const },
              ].map((layout) => (
                <Button
                  key={layout.value}
                  size="sm"
                  variant={previewProps.buttonLayout === layout.value ? "default" : "outline"}
                  onClick={() => setPreviewProps({ ...previewProps, buttonLayout: layout.value })}
                  className={
                    previewProps.buttonLayout === layout.value
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {layout.label}
                </Button>
              ))}
            </div>
            {previewProps.buttonLayout !== "none" && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {previewProps.buttonLayout !== "single" && (
                    <input
                      type="text"
                      value={previewProps.cancelText}
                      onChange={(e) =>
                        setPreviewProps({ ...previewProps, cancelText: e.target.value })
                      }
                      placeholder="Texte bouton Annuler"
                      className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                  )}
                  <input
                    type="text"
                    value={previewProps.confirmText}
                    onChange={(e) =>
                      setPreviewProps({ ...previewProps, confirmText: e.target.value })
                    }
                    placeholder="Texte bouton Confirmer"
                    className={cn(
                      "focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none",
                      previewProps.buttonLayout === "single" && "col-span-2"
                    )}
                  />
                </div>
                {previewProps.buttonLayout === "triple" && (
                  <input
                    type="text"
                    value={previewProps.thirdButtonText}
                    onChange={(e) =>
                      setPreviewProps({ ...previewProps, thirdButtonText: e.target.value })
                    }
                    placeholder="Texte 3ème bouton"
                    className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                  />
                )}

                {/* Champs de liens de redirection */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <label className="text-xs font-medium text-gray-700">
                    🔗 Liens de redirection (optionnels)
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {previewProps.buttonLayout !== "single" && (
                      <input
                        type="text"
                        value={previewProps.cancelLink}
                        onChange={(e) =>
                          setPreviewProps({ ...previewProps, cancelLink: e.target.value })
                        }
                        placeholder="URL Annuler (ex: /accueil)"
                        className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    )}
                    <input
                      type="text"
                      value={previewProps.confirmLink}
                      onChange={(e) =>
                        setPreviewProps({ ...previewProps, confirmLink: e.target.value })
                      }
                      placeholder="URL Confirmer (ex: /confirmation)"
                      className={cn(
                        "focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none",
                        previewProps.buttonLayout === "single" && "col-span-2"
                      )}
                    />
                  </div>
                  {previewProps.buttonLayout === "triple" && (
                    <input
                      type="text"
                      value={previewProps.thirdButtonLink}
                      onChange={(e) =>
                        setPreviewProps({ ...previewProps, thirdButtonLink: e.target.value })
                      }
                      placeholder="URL 3ème bouton (ex: /autre-page)"
                      className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section Style Dialog */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">🎨 Style Dialog</label>
            <div className="space-y-3">
              {/* Animation rotation - CHECKBOX */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.rotation}
                  onChange={(e) => setPreviewProps({ ...previewProps, rotation: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Animation rotation (rotate-[-2deg] hover:rotate-0)
                </span>
              </label>

              {/* Effet scale au hover - CHECKBOX */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.hoverScale}
                  onChange={(e) => setPreviewProps({ ...previewProps, hoverScale: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Effet scale au hover (hover:scale-105)
                </span>
              </label>

              {/* Animation bordure pulsante - CHECKBOX */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.animateBorder}
                  onChange={(e) => setPreviewProps({ ...previewProps, animateBorder: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  ✨ Animation bordure pulsante (couleur dynamique)
                </span>
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
                      className={
                        previewProps.maxWidth === size
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {previewProps.maxWidth === "custom" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={previewProps.customWidth}
                      onChange={(e) =>
                        setPreviewProps({ ...previewProps, customWidth: e.target.value })
                      }
                      placeholder="Largeur (ex: 600px, 90vw)"
                      className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={previewProps.customHeight}
                      onChange={(e) =>
                        setPreviewProps({ ...previewProps, customHeight: e.target.value })
                      }
                      placeholder="Hauteur (ex: 400px, 80vh)"
                      className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Couleur bordure - BUTTON GROUP */}
              <div>
                <label className="text-xs text-gray-600">Couleur bordure</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "🟠 Orange", value: "thai-orange" as const },
                    { label: "🟢 Vert", value: "thai-green" as const },
                    { label: "🔴 Rouge", value: "red" as const },
                    { label: "🔵 Bleu", value: "blue" as const },
                    { label: "🎨 Custom", value: "custom" as const },
                  ].map((color) => (
                    <Button
                      key={color.value}
                      size="sm"
                      variant={previewProps.borderColor === color.value ? "default" : "outline"}
                      onClick={() => setPreviewProps({ ...previewProps, borderColor: color.value })}
                      className={
                        previewProps.borderColor === color.value
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {color.label}
                    </Button>
                  ))}
                </div>
                {previewProps.borderColor === "custom" && (
                  <input
                    type="text"
                    value={previewProps.customBorderColor}
                    onChange={(e) =>
                      setPreviewProps({ ...previewProps, customBorderColor: e.target.value })
                    }
                    placeholder="ex: border-purple-500, border-pink-600"
                    className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                  />
                )}
              </div>

              {/* Épaisseur bordure - BUTTON GROUP */}
              <div>
                <label className="text-xs text-gray-600">Épaisseur bordure</label>
                <div className="flex gap-2">
                  {[1, 2, 4, "custom"].map((width) => (
                    <Button
                      key={width}
                      size="sm"
                      variant={previewProps.borderWidth === width ? "default" : "outline"}
                      onClick={() =>
                        setPreviewProps({
                          ...previewProps,
                          borderWidth: width as number | "custom",
                        })
                      }
                      className={
                        previewProps.borderWidth === width
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {width === "custom" ? "🎨 Custom" : `${width}px`}
                    </Button>
                  ))}
                </div>
                {previewProps.borderWidth === "custom" && (
                  <input
                    type="number"
                    value={previewProps.customBorderWidth}
                    onChange={(e) =>
                      setPreviewProps({
                        ...previewProps,
                        customBorderWidth: Number(e.target.value),
                      })
                    }
                    placeholder="ex: 3, 5, 8"
                    min={1}
                    max={20}
                    className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                  />
                )}
              </div>

              {/* Ombre - BUTTON GROUP */}
              <div>
                <label className="text-xs text-gray-600">Ombre</label>
                <div className="flex gap-2">
                  {(["none", "sm", "md", "lg", "xl", "2xl"] as const).map((shadow) => (
                    <Button
                      key={shadow}
                      size="sm"
                      variant={previewProps.shadowSize === shadow ? "default" : "outline"}
                      onClick={() => setPreviewProps({ ...previewProps, shadowSize: shadow })}
                      className={
                        previewProps.shadowSize === shadow
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {shadow}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Position du modal - BUTTON GROUP */}
              <div>
                <label className="text-xs text-gray-600">📍 Position du modal</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "🎯 Centre", value: "center" as const },
                    { label: "↘️ Bas droite", value: "bottom-right" as const },
                    { label: "↙️ Bas gauche", value: "bottom-left" as const },
                    { label: "↗️ Haut droite", value: "top-right" as const },
                    { label: "↖️ Haut gauche", value: "top-left" as const },
                    { label: "🎨 Custom", value: "custom" as const },
                  ].map((pos) => (
                    <Button
                      key={pos.value}
                      size="sm"
                      variant={previewProps.position === pos.value ? "default" : "outline"}
                      onClick={() => setPreviewProps({ ...previewProps, position: pos.value })}
                      className={
                        previewProps.position === pos.value
                          ? "bg-thai-orange hover:bg-thai-orange/90"
                          : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                      }
                    >
                      {pos.label}
                    </Button>
                  ))}
                </div>
                {previewProps.position === "custom" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={previewProps.customX}
                      onChange={(e) =>
                        setPreviewProps({ ...previewProps, customX: e.target.value })
                      }
                      placeholder="Position X (ex: 50%, 100px)"
                      className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={previewProps.customY}
                      onChange={(e) =>
                        setPreviewProps({ ...previewProps, customY: e.target.value })
                      }
                      placeholder="Position Y (ex: 50%, 100px)"
                      className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Taille cadre Polaroid - CUSTOM INPUTS */}
              {previewProps.polaroid && (
                <div className="border-thai-green/30 bg-thai-cream/20 space-y-2 rounded-lg border-2 p-3">
                  <label className="text-thai-green text-xs font-medium">
                    📐 Taille cadre Polaroid (padding)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">Côtés (p-x)</label>
                      <input
                        type="number"
                        value={previewProps.polaroidPaddingSides}
                        onChange={(e) =>
                          setPreviewProps({
                            ...previewProps,
                            polaroidPaddingSides: Number(e.target.value),
                          })
                        }
                        min={0}
                        max={20}
                        className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Haut (pt-x)</label>
                      <input
                        type="number"
                        value={previewProps.polaroidPaddingTop}
                        onChange={(e) =>
                          setPreviewProps({
                            ...previewProps,
                            polaroidPaddingTop: Number(e.target.value),
                          })
                        }
                        min={0}
                        max={20}
                        className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Bas (pb-x)</label>
                      <input
                        type="number"
                        value={previewProps.polaroidPaddingBottom}
                        onChange={(e) =>
                          setPreviewProps({
                            ...previewProps,
                            polaroidPaddingBottom: Number(e.target.value),
                          })
                        }
                        min={0}
                        max={20}
                        className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    Valeurs Tailwind : 0-20 correspondent à p-0 jusqu'à p-20 (ex: 3 = 0.75rem)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Colonne de droite : Aperçu */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-600">
            <span className="text-xl">👁️</span>
            Aperçu Visuel
          </h4>
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            Mode Standalone
          </Badge>
        </div>

        <div className={cn(
          "relative mx-auto flex h-[600px] w-full max-w-md flex-col rounded-xl border border-gray-200 bg-gray-50 shadow-2xl",
          previewProps.animateBorder ? "overflow-visible" : "overflow-hidden"
        )}>
          <div className="flex-1 overflow-y-auto">
            <ModalVideoContent
              onOpenChange={() => {}}
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
              titleColor={previewProps.titleColor}
              borderColor={
                previewProps.borderColor === "custom"
                  ? previewProps.customBorderColor
                  : previewProps.borderColor
              }
              borderWidth={
                previewProps.borderWidth === "custom"
                  ? previewProps.customBorderWidth
                  : previewProps.borderWidth
              }
              shadowSize={previewProps.shadowSize}
              polaroidPaddingSides={previewProps.polaroidPaddingSides}
              polaroidPaddingTop={previewProps.polaroidPaddingTop}
              polaroidPaddingBottom={previewProps.polaroidPaddingBottom}
              autoClose={previewProps.autoClose}
              cancelLink={previewProps.cancelLink}
              confirmLink={previewProps.confirmLink}
              thirdButtonLink={previewProps.thirdButtonLink}
              typingAnimation={previewProps.typingAnimation}
              typingSpeed={previewProps.typingSpeed}
              scrollSyncWithVideo={previewProps.scrollSyncWithVideo}
              animateBorder={previewProps.animateBorder}
              hoverScale={previewProps.hoverScale}
              titleFontWeight={previewProps.titleFontWeight}
              descriptionColor={previewProps.descriptionColor}
              descriptionFontWeight={previewProps.descriptionFontWeight}
              standalone={true}
              onCancel={() => console.log("Annulé (Preview)")}
              onConfirm={() => console.log("Confirmé (Preview)")}
              onThirdButton={() => console.log("Troisième bouton (Preview)")}
            />
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
        hoverScale={previewProps.hoverScale}
        maxWidth={previewProps.maxWidth}
        customWidth={previewProps.maxWidth === "custom" ? previewProps.customWidth : undefined}
        customHeight={previewProps.maxWidth === "custom" ? previewProps.customHeight : undefined}
        titleColor={previewProps.titleColor}
        borderColor={
          previewProps.borderColor === "custom"
            ? previewProps.customBorderColor
            : previewProps.borderColor
        }
        borderWidth={
          previewProps.borderWidth === "custom"
            ? previewProps.customBorderWidth
            : previewProps.borderWidth
        }
        shadowSize={previewProps.shadowSize}
        position={previewProps.position}
        customX={previewProps.position === "custom" ? previewProps.customX : undefined}
        customY={previewProps.position === "custom" ? previewProps.customY : undefined}
        polaroidPaddingSides={previewProps.polaroidPaddingSides}
        polaroidPaddingTop={previewProps.polaroidPaddingTop}
        polaroidPaddingBottom={previewProps.polaroidPaddingBottom}
        autoClose={previewProps.autoClose}
        cancelLink={previewProps.cancelLink}
        confirmLink={previewProps.confirmLink}
        thirdButtonLink={previewProps.thirdButtonLink}
        typingAnimation={previewProps.typingAnimation}
        typingSpeed={previewProps.typingSpeed}
        scrollSyncWithVideo={previewProps.scrollSyncWithVideo}
        animateBorder={previewProps.animateBorder}
        titleFontWeight={previewProps.titleFontWeight}
        descriptionColor={previewProps.descriptionColor}
        descriptionFontWeight={previewProps.descriptionFontWeight}
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
          {/* CommandePlatModal Playground */}
          <div className="col-span-2">
            {isLoading ? (
              <div className="p-4 text-sm text-gray-500">Chargement des données...</div>
            ) : plats && plats.length > 0 ? (
              <CommandePlatPlayground plats={plats} />
            ) : (
              <div className="p-4 text-sm text-red-500">Aucune donnée disponible</div>
            )}
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
                    <strong>confirmText</strong> (string): Texte bouton Confirmer (défaut:
                    "Confirmer")
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
