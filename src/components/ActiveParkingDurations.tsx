
import { useParking } from "@/context/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Timer } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useState, useEffect } from "react";

const ActiveParkingDurations = () => {
  const { slots } = useParking();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateDuration = (entryTime: string) => {
    const start = new Date(entryTime);
    const diff = currentTime.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const occupiedSlots = slots.filter(slot => slot.isOccupied);

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-500/5">
        <CardTitle className="flex items-center text-blue-600">
          <Timer className="mr-2 h-5 w-5" /> Active Parking Durations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slot</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {occupiedSlots.length > 0 ? (
                occupiedSlots.map((slot) => (
                  <TableRow key={slot.slotNumber}>
                    <TableCell>{slot.slotNumber}</TableCell>
                    <TableCell>{slot.vehicle?.regNumber}</TableCell>
                    <TableCell>{formatDateTime(slot.vehicle?.entryTime || '')}</TableCell>
                    <TableCell>{calculateDuration(slot.vehicle?.entryTime || '')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No active parking sessions
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveParkingDurations;
