"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Commander", href: "/commander" },
    { name: "Événements", href: "/evenements" },
    { name: "Mon Profil", href: "/profil" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-thai-orange/20 sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="from-thai-orange to-thai-gold flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-thai-green text-xl font-bold">ChanthanaThaiCook</span>
              <span className="text-thai-orange -mt-1 text-xs">
                Cuisine Thaïlandaise Authentique
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href as any}
                className={cn(
                  "rounded-lg px-4 py-2 font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-thai-orange text-white shadow-lg"
                    : "text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-all duration-200",
                isActive("/admin")
                  ? "bg-thai-green text-white"
                  : "text-thai-green/70 hover:bg-thai-green/10 hover:text-thai-green"
              )}
              title="Administration"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-thai-orange/20 animate-slide-in border-t py-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href as any}
                  className={cn(
                    "rounded-lg px-4 py-3 font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-thai-orange text-white"
                      : "text-thai-green hover:bg-thai-orange/10"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-4 py-3 text-sm transition-all duration-200",
                  isActive("/admin")
                    ? "bg-thai-green text-white"
                    : "text-thai-green/70 hover:bg-thai-green/10"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Administration</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
