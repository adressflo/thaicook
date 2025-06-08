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
import { CalendarIcon, User, LogIn, UserPlus, LogOut, Save, Edit3, Camera, CheckSquare, XSquare, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid as isValidDate, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateEmail } from 'firebase/auth';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateClient, useUpdateClient } from '@/hooks/useAirtable';
import type { ClientInputData } from '@/types/airtable';

const DATE_FORMAT_AIRTABLE = "yyyy-MM-dd";

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
  const { currentUser, isLoadingAuth, currentUserAirtableData, isLoadingUserRole, refetchClient } = useAuth();
  
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
  const defaultProfilePhoto = "/lovable-uploads/62d46b15-aa56-45d2-ab7d-75dfee70f70d.png";
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>(defaultProfilePhoto);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [imgSrcForCrop, setImgSrcForCrop] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const imgCropRef = useRef<HTMLImageElement>(null);
  const [aspectRatio] = useState<number | undefined>(1);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);

  useEffect(() => {
    if (currentUser) {
        setProfileEmail(currentUser.email || '');
    }
    if (currentUserAirtableData) {
      setFormData({
        nom: currentUserAirtableData.Nom || '',
        prenom: currentUserAirtableData.Prénom || '',
        preferenceClient: currentUserAirtableData['Préférence client'] || '',
        numeroTelephone: currentUserAirtableData['Numéro de téléphone'] || '',
        adresseNumeroRue: currentUserAirtableData['Adresse (numéro et rue)'] || '',
        codePostal: currentUserAirtableData['Code postal']?.toString() || '',
        ville: currentUserAirtableData.Ville || '',
        commentConnuChanthana: currentUserAirtableData['Comment avez-vous connu ChanthanaThaiCook ?'] || [],
        newsletterPreference: currentUserAirtableData['Souhaitez-vous recevoir les actualités et offres par e-mail ?'] === 'Oui' ? 'Oui, j\'accepte' : 'non',
      });
      setProfilePhotoPreview(currentUserAirtableData['Photo Client']?.[0]?.url || defaultProfilePhoto);
      if (currentUserAirtableData['Date de naissance']) {
        const parsedDate = parse(currentUserAirtableData['Date de naissance'], DATE_FORMAT_AIRTABLE, new Date());
        if (isValidDate(parsedDate)) {
             setBirthDate(parsedDate);
             setCalendarDisplayMonth(parsedDate);
        }
      }
    } else {
        setFormData(initialFormData);
    }
  }, [currentUser, currentUserAirtableData]);
  
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
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => { /* ... */ };
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => { /* ... */ };
  const handleApplyCrop = () => { /* ... */ };
  const handleCancelCrop = () => { setImgSrcForCrop(''); };
  const handleCalendarSelect = (date: Date | undefined) => { setBirthDate(date); setIsCalendarOpen(false); };

  const handleSubmitAirtableProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;

    const dataToSave: ClientInputData = {
        'Nom': formData.nom,
        'Prénom': formData.prenom,
        'e-mail': profileEmail,
        'Préférence client': formData.preferenceClient,
        'Numéro de téléphone': formData.numeroTelephone,
        'Adresse (numéro et rue)': formData.adresseNumeroRue,
        'Code postal': formData.codePostal ? parseInt(formData.codePostal, 10) : undefined,
        'Ville': formData.ville,
        'Comment avez-vous connu ChanthanaThaiCook ?': formData.commentConnuChanthana,
        'Souhaitez-vous recevoir les actualités et offres par e-mail ?': formData.newsletterPreference === 'Oui, j\'accepte' ? 'Oui' : 'Non/Pas de réponse',
        'Date de naissance': birthDate ? format(birthDate, DATE_FORMAT_AIRTABLE) : undefined,
        'FirebaseUID': currentUser.uid,
    };
    
    setIsLoadingProfile(true);
    try {
      if (currentUserAirtableData?.id) {
        await updateClientMutation.mutateAsync({ recordId: currentUserAirtableData.id, clientData: dataToSave });
        toast({ title: "Profil mis à jour !" });
      } else {
        await createClientMutation.mutateAsync({ ...dataToSave, Role: 'client' });
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
                  <div className="relative"><img src={profilePhotoPreview || defaultProfilePhoto} alt="Profil" className="w-32 h-32 rounded-full object-cover border-4 border-thai-orange shadow-lg"/><Label htmlFor="photo-upload" className="absolute bottom-1 right-1 bg-thai-green text-white p-2 rounded-full cursor-pointer hover:bg-thai-green-light transition-colors shadow"><Camera size={16} /><Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} /></Label></div>
                  {imgSrcForCrop && (
                    <Card className="mt-4 w-full p-4"><h4 className="text-center text-lg font-medium text-thai-green mb-2">Recadrer votre photo</h4><div className="flex justify-center items-center max-h-96 overflow-hidden"><ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={aspectRatio} minWidth={100} minHeight={100}><img ref={imgCropRef} alt="Crop me" src={imgSrcForCrop} onLoad={onImageLoad} style={{ maxHeight: '350px', objectFit: 'contain' }} /></ReactCrop></div><div className="flex justify-center gap-4 mt-4"><Button onClick={handleApplyCrop} className="bg-thai-green hover:bg-thai-green-dark"><CheckSquare className="mr-2 h-4 w-4"/>Appliquer</Button><Button onClick={handleCancelCrop} variant="outline" className="border-thai-orange text-thai-orange hover:bg-thai-orange/10"><XSquare className="mr-2 h-4 w-4"/>Annuler</Button></div></Card>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold text-thai-green text-center">{formData.prenom ? `Bonjour ${formData.prenom} !` : (profileEmail || currentUser.email)}</h2>
                  <Button onClick={handleLogout} disabled={isLoadingAuth} variant="ghost" size="sm" className="text-thai-orange hover:text-thai-orange-dark -mt-1"><LogOut className="mr-1 h-4 w-4" />Déconnexion</Button>
                </div>
                {!imgSrcForCrop && (
                  <form onSubmit={handleSubmitAirtableProfile} className="space-y-6 border-t border-thai-orange/10 pt-6">
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
                    <Button type="submit" disabled={isLoadingProfile || !formData.nom || !formData.prenom || !formData.numeroTelephone } className="w-full bg-thai-orange"><Save className="mr-2 h-4 w-4" />{isLoadingProfile ? (currentUserAirtableData?.id ? 'Mise à jour...' : 'Sauvegarde...') : (currentUserAirtableData?.id ? 'Mettre à jour mon profil' : 'Sauvegarder mon profil')}</Button>
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
