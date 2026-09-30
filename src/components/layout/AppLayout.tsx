import AppSidebar from "@/components/layout/AppSidebar"
import AppTopbar from "@/components/layout/AppTopbar"

/*
  Every signed-in screen renders inside this shell, which is what makes the
  dashboard, parking map, reservations and analytics read as one product rather
  than four pages that each invented their own header.
*/
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <AppSidebar />

    <div className="flex min-h-screen flex-col lg:pl-64">
      <AppTopbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6">
          {children}
        </div>
      </main>

      <footer className="border-t px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>ParkEase parking operations</p>
          <p>Rates in KSh · times in local timezone</p>
        </div>
      </footer>
    </div>
  </div>
)

export default AppLayout
