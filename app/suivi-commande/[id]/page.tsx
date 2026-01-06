"use client"

import { getClientProfile } from "@/app/profil/actions"
import BoutonCommanderNouveau from "@/components/historique/BoutonCommanderNouveau"
import BoutonTelechargerFacture from "@/components/historique/BoutonTelechargerFacture"
import { CalendarIcon } from "@/components/historique/CalendarIcon"
import { StatusBadge } from "@/components/historique/StatusBadge"
import { AppLayout } from "@/components/layout/AppLayout"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { CommandePlatModalTrigger } from "@/components/shared/CommandePlatModal"
import { ProgressTimeline } from "@/components/suivi-commande/ProgressTimeline"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useData } from "@/contexts/DataContext"
import { usePrismaCommandeById, usePrismaExtras } from "@/hooks/usePrismaData"

import { useSession } from "@/lib/auth-client"
import { extractRouteParam } from "@/lib/params-utils"
import { toSafeNumber } from "@/lib/serialization"
import { getStorageUrl, STORAGE_DEFAULTS } from "@/lib/storage-utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  CreditCard,
  Edit,
  Loader2,
  MapPin,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { redirect, useParams, useRouter } from "next/navigation"
import { memo, useEffect, useState } from "react"

const SuiviCommande = memo(() => {
  const params = useParams()
  const router = useRouter()
  const id = extractRouteParam(params?.id)

  // Better Auth session
  const { data: session, isPending: isLoadingAuth } = useSession()
  const currentUser = session?.user

  // Client profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clientProfile, setClientProfile] = useState<any>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
  }, [currentUser])

  const {
    data: commande,
    isLoading: isLoadingCommande,
    error,
  } = usePrismaCommandeById(id ? Number(id) : undefined)
  const { isLoading: platsLoading } = useData()
  const { isLoading: extrasLoading } = usePrismaExtras()

  // Vérifie que l'utilisateur connecté est bien le propriétaire de la commande
  useEffect(() => {
    // Autoriser si l'utilisateur est admin OU le propriétaire de la commande
    if (
      commande &&
      clientProfile &&
      clientProfile.role !== "admin" &&
      clientProfile.idclient !== commande.client_r_id
    ) {
      redirect("/historique")
    }
  }, [commande, clientProfile])

  if (isLoadingAuth || isLoadingCommande || platsLoading || extrasLoading) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="text-thai-orange h-16 w-16 animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (error || !commande) {
    return (
      <AppLayout>
        <div className="bg-gradient-thai flex h-screen items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de charger les détails de cette commande. Elle n&apos;existe peut-être pas
              ou a été supprimée.
            </AlertDescription>
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/historique">Retour à l&apos;historique</Link>
            </Button>
          </Alert>
        </div>
      </AppLayout>
    )
  }

  // Fonction pour formater les prix
  const formatPrix = (prix: number | string | null | undefined): string => {
    const numericPrix = toSafeNumber(prix)
    if (numericPrix % 1 === 0) {
      return `${numericPrix.toFixed(0)}€`
    } else {
      return `${numericPrix.toFixed(2).replace(".", ",")}€`
    }
  }

  // Fonction pour calculer le total
  const calculateTotal = (): number => {
    if (!commande.details) return 0
    return commande.details.reduce((total, detail) => {
      const prix = toSafeNumber(detail.extra?.prix || detail.plat?.prix || detail.prix_unitaire)
      const quantite = detail.quantite_plat_commande || 0
      return total + prix * quantite
    }, 0)
  }

  return (
    <AppLayout>
      {/* Container principal sans padding latéral mobile (px-0) */}
      <div className="bg-gradient-thai min-h-screen px-0 py-4 md:px-4 md:py-8">
        <div className="animate-in fade-in mx-auto w-full max-w-6xl duration-500">
          {/* Header Navigation (Desktop seulement ou style discret) */}
          <div className="mb-6 hidden items-center justify-between px-4 md:flex md:px-0">
            <Button
              asChild
              variant="outline"
              className="border-thai-green/50 text-thai-green hover:bg-thai-green/10 hover:text-thai-green hover:border-thai-green inline-flex items-center justify-center rounded-full px-6 py-2 text-base font-bold shadow-sm transition-all hover:scale-105"
            >
              <Link href="/historique">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour
              </Link>
            </Button>

            <Button
              asChild
              className="bg-thai-orange hover:bg-thai-orange/90 inline-flex items-center justify-center rounded-full px-6 py-2 text-base font-bold text-white shadow-sm transition-all hover:scale-105"
            >
              <Link href="/commander">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Nouvelle commande
              </Link>
            </Button>
          </div>

          <Card className="border-thai-orange/20 mx-0 rounded-none border-x-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 md:mx-0 md:rounded-xl md:border-x">
            <CardHeader className="p-4 pb-2 md:p-6">
              <div className="flex w-full flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  {/* Vignette Vidéo/Image */}
                  <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                    <DialogTrigger asChild>
                      <div className="relative cursor-pointer transition-transform hover:scale-105">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/media/suividecommande/centredecommandement.png"
                          alt="Suivi Commande"
                          className="h-24 w-40 rounded-lg border-2 border-white/50 object-cover shadow-md"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-md overflow-hidden rounded-xl border-0 p-0">
                      <VisuallyHidden>
                        <DialogTitle>Aperçu vidéo suivi</DialogTitle>
                      </VisuallyHidden>
                      <video
                        src="/media/suividecommande/centredecommandement.mp4"
                        autoPlay
                        muted
                        playsInline
                        onEnded={() => setIsVideoModalOpen(false)}
                        className="w-full"
                      />
                    </DialogContent>
                  </Dialog>

                  <div>
                    <CardTitle className="text-thai-green text-3xl font-bold">
                      Suivi de commande
                    </CardTitle>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Visualisez la progression de votre commande en temps réel.
                    </p>
                  </div>
                </div>

                {/* Titre et Statut */}
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-lg md:mt-0 md:justify-end">
                  <span className="font-medium text-gray-600">Statut actuel:</span>
                  <StatusBadge statut={commande.statut_commande} type="commande" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 p-0 md:p-8">
              {/* Timeline de progression */}
              <div className="p-4 md:p-0">
                <ProgressTimeline
                  currentStatus={commande.statut_commande || null}
                  dateCommande={commande.date_de_prise_de_commande}
                  dateRetrait={commande.date_et_heure_de_retrait_souhaitees}
                  orderId={commande.idcommande}
                />
              </div>

              {/* Articles commandés */}
              <Card className="border-thai-orange/20 animate-fade-in mx-4 md:mx-0">
                <CardContent className="p-4">
                  <h3 className="text-thai-green mb-4 flex items-center gap-2 font-semibold">
                    <ShoppingCart className="text-thai-orange h-5 w-5" />
                    Plats commandés ({commande.details?.length || 0})
                  </h3>
                  {commande.details && commande.details.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-4">
                        {commande.details.map((detail, index) => {
                          const isExtra = !!detail.extra
                          const platDetails = detail.plat
                          const extraDetails = detail.extra

                          // Adapter les données pour CommandePlatModal

                          const detailForModal = {
                            ...detail,
                            plat: platDetails || null,
                            extra: extraDetails || null,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          } as any

                          return (
                            <CommandePlatModalTrigger
                              key={`${detail.plat_r || "unknown"}-${index}`}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              plat={platDetails as any}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              extra={extraDetails as any}
                              detail={detailForModal}
                              formatPrix={formatPrix}
                              mode="readonly"
                              showPriceDetails={true}
                              showBadgePanier={false}
                            >
                              <CartItemCard
                                name={
                                  isExtra
                                    ? extraDetails?.nom_extra || "Extra"
                                    : platDetails?.plat || "Plat non trouvé"
                                }
                                imageUrl={
                                  isExtra
                                    ? extraDetails?.photo_url ||
                                      getStorageUrl(STORAGE_DEFAULTS.EXTRA)
                                    : platDetails?.photo_du_plat || ""
                                }
                                unitPrice={parseFloat(
                                  isExtra
                                    ? extraDetails?.prix?.toString() || "0"
                                    : platDetails?.prix?.toString() || "0"
                                )}
                                quantity={detail.quantite_plat_commande || 0}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                isVegetarian={(platDetails as any)?.is_veggie}
                                readOnly={true}
                                onQuantityChange={() => {}}
                                onRemove={() => {}}
                                className="hover:border-thai-orange h-full border-gray-100 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                                cardClassName="h-full"
                                imageAspectRatio="square"
                                showSpiceSelector={true}
                                spiceDistribution={detail.spice_distribution || undefined}
                                onSpiceDistributionChange={() => {}}
                              />
                            </CommandePlatModalTrigger>
                          )
                        })}
                      </div>

                      {/* Total final */}
                      <div className="border-thai-orange/20 mt-6 border-t pt-4">
                        <div className="bg-thai-cream/30 flex items-center justify-between rounded-lg p-4">
                          <span className="text-thai-green text-xl font-bold">
                            Total de la commande :
                          </span>
                          <span className="text-thai-orange text-2xl font-bold">
                            {formatPrix(calculateTotal())}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-thai-orange/30 bg-thai-cream/20 rounded-lg border border-dashed py-12 text-center">
                      <ShoppingCart className="text-thai-orange/50 mx-auto mb-3 h-12 w-12" />
                      <p className="text-thai-green font-medium">
                        Aucun article dans cette commande.
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Cette commande semble vide.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Demandes spéciales */}
              {commande.demande_special_pour_la_commande && (
                <Card className="border-thai-orange/20 animate-fade-in mx-4 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl md:mx-0">
                  <CardContent className="p-4">
                    <h3 className="text-thai-green mb-3 flex items-center gap-2 font-semibold">
                      <AlertCircle className="text-thai-orange h-5 w-5" />
                      Demandes spéciales
                    </h3>
                    <div className="bg-thai-cream/50 border-thai-orange/20 hover:bg-thai-cream/70 rounded-lg border p-4 transition-all duration-200">
                      <p className="text-sm leading-relaxed text-gray-700">
                        {commande.demande_special_pour_la_commande}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Informations principales */}
              <div className="mx-4 grid gap-6 md:mx-0 lg:grid-cols-2">
                <Card className="border-thai-orange/20">
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      {/* Date et heure de retrait - En évidence */}
                      <div className="text-center">
                        <h4 className="text-thai-green mb-12 flex items-center justify-center gap-2 text-xl font-bold">
                          <Clock className="text-thai-orange h-6 w-6" />
                          Date et heure de retrait
                        </h4>
                        <div className="flex justify-center">
                          {commande.date_et_heure_de_retrait_souhaitees ? (
                            <div className="transform transition-all duration-300 hover:scale-105">
                              <CalendarIcon
                                date={new Date(commande.date_et_heure_de_retrait_souhaitees)}
                                className="scale-150"
                              />
                            </div>
                          ) : (
                            <div className="scale-125 rounded-xl border-2 border-gray-300 bg-gray-100 p-8 shadow-sm">
                              <div className="flex flex-col items-center gap-4">
                                <Clock className="h-12 w-12 text-gray-400" />
                                <span className="text-lg font-medium text-gray-600">
                                  Date non définie
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Adresse de retrait - Tout en bas */}
                      <div className="border-thai-cream/50 mt-6 border-t pt-4 text-center">
                        <p className="mb-1 text-sm font-medium text-gray-500">Adresse de retrait</p>

                        <Link
                          href="/nous-trouver"
                          className="text-thai-orange hover:text-thai-green inline-flex items-center gap-1 text-sm underline transition-colors duration-200 hover:no-underline"
                        >
                          <MapPin className="h-4 w-4" />
                          Voir sur la carte
                        </Link>
                      </div>

                      {/* Contact Rapide */}
                      <div className="border-thai-cream/50 mt-6 border-t pt-4 text-center">
                        <p className="mb-2 text-sm font-medium text-gray-500">Une question ?</p>
                        <div className="flex justify-center gap-3">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hover:bg-thai-cream/20 bg-white"
                          >
                            <a
                              href="tel:+33749283707"
                              className="text-thai-green flex items-center gap-2"
                            >
                              <span className="text-lg">📞</span> Appeler
                            </a>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hover:bg-thai-cream/20 bg-white"
                          >
                            <a
                              href="sms:+33749283707"
                              className="text-thai-orange flex items-center gap-2"
                            >
                              <span className="text-lg">💬</span> SMS
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-thai-orange/20">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="mb-4 flex items-center gap-2">
                        <CreditCard className="text-thai-orange h-5 w-5" />
                        <h3 className="text-thai-green font-semibold">Récapitulatif</h3>
                      </div>

                      {/* Informations de base */}
                      <div className="space-y-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm">
                          <p className="mb-2 text-sm font-medium text-gray-600">
                            Commande passée le
                          </p>
                          <div className="bg-thai-cream/40 flex items-center justify-center gap-2 rounded-lg px-3 py-2">
                            <Clock className="text-thai-green h-4 w-4" />
                            <span className="text-thai-green text-sm font-semibold">
                              {commande.date_de_prise_de_commande
                                ? format(
                                    new Date(commande.date_de_prise_de_commande),
                                    "dd MMMM yyyy 'à' HH:mm",
                                    { locale: fr }
                                  )
                                : "Date inconnue"}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm">
                          <p className="mb-2 text-sm font-medium text-gray-600">
                            Numéro de commande
                          </p>
                          <div className="bg-thai-cream/40 flex items-center justify-center gap-2 rounded-lg px-3 py-2">
                            <div className="bg-thai-orange flex h-5 w-5 items-center justify-center rounded-full">
                              <span className="text-xs font-bold text-white">#</span>
                            </div>
                            <span className="text-thai-green text-sm font-semibold">
                              {commande["Numéro de Commande"] || commande.idcommande}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Statut */}
                      <div className="py-3 text-center">
                        <p className="mb-3 text-sm font-medium text-gray-500">Statut actuel</p>
                        <StatusBadge statut={commande.statut_commande} type="commande" />
                      </div>

                      {/* Total - En évidence */}
                      <div className="border-thai-orange rounded-lg border-2 bg-white p-4 text-center shadow-md">
                        <p className="mb-2 text-sm font-medium text-gray-600">Total à payer</p>
                        <p className="text-thai-orange mb-2 text-3xl font-bold">
                          {formatPrix(calculateTotal())}
                        </p>
                        <div className="text-thai-green flex items-center justify-center gap-2 text-sm font-medium">
                          <CreditCard className="h-4 w-4" />
                          Paiement sur place - Carte acceptée
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section 4: Messages selon le statut */}
              <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 animate-fade-in mx-4 transform bg-linear-to-r transition-all duration-300 hover:scale-[1.01] hover:shadow-xl md:mx-0">
                <CardContent className="p-4">
                  <div className="space-y-4 text-center">
                    {/* Bouton modifier (seulement si modifiable) */}
                    {commande.statut_commande &&
                      ["En attente de confirmation", "Confirmée"].includes(
                        commande.statut_commande
                      ) && (
                        <div className="mb-4">
                          <Button
                            asChild
                            className="bg-thai-orange hover:bg-thai-orange/90 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                          >
                            <Link href={`/modifier-commande/${commande.idcommande}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier ma commande
                            </Link>
                          </Button>
                          <p className="mt-2 text-xs text-gray-600">
                            Vous pouvez modifier votre commande tant qu&apos;elle n&apos;est pas en
                            préparation
                          </p>
                        </div>
                      )}
                    {commande.statut_commande === "En attente de confirmation" && (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 transition-all duration-200 hover:bg-yellow-100 hover:shadow-md">
                        <p className="text-center text-sm font-medium text-yellow-800">
                          ⏳ Votre commande est en attente de confirmation. Nous la traiterons dans
                          les plus brefs délais.
                        </p>
                      </div>
                    )}
                    {commande.statut_commande === "Confirmée" && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 transition-all duration-200 hover:bg-green-100 hover:shadow-md">
                        <p className="text-center text-sm font-medium text-green-800">
                          ✅ Votre commande est confirmée ! Nous la préparons avec soin.
                        </p>
                      </div>
                    )}
                    {commande.statut_commande === "Prête à récupérer" && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 transition-all duration-200 hover:bg-blue-100 hover:shadow-md">
                        <p className="text-center text-sm font-medium text-blue-800">
                          🎉 Votre commande est prête ! Vous pouvez venir la récupérer.
                        </p>
                      </div>
                    )}

                    {commande.statut_commande === "Récupérée" && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 transition-all duration-200 hover:bg-green-100 hover:shadow-md">
                        <p className="mb-3 text-center text-sm font-medium text-green-800">
                          🍽️ Commande récupérée avec succès ! Bon appétit et merci de votre
                          confiance.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                          <BoutonTelechargerFacture
                            commande={commande}
                            className="text-thai-green hover:bg-thai-green/10 border-thai-green/20 w-full sm:w-auto"
                          />
                          <BoutonCommanderNouveau
                            commande={commande}
                            className="bg-thai-green hover:bg-thai-green/90 w-full text-white sm:w-auto"
                          />
                        </div>
                        <div className="mt-4 text-center">
                          <Button
                            asChild
                            variant="link"
                            className="text-thai-orange text-sm underline"
                          >
                            <a
                              href="https://g.page/r/example"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ⭐ Laisser un avis sur votre expérience
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                    {commande.statut_commande === "Annulée" && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 transition-all duration-200 hover:bg-red-100 hover:shadow-md">
                        <p className="mb-3 text-center text-sm font-medium text-red-800">
                          ❌ Cette commande a été annulée.
                        </p>
                        <div className="flex justify-center">
                          <BoutonCommanderNouveau
                            commande={commande}
                            className="w-full border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 sm:w-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
})

SuiviCommande.displayName = "SuiviCommande"

export default SuiviCommande
