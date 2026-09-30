import { Toaster as Sonner } from "sonner"

import { useParking } from "@/context/parking"

type ToasterProps = React.ComponentProps<typeof Sonner>

/*
  Theme comes from the parking context, which is what actually toggles the
  `dark` class on <html>. The stock shadcn file reads next-themes, but this app
  has no next-themes provider mounted, so toasts used to ignore the app theme.
*/
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useParking()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:border-border group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:rounded-md group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:rounded-md group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:border-danger/30 group-[.toaster]:text-foreground",
          success:
            "group-[.toaster]:border-success/30 group-[.toaster]:text-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
