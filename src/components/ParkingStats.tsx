import { Activity, Car, CheckCircle2, ParkingSquare } from "lucide-react";

import { useCapacity } from "@/hooks/use-capacity";
import { Meter } from "@/components/ui/meter";
import { StatTile } from "@/components/ui/stat-tile";

const ParkingStats = () => {
  const { total, available, occupied, reserved, occupancyRate } = useCapacity();
  const availableShare = total > 0 ? Math.round((available / total) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        label="Total capacity"
        value={total}
        icon={ParkingSquare}
        tone="neutral"
        hint="Bays across the facility"
      />

      <StatTile
        label="Available now"
        value={available}
        icon={CheckCircle2}
        tone="success"
        hint={`${availableShare}% of capacity ready to fill`}
      />

      <StatTile
        label="Occupied"
        value={occupied}
        icon={Car}
        tone="primary"
        hint={
          reserved > 0
            ? `${reserved} further ${reserved === 1 ? "bay" : "bays"} held on reservation`
            : "No bays held on reservation"
        }
      />

      <StatTile
        label="Occupancy"
        value={occupancyRate}
        unit="%"
        icon={Activity}
        tone={occupancyRate >= 90 ? "warning" : "info"}
      >
        <Meter
          size="sm"
          showLegend={false}
          total={total}
          segments={[
            { label: "Occupied", value: occupied, color: "bg-foreground/70" },
            { label: "Reserved", value: reserved, color: "bg-brass" },
            { label: "Available", value: available, color: "bg-success" },
          ]}
        />
      </StatTile>
    </div>
  );
};

export default ParkingStats;
