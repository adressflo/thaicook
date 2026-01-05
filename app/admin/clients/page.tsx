"use client"

import { ClientCombobox } from "@/components/admin/clients/ClientCombobox"
import CreateClientModal from "@/components/admin/clients/CreateClientModal"
import { StatusBadge } from "@/components/historique/StatusBadge"
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
  usePrismaCommandes,
  usePrismaEvenementsByClient,
  usePrismaUpdateClient,
} from "@/hooks/usePrismaData"
import type { ClientInputData, ClientUI, CommandeUI } from "@/types/app"
import { format, isValid as isValidDate, parse } from "date-fns"
import { fr } from "date-fns/locale"
import {
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  Edit,
  Euro,
  Eye,
  Headphones,
  ShoppingCart,
  User,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

const DATE_FORMAT_DB = "yyyy-MM-dd"

// --- Sous-composant : Fiche Client Détaillée ---
const FicheClient = ({
  client,
  commandes,
  onBack,
  router,
}: {
  client: ClientUI
  commandes: CommandeUI[]
  onBack: () => void
  router: any
}) => {
  const [formData, setFormData] = useState({
    nom: client.nom || "",
    prenom: client.prenom || "",
    email: client.email || "",
    numero_de_telephone: client.numero_de_telephone || "",
    adresse_numero_et_rue: client.adresse_numero_et_rue || "",
    code_postal: client.code_postal?.toString() || "",
    ville: client.ville || "",
    preference_client: client.preference_client || "",
  })

  const [birthDate, setBirthDate] = useState<Date | undefined>(() => {
    if (client.date_de_naissance) {
      const dateString =
        typeof client.date_de_naissance === "string"
          ? client.date_de_naissance
          : client.date_de_naissance.toISOString().split("T")[0]
      const parsedDate = parse(dateString, DATE_FORMAT_DB, new Date())
      if (isValidDate(parsedDate)) {
        return parsedDate
      }
    }
    return undefined
  })

  const updateClientMutation = usePrismaUpdateClient()
  const { toast } = useToast()

  // Hook pour récupérer les événements du client
  const { data: evenements } = usePrismaEvenementsByClient(client.idclient)

  // Fonction pour gérer les changements de date de naissance avec sauvegarde automatique
  const handleBirthDateChange = async (newDate: Date | undefined) => {
    setBirthDate(newDate)

    try {
      const dataToUpdate: Partial<ClientInputData> = {
        date_de_naissance:
          newDate && !isNaN(newDate.getTime()) ? format(newDate, DATE_FORMAT_DB) : null,
      }

      await updateClientMutation.mutateAsync({
        data: dataToUpdate,
      })

      toast({
        title: "Sauvegardé",
        description: "Date de naissance mise à jour automatiquement.",
        duration: 1500,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la date de naissance.",
        variant: "destructive",
      })
      console.error("Error updating birth date:", error)
    }
  }

  // Calcul des 5 dernières commandes modifiables et dernier événement
  const commandesRecentes = useMemo(() => {
    return commandes
      .filter((c) => c.date_de_prise_de_commande)
      .sort(
        (a, b) =>
          new Date(b.date_de_prise_de_commande!).getTime() -
          new Date(a.date_de_prise_de_commande!).getTime()
      )
      .slice(0, 5)
  }, [commandes])

  const dernierEvenement = useMemo(() => {
    return evenements && evenements.length > 0
      ? evenements.sort(
          (a, b) =>
            new Date(b.date_evenement || 0).getTime() - new Date(a.date_evenement || 0).getTime()
        )[0]
      : null
  }, [evenements])

  // Fonction pour sauvegarder automatiquement lors des changements
  const handleFieldChange = async (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    try {
      const dataToUpdate: Partial<ClientInputData> = {
        [field]:
          field === "code_postal"
            ? value && !isNaN(parseInt(value))
              ? parseInt(value)
              : null
            : value || null,
      }

      await updateClientMutation.mutateAsync({
        data: dataToUpdate,
      })

      toast({
        title: "Sauvegardé",
        description: `${field} mis à jour automatiquement.`,
        duration: 1500,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder automatiquement.",
        variant: "destructive",
      })
    }
  }

  // Fonctions de navigation vers les pages dédiées
  const navigateToStats = () => {
    router.push(`/admin/clients/${client.auth_user_id}/stats`)
  }

  const navigateToContact = () => {
    router.push(`/admin/clients/${client.auth_user_id}/contact`)
  }

  const navigateToOrders = () => {
    router.push(`/admin/clients/${client.auth_user_id}/orders`)
  }

  const navigateToEvents = () => {
    router.push(`/admin/clients/${client.auth_user_id}/events`)
  }

  return (
    <div className="space-y-6">
      {/* Header avec photo et infos principales - SANS ID */}
      <Card className="border-thai-orange/20 animate-in fade-in-0 bg-white/95 shadow-xl backdrop-blur-sm">
        <CardHeader className="from-thai-cream/30 border-thai-orange/10 border-b bg-linear-to-r to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Photo de profil */}
              <div className="relative">
                {client.photo_client ? (
                  <img
                    src={client.photo_client}
                    alt="Photo client"
                    className="border-thai-orange h-20 w-20 rounded-full border-4 object-cover shadow-lg"
                  />
                ) : (
                  <div className="bg-thai-orange border-thai-orange flex h-20 w-20 items-center justify-center rounded-full border-4 text-2xl font-bold text-white shadow-lg">
                    {client.prenom?.charAt(0) || "C"}
                    {client.nom?.charAt(0) || "L"}
                  </div>
                )}
                <div className="bg-thai-green absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full">
                  <User className="h-3 w-3 text-white" />
                </div>
              </div>

              <div>
                <h2 className="text-thai-green text-2xl font-bold">
                  {client.prenom} {client.nom}
                </h2>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>

            <Button
              onClick={onBack}
              variant="outline"
              className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
            >
              <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
              Retour à la recherche
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Colonne de gauche - Informations principales */}
        <div className="space-y-6">
          {/* Informations personnelles - ÉDITION DIRECTE */}
          <Card className="border-thai-orange/20 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
                <div className="bg-thai-orange/10 text-thai-orange ml-auto rounded-full px-2 py-1 text-xs">
                  Sauvegarde auto
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="prenom" className="text-thai-green font-medium">
                    Prénom
                  </Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleFieldChange("prenom", e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="Prénom du client"
                  />
                </div>
                <div>
                  <Label htmlFor="nom" className="text-thai-green font-medium">
                    Nom
                  </Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleFieldChange("nom", e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="Nom de famille"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-thai-green font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telephone" className="text-thai-green font-medium">
                    Téléphone
                  </Label>
                  <Input
                    id="telephone"
                    value={formData.numero_de_telephone}
                    onChange={(e) => handleFieldChange("numero_de_telephone", e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="adresse" className="text-thai-green font-medium">
                    Adresse
                  </Label>
                  <Input
                    id="adresse"
                    value={formData.adresse_numero_et_rue}
                    onChange={(e) => handleFieldChange("adresse_numero_et_rue", e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="123 Rue de la République"
                  />
                </div>
                <div>
                  <Label htmlFor="code_postal" className="text-thai-green font-medium">
                    Code postal
                  </Label>
                  <Input
                    id="code_postal"
                    value={formData.code_postal}
                    onChange={(e) => handleFieldChange("code_postal", e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="47200"
                  />
                </div>
                <div>
                  <Label htmlFor="ville" className="text-thai-green font-medium">
                    Ville
                  </Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleFieldChange("ville", e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="Marmande"
                  />
                </div>
                <div>
                  <Label className="text-thai-green flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4" />
                    Date de naissance
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Select
                      value={birthDate ? birthDate.getDate().toString().padStart(2, "0") : ""}
                      onValueChange={(day) => {
                        if (birthDate) {
                          const newDate = new Date(birthDate)
                          newDate.setDate(parseInt(day))
                          // Vérifier si la date est valide après modification
                          if (!isNaN(newDate.getTime())) {
                            handleBirthDateChange(newDate)
                          }
                        } else {
                          handleBirthDateChange(new Date(1990, 0, parseInt(day)))
                        }
                      }}
                    >
                      <SelectTrigger className="w-20 text-center [&>span]:text-center">
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
                        birthDate ? (birthDate.getMonth() + 1).toString().padStart(2, "0") : ""
                      }
                      onValueChange={(month) => {
                        if (birthDate) {
                          const newDate = new Date(birthDate)
                          newDate.setMonth(parseInt(month) - 1)
                          // Vérifier si la date est valide après modification
                          if (!isNaN(newDate.getTime())) {
                            handleBirthDateChange(newDate)
                          }
                        } else {
                          handleBirthDateChange(new Date(1990, parseInt(month) - 1, 1))
                        }
                      }}
                    >
                      <SelectTrigger className="w-32 text-center [&>span]:block [&>span]:w-full [&>span]:text-center">
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
                      value={birthDate ? birthDate.getFullYear().toString() : ""}
                      onValueChange={(year) => {
                        if (birthDate) {
                          const newDate = new Date(birthDate)
                          newDate.setFullYear(parseInt(year))
                          // Vérifier si la date est valide après modification
                          if (!isNaN(newDate.getTime())) {
                            handleBirthDateChange(newDate)
                          }
                        } else {
                          handleBirthDateChange(new Date(parseInt(year), 0, 1))
                        }
                      }}
                    >
                      <SelectTrigger className="w-24 text-center [&>span]:text-center">
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: new Date().getFullYear() - 1900 + 1 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <SelectItem key={year} value={year.toString()} className="justify-center">
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Sélectionnez le jour, mois et année de naissance dans les menus déroulants
                    ci-dessus.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="preferences" className="text-thai-green font-medium">
                    Préférences & Allergies
                  </Label>
                  <Textarea
                    id="preferences"
                    value={formData.preference_client}
                    onChange={(e) => handleFieldChange("preference_client", e.target.value)}
                    rows={3}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    placeholder="Allergies, plats préférés, remarques spéciales..."
                  />
                </div>

                {/* Boutons Contact et Stats - Déplacés en bas */}
                <div className="mt-6 md:col-span-2">
                  <div className="bg-thai-cream/10 border-thai-orange/20 flex gap-3 rounded-lg border p-4">
                    <Button
                      onClick={navigateToContact}
                      className="flex-1 bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl"
                    >
                      <Headphones className="mr-2 h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm font-semibold">Communication</div>
                      </div>
                    </Button>

                    <Button
                      onClick={navigateToStats}
                      className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm font-semibold">Statistiques</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5 Dernières commandes MODIFIABLES */}
          <Card className="border-thai-green/20 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />5 Dernières Commandes
                </div>
                <Button
                  onClick={navigateToOrders}
                  variant="outline"
                  size="sm"
                  className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir Toutes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commandesRecentes.length > 0 ? (
                <div className="space-y-3">
                  {commandesRecentes.map((commande) => (
                    <div
                      key={commande.idcommande}
                      className="border-thai-green/20 hover:bg-thai-green/5 group rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-thai-green font-medium">
                              #{commande.idcommande}
                            </span>
                            <StatusBadge statut={commande.statut_commande} type="commande" />
                            <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-thai-green hover:bg-thai-green/20 h-6 px-2"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div className="mb-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {commande.date_de_prise_de_commande
                                ? format(
                                    new Date(commande.date_de_prise_de_commande),
                                    "dd/MM/yyyy à HH:mm",
                                    { locale: fr }
                                  )
                                : "Date inconnue"}
                            </div>
                            {commande.details && commande.details.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {commande.details.length} article
                                {commande.details.length > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-thai-orange font-bold">{commande.prix_total}€</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <ShoppingCart className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                  <p>Aucune commande trouvée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite - Dernier événement + Navigation */}
        <div className="space-y-6">
          {/* Dernier événement - LECTURE SEULE */}
          <Card className="border-thai-gold/20 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-thai-green flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Dernier Événement
                </div>
                <Button
                  onClick={navigateToEvents}
                  variant="outline"
                  size="sm"
                  className="border-thai-gold text-thai-gold hover:bg-thai-gold hover:text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir Tous
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dernierEvenement ? (
                <div className="border-thai-gold/20 bg-thai-cream/5 rounded-lg border p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-thai-green text-lg font-semibold">
                          {dernierEvenement.nom_evenement}
                        </h4>
                        <p className="text-thai-gold text-sm font-medium">
                          {dernierEvenement.type_d_evenement}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="text-thai-gold h-4 w-4" />
                        <span>
                          {dernierEvenement.date_evenement
                            ? format(new Date(dernierEvenement.date_evenement), "dd/MM/yyyy", {
                                locale: fr,
                              })
                            : "Date non définie"}
                        </span>
                      </div>

                      {dernierEvenement.nombre_de_personnes && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="text-thai-gold h-4 w-4" />
                          <span>{dernierEvenement.nombre_de_personnes} personnes</span>
                        </div>
                      )}

                      {dernierEvenement.budget_client && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Euro className="text-thai-gold h-4 w-4" />
                          <span>{dernierEvenement.budget_client}€</span>
                        </div>
                      )}
                    </div>

                    {dernierEvenement.demandes_speciales_evenement && (
                      <div className="bg-thai-cream/10 mt-3 rounded-lg p-3">
                        <p className="text-xs text-gray-600 italic">
                          {dernierEvenement.demandes_speciales_evenement}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Calendar className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                  <p>Aucun événement trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// --- Composant Principal ---
export default function AdminClients() {
  const [selectedClient, setSelectedClient] = useState<ClientUI | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()

  const { data: clients } = usePrismaClients()
  const { data: commandes } = usePrismaCommandes()

  const selectClient = (client: ClientUI) => {
    setSelectedClient(client)
  }

  const handleCreateNewClient = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleClientCreated = (newClient: any) => {
    console.log("Nouveau client créé:", newClient)
    // Optionnel: rafraîchir la liste des clients ou sélectionner le nouveau client
  }

  if (selectedClient) {
    return (
      <FicheClient
        client={selectedClient}
        commandes={commandes?.filter((c) => c.client_r_id === selectedClient.idclient) || []}
        onBack={() => setSelectedClient(null)}
        router={router}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Nouveau Combobox Unifié */}
      <ClientCombobox
        clients={clients}
        onSelectClient={selectClient}
        onCreateNewClient={handleCreateNewClient}
      />

      {/* Modal de création de client */}
      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onClientCreated={handleClientCreated}
      />
    </div>
  )
}
