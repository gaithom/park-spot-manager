import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { toast } from "sonner";

import { useParking } from "@/context/parking";
import type { ParkingSlot } from "@/types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParkVehicleFormProps {
  selectedSlot?: ParkingSlot | null;
  onParkingComplete?: () => void;
}

const ParkVehicleForm = ({
  selectedSlot,
  onParkingComplete,
}: ParkVehicleFormProps) => {
  const [regNumber, setRegNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const { parkVehicle, slots, vehicleTypeCategories } = useParking();

  // Entries are assigned to the first free bay, so show which one that is.
  const nextFreeBay = slots.find(
    (slot) => !slot.isOccupied && !slot.isReserved
  )?.slotNumber;

  const selectedRate = vehicleTypeCategories.find(
    (category) => category.name === vehicleType
  )?.hourlyRate;

  useEffect(() => {
    if (selectedSlot?.vehicle) {
      setRegNumber(selectedSlot.vehicle.regNumber);
      setVehicleType(selectedSlot.vehicle.vehicleType);
    } else {
      setRegNumber("");
      setVehicleType("");
    }
  }, [selectedSlot]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!vehicleType) {
      toast.error("Choose a vehicle type");
      return;
    }

    const assignedBay = nextFreeBay;

    if (parkVehicle({ regNumber, vehicleType })) {
      toast.success(
        assignedBay
          ? `${regNumber} parked in bay ${assignedBay}`
          : `${regNumber} parked`
      );
      setRegNumber("");
      setVehicleType("");
      onParkingComplete?.();
      return;
    }

    toast.error(
      nextFreeBay === undefined
        ? "The facility is full — no free bays left"
        : `${regNumber} is already parked in this facility`
    );
  };

  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>
          <PanelIcon>
            <LogIn />
          </PanelIcon>
          <div>
            <PanelTitle>Record entry</PanelTitle>
            <PanelDescription>
              {nextFreeBay !== undefined
                ? `Next free bay · ${String(nextFreeBay).padStart(2, "0")}`
                : "No free bays available"}
            </PanelDescription>
          </div>
        </PanelHeading>
      </PanelHeader>

      <PanelBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="regNumber">Registration number</Label>
            <Input
              id="regNumber"
              value={regNumber}
              onChange={(event) => setRegNumber(event.target.value.toUpperCase())}
              placeholder="KBZ 123A"
              className="font-mono uppercase tracking-wider"
              autoComplete="off"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vehicleType">Vehicle type</Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypeCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {selectedRate !== undefined
                ? `Charged at KSh ${selectedRate.toFixed(2)} per hour`
                : "Rates are set per vehicle type in Management"}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={nextFreeBay === undefined}
          >
            Park vehicle
          </Button>
        </form>
      </PanelBody>
    </Panel>
  );
};

export default ParkVehicleForm;
