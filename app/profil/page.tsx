"use client"

import { saveNotificationToken } from "@/app/actions/notifications"
import { DateBirthSelector } from "@/components/forms/DateBirthSelector"
import { useValidationErrors } from "@/components/forms/ValidationErrorDisplay"
import { FloatingUserIcon } from "@/components/layout/FloatingUserIcon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { authClient, useSession } from "@/lib/auth-client"
import { requestNotificationPermission } from "@/lib/fcm"
import { cn } from "@/lib/utils"
import { format, isValid as isValidDate, parse } from "date-fns"
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckSquare,
  Edit3,
  Home,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Save,
  Trash2,
  UserPlus,
  XSquare,
} from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { ChangeEvent, memo, useEffect, useRef, useState } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import {
  deleteProfilePhotoAction,
  getClientProfile,
  updateUserProfile,
  uploadProfilePhotoToMinio,
} from "./actions"

import { getCroppedImg, resizeImage } from "@/services/photoService"

const DATE_FORMAT_DB = "yyyy-MM-dd"

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  )
}

// ... (rest of imports are fine, inserting ModeToggle import at top would be cleaner but this works if I replace a block)
// Actually I will just insert the import at the top of the file in a separate block to be safe,
// and then modify the JSX.

interface FormDataState {
  nom: string
  prenom: string
  preferenceClient: string
  numeroTelephone: string
  adresseNumeroRue: string
  codePostal: string
  ville: string
  commentConnuChanthana: string[]
  newsletterPreference: "Oui, j'accepte" | "non"
}

const initialFormData: FormDataState = {
  nom: "",
  prenom: "",
  preferenceClient: "",
  numeroTelephone: "",
  adresseNumeroRue: "",
  codePostal: "",
  ville: "",
  commentConnuChanthana: [],
  newsletterPreference: "non",
}

const Profil = memo(() => {
  const { toast } = useToast()

  // Better Auth session
  const { data: session, isPending: isLoadingAuth } = useSession()
  const currentUser = session?.user

  // Client profile state
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null)
  const [isLoadingUserRole, setIsLoadingUserRole] = useState(true)

  // Fonction pour charger/recharger le profil
  const refetchClient = async () => {
    if (!currentUser) {
      setCurrentUserProfile(null)
      setIsLoadingUserRole(false)
      return
    }

    setIsLoadingUserRole(true)
    try {
      const profile = await getClientProfile()
      setCurrentUserProfile(profile)
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error)
    } finally {
      setIsLoadingUserRole(false)
    }
  }

  // Charger le profil au montage et quand l'utilisateur change
  useEffect(() => {
    refetchClient()
  }, [currentUser?.id])

  // Demander automatiquement la permission FCM et sauvegarder le token
  useEffect(() => {
    if (!currentUser) return

    // Vérifier si FCM est configuré avant de demander les permissions
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapidKey || vapidKey === "YOUR_VAPID_KEY_HERE") {
      // FCM non configuré - feature optionnelle, retour silencieux
      return
    }

    // Demander permission et obtenir token FCM
    requestNotificationPermission().then((token) => {
      if (token) {
        // Sauvegarder token dans la base de données
        saveNotificationToken(token, "web").then((result) => {
          if (result.success && process.env.NODE_ENV === "development") {
            console.log("✅ Token FCM sauvegardé automatiquement")
          }
        })
      }
    })
  }, [currentUser])

  // ✅ GESTION ERREURS DE VALIDATION ZOD
  const { validationError, setValidationError, clearValidationError, handleValidationError } =
    useValidationErrors()

  const [loginEmail, setLoginEmail] = useState("")
  const [password, setPassword] = useState("")
  // États d'authentification
  const [authError, setAuthError] = useState<string | null>(null)

  // États du profil
  const [profileEmail, setProfileEmail] = useState("")
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [formData, setFormData] = useState<FormDataState>(initialFormData)

  // États de la photo
  const defaultProfilePhoto = "/logo.ico"
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>(defaultProfilePhoto)
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null)
  const [imgSrcForCrop, setImgSrcForCrop] = useState<string>("")
  const [crop, setCrop] = useState<Crop>()
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const imgCropRef = useRef<HTMLImageElement>(null)
  const [aspectRatio] = useState<number | undefined>(1)

  useEffect(() => {
    if (currentUser) {
      setProfileEmail(currentUser.email || "")
    }
    if (currentUserProfile) {
      setFormData({
        nom: currentUserProfile.nom || "",
        prenom: currentUserProfile.prenom || "",
        preferenceClient: currentUserProfile.preference_client || "",
        numeroTelephone: currentUserProfile.numero_de_telephone || "",
        adresseNumeroRue: currentUserProfile.adresse_numero_et_rue || "",
        codePostal: currentUserProfile.code_postal?.toString() || "",
        ville: currentUserProfile.ville || "",
        commentConnuChanthana: currentUserProfile.comment_avez_vous_connu || [],
        newsletterPreference: currentUserProfile.souhaitez_vous_recevoir_actualites
          ? "Oui, j'accepte"
          : "non",
      })
      setProfilePhotoPreview(currentUserProfile.photo_client || defaultProfilePhoto)
      if (currentUserProfile.date_de_naissance) {
        const parsedDate = parse(currentUserProfile.date_de_naissance, DATE_FORMAT_DB, new Date())
        if (isValidDate(parsedDate)) {
          setBirthDate(parsedDate)
        }
      } else {
        setBirthDate(undefined)
      }
    } else {
      setFormData(initialFormData)
    }
  }, [currentUser, currentUserProfile])

  const handleAuthAction = async (action: "login" | "signup") => {
    setAuthError(null)
    try {
      if (action === "signup") {
        const result = await authClient.signUp.email({
          email: loginEmail,
          password: password,
          name: "Nouvel utilisateur", // Sera mis à jour dans le profil
        })

        if (result.error) {
          throw new Error(result.error.message)
        }
      } else {
        const result = await authClient.signIn.email({
          email: loginEmail,
          password: password,
        })

        if (result.error) {
          throw new Error(result.error.message)
        }
      }
      toast({ title: action === "signup" ? "Compte créé !" : "Connecté !" })
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : "Une erreur est survenue")
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      toast({ title: "Déconnexion réussie" })
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      })
    }
  }

  const handleFormInputChange = (
    field: keyof FormDataState,
    value: string | boolean | Date | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleCommentConnuChange = (option: string, checked: boolean) => {
    const current = formData.commentConnuChanthana
    const newSelection = checked ? [...current, option] : current.filter((item) => item !== option)
    handleFormInputChange("commentConnuChanthana", newSelection)
  }
  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image",
        variant: "destructive",
      })
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      // Redimensionner l'image si nécessaire
      const resizedFile = await resizeImage(file, 800, 800, 0.9)
      setSelectedPhotoFile(resizedFile)

      // Créer une URL pour l'affichage dans le crop
      const reader = new FileReader()
      reader.onload = () => {
        setImgSrcForCrop(reader.result as string)
      }
      reader.readAsDataURL(resizedFile)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'image",
        variant: "destructive",
      })
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const cropValue = centerAspectCrop(width, height, aspectRatio || 1)
    setCrop(cropValue)
  }

  const handleApplyCrop = async () => {
    if (!imgCropRef.current || !crop || !selectedPhotoFile || !currentUser) return

    setIsUploadingPhoto(true)
    try {
      // Créer l'image croppée
      const croppedFile = await getCroppedImg(
        imgCropRef.current,
        crop,
        `profile-${currentUser.id}.jpg`
      )

      // Créer FormData et uploader vers MinIO via Server Action
      const formData = new FormData()
      formData.append("photo", croppedFile)

      const uploadResult = await uploadProfilePhotoToMinio(formData)

      if (uploadResult.success && uploadResult.url) {
        setProfilePhotoPreview(uploadResult.url)
        setImgSrcForCrop("")
        setSelectedPhotoFile(null)

        toast({
          title: "Photo mise à jour !",
          description: "Votre photo de profil a été sauvegardée",
        })

        refetchClient()
      } else {
        throw new Error(uploadResult.error || "Erreur upload")
      }
    } catch (error: unknown) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de sauvegarder la photo",
        variant: "destructive",
      })
    } finally {
      setIsUploadingPhoto(false)
    }
  }
  const handleDeletePhoto = async () => {
    if (!currentUser || !currentUserProfile?.photo_client) return

    setIsUploadingPhoto(true)
    try {
      // Supprimer de MinIO et mettre à jour le profil via Server Action
      const result = await deleteProfilePhotoAction()

      if (result.success) {
        setProfilePhotoPreview(defaultProfilePhoto)

        toast({
          title: "Photo supprimée",
          description: "Votre photo de profil a été supprimée",
        })

        refetchClient()
      } else {
        throw new Error(result.error || "Impossible de supprimer la photo")
      }
    } catch (error: unknown) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer la photo",
        variant: "destructive",
      })
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleCancelCrop = () => {
    setImgSrcForCrop("")
    setSelectedPhotoFile(null)
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser?.email) return

    // On conserve toute la préparation de dataToSave
    const dataToSave = {
      nom: formData.nom || null,
      prenom: formData.prenom || null,
      email: profileEmail || null,
      preference_client: formData.preferenceClient || null,
      numero_de_telephone: formData.numeroTelephone || null,
      adresse_numero_et_rue: formData.adresseNumeroRue || null,
      code_postal:
        formData.codePostal && !isNaN(parseInt(formData.codePostal))
          ? parseInt(formData.codePostal)
          : null,
      ville: formData.ville || null,
      comment_avez_vous_connu: formData.commentConnuChanthana,
      souhaitez_vous_recevoir_actualites: formData.newsletterPreference === "Oui, j'accepte",
      date_de_naissance:
        birthDate && !isNaN(birthDate.getTime()) ? format(birthDate, DATE_FORMAT_DB) : null,
      photo_client: profilePhotoPreview !== defaultProfilePhoto ? profilePhotoPreview : null,
    }

    // On convertit l'objet en FormData pour la Server Action
    const formDataForAction = new FormData()
    Object.entries(dataToSave).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => formDataForAction.append(key, item))
        } else {
          formDataForAction.append(key, String(value))
        }
      }
    })

    setIsLoadingProfile(true)

    // On appelle la Server Action avec le bon format
    const result = await updateUserProfile(formDataForAction)

    setIsLoadingProfile(false)

    if (result.success) {
      toast({ title: "Profil mis à jour !" })
      refetchClient()
    } else {
      toast({
        title: "Erreur de sauvegarde",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const isLoading = isLoadingAuth || isLoadingUserRole
  if (isLoading) {
    return (
      <div className="bg-gradient-thai flex min-h-screen flex-col items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="text-thai-orange mx-auto h-16 w-16 animate-spin" />
          <p className="text-thai-green font-medium">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  const optionsCommentConnu = [
    "Bouche à oreille",
    "Réseaux sociaux",
    "Recherche Google",
    "En passant devant",
    "Recommandation d'un ami",
    "Autre",
  ]

  return (
    <div className="bg-gradient-thai min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        {/* Bouton retour optimisé - responsive et élégant */}
        <div className="mb-6 flex justify-start">
          <Link href="/" passHref>
            <Button
              variant="outline"
              size="sm"
              className="border-thai-orange/20 hover:border-thai-orange/40 text-thai-green hover:text-thai-green group rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
            >
              <Home className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
              <span className="sm:hidden">Accueil</span>
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8">
            {authError && (
              <div className="animate-fade-in mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                  <p>{authError}</p>
                </div>
              </div>
            )}
            {!currentUser ? (
              <div className="space-y-6">
                <div className="mb-8 text-center">
                  <div className="bg-thai-orange/10 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                    <img
                      src={defaultProfilePhoto}
                      alt="Logo Chanthana Thai Cook"
                      className="h-16 w-16 rounded-full object-contain"
                    />
                  </div>
                  <h2 className="text-thai-green text-2xl font-bold">Accéder à mon compte</h2>
                  <p className="text-thai-green/70 mt-2 text-sm">
                    Connectez-vous pour accéder à votre profil
                  </p>
                </div>
                <div className="mb-2 space-y-2">
                  <Label htmlFor="auth-email">Email *</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value)
                      setAuthError(null)
                    }}
                    placeholder="votreadresse@email.com"
                    required
                  />
                </div>
                <div className="mb-4 space-y-2">
                  <Label htmlFor="auth-password">Mot de passe *</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setAuthError(null)
                    }}
                    placeholder="6 caractères min."
                    required
                  />
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    onClick={() => handleAuthAction("login")}
                    disabled={isLoadingAuth}
                    variant="secondary"
                    className="h-12 flex-1 text-base transition-all duration-200 hover:shadow-md"
                  >
                    {isLoadingAuth ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                    )}
                    Se connecter
                  </Button>
                  <Button
                    onClick={() => handleAuthAction("signup")}
                    disabled={isLoadingAuth}
                    className="h-12 flex-1 text-base transition-all duration-200 hover:shadow-md"
                  >
                    {isLoadingAuth ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    Créer un compte
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3 pt-4">
                  <div className="group relative">
                    {/* Photo de profil */}
                    <img
                      src={profilePhotoPreview || defaultProfilePhoto}
                      alt="Profil"
                      className="border-thai-orange h-32 w-32 rounded-full border-4 object-cover shadow-lg transition-all duration-300 group-hover:shadow-xl"
                    />

                    {/* Bouton d'upload */}
                    <Label
                      htmlFor="photo-upload"
                      className={cn(
                        "bg-thai-green hover:bg-thai-green/80 absolute right-1 bottom-1 cursor-pointer rounded-full p-2 text-white shadow-lg transition-colors",
                        isUploadingPhoto && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {isUploadingPhoto ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Camera size={16} />
                      )}
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={handlePhotoChange}
                        disabled={isUploadingPhoto}
                      />
                    </Label>

                    {/* Bouton de suppression (si photo personnalisée) */}
                    {currentUserProfile?.photo_client &&
                      profilePhotoPreview !== defaultProfilePhoto && (
                        <button
                          onClick={handleDeletePhoto}
                          disabled={isUploadingPhoto}
                          className={cn(
                            "absolute top-1 right-1 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-colors hover:bg-red-600",
                            isUploadingPhoto && "cursor-not-allowed opacity-50"
                          )}
                          title="Supprimer la photo"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                  </div>

                  {/* Aide pour l'utilisateur */}
                  {imgSrcForCrop && (
                    <Card className="mt-4 w-full p-4">
                      <h4 className="text-thai-green mb-2 text-center text-lg font-medium">
                        Recadrer votre photo
                      </h4>
                      <div className="flex max-h-96 items-center justify-center overflow-hidden">
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          aspect={aspectRatio}
                          minWidth={100}
                          minHeight={100}
                        >
                          <img
                            ref={imgCropRef}
                            alt="Crop me"
                            src={imgSrcForCrop}
                            onLoad={onImageLoad}
                            style={{ maxHeight: "350px", objectFit: "contain" }}
                          />
                        </ReactCrop>
                      </div>
                      <div className="mt-4 flex justify-center gap-4">
                        <Button
                          onClick={handleApplyCrop}
                          variant="secondary"
                          disabled={isUploadingPhoto}
                        >
                          {isUploadingPhoto ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sauvegarde...
                            </>
                          ) : (
                            <>
                              <CheckSquare className="mr-2 h-4 w-4" />
                              Appliquer
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleCancelCrop}
                          variant="outline"
                          disabled={isUploadingPhoto}
                        >
                          <XSquare className="mr-2 h-4 w-4" />
                          Annuler
                        </Button>
                      </div>
                    </Card>
                  )}
                  <div className="space-y-2 text-center">
                    <h2 className="text-thai-green text-2xl font-bold md:text-3xl">
                      {formData.prenom
                        ? `Bonjour ${formData.prenom} !`
                        : profileEmail || currentUser.email}
                    </h2>
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={handleLogout}
                        disabled={isLoadingAuth}
                        variant="ghost"
                        size="sm"
                        className="text-thai-orange hover:text-thai-orange/80 transition-colors duration-200"
                      >
                        <LogOut className="mr-1 h-4 w-4" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                </div>
                {!imgSrcForCrop && (
                  <form
                    onSubmit={handleSubmitProfile}
                    className="border-thai-orange/10 space-y-6 border-t pt-6"
                  >
                    <div className="mb-4 flex items-center justify-center">
                      <div className="bg-thai-orange/10 mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                        <Edit3 className="text-thai-orange h-4 w-4" />
                      </div>
                      <h3 className="text-thai-green text-xl font-semibold">
                        Mes informations personnelles
                      </h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          name="nom"
                          value={formData.nom || ""}
                          onChange={(e) => handleFormInputChange("nom", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          name="prenom"
                          value={formData.prenom || ""}
                          onChange={(e) => handleFormInputChange("prenom", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="numeroTelephone">Numéro de téléphone *</Label>
                      <Input
                        id="numeroTelephone"
                        name="numeroTelephone"
                        type="tel"
                        value={formData.numeroTelephone || ""}
                        onChange={(e) => handleFormInputChange("numeroTelephone", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email de votre compte</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileEmail}
                        readOnly
                        className="bg-gray-100/50"
                      />
                      <p className="text-xs text-gray-500">
                        Pour modifier votre email, utilisez la section "Sécurité et confidentialité"
                        ci-dessous.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="adresseNumeroRue">Adresse (numéro et rue)</Label>
                      <Input
                        id="adresseNumeroRue"
                        name="adresseNumeroRue"
                        value={formData.adresseNumeroRue || ""}
                        onChange={(e) => handleFormInputChange("adresseNumeroRue", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="codePostal">Code Postal</Label>
                        <Input
                          id="codePostal"
                          name="codePostal"
                          type="text"
                          pattern="[0-9]*"
                          value={formData.codePostal || ""}
                          onChange={(e) => handleFormInputChange("codePostal", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ville">Ville</Label>
                        <Input
                          id="ville"
                          name="ville"
                          value={formData.ville || ""}
                          onChange={(e) => handleFormInputChange("ville", e.target.value)}
                        />
                      </div>
                    </div>
                    <DateBirthSelector value={birthDate} onChange={setBirthDate} />
                    <div>
                      <Label htmlFor="preferenceClient">Vos Préférences</Label>
                      <Textarea
                        id="preferenceClient"
                        name="preferenceClient"
                        value={formData.preferenceClient || ""}
                        onChange={(e) => handleFormInputChange("preferenceClient", e.target.value)}
                        rows={3}
                        placeholder="Allergies, végan, plat préféré..."
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Comment avez-vous connu ChanthanaThaiCook ?</Label>
                      <div className="grid gap-3 md:grid-cols-2">
                        {optionsCommentConnu.map((o) => (
                          <div key={o} className="flex items-center space-x-2">
                            <Checkbox
                              id={`connu-${o}`}
                              checked={formData.commentConnuChanthana.includes(o)}
                              onCheckedChange={(c) => handleCommentConnuChange(o, c as boolean)}
                            />
                            <Label htmlFor={`connu-${o}`} className="text-sm font-normal">
                              {o}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Souhaitez-vous recevoir les actualités et offres par e-mail ?</Label>
                      <RadioGroup
                        value={formData.newsletterPreference}
                        onValueChange={(v: string) =>
                          handleFormInputChange("newsletterPreference", v)
                        }
                        className="flex gap-4 pt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Oui, j'accepte" id="nl-oui" />
                          <Label htmlFor="nl-oui" className="font-normal">
                            Oui, j'accepte
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non" id="nl-non" />
                          <Label htmlFor="nl-non" className="font-normal">
                            Non
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        isLoadingProfile ||
                        !formData.nom ||
                        !formData.prenom ||
                        !formData.numeroTelephone
                      }
                      className="h-12 w-full text-base font-medium transition-all duration-200 hover:shadow-md"
                    >
                      {isLoadingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {currentUserProfile?.idclient ? "Mise à jour..." : "Sauvegarde..."}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {currentUserProfile?.idclient
                            ? "Mettre à jour mon profil"
                            : "Sauvegarder mon profil"}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Management Section - Only shown when logged in */}
        {currentUser && (
          <Card className="mt-6 border-2 border-gray-100 shadow-xl">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Lock className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Sécurité et confidentialité</h3>
              </div>

              <div className="space-y-3">
                {/* Change Email */}
                <Link href={"/profil/change-email" as Route} className="block">
                  <div className="group rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-100 p-2 transition-colors group-hover:bg-amber-200">
                          <AlertCircle className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Changer mon adresse email</h4>
                          <p className="text-sm text-gray-600">
                            Modifier l'email associé à votre compte
                          </p>
                        </div>
                      </div>
                      <ArrowLeft className="h-5 w-5 rotate-180 text-gray-400 transition-colors group-hover:text-amber-600" />
                    </div>
                  </div>
                </Link>

                {/* Change Password */}
                <Link href={"/profil/change-password" as Route} className="block">
                  <div className="group rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200">
                          <Lock className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Changer mon mot de passe</h4>
                          <p className="text-sm text-gray-600">
                            Sécurisez votre compte avec un nouveau mot de passe
                          </p>
                        </div>
                      </div>
                      <ArrowLeft className="h-5 w-5 rotate-180 text-gray-400 transition-colors group-hover:text-blue-600" />
                    </div>
                  </div>
                </Link>

                {/* Delete Account */}
                <Link href={"/profil/delete-account" as Route} className="block">
                  <div className="group rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-red-300 hover:bg-red-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-100 p-2 transition-colors group-hover:bg-red-200">
                          <Trash2 className="h-5 w-5 text-red-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Supprimer mon compte</h4>
                          <p className="text-sm text-gray-600">
                            Suppression définitive de votre compte et de vos données
                          </p>
                        </div>
                      </div>
                      <ArrowLeft className="h-5 w-5 rotate-180 text-gray-400 transition-colors group-hover:text-red-600" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs text-gray-600">
                  <strong className="text-gray-700">🔒 Vos données sont protégées.</strong> Nous
                  respectons votre vie privée et sécurisons vos informations selon le RGPD.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FloatingUserIcon ajouté pour navigation universelle */}
        <FloatingUserIcon />
      </div>
    </div>
  )
})

Profil.displayName = "Profil"

export default Profil
