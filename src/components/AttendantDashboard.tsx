
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import ParkingStats from "./ParkingStats"
import ParkingTable from "./ParkingTable"
import ParkingLotGrid from "./ParkingLotGrid"
import ParkVehicleForm from "./ParkVehicleForm"
import RemoveVehicleForm from "./RemoveVehicleForm"
import ActiveParkingDurations from "./ActiveParkingDurations"

const AttendantDashboard = () => {
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
                <ParkingLotGrid />
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="p-6 border-neutral-800 shadow-md">
                <ParkVehicleForm />
              </Card>
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
                <ParkVehicleForm />
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
    </div>
  );
};

export default AttendantDashboard;
