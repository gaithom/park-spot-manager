import { ParkingSlot, Vehicle, ParkingHistory, VehicleTypeCategory, ParkingReservation, User, DailyRevenue } from "@/types";
import { format } from "date-fns";
import { generateVehicleTypeDistribution } from "./utils";
import { USER_CREDENTIALS } from "./types";

export const loginUser = (
  username: string, 
  password: string, 
  setUser: React.Dispatch<React.SetStateAction<User>>
): boolean => {
  if (USER_CREDENTIALS[username] && USER_CREDENTIALS[username].password === password) {
    setUser({
      username,
      isLoggedIn: true,
      role: USER_CREDENTIALS[username].role 
    });
    return true;
  }
  return false;
};

export const logoutUser = (setUser: React.Dispatch<React.SetStateAction<User>>, onLogout?: () => void) => {
  setUser({ username: "", isLoggedIn: false, role: undefined });
  if (onLogout) onLogout();
};

export const parkVehicle = (
  vehicle: Omit<Vehicle, "entryTime">,
  slots: ParkingSlot[],
  setSlots: React.Dispatch<React.SetStateAction<ParkingSlot[]>>
): boolean => {
  if (!vehicle.regNumber || !vehicle.vehicleType) {
    return false;
  }

  // Check if this vehicle is already parked
  const isAlreadyParked = slots.some(
    slot => slot.isOccupied && slot.vehicle?.regNumber === vehicle.regNumber
  );

  if (isAlreadyParked) {
    return false;
  }

  // Find an available slot
  const availableSlotIndex = slots.findIndex(slot => !slot.isOccupied && !slot.isReserved);
  
  if (availableSlotIndex === -1) {
    return false;
  }

  // Park the vehicle
  const newSlots = [...slots];
  newSlots[availableSlotIndex] = {
    ...newSlots[availableSlotIndex],
    isOccupied: true,
    vehicle: {
      ...vehicle,
      entryTime: new Date()
    }
  };

  setSlots(newSlots);
  return true;
};

export const removeVehicle = (
  regNumber: string,
  slots: ParkingSlot[],
  setSlots: React.Dispatch<React.SetStateAction<ParkingSlot[]>>,
  parkingHistory: ParkingHistory[],
  setParkingHistory: React.Dispatch<React.SetStateAction<ParkingHistory[]>>,
  vehicleTypeCategories: VehicleTypeCategory[],
  dailyRevenue: DailyRevenue[],
  setDailyRevenue: React.Dispatch<React.SetStateAction<DailyRevenue[]>>
): { success: boolean; fee?: number } => {
  if (!regNumber) {
    return { success: false };
  }

  // Find the vehicle
  const slotIndex = slots.findIndex(
    slot => slot.isOccupied && slot.vehicle?.regNumber === regNumber
  );

  if (slotIndex === -1) {
    return { success: false };
  }

  // Calculate fee
  const slot = slots[slotIndex];
  const entryTime = slot.vehicle?.entryTime;
  const vehicleType = slot.vehicle?.vehicleType || "Sedan";
  
  if (!entryTime) {
    return { success: false };
  }
  
  const now = new Date();
  const durationMs = now.getTime() - entryTime.getTime();
  const hours = Math.max(1, durationMs / (1000 * 60 * 60)); // At least 1 hour
  
  // Find the rate for this vehicle type
  const category = vehicleTypeCategories.find(
    c => c.name.toLowerCase() === vehicleType.toLowerCase()
  ) || { hourlyRate: 10 };
  
  const fee = Math.round(category.hourlyRate * hours * 100) / 100;

  // Add to history
  const historyRecord: ParkingHistory = {
    id: Date.now().toString(),
    regNumber,
    vehicleType,
    entryTime,
    exitTime: now,
    fee,
    slotNumber: slot.slotNumber
  };
  setParkingHistory([...parkingHistory, historyRecord]);

  // Remove vehicle
  const newSlots = [...slots];
  newSlots[slotIndex] = {
    ...newSlots[slotIndex],
    isOccupied: false,
    vehicle: null
  };

  setSlots(newSlots);
  
  // Update daily revenue
  const updatedRevenue = [...dailyRevenue];
  const todayIndex = updatedRevenue.findIndex(day => day.date === format(now, "dd MMM"));
  if (todayIndex !== -1) {
    updatedRevenue[todayIndex].amount += fee;
  } else {
    updatedRevenue.push({
      date: format(now, "dd MMM"),
      amount: fee
    });
  }
  setDailyRevenue(updatedRevenue);

  return { success: true, fee };
};

export const addVehicleCategory = (
  category: Omit<VehicleTypeCategory, "count">,
  vehicleTypeCategories: VehicleTypeCategory[],
  setVehicleTypeCategories: React.Dispatch<React.SetStateAction<VehicleTypeCategory[]>>
): boolean => {
  if (!category.name || category.hourlyRate <= 0) {
    return false;
  }

  // Check if category already exists
  if (vehicleTypeCategories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
    return false;
  }

  setVehicleTypeCategories([...vehicleTypeCategories, { ...category, count: 0 }]);
  return true;
};

export const makeReservation = (
  reservation: Omit<ParkingReservation, "id" | "status">,
  slots: ParkingSlot[],
  setSlots: React.Dispatch<React.SetStateAction<ParkingSlot[]>>,
  reservations: ParkingReservation[],
  setReservations: React.Dispatch<React.SetStateAction<ParkingReservation[]>>
): boolean => {
  const { slotNumber, regNumber, reservedFor, startTime, endTime } = reservation;
  
  // Validate inputs
  if (!slotNumber || !regNumber || !reservedFor || !startTime || !endTime) {
    return false;
  }

  if (startTime >= endTime) {
    return false;
  }

  // Check if the slot exists and is available
  const slotIndex = slots.findIndex(s => s.slotNumber === slotNumber);
  if (slotIndex === -1) {
    return false;
  }

  if (slots[slotIndex].isOccupied || slots[slotIndex].isReserved) {
    return false;
  }

  // Create the reservation
  const newReservation: ParkingReservation = {
    id: Date.now().toString(),
    slotNumber,
    regNumber,
    reservedFor,
    startTime,
    endTime,
    status: "active"
  };

  // Mark the slot as reserved
  const newSlots = [...slots];
  newSlots[slotIndex] = {
    ...newSlots[slotIndex],
    isReserved: true,
    reservedFor,
    reservationTime: startTime
  };

  setSlots(newSlots);
  setReservations([...reservations, newReservation]);
  return true;
};

export const cancelReservation = (
  id: string,
  slots: ParkingSlot[],
  setSlots: React.Dispatch<React.SetStateAction<ParkingSlot[]>>,
  reservations: ParkingReservation[],
  setReservations: React.Dispatch<React.SetStateAction<ParkingReservation[]>>
): boolean => {
  const reservationIndex = reservations.findIndex(r => r.id === id);
  if (reservationIndex === -1) {
    return false;
  }

  const reservation = reservations[reservationIndex];
  const slotIndex = slots.findIndex(s => s.slotNumber === reservation.slotNumber);

  // Update the reservation status
  const newReservations = [...reservations];
  newReservations[reservationIndex] = {
    ...newReservations[reservationIndex],
    status: "cancelled"
  };

  // Update the slot status
  const newSlots = [...slots];
  if (slotIndex !== -1) {
    newSlots[slotIndex] = {
      ...newSlots[slotIndex],
      isReserved: false,
      reservedFor: undefined,
      reservationTime: undefined
    };
  }

  setReservations(newReservations);
  setSlots(newSlots);
  return true;
};

export const getVehicleHistory = (
  regNumber: string,
  parkingHistory: ParkingHistory[]
): ParkingHistory[] => {
  return parkingHistory.filter(record => record.regNumber === regNumber);
};

export const addUser = (
  user: { username: string; password: string; role: string }
): boolean => {
  if (!user.username || !user.password) {
    return false;
  }

  if (user.username in USER_CREDENTIALS) {
    return false;
  }

  USER_CREDENTIALS[user.username] = { 
    password: user.password, 
    role: user.role as "admin" | "attendant" 
  };
  return true;
};

export const updateVehicleDistribution = (
  slots: ParkingSlot[],
  vehicleTypeCategories: VehicleTypeCategory[],
  setVehicleTypeCategories: React.Dispatch<React.SetStateAction<VehicleTypeCategory[]>>,
  setVehicleTypeDistribution: React.Dispatch<React.SetStateAction<import("@/types").VehicleTypeDistribution[]>>
) => {
  // Reset counts
  const updatedCategories = vehicleTypeCategories.map(cat => ({ ...cat, count: 0 }));
  
  // Count vehicles by type
  slots.forEach(slot => {
    if (slot.isOccupied && slot.vehicle) {
      const categoryIndex = updatedCategories.findIndex(
        c => c.name.toLowerCase() === slot.vehicle?.vehicleType.toLowerCase()
      );
      
      if (categoryIndex !== -1) {
        updatedCategories[categoryIndex].count += 1;
      }
    }
  });
  
  setVehicleTypeCategories(updatedCategories);
  setVehicleTypeDistribution(generateVehicleTypeDistribution(updatedCategories));
};
