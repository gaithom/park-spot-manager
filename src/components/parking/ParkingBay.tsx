import { Clock } from "lucide-react"

import type { ParkingSlot } from "@/types"
import { cn } from "@/lib/utils"
import { Plate } from "@/components/ui/plate"

export type BayStatus = "available" | "occupied" | "reserved"

export const bayStatus = (slot: ParkingSlot): BayStatus => {
  if (slot.isOccupied) return "occupied"
  if (slot.isReserved) return "reserved"
  return "available"
}

/*
  A vehicle seen from above, because the map is seen from above. A side-view car
  icon in a top-down floor plan is the detail that gives the whole thing away.
*/
const CarTopDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 18 30" className={className} aria-hidden="true">
    <rect x="1" y="0.5" width="16" height="29" rx="5.5" fill="currentColor" />
    {/* Glass, punched back out of the body in the surface colour. */}
    <rect x="3.6" y="3.8" width="10.8" height="5.8" rx="2.4" fill="hsl(var(--card))" opacity="0.5" />
    <rect x="3.1" y="11.2" width="11.8" height="7" rx="2" fill="hsl(var(--card))" opacity="0.13" />
    <rect x="3.6" y="19.8" width="10.8" height="6.2" rx="2.4" fill="hsl(var(--card))" opacity="0.32" />
  </svg>
)

/*
  Stall paint does the talking. Side lines are 2px like real bay markings, the
  head and foot are hairlines, and corners stay nearly square — rounded corners
  read as a button, not as paint on asphalt.
*/
const statusStyles: Record<BayStatus, string> = {
  available:
    "border-x-2 border-y border-x-success/45 border-y-success/20 bg-success-subtle/45 text-success",
  occupied:
    "border-x-2 border-y border-x-border-strong/70 border-y-border bg-foreground/[0.05] text-foreground dark:bg-foreground/[0.09]",
  reserved:
    "border-2 border-dashed border-brass/60 bg-brass-subtle/45 text-brass-foreground dark:text-brass",
}

interface ParkingBayProps {
  slot: ParkingSlot
  size?: "sm" | "md"
  selected?: boolean
  onSelect?: (slot: ParkingSlot) => void
}

const ParkingBay = ({ slot, size = "md", selected, onSelect }: ParkingBayProps) => {
  const status = bayStatus(slot)
  const interactive = Boolean(onSelect) && status === "available"

  const label = [
    `Bay ${slot.slotNumber}`,
    status === "occupied"
      ? `occupied by ${slot.vehicle?.regNumber ?? "unknown vehicle"}`
      : status,
    slot.vehicle?.vehicleType,
  ]
    .filter(Boolean)
    .join(" · ")

  const Element = interactive ? "button" : "div"

  return (
    <Element
      {...(interactive
        ? { type: "button" as const, onClick: () => onSelect?.(slot) }
        : {})}
      title={label}
      aria-label={label}
      aria-pressed={interactive ? Boolean(selected) : undefined}
      className={cn(
        // Near-square corners: paint on asphalt, not a rounded chip.
        "group relative flex w-full flex-col items-center justify-center gap-1 rounded-[3px] text-center transition-all duration-150",
        size === "sm" ? "h-14" : "h-[5.25rem] px-1.5",
        statusStyles[status],
        interactive &&
          "cursor-pointer hover:border-x-primary hover:bg-primary-subtle hover:text-primary",
        selected &&
          "border-x-primary bg-primary-subtle text-primary ring-2 ring-primary ring-offset-2 ring-offset-card"
      )}
    >
      {/* Stencilled stall number, always in the same corner. */}
      <span className="pointer-events-none absolute left-1 top-0.5 font-mono text-2xs font-semibold tabular-nums opacity-55">
        {String(slot.slotNumber).padStart(2, "0")}
      </span>

      {status === "occupied" ? (
        <>
          <CarTopDown
            className={cn(
              "text-foreground/45 dark:text-foreground/35",
              size === "sm" ? "h-8" : "h-9"
            )}
          />
          {size === "md" ? (
            <Plate value={slot.vehicle?.regNumber} size="sm" />
          ) : null}
        </>
      ) : status === "reserved" ? (
        <>
          <Clock className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
          {size === "md" ? (
            <span className="text-2xs font-medium">Reserved</span>
          ) : null}
        </>
      ) : interactive ? (
        <span className="text-2xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
          Select
        </span>
      ) : null}
    </Element>
  )
}

const legend: { status: BayStatus; label: string; swatch: string }[] = [
  {
    status: "available",
    label: "Available",
    swatch: "border-x-2 border-y border-x-success/60 border-y-success/25 bg-success-subtle",
  },
  {
    status: "occupied",
    label: "Occupied",
    swatch: "border-x-2 border-y border-x-border-strong bg-foreground/10",
  },
  {
    status: "reserved",
    label: "Reserved",
    swatch: "border-2 border-dashed border-brass/70 bg-brass-subtle",
  },
]

const BayLegend = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
    {legend.map((item) => (
      <span key={item.status} className="flex items-center gap-1.5">
        <span className={cn("h-3.5 w-3 rounded-[2px]", item.swatch)} />
        <span className="text-xs text-muted-foreground">{item.label}</span>
      </span>
    ))}
  </div>
)

export { ParkingBay, BayLegend, CarTopDown }
