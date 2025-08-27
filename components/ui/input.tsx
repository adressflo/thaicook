import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border-2 border-thai-orange/30 bg-thai-cream px-4 py-3 text-base ring-offset-thai-cream file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-thai-orange focus-visible:ring-offset-2 focus-visible:border-thai-orange transition-all duration-300 hover:border-thai-orange/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-thai-cream/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
