"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { usePrismaClients, usePrismaUpdateClient } from "@/hooks/usePrismaData"
import type { ClientInputData } from "@/types/app"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Calendar,
  Check,
  Clock,
  Edit,
  ExternalLink,
  Globe,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Save,
  Send,
  Smartphone,
  X,
  Zap,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"

// Mock data pour l'historique des messages (à remplacer par de vraies données)
const mockMessages = [
  {
    id: 1,
    type: "whatsapp",
    content: "Bonjour ! Votre commande est prête à récupérer.",
    sent_at: "2024-01-15T10:30:00Z",
    status: "delivered",
    automated: true,
  },
  {
    id: 2,
    type: "email",
    content: "Merci pour votre commande ! Confirmation reçue.",
    sent_at: "2024-01-14T15:45:00Z",
    status: "opened",
    automated: false,
  },
  {
    id: 3,
    type: "sms",
    content: "Rappel: Événement prévu demain à 18h.",
    sent_at: "2024-01-13T09:00:00Z",
    status: "delivered",
    automated: true,
  },
]

export default function ClientContactPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const clientId = params.id as string

  const { data: clients } = usePrismaClients()
  const updateClientMutation = usePrismaUpdateClient()

  const [isEditing, setIsEditing] = useState(false)
  const [contactData, setContactData] = useState({
    whatsapp: "",
    email: "",
    telephone: "",
    messenger: "",
    autres_contacts: "",
  })
  const [newMessage, setNewMessage] = useState({
    type: "whatsapp",
    content: "",
    schedule: false,
    scheduled_date: "",
  })

  // Trouver le client actuel
  const client = useMemo(() => {
    const foundClient = clients?.find((c) => c.auth_user_id === clientId)
    if (foundClient) {
      setContactData({
        whatsapp: foundClient.numero_de_telephone || "",
        email: foundClient.email || "",
        telephone: foundClient.numero_de_telephone || "",
        messenger: foundClient.email || "",
        autres_contacts: foundClient.preference_client || "",
      })
    }
    return foundClient
  }, [clients, clientId])

  // Fonction pour sauvegarder les contacts
  const handleSaveContacts = async () => {
    if (!client) return

    try {
      const dataToUpdate: Partial<ClientInputData> = {
        numero_de_telephone: contactData.telephone || null,
        email: contactData.email || null,
        preference_client: contactData.autres_contacts || null,
      }

      await updateClientMutation.mutateAsync({
        data: dataToUpdate,
      })

      toast({
        title: "Contacts sauvegardés",
        description: "Les informations de contact ont été mises à jour.",
        duration: 2000,
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les contacts.",
        variant: "destructive",
      })
    }
  }

  // Fonction pour envoyer un message via n8n
  const handleSendMessage = async () => {
    if (!newMessage.content.trim()) {
      toast({
        title: "Message vide",
        description: "Veuillez saisir un message.",
        variant: "destructive",
      })
      return
    }

    try {
      // Ici, vous intégrerez l'appel à votre webhook n8n
      const webhookUrl =
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://votre-n8n.com/webhook/send-message"

      const messageData = {
        client_id: clientId,
        client_name: `${client?.prenom} ${client?.nom}`,
        type: newMessage.type,
        content: newMessage.content,
        recipient: getRecipientForType(newMessage.type),
        schedule: newMessage.schedule,
        scheduled_date: newMessage.scheduled_date || null,
        timestamp: new Date().toISOString(),
      }

      // Simulation d'appel n8n (remplacez par un vrai appel fetch)
      console.log("Envoi via n8n:", messageData)

      // const response = await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(messageData)
      // });

      toast({
        title: "Message envoyé",
        description: `Message ${newMessage.type} ${newMessage.schedule ? "programmé" : "envoyé"} avec succès.`,
      })

      // Reset du formulaire
      setNewMessage({
        type: "whatsapp",
        content: "",
        schedule: false,
        scheduled_date: "",
      })
    } catch (error) {
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le message. Vérifiez la configuration n8n.",
        variant: "destructive",
      })
    }
  }

  const getRecipientForType = (type: string) => {
    switch (type) {
      case "whatsapp":
      case "sms":
        return contactData.whatsapp || contactData.telephone
      case "email":
        return contactData.email
      case "messenger":
        return contactData.messenger
      default:
        return ""
    }
  }

  const handleDirectContact = (type: string, value: string) => {
    switch (type) {
      case "whatsapp":
        const phoneNumber = value.replace(/\s+/g, "")
        window.open(`https://wa.me/33${phoneNumber.substring(1)}`, "_blank")
        break
      case "phone":
        window.open(`tel:${value}`, "_blank")
        break
      case "email":
        window.open(`mailto:${value}`, "_blank")
        break
    }
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-thai-orange mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-gray-600">Chargement du profil client...</p>
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
                  Communication - {client.prenom} {client.nom}
                </h1>
                <p className="text-thai-green/70">Messages & automation n8n</p>
              </div>
            </div>
          </div>

          <div className="text-thai-green flex items-center gap-2">
            <Headphones className="h-6 w-6" />
            <span className="font-semibold">Centre Contact</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Gestion des contacts */}
          <div className="space-y-6">
            <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-thai-green flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Informations de Contact
                  </CardTitle>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveContacts}
                          size="sm"
                          className="bg-thai-green hover:bg-thai-green/90"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Sauvegarder
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                          <X className="mr-2 h-4 w-4" />
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label
                      htmlFor="whatsapp"
                      className="text-thai-green flex items-center gap-2 font-medium"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="whatsapp"
                        value={contactData.whatsapp}
                        onChange={(e) =>
                          setContactData((prev) => ({ ...prev, whatsapp: e.target.value }))
                        }
                        placeholder="06 12 34 56 78"
                        disabled={!isEditing}
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                      />
                      {contactData.whatsapp && !isEditing && (
                        <Button
                          onClick={() => handleDirectContact("whatsapp", contactData.whatsapp)}
                          variant="outline"
                          size="sm"
                          className="px-3"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-thai-green flex items-center gap-2 font-medium"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={contactData.email}
                        onChange={(e) =>
                          setContactData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="client@email.com"
                        disabled={!isEditing}
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                      />
                      {contactData.email && !isEditing && (
                        <Button
                          onClick={() => handleDirectContact("email", contactData.email)}
                          variant="outline"
                          size="sm"
                          className="px-3"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="telephone"
                      className="text-thai-green flex items-center gap-2 font-medium"
                    >
                      <Smartphone className="h-4 w-4" />
                      Téléphone
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="telephone"
                        value={contactData.telephone}
                        onChange={(e) =>
                          setContactData((prev) => ({ ...prev, telephone: e.target.value }))
                        }
                        placeholder="06 12 34 56 78"
                        disabled={!isEditing}
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                      />
                      {contactData.telephone && !isEditing && (
                        <Button
                          onClick={() => handleDirectContact("phone", contactData.telephone)}
                          variant="outline"
                          size="sm"
                          className="px-3"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="autres"
                      className="text-thai-green flex items-center gap-2 font-medium"
                    >
                      <Globe className="h-4 w-4" />
                      Autres contacts
                    </Label>
                    <Textarea
                      id="autres"
                      value={contactData.autres_contacts}
                      onChange={(e) =>
                        setContactData((prev) => ({ ...prev, autres_contacts: e.target.value }))
                      }
                      placeholder="Discord, Telegram, Facebook, etc..."
                      disabled={!isEditing}
                      rows={3}
                      className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Envoyer nouveau message */}
            <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Nouveau Message
                  <div className="bg-thai-orange/10 text-thai-orange ml-auto flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                    <Bot className="h-3 w-3" />
                    n8n intégré
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-thai-green font-medium">Type de message</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                      { value: "email", label: "Email", icon: Mail },
                      { value: "sms", label: "SMS", icon: Smartphone },
                      { value: "messenger", label: "Messenger", icon: MessageCircle },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setNewMessage((prev) => ({ ...prev, type: value }))}
                        className={`flex items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                          newMessage.type === value
                            ? "border-thai-orange bg-thai-orange/10 text-thai-orange"
                            : "hover:border-thai-orange/50 border-gray-200"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="message-content" className="text-thai-green font-medium">
                    Contenu du message
                  </Label>
                  <Textarea
                    id="message-content"
                    value={newMessage.content}
                    onChange={(e) =>
                      setNewMessage((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Tapez votre message..."
                    rows={4}
                    className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30 mt-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="schedule"
                    checked={newMessage.schedule}
                    onChange={(e) =>
                      setNewMessage((prev) => ({ ...prev, schedule: e.target.checked }))
                    }
                    className="border-thai-orange/30 rounded"
                  />
                  <Label htmlFor="schedule" className="text-thai-green flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Programmer l'envoi
                  </Label>
                </div>

                {newMessage.schedule && (
                  <div>
                    <Label htmlFor="schedule-date" className="text-thai-green font-medium">
                      Date et heure d'envoi
                    </Label>
                    <Input
                      id="schedule-date"
                      type="datetime-local"
                      value={newMessage.scheduled_date}
                      onChange={(e) =>
                        setNewMessage((prev) => ({ ...prev, scheduled_date: e.target.value }))
                      }
                      className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30 mt-1"
                    />
                  </div>
                )}

                <Button
                  onClick={handleSendMessage}
                  className="from-thai-orange to-thai-gold hover:from-thai-gold hover:to-thai-orange w-full bg-linear-to-r text-white shadow-lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {newMessage.schedule ? "Programmer le message" : "Envoyer maintenant"}
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Historique des messages */}
          <div className="space-y-6">
            <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Historique des Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[600px] space-y-4 overflow-y-auto">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className="hover:bg-thai-cream/5 rounded-lg border border-gray-200 p-4 transition-colors"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {message.type === "whatsapp" && (
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          )}
                          {message.type === "email" && <Mail className="h-4 w-4 text-blue-600" />}
                          {message.type === "sms" && (
                            <Smartphone className="h-4 w-4 text-purple-600" />
                          )}

                          <span className="text-thai-green font-medium capitalize">
                            {message.type}
                          </span>

                          {message.automated && (
                            <div className="bg-thai-orange/10 text-thai-orange flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                              <Bot className="h-3 w-3" />
                              Auto
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {format(new Date(message.sent_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                        </div>
                      </div>

                      <p className="mb-3 text-sm text-gray-700">{message.content}</p>

                      <div className="flex items-center gap-2">
                        {message.status === "delivered" && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Check className="h-3 w-3" />
                            Livré
                          </div>
                        )}
                        {message.status === "opened" && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <Check className="h-3 w-3" />
                            Lu
                          </div>
                        )}
                        {message.status === "failed" && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            Échec
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Templates n8n */}
            <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Templates Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Confirmation commande", desc: "Envoi automatique à chaque commande" },
                    { name: "Rappel récupération", desc: "1h avant l'heure de retrait" },
                    { name: "Événement J-1", desc: "Rappel la veille de l'événement" },
                    { name: "Satisfaction client", desc: "24h après la commande" },
                  ].map((template, index) => (
                    <div
                      key={index}
                      className="border-thai-orange/20 hover:bg-thai-orange/5 flex items-center justify-between rounded-lg border p-3 transition-colors"
                    >
                      <div>
                        <div className="text-thai-green font-medium">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.desc}</div>
                      </div>
                      <div className="bg-thai-green/10 text-thai-green flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                        <Zap className="h-3 w-3" />
                        Actif
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
