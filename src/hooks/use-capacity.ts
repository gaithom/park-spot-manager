import { useMemo } from "react"

import { useParking } from "@/context/parking"

/*
  The three buckets are disjoint in the context (`availableSlots` excludes both
  occupied and reserved bays), so they are derived together here. Deriving
  "occupied" as `total - available` — as the old stat cards did — silently
  counted reserved bays as occupied.
*/
export function useCapacity() {
  const { slots, availableSlots, totalSlots } = useParking()

  return useMemo(() => {
    const occupied = slots.filter((slot) => slot.isOccupied).length
    const reserved = slots.filter(
      (slot) => slot.isReserved && !slot.isOccupied
    ).length

    return {
      total: totalSlots,
      available: availableSlots,
      occupied,
      reserved,
      occupancyRate: totalSlots > 0 ? Math.round((occupied / totalSlots) * 100) : 0,
    }
  }, [slots, availableSlots, totalSlots])
}
