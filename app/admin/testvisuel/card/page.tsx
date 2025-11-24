"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
} from "lucide-react"
import { PolaroidCard } from "@/components/shared/PolaroidCard"
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
        <CardHeader>
          <CardTitle className="text-thai-green">2. Cards Produit (ProductCard)</CardTitle>
          <CardDescription>
            Composant <code>&lt;ProductCard /&gt;</code> (Données réelles via useData)
          </CardDescription>
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
                      imageSrc={platExemple.photo_du_plat || undefined}
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
        <CardHeader>
          <CardTitle className="text-thai-green">2.5. Cards Panier (CartItemCard)</CardTitle>
          <CardDescription>
            Composant <code>&lt;CartItemCard /&gt;</code> (Design validé page Panier)
          </CardDescription>
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
                      imageUrl={platExemple.photo_du_plat || undefined}
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
                      imageUrl={platExemple.photo_du_plat || undefined}
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
          </div>
        </CardContent>
      </Card>
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
        <CardHeader>
          <CardTitle className="text-thai-green">4. Composants Spéciaux</CardTitle>
          <CardDescription>Composants visuels uniques comme l'effet Polaroid</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Polaroid Example - Version Simplifiée */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={11} />
              <PolaroidCard
                title="Effet Polaroid"
                description="Image avec rotation et ombre"
                photoSrc="/media/avatars/panier1.svg"
                photoAlt="Exemple Polaroid"
                photoCaption="Test Visuel"
                photoRotation={-6}
              >
                <p className="mb-4 text-sm text-gray-600">
                  Cette carte utilise maintenant le composant <code>PolaroidCard</code>. Plus besoin
                  de gérer le CSS manuellement !
                </p>
              </PolaroidCard>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
