import { cn } from "@/lib/utils"

/*
  The mark is three parking bays seen from above — two free, one taken (brass).
  Drawn as plain rects so it stays crisp at 16px and inherits theme tokens
  instead of shipping a raster asset.
*/
const LogoMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    className={cn("h-8 w-8", className)}
    role="img"
    aria-label="ParkEase"
  >
    <rect width="32" height="32" rx="9" className="fill-primary" />
    <g className="fill-primary-foreground">
      <rect x="7.5" y="9" width="3" height="14" rx="1.5" opacity="0.5" />
      <rect x="14.5" y="9" width="3" height="14" rx="1.5" opacity="0.75" />
    </g>
    <rect x="21.5" y="9" width="3" height="14" rx="1.5" className="fill-brass" />
  </svg>
)

interface LogoProps {
  className?: string
  markClassName?: string
  /** Hides the wordmark, e.g. in a collapsed rail. */
  hideWordmark?: boolean
  subtitle?: string
}

const Logo = ({
  className,
  markClassName,
  hideWordmark = false,
  subtitle,
}: LogoProps) => (
  <span className={cn("flex items-center gap-2.5", className)}>
    <LogoMark className={markClassName} />
    {hideWordmark ? null : (
      <span className="flex min-w-0 flex-col">
        <span className="text-[15px] font-semibold leading-none tracking-tight text-foreground">
          ParkEase
        </span>
        {subtitle ? (
          <span className="mt-1 truncate text-2xs font-medium uppercase tracking-wider text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </span>
    )}
  </span>
)

export { Logo, LogoMark }
