
import { useState } from "react";
import { useParking } from "@/context/ParkingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tags } from "lucide-react";

const VehicleCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const { vehicleTypeCategories, addVehicleCategory } = useParking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addVehicleCategory({
      name: categoryName,
      hourlyRate: Number(hourlyRate)
    });
    
    // Reset form if successful
    setCategoryName("");
    setHourlyRate("");
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-green-500/5">
        <CardTitle className="flex items-center text-green-600">
          <Tags className="mr-2 h-5 w-5" /> Vehicle Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Pickup Truck"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (ksh)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="1"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="e.g., 15"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-green-600">
            Add Category
          </Button>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Hourly Rate (ksh)</TableHead>
                <TableHead>Current Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleTypeCategories.map((category) => (
                <TableRow key={category.name}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.hourlyRate.toFixed(2)}</TableCell>
                  <TableCell>{category.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCategories;
