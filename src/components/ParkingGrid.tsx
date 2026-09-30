import { useParking } from "@/context/parking";
import { BayLegend } from "@/components/parking/ParkingBay";
import ParkingLotMap from "@/components/parking/ParkingLotMap";

/** The roomier read-only view of the lot, used by the admin "Map" tab. */
const ParkingGrid = () => {
  const { slots } = useParking();

  return (
    <div className="space-y-4 p-5">
      <BayLegend />
      <ParkingLotMap slots={slots} size="md" perRow={8} />
    </div>
  );
};

export default ParkingGrid;
