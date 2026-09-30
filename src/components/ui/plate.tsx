import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Registration numbers are identifiers, not prose — monospace and letter-spaced
  so they stay scannable in a column of thirty, with a faint embossed edge that
  reads as a physical plate.
*/
interface PlateProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null
  size?: "sm" | "default"
}

const Plate = React.forwardRef<HTMLSpanElement, PlateProps>(
  ({ value, size = "default", className, ...props }, ref) => {
    if (!value) {
      return (
        <span ref={ref} className={cn("text-muted-foreground", className)} {...props}>
          —
        </span>
      )
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded border border-strong/70 bg-surface-sunken font-mono font-semibold uppercase tracking-wider text-foreground",
          "shadow-[inset_0_1px_0_hsl(0_0%_100%/0.6)] dark:shadow-[inset_0_1px_0_hsl(0_0%_100%/0.04)]",
          size === "sm" ? "px-1.5 py-px text-2xs" : "px-2 py-0.5 text-xs",
          className
        )}
        {...props}
      >
        {value}
      </span>
    )
  }
)
Plate.displayName = "Plate"

export { Plate }
