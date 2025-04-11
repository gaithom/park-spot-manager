
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ParkingSlot, Vehicle, User } from "@/types";
import { toast } from "sonner";

interface ParkingContextType {
  slots: ParkingSlot[];
  availableSlots: number;
  totalSlots: number;
  user: User;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  parkVehicle: (vehicle: Omit<Vehicle, "entryTime">) => boolean;
  removeVehicle: (regNumber: string) => { success: boolean; fee?: number };
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Hardcoded user credentials (for demo purposes)
const USER_CREDENTIALS: Record<string, string> = {
  "admin": "password123"
};

// Initial setup
const TOTAL_SLOTS = 10;

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
        } : null
      }));
    }
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      slotNumber: i + 1,
      isOccupied: false,
      vehicle: null
    }));
  };

  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("parkingUser");
    return savedUser ? JSON.parse(savedUser) : { username: "", isLoggedIn: false };
  });

  // Calculate available slots
  const availableSlots = slots.filter(slot => !slot.isOccupied).length;

  // Save slots to localStorage when they change
  useEffect(() => {
    localStorage.setItem("parkingSlots", JSON.stringify(slots));
  }, [slots]);

  // Save user to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("parkingUser", JSON.stringify(user));
  }, [user]);

  const login = (username: string, password: string): boolean => {
    if (username in USER_CREDENTIALS && USER_CREDENTIALS[username] === password) {
      setUser({ username, isLoggedIn: true });
      toast.success("Login successful!");
      return true;
    } else {
      toast.error("Invalid credentials. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser({ username: "", isLoggedIn: false });
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
    const availableSlotIndex = slots.findIndex(slot => !slot.isOccupied);
    
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
    
    if (!entryTime) {
      return { success: false };
    }
    
    const now = new Date();
    const durationMs = now.getTime() - entryTime.getTime();
    const hours = Math.max(1, durationMs / (1000 * 60 * 60)); // At least 1 hour
    const fee = Math.round(10 * hours * 100) / 100; // ksh 10/hour, rounded to 2 decimal places

    // Remove vehicle
    const newSlots = [...slots];
    newSlots[slotIndex] = {
      ...newSlots[slotIndex],
      isOccupied: false,
      vehicle: null
    };

    setSlots(newSlots);
    toast.success(`Vehicle ${regNumber} removed. Total Fee: ksh ${fee.toFixed(2)}`);
    return { success: true, fee };
  };

  return (
    <ParkingContext.Provider value={{ 
      slots, 
      availableSlots, 
      totalSlots: TOTAL_SLOTS,
      user,
      login,
      logout,
      parkVehicle,
      removeVehicle
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
