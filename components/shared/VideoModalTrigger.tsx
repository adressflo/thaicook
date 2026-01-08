"use client"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useState } from "react"

interface VideoModalTriggerProps {
  imageSrc: string
  videoSrc: string
  alt: string
  title: string
  className?: string
  imageClassName?: string
}

export function VideoModalTrigger({
  imageSrc,
  videoSrc,
  alt,
  title,
  className,
  imageClassName,
}: VideoModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={cn("group relative cursor-pointer", className)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={alt}
            className={cn(
              "border-thai-orange/30 group-hover:border-thai-orange rounded-xl border-2 object-cover shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl",
              imageClassName
            )}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="border-thai-orange/20 max-w-md overflow-hidden rounded-xl p-0">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        <video
          src={videoSrc}
          autoPlay
          muted
          playsInline
          onEnded={() => setIsOpen(false)}
          className="h-auto w-full"
          onClick={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
