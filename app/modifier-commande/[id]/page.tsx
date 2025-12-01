"use client"

import { ExtraDetailsModalInteractive } from "@/components/historique/ExtraDetailsModalInteractive"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { CommandePlatModal } from "@/components/shared/CommandePlatModal"
import { ProductCard } from "@/components/shared/ProductCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import {
  AlertCircle,
  ArrowLeft,
  Calendar as CalendarIconLucide,
  ChevronRight,
  Clock,
  CreditCard,
  Edit,
  Loader2,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { memo, useEffect, useMemo, useRef, useState } from "react"

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

import { getClientProfile } from "@/app/profil/actions"
import { useData } from "@/contexts/DataContext"
import {
  usePrismaCommandeById,
  usePrismaCreateCommande,
  usePrismaDeleteCommande,
  usePrismaExtras,
  usePrismaUpdateCommande,
} from "@/hooks/usePrismaData"
import { useSession } from "@/lib/auth-client"
import { extractRouteParam } from "@/lib/params-utils"
import { toSafeNumber } from "@/lib/serialization"
import type { DetailCommande, ExtraUI, PlatUI as Plat, PlatPanier } from "@/types/app"

const dayNameToNumber: { [key: string]: Day } = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
}

const ModifierCommande = memo(() => {
  const params = useParams()
  const id = extractRouteParam(params?.id)
  const router = useRouter()
  const { toast } = useToast()
  const { plats, isLoading: dataIsLoading } = useData()
  const { data: session, isPending: isLoadingAuth } = useSession()
  const currentUser = session?.user
  const [clientProfile, setClientProfile] = useState<any>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
  }, [currentUser?.id])

  const {
    data: commande,
    isLoading: isLoadingCommande,
    error: commandeError,
  } = usePrismaCommandeById(id ? Number(id) : undefined)
  const createCommande = usePrismaCreateCommande()
  const deleteCommande = usePrismaDeleteCommande()
  const updateCommande = usePrismaUpdateCommande()
  const { data: extras } = usePrismaExtras()
  const isMobile = useIsMobile()
  const platsSectionRef = useRef<HTMLDivElement>(null)

  // États pour la modification
  const [panierModification, setPanierModification] = useState<PlatPanier[]>([])
  const [jourSelectionne, setJourSelectionne] = useState<string>("")
  const [dateRetrait, setDateRetrait] = useState<Date | undefined>()
  const [heureRetrait, setHeureRetrait] = useState<string>("")
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>("")
  const [allowedDates, setAllowedDates] = useState<Date[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  // États pour la UI mobile et sidebar
  const [isCartCollapsed, setIsCartCollapsed] = useState(true)
  const [highlightedPlatId, setHighlightedPlatId] = useState<string | null>(null)
  const [originalData, setOriginalData] = useState<{
    panierOriginal: PlatPanier[]
    dateOriginale: Date | undefined
    heureOriginale: string
    demandesOriginales: string
  } | null>(null)

  // State for the shared modal
  const [selectedPlat, setSelectedPlat] = useState<Plat | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (plat: Plat) => {
    setSelectedPlat(plat)
    setIsModalOpen(true)
  }

  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setTimeout(() => setSelectedPlat(null), 300) // Delay to allow animation to finish
    }
  }

  // Vérifier permissions
  useEffect(() => {
    // Autoriser si l'utilisateur est admin OU le propriétaire de la commande
    if (
      commande &&
      clientProfile &&
      clientProfile.role !== "admin" &&
      clientProfile.idclient !== commande.client_r_id
    ) {
      toast({
        title: "Accès non autorisé",
        description: "Vous n'êtes ni le propriétaire de cette commande, ni un administrateur.",
        variant: "destructive",
      })
      router.push("/historique")
    }
  }, [commande, clientProfile, router, toast])

  // Fonction pour formater les prix
  const formatPrix = (prix: any): string => {
    const numericPrix = toSafeNumber(prix)
    if (numericPrix % 1 === 0) {
      return `${numericPrix.toFixed(0)}€`
    } else {
      return `${numericPrix.toFixed(2).replace(".", ",")}€`
    }
  }

  // Fonction pour obtenir la bonne photo URL pour un item
  const getItemPhotoUrl = (item: PlatPanier): string | undefined => {
    // Si c'est un extra (extra), utiliser la photo de la table extras_db
    if (item.type === "extra" && extras) {
      // Extraire l'ID de l'extra depuis l'ID du panier (format: "extra-123")
      const extraId = parseInt(item.id.replace("extra-", "")) || 0
      const extraData = extras.find((extra: ExtraUI) => extra.idextra === extraId)
      return (
        extraData?.photo_url ??
        "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
      )
    }
    // Sinon, utiliser la photo du plat normal
    const platData = plats?.find((p) => p.idplats.toString() === item.id)
    return platData?.photo_du_plat ?? undefined
  }

  // Initialiser les données de la commande
  useEffect(() => {
    if (commande && plats && extras && commande.details && commande.details.length > 0) {
      const platsPanier: PlatPanier[] = []

      commande.details.forEach((detail: DetailCommande, index: number) => {
        if (detail.quantite_plat_commande) {
          // Utiliser les données enrichies du hook usePrismaCommandesByClient
          // La logique d'enrichissement y est déjà appliquée

          // Vérifier si c'est un extra (nouvelle architecture)
          const isExtra = !!detail.extra

          if (isExtra) {
            // Utiliser les données enrichies (extra, nom_plat, prix_unitaire)
            const extraNom = detail.extra?.nom_extra || "Extra"
            const extraPrix = toSafeNumber(detail.extra?.prix)
            const extraId = detail.extra?.idextra

            console.log("Extra détecté:", { extraNom, extraPrix, extraId, detail })

            platsPanier.push({
              id: `extra-${extraId}`,
              nom: extraNom,
              prix: extraPrix.toString(),
              quantite: detail.quantite_plat_commande,
              dateRetrait: commande.date_et_heure_de_retrait_souhaitees
                ? new Date(commande.date_et_heure_de_retrait_souhaitees)
                : new Date(),
              jourCommande: "",
              uniqueId: `extra-${extraId}-${Date.now()}`,
              type: "extra",
            })
          } else {
            // Gérer les plats normaux
            const platData = detail.plat || plats.find((p) => p.idplats === detail.plat_r)
            if (platData) {
              platsPanier.push({
                id: platData.idplats.toString(),
                nom: platData.plat,
                prix: platData.prix?.toString() || "0", // Ensure it's a string
                quantite: detail.quantite_plat_commande,
                dateRetrait: commande.date_et_heure_de_retrait_souhaitees
                  ? new Date(commande.date_et_heure_de_retrait_souhaitees)
                  : new Date(),
                jourCommande: "",
                uniqueId: `${platData.idplats}-${index}-${Date.now()}`,
                type: "plat",
              })
            }
          }
        }
      })

      console.log("Initialisation panier modification:", platsPanier)
      setPanierModification(platsPanier)

      // Initialiser la date et l'heure
      let dateInit: Date | undefined
      let heureInit = ""
      if (commande.date_et_heure_de_retrait_souhaitees) {
        const dateCommande = new Date(commande.date_et_heure_de_retrait_souhaitees)
        dateInit = dateCommande
        setDateRetrait(dateCommande)
        heureInit = format(dateCommande, "HH:mm")
        setHeureRetrait(heureInit)

        const jourDate = format(dateCommande, "eeee", { locale: fr }).toLowerCase()
        setJourSelectionne(jourDate)
      }

      const demandesInit = commande.demande_special_pour_la_commande || ""
      setDemandesSpeciales(demandesInit)

      // Sauvegarder les données originales pour la restauration
      setOriginalData({
        panierOriginal: [...platsPanier],
        dateOriginale: dateInit,
        heureOriginale: heureInit,
        demandesOriginales: demandesInit,
      })

      // Ouvrir automatiquement la sidebar si il y a des articles
      if (platsPanier.length > 0) {
        setIsCartCollapsed(false)
      }
    }
  }, [commande, plats, extras])

  // Vérifier les changements
  useEffect(() => {
    if (!commande) return

    const originalTotal =
      commande.details?.reduce((total: number, detail: DetailCommande) => {
        const quantite = detail.quantite_plat_commande || 0
        let prixUnitaire = 0

        // Gérer les extras vs plats normaux (nouvelle architecture)
        const isExtra = !!detail.extra
        if (isExtra) {
          prixUnitaire = toSafeNumber(detail.extra?.prix || detail.prix_unitaire)
        } else {
          prixUnitaire = toSafeNumber(detail.plat?.prix || detail.prix_unitaire)
        }

        return total + prixUnitaire * quantite
      }, 0) || 0

    const newTotal = panierModification.reduce(
      (total, item) => total + toSafeNumber(item.prix) * item.quantite,
      0
    )

    const dateChanged = commande.date_et_heure_de_retrait_souhaitees
      ? !dateRetrait ||
        !isSameDay(new Date(commande.date_et_heure_de_retrait_souhaitees), dateRetrait)
      : dateRetrait !== undefined

    const heureChanged = commande.date_et_heure_de_retrait_souhaitees
      ? heureRetrait !== format(new Date(commande.date_et_heure_de_retrait_souhaitees), "HH:mm")
      : heureRetrait !== ""

    const demandesChanged = (commande.demande_special_pour_la_commande || "") !== demandesSpeciales
    const totalChanged = Math.abs(originalTotal - newTotal) > 0.01
    const articlesChanged = (commande.details?.length || 0) !== panierModification.length

    setHasChanges(dateChanged || heureChanged || demandesChanged || totalChanged || articlesChanged)
  }, [commande, panierModification, dateRetrait, heureRetrait, demandesSpeciales])

  const platsDisponibles = useMemo(() => {
    if (!jourSelectionne || !plats) return []
    const champDispoKey = `${jourSelectionne.toLowerCase()}_dispo` as keyof Plat
    return plats.filter(
      (plat) => plat[champDispoKey] === "oui" && plat.idplats !== 0 // Exclure les anciens extras
    )
  }, [jourSelectionne, plats])

  // Extras disponibles (toujours disponibles)
  const extrasDisponibles = useMemo(() => {
    if (!extras) return []
    return extras.filter((extra) => extra.est_disponible)
  }, [extras])

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

  useEffect(() => {
    if (jourSelectionne && jourSelectionne in dayNameToNumber) {
      const targetDayNumber = dayNameToNumber[jourSelectionne]
      const today = startOfDay(new Date())
      const calculatedDates: Date[] = []

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
      setTimeout(() => {
        platsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [jourSelectionne, dateRetrait, heureRetrait])

  const handleAjouterAuPanier = (plat: Plat) => {
    if (!plat.idplats || !plat.plat || plat.prix === undefined) return

    if (!jourSelectionne || !dateRetrait || !heureRetrait) {
      toast({
        title: "Informations requises",
        description: "Veuillez d'abord sélectionner un jour, une date et une heure de retrait.",
        variant: "destructive",
      })
      return
    }

    const dateCompleteRetrait = new Date(dateRetrait)
    const [heures, minutes] = heureRetrait.split(":")
    dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0)

    const newItem: PlatPanier = {
      id: plat.idplats.toString(),
      nom: plat.plat,
      prix: plat.prix ?? "0",
      quantite: 1,
      jourCommande: jourSelectionne,
      dateRetrait: dateCompleteRetrait,
      uniqueId: `${plat.idplats}-${Date.now()}`,
      type: "plat",
    }

    setPanierModification((prev) => [...prev, newItem])

    // Ouvrir automatiquement le panier sur ajout d'article
    if (!isCartCollapsed) {
      setIsCartCollapsed(false)
    }

    toast({
      title: "Plat ajouté !",
      description: `${plat.plat} a été ajouté à votre commande modifiée.`,
    })
  }

  const handleAjouterExtraAuPanier = (extra: any) => {
    if (!extra.idextra || !extra.nom_extra || extra.prix === undefined) return

    if (!dateRetrait || !heureRetrait) {
      toast({
        title: "Informations requises",
        description: "Veuillez d'abord sélectionner une date et une heure de retrait.",
        variant: "destructive",
      })
      return
    }

    const dateCompleteRetrait = new Date(dateRetrait)
    const [heures, minutes] = heureRetrait.split(":")
    dateCompleteRetrait.setHours(parseInt(heures), parseInt(minutes), 0, 0)

    const newItem: PlatPanier = {
      id: `extra-${extra.idextra}`,
      nom: extra.nom_extra,
      prix: extra.prix?.toString() ?? "0",
      quantite: 1,
      jourCommande: jourSelectionne || "",
      dateRetrait: dateCompleteRetrait,
      uniqueId: `extra-${extra.idextra}-${Date.now()}`,
      type: "extra",
    }

    setPanierModification((prev) => [...prev, newItem])

    // Ouvrir automatiquement le panier sur ajout d'article
    if (!isCartCollapsed) {
      setIsCartCollapsed(false)
    }

    toast({
      title: "Extra ajouté !",
      description: `${extra.nom_extra} a été ajouté à votre commande modifiée.`,
    })
  }

  const totalPrixModification = useMemo(() => {
    return panierModification.reduce(
      (total, item) => total + toSafeNumber(item.prix) * item.quantite,
      0
    )
  }, [panierModification])

  // Loading states
  if (isLoadingAuth || isLoadingCommande || dataIsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-thai-orange h-16 w-16 animate-spin" />
      </div>
    )
  }

  // Error states
  if (commandeError || !commande) {
    return (
      <div className="bg-gradient-thai flex h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Impossible de charger cette commande.</AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/historique">Retour à l'historique</Link>
          </Button>
        </Alert>
      </div>
    )
  }

  if (
    commande.statut_commande &&
    !["En attente de confirmation", "Confirmée", "Annulée"].includes(commande.statut_commande)
  ) {
    return (
      <div className="bg-gradient-thai flex h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cette commande ne peut plus être modifiée (statut: {commande.statut_commande}).
          </AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link href={`/suivi-commande/${commande.idcommande}`}>Voir la commande</Link>
          </Button>
        </Alert>
      </div>
    )
  }

  const modifierQuantiteItem = (uniqueId: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) {
      setPanierModification((prev) => prev.filter((item) => item.uniqueId !== uniqueId))
      return
    }
    setPanierModification((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, quantite: nouvelleQuantite } : item
      )
    )
  }

  const supprimerDuPanierItem = (uniqueId: string) => {
    setPanierModification((prev) => prev.filter((item) => item.uniqueId !== uniqueId))
  }

  const restaurerOriginal = () => {
    if (originalData) {
      setPanierModification([...originalData.panierOriginal])
      setDateRetrait(originalData.dateOriginale)
      setHeureRetrait(originalData.heureOriginale)
      setDemandesSpeciales(originalData.demandesOriginales)

      if (originalData.dateOriginale) {
        const jourDate = format(originalData.dateOriginale, "eeee", { locale: fr }).toLowerCase()
        setJourSelectionne(jourDate)
      }

      toast({
        title: "Commande restaurée",
        description: "Les modifications ont été annulées et les données originales restaurées.",
      })
    }
  }

  const sauvegarderModifications = async () => {
    console.log("Début sauvegarde, panier length:", panierModification.length)
    console.log("Commande ID:", commande?.idcommande)

    if (panierModification.length === 0) {
      // Si le panier est vide, mettre la commande en statut "Annulée"
      try {
        console.log("Tentative d'annulation de la commande:", commande.idcommande)

        // Mettre à jour le statut de la commande à "Annulée" via Prisma
        await updateCommande.mutateAsync({
          id: commande.idcommande,
          data: {
            statut_commande: "Annulée",
            notes_internes: "Commande annulée - panier vidé par le client",
          },
        })

        console.log("Annulation réussie")
        toast({
          title: "Commande annulée",
          description: "La commande a été annulée car elle était vide.",
        })

        // Navigation immédiate
        router.push("/historique")
        return
      } catch (error: unknown) {
        console.error("Erreur annulation commande:", error)
        const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'annulation."
        toast({
          title: "Erreur annulation",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }
    }

    if (!clientProfile?.idclient) {
      toast({
        title: "Erreur utilisateur",
        description: "Impossible d'identifier l'utilisateur.",
        variant: "destructive",
      })
      return
    }

    try {
      // Annuler l'ancienne commande d'abord
      console.log("Annulation de l'ancienne commande avant création:", commande.idcommande)

      // Mettre à jour le statut de la commande à "Annulée" via Prisma
      await updateCommande.mutateAsync({
        id: commande.idcommande,
        data: {
          statut_commande: "Annulée",
          notes_internes: "Commande annulée - modifiée par le client",
        },
      })

      // Attendre un peu pour que la mise à jour soit effective
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Grouper les articles par date de retrait
      const groupedByDate = panierModification.reduce(
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

      let commandesCreees = 0
      let derniereCommandeId: number | null = null

      // Créer une commande pour chaque date de retrait
      for (const [dateKey, items] of Object.entries(groupedByDate)) {
        if (!dateKey) continue

        const nouvelleCommande = await createCommande.mutateAsync({
          client_r_id: clientProfile.idclient,
          date_et_heure_de_retrait_souhaitees: dateKey,
          demande_special_pour_la_commande: demandesSpeciales,
          details: items.map((item) => {
            // Distinguer les extras des plats normaux
            if (item.id.startsWith("extra-")) {
              const extraId = parseInt(item.id.replace("extra-", "")) || 0
              return {
                plat_r: null, // Maintenant null car plat_r est optionnel
                extra_id: extraId, // Utiliser le nouveau champ extra_id
                quantite_plat_commande: item.quantite,
                nom_plat: item.nom,
                prix_unitaire: item.prix,
                type: "extra",
              }
            } else {
              return {
                plat_r: parseInt(item.id),
                extra_id: null, // Null pour les plats normaux
                quantite_plat_commande: item.quantite,
              }
            }
          }),
        })

        commandesCreees++
        derniereCommandeId = nouvelleCommande.idcommande
      }

      const totalGeneral = panierModification.reduce(
        (sum, item) => sum + toSafeNumber(item.prix) * item.quantite,
        0
      )

      toast({
        title: "Commande(s) modifiée(s) !",
        description: `${commandesCreees} nouvelle${commandesCreees > 1 ? "s" : ""} commande${commandesCreees > 1 ? "s ont" : " a"} été créée${commandesCreees > 1 ? "s" : ""} (${formatPrix(totalGeneral)}).`,
      })

      // Rediriger vers la dernière commande créée ou vers l'historique si plusieurs commandes
      if (commandesCreees === 1 && derniereCommandeId) {
        router.push(`/suivi-commande/${derniereCommandeId}`)
      } else {
        router.push("/historique")
      }
    } catch (error: unknown) {
      console.error("Erreur modification commande:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de la modification."
      toast({
        title: "Erreur modification",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-gradient-thai min-h-screen px-4 py-8">
      <div
        className={`container mx-auto transition-all duration-500 ${
          panierModification.length > 0 && !isCartCollapsed
            ? "grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2"
            : "max-w-5xl"
        }`}
      >
        {/* Section principale - Modification */}
        <div
          className={panierModification.length > 0 && !isCartCollapsed ? "lg:col-span-1" : "w-full"}
        >
          {/* Header avec navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              asChild
              variant="outline"
              className="group transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Link
                href={`/suivi-commande/${commande.idcommande}`}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour au suivi
              </Link>
            </Button>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge
                  variant="secondary"
                  className="animate-pulse border-orange-300 bg-orange-100 text-orange-800"
                >
                  Modifications non sauvegardées
                </Badge>
              )}
              {hasChanges && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={restaurerOriginal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Restaurer
                </Button>
              )}
            </div>
          </div>

          {/* Bouton panier flottant mobile */}
          {!isMobile && isCartCollapsed && panierModification.length > 0 && (
            <div
              className="group fixed top-1/2 right-0 z-40 -translate-y-1/2 cursor-pointer"
              onClick={() => setIsCartCollapsed(false)}
            >
              <div className="bg-thai-green group-hover:bg-thai-green/80 relative flex h-20 w-20 items-center justify-center rounded-l-full shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
                <Edit className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <Badge
                variant="secondary"
                className="text-thai-orange border-thai-gold absolute -top-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-base font-bold shadow-lg"
              >
                {panierModification.reduce((total, item) => total + item.quantite, 0)}
              </Badge>
            </div>
          )}

          {/* Header de modification */}
          <Card className="border-thai-orange/20 mb-6 shadow-xl">
            <CardHeader className="from-thai-orange to-thai-gold rounded-t-lg bg-linear-to-r py-4 text-center text-white">
              <div className="mb-1 flex items-center justify-center">
                <Edit className="mr-2 h-7 w-7" />
                <CardTitle className="text-2xl font-bold">
                  Modifier la Commande #{commande.idcommande}
                </CardTitle>
              </div>
              <p className="text-xs text-white/90">
                Statut: {commande.statut_commande || "En attente"}
              </p>
            </CardHeader>
          </Card>

          {/* Section date/heure et sélection du jour */}
          <Card className="border-thai-orange/20 mb-6 shadow-xl">
            <CardContent className="p-6">
              {dateRetrait && heureRetrait && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                  <p className="text-sm font-medium text-green-800">
                    ✓ Retrait prévu le {format(dateRetrait, "eeee dd MMMM", { locale: fr })} à{" "}
                    {heureRetrait}
                  </p>
                </div>
              )}
              <h3 className="text-thai-green mb-4 text-lg font-semibold">
                Modifier la date ou heure de retrait :
              </h3>
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="dateRetrait">Date de retrait *</Label>
                  <Select
                    onValueChange={(value: string) => setDateRetrait(new Date(value))}
                    value={dateRetrait?.toISOString() || ""}
                  >
                    <SelectTrigger className={cn(!dateRetrait && "text-muted-foreground")}>
                      <CalendarIconLucide className="mr-2 h-4 w-4" />
                      <SelectValue>
                        {dateRetrait
                          ? format(dateRetrait, "eeee dd MMMM", { locale: fr })
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
                  <Label htmlFor="heureRetrait">Heure de retrait *</Label>
                  <Select onValueChange={setHeureRetrait} value={heureRetrait}>
                    <SelectTrigger className={cn(!heureRetrait && "text-green-700")}>
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
                </div>
              </div>

              <div>
                <Label className="text-md text-thai-green mb-3 block font-semibold">
                  Ou choisissez un autre jour de la semaine pour modifier le menu :
                </Label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {joursOuverture.map((jour) => (
                    <Button
                      key={jour.value}
                      variant={jourSelectionne === jour.value ? "default" : "outline"}
                      onClick={() => setJourSelectionne(jour.value)}
                      className={cn(
                        "rounded-md px-4 py-2 text-sm transition-all duration-200 hover:scale-105 sm:px-5 sm:py-2.5",
                        jourSelectionne === jour.value
                          ? "bg-thai-orange text-white"
                          : "border-thai-orange text-thai-orange hover:bg-thai-orange/10 bg-white"
                      )}
                    >
                      {jour.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles actuels - Version principale (toujours visible) */}
          <Card className="border-thai-orange/20 mb-6 shadow-xl">
            <CardContent className="p-6">
              {panierModification.length === 0 ? (
                <div className="border-thai-orange/30 bg-thai-cream/20 rounded-lg border border-dashed py-12 text-center">
                  <ShoppingCart className="text-thai-orange/50 mx-auto mb-3 h-12 w-12" />
                  <p className="text-thai-green font-medium">Aucun article dans cette commande.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    const groupedByDate = panierModification.reduce(
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
                            <div className="border-thai-orange/10 mb-2 border-b pb-2">
                              <h4 className="text-thai-green flex items-center gap-2 text-base font-semibold">
                                <CalendarIconLucide className="text-thai-orange h-4 w-4" />
                                Retrait prévu le{" "}
                                <span className="text-thai-orange font-bold">
                                  {format(dateRetrait, "eeee dd MMMM", { locale: fr }).replace(
                                    /^\w/,
                                    (c) => c.toUpperCase()
                                  )}{" "}
                                  à {format(dateRetrait, "HH:mm")}
                                </span>
                              </h4>
                            </div>
                          )}

                          <div className="space-y-3">
                            {items.map((item) => {
                              return (
                                <CartItemCard
                                  key={item.uniqueId}
                                  name={item.nom}
                                  imageUrl={getItemPhotoUrl(item)}
                                  unitPrice={toSafeNumber(item.prix)}
                                  quantity={item.quantite}
                                  onQuantityChange={(newQty) =>
                                    modifierQuantiteItem(item.uniqueId!, newQty)
                                  }
                                  onRemove={() => {
                                    supprimerDuPanierItem(item.uniqueId!)
                                    toast({
                                      title: "Article supprimé",
                                      description: `${item.nom} a été retiré de votre commande.`,
                                    })
                                  }}
                                  readOnly={false}
                                  className="border-thai-orange/10"
                                />
                              )
                            })}
                          </div>
                        </div>
                      )
                    })
                  })()}

                  <div className="bg-thai-cream/30 mb-4 flex items-center justify-between rounded-lg p-4">
                    <span className="text-thai-green text-lg font-bold">
                      Total de la commande :
                    </span>
                    <span className="text-thai-orange text-xl font-bold">
                      {formatPrix(totalPrixModification)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demandes spéciales */}
          <Card className="border-thai-orange/20 mb-6 shadow-xl">
            <CardContent className="p-6">
              <div>
                <Label
                  htmlFor="demandesSpeciales"
                  className="text-thai-green mb-3 block text-lg font-semibold"
                >
                  Demandes spéciales
                </Label>
                <Textarea
                  id="demandesSpeciales"
                  placeholder="Allergies, préférences alimentaires..."
                  value={demandesSpeciales}
                  onChange={(e) => setDemandesSpeciales(e.target.value)}
                  className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5 border"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations de retrait modifiées */}
          <Card className="border-thai-orange/20 mb-6 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-thai-green mb-4 flex items-center gap-2 text-lg font-semibold">
                <Clock className="text-thai-orange h-5 w-5" />
                Informations de retrait
              </h3>
              <div className="bg-thai-cream/30 space-y-4 rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-500">
                      Date et heure de retrait :
                    </p>
                    <div className="space-y-1">
                      <p className="text-thai-green font-medium">
                        {commande.date_et_heure_de_retrait_souhaitees
                          ? format(
                              new Date(commande.date_et_heure_de_retrait_souhaitees),
                              "eeee dd MMMM yyyy à HH:mm",
                              { locale: fr }
                            )
                          : "Non définie"}
                      </p>
                      {dateRetrait && heureRetrait && (
                        <p className="text-thai-orange font-bold">
                          {format(dateRetrait, "eeee dd MMMM yyyy", { locale: fr })} à{" "}
                          {heureRetrait}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                    <p className="flex items-center justify-center gap-2 text-sm font-medium text-green-800">
                      <CreditCard className="h-4 w-4" />
                      Paiement sur place : Nous acceptons la carte bleue.
                    </p>
                  </div>

                  <div className="text-thai-green/80 bg-thai-cream/50 space-y-1 rounded-lg p-3 text-center text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="text-thai-orange h-4 w-4" />
                      <span>Adresse de retrait : </span>
                      <Link
                        href="/nous-trouver"
                        className="text-thai-orange hover:text-thai-orange/80 decoration-thai-orange/50 hover:decoration-thai-orange font-semibold underline transition-colors duration-200"
                      >
                        2 impasse de la poste 37120 Marigny Marmande
                      </Link>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="text-thai-orange h-4 w-4" />
                      <span>Contact : 07 49 28 37 07</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-center text-sm font-medium text-yellow-800">
                      ⏳ Votre commande sera remise en attente de confirmation. Nous la traiterons
                      dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="border-thai-orange text-thai-orange hover:bg-thai-orange flex-1 py-6 hover:text-white"
            >
              <Link href={`/suivi-commande/${commande.idcommande}`}>Annuler les modifications</Link>
            </Button>
            <Button
              onClick={sauvegarderModifications}
              disabled={createCommande.isPending || deleteCommande.isPending || !hasChanges}
              className="bg-thai-orange flex-1 py-6 text-lg"
            >
              {createCommande.isPending || deleteCommande.isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              {panierModification.length === 0
                ? "Annuler la commande"
                : `Sauvegarder (${formatPrix(totalPrixModification)})`}
            </Button>
          </div>
        </div>

        {/* Section latérale droite - Panier de modification */}
        {panierModification.length > 0 && !isCartCollapsed && (
          <div className="lg:col-span-1">
            {/* Desktop Sidebar */}
            {!isMobile && (
              <div className="sticky top-8 h-fit w-full">
                <Card className="border-thai-orange/20 animate-fade-in shadow-xl">
                  <CardHeader className="from-thai-orange to-thai-gold relative rounded-t-lg bg-linear-to-r py-4 text-white">
                    <div className="text-center">
                      <div className="mb-1 flex items-center justify-center">
                        <Edit className="mr-2 h-7 w-7 animate-pulse" />
                        <CardTitle className="text-2xl font-bold">Modifications</CardTitle>
                      </div>
                      <p className="text-xs text-white/90">
                        {jourSelectionne
                          ? `Plats & Extras disponibles le ${
                              jourSelectionne.charAt(0).toUpperCase() + jourSelectionne.slice(1)
                            }${
                              dateRetrait
                                ? ` ${format(dateRetrait, "dd MMMM", { locale: fr })}`
                                : ""
                            }`
                          : `${panierModification.reduce(
                              (total, item) => total + item.quantite,
                              0
                            )} Article${
                              panierModification.reduce((total, item) => total + item.quantite, 0) >
                              1
                                ? "s"
                                : ""
                            }`}
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

                  <CardContent className="p-4">
                    {/* Section plats disponibles dans le sidebar */}
                    {jourSelectionne && dateRetrait && heureRetrait && (
                      <div className="mb-6">
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
                          <div className="grid grid-cols-2 gap-3">
                            {platsDisponibles.map((plat) => {
                              // Calculer la quantité actuelle de ce plat dans le panier
                              const currentQuantity = panierModification
                                .filter((item) => item.id === plat.id.toString())
                                .reduce((total, item) => total + item.quantite, 0)

                              return (
                                <ProductCard
                                  key={plat.id}
                                  title={plat.plat}
                                  description={plat.description || ""}
                                  price={toSafeNumber(plat.prix)}
                                  imageSrc={plat.photo_du_plat || undefined}
                                  quantityInCart={currentQuantity}
                                  onAdd={() => handleOpenModal(plat)}
                                  className={
                                    highlightedPlatId === plat.id.toString()
                                      ? "ring-thai-orange/50 border-thai-orange scale-105 shadow-lg ring-2"
                                      : ""
                                  }
                                />
                              )
                            })}
                          </div>
                        )}

                        {/* Modal Global pour l'ajout de plats */}
                        {selectedPlat && (
                          <CommandePlatModal
                            plat={selectedPlat}
                            isOpen={isModalOpen}
                            onOpenChange={handleCloseModal}
                            formatPrix={formatPrix}
                            onAddToCart={(plat, quantity, spicePreference, spiceDistribution) => {
                              if (dateRetrait && heureRetrait) {
                                // Logique d'ajout au panier similaire à handleAjouterAuPanier mais avec quantité
                                const newItem: PlatPanier = {
                                  id: plat.idplats.toString(),
                                  nom: plat.plat,
                                  prix: plat.prix ?? "0",
                                  quantite: quantity,
                                  jourCommande: jourSelectionne || "",
                                  dateRetrait: new Date(dateRetrait.getTime()),
                                  uniqueId: `${plat.idplats}-${Date.now()}`,
                                  type: "plat",
                                  // Ajouter les infos d'épices si nécessaire (pas supporté par PlatPanier actuellement ?)
                                  // Pour l'instant on ignore spicePreference/Distribution car PlatPanier ne semble pas le stocker
                                  // TODO: Ajouter le support des épices dans PlatPanier si demandé
                                }

                                setPanierModification((prev) => [...prev, newItem])

                                if (!isCartCollapsed) {
                                  setIsCartCollapsed(false)
                                }

                                toast({
                                  title: "Plat ajouté !",
                                  description: `${plat.plat} (x${quantity}) a été ajouté à votre commande.`,
                                })
                              }
                            }}
                            dateRetrait={dateRetrait}
                          />
                        )}

                        {/* Section extras disponibles */}
                        {extrasDisponibles.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-thai-green mb-4 flex items-center gap-2 text-lg font-semibold">
                              <span className="text-thai-gold">⭐</span>
                              Extras disponibles :
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              {extrasDisponibles.map((extra: ExtraUI) => {
                                // Calculer la quantité actuelle de cet extra dans le panier
                                const currentQuantity = panierModification
                                  .filter((item) => item.id === `extra-${extra.idextra}`)
                                  .reduce((total, item) => total + item.quantite, 0)

                                // Fonction pour ajouter un extra au panier de modification
                                const handleAddExtraToCart = (
                                  extraToAdd: any,
                                  quantity: number
                                ) => {
                                  if (dateRetrait && heureRetrait) {
                                    const newItem: PlatPanier = {
                                      id: `extra-${extraToAdd.idextra}`,
                                      nom: extraToAdd.nom_extra,
                                      prix: extraToAdd.prix || "0",
                                      quantite: quantity,
                                      dateRetrait: new Date(dateRetrait.getTime()),
                                      jourCommande: jourSelectionne || "",
                                      type: "extra",
                                      uniqueId: `extra-${extraToAdd.idextra}-${Date.now()}`,
                                    }
                                    setPanierModification((prev) => [...prev, newItem])
                                    toast({
                                      title: "Extra ajouté",
                                      description: `${extraToAdd.nom_extra} (x${quantity}) a été ajouté à votre commande.`,
                                    })
                                  }
                                }

                                return (
                                  <ExtraDetailsModalInteractive
                                    key={extra.idextra}
                                    extra={{
                                      ...extra,
                                      est_disponible: extra.est_disponible ?? true,
                                    }}
                                    formatPrix={formatPrix}
                                    onAddToCart={handleAddExtraToCart}
                                    currentQuantity={currentQuantity}
                                    dateRetrait={dateRetrait}
                                  >
                                    <div
                                      className={`border-thai-orange/20 from-thai-gold/10 to-thai-orange/10 cursor-pointer rounded-lg border bg-linear-to-br p-3 transition-all duration-300 ${
                                        highlightedPlatId === `extra-${extra.idextra}`
                                          ? "ring-thai-gold/50 border-thai-gold scale-105 shadow-lg ring-2"
                                          : "hover:border-thai-gold/50 hover:shadow-md"
                                      }`}
                                      onMouseEnter={() =>
                                        setHighlightedPlatId(`extra-${extra.idextra}`)
                                      }
                                      onMouseLeave={() => setHighlightedPlatId(null)}
                                    >
                                      {extra.photo_url && (
                                        <div className="mx-auto mb-2 aspect-square w-full overflow-hidden rounded-lg">
                                          <img
                                            src={extra.photo_url}
                                            alt={extra.nom_extra}
                                            className="h-full w-full object-cover"
                                            onError={(
                                              e: React.SyntheticEvent<HTMLImageElement, Event>
                                            ) => {
                                              e.currentTarget.src =
                                                "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
                                            }}
                                          />
                                        </div>
                                      )}
                                      <div className="mb-2 flex items-center gap-1">
                                        <span className="text-thai-gold text-sm">⭐</span>
                                        <h4 className="text-thai-green truncate text-sm font-semibold">
                                          {extra.nom_extra}
                                        </h4>
                                      </div>
                                      {extra.description && (
                                        <p className="mb-2 line-clamp-2 text-xs text-gray-600">
                                          {extra.description}
                                        </p>
                                      )}
                                      <div
                                        className="flex items-center justify-between"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Badge
                                          variant="secondary"
                                          className="bg-thai-gold/20 text-thai-gold border-thai-gold/30 text-xs"
                                        >
                                          {formatPrix(extra.prix)}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                          {currentQuantity > 0 && (
                                            <Badge
                                              variant="outline"
                                              className="bg-thai-orange/10 text-thai-orange border-thai-orange/30 text-xs"
                                            >
                                              {currentQuantity} dans le panier
                                            </Badge>
                                          )}
                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleAjouterExtraAuPanier(extra)
                                            }}
                                            size="sm"
                                            className="bg-thai-gold hover:bg-thai-gold/90 px-2 py-1 text-xs text-white"
                                          >
                                            Ajouter
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </ExtraDetailsModalInteractive>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {dateRetrait && heureRetrait && (
                          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-2 text-center">
                            <p className="text-xs font-medium text-green-800">
                              ✓ Nouveau retrait prévu le{" "}
                              {format(dateRetrait, "eeee dd MMMM", { locale: fr })} à {heureRetrait}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

ModifierCommande.displayName = "ModifierCommande"

export default ModifierCommande
