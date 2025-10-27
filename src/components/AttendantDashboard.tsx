
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import ParkingStats from "./ParkingStats"
import ParkingTable from "./ParkingTable"
import ParkingLotGrid from "./ParkingLotGrid"
import ParkVehicleForm from "./ParkVehicleForm"
import RemoveVehicleForm from "./RemoveVehicleForm"
import ActiveParkingDurations from "./ActiveParkingDurations"
import { ParkingSlot } from "@/types"

const AttendantDashboard = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const handleSlotSelect = (slot: ParkingSlot) => {
    setSelectedSlot(slot)
    if (isMobile) {
      setIsSheetOpen(true)
    }
  }

  const handleParkingComplete = () => {
    setSelectedSlot(null)
    if (isMobile) {
      setIsSheetOpen(false)
    }
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <Card className="border-neutral-800 shadow-lg">
          <ParkingStats />
        </Card>
      </div>

      <Tabs defaultValue="grid" className="bg-black/5 p-6 rounded-lg">
        <TabsList className="mb-6 bg-background">
          <TabsTrigger value="grid" className="data-[state=active]:bg-secondary">Parking Lot</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-secondary">List View</TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-secondary">Active Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-sm border-neutral-800">
                <ParkingLotGrid onSlotSelect={handleSlotSelect} />
              </Card>
            </div>
            <div className="space-y-6">
              <div className="hidden lg:block">
                <Card className="p-6 border-neutral-800 shadow-md">
                  <ParkVehicleForm 
                    selectedSlot={selectedSlot}
                    onParkingComplete={handleParkingComplete}
                  />
                </Card>
              </div>
              <Card className="p-6 border-neutral-800 shadow-md">
                <RemoveVehicleForm />
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-sm border-neutral-800">
                <ParkingTable />
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="border-neutral-800 shadow-md">
                <ParkVehicleForm 
                  selectedSlot={selectedSlot}
                  onParkingComplete={handleParkingComplete}
                />
              </Card>
              <Card className="border-neutral-800 shadow-md">
                <RemoveVehicleForm />
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <Card className="border-neutral-800 shadow-md">
            <ActiveParkingDurations />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mobile Parking Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
          <SheetHeader className="text-left">
            <div className="flex items-center justify-between">
              <SheetTitle>Park Vehicle</SheetTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSheetOpen(false)}
                className="h-8 w-8 -mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          <div className="py-4">
            <ParkVehicleForm 
              selectedSlot={selectedSlot}
              onParkingComplete={handleParkingComplete}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default AttendantDashboard
