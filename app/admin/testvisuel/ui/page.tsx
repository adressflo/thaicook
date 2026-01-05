"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { toastVideo, toastVideoCenter } from "@/hooks/use-toast-video"
import {
  AlertCircle,
  Bell,
  Calendar as CalendarIcon,
  ChevronsUpDown,
  Heart,
  Info,
  LogOut,
  Menu,
  MoreVertical,
  Settings,
  ShoppingCart,
  Terminal,
  Trash2,
  User,
} from "lucide-react"
import { useState } from "react"

export default function TestVisuelPage() {
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [progress, setProgress] = useState(33)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [sliderValue, setSliderValue] = useState([3])
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)

  const NumberBadge = ({ number }: { number: number }) => (
    <span className="bg-thai-orange mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
      {number}
    </span>
  )

  return (
    <div className="from-thai-cream/30 min-h-screen bg-linear-to-br to-white p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-thai-green mb-2 text-4xl font-bold">
            🎨 Page de Test Visuel Complète
          </h1>
          <p className="text-gray-600">
            Testez TOUS vos composants UI et design tokens en un seul endroit
          </p>
          <Badge variant="outline" className="border-thai-orange text-thai-orange mt-2">
            56+ Composants Testés
          </Badge>
        </div>

        {/* Section 1: Typography */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">📝 Typographie & Hiérarchie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <NumberBadge number={1} />
                <h1 className="text-thai-green text-4xl font-bold">Heading 1 - Thai Green</h1>
              </div>
              <div className="space-y-2">
                <NumberBadge number={2} />
                <h2 className="text-thai-orange text-3xl font-semibold">Heading 2 - Thai Orange</h2>
              </div>
              <div className="space-y-2">
                <NumberBadge number={3} />
                <h3 className="text-2xl font-semibold">Heading 3 - Default</h3>
              </div>
              <div className="space-y-2">
                <NumberBadge number={4} />
                <h4 className="text-xl font-medium">Heading 4 - Medium</h4>
              </div>
              <div className="space-y-2">
                <NumberBadge number={5} />
                <h5 className="text-lg font-medium">Heading 5 - Medium</h5>
              </div>
              <div className="space-y-2">
                <NumberBadge number={6} />
                <h6 className="text-base font-medium">Heading 6 - Medium</h6>
              </div>
              <Separator />
              <div className="space-y-2">
                <NumberBadge number={7} />
                <p className="text-base">
                  Body text - Texte de paragraphe standard avec taille normale
                </p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={8} />
                <p className="text-sm text-gray-600">Caption text - Texte secondaire plus petit</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={9} />
                <p className="text-gradient from-thai-orange to-thai-gold bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent">
                  Gradient Text - Orange to Gold
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Palette de Couleurs Complète */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">🎨 Palette de Couleurs Complète</CardTitle>
            <CardDescription>13 couleurs Thai avec variations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <NumberBadge number={1} />
                <div className="bg-thai-orange h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Orange</p>
                <p className="text-center text-xs text-gray-500">#FF6B35</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={2} />
                <div className="bg-thai-orange-light h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Orange Light</p>
                <p className="text-center text-xs text-gray-500">#FFB386</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={3} />
                <div className="bg-thai-orange-dark h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Orange Dark</p>
                <p className="text-center text-xs text-gray-500">#E85A31</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={4} />
                <div className="bg-thai-green h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Green</p>
                <p className="text-center text-xs text-gray-500">#2D5016</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={5} />
                <div className="bg-thai-green-light h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Green Light</p>
                <p className="text-center text-xs text-gray-500">#4A7C23</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={6} />
                <div className="bg-thai-green-dark h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Green Dark</p>
                <p className="text-center text-xs text-gray-500">#1A300C</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={7} />
                <div className="bg-thai-gold h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Gold</p>
                <p className="text-center text-xs text-gray-500">#FFD700</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={8} />
                <div className="bg-thai-gold-light h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Gold Light</p>
                <p className="text-center text-xs text-gray-500">#FFED4E</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={9} />
                <div className="bg-thai-gold-dark h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Gold Dark</p>
                <p className="text-center text-xs text-gray-500">#B8860B</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={10} />
                <div className="bg-thai-cream h-20 rounded-lg border shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Cream</p>
                <p className="text-center text-xs text-gray-500">#FFF8DC</p>
              </div>
              <div className="space-y-2">
                <NumberBadge number={11} />
                <div className="bg-thai-red h-20 rounded-lg shadow-md"></div>
                <p className="text-center text-sm font-medium">Thai Red</p>
                <p className="text-center text-xs text-gray-500">#DC2626</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Éléments de Formulaire */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">📋 Éléments de Formulaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input & Textarea */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <NumberBadge number={1} />
                <Label htmlFor="email">Input - Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
              <div className="space-y-2">
                <NumberBadge number={2} />
                <Label htmlFor="message">Textarea - Message</Label>
                <Textarea id="message" placeholder="Votre message..." rows={3} />
              </div>
            </div>

            {/* Select */}
            <div className="space-y-2">
              <NumberBadge number={3} />
              <Label>Select - Catégorie</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrees">Entrées</SelectItem>
                  <SelectItem value="plats">Plats</SelectItem>
                  <SelectItem value="desserts">Desserts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkbox */}
            <div className="space-y-2">
              <NumberBadge number={4} />
              <Label>Checkbox - Options</Label>
              <div className="space-y-2">
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
                  <Checkbox id="newsletter" />
                  <label htmlFor="newsletter" className="text-sm leading-none font-medium">
                    Recevoir la newsletter
                  </label>
                </div>
              </div>
            </div>

            {/* Radio Group */}
            <div className="space-y-2">
              <NumberBadge number={5} />
              <Label>Radio Group - Niveau de piment</Label>
              <RadioGroup defaultValue="medium">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doux" id="doux" />
                  <Label htmlFor="doux" className="font-normal">
                    🌶️ Doux
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="font-normal">
                    🌶️🌶️ Moyen
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fort" id="fort" />
                  <Label htmlFor="fort" className="font-normal">
                    🌶️🌶️🌶️ Fort
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <NumberBadge number={6} />
                <Label htmlFor="notifications">Switch - Notifications</Label>
                <p className="text-sm text-gray-500">Recevoir des notifications push</p>
              </div>
              <Switch id="notifications" />
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <NumberBadge number={7} />
              <Label>Slider - Niveau d'épice (1-5)</Label>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-center text-sm text-gray-500">Niveau: {sliderValue[0]}</p>
            </div>

            {/* Input OTP */}
            <div className="space-y-2">
              <NumberBadge number={8} />
              <Label>Input OTP - Code de vérification</Label>
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

            {/* Calendar */}
            <div className="space-y-2">
              <NumberBadge number={9} />
              <Label>Calendar - Sélection de date</Label>
              <div className="flex justify-center rounded-lg border p-4">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Boutons */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">🔘 Boutons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <NumberBadge number={1} />
                <Button className="bg-thai-orange hover:bg-thai-orange/90 w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Bouton Orange
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={2} />
                <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Bouton Vert
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={3} />
                <Button variant="outline" className="border-thai-orange text-thai-orange w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Bouton Outline
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={4} />
                <Button variant="ghost" className="w-full">
                  Bouton Ghost
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={5} />
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Bouton Danger
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={6} />
                <Button disabled className="w-full">
                  Bouton Désactivé
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Feedback Components */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">💬 Composants de Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alerts */}
            <div className="space-y-4">
              <div className="space-y-2">
                <NumberBadge number={1} />
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Alert - Info</AlertTitle>
                  <AlertDescription>Ceci est une alerte informative standard</AlertDescription>
                </Alert>
              </div>

              <div className="space-y-2">
                <NumberBadge number={2} />
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Alert - Erreur</AlertTitle>
                  <AlertDescription>Ceci est une alerte d'erreur destructive</AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-2">
              <NumberBadge number={3} />
              <Label>Badges</Label>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-thai-orange">Thai Orange</Badge>
                <Badge className="bg-thai-green">Thai Green</Badge>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <NumberBadge number={4} />
              <Label>Progress Bar ({progress}%)</Label>
              <Progress value={progress} className="w-full" />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                  -10%
                </Button>
                <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                  +10%
                </Button>
              </div>
            </div>

            {/* Skeleton */}
            <div className="space-y-2">
              <NumberBadge number={5} />
              <Label>Skeleton Loaders</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-[125px] w-full rounded-xl" />
              </div>
            </div>

            {/* Alert Dialog */}
            <div className="space-y-2">
              <NumberBadge number={6} />
              <Label>Alert Dialog - Confirmation Destructive</Label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Supprimer le compte</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Cela supprimera définitivement votre compte et
                      toutes vos données.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction className="bg-thai-red hover:bg-thai-red/90">
                      Continuer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Layout Components */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">📐 Composants de Layout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Separator */}
            <div className="space-y-2">
              <NumberBadge number={1} />
              <Label>Separator - Horizontal</Label>
              <div className="space-y-4">
                <div>Contenu au-dessus</div>
                <Separator />
                <div>Contenu en-dessous</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-2">
              <NumberBadge number={2} />
              <Label>Tabs - Catégories Menu</Label>
              <Tabs defaultValue="entrees" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="entrees">Entrées</TabsTrigger>
                  <TabsTrigger value="plats">Plats</TabsTrigger>
                  <TabsTrigger value="desserts">Desserts</TabsTrigger>
                </TabsList>
                <TabsContent value="entrees" className="space-y-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-thai-orange">Salade Som Tam</CardTitle>
                      <CardDescription>Salade de papaye verte épicée</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-thai-green text-2xl font-bold">8.50€</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="plats" className="space-y-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-thai-orange">Pad Thai</CardTitle>
                      <CardDescription>Nouilles sautées aux crevettes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-thai-green text-2xl font-bold">12.90€</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="desserts" className="space-y-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-thai-orange">Mango Sticky Rice</CardTitle>
                      <CardDescription>Riz gluant à la mangue et lait de coco</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-thai-green text-2xl font-bold">6.50€</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Accordion */}
            <div className="space-y-2">
              <NumberBadge number={3} />
              <Label>Accordion - FAQ</Label>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Quels sont vos horaires ?</AccordionTrigger>
                  <AccordionContent>
                    Nous sommes ouverts du lundi au samedi de 11h30 à 14h30 et de 18h30 à 22h30.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Livraison disponible ?</AccordionTrigger>
                  <AccordionContent>
                    Oui, nous livrons dans un rayon de 5km autour du restaurant via notre système de
                    commande en ligne.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Options végétariennes ?</AccordionTrigger>
                  <AccordionContent>
                    Nous proposons de nombreux plats végétariens et végans. Consultez notre menu
                    pour plus de détails.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Scroll Area */}
            <div className="space-y-2">
              <NumberBadge number={4} />
              <Label>Scroll Area - Liste scrollable</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="border-b py-2">
                    <p className="text-sm">
                      <span className="text-thai-orange font-medium">Plat #{i + 1}</span> -
                      Délicieux plat thaïlandais
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Collapsible */}
            <div className="space-y-2">
              <NumberBadge number={5} />
              <Label>Collapsible - Section expandable</Label>
              <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <h4 className="text-sm font-semibold">
                    Ingrédients du Pad Thai ({isCollapsibleOpen ? "Masquer" : "Afficher"})
                  </h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2 space-y-2 rounded-lg border p-4">
                  <div className="text-sm">Nouilles de riz, crevettes, œufs, tofu</div>
                  <div className="text-sm">Cacahuètes, germes de soja, citron vert</div>
                  <div className="text-sm">Sauce tamarin, sauce de poisson, piment</div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Navigation */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">🧭 Composants de Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Breadcrumb */}
            <div className="space-y-2">
              <NumberBadge number={1} />
              <Label>Breadcrumb - Fil d'Ariane</Label>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/commander">Commander</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Pad Thai</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Pagination */}
            <div className="space-y-2">
              <NumberBadge number={2} />
              <Label>Pagination</Label>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            {/* Dropdown Menu */}
            <div className="space-y-2">
              <NumberBadge number={3} />
              <Label>Dropdown Menu - Actions</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-thai-red">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Data Display */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">📊 Affichage de Données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="space-y-2">
              <NumberBadge number={1} />
              <Label>Avatar - Images Utilisateur</Label>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/media/avatars/default.svg" alt="Avatar" />
                  <AvatarFallback>CT</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/media/avatars/default.svg" alt="Avatar" />
                  <AvatarFallback className="bg-thai-orange text-white">CH</AvatarFallback>
                </Avatar>
                <Avatar className="border-thai-green h-20 w-20 border-4">
                  <AvatarImage src="/media/avatars/default.svg" alt="Avatar" />
                  <AvatarFallback className="bg-thai-green text-2xl text-white">TC</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Table */}
            <div className="space-y-2">
              <NumberBadge number={2} />
              <Label>Table - Liste de Commandes</Label>
              <div className="rounded-md border">
                <Table>
                  <TableCaption>Liste de vos commandes récentes</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">N°</TableHead>
                      <TableHead>Plat</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#001</TableCell>
                      <TableCell>Pad Thai</TableCell>
                      <TableCell>
                        <Badge className="bg-thai-green">Livré</Badge>
                      </TableCell>
                      <TableCell className="text-right">12.90€</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#002</TableCell>
                      <TableCell>Tom Yum</TableCell>
                      <TableCell>
                        <Badge className="bg-thai-orange">En cours</Badge>
                      </TableCell>
                      <TableCell className="text-right">9.50€</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#003</TableCell>
                      <TableCell>Som Tam</TableCell>
                      <TableCell>
                        <Badge variant="secondary">En attente</Badge>
                      </TableCell>
                      <TableCell className="text-right">8.50€</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 9: Toasts */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">🍞 Toasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1">
                <NumberBadge number={1} />
                <Button
                  onClick={() =>
                    toast({
                      title: "Toast par défaut",
                      description:
                        "Ceci est un toast standard avec bordure orange et animation verte",
                    })
                  }
                  className="bg-thai-orange hover:bg-thai-orange/90 w-full"
                >
                  toaster.tsx
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={2} />
                <Button
                  onClick={() =>
                    toast({
                      title: "Erreur !",
                      description: "Quelque chose s'est mal passé",
                      variant: "destructive",
                    })
                  }
                  variant="destructive"
                  className="w-full"
                >
                  toaster.tsx (erreur)
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={3} />
                <Button
                  onClick={() =>
                    toastVideo({
                      title: "Plat ajouté !",
                      description: (
                        <span>
                          <span className="text-thai-orange font-medium">Pad Thai</span>
                          <span className="text-thai-green font-medium"> ajouté au panier</span>
                        </span>
                      ),
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                    })
                  }
                  className="bg-thai-green hover:bg-thai-green/90 w-full"
                >
                  toastervideo.tsx (vidéo)
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={4} />
                <Button
                  onClick={() =>
                    toastVideo({
                      title: "Profil mis à jour",
                      description: (
                        <span>
                          <span className="text-thai-green font-medium">
                            Votre avatar a été modifié avec succès
                          </span>
                        </span>
                      ),
                      media: "/media/avatars/default.svg",
                    })
                  }
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  toastervideo.tsx (image)
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={5} />
                <Button
                  onClick={() =>
                    toastVideoCenter({
                      title: "Commande validée !",
                      description: (
                        <span>
                          <span className="text-thai-green font-medium">Commande </span>
                          <span className="text-thai-orange font-medium">Pad Thai</span>
                          <span className="text-thai-green font-medium"> validée</span>
                        </span>
                      ),
                      media: "/media/animations/toasts/ajoutpaniernote.mp4",
                    })
                  }
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  toastervideocenter.tsx (vidéo)
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={6} />
                <Button
                  onClick={() =>
                    toastVideoCenter({
                      title: "Bienvenue !",
                      description: (
                        <span>
                          <span className="text-thai-green font-medium">
                            Votre compte a été créé avec succès
                          </span>
                        </span>
                      ),
                      media: "/media/avatars/default.svg",
                    })
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  toastervideocenter.tsx (image)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 10: Cards */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">🃏 Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <NumberBadge number={1} />
                <Card className="border-thai-green/20 bg-thai-cream/20">
                  <CardHeader>
                    <CardTitle className="text-thai-green">Card Simple</CardTitle>
                    <CardDescription>Avec description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Ceci est une card avec bordure verte et fond crème
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Action
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="flex flex-col gap-1">
                <NumberBadge number={2} />
                <Card className="border-thai-orange/20 from-thai-cream/30 to-thai-gold/10 bg-linear-to-r">
                  <CardHeader>
                    <CardTitle className="text-thai-orange">Card Gradient</CardTitle>
                    <CardDescription>Avec dégradé</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Card avec dégradé crème vers or</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-thai-orange hover:bg-thai-orange/90 w-full">
                      Commander
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 11: Modals */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">🪟 Modals & Overlays</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Dialog */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={1} />
                <Button
                  onClick={() => setModalOpen(true)}
                  className="bg-thai-orange hover:bg-thai-orange/90 w-full"
                >
                  Dialog - Confirmation
                </Button>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer la suppression</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer{" "}
                        <span className="text-thai-orange font-semibold">Pad Thai</span> de votre
                        panier ?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setModalOpen(false)}>
                        Annuler
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setModalOpen(false)
                          toast({
                            title: "Article supprimé",
                            description: "Pad Thai a été retiré de votre panier",
                          })
                        }}
                      >
                        Supprimer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Drawer */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={2} />
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button className="bg-thai-green hover:bg-thai-green/90 w-full">
                      Drawer - Bottom Sheet
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle className="text-thai-green">Détails du Plat</DrawerTitle>
                      <DrawerDescription>Pad Thai aux crevettes</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                      <p className="text-gray-600">
                        Nouilles de riz sautées avec crevettes, œufs, tofu, cacahuètes et germes de
                        soja
                      </p>
                    </div>
                    <DrawerFooter>
                      <Button className="bg-thai-orange hover:bg-thai-orange/90">
                        Ajouter au panier - 12.90€
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>

              {/* Sheet */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={3} />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Menu className="mr-2 h-4 w-4" />
                      Sheet - Side Panel
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="text-thai-green">Menu Navigation</SheetTitle>
                      <SheetDescription>
                        Accédez rapidement aux différentes sections
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <Button variant="ghost" className="w-full justify-start">
                        🏠 Accueil
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        🍽️ Commander
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        📜 Historique
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        👤 Profil
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Popover */}
              <div className="flex flex-col gap-1">
                <NumberBadge number={4} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Info className="mr-2 h-4 w-4" />
                      Popover - Info
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-thai-orange leading-none font-medium">
                        Informations Nutritionnelles
                      </h4>
                      <p className="text-sm text-gray-600">
                        Le Pad Thai contient environ 550 calories par portion
                      </p>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Protéines:</span>
                          <span className="font-medium">25g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Glucides:</span>
                          <span className="font-medium">65g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lipides:</span>
                          <span className="font-medium">20g</span>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 12: Advanced Components */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">⚡ Composants Avancés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tooltip */}
            <div className="space-y-2">
              <NumberBadge number={1} />
              <Label>Tooltip - Info-bulle</Label>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Info className="mr-2 h-4 w-4" />
                        Survolez-moi
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ceci est une tooltip avec informations additionnelles</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Hover Card */}
            <div className="space-y-2">
              <NumberBadge number={2} />
              <Label>Hover Card - Preview enrichie</Label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="text-thai-orange">
                    @ChanthanaThaiCook
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src="/media/avatars/default.svg" />
                      <AvatarFallback>CT</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-thai-green text-sm font-semibold">Chanthana Thai Cook</h4>
                      <p className="text-sm">
                        Restaurant thaïlandais authentique depuis 2020. Spécialités: Pad Thai, Tom
                        Yum, Curry.
                      </p>
                      <div className="flex items-center pt-2">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-xs text-gray-600">Ouvert depuis janvier 2020</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardContent>
        </Card>

        {/* Section 13: Animations Thai */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">✨ Animations Thai Customs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <NumberBadge number={1} />
                <div className="animate-fadeIn bg-thai-cream/20 flex h-24 items-center justify-center rounded-lg border">
                  <p className="text-sm font-medium">animate-fadeIn</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <NumberBadge number={2} />
                <div className="animate-slideInFromLeft bg-thai-cream/20 flex h-24 items-center justify-center rounded-lg border">
                  <p className="text-sm font-medium">animate-slideInFromLeft</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <NumberBadge number={3} />
                <div className="animate-slideInFromRight bg-thai-cream/20 flex h-24 items-center justify-center rounded-lg border">
                  <p className="text-sm font-medium">animate-slideInFromRight</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <NumberBadge number={4} />
                <div className="animate-scaleIn bg-thai-cream/20 flex h-24 items-center justify-center rounded-lg border">
                  <p className="text-sm font-medium">animate-scaleIn</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <NumberBadge number={5} />
                <div className="animate-bounce-subtle bg-thai-cream/20 flex h-24 items-center justify-center rounded-lg border">
                  <p className="text-sm font-medium">animate-bounce-subtle</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <NumberBadge number={6} />
                <div className="animate-pulse-soft bg-thai-cream/20 flex h-24 items-center justify-center rounded-lg border">
                  <p className="text-sm font-medium">animate-pulse-soft</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <NumberBadge number={7} />
                <div className="animate-shimmer from-thai-cream via-thai-gold/30 to-thai-cream flex h-24 items-center justify-center rounded-lg border bg-linear-to-r bg-size-[200%_100%]">
                  <p className="text-sm font-medium">animate-shimmer</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <NumberBadge number={8} />
                <div className="animate-glow-pulse bg-thai-orange/10 flex h-24 items-center justify-center rounded-lg border">
                  <p className="text-thai-orange text-sm font-medium">animate-glow-pulse</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <NumberBadge number={9} />
                <div className="animate-thai-ripple bg-thai-green/10 relative flex h-24 items-center justify-center overflow-hidden rounded-lg border">
                  <p className="text-thai-green text-sm font-medium">animate-thai-ripple</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 14: Design Utilities */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">🎨 Utilitaires de Design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Border Radius */}
            <div className="space-y-2">
              <NumberBadge number={1} />
              <Label>Border Radius - Variations</Label>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="bg-thai-orange h-16 rounded-none"></div>
                  <p className="text-center text-xs">rounded-none</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-orange h-16 rounded-sm"></div>
                  <p className="text-center text-xs">rounded-sm</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-orange h-16 rounded-md"></div>
                  <p className="text-center text-xs">rounded-md</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-orange h-16 rounded-lg"></div>
                  <p className="text-center text-xs">rounded-lg</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-orange h-16 rounded-xl"></div>
                  <p className="text-center text-xs">rounded-xl</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-orange h-16 rounded-2xl"></div>
                  <p className="text-center text-xs">rounded-2xl</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-orange h-16 rounded-3xl"></div>
                  <p className="text-center text-xs">rounded-3xl</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-orange h-16 w-16 rounded-full"></div>
                  <p className="text-center text-xs">rounded-full</p>
                </div>
              </div>
            </div>

            {/* Shadows */}
            <div className="space-y-2">
              <NumberBadge number={2} />
              <Label>Shadows - Variations</Label>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="bg-thai-cream h-16 rounded-lg shadow-sm"></div>
                  <p className="text-center text-xs">shadow-sm</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-cream h-16 rounded-lg shadow"></div>
                  <p className="text-center text-xs">shadow</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-cream h-16 rounded-lg shadow-md"></div>
                  <p className="text-center text-xs">shadow-md</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-cream h-16 rounded-lg shadow-lg"></div>
                  <p className="text-center text-xs">shadow-lg</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-cream h-16 rounded-lg shadow-xl"></div>
                  <p className="text-center text-xs">shadow-xl</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-thai-cream h-16 rounded-lg shadow-2xl"></div>
                  <p className="text-center text-xs">shadow-2xl</p>
                </div>
              </div>
            </div>

            {/* Glassmorphism */}
            <div className="space-y-2">
              <NumberBadge number={3} />
              <Label>Glassmorphism - Effets verre</Label>
              <div
                className="relative h-48 overflow-hidden rounded-lg"
                style={{
                  backgroundImage: "url('/media/avatars/default.svg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="from-thai-orange/20 to-thai-green/20 absolute inset-0 bg-linear-to-br"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
                    <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">
                      Glassmorphism
                    </h3>
                    <p className="text-white/90 drop-shadow-md">
                      backdrop-blur-xl + bg-white/10 + border-white/20
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 15: Icônes & Médias */}
        <Card className="border-thai-orange/20">
          <CardHeader>
            <CardTitle className="text-thai-green">🎨 Icônes & Médias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Icônes */}
            <div className="space-y-2">
              <NumberBadge number={1} />
              <Label>Icônes Lucide</Label>
              <div className="flex flex-wrap gap-8">
                <div className="flex flex-col items-center gap-2">
                  <ShoppingCart className="text-thai-orange h-8 w-8" />
                  <span className="text-xs">ShoppingCart</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Heart className="text-thai-green h-8 w-8" />
                  <span className="text-xs">Heart</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Bell className="h-8 w-8 text-blue-500" />
                  <span className="text-xs">Bell</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Trash2 className="h-8 w-8 text-red-500" />
                  <span className="text-xs">Trash2</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Terminal className="h-8 w-8 text-gray-600" />
                  <span className="text-xs">Terminal</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <User className="text-thai-orange h-8 w-8" />
                  <span className="text-xs">User</span>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <NumberBadge number={2} />
              <Label>Images - Variations Avatar</Label>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-center rounded-lg border bg-white p-4">
                    <img
                      src="/media/avatars/default.svg"
                      alt="Avatar par défaut"
                      className="h-24 w-24"
                    />
                  </div>
                  <p className="text-center text-sm font-medium">Avatar par défaut</p>
                  <p className="text-center text-xs text-gray-500">/media/avatars/default.svg</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center rounded-lg border bg-white p-4">
                    <img
                      src="/media/avatars/default.svg"
                      alt="Avatar rond"
                      className="h-24 w-24 rounded-full"
                    />
                  </div>
                  <p className="text-center text-sm font-medium">Avatar rond</p>
                  <p className="text-center text-xs text-gray-500">rounded-full</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center rounded-lg border bg-white p-4">
                    <img
                      src="/media/avatars/default.svg"
                      alt="Avatar avec bordure"
                      className="border-thai-orange h-24 w-24 rounded-full border-4"
                    />
                  </div>
                  <p className="text-center text-sm font-medium">Avatar bordure orange</p>
                  <p className="text-center text-xs text-gray-500">border-4</p>
                </div>
              </div>
            </div>

            {/* Vidéos */}
            <div className="space-y-2">
              <NumberBadge number={3} />
              <Label>Vidéos - Animations</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-center rounded-lg border bg-black">
                    <video
                      src="/media/animations/toasts/ajoutpaniernote.mp4"
                      autoPlay
                      loop
                      muted
                      className="h-48 w-full rounded-lg object-contain"
                    />
                  </div>
                  <p className="text-center text-sm font-medium">Autoplay + Loop + Muted</p>
                  <p className="text-center text-xs text-gray-500">
                    /media/animations/toasts/ajoutpaniernote.mp4
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center rounded-lg border bg-black">
                    <video
                      src="/media/animations/toasts/ajoutpaniernote.mp4"
                      controls
                      className="h-48 w-full rounded-lg object-contain"
                    />
                  </div>
                  <p className="text-center text-sm font-medium">Avec contrôles</p>
                  <p className="text-center text-xs text-gray-500">controls</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer - Stats */}
        <Card className="border-thai-green/20 from-thai-cream/30 to-thai-gold/10 bg-linear-to-r">
          <CardHeader>
            <CardTitle className="text-thai-green text-center">📊 Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-center md:grid-cols-4">
              <div>
                <p className="text-thai-orange text-3xl font-bold">56+</p>
                <p className="text-sm text-gray-600">Composants testés</p>
              </div>
              <div>
                <p className="text-thai-green text-3xl font-bold">13</p>
                <p className="text-sm text-gray-600">Couleurs Thai</p>
              </div>
              <div>
                <p className="text-thai-orange text-3xl font-bold">9</p>
                <p className="text-sm text-gray-600">Animations customs</p>
              </div>
              <div>
                <p className="text-thai-green text-3xl font-bold">100%</p>
                <p className="text-sm text-gray-600">Couverture complète</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
