'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

function ResetPasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le token depuis l'URL (Better Auth l'envoie via query params)
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Token manquant ou invalide. Veuillez demander un nouveau lien de réinitialisation.');
    }
    setToken(tokenParam);
  }, [searchParams]);

  const validatePasswords = () => {
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Token manquant. Veuillez demander un nouveau lien.');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.resetPassword({
        newPassword: newPassword,
        token: token,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      setSuccess(true);
      toast({
        title: 'Mot de passe modifié !',
        description: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      });

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push('/auth/login' as any);
      }, 2000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Une erreur est survenue lors de la réinitialisation';
      setError(errorMessage);
      toast({
        title: 'Erreur',
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
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-thai-orange/10 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-thai-orange" />
            </div>
            <CardTitle className="text-2xl font-bold text-thai-green">
              Nouveau mot de passe
            </CardTitle>
            <CardDescription className="text-sm text-thai-green/70 pt-2">
              Choisissez un nouveau mot de passe sécurisé
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-800">
                        Mot de passe modifié avec succès !
                      </p>
                      <p className="text-xs text-green-700">
                        Redirection vers la page de connexion...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : !token ? (
              <div className="space-y-6">
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  <p>{error || 'Token invalide ou expiré'}</p>
                </div>
                <Link href={"/auth/reset-password" as any}>
                  <Button variant="outline" className="w-full">
                    Demander un nouveau lien
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center animate-fade-in">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Minimum 8 caractères"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500">
                    Minimum 8 caractères requis
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Retapez votre mot de passe"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="w-full h-12 text-base transition-all duration-200 hover:shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-5 w-5" />
                  )}
                  Réinitialiser le mot de passe
                </Button>

                <div className="text-center text-sm">
                  <Link href={"/auth/login" as any} className="text-thai-orange hover:underline">
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-thai flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-thai-orange" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
