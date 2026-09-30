import * as React from "react"

import { cn } from "@/lib/utils"

// `values` is also an SVG animation attribute, so it is omitted from the base.
interface SparkProps extends Omit<React.SVGProps<SVGSVGElement>, "values"> {
  values: number[]
  /** Bars read better than a line for daily takings; line for continuous trends. */
  kind?: "bars" | "line"
}

/*
  A hand-rolled sparkline. Recharts is already a dependency but it renders a
  full chart tree per instance — far too heavy for a 40px glyph inside a tile.
  Colour comes from `currentColor`, so callers style it with text utilities.
*/
const Spark = ({ values, kind = "bars", className, ...props }: SparkProps) => {
  if (values.length === 0) return null

  const width = 100
  const height = 28
  const max = Math.max(...values, 1)

  if (kind === "bars") {
    const gap = values.length > 24 ? 0.6 : 1.4
    const barWidth = (width - gap * (values.length - 1)) / values.length

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className={cn("h-7 w-full", className)}
        aria-hidden="true"
        {...props}
      >
        {values.map((value, index) => {
          const barHeight = Math.max((value / max) * height, value > 0 ? 1.5 : 0)
          return (
            <rect
              key={index}
              x={index * (barWidth + gap)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              rx={Math.min(barWidth / 2, 1.2)}
              fill="currentColor"
              opacity={index === values.length - 1 ? 1 : 0.35}
            />
          )
        })}
      </svg>
    )
  }

  const step = values.length > 1 ? width / (values.length - 1) : 0
  const points = values
    .map((value, index) => `${index * step},${height - (value / max) * height}`)
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-7 w-full", className)}
      aria-hidden="true"
      {...props}
    >
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="currentColor"
        opacity={0.12}
      />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export { Spark }
