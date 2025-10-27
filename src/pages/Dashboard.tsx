
import { useState, useEffect } from "react";
import { useParking } from "@/context/parking"
import NavBar from "@/components/NavBar"
import AdminDashboard from "@/components/AdminDashboard"
import AttendantDashboard from "@/components/AttendantDashboard"
import { Car, ParkingMeter } from "lucide-react";
import { motion } from "framer-motion";
import { CarAnimation } from "@/components/ui/car-animation";

const Dashboard = () => {
  const { user } = useParking();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ParkingMeter className="h-8 w-8 text-primary" />
              <div className="absolute -right-2 -bottom-2">
                <CarAnimation size={16} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {user.role === "admin" ? "Admin Dashboard" : "Attendant Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                Manage your parking lot efficiently
              </p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CarAnimation size={48} duration={1.5} />
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {user.role === "admin" ? <AdminDashboard /> : <AttendantDashboard />}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
