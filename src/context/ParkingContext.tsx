
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ParkingSlot, Vehicle, User, ParkingHistory, VehicleTypeCategory, ParkingReservation, DailyRevenue, VehicleTypeDistribution } from "@/types";
import { toast } from "sonner";
import { format, addDays, subDays } from "date-fns";

interface ParkingContextType {
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

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Hardcoded user credentials (for demo purposes)
const USER_CREDENTIALS: Record<string, { password: string, role: "admin" | "attendant" }> = {
  "admin": { password: "password123", role: "admin" },
  "attendant": { password: "parking123", role: "attendant" }
};

// Initial setup
const TOTAL_SLOTS = 10;

// Vehicle type categories with different rates
const INITIAL_VEHICLE_CATEGORIES: VehicleTypeCategory[] = [
  { name: "Sedan", hourlyRate: 10, count: 0 },
  { name: "SUV", hourlyRate: 15, count: 0 },
  { name: "Truck", hourlyRate: 25, count: 0 },
  { name: "Motorcycle", hourlyRate: 5, count: 0 },
];

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  // Load data from localStorage or initialize
  const initialSlots = () => {
    const saved = localStorage.getItem("parkingSlots");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((slot: any) => ({
        ...slot,
        vehicle: slot.vehicle ? {
          ...slot.vehicle,
          entryTime: slot.vehicle.entryTime ? new Date(slot.vehicle.entryTime) : null
        } : null,
        reservationTime: slot.reservationTime ? new Date(slot.reservationTime) : undefined
      }));
    }
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      slotNumber: i + 1,
      isOccupied: false,
      vehicle: null,
      isReserved: false
    }));
  };

  const initialParkingHistory = () => {
    const saved = localStorage.getItem("parkingHistory");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((record: any) => ({
        ...record,
        entryTime: new Date(record.entryTime),
        exitTime: new Date(record.exitTime)
      }));
    }
    return [];
  };

  const initialReservations = () => {
    const saved = localStorage.getItem("parkingReservations");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((reservation: any) => ({
        ...reservation,
        startTime: new Date(reservation.startTime),
        endTime: new Date(reservation.endTime)
      }));
    }
    return [];
  };

  const initialVehicleCategories = () => {
    const saved = localStorage.getItem("vehicleCategories");
    return saved ? JSON.parse(saved) : INITIAL_VEHICLE_CATEGORIES;
  };

  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [parkingHistory, setParkingHistory] = useState<ParkingHistory[]>(initialParkingHistory);
  const [reservations, setReservations] = useState<ParkingReservation[]>(initialReservations);
  const [vehicleTypeCategories, setVehicleTypeCategories] = useState<VehicleTypeCategory[]>(initialVehicleCategories);
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("parkingUser");
    return savedUser ? JSON.parse(savedUser) : { username: "", isLoggedIn: false, role: undefined };
  });

  // Calculate available slots
  const availableSlots = slots.filter(slot => !slot.isOccupied && !slot.isReserved).length;

  // Generate some demo analytics data
  const generateDailyRevenue = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      return {
        date: format(date, "dd MMM"),
        amount: Math.floor(Math.random() * 1000) + 500 // Random revenue between 500 and 1500
      };
    });
  };

  const generateVehicleTypeDistribution = () => {
    return vehicleTypeCategories.map(category => ({
      type: category.name,
      count: category.count
    }));
  };

  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>(generateDailyRevenue);
  const [vehicleTypeDistribution, setVehicleTypeDistribution] = useState<VehicleTypeDistribution[]>(generateVehicleTypeDistribution);

  // Save data to localStorage when they change
  useEffect(() => {
    localStorage.setItem("parkingSlots", JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem("parkingHistory", JSON.stringify(parkingHistory));
  }, [parkingHistory]);

  useEffect(() => {
    localStorage.setItem("parkingReservations", JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem("vehicleCategories", JSON.stringify(vehicleTypeCategories));
  }, [vehicleTypeCategories]);

  useEffect(() => {
    localStorage.setItem("parkingUser", JSON.stringify(user));
  }, [user]);

  // Update vehicle distribution whenever slots change
  useEffect(() => {
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
    setVehicleTypeDistribution(generateVehicleTypeDistribution());
  }, [slots]);

  const login = (username: string, password: string): boolean => {
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

  const logout = () => {
    setUser({ username: "", isLoggedIn: false, role: undefined });
    toast.info("You have been logged out.");
  };

  const parkVehicle = (vehicle: Omit<Vehicle, "entryTime">): boolean => {
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

  const removeVehicle = (regNumber: string): { success: boolean; fee?: number } => {
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

  const addVehicleCategory = (category: Omit<VehicleTypeCategory, "count">): boolean => {
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

  const makeReservation = (reservation: Omit<ParkingReservation, "id" | "status">): boolean => {
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

  const cancelReservation = (id: string): boolean => {
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

  const getVehicleHistory = (regNumber: string): ParkingHistory[] => {
    return parkingHistory.filter(record => record.regNumber === regNumber);
  };

  const addUser = (username: string, password: string, role: "admin" | "attendant"): boolean => {
    if (!username || !password) {
      toast.error("Please provide both username and password!");
      return false;
    }

    if (username in USER_CREDENTIALS) {
      toast.error(`User ${username} already exists!`);
      return false;
    }

    USER_CREDENTIALS[username] = { password, role };
    toast.success(`User ${username} added successfully as ${role}!`);
    return true;
  };

  return (
    <ParkingContext.Provider value={{ 
      slots, 
      availableSlots, 
      totalSlots: TOTAL_SLOTS,
      parkingHistory,
      vehicleTypeCategories,
      reservations,
      dailyRevenue,
      vehicleTypeDistribution,
      user,
      login,
      logout,
      parkVehicle,
      removeVehicle,
      addVehicleCategory,
      makeReservation,
      cancelReservation,
      getVehicleHistory,
      addUser
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error("useParking must be used within a ParkingProvider");
  }
  return context;
};
