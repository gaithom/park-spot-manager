
import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
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
  getVehicleHistory, addUser, updateProfile
} from "./actions";
import { generateDailyRevenue, generateVehicleTypeDistribution } from "./utils";

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [parkingHistory, setParkingHistory] = useState<ParkingHistory[]>(initialParkingHistory);
  const [reservations, setReservations] = useState<ParkingReservation[]>(initialReservations);
  const [vehicleTypeCategories, setVehicleTypeCategories] = useState<VehicleTypeCategory[]>(initialVehicleCategories);
  const [user, setUser] = useState<User>(() => {
    // First check sessionStorage, then localStorage for user data
    const sessionUser = sessionStorage.getItem('parkingUser');
    if (sessionUser) return JSON.parse(sessionUser);
    
    const savedUser = localStorage.getItem('parkingUser');
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

  /*
    Per-category vehicle counts are derived from `slots` rather than stored.

    They used to be written back into `vehicleTypeCategories` by an effect that
    also listed `vehicleTypeCategories` as a dependency, and the writer always
    produced a fresh array — so each run re-triggered the effect and the
    provider re-rendered forever ("Maximum update depth exceeded"), rewriting
    localStorage on every pass. Deriving removes the cycle by construction:
    the stored categories now only change when someone adds one.
  */
  const categoriesWithCounts = useMemo<VehicleTypeCategory[]>(() => {
    const counts = new Map<string, number>();

    slots.forEach(slot => {
      if (!slot.isOccupied || !slot.vehicle) return;
      const key = slot.vehicle.vehicleType.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return vehicleTypeCategories.map(category => ({
      ...category,
      count: counts.get(category.name.toLowerCase()) ?? 0
    }));
  }, [slots, vehicleTypeCategories]);

  const vehicleTypeDistribution = useMemo<VehicleTypeDistribution[]>(
    () => generateVehicleTypeDistribution(categoriesWithCounts),
    [categoriesWithCounts]
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

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  // Create wrapper functions to abstract the implementation details
  const handleAddUser = (user: { username: string; password: string; role: string }) => {
    return addUser(user);
  };

  const handleUpdateProfile = async (userData: { 
    name?: string; 
    email?: string; 
    phone?: string; 
    currentPassword?: string; 
    newPassword?: string 
  }) => {
    return updateProfile(userData, user, setUser);
  };

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
      // Consumers get the counted view; the raw state stays the user-edited list.
      vehicleTypeCategories: categoriesWithCounts,
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
      updateProfile: (userData) => updateProfile(userData, user, setUser),
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
