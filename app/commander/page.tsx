"use client"

import { AppLayout } from "@/components/AppLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import { OfflineBannerCompact } from "@/components/OfflineBanner"
import {
  AlertCircle,
  Calendar as CalendarIconLucide,
  ChevronRight,
  Clock,
  CreditCard,
  Flame,
  Loader2,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  Star,
  Trash2,
  X,
} from "lucide-react"
import { memo, useEffect, useMemo, useRef, useState, Suspense } from "react"
import { flushSync } from "react-dom"
import Link from "next/link"
import type { Route } from "next"
import { useQueryState, parseAsString } from "nuqs"

import { Alert, AlertDescription } from "@/components/ui/alert"
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

import { useSession } from "@/lib/auth-client"
import { getClientProfile } from "@/app/profil/actions"
import { useData } from "@/contexts/DataContext"
// Utilisation des hooks
import { useCart } from "@/contexts/CartContext"
import { usePrismaCreateCommande } from "@/hooks/usePrismaData"
import type { PlatUI as Plat, PlatPanier } from "@/types/app"
import { DishDetailsModalInteractive } from "@/components/historique/DishDetailsModalInteractive"
import { FeaturedDishSection } from "@/components/commander/FeaturedDishSection"
import { PolaroidThankYouModal } from "@/components/commander/PolaroidThankYouModal"
import { spiceTextToLevel } from "@/lib/spice-helpers"
import { SpiceDistributionDisplay } from "@/components/commander/SpiceDistributionDisplay"

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
  const { toast } = useToast()
  const isOnline = useOnlineStatus()
  const { plats, isLoading: dataIsLoading, error: dataError } = useData()
  const createCommande = usePrismaCreateCommande()

  // Better Auth session
  const { data: session } = useSession()
  const currentUser = session?.user

  // Client profile (pour obtenir idclient)
  const [clientProfile, setClientProfile] = useState<any>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
  }, [currentUser?.id])

  const idclient = clientProfile?.idclient

  const { panier, ajouterAuPanier, modifierQuantite, supprimerDuPanier, viderPanier, totalPrix } =
    useCart()
  const isMobile = useIsMobile()
  const platsSectionRef = useRef<HTMLDivElement>(null)
  const dayButtonsSectionRef = useRef<HTMLDivElement>(null)

  // États pour la sidebar mobile
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCartCollapsed, setIsCartCollapsed] = useState(true) // Default to collapsed
  const [highlightedPlatId, setHighlightedPlatId] = useState<string | null>(null)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [featuredDishDays, setFeaturedDishDays] = useState<string[]>([])
  const [featuredDish, setFeaturedDish] = useState<any>(null)

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

  // Fonction pour ouvrir le panier et scroller vers les plats
  const handleOpenCart = () => {
    // flushSync force React à mettre à jour le DOM immédiatement
    flushSync(() => {
      setIsCartCollapsed(false)
    })

    // Double requestAnimationFrame = attendre 2 frames pour que le layout soit recalculé
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Fallback : si platsSectionRef n'existe pas, scroller vers les boutons jours
        const targetRef = platsSectionRef.current || dayButtonsSectionRef.current

        if (targetRef) {
          targetRef.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  }

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
    plat: Plat,
    quantite: number = 1,
    spicePreference?: string,
    spiceDistribution?: number[],
    uniqueId?: string
  ) => {
    if (!plat.idplats || !plat.plat || plat.prix === undefined) return

    // Vérifier qu'un jour, une date et une heure sont sélectionnés
    if (!jourSelectionne || !dateRetrait || !heureRetrait) {
      toast({
        title: "Informations requises",
        description: "Veuillez d'abord sélectionner un jour, une date et une heure de retrait.",
        variant: "destructive",
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

    setIsCartCollapsed(false) // Open cart on add

    toast({
      title: uniqueId ? "Panier mis à jour !" : "Plat ajouté !",
      description: `${quantite} ${plat.plat}${quantite > 1 ? "s" : ""} ${uniqueId ? "mis à jour" : "ajouté"}${quantite > 1 ? "s" : ""} à votre panier pour le ${format(
        dateCompleteRetrait,
        "eeee dd MMMM",
        { locale: fr }
      )} à ${heureRetrait}.`,
    })
  }

  const validerCommande = async () => {
    if (!currentUser || !idclient) {
      toast({
        title: "Profil incomplet",
        description: "Veuillez vous connecter et compléter votre profil.",
        variant: "destructive",
      })
      return
    }
    if (panier.length === 0) {
      toast({ title: "Panier vide", variant: "destructive" })
      return
    }

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
      let commandesCreees = 0

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

        // DEBUG: Log les données envoyées
        console.log("🛒 validerCommande - Données envoyées:", {
          dateKey,
          items_count: items.length,
          items: items.map((i) => ({ id: i.id, nom: i.nom, quantite: i.quantite })),
          commandeData,
        })

        await createCommande.mutateAsync(commandeData)

        commandesCreees++
      }

      const totalGeneral = panier.reduce(
        (sum, item) => sum + parseFloat(item.prix || "0") * item.quantite,
        0
      )

      // Ouvrir le modal Polaroid au lieu du toast
      setShowThankYouModal(true)

      // Nettoyer le panier et les états
      viderPanier()
      setDateRetrait(undefined)
      setHeureRetrait("")
      setDemandesSpeciales("")
      setJourSelectionne(null)
      setIsCartCollapsed(true)
    } catch (error: unknown) {
      console.error("Erreur validation commande:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la commande."
      toast({
        title: "Erreur commande",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  if (dataError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">Erreur de chargement: {dataError.message}</Alert>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="bg-gradient-thai min-h-screen px-2 py-8 sm:px-4">
        <div
          className={`mx-auto transition-all duration-500 ${
            panier.length > 0 && !isCartCollapsed
              ? "grid max-w-[95%] grid-cols-1 gap-4 md:grid-cols-[3fr_2fr] md:gap-6 xl:max-w-[1600px]"
              : "max-w-[95%] xl:max-w-6xl"
          }`}
        >
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

            {/* Section 1: Header Pour Commander */}
            <Card className="border-thai-orange/20 relative mb-6 shadow-xl">
              <CardHeader className="from-thai-orange to-thai-gold rounded-t-lg bg-gradient-to-r py-4 text-center text-white">
                <div className="mb-1 flex items-center justify-center">
                  <ShoppingCart className="mr-2 h-7 w-7" />
                  <CardTitle className="text-2xl font-bold">Pour Commander</CardTitle>
                </div>
                <p className="text-xs text-white/90">
                  Horaire : Lundi, Mercredi, Vendredi, Samedi de 18h00 à 20h30
                </p>
              </CardHeader>
              {!isMobile && isCartCollapsed && panier.length > 0 && (
                <div
                  className="group absolute top-1/2 -right-10 -translate-y-1/2 cursor-pointer"
                  onClick={handleOpenCart}
                >
                  <div className="bg-thai-green group-hover:bg-thai-green/80 relative flex h-20 w-20 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
                    <ShoppingCart className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-thai-orange border-thai-gold absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-base font-bold shadow-lg"
                  >
                    {panier.reduce((total, item) => total + item.quantite, 0)}
                  </Badge>
                </div>
              )}
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
                        <p className="mt-4 text-center text-sm text-gray-500">
                          Aucun plat ne correspond à votre recherche.
                        </p>
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
                                    ? format(dateRetrait, "eeee dd MMMM", {
                                        locale: fr,
                                      })
                                    : "Sélectionner une date"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {allowedDates.map((date) => (
                                  <SelectItem key={date.toISOString()} value={date.toISOString()}>
                                    {format(date, "eeee dd MMMM", { locale: fr })}
                                  </SelectItem>
                                ))}
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
                            <img
                              src={
                                featuredDish.photo_du_plat ||
                                "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/default.png"
                              }
                              alt={featuredDish.plat}
                              className="h-full w-full object-cover"
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
                    <div className="py-6 text-center">
                      <Loader2 className="text-thai-orange mx-auto h-6 w-6 animate-spin" />
                    </div>
                  ) : platsDisponibles.length === 0 ? (
                    <div className="bg-thai-cream/30 rounded-lg py-6 text-center">
                      <p className="text-thai-green/70">Aucun plat disponible ce jour-là.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {platsDisponibles.map((plat) => (
                        <DishDetailsModalInteractive
                          key={plat.id}
                          plat={plat}
                          formatPrix={formatPrix}
                          onAddToCart={handleAjouterAuPanier}
                          currentQuantity={getCurrentQuantity(plat.idplats)}
                          dateRetrait={dateRetrait}
                        >
                          <Card
                            className={`border-thai-orange/20 flex cursor-pointer flex-col transition-all duration-300 ${
                              highlightedPlatId === plat.id.toString()
                                ? "ring-thai-orange/50 border-thai-orange scale-105 shadow-lg ring-4"
                                : "hover:border-thai-orange/40 hover:shadow-md"
                            }`}
                            onMouseEnter={() => setHighlightedPlatId(plat.id.toString())}
                            onMouseLeave={() => setHighlightedPlatId(null)}
                          >
                            {plat.photo_du_plat && (
                              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                <img
                                  src={plat.photo_du_plat}
                                  alt={plat.plat}
                                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                                {/* Badge Disponible en haut à gauche */}
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-thai-green px-2 py-0.5 text-xs font-semibold text-white shadow-md">
                                    Disponible
                                  </Badge>
                                </div>
                                {/* Badge Panier en haut à droite */}
                                {getCurrentQuantity(plat.idplats) > 0 && (
                                  <div className="absolute top-2 right-2">
                                    <Badge className="bg-thai-orange px-2 py-0.5 text-xs font-semibold text-white shadow-md">
                                      Panier {getCurrentQuantity(plat.idplats)}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            )}
                            <CardContent className="flex flex-grow flex-col p-3">
                              {/* Nom + Badges sur même ligne */}
                              <div className="mb-1 flex items-center justify-between gap-2">
                                <h4 className="text-thai-green line-clamp-1 flex-1 font-semibold">
                                  {plat.plat}
                                </h4>
                                {(plat.est_vegetarien || (plat.niveau_epice ?? 0) > 0) && (
                                  <div className="flex flex-shrink-0 gap-1">
                                    {plat.est_vegetarien && (
                                      <Badge
                                        variant="outline"
                                        className="h-5 border-green-300 bg-green-50 px-1.5 py-0 text-[10px] text-green-700"
                                      >
                                        🌱 Végétarien
                                      </Badge>
                                    )}
                                    {(plat.niveau_epice ?? 0) > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="flex h-5 items-center gap-0.5 border-orange-300 bg-orange-50 px-1.5 py-0 text-[10px] text-orange-700"
                                      >
                                        <Flame className="h-3 w-3" />
                                        Peut être épicé
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>

                              <p className="mb-2 flex-grow text-xs text-gray-600">
                                {plat.description}
                              </p>
                              <div className="mt-auto flex items-center justify-between pt-2">
                                <Badge variant="secondary">
                                  {formatPrix(parseFloat(plat.prix || "0"))}
                                </Badge>
                                <Button
                                  size="sm"
                                  className="transition-all duration-200 hover:scale-105 hover:shadow-md"
                                >
                                  Ajouter
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </DishDetailsModalInteractive>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                    <p className="text-sm font-medium text-green-800">
                      ✓ Retrait prévu le {format(dateRetrait, "eeee dd MMMM", { locale: fr })} à{" "}
                      {heureRetrait}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Section latérale droite - Panier */}
          {panier.length > 0 && !isCartCollapsed && (
            <div className="w-full">
              {/* Desktop Sidebar - 30% fixe */}
              {!isMobile && (
                <div className="sticky top-8 flex max-h-[calc(100vh-4rem)] flex-col">
                  <Card className="border-thai-orange/20 flex h-full flex-col overflow-hidden shadow-xl">
                    <CardHeader className="from-thai-orange to-thai-gold relative rounded-t-lg bg-gradient-to-r py-4 text-white">
                      <div className="text-center">
                        <div className="mb-1 flex items-center justify-center">
                          <ShoppingCart className="mr-2 h-7 w-7" />
                          <CardTitle className="text-2xl font-bold">Mon Panier</CardTitle>
                        </div>
                        <p className="text-xs text-white/90">
                          {panier.reduce((total, item) => total + item.quantite, 0)} Plat
                          {panier.reduce((total, item) => total + item.quantite, 0) > 1 ? "s" : ""}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsCartCollapsed(true)}
                          className="absolute top-2 right-2 p-1 text-white hover:bg-white/20"
                        >
                          <ChevronRight className="h-4 w-4" />
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
                                      {format(dateRetrait, "eeee dd MMMM", {
                                        locale: fr,
                                      }).replace(/^\w/, (c) => c.toUpperCase())}{" "}
                                      à {format(dateRetrait, "HH:mm")}
                                    </span>
                                  </h4>
                                </div>
                              )}

                              <div className="space-y-3">
                                {items.map((item) => {
                                  const platData = plats?.find((p) => p.id.toString() === item.id)
                                  const imageUrl = platData?.photo_du_plat

                                  return platData ? (
                                    <DishDetailsModalInteractive
                                      key={item.uniqueId}
                                      plat={platData}
                                      formatPrix={formatPrix}
                                      onAddToCart={handleAjouterAuPanier}
                                      currentQuantity={item.quantite}
                                      currentSpiceDistribution={item.spiceDistribution}
                                      dateRetrait={item.dateRetrait}
                                      uniqueId={item.uniqueId}
                                    >
                                      <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 flex transform cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2">
                                        {/* Photo 18x18 avec badge quantité */}
                                        <div className="relative flex-shrink-0">
                                          <div className="bg-thai-orange absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-md">
                                            {item.quantite}
                                          </div>
                                          {imageUrl ? (
                                            <img
                                              src={imageUrl}
                                              alt={item.nom}
                                              className="h-[72px] w-[72px] rounded-lg object-cover"
                                            />
                                          ) : (
                                            <div className="bg-thai-cream/30 border-thai-orange/20 flex h-[72px] w-[72px] items-center justify-center rounded-lg border">
                                              <span className="text-thai-orange text-2xl">🍽️</span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Contenu principal - 2 lignes */}
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                          {/* Ligne 1: Nom → Icônes épicées → Prix total */}
                                          <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-thai-green text-base font-medium">
                                              {item.nom}
                                            </h4>
                                            {item.demandeSpeciale &&
                                              item.demandeSpeciale.includes("épicé") && (
                                                <SpiceDistributionDisplay
                                                  distributionText={item.demandeSpeciale}
                                                />
                                              )}
                                            <div className="text-thai-orange text-lg font-bold whitespace-nowrap">
                                              {formatPrix(parseFloat(item.prix) * item.quantite)}
                                            </div>
                                          </div>

                                          {/* Ligne 2: Prix unitaire (gauche) → Contrôles (droite) */}
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs text-gray-600">
                                              Prix unitaire:{" "}
                                              <span className="font-medium">
                                                {formatPrix(parseFloat(item.prix))}
                                              </span>
                                            </span>
                                            <div className="flex items-center gap-2">
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  supprimerDuPanier(item.uniqueId!)
                                                  toast({
                                                    title: "Article supprimé",
                                                    description: `${item.nom} a été retiré de votre panier.`,
                                                  })
                                                }}
                                                className="h-7 w-7 p-0 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                                                aria-label="Supprimer l'article"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="hover:border-thai-orange h-7 w-7 p-0 transition-all duration-200 hover:scale-110"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  modifierQuantite(
                                                    item.uniqueId!,
                                                    item.quantite - 1
                                                  )
                                                }}
                                              >
                                                -
                                              </Button>
                                              <span className="w-6 text-center text-sm font-bold">
                                                {item.quantite}
                                              </span>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="hover:border-thai-orange h-7 w-7 p-0 transition-all duration-200 hover:scale-110"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  modifierQuantite(
                                                    item.uniqueId!,
                                                    item.quantite + 1
                                                  )
                                                }}
                                              >
                                                +
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </DishDetailsModalInteractive>
                                  ) : (
                                    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 opacity-50">
                                      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-200">
                                        <span className="text-lg text-gray-400">🍽️</span>
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="mb-1 text-base font-medium text-gray-500">
                                          {item.nom}
                                        </h4>
                                        <p className="text-sm text-gray-400">Plat supprimé</p>
                                      </div>
                                      <div className="text-right">
                                        <div className="mb-3 text-lg font-bold text-gray-400">
                                          {formatPrix(parseFloat(item.prix) * item.quantite)}
                                        </div>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() => {
                                            supprimerDuPanier(item.uniqueId!)
                                            toast({
                                              title: "Article supprimé",
                                              description: `${item.nom} a été retiré de votre panier.`,
                                            })
                                          }}
                                          className="h-6 w-6 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )
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
                        <CreditCard className="h-4 w-4 !text-green-700" />
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
                          />
                        </div>
                      </div>

                      <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 mb-4 bg-gradient-to-r backdrop-blur-sm">
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

                    <div className="flex-shrink-0 rounded-b-lg border-t bg-white p-4">
                      <Button
                        onClick={validerCommande}
                        disabled={
                          createCommande.isPending || !currentUser || !idclient || !isOnline
                        }
                        className="bg-thai-orange w-full py-6 text-lg transition-all duration-200 hover:scale-105"
                      >
                        {createCommande.isPending ? (
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        ) : (
                          <CreditCard className="mr-2 h-6 w-6" />
                        )}
                        Valider ma commande ({formatPrix(totalPrix)})
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Mobile - Bouton flottant en bas */}
              {isMobile && panier.length > 0 && (
                <Button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-thai-orange hover:bg-thai-orange/90 fixed right-6 bottom-6 z-50 h-16 w-16 animate-pulse rounded-full shadow-2xl transition-all duration-200 hover:scale-110"
                >
                  <div className="relative flex flex-col items-center">
                    <ShoppingCart className="h-7 w-7" />
                    <Badge
                      variant="secondary"
                      className="bg-thai-gold text-thai-green absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow-lg"
                    >
                      {panier.reduce((total, item) => total + item.quantite, 0)}
                    </Badge>
                  </div>
                </Button>
              )}

              {/* Mobile - Overlay Modal */}
              {isMobile && isCartOpen && (
                <div className="fixed inset-0 z-50 bg-black/50">
                  <div className="absolute inset-0 bg-white">
                    <div className="flex h-full flex-col">
                      <div className="from-thai-orange to-thai-gold bg-gradient-to-r p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ShoppingCart className="mr-2 h-6 w-6" />
                            <h2 className="text-lg font-bold">Mon Panier</h2>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCartOpen(false)}
                            className="text-white hover:bg-white/20"
                          >
                            <X className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
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
                            const totalGroupe = items.reduce(
                              (sum, item) => sum + parseFloat(item.prix) * item.quantite,
                              0
                            )

                            return (
                              <div
                                key={dateKey}
                                className="border-thai-orange/20 bg-thai-cream/20 mb-4 rounded-lg border p-4"
                              >
                                {dateRetrait && (
                                  <div className="border-thai-orange/10 mb-3 border-b pb-2">
                                    <h4 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
                                      <CalendarIconLucide className="text-thai-orange h-5 w-5" />
                                      {format(dateRetrait, "cccc dd MMMM", {
                                        locale: fr,
                                      }).replace(/^\w/, (c) => c.toUpperCase())}{" "}
                                      à {format(dateRetrait, "HH:mm")}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {formatPrix(totalGroupe)} (
                                      {items.reduce((total, item) => total + item.quantite, 0)} plat
                                      {items.reduce((total, item) => total + item.quantite, 0) > 1
                                        ? "s"
                                        : ""}
                                      )
                                    </p>
                                  </div>
                                )}

                                <div className="space-y-3">
                                  {items.map((item) => {
                                    const platData = plats?.find((p) => p.id.toString() === item.id)
                                    const imageUrl = platData?.photo_du_plat

                                    return platData ? (
                                      <DishDetailsModalInteractive
                                        key={item.uniqueId}
                                        plat={platData}
                                        formatPrix={formatPrix}
                                        onAddToCart={handleAjouterAuPanier}
                                        currentQuantity={item.quantite}
                                        currentSpiceDistribution={item.spiceDistribution}
                                        dateRetrait={item.dateRetrait}
                                        uniqueId={item.uniqueId}
                                      >
                                        <div className="flex cursor-pointer items-center gap-3 rounded bg-white/60 p-3 transition-colors hover:bg-white/80">
                                          {imageUrl ? (
                                            <img
                                              src={imageUrl}
                                              alt={item.nom}
                                              className="border-thai-orange/20 h-12 w-12 rounded border object-cover"
                                            />
                                          ) : (
                                            <div className="bg-thai-cream/30 border-thai-orange/20 flex h-12 w-12 items-center justify-center rounded border">
                                              <span className="text-thai-orange">🍽️</span>
                                            </div>
                                          )}

                                          <div className="flex-1">
                                            <p
                                              className="text-thai-green hover:text-thai-orange cursor-pointer text-base font-bold transition-colors"
                                              onMouseEnter={() => setHighlightedPlatId(item.id)}
                                              onMouseLeave={() => setHighlightedPlatId(null)}
                                            >
                                              {item.nom}
                                            </p>
                                            {item.demandeSpeciale &&
                                              item.demandeSpeciale.includes("épicé") && (
                                                <SpiceDistributionDisplay
                                                  distributionText={item.demandeSpeciale}
                                                  className="my-1"
                                                />
                                              )}
                                            <p className="text-thai-orange text-sm font-medium">
                                              {formatPrix(parseFloat(item.prix) * item.quantite)}
                                            </p>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="h-8 w-8 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                modifierQuantite(item.uniqueId!, item.quantite - 1)
                                              }}
                                            >
                                              -
                                            </Button>
                                            <span className="w-6 text-center font-medium">
                                              {item.quantite}
                                            </span>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="h-8 w-8 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                modifierQuantite(item.uniqueId!, item.quantite + 1)
                                              }}
                                            >
                                              +
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                supprimerDuPanier(item.uniqueId!)
                                                toast({
                                                  title: "Article supprimé",
                                                  description: `${item.nom} retiré du panier.`,
                                                })
                                              }}
                                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </DishDetailsModalInteractive>
                                    ) : (
                                      <div className="flex items-center gap-3 rounded bg-white/60 p-3 opacity-50">
                                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200">
                                          <span className="text-gray-400">🍽️</span>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-base font-bold text-gray-500">
                                            {item.nom}
                                          </p>
                                          <p className="text-sm text-gray-400">Plat supprimé</p>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            supprimerDuPanier(item.uniqueId!)
                                            toast({
                                              title: "Article supprimé",
                                              description: `${item.nom} retiré du panier.`,
                                            })
                                          }}
                                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })
                        })()}
                      </div>

                      <div className="border-t bg-white p-4">
                        <div className="text-thai-green mb-4 text-center text-xl font-bold">
                          Total: {formatPrix(totalPrix)}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="demandesSpecialesMobile">Demandes spéciales</Label>
                            <Textarea
                              id="demandesSpecialesMobile"
                              placeholder="Allergies, etc."
                              value={demandesSpeciales}
                              onChange={(e) => setDemandesSpeciales(e.target.value)}
                              className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5 h-20 border"
                            />
                          </div>

                          <Button
                            onClick={() => {
                              validerCommande()
                              setIsCartOpen(false)
                            }}
                            disabled={
                              createCommande.isPending || !currentUser || !idclient || !isOnline
                            }
                            className="bg-thai-orange w-full py-8 text-xl"
                          >
                            {createCommande.isPending ? (
                              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            ) : (
                              <CreditCard className="mr-2 h-6 w-6" />
                            )}
                            Valider ({formatPrix(totalPrix)})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Polaroid Remerciement */}
      <PolaroidThankYouModal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
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
