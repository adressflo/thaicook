import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border-2 border-thai-orange/30 bg-thai-cream px-4 py-3 text-base ring-offset-thai-cream placeholder:text-thai-green/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-thai-orange focus-visible:ring-offset-2 focus-visible:border-thai-orange transition-all duration-300 hover:border-thai-orange/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-thai-cream/50 resize-vertical",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
