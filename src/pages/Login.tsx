
import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParking } from "@/context/parking";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Car, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useParking();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user.isLoggedIn) {
      navigate("/dashboard");
    }
  }, [user.isLoggedIn, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate("/dashboard");
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Car className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">ParkEase</CardTitle>
          <CardDescription>
            Enter your credentials to access the parking management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground mb-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
          <p className="w-full text-center text-sm text-muted-foreground">
            Demo credentials: admin / password123
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
