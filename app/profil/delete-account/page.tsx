"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Lock, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { deleteAccountAction } from "../actions"

export default function DeleteAccountPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await deleteAccountAction(formData)

      setResult(response)

      if (response.success) {
        // Redirect to homepage after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      }
    } catch (error) {
      setResult({
        success: false,
        error: "Une erreur inattendue est survenue",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-amber-50 p-4 pt-20">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <Link
          href="/profil"
          className="mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au profil
        </Link>

        <Card className="border-2 border-red-200 shadow-xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-linear-to-br from-red-100 to-orange-100 p-2">
                <Trash2 className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Supprimer mon compte
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Cette action est irréversible et définitive
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Critical Warning */}
            <Alert className="border-2 border-red-300 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-700" />
              <AlertDescription className="ml-2 text-sm text-red-900">
                <strong className="mb-2 block text-base">⚠️ ATTENTION - ACTION IRRÉVERSIBLE</strong>
                <ul className="ml-2 list-inside list-disc space-y-1">
                  <li>
                    Votre compte sera <strong>définitivement supprimé</strong>
                  </li>
                  <li>
                    Toutes vos données personnelles seront <strong>anonymisées</strong>
                  </li>
                  <li>Vos commandes historiques resteront archivées (conformité RGPD)</li>
                  <li>
                    Vous ne pourrez <strong>plus récupérer votre compte</strong>
                  </li>
                  <li>Vous serez immédiatement déconnecté</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* GDPR Compliance Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-700" />
              <AlertDescription className="ml-2 text-sm text-blue-800">
                <strong>Conformité RGPD :</strong> Conformément au règlement européen sur la
                protection des données (RGPD), vous avez le droit de demander la suppression de vos
                données personnelles. Vos données seront anonymisées et votre compte sera supprimé
                sous 24 heures.
              </AlertDescription>
            </Alert>

            {/* Result Messages */}
            {result && (
              <Alert
                className={
                  result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }
              >
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-700" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-700" />
                )}
                <AlertDescription
                  className={`ml-2 text-sm ${result.success ? "text-green-800" : "text-red-800"}`}
                >
                  {result.success ? result.message : result.error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Confirmer votre mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isSubmitting}
                    className="border-gray-300 pl-10 focus:border-red-500 focus:ring-red-500"
                    placeholder="Entrez votre mot de passe"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Votre mot de passe actuel est requis pour confirmer la suppression
                </p>
              </div>

              {/* Text Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="confirmation" className="text-sm font-medium text-gray-700">
                  Taper "SUPPRIMER MON COMPTE" pour confirmer *
                </Label>
                <div className="relative">
                  <AlertTriangle className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-red-500" />
                  <Input
                    id="confirmation"
                    name="confirmation"
                    type="text"
                    required
                    disabled={isSubmitting}
                    className="border-gray-300 pl-10 font-mono focus:border-red-500 focus:ring-red-500"
                    placeholder="SUPPRIMER MON COMPTE"
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs font-medium text-red-600">
                  ⚠️ Vous devez taper exactement "SUPPRIMER MON COMPTE" en majuscules
                </p>
              </div>

              {/* Final Warning */}
              <Alert className="border-yellow-300 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-700" />
                <AlertDescription className="ml-2 text-sm text-yellow-900">
                  <strong>Dernière chance :</strong> Une fois que vous aurez cliqué sur le bouton
                  ci-dessous, votre compte sera immédiatement supprimé. Cette action ne peut pas
                  être annulée.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profil")}
                  disabled={isSubmitting}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Non, garder mon compte
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-linear-to-r from-red-600 to-orange-600 font-bold text-white hover:from-red-700 hover:to-orange-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suppression en cours...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Oui, supprimer définitivement
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Help Section */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-center text-sm text-gray-600">
                Vous rencontrez un problème avec votre compte ?{" "}
                <a
                  href="mailto:chanthanacook@gmail.com"
                  className="font-medium text-amber-600 hover:text-amber-700"
                >
                  Contactez notre support
                </a>{" "}
                avant de supprimer votre compte.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Section */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">
            Vous voulez juste faire une pause ?
          </h3>
          <p className="mb-3 text-sm text-gray-600">
            Si vous souhaitez simplement ne plus recevoir d'emails ou faire une pause temporaire,
            vous pouvez désactiver les notifications dans vos{" "}
            <Link href="/profil" className="font-medium text-amber-600 hover:text-amber-700">
              paramètres de profil
            </Link>
            .
          </p>
          <p className="text-xs text-gray-500">
            💡 La suppression de compte est une mesure définitive. Pensez à explorer d'autres
            options d'abord.
          </p>
        </div>
      </div>
    </div>
  )
}
