"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ShoppingCart,
  Heart,
  Bell,
  Trash2,
  Edit,
  Eye,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react"

export default function BoutonsTestPage() {
  const NumberBadge = ({ number }: { number: number }) => (
    <span className="bg-thai-orange mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
      {number}
    </span>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">🔘 Test des Boutons</h1>
        <p className="text-gray-600">Catalogue complet des boutons et éléments interactifs</p>
        <div className="mt-4 flex gap-2">
          <Badge variant="outline" className="border-thai-orange text-thai-orange">
            Boutons & Actions
          </Badge>
          <Badge className="bg-thai-green">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Fonctionnel
          </Badge>
        </div>
      </div>

      {/* Section 1: Boutons Principaux */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">1. Boutons Principaux</CardTitle>
          <CardDescription>Actions primaires et secondaires standard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Primary Orange */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Button className="bg-thai-orange hover:bg-thai-orange/90 w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ajouter au panier
              </Button>
            </div>

            {/* Primary Green */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Valider la commande
              </Button>
            </div>

            {/* Secondary / Outline */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Button
                variant="outline"
                className="border-thai-orange text-thai-orange hover:bg-thai-orange w-full hover:text-white"
              >
                <Eye className="mr-2 h-4 w-4" />
                Voir les détails
              </Button>
            </div>

            {/* Ghost */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={4} />
              <Button variant="ghost" className="w-full hover:bg-gray-100">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </div>

            {/* Destructive */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={5} />
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>

            {/* Link Style */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={6} />
              <Button variant="link" className="text-thai-orange w-full">
                En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Boutons avec Icônes */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">2. Boutons avec Icônes</CardTitle>
          <CardDescription>Variantes pour les interfaces riches en icônes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid items-end gap-4 md:grid-cols-4 lg:grid-cols-6">
            {/* Icon Only - Orange */}
            <div className="flex flex-col items-center gap-1">
              <NumberBadge number={1} />
              <Button size="icon" className="bg-thai-orange hover:bg-thai-orange/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Icon Only - Green */}
            <div className="flex flex-col items-center gap-1">
              <NumberBadge number={2} />
              <Button size="icon" className="bg-thai-green hover:bg-thai-green/90">
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Icon Only - Outline */}
            <div className="flex flex-col items-center gap-1">
              <NumberBadge number={3} />
              <Button
                size="icon"
                variant="outline"
                className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Icon Only - Ghost */}
            <div className="flex flex-col items-center gap-1">
              <NumberBadge number={4} />
              <Button size="icon" variant="ghost">
                <Bell className="h-4 w-4" />
              </Button>
            </div>

            {/* Icon Only - Destructive */}
            <div className="flex flex-col items-center gap-1">
              <NumberBadge number={5} />
              <Button size="icon" variant="destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Rounded Full */}
            <div className="flex flex-col items-center gap-1">
              <NumberBadge number={6} />
              <Button
                size="icon"
                className="bg-thai-gold hover:bg-thai-gold/90 rounded-full text-black"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Tailles & États */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">3. Tailles & États</CardTitle>
          <CardDescription>Différentes dimensions et états interactifs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Small */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Button size="sm" className="bg-thai-orange hover:bg-thai-orange/90 w-full">
                Petit Bouton
              </Button>
            </div>

            {/* Default */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Button className="bg-thai-orange hover:bg-thai-orange/90 w-full">
                Bouton Standard
              </Button>
            </div>

            {/* Large */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Button size="lg" className="bg-thai-orange hover:bg-thai-orange/90 w-full">
                Grand Bouton
              </Button>
            </div>

            {/* Disabled */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={4} />
              <Button disabled className="w-full">
                Désactivé
              </Button>
            </div>

            {/* Loading */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={5} />
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </Button>
            </div>

            {/* With Badge */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={6} />
              <Button className="bg-thai-green hover:bg-thai-green/90 relative w-full">
                Panier
                <Badge className="text-thai-green ml-2 bg-white hover:bg-white">3</Badge>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Gradients & Spéciaux */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">4. Gradients & Spéciaux</CardTitle>
          <CardDescription>Styles visuels avancés pour les appels à l'action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Gradient Orange */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Button className="from-thai-orange to-thai-gold hover:from-thai-orange/90 hover:to-thai-gold/90 w-full bg-gradient-to-r text-white shadow-lg transition-all hover:scale-[1.02]">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Commander Maintenant
              </Button>
            </div>

            {/* Gradient Green */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Button className="from-thai-green hover:from-thai-green/90 w-full bg-gradient-to-r to-teal-600 text-white shadow-lg transition-all hover:scale-[1.02] hover:to-teal-600/90">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirmer l'inscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
