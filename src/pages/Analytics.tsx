import { useMemo } from "react";
import { Banknote, Car, Receipt, Tags, Timer } from "lucide-react";

import { useParking } from "@/context/parking";
import { formatDuration, formatMoney, formatShortDateTime } from "@/lib/utils";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Analytics = () => {
  const { parkingHistory, vehicleTypeCategories } = useParking();

  const summary = useMemo(() => {
    const totalRevenue = parkingHistory.reduce(
      (total, record) => total + record.fee,
      0
    );

    const counts = parkingHistory.reduce<Record<string, number>>((acc, record) => {
      acc[record.vehicleType] = (acc[record.vehicleType] || 0) + 1;
      return acc;
    }, {});

    const mostCommon = Object.entries(counts).reduce(
      (max, [type, count]) => (count > max.count ? { type, count } : max),
      { type: "—", count: 0 }
    );

    const averageHours =
      parkingHistory.length > 0
        ? parkingHistory.reduce((sum, record) => {
            const ms =
              new Date(record.exitTime).getTime() -
              new Date(record.entryTime).getTime();
            return sum + ms / 3_600_000;
          }, 0) / parkingHistory.length
        : 0;

    return { totalRevenue, mostCommon, averageHours };
  }, [parkingHistory]);

  const recent = useMemo(
    () =>
      [...parkingHistory]
        .sort(
          (a, b) =>
            new Date(b.exitTime).getTime() - new Date(a.exitTime).getTime()
        )
        .slice(0, 8),
    [parkingHistory]
  );

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Revenue, vehicle mix and dwell time across the facility."
        backTo="/dashboard"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total revenue"
          prefix="KSh"
          value={formatMoney(summary.totalRevenue)}
          icon={Banknote}
          tone="success"
          hint="All closed tickets"
        />
        <StatTile
          label="Transactions"
          value={parkingHistory.length}
          icon={Receipt}
          tone="info"
          hint="Vehicles released to date"
        />
        <StatTile
          label="Most common vehicle"
          value={summary.mostCommon.type}
          icon={Car}
          tone="primary"
          hint={`${summary.mostCommon.count} visits`}
        />
        <StatTile
          label="Average stay"
          value={summary.averageHours.toFixed(1)}
          unit="hrs"
          icon={Timer}
          tone="brass"
          hint="Across all completed visits"
        />
      </div>

      <AnalyticsDashboard />

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHeader>
            <PanelHeading>
              <PanelIcon>
                <Receipt />
              </PanelIcon>
              <div>
                <PanelTitle>Recent transactions</PanelTitle>
                <PanelDescription>Last {recent.length} releases</PanelDescription>
              </div>
            </PanelHeading>
          </PanelHeader>

          {recent.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Completed visits appear here with their duration and fee."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Released</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Plate value={record.regNumber} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatShortDateTime(record.exitTime)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDuration(record.entryTime, new Date(record.exitTime))}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      KSh {formatMoney(record.fee)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelHeading>
              <PanelIcon>
                <Tags />
              </PanelIcon>
              <div>
                <PanelTitle>Revenue by category</PanelTitle>
                <PanelDescription>Rate and takings per vehicle type</PanelDescription>
              </div>
            </PanelHeading>
          </PanelHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle type</TableHead>
                <TableHead className="text-right">Rate / hr</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleTypeCategories.map((category) => {
                const revenue = parkingHistory
                  .filter(
                    (record) =>
                      record.vehicleType.toLowerCase() ===
                      category.name.toLowerCase()
                  )
                  .reduce((sum, record) => sum + record.fee, 0);

                return (
                  <TableRow key={category.name}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      KSh {formatMoney(category.hourlyRate)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      KSh {formatMoney(revenue)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Panel>
      </div>
    </AppLayout>
  );
};

export default Analytics;
