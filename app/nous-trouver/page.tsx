'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, MessageCircle, Navigation, Home, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function NousTrouverPage() {
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  
  const address = '2 impasse de la poste, 37120 Marigny-Marmande, France';
  const encodedAddress = encodeURIComponent(address);

  // URL pour le bouton d'itinéraire Google Maps (ouvre Google Maps)
  const googleMapsDirectionUrl = `https://maps.google.com/?q=${encodedAddress}`;
  // URL pour le bouton d'itinéraire Waze
  const wazeUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;
  // URL pour l'iframe Google Maps (carte intégrée)
  // IMPORTANT : N'oubliez pas de remplacer VOTRE_CLE_API_GOOGLE_MAPS par votre véritable clé API.
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&hl=fr&z=15&output=embed&key=VOTRE_CLE_API_GOOGLE_MAPS`;

  const handleMessengerClick = () => {
    window.open('https://m.me/chanthanathaikok', '_blank');
  };

  const handleWhatsAppClick = () => {
    // Assurez-vous que le numéro est au format international sans '+' ni '00' au début pour wa.me
    const whatsappNumber = '33749283707';
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Bouton retour optimisé - même style que page profil */}
          <div className="mb-6 flex justify-start">
            <Link href="/" passHref>
              <Button 
                variant="outline" 
                size="sm"
                className="
                  bg-white/90 backdrop-blur-sm hover:bg-white 
                  border-thai-orange/20 hover:border-thai-orange/40
                  text-thai-green hover:text-thai-green 
                  transition-all duration-200 
                  shadow-md hover:shadow-lg
                  rounded-full px-4 py-2
                  group
                "
              >
                <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Retour à l'accueil</span>
                <span className="sm:hidden">Accueil</span>
              </Button>
            </Link>
          </div>
          
          <Card className="shadow-xl border-thai-orange/20 mb-8 overflow-hidden animate-fade-in">
            <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white py-6">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-8 w-8 mr-2" />
                <CardTitle className="text-3xl font-bold">
                  Nous Trouver
                </CardTitle>
              </div>
              <p className="text-white/90 text-sm mt-1">
                2 impasse de la poste
                <br />
                37120 Marigny Marmande
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 md:p-8">
              {/* Section Itinéraires optimisée */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-thai-green mb-4 text-center">
                  🗺️ Obtenir un itinéraire
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button
                    onClick={() => window.open(googleMapsDirectionUrl, '_blank')}
                    className="
                      w-full bg-blue-500 hover:bg-blue-600 text-white 
                      py-3 rounded-lg shadow-md 
                      transition-all duration-200 hover:scale-105 hover:shadow-lg
                      group
                    "
                  >
                    <Navigation className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm sm:text-base">Google Maps</span>
                    <ExternalLink className="h-3 w-3 ml-2 opacity-70" />
                  </Button>
                  <Button
                    onClick={() => window.open(wazeUrl, '_blank')}
                    className="
                      w-full bg-cyan-500 hover:bg-cyan-600 text-white 
                      py-3 rounded-lg shadow-md 
                      transition-all duration-200 hover:scale-105 hover:shadow-lg
                      group
                    "
                  >
                    <Navigation className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm sm:text-base">Waze</span>
                    <ExternalLink className="h-3 w-3 ml-2 opacity-70" />
                  </Button>
                </div>
              </div>

              {/* Carte Google Maps intégrée avec états de chargement */}
              <div className="mb-8">
                <div className="relative">
                  <h3 className="text-lg font-semibold text-thai-green mb-4 text-center">
                    📍 Notre localisation
                  </h3>
                  
                  {/* État de chargement */}
                  {mapLoading && (
                    <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-thai-orange" />
                        <p className="text-sm text-gray-600">Chargement de la carte...</p>
                      </div>
                    </div>
                  )}

                  {/* État d'erreur */}
                  {mapError && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                      <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                      <p className="text-orange-700 mb-4">
                        Impossible de charger la carte. 
                      </p>
                      <Button
                        onClick={() => window.open(googleMapsDirectionUrl, '_blank')}
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ouvrir dans Google Maps
                      </Button>
                    </div>
                  )}

                  {/* Carte */}
                  {!mapError && (
                    <iframe
                      src={googleMapsEmbedUrl}
                      width="100%"
                      height="350"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg shadow-lg w-full"
                      title="Carte de localisation Chanthanacook"
                      onLoad={() => setMapLoading(false)}
                      onError={() => {
                        setMapLoading(false);
                        setMapError(true);
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-8">
                {/* Informations de contact */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center md:justify-start mb-6">
                    <img 
                      src="/logo.ico" 
                      alt="Chanthana Thai Cook" 
                      className="w-8 h-8 mr-3"
                    />
                    <h3 className="text-xl font-semibold text-thai-green">
                      Nos coordonnées
                    </h3>
                  </div>
                  
                  {/* Adresse */}
                  <div className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-thai-cream/30 transition-all duration-200">
                    <div className="p-2 bg-thai-orange/10 rounded-full group-hover:bg-thai-orange/20 transition-colors">
                      <MapPin className="w-5 h-5 text-thai-orange" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-thai-green text-lg mb-1">
                        Adresse
                      </h4>
                      <p className="text-sm text-thai-green/80 leading-relaxed">
                        2 impasse de la poste
                        <br />
                        37120 Marigny-Marmande
                        <br />
                        France
                      </p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-thai-cream/30 transition-all duration-200">
                    <div className="p-2 bg-thai-orange/10 rounded-full group-hover:bg-thai-orange/20 transition-colors">
                      <Phone className="w-5 h-5 text-thai-orange" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-thai-green text-lg mb-1">
                        Téléphone
                      </h4>
                      <a
                        href="tel:+33749283707"
                        className="text-base text-thai-orange hover:text-thai-orange-dark transition-colors font-medium hover:underline"
                      >
                        07 49 28 37 07
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-thai-cream/30 transition-all duration-200">
                    <div className="p-2 bg-thai-orange/10 rounded-full group-hover:bg-thai-orange/20 transition-colors">
                      <Mail className="w-5 h-5 text-thai-orange" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-thai-green text-lg mb-1">
                        Email
                      </h4>
                      <a
                        href="mailto:chanthanacook@gmail.com"
                        className="text-sm text-thai-orange hover:text-thai-orange-dark transition-colors hover:underline break-all"
                      >
                        chanthanacook@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                {/* Section contact direct */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-thai-green mb-6 text-center md:text-left">
                    💬 Contact direct
                  </h3>
                  
                  {/* Messenger */}
                  <Button
                    onClick={handleMessengerClick}
                    className="
                      w-full bg-[#0084FF] hover:bg-[#0073E0] text-white 
                      py-4 rounded-lg shadow-md 
                      transition-all duration-200 hover:scale-105 hover:shadow-lg
                      group
                    "
                  >
                    <MessageCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col text-left">
                      <span className="font-semibold">Messenger</span>
                      <span className="text-xs opacity-90">Réponse rapide</span>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto opacity-70" />
                  </Button>
                  
                  {/* WhatsApp */}
                  <Button
                    onClick={handleWhatsAppClick}
                    className="
                      w-full bg-[#25D366] hover:bg-[#1EBE54] text-white 
                      py-4 rounded-lg shadow-md 
                      transition-all duration-200 hover:scale-105 hover:shadow-lg
                      group
                    "
                  >
                    <svg
                      className="h-5 w-5 mr-3 fill-current group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2 22L7.32 20.59C8.73 21.33 10.34 21.76 12.04 21.76C17.5 21.76 21.95 17.31 21.95 11.85C21.95 6.39 17.5 2 12.04 2ZM12.04 20.01C10.56 20.01 9.15 19.63 7.96 18.97L7.62 18.78L4.77 19.57L5.58 16.8L5.37 16.46C4.62 15.13 4.18 13.57 4.18 11.91C4.18 7.52 7.73 3.97 12.04 3.97C16.35 3.97 19.9 7.52 19.9 11.85C19.9 16.18 16.35 19.73 12.04 20.01V20.01ZM17.24 14.44C17.03 14.33 15.89 13.78 15.69 13.7C15.48 13.62 15.33 13.57 15.17 13.82C15.02 14.06 14.51 14.68 14.36 14.84C14.21 14.99 14.06 15.02 13.82 14.91C13.57 14.8 12.68 14.48 11.62 13.54C10.79 12.82 10.24 11.93 10.09 11.69C9.94 11.44 10.07 11.31 10.19 11.19C10.3 11.08 10.43 10.89 10.58 10.73C10.73 10.58 10.78 10.46 10.88 10.26C10.98 10.07 10.93 9.92 10.88 9.81C10.83 9.71 10.33 8.46 10.13 7.96C9.94 7.47 9.75 7.52 9.62 7.52C9.51 7.52 9.36 7.52 9.21 7.52C9.06 7.52 8.8 7.57 8.59 7.81C8.39 8.06 7.88 8.56 7.88 9.71C7.88 10.86 8.61 11.93 8.73 12.08C8.85 12.23 10.33 14.48 12.57 15.38C13.32 15.68 13.87 15.86 14.27 15.96C14.86 16.09 15.33 16.04 15.69 15.96C16.09 15.88 17.03 15.33 17.24 15.22C17.45 15.11 17.45 14.99 17.42 14.91C17.39 14.83 17.24 14.78 17.24 14.44V14.44Z" />
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold">WhatsApp</span>
                      <span className="text-xs opacity-90">07 49 28 37 07</span>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto opacity-70" />
                  </Button>
                  
                </div>
              </div>

              {/* Section Horaires optimisée */}
              <div className="mt-12 pt-8 border-t border-thai-orange/20">
                <div className="text-center max-w-lg mx-auto">
                  <h3 className="text-xl font-semibold text-thai-green mb-6">
                    🕒 Nos Horaires de Commande
                  </h3>
                  
                  <div className="bg-gradient-to-r from-thai-orange/10 to-thai-gold/10 rounded-xl p-6 border border-thai-orange/20">
                    <div className="space-y-3">
                      <div className="text-lg font-semibold text-thai-green">
                        Lundi • Mercredi • Vendredi • Samedi
                      </div>
                      <div className="text-2xl font-bold text-thai-orange">
                        18h00 - 20h30
                      </div>
                      <div className="text-sm text-thai-green/70 italic">
                        Sur commande uniquement
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-thai-orange/20">
                      <p className="text-xs text-thai-green/60">
                        💡 Conseil : Commandez à l'avance pour garantir la disponibilité
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
