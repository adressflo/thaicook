"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Info,
} from "lucide-react"

import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { ProductCard } from "@/components/shared/ProductCard"
import { StatCard } from "@/components/shared/StatCard"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { SmartSpice } from "@/components/shared/SmartSpice"
import { useData } from "@/contexts/DataContext"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

// ============================================================================
// PLAYGROUND POLAROID PHOTO
// ============================================================================

function PolaroidPhotoPlayground() {
  const [props, setProps] = useState<{
    src: string
    alt: string
    // Contenu (comme ModalVideo)
    title: string
    description: string
    titleColor: "thai-green" | "thai-orange" | "white" | "black"
    scrollingText: boolean
    scrollDuration: number
    // Position
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center" | "custom"
    customX: string
    customY: string
    // Taille
    size: "sm" | "md" | "lg" | "xl" | "custom"
    customSize: number
    rotation: number
    aspectRatio: "16:9" | "4:5" | "1:1" | "auto"
    // Bordure
    borderColor: "thai-orange" | "thai-green" | "red" | "blue" | "custom"
    customBorderColor: string
    borderWidth: 1 | 2 | 4 | "custom"
    customBorderWidth: number
    // Animations
    animateBorder: boolean
    hoverScale: boolean
  }>({
    src: "/media/avatars/panier1.svg",
    alt: "Avatar Panier",
    // Contenu
    title: "Photo Seule",
    description: "",
    titleColor: "thai-green",
    scrollingText: false,
    scrollDuration: 10,
    // Position
    position: "center",
    customX: "50%",
    customY: "50%",
    // Taille
    size: "md",
    customSize: 150,
    rotation: -3,
    aspectRatio: "1:1",
    // Bordure
    borderColor: "thai-green",
    customBorderColor: "border-purple-500",
    borderWidth: 1,
    customBorderWidth: 3,
    // Animations
    animateBorder: false,
    hoverScale: true,
  })

  const generateCode = () => {
    const lines = [`<PolaroidPhoto`]
    lines.push(`  src="${props.src}"`)
    lines.push(`  alt="${props.alt}"`)
    // Contenu
    if (props.title) lines.push(`  title="${props.title}"`)
    if (props.description) lines.push(`  description="${props.description}"`)
    if (props.titleColor !== "thai-green") lines.push(`  titleColor="${props.titleColor}"`)
    if (props.scrollingText) {
      lines.push(`  scrollingText={true}`)
      if (props.scrollDuration !== 10) lines.push(`  scrollDuration={${props.scrollDuration}}`)
    }
    // Position
    if (props.position !== "bottom-right") {
      lines.push(`  position="${props.position}"`)
      if (props.position === "custom") {
        lines.push(`  customX="${props.customX}"`)
        lines.push(`  customY="${props.customY}"`)
      }
    }
    // Taille
    if (props.size !== "md") {
      lines.push(`  size="${props.size}"`)
      if (props.size === "custom") {
        lines.push(`  customSize={${props.customSize}}`)
      }
    }
    if (props.rotation !== 3) lines.push(`  rotation={${props.rotation}}`)
    if (props.aspectRatio !== "1:1") lines.push(`  aspectRatio="${props.aspectRatio}"`)
    // Bordure
    if (props.borderColor !== "thai-green") {
      lines.push(`  borderColor="${props.borderColor}"`)
      if (props.borderColor === "custom") {
        lines.push(`  customBorderColor="${props.customBorderColor}"`)
      }
    }
    if (props.borderWidth !== 1) {
      lines.push(`  borderWidth={${props.borderWidth === "custom" ? `"custom"` : props.borderWidth}}`)
      if (props.borderWidth === "custom") {
        lines.push(`  customBorderWidth={${props.customBorderWidth}}`)
      }
    }
    // Animations
    if (props.animateBorder) lines.push(`  animateBorder={true}`)
    if (!props.hoverScale) lines.push(`  hoverScale={false}`)
    lines.push(`/>`)
    return lines.join("\n")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast({ title: "Code copié !", description: "Le code a été copié dans le presse-papier" })
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier le code", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border border-thai-orange/20 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg text-thai-green flex items-center gap-2">
            Contrôles Interactifs - PolaroidPhoto
          </h4>
          <Button
            variant="outline"
            onClick={handleCopyCode}
            className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
          >
            Copier le Code
          </Button>
        </div>

        {/* Zone de prévisualisation */}
        <div className="relative flex h-[320px] w-full items-center justify-center rounded-lg border border-dashed bg-gray-50 p-4">
          <p className="absolute top-4 left-4 text-sm font-medium text-gray-500">
            Prévisualisation
          </p>
          <PolaroidPhoto
            src={props.src}
            alt={props.alt}
            title={props.title}
            description={props.description}
            titleColor={props.titleColor}
            scrollingText={props.scrollingText}
            scrollDuration={props.scrollDuration}
            position={props.position}
            customX={props.position === "custom" ? props.customX : undefined}
            customY={props.position === "custom" ? props.customY : undefined}
            size={props.size}
            customSize={props.size === "custom" ? props.customSize : undefined}
            rotation={props.rotation}
            aspectRatio={props.aspectRatio}
            borderColor={props.borderColor}
            customBorderColor={props.borderColor === "custom" ? props.customBorderColor : undefined}
            borderWidth={props.borderWidth}
            customBorderWidth={props.borderWidth === "custom" ? props.customBorderWidth : undefined}
            animateBorder={props.animateBorder}
            hoverScale={props.hoverScale}
          />
        </div>

        {/* Section Image */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🖼️ Image source</label>
          <input
            type="text"
            value={props.src}
            onChange={(e) => setProps({ ...props, src: e.target.value })}
            placeholder="/media/avatars/..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
          />

          {/* Presets rapides */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "🛒 Panier", value: "/media/avatars/panier1.svg" },
              { label: "👤 Default", value: "/media/avatars/default.svg" },
              { label: "📱 Phone", value: "/media/avatars/phonevalid.svg" },
              { label: "🍜 Logo", value: "/logo.svg" },
            ].map((preset) => (
              <Button
                key={preset.value}
                size="sm"
                variant={props.src === preset.value ? "default" : "outline"}
                onClick={() => setProps({ ...props, src: preset.value })}
                className={props.src === preset.value
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Sélecteur toutes les images */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">📂 Parcourir toutes les images</label>
            <select
              value={props.src}
              onChange={(e) => setProps({ ...props, src: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent bg-white"
            >
              <optgroup label="🎨 Avatars">
                <option value="/media/avatars/panier1.svg">panier1.svg</option>
                <option value="/media/avatars/default.svg">default.svg</option>
                <option value="/media/avatars/phonevalid.svg">phonevalid.svg</option>
              </optgroup>
              <optgroup label="🖼️ Illustrations">
                <option value="/illustrations/apropos.svg">apropos.svg</option>
                <option value="/illustrations/nous trouver.svg">nous trouver.svg</option>
                <option value="/illustrations/suivihistorique.svg">suivihistorique.svg</option>
                <option value="/illustrations/pourcommander.svg">pourcommander.svg</option>
                <option value="/illustrations/pourvosevenement.svg">pourvosevenement.svg</option>
                <option value="/illustrations/installapp.svg">installapp.svg</option>
              </optgroup>
              <optgroup label="🏷️ Logos">
                <option value="/logo.svg">logo.svg</option>
                <option value="/logo.png">logo.png</option>
                <option value="/chanthana.svg">chanthana.svg</option>
              </optgroup>
              <optgroup label="🎌 Drapeaux">
                <option value="/flags/fr.webp">fr.webp (France)</option>
                <option value="/flags/nl.webp">nl.webp (Pays-Bas)</option>
                <option value="/flags/th.webp">th.webp (Thaïlande)</option>
                <option value="/flags/gb.webp">gb.webp (UK)</option>
              </optgroup>
              <optgroup label="🎬 Animations">
                <option value="/media/animations/ui/Sawadee.gif">Sawadee.gif</option>
              </optgroup>
              <optgroup label="📱 Icons PWA">
                <option value="/icons/icon-72x72.png">icon-72x72.png</option>
                <option value="/icons/icon-96x96.png">icon-96x96.png</option>
                <option value="/icons/icon-128x128.png">icon-128x128.png</option>
                <option value="/icons/icon-192x192.png">icon-192x192.png</option>
                <option value="/icons/icon-512x512.png">icon-512x512.png</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Section Contenu (titre + description) */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">📝 Contenu</label>
          <input
            type="text"
            value={props.title}
            onChange={(e) => setProps({ ...props, title: e.target.value })}
            placeholder="Titre"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
          />
          <textarea
            value={props.description}
            onChange={(e) => setProps({ ...props, description: e.target.value })}
            placeholder="Description (optionnel)"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent resize-none"
            rows={2}
          />
          <p className="text-xs text-gray-500 italic">
            Balises : &lt;orange&gt;, &lt;green&gt;, &lt;white&gt;, &lt;gold&gt;, &lt;black&gt;, &lt;bold&gt;, &lt;semi-bold&gt;, &lt;italic&gt;, &lt;underline&gt;, &lt;small&gt;
          </p>
        </div>

        {/* Section Couleur titre */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🎨 Couleur du texte</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { label: "🟢 Vert", value: "thai-green" as const },
              { label: "🟠 Orange", value: "thai-orange" as const },
              { label: "⚪ Blanc", value: "white" as const },
              { label: "⚫ Noir", value: "black" as const },
            ]).map((color) => (
              <Button
                key={color.value}
                size="sm"
                variant={props.titleColor === color.value ? "default" : "outline"}
                onClick={() => setProps({ ...props, titleColor: color.value })}
                className={props.titleColor === color.value
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {color.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Position */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">📍 Position</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { label: "↘️ Bas droite", value: "bottom-right" as const },
              { label: "↙️ Bas gauche", value: "bottom-left" as const },
              { label: "↗️ Haut droite", value: "top-right" as const },
              { label: "↖️ Haut gauche", value: "top-left" as const },
              { label: "🎯 Centre", value: "center" as const },
              { label: "🎨 Custom", value: "custom" as const },
            ]).map((pos) => (
              <Button
                key={pos.value}
                size="sm"
                variant={props.position === pos.value ? "default" : "outline"}
                onClick={() => setProps({ ...props, position: pos.value })}
                className={props.position === pos.value
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {pos.label}
              </Button>
            ))}
          </div>
          {props.position === "custom" && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="text"
                value={props.customX}
                onChange={(e) => setProps({ ...props, customX: e.target.value })}
                placeholder="Position X (ex: 50%, 100px)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
              />
              <input
                type="text"
                value={props.customY}
                onChange={(e) => setProps({ ...props, customY: e.target.value })}
                placeholder="Position Y (ex: 50%, 100px)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Section Taille */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">📏 Taille</label>
          <div className="flex gap-2">
            {(["sm", "md", "lg", "xl", "custom"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={props.size === s ? "default" : "outline"}
                onClick={() => setProps({ ...props, size: s })}
                className={props.size === s
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {s}
              </Button>
            ))}
          </div>
          {props.size === "custom" && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="range"
                min="64"
                max="300"
                step="8"
                value={props.customSize}
                onChange={(e) => setProps({ ...props, customSize: Number(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-16">{props.customSize}px</span>
            </div>
          )}
        </div>

        {/* Section Format d'image */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">📐 Format d'image</label>
          <div className="flex gap-2">
            {(["16:9", "4:5", "1:1", "auto"] as const).map((ratio) => (
              <Button
                key={ratio}
                size="sm"
                variant={props.aspectRatio === ratio ? "default" : "outline"}
                onClick={() => setProps({ ...props, aspectRatio: ratio })}
                className={props.aspectRatio === ratio
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {ratio}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Couleur bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🎨 Couleur bordure</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { label: "🟠 Orange", value: "thai-orange" as const },
              { label: "🟢 Vert", value: "thai-green" as const },
              { label: "🔴 Rouge", value: "red" as const },
              { label: "🔵 Bleu", value: "blue" as const },
              { label: "🎨 Custom", value: "custom" as const },
            ]).map((color) => (
              <Button
                key={color.value}
                size="sm"
                variant={props.borderColor === color.value ? "default" : "outline"}
                onClick={() => setProps({ ...props, borderColor: color.value })}
                className={props.borderColor === color.value
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {color.label}
              </Button>
            ))}
          </div>
          {props.borderColor === "custom" && (
            <input
              type="text"
              value={props.customBorderColor}
              onChange={(e) => setProps({ ...props, customBorderColor: e.target.value })}
              placeholder="ex: border-purple-500, border-pink-600"
              className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
          )}
        </div>

        {/* Section Épaisseur bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">📏 Épaisseur bordure</label>
          <div className="flex gap-2">
            {([1, 2, 4, "custom"] as const).map((width) => (
              <Button
                key={String(width)}
                size="sm"
                variant={props.borderWidth === width ? "default" : "outline"}
                onClick={() => setProps({ ...props, borderWidth: width })}
                className={props.borderWidth === width
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {width === "custom" ? "🎨 Custom" : `${width}px`}
              </Button>
            ))}
          </div>
          {props.borderWidth === "custom" && (
            <input
              type="number"
              value={props.customBorderWidth}
              onChange={(e) => setProps({ ...props, customBorderWidth: Number(e.target.value) })}
              placeholder="ex: 3, 5, 8"
              min={1}
              max={20}
              className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
          )}
        </div>

        {/* Section Rotation */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🔄 Rotation (degrés)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={props.rotation}
              onChange={(e) => setProps({ ...props, rotation: Number(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-16">{props.rotation}°</span>
          </div>
        </div>

        {/* Section Style & Animation */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">✨ Style & Animation</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={props.scrollingText}
                onChange={(e) => setProps({ ...props, scrollingText: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Texte défilant (marquee)</span>
            </label>
            {props.scrollingText && (
              <div className="flex items-center gap-2 ml-6">
                <label className="text-xs text-gray-600">Durée:</label>
                <input
                  type="number"
                  value={props.scrollDuration}
                  onChange={(e) => setProps({ ...props, scrollDuration: Number(e.target.value) })}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange"
                  min="1"
                  max="30"
                />
                <span className="text-xs text-gray-500">secondes</span>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={props.animateBorder}
                onChange={(e) => setProps({ ...props, animateBorder: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Animation bordure (moving-border)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={props.hoverScale}
                onChange={(e) => setProps({ ...props, hoverScale: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Effet scale au hover</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CardsTestPage() {
  const { plats, isLoading } = useData()
  const [spiceDistribution, setSpiceDistribution] = useState<number[]>([0, 2, 2, 1])
  const [quantity, setQuantity] = useState(5)

  const NumberBadge = ({ number }: { number: number }) => (
    <span className="bg-thai-orange mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
      {number}
    </span>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">🃏 Test des Cards</h1>
        <p className="text-gray-600">Composants Card pour l'affichage de contenu structuré</p>
        <div className="mt-4 flex gap-2">
          <Badge variant="outline" className="border-thai-orange text-thai-orange">
            Cards & Containers
          </Badge>
          <Badge className="bg-thai-green">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Fonctionnel
          </Badge>
        </div>
      </div>

      {/* Section 1: Cards Simples */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">1. Cards de Base</CardTitle>
          <CardDescription>
            Structures simples pour afficher du texte ou des informations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Simple Card */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Card>
                <CardHeader>
                  <CardTitle>Titre de la carte</CardTitle>
                  <CardDescription>Description courte de la carte</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Contenu principal de la carte. Peut contenir du texte, des images ou d'autres
                    composants.
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">Pied de page de la carte</p>
                </CardFooter>
              </Card>
            </div>

            {/* Bordered Card */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Card className="border-thai-green/50 bg-thai-cream/10">
                <CardHeader>
                  <CardTitle className="text-thai-green">Carte Stylisée</CardTitle>
                  <CardDescription>Avec bordure verte et fond crème léger</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Utilisée pour mettre en avant du contenu spécifique ou thématique.</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="border-thai-green text-thai-green hover:bg-thai-green/10 w-full"
                  >
                    Action
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Gradient Card */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Card className="from-thai-orange to-thai-gold border-none bg-gradient-to-br text-white">
                <CardHeader>
                  <CardTitle className="text-white">Carte Gradient</CardTitle>
                  <CardDescription className="text-white/80">
                    Pour les appels à l'action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Ce style attire l'attention de l'utilisateur sur une offre ou une information
                    importante.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    En savoir plus
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Section 2: Cards Produit (Composant ProductCard) */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">2. Cards Produit (ProductCard)</CardTitle>
            <CardDescription className="mt-1.5">
              Composant <code>&lt;ProductCard /&gt;</code> (Données réelles via useData)
              <br />
              <code className="text-xs text-gray-500">components\shared\ProductCard.tsx</code>
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
                <DialogTitle>Propriétés de ProductCard</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>title</strong> (string): Titre du produit
                  </li>
                  <li>
                    <strong>description</strong> (string): Description courte
                  </li>
                  <li>
                    <strong>price</strong> (number): Prix unitaire
                  </li>
                  <li>
                    <strong>imageSrc</strong> (string): URL de l'image
                  </li>
                  <li>
                    <strong>isVegetarian</strong> (boolean): Affiche le badge végétarien
                  </li>
                  <li>
                    <strong>isSpicy</strong> (boolean): Affiche le badge épicé
                  </li>
                  <li>
                    <strong>quantityInCart</strong> (number): Affiche le badge "Panier X" si {">"} 0
                  </li>
                  <li>
                    <strong>onAdd</strong> (function): Callback au clic sur "Ajouter"
                  </li>
                  <li>
                    <strong>className</strong> (string): Classes CSS additionnelles
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Product Card - Exemple Dynamique (Données réelles) */}
            {isLoading ? (
              <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed p-8 text-gray-400">
                Chargement des données réelles...
              </div>
            ) : plats && plats.length > 0 ? (
              (() => {
                // Essayer de trouver les nems, sinon prendre le premier plat
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("nems")) || plats[0]
                return (
                  <div className="flex flex-col gap-1">
                    <NumberBadge number={4} />
                    <ProductCard
                      title={platExemple.plat}
                      description={platExemple.description || "Aucune description disponible."}
                      price={parseFloat(platExemple.prix?.toString() || "0")}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      quantityInCart={0}
                      imageSrc={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      onAdd={() => console.log(`Ajout de ${platExemple.plat}`)}
                    />
                    <p className="mt-2 text-xs text-gray-500 italic">
                      * Données réelles récupérées depuis la base de données via useData()
                    </p>
                  </div>
                )
              })()
            ) : (
              <div className="text-red-500">Aucun plat trouvé dans la base de données.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2.5: Cards Panier (Composant CartItemCard) */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">2.5. Cards Panier (CartItemCard)</CardTitle>
            <CardDescription className="mt-1.5">
              Composant <code>&lt;CartItemCard /&gt;</code> (Design validé page Panier)
              <br />
              <code className="text-xs text-gray-500">components\shared\CartItemCard.tsx</code>
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
                <DialogTitle>Propriétés de CartItemCard</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>name</strong> (string): Nom de l'article
                  </li>
                  <li>
                    <strong>imageUrl</strong> (string): URL de l'image
                  </li>
                  <li>
                    <strong>unitPrice</strong> (number): Prix unitaire
                  </li>
                  <li>
                    <strong>quantity</strong> (number): Quantité actuelle
                  </li>
                  <li>
                    <strong>isVegetarian</strong> (boolean): Badge végétarien
                  </li>
                  <li>
                    <strong>isSpicy</strong> (boolean): Badge épicé
                  </li>
                  <li>
                    <strong>showSpiceSelector</strong> (boolean): Affiche l'emplacement des épices
                  </li>
                  <li></li>
                  <li>
                    <strong>spiceSelectorSlot</strong> (ReactNode): Composant à injecter (ex:
                    SmartSpice)
                  </li>
                  <li>
                    <strong>readOnly</strong> (boolean): Mode lecture seule (pas de boutons +/-)
                  </li>
                  <li>
                    <strong>imageClassName</strong> (string): Classes CSS pour l'image (ex:
                    aspect-square)
                  </li>
                  <li>
                    <strong>imageAspectRatio</strong> ("square" | "video" | "auto" |
                    "square-contain" | "video-contain"): Format de l'image (défaut: "square")
                  </li>
                  <li>
                    <strong>imageObjectPosition</strong> ("center" | "top" | "bottom" | "left" |
                    "right"): Cadrage de l'image (défaut: "center")
                  </li>
                  <li>
                    <strong>onQuantityChange</strong> (function): Callback changement quantité
                  </li>
                  <li>
                    <strong>onRemove</strong> (function): Callback suppression
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Cart Item 1 - Avec données réelles */}
            {isLoading ? (
              <div className="flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed p-8 text-gray-400">
                Chargement...
              </div>
            ) : plats && plats.length > 0 ? (
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("nems")) || plats[0]
                return (
                  <div className="flex flex-col gap-1">
                    <NumberBadge number={5} />
                    <CartItemCard
                      name={platExemple.plat}
                      imageUrl={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      unitPrice={parseFloat(platExemple.prix?.toString() || "0")}
                      quantity={quantity}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      onQuantityChange={setQuantity}
                      onRemove={() => console.log("Suppression")}
                      onClick={() => console.log("Clic sur l'item")}
                      showSpiceSelector={(platExemple.niveau_epice ?? 0) > 0}
                      spiceSelectorSlot={
                        <SmartSpice
                          quantity={quantity}
                          distribution={spiceDistribution}
                          onDistributionChange={setSpiceDistribution}
                        />
                      }
                    />
                    <p className="mt-2 text-xs text-gray-500 italic">
                      * Données réelles avec quantité simulée à {quantity}
                    </p>
                  </div>
                )
              })()
            ) : (
              <div className="text-red-500">Aucun plat trouvé.</div>
            )}

            {/* Cart Item 2 - Lecture Seule (Récapitulatif) */}
            {plats &&
              plats.length > 0 &&
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("ailes")) || plats[1] || plats[0]
                return (
                  <div className="flex flex-col gap-1 border-t border-dashed border-gray-200 pt-8">
                    <div className="mb-2 flex items-center gap-2">
                      <NumberBadge number={6} />
                      <span className="text-sm font-medium text-gray-500">
                        Mode Lecture Seule (Récapitulatif commande)
                      </span>
                    </div>
                    <CartItemCard
                      name={platExemple.plat}
                      imageUrl={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      unitPrice={parseFloat(platExemple.prix?.toString() || "0")}
                      quantity={2}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      onQuantityChange={() => {}}
                      onRemove={() => {}}
                      readOnly={true}
                      showSpiceSelector={(platExemple.niveau_epice ?? 0) > 0}
                      spiceSelectorSlot={
                        <SmartSpice
                          quantity={2}
                          distribution={[0, 0, 1, 1]} // Exemple fixe
                          onDistributionChange={() => {}}
                        />
                      }
                    />
                    <p className="mt-2 text-xs text-gray-500 italic">
                      * <code>readOnly={`{true}`}</code> : Cache les boutons +/-, la poubelle et
                      affiche "Quantité: 2"
                    </p>
                  </div>
                )
              })()}

            {/* Cart Item 3 - Aspect Ratio Square */}
            {plats &&
              plats.length > 0 &&
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("brochette")) ||
                  plats[2] ||
                  plats[0]
                return (
                  <div className="flex flex-col gap-1 border-t border-dashed border-gray-200 pt-8">
                    <div className="mb-2 flex items-center gap-2">
                      <NumberBadge number={6.1} />
                      <span className="text-sm font-medium text-gray-500">
                        Format Carré (imageAspectRatio="square")
                      </span>
                    </div>
                    <CartItemCard
                      name={platExemple.plat}
                      imageUrl={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      unitPrice={parseFloat(platExemple.prix?.toString() || "0")}
                      quantity={1}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      onQuantityChange={() => {}}
                      onRemove={() => {}}
                      imageAspectRatio="square"
                    />
                  </div>
                )
              })()}

            {/* Cart Item 4 - Aspect Ratio Auto */}
            {plats &&
              plats.length > 0 &&
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("riz")) || plats[3] || plats[0]
                return (
                  <div className="flex flex-col gap-1 border-t border-dashed border-gray-200 pt-8">
                    <div className="mb-2 flex items-center gap-2">
                      <NumberBadge number={6.2} />
                      <span className="text-sm font-medium text-gray-500">
                        Format Auto (imageAspectRatio="auto")
                      </span>
                    </div>
                    <CartItemCard
                      name={platExemple.plat}
                      imageUrl={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      unitPrice={parseFloat(platExemple.prix?.toString() || "0")}
                      quantity={1}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      onQuantityChange={() => {}}
                      onRemove={() => {}}
                      imageAspectRatio="auto"
                    />
                  </div>
                )
              })()}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Cards Dashboard (StatCard) */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">3. Cards Dashboard (StatCard)</CardTitle>
          <CardDescription>
            Composant <code>&lt;StatCard /&gt;</code> standardisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stat Card 1 */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={7} />
              <StatCard
                title="Revenu Total"
                value="45,231.89 €"
                icon={DollarSign}
                trend="+20.1%"
                trendUp={true}
                description="par rapport au mois dernier"
              />
            </div>

            {/* Stat Card 2 */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={8} />
              <StatCard
                title="Commandes"
                value="+2350"
                icon={ShoppingCart}
                description="+180 depuis la dernière heure"
              />
            </div>

            {/* Stat Card 3 */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={9} />
              <StatCard
                title="Clients Actifs"
                value="+12,234"
                icon={Users}
                trend="+19%"
                trendUp={true}
                description="de nouveaux clients"
              />
            </div>

            {/* Stat Card 4 */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={10} />
              <StatCard
                title="Taux de Conversion"
                value="5.4%"
                icon={TrendingUp}
                trend="+2.1%"
                trendUp={true}
                description="cette semaine"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Composants Spéciaux - Playground PolaroidPhoto */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">4. Composants Spéciaux</CardTitle>
            <CardDescription className="mt-1.5">
              Composants visuels uniques comme l'effet Polaroid
              <br />
              <code className="text-xs text-gray-500">components/shared/PolaroidPhoto.tsx</code>
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
                <DialogTitle>Propriétés de PolaroidPhoto</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>src</strong> (string): URL de l'image (Requis)
                  </li>
                  <li>
                    <strong>alt</strong> (string): Texte alternatif (Requis)
                  </li>
                  <li className="pt-2 border-t border-gray-200">
                    <strong className="text-thai-green">Contenu</strong>
                  </li>
                  <li>
                    <strong>title</strong> (string): Titre sous l'image
                  </li>
                  <li>
                    <strong>description</strong> (string): Description sous le titre (supporte balises couleur/style)
                  </li>
                  <li>
                    <strong>titleColor</strong> ("thai-green" | "thai-orange" | "white" | "black"): Couleur du texte (défaut: "thai-green")
                  </li>
                  <li>
                    <strong>scrollingText</strong> (boolean): Active le défilement marquee (défaut: false)
                  </li>
                  <li>
                    <strong>scrollDuration</strong> (number): Durée du défilement en secondes (défaut: 10)
                  </li>
                  <li className="pt-2 border-t border-gray-200">
                    <strong className="text-thai-green">Position</strong>
                  </li>
                  <li>
                    <strong>position</strong> ("bottom-right" | "bottom-left" | "top-right" | "top-left" | "center" | "custom"): Position (défaut: "bottom-right")
                  </li>
                  <li>
                    <strong>customX / customY</strong> (string): Position custom (si position="custom")
                  </li>
                  <li className="pt-2 border-t border-gray-200">
                    <strong className="text-thai-green">Taille</strong>
                  </li>
                  <li>
                    <strong>size</strong> ("sm" | "md" | "lg" | "xl" | "custom"): Taille prédéfinie (défaut: "md")
                  </li>
                  <li>
                    <strong>customSize</strong> (number): Taille custom en px (si size="custom")
                  </li>
                  <li>
                    <strong>rotation</strong> (number): Rotation en degrés (défaut: 3)
                  </li>
                  <li>
                    <strong>aspectRatio</strong> ("16:9" | "4:5" | "1:1" | "auto"): Format de l'image (défaut: "1:1")
                  </li>
                  <li className="pt-2 border-t border-gray-200">
                    <strong className="text-thai-green">Bordure</strong>
                  </li>
                  <li>
                    <strong>borderColor</strong> ("thai-orange" | "thai-green" | "red" | "blue" | "custom"): Couleur bordure (défaut: "thai-green")
                  </li>
                  <li>
                    <strong>customBorderColor</strong> (string): Classe Tailwind custom (si borderColor="custom")
                  </li>
                  <li>
                    <strong>borderWidth</strong> (1 | 2 | 4 | "custom"): Épaisseur bordure (défaut: 1)
                  </li>
                  <li>
                    <strong>customBorderWidth</strong> (number): Épaisseur custom en px (si borderWidth="custom")
                  </li>
                  <li className="pt-2 border-t border-gray-200">
                    <strong className="text-thai-green">Animations</strong>
                  </li>
                  <li>
                    <strong>animateBorder</strong> (boolean): Bordure qui pulse (défaut: false)
                  </li>
                  <li>
                    <strong>hoverScale</strong> (boolean): Effet scale au hover (défaut: true)
                  </li>
                  <li>
                    <strong>className</strong> (string): Classes CSS additionnelles
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <PolaroidPhotoPlayground />
        </CardContent>
      </Card>
    </div>
  )
}
