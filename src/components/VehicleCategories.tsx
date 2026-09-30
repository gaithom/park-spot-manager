import { useState } from "react";
import { Tags } from "lucide-react";
import { toast } from "sonner";

import { useParking } from "@/context/parking";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Panel,
  PanelBody,
  PanelDescription,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VehicleCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const { vehicleTypeCategories, addVehicleCategory } = useParking();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const created = addVehicleCategory({
      name: categoryName,
      hourlyRate: Number(hourlyRate),
    });

    if (!created) {
      toast.error(`“${categoryName}” already exists`);
      return;
    }

    toast.success(`${categoryName} added at KSh ${formatMoney(Number(hourlyRate))}/hr`);
    setCategoryName("");
    setHourlyRate("");
  };

  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>
          <PanelIcon>
            <Tags />
          </PanelIcon>
          <div>
            <PanelTitle>Vehicle categories</PanelTitle>
            <PanelDescription>
              Hourly rates applied when a bay is released
            </PanelDescription>
          </div>
        </PanelHeading>
      </PanelHeader>

      <PanelBody className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="categoryName">Category name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Pickup truck"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate">Hourly rate (KSh)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="1"
                step="0.01"
                value={hourlyRate}
                onChange={(event) => setHourlyRate(event.target.value)}
                placeholder="15"
                required
              />
            </div>
          </div>
          <Button type="submit" variant="outline" className="w-full sm:w-auto">
            Add category
          </Button>
        </form>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Rate / hr</TableHead>
                <TableHead className="text-right">On site</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleTypeCategories.map((category) => (
                <TableRow key={category.name}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">
                    KSh {formatMoney(category.hourlyRate)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {category.count}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PanelBody>
    </Panel>
  );
};

export default VehicleCategories;
