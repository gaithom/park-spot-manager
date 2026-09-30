import { cn } from "@/lib/utils"

/*
  Section kickers numbered like stall markings — 01, 02, 03 — in the same mono
  face the bays and plates use. It ties the marketing page to the product
  without repeating the logo three more times.
*/
const SectionLabel = ({
  index,
  children,
  className,
}: {
  index: string
  children: React.ReactNode
  className?: string
}) => (
  <p className={cn("flex items-center gap-2.5", className)}>
    <span className="font-mono text-2xs font-semibold tabular-nums text-brass">
      {index}
    </span>
    <span aria-hidden="true" className="h-px w-7 bg-brass/45" />
    <span className="text-2xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </span>
  </p>
)

export { SectionLabel }
