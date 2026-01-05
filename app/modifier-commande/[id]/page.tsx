"use client"

import { StatusBadge } from "@/components/historique/StatusBadge"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getStorageUrl, STORAGE_DEFAULTS } from "@/lib/storage-utils"
import { cn } from "@/lib/utils"
import { addDays, format, getDay, isFuture, isSameDay, startOfDay, type Day } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertCircle,
  ArrowLeft,
  Calendar as CalendarIconLucide,
  Clock,
  CreditCard,
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
import type { Client, DetailCommande, ExtraUI, PlatUI as Plat, PlatPanier } from "@/types/app"

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
  const [clientProfile, setClientProfile] = useState<Client | null>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then((profile) => setClientProfile(profile as unknown as Client))
    } else {
      setClientProfile(null)
    }
  }, [currentUser, currentUser?.id])

  const {
    data: commande,
    isLoading: isLoadingCommande,
    error: commandeError,
  } = usePrismaCommandeById(id ? Number(id) : undefined)
  const createCommande = usePrismaCreateCommande()
  const deleteCommande = usePrismaDeleteCommande()
  const updateCommande = usePrismaUpdateCommande()
  const { data: extras } = usePrismaExtras()
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
  const [originalData, setOriginalData] = useState<{
    panierOriginal: PlatPanier[]
    dateOriginale: Date | undefined
    heureOriginale: string
    demandesOriginales: string
  } | null>(null)

  const [shouldHighlightDate, setShouldHighlightDate] = useState(false)

  // Calcul du total original pour le comparatif
  const originalTotal = useMemo(() => {
    if (!commande?.details) return 0
    return commande.details.reduce((total: number, detail: DetailCommande) => {
      const quantite = detail.quantite_plat_commande || 0
      const isExtra = !!detail.extra
      const prixUnitaire = isExtra
        ? toSafeNumber(detail.extra?.prix || detail.prix_unitaire)
        : toSafeNumber(detail.plat?.prix || detail.prix_unitaire)
      return total + prixUnitaire * quantite
    }, 0)
  }, [commande])

  // State for the shared modal

  // State for the shared modal
  // State for the shared modal
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  // Vérification permissions simple (propriétaire de la commande uniquement)
  const _canEdit = currentUser && String(commande?.client_r_id) === currentUser.id

  // Vérifier permissions
  useEffect(() => {
    // Autoriser si l'utilisateur est admin OU le propriétaire de la commande
    if (
      commande &&
      clientProfile &&
      clientProfile.role !== "admin" &&
      Number(clientProfile.idclient) !== Number(commande.client_r_id)
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
  const formatPrix = (prix: number | string | null | undefined): string => {
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
      return extraData?.photo_url ?? getStorageUrl(STORAGE_DEFAULTS.EXTRA)
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
                spiceDistribution:
                  detail.spice_distribution ||
                  (() => {
                    const qty = detail.quantite_plat_commande
                    const level = detail.preference_epice_niveau ?? 0
                    const dist = [0, 0, 0, 0]
                    if (level >= 0 && level <= 3) {
                      dist[level] = qty
                    } else {
                      dist[0] = qty
                    }
                    return dist
                  })(),
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
        setHeureRetrait("") // Réinitialiser l'heure aussi
        setShouldHighlightDate(true) // Activer le clignotement pour attirer l'attention
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
          client_r_id: Number(clientProfile.idclient),
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
    <div className="bg-gradient-thai min-h-screen px-0 pt-8 pb-40 sm:px-4">
      <div className="w-full sm:container sm:mx-auto sm:max-w-5xl">
        {/* Section principale - Modification */}
        <div className="w-full">
          {/* Header avec navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              asChild
              variant="outline"
              className="group hidden transform transition-all duration-200 hover:scale-105 hover:shadow-lg sm:flex"
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

          {/* Header & Configuration (Fusionné) */}
          <Card className="border-thai-orange/20 mx-0 mb-6 w-full rounded-none border-x-0 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-0 sm:rounded-xl sm:border-x">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                  <DialogTrigger asChild>
                    <div className="relative mx-auto cursor-pointer transition-transform hover:scale-105 sm:mx-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/media/avatars/panier1.svg"
                        alt="Modifier la commande"
                        className="h-24 w-40 rounded-lg border-2 border-amber-200 object-cover shadow-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/10 opacity-0 transition-opacity hover:opacity-100">
                        <Clock className="h-8 w-8 text-white drop-shadow-md" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md overflow-hidden rounded-xl border-0 p-0">
                    <DialogTitle className="sr-only">Animation : Modifier la commande</DialogTitle>
                    <video
                      src="/media/animations/toasts/prisedecommande2.mp4"
                      autoPlay
                      muted
                      playsInline
                      onEnded={() => setIsVideoOpen(false)}
                      className="w-full"
                    />
                  </DialogContent>
                </Dialog>

                <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-thai-green text-xl font-bold sm:text-2xl">
                      Modifier la Commande
                    </CardTitle>
                    <CardDescription className="sr-only">
                      Statut actuel : {commande.statut_commande || "En attente"}
                    </CardDescription>
                  </div>

                  <div className="flex flex-col items-center gap-2 sm:items-end sm:gap-1">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Statut actuel :</span>
                      <StatusBadge statut={commande.statut_commande} type="commande" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-400">N°</span>
                      <div className="bg-thai-green flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ring-2 ring-white ring-offset-1">
                        {commande.idcommande}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Notification Date Retrait */}
              {dateRetrait && heureRetrait && (
                <div className="-mx-6 rounded-none border-x-0 border-y border-green-200 bg-green-50 p-3 text-center sm:mx-0 sm:rounded-lg sm:border">
                  <p className="text-sm font-medium text-green-800">
                    ✓ Retrait prévu le{" "}
                    {format(dateRetrait, "eeee dd MMMM", { locale: fr }).replace(/^\w/, (c) =>
                      c.toUpperCase()
                    )}{" "}
                    à {heureRetrait}
                  </p>
                </div>
              )}

              {/* Sélecteurs Date/Heure */}
              <div>
                <h3 className="text-thai-green mb-4 text-lg font-semibold">
                  Modifier la date ou heure de retrait :
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="dateRetrait">Date de retrait *</Label>
                    <Select
                      onValueChange={(value: string) => {
                        const selectedDate = allowedDates.find(
                          (d) => format(d, "yyyy-MM-dd") === value
                        )
                        if (selectedDate) {
                          setDateRetrait(selectedDate)
                        }
                        if (heureRetrait) setShouldHighlightDate(false)
                      }}
                      value={dateRetrait ? format(dateRetrait, "yyyy-MM-dd") : ""}
                    >
                      <SelectTrigger
                        className={cn(
                          !dateRetrait && "text-muted-foreground",
                          shouldHighlightDate &&
                            !dateRetrait &&
                            "ring-thai-orange animate-pulse ring-2"
                        )}
                      >
                        <CalendarIconLucide className="mr-2 h-4 w-4" />
                        <SelectValue>
                          {dateRetrait
                            ? format(dateRetrait, "eeee dd MMMM", { locale: fr }).replace(
                                /^\w/,
                                (c) => c.toUpperCase()
                              )
                            : "Sélectionner"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {allowedDates.map((date) => (
                          <SelectItem key={date.toISOString()} value={format(date, "yyyy-MM-dd")}>
                            {format(date, "eeee dd MMMM", { locale: fr })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="heureRetrait">Heure de retrait *</Label>
                    <Select
                      onValueChange={(val) => {
                        setHeureRetrait(val)
                        if (dateRetrait) setShouldHighlightDate(false)
                      }}
                      value={heureRetrait}
                    >
                      <SelectTrigger
                        className={cn(
                          !heureRetrait && "text-green-700",
                          shouldHighlightDate &&
                            !heureRetrait &&
                            "ring-thai-orange animate-pulse ring-2"
                        )}
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
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <Label className="text-md text-thai-green mb-3 block font-semibold">
                  Ou choisissez un autre jour de la semaine pour modifier le menu :
                </Label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {joursOuverture.map((jour) => (
                    <Button
                      key={jour.value}
                      variant={jourSelectionne === jour.value ? "default" : "outline"}
                      onClick={() => {
                        const nouveauJour = jour.value
                        setJourSelectionne(nouveauJour)

                        // "Repartir sur une commande vierge" : On vide le panier
                        if (panierModification.length > 0) {
                          setPanierModification([])
                          toast({
                            title: "Nouvelle date, nouveau panier",
                            description: `Le panier a été vidé pour préparer votre commande pour ${jour.label}.`,
                            variant: "default",
                          })
                        }
                        // Ouvrir automatiquement le menu pour ajouter des articles
                        setIsCartCollapsed(false)
                      }}
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
              {panierModification.length === 0 &&
              !dateRetrait &&
              !heureRetrait &&
              !jourSelectionne ? (
                <div className="border-thai-orange/30 bg-thai-cream/20 rounded-lg border border-dashed py-12 text-center">
                  <ShoppingCart className="text-thai-orange/50 mx-auto mb-3 h-12 w-12" />
                  <p className="text-thai-green font-medium">
                    Sélectionnez une date pour voir les articles disponibles.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border-thai-orange/20 bg-thai-cream/20 animate-fade-in hover:border-thai-orange/30 hover:bg-thai-cream/30 mb-4 rounded-lg border p-3 transition-all duration-300 hover:shadow-md">
                    {dateRetrait && heureRetrait && (
                      <div className="border-thai-orange/10 mb-2 border-b pb-2">
                        <h4 className="text-thai-green flex items-center gap-2 text-base font-semibold">
                          <CalendarIconLucide className="text-thai-orange h-4 w-4" />
                          Retrait prévu le{" "}
                          <span className="text-thai-orange font-bold">
                            {format(dateRetrait, "eeee dd MMMM", { locale: fr }).replace(
                              /^\w/,
                              (c) => c.toUpperCase()
                            )}{" "}
                            à {heureRetrait}
                          </span>
                        </h4>
                      </div>
                    )}

                    <div className="space-y-3">
                      {panierModification.map((item) => {
                        // Déterminer si le plat est épicé pour afficher le sélecteur
                        let isSpicyPlat = false
                        if (item.type !== "extra") {
                          const plat = plats?.find((p) => p.idplats.toString() === item.id)
                          const niveauEpice = plat?.niveau_epice ?? 0
                          isSpicyPlat = niveauEpice > 0
                        }

                        // Handler pour la modification de la distribution d'épices
                        const handleSpiceChange = (distribution: number[]) => {
                          setPanierModification((prev) =>
                            prev.map((p) =>
                              p.uniqueId === item.uniqueId
                                ? { ...p, spiceDistribution: distribution }
                                : p
                            )
                          )
                        }

                        return (
                          <CartItemCard
                            key={item.uniqueId}
                            name={item.nom}
                            imageUrl={getItemPhotoUrl(item)}
                            unitPrice={toSafeNumber(item.prix)}
                            quantity={item.quantite}
                            isSpicy={isSpicyPlat}
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
                            showSpiceSelector={isSpicyPlat && item.type !== "extra"}
                            spiceDistribution={item.spiceDistribution}
                            onSpiceDistributionChange={handleSpiceChange}
                            readOnly={false}
                            className="border-thai-orange/10"
                          />
                        )
                      })}

                      {/* Séparateur pour les articles disponibles */}
                      {dateRetrait &&
                        heureRetrait &&
                        (platsDisponibles.length > 0 || extrasDisponibles.length > 0) && (
                          <>
                            <div className="relative my-6 text-center">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                              </div>
                              <span className="bg-thai-cream relative px-4 text-sm text-gray-500">
                                Autres articles disponibles
                              </span>
                            </div>

                            {/* Plats disponibles non commandés */}
                            {platsDisponibles
                              .filter(
                                (plat) =>
                                  !panierModification.some((item) => item.id === plat.id.toString())
                              )
                              .map((plat) => (
                                <CartItemCard
                                  key={`available-plat-${plat.id}`}
                                  name={plat.plat}
                                  imageUrl={plat.photo_du_plat || undefined}
                                  unitPrice={toSafeNumber(plat.prix)}
                                  quantity={0}
                                  isSpicy={plat.niveau_epice ? plat.niveau_epice > 0 : false}
                                  onQuantityChange={(newQty) => {
                                    if (newQty > 0) {
                                      // Ajouter au panier
                                      if (dateRetrait && heureRetrait) {
                                        const newItem: PlatPanier = {
                                          id: plat.idplats.toString(),
                                          nom: plat.plat,
                                          prix: plat.prix ? String(plat.prix) : "0",
                                          quantite: newQty,
                                          jourCommande: jourSelectionne || "",
                                          dateRetrait: new Date(dateRetrait.getTime()),
                                          uniqueId: `${plat.idplats}-${Date.now()}`,
                                          type: "plat",
                                        }
                                        setPanierModification((prev) => [...prev, newItem])
                                      }
                                    }
                                  }}
                                  onRemove={() => {}} // Pas d'action de suppression pour les items dispos
                                  showSpiceSelector={false} // Pas de sélecteur tant que pas ajouté
                                  readOnly={false}
                                  className="opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                                />
                              ))}

                            {/* Extras disponibles non commandés */}
                            {extrasDisponibles
                              .filter(
                                (extra) =>
                                  !panierModification.some(
                                    (item) => item.id === `extra-${extra.idextra}`
                                  )
                              )
                              .map((extra) => (
                                <CartItemCard
                                  key={`available-extra-${extra.idextra}`}
                                  name={extra.nom_extra}
                                  imageUrl={extra.photo_url || undefined}
                                  unitPrice={toSafeNumber(extra.prix)}
                                  quantity={0}
                                  isSpicy={false}
                                  onQuantityChange={(newQty) => {
                                    if (newQty > 0) {
                                      // Ajouter extra au panier
                                      if (dateRetrait && heureRetrait) {
                                        const newItem: PlatPanier = {
                                          id: `extra-${extra.idextra}`,
                                          nom: extra.nom_extra,
                                          prix: extra.prix || "0",
                                          quantite: newQty,
                                          dateRetrait: new Date(dateRetrait.getTime()),
                                          jourCommande: jourSelectionne || "",
                                          type: "extra",
                                          uniqueId: `extra-${extra.idextra}-${Date.now()}`,
                                        }
                                        setPanierModification((prev) => [...prev, newItem])
                                      }
                                    }
                                  }}
                                  onRemove={() => {}}
                                  showSpiceSelector={false}
                                  readOnly={false}
                                  className="opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                                />
                              ))}
                          </>
                        )}
                    </div>
                  </div>

                  <div className="bg-thai-cream/30 mb-4 flex items-center justify-between rounded-lg p-4">
                    <span className="text-thai-green text-lg font-bold">
                      Total de la commande :
                    </span>
                    <span className="text-thai-orange text-xl font-bold">
                      {formatPrix(totalPrixModification)}
                    </span>
                  </div>

                  {/* Demandes spéciales (Fusionné) */}
                  <div className="mb-4 px-1">
                    <Label
                      htmlFor="demandesSpeciales"
                      className="text-thai-green mb-2 block text-sm font-semibold"
                    >
                      Demandes spéciales
                    </Label>
                    <Textarea
                      id="demandesSpeciales"
                      placeholder="Allergies, préférences alimentaires..."
                      value={demandesSpeciales}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setDemandesSpeciales(e.target.value)
                      }
                      className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5 border text-sm"
                      rows={3}
                    />
                  </div>
                </div>
              )}
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
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
              </AlertDialogTrigger>
              <AlertDialogContent className="border-thai-orange border-2">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-thai-green text-xl font-bold">
                    Confirmer les modifications ?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4 pt-2 text-base text-gray-600">
                    <p>Voici le résumé de vos changements :</p>
                    <div className="bg-thai-cream/20 space-y-2 rounded-lg p-4">
                      <div className="flex justify-between">
                        <span>Ancien total :</span>
                        <span className="font-semibold">{formatPrix(originalTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nouveau total :</span>
                        <span className="text-thai-orange text-lg font-bold">
                          {formatPrix(totalPrixModification)}
                        </span>
                      </div>
                      <div className="border-thai-orange/20 flex justify-between border-t pt-2">
                        <span>Différence :</span>
                        <span
                          className={cn(
                            "font-bold",
                            totalPrixModification > originalTotal
                              ? "text-thai-orange"
                              : "text-green-600"
                          )}
                        >
                          {totalPrixModification > originalTotal ? "+" : ""}
                          {formatPrix(totalPrixModification - originalTotal)}
                        </span>
                      </div>
                      <div className="border-thai-orange/20 flex justify-between border-t pt-2 text-sm">
                        <span>Articles :</span>
                        <span>
                          {commande.details?.length || 0} →{" "}
                          {panierModification.reduce((acc, item) => acc + item.quantite, 0)}
                        </span>
                      </div>
                    </div>
                    {dateRetrait &&
                      originalData?.dateOriginale &&
                      !isSameDay(dateRetrait, originalData.dateOriginale) && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-800">
                          Attention : La date de retrait a été modifiée.
                        </div>
                      )}
                    <p>
                      Votre commande sera mise à jour et repassera en statut{" "}
                      <strong>"En attente de confirmation"</strong>.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-gray-100">Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={sauvegarderModifications}
                    className="bg-thai-orange hover:bg-thai-orange/90 text-white"
                  >
                    Confirmer et Sauvegarder
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
})

ModifierCommande.displayName = "ModifierCommande"

export default ModifierCommande
