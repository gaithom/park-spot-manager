import { useMemo } from "react";
import { Banknote, Receipt } from "lucide-react";

import { useParking } from "@/context/parking";
import { formatMoney } from "@/lib/utils";
import { Spark } from "@/components/ui/spark";
import { StatTile } from "@/components/ui/stat-tile";

const isSameDay = (value: Date | string, reference: Date) => {
  const date = new Date(value);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
};

const DailyRevenueSummary = () => {
  const { parkingHistory, dailyRevenue } = useParking();

  const today = useMemo(() => {
    const reference = new Date();
    const records = parkingHistory.filter((record) =>
      isSameDay(record.exitTime, reference)
    );

    return {
      revenue: records.reduce((sum, record) => sum + record.fee, 0),
      transactions: records.length,
    };
  }, [parkingHistory]);

  const trend = dailyRevenue.slice(-14).map((entry) => entry.amount);
  const averageTicket =
    today.transactions > 0 ? today.revenue / today.transactions : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatTile
        label="Revenue today"
        prefix="KSh"
        value={formatMoney(today.revenue)}
        icon={Banknote}
        tone="success"
        hint="Closed tickets only"
      >
        {trend.length > 1 ? (
          <Spark values={trend} className="text-success" />
        ) : null}
      </StatTile>

      <StatTile
        label="Transactions today"
        value={today.transactions}
        icon={Receipt}
        tone="info"
        hint={
          today.transactions > 0
            ? `Average ticket KSh ${formatMoney(averageTicket)}`
            : "No vehicles released yet today"
        }
      />
    </div>
  );
};

export default DailyRevenueSummary;
