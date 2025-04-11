
import { useParking } from "@/context/ParkingContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Car, CircleSlash, Sparkles } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  className,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  className?: string;
}) => (
  <Card className={cn("shadow-sm", className)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">{value}</h3>
        </div>
        <div className={cn("rounded-full p-2", className)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ParkingStats = () => {
  const { availableSlots, totalSlots } = useParking();
  const occupiedSlots = totalSlots - availableSlots;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        title="Total Slots"
        value={totalSlots}
        icon={Sparkles}
        className="bg-primary/10"
      />
      <StatCard
        title="Available Slots"
        value={availableSlots}
        icon={Car}
        className="bg-success/10"
      />
      <StatCard
        title="Occupied Slots"
        value={occupiedSlots}
        icon={CircleSlash}
        className="bg-danger/10"
      />
    </div>
  );
};

export default ParkingStats;
