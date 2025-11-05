'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, CheckCircle2, Home, Loader2, AlertCircle, ShoppingBag, Calendar, Info } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import {
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
} from '@/lib/fcm';
import { saveNotificationToken, hasActiveNotifications } from '@/app/actions/notifications';

export default function NotificationSetupPage() {
  const { toast } = useToast();
  const { data: session, isPending: isLoadingAuth } = useSession();
  const currentUser = session?.user;

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [hasActiveToken, setHasActiveToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Vérifier le support et le statut initial
  useEffect(() => {
    setIsSupported(isNotificationSupported());
    setPermissionStatus(getNotificationPermission());

    // Vérifier si l'utilisateur a déjà un token actif
    if (currentUser) {
      hasActiveNotifications().then(hasToken => {
        setHasActiveToken(hasToken);
        setIsCheckingToken(false);
      });
    } else {
      setIsCheckingToken(false);
    }
  }, [currentUser]);

  const handleRequestPermission = async () => {
    if (!currentUser) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour activer les notifications',
        variant: 'destructive',
      });
      return;
    }

    setIsRequesting(true);
    try {
      const token = await requestNotificationPermission();

      if (token) {
        // Sauvegarder le token
        const result = await saveNotificationToken(token, 'web');

        if (result.success) {
          setPermissionStatus('granted');
          setHasActiveToken(true);
          toast({
            title: '🎉 Notifications activées !',
            description: 'Vous recevrez désormais les mises à jour importantes',
          });
        } else {
          throw new Error(result.error || 'Erreur lors de la sauvegarde du token');
        }
      } else {
        setPermissionStatus(getNotificationPermission());

        if (getNotificationPermission() === 'denied') {
          toast({
            title: 'Permission refusée',
            description: 'Vous avez refusé les notifications. Vous pouvez les réactiver dans les paramètres de votre navigateur.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Erreur activation notifications:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible d\'activer les notifications',
        variant: 'destructive',
      });
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoadingAuth || isCheckingToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-thai">
        <Loader2 className="w-16 h-16 animate-spin text-thai-orange mb-4" />
        <p className="text-thai-green font-medium">Chargement...</p>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-xl border-2 border-red-200">
            <CardContent className="p-8 text-center">
              <BellOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Notifications non supportées
              </h2>
              <p className="text-gray-600 mb-6">
                Votre navigateur ne supporte pas les notifications push. Essayez avec Chrome, Firefox, Edge ou Safari.
              </p>
              <Link href="/" passHref>
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAlreadyEnabled = permissionStatus === 'granted' && hasActiveToken;

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header avec bouton retour */}
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" passHref>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white border-thai-orange/20 hover:border-thai-orange/40"
            >
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </Link>

          {currentUser && (
            <Link href={"/profil" as Route} passHref>
              <Button
                variant="ghost"
                size="sm"
                className="text-thai-green hover:text-thai-green/80"
              >
                Mon profil
              </Button>
            </Link>
          )}
        </div>

        {/* Carte principale */}
        <Card className="shadow-xl mb-6">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-thai-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-thai-orange" />
            </div>
            <CardTitle className="text-3xl font-bold text-thai-green mb-2">
              Restez informé en temps réel
            </CardTitle>
            <CardDescription className="text-base">
              Recevez des notifications pour ne rien manquer
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Statut actuel */}
            {isAlreadyEnabled ? (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">
                      ✅ Notifications activées
                    </p>
                    <p className="text-sm text-green-700">
                      Vous recevez les notifications push sur cet appareil
                    </p>
                  </div>
                </div>
              </div>
            ) : permissionStatus === 'denied' ? (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">
                      Permission refusée
                    </p>
                    <p className="text-sm text-red-700 mb-2">
                      Vous avez bloqué les notifications. Pour les réactiver :
                    </p>
                    <ol className="text-xs text-red-600 space-y-1 list-decimal list-inside">
                      <li>Cliquez sur l'icône 🔒 ou ⓘ dans la barre d'adresse</li>
                      <li>Cherchez "Notifications" dans les paramètres</li>
                      <li>Changez "Bloquer" en "Autoriser"</li>
                      <li>Rechargez cette page</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Avantages */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-thai-green flex items-center gap-2">
                <Info className="w-5 h-5" />
                Pourquoi activer les notifications ?
              </h3>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <ShoppingBag className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-900">Suivi de commande</p>
                    <p className="text-sm text-amber-700">
                      Recevez une alerte quand votre commande change de statut (préparation, prête, livrée)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Calendar className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">Rappels d'événements</p>
                    <p className="text-sm text-blue-700">
                      Ne manquez plus vos réservations grâce à des rappels 24h et 48h avant
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Bell className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Offres spéciales</p>
                    <p className="text-sm text-green-700">
                      Soyez le premier informé des nouveaux plats et promotions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            {!isAlreadyEnabled && permissionStatus !== 'denied' && (
              <div className="pt-4">
                {!currentUser ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      Connectez-vous pour activer les notifications
                    </p>
                    <Link href={"/profil" as Route} passHref>
                      <Button className="w-full h-12 text-base">
                        Se connecter
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    onClick={handleRequestPermission}
                    disabled={isRequesting}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isRequesting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Activation en cours...
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-5 w-5" />
                        Activer les notifications
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Note de confidentialité */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                🔒 Vos données sont protégées. Vous pouvez désactiver les notifications à tout moment dans les paramètres de votre navigateur.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lien vers le profil si connecté */}
        {currentUser && isAlreadyEnabled && (
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Gérer mes préférences</p>
                  <p className="text-sm text-gray-600">Personnalisez les notifications que vous recevez</p>
                </div>
                <Link href={"/profil" as Route} passHref>
                  <Button variant="outline" size="sm">
                    Paramètres
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
