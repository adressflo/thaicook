"use client"

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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  useCreateHeroMedia,
  useDeleteHeroMedia,
  useGetAllHeroMedias,
  useReorderHeroMedias,
  useToggleHeroMediaActive,
  useUpdateHeroMedia,
  type HeroMediaType,
} from "@/hooks/usePrismaData"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import {
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react"
import { useRef, useState } from "react"

export default function HeroMediaAdminPage() {
  const { data: medias, isLoading } = useGetAllHeroMedias()
  const createMedia = useCreateHeroMedia()
  const updateMedia = useUpdateHeroMedia()
  const reorderMedias = useReorderHeroMedias()
  const toggleActive = useToggleHeroMediaActive()
  const deleteMedia = useDeleteHeroMedia()

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [newMediaTitle, setNewMediaTitle] = useState("")
  const [newMediaDescription, setNewMediaDescription] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<HeroMediaType | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)

    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
    }
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.match(/^(video|image)\//)) {
      handleFileSelect(file)
    }
  }

  // Cleanup preview URL on unmount
  const handleDialogClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setNewMediaTitle("")
    setNewMediaDescription("")
    setIsUploadDialogOpen(false)
  }

  // Drag & drop handler
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !medias) return

    const items = Array.from(medias)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Mettre à jour l'ordre
    const updates = items.map((item, index) => ({
      id: item.id,
      ordre: index + 1,
    }))

    await reorderMedias.mutateAsync(updates)
  }

  // Upload handler - Direct upload to Supabase Storage from client
  const handleFileUpload = async () => {
    if (!selectedFile || !newMediaTitle) {
      alert("Veuillez sélectionner un fichier et entrer un titre")
      return
    }

    setUploadProgress(true)

    try {
      // Upload direct vers Supabase Storage depuis le client
      // Nettoyer le nom de fichier : enlever accents et caractères spéciaux
      const cleanFileName = selectedFile.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
        .replace(/[^a-zA-Z0-9._-]/g, "-") // Remplacer caractères spéciaux par tiret
        .replace(/\s+/g, "-") // Remplacer espaces par tiret
        .replace(/-+/g, "-") // Éviter tirets multiples
      const fileName = `${Date.now()}-${cleanFileName}`

      // Créer un FormData pour l'upload
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("fileName", fileName)

      // Upload via API route qui utilise le service role key
      const uploadResponse = await fetch("/api/hero-media/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || "Erreur lors de l'upload")
      }

      const { url } = await uploadResponse.json()

      // Créer l'entrée en base
      const mediaType = selectedFile.type.startsWith("video/") ? "video" : "image"
      const maxOrdre = medias?.reduce((max, m) => Math.max(max, m.ordre), 0) || 0

      await createMedia.mutateAsync({
        type: mediaType,
        url: url,
        titre: newMediaTitle,
        description: newMediaDescription || null,
        ordre: maxOrdre + 1,
        active: true,
      })

      // Reset form
      handleDialogClose()
      setUploadProgress(false)
    } catch (error) {
      console.error("Erreur upload:", error)
      alert(
        `Erreur lors de l'upload: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      )
      setUploadProgress(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-thai-orange h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-thai-green text-3xl font-bold">
                Hero Carousel Manager
              </CardTitle>
              <CardDescription className="mt-2">
                Gérez les vidéos et images affichées sur la page d'accueil
              </CardDescription>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-thai-orange hover:bg-thai-orange/90">
                  <Upload className="mr-2 h-4 w-4" />
                  Ajouter un média
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau média</DialogTitle>
                  <DialogDescription>
                    Uploadez une vidéo ou une image pour le hero carousel (Max 50MB)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Drag & Drop Upload Zone */}
                  <div className="space-y-2">
                    <Label>Fichier (vidéo/image)</Label>

                    {!selectedFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                          isDragging
                            ? "border-thai-orange bg-thai-orange/5"
                            : "hover:border-thai-orange/50 border-gray-300 hover:bg-gray-50"
                        } `}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="bg-thai-orange/10 rounded-full p-3">
                            <Upload className="text-thai-orange h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              Cliquez pour uploader ou glissez-déposez
                            </p>
                            <p className="text-xs text-gray-500">
                              MP4, JPG, PNG, WEBP ou GIF (max 50MB)
                            </p>
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                        <div className="relative aspect-video w-full bg-black">
                          {selectedFile.type.startsWith("video/") ? (
                            <video
                              src={previewUrl || ""}
                              className="h-full w-full object-contain"
                              controls
                            />
                          ) : (
                            <img
                              src={previewUrl || ""}
                              alt="Aperçu"
                              className="h-full w-full object-contain"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleFileSelect(null)}
                            className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {selectedFile.type.startsWith("video/") ? (
                                <Video className="text-thai-orange h-4 w-4" />
                              ) : (
                                <ImageIcon className="text-thai-green h-4 w-4" />
                              )}
                              <p className="max-w-xs truncate text-sm font-medium text-gray-900">
                                {selectedFile.name}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Sawadee Chanthana"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Input
                      id="description"
                      placeholder="Ex: Vidéo d'accueil"
                      value={newMediaDescription}
                      onChange={(e) => setNewMediaDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleDialogClose} disabled={uploadProgress}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    disabled={!selectedFile || !newMediaTitle || uploadProgress}
                    className="bg-thai-orange hover:bg-thai-orange/90"
                  >
                    {uploadProgress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Upload en cours...
                      </>
                    ) : (
                      "Ajouter"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-gray-500">
            ⓘ Glissez-déposez les cartes pour réorganiser l'ordre d'affichage
          </div>

          {!medias || medias.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Video className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Aucun média hero. Ajoutez-en un pour commencer.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="hero-medias">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {medias.map((media, index) => (
                      <Draggable key={media.id} draggableId={media.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`rounded-lg border-2 bg-white p-4 transition-all ${snapshot.isDragging ? "border-thai-orange shadow-xl" : "border-gray-200"} ${!media.active ? "opacity-50" : ""} `}
                          >
                            <div className="flex items-center gap-4">
                              {/* Drag handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="shrink-0 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-6 w-6 text-gray-400" />
                              </div>

                              {/* Ordre */}
                              <div className="bg-thai-orange/10 text-thai-orange flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                                {media.ordre}
                              </div>

                              {/* Aperçu */}
                              <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                                {media.type === "video" ? (
                                  <video
                                    src={media.url}
                                    className="h-full w-full object-cover"
                                    muted
                                  />
                                ) : (
                                  <img
                                    src={media.url}
                                    alt={media.titre}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>

                              {/* Info */}
                              <div className="grow">
                                <div className="flex items-center gap-2">
                                  {media.type === "video" ? (
                                    <Video className="text-thai-orange h-4 w-4" />
                                  ) : (
                                    <ImageIcon className="text-thai-green h-4 w-4" />
                                  )}
                                  <h3 className="text-lg font-semibold">{media.titre}</h3>
                                </div>
                                {media.description && (
                                  <p className="mt-1 text-sm text-gray-500">{media.description}</p>
                                )}
                                <p className="mt-1 max-w-md truncate text-xs text-gray-400">
                                  {media.url}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex shrink-0 items-center gap-2">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={media.active}
                                    onCheckedChange={(checked) =>
                                      toggleActive.mutate({ id: media.id, active: checked })
                                    }
                                  />
                                  {media.active ? (
                                    <Eye className="text-thai-green h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteConfirm(media)}
                                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{deleteConfirm?.titre}" ?
              {deleteConfirm?.url.includes("supabase.co/storage") && (
                <span className="mt-2 block text-red-600">
                  ⚠️ Le fichier sera également supprimé de Supabase Storage.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (deleteConfirm) {
                  deleteMedia.mutate({ id: deleteConfirm.id, url: deleteConfirm.url })
                  setDeleteConfirm(null)
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
