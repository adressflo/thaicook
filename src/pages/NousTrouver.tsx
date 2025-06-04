// src/pages/NousTrouver.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, MessageCircle, Navigation } from 'lucide-react'; // Ajout de Navigation pour les nouveaux boutons

const NousTrouver = () => {
  const address = "2 impasse de la poste, 37120 Marigny-Marmande, France";
  const encodedAddress = encodeURIComponent(address);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const wazeUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;

  const handleMessengerClick = () => {
    window.open('https://m.me/chanthanathaikok', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/33749283707', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl border-thai-orange/20 mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg py-6">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">Nous Trouver</CardTitle>
            </div>
            <p className="text-white/90 text-sm mt-1">
              Lundi, Mercredi, Vendredi, Samedi : 18h30 - 20h30<br />
              Sur commande uniquement
            </p>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <div className="mb-8">
              <iframe
                src={`https://maps.google.com/maps?q=${encodedAddress}&hl=fr&z=15&output=embed`} // URL mise à jour pour afficher directement l'adresse
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>

            {/* Liens Itinéraires */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Button 
                onClick={() => window.open(googleMapsUrl, '_blank')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Itinéraire avec Google Maps
              </Button>
              <Button 
                onClick={() => window.open(wazeUrl, '_blank')}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Itinéraire avec Waze
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* ... Informations Adresse, Téléphone, Email ... */}
                 <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-thai-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-thai-green mb-0.5">Adresse</h3>
                    <p className="text-sm text-thai-green/80">
                      2 impasse de la poste<br />
                      37120 Marigny-Marmande<br />
                      France
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-thai-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-thai-green mb-0.5">Téléphone</h3>
                    <p className="text-sm text-thai-green/80">07 49 28 37 07</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-thai-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-thai-green mb-0.5">Email</h3>
                    <p className="text-sm text-thai-green/80">chanthanacook@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-thai-green mb-3 text-lg">Contactez-nous directement</h3>
                <Button 
                  onClick={handleMessengerClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contactez-nous sur Messenger
                </Button>
                <Button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  <MessageCircle className="h-5 w-5 mr-2" /> 
                  Contactez-nous sur WhatsApp
                </Button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-thai-orange/20">
              <h3 className="text-xl font-semibold text-thai-green mb-3 text-center">Nos Horaires de Commande</h3>
              <p className="text-md text-thai-green/80 text-center">
                <strong>Lundi, Mercredi, Vendredi, Samedi :</strong> 18h30 - 20h30<br />
                <em>Uniquement sur commande. Prévoyez de commander à l'avance !</em>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NousTrouver;