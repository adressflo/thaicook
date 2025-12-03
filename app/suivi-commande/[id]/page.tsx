"use client"

import { getClientProfile } from "@/app/profil/actions"
import { CalendarIcon } from "@/components/historique/CalendarIcon"
import { StatusBadge } from "@/components/historique/StatusBadge"
import { CommandePlatModalTrigger } from "@/components/shared/CommandePlatModal"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProgressTimeline } from "@/components/suivi-commande/ProgressTimeline"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/contexts/DataContext"
import { usePrismaCommandeById, usePrismaExtras } from "@/hooks/usePrismaData"
import { useCommandesRealtime } from "@/hooks/useSupabaseData"
import { useSession } from "@/lib/auth-client"
import { extractRouteParam } from "@/lib/params-utils"
import { toSafeNumber } from "@/lib/serialization"
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
import { redirect, useParams } from "next/navigation"
import { memo, useEffect, useState } from "react"

const SuiviCommande = memo(() => {
  const params = useParams()
  const id = extractRouteParam(params?.id)

  // Better Auth session
  const { data: session, isPending: isLoadingAuth } = useSession()
  const currentUser = session?.user

  // Client profile
  const [clientProfile, setClientProfile] = useState<any>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
  }, [currentUser?.id])

  // ✅ Activation Real-time Supabase pour synchronisation automatique
  useCommandesRealtime()

  const {
    data: commande,
    isLoading: isLoadingCommande,
    error,
  } = usePrismaCommandeById(id ? Number(id) : undefined)
  const { plats, isLoading: platsLoading } = useData()
  const { data: extras, isLoading: extrasLoading } = usePrismaExtras()

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
              Impossible de charger les détails de cette commande. Elle n'existe peut-être pas ou a
              été supprimée.
            </AlertDescription>
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/historique">Retour à l'historique</Link>
            </Button>
          </Alert>
        </div>
      </AppLayout>
    )
  }

  // Fonction pour formater les prix
  const formatPrix = (prix: any): string => {
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

  // Fonction pour obtenir la couleur du badge de statut
  const getStatutColor = (statut: string | null): string => {
    switch (statut) {
      case "En attente de confirmation":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Confirmée":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "En préparation":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "Prête à récupérer":
        return "bg-green-100 text-green-800 border-green-300"
      case "Récupérée":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "Annulée":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Fonction pour obtenir les détails d'un plat
  const getPlatDetails = (platId: number) => {
    return plats?.find((p) => p.idplats === platId)
  }

  return (
    <AppLayout>
      <div className="bg-gradient-thai min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <Button
            asChild
            variant="outline"
            className="group mb-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <Link href="/historique" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour à l'historique
            </Link>
          </Button>

          <Card className="border-thai-orange/20 transform shadow-xl transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="from-thai-orange to-thai-gold animate-fade-in rounded-t-lg bg-linear-to-r text-center text-white">
              <div className="mb-2 flex items-center justify-center">
                <ShoppingCart className="mr-2 h-8 w-8 animate-pulse" />
                <CardTitle className="text-3xl font-bold">Suivi de votre Commande</CardTitle>
              </div>
              <CardDescription className="px-4 text-white/90">
                Statut: {commande.statut_commande || "En attente"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 p-6 md:p-8">
              {/* Timeline de progression */}
              <Card className="border-thai-orange/20 from-thai-cream/20 bg-linear-to-br to-white">
                <CardContent className="p-6">
                  <h3 className="text-thai-green mb-6 flex items-center gap-2 text-xl font-bold">
                    <Clock className="text-thai-orange h-6 w-6" />
                    Suivi de votre commande
                  </h3>
                  <ProgressTimeline
                    currentStatus={commande.statut_commande || null}
                    dateCommande={commande.date_de_prise_de_commande}
                    dateRetrait={commande.date_et_heure_de_retrait_souhaitees}
                  />
                </CardContent>
              </Card>

              {/* Articles commandés */}
              <Card className="border-thai-orange/20 animate-fade-in">
                <CardContent className="p-4">
                  <h3 className="text-thai-green mb-4 flex items-center gap-2 font-semibold">
                    <ShoppingCart className="text-thai-orange h-5 w-5" />
                    Plats commandés ({commande.details?.length || 0})
                  </h3>
                  {commande.details && commande.details.length > 0 ? (
                    <div className="border-thai-orange/20 bg-thai-cream/20 space-y-4 rounded-lg border p-3">
                      {commande.details.map((detail, index) => {
                        const isExtra = !!detail.extra
                        const platDetails = detail.plat
                        const extraDetails = detail.extra

                        // Adapter les données pour CommandePlatModal
                        const detailForModal = {
                          ...detail,
                          plat: platDetails || null,
                          extra: extraDetails || null,
                        } as any // Type casting pour compatibilité Prisma types

                        return (
                          <CommandePlatModalTrigger
                            key={`${detail.plat_r || "unknown"}-${index}`}
                            plat={platDetails as any}
                            extra={extraDetails as any}
                            detail={detailForModal}
                            formatPrix={formatPrix}
                            mode="readonly"
                            showPriceDetails={true}
                            showBadgePanier={false}
                          >
                            <div
                              className="group animate-fadeIn relative cursor-pointer hover:z-10"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 flex w-full transform items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2">
                                {/* Image du plat/extra */}
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md md:h-20 md:w-20">
                                  <img
                                    src={
                                      isExtra
                                        ? extraDetails?.photo_url ||
                                          "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
                                        : platDetails?.photo_du_plat || ""
                                    }
                                    alt={
                                      isExtra
                                        ? extraDetails?.nom_extra || detail.nom_plat || "Extra"
                                        : platDetails?.plat || "Plat"
                                    }
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      // Fallback pour les extras si l'image ne charge pas
                                      if (isExtra) {
                                        e.currentTarget.src =
                                          "https://lkaiwnkyoztebplqoifc.supabase.co/storage/v1/object/public/platphoto/extra.png"
                                      } else {
                                        // Pour les plats sans image, on affiche un placeholder
                                        e.currentTarget.style.display = "none"
                                        const parent = e.currentTarget.parentElement
                                        if (parent) {
                                          parent.innerHTML =
                                            '<div class="w-full h-full bg-thai-cream/30 border border-thai-orange/20 rounded-md flex items-center justify-center"><span class="text-thai-orange text-2xl">🍽️</span></div>'
                                        }
                                      }
                                    }}
                                  />
                                </div>

                                {/* Détails du plat */}
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-thai-green mb-1 truncate text-lg font-medium">
                                    {isExtra
                                      ? extraDetails?.nom_extra || "Extra"
                                      : platDetails?.plat || "Plat non trouvé"}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <span className="font-medium">Quantité:</span>
                                      <span className="bg-thai-orange/10 text-thai-orange rounded-full px-2 py-1 font-medium">
                                        {detail.quantite_plat_commande}
                                      </span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span className="font-medium">Prix unitaire:</span>
                                      <span className="text-thai-green font-semibold">
                                        {formatPrix(
                                          parseFloat(
                                            isExtra
                                              ? extraDetails?.prix?.toString() || "0"
                                              : platDetails?.prix?.toString() || "0"
                                          )
                                        )}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                {/* Prix total */}
                                <div className="text-right">
                                  <div className="text-thai-orange text-xl font-bold md:text-2xl">
                                    {formatPrix(
                                      parseFloat(
                                        isExtra
                                          ? extraDetails?.prix?.toString() || "0"
                                          : platDetails?.prix?.toString() || "0"
                                      ) * (detail.quantite_plat_commande || 0)
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CommandePlatModalTrigger>
                        )
                      })}

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
                <Card className="border-thai-orange/20 animate-fade-in transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
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
              <div className="grid gap-6 lg:grid-cols-2">
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
                        <p className="text-thai-green mb-1 font-medium">
                          2 impasse de la poste 37120 Marigny Marmande
                        </p>
                        <Link
                          href="/nous-trouver"
                          className="text-thai-orange hover:text-thai-green inline-flex items-center gap-1 text-sm underline transition-colors duration-200 hover:no-underline"
                        >
                          <MapPin className="h-4 w-4" />
                          Voir sur la carte
                        </Link>
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
              <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 animate-fade-in transform bg-linear-to-r transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
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
                            Vous pouvez modifier votre commande tant qu'elle n'est pas en
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
                        <p className="text-center text-sm font-medium text-green-800">
                          🍽️ Commande récupérée avec succès ! Bon appétit et merci de votre
                          confiance.
                        </p>
                      </div>
                    )}

                    {commande.statut_commande === "Annulée" && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 transition-all duration-200 hover:bg-red-100 hover:shadow-md">
                        <p className="text-center text-sm font-medium text-red-800">
                          ❌ Cette commande a été annulée.
                        </p>
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
