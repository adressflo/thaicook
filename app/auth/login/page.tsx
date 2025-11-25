'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Loader2, AlertCircle, Home } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await authClient.signIn.email({
        email: email,
        password: password,
        rememberMe: rememberMe,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast({
        title: 'Connexion réussie !',
        description: 'Bienvenue à nouveau.',
      });

      // Rediriger vers la page de profil après connexion
      router.push('/profil');

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Email ou mot de passe incorrect';
      setAuthError(errorMessage);
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

              />
            </div>
            <CardTitle className="text-2xl font-bold text-thai-green">
              Se connecter
            </CardTitle>
            <CardDescription className="text-sm text-thai-green/70 pt-2">
              Heureux de vous revoir !
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center animate-fade-in">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  <p>{authError}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="votreadresse@email.com"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean | "indeterminate") => setRememberMe(checked === true)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-normal cursor-pointer select-none"
                  >
                    Se souvenir de moi
                  </Label>
                </div>
                <Link
                  href={'/auth/reset-password' as any}
                  className="text-sm text-thai-orange hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-12 text-base transition-all duration-200 hover:shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-5 w-5" />
                )}
                Se connecter
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Pas encore de compte ?</span>
              <Link href="/auth/signup" passHref>
                <Button
                  variant="link"
                  className="text-thai-orange hover:underline px-1"
                >
                  Créer un compte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
