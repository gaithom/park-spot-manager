
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

// Add the missing USER_CREDENTIALS export
export const USER_CREDENTIALS: Record<string, { password: string; role: "admin" | "attendant" }> = {
  "admin": { password: "password123", role: "admin" },
  "attendant": { password: "password123", role: "attendant" }
};

// Add the missing INITIAL_VEHICLE_CATEGORIES export
export const INITIAL_VEHICLE_CATEGORIES: VehicleTypeCategory[] = [
  { name: "Sedan", hourlyRate: 20, count: 0 },
  { name: "SUV", hourlyRate: 30, count: 0 },
  { name: "Truck", hourlyRate: 40, count: 0 },
  { name: "Motorcycle", hourlyRate: 10, count: 0 }
];

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
