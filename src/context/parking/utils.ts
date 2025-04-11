
import { format, subDays } from "date-fns";
import { DailyRevenue, VehicleTypeCategory, VehicleTypeDistribution } from "@/types";

// Generate some demo analytics data
export const generateDailyRevenue = (): DailyRevenue[] => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return {
      date: format(date, "dd MMM"),
      amount: Math.floor(Math.random() * 1000) + 500 // Random revenue between 500 and 1500
    };
  });
};

export const generateVehicleTypeDistribution = (
  vehicleTypeCategories: VehicleTypeCategory[]
): VehicleTypeDistribution[] => {
  return vehicleTypeCategories.map(category => ({
    type: category.name,
    count: category.count
  }));
};
