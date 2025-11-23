"use client"

import { useToastVideoCenter } from "@/hooks/use-toast-video-center"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
} from "@/components/ui/toast"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function ToasterVideoCenter() {
  const { toasts, dismiss } = useToastVideoCenter()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, media, ...props }) {
        return (
          <ToastVideoItemCenter
            key={id}
            id={id}
            title={title}
            description={description}
            action={action}
            media={media}
            dismiss={dismiss}
            {...props}
          />
        )
      })}
      {/* Viewport centré */}
      <ToastPrimitives.Viewport
        className={cn(
          "fixed top-1/2 left-1/2 z-[100] flex max-h-screen w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center p-4"
        )}
      />
    </ToastProvider>
  )
}

function ToastVideoItemCenter({ id, title, description, action, media, dismiss, ...props }: any) {
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)

  useEffect(() => {
    if (!media || !mediaRef.current) return

    const element = mediaRef.current

    // Pour les vidéos : détection automatique de la fin
    if (element instanceof HTMLVideoElement) {
      const handleVideoEnd = () => {
        dismiss(id)
      }
      element.addEventListener("ended", handleVideoEnd)
      return () => element.removeEventListener("ended", handleVideoEnd)
    }

    // Pour les images : délai selon le type
    if (element instanceof HTMLImageElement) {
      // GIF animé : 3 secondes
      // Images statiques (svg, png, jpeg) : 1 seconde
      const isGif = media.toLowerCase().endsWith(".gif")
      const delay = isGif ? 3000 : 1000

      const timer = setTimeout(() => {
        dismiss(id)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [media, id, dismiss])

  return (
    <Toast
      {...props}
      className="border-thai-orange max-w-[400px] min-w-[320px] flex-col items-center overflow-hidden rounded-xl border-2 bg-white p-0 shadow-2xl"
    >
      {/* Section image/vidéo pleine largeur sans fond */}
      {media && (
        <div className="w-full">
          {media.endsWith(".mp4") || media.endsWith(".webm") ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={media}
              autoPlay
              loop={false}
              muted
              className="h-auto w-full object-cover"
            />
          ) : (
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={media}
              alt="Toast media"
              className="h-auto w-full object-cover"
            />
          )}
        </div>
      )}

      {/* Section contenu avec fond blanc */}
      <div className="flex w-full flex-col items-center gap-3 bg-white p-6">
        {title && (
          <ToastTitle className="text-thai-green text-center text-xl font-bold">{title}</ToastTitle>
        )}
        {description && (
          <ToastDescription className="text-center text-sm leading-relaxed">
            {description}
          </ToastDescription>
        )}
        {action}
      </div>

      <ToastClose className="absolute top-2 right-2 rounded-full bg-black/30 p-1 text-white hover:bg-black/50 hover:text-white/80" />
    </Toast>
  )
}
