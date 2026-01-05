"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  CreditCard,
  Edit,
  Home,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  Minus,
  Plus,
  Settings,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react"

export default function BoutonsPage() {
  const NumberBadge = ({ number }: { number: number }) => (
    <span className="bg-thai-orange mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
      {number}
    </span>
  )

  return (
    <div className="bg-gradient-thai min-h-screen p-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <Card className="border-thai-orange/20 shadow-xl">
          <CardHeader className="from-thai-orange to-thai-gold rounded-t-lg bg-linear-to-r py-6 text-white">
            <CardTitle className="text-center text-3xl font-bold">
              Catalogue des Boutons - Style Guide
            </CardTitle>
            <p className="text-center text-sm text-white/90">
              Inventaire complet de tous les types de boutons utilisés dans l'application
            </p>
          </CardHeader>
        </Card>

        {/* 1. VARIANTES DE COULEURS */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">1. Variantes de Couleurs</CardTitle>
            <p className="text-sm text-gray-600">
              Basé sur les couleurs de la charte graphique (Orange Thaï, Vert Thaï)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default (Orange Thaï) */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">default</Badge>
                <span className="text-sm text-gray-600">Bouton principal (Orange Thaï)</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={1} />
                  <Button variant="default">Bouton Principal</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={2} />
                  <Button variant="default">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Avec Icône
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={3} />
                  <Button variant="default" disabled>
                    Désactivé
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                bg-thai-orange text-white hover:bg-thai-orange-dark
              </code>
            </div>

            {/* Secondary (Vert Thaï) */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">secondary</Badge>
                <span className="text-sm text-gray-600">Bouton secondaire (Vert Thaï)</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={4} />
                  <Button variant="secondary">Bouton Secondaire</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={5} />
                  <Button variant="secondary">
                    <Users className="mr-2 h-4 w-4" />
                    Avec Icône
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={6} />
                  <Button variant="secondary" disabled>
                    Désactivé
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                bg-thai-green text-white hover:bg-thai-green-dark
              </code>
            </div>

            {/* Outline */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">outline</Badge>
                <span className="text-sm text-gray-600">Bouton avec bordure uniquement</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={7} />
                  <Button variant="outline">Bouton Outline</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={8} />
                  <Button variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={9} />
                  <Button variant="outline" disabled>
                    Désactivé
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                border-2 border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white
              </code>
            </div>

            {/* Destructive (Rouge) */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="destructive">destructive</Badge>
                <span className="text-sm text-gray-600">Actions destructives</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={10} />
                  <Button variant="destructive">Supprimer</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={11} />
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer le compte
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={12} />
                  <Button variant="destructive" disabled>
                    Désactivé
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                bg-destructive text-destructive-foreground hover:bg-destructive/90
              </code>
            </div>

            {/* Ghost */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">ghost</Badge>
                <span className="text-sm text-gray-600">Bouton discret sans bordure</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={13} />
                  <Button variant="ghost">Bouton Ghost</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={14} />
                  <Button variant="ghost">
                    <X className="mr-2 h-4 w-4" />
                    Fermer
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={15} />
                  <Button variant="ghost" disabled>
                    Désactivé
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                hover:bg-thai-cream hover:text-thai-orange
              </code>
            </div>

            {/* Link */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">link</Badge>
                <span className="text-sm text-gray-600">Style lien hypertexte</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={16} />
                  <Button variant="link">Lien Simple</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={17} />
                  <Button variant="link">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    En savoir plus
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={18} />
                  <Button variant="link" disabled>
                    Désactivé
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                text-primary underline-offset-4 hover:underline
              </code>
            </div>
          </CardContent>
        </Card>

        {/* 2. TAILLES */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">2. Tailles de Boutons</CardTitle>
            <p className="text-sm text-gray-600">
              Quatre tailles disponibles (sm, default, lg, icon)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Small */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">size="sm"</Badge>
                <span className="text-sm text-gray-600">Petit (h-9 px-3)</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={19} />
                  <Button size="sm">Small Default</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={20} />
                  <Button size="sm" variant="outline">
                    Small Outline
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={21} />
                  <Button size="sm" variant="secondary">
                    Small Secondary
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={22} />
                  <Button size="sm" variant="ghost">
                    <Plus className="mr-1 h-3 w-3" />
                    Ajouter
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">h-9 rounded-md px-3</code>
            </div>

            {/* Default */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">size="default"</Badge>
                <span className="text-sm text-gray-600">Taille par défaut (h-10 px-4 py-2)</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={23} />
                  <Button>Default Default</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={24} />
                  <Button variant="outline">Default Outline</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={25} />
                  <Button variant="secondary">Default Secondary</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={26} />
                  <Button variant="ghost">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Voir le panier
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">h-10 px-4 py-2</code>
            </div>

            {/* Large */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">size="lg"</Badge>
                <span className="text-sm text-gray-600">Grand (h-11 px-8)</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={27} />
                  <Button size="lg">Large Default</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={28} />
                  <Button size="lg" variant="outline">
                    Large Outline
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={29} />
                  <Button size="lg" variant="secondary">
                    Large Secondary
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={30} />
                  <Button size="lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Valider la commande
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">h-11 rounded-md px-8</code>
            </div>

            {/* Icon */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">size="icon"</Badge>
                <span className="text-sm text-gray-600">Icône seule (h-10 w-10)</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={31} />
                  <Button size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={32} />
                  <Button size="icon" variant="outline">
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={33} />
                  <Button size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={34} />
                  <Button size="icon" variant="destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">h-10 w-10</code>
            </div>
          </CardContent>
        </Card>

        {/* 3. ÉTATS INTERACTIFS */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">3. États Interactifs</CardTitle>
            <p className="text-sm text-gray-600">Normal, Hover, Disabled, Loading</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Normal State */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge>État Normal</Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={35} />
                  <Button>Normal</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={36} />
                  <Button variant="outline">Normal Outline</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={37} />
                  <Button variant="secondary">Normal Secondary</Button>
                </div>
              </div>
            </div>

            {/* Hover State */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge>État Hover</Badge>
                <span className="text-sm text-gray-600">Passez la souris pour voir l'effet</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={38} />
                  <Button className="hover:scale-105 hover:shadow-lg">Hover + Scale</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={39} />
                  <Button
                    variant="outline"
                    className="hover:border-thai-orange hover:ring-thai-orange/30 hover:ring-2"
                  >
                    Hover + Ring
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={40} />
                  <Button variant="ghost" className="hover:bg-red-50 hover:text-red-500">
                    Hover Custom
                  </Button>
                </div>
              </div>
            </div>

            {/* Disabled State */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">État Disabled</Badge>
                <span className="text-sm text-gray-600">opacity-50, pointer-events-none</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={41} />
                  <Button disabled>Désactivé</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={42} />
                  <Button disabled variant="outline">
                    Désactivé Outline
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={43} />
                  <Button disabled variant="secondary">
                    Désactivé Secondary
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={44} />
                  <Button disabled variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                disabled:pointer-events-none disabled:opacity-50
              </code>
            </div>

            {/* Loading State */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500">État Loading</Badge>
                <span className="text-sm text-gray-600">Avec spinner animé</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={45} />
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={46} />
                  <Button disabled variant="outline">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={47} />
                  <Button disabled variant="secondary">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validation
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                &lt;Loader2 className="animate-spin" /&gt;
              </code>
            </div>
          </CardContent>
        </Card>

        {/* 4. CONTEXTES D'UTILISATION - PANIER */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">
              4. Contextes - Actions Panier
            </CardTitle>
            <p className="text-sm text-gray-600">
              Boutons utilisés dans le panier et les commandes
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ajout Panier */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Ajout au panier</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={48} />
                  <Button
                    size="sm"
                    className="bg-thai-orange hover:bg-thai-orange/90 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={49} />
                  <Button className="bg-thai-orange">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>

            {/* Contrôles Quantité */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Contrôles de quantité</h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={50} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:border-thai-orange hover:ring-thai-orange/30 h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2"
                  >
                    -
                  </Button>
                </div>
                <span className="w-8 text-center font-medium">3</span>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={51} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:border-thai-orange hover:ring-thai-orange/30 h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Suppression */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Suppression d'article</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={52} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500 hover:shadow-lg hover:ring-2 hover:ring-red-300"
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Validation Commande */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Validation de commande</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={53} />
                  <Button className="bg-thai-orange py-6 text-lg">
                    <CreditCard className="mr-2 h-6 w-6" />
                    Valider ma commande (45,90€)
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={54} />
                  <Button disabled className="bg-thai-orange py-6 text-lg">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Validation en cours...
                  </Button>
                </div>
              </div>
            </div>

            {/* Retour / Navigation */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Navigation depuis panier</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={55} />
                  <Button
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
                  >
                    Retour à Commander
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={56} />
                  <Button variant="ghost">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Voir le panier
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. CONTEXTES D'UTILISATION - NAVIGATION */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">5. Contextes - Navigation</CardTitle>
            <p className="text-sm text-gray-600">
              Boutons utilisés dans les menus et la navigation
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Navigation Cards */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Navigation Cards (Homepage)</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={57} />
                  <Button
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange transform group-hover:scale-105 group-hover:shadow-lg hover:text-white"
                  >
                    Commander
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={58} />
                  <Button
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Événements
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={59} />
                  <Button
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Nous Trouver
                  </Button>
                </div>
              </div>
            </div>

            {/* Sélection Jour */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Sélection de jour (Commander)</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={60} />
                  <Button
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange/10 bg-white"
                  >
                    Lundi
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={61} />
                  <Button variant="default" className="bg-thai-orange text-white">
                    Mercredi
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={62} />
                  <Button
                    variant="outline"
                    className="border-thai-gold text-thai-orange bg-thai-gold/10 hover:bg-thai-gold/20 hover:ring-thai-gold/50 border-2 hover:ring-2"
                  >
                    <Star className="mr-2 h-4 w-4 fill-current" />
                    Vendredi
                  </Button>
                </div>
              </div>
            </div>

            {/* Retour accueil */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Retour à l'accueil</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={63} />
                  <Button
                    variant="outline"
                    className="border-thai-orange/20 hover:border-thai-orange/40 text-thai-green hover:text-thai-green rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            </div>

            {/* Fermeture / Close */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Fermeture (Modals, Sidebars)</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={64} />
                  <Button variant="ghost" size="sm" className="p-1 text-white hover:bg-white/20">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={65} />
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 6. CONTEXTES D'UTILISATION - ADMINISTRATION */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">
              6. Contextes - Administration
            </CardTitle>
            <p className="text-sm text-gray-600">
              Boutons utilisés dans l'interface d'administration
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Actions Admin */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Actions Admin</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={66} />
                  <Button
                    size="sm"
                    className="bg-thai-green hover:bg-thai-green/90 text-white shadow-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Plat
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={67} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={68} />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Admin */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Navigation Admin</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={69} />
                  <Button variant="ghost" className="justify-start hover:bg-gray-100">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={70} />
                  <Button variant="ghost" className="justify-start hover:bg-gray-100">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={71} />
                  <Button variant="ghost" className="justify-start text-red-500 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7. BOUTONS SPÉCIAUX / CUSTOM */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">7. Boutons Spéciaux</CardTitle>
            <p className="text-sm text-gray-600">
              Boutons avec animations, badges ou styles personnalisés
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bouton flottant */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Bouton flottant (Mobile)</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={72} />
                  <Button className="bg-thai-orange hover:bg-thai-orange/90 h-16 w-16 animate-pulse rounded-full shadow-2xl transition-all duration-200 hover:scale-110">
                    <div className="relative flex flex-col items-center">
                      <ShoppingCart className="h-7 w-7" />
                      <Badge
                        variant="secondary"
                        className="bg-thai-gold text-thai-green absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow-lg"
                      >
                        3
                      </Badge>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Bouton avec badge */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Boutons avec badges</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={73} />
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Mon Panier
                    <Badge className="bg-thai-orange ml-2 text-white">5</Badge>
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={74} />
                  <Button variant="secondary" className="relative">
                    <Calendar className="mr-2 h-4 w-4" />
                    Événements
                    <Badge className="bg-thai-gold ml-2 text-white">Nouveau</Badge>
                  </Button>
                </div>
              </div>
            </div>

            {/* Boutons avec effets hover avancés */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Effets hover avancés</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={75} />
                  <Button className="transition-all duration-200 hover:scale-110 hover:rotate-2 hover:shadow-xl">
                    Hover Scale + Rotate
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={76} />
                  <Button
                    variant="outline"
                    className="hover:border-thai-orange hover:ring-thai-orange/50 transition-all duration-300 hover:shadow-lg hover:ring-4"
                  >
                    Hover avec Ring
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={77} />
                  <Button className="group from-thai-orange to-thai-gold hover:from-thai-gold hover:to-thai-orange bg-linear-to-r">
                    <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                    Hover Gradient
                  </Button>
                </div>
              </div>
            </div>

            {/* Boutons icônes colorés */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Boutons icônes contextuels</h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={78} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:bg-red-50 hover:text-red-500 hover:shadow-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={79} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:bg-green-50 hover:text-green-500 hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={80} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Boutons avec bordure orange/blanc */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Style panier (Orange/Blanc)</h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={81} />
                  <Button
                    size="sm"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange h-8 w-8 rounded-md border bg-white p-0 transition-all duration-200 hover:scale-105 hover:text-white"
                  >
                    -
                  </Button>
                </div>
                <span className="w-8 text-center font-medium">2</span>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={82} />
                  <Button
                    size="sm"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange h-8 w-8 rounded-md border bg-white p-0 transition-all duration-200 hover:scale-105 hover:text-white"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8. COMBINAISONS COMPLEXES */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">8. Combinaisons Complexes</CardTitle>
            <p className="text-sm text-gray-600">Groupes de boutons et dispositions courantes</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Groupe Actions Modal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Actions de modal (Annuler/Confirmer)</h4>
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <NumberBadge number={83} />
                  <Button
                    variant="outline"
                    className="border-thai-green text-thai-green hover:bg-thai-green w-full border-2 hover:text-white"
                  >
                    Annuler
                  </Button>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <NumberBadge number={84} />
                  <Button className="bg-thai-orange hover:bg-thai-orange/90 w-full shadow-lg hover:shadow-xl">
                    Confirmer
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation commande (Retour + Validation) */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Navigation commande</h4>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="order-2 flex flex-1 flex-col items-center gap-2 sm:order-1">
                  <NumberBadge number={85} />
                  <Button
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange w-full hover:text-white"
                  >
                    Retour à Commander
                  </Button>
                </div>
                <div className="order-1 flex flex-1 flex-col items-center gap-2 sm:order-2">
                  <NumberBadge number={86} />
                  <Button className="bg-thai-orange w-full py-6 text-lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Valider (45,90€)
                  </Button>
                </div>
              </div>
            </div>

            {/* Contrôles complets article panier */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Contrôles article panier (Complet)</h4>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={87} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500 hover:shadow-lg hover:ring-2 hover:ring-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={88} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:border-thai-orange hover:ring-thai-orange/30 h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2"
                  >
                    -
                  </Button>
                </div>
                <span className="w-8 text-center font-medium">3</span>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={89} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:border-thai-orange hover:ring-thai-orange/30 h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Badges de jour avec variantes */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Badges jours disponibles</h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={90} />
                  <Badge
                    variant="secondary"
                    className="hover:bg-thai-orange/20 cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    Lundi
                  </Badge>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={91} />
                  <Badge
                    variant="secondary"
                    className="hover:bg-thai-orange/20 cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    Mercredi
                  </Badge>
                </div>
                <Badge variant="destructive">Indisponible</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 9. BOUTONS RÉSEAUX SOCIAUX & EXTERNES */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">
              9. Boutons Réseaux Sociaux & Externes
            </CardTitle>
            <p className="text-sm text-gray-600">
              Boutons pour liens externes, réseaux sociaux et services tiers
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Facebook */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Réseaux sociaux - Facebook</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={92} />
                  <Button size="lg" className="gap-2 bg-[#1877F2] text-white hover:bg-[#1877F2]/90">
                    <Users className="h-5 w-5" />
                    Facebook
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                bg-[#1877F2] hover:bg-[#1877F2]/90 text-white
              </code>
            </div>

            {/* Instagram */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Réseaux sociaux - Instagram</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={93} />
                  <Button
                    size="lg"
                    className="gap-2 bg-linear-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90"
                  >
                    <Sparkles className="h-5 w-5" />
                    Instagram
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                bg-linear-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]
              </code>
            </div>

            {/* Navigation externe (Google Maps, Waze) */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Navigation externe</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={94} />
                  <Button className="w-full rounded-lg bg-blue-500 py-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:shadow-lg">
                    <MapPin className="mr-2 h-5 w-5" />
                    Google Maps
                    <ChevronRight className="ml-2 h-3 w-3 opacity-70" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={95} />
                  <Button className="w-full rounded-lg bg-cyan-500 py-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-cyan-600 hover:shadow-lg">
                    <MapPin className="mr-2 h-5 w-5" />
                    Waze
                    <ChevronRight className="ml-2 h-3 w-3 opacity-70" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messagerie (WhatsApp, Messenger) */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Messagerie instantanée</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={96} />
                  <Button className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
                    <Users className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={97} />
                  <Button className="bg-[#0084FF] text-white hover:bg-[#0084FF]/90">
                    <Users className="mr-2 h-4 w-4" />
                    Messenger
                  </Button>
                </div>
              </div>
            </div>

            {/* Bouton avec icône externe */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Avec indicateur externe</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={98} />
                  <Button variant="outline">
                    Voir sur Google Maps
                    <ChevronRight className="ml-2 h-3 w-3 opacity-70" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 10. CONTEXTES D'UTILISATION - ADMINISTRATION */}
        <Card className="border-thai-orange/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-thai-green text-2xl">
              10. Contextes - Administration
            </CardTitle>
            <p className="text-sm text-gray-600">
              Boutons utilisés dans l'interface d'administration
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Toggle Nouveau/Existant (Extras) */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">
                Toggle Nouveau/Existant (Gestion Extras)
              </h4>
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <NumberBadge number={99} />
                  <Button variant="default" className="w-full">
                    Nouveau
                  </Button>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <NumberBadge number={100} />
                  <Button variant="outline" className="w-full">
                    Existant (12)
                  </Button>
                </div>
              </div>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                variant="default" pour actif, variant="outline" pour inactif
              </code>
            </div>

            {/* Filtres dates */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Filtres par date</h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={101} />
                  <Button variant="default" size="sm">
                    Aujourd'hui
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={102} />
                  <Button variant="outline" size="sm">
                    Cette semaine
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={103} />
                  <Button variant="outline" size="sm">
                    Ce mois
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={104} />
                  <Button variant="outline" size="sm">
                    Toutes
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions administrateur */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Actions administrateur</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={105} />
                  <Button variant="outline" className="border-thai-orange text-thai-orange">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un Extra
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={106} />
                  <Button variant="outline" className="border-thai-green text-thai-green">
                    Modifier la commande
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={107} />
                  <Button variant="ghost" className="text-gray-600">
                    Voir les détails
                  </Button>
                </div>
              </div>
            </div>

            {/* Badges de statut commandes */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Badges statut commandes</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-yellow-500">En attente</Badge>
                <Badge className="bg-blue-500">En préparation</Badge>
                <Badge className="bg-green-500">Prête</Badge>
                <Badge className="bg-purple-500">Livrée</Badge>
                <Badge variant="destructive">Annulée</Badge>
              </div>
            </div>

            {/* Boutons modaux admin */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Actions dans modals admin</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={108} />
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={109} />
                  <Button variant="outline">Annuler</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NumberBadge number={110} />
                  <Button className="bg-thai-orange">Valider la modification</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="border-thai-orange/20 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-thai-green text-sm">
              Ce catalogue recense tous les types de boutons utilisés dans l'application
              ChanthanaThaiCook.
            </p>
            <p className="text-thai-green/70 mt-2 text-xs">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
