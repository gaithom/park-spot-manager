
import { useState, useEffect } from "react";
import { useParking } from "@/context/parking";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LayoutGrid, List, CheckCircle, ArrowLeft, ParkingMeter, RefreshCw, Info, Clock, Car, Calendar, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";
import ParkingLotGrid from "@/components/ParkingLotGrid";

const AvailableSlots = () => {
  const { slots } = useParking();
  const [isLoadingState, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const availableSlots = slots.filter(slot => !slot.isOccupied);

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <Button variant="outline" size="icon" className="border-border hover:bg-muted">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <ParkingMeter className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Available Parking Slots</h1>
                  <p className="text-muted-foreground">
                    {isLoadingState ? 'Checking parking spaces...' : `${availableSlots.length} slots available`}
                  </p>
                </div>
              </div>
            </div>
            
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'grid' | 'list')}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-background">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" /> Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" /> List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Card className="shadow-sm border-border">
          <CardHeader className="bg-secondary/10 border-b border-border p-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-foreground">
                  Available Slots: {availableSlots.length}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on a slot to view details
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={isLoadingState}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingState ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {isLoadingState ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : availableSlots.length === 0 ? (
              <Card className="py-12 text-center m-4">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <ParkingMeter className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No available parking slots</h3>
                  <p className="text-muted-foreground">All parking slots are currently occupied</p>
                  <Button asChild className="mt-4">
                    <Link to="/dashboard">Back to Dashboard</Link>
                  </Button>
                </div>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="space-y-6 p-6">
                <ParkingLotGrid />
                <div className="text-sm text-muted-foreground text-center">
                  Showing {availableSlots.length} available {availableSlots.length === 1 ? 'slot' : 'slots'}
                </div>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Slot Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Floor</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableSlots.map((slot) => (
                        <TableRow 
                          key={slot.slotNumber} 
                          onClick={() => handleSlotClick(slot)}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">{slot.slotNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Available</span>
                            </div>
                          </TableCell>
                          <TableCell>{slot.type || 'Standard'}</TableCell>
                          <TableCell>{slot.floor || 'Ground'}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link to={`/park-vehicle?slot=${slot.slotNumber}`}>
                                Park Vehicle
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Showing {availableSlots.length} available {availableSlots.length === 1 ? 'slot' : 'slots'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Slot Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <ParkingMeter className="h-5 w-5 text-primary" />
                  Parking Slot Details
                </DialogTitle>
                <DialogDescription>
                  Detailed information about the selected parking slot
                </DialogDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDialogOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ParkingMeter className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Slot Number</p>
                  <p className="text-lg font-semibold">#{selectedSlot.slotNumber}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">Available</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedSlot.type || 'Standard'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Floor</p>
                    <p className="font-medium">{selectedSlot.floor || 'Ground'}</p>
                  </div>
                </div>

                {selectedSlot.reservedFor && (
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reserved For</p>
                      <p className="font-medium">{selectedSlot.reservedFor}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  asChild 
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to={`/park-vehicle?slot=${selectedSlot.slotNumber}`}>
                    <Car className="mr-2 h-4 w-4" />
                    Park Vehicle
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableSlots;
