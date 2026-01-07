// src/pages/Index.tsx converted to Next.js app/page.tsx
"use client"

import { FloatingUserIcon } from "@/components/layout/FloatingUserIcon"
import { NavigationCards } from "@/components/layout/NavigationCards"
import { QuickNav } from "@/components/layout/QuickNav"
import { HeroCarousel, type HeroMedia } from "@/components/shared/HeroCarousel"
import { SectionPourquoiCompte } from "@/components/shared/SectionPourquoiCompte"
import { usePermissions } from "@/hooks/usePermissions"
import {
  announcementTypeConfig,
  getActiveAnnouncement,
  type Announcement,
} from "@/lib/announcements"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { memo, useEffect, useState } from "react"

// Server Action pour charger les hero medias
async function fetchHeroMedias(): Promise<HeroMedia[]> {
  try {
    const response = await fetch("/api/hero-media", { next: { revalidate: 60 } })
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

const TableauDeBord = memo(() => {
  const { isAuthenticated, isAdmin, clientProfile } = usePermissions()
  const currentUser = isAuthenticated ? clientProfile : null
  const currentUserRole = clientProfile?.role

  // État pour l'annonce dynamique
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(true)

  // État pour les médias du hero carousel
  const [heroMedias, setHeroMedias] = useState<HeroMedia[]>([])
  const [isLoadingHeroMedias, setIsLoadingHeroMedias] = useState(true)

  // Charger l'annonce active au montage du composant
  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const activeAnnouncement = await getActiveAnnouncement()
        setAnnouncement(activeAnnouncement)
      } catch (error) {
        // Silent fail for announcements - not critical for app functionality
      } finally {
        setIsLoadingAnnouncement(false)
      }
    }
    loadAnnouncement()
  }, [])

  // Charger les médias du hero carousel via API
  useEffect(() => {
    const loadHeroMedias = async () => {
      try {
        const medias = await fetchHeroMedias()
        setHeroMedias(medias)
      } catch (error) {
        console.error("Erreur lors du chargement des médias hero:", error)
        // Silent fail - HeroCarousel affichera un fallback
      } finally {
        setIsLoadingHeroMedias(false)
      }
    }
    loadHeroMedias()
  }, [])

  // Calculer si la photo a été uploadée récemment (<7 jours)
  const photoUploadedRecently = false // TODO: Implémenter la logique de calcul de date

  return (
    <div className="bg-gradient-thai flex flex-col pb-0 md:min-h-screen">
      {/* Hero Carousel avec médias dynamiques */}
      {!isLoadingHeroMedias && (
        <HeroCarousel medias={heroMedias} isAuthenticated={isAuthenticated} />
      )}

      {/* Annonce dynamique */}
      {!isLoadingAnnouncement && announcement?.is_active && announcement?.message && (
        <div
          className={`${announcementTypeConfig[announcement.type]?.bgColor || "bg-blue-600/90"} backdrop-blur-sm`}
        >
          <div className="flex items-center justify-center px-4 py-3">
            {announcement.type === "info" && <Info className="mr-2 h-5 w-5 shrink-0 text-white" />}
            {announcement.type === "warning" && (
              <AlertTriangle className="mr-2 h-5 w-5 shrink-0 text-white" />
            )}
            {announcement.type === "error" && (
              <XCircle className="mr-2 h-5 w-5 shrink-0 text-white" />
            )}
            {announcement.type === "success" && (
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-white" />
            )}
            <p className="text-center text-sm font-medium text-white md:text-base">
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
        className="md:flex-1"
      />

      {/* Section "Pourquoi créer un compte" - Visible uniquement pour visiteurs non connectés */}
      <SectionPourquoiCompte isAuthenticated={isAuthenticated} />

      {/* FloatingUserIcon ajouté pour navigation universelle */}
      <FloatingUserIcon />
    </div>
  )
})

TableauDeBord.displayName = "TableauDeBord"

export default TableauDeBord
