import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Calendar, Facebook, Instagram, Sparkles } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Découvertes - Actualités | ChanthanaThaiCook",
  description: "Nouveautés, plats du moment et suivez nos coulisses sur les réseaux sociaux",
}

export default function ActualitesPage() {
  return (
    <div className="bg-gradient-thai min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="bg-thai-orange/10 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3">
            <Sparkles className="text-thai-orange h-6 w-6 animate-pulse" />
            <h1 className="text-thai-green text-3xl font-bold md:text-4xl">Découvertes</h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-700">
            Suivez nos nouveautés, plats du moment et découvrez nos coulisses
          </p>
        </div>

        {/* Section Plat du Moment */}
        <section>
          <Card className="border-thai-orange/30 overflow-hidden shadow-xl">
            <CardHeader className="from-thai-orange/10 to-thai-gold/10 bg-linear-to-r">
              <div className="flex items-center gap-2">
                <Sparkles className="text-thai-orange h-6 w-6" />
                <CardTitle className="text-thai-green text-2xl">Plat du Moment</CardTitle>
              </div>
              <CardDescription>Notre création spéciale de la saison</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div className="bg-thai-orange/5 flex aspect-video items-center justify-center rounded-lg">
                  <p className="text-sm text-gray-400">Image à venir</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Badge className="bg-thai-orange mb-2">Nouveau</Badge>
                    <h3 className="text-thai-green mb-2 text-2xl font-bold">Nom du plat spécial</h3>
                    <p className="text-gray-700">
                      Description du plat du moment, ingrédients spéciaux, saveurs uniques...
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button asChild className="bg-thai-orange hover:bg-thai-orange/90">
                      <Link href="/commander">Commander</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-thai-orange text-thai-orange"
                    >
                      <Link href="/commander">Voir le menu</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section Nouveautés Menu */}
        <section>
          <div className="mb-6">
            <h2 className="text-thai-green flex items-center gap-2 text-2xl font-bold">
              <Calendar className="text-thai-orange h-6 w-6" />
              Nouveautés au Menu
            </h2>
            <p className="mt-2 text-gray-600">Découvrez nos derniers ajouts</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-thai-orange/20 hover:border-thai-orange transition-colors"
              >
                <div className="bg-thai-orange/5 aspect-video"></div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    Nouveau
                  </Badge>
                  <h3 className="text-thai-green mb-1 font-semibold">Nom du nouveau plat {i}</h3>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    Courte description du plat...
                  </p>
                  <Button asChild variant="link" className="text-thai-orange mt-2 p-0">
                    <Link href="/commander">Découvrir →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Section Infos Pratiques */}
        <section>
          <Card className="border-thai-orange/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="text-thai-orange h-6 w-6" />
                <CardTitle className="text-thai-green text-2xl">Informations Pratiques</CardTitle>
              </div>
              <CardDescription>Horaires, fermetures et actualités importantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-thai-cream rounded-lg p-4">
                <h3 className="text-thai-green mb-2 font-semibold">Horaires d'ouverture</h3>
                <p className="text-gray-700">
                  <strong>Mardi - Samedi :</strong> 18h00 - 20h30
                  <br />
                  <strong>Dimanche - Lundi :</strong> Fermé
                </p>
              </div>

              <div className="rounded border-l-4 border-blue-400 bg-blue-50 p-4">
                <p className="font-medium text-blue-800">
                  ℹ️ Prochaine fermeture exceptionnelle : [Date à définir]
                </p>
              </div>

              <div className="rounded border-l-4 border-green-400 bg-green-50 p-4">
                <p className="text-green-800">✅ Événements à venir : [Information à compléter]</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section Réseaux Sociaux */}
        <section className="text-center">
          <Card className="border-thai-orange/30 from-thai-orange/5 to-thai-gold/5 bg-linear-to-br">
            <CardHeader>
              <CardTitle className="text-thai-green text-2xl">Suivez nos Coulisses</CardTitle>
              <CardDescription>
                Découvrez nos créations, recettes et moments en cuisine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="gap-2 bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                  asChild
                >
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5" />
                    Facebook
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="gap-2 bg-linear-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90"
                  asChild
                >
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                    Instagram
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Retour */}
        <div className="pt-8 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-thai-orange text-thai-orange"
          >
            <Link href="/">← Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
