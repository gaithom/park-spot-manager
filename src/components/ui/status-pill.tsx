import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Every status in the product resolves through this map, so "occupied" looks the
  same in the parking map, the table and the reservation history.

  Occupied is deliberately neutral ink rather than red: a full bay is a normal
  state, not an error. Red is reserved for things that actually went wrong.
*/
export type Status =
  | "available"
  | "occupied"
  | "reserved"
  | "active"
  | "completed"
  | "cancelled"
  | "pending"
  | "succeeded"
  | "failed"

const statusStyles: Record<Status, { label: string; pill: string; dot: string }> =
  {
    available: {
      label: "Available",
      pill: "bg-success-subtle text-success",
      dot: "bg-success",
    },
    occupied: {
      label: "Occupied",
      pill: "bg-muted text-foreground",
      dot: "bg-foreground/55",
    },
    reserved: {
      label: "Reserved",
      pill: "bg-brass-subtle text-brass-foreground dark:text-brass",
      dot: "bg-brass",
    },
    active: {
      label: "Active",
      pill: "bg-success-subtle text-success",
      dot: "bg-success",
    },
    completed: {
      label: "Completed",
      pill: "bg-info-subtle text-info",
      dot: "bg-info",
    },
    cancelled: {
      label: "Cancelled",
      pill: "bg-danger-subtle text-danger",
      dot: "bg-danger",
    },
    pending: {
      label: "Pending",
      pill: "bg-warning-subtle text-warning",
      dot: "bg-warning",
    },
    succeeded: {
      label: "Paid",
      pill: "bg-success-subtle text-success",
      dot: "bg-success",
    },
    failed: {
      label: "Failed",
      pill: "bg-danger-subtle text-danger",
      dot: "bg-danger",
    },
  }

interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: Status
  /** Overrides the default label for that status. */
  label?: string
}

const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ status, label, className, ...props }, ref) => {
    const style = statusStyles[status] ?? statusStyles.pending
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium",
          style.pill,
          className
        )}
        {...props}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
        {label ?? style.label}
      </span>
    )
  }
)
StatusPill.displayName = "StatusPill"

export { StatusPill, statusStyles }
