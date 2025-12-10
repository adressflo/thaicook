import { Button } from "@/components/ui/button"
import { ArrowLeft, Cookie, Eye, Lock, Mail, Shield, User } from "lucide-react"
import Link from "next/link"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Chanthana Thai Cook",
  description:
    "Politique de confidentialité et protection des données personnelles - Chanthana Thai Cook",
}

export default function ConfidentialitePage() {
  return (
    <div className="from-thai-green/5 min-h-screen bg-linear-to-b to-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <div className="mb-4 flex items-center gap-3">
            <Shield className="text-thai-green h-10 w-10" />
            <h1 className="text-thai-green text-4xl font-bold">Politique de Confidentialité</h1>
          </div>
          <p className="text-gray-600">
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
            Informatique et Libertés.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <Eye className="text-thai-orange mt-1 h-6 w-6" />
              <div>
                <h2 className="text-thai-green mb-2 text-2xl font-bold">Introduction</h2>
              </div>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                La protection de vos données personnelles est une priorité pour Chanthana Thai Cook.
                Cette politique de confidentialité vous informe sur la manière dont nous collectons,
                utilisons et protégeons vos données.
              </p>
              <p>
                <strong>Responsable du traitement :</strong>
                <br />
                MME CHAMPA Chanthana
                <br />
                CHANTHANA THAI COOK
                <br />
                2 impasse de la poste, 37120 Marigny-Marmande
                <br />
                Email :{" "}
                <a
                  href="mailto:chanthanacook@gmail.com"
                  className="text-thai-orange hover:underline"
                >
                  chanthanacook@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <User className="text-thai-orange mt-1 h-6 w-6" />
              <div>
                <h2 className="text-thai-green mb-2 text-2xl font-bold">
                  Données personnelles collectées
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="mb-2 text-lg font-bold">Lors de la création de compte</h3>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse de livraison</li>
                  <li>Photo de profil (optionnelle)</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold">Lors d'une commande</h3>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Détails de la commande (plats, quantités, extras)</li>
                  <li>Montant de la transaction</li>
                  <li>Date et heure de commande</li>
                  <li>Mode de récupération (sur place, livraison)</li>
                  <li>Instructions spéciales</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold">Lors d'une demande d'événement</h3>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Type d'événement</li>
                  <li>Nombre de convives</li>
                  <li>Date souhaitée</li>
                  <li>Budget estimé</li>
                  <li>Besoins spécifiques</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <Lock className="text-thai-orange mt-1 h-6 w-6" />
              <div>
                <h2 className="text-thai-green mb-2 text-2xl font-bold">
                  Utilisation de vos données
                </h2>
              </div>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>Vos données sont utilisées uniquement pour :</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Gestion de vos commandes</strong> : traitement, préparation, notification
                  de disponibilité
                </li>
                <li>
                  <strong>Communication</strong> : vous informer du statut de vos commandes et
                  événements
                </li>
                <li>
                  <strong>Amélioration du service</strong> : comprendre vos préférences et proposer
                  une expérience personnalisée
                </li>
                <li>
                  <strong>Gestion de compte</strong> : authentification, accès à l'historique,
                  préférences
                </li>
                <li>
                  <strong>Notifications push</strong> : vous alerter quand votre commande est prête
                  (si activées)
                </li>
                <li>
                  <strong>Conformité légale</strong> : respect des obligations comptables et
                  fiscales
                </li>
              </ul>
            </div>
          </section>

          {/* Base légale */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Base légale du traitement</h2>
            <div className="space-y-3 text-gray-700">
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Exécution d'un contrat</strong> : traitement de vos commandes
                </li>
                <li>
                  <strong>Consentement</strong> : notifications push, newsletter (si vous y
                  consentez)
                </li>
                <li>
                  <strong>Obligation légale</strong> : conservation des factures et données
                  comptables
                </li>
                <li>
                  <strong>Intérêt légitime</strong> : amélioration du service, prévention de la
                  fraude
                </li>
              </ul>
            </div>
          </section>

          {/* Durée de conservation */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Durée de conservation</h2>
            <div className="space-y-3 text-gray-700">
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Données de compte</strong> : jusqu'à suppression de votre compte + 1 an
                  pour conformité
                </li>
                <li>
                  <strong>Historique de commandes</strong> : 10 ans (obligation comptable)
                </li>
                <li>
                  <strong>Cookies techniques</strong> : durée de la session ou 13 mois maximum
                </li>
                <li>
                  <strong>Logs de connexion</strong> : 12 mois maximum
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <Cookie className="text-thai-orange mt-1 h-6 w-6" />
              <div>
                <h2 className="text-thai-green mb-2 text-2xl font-bold">
                  Cookies et technologies similaires
                </h2>
              </div>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>Nous utilisons les cookies suivants :</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Cookies d'authentification</strong> : maintenir votre session active
                  (obligatoires)
                </li>
                <li>
                  <strong>Cookies de préférences</strong> : mémoriser vos choix (langue, thème)
                </li>
                <li>
                  <strong>Cookies de panier</strong> : conserver vos articles en attente
                </li>
                <li>
                  <strong>Service Worker</strong> : permettre le mode hors ligne et les
                  notifications push
                </li>
              </ul>
              <p className="mt-4">
                Vous pouvez gérer vos préférences de cookies depuis les paramètres de votre
                navigateur.
              </p>
            </div>
          </section>

          {/* Partage des données */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Partage de vos données</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Vos données ne sont <strong>jamais vendues</strong> à des tiers. Elles peuvent être
                partagées uniquement avec :
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Supabase</strong> : hébergement sécurisé de la base de données (serveurs
                  conformes RGPD)
                </li>
                <li>
                  <strong>Firebase Cloud Messaging</strong> : envoi de notifications push (si
                  activées)
                </li>
                <li>
                  <strong>Services de paiement</strong> : traitement sécurisé des paiements (si
                  paiement en ligne activé)
                </li>
              </ul>
              <p className="mt-4">
                Tous nos sous-traitants sont conformes au RGPD et situés dans l'Union Européenne ou
                disposent de garanties appropriées.
              </p>
            </div>
          </section>

          {/* Vos droits */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <Mail className="text-thai-orange mt-1 h-6 w-6" />
              <div>
                <h2 className="text-thai-green mb-2 text-2xl font-bold">Vos droits RGPD</h2>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Vous disposez des droits suivants :</p>

              <div>
                <h3 className="font-bold">✓ Droit d'accès</h3>
                <p className="text-sm">Obtenir une copie de vos données personnelles</p>
              </div>

              <div>
                <h3 className="font-bold">✓ Droit de rectification</h3>
                <p className="text-sm">Corriger vos données inexactes ou incomplètes</p>
              </div>

              <div>
                <h3 className="font-bold">✓ Droit à l'effacement</h3>
                <p className="text-sm">
                  Supprimer votre compte et vos données (sauf obligations légales)
                </p>
              </div>

              <div>
                <h3 className="font-bold">✓ Droit à la portabilité</h3>
                <p className="text-sm">Recevoir vos données dans un format structuré</p>
              </div>

              <div>
                <h3 className="font-bold">✓ Droit d'opposition</h3>
                <p className="text-sm">
                  Vous opposer au traitement de vos données (marketing, etc.)
                </p>
              </div>

              <div>
                <h3 className="font-bold">✓ Droit de limitation</h3>
                <p className="text-sm">Demander la suspension du traitement de vos données</p>
              </div>

              <div className="bg-thai-green/5 border-thai-green/20 mt-6 rounded-lg border p-4">
                <p className="mb-2 font-bold">Comment exercer vos droits ?</p>
                <p className="mb-2 text-sm">
                  Envoyez-nous un email à{" "}
                  <a
                    href="mailto:chanthanacook@gmail.com"
                    className="text-thai-orange font-medium hover:underline"
                  >
                    chanthanacook@gmail.com
                  </a>{" "}
                  avec :
                </p>
                <ul className="ml-4 list-inside list-disc space-y-1 text-sm">
                  <li>Votre demande précise</li>
                  <li>Une copie de votre pièce d'identité (pour vérification)</li>
                </ul>
                <p className="mt-3 text-sm">
                  Nous répondrons sous <strong>1 mois</strong> maximum.
                </p>
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Sécurité de vos données</h2>
            <div className="space-y-3 text-gray-700">
              <p>Nous mettons en œuvre les mesures de sécurité suivantes :</p>
              <ul className="ml-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Chiffrement SSL/TLS</strong> : toutes les communications sont chiffrées
                </li>
                <li>
                  <strong>Authentification sécurisée</strong> : mots de passe hashés (bcrypt),
                  tokens JWT
                </li>
                <li>
                  <strong>Hébergement sécurisé</strong> : Supabase avec sauvegardes automatiques
                </li>
                <li>
                  <strong>Accès restreint</strong> : seules les personnes autorisées ont accès aux
                  données
                </li>
                <li>
                  <strong>Monitoring</strong> : surveillance des accès suspects
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-thai-green/10 border-thai-green/30 rounded-lg border p-6">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Questions ou réclamation ?</h2>
            <div className="space-y-3 text-gray-700">
              <p>Pour toute question concernant vos données personnelles, contactez-nous :</p>
              <div className="space-y-2">
                <p>
                  <strong>Email :</strong>{" "}
                  <a
                    href="mailto:chanthanacook@gmail.com"
                    className="text-thai-orange font-medium hover:underline"
                  >
                    chanthanacook@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Téléphone :</strong>{" "}
                  <a href="tel:+33749283707" className="text-thai-orange hover:underline">
                    +33 7 49 28 37 07
                  </a>
                </p>
                <p>
                  <strong>Courrier :</strong>
                  <br />
                  Chanthana Thai Cook
                  <br />2 impasse de la poste
                  <br />
                  37120 Marigny-Marmande
                </p>
              </div>
              <div className="border-thai-orange/30 mt-4 rounded border bg-white p-3">
                <p className="text-sm">
                  <strong>Droit de réclamation :</strong> Si vous estimez que vos droits ne sont pas
                  respectés, vous pouvez déposer une réclamation auprès de la CNIL (
                  <a
                    href="https://www.cnil.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-thai-orange hover:underline"
                  >
                    www.cnil.fr
                  </a>
                  ).
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
          <p className="mt-2">
            <Link href="/mentions-legales" className="text-thai-orange hover:underline">
              Consulter les Mentions Légales
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
