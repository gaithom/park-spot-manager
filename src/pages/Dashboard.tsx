
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParking } from "@/context/parking"
import NavBar from "@/components/NavBar"
import AdminDashboard from "@/components/AdminDashboard"
import AttendantDashboard from "@/components/AttendantDashboard"
import { Button } from "@/components/ui/button";
import { Car, ParkingMeter, LogIn, UserPlus, ParkingSquare } from "lucide-react";
import { motion } from "framer-motion";
import { CarAnimation } from "@/components/ui/car-animation";

const Dashboard = () => {
  const { user } = useParking();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Render different content based on authentication status
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <CarAnimation size={48} duration={1.5} />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      );
    }

    // For authenticated users, show the appropriate dashboard
    if (user.isLoggedIn) {
      return user.role === "admin" ? <AdminDashboard /> : <AttendantDashboard />;
    }

    // For unauthenticated users, show the public dashboard
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <div className="bg-primary/10 p-6 rounded-full inline-flex items-center justify-center mb-6">
          <ParkingSquare className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to ParkEase</h2>
        <p className="text-muted-foreground mb-8">
          View parking availability and manage your parking experience. Sign in to access your account and manage your parking.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <Button 
            onClick={() => navigate('/login')} 
            className="w-full"
          >
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/register')} 
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Create Account
          </Button>
        </div>
      </div>
    );
  };

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
                {user.isLoggedIn 
                  ? (user.role === "admin" ? "Admin Dashboard" : "Attendant Dashboard")
                  : "Parking Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {user.isLoggedIn 
                  ? "Manage your parking lot efficiently"
                  : "View parking availability and manage your parking"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
