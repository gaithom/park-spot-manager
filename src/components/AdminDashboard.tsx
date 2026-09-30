import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";

import ActiveReservations from "./ActiveReservations";
import AnalyticsDashboard from "./AnalyticsDashboard";
import DailyRevenueSummary from "./DailyRevenueSummary";
import ParkingGrid from "./ParkingGrid";
import ParkingStats from "./ParkingStats";
import ParkingTable from "./ParkingTable";
import UserManagement from "./UserManagement";
import VehicleCategories from "./VehicleCategories";
import VehicleHistory from "./VehicleHistory";
import { Panel } from "@/components/ui/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const [tab, setTab] = useState("bays");
  const [view, setView] = useState<"table" | "map">("table");

  return (
    <div className="space-y-6">
      <ParkingStats />

      <Tabs value={tab} onValueChange={setTab}>
        {/* Section tabs and the view switch share one baseline rule. */}
        <div className="flex items-end gap-4 border-b">
          <TabsList variant="underline" className="flex-1 border-b-0">
            <TabsTrigger value="bays">Bays</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          {tab === "bays" ? (
            <Tabs
              value={view}
              onValueChange={(value) => setView(value as "table" | "map")}
              className="hidden pb-2 sm:block"
            >
              <TabsList variant="segmented">
                <TabsTrigger value="table">
                  <List />
                  Table
                </TabsTrigger>
                <TabsTrigger value="map">
                  <LayoutGrid />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          ) : null}
        </div>

        <TabsContent value="bays" className="mt-5">
          {view === "table" ? (
            <ParkingTable />
          ) : (
            <Panel>
              <ParkingGrid />
            </Panel>
          )}
        </TabsContent>

        <TabsContent value="reservations" className="mt-5">
          <ActiveReservations />
        </TabsContent>

        <TabsContent value="analytics" className="mt-5 space-y-4">
          <DailyRevenueSummary />
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="history" className="mt-5">
          <VehicleHistory />
        </TabsContent>

        <TabsContent value="management" className="mt-5">
          <div className="grid gap-4 xl:grid-cols-2">
            <VehicleCategories />
            <UserManagement />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
