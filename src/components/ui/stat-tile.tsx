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
        "flex flex-col rounded-xl border bg-card p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {Icon ? (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
              toneClasses[tone]
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        {prefix ? (
          <span className="text-sm font-medium text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <span
          data-numeric
          className="text-[1.75rem] font-semibold leading-none tracking-tight text-foreground"
        >
          {value}
        </span>
        {unit ? (
          <span className="text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>

      {hint ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  )
)
StatTile.displayName = "StatTile"

export { StatTile }
