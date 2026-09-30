import * as React from "react"

import { cn } from "@/lib/utils"

export type StatTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brass"

const toneClasses: Record<StatTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary-subtle text-primary",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
  info: "bg-info-subtle text-info",
  brass: "bg-brass-subtle text-brass-foreground dark:text-brass",
}

/* A breath of the tone bleeding out of the icon corner, so tiles aren't flat. */
const toneGlow: Record<StatTone, string> = {
  neutral:
    "bg-[radial-gradient(circle_at_top_right,hsl(var(--foreground)/0.055),transparent_62%)]",
  primary:
    "bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.13),transparent_62%)]",
  success:
    "bg-[radial-gradient(circle_at_top_right,hsl(var(--success)/0.13),transparent_62%)]",
  warning:
    "bg-[radial-gradient(circle_at_top_right,hsl(var(--warning)/0.14),transparent_62%)]",
  danger:
    "bg-[radial-gradient(circle_at_top_right,hsl(var(--danger)/0.13),transparent_62%)]",
  info: "bg-[radial-gradient(circle_at_top_right,hsl(var(--info)/0.13),transparent_62%)]",
  brass:
    "bg-[radial-gradient(circle_at_top_right,hsl(var(--brass)/0.15),transparent_62%)]",
}

interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  /** Rendered smaller and muted next to the value — "hrs", "KSh", "%". */
  unit?: string
  /** Prefix that sits before the value, e.g. a currency symbol. */
  prefix?: string
  hint?: React.ReactNode
  icon?: React.ElementType
  tone?: StatTone
  /** Optional slot under the figure for a meter, sparkline or legend. */
  children?: React.ReactNode
}

const StatTile = React.forwardRef<HTMLDivElement, StatTileProps>(
  (
    {
      label,
      value,
      unit,
      prefix,
      hint,
      icon: Icon,
      tone = "primary",
      children,
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card p-5 shadow-panel transition-shadow duration-200 hover:shadow-raised",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full transition-opacity duration-300 group-hover:opacity-80",
          toneGlow[tone]
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {Icon ? (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md shadow-control",
              toneClasses[tone]
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>

      <div className="relative mt-3.5 flex items-baseline gap-1.5">
        {prefix ? (
          <span className="text-sm font-medium text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <span
          data-numeric
          className="text-[2rem] font-semibold leading-none tracking-[-0.02em] text-foreground"
        >
          {value}
        </span>
        {unit ? (
          <span className="text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>

      {/* Hairline separates the figure from its qualifier — the tile gets a spine. */}
      {hint ? (
        <p className="relative mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}

      {children ? (
        <div className={cn("relative", hint ? "mt-3" : "mt-4 border-t pt-4")}>
          {children}
        </div>
      ) : null}
    </div>
  )
)
StatTile.displayName = "StatTile"

export { StatTile }
