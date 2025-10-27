import { useParking } from "@/context/parking";
import { ParkingSlot } from "@/components/ui/parking-slot";
import type { ParkingSlot as ParkingSlotType } from "@/types";

interface ParkingLotGridProps {
  onSlotSelect?: (slot: ParkingSlotType) => void;
}

const ParkingLotGrid = ({ onSlotSelect }: ParkingLotGridProps) => {
  const { slots } = useParking();
  
  // Group slots into rows for better visualization (5 slots per row)
  const rows = [];
  const slotsPerRow = 5;
  
  for (let i = 0; i < slots.length; i += slotsPerRow) {
    rows.push(slots.slice(i, i + slotsPerRow));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Parking Lot Overview</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-muted-foreground">Occupied</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {rows.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="flex flex-wrap gap-4 justify-center"
          >
            {row.map((slot) => (
              <div 
                key={slot.slotNumber}
                onClick={() => !slot.isOccupied && onSlotSelect?.(slot)}
                className={!slot.isOccupied ? "cursor-pointer" : ""}
              >
                <ParkingSlot
                  isOccupied={slot.isOccupied}
                  size="md"
                  className={`transition-all duration-200 ${!slot.isOccupied ? 'hover:opacity-80' : ''}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <div className="text-center text-sm text-muted-foreground">
          <p>{slots.filter(s => !s.isOccupied).length} spots available out of {slots.length}</p>
          <p className="text-xs mt-1">Click on a spot to see details</p>
        </div>
      </div>
    </div>
  );
};

export default ParkingLotGrid;
