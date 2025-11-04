
import { useParking } from "@/context/parking";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Car, Menu, BarChart2, Calendar, Layers, Home, User, Settings, ChevronDown, Lock, AlertCircle, UserPlus, CreditCard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentModal from "./PaymentModal";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
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
  const { logout, user, login, addUser } = useParking();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (clickCount > 0) {
        setClickCount(0);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [clickCount]);

  // Removed the separate effect for showing admin modal
  // Now handled directly in handleLogoClick

  const handleLogoClick = () => {
    // Only increment count if not already showing admin modal
    if (!showAdminModal) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      // If this was the 4th click, show admin modal
      if (newCount === 4) {
        setShowAdminModal(true);
        setClickCount(0); // Reset counter after showing modal
      }
    }
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isRegistering) {
      // Handle registration
      if (adminCredentials.password !== adminCredentials.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (!adminCredentials.email || !adminCredentials.username || !adminCredentials.password) {
        setError('All fields are required');
        return;
      }
      
      try {
        // Register the new admin user
        const newUser = {
          username: adminCredentials.username.trim(),
          password: adminCredentials.password,
          email: adminCredentials.email,
          role: 'admin',
          name: adminCredentials.username.trim(),
          phone: ''
        };
        
        const success = addUser(newUser);
        
        if (success) {
          toast.success('Admin registration successful! You can now log in.');
          
          // Reset form and switch to login
          setAdminCredentials({ 
            username: newUser.username, // Keep the username filled for convenience
            email: '', 
            password: '',
            confirmPassword: '' 
          });
          setIsRegistering(false);
        } else {
          setError('Registration failed. Username may already exist.');
        }
      } catch (err) {
        setError('Registration failed. Please try again.');
        console.error('Admin registration error:', err);
      }
    } else {
      // Handle login
      const storedCredentials = localStorage.getItem('parkingUserCredentials');
      const credentials = storedCredentials ? JSON.parse(storedCredentials) : {};
      
      // Trim the username to handle any accidental spaces
      const username = adminCredentials.username.trim();
      const userEntry = Object.entries(credentials).find(
        ([key, value]: [string, any]) => 
          key.trim() === username && 
          value.password === adminCredentials.password
      );
      
      if (userEntry) {
        const [storedUsername, userData] = userEntry as [string, { role: string; name?: string; email?: string; password: string }];
        
        // Ensure the role is set to 'admin' for admin users
        const userRole = storedUsername.toLowerCase().includes('admin') ? 'admin' : userData.role;
        
        // Manually set the user data in localStorage
        const userToStore = {
          username: storedUsername,
          isLoggedIn: true,
          role: userRole, // Use the determined role
          name: userData.name || storedUsername,
          email: userData.email || ''
        };
        
        // Store user data in both localStorage and sessionStorage for consistency
        localStorage.setItem('parkingUser', JSON.stringify(userToStore));
        sessionStorage.setItem('parkingUser', JSON.stringify(userToStore));
        
        // Force a state update by reloading the page
        if (userRole === 'admin') {
          window.location.href = '/dashboard?admin=true';
        } else {
          window.location.href = '/dashboard';
        }
        return;
      }
      
      // If we get here, login failed
      setError('Invalid username or password');
      toast.error('Invalid credentials. Please try again.');
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
            {user.isLoggedIn && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard className="h-4 w-4" />
                <span>Make Payment</span>
              </Button>
            )}
            <ThemeToggle />
            {user.isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="md:hidden" onClick={() => setShowPaymentModal(true)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Make Payment</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    logout();
                    navigate("/login");
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Auth Modal */}
      <Dialog open={showAdminModal} onOpenChange={(open) => {
        if (!open) {
          setAdminCredentials({ 
            username: '',
            email: '',
            password: '',
            confirmPassword: '' 
          });
          setError('');
          setIsRegistering(false);
        }
        setShowAdminModal(open);
      }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-2 mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl">
                {isRegistering ? 'Register Admin' : 'Admin Sign In'}
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                {isRegistering 
                  ? 'Create a new admin account'
                  : 'Enter your admin credentials to access the dashboard'}
              </DialogDescription>
            </div>
          </DialogHeader>
          
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-start space-x-2 text-destructive text-sm mb-4">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleAdminAuth} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminCredentials.email}
                  onChange={(e) => {
                    setError('');
                    setAdminCredentials({...adminCredentials, email: e.target.value});
                  }}
                  placeholder="Enter your email"
                  className="h-11"
                  required
                  autoComplete="email"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="admin-username">
                {isRegistering ? 'Choose a Username' : 'Username'}
              </Label>
              <Input
                id="admin-username"
                value={adminCredentials.username}
                onChange={(e) => {
                  setError('');
                  setAdminCredentials({...adminCredentials, username: e.target.value});
                }}
                placeholder={isRegistering ? "Choose a username" : "Enter your username"}
                className="h-11"
                required
                autoComplete={isRegistering ? "username" : "current-username"}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password">
                  {isRegistering ? 'Choose a Password' : 'Password'}
                </Label>
                {!isRegistering && (
                  <button 
                    type="button"
                    onClick={() => {
                      toast.info('Please contact system administrator to reset your password');
                    }}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="admin-password"
                type="password"
                value={adminCredentials.password}
                onChange={(e) => {
                  setError('');
                  setAdminCredentials({...adminCredentials, password: e.target.value});
                }}
                placeholder={isRegistering ? "Create a strong password" : "Enter your password"}
                className="h-11"
                required
                autoComplete={isRegistering ? "new-password" : "current-password"}
              />
            </div>
            
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="admin-confirm-password">Confirm Password</Label>
                <Input
                  id="admin-confirm-password"
                  type="password"
                  value={adminCredentials.confirmPassword}
                  onChange={(e) => {
                    setError('');
                    setAdminCredentials({...adminCredentials, confirmPassword: e.target.value});
                  }}
                  placeholder="Confirm your password"
                  className="h-11"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}
            
            <Button type="submit" className="w-full h-11 mt-2">
              {isRegistering ? 'Register Admin' : 'Sign In to Admin Dashboard'}
            </Button>
            
            <div className="text-center text-sm mt-4">
              {isRegistering ? (
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => {
                      setError('');
                      setIsRegistering(false);
                      setAdminCredentials({
                        ...adminCredentials,
                        email: '',
                        confirmPassword: ''
                      });
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in instead
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Need an admin account?{' '}
                  <button 
                    type="button" 
                    onClick={() => {
                      setError('');
                      setIsRegistering(true);
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    Register here
                  </button>
                </p>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {user.isLoggedIn && (
        <Elements stripe={stripePromise}>
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            amount={0}
            onSuccess={(paymentIntent) => {
              toast.success('Payment successful!');
              setShowPaymentModal(false);
            }}
            onError={(error) => {
              toast.error(`Payment failed: ${error}`);
            }}
            vehicleType=""
            duration=""
          />
        </Elements>
      )}
    </header>
  );
};

export default NavBar;
