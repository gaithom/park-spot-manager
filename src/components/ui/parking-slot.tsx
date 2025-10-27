import { Car, ParkingMeter } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParkingSlotProps {
  isOccupied?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCar?: boolean;
}

export function ParkingSlot({ 
  isOccupied = false, 
  size = 'md',
  className = '',
  showCar = true
}: ParkingSlotProps) {
  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-20 h-14',
    lg: 'w-24 h-18',
  };

  const carSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={cn(
        "relative rounded-md border-2 flex flex-col items-center justify-center",
        "transition-colors duration-200",
        isOccupied
          ? "border-red-500/30 bg-red-500/5"
          : "border-green-500/30 hover:border-green-500/50 bg-white/5",
        sizeClasses[size],
        className
      )}
    >
      {isOccupied && showCar ? (
        <div className="flex flex-col items-center">
          <Car className="text-red-500" size={carSizes[size]} />
          <span className="text-xs text-red-500 mt-1">Occupied</span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ParkingMeter className="text-green-500" size={carSizes[size]} />
          <span className="text-xs text-green-500 mt-1">Available</span>
        </div>
      )}
    </div>
  );
}

interface ParkingLotGridProps {
  slots?: number;
  occupied?: number;
  className?: string;
  title?: string;
  showTitle?: boolean;
}

export function ParkingLotGrid({ 
  slots = 6, 
  occupied = 2, 
  className = '',
  title = 'Parking Lot',
  showTitle = true
}: ParkingLotGridProps) {
  const totalSlots = Math.max(slots, 1);
  const occupiedSlots = Math.min(occupied, totalSlots);
  
  // Create array of slots with their occupied status
  const slotStatus = Array(totalSlots).fill(false).map((_, i) => i < occupiedSlots);

  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="text-sm text-muted-foreground">
            {occupiedSlots} of {totalSlots} occupied
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {slotStatus.map((isOccupied, index) => (
          <ParkingSlot 
            key={index} 
            isOccupied={isOccupied}
            size="md"
          />
        ))}
      </div>
    </div>
  );
}
