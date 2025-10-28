
import { useParking } from "@/context/parking";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Car, Menu, BarChart2, Calendar, Layers, Home, User, Settings, ChevronDown, Lock, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

const NavBar = () => {
  const { logout, user, login } = useParking();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (clickCount > 0) {
        setClickCount(0);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [clickCount]);

  useEffect(() => {
    if (clickCount >= 4) {
      setShowAdminModal(true);
      setClickCount(0);
    }
  }, [clickCount]);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(adminCredentials.username, adminCredentials.password);
    if (success && user.role === 'admin') {
      setShowAdminModal(false);
      setAdminCredentials({ username: '', password: '' });
      navigate('/dashboard');
      toast.success('Admin login successful');
    } else {
      setError('Invalid admin credentials');
      toast.error('Invalid admin credentials');
    }
  };

  const handleLogout = () => {
    logout(() => {
      navigate("/");
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b sticky top-0 z-10 dark:bg-slate-900 dark:border-slate-800">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <Car className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold text-foreground">ParkEase</h1>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-6">
                <h2 className="font-medium pb-2 border-b">
                  Welcome, {user.username}
                </h2>

                <Link to="/" onClick={() => setOpen(false)} className="flex items-center p-2 hover:bg-muted rounded-md text-foreground">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>

                <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center p-2 hover:bg-muted rounded-md">
                  <Car className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>

                <Link to="/available-slots" onClick={() => setOpen(false)} className="flex items-center p-2 hover:bg-muted rounded-md">
                  <Layers className="h-4 w-4 mr-2" />
                  Available Slots
                </Link>

                <Link to="/reservations" onClick={() => setOpen(false)} className="flex items-center p-2 hover:bg-muted rounded-md">
                  <Calendar className="h-4 w-4 mr-2" />
                  Reservations
                </Link>

                {user.role === "admin" && (
                  <Link to="/analytics" onClick={() => setOpen(false)} className="flex items-center p-2 hover:bg-muted rounded-md">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Analytics
                  </Link>
                )}

                <Button variant="destructive" className="mt-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-1">
          <div className="mr-4">
            Welcome, <span className="font-medium">{user.username}</span>
            {user.role === "admin" && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                Admin
              </span>
            )}
          </div>

          <Link to="/">
            <Button variant={isActive("/") ? "default" : "ghost"} className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button variant={isActive("/dashboard") ? "default" : "ghost"} className="flex items-center">
              <Car className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          <Link to="/available-slots">
            <Button variant={isActive("/available-slots") ? "default" : "ghost"} className="flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Available Slots
            </Button>
          </Link>

          <Link to="/reservations">
            <Button variant={isActive("/reservations") ? "default" : "ghost"} className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Reservations
            </Button>
          </Link>

          {user.role === "admin" && (
            <Link to="/analytics">
              <Button variant={isActive("/analytics") ? "default" : "ghost"} className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          )}

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || ''}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings" className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <Dialog open={showAdminModal} onOpenChange={(open) => {
        if (!open) {
          setAdminCredentials({ username: '', password: '' });
          setError('');
        }
        setShowAdminModal(open);
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-2 mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl">Admin Sign In</DialogTitle>
              <DialogDescription className="text-center text-sm">
                Enter your admin credentials to access the dashboard
              </DialogDescription>
            </div>
          </DialogHeader>
          
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-start space-x-2 text-destructive text-sm mb-4">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Admin Username</Label>
              <Input
                id="admin-username"
                value={adminCredentials.username}
                onChange={(e) => {
                  setError('');
                  setAdminCredentials({...adminCredentials, username: e.target.value});
                }}
                placeholder="Enter admin username"
                className="h-11"
                required
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password">Password</Label>
                <button 
                  type="button"
                  onClick={() => {
                    toast.info('Please contact system administrator to reset your password');
                  }}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="admin-password"
                type="password"
                value={adminCredentials.password}
                onChange={(e) => {
                  setError('');
                  setAdminCredentials({...adminCredentials, password: e.target.value});
                }}
                placeholder="Enter your password"
                className="h-11"
                required
                autoComplete="current-password"
              />
            </div>
            
            <Button type="submit" className="w-full h-11 mt-2">
              Sign In to Admin Dashboard
            </Button>
          </form> 
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default NavBar;
