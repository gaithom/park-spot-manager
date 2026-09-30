import * as React from "react"

import { cn } from "@/lib/utils"

export interface MeterSegment {
  label: string
  value: number
  /** Tailwind background class for the bar segment and legend dot. */
  color: string
}

interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: MeterSegment[]
  /** Defaults to the sum of all segments. */
  total?: number
  showLegend?: boolean
  size?: "sm" | "default"
}

/*
  A stacked capacity bar. Segments are separated by a real gap rather than a
  border so the divisions stay crisp at any width, and zero-value segments
  disappear instead of collapsing into a sliver.
*/
const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  (
    { segments, total, showLegend = true, size = "default", className, ...props },
    ref
  ) => {
    const sum = segments.reduce((acc, segment) => acc + segment.value, 0)
    const denominator = total && total > 0 ? total : sum
    const visible = segments.filter((segment) => segment.value > 0)

    return (
      <div ref={ref} className={cn("space-y-2.5", className)} {...props}>
        <div
          className={cn(
            "flex w-full gap-0.5 overflow-hidden rounded-full bg-muted",
            size === "sm" ? "h-1.5" : "h-2"
          )}
          role="img"
          aria-label={segments
            .map((segment) => `${segment.label}: ${segment.value}`)
            .join(", ")}
        >
          {visible.map((segment) => (
            <div
              key={segment.label}
              className={cn("h-full first:rounded-l-full last:rounded-r-full", segment.color)}
              style={{
                width: denominator > 0 ? `${(segment.value / denominator) * 100}%` : "0%",
              }}
            />
          ))}
        </div>

        {showLegend ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {segments.map((segment) => (
              <div key={segment.label} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", segment.color)} />
                <span className="text-xs text-muted-foreground">
                  {segment.label}
                </span>
                <span
                  data-numeric
                  className="text-xs font-semibold text-foreground"
                >
                  {segment.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
)
Meter.displayName = "Meter"

export { Meter }
