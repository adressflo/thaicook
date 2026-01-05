"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Palette,
  MessageSquare,
  Shield,
  Database,
  Radio,
  FolderOpen,
  Smartphone,
  Bell,
  Workflow,
  Mail,
  Zap,
  AlertTriangle,
  BookOpen,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/testvisuel",
    icon: LayoutDashboard,
    description: "Vue d'ensemble",
  },
  {
    name: "Catalogue",
    href: "/admin/testvisuel/catalogue",
    icon: BookOpen,
    description: "Composants numérotés",
  },
  {
    name: "Boutons",
    href: "/admin/testvisuel/boutons",
    icon: Palette,
    description: "15 variantes boutons",
  },
  {
    name: "Inputs",
    href: "/admin/testvisuel/inputs",
    icon: MessageSquare,
    description: "13 éléments formulaire",
  },
  {
    name: "UI Components",
    href: "/admin/testvisuel/ui",
    icon: Palette,
    description: "56 composants shadcn/ui",
  },
  {
    name: "Toasts",
    href: "/admin/testvisuel/toasts",
    icon: MessageSquare,
    description: "Notifications toast",
  },
  {
    name: "Authentication",
    href: "/admin/testvisuel/auth",
    icon: Shield,
    description: "Better Auth flows",
  },
  {
    name: "Database",
    href: "/admin/testvisuel/database",
    icon: Database,
    description: "Prisma CRUD",
  },
  {
    name: "Realtime",
    href: "/admin/testvisuel/realtime",
    icon: Radio,
    description: "Supabase channels",
  },
  {
    name: "Storage",
    href: "/admin/testvisuel/storage",
    icon: FolderOpen,
    description: "Upload/Download",
  },
  {
    name: "PWA",
    href: "/admin/testvisuel/pwa",
    icon: Smartphone,
    description: "Service Worker",
  },
  {
    name: "Notifications",
    href: "/admin/testvisuel/notifications",
    icon: Bell,
    description: "Firebase FCM",
  },
  {
    name: "Workflows",
    href: "/admin/testvisuel/workflows",
    icon: Workflow,
    description: "n8n automation",
  },
  {
    name: "Emails",
    href: "/admin/testvisuel/emails",
    icon: Mail,
    description: "React Email templates",
  },
  {
    name: "Performance",
    href: "/admin/testvisuel/performance",
    icon: Zap,
    description: "Core Web Vitals",
  },
  {
    name: "Errors",
    href: "/admin/testvisuel/errors",
    icon: AlertTriangle,
    description: "Edge cases",
  },
]

export default function TestVisuelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-thai-cream/30">
      <main className="flex-1">
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}
