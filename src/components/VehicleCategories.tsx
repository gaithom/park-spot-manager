
import { useState } from "react";
import { useParking } from "@/context/parking";
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
    <Card className="w-full bg-black border-primary/20">
      <CardHeader className="bg-primary/5 border-b border-primary/20">
        <CardTitle className="flex items-center text-primary">
          <Tags className="mr-2 h-5 w-5" /> Vehicle Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-foreground">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Pickup Truck"
                className="bg-secondary border-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate" className="text-foreground">Hourly Rate (ksh)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="1"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="e.g., 15"
                className="bg-secondary border-primary/20"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary">
            Add Category
          </Button>
        </form>

        <div className="rounded-md border border-primary/20 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow className="border-b border-primary/20">
                <TableHead>Category</TableHead>
                <TableHead>Hourly Rate (ksh)</TableHead>
                <TableHead>Current Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleTypeCategories.map((category) => (
                <TableRow key={category.name}>
                  <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                  <TableCell className="text-foreground">{category.hourlyRate.toFixed(2)}</TableCell>
                  <TableCell className="text-foreground">{category.count}</TableCell>
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
