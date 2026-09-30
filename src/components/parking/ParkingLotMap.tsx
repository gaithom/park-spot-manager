import type { ParkingSlot } from "@/types"
import { cn } from "@/lib/utils"
import { ParkingBay } from "@/components/parking/ParkingBay"

interface ParkingLotMapProps {
  slots: ParkingSlot[]
  /** Bays per row. Rows are paired back-to-back with a drive aisle between pairs. */
  perRow?: number
  size?: "sm" | "md"
  selectedSlot?: number | null
  onSlotSelect?: (slot: ParkingSlot) => void
  className?: string
}

const chunk = <T,>(items: T[], size: number): T[][] => {
  const rows: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size))
  }
  return rows
}

const DriveAisle = () => (
  <div className="relative my-3.5 h-4" aria-hidden="true">
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-strong/70" />
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-2xs font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
      Drive aisle
    </span>
  </div>
)

/*
  Reads as a floor plan rather than a list of coloured boxes: fixed-width rows
  paired back-to-back, aisles between pairs, and horizontal scroll on narrow
  screens so a row never reflows into a meaningless shape.
*/
const ParkingLotMap = ({
  slots,
  perRow = 10,
  size = "sm",
  selectedSlot,
  onSlotSelect,
  className,
}: ParkingLotMapProps) => {
  const rows = chunk(slots, perRow)

  return (
    <div className={cn("overflow-x-auto scrollbar-slim", className)}>
      <div className={cn(size === "sm" ? "min-w-[34rem]" : "min-w-[42rem]")}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex}>
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))`,
              }}
            >
              {row.map((slot) => (
                <ParkingBay
                  key={slot.slotNumber}
                  slot={slot}
                  size={size}
                  selected={selectedSlot === slot.slotNumber}
                  onSelect={onSlotSelect}
                />
              ))}
            </div>

            {rowIndex % 2 === 1 && rowIndex < rows.length - 1 ? (
              <DriveAisle />
            ) : rowIndex < rows.length - 1 ? (
              <div className="h-1.5" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParkingLotMap
