
export interface Vehicle {
  regNumber: string;
  vehicleType: string;
  entryTime: Date | null;
}

export interface ParkingSlot {
  slotNumber: number;
  isOccupied: boolean;
  vehicle: Vehicle | null;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
}
