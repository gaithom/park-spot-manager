
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import ParkingStats from "./ParkingStats"
import ParkingTable from "./ParkingTable"
import AnalyticsDashboard from "./AnalyticsDashboard"
import VehicleCategories from "./VehicleCategories"
import UserManagement from "./UserManagement"
import ActiveReservations from "./ActiveReservations"
import VehicleHistory from "./VehicleHistory"

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Card className="border-neutral-800 shadow-lg">
          <ParkingStats />
        </Card>
      </div>

      <Tabs defaultValue="parking" className="bg-black/5 p-6 rounded-lg">
        <TabsList className="mb-6 bg-background">
          <TabsTrigger value="parking" className="data-[state=active]:bg-secondary">Parking</TabsTrigger>
          <TabsTrigger value="reservations" className="data-[state=active]:bg-secondary">Reservations</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-secondary">Analytics</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-secondary">Vehicle History</TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-secondary">Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parking" className="space-y-6">
          <Card className="shadow-sm border-neutral-800">
            <ParkingTable />
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card className="border-neutral-800 shadow-md">
            <ActiveReservations />
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="border-neutral-800 shadow-md">
            <AnalyticsDashboard />
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="border-neutral-800 shadow-md">
            <VehicleHistory />
          </Card>
        </TabsContent>
        
        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-neutral-800 shadow-md">
              <VehicleCategories />
            </Card>
            <Card className="border-neutral-800 shadow-md">
              <UserManagement />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
