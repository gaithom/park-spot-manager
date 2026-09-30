import { useMemo } from "react";
import { Timer } from "lucide-react";

import { useParking } from "@/context/parking";
import { useNow } from "@/hooks/use-now";
import { formatDuration, formatShortDateTime } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";
import { Plate } from "@/components/ui/plate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ActiveParkingDurations = () => {
  const { slots } = useParking();
  const now = useNow();

  // Longest stays first — those are the ones an attendant needs to look at.
  const active = useMemo(
    () =>
      slots
        .filter((slot) => slot.isOccupied && slot.vehicle?.entryTime)
        .sort(
          (a, b) =>
            new Date(a.vehicle!.entryTime as Date).getTime() -
            new Date(b.vehicle!.entryTime as Date).getTime()
        ),
    [slots]
  );

  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>
          <PanelIcon>
            <Timer />
          </PanelIcon>
          <div>
            <PanelTitle>Active sessions</PanelTitle>
            <PanelDescription>
              {active.length} {active.length === 1 ? "vehicle" : "vehicles"} on
              site, longest stay first
            </PanelDescription>
          </div>
        </PanelHeading>
      </PanelHeader>

      {active.length === 0 ? (
        <EmptyState
          icon={Timer}
          title="No vehicles on site"
          description="Active parking sessions appear here as soon as an entry is recorded."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Bay</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead className="text-right">Elapsed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {active.map((slot) => (
              <TableRow key={slot.slotNumber}>
                <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                  {String(slot.slotNumber).padStart(2, "0")}
                </TableCell>
                <TableCell>
                  <Plate value={slot.vehicle?.regNumber} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {slot.vehicle?.vehicleType || "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatShortDateTime(slot.vehicle!.entryTime as Date)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatDuration(slot.vehicle?.entryTime, now)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Panel>
  );
};

export default ActiveParkingDurations;
