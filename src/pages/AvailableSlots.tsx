import { useParking } from "@/context/parking";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, ArrowLeft } from "lucide-react";

const AvailableSlots = () => {
  const { slots } = useParking();
  const availableSlots = slots.filter(slot => !slot.isOccupied);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Available Parking Slots</h1>
            <p className="text-muted-foreground">
              View all currently available parking slots
            </p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-xl">
              Available Slots: {availableSlots.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slot Number</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <TableRow key={slot.slotNumber}>
                      <TableCell className="font-medium">{slot.slotNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="mr-1 h-4 w-4" /> Available
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      No available slots at the moment.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AvailableSlots;
