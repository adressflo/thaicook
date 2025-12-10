"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { changePasswordAction } from "../actions"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await changePasswordAction(formData)

      setResult(response)

      if (response.success) {
        // Clear form and redirect to profile after 2 seconds
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
                <Shield className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Modifier mon mot de passe
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Changez votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Security Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Lock className="h-4 w-4 text-blue-700" />
              <AlertDescription className="ml-2 text-sm text-blue-800">
                <strong>Sécurité :</strong> Votre mot de passe doit contenir au moins 8 caractères,
                une majuscule, une minuscule, un chiffre et un caractère spécial.
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
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    disabled={isSubmitting}
                    className="border-gray-300 pr-10 pl-10 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Nouveau mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    className="border-gray-300 pr-10 pl-10 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Doit contenir: majuscule, minuscule, chiffre, caractère spécial
                </p>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    className="border-gray-300 pr-10 pl-10 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Retapez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security Tips */}
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <AlertDescription className="ml-2 text-sm text-amber-800">
                  <strong>Conseils de sécurité :</strong>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    <li>N'utilisez jamais le même mot de passe sur plusieurs sites</li>
                    <li>Évitez les informations personnelles évidentes</li>
                    <li>Changez régulièrement votre mot de passe</li>
                  </ul>
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
                      <Shield className="mr-2 h-4 w-4" />
                      Modifier mon mot de passe
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
            Mot de passe oublié ?{" "}
            <Link
              href="/auth/reset-password"
              className="font-medium text-amber-600 hover:text-amber-700"
            >
              Réinitialiser mon mot de passe
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
