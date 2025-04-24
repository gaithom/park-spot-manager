
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
        <ParkingStats />
      </div>

      <Tabs defaultValue="parking">
        <TabsList className="mb-6">
          <TabsTrigger value="parking">Parking</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parking" className="space-y-6">
          <Card className="shadow-sm">
            <ParkingTable />
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations">
          <ActiveReservations />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VehicleCategories />
            <UserManagement />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
