
import { useState } from "react";
import { useParking } from "@/context/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { History, Search } from "lucide-react";

const VehicleHistory = () => {
  const [searchReg, setSearchReg] = useState("");
  interface VehicleHistoryRecord {
    id: string;
    slotNumber: string;
    entryTime: string;
    exitTime: string;
    fee: number;
  }

  const [searchResults, setSearchResults] = useState<VehicleHistoryRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { getVehicleHistory } = useParking();

  const handleSearch = () => {
    if (!searchReg.trim()) return;
    
    const results = getVehicleHistory(searchReg.trim());
    setSearchResults(
      results.map((record) => ({
        ...record,
        slotNumber: record.slotNumber.toString(),
        entryTime: record.entryTime.toISOString(),
        exitTime: record.exitTime.toISOString(),
      }))
    );
    setHasSearched(true);
  };

  return (
    <Card className="w-full bg-black border-primary/20">
      <CardHeader className="bg-primary/5 border-b border-primary/20">
        <CardTitle className="flex items-center text-primary">
          <History className="mr-2 h-5 w-5" /> Vehicle History
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2 mb-6">
          <Input
            placeholder="Enter vehicle registration"
            value={searchReg}
            onChange={(e) => setSearchReg(e.target.value)}
            className="bg-secondary border-primary/20"
          />
          <Button onClick={handleSearch} className="bg-primary">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>

        {hasSearched && (
          <div className="rounded-md border border-primary/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow className="border-b border-primary/20">
                  <TableHead>Slot</TableHead>
                  <TableHead>Entry Time</TableHead>
                  <TableHead>Exit Time</TableHead>
                  <TableHead>Fee (ksh)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.length > 0 ? (
                  searchResults.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-foreground">{record.slotNumber}</TableCell>
                      <TableCell className="text-foreground">{formatDateTime(record.entryTime)}</TableCell>
                      <TableCell className="text-foreground">{formatDateTime(record.exitTime)}</TableCell>
                      <TableCell className="text-foreground">{record.fee.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No history found for this vehicle.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleHistory;
