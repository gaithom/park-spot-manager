
import { useState } from "react";
import { useParking } from "@/context/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const ParkVehicleForm = () => {
  const [regNumber, setRegNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const { parkVehicle } = useParking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parkVehicle({ regNumber, vehicleType })) {
      // Reset form if successful
      setRegNumber("");
      setVehicleType("");
    }
  };

  return (
    <Card className="w-full bg-black border-primary/20">
      <CardHeader className="bg-primary/10 border-b border-primary/20">
        <CardTitle className="flex items-center text-primary">
          <Car className="mr-2 h-5 w-5" /> Park Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="regNumber" className="text-foreground">Vehicle Registration Number</Label>
            <Input
              id="regNumber"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="e.g., KBZ123A"
              className="bg-secondary border-primary/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleType" className="text-foreground">Vehicle Type</Label>
            <Input
              id="vehicleType"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              placeholder="e.g., Sedan, SUV, Truck"
              className="bg-secondary border-primary/20"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-primary text-white">
            Park Vehicle
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParkVehicleForm;
