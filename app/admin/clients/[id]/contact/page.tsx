'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  Send,
  Headphones,
  ExternalLink,
  Edit,
  Save,
  X,
  Clock,
  Check,
  AlertCircle,
  Zap,
  Bot,
  Calendar,
  Globe,
  Smartphone
} from 'lucide-react';
import { useClients, useUpdateClient } from '@/hooks/useSupabaseData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { ClientUI, ClientInputData } from '@/types/app';

// Mock data pour l'historique des messages (à remplacer par de vraies données)
const mockMessages = [
  {
    id: 1,
    type: 'whatsapp',
    content: 'Bonjour ! Votre commande est prête à récupérer.',
    sent_at: '2024-01-15T10:30:00Z',
    status: 'delivered',
    automated: true
  },
  {
    id: 2,
    type: 'email',
    content: 'Merci pour votre commande ! Confirmation reçue.',
    sent_at: '2024-01-14T15:45:00Z',
    status: 'opened',
    automated: false
  },
  {
    id: 3,
    type: 'sms',
    content: 'Rappel: Événement prévu demain à 18h.',
    sent_at: '2024-01-13T09:00:00Z',
    status: 'delivered',
    automated: true
  }
];

export default function ClientContactPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const clientId = params.id as string;
  
  const { data: clients } = useClients();
  const updateClientMutation = useUpdateClient();

  const [isEditing, setIsEditing] = useState(false);
  const [contactData, setContactData] = useState({
    whatsapp: '',
    email: '',
    telephone: '',
    messenger: '',
    autres_contacts: ''
  });
  const [newMessage, setNewMessage] = useState({
    type: 'whatsapp',
    content: '',
    schedule: false,
    scheduled_date: ''
  });

  // Trouver le client actuel
  const client = useMemo(() => {
    const foundClient = clients?.find(c => c.firebase_uid === clientId);
    if (foundClient) {
      setContactData({
        whatsapp: foundClient.numero_de_telephone || '',
        email: foundClient.email || '',
        telephone: foundClient.numero_de_telephone || '',
        messenger: foundClient.email || '',
        autres_contacts: foundClient.preference_client || ''
      });
    }
    return foundClient;
  }, [clients, clientId]);

  // Fonction pour sauvegarder les contacts
  const handleSaveContacts = async () => {
    if (!client) return;
    
    try {
      const dataToUpdate: Partial<ClientInputData> = {
        numero_de_telephone: contactData.telephone || null,
        email: contactData.email || null,
        preference_client: contactData.autres_contacts || null
      };

      await updateClientMutation.mutateAsync({
        firebase_uid: client.firebase_uid,
        data: dataToUpdate,
      });

      toast({ 
        title: 'Contacts sauvegardés', 
        description: 'Les informations de contact ont été mises à jour.',
        duration: 2000
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les contacts.',
        variant: 'destructive',
      });
    }
  };

  // Fonction pour envoyer un message via n8n
  const handleSendMessage = async () => {
    if (!newMessage.content.trim()) {
      toast({
        title: 'Message vide',
        description: 'Veuillez saisir un message.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Ici, vous intégrerez l'appel à votre webhook n8n
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://votre-n8n.com/webhook/send-message';
      
      const messageData = {
        client_id: clientId,
        client_name: `${client?.prenom} ${client?.nom}`,
        type: newMessage.type,
        content: newMessage.content,
        recipient: getRecipientForType(newMessage.type),
        schedule: newMessage.schedule,
        scheduled_date: newMessage.scheduled_date || null,
        timestamp: new Date().toISOString()
      };

      // Simulation d'appel n8n (remplacez par un vrai appel fetch)
      console.log('Envoi via n8n:', messageData);
      
      // const response = await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(messageData)
      // });

      toast({
        title: 'Message envoyé',
        description: `Message ${newMessage.type} ${newMessage.schedule ? 'programmé' : 'envoyé'} avec succès.`,
      });

      // Reset du formulaire
      setNewMessage({
        type: 'whatsapp',
        content: '',
        schedule: false,
        scheduled_date: ''
      });

    } catch (error) {
      toast({
        title: 'Erreur d\'envoi',
        description: 'Impossible d\'envoyer le message. Vérifiez la configuration n8n.',
        variant: 'destructive'
      });
    }
  };

  const getRecipientForType = (type: string) => {
    switch (type) {
      case 'whatsapp':
      case 'sms':
        return contactData.whatsapp || contactData.telephone;
      case 'email':
        return contactData.email;
      case 'messenger':
        return contactData.messenger;
      default:
        return '';
    }
  };

  const handleDirectContact = (type: string, value: string) => {
    switch (type) {
      case 'whatsapp':
        const phoneNumber = value.replace(/\s+/g, '');
        window.open(`https://wa.me/33${phoneNumber.substring(1)}`, '_blank');
        break;
      case 'phone':
        window.open(`tel:${value}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil client...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la Fiche
            </Button>
            
            <div className="flex items-center gap-3">
              {client.photo_client ? (
                <img 
                  src={client.photo_client} 
                  alt="Photo client" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-thai-orange shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-thai-orange text-white font-bold">
                  {client.prenom?.charAt(0) || 'C'}{client.nom?.charAt(0) || 'L'}
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-thai-green">
                  Communication - {client.prenom} {client.nom}
                </h1>
                <p className="text-thai-green/70">Messages & automation n8n</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-thai-green">
            <Headphones className="w-6 h-6" />
            <span className="font-semibold">Centre Contact</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gestion des contacts */}
          <div className="space-y-6">
            <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-thai-green flex items-center gap-2">
                    <Phone className="w-5 h-5" />
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
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveContacts} 
                          size="sm"
                          className="bg-thai-green hover:bg-thai-green/90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </Button>
                        <Button 
                          onClick={() => setIsEditing(false)} 
                          variant="outline" 
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
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
                    <Label htmlFor="whatsapp" className="text-thai-green font-medium flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="whatsapp"
                        value={contactData.whatsapp}
                        onChange={(e) => setContactData(prev => ({ ...prev, whatsapp: e.target.value }))}
                        placeholder="06 12 34 56 78"
                        disabled={!isEditing}
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                      />
                      {contactData.whatsapp && !isEditing && (
                        <Button
                          onClick={() => handleDirectContact('whatsapp', contactData.whatsapp)}
                          variant="outline"
                          size="sm"
                          className="px-3"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-thai-green font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="client@email.com"
                        disabled={!isEditing}
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                      />
                      {contactData.email && !isEditing && (
                        <Button
                          onClick={() => handleDirectContact('email', contactData.email)}
                          variant="outline"
                          size="sm"
                          className="px-3"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telephone" className="text-thai-green font-medium flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Téléphone
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="telephone"
                        value={contactData.telephone}
                        onChange={(e) => setContactData(prev => ({ ...prev, telephone: e.target.value }))}
                        placeholder="06 12 34 56 78"
                        disabled={!isEditing}
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30"
                      />
                      {contactData.telephone && !isEditing && (
                        <Button
                          onClick={() => handleDirectContact('phone', contactData.telephone)}
                          variant="outline"
                          size="sm"
                          className="px-3"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="autres" className="text-thai-green font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Autres contacts
                    </Label>
                    <Textarea
                      id="autres"
                      value={contactData.autres_contacts}
                      onChange={(e) => setContactData(prev => ({ ...prev, autres_contacts: e.target.value }))}
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
            <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Nouveau Message
                  <div className="ml-auto flex items-center gap-1 text-xs bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full">
                    <Bot className="w-3 h-3" />
                    n8n intégré
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-thai-green font-medium">Type de message</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      { value: 'email', label: 'Email', icon: Mail },
                      { value: 'sms', label: 'SMS', icon: Smartphone },
                      { value: 'messenger', label: 'Messenger', icon: MessageCircle }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setNewMessage(prev => ({ ...prev, type: value }))}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          newMessage.type === value
                            ? 'border-thai-orange bg-thai-orange/10 text-thai-orange'
                            : 'border-gray-200 hover:border-thai-orange/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
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
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
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
                    onChange={(e) => setNewMessage(prev => ({ ...prev, schedule: e.target.checked }))}
                    className="rounded border-thai-orange/30"
                  />
                  <Label htmlFor="schedule" className="text-thai-green flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
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
                      onChange={(e) => setNewMessage(prev => ({ ...prev, scheduled_date: e.target.value }))}
                      className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/30 mt-1"
                    />
                  </div>
                )}

                <Button
                  onClick={handleSendMessage}
                  className="w-full bg-gradient-to-r from-thai-orange to-thai-gold hover:from-thai-gold hover:to-thai-orange text-white shadow-lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {newMessage.schedule ? 'Programmer le message' : 'Envoyer maintenant'}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Historique des messages */}
          <div className="space-y-6">
            <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Historique des Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {mockMessages.map((message) => (
                    <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-thai-cream/5 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {message.type === 'whatsapp' && <MessageCircle className="w-4 h-4 text-green-600" />}
                          {message.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                          {message.type === 'sms' && <Smartphone className="w-4 h-4 text-purple-600" />}
                          
                          <span className="font-medium text-thai-green capitalize">
                            {message.type}
                          </span>
                          
                          {message.automated && (
                            <div className="flex items-center gap-1 text-xs bg-thai-orange/10 text-thai-orange px-2 py-1 rounded-full">
                              <Bot className="w-3 h-3" />
                              Auto
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {format(new Date(message.sent_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3">
                        {message.content}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {message.status === 'delivered' && (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Check className="w-3 h-3" />
                            Livré
                          </div>
                        )}
                        {message.status === 'opened' && (
                          <div className="flex items-center gap-1 text-blue-600 text-xs">
                            <Check className="w-3 h-3" />
                            Lu
                          </div>
                        )}
                        {message.status === 'failed' && (
                          <div className="flex items-center gap-1 text-red-600 text-xs">
                            <AlertCircle className="w-3 h-3" />
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
            <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-thai-green flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Templates Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Confirmation commande', desc: 'Envoi automatique à chaque commande' },
                    { name: 'Rappel récupération', desc: '1h avant l\'heure de retrait' },
                    { name: 'Événement J-1', desc: 'Rappel la veille de l\'événement' },
                    { name: 'Satisfaction client', desc: '24h après la commande' }
                  ].map((template, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-thai-orange/20 rounded-lg hover:bg-thai-orange/5 transition-colors">
                      <div>
                        <div className="font-medium text-thai-green">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.desc}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-thai-green/10 text-thai-green px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3" />
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
  );
}