import { useParking } from "@/context/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { Calendar, X } from "lucide-react";

const ActiveReservations = () => {
  const { reservations, cancelReservation } = useParking();
  
  // Only show active reservations
  const activeReservations = reservations.filter(r => r.status === "active");

  return (
    <Card className="w-full">
      <CardHeader className="bg-amber-500/5">
        <CardTitle className="flex items-center text-amber-600">
          <Calendar className="mr-2 h-5 w-5" /> Active Reservations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Reserved For</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeReservations.length > 0 ? (
              activeReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.slotNumber}</TableCell>
                  <TableCell>{reservation.reservedFor}</TableCell>
                  <TableCell>{reservation.regNumber}</TableCell>
                  <TableCell>{formatDateTime(reservation.startTime)}</TableCell>
                  <TableCell>{formatDateTime(reservation.endTime)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => cancelReservation(reservation.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No active reservations.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActiveReservations;
