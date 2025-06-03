// src/pages/TableauDeBord.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Calendar, MapPin, User, Users, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';

const TableauDeBord = memo(() => {
  const { t } = useTranslation();

  const sections = [
    {
      titleKey: 'dashboard.orderSection.title',
      buttonTitleKey: 'dashboard.orderSection.buttonTitle',
      descriptionKey: 'dashboard.orderSection.description',
      image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop",
      link: "/commander",
      icon: Utensils
    },
    {
      titleKey: 'dashboard.eventsSection.title',
      buttonTitleKey: 'dashboard.eventsSection.buttonTitle',
      descriptionKey: 'dashboard.eventsSection.description',
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      link: "/evenements",
      icon: Calendar
    },
    {
      titleKey: 'dashboard.findUsSection.title',
      buttonTitleKey: 'dashboard.findUsSection.buttonTitle',
      descriptionKey: 'dashboard.findUsSection.description',
      image: "/lovable-uploads/c05e254c-51c0-4574-b2ab-2dac828ea413.png",
      link: "/nous-trouver",
      icon: MapPin
    },
    {
      titleKey: 'dashboard.profileSection.title',
      buttonTitleKey: 'dashboard.profileSection.buttonTitle',
      descriptionKey: 'dashboard.profileSection.description',
      image: "/lovable-uploads/e7536056-adbd-4a0f-93f1-2e9f54807726.png",
      link: "/profil",
      icon: User
    },
    {
      titleKey: 'dashboard.aboutSection.title',
      buttonTitleKey: 'dashboard.aboutSection.buttonTitle',
      descriptionKey: 'dashboard.aboutSection.description',
      image: "/lovable-uploads/d3c49259-a59d-45b8-9ad1-9d2f843b4562.png",
      link: "/a-propos",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-thai">
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-thai-orange to-thai-gold">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white animate-fade-in">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">
              {t('dashboard.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('dashboard.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-thai-orange hover:bg-thai-cream px-8 py-6 text-lg rounded-xl">
                <Link to="/profil">{t('dashboard.cta.createProfile')}</Link>
              </Button>
              {/* MODIFICATION DU BOUTON "Voir le Menu" CI-DESSOUS */}
              <Button
                asChild
                size="lg"
                variant="secondary" // Changé de "outline" à "secondary"
                className="bg-white text-thai-orange hover:bg-thai-cream px-8 py-6 text-lg rounded-xl" // Classes copiées du bouton "Créer Mon Profil"
              >
                <Link to="/commander">{t('dashboard.cta.viewMenu')}</Link>
              </Button>
            </div>
          </div>
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
                    alt={t(section.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <section.icon className="absolute top-4 right-4 h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <p className="text-thai-green/70 mb-4 flex-grow text-center">{t(section.descriptionKey)}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-thai-orange hover:bg-thai-orange hover:text-white w-full mt-auto group"
                  >
                    <Link
                      to={section.link}
                      className="text-thai-orange group-hover:text-white"
                    >
                      {t(section.buttonTitleKey)}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section pour le sous-titre "Une expérience culinaire..." */}
      <section className="pt-0 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-thai-green/80 leading-relaxed italic">
              {t('dashboard.subtitle')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

TableauDeBord.displayName = 'TableauDeBord';

export default TableauDeBord;