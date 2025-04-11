
import { useParking } from "@/context/ParkingContext";
import NavBar from "@/components/NavBar";
import ParkingStats from "@/components/ParkingStats";
import ParkingTable from "@/components/ParkingTable";
import ParkVehicleForm from "@/components/ParkVehicleForm";
import RemoveVehicleForm from "@/components/RemoveVehicleForm";
import ReservationForm from "@/components/ReservationForm";
import VehicleHistory from "@/components/VehicleHistory";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import VehicleCategories from "@/components/VehicleCategories";
import ActiveReservations from "@/components/ActiveReservations";
import UserManagement from "@/components/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useParking();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Parking Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your parking lot efficiently
          </p>
        </div>

        <div className="mb-8">
          <ParkingStats />
        </div>

        <Tabs defaultValue="parking">
          <TabsList className="mb-6">
            <TabsTrigger value="parking">Parking</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {user.role === "admin" && (
              <TabsTrigger value="management">Management</TabsTrigger>
            )}
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
                <VehicleHistory />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reservations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActiveReservations />
              </div>
              <div>
                <ReservationForm />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>
          
          {user.role === "admin" && (
            <TabsContent value="management" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VehicleCategories />
                <UserManagement />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
