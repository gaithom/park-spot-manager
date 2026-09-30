import { Car, Clock } from "lucide-react"

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
  A single stall. The border is the painted line, so the three states read
  differently even at 14px tall and even in greyscale:

    available — thin green line, empty inside
    occupied  — no line, filled with ink, carries the plate
    reserved  — dashed brass line
*/
const statusStyles: Record<BayStatus, string> = {
  available:
    "border-success/40 bg-success-subtle/50 text-success dark:bg-success-subtle/40",
  occupied:
    "border-transparent bg-foreground/[0.08] text-foreground dark:bg-foreground/[0.12]",
  reserved:
    "border-dashed border-brass/60 bg-brass-subtle/50 text-brass-foreground dark:text-brass",
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
        "relative flex w-full flex-col items-center justify-center gap-1 rounded-md border text-center transition-all duration-150",
        size === "sm" ? "h-14" : "h-[5.25rem] px-1.5",
        statusStyles[status],
        interactive &&
          "cursor-pointer hover:border-primary hover:bg-primary-subtle hover:text-primary",
        selected &&
          "border-primary bg-primary-subtle text-primary ring-2 ring-primary ring-offset-2 ring-offset-card"
      )}
    >
      <span
        className={cn(
          "font-mono font-semibold tabular-nums",
          size === "sm"
            ? "text-2xs"
            : "absolute left-2 top-1.5 text-2xs text-muted-foreground"
        )}
      >
        {String(slot.slotNumber).padStart(2, "0")}
      </span>

      {size === "sm" ? (
        status === "occupied" ? (
          <Car className="h-3.5 w-3.5 opacity-70" />
        ) : status === "reserved" ? (
          <Clock className="h-3 w-3 opacity-80" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
        )
      ) : status === "occupied" ? (
        <>
          <Car className="h-4 w-4 opacity-70" />
          <Plate value={slot.vehicle?.regNumber} size="sm" />
        </>
      ) : status === "reserved" ? (
        <>
          <Clock className="h-4 w-4 opacity-80" />
          <span className="text-2xs font-medium">Reserved</span>
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-current opacity-50" />
          <span className="text-2xs font-medium">
            {interactive ? "Select" : "Free"}
          </span>
        </>
      )}
    </Element>
  )
}

const legend: { status: BayStatus; label: string; swatch: string }[] = [
  { status: "available", label: "Available", swatch: "border-success/50 bg-success-subtle" },
  { status: "occupied", label: "Occupied", swatch: "border-transparent bg-foreground/20" },
  { status: "reserved", label: "Reserved", swatch: "border-dashed border-brass/70 bg-brass-subtle" },
]

const BayLegend = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
    {legend.map((item) => (
      <span key={item.status} className="flex items-center gap-1.5">
        <span className={cn("h-3 w-3 rounded-sm border", item.swatch)} />
        <span className="text-xs text-muted-foreground">{item.label}</span>
      </span>
    ))}
  </div>
)

export { ParkingBay, BayLegend }
