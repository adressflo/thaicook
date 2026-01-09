"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CreditCard, FileText, Layout, MessageSquare, Palette, Sparkles } from "lucide-react"
import Link from "next/link"

const sections = [
  {
    title: "Boutons",
    href: "/admin/testvisuel/boutons",
    icon: Palette,
    description: "15 styles de boutons avec états et variantes",
    count: "15",
    color: "thai-orange",
  },
  {
    title: "Inputs",
    href: "/admin/testvisuel/inputs",
    icon: MessageSquare,
    description: "26 composants de formulaire et patterns avancés",
    count: "26",
    color: "thai-green",
  },
  {
    title: "Icônes & Badges",
    href: "/admin/testvisuel/icon",
    icon: Sparkles,
    description: "131 icônes Lucide React et 6 variantes de badges",
    count: "131",
    color: "thai-orange",
  },
  {
    title: "UI Components",
    href: "/admin/testvisuel/ui",
    icon: Palette,
    description: "Collection complète shadcn/ui",
    count: "56",
    color: "thai-orange",
  },
  {
    title: "Toasts",
    href: "/admin/testvisuel/toasts",
    icon: Bell,
    description: "Système de notifications enrichies",
    count: "6",
    color: "thai-green",
  },
  {
    title: "Modales",
    href: "/admin/testvisuel/modal",
    icon: Layout,
    description: "Dialogues, alertes et fenêtres modales",
    count: "6",
    color: "thai-orange",
  },
  {
    title: "Cards",
    href: "/admin/testvisuel/card",
    icon: CreditCard,
    description: "Conteneurs, cartes produits et statistiques",
    count: "9",
    color: "thai-green",
  },
  {
    title: "Documents PDF",
    href: "/admin/testvisuel/documents",
    icon: FileText,
    description: "Design des Devis, Factures et Reçus",
    count: "3",
    color: "thai-orange",
  },
]

export default function TestVisuelDashboard() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <Link key={section.href} href={section.href as any} className="h-full">
          <Card className="group border-thai-orange/20 hover:border-thai-orange/40 relative h-full overflow-hidden transition-all hover:scale-[1.03] hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`rounded-xl bg-linear-to-br ${
                    section.color === "thai-green"
                      ? "from-thai-green/20 to-thai-green/5"
                      : "from-thai-orange/20 to-thai-orange/5"
                  } p-3 shadow-sm`}
                >
                  <section.icon
                    className={`h-8 w-8 ${
                      section.color === "thai-green" ? "text-thai-green" : "text-thai-orange"
                    }`}
                  />
                </div>
              </div>
              <CardTitle className="group-hover:text-thai-orange text-xl font-bold transition-colors">
                {section.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 min-h-10 text-sm text-gray-600">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`${
                    section.color === "thai-green"
                      ? "border-thai-green/30 text-thai-green"
                      : "border-thai-orange/30 text-thai-orange"
                  }`}
                >
                  {section.count} composants
                </Badge>
                <span className="text-thai-orange text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  Accéder →
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
