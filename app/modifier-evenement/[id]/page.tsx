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
import { format } from "date-fns"
import {
  AlertCircle as AlertCircleIcon,
  ArrowLeft,
  Calendar as CalendarIconLucide,
  Clock,
  Loader2,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { memo, useEffect, useMemo, useState } from "react"

import { useData } from "@/contexts/DataContext"
import { usePrismaEvenementById, usePrismaUpdateEvenement } from "@/hooks/usePrismaData"
import { useSession } from "@/lib/auth-client"
import type { EvenementInputData, PlatUI as Plat } from "@/types/app"

const ModifierEvenement = memo(() => {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const updateEvenement = usePrismaUpdateEvenement()

  const { plats, isLoading: dataIsLoading } = useData()
  const { data: session } = useSession()
  const currentUser = session?.user

  const {
    data: evenement,
    isLoading: isLoadingEvenement,
    error,
  } = usePrismaEvenementById(id ? Number(id) : undefined)

  const [dateEvenement, setDateEvenement] = useState<Date | undefined>()
  const [heureEvenement, setHeureEvenement] = useState<string>("")
  const [platsPreSelectionnes, setPlatsPreSelectionnes] = useState<string[]>([])
  const [autreTypeEvenementPrecision, setAutreTypeEvenementPrecision] = useState<string>("")
  const [formData, setFormData] = useState({
    typeEvenement: "",
    nomEvenement: "",
    nombrePersonnes: "",
    budgetClient: "",
    demandesSpeciales: "",
  })

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
    for (let h = 0; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 23 && m > 0) break
        heures.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
      }
    }
    return heures
  }, [])

  // Charger les données de l'événement
  useEffect(() => {
    if (evenement) {
      // Vérifier si le type est dans la liste prédéfinie
      const predefinedTypes = [
        "Anniversaire",
        "Repas d'entreprise",
        "Fête de famille",
        "Cocktail dînatoire",
        "Buffet traiteur",
        "Autre",
      ]
      const typeFromDB = evenement.type_d_evenement || "Autre" // Valeur par défaut si null
      const isCustomType = !predefinedTypes.includes(typeFromDB)

      setFormData({
        typeEvenement: isCustomType ? "Autre" : typeFromDB,
        nomEvenement: evenement.nom_evenement || "",
        nombrePersonnes: evenement.nombre_de_personnes?.toString() || "",
        budgetClient: evenement.budget_client?.toString() || "",
        demandesSpeciales: evenement.demandes_speciales_evenement || "",
      })

      // Si type personnalisé (ou null -> Autre), remplir le champ de précision
      if (isCustomType) {
        // Si le type venait de la DB (et n'était pas null/Autre), on l'utilise
        // Sinon s'il était null/Autre, on met le nom de l'événement ou une valeur par défaut
        const precisionValue = typeFromDB !== "Autre" ? typeFromDB : evenement.nom_evenement || ""
        setAutreTypeEvenementPrecision(precisionValue)
      } else if (typeFromDB === "Autre") {
        setAutreTypeEvenementPrecision(evenement.nom_evenement || "")
      }

      // Date et heure
      if (evenement.date_evenement) {
        const date = new Date(evenement.date_evenement)
        setDateEvenement(date)
        setHeureEvenement(format(date, "HH:mm"))
      }

      // Plats présélectionnés
      if (evenement.plats_preselectionnes) {
        setPlatsPreSelectionnes(evenement.plats_preselectionnes.map((id) => id.toString()))
      }
    }
  }, [evenement])

  // Gérer la redirection si l'utilisateur n'est pas autorisé
  useEffect(() => {
    if (
      !isLoadingEvenement &&
      evenement &&
      currentUser &&
      String(currentUser.id) !== String(evenement.contact_client_r)
    ) {
      router.replace("/historique")
    }
  }, [isLoadingEvenement, evenement, currentUser, router])

  const isLoading = isLoadingEvenement || dataIsLoading

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-thai-orange h-16 w-16 animate-spin" />
      </div>
    )
  }

  if (error || !evenement) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            Impossible de charger cet événement. Il n'existe peut-être pas ou a été supprimé.
          </AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/historique">Retour à l'historique</Link>
          </Button>
        </Alert>
      </div>
    )
  }

  // Vérifier si l'événement peut être modifié
  const canEdit =
    (evenement.statut_evenement as unknown as string) !== "Réalisé" &&
    (evenement.statut_evenement as unknown as string) !== "Payé intégralement"

  if (!canEdit) {
    return (
      <div className="p-8">
        <Alert className="max-w-md">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            Cet événement ne peut plus être modifié car il est{" "}
            {evenement.statut_evenement?.toLowerCase()}.
          </AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/historique">Retour à l'historique</Link>
          </Button>
        </Alert>
      </div>
    )
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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

    // Utiliser la précision si le type est "Autre", sinon utiliser le type sélectionné
    const typeEvenementFinal =
      formData.typeEvenement === "Autre"
        ? autreTypeEvenementPrecision.trim() || "Autre"
        : formData.typeEvenement

    // Relaxer le type pour permettre les strings personnalisées et corriger les noms de champs
    const updateData: Partial<
      Omit<EvenementInputData, "type_d_evenement"> & {
        type_d_evenement: string
        description_evenement?: string
      }
    > = {
      nom_evenement: formData.nomEvenement.trim() || undefined, // Optionnel
      date_evenement: dateEvenementISO,
      type_d_evenement: typeEvenementFinal,
      nombre_de_personnes: parseInt(formData.nombrePersonnes),
      budget_client: formData.budgetClient ? parseFloat(formData.budgetClient) : undefined,
      description_evenement: formData.demandesSpeciales, // Mapping vers le bon champ Zod
      plats_preselectionnes: platsPreSelectionnes.map((id) => parseInt(id)),
    }

    try {
      await updateEvenement.mutateAsync({
        id: evenement.idevenements,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: updateData as any,
      })
      toast({
        title: "Événement modifié !",
        description: "Vos modifications ont été sauvegardées.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
        variant: "destructive",
      })
    }
  }

  return (
    <AppLayout>
      <div className="bg-gradient-thai min-h-screen">
        {/* Bouton retour optimisé */}
        <div className="px-4 py-6">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-6 flex justify-start">
              <Link href="/historique" passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-thai-orange/20 hover:border-thai-orange/40 text-thai-green hover:text-thai-green group rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="hidden sm:inline">Retour à l'historique</span>
                  <span className="sm:hidden">Historique</span>
                </Button>
              </Link>
            </div>

            <TooltipProvider>
              <div>
                <Card className="border-thai-orange/20 shadow-xl">
                  <CardHeader className="from-thai-green to-thai-orange rounded-t-lg bg-linear-to-r py-8 text-center text-white">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold md:text-4xl">
                        Modifier l'Événement
                      </CardTitle>
                    </div>
                    <CardDescription className="mx-auto max-w-2xl px-4 text-lg text-white/90">
                      Modifiez les détails de votre événement selon vos besoins.
                    </CardDescription>
                    <div className="mt-4 flex items-center justify-center text-sm text-white/80">
                      <CalendarIconLucide className="mr-2 h-4 w-4" />
                      <span>Statut: {evenement.statut_evenement} • Minimum 10 personnes</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 md:p-8">
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
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                      src={plat.photo_du_plat}
                                      alt={plat.plat}
                                      className="mb-2 h-32 w-full rounded-md object-cover"
                                    />
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

                      <div className="border-thai-orange/20 border-t pt-6">
                        <Button
                          type="submit"
                          disabled={updateEvenement.isPending}
                          className="from-thai-green to-thai-orange hover:from-thai-green/90 hover:to-thai-orange/90 h-14 w-full border-0 bg-linear-to-r text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                        >
                          {updateEvenement.isPending ? (
                            <>
                              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                              Sauvegarde en cours...
                            </>
                          ) : (
                            <>
                              <Users className="mr-3 h-6 w-6" />
                              Sauvegarder les modifications
                            </>
                          )}
                        </Button>

                        <div className="mt-4 space-y-2 text-center">
                          <p className="text-thai-green/70 text-sm font-medium">
                            ✨ Modifications sauvegardées immédiatement
                          </p>
                          <p className="text-thai-green/60 text-xs">
                            🎉 Événement personnalisé • 👨‍🍳 Service professionnel • 📞 Support dédié
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

ModifierEvenement.displayName = "ModifierEvenement"
export default ModifierEvenement
