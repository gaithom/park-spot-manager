
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import ParkingStats from "./ParkingStats"
import ParkingTable from "./ParkingTable"
import ParkVehicleForm from "./ParkVehicleForm"
import RemoveVehicleForm from "./RemoveVehicleForm"
import VehicleHistory from "./VehicleHistory"
import ActiveParkingDurations from "./ActiveParkingDurations"
import DailyRevenueSummary from "./DailyRevenueSummary"

const AttendantDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ParkingStats />
        <DailyRevenueSummary />
      </div>

      <Tabs defaultValue="parking">
        <TabsList className="mb-6">
          <TabsTrigger value="parking">Parking</TabsTrigger>
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="history">Vehicle History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-sm">
                <ParkingTable />
              </Card>
            </div>
            <div className="space-y-6">
              <ParkVehicleForm />
              <RemoveVehicleForm />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <ActiveParkingDurations />
        </TabsContent>
        
        <TabsContent value="history">
          <VehicleHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendantDashboard;
