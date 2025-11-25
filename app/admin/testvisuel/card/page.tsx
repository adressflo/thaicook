"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Info,
} from "lucide-react"

import { PolaroidPhoto } from "@/components/shared/PolaroidPhoto"
import { ProductCard } from "@/components/shared/ProductCard"
import { StatCard } from "@/components/shared/StatCard"
import { CartItemCard } from "@/components/shared/CartItemCard"
import { SmartSpice } from "@/components/shared/SmartSpice"
import { useData } from "@/contexts/DataContext"
import { useState } from "react"

export default function CardsTestPage() {
  const { plats, isLoading } = useData()
  const [spiceDistribution, setSpiceDistribution] = useState<number[]>([0, 2, 2, 1])
  const [quantity, setQuantity] = useState(5)

  const NumberBadge = ({ number }: { number: number }) => (
    <span className="bg-thai-orange mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
      {number}
    </span>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">🃏 Test des Cards</h1>
        <p className="text-gray-600">Composants Card pour l'affichage de contenu structuré</p>
        <div className="mt-4 flex gap-2">
          <Badge variant="outline" className="border-thai-orange text-thai-orange">
            Cards & Containers
          </Badge>
          <Badge className="bg-thai-green">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Fonctionnel
          </Badge>
        </div>
      </div>

      {/* Section 1: Cards Simples */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">1. Cards de Base</CardTitle>
          <CardDescription>
            Structures simples pour afficher du texte ou des informations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Simple Card */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Card>
                <CardHeader>
                  <CardTitle>Titre de la carte</CardTitle>
                  <CardDescription>Description courte de la carte</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Contenu principal de la carte. Peut contenir du texte, des images ou d'autres
                    composants.
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">Pied de page de la carte</p>
                </CardFooter>
              </Card>
            </div>

            {/* Bordered Card */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Card className="border-thai-green/50 bg-thai-cream/10">
                <CardHeader>
                  <CardTitle className="text-thai-green">Carte Stylisée</CardTitle>
                  <CardDescription>Avec bordure verte et fond crème léger</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Utilisée pour mettre en avant du contenu spécifique ou thématique.</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="border-thai-green text-thai-green hover:bg-thai-green/10 w-full"
                  >
                    Action
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Gradient Card */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Card className="from-thai-orange to-thai-gold border-none bg-gradient-to-br text-white">
                <CardHeader>
                  <CardTitle className="text-white">Carte Gradient</CardTitle>
                  <CardDescription className="text-white/80">
                    Pour les appels à l'action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Ce style attire l'attention de l'utilisateur sur une offre ou une information
                    importante.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    En savoir plus
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Section 2: Cards Produit (Composant ProductCard) */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">2. Cards Produit (ProductCard)</CardTitle>
            <CardDescription className="mt-1.5">
              Composant <code>&lt;ProductCard /&gt;</code> (Données réelles via useData)
              <br />
              <code className="text-xs text-gray-500">components\shared\ProductCard.tsx</code>
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                Props
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Propriétés de ProductCard</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>title</strong> (string): Titre du produit
                  </li>
                  <li>
                    <strong>description</strong> (string): Description courte
                  </li>
                  <li>
                    <strong>price</strong> (number): Prix unitaire
                  </li>
                  <li>
                    <strong>imageSrc</strong> (string): URL de l'image
                  </li>
                  <li>
                    <strong>isVegetarian</strong> (boolean): Affiche le badge végétarien
                  </li>
                  <li>
                    <strong>isSpicy</strong> (boolean): Affiche le badge épicé
                  </li>
                  <li>
                    <strong>quantityInCart</strong> (number): Affiche le badge "Panier X" si {">"} 0
                  </li>
                  <li>
                    <strong>onAdd</strong> (function): Callback au clic sur "Ajouter"
                  </li>
                  <li>
                    <strong>className</strong> (string): Classes CSS additionnelles
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Product Card - Exemple Dynamique (Données réelles) */}
            {isLoading ? (
              <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed p-8 text-gray-400">
                Chargement des données réelles...
              </div>
            ) : plats && plats.length > 0 ? (
              (() => {
                // Essayer de trouver les nems, sinon prendre le premier plat
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("nems")) || plats[0]
                return (
                  <div className="flex flex-col gap-1">
                    <NumberBadge number={4} />
                    <ProductCard
                      title={platExemple.plat}
                      description={platExemple.description || "Aucune description disponible."}
                      price={parseFloat(platExemple.prix?.toString() || "0")}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      quantityInCart={0}
                      imageSrc={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      onAdd={() => console.log(`Ajout de ${platExemple.plat}`)}
                    />
                    <p className="mt-2 text-xs text-gray-500 italic">
                      * Données réelles récupérées depuis la base de données via useData()
                    </p>
                  </div>
                )
              })()
            ) : (
              <div className="text-red-500">Aucun plat trouvé dans la base de données.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2.5: Cards Panier (Composant CartItemCard) */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">2.5. Cards Panier (CartItemCard)</CardTitle>
            <CardDescription className="mt-1.5">
              Composant <code>&lt;CartItemCard /&gt;</code> (Design validé page Panier)
              <br />
              <code className="text-xs text-gray-500">components\shared\CartItemCard.tsx</code>
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                Props
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Propriétés de CartItemCard</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>name</strong> (string): Nom de l'article
                  </li>
                  <li>
                    <strong>imageUrl</strong> (string): URL de l'image
                  </li>
                  <li>
                    <strong>unitPrice</strong> (number): Prix unitaire
                  </li>
                  <li>
                    <strong>quantity</strong> (number): Quantité actuelle
                  </li>
                  <li>
                    <strong>isVegetarian</strong> (boolean): Badge végétarien
                  </li>
                  <li>
                    <strong>isSpicy</strong> (boolean): Badge épicé
                  </li>
                  <li>
                    <strong>showSpiceSelector</strong> (boolean): Affiche l'emplacement des épices
                  </li>
                  <li></li>
                  <li>
                    <strong>spiceSelectorSlot</strong> (ReactNode): Composant à injecter (ex:
                    SmartSpice)
                  </li>
                  <li>
                    <strong>readOnly</strong> (boolean): Mode lecture seule (pas de boutons +/-)
                  </li>
                  <li>
                    <strong>imageClassName</strong> (string): Classes CSS pour l'image (ex:
                    aspect-square)
                  </li>
                  <li>
                    <strong>imageAspectRatio</strong> ("square" | "video" | "auto" |
                    "square-contain" | "video-contain"): Format de l'image (défaut: "square")
                  </li>
                  <li>
                    <strong>imageObjectPosition</strong> ("center" | "top" | "bottom" | "left" |
                    "right"): Cadrage de l'image (défaut: "center")
                  </li>
                  <li>
                    <strong>onQuantityChange</strong> (function): Callback changement quantité
                  </li>
                  <li>
                    <strong>onRemove</strong> (function): Callback suppression
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Cart Item 1 - Avec données réelles */}
            {isLoading ? (
              <div className="flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed p-8 text-gray-400">
                Chargement...
              </div>
            ) : plats && plats.length > 0 ? (
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("nems")) || plats[0]
                return (
                  <div className="flex flex-col gap-1">
                    <NumberBadge number={5} />
                    <CartItemCard
                      name={platExemple.plat}
                      imageUrl={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      unitPrice={parseFloat(platExemple.prix?.toString() || "0")}
                      quantity={quantity}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      onQuantityChange={setQuantity}
                      onRemove={() => console.log("Suppression")}
                      onClick={() => console.log("Clic sur l'item")}
                      showSpiceSelector={(platExemple.niveau_epice ?? 0) > 0}
                      spiceSelectorSlot={
                        <SmartSpice
                          quantity={quantity}
                          distribution={spiceDistribution}
                          onDistributionChange={setSpiceDistribution}
                        />
                      }
                    />
                    <p className="mt-2 text-xs text-gray-500 italic">
                      * Données réelles avec quantité simulée à {quantity}
                    </p>
                  </div>
                )
              })()
            ) : (
              <div className="text-red-500">Aucun plat trouvé.</div>
            )}

            {/* Cart Item 2 - Lecture Seule (Récapitulatif) */}
            {plats &&
              plats.length > 0 &&
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("ailes")) || plats[1] || plats[0]
                return (
                  <div className="flex flex-col gap-1 border-t border-dashed border-gray-200 pt-8">
                    <div className="mb-2 flex items-center gap-2">
                      <NumberBadge number={6} />
                      <span className="text-sm font-medium text-gray-500">
                        Mode Lecture Seule (Récapitulatif commande)
                      </span>
                    </div>
                    <CartItemCard
                      name={platExemple.plat}
                      imageUrl={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      unitPrice={parseFloat(platExemple.prix?.toString() || "0")}
                      quantity={2}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      onQuantityChange={() => {}}
                      onRemove={() => {}}
                      readOnly={true}
                      showSpiceSelector={(platExemple.niveau_epice ?? 0) > 0}
                      spiceSelectorSlot={
                        <SmartSpice
                          quantity={2}
                          distribution={[0, 0, 1, 1]} // Exemple fixe
                          onDistributionChange={() => {}}
                        />
                      }
                    />
                    <p className="mt-2 text-xs text-gray-500 italic">
                      * <code>readOnly={`{true}`}</code> : Cache les boutons +/-, la poubelle et
                      affiche "Quantité: 2"
                    </p>
                  </div>
                )
              })()}

            {/* Cart Item 3 - Aspect Ratio Square */}
            {plats &&
              plats.length > 0 &&
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("brochette")) ||
                  plats[2] ||
                  plats[0]
                return (
                  <div className="flex flex-col gap-1 border-t border-dashed border-gray-200 pt-8">
                    <div className="mb-2 flex items-center gap-2">
                      <NumberBadge number={6.1} />
                      <span className="text-sm font-medium text-gray-500">
                        Format Carré (imageAspectRatio="square")
                      </span>
                    </div>
                    <CartItemCard
                      name={platExemple.plat}
                      imageUrl={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      unitPrice={parseFloat(platExemple.prix?.toString() || "0")}
                      quantity={1}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      onQuantityChange={() => {}}
                      onRemove={() => {}}
                      imageAspectRatio="square"
                    />
                  </div>
                )
              })()}

            {/* Cart Item 4 - Aspect Ratio Auto */}
            {plats &&
              plats.length > 0 &&
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("riz")) || plats[3] || plats[0]
                return (
                  <div className="flex flex-col gap-1 border-t border-dashed border-gray-200 pt-8">
                    <div className="mb-2 flex items-center gap-2">
                      <NumberBadge number={6.2} />
                      <span className="text-sm font-medium text-gray-500">
                        Format Auto (imageAspectRatio="auto")
                      </span>
                    </div>
                    <CartItemCard
                      name={platExemple.plat}
                      imageUrl={platExemple.photo_du_plat || "/media/avatars/panier1.svg"}
                      unitPrice={parseFloat(platExemple.prix?.toString() || "0")}
                      quantity={1}
                      isVegetarian={!!platExemple.est_vegetarien}
                      isSpicy={(platExemple.niveau_epice ?? 0) > 0}
                      onQuantityChange={() => {}}
                      onRemove={() => {}}
                      imageAspectRatio="auto"
                    />
                  </div>
                )
              })()}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Cards Dashboard (StatCard) */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">3. Cards Dashboard (StatCard)</CardTitle>
          <CardDescription>
            Composant <code>&lt;StatCard /&gt;</code> standardisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stat Card 1 */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={7} />
              <StatCard
                title="Revenu Total"
                value="45,231.89 €"
                icon={DollarSign}
                trend="+20.1%"
                trendUp={true}
                description="par rapport au mois dernier"
              />
            </div>

            {/* Stat Card 2 */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={8} />
              <StatCard
                title="Commandes"
                value="+2350"
                icon={ShoppingCart}
                description="+180 depuis la dernière heure"
              />
            </div>

            {/* Stat Card 3 */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={9} />
              <StatCard
                title="Clients Actifs"
                value="+12,234"
                icon={Users}
                trend="+19%"
                trendUp={true}
                description="de nouveaux clients"
              />
            </div>

            {/* Stat Card 4 */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={10} />
              <StatCard
                title="Taux de Conversion"
                value="5.4%"
                icon={TrendingUp}
                trend="+2.1%"
                trendUp={true}
                description="cette semaine"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Composants Spéciaux */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">4. Composants Spéciaux</CardTitle>
            <CardDescription className="mt-1.5">
              Composants visuels uniques comme l'effet Polaroid
              <br />
              <code className="text-xs text-gray-500">components\shared\PolaroidCard.tsx</code>
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                Props
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Propriétés de PolaroidCard</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>title</strong> (string): Titre de la carte
                  </li>
                  <li>
                    <strong>description</strong> (string): Description de la carte
                  </li>
                  <li>
                    <strong>photoSrc</strong> (string): URL de la photo (Requis)
                  </li>
                  <li>
                    <strong>photoAlt</strong> (string): Texte alternatif de la photo (Requis)
                  </li>
                  <li>
                    <strong>photoCaption</strong> (string): Légende manuscrite sous la photo
                  </li>
                  <li>
                    <strong>photoRotation</strong> (number): Rotation en degrés (défaut: -6)
                  </li>
                  <li>
                    <strong>photoSize</strong> (number): Taille de la photo en px (défaut: 140)
                  </li>
                  <li>
                    <strong>className</strong> (string): Classes CSS additionnelles
                  </li>
                  <li>
                    <strong>children</strong> (ReactNode): Contenu libre dans la carte
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Polaroid Example - Version Simplifiée */}
            {plats &&
              plats.length > 0 &&
              (() => {
                const platExemple =
                  plats.find((p) => p.plat.toLowerCase().includes("nems")) || plats[0]
                return (
                  <div className="flex flex-col gap-1">
                    <NumberBadge number={11} />
                    <div className="relative flex h-[320px] w-full items-center justify-center rounded-lg border border-dashed bg-gray-50 p-4">
                      <p className="absolute top-4 left-4 text-sm font-medium text-gray-500">
                        Composant PolaroidPhoto seul
                      </p>
                      <PolaroidPhoto
                        src="/media/avatars/panier1.svg"
                        alt="Avatar Panier"
                        caption="Photo Seule"
                        position="center"
                        size={140}
                        rotation={-3}
                        className="bottom-12"
                      />
                    </div>
                  </div>
                )
              })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
