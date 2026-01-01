"use client"

import { MyCalendarIcon } from "@/components/shared/MyCalendarIcon"
import { Spice } from "@/components/shared/Spice"
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
import { toast } from "@/hooks/use-toast"
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  Beaker,
  Bell,
  Bot,
  Calculator,
  // Date & Time
  Calendar,
  Camera,
  // Status & Feedback
  Check,
  CheckCircle,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  // Admin & System
  Command,
  Cookie,
  CookingPot,
  CreditCard,
  Dot,
  Download,
  Edit,
  Edit3,
  Euro,
  ExternalLink,
  Eye,
  EyeOff,
  // Social & External
  Facebook,
  // Files & Content
  FileText,
  Filter,
  Flame,
  GripVertical,
  Hash,
  Heart,
  History,
  // Navigation & Actions
  Home,
  ImageIcon,
  Info,
  Instagram,
  Languages,
  Layout,
  LayoutDashboard,
  LayoutGrid,
  Leaf,
  Link,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  // Communication
  Mail,
  // Location
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Minus,
  MoreHorizontal,
  Navigation,
  Package,
  PackageSearch,
  Palette,
  PartyPopper,
  Phone,
  Plus,
  Receipt,
  Save,
  Search,
  // Settings & Config
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingBasket,
  // E-commerce
  ShoppingCart,
  Smartphone,
  // Misc
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  // Delivery & Stock
  Truck,
  Upload,
  // User & Auth
  User,
  UserMinus,
  UserPlus,
  Users,
  // Food & Restaurant
  Utensils,
  Video,
  // Connectivity
  Wifi,
  WifiOff,
  X,
  XCircle,
  Zap,
} from "lucide-react"
import { useState } from "react"

// ============================================================================
// MY CALENDAR ICON PLAYGROUND
// ============================================================================

function MyCalendarIconPlayground() {
  const [props, setProps] = useState<{
    date: Date
    size: "sm" | "md" | "lg" | "xl" | "custom"
    customSize: number
    borderColor: "thai-orange" | "thai-green" | "blue" | "red" | "custom"
    customBorderColor: string
    borderHoverColor: "thai-gold" | "thai-green" | "blue" | "red" | "custom"
    customBorderHoverColor: string
    borderWidth: 1 | 2 | 4 | "custom"
    customBorderWidth: number
    hoverAnimation: boolean
    showTime: boolean
    headerColor: "gradient" | "solid-orange" | "solid-green" | "custom"
    customHeaderColor: string
    headerHoverColor: "gradient-gold" | "solid-gold" | "solid-emerald" | "custom"
    customHeaderHoverColor: string
    timeBadgeColor: "thai-orange" | "thai-green" | "thai-gold" | "blue" | "red" | "custom"
    customTimeBadgeColor: string
    timeBadgeHoverColor: "thai-gold" | "thai-green" | "thai-orange" | "blue" | "custom"
    customTimeBadgeHoverColor: string
  }>({
    date: new Date(2025, 0, 24, 18, 10),
    size: "md",
    customSize: 100,
    borderColor: "thai-orange",
    customBorderColor: "border-purple-500",
    borderHoverColor: "thai-gold",
    customBorderHoverColor: "border-pink-500",
    borderWidth: 2,
    customBorderWidth: 3,
    hoverAnimation: true,
    showTime: true,
    headerColor: "gradient",
    customHeaderColor: "bg-purple-500",
    headerHoverColor: "gradient-gold",
    customHeaderHoverColor: "bg-pink-500",
    timeBadgeColor: "thai-orange",
    customTimeBadgeColor: "bg-purple-500",
    timeBadgeHoverColor: "thai-gold",
    customTimeBadgeHoverColor: "bg-pink-500",
  })

  const generateCode = () => {
    const lines = [`<MyCalendarIcon`]
    lines.push(
      `  date={new Date(${props.date.getFullYear()}, ${props.date.getMonth()}, ${props.date.getDate()}, ${props.date.getHours()}, ${props.date.getMinutes()})}`
    )
    if (props.size !== "md") {
      lines.push(`  size="${props.size}"`)
      if (props.size === "custom") lines.push(`  customSize={${props.customSize}}`)
    }
    if (props.borderColor !== "thai-orange") {
      lines.push(`  borderColor="${props.borderColor}"`)
      if (props.borderColor === "custom")
        lines.push(`  customBorderColor="${props.customBorderColor}"`)
    }
    if (props.borderHoverColor !== "thai-gold") {
      lines.push(`  borderHoverColor="${props.borderHoverColor}"`)
      if (props.borderHoverColor === "custom")
        lines.push(`  customBorderHoverColor="${props.customBorderHoverColor}"`)
    }
    if (props.borderWidth !== 2) {
      lines.push(
        `  borderWidth={${props.borderWidth === "custom" ? `"custom"` : props.borderWidth}}`
      )
      if (props.borderWidth === "custom")
        lines.push(`  customBorderWidth={${props.customBorderWidth}}`)
    }
    if (!props.hoverAnimation) lines.push(`  hoverAnimation={false}`)
    if (!props.showTime) lines.push(`  showTime={false}`)
    if (props.headerColor !== "gradient") {
      lines.push(`  headerColor="${props.headerColor}"`)
      if (props.headerColor === "custom")
        lines.push(`  customHeaderColor="${props.customHeaderColor}"`)
    }
    if (props.headerHoverColor !== "gradient-gold") {
      lines.push(`  headerHoverColor="${props.headerHoverColor}"`)
      if (props.headerHoverColor === "custom")
        lines.push(`  customHeaderHoverColor="${props.customHeaderHoverColor}"`)
    }
    if (props.timeBadgeColor !== "thai-orange") {
      lines.push(`  timeBadgeColor="${props.timeBadgeColor}"`)
      if (props.timeBadgeColor === "custom")
        lines.push(`  customTimeBadgeColor="${props.customTimeBadgeColor}"`)
    }
    if (props.timeBadgeHoverColor !== "thai-gold") {
      lines.push(`  timeBadgeHoverColor="${props.timeBadgeHoverColor}"`)
      if (props.timeBadgeHoverColor === "custom")
        lines.push(`  customTimeBadgeHoverColor="${props.customTimeBadgeHoverColor}"`)
    }
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
    <Card className="border-thai-orange/20 ring-thai-orange/30 ring-2">
      <CardHeader className="bg-thai-cream/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-thai-green flex items-center gap-2 text-2xl">
              📅 MyCalendarIcon
              <Badge className="bg-thai-gold text-thai-green">Custom</Badge>
            </CardTitle>
            <CardDescription>
              Composant: <code className="text-xs">components/shared/MyCalendarIcon.tsx</code>
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
              >
                <Info className="mr-2 h-4 w-4" />
                Props
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-thai-green">📅 Props MyCalendarIcon</DialogTitle>
                <DialogDescription>Documentation complète des propriétés</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-xs">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-thai-cream/50">
                      <th className="border p-1.5 text-left">Prop</th>
                      <th className="border p-1.5 text-left">Type</th>
                      <th className="border p-1.5 text-left">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-1.5 font-mono">date</td>
                      <td className="border p-1.5">Date</td>
                      <td className="border p-1.5">-</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">size / customSize</td>
                      <td className="border p-1.5">"sm"|"md"|"lg"|"xl"|"custom" + number</td>
                      <td className="border p-1.5">"md"</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">borderColor / customBorderColor</td>
                      <td className="border p-1.5">"thai-orange"|... + string</td>
                      <td className="border p-1.5">"thai-orange"</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">
                        borderHoverColor / customBorderHoverColor
                      </td>
                      <td className="border p-1.5">"thai-gold"|... + string</td>
                      <td className="border p-1.5">"thai-gold"</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">borderWidth / customBorderWidth</td>
                      <td className="border p-1.5">1|2|4|"custom" + number</td>
                      <td className="border p-1.5">2</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">headerColor / customHeaderColor</td>
                      <td className="border p-1.5">"gradient"|"solid-orange"|... + string</td>
                      <td className="border p-1.5">"gradient"</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">
                        headerHoverColor / customHeaderHoverColor
                      </td>
                      <td className="border p-1.5">"gradient-gold"|... + string</td>
                      <td className="border p-1.5">"gradient-gold"</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">
                        timeBadgeColor / customTimeBadgeColor
                      </td>
                      <td className="border p-1.5">"thai-orange"|... + string</td>
                      <td className="border p-1.5">"thai-orange"</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">
                        timeBadgeHoverColor / customTimeBadgeHoverColor
                      </td>
                      <td className="border p-1.5">"thai-gold"|... + string</td>
                      <td className="border p-1.5">"thai-gold"</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">hoverAnimation</td>
                      <td className="border p-1.5">boolean</td>
                      <td className="border p-1.5">true</td>
                    </tr>
                    <tr>
                      <td className="border p-1.5 font-mono">showTime</td>
                      <td className="border p-1.5">boolean</td>
                      <td className="border p-1.5">true</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="border-thai-orange/20 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
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
          <div className="relative flex min-h-[200px] items-center justify-center rounded-lg border border-dashed bg-gray-50 p-8">
            <p className="absolute top-4 left-4 text-sm font-medium text-gray-500">
              Prévisualisation
            </p>
            <MyCalendarIcon
              date={props.date}
              size={props.size}
              customSize={props.size === "custom" ? props.customSize : undefined}
              borderColor={props.borderColor}
              customBorderColor={
                props.borderColor === "custom" ? props.customBorderColor : undefined
              }
              borderHoverColor={props.borderHoverColor}
              customBorderHoverColor={
                props.borderHoverColor === "custom" ? props.customBorderHoverColor : undefined
              }
              borderWidth={props.borderWidth}
              customBorderWidth={
                props.borderWidth === "custom" ? props.customBorderWidth : undefined
              }
              hoverAnimation={props.hoverAnimation}
              showTime={props.showTime}
              headerColor={props.headerColor}
              customHeaderColor={
                props.headerColor === "custom" ? props.customHeaderColor : undefined
              }
              headerHoverColor={props.headerHoverColor}
              customHeaderHoverColor={
                props.headerHoverColor === "custom" ? props.customHeaderHoverColor : undefined
              }
              timeBadgeColor={props.timeBadgeColor}
              customTimeBadgeColor={
                props.timeBadgeColor === "custom" ? props.customTimeBadgeColor : undefined
              }
              timeBadgeHoverColor={props.timeBadgeHoverColor}
              customTimeBadgeHoverColor={
                props.timeBadgeHoverColor === "custom" ? props.customTimeBadgeHoverColor : undefined
              }
            />
          </div>

          {/* Date Control */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">📅 Date et Heure</label>
            <input
              type="datetime-local"
              value={`${props.date.getFullYear()}-${String(props.date.getMonth() + 1).padStart(2, "0")}-${String(props.date.getDate()).padStart(2, "0")}T${String(props.date.getHours()).padStart(2, "0")}:${String(props.date.getMinutes()).padStart(2, "0")}`}
              onChange={(e) => setProps({ ...props, date: new Date(e.target.value) })}
              className="focus:ring-thai-orange w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Size Control */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">📏 Taille</label>
            <div className="flex flex-wrap gap-2">
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
                  {s === "custom" ? "🎨 Custom" : s}
                </Button>
              ))}
            </div>
            {props.size === "custom" && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={props.customSize}
                  onChange={(e) => setProps({ ...props, customSize: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="w-16 text-sm text-gray-600">{props.customSize}px</span>
              </div>
            )}
          </div>

          {/* Border Color Control - Sans Survol */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              🎨 Couleur Bordure (Sans Survol)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "🟠 Orange", value: "thai-orange" as const },
                { label: "🟢 Vert", value: "thai-green" as const },
                { label: "🔵 Bleu", value: "blue" as const },
                { label: "🔴 Rouge", value: "red" as const },
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
                placeholder="ex: border-purple-500"
                className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            )}
          </div>

          {/* Border Hover Color */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              🎨 Couleur Bordure (Avec Survol)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "🟡 Gold", value: "thai-gold" as const },
                { label: "🟢 Vert", value: "thai-green" as const },
                { label: "🔵 Bleu", value: "blue" as const },
                { label: "🔴 Rouge", value: "red" as const },
                { label: "🎨 Custom", value: "custom" as const },
              ].map((color) => (
                <Button
                  key={color.value}
                  size="sm"
                  variant={props.borderHoverColor === color.value ? "default" : "outline"}
                  onClick={() => setProps({ ...props, borderHoverColor: color.value })}
                  className={
                    props.borderHoverColor === color.value
                      ? "bg-thai-gold hover:bg-thai-gold/90 text-thai-green"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {color.label}
                </Button>
              ))}
            </div>
            {props.borderHoverColor === "custom" && (
              <input
                type="text"
                value={props.customBorderHoverColor}
                onChange={(e) => setProps({ ...props, customBorderHoverColor: e.target.value })}
                placeholder="ex: border-pink-500"
                className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            )}
          </div>

          {/* Border Width Control */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">📏 Épaisseur Bordure</label>
            <div className="flex flex-wrap gap-2">
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
                  {w === "custom" ? "🎨 Custom" : `${w}px`}
                </Button>
              ))}
            </div>
            {props.borderWidth === "custom" && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={props.customBorderWidth}
                  onChange={(e) =>
                    setProps({ ...props, customBorderWidth: Number(e.target.value) })
                  }
                  className="flex-1"
                />
                <span className="w-16 text-sm text-gray-600">{props.customBorderWidth}px</span>
              </div>
            )}
          </div>

          {/* Header Color - Sans Survol */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              🎨 Style Header (Sans Survol)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Gradient", value: "gradient" as const },
                { label: "Orange", value: "solid-orange" as const },
                { label: "Vert", value: "solid-green" as const },
                { label: "🎨 Custom", value: "custom" as const },
              ].map((style) => (
                <Button
                  key={style.value}
                  size="sm"
                  variant={props.headerColor === style.value ? "default" : "outline"}
                  onClick={() => setProps({ ...props, headerColor: style.value })}
                  className={
                    props.headerColor === style.value
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {style.label}
                </Button>
              ))}
            </div>
            {props.headerColor === "custom" && (
              <input
                type="text"
                value={props.customHeaderColor}
                onChange={(e) => setProps({ ...props, customHeaderColor: e.target.value })}
                placeholder="ex: bg-purple-500"
                className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            )}
          </div>

          {/* Header Hover Color */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              🎨 Style Header (Avec Survol)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Gradient Gold", value: "gradient-gold" as const },
                { label: "Gold", value: "solid-gold" as const },
                { label: "Emerald", value: "solid-emerald" as const },
                { label: "🎨 Custom", value: "custom" as const },
              ].map((style) => (
                <Button
                  key={style.value}
                  size="sm"
                  variant={props.headerHoverColor === style.value ? "default" : "outline"}
                  onClick={() => setProps({ ...props, headerHoverColor: style.value })}
                  className={
                    props.headerHoverColor === style.value
                      ? "bg-thai-gold hover:bg-thai-gold/90 text-thai-green"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {style.label}
                </Button>
              ))}
            </div>
            {props.headerHoverColor === "custom" && (
              <input
                type="text"
                value={props.customHeaderHoverColor}
                onChange={(e) => setProps({ ...props, customHeaderHoverColor: e.target.value })}
                placeholder="ex: bg-pink-500"
                className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            )}
          </div>

          {/* Time Badge Color - Sans Survol */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              ⏰ Couleur Badge Heure (Sans Survol)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "🟠 Orange", value: "thai-orange" as const },
                { label: "🟢 Vert", value: "thai-green" as const },
                { label: "🟡 Gold", value: "thai-gold" as const },
                { label: "🔵 Bleu", value: "blue" as const },
                { label: "🔴 Rouge", value: "red" as const },
                { label: "🎨 Custom", value: "custom" as const },
              ].map((color) => (
                <Button
                  key={color.value}
                  size="sm"
                  variant={props.timeBadgeColor === color.value ? "default" : "outline"}
                  onClick={() => setProps({ ...props, timeBadgeColor: color.value })}
                  className={
                    props.timeBadgeColor === color.value
                      ? "bg-thai-orange hover:bg-thai-orange/90"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {color.label}
                </Button>
              ))}
            </div>
            {props.timeBadgeColor === "custom" && (
              <input
                type="text"
                value={props.customTimeBadgeColor}
                onChange={(e) => setProps({ ...props, customTimeBadgeColor: e.target.value })}
                placeholder="ex: bg-purple-500"
                className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            )}
          </div>

          {/* Time Badge Hover Color */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              ⏰ Couleur Badge Heure (Avec Survol)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "🟡 Gold", value: "thai-gold" as const },
                { label: "🟢 Vert", value: "thai-green" as const },
                { label: "🟠 Orange", value: "thai-orange" as const },
                { label: "🔵 Bleu", value: "blue" as const },
                { label: "🎨 Custom", value: "custom" as const },
              ].map((color) => (
                <Button
                  key={color.value}
                  size="sm"
                  variant={props.timeBadgeHoverColor === color.value ? "default" : "outline"}
                  onClick={() => setProps({ ...props, timeBadgeHoverColor: color.value })}
                  className={
                    props.timeBadgeHoverColor === color.value
                      ? "bg-thai-gold hover:bg-thai-gold/90 text-thai-green"
                      : "border-thai-orange/30 text-thai-green hover:bg-thai-orange/10"
                  }
                >
                  {color.label}
                </Button>
              ))}
            </div>
            {props.timeBadgeHoverColor === "custom" && (
              <input
                type="text"
                value={props.customTimeBadgeHoverColor}
                onChange={(e) => setProps({ ...props, customTimeBadgeHoverColor: e.target.value })}
                placeholder="ex: bg-pink-500"
                className="focus:ring-thai-orange mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">✨ Options</label>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.hoverAnimation}
                  onChange={(e) => setProps({ ...props, hoverAnimation: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Animation au survol (scale + shadow)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.showTime}
                  onChange={(e) => setProps({ ...props, showTime: e.target.checked })}
                  className="text-thai-orange focus:ring-thai-orange h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Afficher l'heure</span>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const NumberBadge = ({ number }: { number: number }) => (
  <span className="bg-thai-orange inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
    {number}
  </span>
)

const IconCard = ({
  icon: Icon,
  name,
  usage,
  category,
  number,
}: {
  icon: any
  name: string
  usage: string
  category: string
  number: number
}) => (
  <div className="border-thai-orange/20 hover:border-thai-orange/40 relative flex flex-col gap-3 rounded-lg border-2 bg-white p-4 transition-all duration-200 hover:shadow-md">
    <div className="absolute top-2 left-2">
      <NumberBadge number={number} />
    </div>
    <div className="mt-4 flex items-center justify-between">
      <div className="bg-thai-cream flex h-12 w-12 items-center justify-center rounded-full">
        <Icon className="text-thai-orange h-6 w-6" />
      </div>
      <Badge variant="outline" className="text-xs">
        {category}
      </Badge>
    </div>
    <div className="space-y-1">
      <code className="text-thai-green text-sm font-semibold">{name}</code>
      <p className="text-xs text-gray-600">{usage}</p>
    </div>
  </div>
)

export default function IconsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">🎨 Icônes & Badges</h1>
        <p className="mb-3 text-gray-600">
          Catalogue complet de toutes les icônes Lucide React et variantes de badges utilisées dans
          l'application
        </p>
        <div className="flex gap-2">
          <Badge className="bg-thai-orange">131 Icônes</Badge>
          <Badge className="bg-thai-green">6 Variantes Badges</Badge>
        </div>
      </div>

      {/* MY CALENDAR ICON PLAYGROUND */}
      <MyCalendarIconPlayground />

      {/* BADGES SECTION */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Badges</CardTitle>
          <CardDescription>
            Composant: <code className="text-xs">components/ui/badge.tsx</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Badge */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">1. Badge Default (Orange)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge>Nouveau</Badge>
              <Badge>Populaire</Badge>
              <Badge className="bg-thai-orange">Orange Thaï</Badge>
            </div>
            <code className="block rounded bg-gray-100 p-2 text-xs">
              &lt;Badge&gt;Nouveau&lt;/Badge&gt; ou &lt;Badge className="bg-thai-orange"&gt;
            </code>
            <p className="text-xs text-gray-500">Usage : Badges d'état, nouveautés, highlights</p>
          </div>

          {/* Secondary Badge */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">2. Badge Secondary (Vert)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="secondary">Info</Badge>
              <Badge className="bg-thai-green">Vert Thaï</Badge>
            </div>
            <code className="block rounded bg-gray-100 p-2 text-xs">
              &lt;Badge variant="secondary"&gt; ou &lt;Badge className="bg-thai-green"&gt;
            </code>
            <p className="text-xs text-gray-500">Usage : Informations secondaires</p>
          </div>

          {/* Destructive Badge */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">3. Badge Destructive (Rouge)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="destructive">Annulée</Badge>
              <Badge variant="destructive">Erreur</Badge>
            </div>
            <code className="block rounded bg-gray-100 p-2 text-xs">
              &lt;Badge variant="destructive"&gt;Annulée&lt;/Badge&gt;
            </code>
            <p className="text-xs text-gray-500">Usage : Erreurs, états critiques, annulations</p>
          </div>

          {/* Outline Badge */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">4. Badge Outline</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline">Outline</Badge>
              <Badge variant="outline">Tag</Badge>
              <Badge variant="outline" className="border-thai-orange text-thai-green">
                Orange Border
              </Badge>
            </div>
            <code className="block rounded bg-gray-100 p-2 text-xs">
              &lt;Badge variant="outline"&gt;Tag&lt;/Badge&gt;
            </code>
            <p className="text-xs text-gray-500">Usage : Tags, catégories, filtres</p>
          </div>

          {/* Custom Color Badges */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">5. Badges Statuts Commandes</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-yellow-500">En attente</Badge>
              <Badge className="bg-blue-500">En préparation</Badge>
              <Badge className="bg-green-500">Prête</Badge>
              <Badge className="bg-purple-500">Livrée</Badge>
              <Badge className="bg-thai-gold text-thai-green">Gold</Badge>
            </div>
            <code className="block rounded bg-gray-100 p-2 text-xs">
              &lt;Badge className="bg-yellow-500"&gt;En attente&lt;/Badge&gt;
            </code>
            <p className="text-xs text-gray-500">Usage : États de commandes, progression</p>
          </div>

          {/* Badges avec icônes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">6. Badges avec Icônes</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className="gap-1">
                <Star className="h-3 w-3 fill-current" />
                Favori
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Flame className="h-3 w-3" />
                Épicé
              </Badge>
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Important
              </Badge>
            </div>
            <code className="block rounded bg-gray-100 p-2 text-xs">
              &lt;Badge className="gap-1"&gt;&lt;Star /&gt; Favori&lt;/Badge&gt;
            </code>
            <p className="text-xs text-gray-500">Usage : Badges descriptifs avec contexte visuel</p>
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Navigation & Actions */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Navigation & Actions</CardTitle>
          <CardDescription>Icônes pour navigation, menus, et actions générales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Home}
              name="Home"
              usage="Retour accueil"
              category="Navigation"
              number={1}
            />
            <IconCard
              icon={ArrowLeft}
              name="ArrowLeft"
              usage="Retour arrière"
              category="Navigation"
              number={2}
            />
            <IconCard
              icon={ArrowRight}
              name="ArrowRight"
              usage="Suivant"
              category="Navigation"
              number={3}
            />
            <IconCard
              icon={ChevronLeft}
              name="ChevronLeft"
              usage="Carousel, pagination"
              category="Navigation"
              number={4}
            />
            <IconCard
              icon={ChevronRight}
              name="ChevronRight"
              usage="Liens externes, détails"
              category="Navigation"
              number={5}
            />
            <IconCard
              icon={ChevronDown}
              name="ChevronDown"
              usage="Select, dropdown"
              category="Navigation"
              number={6}
            />
            <IconCard
              icon={ChevronUp}
              name="ChevronUp"
              usage="Scroll up"
              category="Navigation"
              number={7}
            />
            <IconCard icon={X} name="X" usage="Fermer modal, toast" category="Action" number={8} />
            <IconCard
              icon={Menu}
              name="Menu"
              usage="Menu mobile"
              category="Navigation"
              number={9}
            />
            <IconCard
              icon={MoreHorizontal}
              name="MoreHorizontal"
              usage="Options"
              category="Action"
              number={10}
            />
            <IconCard icon={Search} name="Search" usage="Recherche" category="Action" number={11} />
            <IconCard icon={Filter} name="Filter" usage="Filtres" category="Action" number={12} />
            <IconCard
              icon={Languages}
              name="Languages"
              usage="Sélecteur langue"
              category="Action"
              number={13}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - E-commerce */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - E-commerce</CardTitle>
          <CardDescription>Panier, paiement, gestion quantités</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={ShoppingCart}
              name="ShoppingCart"
              usage="Panier"
              category="Commerce"
              number={14}
            />
            <IconCard
              icon={ShoppingBag}
              name="ShoppingBag"
              usage="Panier alternatif"
              category="Commerce"
              number={15}
            />
            <IconCard
              icon={ShoppingBasket}
              name="ShoppingBasket"
              usage="Panier rempli"
              category="Commerce"
              number={16}
            />
            <IconCard
              icon={CreditCard}
              name="CreditCard"
              usage="Paiement"
              category="Commerce"
              number={17}
            />
            <IconCard
              icon={Plus}
              name="Plus"
              usage="Ajouter quantité"
              category="Action"
              number={18}
            />
            <IconCard
              icon={Minus}
              name="Minus"
              usage="Réduire quantité"
              category="Action"
              number={19}
            />
            <IconCard
              icon={Trash2}
              name="Trash2"
              usage="Supprimer article"
              category="Action"
              number={20}
            />
            <IconCard
              icon={Tag}
              name="Tag"
              usage="Prix, étiquette"
              category="Commerce"
              number={21}
            />
            <IconCard
              icon={Receipt}
              name="Receipt"
              usage="Reçu, ticket"
              category="Commerce"
              number={22}
            />
            <IconCard
              icon={Calculator}
              name="Calculator"
              usage="Calcul prix"
              category="Commerce"
              number={23}
            />
            <IconCard icon={Euro} name="Euro" usage="Monnaie €" category="Commerce" number={24} />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - User & Auth */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Utilisateur & Auth</CardTitle>
          <CardDescription>Authentification, profil, sécurité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={User}
              name="User"
              usage="Profil utilisateur"
              category="User"
              number={25}
            />
            <IconCard
              icon={UserPlus}
              name="UserPlus"
              usage="Inscription"
              category="Auth"
              number={26}
            />
            <IconCard
              icon={UserMinus}
              name="UserMinus"
              usage="Supprimer compte"
              category="Auth"
              number={27}
            />
            <IconCard icon={LogIn} name="LogIn" usage="Connexion" category="Auth" number={28} />
            <IconCard icon={LogOut} name="LogOut" usage="Déconnexion" category="Auth" number={29} />
            <IconCard
              icon={Lock}
              name="Lock"
              usage="Mot de passe"
              category="Security"
              number={30}
            />
            <IconCard
              icon={Shield}
              name="Shield"
              usage="Sécurité"
              category="Security"
              number={31}
            />
            <IconCard
              icon={ShieldCheck}
              name="ShieldCheck"
              usage="Sécurité vérifiée"
              category="Security"
              number={32}
            />
            <IconCard
              icon={Eye}
              name="Eye"
              usage="Afficher password"
              category="Action"
              number={33}
            />
            <IconCard
              icon={EyeOff}
              name="EyeOff"
              usage="Masquer password"
              category="Action"
              number={34}
            />
            <IconCard
              icon={Users}
              name="Users"
              usage="Groupe, clients"
              category="User"
              number={35}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Communication */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Communication</CardTitle>
          <CardDescription>Email, téléphone, messages, notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Mail}
              name="Mail"
              usage="Email, contact"
              category="Contact"
              number={36}
            />
            <IconCard icon={Phone} name="Phone" usage="Téléphone" category="Contact" number={37} />
            <IconCard
              icon={MessageSquare}
              name="MessageSquare"
              usage="Messages"
              category="Contact"
              number={38}
            />
            <IconCard
              icon={MessageCircle}
              name="MessageCircle"
              usage="Chat"
              category="Contact"
              number={39}
            />
            <IconCard icon={Bell} name="Bell" usage="Notifications" category="Alert" number={40} />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Status & Feedback */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Statuts & Feedback</CardTitle>
          <CardDescription>Succès, erreurs, alertes, chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Check}
              name="Check"
              usage="Validé, checkbox"
              category="Success"
              number={41}
            />
            <IconCard
              icon={CheckCircle}
              name="CheckCircle"
              usage="Succès"
              category="Success"
              number={42}
            />
            <IconCard
              icon={CheckCircle2}
              name="CheckCircle2"
              usage="Confirmation"
              category="Success"
              number={43}
            />
            <IconCard icon={XCircle} name="XCircle" usage="Échec" category="Error" number={44} />
            <IconCard
              icon={AlertCircle}
              name="AlertCircle"
              usage="Alerte info"
              category="Warning"
              number={45}
            />
            <IconCard
              icon={AlertTriangle}
              name="AlertTriangle"
              usage="Attention"
              category="Warning"
              number={46}
            />
            <IconCard icon={Info} name="Info" usage="Information" category="Info" number={47} />
            <IconCard
              icon={Loader2}
              name="Loader2"
              usage="Chargement (animate-spin)"
              category="Loading"
              number={48}
            />
            <IconCard
              icon={TrendingUp}
              name="TrendingUp"
              usage="Croissance, stats"
              category="Analytics"
              number={49}
            />
            <IconCard
              icon={PartyPopper}
              name="PartyPopper"
              usage="Célébration"
              category="Celebration"
              number={50}
            />
            <IconCard
              icon={Award}
              name="Award"
              usage="Récompense"
              category="Achievement"
              number={51}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Food & Restaurant */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Restaurant & Food</CardTitle>
          <CardDescription>Spécifiques à l'activité restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Utensils}
              name="Utensils"
              usage="Restaurant, plats"
              category="Food"
              number={52}
            />
            <IconCard icon={Flame} name="Flame" usage="Épicé, piment" category="Food" number={53} />
            <IconCard icon={Leaf} name="Leaf" usage="Non épicé, végé" category="Food" number={54} />
            <IconCard icon={Star} name="Star" usage="Favori, note" category="Rating" number={55} />
            <IconCard
              icon={Heart}
              name="Heart"
              usage="Merci, favori"
              category="Social"
              number={56}
            />
            <IconCard
              icon={CookingPot}
              name="CookingPot"
              usage="Cuisine, préparation"
              category="Food"
              number={57}
            />
            <IconCard
              icon={ChefHat}
              name="ChefHat"
              usage="Chef, cuisinier"
              category="Food"
              number={58}
            />
            <IconCard icon={Cookie} name="Cookie" usage="Dessert" category="Food" number={59} />
          </div>
        </CardContent>
      </Card>

      {/* SPICE COMPONENT SECTION */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">
            Spice - Interactif AVEC fond et centrés
          </CardTitle>
          <CardDescription>
            Composant: <code className="text-xs">components/shared/Spice.tsx</code>
            <br />
            Mode interactif avec fond dégradé et icônes centrées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const [distribution, setDistribution] = useState<number[]>([2, 3, 1, 1])

            return (
              <div className="space-y-6">
                {/* Example 1: Interactive with background */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <NumberBadge number={20} />
                    <h3 className="font-semibold text-gray-700">
                      Spice Interactif - Avec fond dégradé
                    </h3>
                  </div>
                  <div className="border-thai-orange/30 rounded-lg border-2 border-dashed bg-gray-50 p-6">
                    <Spice
                      distribution={distribution}
                      onDistributionChange={setDistribution}
                      readOnly={false}
                      showBackground={true}
                      hideZeros={false}
                    />
                  </div>
                  <code className="block rounded bg-gray-100 p-3 text-xs">
                    &lt;Spice
                    <br />
                    &nbsp;&nbsp;distribution={`{[2, 3, 1, 1]}`}
                    <br />
                    &nbsp;&nbsp;onDistributionChange={`{setDistribution}`}
                    <br />
                    &nbsp;&nbsp;readOnly={`{false}`}
                    <br />
                    &nbsp;&nbsp;showBackground={`{true}`}
                    <br />
                    &nbsp;&nbsp;hideZeros={`{false}`}
                    <br />
                    /&gt;
                  </code>
                  <p className="text-xs text-gray-500">
                    <strong>Usage:</strong> Cliquez sur les cercles pour redistribuer les niveaux
                    d'épice. Le fond affiche un dégradé basé sur la distribution actuelle.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Distribution actuelle:</strong> {distribution[0]} non-épicé,{" "}
                    {distribution[1]} peu épicé, {distribution[2]} moyennement épicé,{" "}
                    {distribution[3]} très épicé
                  </p>
                </div>

                {/* Example 2: Read-only with background */}
                <div className="space-y-3 border-t border-dashed border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-700">Spice Lecture Seule - Avec fond</h3>
                  <div className="border-thai-green/30 rounded-lg border-2 border-dashed bg-gray-50 p-6">
                    <Spice
                      distribution={[0, 0, 3, 2]}
                      readOnly={true}
                      showBackground={true}
                      hideZeros={true}
                    />
                  </div>
                  <code className="block rounded bg-gray-100 p-3 text-xs">
                    &lt;Spice
                    <br />
                    &nbsp;&nbsp;distribution={`{[0, 0, 3, 2]}`}
                    <br />
                    &nbsp;&nbsp;readOnly={`{true}`}
                    <br />
                    &nbsp;&nbsp;showBackground={`{true}`}
                    <br />
                    &nbsp;&nbsp;hideZeros={`{true}`}
                    <br />
                    /&gt;
                  </code>
                  <p className="text-xs text-gray-500">
                    <strong>Usage:</strong> Affichage en lecture seule avec fond. Les niveaux à 0
                    sont masqués (hideZeros=true).
                  </p>
                </div>

                {/* Example 3: Without background (compact) */}
                <div className="space-y-3 border-t border-dashed border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-700">Spice Compact - Sans fond</h3>
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6">
                    <Spice
                      distribution={[1, 2, 1, 0]}
                      readOnly={true}
                      showBackground={false}
                      hideZeros={true}
                    />
                  </div>
                  <code className="block rounded bg-gray-100 p-3 text-xs">
                    &lt;Spice
                    <br />
                    &nbsp;&nbsp;distribution={`{[1, 2, 1, 0]}`}
                    <br />
                    &nbsp;&nbsp;readOnly={`{true}`}
                    <br />
                    &nbsp;&nbsp;showBackground={`{false}`}
                    <br />
                    &nbsp;&nbsp;hideZeros={`{true}`}
                    <br />
                    /&gt;
                  </code>
                  <p className="text-xs text-gray-500">
                    <strong>Usage:</strong> Version compacte sans fond, idéale pour les listes et
                    cartes.
                  </p>
                </div>
              </div>
            )
          })()}
        </CardContent>
      </Card>

      {/* ICONS SECTION - Date & Time */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Date & Temps</CardTitle>
          <CardDescription>Calendrier, horaires, historique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Calendar}
              name="Calendar"
              usage="Date, réservation"
              category="DateTime"
              number={60}
            />
            <IconCard icon={Clock} name="Clock" usage="Horaires" category="DateTime" number={61} />
            <IconCard
              icon={History}
              name="History"
              usage="Historique"
              category="DateTime"
              number={62}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Location */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Localisation</CardTitle>
          <CardDescription>Adresse, navigation, maps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={MapPin}
              name="MapPin"
              usage="Adresse, localisation"
              category="Location"
              number={63}
            />
            <IconCard
              icon={Navigation}
              name="Navigation"
              usage="Itinéraire, GPS"
              category="Location"
              number={64}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Delivery & Stock */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Livraison & Stock</CardTitle>
          <CardDescription>Livraison, colis, inventaire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard icon={Truck} name="Truck" usage="Livraison" category="Delivery" number={65} />
            <IconCard
              icon={Package}
              name="Package"
              usage="Colis, emballage"
              category="Stock"
              number={66}
            />
            <IconCard
              icon={PackageSearch}
              name="PackageSearch"
              usage="Recherche stock"
              category="Stock"
              number={67}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Files & Content */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Fichiers & Contenu</CardTitle>
          <CardDescription>Édition, sauvegarde, documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={FileText}
              name="FileText"
              usage="Document, détails"
              category="File"
              number={68}
            />
            <IconCard icon={Save} name="Save" usage="Sauvegarder" category="Action" number={69} />
            <IconCard icon={Edit} name="Edit" usage="Modifier" category="Action" number={70} />
            <IconCard
              icon={Edit3}
              name="Edit3"
              usage="Éditer profil"
              category="Action"
              number={71}
            />
            <IconCard
              icon={Camera}
              name="Camera"
              usage="Photo profil"
              category="Media"
              number={72}
            />
            <IconCard
              icon={Upload}
              name="Upload"
              usage="Uploader fichier"
              category="Action"
              number={73}
            />
            <IconCard
              icon={Download}
              name="Download"
              usage="Télécharger"
              category="Action"
              number={74}
            />
            <IconCard icon={Video} name="Video" usage="Vidéo" category="Media" number={75} />
            <IconCard
              icon={ImageIcon}
              name="ImageIcon"
              usage="Image"
              category="Media"
              number={76}
            />
            <IconCard icon={Link} name="Link" usage="Lien URL" category="Action" number={77} />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Social & External */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Réseaux Sociaux</CardTitle>
          <CardDescription>Facebook, Instagram, liens externes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Facebook}
              name="Facebook"
              usage="Facebook page"
              category="Social"
              number={78}
            />
            <IconCard
              icon={Instagram}
              name="Instagram"
              usage="Instagram profile"
              category="Social"
              number={79}
            />
            <IconCard
              icon={ExternalLink}
              name="ExternalLink"
              usage="Lien externe"
              category="Action"
              number={80}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Settings & Config */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Paramètres & Config</CardTitle>
          <CardDescription>Configuration, layout, design</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Settings}
              name="Settings"
              usage="Paramètres"
              category="Config"
              number={81}
            />
            <IconCard
              icon={Palette}
              name="Palette"
              usage="Design, couleurs"
              category="Design"
              number={82}
            />
            <IconCard
              icon={Layout}
              name="Layout"
              usage="Layout, grille"
              category="Design"
              number={83}
            />
            <IconCard
              icon={LayoutGrid}
              name="LayoutGrid"
              usage="Grille admin"
              category="Design"
              number={84}
            />
            <IconCard
              icon={LayoutDashboard}
              name="LayoutDashboard"
              usage="Dashboard"
              category="Design"
              number={85}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Connectivity */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Connectivité</CardTitle>
          <CardDescription>État de connexion, réseau</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard icon={Wifi} name="Wifi" usage="Connecté" category="Network" number={86} />
            <IconCard
              icon={WifiOff}
              name="WifiOff"
              usage="Hors ligne"
              category="Network"
              number={87}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Admin & System */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Admin & Système</CardTitle>
          <CardDescription>Fonctionnalités d'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Command}
              name="Command"
              usage="Commandes clavier"
              category="System"
              number={88}
            />
            <IconCard
              icon={Beaker}
              name="Beaker"
              usage="Tests, expérimental"
              category="Dev"
              number={89}
            />
            <IconCard
              icon={Bot}
              name="Bot"
              usage="Automatisation, bot"
              category="System"
              number={90}
            />
            <IconCard icon={Hash} name="Hash" usage="ID, référence" category="Data" number={91} />
            <IconCard
              icon={Zap}
              name="Zap"
              usage="Performance, rapide"
              category="System"
              number={92}
            />
          </div>
        </CardContent>
      </Card>

      {/* ICONS SECTION - Misc */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green text-2xl">Icônes - Divers</CardTitle>
          <CardDescription>Icônes diverses non catégorisées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <IconCard
              icon={Sparkles}
              name="Sparkles"
              usage="Nouveauté, spécial"
              category="Decoration"
              number={93}
            />
            <IconCard
              icon={Circle}
              name="Circle"
              usage="Point, indicateur"
              category="Shape"
              number={94}
            />
            <IconCard icon={Dot} name="Dot" usage="Séparateur" category="Shape" number={95} />
            <IconCard
              icon={GripVertical}
              name="GripVertical"
              usage="Drag handle"
              category="Action"
              number={96}
            />
            <IconCard
              icon={Smartphone}
              name="Smartphone"
              usage="Mobile, PWA"
              category="Device"
              number={97}
            />
          </div>
        </CardContent>
      </Card>

      {/* Guide d'utilisation */}
      <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 bg-linear-to-r">
        <CardHeader>
          <CardTitle className="text-thai-green">💡 Guide d'Utilisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <h4 className="text-thai-orange font-semibold">Import des icônes</h4>
            <code className="block rounded bg-gray-100 p-3 text-xs">
              import {"{ ShoppingCart, Check, AlertCircle }"} from "lucide-react"
            </code>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="text-thai-orange font-semibold">Utilisation basique</h4>
            <code className="block rounded bg-gray-100 p-3 text-xs">
              &lt;ShoppingCart className="h-4 w-4" /&gt;
            </code>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="text-thai-orange font-semibold">Avec couleur Thai</h4>
            <code className="block rounded bg-gray-100 p-3 text-xs">
              &lt;Flame className="h-5 w-5 text-thai-orange" /&gt;
            </code>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="text-thai-orange font-semibold">Animation (Loading)</h4>
            <code className="block rounded bg-gray-100 p-3 text-xs">
              &lt;Loader2 className="h-4 w-4 animate-spin" /&gt;
            </code>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="text-thai-orange font-semibold">Tailles standards</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="text-thai-orange h-3 w-3" />
                <code className="text-xs">h-3 w-3</code>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-thai-orange h-4 w-4" />
                <code className="text-xs">h-4 w-4</code>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-thai-orange h-5 w-5" />
                <code className="text-xs">h-5 w-5</code>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-thai-orange h-6 w-6" />
                <code className="text-xs">h-6 w-6</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
