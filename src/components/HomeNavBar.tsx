
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useParking } from "@/context/parking";
import ThemeToggle from "./ThemeToggle";

const HomeNavBar = () => {
  const { theme } = useParking();
  
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10 dark:bg-slate-900/95 dark:border-slate-800/20">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Car className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold text-primary">ParkEase</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link to="/register">Register</Link>
          </Button>
          <Button asChild variant="default">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HomeNavBar;
