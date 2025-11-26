"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { toastVideo } from "@/hooks/use-toast-video"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  BorderColor,
  ShadowSize,
  MaxWidth,
  TitleColor,
  DescriptionColor,
  ToastPosition,
  FontWeight,
} from "@/components/ui/toast"

// ============================================================================
// SECTION 1: PLAYGROUND TOASTER (Simple)
// ============================================================================

function ToasterPlayground() {
  const [props, setProps] = useState<{
    title: string
    description: string
    variant: "default" | "destructive" | "polaroid" | "success" | "warning" | "info"
    tilted: boolean
    tiltedAngle: number
    duration: number
    borderColor: BorderColor
    customBorderColor: string
    borderWidth: 1 | 2 | 4 | "custom"
    customBorderWidth: number
    shadowSize: ShadowSize
    maxWidth: MaxWidth
    titleColor: TitleColor
    titleFontWeight: FontWeight
    descriptionColor: DescriptionColor
    descriptionFontWeight: FontWeight
    animateBorder: boolean
    hoverScale: boolean
    position: ToastPosition
    customX: string
    customY: string
  }>({
    title: "Notification",
    description: "Ceci est un message de notification",
    variant: "default",
    tilted: false,
    tiltedAngle: -3,
    duration: 5000,
    borderColor: "thai-orange",
    customBorderColor: "border-purple-500",
    borderWidth: 2,
    customBorderWidth: 3,
    shadowSize: "lg",
    maxWidth: "lg",
    titleColor: "thai-green",
    titleFontWeight: "bold",
    descriptionColor: "thai-green",
    descriptionFontWeight: "semibold",
    animateBorder: false,
    hoverScale: false,
    position: "bottom-right",
    customX: "50%",
    customY: "50%",
  })

  const handleShowToast = () => {
    toast({
      title: props.title,
      description: props.description,
      variant: props.variant,
      tilted: props.tilted ? props.tiltedAngle : false,
      duration: props.duration,
      borderColor: props.borderColor === "custom" ? "custom" : props.borderColor,
      customBorderColor: props.borderColor === "custom" ? props.customBorderColor : undefined,
      borderWidth: props.borderWidth,
      customBorderWidth: props.borderWidth === "custom" ? props.customBorderWidth : undefined,
      shadowSize: props.shadowSize,
      maxWidth: props.maxWidth,
      titleColor: props.titleColor,
      titleFontWeight: props.titleFontWeight,
      descriptionColor: props.descriptionColor,
      descriptionFontWeight: props.descriptionFontWeight,
      animateBorder: props.animateBorder,
      hoverScale: props.hoverScale,
      position: props.position,
      customX: props.position === "custom" ? props.customX : undefined,
      customY: props.position === "custom" ? props.customY : undefined,
    })
  }

  const generateCode = () => {
    const lines = [`toast({`]
    lines.push(`  title: "${props.title}",`)
    lines.push(`  description: "${props.description}",`)
    if (props.variant !== "default") lines.push(`  variant: "${props.variant}",`)
    if (props.tilted) lines.push(`  tilted: ${props.tiltedAngle},`)
    if (props.duration !== 5000) lines.push(`  duration: ${props.duration},`)
    if (props.position !== "bottom-right") {
      lines.push(`  position: "${props.position}",`)
      if (props.position === "custom") {
        lines.push(`  customX: "${props.customX}",`)
        lines.push(`  customY: "${props.customY}",`)
      }
    }
    if (props.borderColor !== "thai-orange") {
      lines.push(`  borderColor: "${props.borderColor}",`)
      if (props.borderColor === "custom") {
        lines.push(`  customBorderColor: "${props.customBorderColor}",`)
      }
    }
    if (props.borderWidth !== 2) {
      lines.push(`  borderWidth: ${props.borderWidth === "custom" ? `"custom"` : props.borderWidth},`)
      if (props.borderWidth === "custom") {
        lines.push(`  customBorderWidth: ${props.customBorderWidth},`)
      }
    }
    if (props.shadowSize !== "lg") lines.push(`  shadowSize: "${props.shadowSize}",`)
    if (props.maxWidth !== "lg") lines.push(`  maxWidth: "${props.maxWidth}",`)
    if (props.titleColor !== "thai-green") lines.push(`  titleColor: "${props.titleColor}",`)
    if (props.titleFontWeight !== "bold") lines.push(`  titleFontWeight: "${props.titleFontWeight}",`)
    if (props.descriptionColor !== "thai-green") lines.push(`  descriptionColor: "${props.descriptionColor}",`)
    if (props.descriptionFontWeight !== "semibold") lines.push(`  descriptionFontWeight: "${props.descriptionFontWeight}",`)
    if (props.animateBorder) lines.push(`  animateBorder: true,`)
    if (props.hoverScale) lines.push(`  hoverScale: true,`)
    lines.push(`})`)
    return lines.join("\n")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast({ title: "Code copie !", description: "Le code a ete copie dans le presse-papier" })
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier le code", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border border-thai-orange/20 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg text-thai-green flex items-center gap-2">
            Controles Interactifs - Toaster
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
            >
              Copier le Code
            </Button>
            <Button
              size="lg"
              onClick={handleShowToast}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Afficher Toast
            </Button>
          </div>
        </div>

        {/* Section Contenu */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Contenu</label>
          <div className="space-y-2">
            <input
              type="text"
              value={props.title}
              onChange={(e) => setProps({ ...props, title: e.target.value })}
              placeholder="Titre du toast"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
            <textarea
              value={props.description}
              onChange={(e) => setProps({ ...props, description: e.target.value })}
              placeholder="Description du toast"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Section Variant */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Variant</label>
          <div className="flex gap-2 flex-wrap">
            {(["default", "destructive", "polaroid", "success", "warning", "info"] as const).map((v) => (
              <Button
                key={v}
                size="sm"
                variant={props.variant === v ? "default" : "outline"}
                onClick={() => setProps({ ...props, variant: v })}
                className={props.variant === v
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {v}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Position */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Position du toast</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { label: "Bas droite", value: "bottom-right" as const },
              { label: "Bas gauche", value: "bottom-left" as const },
              { label: "Haut droite", value: "top-right" as const },
              { label: "Haut gauche", value: "top-left" as const },
              { label: "Centre", value: "center" as const },
              { label: "Custom", value: "custom" as const },
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
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position X (left)</label>
                <input
                  type="text"
                  value={props.customX}
                  onChange={(e) => setProps({ ...props, customX: e.target.value })}
                  placeholder="ex: 50%, 100px, 10vw"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position Y (top)</label>
                <input
                  type="text"
                  value={props.customY}
                  onChange={(e) => setProps({ ...props, customY: e.target.value })}
                  placeholder="ex: 50%, 100px, 10vh"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Couleur Bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur bordure</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { label: "Orange", value: "thai-orange" as const },
              { label: "Vert", value: "thai-green" as const },
              { label: "Rouge", value: "red" as const },
              { label: "Bleu", value: "blue" as const },
              { label: "Jaune", value: "yellow" as const },
              { label: "Violet", value: "purple" as const },
              { label: "Custom", value: "custom" as const },
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
              placeholder="ex: border-purple-500"
              className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
          )}
        </div>

        {/* Section Epaisseur Bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Epaisseur bordure</label>
          <div className="flex gap-2">
            {([1, 2, 4, "custom"] as const).map((w) => (
              <Button
                key={String(w)}
                size="sm"
                variant={props.borderWidth === w ? "default" : "outline"}
                onClick={() => setProps({ ...props, borderWidth: w })}
                className={props.borderWidth === w
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {w === "custom" ? "Custom" : `${w}px`}
              </Button>
            ))}
          </div>
          {props.borderWidth === "custom" && (
            <input
              type="number"
              value={props.customBorderWidth}
              onChange={(e) => setProps({ ...props, customBorderWidth: Number(e.target.value) })}
              min={1}
              max={20}
              className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
          )}
        </div>

        {/* Section Ombre */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Ombre</label>
          <div className="flex gap-2 flex-wrap">
            {(["none", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={props.shadowSize === s ? "default" : "outline"}
                onClick={() => setProps({ ...props, shadowSize: s })}
                className={props.shadowSize === s
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Largeur Max */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Largeur max</label>
          <div className="flex gap-2">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((w) => (
              <Button
                key={w}
                size="sm"
                variant={props.maxWidth === w ? "default" : "outline"}
                onClick={() => setProps({ ...props, maxWidth: w })}
                className={props.maxWidth === w
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Couleurs Texte */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur du titre</label>
          <div className="flex gap-2 flex-wrap">
            {(["thai-green", "thai-orange", "white", "black", "thai-gold", "inherit"] as const).map((c) => (
              <Button
                key={c}
                size="sm"
                variant={props.titleColor === c ? "default" : "outline"}
                onClick={() => setProps({ ...props, titleColor: c })}
                className={props.titleColor === c
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Poids du titre</label>
          <div className="flex gap-2 flex-wrap">
            {(["normal", "medium", "semibold", "bold", "extrabold"] as const).map((w) => (
              <Button
                key={w}
                size="sm"
                variant={props.titleFontWeight === w ? "default" : "outline"}
                onClick={() => setProps({ ...props, titleFontWeight: w })}
                className={props.titleFontWeight === w
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur de la description</label>
          <div className="flex gap-2 flex-wrap">
            {(["thai-green", "thai-orange", "gray", "black", "inherit"] as const).map((c) => (
              <Button
                key={c}
                size="sm"
                variant={props.descriptionColor === c ? "default" : "outline"}
                onClick={() => setProps({ ...props, descriptionColor: c })}
                className={props.descriptionColor === c
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Poids de la description</label>
          <div className="flex gap-2 flex-wrap">
            {(["normal", "medium", "semibold", "bold", "extrabold"] as const).map((w) => (
              <Button
                key={w}
                size="sm"
                variant={props.descriptionFontWeight === w ? "default" : "outline"}
                onClick={() => setProps({ ...props, descriptionFontWeight: w })}
                className={props.descriptionFontWeight === w
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Animation */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Animations & Effets</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={props.tilted}
                onChange={(e) => setProps({ ...props, tilted: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Inclinaison (tilted)</span>
            </label>
            {props.tilted && (
              <div className="flex items-center gap-2 ml-6">
                <label className="text-xs text-gray-600">Angle:</label>
                <input
                  type="number"
                  value={props.tiltedAngle}
                  onChange={(e) => setProps({ ...props, tiltedAngle: Number(e.target.value) })}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange"
                  min="-15"
                  max="15"
                />
                <span className="text-xs text-gray-600">deg</span>
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

        {/* Section Duree */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Duree (ms)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1000"
              max="15000"
              step="1000"
              value={props.duration}
              onChange={(e) => setProps({ ...props, duration: Number(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-16">{props.duration}ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 2: PLAYGROUND TOASTER VIDEO
// ============================================================================

function ToasterVideoPlayground() {
  const [props, setProps] = useState<{
    title: string
    description: string
    media: string
    position: ToastPosition
    customX: string
    customY: string
    aspectRatio: "16:9" | "4:5" | "1:1" | undefined
    polaroid: boolean
    scrollingText: boolean
    scrollDuration: number
    borderColor: BorderColor
    customBorderColor: string
    borderWidth: 1 | 2 | 4 | "custom"
    customBorderWidth: number
    shadowSize: ShadowSize
    maxWidth: MaxWidth
    titleColor: TitleColor
    descriptionColor: DescriptionColor
    animateBorder: boolean
    hoverScale: boolean
    loopVideo: boolean
    showCloseButton: boolean
  }>({
    title: "Plat ajoute !",
    description: "Pad Thai ajoute au panier",
    media: "/media/animations/toasts/ajoutpaniernote.mp4",
    position: "bottom-right",
    customX: "50%",
    customY: "50%",
    aspectRatio: "16:9",
    polaroid: false,
    scrollingText: false,
    scrollDuration: 10,
    borderColor: "thai-orange",
    customBorderColor: "border-purple-500",
    borderWidth: 2,
    customBorderWidth: 3,
    shadowSize: "2xl",
    maxWidth: "md",
    titleColor: "thai-green",
    descriptionColor: "thai-green",
    animateBorder: false,
    hoverScale: false,
    loopVideo: false,
    showCloseButton: true,
  })

  const handleShowToast = () => {
    toastVideo({
      title: props.title,
      description: props.description,
      media: props.media,
      position: props.position,
      customX: props.position === "custom" ? props.customX : undefined,
      customY: props.position === "custom" ? props.customY : undefined,
      aspectRatio: props.aspectRatio,
      polaroid: props.polaroid,
      scrollingText: props.scrollingText,
      scrollDuration: props.scrollDuration,
      borderColor: props.borderColor === "custom" ? "custom" : props.borderColor,
      customBorderColor: props.borderColor === "custom" ? props.customBorderColor : undefined,
      borderWidth: props.borderWidth,
      customBorderWidth: props.borderWidth === "custom" ? props.customBorderWidth : undefined,
      shadowSize: props.shadowSize,
      maxWidth: props.maxWidth,
      titleColor: props.titleColor,
      descriptionColor: props.descriptionColor,
      animateBorder: props.animateBorder,
      hoverScale: props.hoverScale,
      loopVideo: props.loopVideo,
      showCloseButton: props.showCloseButton,
    })
  }

  const generateCode = () => {
    const lines = [`toastVideo({`]
    lines.push(`  title: "${props.title}",`)
    lines.push(`  description: "${props.description}",`)
    lines.push(`  media: "${props.media}",`)
    if (props.position !== "bottom-right") {
      lines.push(`  position: "${props.position}",`)
      if (props.position === "custom") {
        lines.push(`  customX: "${props.customX}",`)
        lines.push(`  customY: "${props.customY}",`)
      }
    }
    if (props.aspectRatio) lines.push(`  aspectRatio: "${props.aspectRatio}",`)
    if (props.polaroid) lines.push(`  polaroid: true,`)
    if (props.scrollingText) {
      lines.push(`  scrollingText: true,`)
      lines.push(`  scrollDuration: ${props.scrollDuration},`)
    }
    if (props.borderColor !== "thai-orange") {
      lines.push(`  borderColor: "${props.borderColor}",`)
      if (props.borderColor === "custom") {
        lines.push(`  customBorderColor: "${props.customBorderColor}",`)
      }
    }
    if (props.borderWidth !== 2) {
      lines.push(`  borderWidth: ${props.borderWidth === "custom" ? `"custom"` : props.borderWidth},`)
      if (props.borderWidth === "custom") {
        lines.push(`  customBorderWidth: ${props.customBorderWidth},`)
      }
    }
    if (props.shadowSize !== "2xl") lines.push(`  shadowSize: "${props.shadowSize}",`)
    if (props.maxWidth !== "md") lines.push(`  maxWidth: "${props.maxWidth}",`)
    if (props.titleColor !== "thai-green") lines.push(`  titleColor: "${props.titleColor}",`)
    if (props.descriptionColor !== "thai-green") lines.push(`  descriptionColor: "${props.descriptionColor}",`)
    if (props.animateBorder) lines.push(`  animateBorder: true,`)
    if (props.hoverScale) lines.push(`  hoverScale: true,`)
    if (props.loopVideo) lines.push(`  loopVideo: true,`)
    if (!props.showCloseButton) lines.push(`  showCloseButton: false,`)
    lines.push(`})`)
    return lines.join("\n")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast({ title: "Code copie !", description: "Le code a ete copie dans le presse-papier" })
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier le code", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border border-thai-orange/20 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg text-thai-green flex items-center gap-2">
            Controles Interactifs - ToasterVideo
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
            >
              Copier le Code
            </Button>
            <Button
              size="lg"
              onClick={handleShowToast}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Afficher Toast Video
            </Button>
          </div>
        </div>

        {/* Section Contenu */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Contenu</label>
          <div className="space-y-2">
            <input
              type="text"
              value={props.title}
              onChange={(e) => setProps({ ...props, title: e.target.value })}
              placeholder="Titre du toast"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
            <textarea
              value={props.description}
              onChange={(e) => setProps({ ...props, description: e.target.value })}
              placeholder="Description du toast"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent resize-none"
              rows={2}
            />
            <input
              type="text"
              value={props.media}
              onChange={(e) => {
                let path = e.target.value
                path = path.replace(/^public[\/\\]/, '/')
                if (path && !path.startsWith('/')) {
                  path = '/' + path
                }
                setProps({ ...props, media: path })
              }}
              placeholder="/media/animations/toasts/ajoutpaniernote.mp4"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setProps({ ...props, media: "/media/avatars/default.svg" })}
                className="flex-1 border-thai-green/30 text-thai-green hover:bg-thai-green/10"
              >
                Image SVG
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setProps({ ...props, media: "/media/animations/toasts/ajoutpaniernote.mp4" })}
                className="flex-1 border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10"
              >
                Video MP4
              </Button>
            </div>
          </div>
        </div>

        {/* Section Position */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Position du toast</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { label: "Bas droite", value: "bottom-right" as const },
              { label: "Bas gauche", value: "bottom-left" as const },
              { label: "Haut droite", value: "top-right" as const },
              { label: "Haut gauche", value: "top-left" as const },
              { label: "Centre", value: "center" as const },
              { label: "Custom", value: "custom" as const },
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
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position X (left)</label>
                <input
                  type="text"
                  value={props.customX}
                  onChange={(e) => setProps({ ...props, customX: e.target.value })}
                  placeholder="ex: 50%, 100px, 10vw"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position Y (top)</label>
                <input
                  type="text"
                  value={props.customY}
                  onChange={(e) => setProps({ ...props, customY: e.target.value })}
                  placeholder="ex: 50%, 100px, 10vh"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Format */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Format d'image</label>
          <div className="flex gap-2">
            {(["16:9", "4:5", "1:1"] as const).map((ratio) => (
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
            <Button
              size="sm"
              variant={!props.aspectRatio ? "default" : "outline"}
              onClick={() => setProps({ ...props, aspectRatio: undefined })}
              className={!props.aspectRatio
                ? "bg-thai-orange hover:bg-thai-orange/90"
                : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
            >
              Auto
            </Button>
          </div>
        </div>

        {/* Section Couleur Bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur bordure</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { label: "Orange", value: "thai-orange" as const },
              { label: "Vert", value: "thai-green" as const },
              { label: "Rouge", value: "red" as const },
              { label: "Bleu", value: "blue" as const },
              { label: "Jaune", value: "yellow" as const },
              { label: "Violet", value: "purple" as const },
              { label: "Custom", value: "custom" as const },
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
              placeholder="ex: border-purple-500"
              className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
          )}
        </div>

        {/* Section Epaisseur Bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Epaisseur bordure</label>
          <div className="flex gap-2">
            {([1, 2, 4, "custom"] as const).map((w) => (
              <Button
                key={String(w)}
                size="sm"
                variant={props.borderWidth === w ? "default" : "outline"}
                onClick={() => setProps({ ...props, borderWidth: w })}
                className={props.borderWidth === w
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {w === "custom" ? "Custom" : `${w}px`}
              </Button>
            ))}
          </div>
          {props.borderWidth === "custom" && (
            <input
              type="number"
              value={props.customBorderWidth}
              onChange={(e) => setProps({ ...props, customBorderWidth: Number(e.target.value) })}
              min={1}
              max={20}
              className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange focus:border-transparent"
            />
          )}
        </div>

        {/* Section Ombre */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Ombre</label>
          <div className="flex gap-2 flex-wrap">
            {(["none", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={props.shadowSize === s ? "default" : "outline"}
                onClick={() => setProps({ ...props, shadowSize: s })}
                className={props.shadowSize === s
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Largeur Max */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Largeur max</label>
          <div className="flex gap-2">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((w) => (
              <Button
                key={w}
                size="sm"
                variant={props.maxWidth === w ? "default" : "outline"}
                onClick={() => setProps({ ...props, maxWidth: w })}
                className={props.maxWidth === w
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Couleurs Texte */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur du titre</label>
          <div className="flex gap-2 flex-wrap">
            {(["thai-green", "thai-orange", "white", "black", "thai-gold", "inherit"] as const).map((c) => (
              <Button
                key={c}
                size="sm"
                variant={props.titleColor === c ? "default" : "outline"}
                onClick={() => setProps({ ...props, titleColor: c })}
                className={props.titleColor === c
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur de la description</label>
          <div className="flex gap-2 flex-wrap">
            {(["thai-green", "thai-orange", "gray", "black", "inherit"] as const).map((c) => (
              <Button
                key={c}
                size="sm"
                variant={props.descriptionColor === c ? "default" : "outline"}
                onClick={() => setProps({ ...props, descriptionColor: c })}
                className={props.descriptionColor === c
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Style & Animation */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Style & Animation</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={props.polaroid}
                onChange={(e) => setProps({ ...props, polaroid: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Style Polaroid</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={props.scrollingText}
                onChange={(e) => setProps({ ...props, scrollingText: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Texte defilant (marquee)</span>
            </label>
            {props.scrollingText && (
              <div className="flex items-center gap-2 ml-6">
                <label className="text-xs text-gray-600">Duree:</label>
                <input
                  type="number"
                  value={props.scrollDuration}
                  onChange={(e) => setProps({ ...props, scrollDuration: Number(e.target.value) })}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-orange"
                  min="1"
                  max="60"
                />
                <span className="text-xs text-gray-600">secondes</span>
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={props.loopVideo}
                onChange={(e) => setProps({ ...props, loopVideo: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Boucle video (loop)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={props.showCloseButton}
                onChange={(e) => setProps({ ...props, showCloseButton: e.target.checked })}
                className="w-4 h-4 text-thai-orange border-gray-300 rounded focus:ring-thai-orange focus:ring-2"
              />
              <span className="text-sm text-gray-700">Afficher bouton fermeture (X)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export default function ToastsPlaygroundPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">Playground Toasts</h1>
        <p className="text-gray-600">
          Testez et configurez les composants Toast avec controles interactifs complets
        </p>
        <div className="mt-4 flex gap-2">
          <Badge variant="outline" className="border-thai-orange text-thai-orange">
            Toaster
          </Badge>
          <Badge variant="outline" className="border-thai-green text-thai-green">
            ToasterVideo
          </Badge>
          <Badge className="bg-thai-green">
            Playground Interactif
          </Badge>
        </div>
      </div>

      {/* Section 1: Toaster Simple */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">1. Toast Simple (Toaster)</CardTitle>
            <CardDescription className="mt-1.5">
              Notifications textuelles avec style configurable
              <br />
              <code className="text-xs text-gray-500">components/ui/toaster.tsx + hooks/use-toast.ts</code>
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                Props
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Proprietes de toast()</DialogTitle>
                <DialogDescription>Documentation complete des proprietes disponibles</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <h4 className="font-semibold text-thai-orange">Contenu</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li><strong>title</strong> (string): Titre du toast</li>
                    <li><strong>description</strong> (string | ReactNode): Contenu</li>
                    <li><strong>action</strong> (ToastAction): Bouton d'action optionnel</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-thai-orange">Style</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li><strong>variant</strong>: "default" | "destructive" | "polaroid" | "success" | "warning" | "info"</li>
                    <li><strong>borderColor</strong>: "thai-orange" | "thai-green" | "red" | "blue" | "yellow" | "purple" | "custom"</li>
                    <li><strong>customBorderColor</strong> (string): Classe Tailwind custom</li>
                    <li><strong>borderWidth</strong>: 1 | 2 | 4 | "custom"</li>
                    <li><strong>customBorderWidth</strong> (number): Epaisseur en px</li>
                    <li><strong>shadowSize</strong>: "none" | "sm" | "md" | "lg" | "xl" | "2xl"</li>
                    <li><strong>maxWidth</strong>: "xs" | "sm" | "md" | "lg" | "xl"</li>
                    <li><strong>titleColor</strong>: "thai-green" | "thai-orange" | "white" | "black" | "thai-gold" | "inherit"</li>
                    <li><strong>descriptionColor</strong>: "thai-green" | "thai-orange" | "gray" | "black" | "inherit"</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-thai-orange">Animation</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li><strong>tilted</strong> (boolean | number): Inclinaison</li>
                    <li><strong>animateBorder</strong> (boolean): Animation moving-border</li>
                    <li><strong>hoverScale</strong> (boolean): Effet scale au hover</li>
                    <li><strong>duration</strong> (number): Duree en ms (defaut: 5000)</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-thai-orange hover:bg-thai-orange/90">Compris !</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <ToasterPlayground />
        </CardContent>
      </Card>

      {/* Section 2: ToasterVideo */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">2. Toast Video (ToasterVideo)</CardTitle>
            <CardDescription className="mt-1.5">
              Notifications avec media (image/video) et style avance
              <br />
              <code className="text-xs text-gray-500">components/ui/toastervideo.tsx + hooks/use-toast-video.ts</code>
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                Props
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Proprietes de toastVideo()</DialogTitle>
                <DialogDescription>Documentation complete des proprietes disponibles</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <h4 className="font-semibold text-thai-orange">Contenu</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li><strong>title</strong> (string): Titre du toast</li>
                    <li><strong>description</strong> (string | ReactNode): Contenu</li>
                    <li><strong>media</strong> (string): URL de l'image ou video (.mp4, .webm, .gif, .jpg, .png, .svg)</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-thai-orange">Position & Format</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li><strong>position</strong>: "bottom-right" | "center" | "bottom-left"</li>
                    <li><strong>aspectRatio</strong>: "16:9" | "4:5" | "1:1"</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-thai-orange">Style</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li><strong>polaroid</strong> (boolean): Style Polaroid</li>
                    <li><strong>borderColor</strong>: "thai-orange" | "thai-green" | "red" | "blue" | "yellow" | "purple" | "custom"</li>
                    <li><strong>borderWidth</strong>: 1 | 2 | 4 | "custom"</li>
                    <li><strong>shadowSize</strong>: "none" | "sm" | "md" | "lg" | "xl" | "2xl"</li>
                    <li><strong>maxWidth</strong>: "xs" | "sm" | "md" | "lg" | "xl"</li>
                    <li><strong>titleColor / descriptionColor</strong>: Couleurs du texte</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-thai-orange">Animation & Comportement</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li><strong>scrollingText</strong> (boolean): Texte defilant</li>
                    <li><strong>scrollDuration</strong> (number): Duree du defilement en secondes</li>
                    <li><strong>animateBorder</strong> (boolean): Animation moving-border</li>
                    <li><strong>hoverScale</strong> (boolean): Effet scale au hover</li>
                    <li><strong>loopVideo</strong> (boolean): Boucle video</li>
                    <li><strong>showCloseButton</strong> (boolean): Afficher bouton X</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-thai-orange hover:bg-thai-orange/90">Compris !</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <ToasterVideoPlayground />
        </CardContent>
      </Card>
    </div>
  )
}
