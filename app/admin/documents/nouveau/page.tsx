"use client"

import { createDocument } from "@/app/actions/documents"
import { getPlatsList } from "@/app/actions/plats"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { documentSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { CommandList } from "cmdk"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Check, ChevronsUpDown, FileText, Loader2, Plus, Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

type DocumentFormValues = z.infer<typeof documentSchema>

const defaultValues: DocumentFormValues = {
  type: "DEVIS",
  date_creation: new Date(),
  statut: "brouillon",
  nom_client_snapshot: "",
  adresse_client_snapshot: "",
  notes_privees: "",
  lignes: [
    {
      description: "",
      quantite: 1,
      prix_unitaire: 0,
      type: "CUSTOM",
      photo_url: "",
      tva_taux: 0,
      total_ht: 0,
    },
  ],
  mentions_legales: "Devis valable 30 jours. TVA non applicable, art. 293 B du CGI.",
  client_id: undefined,
  date_echeance: undefined,
}

type PlatItem = {
  id: number
  label: string
  price: number
  photo: string | null
}

export default function DocumentEditorPage() {
  const router = useRouter()
  const form = useForm<DocumentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(documentSchema) as any,
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    name: "lignes",
    control: form.control,
  })

  // --- CATALOGUE PLATS ---
  const [plats, setPlats] = useState<PlatItem[]>([])
  const [openComboboxIndex, setOpenComboboxIndex] = useState<number | null>(null)

  useEffect(() => {
    getPlatsList().then(setPlats)
  }, [])
  // --------------------

  const { execute, status } = useAction(createDocument, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success("Document créé avec succès !")
        router.push("/admin/documents")
      }
    },
    onError: ({ error }) => {
      toast.error("Erreur lors de la création : " + (error.serverError || "Erreur inconnue"))
    },
  })

  const onSubmit = (data: DocumentFormValues) => {
    execute(data)
  }

  const watchLignes = form.watch("lignes")
  const totalHT = watchLignes?.reduce(
    (acc, curr) => acc + (curr.quantite || 0) * (curr.prix_unitaire || 0),
    0
  )

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau Document</h1>
          <p className="text-muted-foreground">Créer un devis ou une facture pour un client.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* INFO GENERALES */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de document</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DEVIS">Devis</SelectItem>
                          <SelectItem value="FACTURE">Facture</SelectItem>
                          <SelectItem value="TICKET">Ticket de Caisse</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date_creation"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date d'émission</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Choisir une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nom_client_snapshot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du Client</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean Dupont / Entreprise XYZ" {...field} />
                      </FormControl>
                      <FormDescription>Nom qui apparaîtra sur le PDF.</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adresse_client_snapshot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse (Optionnel)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Rue de la Paix..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* LIGNES DU DOCUMENT */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contenu</CardTitle>
                <CardDescription>Détail des prestations et produits.</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    description: "",
                    quantite: 1,
                    prix_unitaire: 0,
                    type: "CUSTOM",
                    tva_taux: 0,
                    total_ht: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Ajouter une ligne
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid items-end gap-4 md:grid-cols-[1fr_100px_100px_100px_40px]"
                  >
                    <FormField
                      control={form.control}
                      name={`lignes.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className={cn(index !== 0 && "sr-only")}>
                            Description
                          </FormLabel>
                          <div className="flex gap-2">
                            {/* PREVIEW PHOTO */}
                            {form.watch(`lignes.${index}.photo_url`) && (
                              <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                                <Image
                                  src={form.watch(`lignes.${index}.photo_url`)!}
                                  alt="Plat"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}

                            <Popover
                              open={openComboboxIndex === index}
                              onOpenChange={(open) => setOpenComboboxIndex(open ? index : null)}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value || "Sélectionner un plat ou saisir..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0">
                                <Command>
                                  <CommandInput placeholder="Rechercher un plat..." />
                                  <CommandList>
                                    <CommandEmpty>Aucun plat trouvé.</CommandEmpty>
                                    <CommandGroup>
                                      {plats.map((plat) => (
                                        <CommandItem
                                          value={plat.label}
                                          key={plat.id}
                                          onSelect={() => {
                                            form.setValue(`lignes.${index}.description`, plat.label)
                                            form.setValue(
                                              `lignes.${index}.prix_unitaire`,
                                              plat.price
                                            )
                                            form.setValue(`lignes.${index}.type`, "PLAT")
                                            form.setValue(`lignes.${index}.plat_id`, plat.id)
                                            if (plat.photo) {
                                              form.setValue(`lignes.${index}.photo_url`, plat.photo)
                                            }
                                            setOpenComboboxIndex(null)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              plat.label === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {plat.label}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                  {/* FALLBACK MANUAL ENTRY */}
                                  <div className="border-t p-2">
                                    <Input
                                      placeholder="Ou saisie libre..."
                                      value={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.value)
                                        form.setValue(`lignes.${index}.type`, "CUSTOM")
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`lignes.${index}.quantite`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(index !== 0 && "sr-only")}>Qté</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`lignes.${index}.prix_unitaire`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(index !== 0 && "sr-only")}>P.U (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="pb-2 text-right font-medium tabular-nums">
                      {(
                        (form.watch(`lignes.${index}.quantite`) || 0) *
                        (form.watch(`lignes.${index}.prix_unitaire`) || 0)
                      ).toFixed(2)}
                      €
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total à payer</span>
                    <span>{totalHT.toFixed(2)} €</span>
                  </div>
                  <p className="text-muted-foreground text-right text-xs">TVA non applicable</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open("/admin/documents/preview-design", "_blank")}
            >
              <FileText className="mr-2 h-4 w-4" /> Prévisualiser le modèle
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={status === "executing"}>
              {status === "executing" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer le Document
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
