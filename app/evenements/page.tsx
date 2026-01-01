"use client"
import { AppLayout } from "@/components/layout/AppLayout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { type Locale } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertCircle as AlertCircleIcon,
  Calendar as CalendarIconLucide,
  Clock,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { memo, useMemo, useState } from "react"

import { getClientProfile } from "@/app/profil/actions"
import { useData } from "@/contexts/DataContext"
import { usePrismaCreateEvenement } from "@/hooks/usePrismaData"
import { useSession } from "@/lib/auth-client"
import type { CreateEvenementData, PlatUI as Plat } from "@/types/app"
import { useEffect, useState as useReactState } from "react"

export const dynamic = "force-dynamic"

const Evenements = memo(() => {
  const { toast } = useToast()
  const createEvenement = usePrismaCreateEvenement()

  const { plats, isLoading: dataIsLoading, error: dataError } = useData()

  // Better Auth session
  const { data: session } = useSession()
  const currentUser = session?.user

  // Client profile
  const [clientProfile, setClientProfile] = useReactState<any>(null)

  useEffect(() => {
    if (currentUser) {
      getClientProfile().then(setClientProfile)
    } else {
      setClientProfile(null)
    }
  }, [currentUser?.id])

  const currentUserProfile = clientProfile

  const [dateEvenement, setDateEvenement] = useState<Date | undefined>()
  const [heureEvenement, setHeureEvenement] = useState<string>("")
  const [platsPreSelectionnes, setPlatsPreSelectionnes] = useState<string[]>([])
  const [autreTypeEvenementPrecision, setAutreTypeEvenementPrecision] = useState<string>("")
  const initialFormData = {
    typeEvenement: "",
    nomEvenement: "",
    nombrePersonnes: "",
    budgetClient: "",
    demandesSpeciales: "",
  }
  const [formData, setFormData] = useState(initialFormData)

  const typesEvenements = useMemo(
    () => [
      "Anniversaire",
      "Repas d'entreprise",
      "Fête de famille",
      "Cocktail dînatoire",
      "Buffet traiteur",
      "Autre",
    ],
    []
  )

  const heuresDisponibles = useMemo(() => {
    const heures: string[] = []
    for (let h = 9; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 23 && m > 0) break
        heures.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
      }
    }
    return heures
  }, [])

  const handleInputChange = (field: keyof typeof initialFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "typeEvenement" && value !== "Autre") {
      setAutreTypeEvenementPrecision("")
    }
  }

  const handlePlatSelectionChange = (platId: string, checked: boolean) => {
    setPlatsPreSelectionnes((prev) =>
      checked ? [...prev, platId] : prev.filter((id) => id !== platId)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser?.id || !currentUserProfile?.idclient) {
      toast({
        title: "Profil requis",
        description: "Veuillez vous connecter et compléter votre profil pour faire une demande.",
        variant: "destructive",
      })
      return
    }
    if (!dateEvenement || !formData.typeEvenement || !formData.nombrePersonnes) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires (*).",
        variant: "destructive",
      })
      return
    }
    if (formData.typeEvenement === "Autre" && !autreTypeEvenementPrecision.trim()) {
      toast({
        title: "Précision requise",
        description: "Veuillez préciser le type d'événement.",
        variant: "destructive",
      })
      return
    }
    if (parseInt(formData.nombrePersonnes) < 10) {
      toast({
        title: "Nombre de personnes",
        description: "Le nombre de personnes doit être d'au moins 10.",
        variant: "destructive",
      })
      return
    }

    let dateEvenementISO = dateEvenement.toISOString()
    if (heureEvenement) {
      const [heures, minutes] = heureEvenement.split(":")
      dateEvenement.setHours(parseInt(heures), parseInt(minutes), 0, 0)
      dateEvenementISO = dateEvenement.toISOString()
    }

    // Adaptation pour Supabase
    // Déterminer le type d'événement
    const typeEvenementFinal =
      formData.typeEvenement === "Autre"
        ? autreTypeEvenementPrecision.trim()
        : formData.typeEvenement

    const evenementData: CreateEvenementData = {
      nom_evenement: formData.nomEvenement.trim() || typeEvenementFinal, // Fallback au type si vide
      type_d_evenement: typeEvenementFinal, // Type obligatoire
      contact_client_r: currentUser.id, // UID Firebase pour le lien utilisateur
      contact_client_r_id: currentUserProfile!.idclient,
      date_evenement: dateEvenementISO,
      nombre_personnes: parseInt(formData.nombrePersonnes),
      lieu_evenement: "À définir",
      budget_approximatif: formData.budgetClient ? parseFloat(formData.budgetClient) : undefined,
      description_evenement: formData.demandesSpeciales || undefined,
      plats_preselectionnes: platsPreSelectionnes.map((id) => parseInt(id)),
    }

    try {
      await createEvenement.mutateAsync(evenementData)
      toast({
        title: "Demande envoyée !",
        description: "Nous vous recontacterons bientôt.",
      })
      setFormData(initialFormData)
      setDateEvenement(undefined)
      setHeureEvenement("")
      setPlatsPreSelectionnes([])
      setAutreTypeEvenementPrecision("")
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
        variant: "destructive",
      })
    }
  }

  const getDateLocale = (): Locale => fr

  const isLoading = dataIsLoading
  const showProfileAlert = !currentUser || !currentUserProfile

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-thai-orange h-16 w-16 animate-spin" />
      </div>
    )
  }

  if (dataError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{dataError.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="bg-gradient-thai min-h-screen">
        {/* Bouton retour optimisé */}
        <div className="px-4 py-6">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-6 flex justify-start">
              <Link href="/" passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-thai-orange/20 hover:border-thai-orange/40 text-thai-green hover:text-thai-green group rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
                >
                  <CalendarIconLucide className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="hidden sm:inline">Retour à l'accueil</span>
                  <span className="sm:hidden">Accueil</span>
                </Button>
              </Link>
            </div>

            <TooltipProvider>
              <div>
                <Card className="border-thai-orange/20 shadow-xl">
                  <CardHeader className="from-thai-green to-thai-orange rounded-t-lg bg-linear-to-r py-8 text-center text-white">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                        <CalendarIconLucide className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold md:text-4xl">
                        Pour vos Événements
                      </CardTitle>
                    </div>
                    <CardDescription className="mx-auto max-w-2xl px-4 text-lg text-white/90">
                      Créez des moments inoubliables avec nos saveurs authentiques thaïlandaises.
                    </CardDescription>
                    <div className="mt-4 flex items-center justify-center text-sm text-white/80">
                      <CalendarIconLucide className="mr-2 h-4 w-4" />
                      <span>Minimum 10 personnes • Service professionnel • Devis gratuit</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    {showProfileAlert && (
                      <Alert className="border-thai-orange/30 bg-thai-cream/50 mb-6">
                        <AlertCircleIcon className="text-thai-orange h-4 w-4" />
                        <AlertDescription className="text-thai-green">
                          <strong>Connexion requise :</strong> Veuillez vous connecter pour faire
                          une demande d'événement.
                          {!currentUser && (
                            <Link
                              href="/profil"
                              className="text-thai-orange hover:text-thai-orange/80 ml-1 font-medium underline"
                            >
                              Se connecter / Créer un profil
                            </Link>
                          )}
                          {currentUser && !currentUserProfile && (
                            <Link
                              href="/profil"
                              className="text-thai-orange hover:text-thai-orange/80 ml-1 font-medium underline"
                            >
                              Compléter mon profil
                            </Link>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Nom de l'événement - Optionnel */}
                      <div className="space-y-2">
                        <Label htmlFor="nomEvenement">Nom de l'événement (optionnel)</Label>
                        <Input
                          id="nomEvenement"
                          value={formData.nomEvenement}
                          onChange={(e) => handleInputChange("nomEvenement", e.target.value)}
                          placeholder="Ex: Anniversaire de Marie, Gala d'entreprise..."
                        />
                        <p className="text-xs text-gray-500">
                          Donnez un nom personnalisé à votre événement.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-1 sm:gap-6 lg:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="typeEvenement">Type d'événement *</Label>
                          <Select
                            value={formData.typeEvenement}
                            onValueChange={(value) => handleInputChange("typeEvenement", value)}
                          >
                            <SelectTrigger id="typeEvenement">
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                            <SelectContent>
                              {typesEvenements.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.typeEvenement === "Autre" && (
                          <div className="space-y-2">
                            <Label htmlFor="autreTypeEvenementPrecision">Précisez le type *</Label>
                            <Input
                              id="autreTypeEvenementPrecision"
                              value={autreTypeEvenementPrecision}
                              onChange={(e) => setAutreTypeEvenementPrecision(e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-thai-green flex items-center text-lg font-medium">
                            <CalendarIconLucide className="text-thai-orange mr-2 h-5 w-5" />
                            Date de l'événement *
                          </Label>
                          <div className="flex gap-2">
                            <Select
                              value={
                                dateEvenement
                                  ? dateEvenement.getDate().toString().padStart(2, "0")
                                  : ""
                              }
                              onValueChange={(day) => {
                                if (dateEvenement) {
                                  const newDate = new Date(dateEvenement)
                                  newDate.setDate(parseInt(day))
                                  setDateEvenement(newDate)
                                } else {
                                  const today = new Date()
                                  setDateEvenement(
                                    new Date(today.getFullYear(), today.getMonth(), parseInt(day))
                                  )
                                }
                              }}
                            >
                              <SelectTrigger className="w-28 text-center [&>span]:text-center">
                                <SelectValue placeholder="Jour" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                  <SelectItem
                                    key={day}
                                    value={day.toString().padStart(2, "0")}
                                    className="justify-center"
                                  >
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={
                                dateEvenement
                                  ? (dateEvenement.getMonth() + 1).toString().padStart(2, "0")
                                  : ""
                              }
                              onValueChange={(month) => {
                                if (dateEvenement) {
                                  const newDate = new Date(dateEvenement)
                                  newDate.setMonth(parseInt(month) - 1)
                                  setDateEvenement(newDate)
                                } else {
                                  const today = new Date()
                                  setDateEvenement(
                                    new Date(today.getFullYear(), parseInt(month) - 1, 1)
                                  )
                                }
                              }}
                            >
                              <SelectTrigger className="w-36 text-center [&>span]:block [&>span]:w-full [&>span]:text-center">
                                <SelectValue placeholder="Mois" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="01" className="justify-center">
                                  Janvier
                                </SelectItem>
                                <SelectItem value="02" className="justify-center">
                                  Février
                                </SelectItem>
                                <SelectItem value="03" className="justify-center">
                                  Mars
                                </SelectItem>
                                <SelectItem value="04" className="justify-center">
                                  Avril
                                </SelectItem>
                                <SelectItem value="05" className="justify-center">
                                  Mai
                                </SelectItem>
                                <SelectItem value="06" className="justify-center">
                                  Juin
                                </SelectItem>
                                <SelectItem value="07" className="justify-center">
                                  Juillet
                                </SelectItem>
                                <SelectItem value="08" className="justify-center">
                                  Août
                                </SelectItem>
                                <SelectItem value="09" className="justify-center">
                                  Septembre
                                </SelectItem>
                                <SelectItem value="10" className="justify-center">
                                  Octobre
                                </SelectItem>
                                <SelectItem value="11" className="justify-center">
                                  Novembre
                                </SelectItem>
                                <SelectItem value="12" className="justify-center">
                                  Décembre
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={dateEvenement ? dateEvenement.getFullYear().toString() : ""}
                              onValueChange={(year) => {
                                if (dateEvenement) {
                                  const newDate = new Date(dateEvenement)
                                  newDate.setFullYear(parseInt(year))
                                  setDateEvenement(newDate)
                                } else {
                                  setDateEvenement(new Date(parseInt(year), 0, 1))
                                }
                              }}
                            >
                              <SelectTrigger className="w-28 text-center [&>span]:text-center">
                                <SelectValue placeholder="Année" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  { length: 5 },
                                  (_, i) => new Date().getFullYear() + i
                                ).map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                    className="justify-center"
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="heureEvenement"
                            className="text-thai-green flex items-center text-lg font-medium"
                          >
                            <Clock className="text-thai-orange mr-2 h-5 w-5" />
                            Heure de l'événement *
                          </Label>
                          <Select value={heureEvenement} onValueChange={setHeureEvenement}>
                            <SelectTrigger
                              id="heureEvenement"
                              className="border-thai-orange/30 hover:border-thai-orange h-12 transition-colors duration-200"
                            >
                              <SelectValue
                                placeholder="🕐 Sélectionner une heure"
                                className="text-thai-green/60"
                              />
                            </SelectTrigger>
                            <SelectContent className="border-thai-orange/20">
                              {heuresDisponibles.map((h) => (
                                <SelectItem key={h} value={h} className="hover:bg-thai-orange/10">
                                  <span className="flex items-center">🕐 {h}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="nombrePersonnes">Nombre de personnes *</Label>
                          <Input
                            id="nombrePersonnes"
                            type="number"
                            min="10"
                            value={formData.nombrePersonnes}
                            onChange={(e) => handleInputChange("nombrePersonnes", e.target.value)}
                          />
                          <p className="text-xs text-gray-500">Minimum de 10 personnes.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budgetClient">Budget indicatif (€)</Label>
                          <Input
                            id="budgetClient"
                            type="number"
                            step="1"
                            min="0"
                            value={formData.budgetClient}
                            onChange={(e) => handleInputChange("budgetClient", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="demandesSpeciales">Demandes spéciales / Thème</Label>
                        <Textarea
                          id="demandesSpeciales"
                          value={formData.demandesSpeciales}
                          onChange={(e) => handleInputChange("demandesSpeciales", e.target.value)}
                          rows={4}
                          placeholder="Allergies, régimes spécifiques..."
                        />
                      </div>

                      <div className="space-y-4 border-t pt-6">
                        <Label className="text-thai-green text-lg font-semibold">
                          Les plats désirés
                        </Label>
                        <div className="grid gap-x-6 gap-y-4 p-2 sm:grid-cols-2 md:grid-cols-3">
                          {plats?.map((plat: Plat) => (
                            <div key={plat.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={`plat-event-${plat.id}`}
                                checked={platsPreSelectionnes.includes(plat.id.toString())}
                                onCheckedChange={(checked) =>
                                  handlePlatSelectionChange(plat.id.toString(), !!checked)
                                }
                              />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Label
                                    htmlFor={`plat-event-${plat.id}`}
                                    className="hover:text-thai-orange cursor-pointer font-medium"
                                  >
                                    {plat.plat}
                                  </Label>
                                </TooltipTrigger>
                                <TooltipContent className="border-thai-orange w-64 rounded-md bg-white p-2 shadow-lg">
                                  {plat.photo_du_plat && (
                                    <div className="relative mb-2 h-32 w-full">
                                      <Image
                                        src={plat.photo_du_plat}
                                        alt={plat.plat}
                                        fill
                                        className="rounded-md object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                    </div>
                                  )}
                                  <p className="text-sm font-semibold">{plat.plat}</p>
                                  {plat.description && (
                                    <p className="mt-1 text-xs text-gray-600">{plat.description}</p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ))}
                        </div>
                        {platsPreSelectionnes.length > 0 && (
                          <p className="text-muted-foreground text-sm">
                            {platsPreSelectionnes.length} plat(s) sélectionné(s)
                          </p>
                        )}
                      </div>

                      <div className="from-thai-cream/50 to-thai-gold/10 border-thai-orange/20 rounded-xl border bg-linear-to-r p-6">
                        <div className="mb-4 flex items-center">
                          <div className="bg-thai-orange/10 mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                            <CalendarIconLucide className="text-thai-orange h-4 w-4" />
                          </div>
                          <h4 className="text-thai-green text-lg font-bold">Comment ça marche ?</h4>
                        </div>
                        <div className="text-thai-green/80 grid gap-4 text-sm sm:grid-cols-2">
                          <div className="flex items-start space-x-2">
                            <span className="bg-thai-orange mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                              1
                            </span>
                            <span>Envoyez votre demande avec vos préférences</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="bg-thai-orange mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                              2
                            </span>
                            <span>Nous vous appelons sous 24h pour les détails</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="bg-thai-orange mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                              3
                            </span>
                            <span>Devis gratuit personnalisé selon vos besoins</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="bg-thai-orange mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                              4
                            </span>
                            <span>Confirmation et préparation de votre événement</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-thai-orange/20 border-t pt-6">
                        <Button
                          type="submit"
                          disabled={createEvenement.isPending || showProfileAlert}
                          className="from-thai-green to-thai-orange hover:from-thai-green/90 hover:to-thai-orange/90 h-14 w-full border-0 bg-linear-to-r text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                        >
                          {createEvenement.isPending ? (
                            <>
                              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <CalendarIconLucide className="mr-3 h-6 w-6" />
                              Envoyer ma demande d'événement
                            </>
                          )}
                        </Button>

                        <div className="mt-4 space-y-2 text-center">
                          <p className="text-thai-green/70 text-sm font-medium">
                            ✨ Réponse garantie sous 24h
                          </p>
                          <p className="text-thai-green/60 text-xs">
                            💰 Devis gratuit • 🍽️ Service professionnel • 📞 Support personnalisé
                          </p>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </AppLayout>
  )
})

Evenements.displayName = "Evenements"

export default Evenements
