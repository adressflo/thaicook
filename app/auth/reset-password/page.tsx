"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { authClient } from "@/lib/auth-client"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ResetPasswordPage() {
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await (authClient as any).forgetPassword({
        email: email,
        redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      setSuccess(true)
      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-thai flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href={"/auth/login" as any}>
            <Button
              variant="outline"
              className="border-thai-orange/20 hover:border-thai-orange/40 text-thai-green hover:text-thai-green group rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              Retour à la connexion
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="bg-thai-orange/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <Mail className="text-thai-orange h-10 w-10" />
            </div>
            <CardTitle className="text-thai-green text-2xl font-bold">
              Réinitialiser le mot de passe
            </CardTitle>
            <CardDescription className="text-thai-green/70 pt-2 text-sm">
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="space-y-6">
                <div className="animate-fade-in rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-800">
                        Email envoyé avec succès !
                      </p>
                      <p className="text-xs text-green-700">
                        Vérifiez votre boîte mail <span className="font-semibold">{email}</span>{" "}
                        pour réinitialiser votre mot de passe.
                      </p>
                      <p className="mt-2 text-xs text-green-600">Le lien expire dans 15 minutes.</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Renvoyer un email
                </Button>

                <div className="text-center text-sm">
                  <Link href={"/auth/login" as any} className="text-thai-orange hover:underline">
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetRequest} className="space-y-6">
                {error && (
                  <div className="animate-fade-in flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(null)
                    }}
                    placeholder="votreadresse@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="h-12 w-full text-base transition-all duration-200 hover:shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-5 w-5" />
                  )}
                  Envoyer le lien de réinitialisation
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <p>Vous recevrez un email avec un lien pour créer un nouveau mot de passe.</p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
