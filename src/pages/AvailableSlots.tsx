
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
            <Button variant="outline" size="icon" className="mr-4 border-primary/20">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Available Parking Slots</h1>
            <p className="text-muted-foreground">
              View all currently available parking slots
            </p>
          </div>
        </div>

        <Card className="shadow-sm bg-black border-primary/20">
          <CardHeader className="bg-secondary/50 border-b border-primary/20">
            <CardTitle className="text-xl text-foreground">
              Available Slots: {availableSlots.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow className="border-b border-primary/20">
                  <TableHead>Slot Number</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <TableRow key={slot.slotNumber}>
                      <TableCell className="font-medium text-foreground">{slot.slotNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-success">
                          <CheckCircle className="mr-1 h-4 w-4" /> Available
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-foreground">
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
