"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, Trash2, Settings, User, Mail, CreditCard, Eye, Info } from "lucide-react"
import { CommandePlatModal, CommandePlatContent } from "@/components/shared/CommandePlatModal"
import { useData } from "@/contexts/DataContext"

export default function ModalsTestPage() {
  const { plats, isLoading } = useData()
  const [open, setOpen] = useState(false)

  const NumberBadge = ({ number }: { number: number }) => (
    <span className="bg-thai-orange mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
      {number}
    </span>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">🪟 Test des Modales</h1>
        <p className="text-gray-600">
          Composants Dialog et Alert Dialog pour les interactions utilisateur
        </p>
        <div className="mt-4 flex gap-2">
          <Badge variant="outline" className="border-thai-orange text-thai-orange">
            Dialog & Alert
          </Badge>
          <Badge className="bg-thai-green">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Fonctionnel
          </Badge>
        </div>
      </div>

      {/* Section 1: Dialogues Simples */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">1. Dialogues d'Information</CardTitle>
          <CardDescription>
            Modales simples pour afficher du contenu ou des formulaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Dialog */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={1} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Modifier le profil</DialogTitle>
                    <DialogDescription>
                      Faites des changements à votre profil ici. Cliquez sur sauvegarder une fois
                      terminé.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom
                      </Label>
                      <Input id="name" defaultValue="Chanthana" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="username"
                        defaultValue="contact@chanthana.fr"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-thai-green hover:bg-thai-green/90">
                      Sauvegarder
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Terms Dialog */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={2} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Conditions Générales
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Conditions Générales de Vente</DialogTitle>
                    <DialogDescription>Dernière mise à jour : 23 Novembre 2025</DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[300px] overflow-y-auto text-sm text-gray-600">
                    <p className="mb-4">
                      <strong>1. Objet</strong>
                      <br />
                      Les présentes conditions régissent les ventes par la société Chanthana Thai
                      Cook.
                    </p>
                    <p className="mb-4">
                      <strong>2. Prix</strong>
                      <br />
                      Les prix de nos produits sont indiqués en euros toutes taxes comprises (TVA et
                      autres taxes applicables au jour de la commande), sauf indication contraire et
                      hors frais de traitement et d'expédition.
                    </p>
                    <p className="mb-4">
                      <strong>3. Commandes</strong>
                      <br />
                      Vous pouvez passer commande sur Internet : www.chanthanathaicook.fr. Les
                      informations contractuelles sont présentées en langue française et feront
                      l'objet d'une confirmation au plus tard au moment de la validation de votre
                      commande.
                    </p>
                    <p>
                      <strong>4. Validation</strong>
                      <br />
                      Vous déclarez avoir pris connaissance et accepté les présentes Conditions
                      générales de vente avant la passation de votre commande. La validation de
                      votre commande vaut donc acceptation de ces Conditions générales de vente.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button className="bg-thai-orange hover:bg-thai-orange/90">J'accepte</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Payment Dialog */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={3} />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Paiement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Détails du paiement</DialogTitle>
                    <DialogDescription>
                      Entrez vos informations de carte bancaire pour finaliser la commande.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="card">Numéro de carte</Label>
                      <Input id="card" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiration</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                      Payer 24.90€
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Alert Dialogs (Confirmations) */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">2. Confirmations (Alert Dialog)</CardTitle>
          <CardDescription>
            Modales bloquantes pour les actions critiques nécessitant une confirmation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Delete Confirmation */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={4} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer le compte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela supprimera définitivement votre
                      compte et effacera vos données de nos serveurs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Oui, supprimer mon compte
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Logout Confirmation */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={5} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange/10 w-full"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Se déconnecter ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous devrez vous reconnecter pour accéder à votre panier et vos commandes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Rester connecté</AlertDialogCancel>
                    <AlertDialogAction className="bg-thai-orange hover:bg-thai-orange/90">
                      Se déconnecter
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Order Confirmation */}
            <div className="flex flex-col gap-1">
              <NumberBadge number={6} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Valider la commande
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la commande</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous allez valider votre commande de 3 articles pour un total de 45.90€.
                      Voulez-vous continuer ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Modifier</AlertDialogCancel>
                    <AlertDialogAction className="bg-thai-green hover:bg-thai-green/90">
                      Confirmer et payer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Modales Métier */}
      <Card className="border-thai-orange/20">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-thai-green">3. Modales Métier</CardTitle>
            <CardDescription className="mt-1.5">
              Composants modaux spécifiques à l'application (ex: Détails Plat)
              <br />
              <code className="text-xs text-gray-500">components\shared\CommandePlatModal.tsx</code>
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
                <DialogTitle>Propriétés de CommandePlatModal</DialogTitle>
                <DialogDescription>Documentation des propriétés du composant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>
                    <strong>plat</strong> (Plat): Objet plat complet (Requis)
                  </li>
                  <li>
                    <strong>isOpen</strong> (boolean): État d'ouverture du modal
                  </li>
                  <li>
                    <strong>onOpenChange</strong> (function): Callback changement d'état
                  </li>
                  <li>
                    <strong>formatPrix</strong> (function): Fonction de formatage du prix
                  </li>
                  <li>
                    <strong>onAddToCart</strong> (function): Callback ajout au panier
                  </li>
                  <li>
                    <strong>currentQuantity</strong> (number): Quantité initiale (défaut: 0)
                  </li>
                  <li>
                    <strong>currentSpiceDistribution</strong> (number[]): Répartition épices
                  </li>
                  <li>
                    <strong>dateRetrait</strong> (Date): Date de retrait affichée
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {/* CommandePlatModal Example - Button Trigger */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <NumberBadge number={7} />
                <span className="text-sm font-medium text-gray-600">Test Interactif</span>
              </div>
              {isLoading ? (
                <div className="p-4 text-sm text-gray-500">Chargement des données...</div>
              ) : plats && plats.length > 0 ? (
                (() => {
                  const platExemple =
                    plats.find((p) => p.plat.toLowerCase().includes("ailes de poulet")) ||
                    plats.find((p) => p.plat.toLowerCase().includes("pad thaï")) ||
                    plats[0]

                  const [isModalOpen, setIsModalOpen] = useState(false)

                  return (
                    <div className="rounded-lg border border-dashed p-4">
                      <Button
                        className="bg-thai-orange hover:bg-thai-orange/90 w-full"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Ouvrir le modal "{platExemple.plat}"
                      </Button>

                      <CommandePlatModal
                        isOpen={isModalOpen}
                        onOpenChange={setIsModalOpen}
                        plat={platExemple}
                        formatPrix={(p) => `${p.toFixed(2)}€`}
                        currentQuantity={2}
                        currentSpiceDistribution={[0, 1, 1, 0]}
                        dateRetrait={new Date()}
                        onAddToCart={(p, q, s, d) =>
                          console.log("Ajout au panier (Réel):", { p, q, s, d })
                        }
                      />
                      <p className="mt-2 text-center text-xs text-gray-500">
                        Cliquez pour voir le comportement réel du modal
                      </p>
                    </div>
                  )
                })()
              ) : (
                <div className="p-4 text-sm text-red-500">Aucune donnée disponible</div>
              )}
            </div>

            {/* CommandePlatModal Example - Inline Preview */}
            <div className="flex flex-col gap-2">
              <div className="flex h-6 items-center gap-2">
                <span className="pl-2 text-sm font-medium text-gray-600">Aperçu Visuel</span>
              </div>
              {isLoading ? (
                <div className="p-4 text-sm text-gray-500">Chargement...</div>
              ) : plats && plats.length > 0 ? (
                (() => {
                  const platExemple =
                    plats.find((p) => p.plat.toLowerCase().includes("nems")) || plats[0]

                  return (
                    <div className="relative mx-auto flex h-[500px] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                      <div className="absolute top-2 right-2 z-10 rounded bg-black/50 px-2 py-1 text-xs text-white">
                        Mode Aperçu
                      </div>
                      <CommandePlatContent
                        onOpenChange={() => console.log("Close requested")}
                        plat={platExemple}
                        formatPrix={(p) => `${p.toFixed(2)}€`}
                        currentQuantity={1}
                        currentSpiceDistribution={[1, 0, 0, 0]}
                        dateRetrait={new Date()}
                        standalone={true}
                        onAddToCart={(p, q, s, d) =>
                          console.log("Ajout au panier (Preview):", { p, q, s, d })
                        }
                      />
                    </div>
                  )
                })()
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
