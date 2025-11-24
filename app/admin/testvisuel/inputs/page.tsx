"use client"

import { useState } from "react"
import { Spice } from "@/components/shared/Spice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

const NumberBadge = ({ number }: { number: number }) => (
  <span className="bg-thai-orange mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-md">
    {number}
  </span>
)

export default function InputsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [sliderValue, setSliderValue] = useState([3])
  const [spiceDistribution1, setSpiceDistribution1] = useState([1, 1, 1, 2])
  const [spiceDistribution2, setSpiceDistribution2] = useState([0, 2, 2, 1])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">📋 Inputs & Formulaires</h1>
        <p className="mb-3 text-gray-600">
          Tous les éléments de formulaire disponibles (input, textarea, select, checkbox, radio,
          switch, slider, OTP, calendar)
        </p>
        <Badge className="bg-thai-orange">9+ Variantes</Badge>
      </div>

      {/* Inputs de Base */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Inputs de Base</CardTitle>
          <CardDescription>Input text, email, password, number</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* #1 - Input Email */}
          <div className="space-y-3">
            <NumberBadge number={1} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label htmlFor="email">Input - Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">type="email" placeholder="..."</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Formulaires inscription, contact</p>
            </div>
          </div>

          {/* #2 - Input Password */}
          <div className="space-y-3">
            <NumberBadge number={2} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label htmlFor="password">Input - Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">type="password"</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Authentification</p>
            </div>
          </div>

          {/* #3 - Input Number */}
          <div className="space-y-3">
            <NumberBadge number={3} />
            <div className="border-thai-green/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label htmlFor="quantity">Input - Nombre</Label>
              <Input id="quantity" type="number" placeholder="1" min="1" max="10" />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">type="number" min="1" max="10"</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Quantité, âge, prix</p>
            </div>
          </div>

          {/* #4 - Input Disabled */}
          <div className="space-y-3">
            <NumberBadge number={4} />
            <div className="flex flex-col gap-3 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
              <Label htmlFor="disabled">Input - Désactivé</Label>
              <Input id="disabled" type="text" placeholder="Non modifiable" disabled />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">disabled</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Champs lecture seule</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Textarea */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Textarea</CardTitle>
          <CardDescription>Zone de texte multi-lignes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <NumberBadge number={5} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label htmlFor="message">Textarea - Message</Label>
              <Textarea id="message" placeholder="Votre message..." rows={5} />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">rows={"{5}"}</code>
              </p>
              <p className="text-xs text-gray-500">
                Usage : Commentaires, descriptions, messages longs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Select */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Select (Dropdown)</CardTitle>
          <CardDescription>Liste déroulante de sélection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <NumberBadge number={6} />
            <div className="border-thai-green/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Select - Catégorie de plat</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrees">🥗 Entrées</SelectItem>
                  <SelectItem value="plats">🍜 Plats</SelectItem>
                  <SelectItem value="desserts">🍰 Desserts</SelectItem>
                  <SelectItem value="boissons">🥤 Boissons</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">
                  SelectTrigger + SelectContent + SelectItem
                </code>
              </p>
              <p className="text-xs text-gray-500">Usage : Sélection parmi plusieurs options</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkbox */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Checkbox</CardTitle>
          <CardDescription>Cases à cocher (sélection multiple)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <NumberBadge number={7} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Checkbox - Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accepter les conditions générales
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" defaultChecked />
                  <label htmlFor="newsletter" className="text-sm leading-none font-medium">
                    Recevoir la newsletter
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" />
                  <label htmlFor="notifications" className="text-sm leading-none font-medium">
                    Activer les notifications
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">
                  defaultChecked pour coché par défaut
                </code>
              </p>
              <p className="text-xs text-gray-500">Usage : Options multiples, consentements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radio Group */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Radio Group</CardTitle>
          <CardDescription>Boutons radio (sélection unique)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <NumberBadge number={8} />
            <div className="border-thai-green/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Radio Group - Niveau de piment</Label>
              <RadioGroup defaultValue="medium">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doux" id="doux" />
                  <Label htmlFor="doux" className="cursor-pointer font-normal">
                    🌶️ Doux - Pas de piment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer font-normal">
                    🌶️🌶️ Moyen - Un peu relevé
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fort" id="fort" />
                  <Label htmlFor="fort" className="cursor-pointer font-normal">
                    🌶️🌶️🌶️ Fort - Très épicé
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extra" id="extra" />
                  <Label htmlFor="extra" className="cursor-pointer font-normal">
                    🌶️🌶️🌶️🌶️ Extra Fort - Pour experts !
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">defaultValue="medium"</code>
              </p>
              <p className="text-xs text-gray-500">
                Usage : Choix exclusif parmi plusieurs options
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Switch */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Switch (Toggle)</CardTitle>
          <CardDescription>Interrupteur on/off</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <NumberBadge number={9} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-switch">Switch - Notifications</Label>
                  <p className="text-sm text-gray-500">Recevoir des notifications push</p>
                </div>
                <Switch id="notifications-switch" />
              </div>
              <p className="mt-2 text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">Switch component</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Paramètres on/off, préférences</p>
            </div>
          </div>

          <div className="space-y-3">
            <NumberBadge number={10} />
            <div className="border-thai-green/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Switch - Mode sombre</Label>
                  <p className="text-sm text-gray-500">Activé par défaut</p>
                </div>
                <Switch id="dark-mode" defaultChecked />
              </div>
              <p className="mt-2 text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">defaultChecked</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Thème, paramètres visuels</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slider */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Slider</CardTitle>
          <CardDescription>Curseur de valeur numérique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <NumberBadge number={11} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Slider - Niveau d'épice (1-5)</Label>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Doux</span>
                <span className="text-thai-orange font-bold">Niveau: {sliderValue[0]}</span>
                <span>Très épicé</span>
              </div>
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">
                  min={"{1}"} max={"{5}"} step={"{1}"}
                </code>
              </p>
              <p className="text-xs text-gray-500">Usage : Note, intensité, volume</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input OTP */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Input OTP</CardTitle>
          <CardDescription>Code de vérification à 6 chiffres</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <NumberBadge number={12} />
            <div className="border-thai-green/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Input OTP - Code de vérification</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-center text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">maxLength={"{6}"}</code>
              </p>
              <p className="text-xs text-gray-500">
                Usage : Authentification 2FA, vérification email/SMS
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">Calendar</CardTitle>
          <CardDescription>Sélecteur de date interactif</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <NumberBadge number={13} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Calendar - Sélection de date</Label>
              <div className="bg-thai-cream/10 flex justify-center rounded-lg border p-4">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
              </div>
              <p className="text-center text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">
                  mode="single" selected={"{date}"} onSelect={"{setDate}"}
                </code>
              </p>
              <p className="text-xs text-gray-500">
                Usage : Réservation, date de livraison, événements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spice Distribution Selector */}
      <Card className="border-thai-orange/20">
        <CardHeader>
          <CardTitle className="text-thai-green">
            Spice - Sélecteur de Distribution Épicée
          </CardTitle>
          <CardDescription>
            Composant unifié pour gérer les niveaux d'épice (interactif ou lecture seule)
            <br />
            <code className="rounded bg-gray-100 px-1 text-xs">components/shared/Spice.tsx</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* #14 - Interactif AVEC fond */}
          <div className="space-y-3">
            <NumberBadge number={14} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Spice - Interactif AVEC fond</Label>
              <Spice
                distribution={spiceDistribution1}
                onDistributionChange={setSpiceDistribution1}
                readOnly={false}
                showBackground={true}
              />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">
                  readOnly={"{false}"} showBackground={"{true}"}
                </code>
              </p>
              <p className="text-xs text-gray-500">
                Usage : Modal de commande, sélection interactive avec fond dégradé
              </p>
            </div>
          </div>

          {/* #15 - Interactif SANS fond */}
          <div className="space-y-3">
            <NumberBadge number={15} />
            <div className="border-thai-green/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Spice - Interactif SANS fond</Label>
              <Spice
                distribution={spiceDistribution2}
                onDistributionChange={setSpiceDistribution2}
                readOnly={false}
                showBackground={false}
              />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">
                  readOnly={"{false}"} showBackground={"{false}"}
                </code>
              </p>
              <p className="text-xs text-gray-500">Usage : Panier éditable, design épuré</p>
            </div>
          </div>

          {/* #16 - Lecture seule AVEC fond */}
          <div className="space-y-3">
            <NumberBadge number={16} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Spice - Lecture seule AVEC fond</Label>
              <Spice distribution={[1, 1, 1, 2]} readOnly={true} showBackground={true} />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">
                  readOnly={"{true}"} showBackground={"{true}"}
                </code>
              </p>
              <p className="text-xs text-gray-500">
                Usage : Affichage décoratif, résumé de commande
              </p>
            </div>
          </div>

          {/* #17, #18, #19 - Lecture seule (côte à côte) */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* #17 - Lecture seule SANS fond */}
            <div className="space-y-3">
              <NumberBadge number={17} />
              <div className="border-thai-green/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
                <Label>Spice - Lecture seule SANS fond</Label>
                <Spice distribution={[0, 1, 1, 2]} readOnly={true} showBackground={false} />
                <p className="text-xs text-gray-600">
                  <code className="rounded bg-gray-100 px-1">
                    readOnly={"{true}"} showBackground={"{false}"}
                  </code>
                </p>
                <p className="text-xs text-gray-500">
                  Usage : Liste de commandes, affichage simple
                </p>
              </div>
            </div>

            {/* #18 - Lecture seule SANS fond + hideZeros */}
            <div className="space-y-3">
              <NumberBadge number={18} />
              <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
                <Label>Spice - Lecture seule SANS fond + hideZeros</Label>
                <Spice
                  distribution={[0, 1, 1, 2]}
                  readOnly={true}
                  showBackground={false}
                  hideZeros={true}
                />
                <p className="text-xs text-gray-600">
                  <code className="rounded bg-gray-100 px-1">
                    readOnly={"{true}"} showBackground={"{false}"} hideZeros={"{true}"}
                  </code>
                </p>
                <p className="text-xs text-gray-500">
                  Usage : Affichage compact, n&apos;affiche que les niveaux &gt; 0 (3 cercles au
                  lieu de 4)
                </p>
              </div>
            </div>

            {/* #19 - Depuis texte (lecture seule) */}
            <div className="space-y-3">
              <NumberBadge number={19} />
              <div className="border-thai-green/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
                <Label>Spice - Depuis texte (parsing automatique)</Label>
                <Spice
                  distribution="1 non épicé, 1 un peu épicé, 1 épicé, 2 très épicé"
                  readOnly={true}
                  showBackground={false}
                />
                <p className="text-xs text-gray-600">
                  <code className="rounded bg-gray-100 px-1">
                    distribution="1 non épicé, 1 un peu épicé..."
                  </code>
                </p>
                <p className="text-xs text-gray-500">
                  Usage : Affichage depuis base de données (texte stocké)
                </p>
              </div>
            </div>
          </div>

          {/* #20 - Interactif AVEC fond + hideZeros */}
          <div className="space-y-3">
            <NumberBadge number={20} />
            <div className="border-thai-orange/20 flex flex-col gap-3 rounded-lg border-2 bg-white p-4">
              <Label>Spice - Interactif AVEC fond + hideZeros</Label>
              <Spice
                distribution={[0, 2, 2, 1]}
                onDistributionChange={(dist) => console.log("Nouvelle distribution:", dist)}
                readOnly={false}
                showBackground={true}
                hideZeros={true}
              />
              <p className="text-xs text-gray-600">
                <code className="rounded bg-gray-100 px-1">
                  readOnly={"{false}"} showBackground={"{true}"} hideZeros={"{true}"}
                </code>
              </p>
              <p className="text-xs text-gray-500">
                Usage : Sélection interactive compacte (n'affiche que 3 cercles)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide d'Utilisation */}
      <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 bg-gradient-to-r">
        <CardHeader>
          <CardTitle className="text-thai-green">💡 Guide d'Utilisation Rapide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-thai-orange font-semibold">Input #1-4</span> → Champs texte
              (email, password, number, disabled)
            </p>
            <p>
              <span className="text-thai-green font-semibold">Textarea #5</span> → Messages longs,
              descriptions
            </p>
            <p>
              <span className="text-thai-orange font-semibold">Select #6</span> → Sélection unique
              dans liste
            </p>
            <p>
              <span className="text-thai-green font-semibold">Checkbox #7</span> → Sélection
              multiple, consentements
            </p>
            <p>
              <span className="text-thai-orange font-semibold">Radio #8</span> → Choix exclusif
              (niveau piment)
            </p>
            <p>
              <span className="text-thai-green font-semibold">Switch #9-10</span> → On/Off
              (notifications, thème)
            </p>
            <p>
              <span className="text-thai-orange font-semibold">Slider #11</span> → Valeur numérique
              (1-5)
            </p>
            <p>
              <span className="text-thai-green font-semibold">OTP #12</span> → Code 2FA,
              vérification
            </p>
            <p>
              <span className="text-thai-orange font-semibold">Calendar #13</span> → Sélection date
            </p>
            <p className="mt-4 border-t pt-4">
              <span className="font-semibold">Exemple :</span> "Utilise l'
              <span className="text-thai-green">Input #1</span> avec le{" "}
              <span className="text-thai-orange">Bouton #7</span> (icône gauche)"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
