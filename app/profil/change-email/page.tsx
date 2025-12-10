"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { changeEmailAction } from "../actions"

export default function ChangeEmailPage() {
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
      const response = await changeEmailAction(formData)

      setResult(response)

      if (response.success) {
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push("/profil")
        }, 2000)
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
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-red-50 p-4 pt-20">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <Link
          href="/profil"
          className="mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au profil
        </Link>

        <Card className="border-2 border-amber-100 shadow-xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-linear-to-br from-amber-100 to-red-100 p-2">
                <Mail className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Modifier mon adresse email
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Changez l'adresse email associée à votre compte
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Security Notice */}
            <Alert className="border-amber-200 bg-amber-50">
              <Lock className="h-4 w-4 text-amber-700" />
              <AlertDescription className="ml-2 text-sm text-amber-800">
                <strong>Sécurité :</strong> Votre mot de passe actuel est requis pour modifier votre
                email. Après la modification, vous devrez vérifier votre nouvel email.
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
                  <AlertCircle className="h-4 w-4 text-red-700" />
                )}
                <AlertDescription
                  className={`ml-2 text-sm ${result.success ? "text-green-800" : "text-red-800"}`}
                >
                  {result.success ? result.message : result.error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                  Mot de passe actuel *
                </Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    disabled={isSubmitting}
                    className="border-gray-300 pl-10 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                </div>
              </div>

              {/* New Email */}
              <div className="space-y-2">
                <Label htmlFor="newEmail" className="text-sm font-medium text-gray-700">
                  Nouvelle adresse email *
                </Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    required
                    disabled={isSubmitting}
                    className="border-gray-300 pl-10 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="nouvelle@email.com"
                  />
                </div>
              </div>

              {/* Confirm New Email */}
              <div className="space-y-2">
                <Label htmlFor="confirmNewEmail" className="text-sm font-medium text-gray-700">
                  Confirmer la nouvelle adresse email *
                </Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmNewEmail"
                    name="confirmNewEmail"
                    type="email"
                    required
                    disabled={isSubmitting}
                    className="border-gray-300 pl-10 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="nouvelle@email.com"
                  />
                </div>
              </div>

              {/* Important Notice */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-700" />
                <AlertDescription className="ml-2 text-sm text-blue-800">
                  <strong>Important :</strong> Un email de vérification sera envoyé à votre nouvelle
                  adresse. Vous devrez cliquer sur le lien pour confirmer le changement.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-linear-to-r from-amber-600 to-red-600 font-medium text-white hover:from-amber-700 hover:to-red-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Modification en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Modifier mon email
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profil")}
                  disabled={isSubmitting}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Besoin d'aide ? Contactez-nous à{" "}
            <a
              href="mailto:chanthanacook@gmail.com"
              className="font-medium text-amber-600 hover:text-amber-700"
            >
              chanthanacook@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
