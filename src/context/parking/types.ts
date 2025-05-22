
import {
  ParkingSlot,
  Vehicle,
  User,
  ParkingHistory,
  VehicleTypeCategory,
  ParkingReservation,
  DailyRevenue,
  VehicleTypeDistribution
} from "@/types";

export const TOTAL_SLOTS = 50;

export interface ParkingContextType {
  slots: ParkingSlot[];
  availableSlots: number;
  totalSlots: number;
  parkingHistory: ParkingHistory[];
  vehicleTypeCategories: VehicleTypeCategory[];
  reservations: ParkingReservation[];
  dailyRevenue: DailyRevenue[];
  vehicleTypeDistribution: VehicleTypeDistribution[];
  user: User;
  theme: "light" | "dark";
  toggleTheme: () => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  parkVehicle: (vehicle: Omit<Vehicle, "entryTime">) => boolean;
  removeVehicle: (regNumber: string) => { success: boolean; fee?: number };
  addVehicleCategory: (category: Omit<VehicleTypeCategory, "count">) => boolean;
  makeReservation: (reservation: Omit<ParkingReservation, "id" | "status">) => boolean;
  cancelReservation: (id: string) => boolean;
  getVehicleHistory: (regNumber: string) => ParkingHistory[];
  addUser: (user: { username: string; password: string; role: string }) => boolean;
}
