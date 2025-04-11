
import { useParking } from "@/context/ParkingContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Car, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const NavBar = () => {
  const { logout, user } = useParking();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <Car className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold text-gray-900">ParkEase</h1>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-6">
                <h2 className="font-medium pb-2 border-b">
                  Welcome, {user.username}
                </h2>
                <Link 
                  to="/dashboard" 
                  onClick={() => setOpen(false)}
                  className="flex items-center p-2 hover:bg-muted rounded-md"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/available-slots" 
                  onClick={() => setOpen(false)}
                  className="flex items-center p-2 hover:bg-muted rounded-md"
                >
                  Available Slots
                </Link>
                <Button 
                  variant="destructive" 
                  className="mt-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="mr-4">
            Welcome, <span className="font-medium">{user.username}</span>
          </div>
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link to="/available-slots">
            <Button variant="ghost">Available Slots</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
