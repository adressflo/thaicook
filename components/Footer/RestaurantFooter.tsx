'use client'

import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/usePermissions'
import { Dock, DockItem, DockIcon } from '@/components/ui/dock'
import { FacebookIcon } from '@/components/icons/FacebookIcon'
import { InstagramIcon } from '@/components/icons/InstagramIcon'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { TikTokIcon } from '@/components/icons/TikTokIcon'
import { YouTubeIcon } from '@/components/icons/YouTubeIcon'
import { GoogleMapsIcon } from '@/components/icons/GoogleMapsIcon'
import { EmailIcon } from '@/components/icons/EmailIcon'
import { PhoneIcon as PhoneIconSocial } from '@/components/icons/PhoneIcon'
import { MessengerIcon } from '@/components/icons/MessengerIcon'
import { XIcon } from '@/components/icons/XIcon'

const RESTAURANT_INFO = {
  name: 'ChanthanaThaiCook',
  fullName: 'CHANTHANA THAI COOK',
  phone: '+33749283707',
  phoneDisplay: '07 49 28 37 07',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=2+impasse+de+la+poste+37120+Marigny-Marmande',
}

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/chanthanathaicook',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/chanthanathaicook',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/33749283707',
  },
  {
    name: 'TikTok',
    url: '#',
  },
  {
    name: 'YouTube',
    url: '#',
  },
  {
    name: 'Google Maps',
    url: RESTAURANT_INFO.googleMapsUrl,
  },
  {
    name: 'Email',
    url: 'mailto:contact@cthaicook.com',
  },
  {
    name: 'Téléphone',
    url: `tel:${RESTAURANT_INFO.phone}`,
  },
  {
    name: 'Messenger',
    url: 'https://m.me/chanthanathaicook',
  },
  {
    name: 'X',
    url: '#',
  },
]

// Navigation pour visiteurs non connectés (Ordre : Priorité Business)
const NAV_LINKS_GUEST: Array<{ label: string; href: string }> = [
  { label: 'Accueil', href: '/' },
  { label: 'Commander', href: '/commander' },
  { label: 'Installer l\'Application', href: '/#navigation-cards' },
  { label: 'Événements', href: '/evenements' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact et Nous trouver', href: '/nous-trouver' },
]

// Navigation pour utilisateurs connectés (Ordre : Logique post-achat)
const NAV_LINKS_AUTH: Array<{ label: string; href: string }> = [
  { label: 'Accueil', href: '/' },
  { label: 'Commander', href: '/commander' },
  { label: 'Suivi', href: '/suivi' },
  { label: 'Mon Profil', href: '/profil' },
  { label: 'Événements', href: '/evenements' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Installer l\'Application', href: '/#navigation-cards' },
  { label: 'Contact et Nous trouver', href: '/nous-trouver' },
]

export function RestaurantFooter() {
  const { isAuthenticated } = usePermissions()
  const navLinks = isAuthenticated ? NAV_LINKS_AUTH : NAV_LINKS_GUEST
  return (
    <footer className="w-full">
      {/* Bande verte avec navigation + réseaux sociaux */}
      <div className="w-full bg-thai-green">
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
                    className="text-sm text-white/90 hover:text-thai-orange transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Social Links */}
            <div className="w-full flex justify-center">
              <div className="flex flex-col lg:flex-row gap-4">
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

      {/* Copyright section with WHITE background */}
      <div className="w-full bg-white border-t border-gray-100 relative z-50">
        <div className="w-full px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
            <p>&copy; {RESTAURANT_INFO.fullName}. Tous droits réservés</p>
            <span className="text-gray-400">•</span>
            <Link
              href={'/mentions-legales' as any}
              className="hover:text-thai-orange transition-colors whitespace-nowrap"
            >
              Mentions légales
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href={'/confidentialite' as any}
              className="hover:text-thai-orange transition-colors whitespace-nowrap"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile CTA Bar (hidden on desktop) */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 lg:hidden z-50">
        <div className="w-full flex gap-2 px-3 xs:px-4 sm:px-6 py-3">
          <Button
            asChild
            size="sm"
            className="flex-1 rounded-lg bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg"
          >
            <a href={`tel:${RESTAURANT_INFO.phone}`} className="flex items-center justify-center">
              <Phone className="h-4 w-4 sm:mr-1" />
              <span className="hidden xs:inline ml-1">Appeler</span>
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 rounded-lg border-thai-green/30 hover:bg-thai-green/10"
          >
            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <MapPin className="h-4 w-4 sm:mr-1" />
              <span className="hidden xs:inline ml-1">Localiser</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
