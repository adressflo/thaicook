// src/pages/NousTrouver.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, MessageCircle, Navigation } from 'lucide-react';

const NousTrouver = () => {
  const address = "2 impasse de la poste, 37120 Marigny-Marmande, France";
  const encodedAddress = encodeURIComponent(address);

  // URL pour le bouton d'itinéraire Google Maps (ouvre Google Maps)
  const googleMapsDirectionUrl = `https://maps.google.com/?q=${encodedAddress}`;
  // URL pour le bouton d'itinéraire Waze
  const wazeUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;
  // URL pour l'iframe Google Maps (carte intégrée)
  // IMPORTANT: N'oubliez pas de remplacer VOTRE_CLE_API_GOOGLE_MAPS par votre véritable clé API.
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&hl=fr&z=15&output=embed&key=VOTRE_CLE_API_GOOGLE_MAPS`;


  const handleMessengerClick = () => {
    window.open('https://m.me/chanthanathaikok', '_blank');
  };

  const handleWhatsAppClick = () => {
    // Assurez-vous que le numéro est au format international sans '+' ni '00' au début pour wa.me
    const whatsappNumber = "33749283707"; 
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl border-thai-orange/20 mb-8 overflow-hidden"> {/* Ajout de overflow-hidden pour les coins arrondis du header */}
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white py-6">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">Nous Trouver</CardTitle>
            </div>
            <p className="text-white/90 text-sm mt-1">
              2 impasse de la poste<br />
              37120 Marigny Marmande
            </p>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            {/* Liens Itinéraires - MAINTENANT AU-DESSUS DE LA CARTE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Button 
                onClick={() => window.open(googleMapsDirectionUrl, '_blank')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md shadow-md transition-transform hover:scale-105"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Itinéraire Google Maps
              </Button>
              <Button 
                onClick={() => window.open(wazeUrl, '_blank')}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-md shadow-md transition-transform hover:scale-105"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Itinéraire Waze
              </Button>
            </div>

            {/* Carte Google Maps intégrée */}
            <div className="mb-8">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="350" // Vous pouvez ajuster cette hauteur
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
                title="Carte de localisation Chanthanacook"
              ></iframe>
               
               
              
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6"> {/* Ajustement du gap */}
              <div className="space-y-6">
                {/* Informations Adresse, Téléphone, Email */}
                <div className="flex items-start space-x-3"> {/* Ajustement du space-x */}
                  <MapPin className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" /> {/* Icône légèrement plus grande */}
                  <div>
                    <h3 className="font-semibold text-thai-green text-lg mb-0.5">Adresse</h3> {/* Taille de police ajustée */}
                    <p className="text-sm text-thai-green/80">
                      2 impasse de la poste<br />
                      37120 Marigny-Marmande<br />
                      France
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-thai-green text-lg mb-0.5">Téléphone</h3>
                    <a 
                      href="tel:+33749283707" 
                      className="text-sm text-thai-orange hover:underline hover:text-thai-orange-dark transition-colors"
                    >
                      07 49 28 37 07
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-thai-green text-lg mb-0.5">Email</h3>
                    <a 
                      href="mailto:chanthanacook@gmail.com" 
                      className="text-sm text-thai-orange hover:underline hover:text-thai-orange-dark transition-colors break-all" // break-all pour les emails longs
                    >
                      chanthanacook@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-thai-green text-lg mb-3">Contactez-nous directement</h3>
                <Button 
                  onClick={handleMessengerClick}
                  className="w-full bg-[#0084FF] hover:bg-[#0073E0] text-white py-3 rounded-md shadow-md transition-transform hover:scale-105" // Couleur Messenger
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contactez-nous sur Messenger
                </Button>
                <Button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE54] text-white py-3 rounded-md shadow-md transition-transform hover:scale-105" // Couleur WhatsApp
                >
                  <svg className="h-5 w-5 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2 22L7.32 20.59C8.73 21.33 10.34 21.76 12.04 21.76C17.5 21.76 21.95 17.31 21.95 11.85C21.95 6.39 17.5 2 12.04 2ZM12.04 20.01C10.56 20.01 9.15 19.63 7.96 18.97L7.62 18.78L4.77 19.57L5.58 16.8L5.37 16.46C4.62 15.13 4.18 13.57 4.18 11.91C4.18 7.52 7.73 3.97 12.04 3.97C16.35 3.97 19.9 7.52 19.9 11.85C19.9 16.18 16.35 19.73 12.04 20.01V20.01ZM17.24 14.44C17.03 14.33 15.89 13.78 15.69 13.7C15.48 13.62 15.33 13.57 15.17 13.82C15.02 14.06 14.51 14.68 14.36 14.84C14.21 14.99 14.06 15.02 13.82 14.91C13.57 14.8 12.68 14.48 11.62 13.54C10.79 12.82 10.24 11.93 10.09 11.69C9.94 11.44 10.07 11.31 10.19 11.19C10.3 11.08 10.43 10.89 10.58 10.73C10.73 10.58 10.78 10.46 10.88 10.26C10.98 10.07 10.93 9.92 10.88 9.81C10.83 9.71 10.33 8.46 10.13 7.96C9.94 7.47 9.75 7.52 9.62 7.52C9.51 7.52 9.36 7.52 9.21 7.52C9.06 7.52 8.8 7.57 8.59 7.81C8.39 8.06 7.88 8.56 7.88 9.71C7.88 10.86 8.61 11.93 8.73 12.08C8.85 12.23 10.33 14.48 12.57 15.38C13.32 15.68 13.87 15.86 14.27 15.96C14.86 16.09 15.33 16.04 15.69 15.96C16.09 15.88 17.03 15.33 17.24 15.22C17.45 15.11 17.45 14.99 17.42 14.91C17.39 14.83 17.24 14.78 17.24 14.44V14.44Z"/></svg> {/* Icône WhatsApp SVG */}
                  Contactez-nous sur WhatsApp
                </Button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-thai-orange/20">
              <h3 className="text-xl font-semibold text-thai-green mb-3 text-center">Nos Horaires de Commande</h3>
              <p className="text-md text-thai-green/80 text-center">
                <strong>Lundi, Mercredi, Vendredi, Samedi : </strong>18h00 - 20h30<br />
                <em>Sur commande uniquement</em>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NousTrouver;

