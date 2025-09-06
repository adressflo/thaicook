'use client';

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ZodError } from "zod";

interface ValidationErrorDisplayProps {
  error: ZodError | null;
  onDismiss?: () => void;
  className?: string;
}

export function ValidationErrorDisplay({ 
  error, 
  onDismiss, 
  className = "" 
}: ValidationErrorDisplayProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!error || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <Alert variant="destructive" className={`mb-4 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <div className="flex-1">
        <AlertDescription>
          <div className="font-medium text-sm mb-2">
            Veuillez corriger les erreurs suivantes :
          </div>
          <ul className="space-y-1 text-xs">
            {error.errors.map((err, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 font-medium">•</span>
                <div>
                  <span className="font-medium">
                    {err.path.length > 0 ? `${err.path.join('.')} : ` : ''}
                  </span>
                  <span>{err.message}</span>
                </div>
              </li>
            ))}
          </ul>
        </AlertDescription>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-100"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Alert>
  );
}

// Hook pour gérer les erreurs de validation
export function useValidationErrors() {
  const [validationError, setValidationError] = useState<ZodError | null>(null);

  const clearValidationError = () => setValidationError(null);
  
  const handleValidationError = (error: unknown) => {
    if (error instanceof Error && error.message.includes('invalides:')) {
      // Tenter de parser l'erreur Zod depuis le message d'erreur contextuel
      const errorMessage = error.message;
      setValidationError({
        errors: [{ 
          path: [], 
          message: errorMessage.replace(/.*invalides:\s*/, ''),
          code: 'custom' 
        }]
      } as ZodError);
    } else {
      setValidationError(null);
    }
  };

  return {
    validationError,
    setValidationError,
    clearValidationError,
    handleValidationError,
  };
}