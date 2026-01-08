"use client"

import { EmailIcon } from "@/components/icons/EmailIcon"
import { MessengerIcon } from "@/components/icons/MessengerIcon"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { AppLayout } from "@/components/layout/AppLayout"
import { VideoModalTrigger } from "@/components/shared/VideoModalTrigger"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, PanInfo } from "framer-motion"
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const dynamic = "force-dynamic"

export default function NousTrouverPage() {
  const router = useRouter()
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState(false)

  // Navigation par swipe (mobile uniquement)
  // Swipe droite → Accueil | Swipe gauche → Commander
  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 80
    if (info.offset.x > swipeThreshold) {
      router.push("/")
    } else if (info.offset.x < -swipeThreshold) {
      router.push("/commander")
    }
  }

  const address = "2 impasse de la poste, 37120 Marigny-Marmande, France"
  const encodedAddress = encodeURIComponent(address)

  // URL pour le bouton d'itinéraire Google Maps (ouvre Google Maps)
  const googleMapsDirectionUrl = `https://maps.google.com/?q=${encodedAddress}`
  // URL pour le bouton d'itinéraire Waze
  const wazeUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`
  // URL pour l'iframe Google Maps (carte intégrée)
  // IMPORTANT : N'oubliez pas de remplacer VOTRE_CLE_API_GOOGLE_MAPS par votre véritable clé API.
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&hl=fr&z=15&output=embed&key=VOTRE_CLE_API_GOOGLE_MAPS`

  const handleMessengerClick = () => {
    window.open("https://m.me/chanthanathaikok", "_blank")
  }

  const handleWhatsAppClick = () => {
    // Assurez-vous que le numéro est au format international sans '+' ni '00' au début pour wa.me
    // Assurez-vous que le numéro est au format international sans '+' nor '00' au début pour wa.me
    const whatsappNumber = "33749283707"
    window.open(`https://wa.me/${whatsappNumber}`, "_blank")
  }

  return (
    <AppLayout>
      <motion.div
        className="bg-gradient-thai min-h-screen w-full pt-2 pb-4 sm:py-8"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={onDragEnd}
      >
        <div className="mx-auto w-full max-w-4xl sm:px-4">
          {/* Boutons navigation : Retour et Commander (Masqués sur mobile) */}
          <div className="mb-6 hidden items-center justify-between sm:flex">
            <Link href="/" passHref>
              <Button
                variant="outline"
                size="sm"
                className="border-thai-green/50 text-thai-green hover:bg-thai-green/10 hover:text-thai-green hover:border-thai-green group inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-base font-bold shadow-sm transition-all hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Retour Accueil</span>
                <span className="sm:hidden">Retour</span>
              </Button>
            </Link>

            <Link href="/commander" passHref>
              <Button
                size="sm"
                className="bg-thai-orange hover:bg-thai-orange/90 group rounded-full px-6 py-2 text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <ShoppingBag className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                <span>Commander</span>
              </Button>
            </Link>
          </div>

          {/* Bloc 1: Header (Image + Titre) */}
          <Card className="border-thai-orange/20 animate-fade-in mb-4 overflow-hidden rounded-none border-x-0 shadow-sm sm:mb-6 sm:rounded-xl sm:border-x sm:shadow-xl">
            <CardHeader className="bg-white/50 p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
                <VideoModalTrigger
                  imageSrc="/media/nous-trouver/exploratrice.svg"
                  videoSrc="/media/nous-trouver/exploratrice2.mp4"
                  alt="Nous Trouver"
                  title="Vidéo de présentation : Où nous trouver"
                  imageClassName="h-32 w-48 rounded-lg"
                />

                <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center gap-3 md:justify-start">
                    <MapPin className="text-thai-orange h-8 w-8 animate-bounce" />
                    <CardTitle className="text-thai-green text-3xl font-bold">
                      Nous Trouver
                    </CardTitle>
                  </div>
                  <CardDescription className="text-lg text-gray-600">
                    2 impasse de la poste, 37120 Marigny Marmande
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {/* BLOC 1 : LOCALISATION (Carte 100% + Barre d'Actions) */}
            <div className="border-thai-orange/20 flex flex-col border-t">
              {/* Section Carte (100% largeur) */}
              <div className="relative min-h-[400px]">
                {/* État de chargement */}
                {mapLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="text-thai-orange h-8 w-8 animate-spin" />
                      <p className="text-sm text-gray-600">Chargement de la carte...</p>
                    </div>
                  </div>
                )}

                {/* État d'erreur */}
                {mapError && (
                  <div className="flex h-full flex-col items-center justify-center bg-orange-50 p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-orange-500" />
                    <p className="mb-4 text-orange-700">Impossible de charger la carte.</p>
                    <Button
                      onClick={() => window.open(googleMapsDirectionUrl, "_blank")}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ouvrir dans Google Maps
                    </Button>
                  </div>
                )}

                {/* Carte */}
                {!mapError && (
                  <iframe
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full"
                    title="Carte de localisation Chanthanacook"
                    onLoad={() => setMapLoading(false)}
                    onError={() => {
                      setMapLoading(false)
                      setMapError(true)
                    }}
                  />
                )}
              </div>

              {/* Barre d'Actions (Itinéraires + Téléphone) */}
              <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  {/* Google Maps */}
                  <Button
                    onClick={() => window.open(googleMapsDirectionUrl, "_blank")}
                    className="group w-full rounded-lg bg-blue-500 py-6 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
                  >
                    <Navigation className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="text-base font-medium">Google Maps</span>
                  </Button>

                  {/* Waze */}
                  <Button
                    onClick={() => window.open(wazeUrl, "_blank")}
                    className="group w-full rounded-lg bg-cyan-500 py-6 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-cyan-600 hover:shadow-lg"
                  >
                    <Navigation className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="text-base font-medium">Waze</span>
                  </Button>

                  {/* Téléphone */}
                  <Button
                    onClick={() => window.open("tel:0749283707", "_blank")}
                    className="bg-thai-orange hover:bg-thai-orange/90 group w-full rounded-lg py-6 text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <Phone className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="text-base font-medium">Appeler</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* BLOC 2 : ACTION (Séparé en 2 Cartes, empilées verticalement) */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6">
            {/* Carte Horaires */}
            <Card className="border-thai-orange/20 animate-fade-in overflow-hidden rounded-none border-x-0 shadow-sm sm:rounded-xl sm:border-x sm:shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-center gap-6 text-center">
                  {/* Image cliquable */}
                  <VideoModalTrigger
                    imageSrc="/media/statut/enattentedeconfirmation/enattentedeconfirmation.svg"
                    videoSrc="/media/statut/enattentedeconfirmation/enattentemontre.mp4"
                    alt="Horaires"
                    title="Nos Horaires"
                    imageClassName="h-24 w-36 rounded-lg"
                  />

                  {/* Infos horaires */}
                  <div className="space-y-3">
                    <h3 className="text-thai-green text-2xl font-bold md:text-3xl">
                      Nos Horaires d'Ouverture
                    </h3>
                    <p className="text-thai-green text-lg font-medium">
                      📅 Lundi • Mercredi • Vendredi • Samedi
                    </p>
                    <p className="text-thai-orange text-3xl font-bold">🕕 18h00 - 20h30</p>
                  </div>

                  {/* Message subtil */}
                  <p className="text-thai-green/60 text-sm italic">
                    Sur commande uniquement • Pensez à commander à l'avance 🙏
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Carte Contact */}
            <Card className="border-thai-orange/20 animate-fade-in overflow-hidden rounded-none border-x-0 shadow-sm sm:rounded-xl sm:border-x sm:shadow-xl">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-thai-green mb-6 text-center text-xl font-semibold md:text-left">
                  💬 Contactez-nous
                </h3>
                {/* Grille de boutons minimalistes (3 colonnes sur desktop) */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Messenger */}
                  <button
                    onClick={handleMessengerClick}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:border-[#0084FF]/50 hover:shadow-md"
                  >
                    <MessengerIcon className="h-10 w-10 transition-transform group-hover:scale-110" />
                    <span className="text-thai-green text-sm font-medium">Messenger</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppClick}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:border-[#25D366]/50 hover:shadow-md"
                  >
                    <WhatsAppIcon className="h-10 w-10 transition-transform group-hover:scale-110" />
                    <span className="text-thai-green text-sm font-medium">WhatsApp</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => window.open("mailto:chanthanacook@gmail.com", "_blank")}
                    className="group hover:border-thai-orange/50 flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <EmailIcon className="h-10 w-10 transition-transform group-hover:scale-110" />
                    <span className="text-thai-green text-sm font-medium">Email</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bouton Commander Mobile */}
          <div className="flex justify-center pt-4 pb-8 sm:hidden">
            <Link href="/commander">
              <span className="bg-thai-orange hover:bg-thai-orange/90 inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
                <ShoppingBag className="mr-3 h-6 w-6" />
                Commander maintenant
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  )
}
