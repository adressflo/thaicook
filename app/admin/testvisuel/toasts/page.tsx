"use client"

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
import { Separator } from "@/components/ui/separator"
import type {
  BorderColor,
  DescriptionColor,
  FontWeight,
  MaxWidth,
  RedirectBehavior,
  ShadowSize,
  TitleColor,
  ToastPosition,
} from "@/components/ui/toast"
import { DEFAULT_TOAST_OPTIONS, toast } from "@/hooks/use-toast"
import { toastVideo } from "@/hooks/use-toast-video"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"

// ============================================================================
// SECTION 1: PLAYGROUND TOASTER (Simple)
// ============================================================================

interface ToasterPlaygroundProps {
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
  rotation: boolean
  position: ToastPosition
  customX: string
  customY: string
  redirectUrl: string
  redirectBehavior: RedirectBehavior
  // Animation typing
  typingAnimation: boolean
  typingSpeed: number
  // Animation fermeture
  mangaExplosion: boolean
  animateOut: boolean
  // Marquee
  scrollingText: boolean
  scrollDuration: number
}

function ToasterPlayground() {
  const [props, setProps] = useState<ToasterPlaygroundProps>({
    title: "Notification",
    description: "Ceci est un message de notification",
    variant: "default",
    tilted: false,
    tiltedAngle: -3,
    duration: DEFAULT_TOAST_OPTIONS.duration ?? 5000,
    borderColor: DEFAULT_TOAST_OPTIONS.borderColor ?? "thai-orange",
    customBorderColor: "border-purple-500",
    borderWidth: 2,
    customBorderWidth: 3,
    shadowSize: "lg",
    maxWidth: "lg",
    titleColor: "thai-green",
    titleFontWeight: "bold",
    descriptionColor: "thai-green",
    descriptionFontWeight: "semibold",
    animateBorder: DEFAULT_TOAST_OPTIONS.animateBorder ?? false,
    hoverScale: DEFAULT_TOAST_OPTIONS.hoverScale ?? false,
    rotation: DEFAULT_TOAST_OPTIONS.rotation ?? false,
    position: "bottom-right",
    customX: "50%",
    customY: "50%",
    redirectUrl: "",
    redirectBehavior: "auto",
    // Animation typing
    typingAnimation: DEFAULT_TOAST_OPTIONS.typingAnimation ?? false,
    typingSpeed: DEFAULT_TOAST_OPTIONS.typingSpeed ?? 100,
    // Animation fermeture
    mangaExplosion: DEFAULT_TOAST_OPTIONS.mangaExplosion ?? false,
    animateOut: false,
    // Marquee
    scrollingText: false,
    scrollDuration: 10,
  })

  // Envoyer les props au BroadcastChannel à chaque changement pour mise à jour temps réel
  useEffect(() => {
    const channel = new BroadcastChannel("preview_channel")
    channel.postMessage({
      type: "UPDATE_PROPS",
      payload: {
        component: "Toaster",
        ...props,
      },
    })
    channel.close()
  }, [props])

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
      rotation: props.rotation,
      position: props.position,
      customX: props.position === "custom" ? props.customX : undefined,
      customY: props.position === "custom" ? props.customY : undefined,
      redirectUrl: props.redirectUrl,
      redirectBehavior: props.redirectBehavior,
      typingAnimation: props.typingAnimation,
      typingSpeed: props.typingAnimation ? props.typingSpeed : undefined,
      mangaExplosion: props.mangaExplosion,
      animateOut: props.animateOut,
      scrollingText: props.scrollingText,
      scrollDuration: props.scrollDuration,
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
      lines.push(
        `  borderWidth: ${props.borderWidth === "custom" ? `"custom"` : props.borderWidth},`
      )
      if (props.borderWidth === "custom") {
        lines.push(`  customBorderWidth: ${props.customBorderWidth},`)
      }
    }
    if (props.shadowSize !== "lg") lines.push(`  shadowSize: "${props.shadowSize}",`)
    if (props.maxWidth !== "lg") lines.push(`  maxWidth: "${props.maxWidth}",`)
    if (props.titleColor !== "thai-green") lines.push(`  titleColor: "${props.titleColor}",`)
    if (props.titleFontWeight !== "bold")
      lines.push(`  titleFontWeight: "${props.titleFontWeight}",`)
    if (props.descriptionColor !== "thai-green")
      lines.push(`  descriptionColor: "${props.descriptionColor}",`)
    if (props.descriptionFontWeight !== "semibold")
      lines.push(`  descriptionFontWeight: "${props.descriptionFontWeight}",`)
    if (props.animateBorder) lines.push(`  animateBorder: true,`)
    if (props.hoverScale) lines.push(`  hoverScale: true,`)
    if (props.rotation) lines.push(`  rotation: true,`)
    // Animation typing
    if (props.typingAnimation) {
      lines.push(`  typingAnimation: true,`)
      if (props.typingSpeed !== 100) lines.push(`  typingSpeed: ${props.typingSpeed},`)
    }
    if (props.mangaExplosion) lines.push(`  mangaExplosion: true,`)
    if (props.animateOut) lines.push(`  animateOut: true,`)
    if (props.scrollingText) {
      lines.push(`  scrollingText: true,`)
      if (props.scrollDuration !== 10) lines.push(`  scrollDuration: ${props.scrollDuration},`)
    }
    if (props.redirectUrl) {
      lines.push(`  redirectUrl: "${props.redirectUrl}",`)
      lines.push(`  redirectBehavior: "${props.redirectBehavior}",`)
    }
    lines.push(`})`)
    return lines.join("\n")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast({ title: "Code copie !", description: "Le code a ete copie dans le presse-papier" })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-thai-orange/20 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
            Controles Interactifs - Toaster
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const params = new URLSearchParams()
                params.set("component", "Toaster")
                params.set("title", props.title)
                params.set("description", props.description)
                params.set("variant", props.variant)
                params.set("tilted", props.tilted.toString())
                params.set("tiltedAngle", props.tiltedAngle.toString())
                params.set("duration", props.duration.toString())
                params.set("borderColor", props.borderColor)
                params.set("customBorderColor", props.customBorderColor)
                params.set("borderWidth", props.borderWidth.toString())
                params.set("customBorderWidth", props.customBorderWidth.toString())
                params.set("shadowSize", props.shadowSize)
                params.set("maxWidth", props.maxWidth)
                params.set("titleColor", props.titleColor)
                params.set("titleFontWeight", props.titleFontWeight)
                params.set("descriptionColor", props.descriptionColor)
                params.set("descriptionFontWeight", props.descriptionFontWeight)
                params.set("animateBorder", props.animateBorder.toString())
                params.set("hoverScale", props.hoverScale.toString())
                params.set("position", props.position)
                params.set("customX", props.customX)
                params.set("customY", props.customY)
                params.set("redirectUrl", props.redirectUrl)
                params.set("redirectBehavior", props.redirectBehavior)
                params.set("redirectBehavior", props.redirectBehavior)
                params.set("typingAnimation", props.typingAnimation.toString())
                params.set("typingSpeed", props.typingSpeed.toString())
                params.set("mangaExplosion", props.mangaExplosion.toString())
                params.set("animateOut", props.animateOut.toString())
                params.set("rotation", props.rotation.toString())
                params.set("scrollingText", props.scrollingText.toString())
                params.set("scrollDuration", props.scrollDuration.toString())

                const channel = new BroadcastChannel("preview_channel")
                channel.postMessage({
                  type: "UPDATE_PROPS",
                  payload: {
                    component: "Toaster",
                    ...props,
                  },
                })

                window.open(`/preview?${params.toString()}`, "_blank", "width=500,height=600")
              }}
              className="border-blue-500 text-blue-500 transition-all duration-200 hover:bg-blue-500 hover:text-white"
            >
              Visualisation
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green transition-all duration-200 hover:text-white"
            >
              Copier le Code
            </Button>
            <Button
              size="lg"
              onClick={handleShowToast}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
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
              className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            />
            <textarea
              value={props.description}
              onChange={(e) => setProps({ ...props, description: e.target.value })}
              placeholder="Description du toast"
              className="focus:ring-thai-orange w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              rows={2}
            />
            <p className="text-xs text-gray-500 italic">
              Balises disponibles : &lt;orange&gt;, &lt;green&gt;, &lt;white&gt;, &lt;gold&gt;,
              &lt;black&gt;, &lt;bold&gt;, &lt;semi-bold&gt;, &lt;italic&gt;, &lt;underline&gt;,
              &lt;small&gt;
            </p>
          </div>
          {/* Durée du toast */}
          <div className="mt-2 flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700">Durée (ms)</label>
            <input
              type="number"
              value={props.duration}
              onChange={(e) => setProps({ ...props, duration: Number(e.target.value) })}
              className="focus:ring-thai-orange w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              min={1000}
              step={500}
            />
          </div>
        </div>

        {/* Section Variant */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Variant</label>
          <div className="flex flex-wrap gap-2">
            {(["default", "destructive", "polaroid", "success", "warning", "info"] as const).map(
              (v) => (
                <Button
                  key={v}
                  size="sm"
                  variant={props.variant === v ? "default" : "outline"}
                  onClick={() => setProps({ ...props, variant: v })}
                  className={
                    props.variant === v
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {v}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Section Position */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Position du toast</label>
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
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position X (left)</label>
                <input
                  type="text"
                  value={props.customX}
                  onChange={(e) => setProps({ ...props, customX: e.target.value })}
                  placeholder="ex: 50%, 100px, 10vw"
                  className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position Y (top)</label>
                <input
                  type="text"
                  value={props.customY}
                  onChange={(e) => setProps({ ...props, customY: e.target.value })}
                  placeholder="ex: 50%, 100px, 10vh"
                  className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Couleur Bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur bordure</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Orange", value: "thai-orange" as const },
              { label: "Vert", value: "thai-green" as const },
              { label: "Rouge", value: "red" as const },
              { label: "Bleu", value: "blue" as const },
              { label: "Jaune", value: "yellow" as const },
              { label: "Violet", value: "purple" as const },
              { label: "Custom", value: "custom" as const },
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
              placeholder="ex: border-purple-500"
              className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
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
                className={
                  props.borderWidth === w
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
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
              className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            />
          )}
        </div>

        {/* Section Ombre */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Ombre</label>
          <div className="flex flex-wrap gap-2">
            {(["none", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={props.shadowSize === s ? "default" : "outline"}
                onClick={() => setProps({ ...props, shadowSize: s })}
                className={
                  props.shadowSize === s
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
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
                className={
                  props.maxWidth === w
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Couleurs Texte */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur du titre</label>
          <div className="flex flex-wrap gap-2">
            {(["thai-green", "thai-orange", "white", "black", "thai-gold", "inherit"] as const).map(
              (c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={props.titleColor === c ? "default" : "outline"}
                  onClick={() => setProps({ ...props, titleColor: c })}
                  className={
                    props.titleColor === c
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {c}
                </Button>
              )
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Poids du titre</label>
          <div className="flex flex-wrap gap-2">
            {(["normal", "medium", "semibold", "bold", "extrabold"] as const).map((w) => (
              <Button
                key={w}
                size="sm"
                variant={props.titleFontWeight === w ? "default" : "outline"}
                onClick={() => setProps({ ...props, titleFontWeight: w })}
                className={
                  props.titleFontWeight === w
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur de la description</label>
          <div className="flex flex-wrap gap-2">
            {(["thai-green", "thai-orange", "gray", "black", "inherit"] as const).map((c) => (
              <Button
                key={c}
                size="sm"
                variant={props.descriptionColor === c ? "default" : "outline"}
                onClick={() => setProps({ ...props, descriptionColor: c })}
                className={
                  props.descriptionColor === c
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Poids de la description</label>
          <div className="flex flex-wrap gap-2">
            {(["normal", "medium", "semibold", "bold", "extrabold"] as const).map((w) => (
              <Button
                key={w}
                size="sm"
                variant={props.descriptionFontWeight === w ? "default" : "outline"}
                onClick={() => setProps({ ...props, descriptionFontWeight: w })}
                className={
                  props.descriptionFontWeight === w
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Animation */}
        {/* Section Animation */}
        <div className="space-y-4">
          <label className="text-xs font-medium text-gray-700">Animations & Effets</label>

          {/* Style & Animation texte */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">Style & Animation texte</h5>
            <div className="space-y-2">
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
                  />
                  <span className="text-xs text-gray-500">s</span>
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.typingAnimation}
                  onChange={(e) => setProps({ ...props, typingAnimation: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Animation dactylographie (typing)</span>
              </label>
              {props.typingAnimation && (
                <div className="ml-6 flex items-center gap-2">
                  <label className="text-xs text-gray-600">Vitesse:</label>
                  <input
                    type="number"
                    value={props.typingSpeed}
                    onChange={(e) => setProps({ ...props, typingSpeed: Number(e.target.value) })}
                    className="focus:ring-thai-orange w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                    min="30"
                    max="500"
                    step="10"
                  />
                  <span className="text-xs text-gray-600">ms/caractère</span>
                </div>
              )}
            </div>
          </div>

          {/* Style & Animation bordure animate */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">
              Style & Animation bordure animate
            </h5>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.tilted}
                  onChange={(e) => setProps({ ...props, tilted: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Inclinaison (tilted)</span>
              </label>
              {props.tilted && (
                <div className="ml-6 flex items-center gap-2">
                  <label className="text-xs text-gray-600">Angle:</label>
                  <input
                    type="number"
                    value={props.tiltedAngle}
                    onChange={(e) => setProps({ ...props, tiltedAngle: Number(e.target.value) })}
                    className="focus:ring-thai-orange w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                    min="-15"
                    max="15"
                  />
                  <span className="text-xs text-gray-600">deg</span>
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
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.rotation}
                  onChange={(e) => setProps({ ...props, rotation: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Animation rotation (rotate-[-2deg] hover:rotate-0)
                </span>
              </label>
            </div>
          </div>

          {/* Style & Animation fermeture */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">Style & Animation fermeture</h5>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.mangaExplosion}
                  onChange={(e) => setProps({ ...props, mangaExplosion: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Manga Explosion (Orange Thai)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.animateOut}
                  onChange={(e) => setProps({ ...props, animateOut: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Animation de sortie (Fade + Zoom Out)</span>
              </label>
            </div>
          </div>
          <label className="text-xs font-medium text-gray-700">Redirection (optionnel)</label>
          <input
            type="text"
            value={props.redirectUrl}
            onChange={(e) => setProps({ ...props, redirectUrl: e.target.value })}
            placeholder="/commander"
            className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          />
          {props.redirectUrl && (
            <div className="mt-2 flex gap-2">
              {[
                { label: "Auto", value: "auto" as const, desc: "Redirige a la fermeture" },
                {
                  label: "Nouvel onglet",
                  value: "new-tab" as const,
                  desc: "Ouvre dans un nouvel onglet",
                },
                { label: "Bouton", value: "button" as const, desc: "Affiche un bouton 'Voir'" },
              ].map((behavior) => (
                <Button
                  key={behavior.value}
                  size="sm"
                  variant={props.redirectBehavior === behavior.value ? "default" : "outline"}
                  onClick={() => setProps({ ...props, redirectBehavior: behavior.value })}
                  className={cn(
                    props.redirectBehavior === behavior.value
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  )}
                  title={behavior.desc}
                >
                  {behavior.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 2: PLAYGROUND TOASTER VIDEO
// ============================================================================

interface ToasterVideoPlaygroundProps {
  title: string
  description: string
  media: string
  position: ToastPosition
  customX: string
  customY: string
  aspectRatio: "16:9" | "4:5" | "1:1" | "auto" | undefined
  polaroid: boolean
  // Polaroid padding props
  polaroidPaddingSides: number
  polaroidPaddingTop: number
  polaroidPaddingBottom: number
  scrollingText: boolean
  scrollDuration: number
  scrollSyncWithVideo: boolean
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
  rotation: boolean
  animateOut: boolean
  // Animation typing
  typingAnimation: boolean
  typingSpeed: number
  // Lecture video (remplace loopVideo)
  playCount: 1 | 2 | "custom"
  customPlayCount: number
  customDuration: number
  // Redirection
  redirectUrl: string
  redirectBehavior: RedirectBehavior
  showCloseButton: boolean
  // Animation fermeture
  mangaExplosion: boolean
}

function ToasterVideoPlayground() {
  const [props, setProps] = useState<ToasterVideoPlaygroundProps>({
    title: "Plat ajoute !",
    description: "Pad Thai ajoute au panier",
    media: "/media/animations/toasts/ajoutpaniernote.mp4",
    position: "bottom-right",
    customX: "50%",
    customY: "50%",
    aspectRatio: "16:9",
    polaroid: false,
    // Polaroid padding defaults
    polaroidPaddingSides: 3,
    polaroidPaddingTop: 3,
    polaroidPaddingBottom: 8,
    scrollingText: false,
    scrollDuration: 10,
    scrollSyncWithVideo: false,
    borderColor: "thai-orange",
    customBorderColor: "border-purple-500",
    borderWidth: 2,
    customBorderWidth: 3,
    shadowSize: "2xl",
    maxWidth: "md",
    titleColor: "thai-green",
    titleFontWeight: "bold",
    descriptionColor: "thai-green",
    descriptionFontWeight: "semibold",
    animateBorder: false,
    hoverScale: false,
    rotation: false,
    animateOut: true,
    // Animation typing
    typingAnimation: false,
    typingSpeed: 100,
    // Lecture video
    playCount: 1,
    customPlayCount: 3,
    customDuration: 0,
    // Redirection
    redirectUrl: "",
    redirectBehavior: "auto",
    showCloseButton: true,
    // Animation fermeture
    mangaExplosion: false,
  })

  // Envoyer les props au BroadcastChannel à chaque changement pour mise à jour temps réel
  useEffect(() => {
    const channel = new BroadcastChannel("preview_channel")
    channel.postMessage({
      type: "UPDATE_PROPS",
      payload: {
        component: "ToasterVideo",
        ...props,
        mangaExplosion: props.mangaExplosion,
      },
    })
    channel.close()
  }, [props])

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
      // Polaroid padding props (only when polaroid is enabled)
      polaroidPaddingSides: props.polaroid ? props.polaroidPaddingSides : undefined,
      polaroidPaddingTop: props.polaroid ? props.polaroidPaddingTop : undefined,
      polaroidPaddingBottom: props.polaroid ? props.polaroidPaddingBottom : undefined,
      scrollingText: props.scrollingText,
      scrollDuration: props.scrollDuration,
      scrollSyncWithVideo: props.scrollSyncWithVideo,
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
      rotation: props.rotation,
      animateOut: props.animateOut,
      // Animation typing
      typingAnimation: props.typingAnimation,
      typingSpeed: props.typingAnimation ? props.typingSpeed : undefined,
      // Lecture video
      playCount: props.playCount,
      customPlayCount: props.playCount === "custom" ? props.customPlayCount : undefined,
      customDuration: props.customDuration > 0 ? props.customDuration : undefined,
      // Redirection
      redirectUrl: props.redirectUrl || undefined,
      redirectBehavior: props.redirectUrl ? props.redirectBehavior : undefined,
      showCloseButton: props.showCloseButton,
      mangaExplosion: props.mangaExplosion,
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
    if (props.polaroid) {
      lines.push(`  polaroid: true,`)
      // Include padding values if different from defaults
      if (props.polaroidPaddingSides !== 3)
        lines.push(`  polaroidPaddingSides: ${props.polaroidPaddingSides},`)
      if (props.polaroidPaddingTop !== 3)
        lines.push(`  polaroidPaddingTop: ${props.polaroidPaddingTop},`)
      if (props.polaroidPaddingBottom !== 8)
        lines.push(`  polaroidPaddingBottom: ${props.polaroidPaddingBottom},`)
    }
    if (props.scrollingText) {
      lines.push(`  scrollingText: true,`)
      lines.push(`  scrollDuration: ${props.scrollDuration},`)
      if (props.scrollSyncWithVideo) lines.push(`  scrollSyncWithVideo: true,`)
    }
    if (props.borderColor !== "thai-orange") {
      lines.push(`  borderColor: "${props.borderColor}",`)
      if (props.borderColor === "custom") {
        lines.push(`  customBorderColor: "${props.customBorderColor}",`)
      }
    }
    if (props.borderWidth !== 2) {
      lines.push(
        `  borderWidth: ${props.borderWidth === "custom" ? `"custom"` : props.borderWidth},`
      )
      if (props.borderWidth === "custom") {
        lines.push(`  customBorderWidth: ${props.customBorderWidth},`)
      }
    }
    if (props.shadowSize !== "2xl") lines.push(`  shadowSize: "${props.shadowSize}",`)
    if (props.maxWidth !== "md") lines.push(`  maxWidth: "${props.maxWidth}",`)
    if (props.titleColor !== "thai-green") lines.push(`  titleColor: "${props.titleColor}",`)
    if (props.descriptionColor !== "thai-green")
      lines.push(`  descriptionColor: "${props.descriptionColor}",`)
    if (props.animateBorder) lines.push(`  animateBorder: true,`)
    if (props.hoverScale) lines.push(`  hoverScale: true,`)
    if (props.rotation) lines.push(`  rotation: true,`)
    if (props.animateOut) lines.push(`  animateOut: true,`)
    // Animation typing
    if (props.typingAnimation) {
      lines.push(`  typingAnimation: true,`)
      if (props.typingSpeed !== 100) lines.push(`  typingSpeed: ${props.typingSpeed},`)
    }
    // Lecture video
    if (props.playCount !== 1) {
      lines.push(`  playCount: ${props.playCount === "custom" ? `"custom"` : props.playCount},`)
      if (props.playCount === "custom") {
        lines.push(`  customPlayCount: ${props.customPlayCount},`)
      }
    }
    if (props.customDuration > 0) lines.push(`  customDuration: ${props.customDuration},`)
    // Redirection
    if (props.redirectUrl) {
      lines.push(`  redirectUrl: "${props.redirectUrl}",`)
      lines.push(`  redirectBehavior: "${props.redirectBehavior}",`)
    }
    if (!props.showCloseButton) lines.push(`  showCloseButton: false,`)
    if (props.mangaExplosion) lines.push(`  mangaExplosion: true,`)
    lines.push(`})`)
    return lines.join("\n")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast({ title: "Code copie !", description: "Le code a ete copie dans le presse-papier" })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-thai-orange/20 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
            Controles Interactifs - ToasterVideo
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const params = new URLSearchParams()
                params.set("component", "ToasterVideo")
                params.set("title", props.title)
                params.set("description", props.description)
                params.set("media", props.media)
                params.set("position", props.position)
                params.set("customX", props.customX)
                params.set("customY", props.customY)
                params.set("aspectRatio", props.aspectRatio || "")
                params.set("polaroid", props.polaroid.toString())
                params.set("scrollingText", props.scrollingText.toString())
                params.set("scrollDuration", props.scrollDuration.toString())
                params.set("borderColor", props.borderColor)
                params.set("customBorderColor", props.customBorderColor)
                params.set("borderWidth", props.borderWidth.toString())
                params.set("customBorderWidth", props.customBorderWidth.toString())
                params.set("shadowSize", props.shadowSize)
                params.set("maxWidth", props.maxWidth)
                params.set("titleColor", props.titleColor)
                params.set("descriptionColor", props.descriptionColor)
                params.set("animateBorder", props.animateBorder.toString())
                params.set("hoverScale", props.hoverScale.toString())
                params.set("playCount", props.playCount.toString())
                params.set("customPlayCount", props.customPlayCount.toString())
                params.set("customDuration", props.customDuration.toString())
                params.set("redirectUrl", props.redirectUrl)
                params.set("redirectBehavior", props.redirectBehavior)
                params.set("showCloseButton", props.showCloseButton.toString())
                params.set("typingAnimation", props.typingAnimation.toString())
                params.set("typingSpeed", props.typingSpeed.toString())
                params.set("scrollSyncWithVideo", props.scrollSyncWithVideo.toString())
                params.set("polaroidPaddingSides", props.polaroidPaddingSides.toString())
                params.set("polaroidPaddingTop", props.polaroidPaddingTop.toString())
                params.set("polaroidPaddingBottom", props.polaroidPaddingBottom.toString())
                params.set("titleFontWeight", props.titleFontWeight)
                params.set("titleFontWeight", props.titleFontWeight)
                params.set("descriptionFontWeight", props.descriptionFontWeight)
                params.set("mangaExplosion", props.mangaExplosion.toString())
                params.set("animateOut", props.animateOut.toString())
                params.set("rotation", props.rotation.toString())

                const channel = new BroadcastChannel("preview_channel")
                channel.postMessage({
                  type: "UPDATE_PROPS",
                  payload: {
                    component: "ToasterVideo",
                    ...props,
                  },
                })

                window.open(`/preview?${params.toString()}`, "_blank", "width=500,height=600")
              }}
              className="border-blue-500 text-blue-500 transition-all duration-200 hover:bg-blue-500 hover:text-white"
            >
              Visualisation
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="border-thai-green text-thai-green hover:bg-thai-green transition-all duration-200 hover:text-white"
            >
              Copier le Code
            </Button>
            <Button
              size="lg"
              onClick={handleShowToast}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
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
              className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            />
            <textarea
              value={props.description}
              onChange={(e) => setProps({ ...props, description: e.target.value })}
              placeholder="Description du toast"
              className="focus:ring-thai-orange w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              rows={2}
            />
            <input
              type="text"
              value={props.media}
              onChange={(e) => {
                let path = e.target.value
                path = path.replace(/^public[\/\\]/, "/")
                if (path && !path.startsWith("/")) {
                  path = "/" + path
                }
                setProps({ ...props, media: path })
              }}
              placeholder="/media/animations/toasts/ajoutpaniernote.mp4"
              className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setProps({ ...props, media: "/media/avatars/default.svg" })}
                className="border-thai-green/30 text-thai-green hover:bg-thai-green/10 flex-1"
              >
                Image SVG
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setProps({ ...props, media: "/media/animations/toasts/ajoutpaniernote.mp4" })
                }
                className="border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10 flex-1"
              >
                Video MP4
              </Button>
            </div>
            <p className="text-xs text-gray-500 italic">
              Balises disponibles : &lt;orange&gt;, &lt;green&gt;, &lt;white&gt;, &lt;gold&gt;,
              &lt;black&gt;, &lt;bold&gt;, &lt;semi-bold&gt;, &lt;italic&gt;, &lt;underline&gt;,
              &lt;small&gt;
            </p>
          </div>
        </div>

        {/* Section Position */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Position du toast</label>
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
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position X (left)</label>
                <input
                  type="text"
                  value={props.customX}
                  onChange={(e) => setProps({ ...props, customX: e.target.value })}
                  placeholder="ex: 50%, 100px, 10vw"
                  className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Position Y (top)</label>
                <input
                  type="text"
                  value={props.customY}
                  onChange={(e) => setProps({ ...props, customY: e.target.value })}
                  placeholder="ex: 50%, 100px, 10vh"
                  className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
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
                className={
                  props.aspectRatio === ratio
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {ratio}
              </Button>
            ))}
            <Button
              size="sm"
              variant={!props.aspectRatio ? "default" : "outline"}
              onClick={() => setProps({ ...props, aspectRatio: undefined })}
              className={
                !props.aspectRatio
                  ? "bg-thai-orange hover:bg-thai-orange/90"
                  : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
              }
            >
              Auto
            </Button>
          </div>
        </div>

        {/* Section Couleur Bordure */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur bordure</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Orange", value: "thai-orange" as const },
              { label: "Vert", value: "thai-green" as const },
              { label: "Rouge", value: "red" as const },
              { label: "Bleu", value: "blue" as const },
              { label: "Jaune", value: "yellow" as const },
              { label: "Violet", value: "purple" as const },
              { label: "Custom", value: "custom" as const },
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
              placeholder="ex: border-purple-500"
              className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
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
                className={
                  props.borderWidth === w
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
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
              className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            />
          )}
        </div>

        {/* Section Ombre */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Ombre</label>
          <div className="flex flex-wrap gap-2">
            {(["none", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={props.shadowSize === s ? "default" : "outline"}
                onClick={() => setProps({ ...props, shadowSize: s })}
                className={
                  props.shadowSize === s
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
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
                className={
                  props.maxWidth === w
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Couleurs Texte */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur du titre</label>
          <div className="flex flex-wrap gap-2">
            {(["thai-green", "thai-orange", "white", "black", "thai-gold", "inherit"] as const).map(
              (c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={props.titleColor === c ? "default" : "outline"}
                  onClick={() => setProps({ ...props, titleColor: c })}
                  className={
                    props.titleColor === c
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {c}
                </Button>
              )
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Couleur de la description</label>
          <div className="flex flex-wrap gap-2">
            {(["thai-green", "thai-orange", "gray", "black", "inherit"] as const).map((c) => (
              <Button
                key={c}
                size="sm"
                variant={props.descriptionColor === c ? "default" : "outline"}
                onClick={() => setProps({ ...props, descriptionColor: c })}
                className={
                  props.descriptionColor === c
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Animations & Effets */}
        {/* Section Animations & Effets */}
        <div className="space-y-4">
          <label className="text-xs font-medium text-gray-700">Animations & Effets</label>

          {/* Style & Animation texte */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">Style & Animation texte</h5>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.scrollingText}
                  onChange={(e) => setProps({ ...props, scrollingText: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Texte defilant (marquee)</span>
              </label>
              {props.scrollingText && (
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">Duree:</label>
                    <input
                      type="number"
                      value={props.scrollDuration}
                      onChange={(e) =>
                        setProps({ ...props, scrollDuration: Number(e.target.value) })
                      }
                      className="focus:ring-thai-orange w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                      min="1"
                      max="60"
                      disabled={props.scrollSyncWithVideo}
                    />
                    <span className="text-xs text-gray-600">secondes</span>
                  </div>
                  {/* Option synchronisation avec vidéo */}
                  {props.media?.endsWith(".mp4") || props.media?.endsWith(".webm") ? (
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={props.scrollSyncWithVideo}
                        onChange={(e) =>
                          setProps({ ...props, scrollSyncWithVideo: e.target.checked })
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
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.typingAnimation}
                  onChange={(e) => setProps({ ...props, typingAnimation: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Animation dactylographie (typing)</span>
              </label>
              {props.typingAnimation && (
                <div className="ml-6 flex items-center gap-2">
                  <label className="text-xs text-gray-600">Vitesse:</label>
                  <input
                    type="number"
                    value={props.typingSpeed}
                    onChange={(e) => setProps({ ...props, typingSpeed: Number(e.target.value) })}
                    className="focus:ring-thai-orange w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                    min="30"
                    max="500"
                    step="10"
                  />
                  <span className="text-xs text-gray-600">ms/caractère</span>
                </div>
              )}
            </div>
          </div>

          {/* Style & Animation bordure animate */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">
              Style & Animation bordure animate
            </h5>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.polaroid}
                  onChange={(e) => setProps({ ...props, polaroid: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Style Polaroid</span>
              </label>
              {/* Polaroid padding controls - visible only when polaroid is enabled */}
              {props.polaroid && (
                <div className="ml-6 space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-600">Padding Polaroid</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Côtés</label>
                      <input
                        type="number"
                        value={props.polaroidPaddingSides}
                        onChange={(e) =>
                          setProps({ ...props, polaroidPaddingSides: Number(e.target.value) })
                        }
                        className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                        min="0"
                        max="20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Haut</label>
                      <input
                        type="number"
                        value={props.polaroidPaddingTop}
                        onChange={(e) =>
                          setProps({ ...props, polaroidPaddingTop: Number(e.target.value) })
                        }
                        className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                        min="0"
                        max="20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Bas</label>
                      <input
                        type="number"
                        value={props.polaroidPaddingBottom}
                        onChange={(e) =>
                          setProps({ ...props, polaroidPaddingBottom: Number(e.target.value) })
                        }
                        className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                        min="0"
                        max="20"
                      />
                    </div>
                  </div>
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
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.rotation}
                  onChange={(e) => setProps({ ...props, rotation: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Animation rotation (rotate-[-2deg] hover:rotate-0)
                </span>
              </label>
            </div>
          </div>

          {/* Style & Animation fermeture */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
            <h5 className="text-xs font-semibold text-gray-600">Style & Animation fermeture</h5>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.animateOut}
                  onChange={(e) => setProps({ ...props, animateOut: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Animation de sortie (fade-out + zoom-out)
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.mangaExplosion}
                  onChange={(e) => setProps({ ...props, mangaExplosion: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Manga Explosion (Orange Thai)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showCloseButton}
                  onChange={(e) => setProps({ ...props, showCloseButton: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Afficher bouton fermeture (X)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section Lecture Video (playCount) */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            Fermeture video (nombre de lectures)
          </label>
          <div className="flex gap-2">
            {[
              { label: "×1", value: 1 as const },
              { label: "×2", value: 2 as const },
              { label: "Custom", value: "custom" as const },
            ].map((option) => (
              <Button
                key={String(option.value)}
                size="sm"
                variant={props.playCount === option.value ? "default" : "outline"}
                onClick={() => setProps({ ...props, playCount: option.value })}
                className={
                  props.playCount === option.value
                    ? "bg-thai-orange hover:bg-thai-orange/90"
                    : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
          {props.playCount === "custom" && (
            <div className="mt-2 flex items-center gap-2">
              <label className="text-xs text-gray-600">Nombre de lectures:</label>
              <input
                type="number"
                value={props.customPlayCount}
                onChange={(e) => setProps({ ...props, customPlayCount: Number(e.target.value) })}
                className="focus:ring-thai-orange w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                min="1"
                max="10"
              />
            </div>
          )}
        </div>

        {/* Section Duree personnalisee */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            Duree personnalisee (override - images ET videos)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={props.customDuration}
              onChange={(e) => setProps({ ...props, customDuration: Number(e.target.value) })}
              placeholder="0"
              className="focus:ring-thai-orange w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              min="0"
              max="60"
            />
            <span className="text-xs text-gray-600">ms (0 = désactive)</span>
          </div>
        </div>

        {/* Section Redirection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Redirection (optionnel)</label>
          <input
            type="text"
            value={props.redirectUrl}
            onChange={(e) => setProps({ ...props, redirectUrl: e.target.value })}
            placeholder="/commander"
            className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          />
          {props.redirectUrl && (
            <div className="mt-2 flex gap-2">
              {[
                { label: "Auto", value: "auto" as const, desc: "Redirige a la fermeture" },
                {
                  label: "Nouvel onglet",
                  value: "new-tab" as const,
                  desc: "Ouvre dans un nouvel onglet",
                },
                { label: "Bouton", value: "button" as const, desc: "Affiche un bouton 'Voir'" },
              ].map((behavior) => (
                <Button
                  key={behavior.value}
                  size="sm"
                  variant={props.redirectBehavior === behavior.value ? "default" : "outline"}
                  onClick={() => setProps({ ...props, redirectBehavior: behavior.value })}
                  className={cn(
                    props.redirectBehavior === behavior.value
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  )}
                  title={behavior.desc}
                >
                  {behavior.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
          <Badge className="bg-thai-green">Playground Interactif</Badge>
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
              <code className="text-xs text-gray-500">
                components/ui/toaster.tsx + hooks/use-toast.ts
              </code>
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
                <DialogDescription>
                  Documentation complete des proprietes disponibles
                </DialogDescription>
              </DialogHeader>
              <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4">
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Contenu</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>title</strong> (string): Titre du toast
                    </li>
                    <li>
                      <strong>description</strong> (string | ReactNode): Contenu
                    </li>
                    <li>
                      <strong>action</strong> (ToastAction): Bouton d'action optionnel
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Style</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>variant</strong>: "default" | "destructive" | "polaroid" | "success" |
                      "warning" | "info"
                    </li>
                    <li>
                      <strong>borderColor</strong>: "thai-orange" | "thai-green" | "red" | "blue" |
                      "yellow" | "purple" | "custom"
                    </li>
                    <li>
                      <strong>customBorderColor</strong> (string): Classe Tailwind custom
                    </li>
                    <li>
                      <strong>borderWidth</strong>: 1 | 2 | 4 | "custom"
                    </li>
                    <li>
                      <strong>customBorderWidth</strong> (number): Epaisseur en px
                    </li>
                    <li>
                      <strong>shadowSize</strong>: "none" | "sm" | "md" | "lg" | "xl" | "2xl"
                    </li>
                    <li>
                      <strong>maxWidth</strong>: "xs" | "sm" | "md" | "lg" | "xl"
                    </li>
                    <li>
                      <strong>titleColor</strong>: "thai-green" | "thai-orange" | "white" | "black"
                      | "thai-gold" | "inherit"
                    </li>
                    <li>
                      <strong>descriptionColor</strong>: "thai-green" | "thai-orange" | "gray" |
                      "black" | "inherit"
                    </li>
                    <li>
                      <strong>position</strong>: "bottom-right" | "bottom-left" | "top-right" |
                      "top-left" | "center" | "custom"
                    </li>
                    <li>
                      <strong>customX</strong> (string): Position X (si custom)
                    </li>
                    <li>
                      <strong>customY</strong> (string): Position Y (si custom)
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Animation</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>tilted</strong> (boolean | number): Inclinaison
                    </li>
                    <li>
                      <strong>animateBorder</strong> (boolean): Animation moving-border
                    </li>
                    <li>
                      <strong>hoverScale</strong> (boolean): Effet scale au hover
                    </li>
                    <li>
                      <strong>rotation</strong> (boolean): Animation rotation (-rotate-2
                      hover:rotate-0)
                    </li>
                    <li>
                      <strong>mangaExplosion</strong> (boolean): Animation Manga Explosion (Orange
                      Thai)
                    </li>
                    <li>
                      <strong>animateOut</strong> (boolean): Animation de sortie (Fade + Zoom Out)
                    </li>
                    <li>
                      <strong>typingAnimation</strong> (boolean): Animation dactylographie
                    </li>
                    <li>
                      <strong>typingSpeed</strong> (number): Vitesse typing (ms/char)
                    </li>
                    <li>
                      <strong>scrollingText</strong> (boolean): Texte défilant (marquee)
                    </li>
                    <li>
                      <strong>scrollDuration</strong> (number): Durée défilement (s)
                    </li>
                    <li>
                      <strong>duration</strong> (number): Duree en ms (defaut: 5000)
                    </li>
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
              <code className="text-xs text-gray-500">
                components/ui/toastervideo.tsx + hooks/use-toast-video.ts
              </code>
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
                <DialogDescription>
                  Documentation complete des proprietes disponibles
                </DialogDescription>
              </DialogHeader>
              <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4">
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Contenu</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>title</strong> (string): Titre du toast
                    </li>
                    <li>
                      <strong>description</strong> (string | ReactNode): Contenu
                    </li>
                    <li>
                      <strong>media</strong> (string): URL de l'image ou video (.mp4, .webm, .gif,
                      .jpg, .png, .svg)
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Position & Format</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>position</strong>: "bottom-right" | "bottom-left" | "top-right" |
                      "top-left" | "center" | "custom"
                    </li>
                    <li>
                      <strong>customX</strong> (string): Position X (si custom)
                    </li>
                    <li>
                      <strong>customY</strong> (string): Position Y (si custom)
                    </li>
                    <li>
                      <strong>aspectRatio</strong>: "16:9" | "4:5" | "1:1"
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Style</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>polaroid</strong> (boolean): Style Polaroid
                    </li>
                    <li>
                      <strong>borderColor</strong>: "thai-orange" | "thai-green" | "red" | "blue" |
                      "yellow" | "purple" | "custom"
                    </li>
                    <li>
                      <strong>borderWidth</strong>: 1 | 2 | 4 | "custom"
                    </li>
                    <li>
                      <strong>shadowSize</strong>: "none" | "sm" | "md" | "lg" | "xl" | "2xl"
                    </li>
                    <li>
                      <strong>maxWidth</strong>: "xs" | "sm" | "md" | "lg" | "xl"
                    </li>
                    <li>
                      <strong>titleColor / descriptionColor</strong>: Couleurs du texte
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Animation & Comportement</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>scrollingText</strong> (boolean): Texte defilant
                    </li>
                    <li>
                      <strong>scrollDuration</strong> (number): Duree du defilement en secondes
                    </li>
                    <li>
                      <strong>scrollSyncWithVideo</strong> (boolean): Synchroniser marquee avec video
                    </li>
                    <li>
                      <strong>animateBorder</strong> (boolean): Animation moving-border
                    </li>
                    <li>
                      <strong>hoverScale</strong> (boolean): Effet scale au hover
                    </li>
                    <li>
                      <strong>rotation</strong> (boolean): Animation rotation (-rotate-2 hover:rotate-0)
                    </li>
                    <li>
                      <strong>typingAnimation</strong> (boolean): Animation dactylographie
                    </li>
                    <li>
                      <strong>typingSpeed</strong> (number): Vitesse typing (ms/char)
                    </li>
                    <li>
                      <strong>showCloseButton</strong> (boolean): Afficher bouton X
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Animation de fermeture</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>animateOut</strong> (boolean): Animation de sortie (fade-out + zoom-out)
                    </li>
                    <li>
                      <strong>mangaExplosion</strong> (boolean): Animation Manga Explosion (Orange Thai)
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Lecture video</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>playCount</strong>: 1 | 2 | "custom" - Nombre de lectures avant fermeture
                    </li>
                    <li>
                      <strong>customPlayCount</strong> (number): Nombre custom de lectures
                    </li>
                    <li>
                      <strong>customDuration</strong> (number): Duree fixe en secondes (override)
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-thai-orange font-semibold">Redirection</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>
                      <strong>redirectUrl</strong> (string): URL de redirection a la fermeture
                    </li>
                    <li>
                      <strong>redirectBehavior</strong>: "auto" | "new-tab" | "button"
                    </li>
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
