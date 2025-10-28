import { useParking } from "@/context/parking";
import { CheckCircle, XCircle, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const ParkingGrid = () => {
  const { slots, theme } = useParking();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {slots.map((slot) => (
        <div 
          key={slot.slotNumber}
          className={cn(
            "rounded-lg p-4 border flex flex-col items-center justify-center transition-all duration-200",
            slot.isOccupied 
              ? theme === 'dark' ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
              : theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200',
            "hover:shadow-md"
          )}
        >
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-2",
              slot.isOccupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600',
              theme === 'dark' && (slot.isOccupied ? 'bg-red-900/40 text-red-300' : 'bg-green-900/30 text-green-300')
            )}>
              {slot.isOccupied ? (
                <XCircle className="h-6 w-6" />
              ) : (
                <CheckCircle className="h-6 w-6" />
              )}
            </div>
            <span className={cn(
              "text-lg font-semibold mb-1",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {slot.slotNumber}
            </span>
            {slot.isOccupied && (
              <div className="text-center mt-1">
                <div className="flex items-center justify-center">
                  <Car className="h-4 w-4 mr-1" />
                  <span className={cn(
                    "text-xs font-medium truncate max-w-[100px]",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  )}>
                    {slot.vehicle?.regNumber || '—'}
                  </span>
                </div>
                <div className={cn(
                  "text-xs mt-1",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {slot.vehicle?.vehicleType || '—'}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParkingGrid;
