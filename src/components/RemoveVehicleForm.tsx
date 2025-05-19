
import { useState } from "react";
import { useParking } from "@/context/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CarTaxiFront } from "lucide-react";

const RemoveVehicleForm = () => {
  const [regNumber, setRegNumber] = useState("");
  const { removeVehicle } = useParking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = removeVehicle(regNumber);
    if (result.success) {
      setRegNumber("");
    }
  };

  return (
    <Card className="w-full bg-black border-primary/20">
      <CardHeader className="bg-destructive/10 border-b border-primary/20">
        <CardTitle className="flex items-center text-destructive">
          <CarTaxiFront className="mr-2 h-5 w-5" /> Remove Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="removeRegNumber" className="text-foreground">Vehicle Registration Number</Label>
            <Input
              id="removeRegNumber"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="Enter registration number"
              className="bg-secondary border-primary/20"
              required
            />
          </div>
          <Button type="submit" variant="destructive" className="w-full">
            Remove Vehicle
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RemoveVehicleForm;
