"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { resendVerificationEmail, verifyEmailToken } from "../actions"

type VerificationState = "loading" | "success" | "error" | "expired"

export default function VerifyEmailPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [state, setState] = useState<VerificationState>("loading")
  const [message, setMessage] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const result = await verifyEmailToken(params.token)

        if (result.success) {
          setState("success")
          setMessage(result.message || "Email vérifié avec succès !")

          // Countdown before redirect
          let count = 3
          const interval = setInterval(() => {
            count--
            setCountdown(count)
            if (count === 0) {
              clearInterval(interval)
              router.push("/profil")
            }
          }, 1000)

          return () => clearInterval(interval)
        } else {
          // Check if error suggests expired token
          if (result.error?.includes("expiré") || result.error?.includes("invalide")) {
            setState("expired")
          } else {
            setState("error")
          }
          setMessage(result.error || "Une erreur est survenue")
        }
      } catch (error) {
        setState("error")
        setMessage("Une erreur inattendue est survenue")
      }
    }

    verifyEmail()
  }, [params.token, router])

  const handleResendEmail = async () => {
    setIsResending(true)

    try {
      // TODO: Get user email from session or local storage
      // For now, we'll need the user to be logged in or provide their email
      const result = await resendVerificationEmail("user@example.com") // Replace with actual email

      if (result.success) {
        setMessage(result.message || "Email renvoyé avec succès !")
        setState("loading") // Reset to loading state
      } else {
        setMessage(result.error || "Impossible de renvoyer l'email")
      }
    } catch (error) {
      setMessage("Une erreur est survenue lors de l'envoi")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-amber-50 via-white to-red-50 p-4">
      <Card className="w-full max-w-md border-2 border-amber-100 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            {state === "loading" && <Loader2 className="h-16 w-16 animate-spin text-amber-600" />}
            {state === "success" && <CheckCircle2 className="h-16 w-16 text-green-600" />}
            {(state === "error" || state === "expired") && (
              <XCircle className="h-16 w-16 text-red-600" />
            )}
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            {state === "loading" && "Vérification en cours..."}
            {state === "success" && "Email vérifié !"}
            {state === "error" && "Erreur de vérification"}
            {state === "expired" && "Lien expiré"}
          </CardTitle>

          <CardDescription className="text-base">
            {state === "loading" && "Veuillez patienter pendant que nous vérifions votre email"}
            {state === "success" &&
              `Redirection dans ${countdown} seconde${countdown > 1 ? "s" : ""}...`}
            {state === "error" && "Le lien de vérification est invalide"}
            {state === "expired" && "Ce lien de vérification a expiré"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {message && (
            <Alert
              className={
                state === "success"
                  ? "border-green-200 bg-green-50"
                  : state === "error" || state === "expired"
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
              }
            >
              <AlertDescription className="text-center text-sm">{message}</AlertDescription>
            </Alert>
          )}

          {state === "success" && (
            <div className="space-y-3 text-center">
              <p className="text-sm text-gray-600">
                Votre email a été vérifié avec succès ! Vous pouvez maintenant profiter pleinement
                de ChanthanaThaiCook.
              </p>
              <Button
                onClick={() => router.push("/profil")}
                className="w-full bg-linear-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700"
              >
                Accéder à mon profil
              </Button>
            </div>
          )}

          {state === "expired" && (
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600">
                Le lien de vérification a expiré. Vous pouvez demander un nouveau lien de
                vérification.
              </p>
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Renvoyer l'email de vérification
                  </>
                )}
              </Button>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600">
                Une erreur s'est produite lors de la vérification. Veuillez réessayer ou contacter
                le support.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="outline"
                  className="flex-1"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Renvoyer l'email
                    </>
                  )}
                </Button>
                <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          )}

          {state === "loading" && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Vérification en cours...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
