import { useParking } from "@/context/parking";
import { formatDateTime } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

const ParkingTable = () => {
  const { slots } = useParking();

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Slot</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registration</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead>Entry Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slots.map((slot) => (
            <TableRow key={slot.slotNumber} className={slot.isOccupied ? "bg-muted/20" : ""}>
              <TableCell className="font-medium">{slot.slotNumber}</TableCell>
              <TableCell>
                {slot.isOccupied ? (
                  <div className="flex items-center text-red-500">
                    <XCircle className="mr-1 h-4 w-4" /> Occupied
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" /> Available
                  </div>
                )}
              </TableCell>
              <TableCell>{slot.vehicle?.regNumber || "—"}</TableCell>
              <TableCell>{slot.vehicle?.vehicleType || "—"}</TableCell>
              <TableCell>
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
