import { ParkingSlot, Vehicle, User, ParkingHistory, VehicleTypeCategory, ParkingReservation, DailyRevenue, VehicleTypeDistribution } from "@/types";

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
  login: (username: string, password: string) => boolean;
  logout: () => void;
  parkVehicle: (vehicle: Omit<Vehicle, "entryTime">) => boolean;
  removeVehicle: (regNumber: string) => { success: boolean; fee?: number };
  addVehicleCategory: (category: Omit<VehicleTypeCategory, "count">) => boolean;
  makeReservation: (reservation: Omit<ParkingReservation, "id" | "status">) => boolean;
  cancelReservation: (id: string) => boolean;
  getVehicleHistory: (regNumber: string) => ParkingHistory[];
  addUser: (username: string, password: string, role: "admin" | "attendant") => boolean;
}

// Hardcoded user credentials (for demo purposes)
export const USER_CREDENTIALS: Record<string, { password: string, role: "admin" | "attendant" }> = {
  "admin": { password: "password123", role: "admin" },
  "attendant": { password: "parking123", role: "attendant" }
};

// Initial setup
export const TOTAL_SLOTS = 10;

// Vehicle type categories with different rates
export const INITIAL_VEHICLE_CATEGORIES: VehicleTypeCategory[] = [
  { name: "Sedan", hourlyRate: 150, count: 0 },
  { name: "SUV", hourlyRate: 200, count: 0 },
  { name: "Truck", hourlyRate: 300, count: 0 },
  { name: "Motorcycle", hourlyRate: 100, count: 0 },
];
