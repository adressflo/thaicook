"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Lock, Loader2, AlertCircle, CheckCircle2, Shield, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await changePasswordAction(formData);

      setResult(response);

      if (response.success) {
        // Clear form and redirect to profile after 2 seconds
        setTimeout(() => {
          router.push('/profil');
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        error: "Une erreur inattendue est survenue"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50 p-4 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/profil"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au profil
        </Link>

        <Card className="shadow-xl border-2 border-amber-100">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Modifier mon mot de passe
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Changez votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Security Notice */}
            <Alert className="bg-blue-50 border-blue-200">
              <Lock className="h-4 w-4 text-blue-700" />
              <AlertDescription className="text-sm text-blue-800 ml-2">
                <strong>Sécurité :</strong> Votre mot de passe doit contenir au moins 8 caractères,
                une majuscule, une minuscule, un chiffre et un caractère spécial.
              </AlertDescription>
            </Alert>

            {/* Result Messages */}
            {result && (
              <Alert className={
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }>
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-700" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-700" />
                )}
                <AlertDescription className={`ml-2 text-sm ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? result.message : result.error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                  Mot de passe actuel *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    disabled={isSubmitting}
                    className="pl-10 pr-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Nouveau mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    className="pl-10 pr-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Doit contenir: majuscule, minuscule, chiffre, caractère spécial
                </p>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    className="pl-10 pr-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Retapez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security Tips */}
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <AlertDescription className="text-sm text-amber-800 ml-2">
                  <strong>Conseils de sécurité :</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>N'utilisez jamais le même mot de passe sur plusieurs sites</li>
                    <li>Évitez les informations personnelles évidentes</li>
                    <li>Changez régulièrement votre mot de passe</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Modification en cours...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Modifier mon mot de passe
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profil')}
                  disabled={isSubmitting}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Mot de passe oublié ?{" "}
            <Link href="/auth/reset-password" className="text-amber-600 hover:text-amber-700 font-medium">
              Réinitialiser mon mot de passe
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
