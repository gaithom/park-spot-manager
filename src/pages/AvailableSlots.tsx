import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Car,
  Clock,
  LayoutGrid,
  List,
  MapPin,
  ParkingSquare,
  RefreshCw,
} from "lucide-react";

import { useParking } from "@/context/parking";
import { useCapacity } from "@/hooks/use-capacity";
import type { ParkingSlot } from "@/types";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/layout/PageHeader";
import { BayLegend } from "@/components/parking/ParkingBay";
import ParkingLotMap from "@/components/parking/ParkingLotMap";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Panel,
  PanelActions,
  PanelBody,
  PanelDescription,
  PanelHeader,
  PanelHeading,
  PanelIcon,
  PanelTitle,
} from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AvailableSlots = () => {
  const { slots } = useParking();
  const capacity = useCapacity();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const availableSlots = slots.filter(
    (slot) => !slot.isOccupied && !slot.isReserved
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 450);
  };

  const details = selectedSlot
    ? [
        { label: "Status", value: "Available", icon: CheckCircle2 },
        { label: "Type", value: selectedSlot.type || "Standard", icon: Car },
        { label: "Floor", value: selectedSlot.floor || "Ground", icon: MapPin },
      ]
    : [];

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Operations"
        title="Parking map"
        description="Live status of every bay in the facility."
        backTo="/dashboard"
        actions={
          <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
            <RefreshCw className={isLoading ? "animate-spin" : undefined} />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Available"
          value={capacity.available}
          icon={CheckCircle2}
          tone="success"
          hint="Ready to fill now"
        />
        <StatTile
          label="Occupied"
          value={capacity.occupied}
          icon={Car}
          tone="primary"
          hint={`${capacity.occupancyRate}% of capacity`}
        />
        <StatTile
          label="Reserved"
          value={capacity.reserved}
          icon={Clock}
          tone="brass"
          hint="Held for arriving customers"
        />
      </div>

      <Panel>
        <PanelHeader>
          <PanelHeading>
            <PanelIcon>
              <ParkingSquare />
            </PanelIcon>
            <div>
              <PanelTitle>Facility layout</PanelTitle>
              <PanelDescription>
                {availableSlots.length} of {slots.length} bays free
              </PanelDescription>
            </div>
          </PanelHeading>

          <PanelActions>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "map" | "list")}
            >
              <TabsList variant="segmented">
                <TabsTrigger value="map">
                  <LayoutGrid />
                  Map
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </PanelActions>
        </PanelHeader>

        {isLoading ? (
          <PanelBody className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 rounded-md" />
            ))}
          </PanelBody>
        ) : availableSlots.length === 0 && viewMode === "list" ? (
          <EmptyState
            icon={ParkingSquare}
            title="No available bays"
            description="Every bay is currently occupied or reserved."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
            }
          />
        ) : viewMode === "map" ? (
          <PanelBody className="space-y-4">
            <BayLegend />
            <ParkingLotMap
              slots={slots}
              size="md"
              perRow={8}
              selectedSlot={selectedSlot?.slotNumber ?? null}
              onSlotSelect={setSelectedSlot}
            />
            <p className="text-xs text-muted-foreground">
              Select a free bay to see its details.
            </p>
          </PanelBody>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Bay</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableSlots.map((slot) => (
                <TableRow key={slot.slotNumber}>
                  <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                    {String(slot.slotNumber).padStart(2, "0")}
                  </TableCell>
                  <TableCell>{slot.type || "Standard"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {slot.floor || "Ground"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>

      <Dialog
        open={Boolean(selectedSlot)}
        onOpenChange={(open) => !open && setSelectedSlot(null)}
      >
        <DialogContent className="sm:max-w-[25rem]">
          <DialogHeader>
            <DialogTitle>
              Bay {selectedSlot ? String(selectedSlot.slotNumber).padStart(2, "0") : ""}
            </DialogTitle>
            <DialogDescription>
              Entries are recorded from the attendant console.
            </DialogDescription>
          </DialogHeader>

          <dl className="grid gap-2">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center gap-3 rounded-lg border bg-surface-sunken px-3 py-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-card text-muted-foreground">
                  <detail.icon className="h-4 w-4" />
                </span>
                <div>
                  <dt className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {detail.label}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {detail.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <Button asChild className="w-full">
            <Link to="/dashboard">
              <Car />
              Open attendant console
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AvailableSlots;
