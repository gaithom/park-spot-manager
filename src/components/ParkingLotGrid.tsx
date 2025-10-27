import { useParking } from "@/context/parking";
import { ParkingSlot } from "@/components/ui/parking-slot";
import { motion } from "framer-motion";

const ParkingLotGrid = () => {
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
          <motion.div 
            key={rowIndex}
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.1 }}
          >
            {row.map((slot) => (
              <ParkingSlot
                key={slot.slotNumber}
                isOccupied={slot.isOccupied}
                size="md"
                className="transition-all duration-300 hover:scale-105"
                carAnimationDelay={rowIndex * 0.1}
              />
            ))}
          </motion.div>
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
