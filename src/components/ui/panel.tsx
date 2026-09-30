import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Panel is the single surface used for every framed block in the app — tables,
  forms, charts, the parking map. One component means one set of paddings,
  one divider weight and one corner radius everywhere.
*/

const Panel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
      className
    )}
    {...props}
  />
))
Panel.displayName = "Panel"

const PanelHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-5 py-3.5",
      className
    )}
    {...props}
  />
))
PanelHeader.displayName = "PanelHeader"

const PanelHeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 items-center gap-2.5", className)}
    {...props}
  />
))
PanelHeading.displayName = "PanelHeading"

const PanelIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary [&_svg]:h-4 [&_svg]:w-4",
      className
    )}
    {...props}
  />
))
PanelIcon.displayName = "PanelIcon"

const PanelTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "truncate text-sm font-semibold leading-tight tracking-tight",
      className
    )}
    {...props}
  />
))
PanelTitle.displayName = "PanelTitle"

const PanelDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
))
PanelDescription.displayName = "PanelDescription"

const PanelActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex shrink-0 items-center gap-2", className)}
    {...props}
  />
))
PanelActions.displayName = "PanelActions"

const PanelBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 p-5", className)} {...props} />
))
PanelBody.displayName = "PanelBody"

const PanelFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-3 border-t bg-surface-sunken/50 px-5 py-2.5 text-xs text-muted-foreground",
      className
    )}
    {...props}
  />
))
PanelFooter.displayName = "PanelFooter"

export {
  Panel,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
  PanelDescription,
  PanelActions,
  PanelBody,
  PanelFooter,
}
