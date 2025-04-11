
export interface Vehicle {
  regNumber: string;
  vehicleType: string;
  entryTime: Date | null;
}

export interface ParkingSlot {
  slotNumber: number;
  isOccupied: boolean;
  vehicle: Vehicle | null;
  isReserved?: boolean;
  reservedFor?: string;
  reservationTime?: Date;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
  role?: "admin" | "attendant";
}

export interface ParkingHistory {
  id: string;
  regNumber: string;
  vehicleType: string;
  entryTime: Date;
  exitTime: Date;
  fee: number;
  slotNumber: number;
}

export interface VehicleTypeCategory {
  name: string;
  hourlyRate: number;
  count: number;
}

export interface ParkingReservation {
  id: string;
  slotNumber: number;
  regNumber: string;
  reservedFor: string;
  startTime: Date;
  endTime: Date;
  status: "active" | "completed" | "cancelled";
}

export interface DailyRevenue {
  date: string;
  amount: number;
}

export interface VehicleTypeDistribution {
  type: string;
  count: number;
}
