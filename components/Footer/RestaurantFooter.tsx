"use client"

import { EmailIcon } from "@/components/icons/EmailIcon"
import { FacebookIcon } from "@/components/icons/FacebookIcon"
import { GoogleMapsIcon } from "@/components/icons/GoogleMapsIcon"
import { InstagramIcon } from "@/components/icons/InstagramIcon"
import { MessengerIcon } from "@/components/icons/MessengerIcon"
import { PhoneIcon as PhoneIconSocial } from "@/components/icons/PhoneIcon"
import { TikTokIcon } from "@/components/icons/TikTokIcon"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { XIcon } from "@/components/icons/XIcon"
import { YouTubeIcon } from "@/components/icons/YouTubeIcon"
import { Dock, DockIcon, DockItem } from "@/components/ui/dock"
import { usePermissions } from "@/hooks/usePermissions"
import Link from "next/link"

const RESTAURANT_INFO = {
  name: "ChanthanaThaiCook",
  fullName: "CHANTHANA THAI COOK",
  phone: "+33749283707",
  phoneDisplay: "07 49 28 37 07",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=2+impasse+de+la+poste+37120+Marigny-Marmande",
}

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    url: "https://facebook.com/chanthanathaicook",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/chanthanathaicook",
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/33749283707",
  },
  {
    name: "TikTok",
    url: "#",
  },
  {
    name: "YouTube",
    url: "#",
  },
  {
    name: "Google Maps",
    url: RESTAURANT_INFO.googleMapsUrl,
  },
  {
    name: "Email",
    url: "mailto:contact@cthaicook.com",
  },
  {
    name: "Téléphone",
    url: `tel:${RESTAURANT_INFO.phone}`,
  },
  {
    name: "Messenger",
    url: "https://m.me/chanthanathaicook",
  },
  {
    name: "X",
    url: "#",
  },
]

// Navigation pour visiteurs non connectés (Ordre : Priorité Business)
const NAV_LINKS_GUEST: Array<{ label: string; href: string }> = [
  { label: "Accueil", href: "/" },
  { label: "Commander", href: "/commander" },
  { label: "Installer l'Application", href: "/#navigation-cards" },
  { label: "Événements", href: "/evenements" },
  { label: "Actualités", href: "/actualites" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact et Nous trouver", href: "/nous-trouver" },
]

// Navigation pour utilisateurs connectés (Ordre : Logique post-achat)
const NAV_LINKS_AUTH: Array<{ label: string; href: string }> = [
  { label: "Accueil", href: "/" },
  { label: "Commander", href: "/commander" },
  { label: "Suivi", href: "/historique" },
  { label: "Mon Profil", href: "/profil" },
  { label: "Événements", href: "/evenements" },
  { label: "Actualités", href: "/actualites" },
  { label: "À propos", href: "/a-propos" },
  { label: "Installer l'Application", href: "/#navigation-cards" },
  { label: "Contact et Nous trouver", href: "/nous-trouver" },
]

import { useEffect, useState } from "react"

export function RestaurantFooter() {
  const { isAuthenticated } = usePermissions()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Use guest links during SSR and initial client render to strictly match server HTML
  // Only switch to auth links after component has mounted on client
  const navLinks = isMounted && isAuthenticated ? NAV_LINKS_AUTH : NAV_LINKS_GUEST
  return (
    <footer className="w-full pb-20 lg:pb-0">
      {/* Bande verte avec navigation + réseaux sociaux - Cachée sur mobile */}
      <div className="bg-thai-green hidden w-full lg:block">
        <div className="w-full px-8 py-6">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => {
                const href = link.href as any
                return (
                  <Link
                    key={link.href}
                    href={href}
                    className="hover:text-thai-orange text-sm font-medium text-white/90 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Social Links */}
            <div className="flex w-full justify-center">
              <div className="flex flex-col gap-4 lg:flex-row">
                <Dock magnification={60} distance={150} className="px-0">
                  <DockItem href={SOCIAL_LINKS[0].url}>
                    <DockIcon>
                      <FacebookIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                  <DockItem href={SOCIAL_LINKS[1].url}>
                    <DockIcon>
                      <InstagramIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                  <DockItem href={SOCIAL_LINKS[2].url}>
                    <DockIcon>
                      <WhatsAppIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                  <DockItem href={SOCIAL_LINKS[3].url}>
                    <DockIcon>
                      <TikTokIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                  <DockItem href={SOCIAL_LINKS[4].url}>
                    <DockIcon>
                      <YouTubeIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                </Dock>
                <Dock magnification={60} distance={150} className="px-0">
                  <DockItem href={SOCIAL_LINKS[5].url}>
                    <DockIcon>
                      <GoogleMapsIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                  <DockItem href={SOCIAL_LINKS[6].url}>
                    <DockIcon>
                      <EmailIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                  <DockItem href={SOCIAL_LINKS[7].url}>
                    <DockIcon>
                      <PhoneIconSocial className="size-full" />
                    </DockIcon>
                  </DockItem>
                  <DockItem href={SOCIAL_LINKS[8].url}>
                    <DockIcon>
                      <MessengerIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                  <DockItem href={SOCIAL_LINKS[9].url}>
                    <DockIcon>
                      <XIcon className="size-full" />
                    </DockIcon>
                  </DockItem>
                </Dock>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section with WHITE background - Caché sur mobile */}
      <div className="relative z-50 hidden w-full border-t border-gray-100 bg-white lg:block">
        <div className="w-full px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
            <p>&copy; {RESTAURANT_INFO.fullName}. Tous droits réservés</p>
            <span className="text-gray-400">•</span>
            <Link
              href={"/mentions-legales" as any}
              className="hover:text-thai-orange whitespace-nowrap transition-colors"
            >
              Mentions légales
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href={"/confidentialite" as any}
              className="hover:text-thai-orange whitespace-nowrap transition-colors"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile CTA Bar removed - replaced by MobileNav */}
    </footer>
  )
}
