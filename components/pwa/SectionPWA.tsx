"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePWAInstalled } from "@/hooks/usePWAInstalled"
import { cn } from "@/lib/utils"
import { Bell, CheckCircle2, Smartphone, WifiOff, Zap } from "lucide-react"

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
    window.location.href = "/"
  }

  return (
    <section
      className={cn(
        "from-thai-cream to-thai-cream/50 bg-linear-to-br via-white px-4 py-16",
        className
      )}
    >
      <div className="container mx-auto max-w-5xl">
        <Card className="border-thai-orange/30 overflow-hidden shadow-2xl">
          <CardHeader className="pb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center gap-2">
              <Smartphone className="text-thai-orange h-10 w-10" />
              {isInstalled && <CheckCircle2 className="h-6 w-6 text-green-500" />}
            </div>
            <CardTitle className="text-thai-green text-3xl md:text-4xl">
              {isInstalled ? "Application Installée ✅" : "Installez notre Application"}
            </CardTitle>
            <CardDescription className="mt-2 text-lg">
              {isInstalled
                ? "Accédez rapidement à votre restaurant préféré depuis votre écran d'accueil"
                : "Commandez plus rapidement depuis votre téléphone"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="grid items-center gap-8 md:grid-cols-2">
              {/* Mockup téléphone */}
              <div className="flex justify-center">
                <div className="relative h-auto w-64">
                  {/* Cadre smartphone */}
                  <div className="rounded-3xl bg-gray-900 p-3 shadow-2xl">
                    <div className="aspect-[9/19.5] overflow-hidden rounded-2xl bg-white">
                      {/* Notch */}
                      <div className="mx-auto h-6 w-32 rounded-b-3xl bg-gray-900"></div>
                      {/* Screenshot simulé */}
                      <div className="from-thai-orange/20 via-thai-gold/10 to-thai-green/20 flex h-full items-center justify-center bg-linear-to-br p-4">
                        <div className="space-y-2 text-center">
                          <Smartphone className="text-thai-orange mx-auto h-16 w-16 animate-pulse" />
                          <p className="text-thai-green text-xs font-semibold">ChanthanaThaiCook</p>
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
                      <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-green-500" />
                      <div>
                        <h4 className="text-thai-green mb-1 font-semibold">Application prête</h4>
                        <p className="text-sm text-gray-600">
                          Ouvrez l'application depuis votre écran d'accueil pour une expérience
                          optimale
                        </p>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="bg-thai-orange hover:bg-thai-orange/90 w-full"
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
                        <Zap className="text-thai-orange mt-1 h-6 w-6 shrink-0" />
                        <div>
                          <h4 className="text-thai-green mb-1 font-semibold">
                            Commander rapidement
                          </h4>
                          <p className="text-sm text-gray-600">
                            Accès direct depuis votre écran d'accueil, sans ouvrir le navigateur
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Bell className="text-thai-orange mt-1 h-6 w-6 shrink-0" />
                        <div>
                          <h4 className="text-thai-green mb-1 font-semibold">Notifications</h4>
                          <p className="text-sm text-gray-600">
                            Soyez prévenu quand votre commande est prête à être récupérée
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <WifiOff className="text-thai-orange mt-1 h-6 w-6 shrink-0" />
                        <div>
                          <h4 className="text-thai-green mb-1 font-semibold">
                            Fonctionne hors ligne
                          </h4>
                          <p className="text-sm text-gray-600">
                            Consultez le menu et vos commandes même sans connexion internet
                          </p>
                        </div>
                      </div>
                    </div>

                    {canInstall ? (
                      <Button
                        size="lg"
                        className="bg-thai-orange hover:bg-thai-orange/90 w-full"
                        onClick={handleInstallClick}
                      >
                        <Smartphone className="mr-2 h-5 w-5" />
                        Installer l'Application
                      </Button>
                    ) : (
                      <div className="rounded border-l-4 border-blue-400 bg-blue-50 p-4">
                        <div className="flex items-start gap-2">
                          <Badge variant="secondary" className="text-xs">
                            ℹ️ Info
                          </Badge>
                          <p className="text-sm text-blue-800">
                            Installation disponible sur Chrome, Edge et Safari (iOS). Ouvrez le menu
                            du navigateur pour installer.
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
