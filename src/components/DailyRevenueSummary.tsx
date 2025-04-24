
import { useParking } from "@/context/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const DailyRevenueSummary = () => {
  const { parkingHistory } = useParking();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRevenue = parkingHistory
    .filter(record => {
      const recordDate = new Date(record.exitTime);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    })
    .reduce((sum, record) => sum + record.fee, 0);

  const todayTransactions = parkingHistory.filter(record => {
    const recordDate = new Date(record.exitTime);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  }).length;

  return (
    <Card className="w-full">
      <CardHeader className="bg-green-500/5">
        <CardTitle className="flex items-center text-green-600">
          <DollarSign className="mr-2 h-5 w-5" /> Today's Revenue Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">KSH {todayRevenue.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{todayTransactions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyRevenueSummary;
