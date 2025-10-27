
import { useState } from 'react';
import { useParking } from "@/context/parking";
import { formatDateTime } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ParkingTable = () => {
  const { slots, theme } = useParking();
  const [showAvailable, setShowAvailable] = useState(false);

  // Separate occupied and available slots
  const occupiedSlots = slots.filter(slot => slot.isOccupied);
  const availableSlots = slots.filter(slot => !slot.isOccupied);

  // Always show occupied slots, conditionally show available slots
  const displaySlots = showAvailable 
    ? [...occupiedSlots, ...availableSlots]
    : [...occupiedSlots];

  return (
    <div className={`rounded-lg border ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-neutral-200 bg-white'} shadow-sm overflow-hidden`}>
      <div className={`relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 ${
        theme === 'dark' 
          ? 'after:from-gray-900' 
          : 'after:from-background'
      } after:bg-gradient-to-t after:to-transparent after:pointer-events-none`}>
        <Table>
          <TableHeader className={theme === 'dark' ? 'bg-gray-800' : 'bg-secondary'}>
            <TableRow className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-neutral-200'}>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : 'text-white'}>Slot</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : 'text-white'}>Status</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : 'text-white'}>Registration</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : 'text-white'}>Vehicle Type</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : 'text-white'}>Entry Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displaySlots.map((slot) => (
              <TableRow 
                key={slot.slotNumber} 
                className={`${slot.isOccupied 
                  ? theme === 'dark' ? 'bg-gray-800/50' : 'bg-muted' 
                  : ''} ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
              >
                <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-foreground'}`}>
                  {slot.slotNumber}
                </TableCell>
                <TableCell>
                  {slot.isOccupied ? (
                    <div className="flex items-center text-destructive">
                      <XCircle className="mr-1 h-4 w-4" /> 
                      <span className={theme === 'dark' ? 'text-red-400' : ''}>Occupied</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" /> 
                      <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>Available</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className={theme === 'dark' ? 'text-gray-300' : 'text-foreground'}>
                  {slot.vehicle?.regNumber || "—"}
                </TableCell>
                <TableCell className={theme === 'dark' ? 'text-gray-300' : 'text-foreground'}>
                  {slot.vehicle?.vehicleType || "—"}
                </TableCell>
                <TableCell className={theme === 'dark' ? 'text-gray-300' : 'text-foreground'}>
                  {slot.vehicle?.entryTime 
                    ? formatDateTime(slot.vehicle.entryTime) 
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {availableSlots.length > 0 && (
        <div className="flex justify-center mt-2 p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
            onClick={() => setShowAvailable(!showAvailable)}
          >
            {showAvailable ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide Available Slots
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show Available Slots ({availableSlots.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ParkingTable;
