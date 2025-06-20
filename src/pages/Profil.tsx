import { useState, useEffect, ChangeEvent, useRef, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, User, LogIn, UserPlus, LogOut, Save, Edit3, Camera, CheckSquare, XSquare, Loader2, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid as isValidDate, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateEmail } from 'firebase/auth';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAuth } from '@/contexts/AuthContext';
// Utilisation des hooks Supabase
import { useCreateClient, useUpdateClient } from '@/hooks/useSupabaseData';
import type { ClientInputData } from '@/types/supabase';
import { uploadProfilePhoto, getCroppedImg, resizeImage, deleteProfilePhoto } from '@/services/photoService';

const DATE_FORMAT_DB = "yyyy-MM-dd";

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
    return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight), mediaWidth, mediaHeight);
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
  newsletterPreference: 'Oui, j\'accepte' | 'non';
}

const initialFormData: FormDataState = {
  nom: '', prenom: '', preferenceClient: '', numeroTelephone: '',
  adresseNumeroRue: '', codePostal: '', ville: '',
  commentConnuChanthana: [], newsletterPreference: 'non'
};

const Profil = memo(() => {
  const { toast } = useToast();
  const { currentUser, isLoadingAuth, currentUserProfile, isLoadingUserRole, refetchClient } = useAuth();
  
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarDisplayMonth, setCalendarDisplayMonth] = useState<Date>(startOfDay(new Date(1990, 0, 1)));
  const defaultProfilePhoto = "/images/logo.png";
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>(defaultProfilePhoto);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [imgSrcForCrop, setImgSrcForCrop] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const imgCropRef = useRef<HTMLImageElement>(null);
  const [aspectRatio] = useState<number | undefined>(1);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);

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
        newsletterPreference: currentUserProfile.souhaitez_vous_recevoir_actualites ? 'Oui, j\'accepte' : 'non',
      });
      setProfilePhotoPreview(currentUserProfile.photo_client || defaultProfilePhoto);
      if (currentUserProfile.date_de_naissance) {
        const parsedDate = parse(currentUserProfile.date_de_naissance, DATE_FORMAT_DB, new Date());
        if (isValidDate(parsedDate)) {
             setBirthDate(parsedDate);
             setCalendarDisplayMonth(parsedDate);
        }
      }
    } else {
        setFormData(initialFormData);
    }
  }, [currentUser, currentUserProfile]);
  
  const handleAuthAction = async (action: 'login' | 'signup') => {
    setAuthError(null);
    try {
      if (action === 'signup') { await createUserWithEmailAndPassword(auth, loginEmail, password); }
      else { await signInWithEmailAndPassword(auth, loginEmail, password); }
      toast({ title: action === 'signup' ? "Compte créé !" : "Connecté !" });
    } catch (error: any) {
      setAuthError(error.message);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => { await signOut(auth); };
  const handleUpdateEmail = async () => { /* ... */ };
  const handleFormInputChange = (field: keyof FormDataState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleCommentConnuChange = (option: string, checked: boolean) => {
    const current = formData.commentConnuChanthana;
    const newSelection = checked ? [...current, option] : current.filter(item => item !== option);
    handleFormInputChange('commentConnuChanthana', newSelection);
  };
  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive"
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
        title: "Erreur",
        description: "Impossible de traiter l'image",
        variant: "destructive"
      });
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropValue = centerAspectCrop(width, height, aspectRatio || 1);
    setCrop(cropValue);
  };

  const handleApplyCrop = async () => {
    if (!imgCropRef.current || !crop || !selectedPhotoFile || !currentUser) return;

    setIsUploadingPhoto(true);
    try {
      // Créer l'image croppée
      const croppedFile = await getCroppedImg(
        imgCropRef.current,
        crop,
        `profile-${currentUser.uid}.jpg`
      );

      // Uploader vers Supabase
      const uploadResult = await uploadProfilePhoto(croppedFile, currentUser.uid);
      
      if (uploadResult.success && uploadResult.url) {
        // Mettre à jour le profil avec la nouvelle URL
        const dataToUpdate: Partial<ClientInputData> = {
          photo_client: uploadResult.url
        };

        if (currentUserProfile) {
          await updateClientMutation.mutateAsync({
            firebase_uid: currentUser.uid,
            data: dataToUpdate
          });
        }

        setProfilePhotoPreview(uploadResult.url);
        setImgSrcForCrop('');
        setSelectedPhotoFile(null);
        
        toast({
          title: "Photo mise à jour !",
          description: "Votre photo de profil a été sauvegardée"
        });
        
        refetchClient();
      } else {
        throw new Error(uploadResult.error || 'Erreur upload');
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la photo",
        variant: "destructive"
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
      const deleteSuccess = await deleteProfilePhoto(currentUser.uid);
      
      if (deleteSuccess) {
        // Mettre à jour le profil en supprimant l'URL de la photo
        const dataToUpdate: Partial<ClientInputData> = {
          photo_client: null
        };

        await updateClientMutation.mutateAsync({
          firebase_uid: currentUser.uid,
          data: dataToUpdate
        });

        setProfilePhotoPreview(defaultProfilePhoto);
        
        toast({
          title: "Photo supprimée",
          description: "Votre photo de profil a été supprimée"
        });
        
        refetchClient();
      } else {
        throw new Error('Impossible de supprimer la photo');
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la photo",
        variant: "destructive"
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleCancelCrop = () => { 
    setImgSrcForCrop(''); 
    setSelectedPhotoFile(null);
  };
  const handleCalendarSelect = (date: Date | undefined) => { setBirthDate(date); setIsCalendarOpen(false); };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;

    // Adaptation pour Supabase
    const dataToSave: ClientInputData = {
        firebase_uid: currentUser.uid,
        nom: formData.nom,
        prenom: formData.prenom,
        email: profileEmail,
        preference_client: formData.preferenceClient,
        numero_de_telephone: formData.numeroTelephone,
        adresse_numero_et_rue: formData.adresseNumeroRue,
        code_postal: formData.codePostal ? parseInt(formData.codePostal) : undefined,
        ville: formData.ville,
        comment_avez_vous_connu: formData.commentConnuChanthana.filter(item => 
          ["Bouche à oreille", "Réseaux sociaux", "Recherche Google", "En passant devant", "Recommandation d'un ami", "Autre"].includes(item)
        ) as ("Bouche à oreille" | "Réseaux sociaux" | "Recherche Google" | "En passant devant" | "Recommandation d'un ami" | "Autre")[],
        souhaitez_vous_recevoir_actualites: formData.newsletterPreference === 'Oui, j\'accepte',
        date_de_naissance: birthDate ? format(birthDate, DATE_FORMAT_DB) : undefined,
        photo_client: profilePhotoPreview !== defaultProfilePhoto ? profilePhotoPreview : undefined
    };
    
    setIsLoadingProfile(true);
    try {
      if (currentUserProfile) {
        await updateClientMutation.mutateAsync({ 
          firebase_uid: currentUser.uid,
          data: dataToSave 
        });
        toast({ title: "Profil mis à jour !" });
      } else {
        await createClientMutation.mutateAsync(dataToSave);
        toast({ title: "Profil sauvegardé !" });
      }
      refetchClient();
    } catch (error: any) {
      toast({ title: "Erreur de sauvegarde", description: error.message, variant: "destructive"});
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const isLoading = isLoadingAuth || isLoadingUserRole;
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-16 h-16 animate-spin text-thai-orange"/></div>;
  }
  
  const optionsCommentConnu = ['Bouche à oreille', 'Réseaux sociaux', 'Recherche Google', 'En passant devant', 'Recommandation d\'un ami', 'Autre'];
  
  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardContent className="p-6 md:p-8">
            {authError && (<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"><p>{authError}</p></div>)}
            {!currentUser ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <img src={defaultProfilePhoto} alt="Logo Chanthana Thai Cook" className="w-24 h-24 mx-auto mb-4 rounded-full object-contain"/>
                  <h2 className="text-2xl font-bold text-thai-green">Accéder à mon compte</h2>
                </div>
                <div className="space-y-2 mb-2"><Label htmlFor="auth-email">Email *</Label><Input id="auth-email" type="email" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); setAuthError(null); }} placeholder="votreadresse@email.com" required /></div>
                <div className="space-y-2 mb-4"><Label htmlFor="auth-password">Mot de passe *</Label><Input id="auth-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setAuthError(null); }} placeholder="6 caractères min." required /></div>
                <div className="flex flex-col sm:flex-row gap-4"><Button onClick={() => handleAuthAction('login')} disabled={isLoadingAuth} className="flex-1 bg-thai-green"><LogIn className="mr-2 h-4 w-4" />Se connecter</Button><Button onClick={() => handleAuthAction('signup')} disabled={isLoadingAuth} className="flex-1 bg-thai-orange"><UserPlus className="mr-2 h-4 w-4" />Créer un compte</Button></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3 pt-4">
                  <div className="relative group">
                    <img src={profilePhotoPreview || defaultProfilePhoto} alt="Profil" className="w-32 h-32 rounded-full object-cover border-4 border-thai-orange shadow-lg"/>
                    
                    {/* Bouton d'upload */}
                    <Label htmlFor="photo-upload" className={cn(
                      "absolute bottom-1 right-1 bg-thai-green text-white p-2 rounded-full cursor-pointer hover:bg-thai-green/80 transition-colors shadow-lg",
                      isUploadingPhoto && "opacity-50 cursor-not-allowed"
                    )}>
                      {isUploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
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
                    {currentUserProfile?.photo_client && profilePhotoPreview !== defaultProfilePhoto && (
                      <button
                        onClick={handleDeletePhoto}
                        disabled={isUploadingPhoto}
                        className={cn(
                          "absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg",
                          isUploadingPhoto && "opacity-50 cursor-not-allowed"
                        )}
                        title="Supprimer la photo"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  {/* Aide pour l'utilisateur */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Formats acceptés: JPG, PNG, WEBP (max 5MB)
                    </p>
                    <p className="text-xs text-gray-400">
                      Cliquez sur l'icône caméra pour changer votre photo
                    </p>
                  </div>
                  {imgSrcForCrop && (
                    <Card className="mt-4 w-full p-4">
                      <h4 className="text-center text-lg font-medium text-thai-green mb-2">Recadrer votre photo</h4>
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
                          className="bg-thai-green hover:bg-thai-green-dark"
                          disabled={isUploadingPhoto}
                        >
                          {isUploadingPhoto ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                              Sauvegarde...
                            </>
                          ) : (
                            <>
                              <CheckSquare className="mr-2 h-4 w-4"/>
                              Appliquer
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={handleCancelCrop} 
                          variant="outline" 
                          className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"
                          disabled={isUploadingPhoto}
                        >
                          <XSquare className="mr-2 h-4 w-4"/>
                          Annuler
                        </Button>
                      </div>
                    </Card>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold text-thai-green text-center">{formData.prenom ? `Bonjour ${formData.prenom} !` : (profileEmail || currentUser.email)}</h2>
                  <Button onClick={handleLogout} disabled={isLoadingAuth} variant="ghost" size="sm" className="text-thai-orange hover:text-thai-orange-dark -mt-1"><LogOut className="mr-1 h-4 w-4" />Déconnexion</Button>
                </div>
                {!imgSrcForCrop && (
                  <form onSubmit={handleSubmitProfile} className="space-y-6 border-t border-thai-orange/10 pt-6">
                    <h3 className="text-xl font-semibold text-thai-green">Mes informations personnelles</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label htmlFor="nom">Nom *</Label><Input id="nom" name="nom" value={formData.nom} onChange={(e) => handleFormInputChange("nom", e.target.value)} required /></div>
                      <div><Label htmlFor="prenom">Prénom *</Label><Input id="prenom" name="prenom" value={formData.prenom} onChange={(e) => handleFormInputChange("prenom", e.target.value)} required /></div>
                    </div>
                    <div><Label htmlFor="numeroTelephone">Numéro de téléphone *</Label><Input id="numeroTelephone" name="numeroTelephone" type="tel" value={formData.numeroTelephone} onChange={(e) => handleFormInputChange("numeroTelephone", e.target.value)} required /></div>
                    <div className="space-y-2"><Label htmlFor="profile-email">Email de votre compte</Label><div className="flex items-center gap-2"><Input id="profile-email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} readOnly={!isEditingEmail} className={cn(!isEditingEmail && "bg-gray-100")}/>{!isEditingEmail ? (<Button type="button" variant="outline" size="sm" onClick={() => setIsEditingEmail(true)}><Edit3 className="mr-1 h-3 w-3"/>Modifier</Button>) : (<div className='flex gap-1'><Button type="button" size="sm" onClick={handleUpdateEmail} disabled={isLoadingAuth} className="bg-thai-green">OK</Button><Button type="button" variant="ghost" size="sm" onClick={() => {setIsEditingEmail(false); if(currentUser?.email)setProfileEmail(currentUser.email);}}>X</Button></div>)}</div>{isEditingEmail && <p className="text-xs text-gray-500">Sauvegardez. Une reconnexion peut être nécessaire.</p>}</div>
                    <div><Label htmlFor="adresseNumeroRue">Adresse (numéro et rue)</Label><Input id="adresseNumeroRue" name="adresseNumeroRue" value={formData.adresseNumeroRue} onChange={(e) => handleFormInputChange("adresseNumeroRue", e.target.value)} /></div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label htmlFor="codePostal">Code Postal</Label><Input id="codePostal" name="codePostal" type="text" pattern="[0-9]*" value={formData.codePostal} onChange={(e) => handleFormInputChange("codePostal", e.target.value)} /></div>
                      <div><Label htmlFor="ville">Ville</Label><Input id="ville" name="ville" value={formData.ville} onChange={(e) => handleFormInputChange("ville", e.target.value)} /></div>
                    </div>
                    <div className="space-y-2">
                      <Label>Date de naissance</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !birthDate && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4"/>
                                {birthDate ? format(birthDate, 'dd MMMM yyyy', { locale: fr }) : <span>Sélectionner une date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={birthDate}
                              onSelect={handleCalendarSelect}
                              month={calendarDisplayMonth}
                              onMonthChange={setCalendarDisplayMonth}
                              disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                              locale={fr}
                              captionLayout="dropdown-buttons"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              classNames={{
                                caption_label: 'hidden', 
                                caption_dropdowns: 'flex gap-2 justify-center p-2',
                                dropdown: 'appearance-none bg-background border border-input rounded-md px-2 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring',
                                dropdown_month: 'w-[120px]',
                                dropdown_year: 'w-[90px]',
                                vhidden: 'hidden',
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                    </div>
                    <div><Label htmlFor="preferenceClient">Vos Préférences</Label><Textarea id="preferenceClient" name="preferenceClient" value={formData.preferenceClient} onChange={(e) => handleFormInputChange("preferenceClient", e.target.value)} rows={3} placeholder="Allergies, végan, plat préféré..."/></div>
                    <div className="space-y-3"><Label>Comment avez-vous connu ChanthanaThaiCook ?</Label><div className="grid md:grid-cols-2 gap-3">{optionsCommentConnu.map((o) => (<div key={o} className="flex items-center space-x-2"><Checkbox id={`connu-${o}`} checked={formData.commentConnuChanthana.includes(o)} onCheckedChange={(c)=>handleCommentConnuChange(o,c as boolean)}/><Label htmlFor={`connu-${o}`} className="text-sm font-normal">{o}</Label></div>))}</div></div>
                    <div className="space-y-2"><Label>Souhaitez-vous recevoir les actualités et offres par e-mail ?</Label><RadioGroup value={formData.newsletterPreference} onValueChange={(v) => handleFormInputChange('newsletterPreference', v as any)} className="flex gap-4 pt-1"><div className="flex items-center space-x-2"><RadioGroupItem value="Oui, j'accepte" id="nl-oui"/><Label htmlFor="nl-oui" className="font-normal">Oui, j'accepte</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="non" id="nl-non"/><Label htmlFor="nl-non" className="font-normal">Non</Label></div></RadioGroup></div>
                    <Button type="submit" disabled={isLoadingProfile || !formData.nom || !formData.prenom || !formData.numeroTelephone } className="w-full bg-thai-orange"><Save className="mr-2 h-4 w-4" />{isLoadingProfile ? (currentUserProfile?.idclient ? 'Mise à jour...' : 'Sauvegarde...') : (currentUserProfile?.idclient ? 'Mettre à jour mon profil' : 'Sauvegarder mon profil')}</Button>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Profil.displayName = 'Profil';

export default Profil;
