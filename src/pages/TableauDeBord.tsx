// src/pages/TableauDeBord.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Calendar, MapPin, User, Users, History } from 'lucide-react';
import { memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const TableauDeBord = memo(() => {
  const { currentUser } = useAuth();

  const sections = [
    {
      title: 'Pour Commander',
      buttonTitle: 'Commander',
      description: 'Découvrez notre menu authentique et passez votre commande',
      image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop",
      link: "/commander",
      icon: Utensils
    },
    currentUser && {
      title: 'Suivi & historique',
      buttonTitle: 'Suivi & historique',
      description: 'Suivez vos commandes et votre historique',
      image: "/images/suivihistorique.png",
      link: "/historique",
      icon: History
    },
    {
      title: 'Nous Trouver',
      buttonTitle: 'Nous Trouver',
      description: 'Venez nous rendre visite à Marigny-Marmande',
      image: "/images/nous trouver.png",
      link: "/nous-trouver",
      icon: MapPin
    },
    {
      title: 'Pour vos Événements',
      buttonTitle: 'Événements',
      description: 'Organisez vos événements avec nos menus personnalisés',
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      link: "/evenements",
      icon: Calendar
    },
    {
      title: 'Mon Profil',
      buttonTitle: 'Mon Profil',
      description: 'Gérez vos informations personnelles et préférences',
      image: "/images/chanthana.png",
      link: "/profil",
      icon: User
    },
    {
      title: 'À propos de nous',
      buttonTitle: 'À Propos',
      description: 'Découvrez notre histoire et notre passion',
      image: "/images/apropos.jpeg",
      link: "/a-propos",
      icon: Users
    }
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-thai">
      {/* Section orange avec logo et phrase */}
      <section className="h-32 bg-gradient-to-r from-thai-orange to-thai-gold flex items-center justify-center px-4">
        <div className="flex items-center space-x-4 max-w-6xl mx-auto">
          <img 
            src="/images/logo.png" 
            alt="ChanthanaThaiCook Logo" 
            className="w-16 h-16 rounded-full object-contain flex-shrink-0"
          />
          <p className="text-white text-lg md:text-xl lg:text-2xl font-medium text-center whitespace-nowrap">
            Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande
          </p>
          <img 
            src="/images/logo.png" 
            alt="ChanthanaThaiCook Logo" 
            className="w-16 h-16 rounded-full object-contain flex-shrink-0"
          />
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sections.map((section, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-thai-orange/20 overflow-hidden flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <section.icon className="absolute top-4 right-4 h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <p className="text-thai-green/70 mb-4 flex-grow text-center">{section.description}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-thai-orange hover:bg-thai-orange hover:text-white w-full mt-auto group"
                  >
                    <Link
                      to={section.link}
                      className="text-thai-orange group-hover:text-white"
                    >
                      {section.buttonTitle}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section pour le sous-titre */}
      <section className="pt-0 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-thai-green/80 leading-relaxed italic">
              Découvrez notre cuisine thaïlandaise authentique d'Isan
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

TableauDeBord.displayName = 'TableauDeBord';

export default TableauDeBord;