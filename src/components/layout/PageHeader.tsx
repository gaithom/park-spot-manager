import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  /** Small uppercase kicker above the title, e.g. the section it belongs to. */
  eyebrow?: string
  title: string
  description?: React.ReactNode
  /** Renders a back button linking here. */
  backTo?: string
  actions?: React.ReactNode
  className?: string
}

const PageHeader = ({
  eyebrow,
  title,
  description,
  backTo,
  actions,
  className,
}: PageHeaderProps) => (
  <div
    className={cn(
      "flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between",
      className
    )}
  >
    <div className="flex min-w-0 items-start gap-3">
      {backTo ? (
        <Button
          asChild
          variant="outline"
          size="icon-sm"
          className="mt-0.5 shrink-0"
        >
          <Link to={backTo} aria-label="Go back">
            <ArrowLeft />
          </Link>
        </Button>
      ) : null}

      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-[1.375rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>

    {actions ? (
      <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
    ) : null}
  </div>
)

export default PageHeader
