import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Utensils, Calendar, Home, Star, Users, Award } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À Propos - ChanthanaThaiCook',
  description: 'Découvrez l\'histoire de ChanthanaThaiCook, notre passion pour la cuisine thaïlandaise authentique et notre engagement envers l\'excellence culinaire.',
};

export default function AProposPage() {
  const features = [
    {
      title: 'Cuisine Authentique',
      description:
        'Des recettes traditionnelles thaïlandaises préparées avec amour et des ingrédients frais importés directement de Thaïlande',
      icon: Heart,
      color: 'from-thai-orange to-thai-gold',
    },
    {
      title: 'Commande Facile',
      description:
        'Commandez vos plats préférés en quelques clics pour une récupération rapide et une expérience sans stress',
      icon: Utensils,
      color: 'from-thai-green to-thai-orange',
    },
    {
      title: 'Événements Spéciaux',
      description:
        'Organisez vos événements avec nos menus personnalisés pour groupes et célébrations mémorables',
      icon: Calendar,
      color: 'from-thai-gold to-thai-green',
    },
    {
      title: 'Excellence Reconnue',
      description:
        'Plus de 20 ans d\'expérience culinaire avec une passion authentique pour la gastronomie thaïlandaise',
      icon: Award,
      color: 'from-thai-orange to-thai-red',
    },
  ];
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Bouton retour optimisé - même style que les autres pages */}
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
          {/* Header optimisé avec animations */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative mb-6">
              <img
                src="/logo.ico"
                alt="Chanthana Thai Cook Logo"
                className="w-40 h-40 md:w-48 md:h-48 mx-auto object-contain transition-transform duration-300 hover:scale-110 drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-thai-green mb-4">
              ChanthanaThaiCook
            </h1>
            <div className="flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-thai-gold mr-2" />
              <p className="text-xl text-thai-green/80">
                L'art culinaire thaïlandais authentique
              </p>
              <Star className="w-5 h-5 text-thai-gold ml-2" />
            </div>
            <p className="text-lg text-thai-green/70 mb-8 max-w-2xl mx-auto">
              Des saveurs traditionnelles préparées avec passion pour éveiller vos sens et vous transporter au cœur de la Thaïlande.
            </p>

            {/* Social Media Buttons améliorés */}
            <div className="flex justify-center space-x-4 mb-12">
              <Button
                variant="outline"
                className="
                  border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white
                  transition-all duration-200 hover:scale-105 hover:shadow-md
                  px-6 py-2 rounded-full
                "
                onClick={() => window.open('https://facebook.com/chanthanathaikok', '_blank')}
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                className="
                  border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white
                  transition-all duration-200 hover:scale-105 hover:shadow-md
                  px-6 py-2 rounded-full
                "
                onClick={() => window.open('https://instagram.com/chanthanathaikok', '_blank')}
              >
                Instagram
              </Button>
            </div>
          </div>

          {/* Statistiques impressionnantes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-thai-orange/20 hover:shadow-lg transition-all duration-200">
              <div className="text-2xl md:text-3xl font-bold text-thai-orange mb-1">20+</div>
              <div className="text-sm text-thai-green/70">Années d'expérience</div>
            </div>
            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-thai-orange/20 hover:shadow-lg transition-all duration-200">
              <div className="text-2xl md:text-3xl font-bold text-thai-orange mb-1">100%</div>
              <div className="text-sm text-thai-green/70">Authentique</div>
            </div>
            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-thai-orange/20 hover:shadow-lg transition-all duration-200">
              <div className="text-2xl md:text-3xl font-bold text-thai-orange mb-1">500+</div>
              <div className="text-sm text-thai-green/70">Clients satisfaits</div>
            </div>
            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-thai-orange/20 hover:shadow-lg transition-all duration-200">
              <div className="text-2xl md:text-3xl font-bold text-thai-orange mb-1">4.9⭐</div>
              <div className="text-sm text-thai-green/70">Note moyenne</div>
            </div>
          </div>

          {/* Pourquoi Choisir ChanthanaThaiCook */}
          <Card className="shadow-xl border-thai-orange/20 mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-thai-green/5 to-thai-orange/5">
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-thai-green mb-4">
                    🌟 Pourquoi Choisir ChanthanaThaiCook ?
                  </h2>
                  <p className="text-lg md:text-xl text-thai-green/70 max-w-3xl mx-auto">
                    Une expérience culinaire exceptionnelle qui vous transporte directement au cœur de la Thaïlande authentique
                  </p>
                </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                  // Définir les liens pour les cartes interactives
                  const getCardLink = (title: string) => {
                    if (title === 'Commande Facile') return '/commander';
                    if (title === 'Événements Spéciaux') return '/evenements';
                    return null;
                  };

                  const cardLink = getCardLink(feature.title);
                  const isClickable = cardLink !== null;

                  const cardContent = (
                    <div 
                      className={`
                        group text-center p-6 rounded-xl 
                        bg-gradient-to-br from-white to-thai-cream/30
                        border border-thai-orange/20
                        hover:shadow-lg hover:border-thai-orange/40
                        transition-all duration-300 hover:scale-105
                        animate-fade-in
                        ${isClickable ? 'cursor-pointer hover:shadow-xl' : ''}
                      `}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-thai-green mb-3 group-hover:text-thai-orange transition-colors duration-200">
                        {feature.title}
                        {isClickable && <span className="ml-2 text-thai-orange">→</span>}
                      </h3>
                      <p className="text-sm text-thai-green/70 leading-relaxed">{feature.description}</p>
                      {isClickable && (
                        <div className="mt-3 text-xs text-thai-orange/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Cliquez pour découvrir
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <div key={index}>
                      {isClickable ? (
                        <Link href={cardLink}>
                          {cardContent}
                        </Link>
                      ) : (
                        cardContent
                      )}
                    </div>
                  );
                })}
              </div>
              </CardContent>
            </div>
          </Card>

          {/* Chanthana Thai Cook Section optimisée */}
          <Card className="shadow-xl border-thai-orange/20 mb-8 overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-thai-orange/10 to-thai-gold/10 p-1">
              <CardContent className="p-6 md:p-8 bg-white rounded-lg">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="flex items-center mb-6">
                      <Users className="w-8 h-8 text-thai-orange mr-3" />
                      <h2 className="text-2xl md:text-3xl font-bold text-thai-green">
                        CHANTHANA THAI COOK
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-base md:text-lg text-thai-green/80 leading-relaxed">
                        J'ai quitté la <span className="font-semibold text-thai-orange">Thaïlande</span> pour m'installer en 
                        <span className="font-semibold text-thai-green"> France</span> par amour depuis <span className="font-bold">2002</span>.
                      </p>
                      <p className="text-base md:text-lg text-thai-green/80 leading-relaxed">
                        Par amour pour ma famille, pour mon pays natal et surtout par 
                        <span className="font-semibold text-thai-orange"> passion pour la cuisine thaïlandaise</span>, 
                        mon souhait est de vous faire découvrir la culture et la diversité des saveurs de la Thaïlande.
                      </p>
                      <div className="bg-thai-cream/50 p-4 rounded-lg border-l-4 border-thai-orange">
                        <p className="text-base text-thai-green/80 italic">
                          Mon art originaire d'<span className="font-semibold text-thai-orange">Isan</span>, 
                          la région authentique Thaï qui garde ses secrets. 
                          <span className="font-semibold">Découvrez la véritable cuisine thaïlandaise.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-thai-orange to-thai-gold rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                      <img
                        src="/chanthana.svg"
                        alt="Chanthana en cuisine"
                        className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl border-4 border-white transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Cuisine Thaï Section optimisée */}
          <Card className="shadow-xl border-thai-orange/20 animate-fade-in">
            <div className="bg-gradient-to-br from-thai-green/5 to-thai-orange/5">
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Utensils className="w-8 h-8 text-thai-orange mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-thai-green">
                      CUISINE THAÏ AUTHENTIQUE
                    </h2>
                    <Utensils className="w-8 h-8 text-thai-orange ml-3" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-thai-green mb-3">
                      🌶️ L'équilibre parfait des saveurs
                    </h3>
                    <p className="text-base text-thai-green/80 leading-relaxed">
                      La cuisine thaïlandaise est réputée dans le monde entier pour la maîtrise de 
                      <span className="font-semibold text-thai-orange"> l'équilibre des saveurs</span>. 
                      L'art du mariage du <span className="text-thai-gold font-medium">sucré</span>, 
                      de l'<span className="text-thai-green font-medium">aigre-doux</span>, 
                      du <span className="text-thai-orange font-medium">salé</span> et 
                      du <span className="text-thai-red font-medium">piquant</span> donne 
                      des plats d'une saveur étonnante.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-thai-green mb-3">
                      🍜 Ingrédients authentiques
                    </h3>
                    <p className="text-base text-thai-green/80 leading-relaxed">
                      Savourez des repas thaïlandais typiquement authentiques mixant une diversité d'ingrédients : 
                      riz parfumé, poisson frais, poulet tendre, salades croquantes, légumes de saison, 
                      et parfois porc ou bœuf de qualité.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-thai-cream/50 to-thai-gold/10 rounded-xl border border-thai-orange/20">
                  <h3 className="text-lg font-semibold text-thai-green mb-3 text-center">
                    🍽️ Une expérience culinaire renouvelée
                  </h3>
                  <p className="text-base text-thai-green/80 leading-relaxed text-center">
                    Je propose des <span className="font-semibold text-thai-orange">menus complets à emporter</span> et 
                    autres délices qui <span className="font-semibold">se renouvellent chaque semaine</span>. 
                    Partez à la découverte de ces plats authentiques et laissez-vous surprendre en les commandant.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}