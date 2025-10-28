
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import { useState } from "react"
import ParkingStats from "./ParkingStats"
import ParkingTable from "./ParkingTable"
import ParkingGrid from "./ParkingGrid"
import AnalyticsDashboard from "./AnalyticsDashboard"
import VehicleCategories from "./VehicleCategories"
import UserManagement from "./UserManagement"
import ActiveReservations from "./ActiveReservations"
import VehicleHistory from "./VehicleHistory"

const AdminDashboard = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Card className="border-neutral-800 shadow-lg">
          <ParkingStats />
        </Card>
      </div>

      <Tabs defaultValue="parking" className="bg-black/5 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="bg-background">
            <TabsTrigger value="parking" className="data-[state=active]:bg-secondary">Parking</TabsTrigger>
            <TabsTrigger value="reservations" className="data-[state=active]:bg-secondary">Reservations</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-secondary">Analytics</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-secondary">Vehicle History</TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-secondary">Management</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
        
        <TabsContent value="parking" className="space-y-6">
          <Card className="shadow-sm border-neutral-800 overflow-hidden">
            {viewMode === 'list' ? <ParkingTable /> : <ParkingGrid />}
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card className="border-neutral-800 shadow-md">
            <ActiveReservations />
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="border-neutral-800 shadow-md">
            <AnalyticsDashboard />
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="border-neutral-800 shadow-md">
            <VehicleHistory />
          </Card>
        </TabsContent>
        
        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-neutral-800 shadow-md">
              <VehicleCategories />
            </Card>
            <Card className="border-neutral-800 shadow-md">
              <UserManagement />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
