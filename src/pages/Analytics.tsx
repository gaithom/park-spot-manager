
import { useParking } from "@/context/parking";
import NavBar from "@/components/NavBar";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart, LineChart, PieChart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

const Analytics = () => {
  const { parkingHistory, vehicleTypeCategories, dailyRevenue } = useParking();

  // Calculate total revenue
  const totalRevenue = parkingHistory.reduce((total, record) => total + record.fee, 0);
  
  // Get most recent transactions
  const recentTransactions = [...parkingHistory]
    .sort((a, b) => new Date(b.exitTime).getTime() - new Date(a.exitTime).getTime())
    .slice(0, 5);

  // Find most common vehicle type
  const vehicleTypeCounts = parkingHistory.reduce((acc, record) => {
    acc[record.vehicleType] = (acc[record.vehicleType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonVehicleType = Object.entries(vehicleTypeCounts).reduce(
    (max, [type, count]) => (count > max.count ? { type, count } : max),
    { type: "None", count: 0 }
  );

  // Get average parking duration in hours
  const averageDuration = parkingHistory.length > 0
    ? parkingHistory.reduce((sum, record) => {
        const duration = (new Date(record.exitTime).getTime() - new Date(record.entryTime).getTime()) / (1000 * 60 * 60);
        return sum + duration;
      }, 0) / parkingHistory.length
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Parking Analytics</h1>
            <p className="text-muted-foreground">
              Insights and statistics for your parking operations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ksh {totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parkingHistory.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Most Common Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mostCommonVehicleType.type}</div>
              <p className="text-sm text-muted-foreground">{mostCommonVehicleType.count} visits</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Parking Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageDuration.toFixed(1)} hrs</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <AnalyticsDashboard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-blue-500/5">
              <CardTitle className="flex items-center text-blue-600">
                <BarChart className="mr-2 h-5 w-5" /> Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Exit Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((record) => {
                      const duration = (new Date(record.exitTime).getTime() - new Date(record.entryTime).getTime()) / (1000 * 60 * 60);
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.regNumber}</TableCell>
                          <TableCell>{formatDateTime(record.exitTime)}</TableCell>
                          <TableCell>{duration.toFixed(1)} hrs</TableCell>
                          <TableCell>ksh {record.fee.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No transactions recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-500/5">
              <CardTitle className="flex items-center text-green-600">
                <PieChart className="mr-2 h-5 w-5" /> Vehicle Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleTypeCategories.map((category) => {
                    const typeRevenue = parkingHistory
                      .filter(record => record.vehicleType.toLowerCase() === category.name.toLowerCase())
                      .reduce((sum, record) => sum + record.fee, 0);
                      
                    return (
                      <TableRow key={category.name}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>ksh {category.hourlyRate.toFixed(2)}</TableCell>
                        <TableCell>ksh {typeRevenue.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
