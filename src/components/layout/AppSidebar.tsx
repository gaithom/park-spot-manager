import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  BarChart3,
  CalendarClock,
  ExternalLink,
  LayoutDashboard,
  LogIn,
  LogOut,
  ParkingSquare,
  Settings,
  UserPlus,
} from "lucide-react"

import { useParking } from "@/context/parking"
import { useCapacity } from "@/hooks/use-capacity"
import { useSecretUnlock } from "@/hooks/use-secret-unlock"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/brand/Logo"
import AdminAccessDialog from "@/components/layout/AdminAccessDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Meter } from "@/components/ui/meter"

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { to: "/available-slots", label: "Parking map", icon: ParkingSquare },
      { to: "/reservations", label: "Reservations", icon: CalendarClock },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/analytics", label: "Analytics", icon: BarChart3, adminOnly: true },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/profile", label: "Profile & settings", icon: Settings }],
  },
]

const SidebarLink = ({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate?: () => void
}) => (
  <NavLink to={item.to} onClick={onNavigate} end>
    {({ isActive }) => (
      <span
        className={cn(
          "relative flex h-9 items-center gap-2.5 rounded-md px-3 text-[13px] font-medium transition-colors",
          isActive
            ? "bg-sidebar-active text-foreground shadow-xs"
            : "text-muted-foreground hover:bg-sidebar-active/60 hover:text-foreground"
        )}
      >
        {isActive ? (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
        ) : null}
        <item.icon
          className={cn("h-4 w-4 shrink-0", isActive && "text-primary")}
        />
        <span className="truncate">{item.label}</span>
      </span>
    )}
  </NavLink>
)

/*
  The sidebar body, shared by the fixed desktop rail and the mobile sheet so the
  two can never drift apart.
*/
export const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user, logout } = useParking()
  const capacity = useCapacity()
  const navigate = useNavigate()
  const [adminOpen, setAdminOpen] = useState(false)
  const { register, count, remaining } = useSecretUnlock(() =>
    setAdminOpen(true)
  )

  const roleLabel = user.isLoggedIn
    ? user.role === "admin"
      ? "Administrator"
      : "Attendant"
    : "Guest access"

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.adminOnly || user.role === "admin"
      ),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        <button
          type="button"
          onClick={register}
          className="flex items-center rounded-md text-left transition-opacity hover:opacity-80"
          title={
            count > 0
              ? `${remaining} more taps for administrator access`
              : "ParkEase"
          }
        >
          <Logo subtitle={roleLabel} />
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 scrollbar-slim">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-2xs font-semibold uppercase tracking-wider text-sidebar-muted">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarLink key={item.to} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-3 mb-3 rounded-lg border bg-card p-3.5 shadow-xs">
        <div className="flex items-baseline justify-between">
          <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
            Capacity
          </p>
          <p className="text-2xs font-semibold text-muted-foreground">
            <span data-numeric className="text-sm text-foreground">
              {capacity.occupancyRate}
            </span>
            % full
          </p>
        </div>
        <div className="mt-2.5">
          <Meter
            size="sm"
            showLegend={false}
            total={capacity.total}
            segments={[
              { label: "Occupied", value: capacity.occupied, color: "bg-foreground/70" },
              { label: "Reserved", value: capacity.reserved, color: "bg-brass" },
              { label: "Available", value: capacity.available, color: "bg-success" },
            ]}
          />
        </div>
        <p className="mt-2.5 text-xs text-muted-foreground">
          <span data-numeric className="font-semibold text-foreground">
            {capacity.available}
          </span>{" "}
          of{" "}
          <span data-numeric>{capacity.total}</span> bays free
        </p>
      </div>

      <div className="border-t border-sidebar-border p-3">
        {user.isLoggedIn ? (
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-semibold uppercase text-primary">
              {(user.name || user.username || "?").charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">
                {user.name || user.username}
              </p>
              <Badge
                variant={user.role === "admin" ? "subtle" : "outline"}
                size="sm"
                className="mt-0.5"
              >
                {user.role === "admin" ? "Admin" : "Attendant"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              title="Sign out"
              onClick={() => logout(() => navigate("/"))}
            >
              <LogOut />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="px-1 text-xs text-muted-foreground">
              Sign in to record entries and manage reservations.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => navigate("/login")}>
                <LogIn />
                Sign in
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/register")}
              >
                <UserPlus />
                Register
              </Button>
            </div>
          </div>
        )}

        <NavLink
          to="/"
          onClick={onNavigate}
          className="mt-3 flex items-center gap-2 rounded-md px-1 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View public site
        </NavLink>
      </div>

      <AdminAccessDialog open={adminOpen} onOpenChange={setAdminOpen} />
    </div>
  )
}

const AppSidebar = () => (
  <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
    <SidebarNav />
  </aside>
)

export default AppSidebar
