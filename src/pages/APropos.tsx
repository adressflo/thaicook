
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, Utensils, Calendar } from 'lucide-react';

const APropos = () => {
  const features = [
    {
      title: "Cuisine Authentique",
      description: "Des recettes traditionnelles thaïlandaises préparées avec amour et des ingrédients frais",
      icon: Heart
    },
    {
      title: "Commande Facile",
      description: "Commandez vos plats préférés en quelques clics pour une récupération rapide",
      icon: Utensils
    },
    {
      title: "Événements Spéciaux",
      description: "Organisez vos événements avec nos menus personnalisés pour groupes",
      icon: Calendar
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/62d46b15-aa56-45d2-ab7d-75dfee70f70d.png" 
            alt="Chanthana Thai Cook Logo"
            className="w-32 h-32 mx-auto mb-6 rounded-full shadow-xl"
          />
          <h1 className="text-4xl font-bold text-thai-green mb-4">ChanthanaThaiCook</h1>
          <p className="text-xl text-thai-green/80 mb-8">
            Découvrez l'art culinaire thaïlandais authentique. Des saveurs traditionnelles 
            préparées avec passion pour éveiller vos sens.
          </p>
          
          {/* Social Media Buttons */}
          <div className="flex justify-center space-x-4 mb-12">
            <Button variant="outline" className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white">
              Facebook
            </Button>
            <Button variant="outline" className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white">
              Instagram
            </Button>
          </div>
        </div>

        {/* Pourquoi Choisir ChanthanaThaiCook */}
        <Card className="shadow-xl border-thai-orange/20 mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-thai-green mb-4">
                Pourquoi Choisir ChanthanaThaiCook ?
              </h2>
              <p className="text-xl text-thai-green/70">
                Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <feature.icon className="h-12 w-12 text-thai-orange mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-thai-green mb-3">{feature.title}</h3>
                  <p className="text-thai-green/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chanthana Thai Cook Section */}
        <Card className="shadow-xl border-thai-orange/20 mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-thai-green mb-6">CHANTHANA THAI COOK</h2>
                <p className="text-lg text-thai-green/80 leading-relaxed text-justify">
                  J'ai quitté la Thaïlande pour m'installer en France par amour depuis 2002. Par amour pour ma famille, 
                  pour mon pays natal et surtout par passion pour la cuisine thaïlandaise, mon souhait est de vous faire 
                  découvrir la culture et la diversité des saveurs de la Thaïlande. Mon art originaire d'Isan, la région 
                  authentique Thaï qui garde ses secrets. Découvrez la véritable cuisine thaïlandaise.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/ac918784-d65c-427a-9316-7598173177dd.png" 
                  alt="Chanthana en cuisine"
                  className="w-80 h-80 object-cover rounded-full shadow-2xl border-4 border-thai-orange/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuisine Thaï Section */}
        <Card className="shadow-xl border-thai-orange/20">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-thai-green mb-6 text-center">CUISINE THAÏ</h2>
            <p className="text-lg text-thai-green/80 leading-relaxed text-justify">
              La cuisine thaïlandaise est réputée dans le monde entier pour la maîtrise de l'équilibre des saveurs. 
              L'art du mariage du sucré, de l'aigre-doux, du salé et du piquant donne des plats d'une saveur étonnante. 
              Savourez des repas thaïlandais typiquement authentiques mixant une diversité d'ingrédients du riz, du poisson, 
              du poulet, des salades, des légumes et parfois même du porc ou du bœuf. Je propose des menus complets à emporter 
              et autres délices qui se renouvellent chaque semaine. Partez à la découverte de ces plats authentiques et 
              laissez-vous surprendre en les commandant.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APropos;
