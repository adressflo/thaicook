"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"
import {
  usePrismaClients,
  usePrismaCreateEvenement,
  usePrismaEvenementsByClient,
} from "@/hooks/usePrismaData"
import type { ClientUI, CreateEvenementData, EvenementUI } from "@/types/app"
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Edit,
  Euro,
  Filter,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"

const typeEvenements = [
  "Anniversaire",
  "Repas d'entreprise",
  "Fête de famille",
  "Cocktail dînatoire",
  "Buffet traiteur",
  "Autre",
] as const

const statutsEvenement = [
  "Devis demandé",
  "Devis envoyé",
  "Confirmé / Acompte reçu",
  "En préparation",
  "Payé intégralement",
  "Réalisé",
  "Annulé",
] as const

export default function ClientEventsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const clientAuthId = params.id as string

  const { data: clients } = usePrismaClients()
  const client = clients?.find((c: ClientUI) => c.auth_user_id === clientAuthId)
  const { data: evenements } = usePrismaEvenementsByClient(client?.idclient)
  const createEvenementMutation = usePrismaCreateEvenement()

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [_editingEvent, _setEditingEvent] = useState<EvenementUI | null>(null)

  const [formData, setFormData] = useState({
    nom_evenement: "",
    date_evenement: "",
    type_d_evenement: "Autre" as string,
    nombre_de_personnes: "",
    lieu_evenement: "",
    budget_client: "",
    demandes_speciales_evenement: "",
    statut: "Devis demandé",
  })

  // Le client est déjà récupéré plus haut (ligne 62)

  // Filtrer les événements
  const filteredEvenements = useMemo(() => {
    if (!evenements) return []

    let filtered = [...evenements]

    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.nom_evenement?.toLowerCase().includes(term) ||
          event.type_d_evenement?.toLowerCase().includes(term) ||
          event.demandes_speciales_evenement?.toLowerCase().includes(term)
      )
    }

    // Filtre par type
    if (typeFilter !== "all") {
      filtered = filtered.filter((event) => event.type_d_evenement === typeFilter)
    }

    // Tri par date décroissante
    filtered.sort((a, b) => {
      const dateA = a.date_evenement ? new Date(a.date_evenement) : new Date(0)
      const dateB = b.date_evenement ? new Date(b.date_evenement) : new Date(0)
      return dateB.getTime() - dateA.getTime()
    })

    return filtered
  }, [evenements, searchTerm, typeFilter])

  // Statistiques
  const stats = useMemo(() => {
    if (!evenements) return { total: 0, totalBudget: 0, parStatut: {}, parType: {} }

    const total = evenements.length
    const totalBudget = evenements.reduce(
      (sum: number, event: EvenementUI) => sum + parseFloat(event.budget_client || "0"),
      0
    )

    const parStatut = evenements.reduce(
      (acc: Record<string, number>, _event: EvenementUI) => {
        // Utilisation du statut fictif pour la démo
        const status = formData.statut || "Devis demandé"
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const parType = evenements.reduce(
      (acc: Record<string, number>, event: EvenementUI) => {
        const type = event.type_d_evenement || "Autre"
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return { total, totalBudget, parStatut, parType }
  }, [evenements, formData.statut])

  // Génération du calendrier
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })

    return days.map((day) => {
      const dayEvents = filteredEvenements.filter(
        (event) => event.date_evenement && isSameDay(new Date(event.date_evenement), day)
      )

      return {
        date: day,
        events: dayEvents,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isSameDay(day, new Date()),
      }
    })
  }, [currentDate, filteredEvenements])

  // Fonction pour créer un nouvel événement
  const handleCreateEvent = async () => {
    if (!formData.nom_evenement.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir un nom pour l'événement.",
        variant: "destructive",
      })
      return
    }

    try {
      const eventData: CreateEvenementData = {
        nom_evenement: formData.nom_evenement,
        type_d_evenement: formData.type_d_evenement || "Autre",
        contact_client_r: clientAuthId,
        contact_client_r_id: client?.idclient || 0,
        date_evenement: formData.date_evenement || new Date().toISOString().split("T")[0],
        nombre_personnes: formData.nombre_de_personnes ? parseInt(formData.nombre_de_personnes) : 1,
        lieu_evenement: formData.lieu_evenement || "À définir",
        budget_approximatif: formData.budget_client
          ? parseFloat(formData.budget_client)
          : undefined,
        description_evenement: formData.demandes_speciales_evenement || undefined,
      }

      await createEvenementMutation.mutateAsync(eventData)

      toast({
        title: "Événement créé",
        description: "L'événement a été créé avec succès.",
      })

      // Reset du formulaire
      setFormData({
        nom_evenement: "",
        date_evenement: "",
        type_d_evenement: "Autre",
        nombre_de_personnes: "",
        lieu_evenement: "",
        budget_client: "",
        demandes_speciales_evenement: "",
        statut: "Devis demandé",
      })
      setShowCreateModal(false)
    } catch (_error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'événement.",
        variant: "destructive",
      })
    }
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-thai-orange mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-thai min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la Fiche
            </Button>

            <div className="flex items-center gap-3">
              {client.photo_client ? (
                <img
                  src={client.photo_client}
                  alt="Photo client"
                  className="border-thai-orange h-12 w-12 rounded-full border-2 object-cover shadow-lg"
                />
              ) : (
                <div className="bg-thai-orange flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                  {client.prenom?.charAt(0) || "C"}
                  {client.nom?.charAt(0) || "L"}
                </div>
              )}

              <div>
                <h1 className="text-thai-green text-2xl font-bold">
                  Événements - {client.prenom} {client.nom}
                </h1>
                <p className="text-thai-green/70">Planning & calendrier</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-thai-orange hover:bg-thai-orange/90 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Événement
            </Button>

            <div className="border-thai-orange/30 flex rounded-lg border">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-thai-orange text-white" : "text-thai-orange"}
              >
                Liste
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={
                  viewMode === "calendar" ? "bg-thai-orange text-white" : "text-thai-orange"
                }
              >
                <Calendar className="mr-1 h-4 w-4" />
                Calendrier
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Total Événements</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-6 w-6 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Budget Total</p>
                  <p className="text-2xl font-bold">{stats.totalBudget}€</p>
                </div>
                <Euro className="h-6 w-6 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100">Confirmés</p>
                  <p className="text-2xl font-bold">
                    {stats.parStatut["Confirmé / Acompte reçu"] || 0}
                  </p>
                </div>
                <Users className="h-6 w-6 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-100">En Attente</p>
                  <p className="text-2xl font-bold">{stats.parStatut["Devis demandé"] || 0}</p>
                </div>
                <Clock className="h-6 w-6 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-thai-green flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres & Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="text-thai-orange absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Rechercher événements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-thai-orange/30 focus:border-thai-orange pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {typeEvenements.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {statutsEvenement.map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm("")
                  setTypeFilter("all")
                  setStatusFilter("all")
                }}
                variant="outline"
                className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contenu principal selon le mode */}
        {viewMode === "list" ? (
          /* Mode Liste */
          <div className="space-y-4">
            {filteredEvenements.length > 0 ? (
              filteredEvenements.map((evenement) => (
                <Card
                  key={evenement.id}
                  className="bg-white/95 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header événement */}
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-thai-green text-xl font-bold">
                              {evenement.nom_evenement}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                              <span className="bg-thai-gold/20 text-thai-gold rounded-full px-2 py-1 font-medium">
                                {evenement.type_d_evenement}
                              </span>
                              <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-600">
                                Devis demandé
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-thai-orange text-2xl font-bold">
                              {evenement.budget_client
                                ? `${evenement.budget_client}€`
                                : "Budget à définir"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {evenement.nombre_de_personnes
                                ? `${evenement.nombre_de_personnes} personnes`
                                : "Nombre à définir"}
                            </div>
                          </div>
                        </div>

                        {/* Détails événement */}
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="text-thai-orange h-4 w-4" />
                            <div>
                              <div className="font-medium">Date événement</div>
                              <div>
                                {evenement.date_evenement
                                  ? format(new Date(evenement.date_evenement), "dd/MM/yyyy", {
                                      locale: fr,
                                    })
                                  : "Date à définir"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="text-thai-orange h-4 w-4" />
                            <div>
                              <div className="font-medium">Nombre de personnes</div>
                              <div>{evenement.nombre_de_personnes || "À définir"}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Euro className="text-thai-orange h-4 w-4" />
                            <div>
                              <div className="font-medium">Budget prévu</div>
                              <div>
                                {evenement.budget_client
                                  ? `${evenement.budget_client}€`
                                  : "À définir"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Demandes spéciales */}
                        {evenement.demandes_speciales_evenement && (
                          <div className="bg-thai-cream/10 rounded-lg p-4">
                            <div className="text-thai-green mb-2 text-sm font-medium">
                              Demandes spéciales:
                            </div>
                            <div className="text-sm text-gray-700 italic">
                              {evenement.demandes_speciales_evenement}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-thai-green text-thai-green hover:bg-thai-green px-3 hover:text-white"
                          title="Modifier"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Modifier
                        </Button>

                        <Button variant="outline" size="sm" className="px-3" title="Dupliquer">
                          <Copy className="mr-1 h-3 w-3" />
                          Dupliquer
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/95 shadow-lg backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <h3 className="mb-2 text-xl font-semibold text-gray-600">
                    Aucun événement trouvé
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Ce client n'a pas encore d'événement planifié.
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-thai-orange hover:bg-thai-orange/90 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un événement
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Mode Calendrier */
          <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendrier - {format(currentDate, "MMMM yyyy", { locale: fr })}
                </CardTitle>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addDays(startOfMonth(currentDate), -1))}
                  >
                    ← Mois précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
                  >
                    Aujourd'hui
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addDays(endOfMonth(currentDate), 1))}
                  >
                    Mois suivant →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-7 gap-2">
                {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[80px] rounded-lg border border-gray-200 p-2 ${
                      day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${day.isToday ? "ring-thai-orange bg-thai-orange/5 ring-2" : ""}`}
                  >
                    <div
                      className={`mb-1 text-sm font-medium ${
                        day.isToday
                          ? "text-thai-orange"
                          : day.isCurrentMonth
                            ? "text-gray-900"
                            : "text-gray-400"
                      }`}
                    >
                      {format(day.date, "d")}
                    </div>

                    <div className="space-y-1">
                      {day.events.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="bg-thai-gold/20 text-thai-gold hover:bg-thai-gold/30 cursor-pointer truncate rounded p-1 text-xs transition-colors"
                          title={event.nom_evenement || "Événement"}
                        >
                          {event.nom_evenement}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal création événement */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-thai-green flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Nouvel Événement
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="nom" className="text-thai-green font-medium">
                      Nom de l'événement *
                    </Label>
                    <Input
                      id="nom"
                      value={formData.nom_evenement}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, nom_evenement: e.target.value }))
                      }
                      placeholder="Anniversaire de Marie..."
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-thai-green font-medium">
                      Date de l'événement
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date_evenement}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, date_evenement: e.target.value }))
                      }
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-thai-green font-medium">
                      Type d'événement
                    </Label>
                    <Select
                      value={formData.type_d_evenement}
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({ ...prev, type_d_evenement: value }))
                      }
                    >
                      <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {typeEvenements.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="personnes" className="text-thai-green font-medium">
                      Nombre de personnes
                    </Label>
                    <Input
                      id="personnes"
                      type="number"
                      value={formData.nombre_de_personnes}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, nombre_de_personnes: e.target.value }))
                      }
                      placeholder="50"
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget" className="text-thai-green font-medium">
                      Budget client (€)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      value={formData.budget_client}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, budget_client: e.target.value }))
                      }
                      placeholder="500.00"
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="demandes" className="text-thai-green font-medium">
                    Demandes spéciales
                  </Label>
                  <Textarea
                    id="demandes"
                    value={formData.demandes_speciales_evenement}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        demandes_speciales_evenement: e.target.value,
                      }))
                    }
                    placeholder="Menu végétarien, décoration spéciale..."
                    rows={3}
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateEvent}
                    className="bg-thai-orange hover:bg-thai-orange/90 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Créer l'événement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
