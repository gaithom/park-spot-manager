
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import ParkingStats from "./ParkingStats"
import ParkingTable from "./ParkingTable"
import ParkVehicleForm from "./ParkVehicleForm"
import RemoveVehicleForm from "./RemoveVehicleForm"
import VehicleHistory from "./VehicleHistory"
import ActiveParkingDurations from "./ActiveParkingDurations"

const AttendantDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <Card className="border-neutral-800 shadow-lg">
          <ParkingStats />
        </Card>
      </div>

      <Tabs defaultValue="parking" className="bg-black/5 p-6 rounded-lg">
        <TabsList className="mb-6 bg-background">
          <TabsTrigger value="parking" className="data-[state=active]:bg-secondary">Parking</TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-secondary">Active Sessions</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-secondary">Vehicle History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parking" className="space-y-6">
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
        
        <TabsContent value="history">
          <Card className="border-neutral-800 shadow-md">
            <VehicleHistory />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendantDashboard;
