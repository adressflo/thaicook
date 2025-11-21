"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  ShoppingCart,
  Trash2,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  AlertCircle,
  Calendar as CalendarIconLucide,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { getClientProfile } from "@/app/profil/actions"
import { useCart } from "@/contexts/CartContext"
import { useData } from "@/contexts/DataContext"
import { usePrismaCreateCommande } from "@/hooks/usePrismaData"
import type { PlatUI as Plat, PlatPanier } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { spiceTextToLevel } from "@/lib/spice-helpers"
import { DishDetailsModalInteractive } from "@/components/historique/DishDetailsModalInteractive"
import {
  SpiceDistributionSelector,
  getDistributionText,
} from "@/components/commander/SpiceDistributionSelector"
import { FloatingUserIcon } from "@/components/layout/FloatingUserIcon"
import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"

// Helper function pour convertir le prix en nombre
const toSafeNumber = (prix: string | number | undefined): number => {
  if (typeof prix === "number") return prix
  if (typeof prix === "string") {
    const parsed = parseFloat(prix)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export default function PanierPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()
  const { plats } = useData()
  const createCommande = usePrismaCreateCommande()

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

  const clientFirebaseUID = clientProfile?.idclient

  const { panier, modifierQuantite, supprimerDuPanier, viderPanier, totalPrix, ajouterAuPanier } =
    useCart()

  const [demandesSpeciales, setDemandesSpeciales] = useState<string>("")

  // Fonction pour formater les prix
  const formatPrix = (prix: number): string => {
    if (prix % 1 === 0) {
      return `${prix.toFixed(0)}€`
    } else {
      return `${prix.toFixed(2).replace(".", ",")}€`
    }
  }

  const validerCommande = async () => {
    if (!currentUser || !clientFirebaseUID) {
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

        await createCommande.mutateAsync({
          client_r: currentUser.id,
          client_r_id: clientFirebaseUID,
          date_et_heure_de_retrait_souhaitees: dateKey,
          demande_special_pour_la_commande: demandesSpeciales,
          details: items.map((item) => ({
            plat_r: item.id, // Garder comme string, sera converti dans le hook
            quantite_plat_commande: item.quantite,
            preference_epice_niveau: spiceTextToLevel(item.demandeSpeciale),
            spice_distribution: item.spiceDistribution || null,
          })),
        })

        commandesCreees++
      }

      const totalGeneral = panier.reduce(
        (sum, item) => sum + toSafeNumber(item.prix) * item.quantite,
        0
      )

      toast({
        title: "Commande(s) envoyée(s) !",
        description: `${commandesCreees} commande${commandesCreees > 1 ? "s" : ""} d'un total de ${formatPrix(totalGeneral)} ${commandesCreees > 1 ? "ont été enregistrées" : "a été enregistrée"}.`,
      })

      viderPanier()
      setDemandesSpeciales("")
      router.push("/commander/confirmation")
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

  // Fonction pour ajouter un plat au panier avec quantité spécifique
  const handleAjouterAuPanier = (
    plat: Plat,
    quantite: number,
    spicePreference?: string,
    spiceDistribution?: number[]
  ) => {
    if (!plat.idplats || !plat.plat || plat.prix === undefined) return

    // Récupérer le premier item du panier pour cette plat pour obtenir dateRetrait et jourCommande
    const existingItem = panier.find((item) => item.id === plat.idplats.toString())

    if (existingItem?.dateRetrait && existingItem?.jourCommande) {
      ajouterAuPanier({
        id: plat.idplats.toString(),
        nom: plat.plat,
        prix: plat.prix ?? "0",
        quantite: quantite,
        dateRetrait: existingItem.dateRetrait,
        jourCommande: existingItem.jourCommande,
        demandeSpeciale: spicePreference || undefined,
        spiceDistribution: spiceDistribution,
      })

      toast({
        title: "Plat mis à jour !",
        description: `${plat.plat} a été mis à jour dans votre panier.`,
      })
    }
  }

  // Calculer la quantité actuelle d'un plat dans le panier pour une date donnée
  const getCurrentQuantity = (platId: number, dateRetrait?: Date): number => {
    if (!dateRetrait) return 0

    return panier
      .filter(
        (item) =>
          item.id === platId.toString() && item.dateRetrait?.getTime() === dateRetrait.getTime()
      )
      .reduce((total, item) => total + item.quantite, 0)
  }

  // Modifier la distribution épicée directement
  const handleDistributionChange = (item: PlatPanier, newDistribution: number[]) => {
    if (item.uniqueId) {
      const newDistributionText = getDistributionText(newDistribution)

      // Supprimer l'ancien item
      supprimerDuPanier(item.uniqueId)

      // Ajouter le nouvel item avec la distribution mise à jour
      ajouterAuPanier({
        ...item,
        spiceDistribution: newDistribution,
        demandeSpeciale: newDistributionText,
      })
    }
  }

  // Gérer le changement de quantité avec ajustement automatique de la distribution
  const handleQuantityChange = (item: PlatPanier, newQuantity: number) => {
    if (newQuantity <= 0) {
      supprimerDuPanier(item.uniqueId!)
      return
    }

    // Si le plat a une distribution épicée, on l'ajuste
    if (item.spiceDistribution && item.spiceDistribution.length === 4) {
      const currentTotal = item.spiceDistribution.reduce((sum, count) => sum + count, 0)
      const diff = newQuantity - currentTotal
      const newDistribution = [...item.spiceDistribution]

      if (diff > 0) {
        // Augmentation: ajouter les portions sur "non épicé" (index 0)
        newDistribution[0] += diff
      } else if (diff < 0) {
        // Diminution: retirer des portions en commençant par "non épicé"
        let toRemove = Math.abs(diff)
        for (let i = 0; i < 4 && toRemove > 0; i++) {
          const canRemove = Math.min(newDistribution[i], toRemove)
          newDistribution[i] -= canRemove
          toRemove -= canRemove
        }
      }

      const newDistributionText = getDistributionText(newDistribution)

      // Supprimer l'ancien et ajouter le nouveau
      supprimerDuPanier(item.uniqueId!)
      ajouterAuPanier({
        ...item,
        quantite: newQuantity,
        spiceDistribution: newDistribution,
        demandeSpeciale: newDistributionText,
      })
    } else {
      // Pas de distribution épicée, juste modifier la quantité
      modifierQuantite(item.uniqueId!, newQuantity)
    }
  }

  return (
    <div className="bg-gradient-thai min-h-screen px-2 py-8">
      <div className="container mx-auto max-w-6xl">
        {!currentUser || !clientFirebaseUID ? (
          <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Profil requis :</strong> Pour commander, veuillez vous{" "}
              <Link href="/auth/login" className="font-medium underline">
                connecter et compléter votre profil
              </Link>
              .
            </AlertDescription>
          </Alert>
        ) : null}

        <Card
          className="border-thai-orange/20 shadow-xl"
          style={{ position: "relative", zIndex: 1 }}
        >
          <CardHeader className="from-thai-orange to-thai-gold relative rounded-t-lg bg-gradient-to-r py-8 text-white">
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-7 w-7" />
              <CardTitle className="text-2xl font-bold">Mon Panier</CardTitle>
            </div>
            <PolaroidPhoto
              src="/image avatar/panier1.svg"
              alt="Avatar Chanthana"
              caption="panier"
              position="right"
              size={128}
              rotation={3}
            />
          </CardHeader>

          <CardContent className="p-6 md:p-8" style={{ position: "relative", zIndex: 1 }}>
            {panier.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="text-thai-orange/30 mx-auto mb-4 h-16 w-16" />
                <h3 className="text-thai-green mb-2 text-xl font-semibold">
                  Votre panier est vide
                </h3>
                <p className="mb-6 text-gray-600">Découvrez nos délicieux plats thaïlandais</p>
                <Link href="/commander">
                  <Button className="bg-thai-orange hover:bg-thai-orange/90">Voir le menu</Button>
                </Link>
              </div>
            ) : (
              <div className="animate-fade-in space-y-6">
                <h3 className="text-thai-green text-xl font-bold">Votre Commande</h3>

                {/* Grouper les articles par date de retrait */}
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
                        className="border-thai-orange/20 bg-thai-cream/20 rounded-lg border p-4"
                      >
                        {dateRetrait && (
                          <div className="border-thai-orange/10 mb-3 border-b pb-2">
                            <h4 className="text-thai-green flex items-center gap-2 font-semibold">
                              <CalendarIconLucide className="text-thai-orange h-4 w-4" />
                              Retrait prévu le{" "}
                              <span className="text-thai-orange font-bold">
                                {format(dateRetrait, "eeee dd MMMM yyyy", { locale: fr }).replace(
                                  /^\w/,
                                  (c) => c.toUpperCase()
                                )}{" "}
                                à {format(dateRetrait, "HH:mm")}
                              </span>
                            </h4>
                          </div>
                        )}

                        <div className="space-y-4">
                          {items.map((item) => {
                            const platData = plats?.find((p) => p.id.toString() === item.id)
                            const imageUrl = platData?.photo_du_plat

                            return (
                              <div
                                key={item.uniqueId}
                                className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 transform rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2 sm:p-4"
                              >
                                <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
                                  {/* Image du plat */}
                                  <div className="flex w-full justify-center sm:w-auto sm:justify-start">
                                    {platData ? (
                                      <DishDetailsModalInteractive
                                        plat={platData}
                                        formatPrix={formatPrix}
                                        onAddToCart={(
                                          plat,
                                          quantite,
                                          spicePreference,
                                          spiceDistribution
                                        ) =>
                                          handleAjouterAuPanier(
                                            plat,
                                            quantite,
                                            spicePreference,
                                            spiceDistribution
                                          )
                                        }
                                        currentQuantity={item.quantite}
                                        currentSpiceDistribution={item.spiceDistribution}
                                        dateRetrait={item.dateRetrait}
                                      >
                                        <div className="relative">
                                          {imageUrl ? (
                                            <img
                                              src={imageUrl}
                                              alt={item.nom}
                                              className="h-32 w-32 cursor-pointer rounded-lg object-cover transition-opacity duration-200 hover:opacity-80 sm:h-20 sm:w-20"
                                            />
                                          ) : (
                                            <div className="bg-thai-cream/30 border-thai-orange/20 hover:bg-thai-cream/50 flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-200 sm:h-20 sm:w-20">
                                              <span className="text-thai-orange text-xl sm:text-lg">
                                                🍽️
                                              </span>
                                            </div>
                                          )}
                                          {/* Badge de quantité */}
                                          <div className="bg-thai-orange absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg">
                                            {item.quantite}
                                          </div>
                                        </div>
                                      </DishDetailsModalInteractive>
                                    ) : (
                                      <div className="relative">
                                        <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gray-200 sm:h-20 sm:w-20">
                                          <span className="text-xl text-gray-400 sm:text-lg">
                                            🍽️
                                          </span>
                                        </div>
                                        {/* Badge de quantité */}
                                        <div className="bg-thai-orange absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg">
                                          {item.quantite}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Informations du plat */}
                                  <div className="flex w-full min-w-0 flex-1 flex-col justify-between sm:w-auto">
                                    {platData ? (
                                      <DishDetailsModalInteractive
                                        plat={platData}
                                        formatPrix={formatPrix}
                                        onAddToCart={(
                                          plat,
                                          quantite,
                                          spicePreference,
                                          spiceDistribution
                                        ) =>
                                          handleAjouterAuPanier(
                                            plat,
                                            quantite,
                                            spicePreference,
                                            spiceDistribution
                                          )
                                        }
                                        currentQuantity={item.quantite}
                                        currentSpiceDistribution={item.spiceDistribution}
                                        dateRetrait={item.dateRetrait}
                                      >
                                        <h4 className="text-thai-green hover:text-thai-orange decoration-thai-orange/50 cursor-pointer text-base font-medium transition-colors duration-200 hover:underline">
                                          {item.nom}
                                        </h4>
                                      </DishDetailsModalInteractive>
                                    ) : (
                                      <h4 className="text-base font-medium text-gray-500">
                                        {item.nom}
                                      </h4>
                                    )}
                                    <div className="text-sm text-gray-600">
                                      Prix unitaire:{" "}
                                      <span className="text-thai-green font-semibold">
                                        {formatPrix(toSafeNumber(item.prix))}
                                      </span>
                                    </div>

                                    {/* Sélecteur épicé (Mobile uniquement - entre prix unitaire et prix total) */}
                                    {item.demandeSpeciale &&
                                      item.demandeSpeciale.includes("épicé") &&
                                      item.spiceDistribution && (
                                        <div className="mt-2 flex justify-center lg:hidden">
                                          <div className="origin-center scale-60">
                                            <SpiceDistributionSelector
                                              totalQuantity={item.quantite}
                                              distribution={item.spiceDistribution}
                                              onDistributionChange={(newDistribution) =>
                                                handleDistributionChange(item, newDistribution)
                                              }
                                            />
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  {/* Sélecteur épicé (Desktop uniquement) */}
                                  {item.demandeSpeciale &&
                                    item.demandeSpeciale.includes("épicé") &&
                                    item.spiceDistribution && (
                                      <div className="hidden items-center lg:flex">
                                        <div className="origin-center scale-75">
                                          <SpiceDistributionSelector
                                            totalQuantity={item.quantite}
                                            distribution={item.spiceDistribution}
                                            onDistributionChange={(newDistribution) =>
                                              handleDistributionChange(item, newDistribution)
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}

                                  {/* Prix total et contrôles */}
                                  <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:items-end sm:gap-4">
                                    <div className="text-thai-orange text-xl font-bold sm:text-2xl">
                                      {formatPrix(toSafeNumber(item.prix) * item.quantite)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          supprimerDuPanier(item.uniqueId!)
                                          toast({
                                            title: "Article supprimé",
                                            description: `${item.nom} a été retiré de votre panier.`,
                                          })
                                        }}
                                        className="h-8 w-8 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500 hover:shadow-lg hover:ring-2 hover:ring-red-300"
                                        aria-label="Supprimer l'article"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="hover:border-thai-orange hover:ring-thai-orange/30 h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleQuantityChange(item, item.quantite - 1)
                                        }}
                                      >
                                        -
                                      </Button>
                                      <span className="w-8 text-center font-medium">
                                        {item.quantite}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="hover:border-thai-orange hover:ring-thai-orange/30 h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleQuantityChange(item, item.quantite + 1)
                                        }}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                })()}

                <div className="bg-thai-cream/30 flex items-center justify-between rounded-lg p-4">
                  <span className="text-thai-green text-xl font-bold">Total de la commande :</span>
                  <span className="text-thai-orange text-2xl font-bold">
                    {formatPrix(totalPrix)}
                  </span>
                </div>

                <Alert className="border-green-200 bg-green-50/50 text-green-800">
                  <CreditCard className="h-4 w-4 !text-green-700" />
                  <AlertDescription className="font-medium">
                    Paiement sur place : Nous acceptons la carte bleue.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="demandesSpeciales">Demandes spéciales</Label>
                    <Textarea
                      id="demandesSpeciales"
                      placeholder="Allergies, etc."
                      value={demandesSpeciales}
                      onChange={(e) => setDemandesSpeciales(e.target.value)}
                      className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-orange/5 border"
                    />
                  </div>
                </div>

                {/* Section informations */}
                <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 bg-gradient-to-r">
                  <CardContent className="p-4">
                    <div className="space-y-4 text-center">
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <p className="text-center text-sm font-medium text-yellow-800">
                          ⏳ Votre commande sera mise en attente de confirmation. Nous la traiterons
                          dans les plus brefs délais.
                        </p>
                      </div>

                      <div className="text-thai-green/80 bg-thai-cream/50 rounded-lg p-3 text-center text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="text-thai-orange h-4 w-4" />
                          <span>
                            Adresse de retrait : 2 impasse de la poste 37120 Marigny Marmande
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-center gap-2">
                          <Phone className="text-thai-orange h-4 w-4" />
                          <span>Contact : 07 49 28 37 07</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Boutons d'action */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/commander" className="order-2 flex-1 sm:order-1">
                    <Button
                      variant="outline"
                      className="border-thai-orange text-thai-orange hover:bg-thai-orange w-full py-4 text-xs hover:text-white sm:py-6 sm:text-base"
                    >
                      Retour à Commander
                    </Button>
                  </Link>
                  <Button
                    onClick={validerCommande}
                    disabled={createCommande.isPending || !currentUser || !clientFirebaseUID}
                    className="bg-thai-orange order-1 flex-1 py-4 text-sm sm:order-2 sm:py-6 sm:text-lg"
                  >
                    {createCommande.isPending ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin sm:mr-2 sm:h-5 sm:w-5" />
                    ) : (
                      <CreditCard className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                    )}
                    <span className="truncate">Valider ({formatPrix(totalPrix)})</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FloatingUserIcon ajouté pour navigation universelle */}
        <FloatingUserIcon />
      </div>
    </div>
  )
}
