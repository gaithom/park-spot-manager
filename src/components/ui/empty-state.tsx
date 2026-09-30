import * as React from "react"

import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
  size?: "sm" | "default"
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon: Icon, title, description, action, size = "default", className, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" ? "gap-2 px-6 py-10" : "gap-3 px-6 py-16",
        className
      )}
      {...props}
    >
      {Icon ? (
        <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-strong bg-surface-sunken text-muted-foreground">
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
