'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, ChangeEvent, useRef, memo } from 'react';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ValidationErrorDisplay, useValidationErrors } from '@/components/forms/ValidationErrorDisplay';
import { safeValidate, clientUpdateSchema } from '@/lib/validations';
import {
  LogIn,
  UserPlus,
  LogOut,
  Save,
  Edit3,
  Camera,
  CheckSquare,
  XSquare,
  Loader2,
  Trash2,
  Home,
  AlertCircle,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { format, parse, isValid as isValidDate, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FloatingUserIcon } from '@/components/FloatingUserIcon';
import { useSession } from '@/lib/auth-client';
import { updateUserProfile, getClientProfile, updateProfilePhoto as updateProfilePhotoAction, deleteProfilePhotoAction } from './actions';
import { DateBirthSelector } from '@/components/forms/DateBirthSelector';

import type { ClientInputData } from '@/types/app';
import {
  uploadProfilePhoto,
  getCroppedImg,
  resizeImage,
  deleteProfilePhoto,
} from '@/services/photoService';

const DATE_FORMAT_DB = 'yyyy-MM-dd';

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

interface FormDataState {
  nom: string;
  prenom: string;
  preferenceClient: string;
  numeroTelephone: string;
  adresseNumeroRue: string;
  codePostal: string;
  ville: string;
  commentConnuChanthana: string[];
  newsletterPreference: "Oui, j'accepte" | 'non';
}

const initialFormData: FormDataState = {
  nom: '',
  prenom: '',
  preferenceClient: '',
  numeroTelephone: '',
  adresseNumeroRue: '',
  codePostal: '',
  ville: '',
  commentConnuChanthana: [],
  newsletterPreference: 'non',
};

const Profil = memo(() => {
  const { toast } = useToast();

  // Better Auth session
  const { data: session, isPending: isLoadingAuth } = useSession();
  const currentUser = session?.user;

  // Client profile state
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [isLoadingUserRole, setIsLoadingUserRole] = useState(true);

  // Fonction pour charger/recharger le profil
  const refetchClient = async () => {
    if (!currentUser) {
      setCurrentUserProfile(null);
      setIsLoadingUserRole(false);
      return;
    }

    setIsLoadingUserRole(true);
    try {
      const profile = await getClientProfile();
      setCurrentUserProfile(profile);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setIsLoadingUserRole(false);
    }
  };

  // Charger le profil au montage et quand l'utilisateur change
  useEffect(() => {
    refetchClient();
  }, [currentUser?.id]);

  // ✅ GESTION ERREURS DE VALIDATION ZOD
  const { validationError, setValidationError, clearValidationError, handleValidationError } = useValidationErrors();

  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  // États d'authentification
  const [authError, setAuthError] = useState<string | null>(null);

  // États du profil
  const [profileEmail, setProfileEmail] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState<FormDataState>(initialFormData);

  // États de la photo
  const defaultProfilePhoto = '/logo.ico';
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>(defaultProfilePhoto);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [imgSrcForCrop, setImgSrcForCrop] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const imgCropRef = useRef<HTMLImageElement>(null);
  const [aspectRatio] = useState<number | undefined>(1);

  useEffect(() => {
    if (currentUser) {
      setProfileEmail(currentUser.email || '');
    }
    if (currentUserProfile) {
      setFormData({
        nom: currentUserProfile.nom || '',
        prenom: currentUserProfile.prenom || '',
        preferenceClient: currentUserProfile.preference_client || '',
        numeroTelephone: currentUserProfile.numero_de_telephone || '',
        adresseNumeroRue: currentUserProfile.adresse_numero_et_rue || '',
        codePostal: currentUserProfile.code_postal?.toString() || '',
        ville: currentUserProfile.ville || '',
        commentConnuChanthana: currentUserProfile.comment_avez_vous_connu || [],
        newsletterPreference:
          currentUserProfile.souhaitez_vous_recevoir_actualites
            ? "Oui, j'accepte"
            : 'non',
      });
      setProfilePhotoPreview(
        currentUserProfile.photo_client || defaultProfilePhoto
      );
      if (currentUserProfile.date_de_naissance) {
        const parsedDate = parse(
          currentUserProfile.date_de_naissance,
          DATE_FORMAT_DB,
          new Date()
        );
        if (isValidDate(parsedDate)) {
          setBirthDate(parsedDate);
        }
      } else {
        setBirthDate(undefined);
      }
    } else {
      setFormData(initialFormData);
    }
  }, [currentUser, currentUserProfile]);

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setAuthError(null);
    try {
      if (action === 'signup') {
        const result = await authClient.signUp.email({
          email: loginEmail,
          password: password,
          name: 'Nouvel utilisateur', // Sera mis à jour dans le profil
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        const result = await authClient.signIn.email({
          email: loginEmail,
          password: password,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      }
      toast({ title: action === 'signup' ? 'Compte créé !' : 'Connecté !' });
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast({ title: 'Déconnexion réussie' });
    } catch (error) {
      toast({
        title: 'Erreur de déconnexion',
        description: 'Une erreur est survenue lors de la déconnexion',
        variant: 'destructive',
      });
    }
  };

  const handleFormInputChange = (
    field: keyof FormDataState,
    value: string | boolean | Date | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleCommentConnuChange = (option: string, checked: boolean) => {
    const current = formData.commentConnuChanthana;
    const newSelection = checked
      ? [...current, option]
      : current.filter(item => item !== option);
    handleFormInputChange('commentConnuChanthana', newSelection);
  };
  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier image',
        variant: 'destructive',
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erreur',
        description: "L'image ne doit pas dépasser 5MB",
        variant: 'destructive',
      });
      return;
    }

    try {
      // Redimensionner l'image si nécessaire
      const resizedFile = await resizeImage(file, 800, 800, 0.9);
      setSelectedPhotoFile(resizedFile);

      // Créer une URL pour l'affichage dans le crop
      const reader = new FileReader();
      reader.onload = () => {
        setImgSrcForCrop(reader.result as string);
      };
      reader.readAsDataURL(resizedFile);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de traiter l'image",
        variant: 'destructive',
      });
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropValue = centerAspectCrop(width, height, aspectRatio || 1);
    setCrop(cropValue);
  };

  const handleApplyCrop = async () => {
    if (!imgCropRef.current || !crop || !selectedPhotoFile || !currentUser)
      return;

    setIsUploadingPhoto(true);
    try {
      // Créer l'image croppée
      const croppedFile = await getCroppedImg(
        imgCropRef.current,
        crop,
        `profile-${currentUser.id}.jpg`
      );

      // Uploader vers Supabase
      const uploadResult = await uploadProfilePhoto(
        croppedFile,
        currentUser.id
      );

      if (uploadResult.success && uploadResult.url) {
        // Mettre à jour le profil avec la nouvelle URL
        const result = await updateProfilePhotoAction(uploadResult.url);

        if (!result.success) {
          throw new Error(result.error || 'Erreur lors de la mise à jour du profil');
        }

        setProfilePhotoPreview(uploadResult.url);
        setImgSrcForCrop('');
        setSelectedPhotoFile(null);

        toast({
          title: 'Photo mise à jour !',
          description: 'Votre photo de profil a été sauvegardée',
        });

        refetchClient();
      } else {
        throw new Error(uploadResult.error || 'Erreur upload');
      }
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Impossible de sauvegarder la photo',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };
  const handleDeletePhoto = async () => {
    if (!currentUser || !currentUserProfile?.photo_client) return;

    setIsUploadingPhoto(true);
    try {
      // Supprimer de Supabase Storage
      const deleteSuccess = await deleteProfilePhoto(currentUser.id);

      if (deleteSuccess) {
        // Mettre à jour le profil en supprimant l'URL de la photo
        const result = await deleteProfilePhotoAction();

        if (!result.success) {
          throw new Error(result.error || 'Erreur lors de la mise à jour du profil');
        }

        setProfilePhotoPreview(defaultProfilePhoto);

        toast({
          title: 'Photo supprimée',
          description: 'Votre photo de profil a été supprimée',
        });

        refetchClient();
      } else {
        throw new Error('Impossible de supprimer la photo');
      }
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Impossible de supprimer la photo',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleCancelCrop = () => {
    setImgSrcForCrop('');
    setSelectedPhotoFile(null);
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;

    // On conserve toute la préparation de dataToSave
    const dataToSave = {
      nom: formData.nom || null,
      prenom: formData.prenom || null,
      email: profileEmail || null,
      preference_client: formData.preferenceClient || null,
      numero_de_telephone: formData.numeroTelephone || null,
      adresse_numero_et_rue: formData.adresseNumeroRue || null,
      code_postal: formData.codePostal && !isNaN(parseInt(formData.codePostal))
        ? parseInt(formData.codePostal)
        : null,
      ville: formData.ville || null,
      comment_avez_vous_connu: formData.commentConnuChanthana,
      souhaitez_vous_recevoir_actualites:
        formData.newsletterPreference === "Oui, j'accepte",
      date_de_naissance: birthDate && !isNaN(birthDate.getTime())
        ? format(birthDate, DATE_FORMAT_DB)
        : null,
      photo_client:
        profilePhotoPreview !== defaultProfilePhoto
          ? profilePhotoPreview
          : null,
    };

    // On convertit l'objet en FormData pour la Server Action
    const formDataForAction = new FormData();
    Object.entries(dataToSave).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => formDataForAction.append(key, item));
        } else {
          formDataForAction.append(key, String(value));
        }
      }
    });

    setIsLoadingProfile(true);

    // On appelle la Server Action avec le bon format
    const result = await updateUserProfile(formDataForAction);

    setIsLoadingProfile(false);

    if (result.success) {
      toast({ title: 'Profil mis à jour !' });
      refetchClient();
    } else {
      toast({
        title: 'Erreur de sauvegarde',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const isLoading = isLoadingAuth || isLoadingUserRole;
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-thai">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-thai-orange mx-auto" />
          <p className="text-thai-green font-medium">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  const optionsCommentConnu = [
    'Bouche à oreille',
    'Réseaux sociaux',
    'Recherche Google',
    'En passant devant',
    "Recommandation d'un ami",
    'Autre',
  ];

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Bouton retour optimisé - responsive et élégant */}
        <div className="mb-6 flex justify-start">
          <Link href="/" passHref>
            <Button
              variant="outline"
              size="sm"
              className="
                bg-white/90 backdrop-blur-sm hover:bg-white
                border-thai-orange/20 hover:border-thai-orange/40
                text-thai-green hover:text-thai-green
                transition-all duration-200
                shadow-md hover:shadow-lg
                rounded-full px-4 py-2
                group
              "
            >
              <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
              <span className="sm:hidden">Accueil</span>
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8">
            {authError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-fade-in">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  <p>{authError}</p>
                </div>
              </div>
            )}
            {!currentUser ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-thai-orange/10 rounded-full flex items-center justify-center">
                    <img
                      src={defaultProfilePhoto}
                      alt="Logo Chanthana Thai Cook"
                      className="w-16 h-16 rounded-full object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-thai-green">
                    Accéder à mon compte
                  </h2>
                  <p className="text-sm text-thai-green/70 mt-2">
                    Connectez-vous pour accéder à votre profil
                  </p>
                </div>
                <div className="space-y-2 mb-2">
                  <Label htmlFor="auth-email">Email *</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    value={loginEmail}
                    onChange={e => {
                      setLoginEmail(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="votreadresse@email.com"
                    required
                  />
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="auth-password">Mot de passe *</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="6 caractères min."
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => handleAuthAction('login')}
                    disabled={isLoadingAuth}
                    variant="secondary"
                    className="flex-1 h-12 text-base transition-all duration-200 hover:shadow-md"
                  >
                    {isLoadingAuth ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                    )}
                    Se connecter
                  </Button>
                  <Button
                    onClick={() => handleAuthAction('signup')}
                    disabled={isLoadingAuth}
                    className="flex-1 h-12 text-base transition-all duration-200 hover:shadow-md"
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
                  <div className="relative group">
                    {/* Photo de profil */}
                    <img
                      src={profilePhotoPreview || defaultProfilePhoto}
                      alt="Profil"
                      className="w-32 h-32 rounded-full object-cover border-4 border-thai-orange shadow-lg transition-all duration-300 group-hover:shadow-xl"
                    />

                    {/* Bouton d'upload */}
                    <Label
                      htmlFor="photo-upload"
                      className={cn(
                        'absolute bottom-1 right-1 bg-thai-green text-white p-2 rounded-full cursor-pointer hover:bg-thai-green/80 transition-colors shadow-lg',
                        isUploadingPhoto && 'opacity-50 cursor-not-allowed'
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
                            'absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg',
                            isUploadingPhoto && 'opacity-50 cursor-not-allowed'
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
                      <h4 className="text-center text-lg font-medium text-thai-green mb-2">
                        Recadrer votre photo
                      </h4>
                      <div className="flex justify-center items-center max-h-96 overflow-hidden">
                        <ReactCrop
                          crop={crop}
                          onChange={c => setCrop(c)}
                          aspect={aspectRatio}
                          minWidth={100}
                          minHeight={100}
                        >
                          <img
                            ref={imgCropRef}
                            alt="Crop me"
                            src={imgSrcForCrop}
                            onLoad={onImageLoad}
                            style={{ maxHeight: '350px', objectFit: 'contain' }}
                          />
                        </ReactCrop>
                      </div>
                      <div className="flex justify-center gap-4 mt-4">
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
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-thai-green">
                      {formData.prenom
                        ? `Bonjour ${formData.prenom} !`
                        : profileEmail || currentUser.email}
                    </h2>
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
                {!imgSrcForCrop && (
                  <form
                    onSubmit={handleSubmitProfile}
                    className="space-y-6 border-t border-thai-orange/10 pt-6"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-8 h-8 bg-thai-orange/10 rounded-full flex items-center justify-center mr-3">
                        <Edit3 className="w-4 h-4 text-thai-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-thai-green">
                        Mes informations personnelles
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          name="nom"
                          value={formData.nom || ''}
                          onChange={e =>
                            handleFormInputChange('nom', e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          name="prenom"
                          value={formData.prenom || ''}
                          onChange={e =>
                            handleFormInputChange('prenom', e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="numeroTelephone">
                        Numéro de téléphone *
                      </Label>
                      <Input
                        id="numeroTelephone"
                        name="numeroTelephone"
                        type="tel"
                        value={formData.numeroTelephone || ''}
                        onChange={e =>
                          handleFormInputChange(
                            'numeroTelephone',
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">
                        Email de votre compte
                      </Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileEmail}
                        readOnly
                        className="bg-gray-100/50"
                      />
                      <p className="text-xs text-gray-500">
                        Pour modifier votre email, utilisez la section "Sécurité et confidentialité" ci-dessous.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="adresseNumeroRue">
                        Adresse (numéro et rue)
                      </Label>
                      <Input
                        id="adresseNumeroRue"
                        name="adresseNumeroRue"
                        value={formData.adresseNumeroRue || ''}
                        onChange={e =>
                          handleFormInputChange(
                            'adresseNumeroRue',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codePostal">Code Postal</Label>
                        <Input
                          id="codePostal"
                          name="codePostal"
                          type="text"
                          pattern="[0-9]*"
                          value={formData.codePostal || ''}
                          onChange={e =>
                            handleFormInputChange('codePostal', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="ville">Ville</Label>
                        <Input
                          id="ville"
                          name="ville"
                          value={formData.ville || ''}
                          onChange={e =>
                            handleFormInputChange('ville', e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DateBirthSelector
                      value={birthDate}
                      onChange={setBirthDate}
                    />
                    <div>
                      <Label htmlFor="preferenceClient">Vos Préférences</Label>
                      <Textarea
                        id="preferenceClient"
                        name="preferenceClient"
                        value={formData.preferenceClient || ''}
                        onChange={e =>
                          handleFormInputChange(
                            'preferenceClient',
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder="Allergies, végan, plat préféré..."
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Comment avez-vous connu ChanthanaThaiCook ?</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {optionsCommentConnu.map(o => (
                          <div key={o} className="flex items-center space-x-2">
                            <Checkbox
                              id={`connu-${o}`}
                              checked={formData.commentConnuChanthana.includes(
                                o
                              )}
                              onCheckedChange={c =>
                                handleCommentConnuChange(o, c as boolean)
                              }
                            />
                            <Label
                              htmlFor={`connu-${o}`}
                              className="text-sm font-normal"
                            >
                              {o}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Souhaitez-vous recevoir les actualités et offres par
                        e-mail ?
                      </Label>
                      <RadioGroup
                        value={formData.newsletterPreference}
                        onValueChange={(v: string) =>
                          handleFormInputChange('newsletterPreference', v)
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
                      className="w-full h-12 text-base font-medium transition-all duration-200 hover:shadow-md"
                    >
                      {isLoadingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {currentUserProfile?.idclient ? 'Mise à jour...' : 'Sauvegarde...'}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {currentUserProfile?.idclient ? 'Mettre à jour mon profil' : 'Sauvegarder mon profil'}
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
          <Card className="shadow-xl mt-6 border-2 border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Sécurité et confidentialité
                </h3>
              </div>

              <div className="space-y-3">
                {/* Change Email */}
                <Link href={"/profil/change-email" as Route} className="block">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50/50 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                          <AlertCircle className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Changer mon adresse email</h4>
                          <p className="text-sm text-gray-600">Modifier l'email associé à votre compte</p>
                        </div>
                      </div>
                      <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180 group-hover:text-amber-600 transition-colors" />
                    </div>
                  </div>
                </Link>

                {/* Change Password */}
                <Link href={"/profil/change-password" as Route} className="block">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Lock className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Changer mon mot de passe</h4>
                          <p className="text-sm text-gray-600">Sécurisez votre compte avec un nouveau mot de passe</p>
                        </div>
                      </div>
                      <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>

                {/* Delete Account */}
                <Link href={"/profil/delete-account" as Route} className="block">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50/50 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                          <Trash2 className="h-5 w-5 text-red-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Supprimer mon compte</h4>
                          <p className="text-sm text-gray-600">Suppression définitive de votre compte et de vos données</p>
                        </div>
                      </div>
                      <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180 group-hover:text-red-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong className="text-gray-700">🔒 Vos données sont protégées.</strong> Nous respectons votre vie privée
                  et sécurisons vos informations selon le RGPD.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FloatingUserIcon ajouté pour navigation universelle */}
        <FloatingUserIcon />
      </div>
    </div>
  );
});

Profil.displayName = 'Profil';

export default Profil;
