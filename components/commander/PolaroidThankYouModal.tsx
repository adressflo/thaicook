"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface PolaroidThankYouModalProps {
  isOpen: boolean
  onClose: () => void
  autoCloseDelay?: number // En millisecondes (défaut: 5000)
  redirectTo?: string // Défaut: /historique
}

export function PolaroidThankYouModal({
  isOpen,
  onClose,
  autoCloseDelay = 5000,
  redirectTo = "/historique",
}: PolaroidThankYouModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
        router.push(redirectTo as any)
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoCloseDelay, redirectTo, onClose, router])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="mx-auto max-w-md border-0 bg-transparent p-0 shadow-none [&>button]:hidden"
        onClick={(e) => e.stopPropagation()}
        aria-describedby="polaroid-description"
      >
        <VisuallyHidden>
          <DialogTitle>Commande validée</DialogTitle>
        </VisuallyHidden>
        <div className="sr-only">
          <p id="polaroid-description">Votre commande a été enregistrée avec succès</p>
        </div>
        <div className="animate-in zoom-in-95 duration-500">
          {/* Polaroid container */}
          <div className="transform rounded-lg border-8 border-white bg-white p-6 pb-12 shadow-2xl transition-all duration-300 hover:rotate-1">
            {/* Polaroid photo area */}
            <div className="from-thai-cream to-thai-orange/10 relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-linear-to-br">
              {/* Chanthana Sawadee illustration */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  {/* Chanthana avatar circle */}
                  <div className="from-thai-orange to-thai-gold mb-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-linear-to-br shadow-xl">
                    <span className="text-6xl">👩‍🍳</span>
                  </div>
                  {/* Sawadee hands */}
                  <div className="absolute -top-2 -right-2 animate-bounce text-4xl">🙏</div>
                </div>

                {/* Thai message */}
                <div className="mt-2 space-y-1 text-center">
                  <h3 className="text-thai-green text-2xl font-bold">Khop khun kha !</h3>
                  <p className="text-thai-orange text-lg font-semibold">
                    🙏 Merci pour votre commande
                  </p>
                </div>
              </div>

              {/* Decorative hearts */}
              <div className="absolute top-4 left-4 animate-pulse">
                <Heart className="h-6 w-6 fill-red-400 text-red-400" />
              </div>
              <div className="absolute right-4 bottom-4 animate-pulse delay-300">
                <Heart className="h-5 w-5 fill-red-400 text-red-400" />
              </div>

              {/* Sparkles */}
              <div className="absolute top-8 right-8 animate-ping text-2xl delay-150">✨</div>
              <div className="absolute bottom-8 left-8 animate-ping text-2xl">✨</div>
            </div>

            {/* Polaroid caption */}
            <div className="space-y-2 text-center">
              <p className="text-thai-green font-handwriting text-xl">
                Votre commande a été enregistrée
              </p>
              <p className="text-sm text-gray-500 italic">Redirection vers votre historique...</p>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="from-thai-orange to-thai-gold animate-progress h-full bg-linear-to-r"
                  style={{
                    animation: `progress ${autoCloseDelay}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Shadow effect under polaroid */}
          <div className="absolute inset-x-0 -bottom-4 -z-10 h-8 scale-95 transform bg-linear-to-b from-black/20 to-transparent blur-xl" />
        </div>
      </DialogContent>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-progress {
          animation: progress ${autoCloseDelay}ms linear forwards;
        }

        .font-handwriting {
          font-family: "Brush Script MT", "Lucida Handwriting", cursive;
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </Dialog>
  )
}
