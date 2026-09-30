import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, ParkingSquare, UserPlus } from "lucide-react";

import { useParking } from "@/context/parking";
import AdminDashboard from "@/components/AdminDashboard";
import AttendantDashboard from "@/components/AttendantDashboard";
import ParkingStats from "@/components/ParkingStats";
import ParkingLotGrid from "@/components/ParkingLotGrid";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Panel,
  PanelBody,
  PanelDescription,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[8.5rem] rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-9 w-72 rounded-md" />
    <Skeleton className="h-80 rounded-xl" />
  </div>
);

const GuestDashboard = () => (
  <div className="space-y-6">
    <ParkingStats />

    <div className="grid gap-4 xl:grid-cols-3">
      <Panel className="xl:col-span-2">
        <PanelHeader>
          <PanelHeading>
            <PanelIcon>
              <ParkingSquare />
            </PanelIcon>
            <div>
              <PanelTitle>Live facility map</PanelTitle>
              <PanelDescription>
                Current occupancy across all bays
              </PanelDescription>
            </div>
          </PanelHeading>
        </PanelHeader>
        <PanelBody>
          <ParkingLotGrid />
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader>
          <PanelHeading>
            <PanelTitle>Staff sign in</PanelTitle>
          </PanelHeading>
        </PanelHeader>
        <PanelBody className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Availability is public. Recording entries and exits, managing
            reservations and viewing revenue need a staff account.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/login">
                <LogIn />
                Sign in
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/register">
                <UserPlus />
                Create an account
              </Link>
            </Button>
          </div>
        </PanelBody>
      </Panel>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useParking();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const title = user.isLoggedIn
    ? user.role === "admin"
      ? "Facility overview"
      : "Attendant console"
    : "Parking availability";

  const description = user.isLoggedIn
    ? user.role === "admin"
      ? "Occupancy, revenue and access for the whole facility."
      : "Record entries and exits, and keep an eye on active sessions."
    : "Live occupancy for the facility. Sign in to record vehicle movements.";

  return (
    <AppLayout>
      <PageHeader
        eyebrow={user.isLoggedIn ? "Operations" : "Public view"}
        title={title}
        description={description}
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : user.isLoggedIn ? (
        user.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <AttendantDashboard />
        )
      ) : (
        <GuestDashboard />
      )}
    </AppLayout>
  );
};

export default Dashboard;
