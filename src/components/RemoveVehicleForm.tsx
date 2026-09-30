import { useState } from "react";
import { LogOut } from "lucide-react";
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

const RemoveVehicleForm = () => {
  const [regNumber, setRegNumber] = useState("");
  const { removeVehicle } = useParking();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = removeVehicle(regNumber);

    if (result.success) {
      toast.success(`${regNumber} released`, {
        description:
          result.fee !== undefined
            ? `Parking fee: KSh ${formatMoney(result.fee)}`
            : undefined,
      });
      setRegNumber("");
      return;
    }

    toast.error(`No parked vehicle found with registration ${regNumber}`);
  };

  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>
          <PanelIcon className="bg-muted text-muted-foreground">
            <LogOut />
          </PanelIcon>
          <div>
            <PanelTitle>Record exit</PanelTitle>
            <PanelDescription>Frees the bay and closes the ticket</PanelDescription>
          </div>
        </PanelHeading>
      </PanelHeader>

      <PanelBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="removeRegNumber">Registration number</Label>
            <Input
              id="removeRegNumber"
              value={regNumber}
              onChange={(event) => setRegNumber(event.target.value.toUpperCase())}
              placeholder="KBZ 123A"
              className="font-mono uppercase tracking-wider"
              autoComplete="off"
              required
            />
          </div>

          <Button type="submit" variant="outline" className="w-full">
            Release bay &amp; calculate fee
          </Button>
        </form>
      </PanelBody>
    </Panel>
  );
};

export default RemoveVehicleForm;
