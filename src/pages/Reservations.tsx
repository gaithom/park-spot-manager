import { CalendarClock, CheckCircle2, History } from "lucide-react";

import { useParking } from "@/context/parking";
import { formatShortDateTime } from "@/lib/utils";
import ActiveReservations from "@/components/ActiveReservations";
import ReservationForm from "@/components/ReservationForm";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/layout/PageHeader";
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
import { StatTile } from "@/components/ui/stat-tile";
import { StatusPill } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Reservations = () => {
  const { reservations } = useParking();

  const active = reservations.filter((r) => r.status === "active");
  const completed = reservations.filter((r) => r.status === "completed");
  const cancelled = reservations.filter((r) => r.status === "cancelled");
  const past = reservations.filter((r) => r.status !== "active");

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Operations"
        title="Reservations"
        description="Hold bays ahead of arrival and review past bookings."
        backTo="/dashboard"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Active"
          value={active.length}
          icon={CalendarClock}
          tone="success"
          hint="Bays currently held"
        />
        <StatTile
          label="Completed"
          value={completed.length}
          icon={CheckCircle2}
          tone="info"
          hint="Bookings fulfilled"
        />
        <StatTile
          label="Cancelled"
          value={cancelled.length}
          icon={History}
          tone="neutral"
          hint="Released before arrival"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ActiveReservations />
        </div>
        <div className="xl:col-span-2">
          <ReservationForm />
        </div>
      </div>

      <Panel>
        <PanelHeader>
          <PanelHeading>
            <PanelIcon>
              <History />
            </PanelIcon>
            <div>
              <PanelTitle>Reservation history</PanelTitle>
              <PanelDescription>
                {past.length} completed or cancelled bookings
              </PanelDescription>
            </div>
          </PanelHeading>
        </PanelHeader>

        {past.length === 0 ? (
          <EmptyState
            icon={History}
            title="No past reservations"
            description="Completed and cancelled bookings are listed here."
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
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {past.map((reservation) => (
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
                    <StatusPill status={reservation.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </AppLayout>
  );
};

export default Reservations;
