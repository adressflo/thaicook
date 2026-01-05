"use client"

import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  descriptionColorMap,
  fontWeightMap,
  positionClassMap,
  titleColorMap,
  type ToastPosition,
} from "@/components/ui/toast"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  // Grouper les toasts par position
  const toastsByPosition = toasts.reduce(
    (acc, toast) => {
      const position = toast.position || "bottom-right"
      if (!acc[position]) acc[position] = []
      acc[position].push(toast)
      return acc
    },
    {} as Record<ToastPosition, typeof toasts>
  )

  // Mapping position to swipe direction
  const swipeDirectionMap: Record<string, "right" | "left" | "up" | "down"> = {
    "bottom-right": "right",
    "top-right": "right",
    "bottom-left": "left",
    "top-left": "left",
    center: "right",
    custom: "right",
  }

  // Generer le style custom pour les positions personnalisees
  const getCustomPositionStyle = (customX?: string, customY?: string) => {
    if (!customX && !customY) return {}
    return {
      top: customY || "50%",
      left: customX || "50%",
      transform: `translate(-50%, -50%)`,
    }
  }

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <ToastProvider key={position} swipeDirection={swipeDirectionMap[position] || "right"}>
          {positionToasts.map(function ({
            id,
            title,
            description,
            action,
            titleColor,
            titleFontWeight,
            descriptionColor,
            descriptionFontWeight,
            position: _toastPosition,
            customX,
            customY,
            typingAnimation,
            typingSpeed = 100,
            ...props
          }) {
            return (
              <Toast key={id} {...props}>
                <div className="flex w-full flex-col items-center gap-3">
                  {title && (
                    <ToastTitle
                      className={cn(
                        "text-center text-xl",
                        titleColor ? titleColorMap[titleColor] : "text-thai-green",
                        titleFontWeight ? fontWeightMap[titleFontWeight] : "font-bold"
                      )}
                    >
                      {typingAnimation ? (
                        <TypingAnimation duration={typingSpeed}>{title}</TypingAnimation>
                      ) : (
                        title
                      )}
                    </ToastTitle>
                  )}
                  {description && (
                    <div className={cn("w-full", props.scrollingText && "overflow-hidden")}>
                      <ToastDescription
                        className={cn(
                          "text-center text-sm leading-relaxed",
                          descriptionColor
                            ? descriptionColorMap[descriptionColor]
                            : "text-thai-green",
                          descriptionFontWeight
                            ? fontWeightMap[descriptionFontWeight]
                            : "font-semibold",
                          props.scrollingText && "animate-marquee inline-block whitespace-nowrap"
                        )}
                        style={
                          props.scrollingText
                            ? ({
                                "--marquee-duration": `${props.scrollDuration || 10}s`,
                              } as React.CSSProperties)
                            : undefined
                        }
                      >
                        {typingAnimation ? (
                          <TypingAnimation duration={typingSpeed}>{description}</TypingAnimation>
                        ) : (
                          description
                        )}
                      </ToastDescription>
                    </div>
                  )}
                </div>
                {action}
              </Toast>
            )
          })}
          <ToastViewport
            className={cn(
              "fixed z-50 flex max-h-screen w-full flex-col-reverse p-4 md:max-w-fit",
              position === "custom" ? "" : positionClassMap[position as ToastPosition]
            )}
            style={
              position === "custom"
                ? getCustomPositionStyle(positionToasts[0]?.customX, positionToasts[0]?.customY)
                : undefined
            }
          />
        </ToastProvider>
      ))}
    </>
  )
}
