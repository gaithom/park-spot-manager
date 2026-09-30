import { CalendarClock, X } from "lucide-react";
import { toast } from "sonner";

import { useParking } from "@/context/parking";
import { formatShortDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { StatusPill } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ActiveReservations = () => {
  const { reservations, cancelReservation } = useParking();
  const active = reservations.filter(
    (reservation) => reservation.status === "active"
  );

  const handleCancel = (id: string, plate: string) => {
    if (cancelReservation(id)) {
      toast.success(`Reservation for ${plate} cancelled`);
    } else {
      toast.error("Could not cancel that reservation");
    }
  };

  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>
          <PanelIcon>
            <CalendarClock />
          </PanelIcon>
          <div>
            <PanelTitle>Active reservations</PanelTitle>
            <PanelDescription>
              {active.length} {active.length === 1 ? "bay" : "bays"} currently
              held
            </PanelDescription>
          </div>
        </PanelHeading>
      </PanelHeader>

      {active.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No active reservations"
          description="Held bays appear here until the vehicle arrives or the hold is cancelled."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Bay</TableHead>
              <TableHead>Reserved for</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Until</TableHead>
              <TableHead className="w-28 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {active.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                  {String(reservation.slotNumber).padStart(2, "0")}
                </TableCell>
                <TableCell className="font-medium">
                  {reservation.reservedFor}
                </TableCell>
                <TableCell>
                  <Plate value={reservation.regNumber} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatShortDateTime(reservation.startTime)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatShortDateTime(reservation.endTime)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-muted-foreground hover:bg-danger-subtle hover:text-danger"
                    onClick={() =>
                      handleCancel(reservation.id, reservation.regNumber)
                    }
                  >
                    <X />
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Panel>
  );
};

export default ActiveReservations;
