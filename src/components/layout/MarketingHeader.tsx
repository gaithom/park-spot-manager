import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react"

import { useParking } from "@/context/parking"
import { useSecretUnlock } from "@/hooks/use-secret-unlock"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/brand/Logo"
import AdminAccessDialog from "@/components/layout/AdminAccessDialog"
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

const sections = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
]

const MarketingHeader = () => {
  const { user, logout } = useParking()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const { register, count, remaining } = useSecretUnlock(() =>
    setAdminOpen(true)
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <button
          type="button"
          onClick={register}
          title={
            count > 0 ? `${remaining} more taps for administrator access` : "ParkEase"
          }
          className="flex items-center rounded-md transition-opacity hover:opacity-80"
        >
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {user.isLoggedIn ? (
            <>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/dashboard">Open dashboard</Link>
              </Button>
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
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    {user.name || user.username}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings />
                    Profile settings
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
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Get started</Link>
              </Button>
              <Button asChild variant="outline" size="icon-sm" className="sm:hidden">
                <Link to="/login" aria-label="Sign in">
                  <User />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <AdminAccessDialog open={adminOpen} onOpenChange={setAdminOpen} />
    </header>
  )
}

export default MarketingHeader
