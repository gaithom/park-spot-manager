
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  ParkingSlot, Vehicle, User, ParkingHistory, 
  VehicleTypeCategory, ParkingReservation, 
  DailyRevenue, VehicleTypeDistribution
} from "@/types";
import { ParkingContextType, TOTAL_SLOTS } from "./types";
import { 
  initialSlots, initialParkingHistory, 
  initialReservations, initialVehicleCategories 
} from "./initializers";
import { 
  loginUser, logoutUser, parkVehicle, removeVehicle, 
  addVehicleCategory, makeReservation, cancelReservation, 
  getVehicleHistory, addUser, updateVehicleDistribution 
} from "./actions";
import { generateDailyRevenue, generateVehicleTypeDistribution } from "./utils";

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [parkingHistory, setParkingHistory] = useState<ParkingHistory[]>(initialParkingHistory);
  const [reservations, setReservations] = useState<ParkingReservation[]>(initialReservations);
  const [vehicleTypeCategories, setVehicleTypeCategories] = useState<VehicleTypeCategory[]>(initialVehicleCategories);
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("parkingUser");
    return savedUser ? JSON.parse(savedUser) : { username: "", isLoggedIn: false, role: undefined };
  });
  // Add theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("parkingTheme");
    return (savedTheme === "dark" ? "dark" : "light");
  });

  // Calculate available slots
  const availableSlots = slots.filter(slot => !slot.isOccupied && !slot.isReserved).length;

  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>(generateDailyRevenue());
  const [vehicleTypeDistribution, setVehicleTypeDistribution] = useState<VehicleTypeDistribution[]>(
    generateVehicleTypeDistribution(vehicleTypeCategories)
  );

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

  // Save theme preference to localStorage and update document class
  useEffect(() => {
    localStorage.setItem("parkingTheme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Update vehicle distribution whenever slots or vehicleTypeCategories change
  useEffect(() => {
    updateVehicleDistribution(
      slots, 
      vehicleTypeCategories, 
      setVehicleTypeCategories, 
      setVehicleTypeDistribution
    );
  }, [slots, vehicleTypeCategories]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  // Create wrapper functions to abstract the implementation details
  const login = (username: string, password: string): boolean => {
    return loginUser(username, password, setUser);
  };

  const logout = (onLogout?: () => void) => {
    logoutUser(setUser, onLogout);
  };

  const handleParkVehicle = (vehicle: Omit<Vehicle, "entryTime">): boolean => {
    return parkVehicle(vehicle, slots, setSlots);
  };

  const handleRemoveVehicle = (regNumber: string): { success: boolean; fee?: number } => {
    return removeVehicle(
      regNumber, 
      slots, 
      setSlots, 
      parkingHistory, 
      setParkingHistory, 
      vehicleTypeCategories, 
      dailyRevenue, 
      setDailyRevenue
    );
  };

  const handleAddVehicleCategory = (category: Omit<VehicleTypeCategory, "count">): boolean => {
    return addVehicleCategory(category, vehicleTypeCategories, setVehicleTypeCategories);
  };

  const handleMakeReservation = (reservation: Omit<ParkingReservation, "id" | "status">): boolean => {
    return makeReservation(reservation, slots, setSlots, reservations, setReservations);
  };

  const handleCancelReservation = (id: string): boolean => {
    return cancelReservation(id, slots, setSlots, reservations, setReservations);
  };

  const handleGetVehicleHistory = (regNumber: string): ParkingHistory[] => {
    return getVehicleHistory(regNumber, parkingHistory);
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
      theme,
      toggleTheme,
      login,
      logout,
      parkVehicle: handleParkVehicle,
      removeVehicle: handleRemoveVehicle,
      addVehicleCategory: handleAddVehicleCategory,
      makeReservation: handleMakeReservation,
      cancelReservation: handleCancelReservation,
      getVehicleHistory: handleGetVehicleHistory,
      addUser
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

// Add the useParking hook
export const useParking = (): ParkingContextType => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error("useParking must be used within a ParkingProvider");
  }
  return context;
};
