"use client"

import { useToastVideo } from "@/hooks/use-toast-video"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export function ToasterVideo() {
  const { toasts, dismiss } = useToastVideo()

  const toastsByPosition = {
    "bottom-right": toasts.filter((t) => !t.position || t.position === "bottom-right"),
    center: toasts.filter((t) => t.position === "center"),
    "bottom-left": toasts.filter((t) => t.position === "bottom-left"),
  }

  return (
    <>
      {/* Bottom Right (Default) */}
      {toastsByPosition["bottom-right"].length > 0 && (
        <ToastProvider>
          {toastsByPosition["bottom-right"].map(
            ({
              id,
              title,
              description,
              action,
              media,
              duration,
              position,
              scrollingText,
              scrollDuration,
              ...props
            }) => (
              <ToastVideoItem
                key={id}
                id={id}
                title={title}
                description={description}
                action={action}
                media={media}
                dismiss={dismiss}
                scrollingText={scrollingText}
                scrollDuration={scrollDuration}
                {...props}
              />
            )
          )}
          <ToastViewport />
        </ToastProvider>
      )}

      {/* Center */}
      {toastsByPosition["center"].length > 0 && (
        <ToastProvider>
          {toastsByPosition["center"].map(
            ({
              id,
              title,
              description,
              action,
              media,
              duration,
              position,
              scrollingText,
              scrollDuration,
              ...props
            }) => (
              <ToastVideoItem
                key={id}
                id={id}
                title={title}
                description={description}
                action={action}
                media={media}
                dismiss={dismiss}
                scrollingText={scrollingText}
                scrollDuration={scrollDuration}
                {...props}
              />
            )
          )}
          <ToastViewport className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center sm:top-1/2 sm:right-auto sm:bottom-auto sm:flex-col" />
        </ToastProvider>
      )}

      {/* Bottom Left */}
      {toastsByPosition["bottom-left"].length > 0 && (
        <ToastProvider>
          {toastsByPosition["bottom-left"].map(
            ({
              id,
              title,
              description,
              action,
              media,
              duration,
              position,
              scrollingText,
              scrollDuration,
              ...props
            }) => (
              <ToastVideoItem
                key={id}
                id={id}
                title={title}
                description={description}
                action={action}
                media={media}
                dismiss={dismiss}
                scrollingText={scrollingText}
                scrollDuration={scrollDuration}
                {...props}
              />
            )
          )}
          <ToastViewport className="sm:right-auto sm:left-0" />
        </ToastProvider>
      )}
    </>
  )
}

function ToastVideoItem({
  id,
  title,
  description,
  action,
  media,
  dismiss,
  scrollingText,
  scrollDuration,
  polaroid,
  aspectRatio,
  ...props
}: any) {
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

  // Map aspect ratio to Tailwind classes
  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:5": "aspect-[4/5]",
    "1:1": "aspect-square",
  }

  return (
    <Toast
      {...props}
      className={cn(
        "flex-col items-center bg-white shadow-2xl transition-all duration-300",
        polaroid
          ? "border-thai-green border p-[10px_10px_20px_10px]"
          : "border-thai-orange max-w-[400px] min-w-[320px] overflow-hidden rounded-xl border-2 p-0",
        props.className
      )}
    >
      {/* Section image/vidéo */}
      {media && (
        <div
          className={cn(
            "w-full overflow-hidden",
            polaroid && "border-thai-green border",
            aspectRatio && aspectRatioClass[aspectRatio as keyof typeof aspectRatioClass]
          )}
        >
          {media.endsWith(".mp4") || media.endsWith(".webm") ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={media}
              autoPlay
              loop={false}
              muted
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={media}
              alt="Toast media"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      )}

      {/* Section contenu */}
      <div
        className={cn(
          "flex w-full flex-col items-center gap-3",
          polaroid ? "mt-4 p-0" : "bg-white p-6"
        )}
      >
        {title && (
          <ToastTitle className="text-thai-green text-center text-xl font-bold">{title}</ToastTitle>
        )}
        {description && (
          <div className={cn("w-full", scrollingText && "overflow-hidden")}>
            <ToastDescription
              className={cn(
                "text-center text-sm leading-relaxed",
                scrollingText && "animate-marquee inline-block whitespace-nowrap",
                polaroid && "text-thai-green font-bold"
              )}
              style={
                scrollingText && scrollDuration
                  ? ({ "--marquee-duration": `${scrollDuration}s` } as React.CSSProperties)
                  : undefined
              }
            >
              {description}
            </ToastDescription>
          </div>
        )}
        {action}
      </div>

      <ToastClose
        className={cn(
          "absolute top-2 right-2 rounded-full p-1 transition-opacity hover:text-white/80",
          polaroid
            ? "text-thai-green hover:bg-thai-green/10"
            : "bg-black/30 text-white hover:bg-black/50"
        )}
      />
    </Toast>
  )
}
