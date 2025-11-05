"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccountAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Trash2, Lock, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await deleteAccountAction(formData);

      setResult(response);

      if (response.success) {
        // Redirect to homepage after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 p-4 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/profil"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au profil
        </Link>

        <Card className="shadow-xl border-2 border-red-200">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Supprimer mon compte
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Cette action est irréversible et définitive
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Critical Warning */}
            <Alert className="bg-red-50 border-red-300 border-2">
              <AlertTriangle className="h-5 w-5 text-red-700" />
              <AlertDescription className="text-sm text-red-900 ml-2">
                <strong className="block mb-2 text-base">⚠️ ATTENTION - ACTION IRRÉVERSIBLE</strong>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Votre compte sera <strong>définitivement supprimé</strong></li>
                  <li>Toutes vos données personnelles seront <strong>anonymisées</strong></li>
                  <li>Vos commandes historiques resteront archivées (conformité RGPD)</li>
                  <li>Vous ne pourrez <strong>plus récupérer votre compte</strong></li>
                  <li>Vous serez immédiatement déconnecté</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* GDPR Compliance Notice */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-700" />
              <AlertDescription className="text-sm text-blue-800 ml-2">
                <strong>Conformité RGPD :</strong> Conformément au règlement européen sur la protection des données (RGPD),
                vous avez le droit de demander la suppression de vos données personnelles. Vos données seront anonymisées
                et votre compte sera supprimé sous 24 heures.
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
                  <AlertTriangle className="h-4 w-4 text-red-700" />
                )}
                <AlertDescription className={`ml-2 text-sm ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? result.message : result.error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Confirmer votre mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isSubmitting}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Entrez votre mot de passe"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Votre mot de passe actuel est requis pour confirmer la suppression
                </p>
              </div>

              {/* Text Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="confirmation" className="text-sm font-medium text-gray-700">
                  Taper "SUPPRIMER MON COMPTE" pour confirmer *
                </Label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                  <Input
                    id="confirmation"
                    name="confirmation"
                    type="text"
                    required
                    disabled={isSubmitting}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500 font-mono"
                    placeholder="SUPPRIMER MON COMPTE"
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-red-600 font-medium">
                  ⚠️ Vous devez taper exactement "SUPPRIMER MON COMPTE" en majuscules
                </p>
              </div>

              {/* Final Warning */}
              <Alert className="bg-yellow-50 border-yellow-300">
                <AlertTriangle className="h-4 w-4 text-yellow-700" />
                <AlertDescription className="text-sm text-yellow-900 ml-2">
                  <strong>Dernière chance :</strong> Une fois que vous aurez cliqué sur le bouton ci-dessous,
                  votre compte sera immédiatement supprimé. Cette action ne peut pas être annulée.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profil')}
                  disabled={isSubmitting}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Non, garder mon compte
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suppression en cours...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Oui, supprimer définitivement
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Help Section */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Vous rencontrez un problème avec votre compte ?{" "}
                <a href="mailto:chanthanacook@gmail.com" className="text-amber-600 hover:text-amber-700 font-medium">
                  Contactez notre support
                </a>
                {" "}avant de supprimer votre compte.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Section */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Vous voulez juste faire une pause ?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Si vous souhaitez simplement ne plus recevoir d'emails ou faire une pause temporaire,
            vous pouvez désactiver les notifications dans vos{" "}
            <Link href="/profil" className="text-amber-600 hover:text-amber-700 font-medium">
              paramètres de profil
            </Link>.
          </p>
          <p className="text-xs text-gray-500">
            💡 La suppression de compte est une mesure définitive. Pensez à explorer d'autres options d'abord.
          </p>
        </div>
      </div>
    </div>
  );
}
