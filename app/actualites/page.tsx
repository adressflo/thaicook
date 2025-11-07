import { Sparkles, Facebook, Instagram, Calendar, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const metadata = {
  title: 'Découvertes - Actualités | ChanthanaThaiCook',
  description: 'Nouveautés, plats du moment et suivez nos coulisses sur les réseaux sociaux',
}

export default function ActualitesPage() {
  return (
    <div className="min-h-screen bg-gradient-thai py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 bg-thai-orange/10 px-6 py-3 rounded-full">
            <Sparkles className="h-6 w-6 text-thai-orange animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-thai-green">Découvertes</h1>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Suivez nos nouveautés, plats du moment et découvrez nos coulisses
          </p>
        </div>

        {/* Section Plat du Moment */}
        <section>
          <Card className="border-thai-orange/30 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-thai-orange/10 to-thai-gold/10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-thai-orange" />
                <CardTitle className="text-2xl text-thai-green">Plat du Moment</CardTitle>
              </div>
              <CardDescription>Notre création spéciale de la saison</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-video bg-thai-orange/5 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Image à venir</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Badge className="bg-thai-orange mb-2">Nouveau</Badge>
                    <h3 className="text-2xl font-bold text-thai-green mb-2">
                      Nom du plat spécial
                    </h3>
                    <p className="text-gray-700">
                      Description du plat du moment, ingrédients spéciaux, saveurs uniques...
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button asChild className="bg-thai-orange hover:bg-thai-orange/90">
                      <Link href="/commander">Commander</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-thai-orange text-thai-orange">
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
            <h2 className="text-2xl font-bold text-thai-green flex items-center gap-2">
              <Calendar className="h-6 w-6 text-thai-orange" />
              Nouveautés au Menu
            </h2>
            <p className="text-gray-600 mt-2">Découvrez nos derniers ajouts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-thai-orange/20 hover:border-thai-orange transition-colors">
                <div className="aspect-video bg-thai-orange/5"></div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    Nouveau
                  </Badge>
                  <h3 className="font-semibold text-thai-green mb-1">Nom du nouveau plat {i}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Courte description du plat...
                  </p>
                  <Button asChild variant="link" className="text-thai-orange p-0 mt-2">
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
                <AlertCircle className="h-6 w-6 text-thai-orange" />
                <CardTitle className="text-2xl text-thai-green">Informations Pratiques</CardTitle>
              </div>
              <CardDescription>Horaires, fermetures et actualités importantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-thai-cream p-4 rounded-lg">
                <h3 className="font-semibold text-thai-green mb-2">Horaires d'ouverture</h3>
                <p className="text-gray-700">
                  <strong>Mardi - Samedi :</strong> 18h00 - 20h30
                  <br />
                  <strong>Dimanche - Lundi :</strong> Fermé
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-blue-800 font-medium">
                  ℹ️ Prochaine fermeture exceptionnelle : [Date à définir]
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <p className="text-green-800">
                  ✅ Événements à venir : [Information à compléter]
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section Réseaux Sociaux */}
        <section className="text-center">
          <Card className="border-thai-orange/30 bg-gradient-to-br from-thai-orange/5 to-thai-gold/5">
            <CardHeader>
              <CardTitle className="text-2xl text-thai-green">Suivez nos Coulisses</CardTitle>
              <CardDescription>
                Découvrez nos créations, recettes et moments en cuisine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white gap-2"
                  asChild
                >
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="h-5 w-5" />
                    Facebook
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white gap-2"
                  asChild
                >
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5" />
                    Instagram
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Retour */}
        <div className="text-center pt-8">
          <Button asChild variant="outline" size="lg" className="border-thai-orange text-thai-orange">
            <Link href="/">← Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
