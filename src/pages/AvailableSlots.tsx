
import { useState, useEffect } from "react";
import { useParking } from "@/context/parking";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, ArrowLeft, ParkingMeter, Car, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CarAnimation } from "@/components/ui/car-animation";

const AvailableSlots = () => {
  const { slots } = useParking();
  const [isLoadingState, setIsLoading] = useState(true);
  const availableSlots = slots.filter(slot => !slot.isOccupied);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="mr-4 border-border hover:bg-muted">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <ParkingMeter className="h-8 w-8 text-primary" />
                <div className="absolute -right-2 -bottom-2">
                  <CarAnimation size={16} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Available Parking Slots</h1>
                <p className="text-muted-foreground">
                  {isLoadingState ? 'Checking parking spaces...' : `${availableSlots.length} slots available`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-sm border-border">
          <CardHeader className="bg-secondary/10 border-b border-border">
            <CardTitle className="text-xl text-foreground">
              Available Slots: {availableSlots.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-foreground font-semibold">Slot Number</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingState ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <CarAnimation size={32} duration={1.5} />
                        <p className="text-muted-foreground">Loading available slots...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : availableSlots.length > 0 ? (
                  <AnimatePresence>
                    {availableSlots.map((slot, index) => (
                      <motion.tr 
                        key={slot.slotNumber} 
                        className="hover:bg-muted/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell className="font-medium text-foreground flex items-center">
                          <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                          {slot.slotNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-success-foreground bg-success/10 px-2 py-1 rounded-md w-fit">
                            <CheckCircle className="mr-2 h-4 w-4" /> 
                            <span>Available</span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                          <ParkingMeter className="h-12 w-12 text-muted-foreground/30" />
                          <div className="absolute -right-4 -bottom-2">
                            <CarAnimation size={24} color="#6b7280" duration={4} />
                          </div>
                        </div>
                        <p className="text-muted-foreground">No available parking slots at the moment.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => window.location.reload()}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Check again
                        </Button>
                      </div>
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
