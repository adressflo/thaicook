'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, History, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionPourquoiCompteProps {
  isAuthenticated: boolean
  className?: string
}

export function SectionPourquoiCompte({ isAuthenticated, className }: SectionPourquoiCompteProps) {
  // Ne rien afficher si l'utilisateur est connecté
  if (isAuthenticated) {
    return null
  }

  const benefits = [
    {
      icon: Bell,
      title: 'Suivi en Temps Réel',
      description:
        'Recevez une notification dès que votre commande est prête pour la récupération. Plus besoin de deviner !',
      color: 'text-thai-orange',
    },
    {
      icon: History,
      title: 'Historique de Commandes',
      description:
        'Retrouvez facilement vos plats préférés et recommandez en un clic. Gagnez du temps à chaque visite.',
      color: 'text-thai-green',
    },
    {
      icon: Calendar,
      title: 'Gestion d\'Événements',
      description:
        'Suivez vos demandes de devis pour événements et gérez vos réservations directement depuis votre compte.',
      color: 'text-thai-gold',
    },
  ]

  return (
    <section className={cn('py-16 px-4 bg-thai-cream', className)}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-thai-green mb-4">
            Pourquoi Créer un Compte ?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Profitez d'une expérience personnalisée et simplifiée pour vos commandes
          </p>
        </div>

        {/* Cartes bénéfices */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className="border-thai-orange/20 hover:border-thai-orange transition-all duration-300 hover:shadow-lg"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <benefit.icon className={cn('h-8 w-8', benefit.color)} />
                  <CardTitle className="text-xl text-thai-green">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-thai-orange hover:bg-thai-orange/90 text-white shadow-lg min-w-[200px]"
            asChild
          >
            <Link href="/auth/signup">Créer mon Compte</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-thai-orange text-thai-orange hover:bg-thai-orange/10 min-w-[200px]"
            asChild
          >
            <Link href="/auth/login">Se Connecter</Link>
          </Button>
        </div>

        {/* Note rassurante */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Pas de programme de fidélité, pas de spam. Juste un service pratique pour vos commandes.
        </p>
      </div>
    </section>
  )
}
