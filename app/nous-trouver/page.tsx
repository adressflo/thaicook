"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { VideoModalTrigger } from "@/components/shared/VideoModalTrigger"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export const dynamic = "force-dynamic"

export default function NousTrouverPage() {
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState(false)

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
      <div className="bg-gradient-thai min-h-screen w-full pt-2 pb-4 sm:py-8">
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

          {/* BLOC 2 : ACTION (Séparé en 2 Cartes) */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6 lg:grid-cols-2">
            {/* Carte Horaires */}
            <Card className="border-thai-orange/20 animate-fade-in overflow-hidden rounded-none border-x-0 shadow-sm sm:rounded-xl sm:border-x sm:shadow-xl">
              <CardContent className="flex h-full flex-col justify-center p-6">
                <div className="mx-auto w-full max-w-lg text-center md:text-left">
                  <div className="mb-6 flex items-center justify-center md:justify-start">
                    <VideoModalTrigger
                      imageSrc="/media/statut/enattentedeconfirmation/enattentedeconfirmation.svg"
                      videoSrc="/media/statut/enattentedeconfirmation/enattentemontre.mp4"
                      alt="Horaires"
                      title="Nos Horaires"
                      className="mr-3 h-12 w-12"
                      imageClassName="h-full w-full rounded-lg object-cover"
                    />
                    <h3 className="text-thai-green text-xl font-semibold">
                      Nos Horaires de Commande
                    </h3>
                  </div>

                  <div className="from-thai-orange/10 to-thai-gold/10 border-thai-orange/20 rounded-xl border bg-linear-to-r p-6">
                    <div className="space-y-3">
                      <div className="text-thai-green text-lg font-semibold">
                        Lundi • Mercredi • Vendredi • Samedi
                      </div>
                      <div className="text-thai-orange text-2xl font-bold">18h00 - 20h30</div>
                      <div className="text-thai-green/70 text-sm italic">
                        Sur commande uniquement
                      </div>
                    </div>

                    <div className="border-thai-orange/20 mt-4 border-t pt-4">
                      <p className="text-thai-green/60 text-xs">
                        💡 Conseil : Commandez à l'avance pour garantir la disponibilité
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte Contact */}
            <Card className="border-thai-orange/20 animate-fade-in overflow-hidden rounded-none border-x-0 shadow-sm sm:rounded-xl sm:border-x sm:shadow-xl">
              <CardContent className="flex h-full flex-col justify-center p-6">
                <h3 className="text-thai-green mb-6 text-center text-xl font-semibold md:text-left">
                  💬 Contactez-nous
                </h3>
                <div className="flex flex-col space-y-3">
                  {/* Messenger */}
                  <Button
                    onClick={handleMessengerClick}
                    className="group w-full rounded-lg bg-[#0084FF] py-6 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#0073E0] hover:shadow-lg"
                  >
                    <MessageCircle className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                    <div className="flex flex-col text-left">
                      <span className="text-lg font-semibold">Messenger</span>
                      <span className="text-xs opacity-90">Réponse rapide</span>
                    </div>
                    <ExternalLink className="ml-auto h-5 w-5 opacity-70" />
                  </Button>

                  {/* WhatsApp */}
                  <Button
                    onClick={handleWhatsAppClick}
                    className="group w-full rounded-lg bg-[#25D366] py-6 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#1EBE54] hover:shadow-lg"
                  >
                    <svg
                      className="mr-3 h-6 w-6 fill-current transition-transform group-hover:scale-110"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2 22L7.32 20.59C8.73 21.33 10.34 21.76 12.04 21.76C17.5 21.76 21.95 17.31 21.95 11.85C21.95 6.39 17.5 2 12.04 2ZM12.04 20.01C10.56 20.01 9.15 19.63 7.96 18.97L7.62 18.78L4.77 19.57L5.58 16.8L5.37 16.46C4.62 15.13 4.18 13.57 4.18 11.91C4.18 7.52 7.73 3.97 12.04 3.97C16.35 3.97 19.9 7.52 19.9 11.85C19.9 16.18 16.35 19.73 12.04 20.01V20.01ZM17.24 14.44C17.03 14.33 15.89 13.78 15.69 13.7C15.48 13.62 15.33 13.57 15.17 13.82C15.02 14.06 14.51 14.68 14.36 14.84C14.21 14.99 14.06 15.02 13.82 14.91C13.57 14.8 12.68 14.48 11.62 13.54C10.79 12.82 10.24 11.93 10.09 11.69C9.94 11.44 10.07 11.31 10.19 11.19C10.3 11.08 10.43 10.89 10.58 10.73C10.73 10.58 10.78 10.46 10.88 10.26C10.98 10.07 10.93 9.92 10.88 9.81C10.83 9.71 10.33 8.46 10.13 7.96C9.94 7.47 9.75 7.52 9.62 7.52C9.51 7.52 9.36 7.52 9.21 7.52C9.06 7.52 8.8 7.57 8.59 7.81C8.39 8.06 7.88 8.56 7.88 9.71C7.88 10.86 8.61 11.93 8.73 12.08C8.85 12.23 10.33 14.48 12.57 15.38C13.32 15.68 13.87 15.86 14.27 15.96C14.86 16.09 15.33 16.04 15.69 15.96C16.09 15.88 17.03 15.33 17.24 15.22C17.45 15.11 17.45 14.99 17.42 14.91C17.39 14.83 17.24 14.78 17.24 14.44V14.44Z" />
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-lg font-semibold">WhatsApp</span>
                      <span className="text-xs opacity-90">07 49 28 37 07</span>
                    </div>
                    <ExternalLink className="ml-auto h-5 w-5 opacity-70" />
                  </Button>

                  {/* Email */}
                  <Button
                    onClick={() => window.open("mailto:chanthanacook@gmail.com", "_blank")}
                    className="group w-full rounded-lg bg-gray-700 py-6 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:shadow-lg"
                  >
                    <Mail className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                    <div className="flex flex-col text-left">
                      <span className="text-lg font-semibold">Email</span>
                      <span className="text-sm opacity-90">chanthanacook@gmail.com</span>
                    </div>
                    <ExternalLink className="ml-auto h-5 w-5 opacity-70" />
                  </Button>
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
      </div>
    </AppLayout>
  )
}
