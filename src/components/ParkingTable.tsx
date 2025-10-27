
import { useState } from 'react';
import { useParking } from "@/context/parking";
import { formatDateTime } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ParkingTable = () => {
  const { slots } = useParking();
  const [showAvailable, setShowAvailable] = useState(false);

  // Separate occupied and available slots
  const occupiedSlots = slots.filter(slot => slot.isOccupied);
  const availableSlots = slots.filter(slot => !slot.isOccupied);

  // Always show occupied slots, conditionally show available slots
  const displaySlots = showAvailable 
    ? [...occupiedSlots, ...availableSlots]
    : [...occupiedSlots];

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:bg-gradient-to-t after:from-background after:to-transparent after:pointer-events-none">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow className="border-b border-neutral-200">
              <TableHead className="text-white">Slot</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Registration</TableHead>
              <TableHead className="text-white">Vehicle Type</TableHead>
              <TableHead className="text-white">Entry Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displaySlots.map((slot) => (
              <TableRow key={slot.slotNumber} className={slot.isOccupied ? "bg-muted" : ""}>
                <TableCell className="font-medium text-foreground">{slot.slotNumber}</TableCell>
                <TableCell>
                  {slot.isOccupied ? (
                    <div className="flex items-center text-destructive">
                      <XCircle className="mr-1 h-4 w-4" /> Occupied
                    </div>
                  ) : (
                    <div className="flex items-center text-secondary">
                      <CheckCircle className="mr-1 h-4 w-4" /> Available
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-foreground">{slot.vehicle?.regNumber || "—"}</TableCell>
                <TableCell className="text-foreground">{slot.vehicle?.vehicleType || "—"}</TableCell>
                <TableCell className="text-foreground">
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
            className="text-muted-foreground hover:text-foreground transition-colors"
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
