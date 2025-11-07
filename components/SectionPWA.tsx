'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Smartphone, Zap, Bell, WifiOff, CheckCircle2 } from 'lucide-react'
import { usePWAInstalled } from '@/hooks/usePWAInstalled'
import { cn } from '@/lib/utils'

interface SectionPWAProps {
  className?: string
}

export function SectionPWA({ className }: SectionPWAProps) {
  const { isInstalled, canInstall, install } = usePWAInstalled()

  const handleInstallClick = async () => {
    if (canInstall) {
      await install()
    }
  }

  const handleOpenAppClick = () => {
    // Deep link pour ouvrir l'app (fonctionne si installée)
    window.location.href = '/'
  }

  return (
    <section className={cn('py-16 px-4 bg-gradient-to-br from-thai-cream via-white to-thai-cream/50', className)}>
      <div className="container mx-auto max-w-5xl">
        <Card className="border-thai-orange/30 shadow-2xl overflow-hidden">
          <CardHeader className="text-center pb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Smartphone className="h-10 w-10 text-thai-orange" />
              {isInstalled && <CheckCircle2 className="h-6 w-6 text-green-500" />}
            </div>
            <CardTitle className="text-3xl md:text-4xl text-thai-green">
              {isInstalled ? 'Application Installée ✅' : 'Installez notre Application'}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {isInstalled
                ? 'Accédez rapidement à votre restaurant préféré depuis votre écran d\'accueil'
                : 'Commandez plus rapidement depuis votre téléphone'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Mockup téléphone */}
              <div className="flex justify-center">
                <div className="relative w-64 h-auto">
                  {/* Cadre smartphone */}
                  <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl">
                    <div className="bg-white rounded-2xl overflow-hidden aspect-[9/19.5]">
                      {/* Notch */}
                      <div className="h-6 bg-gray-900 rounded-b-3xl w-32 mx-auto"></div>
                      {/* Screenshot simulé */}
                      <div className="bg-gradient-to-br from-thai-orange/20 via-thai-gold/10 to-thai-green/20 h-full flex items-center justify-center p-4">
                        <div className="text-center space-y-2">
                          <Smartphone className="h-16 w-16 mx-auto text-thai-orange animate-pulse" />
                          <p className="text-xs font-semibold text-thai-green">ChanthanaThaiCook</p>
                          <p className="text-[10px] text-gray-600">Cuisine Thaïlandaise</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avantages */}
              <div className="space-y-6">
                {isInstalled ? (
                  // Message pour utilisateurs ayant déjà installé
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-thai-green mb-1">Application prête</h4>
                        <p className="text-sm text-gray-600">
                          Ouvrez l'application depuis votre écran d'accueil pour une expérience optimale
                        </p>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-thai-orange hover:bg-thai-orange/90"
                      onClick={handleOpenAppClick}
                    >
                      <Smartphone className="mr-2 h-5 w-5" />
                      Ouvrir l'Application
                    </Button>
                  </div>
                ) : (
                  // Avantages pour inciter à l'installation
                  <>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-6 w-6 text-thai-orange flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-thai-green mb-1">Commander rapidement</h4>
                          <p className="text-sm text-gray-600">
                            Accès direct depuis votre écran d'accueil, sans ouvrir le navigateur
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Bell className="h-6 w-6 text-thai-orange flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-thai-green mb-1">Notifications</h4>
                          <p className="text-sm text-gray-600">
                            Soyez prévenu quand votre commande est prête à être récupérée
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <WifiOff className="h-6 w-6 text-thai-orange flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-thai-green mb-1">Fonctionne hors ligne</h4>
                          <p className="text-sm text-gray-600">
                            Consultez le menu et vos commandes même sans connexion internet
                          </p>
                        </div>
                      </div>
                    </div>

                    {canInstall ? (
                      <Button
                        size="lg"
                        className="w-full bg-thai-orange hover:bg-thai-orange/90"
                        onClick={handleInstallClick}
                      >
                        <Smartphone className="mr-2 h-5 w-5" />
                        Installer l'Application
                      </Button>
                    ) : (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <div className="flex items-start gap-2">
                          <Badge variant="secondary" className="text-xs">
                            ℹ️ Info
                          </Badge>
                          <p className="text-sm text-blue-800">
                            Installation disponible sur Chrome, Edge et Safari (iOS). Ouvrez le menu du navigateur
                            pour installer.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
