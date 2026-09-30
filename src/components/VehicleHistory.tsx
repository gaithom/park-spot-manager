import { useState } from "react";
import { History, Search } from "lucide-react";

import { useParking } from "@/context/parking";
import type { ParkingHistory } from "@/types";
import { formatDuration, formatMoney, formatShortDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Panel,
  PanelBody,
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

const VehicleHistory = () => {
  const [searchReg, setSearchReg] = useState("");
  const [results, setResults] = useState<ParkingHistory[]>([]);
  const [searchedFor, setSearchedFor] = useState<string | null>(null);
  const { getVehicleHistory } = useParking();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = searchReg.trim();
    if (!term) return;

    setResults(getVehicleHistory(term));
    setSearchedFor(term);
  };

  const totalCharged = results.reduce((sum, record) => sum + record.fee, 0);

  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>
          <PanelIcon>
            <History />
          </PanelIcon>
          <div>
            <PanelTitle>Vehicle history</PanelTitle>
            <PanelDescription>
              Every closed visit for a registration
            </PanelDescription>
          </div>
        </PanelHeading>
      </PanelHeader>

      <PanelBody className="space-y-5">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchReg}
              onChange={(event) => setSearchReg(event.target.value.toUpperCase())}
              placeholder="KBZ 123A"
              aria-label="Vehicle registration"
              className="pl-9 font-mono uppercase tracking-wider"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        {searchedFor === null ? (
          <EmptyState
            size="sm"
            icon={Search}
            title="Search a registration"
            description="Enter a plate to see every completed visit, duration and fee."
          />
        ) : results.length === 0 ? (
          <EmptyState
            size="sm"
            icon={History}
            title="No visits found"
            description={`Nothing recorded for ${searchedFor} yet.`}
          />
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Plate value={searchedFor} />
              <p className="text-xs text-muted-foreground">
                <span data-numeric className="font-semibold text-foreground">
                  {results.length}
                </span>{" "}
                {results.length === 1 ? "visit" : "visits"} · KSh{" "}
                <span data-numeric className="font-semibold text-foreground">
                  {formatMoney(totalCharged)}
                </span>{" "}
                charged
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Bay</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                        {String(record.slotNumber).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatShortDateTime(record.entryTime)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatShortDateTime(record.exitTime)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDuration(record.entryTime, new Date(record.exitTime))}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        KSh {formatMoney(record.fee)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </PanelBody>
    </Panel>
  );
};

export default VehicleHistory;
