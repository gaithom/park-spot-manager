import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { useParking } from "@/context/parking";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useParking();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate("/dashboard");
    }
  }, [user.isLoggedIn, navigate]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (login(username, password)) {
      navigate("/dashboard");
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      description="Use your staff account to reach the parking console."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="admin"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pr-10"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
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
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>

      <div className="mt-8 rounded-lg border border-dashed bg-surface-sunken px-3.5 py-3">
        <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
          Demo credentials
        </p>
        <p className="mt-1.5 font-mono text-xs text-foreground">
          admin / password123
          <span className="mx-2 text-border-strong">·</span>
          attendant / password123
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
