
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import ParkingStats from "./ParkingStats"
import ParkingTable from "./ParkingTable"
import AnalyticsDashboard from "./AnalyticsDashboard"
import VehicleCategories from "./VehicleCategories"
import UserManagement from "./UserManagement"
import ActiveReservations from "./ActiveReservations"

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Card className="border-blue-100 shadow-lg">
          <ParkingStats />
        </Card>
      </div>

      <Tabs defaultValue="parking" className="bg-blue-50/50 p-6 rounded-lg">
        <TabsList className="mb-6 bg-white">
          <TabsTrigger value="parking" className="data-[state=active]:bg-blue-100">Parking</TabsTrigger>
          <TabsTrigger value="reservations" className="data-[state=active]:bg-blue-100">Reservations</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-100">Analytics</TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-blue-100">Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parking" className="space-y-6">
          <Card className="shadow-sm border-blue-100">
            <ParkingTable />
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card className="border-blue-100 shadow-md">
            <ActiveReservations />
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="border-blue-100 shadow-md">
            <AnalyticsDashboard />
          </Card>
        </TabsContent>
        
        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-100 shadow-md">
              <VehicleCategories />
            </Card>
            <Card className="border-blue-100 shadow-md">
              <UserManagement />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

