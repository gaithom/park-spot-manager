
import { useParking } from "@/context/parking";
import { formatDateTime } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

const ParkingTable = () => {
  const { slots } = useParking();

  return (
    <div className="rounded-md border border-neutral-700/20 bg-background shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow className="border-b border-neutral-700/20">
            <TableHead>Slot</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registration</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead>Entry Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slots.map((slot) => (
            <TableRow key={slot.slotNumber} className={slot.isOccupied ? "bg-secondary/50" : ""}>
              <TableCell className="font-medium text-foreground">{slot.slotNumber}</TableCell>
              <TableCell>
                {slot.isOccupied ? (
                  <div className="flex items-center text-destructive">
                    <XCircle className="mr-1 h-4 w-4" /> Occupied
                  </div>
                ) : (
                  <div className="flex items-center text-success">
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
  );
};

export default ParkingTable;
