import { ParkingSlot, Vehicle, ParkingHistory, VehicleTypeCategory, ParkingReservation, User, DailyRevenue } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateVehicleTypeDistribution } from "./utils";
import { USER_CREDENTIALS } from "./types";

export const loginUser = (
  username: string, 
  password: string, 
  setUser: React.Dispatch<React.SetStateAction<User>>
): boolean => {
  if (username in USER_CREDENTIALS && USER_CREDENTIALS[username].password === password) {
    setUser({ 
      username, 
      isLoggedIn: true, 
      role: USER_CREDENTIALS[username].role 
    });
    toast.success("Login successful!");
    return true;
  } else {
    toast.error("Invalid credentials. Please try again.");
    return false;
  }
};

export const logoutUser = (setUser: React.Dispatch<React.SetStateAction<User>>) => {
  setUser({ username: "", isLoggedIn: false, role: undefined });
  toast.info("You have been logged out.");
};

export const parkVehicle = (
  vehicle: Omit<Vehicle, "entryTime">,
  slots: ParkingSlot[],
  setSlots: React.Dispatch<React.SetStateAction<ParkingSlot[]>>
): boolean => {
  if (!vehicle.regNumber || !vehicle.vehicleType) {
    toast.error("Please fill out both fields!");
    return false;
  }

  // Check if this vehicle is already parked
  const isAlreadyParked = slots.some(
    slot => slot.isOccupied && slot.vehicle?.regNumber === vehicle.regNumber
  );

  if (isAlreadyParked) {
    toast.error(`Vehicle ${vehicle.regNumber} is already parked.`);
    return false;
  }

  // Find an available slot
  const availableSlotIndex = slots.findIndex(slot => !slot.isOccupied && !slot.isReserved);
  
  if (availableSlotIndex === -1) {
    toast.warning("No available slots!");
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
  toast.success(`Vehicle ${vehicle.regNumber} parked at Slot ${newSlots[availableSlotIndex].slotNumber}.`);
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
    toast.error("Please enter the registration number!");
    return { success: false };
  }

  // Find the vehicle
  const slotIndex = slots.findIndex(
    slot => slot.isOccupied && slot.vehicle?.regNumber === regNumber
  );

  if (slotIndex === -1) {
    toast.warning(`Vehicle ${regNumber} not found in the parking lot.`);
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

  toast.success(`Vehicle ${regNumber} removed. Total Fee: ksh ${fee.toFixed(2)}`);
  return { success: true, fee };
};

export const addVehicleCategory = (
  category: Omit<VehicleTypeCategory, "count">,
  vehicleTypeCategories: VehicleTypeCategory[],
  setVehicleTypeCategories: React.Dispatch<React.SetStateAction<VehicleTypeCategory[]>>
): boolean => {
  if (!category.name || category.hourlyRate <= 0) {
    toast.error("Please provide a valid category name and rate!");
    return false;
  }

  // Check if category already exists
  if (vehicleTypeCategories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
    toast.error(`Category ${category.name} already exists!`);
    return false;
  }

  setVehicleTypeCategories([...vehicleTypeCategories, { ...category, count: 0 }]);
  toast.success(`Vehicle category ${category.name} added successfully!`);
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
    toast.error("Please fill out all fields!");
    return false;
  }

  if (startTime >= endTime) {
    toast.error("End time must be after start time!");
    return false;
  }

  // Check if the slot exists and is available
  const slotIndex = slots.findIndex(s => s.slotNumber === slotNumber);
  if (slotIndex === -1) {
    toast.error("Invalid slot number!");
    return false;
  }

  if (slots[slotIndex].isOccupied || slots[slotIndex].isReserved) {
    toast.error(`Slot ${slotNumber} is not available for reservation!`);
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
  toast.success(`Slot ${slotNumber} reserved for ${reservedFor} successfully!`);
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
    toast.error("Reservation not found!");
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
  toast.success(`Reservation for slot ${reservation.slotNumber} cancelled!`);
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
    toast.error("Please provide both username and password!");
    return false;
  }

  if (user.username in USER_CREDENTIALS) {
    toast.error(`User ${user.username} already exists!`);
    return false;
  }

  USER_CREDENTIALS[user.username] = { 
    password: user.password, 
    role: user.role as "admin" | "attendant" 
  };
  toast.success(`User ${user.username} added successfully as ${user.role}!`);
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
