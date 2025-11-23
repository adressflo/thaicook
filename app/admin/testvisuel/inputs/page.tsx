"use client"

import { useState } from "react"
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-thai-green mb-2 text-3xl font-bold">📋 Inputs & Formulaires</h1>
        <p className="text-gray-600 mb-3">
          Tous les éléments de formulaire disponibles (input, textarea, select, checkbox, radio, switch, slider, OTP, calendar)
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-orange/20 bg-white p-4">
              <Label htmlFor="email">Input - Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" />
              <p className="text-xs text-gray-600">
                <code className="bg-gray-100 rounded px-1">type="email" placeholder="..."</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Formulaires inscription, contact</p>
            </div>
          </div>

          {/* #2 - Input Password */}
          <div className="space-y-3">
            <NumberBadge number={2} />
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-orange/20 bg-white p-4">
              <Label htmlFor="password">Input - Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" />
              <p className="text-xs text-gray-600">
                <code className="bg-gray-100 rounded px-1">type="password"</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Authentification</p>
            </div>
          </div>

          {/* #3 - Input Number */}
          <div className="space-y-3">
            <NumberBadge number={3} />
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-green/20 bg-white p-4">
              <Label htmlFor="quantity">Input - Nombre</Label>
              <Input id="quantity" type="number" placeholder="1" min="1" max="10" />
              <p className="text-xs text-gray-600">
                <code className="bg-gray-100 rounded px-1">type="number" min="1" max="10"</code>
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
                <code className="bg-gray-100 rounded px-1">disabled</code>
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-orange/20 bg-white p-4">
              <Label htmlFor="message">Textarea - Message</Label>
              <Textarea id="message" placeholder="Votre message..." rows={5} />
              <p className="text-xs text-gray-600">
                <code className="bg-gray-100 rounded px-1">rows={"{5}"}</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Commentaires, descriptions, messages longs</p>
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-green/20 bg-white p-4">
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
                <code className="bg-gray-100 rounded px-1">SelectTrigger + SelectContent + SelectItem</code>
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-orange/20 bg-white p-4">
              <Label>Checkbox - Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accepter les conditions générales
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" defaultChecked />
                  <label htmlFor="newsletter" className="text-sm font-medium leading-none">
                    Recevoir la newsletter
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" />
                  <label htmlFor="notifications" className="text-sm font-medium leading-none">
                    Activer les notifications
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                <code className="bg-gray-100 rounded px-1">defaultChecked pour coché par défaut</code>
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-green/20 bg-white p-4">
              <Label>Radio Group - Niveau de piment</Label>
              <RadioGroup defaultValue="medium">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doux" id="doux" />
                  <Label htmlFor="doux" className="font-normal cursor-pointer">
                    🌶️ Doux - Pas de piment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="font-normal cursor-pointer">
                    🌶️🌶️ Moyen - Un peu relevé
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fort" id="fort" />
                  <Label htmlFor="fort" className="font-normal cursor-pointer">
                    🌶️🌶️🌶️ Fort - Très épicé
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extra" id="extra" />
                  <Label htmlFor="extra" className="font-normal cursor-pointer">
                    🌶️🌶️🌶️🌶️ Extra Fort - Pour experts !
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-gray-600">
                <code className="bg-gray-100 rounded px-1">defaultValue="medium"</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Choix exclusif parmi plusieurs options</p>
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-orange/20 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-switch">Switch - Notifications</Label>
                  <p className="text-sm text-gray-500">Recevoir des notifications push</p>
                </div>
                <Switch id="notifications-switch" />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                <code className="bg-gray-100 rounded px-1">Switch component</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Paramètres on/off, préférences</p>
            </div>
          </div>

          <div className="space-y-3">
            <NumberBadge number={10} />
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-green/20 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Switch - Mode sombre</Label>
                  <p className="text-sm text-gray-500">Activé par défaut</p>
                </div>
                <Switch id="dark-mode" defaultChecked />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                <code className="bg-gray-100 rounded px-1">defaultChecked</code>
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-orange/20 bg-white p-4">
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
                <code className="bg-gray-100 rounded px-1">min={"{1}"} max={"{5}"} step={"{1}"}</code>
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-green/20 bg-white p-4">
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
              <p className="text-xs text-gray-600 text-center">
                <code className="bg-gray-100 rounded px-1">maxLength={"{6}"}</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Authentification 2FA, vérification email/SMS</p>
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
            <div className="flex flex-col gap-3 rounded-lg border-2 border-thai-orange/20 bg-white p-4">
              <Label>Calendar - Sélection de date</Label>
              <div className="flex justify-center rounded-lg border p-4 bg-thai-cream/10">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
              </div>
              <p className="text-xs text-gray-600 text-center">
                <code className="bg-gray-100 rounded px-1">mode="single" selected={"{date}"} onSelect={"{setDate}"}</code>
              </p>
              <p className="text-xs text-gray-500">Usage : Réservation, date de livraison, événements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide d'Utilisation */}
      <Card className="border-thai-green/20 bg-gradient-to-r from-thai-cream/30 to-thai-gold/10">
        <CardHeader>
          <CardTitle className="text-thai-green">💡 Guide d'Utilisation Rapide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p>
              <span className="text-thai-orange font-semibold">Input #1-4</span> → Champs texte (email, password, number, disabled)
            </p>
            <p>
              <span className="text-thai-green font-semibold">Textarea #5</span> → Messages longs, descriptions
            </p>
            <p>
              <span className="text-thai-orange font-semibold">Select #6</span> → Sélection unique dans liste
            </p>
            <p>
              <span className="text-thai-green font-semibold">Checkbox #7</span> → Sélection multiple, consentements
            </p>
            <p>
              <span className="text-thai-orange font-semibold">Radio #8</span> → Choix exclusif (niveau piment)
            </p>
            <p>
              <span className="text-thai-green font-semibold">Switch #9-10</span> → On/Off (notifications, thème)
            </p>
            <p>
              <span className="text-thai-orange font-semibold">Slider #11</span> → Valeur numérique (1-5)
            </p>
            <p>
              <span className="text-thai-green font-semibold">OTP #12</span> → Code 2FA, vérification
            </p>
            <p>
              <span className="text-thai-orange font-semibold">Calendar #13</span> → Sélection date
            </p>
            <p className="mt-4 pt-4 border-t">
              <span className="font-semibold">Exemple :</span> "Utilise l'<span className="text-thai-green">Input #1</span> avec le <span className="text-thai-orange">Bouton #7</span> (icône gauche)"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
