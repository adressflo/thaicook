"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, PanInfo } from "framer-motion"
import { ArrowLeft, Award, Calendar, Heart, ShoppingBag, Star, Users, Utensils } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AProposPage() {
  const router = useRouter()

  // Navigation par swipe (mobile uniquement)
  // Swipe Gauche (<--) -> Accueil | Swipe Droite (-->) -> Commander
  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 80
    if (info.offset.x < -swipeThreshold) {
      // Swipe Gauche
      router.push("/")
    } else if (info.offset.x > swipeThreshold) {
      // Swipe Droite
      router.push("/commander")
    }
  }
  const features = [
    {
      title: "Cuisine Authentique",
      description:
        "Des recettes traditionnelles thaïlandaises préparées avec amour et des ingrédients frais importés directement de Thaïlande",
      icon: Heart,
      color: "from-thai-orange to-thai-gold",
    },
    {
      title: "Commande Facile",
      description:
        "Commandez vos plats préférés en quelques clics pour une récupération rapide et une expérience sans stress",
      icon: Utensils,
      color: "from-thai-green to-thai-orange",
    },
    {
      title: "Événements Spéciaux",
      description:
        "Organisez vos événements avec nos menus personnalisés pour groupes et célébrations mémorables",
      icon: Calendar,
      color: "from-thai-gold to-thai-green",
    },
    {
      title: "Excellence Reconnue",
      description:
        "Plus de 20 ans d'expérience culinaire avec une passion authentique pour la gastronomie thaïlandaise",
      icon: Award,
      color: "from-thai-orange to-thai-red",
    },
  ]
  return (
    <AppLayout>
      <motion.div
        className="bg-gradient-thai min-h-screen px-0 py-4 sm:px-4 sm:py-8"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={onDragEnd}
      >
        <div className="mx-auto w-full max-w-4xl px-0 sm:px-4">
          {/* Bouton retour - masqué sur mobile, style /nous-trouver */}
          <div className="mb-6 hidden justify-start sm:flex">
            <Link href="/" passHref>
              <Button
                variant="outline"
                size="sm"
                className="border-thai-green/50 text-thai-green hover:bg-thai-green/10 hover:text-thai-green hover:border-thai-green group inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-base font-bold shadow-sm transition-all hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Retour Accueil
              </Button>
            </Link>
          </div>
          {/* Header optimisé avec animations */}
          <div className="animate-fade-in mb-12 text-center">
            <div className="relative mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.ico"
                alt="Chanthana Thai Cook Logo"
                className="mx-auto h-40 w-40 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-110 md:h-48 md:w-48"
              />
            </div>
            <h1 className="text-thai-green mb-4 text-4xl font-bold md:text-5xl">
              ChanthanaThaiCook
            </h1>
            <div className="mb-4 flex items-center justify-center">
              <Star className="text-thai-gold mr-2 h-5 w-5" />
              <p className="text-thai-green/80 text-xl">L'art culinaire thaïlandais authentique</p>
              <Star className="text-thai-gold ml-2 h-5 w-5" />
            </div>
            <p className="text-thai-green/70 mx-auto mb-8 max-w-2xl text-lg">
              Des saveurs traditionnelles préparées avec passion pour éveiller vos sens et vous
              transporter au cœur de la Thaïlande.
            </p>
            {/* CTA Commander */}
            <Link href="/commander">
              <Button className="bg-thai-orange hover:bg-thai-orange/90 rounded-full px-8 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Commander
              </Button>
            </Link>
          </div>

          {/* Pourquoi Choisir ChanthanaThaiCook */}
          <Card className="border-thai-orange/20 animate-fade-in mb-8 shadow-xl">
            <div className="from-thai-green/5 to-thai-orange/5 bg-linear-to-r">
              <CardContent className="p-6 md:p-8">
                <div className="mb-8 text-center">
                  <h2 className="text-thai-green mb-4 text-2xl font-bold md:text-3xl">
                    🌟 Pourquoi Choisir ChanthanaThaiCook ?
                  </h2>
                  <p className="text-thai-green/70 mx-auto max-w-3xl text-lg md:text-xl">
                    Une expérience culinaire exceptionnelle qui vous transporte directement au cœur
                    de la Thaïlande authentique
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {features.map((feature, index) => {
                    // Définir les liens pour les cartes interactives
                    const getCardLink = (title: string) => {
                      if (title === "Commande Facile") return "/commander"
                      if (title === "Événements Spéciaux") return "/evenements"
                      return null
                    }

                    const cardLink = getCardLink(feature.title)
                    const isClickable = cardLink !== null

                    const cardContent = (
                      <div
                        className={`group to-thai-cream/30 border-thai-orange/20 hover:border-thai-orange/40 animate-fade-in rounded-xl border bg-linear-to-br from-white p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${isClickable ? "cursor-pointer hover:shadow-xl" : ""} `}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div
                          className={`mx-auto mb-4 h-16 w-16 rounded-full bg-linear-to-br ${feature.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                        >
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-thai-green group-hover:text-thai-orange mb-3 text-lg font-semibold transition-colors duration-200">
                          {feature.title}
                          {isClickable && <span className="text-thai-orange ml-2">→</span>}
                        </h3>
                        <p className="text-thai-green/70 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                        {isClickable && (
                          <div className="text-thai-orange/80 mt-3 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Cliquez pour découvrir
                          </div>
                        )}
                      </div>
                    )

                    return (
                      <div key={index}>
                        {isClickable ? <Link href={cardLink}>{cardContent}</Link> : cardContent}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Chanthana Thai Cook Section optimisée */}
          <Card className="border-thai-orange/20 animate-fade-in mb-8 overflow-hidden shadow-xl">
            <div className="from-thai-orange/10 to-thai-gold/10 bg-linear-to-r p-1">
              <CardContent className="rounded-lg bg-white p-6 md:p-8">
                <div className="grid items-center gap-8 md:grid-cols-2">
                  <div className="order-2 md:order-1">
                    <div className="mb-6 flex items-center">
                      <Users className="text-thai-orange mr-3 h-8 w-8" />
                      <h2 className="text-thai-green text-2xl font-bold md:text-3xl">
                        CHANTHANA THAI COOK
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-thai-green/80 text-base leading-relaxed md:text-lg">
                        J'ai quitté la{" "}
                        <span className="text-thai-orange font-semibold">Thaïlande</span> pour
                        m'installer en
                        <span className="text-thai-green font-semibold"> France</span> par amour
                        depuis <span className="font-bold">2002</span>.
                      </p>
                      <p className="text-thai-green/80 text-base leading-relaxed md:text-lg">
                        Par amour pour ma famille, pour mon pays natal et surtout par
                        <span className="text-thai-orange font-semibold">
                          {" "}
                          passion pour la cuisine thaïlandaise
                        </span>
                        , mon souhait est de vous faire découvrir la culture et la diversité des
                        saveurs de la Thaïlande.
                      </p>
                      <div className="bg-thai-cream/50 border-thai-orange rounded-lg border-l-4 p-4">
                        <p className="text-thai-green/80 text-base italic">
                          Mon art originaire d'
                          <span className="text-thai-orange font-semibold">Isan</span>, la région
                          authentique Thaï qui garde ses secrets.
                          <span className="font-semibold">
                            Découvrez la véritable cuisine thaïlandaise.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 flex justify-center md:order-2">
                    <div className="group relative">
                      {/* Glow Pulse - respiration du halo */}
                      <div className="from-thai-orange to-thai-gold absolute -inset-4 animate-[glowPulse_3s_ease-in-out_infinite] rounded-full bg-linear-to-r blur-sm" />
                      {/* Image avec effet hover */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/chanthana.svg"
                        alt="Chanthana en cuisine"
                        className="relative h-64 w-64 rounded-full border-4 border-white object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105 md:h-80 md:w-80"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Cuisine Thaï Section optimisée */}
          <Card className="border-thai-orange/20 animate-fade-in shadow-xl">
            <div className="from-thai-green/5 to-thai-orange/5 bg-linear-to-br">
              <CardContent className="p-6 md:p-8">
                <div className="mb-8 text-center">
                  <div className="mb-4 flex items-center justify-center">
                    <Utensils className="text-thai-orange mr-3 h-8 w-8" />
                    <h2 className="text-thai-green text-2xl font-bold md:text-3xl">
                      CUISINE THAÏ AUTHENTIQUE
                    </h2>
                    <Utensils className="text-thai-orange ml-3 h-8 w-8" />
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-thai-green mb-3 text-xl font-semibold">
                      🌶️ L'équilibre parfait des saveurs
                    </h3>
                    <p className="text-thai-green/80 text-base leading-relaxed">
                      La cuisine thaïlandaise est réputée dans le monde entier pour la maîtrise de
                      <span className="text-thai-orange font-semibold">
                        {" "}
                        l'équilibre des saveurs
                      </span>
                      . L'art du mariage du{" "}
                      <span className="text-thai-gold font-medium">sucré</span>, de l'
                      <span className="text-thai-green font-medium">aigre-doux</span>, du{" "}
                      <span className="text-thai-orange font-medium">salé</span> et du{" "}
                      <span className="text-thai-red font-medium">piquant</span> donne des plats
                      d'une saveur étonnante.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-thai-green mb-3 text-xl font-semibold">
                      🍜 Ingrédients authentiques
                    </h3>
                    <p className="text-thai-green/80 text-base leading-relaxed">
                      Savourez des repas thaïlandais typiquement authentiques mixant une diversité
                      d'ingrédients : riz parfumé, poisson frais, poulet tendre, salades croquantes,
                      légumes de saison, et parfois porc ou bœuf de qualité.
                    </p>
                  </div>
                </div>

                <div className="from-thai-cream/50 to-thai-gold/10 border-thai-orange/20 mt-8 rounded-xl border bg-linear-to-r p-6">
                  <h3 className="text-thai-green mb-3 text-center text-lg font-semibold">
                    🍽️ Une expérience culinaire renouvelée
                  </h3>
                  <p className="text-thai-green/80 text-center text-base leading-relaxed">
                    Je propose des{" "}
                    <span className="text-thai-orange font-semibold">
                      menus complets à emporter
                    </span>{" "}
                    et autres délices qui{" "}
                    <span className="font-semibold">se renouvellent chaque semaine</span>. Partez à
                    la découverte de ces plats authentiques et laissez-vous surprendre en les
                    commandant.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  )
}
