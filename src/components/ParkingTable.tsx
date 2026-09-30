import { useMemo, useState } from "react";
import { ParkingSquare, Search } from "lucide-react";

import { useParking } from "@/context/parking";
import { useNow } from "@/hooks/use-now";
import { formatDuration, formatShortDateTime } from "@/lib/utils";
import { bayStatus } from "@/components/parking/ParkingBay";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Panel,
  PanelActions,
  PanelDescription,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";
import { Plate } from "@/components/ui/plate";
import { StatusPill } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Filter = "occupied" | "available" | "all";

const ParkingTable = () => {
  const { slots } = useParking();
  const now = useNow(30_000);
  const [filter, setFilter] = useState<Filter>("occupied");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();

    return slots
      .filter((slot) => {
        if (filter === "occupied" && !slot.isOccupied) return false;
        if (filter === "available" && slot.isOccupied) return false;
        if (!term) return true;
        return (
          slot.vehicle?.regNumber?.toLowerCase().includes(term) ||
          String(slot.slotNumber).includes(term)
        );
      })
      .sort((a, b) => a.slotNumber - b.slotNumber);
  }, [slots, filter, query]);

  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>
          <PanelIcon>
            <ParkingSquare />
          </PanelIcon>
          <div className="min-w-0">
            <PanelTitle>Bay register</PanelTitle>
            <PanelDescription>
              {rows.length} of {slots.length} bays shown
            </PanelDescription>
          </div>
        </PanelHeading>

        <PanelActions>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Plate or bay"
              aria-label="Search by registration or bay number"
              className="h-8 w-40 pl-8 text-[13px]"
            />
          </div>

          <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
            <TabsList variant="segmented">
              <TabsTrigger value="occupied">Occupied</TabsTrigger>
              <TabsTrigger value="available">Free</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </PanelActions>
      </PanelHeader>

      {rows.length === 0 ? (
        <EmptyState
          icon={ParkingSquare}
          title="Nothing to show"
          description={
            query
              ? `No bay or registration matches “${query}”.`
              : "No bays match this filter right now."
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Bay</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Vehicle type</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((slot) => (
              <TableRow key={slot.slotNumber}>
                <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                  {String(slot.slotNumber).padStart(2, "0")}
                </TableCell>
                <TableCell>
                  <StatusPill status={bayStatus(slot)} />
                </TableCell>
                <TableCell>
                  <Plate value={slot.vehicle?.regNumber} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {slot.vehicle?.vehicleType || "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {slot.vehicle?.entryTime
                    ? formatShortDateTime(slot.vehicle.entryTime)
                    : "—"}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {slot.vehicle?.entryTime
                    ? formatDuration(slot.vehicle.entryTime, now)
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Panel>
  );
};

export default ParkingTable;
