
import { useState } from "react";
import { useParking } from "@/context/ParkingContext";
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
    <Card className="w-full">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center text-primary">
          <Car className="mr-2 h-5 w-5" /> Park Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="regNumber">Vehicle Registration Number</Label>
            <Input
              id="regNumber"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="e.g., KBZ123A"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Input
              id="vehicleType"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              placeholder="e.g., Sedan, SUV, Truck"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Park Vehicle
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParkVehicleForm;
