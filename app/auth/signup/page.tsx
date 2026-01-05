'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2, AlertCircle, Home, Eye, EyeOff } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { createClientProfile, type SignUpProfileInput } from '../actions';
import { useRouter } from 'next/navigation';
import { DateBirthSelector } from '@/components/forms/DateBirthSelector';
import { format } from 'date-fns';

// Schema Zod pour validation du formulaire
const signupSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  numero_de_telephone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  // Champs optionnels
  date_de_naissance: z.string().optional(),
  adresse_numero_et_rue: z.string().optional(),
  code_postal: z.string().optional(),
  ville: z.string().optional(),
  preference_client: z.string().optional(),
  souhaitez_vous_recevoir_actualites: z.boolean(),
  comment_avez_vous_connu: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

// Options pour "Comment avez-vous connu Chanthana"
const sourceOptions = [
  { value: 'BoucheAOreille', label: 'Bouche à oreille' },
  { value: 'ReseauxSociaux', label: 'Réseaux sociaux' },
  { value: 'RechercheGoogle', label: 'Recherche Google' },
  { value: 'EnPassantDevant', label: 'En passant devant' },
  { value: 'RecommandationAmi', label: "Recommandation d'un ami" },
  { value: 'Autre', label: 'Autre' },
];

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [newsletterPreference, setNewsletterPreference] = useState<"Oui, j'accepte" | 'non'>("Oui, j'accepte");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      souhaitez_vous_recevoir_actualites: true,
    }
  });

  const handleSourceToggle = (value: string) => {
    setSelectedSources(prev => {
      const newSources = prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value];
      setValue('comment_avez_vous_connu', newSources);
      return newSources;
    });
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Étape 1: Créer le compte Better Auth
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.prenom} ${data.nom}`,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (!result.data?.user?.id) {
        throw new Error("Erreur lors de la création du compte");
      }

      // Étape 2: Créer le profil client dans client_db
      const profileData: SignUpProfileInput = {
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        numero_de_telephone: data.numero_de_telephone,
        date_de_naissance: data.date_de_naissance,
        adresse_numero_et_rue: data.adresse_numero_et_rue,
        code_postal: data.code_postal,
        ville: data.ville,
        preference_client: data.preference_client,
        souhaitez_vous_recevoir_actualites: data.souhaitez_vous_recevoir_actualites,
        comment_avez_vous_connu: selectedSources.length > 0
          ? selectedSources as any
          : undefined,
      };

      const profileResult = await createClientProfile(result.data.user.id, profileData);

      if (!profileResult.success) {
        throw new Error(profileResult.error || "Erreur lors de la création du profil");
      }

      toast({
        title: 'Compte créé avec succès !',
        description: 'Vérifiez votre email pour activer votre compte, puis connectez-vous.',
      });

      // Redirection vers la page de connexion
      router.push('/auth/login' as any);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      setAuthError(errorMessage);
      toast({
        title: 'Erreur lors de la création du compte',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex justify-center">
          <Link href="/" passHref>
            <Button
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white border-thai-orange/20 hover:border-thai-orange/40 text-thai-green hover:text-thai-green transition-all duration-200 shadow-md hover:shadow-lg rounded-full px-4 py-2 group"
            >
              <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-thai-orange/10 rounded-full flex items-center justify-center">
              <img
                src="/logo.ico"
                alt="Logo Chanthana Thai Cook"
                className="w-14 h-14 rounded-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-thai-green">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-sm text-thai-green/70 pt-2">
              Rejoignez-nous pour une expérience culinaire unique.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center animate-fade-in">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  <p>{authError}</p>
                </div>
              )}

              {/* Section Compte */}
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg text-thai-green">
                  Informations de connexion
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="votreadresse@email.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Min. 8 caractères"
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum 8 caractères requis
                    </p>
                    {errors.password && (
                      <p className="text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmer le mot de passe *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        placeholder="Confirmer"
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Informations personnelles */}
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg text-thai-green">
                  Informations personnelles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      {...register('nom')}
                      placeholder="Votre nom"
                      disabled={isLoading}
                    />
                    {errors.nom && (
                      <p className="text-sm text-red-600">
                        {errors.nom.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      {...register('prenom')}
                      placeholder="Votre prénom"
                      disabled={isLoading}
                    />
                    {errors.prenom && (
                      <p className="text-sm text-red-600">
                        {errors.prenom.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero_de_telephone">Téléphone *</Label>
                  <Input
                    id="numero_de_telephone"
                    type="tel"
                    {...register('numero_de_telephone')}
                    placeholder="06 12 34 56 78"
                    disabled={isLoading}
                  />
                  {errors.numero_de_telephone && (
                    <p className="text-sm text-red-600">
                      {errors.numero_de_telephone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Section Adresse (optionnel) */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg text-thai-green">
                  Adresse (optionnel)
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="adresse_numero_et_rue">Numéro et rue</Label>
                  <Input
                    id="adresse_numero_et_rue"
                    {...register('adresse_numero_et_rue')}
                    placeholder="123 rue de la Paix"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code_postal">Code postal</Label>
                    <Input
                      id="code_postal"
                      {...register('code_postal')}
                      placeholder="75000"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      {...register('ville')}
                      placeholder="Paris"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Section Date de naissance */}
              <div className="space-y-4 p-4 border rounded-lg">
                <DateBirthSelector
                  value={birthDate}
                  onChange={date => {
                    setBirthDate(date);
                    // Synchroniser avec react-hook-form
                    if (date && date instanceof Date && !isNaN(date.getTime())) {
                      try {
                        setValue('date_de_naissance', format(date, 'yyyy-MM-dd'));
                      } catch (error) {
                        console.error('Error formatting date:', error, 'Date object:', date);
                        setValue('date_de_naissance', undefined);
                      }
                    } else {
                      setValue('date_de_naissance', undefined);
                    }
                  }}
                  labelText="Date de naissance (optionnel)"
                  showHelperText={true}
                />
                {errors.date_de_naissance && (
                  <p className="text-sm text-red-600">
                    {errors.date_de_naissance.message}
                  </p>
                )}
              </div>

              {/* Section Préférences */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="preference_client">
                    Vos Préférences (optionnel)
                  </Label>
                  <Textarea
                    id="preference_client"
                    {...register('preference_client')}
                    rows={3}
                    placeholder="Allergies, végan, plat préféré..."
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-3">
                  <Label>
                    Comment avez-vous connu ChanthanaThaiCook ? (optionnel)
                  </Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {sourceOptions.map(option => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`source-${option.value}`}
                          checked={selectedSources.includes(option.value)}
                          onCheckedChange={() =>
                            handleSourceToggle(option.value)
                          }
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor={`source-${option.value}`}
                          className="text-sm font-normal"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>
                    Souhaitez-vous recevoir les actualités et offres par e-mail
                    ? *
                  </Label>
                  <RadioGroup
                    value={newsletterPreference}
                    onValueChange={(v: string) => {
                      const value = v as "Oui, j'accepte" | 'non';
                      setNewsletterPreference(value);
                      setValue(
                        'souhaitez_vous_recevoir_actualites',
                        value === "Oui, j'accepte"
                      );
                    }}
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
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base transition-all duration-200 hover:shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-5 w-5" />
                )}
                Créer mon compte
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Vous avez déjà un compte ?</span>
              <Link href={'/auth/login' as any}>
                <Button
                  variant="link"
                  className="text-thai-orange hover:underline px-1"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
