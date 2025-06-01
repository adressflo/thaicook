// src/pages/Profil.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, User, LogIn, UserPlus, LogOut, Save, Edit3, Camera } from 'lucide-react'; // Assure-toi que Camera est bien listé ici
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid as isValidDate, startOfDay, type Locale } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useCreateClient, useClientByFirebaseUID, useUpdateClient, MappedClientData } from '@/hooks/useAirtable';

import { auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  type User as FirebaseUser
} from 'firebase/auth';

const DATE_FORMAT_DISPLAY = "dd/MM/yyyy"; 
const DATE_FORMAT_AIRTABLE = "yyyy-MM-dd"; 

const Profil = () => {
  const { toast } = useToast();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient(); 
  
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); 
  const [authError, setAuthError] = useState<string | null>(null);

  const [profileEmail, setProfileEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [birthDateInput, setBirthDateInput] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarDisplayMonth, setCalendarDisplayMonth] = useState<Date>(startOfDay(new Date(1990,0,1)));

  const defaultProfilePhoto = "/lovable-uploads/62d46b15-aa56-45d2-ab7d-75dfee70f70d.png"; 
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(defaultProfilePhoto);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  const initialFormData = {
    nom: '', prenom: '', preferenceClient: '', numeroTelephone: '',
    adresseNumeroRue: '', codePostal: '', ville: '',
    commentConnuChanthana: [] as string[], newsletterPreference: 'non'
  };
  const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);

  const { client: airtableClientData, airtableRecordId, isLoading: isLoadingAirtableClient, refetchClient } = 
    useClientByFirebaseUID(currentUser?.uid);

  useEffect(() => {
    setIsLoadingAuth(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        setProfileEmail(user.email);
      } else {
        setLoginEmail(''); setPassword(''); setProfileEmail(''); setIsEditingEmail(false);
        setFormData(initialFormData);
        setBirthDate(undefined); setBirthDateInput(''); setAuthError(null);
        setCalendarDisplayMonth(startOfDay(new Date(1990,0,1)));
        setProfilePhotoPreview(defaultProfilePhoto); 
        setSelectedPhotoFile(null);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [defaultProfilePhoto]);

  useEffect(() => {
    if (currentUser && !isLoadingAirtableClient) {
      if (airtableClientData) {
        setFormData({
          nom: airtableClientData.nom || '',
          prenom: airtableClientData.prenom || '',
          preferenceClient: airtableClientData.preferenceClient || '',
          numeroTelephone: airtableClientData.numeroTelephone || '',
          adresseNumeroRue: airtableClientData.adresseNumeroRue || '',
          codePostal: airtableClientData.codePostal?.toString() || '',
          ville: airtableClientData.ville || '',
          commentConnuChanthana: airtableClientData.commentConnuChanthana || [],
          newsletterPreference: airtableClientData.newsletterPreference || 'non',
        });
        setProfilePhotoPreview(airtableClientData.photoClientUrl || defaultProfilePhoto); 
        if (airtableClientData.dateNaissance) {
          let parsedDate = parse(airtableClientData.dateNaissance, DATE_FORMAT_AIRTABLE, new Date());
          if (!isValidDate(parsedDate)) {
            parsedDate = parse(airtableClientData.dateNaissance, "dd/MM/yyyy", new Date());
          }
          if (isValidDate(parsedDate)) {
            setBirthDate(parsedDate);
            setCalendarDisplayMonth(parsedDate);
          } else {
            setBirthDate(undefined); setBirthDateInput('');
          }
        } else {
          setBirthDate(undefined); setBirthDateInput('');
        }
      } else {
        setFormData(initialFormData);
        setBirthDate(undefined); setBirthDateInput('');
        setProfilePhotoPreview(defaultProfilePhoto);
      }
    }
  }, [currentUser, airtableClientData, isLoadingAirtableClient, defaultProfilePhoto]);

  useEffect(() => {
    if (birthDate) { 
      setBirthDateInput(format(birthDate, DATE_FORMAT_DISPLAY));
    }
  }, [birthDate]);

  const formatInputToDateDisplayHelper = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };
  
  const handleBirthDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatInputToDateDisplayHelper(rawValue);
    setBirthDateInput(formattedValue);
    if (formattedValue.length === DATE_FORMAT_DISPLAY.length) {
      const parsedDate = parse(formattedValue, DATE_FORMAT_DISPLAY, new Date());
      if (isValidDate(parsedDate)) {
        const minDate=startOfDay(new Date("1900-01-01")); const maxDate=startOfDay(new Date());
        const dayInput=parseInt(formattedValue.slice(0,2),10); const monthInput=parseInt(formattedValue.slice(3,5),10); const yearInput=parseInt(formattedValue.slice(6,10),10);
        if(parsedDate.getDate()===dayInput && (parsedDate.getMonth()+1)===monthInput && parsedDate.getFullYear()===yearInput && parsedDate>=minDate && parsedDate<=maxDate){
          if(!birthDate || birthDate.getTime()!==parsedDate.getTime()){setBirthDate(parsedDate); setCalendarDisplayMonth(parsedDate);}}
        else {if(birthDate!==undefined)setBirthDate(undefined);}}
      else {if(birthDate!==undefined)setBirthDate(undefined);}}
    else {if(birthDate!==undefined)setBirthDate(undefined);}};
  
  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    setBirthDate(selectedDate); 
    if (selectedDate) { setBirthDateInput(format(selectedDate, DATE_FORMAT_DISPLAY)); setCalendarDisplayMonth(selectedDate);}
    else {setBirthDateInput('');}
    setIsCalendarOpen(false);
  };

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setIsLoadingAuth(true); setAuthError(null);
    try {
      if (action === 'signup') { await createUserWithEmailAndPassword(auth, loginEmail, password); toast({ title: "Compte créé !" });}
      else { await signInWithEmailAndPassword(auth, loginEmail, password); toast({ title: "Connecté !" });}
    } catch (error: any) {
      let msg="Erreur."; if(error.code==='auth/email-already-in-use')msg="Email déjà utilisé."; else if(error.code==='auth/user-disabled')msg="Compte désactivé."; else if(['auth/wrong-password','auth/user-not-found','auth/invalid-credential'].includes(error.code))msg="Email/mot de passe incorrect."; else if(error.code==='auth/weak-password')msg="Mot de passe trop court.";
      setAuthError(msg); toast({ title: "Erreur", description: msg, variant: "destructive" });
    } setIsLoadingAuth(false);
  };

  const handleLogout = async () => {
    setIsLoadingAuth(true);
    try { await signOut(auth); setLoginEmail(''); setPassword(''); toast({ title: "Déconnecté" });}
    catch (error: any) { toast({ title: "Erreur", description: error.message, variant: "destructive" });}
    setIsLoadingAuth(false);
  };
  
  const handleUpdateEmail = async () => {
    if (!currentUser || !profileEmail || profileEmail === currentUser.email) {
      toast({description: "Aucun changement."}); setIsEditingEmail(false); return;
    }
    setIsLoadingAuth(true);
    try {
      await updateEmail(currentUser, profileEmail);
      toast({ title: "Email mis à jour !" }); setIsEditingEmail(false);
      if (airtableRecordId) { 
        const emailUpdateData: Partial<ClientInputData> = { email: profileEmail };
        await updateClient.mutateAsync({ recordId: airtableRecordId, clientData: emailUpdateData }); 
        refetchClient(); 
      }
    } catch (error: any) {
      let msg = "Impossible de mettre à jour l'email."; if(error.code === 'auth/requires-recent-login')msg="Reconnexion récente requise."; else if (error.code === 'auth/email-already-in-use')msg="Email déjà utilisé."; else if (error.code === 'auth/invalid-email')msg="Format email invalide.";
      toast({ title: "Erreur", description: msg, variant: "destructive" }); if(currentUser?.email)setProfileEmail(currentUser.email);
    } setIsLoadingAuth(false);
  };

  const handleFormInputChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCommentConnuChange = (option: string, checked: boolean) => {
    const currentKnownFrom = formData.commentConnuChanthana;
    const newKnownFrom = checked ? [...currentKnownFrom, option] : currentKnownFrom.filter(item => item !== option);
    setFormData(prev => ({ ...prev, commentConnuChanthana: newKnownFrom }));
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedPhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
      toast({ description: "Photo sélectionnée. La sauvegarde et l'upload ne sont pas encore implémentés."});
    }
  };

  const handleSubmitAirtableProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !profileEmail) { toast({ title: "Erreur", description: "Connectez-vous.", variant: "destructive" }); return; }
 if (birthDateInput && !birthDate) { toast({ title: "Date naissance invalide", description: `Format attendu : ${DATE_FORMAT_DISPLAY}.`, variant: "destructive"}); return;}
    const codePostalValue = formData.codePostal.trim(); let codePostalNum: number | undefined = undefined;
    if (codePostalValue) { codePostalNum = parseInt(codePostalValue, 10); if (isNaN(codePostalNum)) { toast({ title: "Erreur", description: "Code postal doit être un nombre.", variant: "destructive"}); setIsLoadingProfile(false); return;}}
    
    setIsLoadingProfile(true);
    try {
      const dataToSave: ClientInputData = {
        nom: formData.nom.trim(), prenom: formData.prenom.trim(), preferenceClient: formData.preferenceClient.trim(),
        numeroTelephone: formData.numeroTelephone.trim(), email: profileEmail, 
        adresseNumeroRue: formData.adresseNumeroRue.trim(), codePostal: codePostalNum, ville: formData.ville.trim(),
        commentConnuChanthana: formData.commentConnuChanthana,
        dateNaissance: birthDate ? format(birthDate, DATE_FORMAT_AIRTABLE) : undefined,
        firebaseUID: currentUser.uid, 
        newsletterOptIn: formData.newsletterPreference || "non",
      };
      
      if (airtableRecordId) {
        const { firebaseUID, ...updateData } = dataToSave as any; 
        await updateClient.mutateAsync({ recordId: airtableRecordId, clientData: updateData });
        toast({ title: "Profil mis à jour !" });
      } else {
        await createClient.mutateAsync(dataToSave);
        toast({ title: "Profil sauvegardé !" });
      }
      refetchClient();
    } catch (error: any) {
      toast({ title: "Erreur Profil Airtable", description: error?.message || "Erreur sauvegarde.", variant: "destructive"});
      console.error("Détail erreur Airtable:", error);
    }
    setIsLoadingProfile(false);
  };

  const optionsCommentConnu = ['Bouche à oreille', 'Réseaux sociaux', 'Recherche Google', 'En passant devant', 'Recommandation d\'un ami', 'Autre'];

  // CORRIGÉ : Chaîne de formatage correcte
  const formatCaptionForCalendar: (date: Date, options?: { locale?: Locale }) => React.ReactNode = (date, options) => {
    return <>{format(date, "LLLL yyyy", { locale: options?.locale })}</>; 
  };

  if (isLoadingAuth && !currentUser) { 
    return <div className="flex items-center justify-center min-h-screen bg-gradient-thai"><div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin"></div></div>;
  }

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
                <div className="space-y-2 mb-2">
                  <Label htmlFor="auth-email">Email *</Label>
                  <Input id="auth-email" type="email" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); setAuthError(null); }} placeholder="votreadresse@email.com" required />
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="auth-password">Mot de passe *</Label>
                  <Input id="auth-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setAuthError(null); }} placeholder="6 caractères min." required />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => handleAuthAction('login')} disabled={isLoadingAuth || !loginEmail || !password} className="flex-1 bg-thai-green"><LogIn className="mr-2 h-4 w-4" />{isLoadingAuth ? 'Connexion...' : 'Se connecter'}</Button>
                  <Button onClick={() => handleAuthAction('signup')} disabled={isLoadingAuth || !loginEmail || !password} className="flex-1 bg-thai-orange"><UserPlus className="mr-2 h-4 w-4" />{isLoadingAuth ? 'Création...' : 'Créer un compte'}</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3 pt-4">
                  <div className="relative">
                    <img 
                      src={profilePhotoPreview || defaultProfilePhoto} 
                      alt="Profil" 
                      className="w-32 h-32 rounded-full object-contain border-4 border-thai-orange shadow-lg"
                    />
                    <Label htmlFor="photo-upload" className="absolute bottom-1 right-1 bg-thai-green text-white p-2 rounded-full cursor-pointer hover:bg-thai-green-light transition-colors shadow">
                      <Camera size={16}/>
                      <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}/>
                    </Label>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-thai-green text-center">
                    {formData.prenom ? `Bonjour ${formData.prenom} !` : (profileEmail || currentUser.email)}
                  </h2>
                  <Button onClick={handleLogout} disabled={isLoadingAuth} variant="ghost" size="sm" className="text-thai-orange hover:text-thai-orange-dark -mt-1">
                    <LogOut className="mr-1 h-4 w-4" />Déconnexion
                  </Button>
                </div>
                
                <form onSubmit={handleSubmitAirtableProfile} className="space-y-6 border-t border-thai-orange/10 pt-6">
                  <h3 className="text-xl font-semibold text-thai-green">Mes informations personnelles</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label htmlFor="nom">Nom *</Label><Input id="nom" value={formData.nom} onChange={(e) => handleFormInputChange('nom', e.target.value)} required /></div>
                    <div><Label htmlFor="prenom">Prénom *</Label><Input id="prenom" value={formData.prenom} onChange={(e) => handleFormInputChange('prenom', e.target.value)} required /></div>
                  </div>
                  <div><Label htmlFor="numeroTelephone">Numéro de téléphone *</Label><Input id="numeroTelephone" type="tel" value={formData.numeroTelephone} onChange={(e) => handleFormInputChange('numeroTelephone', e.target.value)} required /></div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email de votre compte</Label>
                    <div className="flex items-center gap-2">
                      <Input id="profile-email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} readOnly={!isEditingEmail} className={cn(!isEditingEmail && "bg-gray-100")}/>
                      {!isEditingEmail ? (<Button type="button" variant="outline" size="sm" onClick={() => setIsEditingEmail(true)}><Edit3 className="mr-1 h-3 w-3"/>Modifier</Button>) : (<div className='flex gap-1'><Button type="button" size="sm" onClick={handleUpdateEmail} disabled={isLoadingAuth} className="bg-thai-green">OK</Button><Button type="button" variant="ghost" size="sm" onClick={() => {setIsEditingEmail(false); if(currentUser?.email)setProfileEmail(currentUser.email);}}>X</Button></div>)}
                    </div>
                    {isEditingEmail && <p className="text-xs text-gray-500">Sauvegardez. Une reconnexion peut être nécessaire.</p>}
                  </div>
                  <div><Label htmlFor="adresseNumeroRue">Adresse (numéro et rue)</Label><Input id="adresseNumeroRue" value={formData.adresseNumeroRue} onChange={(e) => handleFormInputChange('adresseNumeroRue', e.target.value)} /></div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label htmlFor="codePostal">Code Postal</Label><Input id="codePostal" type="text" pattern="[0-9]*" value={formData.codePostal} onChange={(e) => handleFormInputChange('codePostal', e.target.value)} /></div>
                    <div><Label htmlFor="ville">Ville</Label><Input id="ville" value={formData.ville} onChange={(e) => handleFormInputChange('ville', e.target.value)} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDateInput">Date de naissance ({DATE_FORMAT_DISPLAY})</Label>
                    <div className="flex items-center gap-2">
                      <Input type="text" id="birthDateInput" value={birthDateInput} onChange={handleBirthDateInputChange} placeholder={DATE_FORMAT_DISPLAY} maxLength={10}/>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild><Button variant="outline" id="birthdate-popover-trigger"><CalendarIcon/></Button></PopoverTrigger>
                        <PopoverContent className="w-auto min-w-[280px] p-0"><Calendar mode="single" selected={birthDate} onSelect={handleCalendarSelect} month={calendarDisplayMonth} onMonthChange={setCalendarDisplayMonth} disabled={(d) => d > new Date() || d < new Date("1900-01-01")} locale={fr} captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear()} formatters={{ formatCaption: formatCaptionForCalendar }}/></PopoverContent>
                      </Popover>
                    </div>
                    {birthDateInput && birthDateInput.length === 10 && !birthDate && <p className="text-xs text-red-500 mt-1">Format incorrect ou date invalide.</p>}
                  </div>
                  <div><Label htmlFor="preferenceClient">Vos Préférences</Label><Textarea id="preferenceClient" value={formData.preferenceClient} onChange={(e) => handleFormInputChange('preferenceClient', e.target.value)} rows={3} placeholder="Allergies, végan, plat préféré..."/></div>
                  <div className="space-y-3">
                    <Label>Comment avez-vous connu ChanthanaThaiCook ?</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {optionsCommentConnu.map((o) => (<div key={o} className="flex items-center space-x-2"><Checkbox id={`connu-${o}`} checked={formData.commentConnuChanthana.includes(o)} onCheckedChange={(c)=>handleCommentConnuChange(o,c as boolean)}/><Label htmlFor={`connu-${o}`} className="text-sm font-normal">{o}</Label></div>))}
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label>Souhaitez-vous recevoir les actualités et offres par e-mail ?</Label>
                     <RadioGroup value={formData.newsletterPreference} onValueChange={(v) => handleFormInputChange('newsletterPreference', v as string)} className="flex gap-4 pt-1">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Oui, j'accepte" id="nl-oui"/><Label htmlFor="nl-oui" className="font-normal">Oui, j'accepte</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="non" id="nl-non"/><Label htmlFor="nl-non" className="font-normal">Non</Label></div>
                      </RadioGroup>
                  </div>
                  <div className="bg-thai-cream/30 p-4 rounded-lg"><p className="text-sm"><strong>Protection des données :</strong> Les données collectées sont utilisées exclusivement pour le traitement des commandes.</p></div>
                  <Button type="submit" disabled={isLoadingProfile || !formData.nom || !formData.prenom || !formData.numeroTelephone } className="w-full bg-thai-orange"><Save className="mr-2 h-4 w-4" />{isLoadingProfile ? (airtableRecordId ? 'Mise à jour...' : 'Sauvegarde...') : (airtableRecordId ? 'Mettre à jour mon profil' : 'Sauvegarder mon profil')}</Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profil;
