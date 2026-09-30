import { Link } from "react-router-dom"
import { Check } from "lucide-react"

import { Logo, LogoMark } from "@/components/brand/Logo"
import ThemeToggle from "@/components/ThemeToggle"

const highlights = [
  "Live bay occupancy across the whole facility",
  "Automatic fee calculation on exit",
  "Reservations and payments in one ledger",
]

/*
  Split layout: a quiet brand panel carries the context so the form itself can
  stay short. The panel collapses away entirely below `lg`.
*/
const AuthLayout = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description?: string
}) => (
  <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
    <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex xl:p-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5"
      />

      <Link to="/" className="relative flex items-center gap-2.5">
        <LogoMark className="h-8 w-8 [&>rect:first-child]:fill-white/10" />
        <span className="text-[15px] font-semibold tracking-tight">
          ParkEase
        </span>
      </Link>

      <div className="relative max-w-md">
        <h2 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-primary-foreground xl:text-[2rem]">
          Every bay accounted for, every shift.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-primary-foreground/75">
          ParkEase gives attendants a single screen for entries and exits, and
          gives managers the numbers behind them.
        </p>
        <ul className="mt-8 space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-primary-foreground/85">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-primary-foreground/55">
        Nakuru, Kenya · support@parkease.com
      </p>
    </div>

    <div className="flex flex-col">
      <div className="flex items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="lg:invisible">
          <Logo markClassName="h-7 w-7" />
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 pb-16 lg:px-10">
        <div className="w-full max-w-[22rem]">
          <div className="mb-7">
            <h1 className="text-[1.375rem] font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {description ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  </div>
)

export default AuthLayout
