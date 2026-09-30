import { useParking } from "@/context/parking";
import type { ParkingSlot as ParkingSlotType } from "@/types";
import { BayLegend } from "@/components/parking/ParkingBay";
import ParkingLotMap from "@/components/parking/ParkingLotMap";

interface ParkingLotGridProps {
  onSlotSelect?: (slot: ParkingSlotType) => void;
  selectedSlot?: number | null;
}

const ParkingLotGrid = ({ onSlotSelect, selectedSlot }: ParkingLotGridProps) => {
  const { slots } = useParking();
  const free = slots.filter((slot) => !slot.isOccupied && !slot.isReserved).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BayLegend />
        <p className="text-xs text-muted-foreground">
          <span data-numeric className="font-semibold text-foreground">
            {free}
          </span>{" "}
          of <span data-numeric>{slots.length}</span> bays free
        </p>
      </div>

      <ParkingLotMap
        slots={slots}
        size="sm"
        selectedSlot={selectedSlot}
        onSlotSelect={onSlotSelect}
      />

      {onSlotSelect ? (
        <p className="text-xs text-muted-foreground">
          Select a free bay to prefill the entry form.
        </p>
      ) : null}
    </div>
  );
};

export default ParkingLotGrid;
