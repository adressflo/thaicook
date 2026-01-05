"use client"

// src/components/Sidebar.tsx
import LanguageSelector from "@/components/layout/LanguageSelector"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  Calendar,
  LayoutDashboard,
  MapPin,
  Menu,
  Shield,
  User,
  Users,
  Utensils,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

const Sidebar = () => {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(!isMobile)
  const pathname = usePathname()
  const { t } = useTranslation()

  // Chemin vers TON logo
  const logoPath = "/lovable-uploads/62d46b15-aa56-45d2-ab7d-75dfee70f70d.png"

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isMobile === undefined) return
    setIsOpen(!isMobile)
  }, [isMobile])

  const navigation = [
    { name: t("navigation.dashboard"), href: "/", icon: LayoutDashboard },
    { name: t("navigation.order"), href: "/commander", icon: Utensils },
    { name: t("navigation.events"), href: "/evenements", icon: Calendar },
    { name: t("navigation.findUs"), href: "/nous-trouver", icon: MapPin },
    { name: t("navigation.profile"), href: "/profil", icon: User },
    { name: t("navigation.about"), href: "/a-propos", icon: Users },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-thai-orange hover:bg-thai-orange/10 fixed top-4 left-4 z-[60] bg-white/80 backdrop-blur-sm md:hidden"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      <div
        className={cn(
          "border-thai-orange/20 fixed top-0 left-0 z-50 h-full border-r bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isMobile
            ? isOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full"
            : isOpen
              ? "w-64"
              : "w-20"
        )}
      >
        {!isMobile && (
          <div
            className="border-thai-orange/20 flex items-center border-b p-3"
            style={{ minHeight: "65px" }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-thai-orange/10 text-thai-orange"
              aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {isOpen && (
              <span className="text-thai-green ml-2 text-sm font-medium whitespace-nowrap">
                {t("common.close")}
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            "border-thai-orange/20 flex items-center border-b p-3",
            isMobile && isOpen ? "mt-12" : "" // Marge en haut sur mobile si sidebar et burger ouverts
          )}
          style={{ minHeight: "65px" }}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 overflow-hidden"
            onClick={handleLinkClick}
          >
            <img
              src={logoPath}
              alt="Logo ChanthanaThaiCook"
              className="h-10 w-10 shrink-0 rounded-full object-contain"
            />
            {isOpen && (
              <div className="flex flex-col truncate">
                <span className="text-thai-green text-base font-bold whitespace-nowrap">
                  ChanthanaThaiCook
                </span>
                <span className="text-thai-orange -mt-1 text-xs whitespace-nowrap">
                  Cuisine Thaïlandaise
                </span>
              </div>
            )}
          </Link>
        </div>

        {isOpen && (
          <div className="border-thai-orange/20 border-b p-3">
            <LanguageSelector />
          </div>
        )}

        <nav className="grow space-y-1 overflow-y-auto p-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href as any}
              onClick={handleLinkClick}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2.5 transition-colors duration-200",
                isActive(item.href)
                  ? "bg-thai-orange text-white shadow-md"
                  : "text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange",
                !isOpen && "justify-center"
              )}
              title={isOpen ? "" : item.name}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive(item.href)
                    ? "text-white"
                    : "text-thai-orange group-hover:text-thai-orange"
                )}
              />
              {isOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
            </Link>
          ))}

          <div className="border-thai-orange/10 mt-4 border-t pt-4">
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2.5 transition-colors duration-200",
                isActive("/admin") || pathname?.startsWith("/admin")
                  ? "bg-thai-green text-white shadow-md"
                  : "text-thai-green/80 hover:bg-thai-green/10 hover:text-thai-green",
                !isOpen && "justify-center"
              )}
              title={isOpen ? "" : t("navigation.administration")}
            >
              <Shield
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive("/admin") || pathname?.startsWith("/admin")
                    ? "text-white"
                    : "text-thai-green/80 group-hover:text-thai-green"
                )}
              />
              {isOpen && (
                <span className="ml-3 text-sm font-medium">{t("navigation.administration")}</span>
              )}
            </Link>
          </div>
        </nav>
      </div>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
