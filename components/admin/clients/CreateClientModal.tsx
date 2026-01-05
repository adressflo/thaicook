"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { usePrismaCreateClient } from "@/hooks/usePrismaData"
import { Calendar, Loader2, Mail, MapPin, Phone, Save, User, X } from "lucide-react"
import React, { useState } from "react"

interface CreateClientModalProps {
  isOpen: boolean
  onClose: () => void
  onClientCreated?: (client: any) => void
}

const CreateClientModal = ({ isOpen, onClose, onClientCreated }: CreateClientModalProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    numero_de_telephone: "",
    adresse_numero_et_rue: "",
    code_postal: "",
    ville: "",
    date_de_naissance: "",
    preference_client: "",
  })

  const createClientMutation = usePrismaCreateClient()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation basique côté client
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom, prénom et email sont obligatoires.",
        variant: "destructive",
      })
      return
    }

    try {
      // Générer un auth_user_id temporaire pour les clients créés manuellement
      // Dans un vrai scénario, cela viendrait de Better Auth
      const temporaryAuthUserId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const clientData = {
        auth_user_id: temporaryAuthUserId,
        email: formData.email.trim(),
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        numero_de_telephone: formData.numero_de_telephone.trim() || undefined,
      }

      const newClient = await createClientMutation.mutateAsync(clientData)

      toast({
        title: "Client créé avec succès",
        description: `${formData.prenom} ${formData.nom} a été ajouté à la base de données.`,
      })

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        numero_de_telephone: "",
        adresse_numero_et_rue: "",
        code_postal: "",
        ville: "",
        date_de_naissance: "",
        preference_client: "",
      })

      // Callback pour notifier le parent
      if (onClientCreated) {
        onClientCreated(newClient)
      }

      onClose()
    } catch (error) {
      console.error("Erreur lors de la création du client:", error)
      toast({
        title: "Erreur lors de la création",
        description:
          error instanceof Error ? error.message : "Une erreur inattendue s'est produite.",
        variant: "destructive",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <Card className="border-0 shadow-none">
          <CardHeader className="from-thai-orange/5 to-thai-cream/20 border-thai-orange/10 border-b bg-linear-to-r">
            <div className="flex items-center justify-between">
              <CardTitle className="text-thai-green flex items-center gap-3">
                <div className="bg-thai-orange/10 border-thai-orange/20 rounded-lg border p-2 shadow-sm">
                  <User className="text-thai-orange h-6 w-6" />
                </div>
                <div>
                  <span className="text-xl font-bold">Nouveau Client</span>
                  <p className="mt-1 text-sm font-normal text-gray-600">
                    Créer une nouvelle fiche client
                  </p>
                </div>
              </CardTitle>
              <Button
                variant="ghost"
                onClick={onClose}
                className="hover:bg-thai-red/10 hover:text-thai-red transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="prenom" className="text-thai-green font-medium">
                      Prénom *
                    </Label>
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange("prenom", e.target.value)}
                      className="border-thai-green/30 focus:border-thai-green mt-1"
                      placeholder="Prénom du client"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nom" className="text-thai-green font-medium">
                      Nom *
                    </Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      className="border-thai-green/30 focus:border-thai-green mt-1"
                      placeholder="Nom de famille"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-thai-green flex items-center gap-2 font-medium"
                  >
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-thai-green/30 focus:border-thai-green mt-1"
                    placeholder="email@exemple.com"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="telephone"
                    className="text-thai-green flex items-center gap-2 font-medium"
                  >
                    <Phone className="h-4 w-4" />
                    Numéro de téléphone
                  </Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.numero_de_telephone}
                    onChange={(e) => handleInputChange("numero_de_telephone", e.target.value)}
                    className="border-thai-green/30 focus:border-thai-green mt-1"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="date_naissance"
                    className="text-thai-green flex items-center gap-2 font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    Date de naissance
                  </Label>
                  <Input
                    id="date_naissance"
                    type="date"
                    value={formData.date_de_naissance}
                    onChange={(e) => handleInputChange("date_de_naissance", e.target.value)}
                    className="border-thai-green/30 focus:border-thai-green mt-1"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <h3 className="text-thai-green flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5" />
                  Adresse
                </h3>

                <div>
                  <Label htmlFor="adresse" className="text-thai-green font-medium">
                    Numéro et rue
                  </Label>
                  <Input
                    id="adresse"
                    value={formData.adresse_numero_et_rue}
                    onChange={(e) => handleInputChange("adresse_numero_et_rue", e.target.value)}
                    className="border-thai-green/30 focus:border-thai-green mt-1"
                    placeholder="123 Rue de la Paix"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="code_postal" className="text-thai-green font-medium">
                      Code postal
                    </Label>
                    <Input
                      id="code_postal"
                      value={formData.code_postal}
                      onChange={(e) => handleInputChange("code_postal", e.target.value)}
                      className="border-thai-green/30 focus:border-thai-green mt-1"
                      placeholder="75001"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ville" className="text-thai-green font-medium">
                      Ville
                    </Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => handleInputChange("ville", e.target.value)}
                      className="border-thai-green/30 focus:border-thai-green mt-1"
                      placeholder="Paris"
                    />
                  </div>
                </div>
              </div>

              {/* Préférences */}
              <div className="space-y-4">
                <h3 className="text-thai-green text-lg font-semibold">Préférences et notes</h3>

                <div>
                  <Label htmlFor="preferences" className="text-thai-green font-medium">
                    Préférences du client
                  </Label>
                  <Textarea
                    id="preferences"
                    value={formData.preference_client}
                    onChange={(e) => handleInputChange("preference_client", e.target.value)}
                    className="border-thai-green/30 focus:border-thai-green mt-1"
                    placeholder="Allergies, préférences alimentaires, notes spéciales..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createClientMutation.isPending}
                  className="bg-thai-green hover:bg-thai-green/90 text-white"
                >
                  {createClientMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Créer le client
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateClientModal
