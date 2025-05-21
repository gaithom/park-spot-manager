
import { useParking } from "@/context/parking";
import { formatDateTime } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

const ParkingTable = () => {
  const { slots } = useParking();

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
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
          {slots.map((slot) => (
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
  );
};

export default ParkingTable;
