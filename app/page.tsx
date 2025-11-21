// src/pages/Index.tsx converted to Next.js app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { getActiveAnnouncement, announcementTypeConfig, type Announcement } from '@/lib/announcements';
import { FloatingUserIcon } from '@/components/layout/FloatingUserIcon';
import { HeroCarousel, type HeroMedia } from '@/components/shared/HeroCarousel';
import { QuickNav } from '@/components/layout/QuickNav';
import { NavigationCards } from '@/components/layout/NavigationCards';
import { SectionPourquoiCompte } from '@/components/shared/SectionPourquoiCompte';
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
      {!isLoadingHeroMedias && <HeroCarousel medias={heroMedias} isAuthenticated={isAuthenticated} />}

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

      {/* Navigation rapide avec effet cascade */}
      <QuickNav isAuthenticated={isAuthenticated} />

      {/* Navigation Cards (6 cartes) */}
      <NavigationCards
        isAuthenticated={isAuthenticated}
        userPhoto={clientProfile?.photo_client || null}
        photoUploadedRecently={photoUploadedRecently}
      />

      {/* Section "Pourquoi créer un compte" - Visible uniquement pour visiteurs non connectés */}
      <SectionPourquoiCompte isAuthenticated={isAuthenticated} />

      {/* FloatingUserIcon ajouté pour navigation universelle */}
      <FloatingUserIcon />
    </div>
  );
});

TableauDeBord.displayName = 'TableauDeBord';

export default TableauDeBord;
