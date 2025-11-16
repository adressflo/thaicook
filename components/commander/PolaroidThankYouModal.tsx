"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

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
  redirectTo = "/historique"
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
        className="max-w-md mx-auto bg-transparent border-0 shadow-none [&>button]:hidden p-0"
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
          <div className="bg-white p-6 pb-12 shadow-2xl rounded-lg border-8 border-white transform hover:rotate-1 transition-all duration-300">
            {/* Polaroid photo area */}
            <div className="relative bg-gradient-to-br from-thai-cream to-thai-orange/10 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
              {/* Chanthana Sawadee illustration */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  {/* Chanthana avatar circle */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-thai-orange to-thai-gold flex items-center justify-center mb-4 shadow-xl border-4 border-white">
                    <span className="text-6xl">👩‍🍳</span>
                  </div>
                  {/* Sawadee hands */}
                  <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
                    🙏
                  </div>
                </div>

                {/* Thai message */}
                <div className="text-center space-y-1 mt-2">
                  <h3 className="text-2xl font-bold text-thai-green">
                    Khop khun kha !
                  </h3>
                  <p className="text-lg text-thai-orange font-semibold">
                    🙏 Merci pour votre commande
                  </p>
                </div>
              </div>

              {/* Decorative hearts */}
              <div className="absolute top-4 left-4 animate-pulse">
                <Heart className="w-6 h-6 text-red-400 fill-red-400" />
              </div>
              <div className="absolute bottom-4 right-4 animate-pulse delay-300">
                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              </div>

              {/* Sparkles */}
              <div className="absolute top-8 right-8 text-2xl animate-ping delay-150">
                ✨
              </div>
              <div className="absolute bottom-8 left-8 text-2xl animate-ping">
                ✨
              </div>
            </div>

            {/* Polaroid caption */}
            <div className="text-center space-y-2">
              <p className="text-thai-green font-handwriting text-xl">
                Votre commande a été enregistrée
              </p>
              <p className="text-sm text-gray-500 italic">
                Redirection vers votre historique...
              </p>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-thai-orange to-thai-gold animate-progress"
                  style={{
                    animation: `progress ${autoCloseDelay}ms linear forwards`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Shadow effect under polaroid */}
          <div className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-b from-black/20 to-transparent blur-xl -z-10 transform scale-95" />
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
          font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
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
