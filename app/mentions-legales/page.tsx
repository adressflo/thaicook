import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions Légales | Chanthana Thai Cook",
  description:
    "Mentions légales du restaurant Chanthana Thai Cook - Informations légales sur l'entreprise",
}

export default function MentionsLegalesPage() {
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
          <h1 className="text-thai-green mb-4 text-4xl font-bold">Mentions Légales</h1>
          <p className="text-gray-600">
            Informations légales conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004
            pour la confiance dans l'économie numérique.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Éditeur du site */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Éditeur du site</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Nom commercial :</strong> CHANTHANA THAI COOK
              </p>
              <p>
                <strong>Forme juridique :</strong> Entreprise individuelle
              </p>
              <p>
                <strong>Exploitant :</strong> MME CHAMPA Chanthana (Nom d'usage : FOUQUET)
              </p>
              <p>
                <strong>SIRET :</strong> 510 941 164 00020
              </p>
              <p>
                <strong>Code APE :</strong> 5610C - Fabrication de plats cuisinés à emporter
              </p>
              <p>
                <strong>N° d'identification :</strong> 510 941 164
              </p>
              <p>
                <strong>Immatriculation :</strong> Répertoire des Métiers le 28/12/2021
              </p>
              <p>
                <strong>Début d'activité :</strong> 01/01/2022
              </p>
            </div>
          </section>

          {/* Siège social */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Siège social</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Adresse :</strong>
                <br />2 impasse de la poste
                <br />
                37120 Marigny-Marmande
                <br />
                France
              </p>
              <p>
                <strong>Téléphone :</strong>{" "}
                <a href="tel:+33749283707" className="text-thai-orange hover:underline">
                  +33 7 49 28 37 07
                </a>
              </p>
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:chanthanacook@gmail.com"
                  className="text-thai-orange hover:underline"
                >
                  chanthanacook@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Responsable de la publication */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">
              Responsable de la publication
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Directrice de la publication :</strong> MME CHAMPA Chanthana
              </p>
              <p>
                <strong>Contact :</strong>{" "}
                <a
                  href="mailto:chanthanacook@gmail.com"
                  className="text-thai-orange hover:underline"
                >
                  chanthanacook@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Hébergement</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Hébergeur du site :</strong> Supabase Inc.
              </p>
              <p>
                <strong>Adresse :</strong>
                <br />
                970 Toa Payoh North #07-04
                <br />
                Singapore 318992
              </p>
              <p>
                <strong>Site web :</strong>{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-thai-orange hover:underline"
                >
                  https://supabase.com
                </a>
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Propriété intellectuelle</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le
                droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont
                réservés, y compris pour les documents téléchargeables et les représentations
                iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il
                soit est formellement interdite sauf autorisation expresse du directeur de la
                publication.
              </p>
            </div>
          </section>

          {/* Protection des données */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">
              Protection des données personnelles
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de
                suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante :{" "}
                <a
                  href="mailto:chanthanacook@gmail.com"
                  className="text-thai-orange hover:underline"
                >
                  chanthanacook@gmail.com
                </a>
              </p>
              <p>
                Pour plus d'informations, consultez notre{" "}
                <Link
                  href="/confidentialite"
                  className="text-thai-orange font-medium hover:underline"
                >
                  Politique de Confidentialité
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Crédits */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-thai-green mb-4 text-2xl font-bold">Crédits</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Conception et développement :</strong> APPCHANTHANA
              </p>
              <p>
                <strong>Photographies :</strong> © Chanthana Thai Cook - Tous droits réservés
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
        </div>
      </div>
    </div>
  )
}
