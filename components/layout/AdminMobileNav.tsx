"use client"

import { BarChart3, LayoutGrid, ShoppingCart, Users, Utensils } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useHaptic } from "@/hooks/useHaptic"
import { cn } from "@/lib/utils"

export function AdminMobileNav() {
  const pathname = usePathname()
  const haptic = useHaptic()

  const links = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutGrid,
      exact: true,
    },
    {
      name: "Commandes",
      href: "/admin/commandes",
      icon: ShoppingCart,
    },
    {
      name: "Plats",
      href: "/admin/plats",
      icon: Utensils,
    },
    {
      name: "Clients",
      href: "/admin/clients",
      icon: Users,
    },
    {
      name: "Stats",
      href: "/admin/statistiques",
      icon: BarChart3,
    },
  ]

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white/95 px-2 backdrop-blur-sm lg:hidden">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = link.exact ? pathname === link.href : pathname?.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href as any}
            onClick={() => haptic.light()}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 p-2 transition-colors",
              isActive ? "text-thai-orange" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Icon className={cn("h-6 w-6", isActive && "fill-current/20")} />
            <span className="text-[10px] font-medium">{link.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
