import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronDown, Check, Clock, BarChart, Shield, Zap, Cloud, ArrowRight, Star, Quote, ChevronLeft, ChevronRight, ChevronUp, Car, Settings, CreditCard, User, Lock, AlertCircle } from "lucide-react";
import HomeNavBar from "@/components/HomeNavBar";
import Footer from "@/components/Footer";
import { useParking } from "@/context/parking";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.module.css";
import { ParkingLotGrid, ParkingSlot } from "@/components/ui/parking-slot";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addUser } from "@/context/parking/actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Home = () => {
  const { theme, user, login } = useParking();
  const [isHovered, setIsHovered] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 4) {
      setShowAdminAuth(true);
      setClickCount(0);
    } else if (newCount === 1) {
      // Reset counter after 3 seconds if no more clicks
      setTimeout(() => {
        setClickCount(0);
      }, 3000);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isRegistering) {
      if (adminCredentials.password !== adminCredentials.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      // Register new admin
      const success = addUser({
        username: adminCredentials.username,
        password: adminCredentials.password,
        role: 'admin',
        name: adminCredentials.name,
        email: adminCredentials.email
      });
      
      if (success) {
        toast.success('Admin registration successful. Please log in.');
        setIsRegistering(false);
        setAdminCredentials({
          username: '',
          password: '',
          confirmPassword: '',
          name: '',
          email: ''
        });
      } else {
        setError('Username already exists');
      }
    } else {
      // Login existing admin
      const success = login(adminCredentials.username, adminCredentials.password);
      if (success && user.role === 'admin') {
        setShowAdminAuth(false);
        setAdminCredentials({ username: '', password: '', confirmPassword: '', name: '', email: '' });
        navigate('/dashboard');
        toast.success('Admin login successful');
      } else {
        setError('Invalid admin credentials');
        toast.error('Invalid admin credentials');
      }
    }
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setAdminCredentials({
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
      email: ''
    });
  };
  
  const testimonials = [
    {
      quote: "ParkSpot has completely transformed how we manage our parking facility. The real-time tracking and analytics have helped us increase our capacity utilization by 40%.",
      author: "Sarah Johnson",
      role: "Facility Manager, Downtown Parking",
      rating: 5
    },
    {
      quote: "The reservation system is incredibly intuitive for both our staff and customers. We've seen a significant reduction in parking disputes since implementing ParkSpot.",
      author: "Michael Chen",
      role: "Operations Director, Metro Parking Solutions",
      rating: 5
    },
    {
      quote: "As a regular user, I love being able to reserve and pay for parking in advance. It saves me so much time and stress during my daily commute.",
      author: "Emily Rodriguez",
      role: "Daily Commuter",
      rating: 4
    }
  ];

  useEffect(() => {
    // Reveal sections on scroll
    const hiddenElements = document.querySelectorAll(".reveal-on-scroll");
    hiddenElements.forEach((el) => el.classList.add("opacity-0"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    hiddenElements.forEach((el) => observer.observe(el));

    return () => hiddenElements.forEach((el) => observer.unobserve(el));
  }, []);

  const features = [
    {
      title: "Real-time Tracking",
      description: "Monitor all parking spaces in real-time with accurate vehicle entry and exit tracking.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Smart Reservations",
      description: "Allow customers to reserve parking spots in advance to ensure availability.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive analytics and reporting tools to optimize parking operations.",
      icon: <BarChart className="h-8 w-8 text-primary" />,
    },
    {
      title: "Secure Access",
      description: "Ensure authorized entry with role-based access controls.",
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
    {
      title: "Fast Check-in",
      description: "Reduce wait times with QR-based or license-plate check-in.",
      icon: <Zap className="h-8 w-8 text-primary" />,
    },
    {
      title: "Cloud Synced",
      description: "Access the system from anywhere with real-time cloud sync.",
      icon: <Cloud className="h-8 w-8 text-primary" />,
    },
  ];

  const stats = [
    { value: "95%", label: "Customer Satisfaction" },
    { value: "40%", label: "Space Utilization" },
    { value: "24/7", label: "Support Available" },
    { value: "10K+", label: "Vehicles Managed" },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HomeNavBar />
      
      {/* Admin Auth Modal */}
      <Dialog open={showAdminAuth} onOpenChange={(open) => {
        if (!open) {
          setAdminCredentials({ username: '', password: '', confirmPassword: '', name: '', email: '' });
          setError('');
        }
        setShowAdminAuth(open);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-2 mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl">
                {isRegistering ? 'Admin Registration' : 'Admin Sign In'}
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                {isRegistering 
                  ? 'Register a new admin account' 
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
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={adminCredentials.name}
                  onChange={(e) => setAdminCredentials({...adminCredentials, name: e.target.value})}
                  required={isRegistering}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                required
              />
            </div>
            
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                  required={isRegistering}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                required
              />
            </div>
            
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={adminCredentials.confirmPassword}
                  onChange={(e) => setAdminCredentials({...adminCredentials, confirmPassword: e.target.value})}
                  required={isRegistering}
                />
              </div>
            )}
            
            <Button type="submit" className="w-full mt-2">
              {isRegistering ? 'Register' : 'Sign In'}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              {isRegistering ? 'Already have an account? ' : 'Need an admin account? '}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-primary hover:underline underline-offset-4"
              >
                {isRegistering ? 'Sign in' : 'Register'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section id="hero" className={`min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden ${
        theme === "dark" ? "bg-gradient-to-b from-slate-900 to-slate-800" : "bg-gradient-to-b from-white to-gray-50"
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-1/2">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                  theme === "dark" ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"
                }`}>
                  Revolutionizing Parking Management
                </span>
                <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${
                  theme === "dark" ? "from-green-600 to-emerald-500" : "from-green-700 to-emerald-600"
                }`}>
                  Smart Parking, <span className="block">Simplified</span>
                </h1>
                <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>
                  Transform your parking operations with our all-in-one solution for efficient vehicle tracking, space optimization, and seamless customer experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button asChild size="lg" className="group relative overflow-hidden">
                    <Link to={user ? "/dashboard" : "/login"} className="relative z-10">
                      <span className="relative z-10 flex items-center">
                        {user ? 'Go to Dashboard' : 'Get Started Free'}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => scrollToSection("features")}
                    className="group"
                  >
                    <span className="flex items-center">
                      Learn More
                      <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                    </span>
                  </Button>
                </div>
              </div>
              
              {/* Parking Lot Visualization */}
              <div className="lg:w-1/2 mt-8 lg:mt-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative"
                >
                  <div className="absolute -top-4 -left-4 w-full h-full bg-primary/10 rounded-2xl -z-10" />
                  <div className="bg-background p-6 rounded-xl border shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-foreground">Live Parking Status</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="flex items-center mr-4">
                          <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                          <span>Available</span>
                        </span>
                        <span className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-destructive/50 mr-1"></span>
                          <span>Occupied</span>
                        </span>
                      </div>
                    </div>
                    <ParkingLotGrid slots={6} occupied={2} />
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Real-time parking availability monitoring
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-4 rounded-xl backdrop-blur-sm ${
                  theme === "dark" 
                    ? "bg-white/5 border border-white/10" 
                    : "bg-white/80 border border-gray-200"
                }`}
              >
                <p className={`text-2xl md:text-3xl font-bold mb-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {stat.value}
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => scrollToSection("features")}
            className="animate-bounce"
          >
            <ChevronDown className={`h-6 w-6 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`} />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 relative overflow-hidden ${
        theme === "dark" ? "bg-gradient-to-b from-slate-900 to-slate-800" : "bg-gradient-to-b from-gray-50 to-white"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`text-4xl md:text-5xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Powerful Features for <span className="text-primary">Seamless Parking</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-lg max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Everything you need to manage your parking facility efficiently and provide an exceptional experience for your customers.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                  theme === "dark" 
                    ? "bg-white/5 hover:bg-white/10 border border-white/10" 
                    : "bg-white hover:shadow-xl border border-gray-100"
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
                  theme === "dark" 
                    ? "bg-primary/10 text-primary" 
                    : "bg-primary/10 text-primary"
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>
                  {feature.description}
                </p>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature highlight */}
        <div className="mt-20 max-w-7xl mx-auto px-4">
          <div className={`rounded-3xl overflow-hidden ${
            theme === "dark" ? "bg-slate-800/50" : "bg-gray-50"
          }`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="p-8 md:p-12">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                  theme === "dark" ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"
                }`}>
                  Smart Analytics
                </span>
                <h3 className={`text-3xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Real-time Insights for Better Decisions
                </h3>
                <p className={`text-lg mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>
                  Get detailed analytics and reports to optimize your parking operations, track revenue, and understand customer behavior.
                </p>
                <ul className="space-y-3">
                  {[
                    "Occupancy rates and trends",
                    "Revenue analytics",
                    "Peak hours analysis",
                    "Customer behavior insights"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`h-5 w-5 mt-0.5 mr-2 flex-shrink-0 ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      }`} />
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-full min-h-[400px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-8">
                <div className={`w-full h-full rounded-xl ${
                  theme === "dark" 
                    ? "bg-slate-800/50 border border-slate-700/50" 
                    : "bg-white/80 border border-gray-200"
                } flex items-center justify-center`}>
                  <BarChart className="h-32 w-32 opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-20 px-4 relative ${
        theme === "dark" ? "bg-gradient-to-b from-slate-800 to-slate-900" : "bg-gradient-to-b from-white to-gray-50"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`text-4xl md:text-5xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              How It <span className="text-primary">Works</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-lg max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Simple steps to transform your parking management and provide a seamless experience for your customers.
            </motion.p>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className={`absolute left-1/2 top-0 bottom-0 w-1 -ml-px ${
              theme === "dark" ? "bg-gradient-to-b from-primary/20 to-primary/10" : "bg-gray-200"
            }`}></div>
            
            {[
              {
                title: "Vehicle Entry",
                description:
                  "Attendants record vehicle details upon entry, assigning available parking slots automatically.",
                icon: <Car className="h-6 w-6 text-white" />,
              },
              {
                title: "Space Management",
                description:
                  "System optimizes parking space allocation based on vehicle size and duration of stay.",
                icon: <Settings className="h-6 w-6 text-white" />,
              },
              {
                title: "Payment Processing",
                description:
                  "Automated fee calculation based on parking duration, with multiple payment options.",
                icon: <CreditCard className="h-6 w-6 text-white" />,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex flex-col md:items-center`}
              >
                <div className="md:w-1/2 px-4 md:px-8">
                  <div className={`p-6 rounded-2xl ${
                    theme === "dark" 
                      ? "bg-slate-800/50 border border-slate-700/50" 
                      : "bg-white border border-gray-100 shadow-lg"
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      theme === "dark" ? "bg-primary/20" : "bg-primary/10"
                    }`}>
                      {step.icon}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {step.title}
                    </h3>
                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2 px-4">
                  <div className={`h-1 w-full ${
                    theme === "dark" ? "bg-slate-700" : "bg-gray-200"
                  }`}></div>
                </div>
                <div className="absolute left-1/2 -ml-4 top-1/2 -mt-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-20 px-4 ${
        theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`text-4xl md:text-5xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              What Our <span className="text-primary">Clients Say</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-lg max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Don't just take our word for it. Here's what our customers have to say about their experience.
            </motion.p>
          </div>

          <div 
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className={`p-8 rounded-2xl ${
                  theme === "dark" 
                    ? "bg-slate-800/50 border border-slate-700/50" 
                    : "bg-white border border-gray-100 shadow-lg"
                }`}
              >
                <Quote className={`h-8 w-8 mb-6 ${
                  theme === "dark" ? "text-primary/30" : "text-primary/20"
                }`} />
                <p className={`text-lg mb-6 italic ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full ${
                    theme === "dark" ? "bg-primary/10" : "bg-primary/5"
                  } flex items-center justify-center mr-4`}>
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {testimonials[currentTestimonial].author}
                    </h4>
                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < testimonials[currentTestimonial].rating 
                            ? "text-yellow-400 fill-current" 
                            : theme === "dark" 
                              ? "text-gray-700" 
                              : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
              onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
              className={`absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center ${
                theme === "dark" 
                  ? "bg-slate-800 hover:bg-slate-700 text-white" 
                  : "bg-white hover:bg-gray-100 text-gray-900 shadow-md"
              } transition-colors`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
              className={`absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center ${
                theme === "dark" 
                  ? "bg-slate-800 hover:bg-slate-700 text-white" 
                  : "bg-white hover:bg-gray-100 text-gray-900 shadow-md"
              } transition-colors`}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial 
                      ? 'bg-primary' 
                      : theme === 'dark' 
                        ? 'bg-slate-600' 
                        : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 ${
        theme === "dark" ? "bg-gradient-to-b from-slate-900 to-slate-800" : "bg-gradient-to-b from-gray-50 to-white"
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`p-8 md:p-12 rounded-3xl ${
              theme === "dark" 
                ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-slate-700/50" 
                : "bg-white border border-gray-100 shadow-xl"
            }`}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Ready to Transform Your Parking Management?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              Join hundreds of businesses that trust ParkEase for their parking management needs. Get started today with our 14-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group relative overflow-hidden">
                <Link to={user ? "/dashboard" : "/register"} className="relative z-10">
                  <span className="relative z-10 flex items-center">
                    {user ? 'Go to Dashboard' : 'Start Free Trial'}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="group"
                onClick={() => scrollToSection("how-it-works")}
              >
                <span className="flex items-center">
                  How It Works
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                </span>
              </Button>
            </div>
            <p className={`mt-4 text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
              No credit card required. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className={`relative h-96 py-20 px-4 min-h-screen flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-gradient-to-r from-red-900/70 to-indigo-900/70 text-white" : "bg-gradient-to-r from-red-900 to-indigo-600 text-white"
      }`}>
        <div className="max-w-4xl mx-auto text-center opacity-0 reveal-on-scroll transition-all duration-700">
          <h2 className={`text-4xl font-bold mb-6 ${
            theme === "dark" ? "text-gray-200" : "text-slate-900"
          }`}>Ready to optimize your parking management?</h2>
          <p className={`text-xl mb-8 ${
            theme === "dark" ? "text-gray-300" : "text-slate-500"
          }`}>
            Join thousands of facilities worldwide using ParkEase to streamline their operations.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/login">Sign In Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      
      {/* Floating Action Button */}
      {!user && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className={`fixed bottom-6 right-6 z-50 ${
            theme === "dark" ? "bg-primary/90 hover:bg-primary" : "bg-primary hover:bg-primary/90"
          } rounded-full p-4 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl`}
          onClick={() => scrollToSection("hero")}
          title="Back to top"
        >
          <ChevronUp className="h-6 w-6 text-white" />
        </motion.div>
      )}
    </div>
    
  );
};

export default Home;
