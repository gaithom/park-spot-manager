
import { useParking } from "@/context/ParkingContext";
import NavBar from "@/components/NavBar";
import ParkingStats from "@/components/ParkingStats";
import ParkingTable from "@/components/ParkingTable";
import ParkVehicleForm from "@/components/ParkVehicleForm";
import RemoveVehicleForm from "@/components/RemoveVehicleForm";

const Dashboard = () => {
  const { totalSlots, availableSlots } = useParking();

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Parking Status</h2>
            <ParkingTable />
          </div>
          <div className="space-y-6">
            <ParkVehicleForm />
            <RemoveVehicleForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
