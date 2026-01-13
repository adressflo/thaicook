"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2, ExternalLink, Info } from "lucide-react"

import { OrderHistoryCard } from "@/components/historique/OrderHistoryCard"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { MobilePreview, usePreviewMode } from "@/components/shared/MobilePreview"
import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { ProductCard } from "@/components/shared/ProductCard"
import { SmartSpice } from "@/components/shared/SmartSpice"
import { useData } from "@/contexts/DataContext"
import { toast } from "@/hooks/use-toast"
import type { CommandeUI } from "@/types/app"
import { useEffect, useMemo, useState } from "react"

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
      lines.push(
        `  borderWidth={${props.borderWidth === "custom" ? `"custom"` : props.borderWidth}}`
      )
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
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      })
    }
  }

  // Synchronisation temps réel avec la fenêtre détachée
  useEffect(() => {
    const channel = new BroadcastChannel("preview_channel")
    channel.postMessage({
      type: "UPDATE_PROPS",
      payload: {
        component: "PolaroidPhoto",
        imageUrl: props.src,
        name: props.alt,
        title: props.title,
        description: props.description,
        titleColor: props.titleColor,
        scrollingText: props.scrollingText,
        scrollDuration: props.scrollDuration,
        position: props.position,
        customX: props.customX,
        customY: props.customY,
        size: props.size,
        customSize: props.customSize,
        rotation: props.rotation,
        imageAspectRatio: props.aspectRatio, // Mapping vers imageAspectRatio pour uniformité
        borderColor: props.borderColor,
        customBorderColor: props.customBorderColor,
        borderWidth: props.borderWidth,
        customBorderWidth: props.customBorderWidth,
        animateBorder: props.animateBorder,
        hoverScale: props.hoverScale,
      },
    })
    return () => channel.close()
  }, [props])

  const handleOpenPreview = () => {
    const params = new URLSearchParams()
    params.set("component", "PolaroidPhoto")
    params.set("imageUrl", props.src)
    params.set("name", props.alt)
    // On pourrait ajouter d'autres props si PreviewPage les supportait,
    // mais pour l'instant PreviewPage est assez basique pour PolaroidPhoto.
    // On passe quand même tout ce qu'on peut via l'URL si on étend PreviewPage plus tard.

    const url = `/preview?${params.toString()}`
    window.open(url, "_blank", "width=1200,height=800")
  }

  return (
    <div className="space-y-4">
      <div className="border-thai-orange/20 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
            Contrôles Interactifs - PolaroidPhoto
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleOpenPreview}
              className="border-thai-orange text-thai-orange hover:bg-thai-orange transition-all duration-200 hover:text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Détacher
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green transition-all duration-200 hover:text-white"
            >
              Copier le Code
            </Button>
          </div>
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
            className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          />

          {/* Presets rapides */}
          <div className="flex flex-wrap gap-2">
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
                className={
                  props.src === preset.value
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
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
              className="focus:ring-thai-orange w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
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
            className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          />
          <textarea
            value={props.description}
            onChange={(e) => setProps({ ...props, description: e.target.value })}
            placeholder="Description (optionnel)"
            className="focus:ring-thai-orange w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            rows={2}
          />
          <p className="text-xs text-gray-500 italic">
            Balises : &lt;orange&gt;, &lt;green&gt;, &lt;white&gt;, &lt;gold&gt;, &lt;black&gt;,
            &lt;bold&gt;, &lt;semi-bold&gt;, &lt;italic&gt;, &lt;underline&gt;, &lt;small&gt;
          </p>
        </div>

        {/* Section Couleur titre */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🎨 Couleur du texte</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "🟢 Vert", value: "thai-green" as const },
              { label: "🟠 Orange", value: "thai-orange" as const },
              { label: "⚪ Blanc", value: "white" as const },
              { label: "⚫ Noir", value: "black" as const },
            ].map((color) => (
              <Button
                key={color.value}
                size="sm"
                variant={props.titleColor === color.value ? "default" : "outline"}
                onClick={() => setProps({ ...props, titleColor: color.value })}
                className={
                  props.titleColor === color.value
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
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
            {[
              { label: "↘️ Bas droite", value: "bottom-right" as const },
              { label: "↙️ Bas gauche", value: "bottom-left" as const },
              { label: "↗️ Haut droite", value: "top-right" as const },
              { label: "↖️ Haut gauche", value: "top-left" as const },
              { label: "🎯 Centre", value: "center" as const },
              { label: "🎨 Custom", value: "custom" as const },
            ].map((pos) => (
              <Button
                key={pos.value}
                size="sm"
                variant={props.position === pos.value ? "default" : "outline"}
                onClick={() => setProps({ ...props, position: pos.value })}
                className={
                  props.position === pos.value
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {pos.label}
              </Button>
            ))}
          </div>
          {props.position === "custom" && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={props.customX}
                onChange={(e) => setProps({ ...props, customX: e.target.value })}
                placeholder="Position X (ex: 50%, 100px)"
                className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <input
                type="text"
                value={props.customY}
                onChange={(e) => setProps({ ...props, customY: e.target.value })}
                placeholder="Position Y (ex: 50%, 100px)"
                className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
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
                className={
                  props.size === s
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {s}
              </Button>
            ))}
          </div>
          {props.size === "custom" && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="range"
                min="64"
                max="300"
                step="8"
                value={props.customSize}
                onChange={(e) => setProps({ ...props, customSize: Number(e.target.value) })}
                className="flex-1"
              />
              <span className="w-16 text-sm text-gray-600">{props.customSize}px</span>
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
                className={
                  props.aspectRatio === ratio
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {ratio}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Couleur bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🎨 Couleur bordure</label>
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
                variant={props.borderColor === color.value ? "default" : "outline"}
                onClick={() => setProps({ ...props, borderColor: color.value })}
                className={
                  props.borderColor === color.value
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
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
              className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
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
                className={
                  props.borderWidth === width
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
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
              className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
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
            <span className="w-16 text-sm text-gray-600">{props.rotation}°</span>
          </div>
        </div>

        {/* Section Style & Animation */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">✨ Style & Animation</label>
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={props.scrollingText}
                onChange={(e) => setProps({ ...props, scrollingText: e.target.checked })}
                className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Texte défilant (marquee)</span>
            </label>
            {props.scrollingText && (
              <div className="ml-6 flex items-center gap-2">
                <label className="text-xs text-gray-600">Durée:</label>
                <input
                  type="number"
                  value={props.scrollDuration}
                  onChange={(e) => setProps({ ...props, scrollDuration: Number(e.target.value) })}
                  className="focus:ring-thai-orange w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                  min="1"
                  max="30"
                />
                <span className="text-xs text-gray-500">secondes</span>
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={props.animateBorder}
                onChange={(e) => setProps({ ...props, animateBorder: e.target.checked })}
                className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Animation bordure (moving-border)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={props.hoverScale}
                onChange={(e) => setProps({ ...props, hoverScale: e.target.checked })}
                className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Effet scale au hover</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PLAYGROUND PRODUCT CARD
// ============================================================================

function ProductCardPlayground() {
  const { plats, isLoading } = useData()
  const [selectedPlatId, setSelectedPlatId] = useState<number | null>(null)
  const [props, setProps] = useState<{
    title: string
    description: string
    price: number
    imageSrc: string
    isVegetarian: boolean
    isSpicy: boolean
    quantityInCart: number
  }>({
    title: "Exemple de Plat",
    description: "Une délicieuse description pour ce plat incroyable.",
    price: 12.9,
    imageSrc: "/media/avatars/panier1.svg",
    isVegetarian: false,
    isSpicy: false,
    quantityInCart: 0,
  })

  // Sélectionner un plat par défaut
  useEffect(() => {
    if (plats && plats.length > 0 && selectedPlatId === null) {
      const defaultPlat = plats.find((p) => p.plat?.toLowerCase().includes("nems")) || plats[0]
      if (defaultPlat) {
        setSelectedPlatId(defaultPlat.id)
        setProps({
          title: defaultPlat.plat || "",
          description: defaultPlat.description || "",
          price: parseFloat(defaultPlat.prix?.toString() || "0"),
          imageSrc: defaultPlat.photo_du_plat || "",
          isVegetarian: !!defaultPlat.est_vegetarien,
          isSpicy: (defaultPlat.niveau_epice ?? 0) > 0,
          quantityInCart: 0,
        })
      }
    }
  }, [plats, selectedPlatId])

  // Synchronisation temps réel
  useEffect(() => {
    const channel = new BroadcastChannel("preview_channel")
    channel.postMessage({
      type: "UPDATE_PROPS",
      payload: {
        component: "ProductCard",
        name: props.title, // Mapping vers name pour RenderPage
        imageUrl: props.imageSrc, // Mapping vers imageUrl
        price: props.price,
        description: props.description,
        isVegetarian: props.isVegetarian,
        quantity: props.quantityInCart, // Mapping vers quantity
        // isSpicy n'est pas géré explicitement dans RenderPage pour ProductCard mais on peut l'ajouter si besoin
      },
    })
    return () => channel.close()
  }, [props])

  const handleOpenPreview = () => {
    const params = new URLSearchParams()
    params.set("component", "ProductCard")
    params.set("name", props.title)
    params.set("imageUrl", props.imageSrc)
    params.set("price", props.price.toString())
    params.set("description", props.description)
    params.set("isVegetarian", props.isVegetarian.toString())
    params.set("quantity", props.quantityInCart.toString())

    const url = `/preview?${params.toString()}`
    window.open(url, "_blank", "width=1200,height=800")
  }

  const generateCode = () => {
    const lines = [`<ProductCard`]
    lines.push(`  title="${props.title}"`)
    lines.push(`  description="${props.description}"`)
    lines.push(`  price={${props.price}}`)
    lines.push(`  imageSrc="${props.imageSrc}"`)
    if (props.isVegetarian) lines.push(`  isVegetarian={true}`)
    if (props.isSpicy) lines.push(`  isSpicy={true}`)
    if (props.quantityInCart > 0) lines.push(`  quantityInCart={${props.quantityInCart}}`)
    lines.push(`  onAdd={() => console.log("Ajouté")}`)
    lines.push(`/>`)
    return lines.join("\n")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast({ title: "Code copié !", description: "Le code a été copié dans le presse-papier" })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div className="py-8 text-center text-gray-500">Chargement...</div>

  return (
    <div className="space-y-4">
      <div className="border-thai-orange/20 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
            Contrôles Interactifs - ProductCard
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleOpenPreview}
              className="border-thai-orange text-thai-orange hover:bg-thai-orange transition-all duration-200 hover:text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Détacher
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green transition-all duration-200 hover:text-white"
            >
              Copier le Code
            </Button>
          </div>
        </div>

        {/* Zone de prévisualisation */}
        <div className="relative flex min-h-[320px] w-full items-center justify-center rounded-lg border border-dashed bg-gray-50 p-4">
          <p className="absolute top-4 left-4 text-sm font-medium text-gray-500">
            Prévisualisation
          </p>
          <div className="w-full max-w-xs">
            <ProductCard
              title={props.title}
              description={props.description}
              price={props.price}
              imageSrc={props.imageSrc}
              isVegetarian={props.isVegetarian}
              isSpicy={props.isSpicy}
              quantityInCart={props.quantityInCart}
              onAdd={() => toast({ title: "Ajouté", description: `Ajout de ${props.title}` })}
            />
          </div>
        </div>

        {/* Sélecteur de Plat */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            🍜 Sélectionner un plat (données réelles)
          </label>
          <select
            value={selectedPlatId || ""}
            onChange={(e) => {
              const platId = Number(e.target.value)
              setSelectedPlatId(platId)
              const plat = plats?.find((p) => p.id === platId)
              if (plat) {
                setProps({
                  title: plat.plat || "",
                  description: plat.description || "",
                  price: parseFloat(plat.prix?.toString() || "0"),
                  imageSrc: plat.photo_du_plat || "",
                  isVegetarian: !!plat.est_vegetarien,
                  isSpicy: (plat.niveau_epice ?? 0) > 0,
                  quantityInCart: 0,
                })
              }
            }}
            className="focus:ring-thai-orange w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          >
            {plats?.map((plat) => (
              <option key={plat.id} value={plat.id}>
                {plat.plat}
              </option>
            ))}
          </select>
        </div>

        {/* Contrôles Manuels */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={props.title}
              onChange={(e) => setProps({ ...props, title: e.target.value })}
              className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Prix (€)</label>
            <input
              type="number"
              value={props.price}
              onChange={(e) => setProps({ ...props, price: parseFloat(e.target.value) })}
              step="0.1"
              className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Description</label>
          <textarea
            value={props.description}
            onChange={(e) => setProps({ ...props, description: e.target.value })}
            rows={2}
            className="focus:ring-thai-orange w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            value={props.imageSrc}
            onChange={(e) => setProps({ ...props, imageSrc: e.target.value })}
            className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={props.isVegetarian}
              onChange={(e) => setProps({ ...props, isVegetarian: e.target.checked })}
              className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
            />
            <span className="text-sm text-gray-700">🌱 Végétarien</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={props.isSpicy}
              onChange={(e) => setProps({ ...props, isSpicy: e.target.checked })}
              className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
            />
            <span className="text-sm text-gray-700">🌶️ Épicé</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Quantité dans le panier</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="10"
              value={props.quantityInCart}
              onChange={(e) => setProps({ ...props, quantityInCart: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="w-8 text-sm text-gray-600">{props.quantityInCart}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartItemCardPlayground() {
  const { plats, isLoading } = useData()

  const [selectedPlatId, setSelectedPlatId] = useState<number | null>(null)
  const [spiceDistribution, setSpiceDistribution] = useState<number[]>([0, 1, 1, 0]) // Distribution par défaut
  const { mode: previewMode, setMode: setPreviewMode } = usePreviewMode("desktop")
  const [props, setProps] = useState<{
    quantity: number
    isVegetarian: boolean
    isSpicy: boolean
    readOnly: boolean
    imageAspectRatio: "square" | "video" | "auto" | "square-contain" | "video-contain"
    imageObjectPosition: "center" | "top" | "bottom" | "left" | "right" | "custom"
    imageZoom: number
    showSpiceSelector: boolean
    imageWidth: number | undefined
    imageHeight: number | undefined
    useCustomDimensions: boolean
    desktopImageWidth: string
    customImagePositionX: number
    customImagePositionY: number
  }>({
    quantity: 2,
    isVegetarian: false,
    isSpicy: false,
    readOnly: false,
    imageAspectRatio: "square",
    imageObjectPosition: "custom",
    imageZoom: 1,
    showSpiceSelector: false,
    imageWidth: undefined,
    imageHeight: undefined,
    useCustomDimensions: false,
    desktopImageWidth: "w-22",
    customImagePositionX: 20,
    customImagePositionY: 50,
  })

  // Sélectionner "Oeuf Vapeur Thaï" par défaut quand les plats sont chargés
  useEffect(() => {
    if (plats && plats.length > 0 && selectedPlatId === null) {
      const defaultPlat =
        plats.find((p) => p.plat?.toLowerCase().includes("oeuf vapeur")) || plats[0]
      if (defaultPlat) {
        setSelectedPlatId(defaultPlat.id)
        setProps((prev) => ({
          ...prev,
          isVegetarian: !!defaultPlat.est_vegetarien,
          isSpicy: (defaultPlat.niveau_epice ?? 0) > 0,
        }))
      }
    }
  }, [plats, selectedPlatId])

  // Obtenir le plat sélectionné
  const selectedPlat = plats?.find((p) => p.id === selectedPlatId)

  // Synchronisation temps réel avec la fenêtre détachée (moved before early return)
  useEffect(() => {
    if (!selectedPlat) return

    const channel = new BroadcastChannel("preview_channel")
    channel.postMessage({
      type: "UPDATE_PROPS",
      payload: {
        component: "CartItemCard",
        name: selectedPlat.plat || "",
        imageUrl: selectedPlat.photo_du_plat || "",
        price: parseFloat(selectedPlat.prix || "0"),
        quantity: props.quantity,
        isVegetarian: props.isVegetarian,
        readOnly: props.readOnly,
        imageAspectRatio: props.imageAspectRatio,
        imageObjectPosition: props.imageObjectPosition,
        imageZoom: props.imageZoom,
        showSpiceSelector: props.showSpiceSelector,
        imageWidth: props.useCustomDimensions ? props.imageWidth : undefined,
        imageHeight: props.useCustomDimensions ? props.imageHeight : undefined,
        desktopImageWidth: props.desktopImageWidth,
        customImageObjectPosition:
          props.imageObjectPosition === "custom"
            ? `${props.customImagePositionX}% ${props.customImagePositionY}%`
            : undefined,
      },
    })
    return () => channel.close()
  }, [props, selectedPlat])

  // Afficher loading si pas de plats
  if (isLoading || !plats || plats.length === 0) {
    return <div className="py-8 text-center text-gray-500">Chargement des plats...</div>
  }

  const generateCode = () => {
    if (!selectedPlat) return "// Aucun plat sélectionné"
    const lines = [`<CartItemCard`]
    lines.push(`  name="${selectedPlat.plat}"`)
    if (selectedPlat.photo_du_plat) lines.push(`  imageUrl="${selectedPlat.photo_du_plat}"`)
    lines.push(`  unitPrice={${parseFloat(selectedPlat.prix || "0")}}`)
    lines.push(`  quantity={${props.quantity}}`)
    if (props.isVegetarian) lines.push(`  isVegetarian={true}`)
    if (props.isSpicy) lines.push(`  isSpicy={true}`)
    if (props.readOnly) lines.push(`  readOnly={true}`)
    if (props.imageAspectRatio !== "square")
      lines.push(`  imageAspectRatio="${props.imageAspectRatio}"`)
    if (props.imageObjectPosition !== "center")
      lines.push(`  imageObjectPosition="${props.imageObjectPosition}"`)
    if (props.imageZoom !== 1) lines.push(`  imageZoom={${props.imageZoom}}`)
    if (props.useCustomDimensions && props.imageWidth)
      lines.push(`  imageWidth={${props.imageWidth}}`)
    if (props.useCustomDimensions && props.imageHeight)
      lines.push(`  imageHeight={${props.imageHeight}}`)
    if (props.showSpiceSelector) lines.push(`  showSpiceSelector={true}`)
    lines.push(`  onQuantityChange={(qty) => setQuantity(qty)}`)
    lines.push(`  onRemove={() => console.log("Supprimé")}`)
    lines.push(`/>`)
    return lines.join("\n")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast({ title: "Code copié !", description: "Le code a été copié dans le presse-papier" })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      })
    }
  }

  const handleOpenPreview = () => {
    if (!selectedPlat) return

    const params = new URLSearchParams()
    params.set("component", "CartItemCard")
    params.set("name", selectedPlat.plat || "")
    params.set("imageUrl", selectedPlat.photo_du_plat || "")
    params.set("price", selectedPlat.prix?.toString() || "0")
    params.set("quantity", props.quantity.toString())
    params.set("isVegetarian", props.isVegetarian.toString())
    params.set("readOnly", props.readOnly.toString())
    params.set("imageAspectRatio", props.imageAspectRatio)
    params.set("imageObjectPosition", props.imageObjectPosition)
    params.set("imageZoom", props.imageZoom.toString())
    params.set("showSpiceSelector", props.showSpiceSelector.toString())
    params.set("desktopImageWidth", props.desktopImageWidth)
    if (props.imageObjectPosition === "custom") {
      params.set(
        "customImageObjectPosition",
        `${props.customImagePositionX}% ${props.customImagePositionY}%`
      )
    }
    if (props.useCustomDimensions && props.imageWidth) {
      params.set("imageWidth", props.imageWidth.toString())
    }
    if (props.useCustomDimensions && props.imageHeight) {
      params.set("imageHeight", props.imageHeight.toString())
    }

    const url = `/preview?${params.toString()}`
    window.open(url, "_blank", "width=1200,height=800")
  }

  return (
    <div className="space-y-4">
      <div className="border-thai-orange/20 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
            Contrôles Interactifs - CartItemCard
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleOpenPreview}
              className="border-thai-orange text-thai-orange hover:bg-thai-orange transition-all duration-200 hover:text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Détacher
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green transition-all duration-200 hover:text-white"
            >
              Copier le Code
            </Button>
          </div>
        </div>

        {/* Zone de prévisualisation avec MobilePreview */}
        <MobilePreview
          mode={previewMode}
          onModeChange={setPreviewMode}
          showSizeControls={true}
          showToggle={false}
          showTabletToggle={true}
          showPopupButton={true}
          componentName="CartItemCard"
          previewProps={{
            name: selectedPlat?.plat || "Sans nom",
            imageUrl: selectedPlat?.photo_du_plat || "",
            price: parseFloat(selectedPlat?.prix || "0"),
            quantity: props.quantity,
            isVegetarian: props.isVegetarian,
            readOnly: props.readOnly,
            imageAspectRatio: props.imageAspectRatio,
            imageZoom: props.imageZoom,
          }}
          mobileContent={
            selectedPlat ? (
              // Mode Mobile/Tablette : Forcer le layout vertical comme sur mobile
              <div className="p-0">
                <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 transform rounded-lg border border-gray-200 bg-white p-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2">
                  {/* Layout Mobile : Colonne */}
                  <div className="flex flex-col gap-0">
                    {/* Image pleine largeur */}
                    <div className="w-full">
                      <div className="relative">
                        <div className="overflow-hidden rounded-t-lg">
                          {selectedPlat.photo_du_plat ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={selectedPlat.photo_du_plat}
                              alt={selectedPlat.plat || ""}
                              style={{
                                transform: `scale(${props.imageZoom})`,
                                ...(props.useCustomDimensions && props.imageWidth
                                  ? { width: `${props.imageWidth}px` }
                                  : {}),
                                ...(props.useCustomDimensions && props.imageHeight
                                  ? { height: `${props.imageHeight}px` }
                                  : {}),
                              }}
                              className={`w-full cursor-pointer rounded-t-lg transition-opacity duration-200 hover:opacity-80 ${
                                props.imageAspectRatio === "square"
                                  ? "aspect-square"
                                  : props.imageAspectRatio === "video"
                                    ? "aspect-video"
                                    : props.imageAspectRatio === "square-contain"
                                      ? "aspect-square bg-gray-50 object-contain"
                                      : props.imageAspectRatio === "video-contain"
                                        ? "aspect-video bg-gray-50 object-contain"
                                        : ""
                              } ${
                                props.imageAspectRatio.endsWith("-contain")
                                  ? "object-contain"
                                  : "object-cover"
                              } object-${props.imageObjectPosition}`}
                            />
                          ) : (
                            <div className="bg-thai-cream/30 border-thai-orange/20 flex aspect-square w-full cursor-pointer items-center justify-center rounded-t-lg border-b">
                              <span className="text-thai-orange text-xl">🍽️</span>
                            </div>
                          )}
                        </div>
                        {/* Badges Mobile */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-thai-green rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                            Disponible
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="bg-thai-orange rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                            Panier {props.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Infos du plat - centré */}
                    <div className="flex flex-col items-center gap-2 p-3">
                      {/* Nom du plat */}
                      <h4 className="text-thai-green max-w-[90%] text-center text-base font-medium">
                        {selectedPlat.plat}
                      </h4>

                      {/* Prix unitaire */}
                      <div className="flex items-center justify-center text-xs text-gray-600">
                        <span className="font-semibold text-gray-700">Prix unitaire:</span>
                        <span className="bg-secondary text-secondary-foreground ml-1 rounded px-2 py-0.5 text-xs font-bold">
                          {parseFloat(selectedPlat.prix || "0") % 1 === 0
                            ? `${parseFloat(selectedPlat.prix || "0").toFixed(0)}€`
                            : `${parseFloat(selectedPlat.prix || "0")
                                .toFixed(2)
                                .replace(".", ",")}€`}
                        </span>
                      </div>

                      {/* Sélecteur épicé (Mobile) */}
                      {props.showSpiceSelector && (
                        <div className="mt-1 flex justify-center">
                          <div className="origin-center scale-90">
                            <SmartSpice
                              quantity={props.quantity}
                              distribution={spiceDistribution}
                              onDistributionChange={setSpiceDistribution}
                            />
                          </div>
                        </div>
                      )}

                      {/* Badge Végétarien */}
                      {props.isVegetarian && (
                        <div className="mt-1">
                          <span className="h-5 rounded-full border border-green-300 bg-green-50 px-1.5 py-0 text-[10px] text-green-700">
                            🌱 Végétarien
                          </span>
                        </div>
                      )}

                      {/* Contrôles quantité + Prix total */}
                      {!props.readOnly && (
                        <div className="mt-2 flex w-full items-center justify-center gap-2">
                          {/* Poubelle */}
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500"
                            onClick={() =>
                              toast({
                                title: "Supprimé (simulation)",
                                description: "L'article serait supprimé",
                              })
                            }
                          >
                            🗑️
                          </button>

                          {/* Moins */}
                          <button
                            className="border-thai-orange text-thai-orange hover:bg-thai-orange flex h-8 w-8 items-center justify-center rounded-md border bg-white font-bold hover:text-white"
                            onClick={() =>
                              setProps({ ...props, quantity: Math.max(1, props.quantity - 1) })
                            }
                          >
                            -
                          </button>

                          {/* Quantité */}
                          <span className="w-8 text-center font-medium">{props.quantity}</span>

                          {/* Plus */}
                          <button
                            className="border-thai-orange text-thai-orange hover:bg-thai-orange flex h-8 w-8 items-center justify-center rounded-md border bg-white font-bold hover:text-white"
                            onClick={() => setProps({ ...props, quantity: props.quantity + 1 })}
                          >
                            +
                          </button>

                          {/* Prix Total */}
                          <div className="text-thai-orange ml-2 text-lg font-bold">
                            {(parseFloat(selectedPlat.prix || "0") * props.quantity) % 1 === 0
                              ? `${(parseFloat(selectedPlat.prix || "0") * props.quantity).toFixed(0)}€`
                              : `${(parseFloat(selectedPlat.prix || "0") * props.quantity).toFixed(2).replace(".", ",")}€`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">Chargement des plats...</div>
            )
          }
        >
          {/* Mode Desktop : Utiliser le composant normal */}
          {selectedPlat ? (
            <CartItemCard
              name={selectedPlat.plat || "Sans nom"}
              imageUrl={selectedPlat.photo_du_plat || ""}
              unitPrice={parseFloat(selectedPlat.prix || "0")}
              quantity={props.quantity}
              isVegetarian={props.isVegetarian}
              isSpicy={props.isSpicy}
              readOnly={props.readOnly}
              imageAspectRatio={props.imageAspectRatio}
              imageObjectPosition={
                props.imageObjectPosition === "custom" ? undefined : props.imageObjectPosition
              }
              customImageObjectPosition={
                props.imageObjectPosition === "custom"
                  ? `${props.customImagePositionX}% ${props.customImagePositionY}%`
                  : undefined
              }
              imageZoom={props.imageZoom}
              imageWidth={props.useCustomDimensions ? props.imageWidth : undefined}
              imageHeight={props.useCustomDimensions ? props.imageHeight : undefined}
              desktopImageWidth={props.desktopImageWidth}
              showSpiceSelector={props.showSpiceSelector}
              spiceSelectorSlot={
                props.showSpiceSelector ? (
                  <SmartSpice
                    quantity={props.quantity}
                    distribution={spiceDistribution}
                    onDistributionChange={setSpiceDistribution}
                  />
                ) : undefined
              }
              onQuantityChange={(qty) => setProps({ ...props, quantity: qty })}
              onRemove={() =>
                toast({ title: "Supprimé (simulation)", description: "L'article serait supprimé" })
              }
              onClick={() =>
                toast({ title: "Clic !", description: `Clic sur ${selectedPlat.plat}` })
              }
            />
          ) : (
            <div className="py-8 text-center text-gray-500">Chargement des plats...</div>
          )}
        </MobilePreview>

        {/* Section Sélecteur de Plat */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            🍜 Sélectionner un plat (données réelles)
          </label>
          <select
            value={selectedPlatId || ""}
            onChange={(e) => {
              const platId = Number(e.target.value)
              setSelectedPlatId(platId)
              const plat = plats.find((p) => p.id === platId)
              if (plat) {
                setProps((prev) => ({
                  ...prev,
                  isVegetarian: !!plat.est_vegetarien,
                  isSpicy: (plat.niveau_epice ?? 0) > 0,
                }))
              }
            }}
            className="focus:ring-thai-orange w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          >
            {plats.length === 0 ? (
              <option value="">Chargement des plats...</option>
            ) : (
              plats.map((plat) => (
                <option key={plat.id} value={plat.id}>
                  {plat.plat} - {plat.prix}€ {plat.est_vegetarien ? "🌱" : ""}{" "}
                  {(plat.niveau_epice ?? 0) > 0 ? "🌶️" : ""}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Section Dimension image */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            📐 Dimension de l'image (ratio)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "square", label: "1:1 (Carré)" },
              { value: "video", label: "16:9 (Vidéo)" },
              { value: "auto", label: "Auto" },
              { value: "square-contain", label: "1:1 (Entier)" },
              { value: "video-contain", label: "16:9 (Entier)" },
            ].map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={props.imageAspectRatio === option.value ? "default" : "outline"}
                onClick={() =>
                  setProps({
                    ...props,
                    imageAspectRatio: option.value as typeof props.imageAspectRatio,
                    useCustomDimensions: false,
                  })
                }
                className={
                  props.imageAspectRatio === option.value && !props.useCustomDimensions
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
                disabled={props.useCustomDimensions}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Dimensions personnalisées */}
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={props.useCustomDimensions}
              onChange={(e) => setProps({ ...props, useCustomDimensions: e.target.checked })}
              className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
            />
            <span className="text-xs font-medium text-gray-700">
              📏 Dimensions personnalisées (px)
            </span>
          </label>
          {props.useCustomDimensions && (
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Largeur</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="48"
                    max="300"
                    step="8"
                    value={props.imageWidth || 96}
                    onChange={(e) => setProps({ ...props, imageWidth: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="w-14 text-sm text-gray-600">{props.imageWidth}px</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Hauteur</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="48"
                    max="300"
                    step="8"
                    value={props.imageHeight || 96}
                    onChange={(e) => setProps({ ...props, imageHeight: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="w-14 text-sm text-gray-600">{props.imageHeight}px</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Largeur Desktop */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🖥️ Largeur Desktop (sm:)</label>
          <div className="flex flex-wrap gap-2">
            {["w-16", "w-20", "w-22", "w-24", "w-32", "w-40", "w-48"].map((width) => (
              <Button
                key={width}
                size="sm"
                variant={props.desktopImageWidth === width ? "default" : "outline"}
                onClick={() => setProps({ ...props, desktopImageWidth: width })}
                className={
                  props.desktopImageWidth === width
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
                disabled={props.useCustomDimensions}
              >
                {width}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Position image */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🎯 Position de l'image</label>
          <div className="flex flex-wrap gap-2">
            {(["center", "top", "bottom", "left", "right", "custom"] as const).map((pos) => (
              <Button
                key={pos}
                size="sm"
                variant={props.imageObjectPosition === pos ? "default" : "outline"}
                onClick={() => setProps({ ...props, imageObjectPosition: pos })}
                className={
                  props.imageObjectPosition === pos
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {pos}
              </Button>
            ))}
          </div>
          {props.imageObjectPosition === "custom" && (
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position X (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={props.customImagePositionX}
                    onChange={(e) =>
                      setProps({ ...props, customImagePositionX: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="w-8 text-sm text-gray-600">{props.customImagePositionX}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position Y (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={props.customImagePositionY}
                    onChange={(e) =>
                      setProps({ ...props, customImagePositionY: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="w-8 text-sm text-gray-600">{props.customImagePositionY}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Zoom */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🔍 Zoom image</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={props.imageZoom}
              onChange={(e) => setProps({ ...props, imageZoom: Number(e.target.value) })}
              className="flex-1"
            />
            <span className="w-12 text-sm text-gray-600">{props.imageZoom}x</span>
          </div>
        </div>

        {/* Section Quantité */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🔢 Quantité</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={props.quantity}
              onChange={(e) => setProps({ ...props, quantity: Number(e.target.value) })}
              className="flex-1"
            />
            <span className="w-8 text-sm text-gray-600">{props.quantity}</span>
          </div>
        </div>

        {/* Section Badges */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">🏷️ Badges</label>
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={props.isVegetarian}
                onChange={(e) => setProps({ ...props, isVegetarian: e.target.checked })}
                className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
              />
              <span className="text-sm text-gray-700">🌱 Végétarien</span>
            </label>
          </div>
        </div>

        {/* Section Options */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">⚙️ Options</label>
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={props.readOnly}
                onChange={(e) => setProps({ ...props, readOnly: e.target.checked })}
                className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Mode lecture seule (readOnly)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={props.showSpiceSelector}
                onChange={(e) => setProps({ ...props, showSpiceSelector: e.target.checked })}
                className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                Afficher emplacement épices (showSpiceSelector)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PLAYGROUND ORDER HISTORY CARD
// ============================================================================

const ORDER_STATUTS = [
  "En attente de confirmation",
  "Confirmée",
  "En préparation",
  "Prête à récupérer",
  "Récupérée",
  "Annulée",
] as const

const MOCK_PLATS = [
  {
    id: 1,
    nom: "Pad Thaï",
    prix: "12.90",
    isVegetarian: false,
    isSpicy: true,
    spiceLevel: 2,
    photo: "/media/avatars/panier1.svg",
  },
  {
    id: 2,
    nom: "Tom Yum Soup",
    prix: "8.50",
    isVegetarian: false,
    isSpicy: true,
    spiceLevel: 3,
    photo: "/media/avatars/panier2.svg",
  },
  {
    id: 3,
    nom: "Green Curry",
    prix: "14.50",
    isVegetarian: true,
    isSpicy: true,
    spiceLevel: 2,
    photo: "/media/avatars/panier3.svg",
  },
  {
    id: 4,
    nom: "Spring Rolls",
    prix: "6.90",
    isVegetarian: true,
    isSpicy: false,
    spiceLevel: 0,
    photo: "/media/avatars/assiette1.svg",
  },
  {
    id: 5,
    nom: "Mango Sticky Rice",
    prix: "5.50",
    isVegetarian: true,
    isSpicy: false,
    spiceLevel: 0,
    photo: "/media/avatars/assiette2.svg",
  },
]

function OrderHistoryCardPlayground() {
  const { plats } = useData()
  const [props, setProps] = useState<{
    statut: (typeof ORDER_STATUTS)[number]
    dateRetrait: Date
    showDate: boolean
    canEdit: boolean
    commandeId: number
    datePriseCommande: Date
    nombrePlats: number
    demandesSpeciales: string
  }>({
    statut: "En attente de confirmation",
    dateRetrait: new Date(2025, 0, 25, 18, 30),
    showDate: true,
    canEdit: true,
    commandeId: 42,
    datePriseCommande: new Date(2025, 0, 22),
    nombrePlats: 3,
    demandesSpeciales: "",
  })

  // Utilise les vrais plats de la base de données
  const realPlats = useMemo(() => plats?.slice(0, 5) || [], [plats])

  // Génère une commande mockée avec les vrais plats
  const mockCommande = useMemo(() => {
    const platsToUse = realPlats.length > 0 ? realPlats : MOCK_PLATS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const details = platsToUse.slice(0, props.nombrePlats).map((plat: any, idx: number) => ({
      iddetails: idx + 1,
      commande_r: props.commandeId,
      plat_r: plat.idplats || plat.id,
      quantite_plat_commande: (idx % 3) + 1,
      prix_unitaire: plat.prix,
      type: "plat" as const,
      nom_plat: null,
      extra_id: null,
      est_offert: false,
      preference_epice_niveau:
        (plat.niveau_epice || plat.spiceLevel) > 0 ? plat.niveau_epice || plat.spiceLevel : null,
      spice_distribution: (plat.niveau_epice || plat.spiceLevel) > 0 ? [0, 1, 1, 0] : null,
      plat: {
        id: plat.idplats || plat.id,
        idplats: plat.idplats || plat.id,
        plat: plat.plat || plat.nom,
        prix: plat.prix,
        description: plat.description || `Délicieux ${plat.plat || plat.nom}`,
        photo_du_plat: plat.photo_du_plat || plat.photo,
        lundi_dispo: plat.lundi_dispo || "midi_et_soir",
        mardi_dispo: plat.mardi_dispo || "midi_et_soir",
        mercredi_dispo: plat.mercredi_dispo || "midi_et_soir",
        jeudi_dispo: plat.jeudi_dispo || "midi_et_soir",
        vendredi_dispo: plat.vendredi_dispo || "midi_et_soir",
        samedi_dispo: plat.samedi_dispo || "midi_et_soir",
        dimanche_dispo: plat.dimanche_dispo || "indisponible",
        est_epuise: plat.est_epuise || false,
        epuise_depuis: plat.epuise_depuis || null,
        epuise_jusqu_a: plat.epuise_jusqu_a || null,
        raison_epuisement: plat.raison_epuisement || null,
        est_vegetarien: plat.est_vegetarien || plat.isVegetarian || false,
        niveau_epice: plat.niveau_epice || plat.spiceLevel || 0,
      },
    }))

    const total = details.reduce(
      (acc, d) => acc + parseFloat(d.prix_unitaire || "0") * (d.quantite_plat_commande || 1),
      0
    )

    return {
      id: props.commandeId,
      idcommande: props.commandeId,
      client_r: null,
      client_r_id: 1,
      date_et_heure_de_retrait_souhaitees: props.showDate ? props.dateRetrait.toISOString() : null,
      date_de_prise_de_commande: props.datePriseCommande.toISOString(),
      statut_commande: props.statut,
      statut_paiement: "En attente sur place",
      type_livraison: "À emporter",
      demande_special_pour_la_commande: props.demandesSpeciales || null,
      adresse_specifique: null,
      notes_internes: null,
      prix_total: total.toFixed(2),
      epingle: false,
      details,
    } as unknown as CommandeUI
  }, [props, realPlats])

  const generateCode = () => {
    const lines = [`<OrderHistoryCard`]
    lines.push(`  commande={mockCommande}`)
    lines.push(`  canEdit={${props.canEdit}}`)
    lines.push(`/>`)
    return lines.join("\n")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast({ title: "Code copié !", description: "Le code a été copié dans le presse-papier" })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-thai-green/20 ring-thai-green/30 ring-2">
      <CardHeader className="bg-thai-cream/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-thai-green flex items-center gap-2 text-2xl">
              📋 OrderHistoryCard
              <Badge className="bg-thai-green text-white">Historique</Badge>
            </CardTitle>
            <CardDescription>
              Composant: <code className="text-xs">components/historique/OrderHistoryCard.tsx</code>
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
              >
                <Info className="mr-2 h-4 w-4" />
                Props
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-thai-green">📋 Props OrderHistoryCard</DialogTitle>
                <DialogDescription>Documentation des propriétés</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-xs">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-thai-cream/50">
                      <th className="border p-1.5 text-left">Prop</th>
                      <th className="border p-1.5 text-left">Type</th>
                      <th className="border p-1.5 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-1.5 font-mono">commande</td>
                      <td className="border p-1.5">CommandeUI</td>
                      <td className="border p-1.5">Objet commande complet (requis)</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">canEdit</td>
                      <td className="border p-1.5">boolean</td>
                      <td className="border p-1.5">Active les boutons Voir/Modifier</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">extras</td>
                      <td className="border p-1.5">ExtraUI[]</td>
                      <td className="border p-1.5">Liste des extras pour calcul prix</td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="mt-4 text-sm font-semibold">Champs clés de CommandeUI</h4>
                <table className="mt-2 w-full border-collapse">
                  <thead>
                    <tr className="bg-thai-cream/50">
                      <th className="border p-1.5 text-left">Champ</th>
                      <th className="border p-1.5 text-left">Type</th>
                      <th className="border p-1.5 text-left">Affichage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-1.5 font-mono text-xs">statut_commande</td>
                      <td className="border p-1.5">string</td>
                      <td className="border p-1.5">Badge statut + couleur header</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono text-xs">
                        date_et_heure_de_retrait_souhaitees
                      </td>
                      <td className="border p-1.5">string | null</td>
                      <td className="border p-1.5">Calendrier + header centré</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono text-xs">date_de_prise_de_commande</td>
                      <td className="border p-1.5">string</td>
                      <td className="border p-1.5">"(Commandé le...)" dans header</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono text-xs">
                        demande_special_pour_la_commande
                      </td>
                      <td className="border p-1.5">string | null</td>
                      <td className="border p-1.5">Section "📝 Note client"</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono text-xs">details</td>
                      <td className="border p-1.5">DetailCommande[]</td>
                      <td className="border p-1.5">Liste plats (collapsible si &gt;3)</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono text-xs">prix_total</td>
                      <td className="border p-1.5">string | Decimal</td>
                      <td className="border p-1.5">Total affiché en bas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="border-thai-green/20 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-thai-green text-lg font-semibold">Contrôles Interactifs</h4>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
            >
              Copier le Code
            </Button>
          </div>

          {/* Preview Zone */}
          <div className="relative rounded-lg border border-dashed bg-gray-50 p-4">
            <p className="absolute top-2 left-4 text-sm font-medium text-gray-500">
              Prévisualisation
            </p>
            <div className="mt-6">
              <OrderHistoryCard commande={mockCommande} canEdit={props.canEdit} />
            </div>
          </div>

          {/* Statut Control */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">🚦 Statut de la Commande</label>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUTS.map((statut) => (
                <Button
                  key={statut}
                  size="sm"
                  variant={props.statut === statut ? "default" : "outline"}
                  onClick={() => setProps({ ...props, statut })}
                  className={
                    props.statut === statut
                      ? "bg-thai-green hover:bg-thai-green/90"
                      : "border-thai-green/30 text-thai-green hover:bg-thai-green/10"
                  }
                >
                  {statut}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Control */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">📅 Date de Retrait</label>
            <div className="flex items-center gap-4">
              <input
                type="datetime-local"
                value={`${props.dateRetrait.getFullYear()}-${String(props.dateRetrait.getMonth() + 1).padStart(2, "0")}-${String(props.dateRetrait.getDate()).padStart(2, "0")}T${String(props.dateRetrait.getHours()).padStart(2, "0")}:${String(props.dateRetrait.getMinutes()).padStart(2, "0")}`}
                onChange={(e) => setProps({ ...props, dateRetrait: new Date(e.target.value) })}
                className="focus:ring-thai-green flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showDate}
                  onChange={(e) => setProps({ ...props, showDate: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">Afficher date</span>
              </label>
            </div>
          </div>

          {/* Nombre de Plats */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              🍜 Nombre de Plats ({props.nombrePlats})
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={props.nombrePlats}
              onChange={(e) => setProps({ ...props, nombrePlats: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">✨ Options</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.canEdit}
                  onChange={(e) => setProps({ ...props, canEdit: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">Boutons d'édition (canEdit)</span>
              </label>
            </div>
          </div>

          {/* ID Commande */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">🔢 N° Commande</label>
              <input
                type="number"
                min="1"
                value={props.commandeId}
                onChange={(e) => setProps({ ...props, commandeId: Number(e.target.value) })}
                className="focus:ring-thai-green w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">📆 Date prise commande</label>
              <input
                type="datetime-local"
                value={`${props.datePriseCommande.getFullYear()}-${String(props.datePriseCommande.getMonth() + 1).padStart(2, "0")}-${String(props.datePriseCommande.getDate()).padStart(2, "0")}T${String(props.datePriseCommande.getHours()).padStart(2, "0")}:${String(props.datePriseCommande.getMinutes()).padStart(2, "0")}`}
                onChange={(e) =>
                  setProps({ ...props, datePriseCommande: new Date(e.target.value) })
                }
                className="focus:ring-thai-green w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Demandes Spéciales */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              📝 Demandes Spéciales (Note client)
            </label>
            <textarea
              value={props.demandesSpeciales}
              onChange={(e) => setProps({ ...props, demandesSpeciales: e.target.value })}
              placeholder="Ex: Sans cacahuètes, allergique aux crustacés..."
              className="focus:ring-thai-green w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CardsTestPage() {
  const { plats: _plats, isLoading: _isLoading } = useData()
  const [_spiceDistribution, _setSpiceDistribution] = useState<number[]>([0, 2, 2, 1])
  const [_quantity, _setQuantity] = useState(5)

  const _NumberBadge = ({ number }: { number: number }) => (
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

      {/* Section 0: OrderHistoryCard Playground */}
      <OrderHistoryCardPlayground />

      {/* Section 2: Cards Produit (Composant ProductCard) */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">1. ProductCard</CardTitle>
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
          <ProductCardPlayground />
        </CardContent>
      </Card>

      {/* Section 2.5: Cards Panier (Composant CartItemCard) */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">2. CartItemCard</CardTitle>
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
          <CartItemCardPlayground />
        </CardContent>
      </Card>

      {/* Section 4: Composants Spéciaux - Playground PolaroidPhoto */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">3. PolaroidPhoto</CardTitle>
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
              <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>src</strong> (string): URL de l'image (Requis)
                  </li>
                  <li>
                    <strong>alt</strong> (string): Texte alternatif (Requis)
                  </li>
                  <li className="border-t border-gray-200 pt-2">
                    <strong className="text-thai-green">Contenu</strong>
                  </li>
                  <li>
                    <strong>title</strong> (string): Titre sous l'image
                  </li>
                  <li>
                    <strong>description</strong> (string): Description sous le titre (supporte
                    balises couleur/style)
                  </li>
                  <li>
                    <strong>titleColor</strong> ("thai-green" | "thai-orange" | "white" | "black"):
                    Couleur du texte (défaut: "thai-green")
                  </li>
                  <li>
                    <strong>scrollingText</strong> (boolean): Active le défilement marquee (défaut:
                    false)
                  </li>
                  <li>
                    <strong>scrollDuration</strong> (number): Durée du défilement en secondes
                    (défaut: 10)
                  </li>
                  <li className="border-t border-gray-200 pt-2">
                    <strong className="text-thai-green">Position</strong>
                  </li>
                  <li>
                    <strong>position</strong> ("bottom-right" | "bottom-left" | "top-right" |
                    "top-left" | "center" | "custom"): Position (défaut: "bottom-right")
                  </li>
                  <li>
                    <strong>customX / customY</strong> (string): Position custom (si
                    position="custom")
                  </li>
                  <li className="border-t border-gray-200 pt-2">
                    <strong className="text-thai-green">Taille</strong>
                  </li>
                  <li>
                    <strong>size</strong> ("sm" | "md" | "lg" | "xl" | "custom"): Taille prédéfinie
                    (défaut: "md")
                  </li>
                  <li>
                    <strong>customSize</strong> (number): Taille custom en px (si size="custom")
                  </li>
                  <li>
                    <strong>rotation</strong> (number): Rotation en degrés (défaut: 3)
                  </li>
                  <li>
                    <strong>aspectRatio</strong> ("16:9" | "4:5" | "1:1" | "auto"): Format de
                    l'image (défaut: "1:1")
                  </li>
                  <li className="border-t border-gray-200 pt-2">
                    <strong className="text-thai-green">Bordure</strong>
                  </li>
                  <li>
                    <strong>borderColor</strong> ("thai-orange" | "thai-green" | "red" | "blue" |
                    "custom"): Couleur bordure (défaut: "thai-green")
                  </li>
                  <li>
                    <strong>customBorderColor</strong> (string): Classe Tailwind custom (si
                    borderColor="custom")
                  </li>
                  <li>
                    <strong>borderWidth</strong> (1 | 2 | 4 | "custom"): Épaisseur bordure (défaut:
                    1)
                  </li>
                  <li>
                    <strong>customBorderWidth</strong> (number): Épaisseur custom en px (si
                    borderWidth="custom")
                  </li>
                  <li className="border-t border-gray-200 pt-2">
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
