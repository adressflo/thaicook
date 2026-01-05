"use client"

import { useCart } from "@/contexts/CartContext"
import { usePermissions } from "@/hooks/usePermissions"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { History, Home, MapPin, ShoppingCart, User, UtensilsCrossed } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function MobileNav() {
  // MobileNav Refined v4 (Sepated Menu/Cart + Modern UX)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = usePermissions()
  const { totalArticles, totalPrix } = useCart()
  const [showCartBar, setShowCartBar] = useState(false)

  // Masquer/Afficher la barre de résumé si panier > 0
  useEffect(() => {
    setShowCartBar(totalArticles > 0)
  }, [totalArticles])

  const isActive = (path: string) => pathname === path

  const handleBarClick = () => {
    router.push("/panier")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  if (pathname?.startsWith("/admin")) return null

  // Définition de la navigation 5 onglets
  const navigation = [
    { name: "Accueil", href: "/", icon: Home },
    {
      name: "Menu",
      href: "/commander",
      icon: UtensilsCrossed,
      badge: null,
    },
    {
      name: "Panier",
      href: "/panier",
      icon: ShoppingCart,
      badge: totalArticles > 0 ? totalArticles : null,
    },
    // Si connecté -> Historique, sinon -> Contact
    ...(isAuthenticated
      ? [{ name: "Historique", href: "/historique", icon: History }]
      : [{ name: "Contact", href: "/nous-trouver", icon: MapPin }]),
    { name: "Profil", href: "/profil", icon: User, badge: null },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full md:hidden">
      {/* Barre de Résumé "Docked" au-dessus de la nav - Shortcut vers Panier */}
      <AnimatePresence>
        {showCartBar && pathname !== "/panier" && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={handleBarClick}
            className="group border-thai-green bg-thai-cream hover:bg-thai-green absolute bottom-[calc(100%-1px)] left-0 w-full cursor-pointer border-t px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2">
              {/* Gauche: Icone Panier + Badge Quantité */}
              <div className="relative flex shrink-0 items-center">
                <div className="border-thai-green/20 relative h-10 w-10 overflow-hidden rounded-full border bg-white">
                  <Image
                    src="/media/avatars/panier1.svg"
                    alt="Panier"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-thai-green absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm">
                  {totalArticles}
                </div>
              </div>

              {/* Centre: Texte "Voir mon panier" */}
              <div className="text-thai-green grow text-center text-base font-bold transition-colors duration-300 group-hover:text-white">
                Voir mon panier
              </div>

              {/* Droite: Badge Prix */}
              <div className="bg-thai-orange shrink-0 rounded-full px-3 py-1 text-base font-bold whitespace-nowrap text-white shadow-sm ring-1 ring-white/50">
                {formatPrice(totalPrix)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="border-thai-orange/20 pb-safe flex h-16 w-full items-center justify-around border-t bg-white/95 px-1 backdrop-blur-md">
        {navigation.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                "relative flex min-w-[60px] flex-col items-center justify-center space-y-1 rounded-lg py-1 transition-all duration-200",
                active
                  ? "text-thai-orange"
                  : "text-thai-green/70 hover:bg-thai-green/5 hover:text-thai-green"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  active ? "scale-110 stroke-[2.5px]" : "stroke-current"
                )}
              />
              {item.badge && (
                <span className="bg-thai-green absolute top-0.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {item.badge}
                </span>
              )}
              <span className={cn("text-[10px] font-medium", active ? "font-bold" : "")}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
