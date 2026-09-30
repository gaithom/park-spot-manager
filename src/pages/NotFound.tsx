import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-blueprint opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />

      <div className="relative w-full max-w-md text-center">
        <Link to="/" className="mb-10 inline-flex">
          <Logo />
        </Link>

        <p
          data-numeric
          className="font-mono text-6xl font-semibold tracking-tight text-primary"
        >
          404
        </p>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">
          This bay doesn’t exist
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          We couldn’t find{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            {location.pathname}
          </code>
          . It may have been moved or never existed.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild>
            <Link to="/dashboard">
              <LayoutDashboard />
              Go to dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
