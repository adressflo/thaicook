"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmationPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-thai-green/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-thai-green/10">
            <CheckCircle2 className="h-12 w-12 text-thai-green" />
          </div>
          <CardTitle className="text-2xl text-thai-green">
            Commande confirmée !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Votre commande a été enregistrée avec succès.
            <br />
            Vous recevrez un email de confirmation dans quelques instants.
          </p>
          <p className="text-sm text-muted-foreground">
            Vous serez redirigé vers l&apos;accueil dans 10 secondes...
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/commander")}
              variant="outline"
              className="flex-1"
            >
              Nouvelle commande
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="flex-1 bg-thai-green hover:bg-thai-green/90"
            >
              Retour à l&apos;accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
