'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Bell, BellOff, ShoppingCart, Calendar, Tag, MessageSquare } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from '@/app/actions/notifications'
import { useToast } from '@/hooks/use-toast'

export default function NotificationsPreferencesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Charger les préférences au montage
  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    setIsLoading(true)
    const { preferences: prefs, error } = await getNotificationPreferences()

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error,
      })
    } else {
      setPreferences(prefs)
    }
    setIsLoading(false)
  }

  async function handleToggle(key: keyof NotificationPreferences, value: boolean) {
    if (!preferences) return

    const updatedPrefs = { ...preferences, [key]: value }
    setPreferences(updatedPrefs)

    setIsSaving(true)
    const { success, error } = await updateNotificationPreferences({ [key]: value })
    setIsSaving(false)

    if (!success) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error || 'Impossible de mettre à jour les préférences',
      })
      // Restaurer l'ancienne valeur en cas d'erreur
      setPreferences(preferences)
    } else {
      toast({
        title: 'Préférences mises à jour',
        description: 'Vos préférences de notifications ont été enregistrées',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Préférences de notifications</h1>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Préférences de notifications</h1>
            <p className="text-muted-foreground text-red-500">
              Impossible de charger les préférences
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Préférences de notifications</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences de notifications push
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Switch global */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {preferences.notifications_enabled ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
              Notifications globales
            </CardTitle>
            <CardDescription>
              Activer ou désactiver toutes les notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications_enabled" className="text-base">
                Recevoir des notifications
              </Label>
              <Switch
                id="notifications_enabled"
                checked={preferences.notifications_enabled}
                onCheckedChange={(checked) =>
                  handleToggle('notifications_enabled', checked)
                }
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Commandes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Notifications de commandes
            </CardTitle>
            <CardDescription>
              Restez informé de l'état de vos commandes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="commande_confirmee" className="text-base">
                Commande confirmée
              </Label>
              <Switch
                id="commande_confirmee"
                checked={preferences.commande_confirmee}
                onCheckedChange={(checked) => handleToggle('commande_confirmee', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="commande_preparation" className="text-base">
                Commande en préparation
              </Label>
              <Switch
                id="commande_preparation"
                checked={preferences.commande_preparation}
                onCheckedChange={(checked) => handleToggle('commande_preparation', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="commande_prete" className="text-base">
                Commande prête
              </Label>
              <Switch
                id="commande_prete"
                checked={preferences.commande_prete}
                onCheckedChange={(checked) => handleToggle('commande_prete', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="commande_retard" className="text-base">
                Commande en retard
              </Label>
              <Switch
                id="commande_retard"
                checked={preferences.commande_retard}
                onCheckedChange={(checked) => handleToggle('commande_retard', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Événements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Notifications d'événements
            </CardTitle>
            <CardDescription>
              Rappels et informations sur vos événements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="evenement_confirme" className="text-base">
                Événement confirmé
              </Label>
              <Switch
                id="evenement_confirme"
                checked={preferences.evenement_confirme}
                onCheckedChange={(checked) => handleToggle('evenement_confirme', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="evenement_rappel_48h" className="text-base">
                Rappel 48h avant
              </Label>
              <Switch
                id="evenement_rappel_48h"
                checked={preferences.evenement_rappel_48h}
                onCheckedChange={(checked) => handleToggle('evenement_rappel_48h', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="evenement_rappel_24h" className="text-base">
                Rappel 24h avant
              </Label>
              <Switch
                id="evenement_rappel_24h"
                checked={preferences.evenement_rappel_24h}
                onCheckedChange={(checked) => handleToggle('evenement_rappel_24h', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="evenement_preparation" className="text-base">
                Événement en préparation
              </Label>
              <Switch
                id="evenement_preparation"
                checked={preferences.evenement_preparation}
                onCheckedChange={(checked) => handleToggle('evenement_preparation', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Marketing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Marketing & actualités
            </CardTitle>
            <CardDescription>
              Promotions et nouveautés du restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="promotions" className="text-base">
                Promotions et offres spéciales
              </Label>
              <Switch
                id="promotions"
                checked={preferences.promotions}
                onCheckedChange={(checked) => handleToggle('promotions', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="nouveautes" className="text-base">
                Nouveaux plats au menu
              </Label>
              <Switch
                id="nouveautes"
                checked={preferences.nouveautes}
                onCheckedChange={(checked) => handleToggle('nouveautes', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter" className="text-base">
                Newsletter
              </Label>
              <Switch
                id="newsletter"
                checked={preferences.newsletter}
                onCheckedChange={(checked) => handleToggle('newsletter', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Autres notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Autres notifications
            </CardTitle>
            <CardDescription>
              Messages et rappels importants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="rappel_paiement" className="text-base">
                Rappels de paiement
              </Label>
              <Switch
                id="rappel_paiement"
                checked={preferences.rappel_paiement}
                onCheckedChange={(checked) => handleToggle('rappel_paiement', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="message_admin" className="text-base">
                Messages de l'équipe
              </Label>
              <Switch
                id="message_admin"
                checked={preferences.message_admin}
                onCheckedChange={(checked) => handleToggle('message_admin', checked)}
                disabled={isSaving || !preferences.notifications_enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Note de confidentialité */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              🔒 Vos préférences de notifications sont privées et ne sont jamais partagées
              avec des tiers. Vous pouvez les modifier à tout moment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
