"use client"

import { CommandePlatContent, CommandePlatModal } from "@/components/shared/CommandePlatModal"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModalVideo } from "@/components/ui/ModalVideo"
import { useData } from "@/contexts/DataContext"
import { getStorageUrl, STORAGE_DEFAULTS } from "@/lib/storage-utils"
import { cn } from "@/lib/utils"
import type { PlatUI } from "@/types/app"
import { CheckCircle2, CreditCard, Info, Settings, Trash2, User } from "lucide-react"
import { useEffect, useState } from "react"

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
    // Animation de sortie
    animateOut: boolean
    mangaExplosion: boolean
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

    animateOut: false,
    mangaExplosion: false,
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
  shadowSize="${previewProps.shadowSize}"${previewProps.animateBorder ? `\n  animateBorder={true}` : ""}${!previewProps.animateOut ? `\n  animateOut={false}` : ""}${previewProps.mangaExplosion ? `\n  mangaExplosion={true}` : ""}${previewProps.position !== "center" ? `\n  position="${previewProps.position}"` : ""}${previewProps.position === "custom" && previewProps.customX ? `\n  customX="${previewProps.customX}"` : ""}${previewProps.position === "custom" && previewProps.customY ? `\n  customY="${previewProps.customY}"` : ""}${previewProps.titleColor !== "thai-green" ? `\n  titleColor="${previewProps.titleColor}"` : ""}${previewProps.titleFontWeight !== "bold" ? `\n  titleFontWeight="${previewProps.titleFontWeight}"` : ""}${previewProps.descriptionColor !== "thai-green" ? `\n  descriptionColor="${previewProps.descriptionColor}"` : ""}${previewProps.descriptionFontWeight !== "semibold" ? `\n  descriptionFontWeight="${previewProps.descriptionFontWeight}"` : ""}${previewProps.polaroid && previewProps.polaroidPaddingSides !== 3 ? `\n  polaroidPaddingSides={${previewProps.polaroidPaddingSides}}` : ""}${previewProps.polaroid && previewProps.polaroidPaddingTop !== 3 ? `\n  polaroidPaddingTop={${previewProps.polaroidPaddingTop}}` : ""}${previewProps.polaroid && previewProps.polaroidPaddingBottom !== 8 ? `\n  polaroidPaddingBottom={${previewProps.polaroidPaddingBottom}}` : ""}${previewProps.typingAnimation ? `\n  typingAnimation={true}` : ""}${previewProps.typingAnimation && previewProps.typingSpeed !== 100 ? `\n  typingSpeed={${previewProps.typingSpeed}}` : ""}
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
    <div className="mx-auto max-w-3xl space-y-8">
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
                  params.set("descriptionColor", previewProps.descriptionColor)
                  params.set("descriptionFontWeight", previewProps.descriptionFontWeight)
                  params.set("mangaExplosion", previewProps.mangaExplosion.toString())
                  params.set("animateOut", previewProps.animateOut.toString())

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

          {/* Style & Animation texte */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">Style & Animation texte</h5>

            {/* Couleurs du Texte */}
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

              {/* Poids police titre */}
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

              {/* Couleur description */}
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
                      variant={
                        previewProps.descriptionColor === color.value ? "default" : "outline"
                      }
                      onClick={() =>
                        setPreviewProps({ ...previewProps, descriptionColor: color.value })
                      }
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

              {/* Poids police description */}
              <div>
                <label className="text-xs text-gray-600">Poids police description</label>
                <div className="flex flex-wrap gap-2">
                  {(["normal", "medium", "semibold", "bold"] as const).map((weight) => (
                    <Button
                      key={weight}
                      size="sm"
                      variant={
                        previewProps.descriptionFontWeight === weight ? "default" : "outline"
                      }
                      onClick={() =>
                        setPreviewProps({ ...previewProps, descriptionFontWeight: weight })
                      }
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

            {/* Animation Typing */}
            <div className="space-y-2">
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

            {/* Texte défilant (Marquee) */}
            <div className="space-y-2">
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
                  {previewProps.media?.endsWith(".mp4") || previewProps.media?.endsWith(".webm") ? (
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={previewProps.scrollSyncWithVideo}
                        onChange={(e) =>
                          setPreviewProps({
                            ...previewProps,
                            scrollSyncWithVideo: e.target.checked,
                          })
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
            </div>
          </div>

          {/* Style & Animation bordure animate */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">
              Style & Animation bordure animate
            </h5>

            {/* Couleur bordure */}
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

            {/* Épaisseur bordure */}
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

            {/* Ombre */}
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

            {/* Taille modal */}
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

            {/* Format d'image */}
            <div>
              <label className="text-xs text-gray-600">Format d'image</label>
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

            {/* Animation bordure pulsante */}
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={previewProps.animateBorder}
                onChange={(e) =>
                  setPreviewProps({ ...previewProps, animateBorder: e.target.checked })
                }
                className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                ✨ Animation bordure pulsante (couleur dynamique)
              </span>
            </label>

            {/* Animation rotation */}
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

            {/* Effet scale au hover */}
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={previewProps.hoverScale}
                onChange={(e) => setPreviewProps({ ...previewProps, hoverScale: e.target.checked })}
                className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Effet scale au hover (hover:scale-105)</span>
            </label>

            {/* Polaroid */}
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

          {/* Style & Animation fermeture */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">Style & Animation fermeture</h5>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.animateOut}
                  onChange={(e) =>
                    setPreviewProps({ ...previewProps, animateOut: e.target.checked })
                  }
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Animation de sortie (fade-out + zoom-out)
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={previewProps.mangaExplosion}
                  onChange={(e) =>
                    setPreviewProps({ ...previewProps, mangaExplosion: e.target.checked })
                  }
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Manga Explosion (Orange Thai)</span>
              </label>
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
              {!previewProps.autoClose && (
                <p className="ml-6 text-xs text-gray-500 italic">
                  Si décoché, l'utilisateur devra utiliser les boutons d'action pour fermer le modal
                </p>
              )}
            </div>

            {/* Nombre de lectures */}
            <div className="mt-2">
              <label className="text-xs font-medium text-gray-700">🎬 Nombre de lectures</label>
              <div className="mt-1 flex flex-wrap gap-2">
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
                <Button
                  size="sm"
                  variant={![0, 1, 3].includes(previewProps.loopCount) ? "default" : "outline"}
                  onClick={() => setPreviewProps({ ...previewProps, loopCount: 5 })}
                  className={
                    ![0, 1, 3].includes(previewProps.loopCount)
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  Custom
                </Button>
              </div>
              {![0, 1, 3].includes(previewProps.loopCount) && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    value={previewProps.loopCount}
                    onChange={(e) =>
                      setPreviewProps({
                        ...previewProps,
                        loopCount: Math.max(1, Number(e.target.value)),
                      })
                    }
                    min={1}
                    max={50}
                    className="focus:ring-thai-orange w-20 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                  />
                  <span className="text-xs text-gray-600">fois</span>
                </div>
              )}
            </div>
          </div>

          {/* Section Position */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Position du Modal</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Bas droite", value: "bottom-right" as const },
                { label: "Bas gauche", value: "bottom-left" as const },
                { label: "Haut droite", value: "top-right" as const },
                { label: "Haut gauche", value: "top-left" as const },
                { label: "Centre", value: "center" as const },
                { label: "Custom", value: "custom" as const },
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
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Position X (left)</label>
                  <input
                    type="text"
                    value={previewProps.customX}
                    onChange={(e) => setPreviewProps({ ...previewProps, customX: e.target.value })}
                    placeholder="ex: 50%, 100px, 10vw"
                    className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Position Y (top)</label>
                  <input
                    type="text"
                    value={previewProps.customY}
                    onChange={(e) => setPreviewProps({ ...previewProps, customY: e.target.value })}
                    placeholder="ex: 50%, 100px, 10vh"
                    className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
            )}
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
            : (previewProps.borderWidth as number)
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
        animateOut={previewProps.animateOut}
        mangaExplosion={previewProps.mangaExplosion}
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

// Composant Playground pour les variantes Readonly de CommandePlatModal
function ReadonlyModalPlayground({ plats }: { plats: PlatUI[] }) {
  const [selectedPlatId, setSelectedPlatId] = useState<string>(plats[0]?.id?.toString() || "")
  const [activeVariant, setActiveVariant] = useState<string>("interactive")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Nouveaux états pour les contrôles
  const [modalSize, setModalSize] = useState<"sm" | "md" | "lg" | "xl" | "custom">("md")
  const [imageFormat, setImageFormat] = useState<"16:9" | "4:5" | "1:1" | "auto">("auto")
  const [modalPosition, setModalPosition] = useState<
    "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "custom"
  >("center")

  // Toggles pour les sections
  const [showImage, setShowImage] = useState(true)
  const [showBadge, setShowBadge] = useState(true)
  const [showBadgeDisponible, setShowBadgeDisponible] = useState(true)
  const [showBadgeExtra, setShowBadgeExtra] = useState(true)
  const [showBadgePanier, setShowBadgePanier] = useState(true)
  const [showDescription, setShowDescription] = useState(true)
  const [showPrice, setShowPrice] = useState(true)
  const [showQuantitySelector, setShowQuantitySelector] = useState(true)
  const [showSpiceSelector, setShowSpiceSelector] = useState(true)
  const [showAddToCartButton, setShowAddToCartButton] = useState(true)
  const [show3DTilt, setShow3DTilt] = useState(true)

  // Animation & Style fermeture
  const [exitAnimation, setExitAnimation] = useState<
    "fade-zoom" | "fade-out" | "manga-explosion" | "none"
  >("fade-zoom")
  const [showCloseButton, setShowCloseButton] = useState(false)

  const selectedPlat = plats.find((p) => p.id === Number(selectedPlatId)) || plats[0]

  // Options de toggle pour les sections
  const sectionToggles = [
    { id: "image", label: "Image", state: showImage, setter: setShowImage },
    { id: "badge", label: "Badges (tous)", state: showBadge, setter: setShowBadge },
    { id: "description", label: "Description", state: showDescription, setter: setShowDescription },
    { id: "price", label: "Prix", state: showPrice, setter: setShowPrice },
    {
      id: "quantity",
      label: "Sélecteur quantité",
      state: showQuantitySelector,
      setter: setShowQuantitySelector,
    },
    {
      id: "spice",
      label: "Sélecteur épice",
      state: showSpiceSelector,
      setter: setShowSpiceSelector,
    },
    {
      id: "button",
      label: "Bouton panier",
      state: showAddToCartButton,
      setter: setShowAddToCartButton,
    },
    { id: "tilt", label: "Effet 3D Tilt", state: show3DTilt, setter: setShow3DTilt },
  ]

  // Options de toggle pour les badges individuels
  const badgeToggles = [
    {
      id: "disponible",
      label: "🟢 Disponible",
      state: showBadgeDisponible,
      setter: setShowBadgeDisponible,
      color: "bg-thai-green",
    },
    {
      id: "extra",
      label: "🟡 Extra",
      state: showBadgeExtra,
      setter: setShowBadgeExtra,
      color: "bg-thai-gold",
    },
    {
      id: "panier",
      label: "🟠 Panier",
      state: showBadgePanier,
      setter: setShowBadgePanier,
      color: "bg-thai-orange",
    },
  ]

  // Options de taille
  const sizeOptions = [
    { id: "sm", label: "sm" },
    { id: "md", label: "md" },
    { id: "lg", label: "lg" },
    { id: "xl", label: "xl" },
    { id: "custom", label: "custom" },
  ]

  // Options de format d'image
  const imageFormatOptions = [
    { id: "16:9", label: "16:9" },
    { id: "4:5", label: "4:5" },
    { id: "1:1", label: "1:1" },
    { id: "auto", label: "auto" },
  ]

  // Options de position
  const positionOptions = [
    { id: "bottom-right", label: "Bas droite" },
    { id: "bottom-left", label: "Bas gauche" },
    { id: "top-right", label: "Haut droite" },
    { id: "top-left", label: "Haut gauche" },
    { id: "center", label: "Centre" },
    { id: "custom", label: "Custom" },
  ]

  // Variantes de test
  const variants = [
    {
      id: "readonly-simple",
      label: "Readonly Simple",
      description: "Photo + nom + description + badge (pour suivi-evenement)",
      props: { mode: "readonly" as const, showPriceDetails: false },
    },
    {
      id: "readonly-prix",
      label: "Readonly avec Prix",
      description: "Cartes quantité/prix/sous-total (pour suivi-commande)",
      props: {
        mode: "readonly" as const,
        showPriceDetails: true,
        detail: { quantite_plat_commande: 3 },
      },
    },
    {
      id: "readonly-extra",
      label: "Readonly Extra",
      description: "Affichage d'un extra avec badge 'Extra'",
      props: {
        mode: "readonly" as const,
        showPriceDetails: true,
        extra: {
          idextra: 1,
          nom_extra: "Riz parfumé thaï",
          description: "Riz jasmin cuit à la vapeur",
          prix: "3.50",
          photo_url: getStorageUrl(STORAGE_DEFAULTS.EXTRA),
          created_at: new Date().toISOString(),
        },
        detail: { quantite_plat_commande: 2, type: "extra" as const } as any,
      },
    },
    {
      id: "interactive",
      label: "Interactive (actuel)",
      description: "Quantité + Spice + bouton panier (pour /commander)",
      props: { mode: "interactive" as const },
    },
  ]

  const currentVariant = variants.find((v) => v.id === activeVariant) || variants[0]

  const formatPrix = (prix: number) => `${prix.toFixed(2)}€`

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Colonne gauche : Contrôles */}
      <div className="space-y-4">
        <div className="border-thai-orange/20 rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
              <span className="text-xl">🎛️</span>
              Contrôles Variantes
            </h4>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-md transition-all hover:shadow-lg"
            >
              🎬 Ouvrir Modal
            </Button>
          </div>

          <div className="space-y-4">
            {/* Sélection du plat */}
            <div className="space-y-2">
              <Label>Plat de base</Label>
              <select
                className="focus:border-thai-orange focus:ring-thai-orange w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-1 focus:outline-none"
                value={selectedPlatId}
                onChange={(e) => setSelectedPlatId(e.target.value)}
              >
                {plats.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.plat} - {formatPrix(parseFloat(p.prix || "0"))}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection de la variante */}
            <div className="space-y-2">
              <Label>Variante à tester</Label>
              <div className="space-y-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setActiveVariant(variant.id)}
                    className={cn(
                      "w-full rounded-lg border-2 p-3 text-left transition-all",
                      activeVariant === variant.id
                        ? "border-thai-orange bg-thai-orange/5"
                        : "hover:border-thai-orange/50 border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full",
                          activeVariant === variant.id ? "bg-thai-orange" : "bg-gray-300"
                        )}
                      />
                      <span className="font-medium">{variant.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{variant.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Taille modal */}
            <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 space-y-2 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
              <Label className="text-thai-green font-medium">📐 Taille modal</Label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setModalSize(option.id as typeof modalSize)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105",
                      modalSize === option.id
                        ? "border-thai-orange bg-thai-orange text-white shadow-md"
                        : "hover:border-thai-orange/50 border-gray-300 bg-white text-gray-700 hover:shadow-sm"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format d'image */}
            <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 space-y-2 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
              <Label className="text-thai-green font-medium">🖼️ Format d'image</Label>
              <div className="flex flex-wrap gap-2">
                {imageFormatOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setImageFormat(option.id as typeof imageFormat)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105",
                      imageFormat === option.id
                        ? "border-thai-orange bg-thai-orange text-white shadow-md"
                        : "hover:border-thai-orange/50 border-gray-300 bg-white text-gray-700 hover:shadow-sm"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position du Modal */}
            <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 space-y-2 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
              <Label className="text-thai-green font-medium">📍 Position du Modal</Label>
              <div className="flex flex-wrap gap-2">
                {positionOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setModalPosition(option.id as typeof modalPosition)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105",
                      modalPosition === option.id
                        ? "border-thai-orange bg-thai-orange text-white shadow-md"
                        : "hover:border-thai-orange/50 border-gray-300 bg-white text-gray-700 hover:shadow-sm"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections activées/désactivées */}
            <div className="hover:bg-thai-cream/20 hover:border-thai-green hover:ring-thai-green/30 space-y-2 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:ring-2">
              <Label className="text-thai-green font-medium">👁️ Sections (activé/désactivé)</Label>
              <div className="grid grid-cols-2 gap-2">
                {sectionToggles.map((toggle) => (
                  <button
                    key={toggle.id}
                    onClick={() => toggle.setter(!toggle.state)}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                      toggle.state
                        ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm"
                        : "border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-sm"
                    )}
                  >
                    <span>{toggle.label}</span>
                    <span className="text-xs">{toggle.state ? "✓" : "✗"}</span>
                  </button>
                ))}
              </div>

              {/* Badges individuels (sous-section) */}
              {showBadge && (
                <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                  <span className="text-xs font-medium text-gray-600">🏷️ Badges individuels</span>
                  <div className="flex flex-wrap gap-2">
                    {badgeToggles.map((badge) => (
                      <button
                        key={badge.id}
                        onClick={() => badge.setter(!badge.state)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105",
                          badge.state
                            ? `${badge.color} border-transparent text-white shadow-md`
                            : "border-gray-300 bg-gray-100 text-gray-500 hover:border-gray-400"
                        )}
                      >
                        <span>{badge.label}</span>
                        <span className="text-[10px]">{badge.state ? "✓" : "✗"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Style & Animation fermeture */}
            <div className="space-y-2 rounded-lg border border-purple-200 bg-purple-50/50 p-3 transition-all duration-300 hover:scale-[1.01] hover:border-purple-400 hover:bg-purple-100/50 hover:shadow-lg hover:ring-2 hover:ring-purple-300/50">
              <Label className="font-medium text-purple-700">✨ Style & Animation fermeture</Label>

              {/* Animation de sortie */}
              <div className="space-y-1.5">
                <span className="text-xs text-gray-600">Animation de sortie</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "fade-zoom", label: "Fade + Zoom Out" },
                    { id: "fade-out", label: "Fade Out" },
                    { id: "manga-explosion", label: "🧨 Manga Explosion" },
                    { id: "none", label: "Aucune" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setExitAnimation(option.id as typeof exitAnimation)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105",
                        exitAnimation === option.id
                          ? "border-purple-500 bg-purple-500 text-white shadow-md"
                          : "border-gray-300 bg-white text-gray-700 hover:border-purple-400 hover:shadow-sm"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton X de fermeture */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-600">Afficher bouton X de fermeture</span>
                <button
                  onClick={() => setShowCloseButton(!showCloseButton)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105",
                    showCloseButton
                      ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm"
                      : "border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:shadow-sm"
                  )}
                >
                  {showCloseButton ? "✓ Visible" : "✗ Masqué"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite : Aperçu */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-600">
            <span className="text-xl">👁️</span>
            Aperçu - {currentVariant.label}
          </h4>
        </div>

        <div className="relative mx-auto flex h-[600px] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <CommandePlatContent
            plat={currentVariant.id === "readonly-extra" ? null : (selectedPlat as any)}
            onOpenChange={() => {}}
            formatPrix={formatPrix}
            onAddToCart={
              currentVariant.props.mode === "interactive"
                ? (plat, qty) => console.log(`Ajout: ${plat.plat} x${qty}`)
                : undefined
            }
            currentQuantity={1}
            standalone={true}
            // Props de visibilité
            showImage={showImage}
            showBadge={showBadge}
            showBadgeDisponible={showBadgeDisponible}
            showBadgeExtra={showBadgeExtra}
            showBadgePanier={showBadgePanier}
            showDescription={showDescription}
            showPrice={showPrice}
            showQuantitySelector={showQuantitySelector}
            showSpiceSelector={showSpiceSelector}
            showAddToCartButton={showAddToCartButton}
            show3DTilt={show3DTilt}
            // Props de style
            imageFormat={imageFormat}
            {...(currentVariant.props as any)}
          />
        </div>

        {/* Code généré */}
        <div className="border-thai-orange/20 mt-4 rounded-lg border bg-gray-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Props générées</span>
            <button
              onClick={() => {
                const code = generatePropsCode()
                navigator.clipboard.writeText(code)
              }}
              className="text-thai-orange hover:text-thai-orange/80 text-xs transition-colors"
            >
              📋 Copier
            </button>
          </div>
          <pre className="overflow-x-auto text-xs text-green-400">
            <code>{generatePropsCode()}</code>
          </pre>
        </div>
      </div>

      {/* Modal réel */}
      <CommandePlatModal
        plat={currentVariant.id === "readonly-extra" ? null : (selectedPlat as any)}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        formatPrix={formatPrix}
        onAddToCart={
          currentVariant.props.mode === "interactive"
            ? (plat, qty) => {
                console.log(`Ajout: ${plat.plat} x${qty}`)
                setIsModalOpen(false)
              }
            : undefined
        }
        // Props de visibilité
        showImage={showImage}
        showBadge={showBadge}
        showBadgeDisponible={showBadgeDisponible}
        showBadgeExtra={showBadgeExtra}
        showBadgePanier={showBadgePanier}
        showDescription={showDescription}
        showPrice={showPrice}
        showQuantitySelector={showQuantitySelector}
        showSpiceSelector={showSpiceSelector}
        showAddToCartButton={showAddToCartButton}
        show3DTilt={show3DTilt}
        // Props de style
        modalSize={modalSize}
        imageFormat={imageFormat}
        modalPosition={modalPosition}
        // Props animation fermeture
        exitAnimation={exitAnimation}
        showCloseButton={showCloseButton}
        {...(currentVariant.props as any)}
      />
    </div>
  )

  // Fonction pour générer le code des props
  function generatePropsCode() {
    const props: string[] = []

    // Props de visibilité (n'afficher que si différent de la valeur par défaut)
    if (!showImage) props.push("showImage={false}")
    if (!showBadge) props.push("showBadge={false}")
    if (!showBadgeDisponible) props.push("showBadgeDisponible={false}")
    if (!showBadgeExtra) props.push("showBadgeExtra={false}")
    if (!showBadgePanier) props.push("showBadgePanier={false}")
    if (!showDescription) props.push("showDescription={false}")
    if (!showPrice) props.push("showPrice={false}")
    if (!showQuantitySelector) props.push("showQuantitySelector={false}")
    if (!showSpiceSelector) props.push("showSpiceSelector={false}")
    if (!showAddToCartButton) props.push("showAddToCartButton={false}")
    if (!show3DTilt) props.push("show3DTilt={false}")

    // Props de style
    if (modalSize !== "md") props.push(`modalSize="${modalSize}"`)
    if (imageFormat !== "auto") props.push(`imageFormat="${imageFormat}"`)
    if (modalPosition !== "center") props.push(`modalPosition="${modalPosition}"`)

    // Props animation fermeture
    if (exitAnimation !== "fade-zoom") props.push(`exitAnimation="${exitAnimation}"`)
    if (showCloseButton) props.push("showCloseButton={true}")

    // Mode
    props.push(`mode="${currentVariant.props.mode}"`)

    if (props.length === 1) {
      return `<CommandePlatModal\n  ${props[0]}\n/>`
    }

    return `<CommandePlatModal\n  ${props.join("\n  ")}\n/>`
  }
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
              Composants modaux spécifiques à l'application avec modes readonly et interactive
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
                    <strong>plat</strong> (Plat | null): Objet plat complet
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
                    <strong>mode</strong> ("interactive" | "readonly"): Mode d'affichage
                  </li>
                  <li>
                    <strong>extra</strong> (Extra | null): Données d'un extra
                  </li>
                  <li>
                    <strong>detail</strong> (DetailCommande | null): Données de commande
                  </li>
                  <li>
                    <strong>showPriceDetails</strong> (boolean): Afficher quantité/prix/sous-total
                  </li>
                  <li>
                    <strong>closeOnClick</strong> (boolean): Fermer au click (défaut: true en
                    readonly)
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* CommandePlatModal Playground avec variantes */}
          <div className="col-span-2">
            {isLoading ? (
              <div className="p-4 text-sm text-gray-500">Chargement des données...</div>
            ) : plats && plats.length > 0 ? (
              <ReadonlyModalPlayground plats={plats} />
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
                    <strong>scrollSyncWithVideo</strong> (boolean): Synchro durée texte/vidéo
                  </li>
                  <li>
                    <strong>loopCount</strong> (number): 0 = infini, 1 = une fois, n = n fois
                  </li>
                  <li>
                    <strong>buttonLayout</strong> ("vertical" | "horizontal"): Disposition des
                    boutons
                  </li>
                  <li>
                    <strong>cancelText</strong> (string): Texte bouton Annuler
                  </li>
                  <li>
                    <strong>confirmText</strong> (string): Texte bouton Confirmer
                  </li>
                  <li>
                    <strong>thirdButtonText</strong> (string): Texte 3ème bouton
                  </li>
                  <li>
                    <strong>rotation</strong> (boolean): Animation rotation légère
                  </li>
                  <li>
                    <strong>hoverScale</strong> (boolean): Effet zoom au survol
                  </li>
                  <li>
                    <strong>maxWidth</strong> ("sm" | "md" | "lg" | "xl" | "2xl" | "custom"):
                    Largeur max
                  </li>
                  <li>
                    <strong>customWidth</strong> (string): Largeur personnalisée (si
                    maxWidth="custom")
                  </li>
                  <li>
                    <strong>customHeight</strong> (string): Hauteur personnalisée (si
                    maxWidth="custom")
                  </li>
                  <li>
                    <strong>borderColor</strong> (string): Couleur de bordure
                  </li>
                  <li>
                    <strong>borderWidth</strong> (number): Épaisseur de bordure
                  </li>
                  <li>
                    <strong>shadowSize</strong> (string): Taille de l'ombre
                  </li>
                  <li>
                    <strong>polaroidPaddingSides</strong> (number): Padding latéral Polaroid
                  </li>
                  <li>
                    <strong>polaroidPaddingTop</strong> (number): Padding haut Polaroid
                  </li>
                  <li>
                    <strong>polaroidPaddingBottom</strong> (number): Padding bas Polaroid
                  </li>
                  <li>
                    <strong>autoClose</strong> (boolean): Fermeture auto à la fin de la vidéo
                  </li>
                  <li>
                    <strong>cancelLink</strong> (string): Lien bouton Annuler
                  </li>
                  <li>
                    <strong>confirmLink</strong> (string): Lien bouton Confirmer
                  </li>
                  <li>
                    <strong>thirdButtonLink</strong> (string): Lien 3ème bouton
                  </li>
                  <li>
                    <strong>position</strong> (string): Position du modal (center, custom, etc.)
                  </li>
                  <li>
                    <strong>customX</strong> (string): Position X (si custom)
                  </li>
                  <li>
                    <strong>customY</strong> (string): Position Y (si custom)
                  </li>
                  <li>
                    <strong>titleColor</strong> (string): Couleur du titre
                  </li>
                  <li>
                    <strong>typingAnimation</strong> (boolean): Animation machine à écrire
                  </li>
                  <li>
                    <strong>typingSpeed</strong> (number): Vitesse de frappe
                  </li>
                  <li>
                    <strong>animateBorder</strong> (boolean): Animation bordure mouvante
                  </li>
                  <li>
                    <strong>mangaExplosion</strong> (boolean): Animation explosion manga
                  </li>
                  <li>
                    <strong>animateOut</strong> (boolean): Animation de sortie
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
