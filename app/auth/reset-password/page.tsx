'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function ResetPasswordPage() {
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await authClient.forgetPassword({
        email: email,
        redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      setSuccess(true);
      toast({
        title: 'Email envoyé !',
        description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.',
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
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
        <div className="mb-6 flex justify-center">
          <Link href={"/auth/login" as any}>
            <Button
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white border-thai-orange/20 hover:border-thai-orange/40 text-thai-green hover:text-thai-green transition-all duration-200 shadow-md hover:shadow-lg rounded-full px-4 py-2 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              Retour à la connexion
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-thai-orange/10 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-thai-orange" />
            </div>
            <CardTitle className="text-2xl font-bold text-thai-green">
              Réinitialiser le mot de passe
            </CardTitle>
            <CardDescription className="text-sm text-thai-green/70 pt-2">
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-800">Email envoyé avec succès !</p>
                      <p className="text-xs text-green-700">
                        Vérifiez votre boîte mail <span className="font-semibold">{email}</span>
                        {' '}pour réinitialiser votre mot de passe.
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Le lien expire dans 15 minutes.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Renvoyer un email
                </Button>

                <div className="text-center text-sm">
                  <Link href={"/auth/login" as any} className="text-thai-orange hover:underline">
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetRequest} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center animate-fade-in">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="votreadresse@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-12 text-base transition-all duration-200 hover:shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-5 w-5" />
                  )}
                  Envoyer le lien de réinitialisation
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <p>Vous recevrez un email avec un lien pour créer un nouveau mot de passe.</p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
