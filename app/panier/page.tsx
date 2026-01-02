"use client"

import { getClientProfile } from "@/app/profil/actions"
import { FloatingUserIcon } from "@/components/layout/FloatingUserIcon"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { CommandePlatModal } from "@/components/shared/CommandePlatModal"
import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ModalVideo } from "@/components/ui/ModalVideo"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/CartContext"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"
import { toastVideo } from "@/hooks/use-toast-video"
import { usePrismaCreateCommande } from "@/hooks/usePrismaData"
import { useSession } from "@/lib/auth-client"
import { getDistributionText, spiceTextToLevel } from "@/lib/spice-helpers"
import type { PlatUI as Plat, PlatPanier } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertCircle,
  Calendar as CalendarIconLucide,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  ShoppingCart,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Helper function pour convertir le prix en nombre
const toSafeNumber = (prix: string | number | undefined): number => {
  if (typeof prix === "number") return prix
  if (typeof prix === "string") {
    const parsed = parseFloat(prix)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// Type for client profile from getClientProfile action
interface ClientProfile {
  idclient: number
  date_de_naissance: string | null
  // Add other properties if needed, but we mainly need idclient here
  [key: string]: unknown
}

// Minimal interface for what handleAjouterAuPanier expects
// Uses unknown for prix to handle Prisma Decimal type
interface PlatReference {
  idplats: number
  plat: string
  prix: unknown // Can be Decimal, number, string, or null
}

export default function PanierPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()
  const { plats } = useData()
  const createCommande = usePrismaCreateCommande()

  const currentUser = session?.user

  // Client profile (pour obtenir idclient)
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then((profile) => {
        // Safe cast as we know the shape from action
        setClientProfile(profile as unknown as ClientProfile | null)
      })
    } else {
      setClientProfile(null)
    }
  }, [currentUser]) // Fixed dependency

  const clientFirebaseUID = clientProfile?.idclient

  const { panier, modifierQuantite, supprimerDuPanier, viderPanier, totalPrix, ajouterAuPanier } =
    useCart()

  const [demandesSpeciales, setDemandesSpeciales] = useState<string>("")
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false)

  // State pour le modal global
  const [modalContext, setModalContext] = useState<{
    plat: Plat
    quantity: number
    spiceDistribution?: number[]
    uniqueId?: string
  } | null>(null)

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
      toastVideo({
        title: "Profil incomplet",
        description: "Veuillez vous connecter et compléter votre profil pour commander.",
        media: "/media/animations/toasts/ajoutpaniernote.mp4",
        position: "center",
        aspectRatio: "1:1",
        polaroid: true,
      })
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
      })
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
      let lastOrderId = ""

      // Créer une commande pour chaque date de retrait
      for (const [dateKey, items] of Object.entries(groupedByDate)) {
        if (!dateKey) continue

        const newOrder = await createCommande.mutateAsync({
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

        if (newOrder && newOrder.id) {
          lastOrderId = newOrder.id.toString()
        }
      }

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
      })

      viderPanier()
      setDemandesSpeciales("")

      if (lastOrderId) {
        router.push(`/suivi-commande/${lastOrderId}`)
      } else {
        router.push("/commander/confirmation")
      }
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
    plat: PlatReference,
    quantite: number,
    spicePreference?: string,
    spiceDistribution?: number[],
    uniqueId?: string
  ) => {
    if (!plat.idplats || !plat.plat || plat.prix === undefined) return

    // Récupérer le premier item du panier pour cette plat pour obtenir dateRetrait et jourCommande
    // Si uniqueId est fourni, on essaie de trouver cet item spécifique, sinon on cherche par ID de plat
    const existingItem = uniqueId
      ? panier.find((item) => item.uniqueId === uniqueId)
      : panier.find((item) => item.id === plat.idplats.toString())

    if (existingItem?.dateRetrait && existingItem?.jourCommande) {
      // Si on a un uniqueId, on supprime l'ancien item avant d'ajouter le nouveau (mise à jour)
      if (uniqueId) {
        supprimerDuPanier(uniqueId)
      }

      ajouterAuPanier({
        id: plat.idplats.toString(),
        nom: plat.plat,
        prix: String(plat.prix ?? "0"),
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
    <div className="bg-gradient-thai min-h-screen px-1 pt-1 pb-8 sm:px-2 sm:py-8">
      <div className="w-full sm:container sm:mx-auto sm:max-w-6xl">
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
          className="border-thai-orange/20 min-h-screen rounded-xl border-x-0 border-t-0 border-b-0 shadow-none sm:min-h-fit sm:rounded-lg sm:border sm:shadow-xl"
          style={{ position: "relative", zIndex: 1 }}
        >
          <CardHeader className="from-thai-orange to-thai-gold relative rounded-t-xl bg-linear-to-r py-4 text-white sm:rounded-t-lg sm:py-8">
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-7 w-7" />
              <CardTitle className="text-2xl font-bold">Mon Panier</CardTitle>
            </div>
            <div className="hidden sm:block">
              <PolaroidPhoto
                src="/media/avatars/panier1.svg"
                alt="Avatar Chanthana"
                title="panier"
                position="bottom-right"
                size={128}
                rotation={3}
              />
            </div>
            {panier.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 text-white hover:bg-white/20 sm:top-8 sm:right-8"
                onClick={() => setIsClearCartModalOpen(true)}
                title="Vider le panier"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-3 sm:p-6 md:p-8" style={{ position: "relative", zIndex: 1 }}>
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

                            if (!platData) return null

                            return (
                              <CartItemCard
                                key={item.uniqueId}
                                name={item.nom}
                                imageUrl={platData.photo_du_plat ?? undefined}
                                unitPrice={toSafeNumber(item.prix)}
                                quantity={item.quantite}
                                isVegetarian={platData.est_vegetarien === true}
                                isSpicy={(platData.niveau_epice ?? 0) > 0}
                                showSpiceSelector={!!item.spiceDistribution}
                                spiceDistribution={item.spiceDistribution}
                                onSpiceDistributionChange={(newDist) =>
                                  handleDistributionChange(item, newDist)
                                }
                                onQuantityChange={(newQuantity) => {
                                  const diff = newQuantity - item.quantite
                                  handleQuantityChange(item, newQuantity)
                                  if (diff > 0) {
                                    toast({
                                      title: "Quantité mise à jour",
                                      description: `Une portion de ${item.nom} ajoutée.`,
                                      duration: 2000,
                                    })
                                  } else if (diff < 0) {
                                    toast({
                                      title: "Quantité mise à jour",
                                      description: `Une portion de ${item.nom} retirée.`,
                                      duration: 2000,
                                    })
                                  }
                                }}
                                onRemove={() => {
                                  supprimerDuPanier(item.uniqueId!)
                                  toast({
                                    title: "Article supprimé",
                                    description: `${item.nom} a été retiré de votre panier.`,
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
                                quantityBadgeLabel="Panier"
                              />
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
                  <CreditCard className="h-4 w-4 text-green-700!" />
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
                      onBlur={(e) => {
                        if (e.target.value.length > 0) {
                          toastVideo({
                            title: "Message reçu ! 📝",
                            description: "Je prends note de votre demande spéciale.",
                            media: "/media/animations/toasts/ajoutpaniernote.mp4",
                            position: "bottom-right",
                            aspectRatio: "1:1",
                            polaroid: true,
                            duration: 3000,
                          })
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Section informations */}
                <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 bg-linear-to-r">
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

        {/* Modal global de commande */}
        {modalContext && (
          <CommandePlatModal
            isOpen={!!modalContext}
            onOpenChange={(open) => {
              if (!open) setModalContext(null)
            }}
            plat={modalContext.plat}
            formatPrix={formatPrix}
            onAddToCart={handleAjouterAuPanier}
            currentQuantity={modalContext.quantity}
            currentSpiceDistribution={modalContext.spiceDistribution}
            uniqueId={modalContext.uniqueId}
          />
        )}

        {/* Modal de confirmation pour vider le panier */}
        <ModalVideo
          isOpen={isClearCartModalOpen}
          onOpenChange={setIsClearCartModalOpen}
          title="<orange>Vider</orange> le panier ?"
          description="Êtes-vous sûr de vouloir <bold><orange>supprimer</orange></bold> tous les plats de votre panier ?"
          media="/media/animations/toasts/ajoutpaniernote.mp4"
          aspectRatio="1:1"
          polaroid={true}
          buttonLayout="double"
          cancelText="Annuler"
          confirmText="Tout supprimer"
          maxWidth="sm"
          borderColor="thai-green"
          borderWidth={2}
          shadowSize="2xl"
          onCancel={() => setIsClearCartModalOpen(false)}
          onConfirm={() => {
            viderPanier()
            setIsClearCartModalOpen(false)
            toastVideo({
              title: "Panier vidé",
              description: "Votre panier est maintenant vide.",
              media: "/media/animations/toasts/ajoutpaniernote.mp4",
              position: "center",
            })
          }}
        />
      </div>
    </div>
  )
}
