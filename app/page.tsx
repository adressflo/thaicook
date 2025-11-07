// src/pages/Index.tsx converted to Next.js app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Info, Phone, Clock, AlertTriangle, CheckCircle, XCircle, Shield, MapPin } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { getActiveAnnouncement, announcementTypeConfig, type Announcement } from '@/lib/announcements';
import { FloatingUserIcon } from '@/components/FloatingUserIcon';
import { HeroCarousel, type HeroMedia } from '@/components/HeroCarousel';
import { NavigationCards } from '@/components/NavigationCards';
import { SectionPWA } from '@/components/SectionPWA';
import { SectionPourquoiCompte } from '@/components/SectionPourquoiCompte';
import { supabase } from '@/lib/supabase';

const TableauDeBord = memo(() => {
  const { isAuthenticated, isAdmin, clientProfile } = usePermissions();
  const currentUser = isAuthenticated ? clientProfile : null;
  const currentUserRole = clientProfile?.role;

  // État pour l'annonce dynamique
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(true);

  // État pour les médias du hero carousel
  const [heroMedias, setHeroMedias] = useState<HeroMedia[]>([]);
  const [isLoadingHeroMedias, setIsLoadingHeroMedias] = useState(true);

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

  // Charger les médias du hero carousel
  useEffect(() => {
    const loadHeroMedias = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('hero_media')
          .select('*')
          .eq('active', true)
          .order('ordre', { ascending: true });

        if (error) throw error;

        // Cast to HeroMedia[] type
        setHeroMedias((data as any[])?.map((media) => ({
          id: media.id,
          type: media.type as 'image' | 'video',
          url: media.url,
          titre: media.titre,
          description: media.description,
          ordre: media.ordre,
          active: media.active,
        })) || []);
      } catch (error) {
        console.error('Erreur lors du chargement des médias hero:', error);
        // Silent fail - HeroCarousel affichera un fallback
      } finally {
        setIsLoadingHeroMedias(false);
      }
    };
    loadHeroMedias();
  }, []);

  // Calculer si la photo a été uploadée récemment (<7 jours)
  const photoUploadedRecently = false; // TODO: Implémenter la logique de calcul de date


  return (
    <div className="min-h-screen bg-gradient-thai flex flex-col">
      {/* Hero Carousel avec médias dynamiques */}
      {!isLoadingHeroMedias && <HeroCarousel medias={heroMedias} />}

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

      {/* Navigation Cards (6 cartes) */}
      <NavigationCards
        isAuthenticated={isAuthenticated}
        userPhoto={clientProfile?.photo_client || null}
        photoUploadedRecently={photoUploadedRecently}
      />

      {/* Section "Pourquoi créer un compte" - Visible uniquement pour visiteurs non connectés */}
      <SectionPourquoiCompte isAuthenticated={isAuthenticated} />

      {/* Section PWA - Installation ou ouverture */}
      <SectionPWA />

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
