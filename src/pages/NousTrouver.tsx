
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

const NousTrouver = () => {
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
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">Nous Trouver</CardTitle>
            </div>
            <p className="text-white/90">
              Venez découvrir nos saveurs authentiques
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Google Maps */}
            <div className="mb-8">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaN8Gx1DKo&q=2+impasse+de+la+poste+37120+Marigny+Marmande+France"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-thai-green mb-1">Adresse</h3>
                    <p className="text-thai-green/70">
                      2 impasse de la poste<br />
                      37120 Marigny-Marmande<br />
                      France
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-thai-green mb-1">Téléphone</h3>
                    <p className="text-thai-green/70">07 49 28 37 07</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-thai-green mb-1">Email</h3>
                    <p className="text-thai-green/70">chanthanacook@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-thai-green mb-4">Contactez-nous</h3>
                
                <Button 
                  onClick={handleMessengerClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Messenger
                </Button>
                
                <Button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="mt-8 bg-thai-cream/30 p-6 rounded-lg">
              <h3 className="font-semibold text-thai-green mb-4">Horaires d'ouverture</h3>
              <p className="text-thai-green/80">
                <strong>Lundi, Mercredi, Vendredi, Samedi :</strong> 18h30 - 20h30<br />
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
