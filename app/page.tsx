// src/pages/Index.tsx converted to Next.js app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Calendar, MapPin, User, Users, History, Info, Phone, Clock, AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getActiveAnnouncement, announcementTypeConfig, type Announcement } from '@/lib/announcements';
import { FloatingUserIcon } from '@/components/FloatingUserIcon';

const TableauDeBord = memo(() => {
  const { currentUser, currentUserRole } = useAuth();

  // État pour l'annonce dynamique
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(true);

  // Charger l'annonce active au montage du composant
  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const activeAnnouncement = await getActiveAnnouncement();
        setAnnouncement(activeAnnouncement);
      } catch (error) {
        // Silent fail for announcements - not critical for app functionality
      } finally {
        setIsLoadingAnnouncement(false);
      }
    };

    loadAnnouncement();
  }, []);

  const sections = [
    {
      title: 'Pour Commander',
      buttonTitle: 'Commander',
      description: 'Découvrez notre menu authentique et passez votre commande',
      image: '/pourcommander.svg',
      link: '/commander',
      icon: Utensils,
    },
    ...(currentUser
      ? [
          {
            title: 'Suivi & historique',
            buttonTitle: 'Suivi & historique',
            description: 'Suivez vos commandes et votre historique',
            image: '/suivihistorique.svg',
            link: '/historique',
            icon: History,
          },
        ]
      : []),
    {
      title: 'Nous Trouver',
      buttonTitle: 'Nous Trouver',
      description: 'Venez nous rendre visite à Marigny-Marmande',
      image: '/nous trouver.svg',
      link: '/nous-trouver',
      icon: MapPin,
    },
    {
      title: 'Pour vos Événements',
      buttonTitle: 'Événements',
      description: 'Organisez vos événements avec nos menus personnalisés',
      image: '/pourvosevenement.svg',
      link: '/evenements',
      icon: Calendar,
    },
    {
      title: 'Mon Profil',
      buttonTitle: 'Mon Profil',
      description: 'Gérez vos informations personnelles et préférences',
      image: '/chanthana.svg',
      link: '/profil',
      icon: User,
    },
    {
      title: 'À propos de nous',
      buttonTitle: 'À Propos',
      description: 'Découvrez notre histoire et notre passion',
      image: '/apropos.svg',
      link: '/a-propos',
      icon: Users,
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-thai flex flex-col">
      {/* Hero Banner comme avant - restauré */}
      <section className="relative bg-gradient-to-r from-thai-orange via-thai-gold to-thai-orange overflow-hidden">
        {/* Effets visuels d'arrière-plan */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative py-8 px-4">
          <div className="flex items-center justify-center space-x-6 max-w-6xl mx-auto">
            <Link href="/" className="flex-shrink-0 group">
              <img
                src="/logo.svg"
                alt="ChanthanaThaiCook Logo"
                className="w-20 h-20 rounded-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
              />
            </Link>

            <div className="text-center flex-1">
              <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
                ChanthanaThaiCook
              </h1>
              <p className="text-white/90 text-sm md:text-base lg:text-lg font-medium italic drop-shadow-md">
                Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande
              </p>
            </div>

            <Link href="/a-propos" className="flex-shrink-0 group">
              <img
                src="/logo.svg"
                alt="ChanthanaThaiCook Logo"
                className="w-20 h-20 rounded-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-lg"
              />
            </Link>
          </div>
        </div>

        {/* Annonce dynamique */}
        {!isLoadingAnnouncement && announcement?.is_active && announcement?.message && (
          <div className={`${announcementTypeConfig[announcement.type]?.bgColor || 'bg-blue-600/90'} backdrop-blur-sm`}>
            <div className="flex items-center justify-center py-3 px-4">
              {announcement.type === 'info' && <Info className="w-5 h-5 text-white mr-2 flex-shrink-0" />}
              {announcement.type === 'warning' && <AlertTriangle className="w-5 h-5 text-white mr-2 flex-shrink-0" />}
              {announcement.type === 'error' && <XCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />}
              {announcement.type === 'success' && <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />}
              <p className="text-white font-medium text-center text-sm md:text-base">
                {announcement.message}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Sections Grid avec micro-interactions */}
      <section className="flex-1 py-16 px-4">
        <div className="container mx-auto">
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            style={{ gridAutoRows: '1fr' }}
          >
            {sections.map((section, index) => (
              <Card
                key={index}
                className="group cursor-pointer transition-all duration-500 ease-out border-2 border-thai-orange/20 overflow-hidden flex flex-col hover:shadow-2xl hover:scale-105 hover:border-thai-orange hover:-translate-y-2 h-full"
              >
                <Link href={section.link} className="h-full flex flex-col">
                  <div className="aspect-video overflow-hidden relative flex-shrink-0">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <section.icon className="absolute top-4 right-4 h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-125" />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow justify-between">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-thai-green mb-3 group-hover:text-thai-orange transition-colors duration-300">
                        {section.title}
                      </h3>
                      <p className="text-thai-green/70 text-center group-hover:text-thai-green transition-colors duration-300">
                        {section.description}
                      </p>
                    </div>
                    <div className="mt-6 flex-shrink-0">
                      <Button
                        variant="outline"
                        className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white w-full transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105"
                      >
                        {section.buttonTitle}
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bouton Accès Administrateur - Visible uniquement pour les administrateurs */}
      {currentUserRole === 'admin' && (
        <section className="py-8 px-4">
          <div className="container mx-auto text-center">
            <Link href="/admin">
              <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Shield className="w-5 h-5 mr-2" />
                Accès Administrateur
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer compact et discret */}
      <footer className="bg-thai-green/90 text-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            {/* Logo et nom */}
            <div className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="ChanthanaThaiCook Logo"
                className="w-8 h-8 rounded-full object-contain"
              />
              <span className="font-semibold">ChanthanaThaiCook</span>
            </div>

            {/* Informations essentielles */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <a
                  href="tel:+33749283707"
                  className="hover:text-thai-gold transition-colors"
                >
                  07 49 28 37 07
                </a>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Marigny-Marmande</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>18h00 - 20h30</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-xs text-white/80">
              © {new Date().getFullYear()} Tous droits réservés
            </div>
          </div>
        </div>
      </footer>
      
      {/* FloatingUserIcon ajouté pour navigation universelle */}
      <FloatingUserIcon />
    </div>
  );
});

TableauDeBord.displayName = 'TableauDeBord';

export default TableauDeBord;
