
import { useParking } from "@/context/parking"
import NavBar from "@/components/NavBar"
import AdminDashboard from "@/components/AdminDashboard"
import AttendantDashboard from "@/components/AttendantDashboard"

const Dashboard = () => {
  const { user } = useParking();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            {user.role === "admin" ? "Admin Dashboard" : "Attendant Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            Manage your parking lot efficiently
          </p>
        </div>

        {user.role === "admin" ? <AdminDashboard /> : <AttendantDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
