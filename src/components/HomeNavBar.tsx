
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, User, LogOut, Settings, UserCircle } from "lucide-react";
import { useParking } from "@/context/parking";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const HomeNavBar = () => {
  const { theme, user, logout } = useParking();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm' 
        : 'bg-background/80 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <Car className="h-6 w-6 text-primary mr-2 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              ParkEase
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username || 'User'}</p>
                    {user.role && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login" className="hidden sm:inline-flex">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register" className="hidden sm:inline-flex">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="icon" className="sm:hidden">
                <Link to="/login">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeNavBar;
