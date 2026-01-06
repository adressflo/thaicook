"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { toastVideo } from "@/hooks/use-toast-video"

import { OfflineBannerCompact } from "@/components/pwa/OfflineBanner"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import {
  AlertCircle,
  ArrowLeft,
  Calendar as CalendarIconLucide,
  Clock,
  CreditCard,
  History as HistoryIcon,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { parseAsString, useQueryState } from "nuqs"
import { memo, Suspense, useEffect, useMemo, useRef, useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { addDays, format, getDay, isFuture, isSameDay, startOfDay, type Day } from "date-fns"
import { fr } from "date-fns/locale"
import { motion, PanInfo } from "framer-motion"

import { getClientProfile } from "@/app/profil/actions"
import { useData } from "@/contexts/DataContext"
import { useSession } from "@/lib/auth-client"
// Utilisation des hooks
import { FeaturedDishSection } from "@/components/commander/FeaturedDishSection"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { CommandePlatModal } from "@/components/shared/CommandePlatModal"
import { ProductCard as SharedProductCard } from "@/components/shared/ProductCard"
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton"
import { ModalVideo } from "@/components/ui/ModalVideo"
import { useCart } from "@/contexts/CartContext"
import { usePrismaCreateCommande } from "@/hooks/usePrismaData"
import { spiceTextToLevel } from "@/lib/spice-helpers"
import { getStorageUrl, STORAGE_DEFAULTS } from "@/lib/storage-utils"
import type { PlatUI as Plat, PlatPanier } from "@/types/app"

export const dynamic = "force-dynamic"

const dayNameToNumber: { [key: string]: Day } = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
}

const joursDispoMapping = [
  { key: "lundi_dispo", value: "lundi", label: "Lundi" },
  { key: "mardi_dispo", value: "mardi", label: "Mardi" },
  { key: "mercredi_dispo", value: "mercredi", label: "Mercredi" },
  { key: "jeudi_dispo", value: "jeudi", label: "Jeudi" },
  { key: "vendredi_dispo", value: "vendredi", label: "Vendredi" },
  { key: "samedi_dispo", value: "samedi", label: "Samedi" },
  { key: "dimanche_dispo", value: "dimanche", label: "Dimanche" },
]

const getAvailableDays = (plat: Plat): { value: string; label: string }[] => {
  return joursDispoMapping.filter((jour) => plat[jour.key as keyof Plat] === "oui")
}

const Commander = memo(() => {
  const { toast: _toast } = useToast()
  const router = useRouter()
  const isOnline = useOnlineStatus()
  const { plats, isLoading: dataIsLoading, error: dataError } = useData()
  const createCommande = usePrismaCreateCommande()

  // Better Auth session
  const { data: session } = useSession()
  const currentUser = session?.user

  // Client profile (pour obtenir idclient)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clientProfile, setClientProfile] = useState<any>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id])

  const idclient = clientProfile?.idclient

  const {
    panier,
    ajouterAuPanier,
    modifierQuantite,
    modifierDistributionEpice,
    supprimerDuPanier,
    viderPanier,
    totalPrix,
  } = useCart()
  const _isMobile = useIsMobile()
  const platsSectionRef = useRef<HTMLDivElement>(null)
  const dayButtonsSectionRef = useRef<HTMLDivElement>(null)
  const hasAutoSelected = useRef(false)

  // États pour la sidebar mobile
  const [highlightedPlatId, _setHighlightedPlatId] = useState<string | null>(null)
  const [featuredDishDays, setFeaturedDishDays] = useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [featuredDish, setFeaturedDish] = useState<any>(null)
  const [modalContext, setModalContext] = useState<{
    plat: Plat
    quantity: number
    spiceDistribution?: number[]
    uniqueId?: string
  } | null>(null)

  // États pour la validation et redirection
  const [_isSubmitting, setIsSubmitting] = useState(false)
  const [redirectOrderId, setRedirectOrderId] = useState<string | null>(null)
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isVideoPanierOpen, setIsVideoPanierOpen] = useState(false)

  // Feedback retour connexion
  const prevIsOnline = useRef(isOnline)
  useEffect(() => {
    if (!prevIsOnline.current && isOnline) {
      toastVideo({
        title: "Connexion rétablie !",
        description: "Vous êtes de nouveau connecté.",
        media: "/media/animations/toasts/ajoutpaniernote.mp4",
        position: "bottom-right",
        aspectRatio: "1:1",
        polaroid: true,
        borderColor: "thai-green",
        animateBorder: true,
        hoverScale: true,
        typingAnimation: true,
      })
    }
    prevIsOnline.current = isOnline
  }, [isOnline])

  // Redirection automatique après création de commande
  useEffect(() => {
    if (redirectOrderId) {
      console.log("🔄 Redirection useEffect déclenchée vers:", `/suivi-commande/${redirectOrderId}`)
      router.push(`/suivi-commande/${redirectOrderId}`)
    }
  }, [redirectOrderId, router])

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`
    } else {
      return `${prix.toFixed(2).replace(".", ",")}€`
    }
  }

  const [jourSelectionne, setJourSelectionne] = useQueryState("jour", parseAsString.withDefault(""))
  const [dateRetrait, setDateRetrait] = useState<Date | undefined>()
  const [heureRetrait, setHeureRetrait] = useState<string>("")
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>("")
  const [allowedDates, setAllowedDates] = useState<Date[]>([])
  const [recherche, setRecherche] = useQueryState("recherche", parseAsString.withDefault(""))

  const platsFiltres = useMemo(() => {
    if (!recherche) return []
    if (!plats) return []
    return plats.filter(
      (plat) => plat.plat?.toLowerCase().includes(recherche.toLowerCase()) && plat.idplats !== 0 // Exclure les anciens extras
    )
  }, [recherche, plats])

  const platsDisponibles = useMemo(() => {
    if (!jourSelectionne || !plats) return []
    const champDispoKey = `${jourSelectionne.toLowerCase()}_dispo` as keyof Plat
    return plats.filter(
      (plat) => plat[champDispoKey] === "oui" && plat.idplats !== 0 // Exclure les anciens extras
    )
  }, [jourSelectionne, plats])

  const joursOuverture = useMemo(() => {
    const joursMap = [
      { key: "lundi_dispo", value: "lundi", label: "Lundi" },
      { key: "mardi_dispo", value: "mardi", label: "Mardi" },
      { key: "mercredi_dispo", value: "mercredi", label: "Mercredi" },
      { key: "jeudi_dispo", value: "jeudi", label: "Jeudi" },
      { key: "vendredi_dispo", value: "vendredi", label: "Vendredi" },
      { key: "samedi_dispo", value: "samedi", label: "Samedi" },
      { key: "dimanche_dispo", value: "dimanche", label: "Dimanche" },
    ]

    // Filtrer uniquement les jours où au moins un plat est disponible
    return joursMap.filter(
      (jour) => plats?.some((plat) => plat[jour.key as keyof typeof plat] === "oui") || false
    )
  }, [plats])

  const heuresDisponibles = useMemo(() => {
    const heures: string[] = []
    const heureActuelle = new Date(0)
    heureActuelle.setHours(18, 0, 0, 0)
    const heureFin = new Date(0)
    heureFin.setHours(20, 30, 0, 0)
    while (heureActuelle <= heureFin) {
      heures.push(format(heureActuelle, "HH:mm"))
      heureActuelle.setMinutes(heureActuelle.getMinutes() + 5)
    }
    return heures
  }, [])

  // Récupérer le plat vedette et ses jours disponibles
  useEffect(() => {
    fetch("/api/featured-dish")
      .then((res) => res.json())
      .then((data) => {
        if (data?.dish) {
          setFeaturedDish(data.dish)
          if (data.dish.joursDisponibles && Array.isArray(data.dish.joursDisponibles)) {
            setFeaturedDishDays(data.dish.joursDisponibles)
          }
        }
      })
      .catch((err) => {
        console.error("Erreur récupération plat vedette:", err)
      })
  }, [])

  useEffect(() => {
    if (jourSelectionne && jourSelectionne in dayNameToNumber) {
      const targetDayNumber = dayNameToNumber[jourSelectionne]
      const today = startOfDay(new Date())
      const calculatedDates: Date[] = []

      // Générer les 8 prochaines occurrences du jour sélectionné
      let currentDate = today
      let foundDates = 0

      while (foundDates < 8) {
        if (
          getDay(currentDate) === targetDayNumber &&
          (isSameDay(currentDate, today) || isFuture(currentDate))
        ) {
          calculatedDates.push(startOfDay(currentDate))
          foundDates++
        }
        currentDate = addDays(currentDate, 1)
      }

      setAllowedDates(calculatedDates)
      if (dateRetrait && !calculatedDates.some((d) => isSameDay(d, dateRetrait))) {
        setDateRetrait(undefined)
      }
    } else {
      setAllowedDates([])
    }
  }, [jourSelectionne, dateRetrait])

  // Auto-sélection de la dernière commande au chargement
  useEffect(() => {
    if (!hasAutoSelected.current && panier.length > 0) {
      const lastItem = panier[panier.length - 1]
      if (lastItem.jourCommande && lastItem.dateRetrait) {
        const date = new Date(lastItem.dateRetrait)
        setJourSelectionne(lastItem.jourCommande)
        setDateRetrait(date)
        setHeureRetrait(format(date, "HH:mm"))
        hasAutoSelected.current = true
      }
    }
  }, [panier, setJourSelectionne])

  // Scroll automatique vers la section des plats
  useEffect(() => {
    if (jourSelectionne && dateRetrait && heureRetrait && platsSectionRef.current) {
      // Double requestAnimationFrame pour attendre que le layout soit recalculé
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          platsSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        })
      })
    }
  }, [jourSelectionne, dateRetrait, heureRetrait])

  // Fonction pour scroll vers la section des boutons jours
  const handleScrollToDays = () => {
    dayButtonsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  // Calculer la quantité actuelle d'un plat dans le panier
  const getCurrentQuantity = (platId: number): number => {
    if (!dateRetrait || !jourSelectionne) return 0

    const dateCompleteRetrait = new Date(dateRetrait)
    const [heures, minutes] = (heureRetrait || "18:00").split(":")
    dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0)

    return panier
      .filter(
        (item) =>
          item.id === platId.toString() &&
          item.dateRetrait?.getTime() === dateCompleteRetrait.getTime()
      )
      .reduce((total, item) => total + item.quantite, 0)
  }

  const handleAjouterAuPanier = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plat: any,
    quantite: number = 1,
    spicePreference?: string,
    spiceDistribution?: number[],
    uniqueId?: string
  ) => {
    if (!plat.idplats || !plat.plat || plat.prix === undefined) return

    // Vérifier qu'un jour, une date et une heure sont sélectionnés
    if (!jourSelectionne || !dateRetrait || !heureRetrait) {
      toastVideo({
        title: "Oups ! 📅",
        description: "Veuillez d'abord sélectionner un jour, une date et une heure de retrait.",
        media: "/media/animations/toasts/ajoutpaniernote.mp4",
        position: "center",
        aspectRatio: "1:1",
        polaroid: true,
        borderColor: "thai-orange",
        animateBorder: true,
        hoverScale: true,
        rotation: true,
      })
      return
    }

    // Si un ID unique est fourni, c'est une modification : supprimer l'ancien article d'abord
    if (uniqueId) {
      supprimerDuPanier(uniqueId)
    }

    // Créer une date complète avec l'heure
    const dateCompleteRetrait = new Date(dateRetrait)
    const [heures, minutes] = heureRetrait.split(":")
    dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0)

    // Ajouter UNE SEULE entrée avec la quantité totale et le texte de distribution
    ajouterAuPanier({
      id: plat.idplats.toString(),
      nom: plat.plat,
      prix: plat.prix || "0",
      quantite: quantite,
      jourCommande: jourSelectionne,
      dateRetrait: dateCompleteRetrait,
      demandeSpeciale: spicePreference || undefined,
      spiceDistribution: spiceDistribution,
    })

    toastVideo({
      title: uniqueId ? "Panier mis à jour !" : "Plat ajouté !",
      description: (
        <>
          <span className="text-thai-green font-medium">{quantite}</span>
          <span className="text-thai-orange font-medium">
            {" "}
            {plat.plat}
            {quantite > 1 ? "s" : ""}
          </span>
          <span className="text-thai-green font-medium">
            {" "}
            {uniqueId ? "mis à jour" : "ajouté"}
            {quantite > 1 ? "s" : ""} à votre panier pour le{" "}
          </span>
          <span className="text-thai-orange font-medium">
            {format(dateCompleteRetrait, "eeee dd MMMM", { locale: fr })}
          </span>
          <span className="text-thai-green font-medium"> à </span>
          <span className="text-thai-orange font-medium">{heureRetrait}</span>
        </>
      ),
      media: "/media/animations/toasts/ajoutpaniernote.mp4",
      aspectRatio: "1:1",
      polaroid: true,
      borderColor: "thai-green",
      maxWidth: "xs",
      animateBorder: true,
      hoverScale: true,
      rotation: true,
      typingAnimation: true,
      typingSpeed: 10,
      mangaExplosion: true,
    })
  }

  const validerCommande = async () => {
    if (!currentUser || !idclient) {
      toastVideo({
        title: "Profil incomplet",
        description: "Veuillez vous connecter et compléter votre profil pour commander.",
        media: "/media/animations/toasts/ajoutpaniernote.mp4",
        position: "center",
        aspectRatio: "1:1",
        polaroid: true,
        borderColor: "thai-orange",
        animateBorder: true,
        hoverScale: true,
        rotation: true,
      })
      setTimeout(() => router.push("/auth/login"), 2000)
      return
    }
    if (panier.length === 0) {
      toastVideo({
        title: "Panier vide",
        description:
          "Je suis prête à noter, mais votre panier est vide ! Choisissez d'abord vos plats.",
        media: "/media/animations/toasts/ajoutpaniernote.mp4",
        position: "center",
        aspectRatio: "1:1",
        polaroid: true,
        borderColor: "thai-orange",
        animateBorder: true,
        hoverScale: true,
        rotation: true,
      })
      return
    }

    setIsSubmitting(true)

    // Grouper les articles par date de retrait
    const groupedByDate = panier.reduce(
      (groups, item) => {
        const dateKey = item.dateRetrait?.toISOString() || ""
        if (!groups[dateKey]) {
          groups[dateKey] = []
        }
        groups[dateKey].push(item)
        return groups
      },
      {} as Record<string, PlatPanier[]>
    )

    try {
      let _commandesCreees = 0
      let lastOrderId: string | null = null

      // Créer une commande pour chaque date de retrait
      for (const [dateKey, items] of Object.entries(groupedByDate)) {
        if (!dateKey) continue

        const commandeData = {
          client_r: currentUser.id,
          client_r_id: idclient,
          date_et_heure_de_retrait_souhaitees: dateKey,
          demande_special_pour_la_commande: demandesSpeciales,
          details: items.map((item) => ({
            plat_r: item.id, // Garder comme string, sera converti dans le hook
            quantite_plat_commande: item.quantite,
            preference_epice_niveau: spiceTextToLevel(item.demandeSpeciale),
            spice_distribution: item.spiceDistribution || null,
          })),
        }

        const newOrder = await createCommande.mutateAsync(commandeData)

        // Essayer id puis idcommande
        const orderId = newOrder?.id || newOrder?.idcommande
        if (orderId) {
          lastOrderId = orderId.toString()
        }

        _commandesCreees++
      }

      const _totalGeneral = panier.reduce(
        (sum, item) => sum + parseFloat(item.prix || "0") * item.quantite,
        0
      )

      toastVideo({
        title: "Khop khun Kha !",
        description:
          "Votre <orange>commande</orange> a été <orange>enregistrée</orange> avec <orange>succès</orange>.",
        media: "/media/animations/toasts/validatiomnote.mp4",
        position: "center",
        aspectRatio: "1:1",
        polaroid: true,
        borderColor: "thai-green",
        borderWidth: 4,
        shadowSize: "md",
        maxWidth: "sm",
        animateBorder: true,
        hoverScale: true,
        showCloseButton: false,
        mangaExplosion: true,
        typingAnimation: true,
      })

      // Nettoyer le panier et les états
      viderPanier()
      setDateRetrait(undefined)
      setHeureRetrait("")
      setDemandesSpeciales("")
      setJourSelectionne(null)

      // Déclencher la redirection
      if (lastOrderId) {
        console.log("🔄 Déclenchement redirection vers:", lastOrderId)
        setRedirectOrderId(lastOrderId)

        // Fallback de sécurité : si le useEffect ne se déclenche pas, on force la redirection après 1s
        setTimeout(() => {
          router.push(`/suivi-commande/${lastOrderId}`)
        }, 1000)
      } else {
        router.push("/commander/confirmation")
      }
    } catch (error: unknown) {
      console.error("❌ Erreur validation commande:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la commande."
      toastVideo({
        title: "Erreur commande",
        description: errorMessage,
        media: "/media/animations/toasts/ajoutpaniernote.mp4",
        position: "center",
        aspectRatio: "1:1",
        polaroid: true,
        borderColor: "thai-orange",
        animateBorder: true,
        hoverScale: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (dataError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">Erreur de chargement: {dataError?.message}</Alert>
      </div>
    )
  }

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    // Swipe Gauche -> Panier
    if (info.offset.x < -swipeThreshold) {
      router.push("/panier")
    }
  }

  return (
    <AppLayout>
      <motion.div
        className="bg-gradient-thai min-h-screen px-0 pt-4 pb-4 sm:px-4 sm:pt-8"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={onDragEnd}
      >
        <div
          className={`mx-auto transition-all duration-500 ${
            panier.length > 0
              ? "grid w-full grid-cols-1 gap-0 sm:max-w-[95%] sm:gap-4 lg:grid-cols-[3fr_2fr] lg:gap-6 xl:max-w-[1600px]"
              : "w-full sm:max-w-3xl"
          }`}
        >
          {/* Header Navigation (Desktop seulement) */}
          <div className="mb-6 hidden items-center justify-between px-4 md:flex md:px-0">
            <Button
              asChild
              variant="outline"
              className="border-thai-green/50 text-thai-green hover:bg-thai-green/10 hover:text-thai-green hover:border-thai-green inline-flex items-center justify-center rounded-full px-6 py-2 text-base font-bold shadow-sm transition-all hover:scale-105"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour Accueil
              </Link>
            </Button>

            <Button
              asChild
              className="bg-thai-orange hover:bg-thai-orange/90 inline-flex items-center justify-center rounded-full px-6 py-2 text-base font-bold text-white shadow-md transition-all hover:scale-105"
            >
              <Link href="/historique">
                <HistoryIcon className="mr-2 h-5 w-5" />
                Mes Commandes Passées
              </Link>
            </Button>
          </div>

          {/* Section principale - Menu */}
          <div className="w-full">
            {/* Bannière offline compacte */}
            <OfflineBannerCompact className="mb-4" />

            {!currentUser || !idclient ? (
              <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Profil requis :</strong> Pour commander, veuillez vous{" "}
                  <Link href={"/auth/login" as Route} className="font-medium underline">
                    connecter et compléter votre profil
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            ) : null}

            {/* Section 1: Header Pour Commander (Style Modifier Commande) */}
            <Card className="border-thai-orange/20 mx-0 mb-6 w-full rounded-none border-x-0 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-0 sm:rounded-xl sm:border-x">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                    <DialogTrigger asChild>
                      <div className="relative mx-auto cursor-pointer transition-transform hover:scale-105 sm:mx-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/media/avatars/panier1.svg"
                          alt="Pour Commander"
                          className="h-24 w-40 rounded-lg border-2 border-amber-200 object-cover shadow-md"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-md overflow-hidden rounded-xl border-0 p-0">
                      <DialogTitle className="sr-only">Animation : Pour Commander</DialogTitle>
                      <video
                        src="/media/animations/toasts/prisedecommande2.mp4"
                        autoPlay
                        muted
                        playsInline
                        className="w-full"
                        onEnded={() => setIsVideoOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>

                  <div className="text-center sm:text-left">
                    <CardTitle className="text-thai-green text-xl font-bold sm:text-2xl">
                      Pour Commander
                    </CardTitle>
                    <p className="mt-1 text-sm font-medium text-gray-600">
                      Horaire : Lundi, Mercredi, Vendredi, Samedi de 18h00 à 20h30
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-4">
                <Link href="/evenements" className="w-full">
                  <Button
                    variant="outline"
                    className="border-thai-orange/30 text-thai-orange hover:bg-thai-orange/10 hover:text-thai-orange w-full"
                  >
                    <CalendarIconLucide className="mr-2 h-4 w-4" />
                    Voir nos prochains événements
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Section 2: Sélection du jour et recherche */}
            <Card className="border-thai-orange/20 mb-6 shadow-xl">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                  {/* Colonne gauche - Recherche + Boutons */}
                  <div>
                    <div className="border-thai-orange/10 mb-6 border-b pb-6">
                      <Label
                        htmlFor="recherche-plat"
                        className="text-md text-thai-green mb-3 block font-semibold"
                      >
                        Rechercher un plat pour voir sa disponibilité
                      </Label>
                      <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="recherche-plat"
                          placeholder="Ex: Pad Thaï, Curry, Nems..."
                          value={recherche}
                          onChange={(e) => setRecherche(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {recherche && platsFiltres.length > 0 && (
                        <div className="bg-thai-cream/30 hover:bg-thai-cream/40 mt-4 space-y-2 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                          {platsFiltres.map((plat) => (
                            <div
                              key={plat.id}
                              className="border-thai-orange/20 hover:bg-thai-cream/20 flex flex-col justify-between gap-2 rounded border-b p-2 transition-all duration-300 last:border-b-0 hover:shadow-sm sm:flex-row sm:items-center"
                            >
                              <span className="text-thai-green font-medium">{plat.plat}</span>
                              <div className="flex flex-wrap gap-2">
                                {getAvailableDays(plat).length > 0 ? (
                                  getAvailableDays(plat).map((jour) => (
                                    <Badge
                                      key={jour.value}
                                      variant="secondary"
                                      className="hover:bg-thai-orange/20 cursor-pointer transition-all duration-200 hover:scale-105"
                                      onClick={() => {
                                        setJourSelectionne(jour.value)
                                        setRecherche(null)
                                      }}
                                    >
                                      {jour.label}
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge variant="destructive">Indisponible</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {recherche && platsFiltres.length === 0 && (
                        <div className="mt-6 flex flex-col items-center justify-center space-y-3 text-center">
                          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
                            <Image
                              src="/media/avatars/panier1.svg"
                              alt="Chanthana"
                              width={96}
                              height={96}
                              className="h-full w-full bg-orange-50 object-cover p-2"
                            />
                          </div>
                          <div className="bg-thai-cream/30 rounded-lg p-4">
                            <p className="text-thai-green text-lg font-medium">
                              Mince, je ne trouve pas ce plat... 🧐
                            </p>
                            <p className="text-sm text-gray-500">
                              Essayez une autre orthographe ou regardez notre menu du jour !
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div ref={dayButtonsSectionRef}>
                      <Label className="text-md text-thai-green mb-3 block font-semibold">
                        Ou choisissez un jour pour voir le menu :
                      </Label>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {joursOuverture.map((jour) => {
                          const isFeaturedDay = featuredDishDays.includes(jour.value)
                          return (
                            <Button
                              key={jour.value}
                              variant={jourSelectionne === jour.value ? "default" : "outline"}
                              onClick={() => setJourSelectionne(jour.value)}
                              className={cn(
                                "rounded-md px-4 py-2 text-sm transition-all duration-200 hover:scale-105 sm:px-5 sm:py-2.5",
                                jourSelectionne === jour.value
                                  ? "bg-thai-orange text-white"
                                  : isFeaturedDay
                                    ? "border-thai-gold text-thai-orange bg-thai-gold/10 hover:bg-thai-gold/20 hover:ring-thai-gold/50 border-2 hover:ring-2"
                                    : "border-thai-orange text-thai-orange hover:bg-thai-orange/10 bg-white"
                              )}
                            >
                              {jour.label}
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Section Date/Heure */}
                    {jourSelectionne && (
                      <div className="border-thai-orange/10 mt-6 border-t pt-6">
                        <h3 className="text-thai-green mb-3 text-lg font-semibold">
                          Choisissez votre date et heure de retrait :
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label
                              htmlFor="select-date-retrait"
                              className="mb-1.5 block text-sm leading-none font-medium"
                            >
                              Date de retrait *
                            </label>
                            <Select
                              onValueChange={(value) => setDateRetrait(new Date(value))}
                              value={dateRetrait?.toISOString() || ""}
                              name="dateRetrait"
                            >
                              <SelectTrigger
                                id="select-date-retrait"
                                aria-label="Date de retrait"
                                className="hover:border-thai-orange/50 text-thai-green w-full transition-all duration-300 hover:shadow-md"
                              >
                                <CalendarIconLucide className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Sélectionner">
                                  {dateRetrait
                                    ? format(
                                        dateRetrait,
                                        dateRetrait.getFullYear() === new Date().getFullYear()
                                          ? "eeee dd MMMM"
                                          : "eeee dd MMMM yyyy",
                                        {
                                          locale: fr,
                                        }
                                      )
                                    : "Sélectionner une date"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {allowedDates.map((date) => {
                                  const isCurrentYear =
                                    date.getFullYear() === new Date().getFullYear()
                                  const dateFormat = isCurrentYear
                                    ? "eeee dd MMMM"
                                    : "eeee dd MMMM yyyy"
                                  return (
                                    <SelectItem key={date.toISOString()} value={date.toISOString()}>
                                      {format(date, dateFormat, { locale: fr })}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label
                              htmlFor="select-heure-retrait"
                              className="mb-1.5 block text-sm leading-none font-medium"
                            >
                              Heure de retrait *
                            </label>
                            <Select
                              onValueChange={setHeureRetrait}
                              value={heureRetrait}
                              name="heureRetrait"
                            >
                              <SelectTrigger
                                id="select-heure-retrait"
                                aria-label="Heure de retrait"
                                className="hover:border-thai-orange/50 text-thai-green transition-all duration-300 hover:shadow-md"
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                {heuresDisponibles.map((h) => (
                                  <SelectItem key={h} value={h}>
                                    {h}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-thai-green/70 mt-1 text-xs">
                              Entre 18h00 et 20h30 (par 5 min)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Colonne droite - Card Polaroid plat vedette */}
                  {featuredDish && (
                    <div className="hidden md:block">
                      <div className="sticky top-8">
                        <div className="max-w-xs transform rounded-lg border-4 border-white bg-white p-4 shadow-2xl transition-transform hover:rotate-1">
                          {/* Badge étoile */}
                          <div className="bg-thai-gold absolute -top-2 -left-2 z-10 rounded-full p-2 shadow-lg">
                            <Star className="h-6 w-6 fill-white text-white" />
                          </div>

                          {/* Image du plat */}
                          <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                            <Image
                              src={
                                featuredDish.photo_du_plat || getStorageUrl(STORAGE_DEFAULTS.PLAT)
                              }
                              alt={featuredDish.plat}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="object-cover"
                              priority
                            />
                          </div>

                          {/* Nom + Prix sur même ligne */}
                          <div className="mb-2 flex items-center justify-between px-2">
                            <h3 className="text-thai-green line-clamp-1 font-semibold">
                              {featuredDish.plat}
                            </h3>
                            <Badge variant="secondary" className="ml-2 shrink-0">
                              {featuredDish.prix
                                ? `${parseFloat(featuredDish.prix.toString()).toFixed(2).replace(".", ",")}€`
                                : "Prix sur demande"}
                            </Badge>
                          </div>

                          {/* Description du plat */}
                          <div
                            className="mb-2 max-h-20 overflow-y-auto px-2"
                            style={{
                              scrollbarWidth: "thin",
                              scrollbarColor: "#9ca3af #f3f4f6",
                            }}
                          >
                            <p className="text-xs leading-relaxed text-gray-600">
                              {featuredDish.description}
                            </p>
                          </div>

                          {/* Jours disponibles */}
                          <div className="text-center">
                            <p className="text-thai-green mb-1 text-xs font-semibold">Disponible</p>
                            <div className="flex flex-wrap justify-center gap-1">
                              {featuredDish.joursDisponibles?.map((jour: string) => (
                                <Badge
                                  key={jour}
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    jourSelectionne === jour
                                      ? "bg-thai-gold border-thai-gold text-white"
                                      : "border-thai-gold/30 text-thai-gold"
                                  )}
                                >
                                  {jour.charAt(0).toUpperCase() + jour.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Message */}
                          <p className="text-thai-orange mt-3 text-center text-xs font-semibold">
                            ⭐ Au menu cette semaine !
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Section Plat Vedette "Cette semaine au menu" - Mobile only */}
            {featuredDish && (
              <div className="mb-6 md:hidden">
                <FeaturedDishSection
                  onScrollToDays={handleScrollToDays}
                  featuredDay={jourSelectionne}
                />
              </div>
            )}

            {/* Section 4: Liste des plats disponibles */}
            {jourSelectionne && dateRetrait && heureRetrait && (
              <Card ref={platsSectionRef} className="border-thai-orange/20 mb-6 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-thai-green mb-4 text-lg font-semibold">
                    Plats disponibles le{" "}
                    {jourSelectionne.charAt(0).toUpperCase() + jourSelectionne.slice(1)} :
                  </h3>

                  {dataIsLoading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : platsDisponibles.length === 0 ? (
                    <div className="bg-thai-cream/30 rounded-lg py-6 text-center">
                      <p className="text-thai-green/70">Aucun plat disponible ce jour-là.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {platsDisponibles.map((plat) => (
                        <SharedProductCard
                          key={plat.id}
                          title={plat.plat}
                          description={plat.description || ""}
                          price={parseFloat(plat.prix || "0")}
                          imageSrc={plat.photo_du_plat || undefined}
                          isVegetarian={!!plat.est_vegetarien}
                          isSpicy={(plat.niveau_epice ?? 0) > 0}
                          quantityInCart={getCurrentQuantity(plat.idplats)}
                          onAdd={() =>
                            setModalContext({ plat, quantity: getCurrentQuantity(plat.idplats) })
                          }
                          className={
                            highlightedPlatId === plat.id.toString()
                              ? "ring-thai-orange/50 border-thai-orange scale-105 shadow-lg ring-4"
                              : ""
                          }
                        />
                      ))}
                    </div>
                  )}
                  <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                    <p className="text-sm font-medium text-green-800">
                      ✓ Retrait prévu le{" "}
                      {format(
                        dateRetrait,
                        dateRetrait.getFullYear() === new Date().getFullYear()
                          ? "eeee dd MMMM"
                          : "eeee dd MMMM yyyy",
                        { locale: fr }
                      )}{" "}
                      à {heureRetrait}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Section latérale droite - Panier */}
          {panier.length > 0 && (
            <div className="hidden w-full lg:block">
              {/* Desktop Sidebar - 30% fixe */}
              <div
                id="cart-section"
                className="flex flex-col md:sticky md:top-8 md:max-h-[calc(100vh-4rem)]"
              >
                <Card className="border-thai-orange/20 flex h-full flex-col overflow-hidden shadow-xl">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Dialog open={isVideoPanierOpen} onOpenChange={setIsVideoPanierOpen}>
                        <DialogTrigger asChild>
                          <div className="relative mx-auto cursor-pointer transition-transform hover:scale-105 sm:mx-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/media/panier/paniersac.svg"
                              alt="Mon Panier"
                              className="h-24 w-40 rounded-lg border-2 border-amber-200 object-cover shadow-md"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-md overflow-hidden rounded-xl border-0 p-0">
                          <DialogTitle className="sr-only">Animation : Mon Panier</DialogTitle>
                          <video
                            src="/media/panier/paniersac.mp4"
                            autoPlay
                            muted
                            playsInline
                            className="w-full"
                            onEnded={() => setIsVideoPanierOpen(false)}
                          />
                        </DialogContent>
                      </Dialog>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center gap-2 sm:justify-start">
                          <CardTitle className="text-thai-green text-xl font-bold sm:text-2xl">
                            Mon Panier
                          </CardTitle>
                          <span className="bg-thai-orange flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white shadow-sm">
                            {panier.reduce((total, item) => total + item.quantite, 0)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-600">
                          {panier.reduce((total, item) => total + item.quantite, 0)} plat
                          {panier.reduce((total, item) => total + item.quantite, 0) > 1 ? "s" : ""}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 h-8 w-8 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        onClick={() => setIsClearCartModalOpen(true)}
                        title="Vider le panier"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4">
                    {(() => {
                      const groupedByDate = panier.reduce(
                        (groups, item) => {
                          const dateKey = item.dateRetrait?.toDateString() || "no-date"
                          if (!groups[dateKey]) {
                            groups[dateKey] = []
                          }
                          groups[dateKey].push(item)
                          return groups
                        },
                        {} as Record<string, PlatPanier[]>
                      )

                      return Object.entries(groupedByDate).map(([dateKey, items]) => {
                        const dateRetrait = items[0]?.dateRetrait

                        return (
                          <div
                            key={dateKey}
                            className="border-thai-orange/20 bg-thai-cream/20 animate-fade-in hover:border-thai-orange/30 hover:bg-thai-cream/30 mb-4 rounded-lg border p-3 transition-all duration-300 hover:shadow-md"
                          >
                            {dateRetrait && (
                              <div
                                className="border-thai-orange/10 hover:bg-thai-orange/5 hover:border-thai-orange/20 mb-2 cursor-pointer rounded-lg border-b px-2 py-1 pb-2 transition-all duration-300"
                                onMouseEnter={() => {
                                  const jourDate = format(dateRetrait, "eeee", {
                                    locale: fr,
                                  }).toLowerCase()
                                  const heureDate = format(dateRetrait, "HH:mm")
                                  setJourSelectionne(jourDate)
                                  setDateRetrait(dateRetrait)
                                  setHeureRetrait(heureDate)
                                }}
                              >
                                <h4 className="text-thai-green flex items-center gap-2 text-base font-semibold">
                                  <CalendarIconLucide className="text-thai-orange h-4 w-4" />
                                  Retrait prévu le{" "}
                                  <span className="text-thai-orange font-bold">
                                    {format(
                                      dateRetrait,
                                      dateRetrait.getFullYear() === new Date().getFullYear()
                                        ? "eeee dd MMMM"
                                        : "eeee dd MMMM yyyy",
                                      {
                                        locale: fr,
                                      }
                                    ).replace(/^\w/, (c) => c.toUpperCase())}{" "}
                                    à {format(dateRetrait, "HH:mm")}
                                  </span>
                                </h4>
                              </div>
                            )}

                            <div className="space-y-3">
                              {items.map((item, index) => {
                                const platData = plats?.find((p) => p.id.toString() === item.id)
                                const imageUrl = platData?.photo_du_plat
                                const itemKey = item.uniqueId || `cart-item-${index}`

                                return platData ? (
                                  <CartItemCard
                                    key={itemKey}
                                    name={item.nom}
                                    imageUrl={imageUrl || undefined}
                                    unitPrice={parseFloat(item.prix)}
                                    quantity={item.quantite}
                                    isVegetarian={!!platData.est_vegetarien}
                                    isSpicy={(platData.niveau_epice ?? 0) > 0}
                                    showSpiceSelector={(platData.niveau_epice ?? 0) > 0}
                                    spiceDistribution={item.spiceDistribution}
                                    onSpiceDistributionChange={(newDist) =>
                                      modifierDistributionEpice(item.uniqueId!, newDist)
                                    }
                                    onQuantityChange={(qty) => {
                                      const diff = qty - item.quantite
                                      modifierQuantite(item.uniqueId!, qty)
                                      if (diff > 0) {
                                        toastVideo({
                                          title: (
                                            <span>
                                              Portion ajoutée !{" "}
                                              <Plus
                                                className="text-thai-orange inline-block h-6 w-6"
                                                strokeWidth={3}
                                              />
                                            </span>
                                          ),
                                          description: (
                                            <span>
                                              Une portion de{" "}
                                              <span className="text-thai-orange">{item.nom}</span>{" "}
                                              ajoutée.
                                            </span>
                                          ),
                                          media: "/media/animations/toasts/ajoutpaniernote.mp4",
                                          position: "bottom-right",
                                          aspectRatio: "1:1",
                                          polaroid: true,
                                          borderColor: "thai-green",
                                          maxWidth: "xs",
                                          duration: 2000,
                                        })
                                      } else if (diff < 0) {
                                        toastVideo({
                                          title: "Portion retirée ➖",
                                          description: `Une portion de ${item.nom} retirée.`,
                                          media: "/media/animations/toasts/ajoutpaniernote.mp4",
                                          position: "bottom-right",
                                          aspectRatio: "1:1",
                                          polaroid: true,
                                          borderColor: "thai-orange",
                                          maxWidth: "xs",
                                          duration: 2000,
                                        })
                                      }
                                    }}
                                    onRemove={() => {
                                      supprimerDuPanier(item.uniqueId!)
                                      toastVideo({
                                        title: "Plat supprimé 🗑️",
                                        description: `${item.nom} retiré du panier.`,
                                        media: "/media/animations/toasts/poubelleok.mp4",
                                        position: "center",
                                        aspectRatio: "1:1",
                                        polaroid: true,
                                        borderColor: "thai-orange",
                                        animateBorder: true,
                                        hoverScale: true,
                                        rotation: true,
                                      })
                                    }}
                                    onClick={() =>
                                      setModalContext({
                                        plat: platData,
                                        quantity: item.quantite,
                                        spiceDistribution: item.spiceDistribution,
                                        uniqueId: item.uniqueId,
                                      })
                                    }
                                  />
                                ) : null
                              })}
                            </div>
                          </div>
                        )
                      })
                    })()}

                    <div className="bg-thai-cream/30 mb-4 flex items-center justify-between rounded-lg p-3">
                      <span className="text-thai-green text-lg font-bold">
                        Total de la commande :
                      </span>
                      <span className="text-thai-orange text-xl font-bold">
                        {formatPrix(totalPrix)}
                      </span>
                    </div>

                    <Alert className="mb-4 border-green-200 bg-green-50/50 text-green-800">
                      <CreditCard className="h-4 w-4 text-green-700!" />
                      <AlertDescription className="font-medium">
                        Paiement sur place : Nous acceptons la carte bleue.
                      </AlertDescription>
                    </Alert>

                    <div className="mb-4 space-y-3">
                      <div>
                        <Label htmlFor="demandesSpecialesSidebar" className="text-xs">
                          Demandes spéciales
                        </Label>
                        <Textarea
                          id="demandesSpecialesSidebar"
                          placeholder="Allergies, etc."
                          value={demandesSpeciales}
                          onChange={(e) => setDemandesSpeciales(e.target.value)}
                          className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5 h-16 border text-xs"
                          onBlur={(e) => {
                            if (e.target.value.length > 0) {
                              toastVideo({
                                title: "Message reçu ! 📝",
                                description: "Je prends note de votre demande spéciale.",
                                media: "/media/animations/toasts/ajoutpaniernote.mp4",
                                position: "bottom-right",
                                aspectRatio: "1:1",
                                polaroid: true,
                                borderColor: "thai-green",
                                animateBorder: true,
                                hoverScale: true,
                                duration: 3000,
                              })
                            }
                          }}
                        />
                      </div>
                    </div>

                    <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 mb-4 bg-linear-to-r backdrop-blur-sm">
                      <CardContent className="p-3">
                        <div className="space-y-3 text-center">
                          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                            <p className="text-center text-xs font-medium text-yellow-800">
                              ⏳ Votre commande sera mise en attente de confirmation. Nous la
                              traiterons dans les plus brefs délais.
                            </p>
                          </div>

                          <div className="text-thai-green/80 bg-thai-cream/50 rounded-lg p-2 text-center text-xs">
                            <div className="flex items-center justify-center gap-2">
                              <MapPin className="text-thai-orange h-3 w-3" />
                              <span>
                                Adresse de retrait : 2 impasse de la poste 37120 Marigny Marmande
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-center gap-2">
                              <Phone className="text-thai-orange h-3 w-3" />
                              <span>Contact : 07 49 28 37 07</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>

                  <div
                    id="validate-order-btn"
                    className="shrink-0 rounded-b-lg border-t bg-white p-4"
                  >
                    <Button
                      onClick={validerCommande}
                      disabled={createCommande.isPending || !currentUser || !idclient || !isOnline}
                      className="bg-thai-orange w-full py-6 text-lg transition-all duration-200 hover:scale-105"
                    >
                      {createCommande.isPending ? (
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      ) : (
                        <CreditCard className="mr-2 h-6 w-6" />
                      )}
                      Valider ma commande {formatPrix(totalPrix)}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de commande de plat */}
      {modalContext && (
        <CommandePlatModal
          isOpen={!!modalContext}
          onOpenChange={(open) => {
            if (!open) setModalContext(null)
          }}
          plat={modalContext!.plat}
          formatPrix={formatPrix}
          onAddToCart={handleAjouterAuPanier}
          currentQuantity={modalContext!.quantity}
          currentSpiceDistribution={modalContext!.spiceDistribution}
          dateRetrait={dateRetrait}
          uniqueId={modalContext!.uniqueId}
        />
      )}

      {/* Modal de confirmation pour vider le panier */}
      <ModalVideo
        isOpen={isClearCartModalOpen}
        onOpenChange={setIsClearCartModalOpen}
        title="<orange>Vider</orange> le panier ?"
        description="Êtes-vous sûr de vouloir <bold><orange>supprimer</orange></bold> tous les plats de votre panier ?"
        media="/media/animations/toasts/poubelleok.mp4"
        aspectRatio="1:1"
        polaroid={true}
        buttonLayout="double"
        cancelText="Annuler"
        confirmText="Tout supprimer"
        maxWidth="sm"
        borderColor="thai-orange"
        borderWidth={2}
        shadowSize="2xl"
        onCancel={() => setIsClearCartModalOpen(false)}
        onConfirm={() => {
          viderPanier()
          setIsClearCartModalOpen(false)
          toastVideo({
            title: "Panier vidé 🗑️",
            description: "Votre panier est maintenant vide.",
            media: "/media/animations/toasts/poubelleok.mp4",
            position: "center",
            aspectRatio: "1:1",
            polaroid: true,
            borderColor: "thai-orange",
            animateBorder: true,
            hoverScale: true,
            rotation: true,
          })
        }}
      />
    </AppLayout>
  )
})

Commander.displayName = "Commander"

export default function CommanderPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="text-thai-orange h-8 w-8 animate-spin" />
          </div>
        </AppLayout>
      }
    >
      <Commander />
    </Suspense>
  )
}
