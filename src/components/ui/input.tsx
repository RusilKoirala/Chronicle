import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  mobile?: boolean;
}

function Input({ className, type, mobile = false, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-mobile={mobile}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-system-subtle transition-system-normal outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:shadow-system-medium",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Mobile-first sizing
        mobile ? [
          "h-12 text-base", // 48px height, 16px font to prevent zoom on iOS
          "touch-target-comfortable"
        ] : [
          "h-9 text-base md:text-sm" // Responsive text size
        ],
        className
      )}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
