"use client"

import { getFeaturedDish, setFeaturedDish } from "@/app/actions/restaurant-settings"
import { DateRuptureManager } from "@/components/admin/DateRuptureManager"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditableField } from "@/components/ui/EditableField"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useImageUpload } from "@/hooks/useImageUpload"
import {
  usePrismaCreateExtra,
  usePrismaCreatePlat,
  usePrismaDeleteExtra,
  usePrismaExtras,
  usePrismaPlats,
  usePrismaUpdateExtra,
  usePrismaUpdatePlat,
} from "@/hooks/usePrismaData"
import { getStorageUrl, STORAGE_DEFAULTS } from "@/lib/storage-utils"
import { cn } from "@/lib/utils"
import type { ExtraUI, PlatUI as Plat } from "@/types/app"
import {
  Calendar,
  ChefHat,
  Edit2,
  Euro,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Package,
  Plus,
  Save,
  Star,
  Utensils,
  X,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

// Fonction pour formater le prix à la française
const formatPrice = (price: number): string => {
  return (
    price.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "€"
  )
}

// Composant pour créer un nouvel extra
const NewExtraButton = () => {
  const { toast } = useToast()
  const createExtraMutation = usePrismaCreateExtra()
  const { refetch: refetchExtras } = usePrismaExtras()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newExtraForm, setNewExtraForm] = useState({
    nom_extra: "",
    prix: "",
    description: "",
    photo_url: getStorageUrl(STORAGE_DEFAULTS.EXTRA),
  })

  // Hook réutilisable pour l'upload d'images
  const { uploadState, uploadFile, resetUpload } = useImageUpload(
    "extras",
    getStorageUrl(STORAGE_DEFAULTS.EXTRA)
  )

  // Fonction simplifiée utilisant le hook réutilisable
  const handleImageUpload = async (file: File) => {
    await uploadFile(file, (url) => {
      setNewExtraForm((prev) => ({ ...prev, photo_url: url }))
    })
  }

  const handleCreateExtra = async () => {
    if (!newExtraForm.nom_extra || !newExtraForm.prix) {
      toast({
        title: "Erreur",
        description: "Le nom et le prix sont obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      await createExtraMutation.mutateAsync({
        nom_extra: newExtraForm.nom_extra,
        description: newExtraForm.description,
        prix: newExtraForm.prix,
        photo_url: newExtraForm.photo_url,
      })

      toast({
        title: "Succès",
        description: `Extra "${newExtraForm.nom_extra}" créé avec succès`,
        variant: "default",
      })

      // Rafraîchir les données
      refetchExtras()

      // Réinitialiser le formulaire
      setIsModalOpen(false)
      setNewExtraForm({
        nom_extra: "",
        prix: "",
        description: "",
        photo_url: getStorageUrl(STORAGE_DEFAULTS.EXTRA),
      })
      resetUpload()
    } catch (error) {
      console.error("Erreur création extra:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer l&apos;extra",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-thai-green hover:bg-thai-green/90 transform text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nouvel Extra
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="border-thai-orange border bg-white shadow-xl sm:max-w-[500px]"
          aria-describedby="dialog-description"
        >
          <DialogHeader>
            <DialogTitle className="text-thai-green flex items-center gap-2 text-xl font-bold">
              <Plus className="text-thai-orange h-5 w-5" />
              Créer un Nouvel Extra Thai
            </DialogTitle>
          </DialogHeader>
          <div id="dialog-description" className="sr-only">
            Formulaire de création d'un nouvel extra pour le menu
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-thai-green flex items-center gap-2 font-semibold">
                  <Package className="text-thai-orange h-4 w-4" />
                  Nom de l&apos;extra
                </Label>
                <Input
                  value={newExtraForm.nom_extra}
                  onChange={(e) =>
                    setNewExtraForm((prev) => ({ ...prev, nom_extra: e.target.value }))
                  }
                  className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green font-medium"
                  placeholder="Ex: Coca Cola, Thé Thaï..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-thai-green flex items-center gap-2 font-semibold">
                  <Euro className="text-thai-orange h-4 w-4" />
                  Prix (€)
                </Label>
                <Input
                  value={newExtraForm.prix}
                  onChange={(e) => setNewExtraForm((prev) => ({ ...prev, prix: e.target.value }))}
                  type="number"
                  step="0.01"
                  className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green font-medium"
                  placeholder="25.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-thai-green font-semibold">Photo</Label>

              {/* Aperçu de l&apos;image */}
              <div className="mb-3">
                <div className="relative h-20 w-20">
                  <Image
                    src={newExtraForm.photo_url}
                    alt="Aperçu"
                    fill
                    className="border-thai-orange/30 rounded-lg border-2 object-cover"
                    sizes="80px"
                  />
                </div>
              </div>

              {/* Zone de drag & drop */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add("border-thai-orange", "bg-thai-orange/10")
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("border-thai-orange", "bg-thai-orange/10")
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove("border-thai-orange", "bg-thai-orange/10")
                  const file = e.dataTransfer.files?.[0]
                  if (file && file.type.startsWith("image/")) {
                    handleImageUpload(file)
                  }
                }}
                className="border-thai-orange/30 hover:bg-thai-orange/5 cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-all"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      handleImageUpload(file)
                    }
                  }
                  input.click()
                }}
              >
                {uploadState.isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="border-thai-orange h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                    <p className="text-thai-orange text-sm">Upload en cours...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="text-thai-orange/50 h-8 w-8" />
                    <p className="text-thai-green/70 text-sm">
                      Glissez une image ici ou cliquez pour sélectionner
                    </p>
                    <p className="text-thai-green/50 text-xs">JPEG, PNG, WebP, GIF (max 5MB)</p>
                  </div>
                )}
              </div>

              {/* URL manuelle optionnelle */}
              <Input
                value={newExtraForm.photo_url}
                onChange={(e) =>
                  setNewExtraForm((prev) => ({ ...prev, photo_url: e.target.value }))
                }
                className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-xs"
                placeholder="Ou collez une URL https://..."
                disabled={uploadState.isUploading}
              />

              {/* État de l&apos;upload */}
              {uploadState.error && <p className="text-sm text-red-500">{uploadState.error}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-thai-green font-semibold">Description</Label>
              <Textarea
                value={newExtraForm.description}
                onChange={(e) =>
                  setNewExtraForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20"
                rows={3}
                placeholder="Description de l'extra..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateExtra}
                disabled={createExtraMutation.isPending}
                className="bg-thai-green hover:bg-thai-green/90 text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
              >
                {createExtraMutation.isPending ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {createExtraMutation.isPending ? "Création..." : "Créer l'Extra"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-thai-orange text-thai-orange hover:bg-thai-orange transition-all duration-300 hover:text-white"
              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Composant pour afficher et éditer les extras existants avec design Thai
const ExistingExtrasDisplay = ({ refetchPlats }: { refetchPlats?: () => void }) => {
  const { data: extras, isLoading, refetch: refetchExtras } = usePrismaExtras()
  const updateExtraMutation = usePrismaUpdateExtra()
  const deleteExtraMutation = usePrismaDeleteExtra()
  const createPlatMutation = usePrismaCreatePlat()
  const [editingExtra, setEditingExtra] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    nom_extra: "",
    prix: "",
    description: "",
    photo_url: "",
  })
  const [extraToDelete, setExtraToDelete] = useState<{ id: number; name: string } | null>(null)

  // Hook réutilisable pour l&apos;upload d&apos;images en mode édition
  const {
    uploadState: editUploadState,
    uploadFile: uploadEditFile,
    resetUpload: resetEditUpload,
  } = useImageUpload("extras")

  const handleStartEdit = (extra: ExtraUI) => {
    setEditForm({
      nom_extra: extra.nom_extra || "",
      prix: extra.prix?.toString() || "",
      description: extra.description || "",
      photo_url: extra.photo_url || getStorageUrl(STORAGE_DEFAULTS.EXTRA),
    })
    setEditingExtra(extra.idextra)
    // Réinitialiser l&apos;état d&apos;upload
    resetEditUpload()
  }

  const { toast } = useToast()

  // Fonction simplifiée utilisant le hook réutilisable pour l&apos;édition
  const handleEditImageUpload = async (file: File) => {
    await uploadEditFile(file, (url) => {
      setEditForm((prev) => ({ ...prev, photo_url: url }))
    })
  }

  const handleSaveEdit = async () => {
    if (!editingExtra) return

    try {
      await updateExtraMutation.mutateAsync({
        id: editingExtra,
        data: {
          nom_extra: editForm.nom_extra,
          prix: editForm.prix,
          description: editForm.description,
          photo_url: editForm.photo_url,
        },
      })

      setEditingExtra(null)
      resetEditUpload()
    } catch (error) {
      console.error("Erreur sauvegarde extra:", error)
    }
  }

  const handleDeleteExtra = (extraId: number, extraName: string) => {
    setExtraToDelete({ id: extraId, name: extraName })
  }

  const confirmDeleteExtra = async () => {
    if (!extraToDelete) return

    try {
      await deleteExtraMutation.mutateAsync(extraToDelete.id)
      setExtraToDelete(null)
    } catch (error) {
      console.error("Erreur suppression extra:", error)
    }
  }

  const handleTransformToPlat = async (extra: ExtraUI) => {
    try {
      console.log("🔄 DÉBUT: Transformation extra → plat:", extra)

      // 1. CRÉER LE NOUVEAU PLAT avec la signature correcte usePrismaCreatePlat
      const platData = {
        nom_plat: extra.nom_extra,
        description: extra.description || `Plat créé depuis l'extra ${extra.nom_extra}`,
        prix: extra.prix,
        photo_url: extra.photo_url || extra.photo_url || getStorageUrl(STORAGE_DEFAULTS.EXTRA),
        actif: true,
      }

      console.log("📤 Création plat avec données:", platData)

      // ✅ SIGNATURE CORRECTE usePrismaCreatePlat(platData)
      await createPlatMutation.mutateAsync(platData)
      console.log("✅ Plat créé avec succès")

      // 2. SUPPRIMER L'EXTRA (devient plat maintenant)
      console.log("🗑️ Suppression extra ID:", extra.idextra)
      await deleteExtraMutation.mutateAsync(extra.idextra)
      console.log("✅ Extra supprimé avec succès")

      // 3. RAFRAÎCHIR LES DEUX LISTES (plats + extras)
      if (refetchPlats) await refetchPlats() // Rafraîchir plats
      await refetchExtras() // Rafraîchir extras

      toast({
        title: "🎉 Extra transformé en plat menu !",
        description: `"${extra.nom_extra}" est maintenant disponible dans le menu principal`,
        variant: "default",
      })
    } catch (error) {
      console.error("❌ ERREUR transformation extra → plat:", error)
      toast({
        title: "❌ Erreur de transformation",
        description: `Impossible de transformer "${extra.nom_extra}" en plat menu`,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="relative">
          <div className="border-thai-orange/20 border-t-thai-orange mx-auto h-12 w-12 animate-spin rounded-full border-4"></div>
          <div className="absolute inset-0 animate-pulse">
            <div className="bg-thai-cream mx-auto mt-3 h-6 w-6 rounded-full"></div>
          </div>
        </div>
        <p className="text-thai-green mt-4 font-medium">Chargement de vos extras Thai...</p>
      </div>
    )
  }

  if (!extras || extras.length === 0) {
    return (
      <Card className="border-thai-orange/40 hover:border-thai-orange/60 from-thai-cream/20 to-thai-orange/5 group border-2 border-dashed bg-linear-to-br via-white transition-all duration-500 hover:shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-4 text-6xl group-hover:animate-bounce">🍜</div>
          <h3 className="text-thai-green mb-2 text-lg font-bold">Aucun extra créé</h3>
          <p className="text-thai-green/70 mb-1">Créez vos premiers extras Thai</p>
          <p className="text-thai-orange/70 text-sm">
            Utilisez le bouton &quot;Nouvel Extra&quot; ci-dessus
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6">
        {extras.map((extra) => {
          const isEditing = editingExtra === extra.idextra

          return (
            <Card
              key={extra.idextra}
              className="group border-thai-orange hover:border-thai-green hover:shadow-thai-orange/10 via-thai-cream/10 to-thai-orange/5 hover:from-thai-cream/20 hover:to-thai-orange/10 transform border-l-4 bg-linear-to-r from-white transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
            >
              <CardContent className="p-6">
                {isEditing ? (
                  // Mode édition avec design Thai
                  <div className="animate-fadeIn space-y-6">
                    <div className="border-thai-orange/20 flex items-center gap-4 border-b pb-4">
                      <div className="group relative h-16 w-16">
                        <Image
                          src={editForm.photo_url}
                          alt="Extra"
                          fill
                          className="border-thai-orange/30 group-hover:border-thai-orange rounded-xl border-2 object-cover transition-all duration-300"
                          sizes="64px"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
                          <Edit2 className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <Badge className="bg-thai-orange/20 text-thai-orange border-thai-orange/30 animate-pulse">
                        Edition Thai
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-thai-green flex items-center gap-2 font-semibold">
                          <Package className="text-thai-orange h-4 w-4" />
                          Nom de l'extra
                        </Label>
                        <Input
                          value={editForm.nom_extra}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, nom_extra: e.target.value }))
                          }
                          className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green font-medium"
                          placeholder="Ex: Coca Cola, Thé Thaï..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-thai-green flex items-center gap-2 font-semibold">
                          <Euro className="text-thai-orange h-4 w-4" />
                          Prix (€)
                        </Label>
                        <Input
                          value={editForm.prix}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, prix: e.target.value }))
                          }
                          type="number"
                          step="0.01"
                          className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-thai-green font-medium"
                          placeholder="25.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-thai-green font-semibold">Photo</Label>

                      {/* Aperçu de l&apos;image */}
                      <div className="relative mb-3 h-20 w-20">
                        <Image
                          src={editForm.photo_url}
                          alt="Aperçu"
                          fill
                          className="border-thai-orange/30 rounded-lg border-2 object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Zone de drag & drop */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.add("border-thai-orange", "bg-thai-orange/10")
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove(
                            "border-thai-orange",
                            "bg-thai-orange/10"
                          )
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove(
                            "border-thai-orange",
                            "bg-thai-orange/10"
                          )
                          const file = e.dataTransfer.files?.[0]
                          if (file && file.type.startsWith("image/")) {
                            handleEditImageUpload(file)
                          }
                        }}
                        className="border-thai-orange/30 hover:bg-thai-orange/5 cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-all"
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) {
                              handleEditImageUpload(file)
                            }
                          }
                          input.click()
                        }}
                      >
                        {editUploadState.isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="border-thai-orange h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                            <p className="text-thai-orange text-sm">Upload en cours...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="text-thai-orange/50 h-8 w-8" />
                            <p className="text-thai-green/70 text-sm">
                              Glissez une image ici ou cliquez pour sélectionner
                            </p>
                            <p className="text-thai-green/50 text-xs">
                              JPEG, PNG, WebP, GIF (max 5MB)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* URL manuelle optionnelle */}
                      <Input
                        value={editForm.photo_url}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, photo_url: e.target.value }))
                        }
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20 text-xs"
                        placeholder="Ou collez une URL https://..."
                        disabled={editUploadState.isUploading}
                      />

                      {/* État de l&apos;upload */}
                      {editUploadState.error && (
                        <p className="text-sm text-red-500">{editUploadState.error}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-thai-green font-semibold">Description</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="border-thai-orange/30 focus:border-thai-orange focus:ring-thai-orange/20 bg-thai-cream/20"
                        rows={2}
                        placeholder="Description de l'extra..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-thai-green hover:bg-thai-green/90 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Sauvegarder Thai
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingExtra(null)
                          resetEditUpload()
                        }}
                        className="border-thai-orange text-thai-orange hover:bg-thai-orange transition-all duration-300 hover:text-white"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Mode affichage avec design Thai amélioré
                  <div className="animate-slideInUp flex items-center gap-6">
                    <div
                      className="group relative h-20 w-20 cursor-pointer"
                      onClick={() => handleStartEdit(extra)}
                    >
                      <Image
                        src={extra.photo_url || getStorageUrl(STORAGE_DEFAULTS.EXTRA)}
                        alt={extra.nom_extra}
                        fill
                        className="border-thai-orange/40 group-hover:border-thai-orange group-hover:shadow-thai-orange/20 transform rounded-xl border-3 object-cover shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                        sizes="80px"
                      />
                      <div className="from-thai-orange/20 absolute inset-0 rounded-xl bg-linear-to-t to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
                      <div className="bg-thai-orange/90 absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <Edit2 className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-thai-green group-hover:text-thai-orange text-xl font-bold capitalize transition-colors duration-300">
                          {extra.nom_extra}
                        </h4>
                        <div className="flex items-center gap-3">
                          <Badge className="from-thai-orange to-thai-red animate-pulse bg-linear-to-r text-white shadow-lg">
                            {formatPrice(parseFloat(extra.prix))}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-thai-green/70 italic">
                        {extra.description || "Extra Thai authentique"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStartEdit(extra)}
                        variant="outline"
                        size="sm"
                        className="border-thai-orange/50 text-thai-orange hover:bg-thai-orange translate-x-4 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:text-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteExtra(extra.idextra, extra.nom_extra)}
                        variant="outline"
                        size="sm"
                        className="border-thai-red/50 text-thai-red hover:bg-thai-red translate-x-4 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:text-white"
                        title="Supprimer l'extra"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleTransformToPlat(extra)}
                        variant="outline"
                        size="sm"
                        className="border-thai-green/50 text-thai-green hover:bg-thai-green translate-x-4 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:text-white"
                        title="Transformer en plat menu"
                      >
                        <Utensils className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={!!extraToDelete} onOpenChange={(open) => !open && setExtraToDelete(null)}>
        <AlertDialogContent className="border-thai-orange/20 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-thai-red">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer l&apos;extra &quot;
              <span className="text-thai-orange font-semibold">{extraToDelete?.name}</span>&quot; ?
              <br />
              <span className="text-thai-red mt-2 block text-sm">
                Cette action est irréversible.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteExtra}
              className="bg-thai-red hover:bg-thai-red/90 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface PlatForm {
  plat: string
  description: string
  prix: string // Changed to string
  photo_du_plat: string
  lundi_dispo: "oui" | "non"
  mardi_dispo: "oui" | "non"
  mercredi_dispo: "oui" | "non"
  jeudi_dispo: "oui" | "non"
  vendredi_dispo: "oui" | "non"
  samedi_dispo: "oui" | "non"
  dimanche_dispo: "oui" | "non"
}

const initialForm: PlatForm = {
  plat: "",
  description: "",
  prix: "", // Initialiser avec une chaîne vide
  photo_du_plat: "",
  lundi_dispo: "oui",
  mardi_dispo: "oui",
  mercredi_dispo: "oui",
  jeudi_dispo: "oui",
  vendredi_dispo: "oui",
  samedi_dispo: "oui",
  dimanche_dispo: "oui",
}

export default function AdminGestionPlats() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<PlatForm>(initialForm)
  const [filtreDisponibilite, setFiltreDisponibilite] = useState<
    "tous" | "disponibles" | "indisponibles"
  >("tous")
  const [activeTab, setActiveTab] = useState<"plats" | "extras">("plats")
  const [showRuptureManager, setShowRuptureManager] = useState<{
    platId: number
    platNom: string
  } | null>(null)
  const [isEditingPlat, setIsEditingPlat] = useState<Plat | null>(null)
  const [featuredDishId, setFeaturedDishId] = useState<number | null>(null)

  const { data: allPlats, refetch } = usePrismaPlats()
  const { data: extras } = usePrismaExtras() // Récupérer les extras de la table extras_db
  const createPlatMutation = usePrismaCreatePlat()
  const updatePlatMutation = usePrismaUpdatePlat()
  // Unused deleteExtraMutation removed
  const { toast } = useToast()

  useEffect(() => {
    if (isEditingPlat) {
      startEditing(isEditingPlat)
    }
  }, [isEditingPlat])

  // Charger le plat vedette au montage
  useEffect(() => {
    const loadFeaturedDish = async () => {
      try {
        const featured = await getFeaturedDish()
        if (featured) {
          setFeaturedDishId(featured.idplats)
        }
      } catch {
        console.error("Erreur lors du chargement du plat vedette")
      }
    }
    loadFeaturedDish()
  }, [])

  // Séparer les plats principaux des extras
  const plats = allPlats?.filter((p) => p.idplats !== 0) || []

  // Utiliser uniquement la nouvelle méthode extras_db
  const totalExtras = extras?.length || 0

  const currentItems = activeTab === "plats" ? plats : []

  // Fonctions utilitaires
  const marquerDisponible = async (platId: number) => {
    const updates = {
      lundi_dispo: "oui" as const,
      mardi_dispo: "oui" as const,
      mercredi_dispo: "oui" as const,
      jeudi_dispo: "oui" as const,
      vendredi_dispo: "oui" as const,
      samedi_dispo: "oui" as const,
      dimanche_dispo: "oui" as const,
    }
    await handleInlineUpdate(platId, updates)
  }

  const marquerIndisponible = async (platId: number) => {
    const updates = {
      lundi_dispo: "non" as const,
      mardi_dispo: "non" as const,
      mercredi_dispo: "non" as const,
      jeudi_dispo: "non" as const,
      vendredi_dispo: "non" as const,
      samedi_dispo: "non" as const,
      dimanche_dispo: "non" as const,
    }
    await handleInlineUpdate(platId, updates)
  }

  const handleInlineUpdate = async (platId: number, updateData: Record<string, unknown>) => {
    try {
      await updatePlatMutation.mutateAsync({
        id: platId,
        data:
          typeof updateData === "object" && !Array.isArray(updateData)
            ? updateData
            : { [Object.keys(updateData)[0]]: Object.values(updateData)[0] },
      })
      toast({
        title: "Succès",
        description: "Plat modifié avec succès",
      })
      refetch()
    } catch (error) {
      console.error("Erreur inline update:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le plat",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDayToggle = async (platId: number, jour: string, newValue: boolean) => {
    return handleInlineUpdate(platId, { [jour]: newValue ? "oui" : "non" })
  }

  // Gérer le plat vedette
  const handleToggleFeaturedDish = async (platId: number) => {
    try {
      const isCurrentlyFeatured = featuredDishId === platId

      // Si déjà vedette, on le retire, sinon on le met
      const result = await setFeaturedDish({
        plat_id: isCurrentlyFeatured ? null : platId,
      })

      if (result?.data?.success) {
        setFeaturedDishId(isCurrentlyFeatured ? null : platId)
        toast({
          title: "Succès",
          description: result.data.message,
          variant: "default",
        })
        refetch()
      } else {
        toast({
          title: "Erreur",
          description: result?.data?.error || "Impossible de définir le plat vedette",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur toggle featured dish:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!form.plat.trim() || !form.description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      if (isCreating) {
        await createPlatMutation.mutateAsync({
          nom_plat: form.plat,
          description: form.description,
          prix: form.prix, // Convertir en number pour l'API
          photo_url: form.photo_du_plat,
          categorie: activeTab === "extras" ? "extra" : "plat_principal",
          actif: true,
        })
        toast({
          title: "Succès",
          description: "Nouveau plat créé avec succès",
        })
        setIsCreating(false)
        setForm(initialForm)
      } else if (editingId) {
        await updatePlatMutation.mutateAsync({
          id: editingId,
          data: {
            ...form,
            prix: form.prix, // Convertir en number pour l'API
          },
        })
        toast({
          title: "Succès",
          description: "Plat modifié avec succès",
        })
        setEditingId(null)
        setForm(initialForm)
      }

      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le plat",
        variant: "destructive",
      })
    }
  }

  const startEditing = (plat: Plat) => {
    setForm({
      plat: plat.plat,
      description: plat.description || "",
      prix: plat.prix || "0",
      photo_du_plat: plat.photo_du_plat || "",
      lundi_dispo: plat.lundi_dispo === "oui" ? "oui" : "non",
      mardi_dispo: plat.mardi_dispo === "oui" ? "oui" : "non",
      mercredi_dispo: plat.mercredi_dispo === "oui" ? "oui" : "non",
      jeudi_dispo: plat.jeudi_dispo === "oui" ? "oui" : "non",
      vendredi_dispo: plat.vendredi_dispo === "oui" ? "oui" : "non",
      samedi_dispo: plat.samedi_dispo === "oui" ? "oui" : "non",
      dimanche_dispo: plat.dimanche_dispo === "oui" ? "oui" : "non",
    })
    setEditingId(plat.idplats)
    setIsCreating(false)
  }

  const cancelEdit = () => {
    setForm(initialForm)
    setEditingId(null)
    setIsCreating(false)
  }

  // Calculer le nombre de jours disponibles pour un plat
  const countJoursDisponibles = (plat: Plat) => {
    const joursDispos = [
      plat.lundi_dispo,
      plat.mardi_dispo,
      plat.mercredi_dispo,
      plat.jeudi_dispo,
      plat.vendredi_dispo,
      plat.samedi_dispo,
      plat.dimanche_dispo,
    ]
    return joursDispos.filter((jour) => jour === "oui").length
  }

  // Filtrer les items selon la disponibilité
  const itemsFiltered =
    currentItems?.filter((plat) => {
      if (filtreDisponibilite === "disponibles") {
        return countJoursDisponibles(plat) > 0
      } else if (filtreDisponibilite === "indisponibles") {
        return countJoursDisponibles(plat) === 0
      }
      return true // tous
    }) || []

  // Trier pour afficher les plats disponibles en premier
  itemsFiltered.sort((a, b) => {
    const aDispo = countJoursDisponibles(a) > 0
    const bDispo = countJoursDisponibles(b) > 0
    if (aDispo && !bDispo) {
      return -1
    }
    if (!aDispo && bDispo) {
      return 1
    }
    return 0
  })

  const stats = {
    total: currentItems?.length || 0,
    disponibles: currentItems?.filter((plat) => countJoursDisponibles(plat) > 0).length || 0,
    indisponibles: currentItems?.filter((plat) => countJoursDisponibles(plat) === 0).length || 0,
  }

  // Afficher le gestionnaire de ruptures
  if (showRuptureManager) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Button
          onClick={() => setShowRuptureManager(null)}
          variant="outline"
          className="border-thai-orange text-thai-orange hover:bg-thai-orange mb-4 hover:text-white"
        >
          ← Retour aux plats
        </Button>
        <DateRuptureManager
          platId={showRuptureManager.platId}
          platNom={showRuptureManager.platNom}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Card className="border-thai-orange/20 to-thai-cream/30 border-2 bg-linear-to-br from-white shadow-xl">
        <CardHeader className="border-thai-orange/20 from-thai-cream/20 border-b bg-linear-to-r to-white">
          <CardTitle className="text-thai-green flex items-center gap-3 text-xl">
            <ChefHat className="text-thai-orange h-6 w-6" />
            Gestion des Plats ({stats.total} plats)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Onglets avec design Thai */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "plats" | "extras")}
            className="space-y-6"
          >
            <TabsList className="bg-thai-cream/30 border-thai-orange/20 grid h-12 w-full grid-cols-2 border-2">
              <TabsTrigger
                value="plats"
                className="data-[state=active]:bg-thai-orange hover:bg-thai-orange/20 font-semibold transition-all duration-300 data-[state=active]:text-white"
              >
                <Utensils className="mr-2 h-4 w-4" />
                Plats du Menu ({plats.length})
              </TabsTrigger>
              <TabsTrigger
                value="extras"
                className="data-[state=active]:bg-thai-orange hover:bg-thai-orange/20 font-semibold transition-all duration-300 data-[state=active]:text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Extras Thai ({totalExtras})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plats" className="space-y-4">
              {/* Filtres de disponibilité */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    variant={filtreDisponibilite === "tous" ? "default" : "outline"}
                    onClick={() => setFiltreDisponibilite("tous")}
                    className={
                      filtreDisponibilite === "tous"
                        ? "bg-thai-orange hover:bg-thai-orange/90"
                        : "border-thai-orange/40 text-thai-orange hover:bg-thai-orange hover:text-white"
                    }
                  >
                    <Package className="mr-1 h-4 w-4" />
                    Tous ({stats.total})
                  </Button>
                  <Button
                    variant={filtreDisponibilite === "disponibles" ? "default" : "outline"}
                    onClick={() => setFiltreDisponibilite("disponibles")}
                    className={
                      filtreDisponibilite === "disponibles"
                        ? "bg-thai-green hover:bg-thai-green/90"
                        : "border-thai-green/40 text-thai-green hover:bg-thai-green hover:text-white"
                    }
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Disponibles ({stats.disponibles})
                  </Button>
                  <Button
                    variant={filtreDisponibilite === "indisponibles" ? "default" : "outline"}
                    onClick={() => setFiltreDisponibilite("indisponibles")}
                    className={
                      filtreDisponibilite === "indisponibles"
                        ? "bg-thai-red hover:bg-thai-red/90"
                        : "border-thai-red/40 text-thai-red hover:bg-thai-red hover:text-white"
                    }
                  >
                    <EyeOff className="mr-1 h-4 w-4" />
                    Indisponibles ({stats.indisponibles})
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    setIsCreating(true)
                    setForm(initialForm)
                    setEditingId(null)
                  }}
                  className="bg-thai-orange hover:bg-thai-orange/90 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau {activeTab === "plats" ? "Plat" : "Extra Thai"}
                </Button>
              </div>

              {/* Formulaire de création */}
              {isCreating && (
                <Card className="border-thai-orange from-thai-cream/30 border-2 bg-linear-to-r to-white">
                  <CardHeader className="bg-thai-orange/10">
                    <CardTitle className="text-thai-green flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Créer un Nouveau Plat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="plat">Nom du plat *</Label>
                        <Input
                          id="plat"
                          value={form.plat}
                          onChange={(e) => setForm((prev) => ({ ...prev, plat: e.target.value }))}
                          placeholder="Ex: Pad Thai aux crevettes"
                          className="border-thai-orange/20 focus:border-thai-orange"
                        />
                      </div>
                      <div>
                        <Label htmlFor="prix">Prix (€) *</Label>
                        <Input
                          id="prix"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.prix}
                          onChange={(e) => setForm((prev) => ({ ...prev, prix: e.target.value }))} // Stocker la valeur comme string
                          className="border-thai-orange/20 focus:border-thai-orange"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Description du plat..."
                        rows={3}
                        className="border-thai-orange/20 focus:border-thai-orange"
                      />
                    </div>
                    <div>
                      <Label htmlFor="photo">Photo (URL)</Label>
                      <Input
                        id="photo"
                        value={form.photo_du_plat}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, photo_du_plat: e.target.value }))
                        }
                        placeholder="https://..."
                        className="border-thai-orange/20 focus:border-thai-orange"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={createPlatMutation.isPending || updatePlatMutation.isPending}
                        className="bg-thai-green hover:bg-thai-green/90 text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Créer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Modal de modification */}
              <Dialog open={!!isEditingPlat} onOpenChange={() => setIsEditingPlat(null)}>
                <DialogContent
                  className="border-thai-orange border bg-white shadow-lg sm:max-w-[425px]"
                  aria-describedby="edit-dialog-description"
                >
                  <DialogHeader>
                    <DialogTitle className="text-thai-orange">Modifier le plat</DialogTitle>
                  </DialogHeader>
                  <div id="edit-dialog-description" className="sr-only">
                    Formulaire de modification d'un plat existant
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="plat-edit">Nom du plat *</Label>
                      <Input
                        id="plat-edit"
                        value={form.plat}
                        onChange={(e) => setForm((prev) => ({ ...prev, plat: e.target.value }))}
                        placeholder="Ex: Pad Thai aux crevettes"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="prix-edit">Prix (€) *</Label>
                      <Input
                        id="prix-edit"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.prix}
                        onChange={(e) => setForm((prev) => ({ ...prev, prix: e.target.value }))} // Stocker la valeur comme string
                        placeholder="Ex: 12.90"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description-edit">Description *</Label>
                      <Textarea
                        id="description-edit"
                        value={form.description}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Description du plat..."
                        rows={3}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="photo-edit">Photo (URL)</Label>
                      <Input
                        id="photo-edit"
                        value={form.photo_du_plat}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, photo_du_plat: e.target.value }))
                        }
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingPlat(null)}
                        disabled={updatePlatMutation.isPending}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={updatePlatMutation.isPending}
                        className="bg-thai-green hover:bg-thai-green/90 text-white"
                      >
                        {updatePlatMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Liste des plats */}
              <div className="grid gap-4">
                {itemsFiltered.map((plat) => {
                  const joursDispos = countJoursDisponibles(plat)
                  const isDisponible = joursDispos > 0

                  return (
                    <Card
                      key={plat.idplats}
                      className={`border-l-4 ${isDisponible ? "border-thai-green bg-green-50/30" : "border-thai-red bg-red-50/30"} hover:bg-thai-cream/20 hover:border-thai-orange hover:ring-thai-orange/30 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2`}
                    >
                      <CardContent className="p-0">
                        <div className="rounded-t-lg border-b bg-white p-6">
                          <div className="flex items-start gap-4">
                            {/* Image du plat - Éditable inline */}
                            <div className="shrink-0">
                              <EditableField
                                value={plat.photo_du_plat || ""}
                                onSave={(newValue) =>
                                  handleInlineUpdate(plat.idplats, { photo_du_plat: newValue })
                                }
                                type="image"
                                placeholder="Ajouter une image"
                              />
                            </div>

                            {/* Informations du plat */}
                            <div className="flex-1 space-y-2">
                              {/* Nom du plat - Éditable inline */}
                              <div className="flex items-start justify-between gap-2">
                                <EditableField
                                  value={plat.plat}
                                  onSave={(newValue) =>
                                    handleInlineUpdate(plat.idplats, { plat: newValue })
                                  }
                                  type="text"
                                  placeholder="Nom du plat"
                                  className="text-thai-green flex-1 text-lg font-semibold"
                                  validation={(value) => {
                                    if (!value || value.trim().length < 2) {
                                      return "Le nom doit contenir au moins 2 caractères"
                                    }
                                    return true
                                  }}
                                />

                                {/* Boutons Végétarien et Épicé */}
                                <div className="flex shrink-0 items-center gap-2">
                                  <Button
                                    variant={plat.est_vegetarien ? "default" : "outline"}
                                    size="sm"
                                    onClick={() =>
                                      handleInlineUpdate(plat.idplats, {
                                        est_vegetarien: !plat.est_vegetarien,
                                      })
                                    }
                                    className={cn(
                                      "h-7 px-2 text-xs",
                                      plat.est_vegetarien
                                        ? "bg-green-600 text-white hover:bg-green-700"
                                        : "border-green-300 text-green-700"
                                    )}
                                  >
                                    🌱 Végétarien
                                  </Button>

                                  <Button
                                    variant={(plat.niveau_epice ?? 0) > 0 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() =>
                                      handleInlineUpdate(plat.idplats, {
                                        niveau_epice: (plat.niveau_epice ?? 0) > 0 ? 0 : 1,
                                      })
                                    }
                                    className={cn(
                                      "h-7 px-2 text-xs",
                                      (plat.niveau_epice ?? 0) > 0
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "border-red-300 text-red-700"
                                    )}
                                  >
                                    🔥 Épicé
                                  </Button>
                                </div>

                                <Badge
                                  variant={isDisponible ? "default" : "destructive"}
                                  className={isDisponible ? "bg-thai-green" : ""}
                                >
                                  {joursDispos} jour{joursDispos > 1 ? "s" : ""} dispo
                                </Badge>
                              </div>

                              {/* Description - Éditable inline */}
                              <EditableField
                                value={plat.description || ""}
                                onSave={(newValue) =>
                                  handleInlineUpdate(plat.idplats, { description: newValue })
                                }
                                type="textarea"
                                placeholder="Description du plat"
                                className="text-sm text-gray-600"
                              />

                              {/* Prix - Éditable inline */}
                              <div className="flex items-center gap-2">
                                <EditableField
                                  value={plat.prix || 0}
                                  onSave={(newValue) =>
                                    handleInlineUpdate(plat.idplats, {
                                      prix: parseFloat(newValue) || 0,
                                    })
                                  }
                                  type="number"
                                  placeholder="0,00€"
                                  validation={(value) => {
                                    const num = parseFloat(value)
                                    if (isNaN(num) || num < 0) {
                                      return "Le prix doit être un nombre positif"
                                    }
                                    return true
                                  }}
                                  formatDisplay={(value) => formatPrice(parseFloat(value || "0"))}
                                  className="text-thai-green font-medium"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-b-lg bg-gray-50 p-6">
                          {/* Disponibilité par jour */}
                          <div className="mt-4">
                            <h4 className="text-thai-green mb-2 flex items-center gap-1 text-sm font-medium">
                              <Calendar className="h-4 w-4" />
                              Disponibilité hebdomadaire:
                            </h4>
                            <div className="grid grid-cols-7 gap-2 text-xs">
                              {[
                                "lundi",
                                "mardi",
                                "mercredi",
                                "jeudi",
                                "vendredi",
                                "samedi",
                                "dimanche",
                              ].map((jour) => {
                                const dayKey = `${jour}_dispo` as keyof typeof plat
                                const isAvailable = plat[dayKey] === "oui"
                                return (
                                  <Button
                                    key={jour}
                                    size="sm"
                                    variant={isAvailable ? "default" : "outline"}
                                    onClick={() =>
                                      handleDayToggle(plat.idplats, dayKey, !isAvailable)
                                    }
                                    className={`h-10 w-full text-xs capitalize ${isAvailable ? "bg-thai-green hover:bg-thai-green/90" : "border-gray-300"}`}
                                  >
                                    {jour.slice(0, 3)}
                                  </Button>
                                )
                              })}
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex gap-2 pt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIsEditingPlat(plat)}
                              className="text-thai-green border-thai-green/40 hover:bg-thai-green flex-1 text-xs shadow-sm transition-all duration-200 hover:text-white hover:shadow-md"
                            >
                              <Edit2 className="mr-1 h-3 w-3" />
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setShowRuptureManager({ platId: plat.idplats, platNom: plat.plat })
                              }
                              className="text-thai-orange border-thai-orange/40 hover:bg-thai-orange flex-1 text-xs shadow-sm transition-all duration-200 hover:text-white hover:shadow-md"
                            >
                              <Calendar className="mr-1 h-3 w-3" />
                              Ruptures
                            </Button>

                            {activeTab === "plats" && (
                              <Button
                                size="sm"
                                variant={featuredDishId === plat.idplats ? "default" : "outline"}
                                onClick={() => handleToggleFeaturedDish(plat.idplats)}
                                className={`flex-1 text-xs shadow-sm transition-all duration-200 hover:shadow-md ${
                                  featuredDishId === plat.idplats
                                    ? "bg-thai-gold hover:bg-thai-gold/90 border-thai-gold text-white"
                                    : "text-thai-gold border-thai-gold/40 hover:bg-thai-gold hover:text-white"
                                }`}
                              >
                                <Star
                                  className={`mr-1 h-3 w-3 ${featuredDishId === plat.idplats ? "fill-white" : ""}`}
                                />
                                {featuredDishId === plat.idplats ? "Vedette ✓" : "Vedette"}
                              </Button>
                            )}

                            {activeTab === "plats" &&
                              (isDisponible ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => marquerIndisponible(plat.idplats)}
                                  className="border-thai-red/40 hover:from-thai-red/10 hover:to-thai-red/20 hover:border-thai-red focus:border-thai-red group h-10 w-auto min-w-[150px] rounded-xl border-2 bg-linear-to-r from-white to-red-50/20 text-base font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                  <EyeOff className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                  Désactiver
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => marquerDisponible(plat.idplats)}
                                  className="border-thai-green/40 hover:from-thai-green/10 hover:to-thai-green/20 hover:border-thai-green focus:border-thai-green group h-10 w-auto min-w-[150px] rounded-xl border-2 bg-linear-to-r from-white to-green-50/20 text-base font-bold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                  <Eye className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                  Activer
                                </Button>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {itemsFiltered.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                    <h3 className="mb-2 text-lg font-medium text-gray-500">
                      {filtreDisponibilite === "disponibles"
                        ? `Aucun ${activeTab} disponible`
                        : filtreDisponibilite === "indisponibles"
                          ? `Aucun ${activeTab} indisponible`
                          : `Aucun ${activeTab} trouvé`}
                    </h3>
                    <p className="text-gray-400">
                      {filtreDisponibilite === "tous" &&
                        `Commencez par créer votre premier ${activeTab === "plats" ? "plat" : "extra Thai"}`}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="extras" className="space-y-4">
              {/* Section Extras Thai (extras_db uniquement) */}
              <div className="animate-fadeIn mb-8">
                <div className="from-thai-cream/30 to-thai-orange/10 border-thai-orange/20 rounded-2xl border bg-linear-to-r p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-thai-green flex items-center gap-3 text-xl font-bold">
                      <div className="bg-thai-orange/20 rounded-xl p-2">
                        <Package className="text-thai-orange h-6 w-6" />
                      </div>
                      Extras Thai ({totalExtras})
                    </h3>
                    <div className="flex gap-3">
                      <NewExtraButton />
                    </div>
                  </div>
                  <ExistingExtrasDisplay refetchPlats={refetch} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
