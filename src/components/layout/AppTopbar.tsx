import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CreditCard, LogOut, Menu, Settings, User } from "lucide-react"
import { toast } from "sonner"

import { useParking } from "@/context/parking"
import { useCapacity } from "@/hooks/use-capacity"
import { Logo } from "@/components/brand/Logo"
import { SidebarNav } from "@/components/layout/AppSidebar"
import PaymentModal from "@/components/PaymentModal"
import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const LiveClock = () => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <time
      dateTime={now.toISOString()}
      className="text-xs font-medium text-muted-foreground"
    >
      {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </time>
  )
}

const AppTopbar = () => {
  const { user, logout } = useParking()
  const capacity = useCapacity()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="lg:hidden">
            <Menu />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <Logo className="lg:hidden" markClassName="h-7 w-7" />

      {/* Live occupancy readout — real context data, not decoration. */}
      <div className="hidden items-center gap-2.5 lg:flex">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Live</span>
          <span className="mx-1.5 text-border-strong">·</span>
          <span data-numeric className="font-semibold text-foreground">
            {capacity.occupied}
          </span>{" "}
          of <span data-numeric>{capacity.total}</span> bays in use
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="mr-1 hidden md:block">
          <LiveClock />
        </div>

        {user.isLoggedIn ? (
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => setPaymentOpen(true)}
          >
            <CreditCard />
            Take payment
          </Button>
        ) : null}

        <ThemeToggle />

        {user.isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-xs font-semibold uppercase text-primary ring-offset-background transition-shadow hover:ring-2 hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {(user.name || user.username || "?").charAt(0)}
                <span className="sr-only">Open account menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user.name || user.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile/settings")}>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="sm:hidden"
                onClick={() => setPaymentOpen(true)}
              >
                <CreditCard />
                Take payment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => logout(() => navigate("/"))}
              >
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" onClick={() => navigate("/login")}>
            Sign in
          </Button>
        )}
      </div>

      {user.isLoggedIn ? (
        <Elements stripe={stripePromise}>
          <PaymentModal
            isOpen={paymentOpen}
            onClose={() => setPaymentOpen(false)}
            amount={0}
            onSuccess={() => {
              toast.success("Payment received")
              setPaymentOpen(false)
            }}
            onError={(message) => toast.error(`Payment failed: ${message}`)}
            vehicleType=""
            duration=""
          />
        </Elements>
      ) : null}
    </header>
  )
}

export default AppTopbar
