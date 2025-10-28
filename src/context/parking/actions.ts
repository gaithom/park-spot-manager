import { ParkingSlot, Vehicle, ParkingHistory, VehicleTypeCategory, ParkingReservation, User, DailyRevenue } from "@/types";
import { format } from "date-fns";
import { generateVehicleTypeDistribution } from "./utils";
import { USER_CREDENTIALS } from "./types";

export const loginUser = (
  username: string, 
  password: string, 
  setUser: React.Dispatch<React.SetStateAction<User>>,
  rememberMe: boolean = false
): boolean => {
  // Get credentials from localStorage or fallback to initial USER_CREDENTIALS
  const storedCredentials = localStorage.getItem('parkingUserCredentials');
  const credentials = storedCredentials ? JSON.parse(storedCredentials) : { ...USER_CREDENTIALS };
  
  // Check credentials
  if (credentials[username] && 
      credentials[username].password === password &&
      (credentials[username].role === 'admin' || credentials[username].role === 'attendant')) {
    
    const userRole = credentials[username].role;
    const userData = {
      username,
      isLoggedIn: true,
      role: userRole,
      name: credentials[username].name || username,
      email: credentials[username].email || '',
      phone: credentials[username].phone || ''
    };
    
    setUser(userData);
    
    // Save user data to localStorage
    if (rememberMe) {
      localStorage.setItem('parkingUser', JSON.stringify(userData));
      
      // Save credentials if not already saved
      if (!storedCredentials) {
        localStorage.setItem('parkingUserCredentials', JSON.stringify(credentials));
      }
    } else {
      // Only store in sessionStorage if not remembering
      sessionStorage.setItem('parkingUser', JSON.stringify(userData));
    }
    
    return true;
  }
  return false;
};

export const logoutUser = (setUser: React.Dispatch<React.SetStateAction<User>>, onLogout?: () => void) => {
  // Clear user data from both localStorage and sessionStorage
  localStorage.removeItem('parkingUser');
  sessionStorage.removeItem('parkingUser');
  
  // Reset user state
  setUser({ username: "", isLoggedIn: false, role: undefined });
  
  // Execute any additional logout logic
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

export const updateProfile = (
  userData: { name?: string; email?: string; phone?: string; currentPassword?: string; newPassword?: string },
  currentUser: User,
  setUser: React.Dispatch<React.SetStateAction<User>>
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // Get current credentials from localStorage or fallback to initial USER_CREDENTIALS
      const storedCredentials = localStorage.getItem('parkingUserCredentials');
      const credentials = storedCredentials ? JSON.parse(storedCredentials) : { ...USER_CREDENTIALS };
      
      // Check if password change is requested
      if (userData.newPassword) {
        if (!userData.currentPassword) {
          throw new Error('Current password is required to change password');
        }
        
        // Verify current password
        const userCreds = credentials[currentUser.username];
        if (!userCreds || userCreds.password !== userData.currentPassword) {
          throw new Error('Current password is incorrect');
        }
        
        // Update password in credentials
        credentials[currentUser.username] = {
          ...userCreds,
          password: userData.newPassword
        };
        
        // Save updated credentials
        localStorage.setItem('parkingUserCredentials', JSON.stringify(credentials));
      }
      
      // Update user profile in USER_CREDENTIALS
      if (credentials[currentUser.username]) {
        credentials[currentUser.username] = {
          ...credentials[currentUser.username],
          name: userData.name !== undefined ? userData.name : currentUser.name,
          email: userData.email !== undefined ? userData.email : currentUser.email,
          phone: userData.phone !== undefined ? userData.phone : currentUser.phone,
        };
        
        // Save updated credentials
        localStorage.setItem('parkingUserCredentials', JSON.stringify(credentials));
      }
      
      // Update the user's profile in state and localStorage
      const updatedUser = {
        ...currentUser,
        name: userData.name !== undefined ? userData.name : currentUser.name,
        email: userData.email !== undefined ? userData.email : currentUser.email,
        phone: userData.phone !== undefined ? userData.phone : currentUser.phone,
      };
      
      setUser(updatedUser);
      localStorage.setItem('parkingUser', JSON.stringify(updatedUser));
      
      resolve(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      reject(error);
    }
  });
};

export const addUser = (
  user: { username: string; password: string; role?: string; name?: string; email?: string; phone?: string }
): boolean => {
  if (!user.username || !user.password) {
    return false;
  }

  try {
    // Get existing credentials from localStorage or use default ones
    const storedCredentials = localStorage.getItem('parkingUserCredentials');
    const credentials = storedCredentials ? JSON.parse(storedCredentials) : { ...USER_CREDENTIALS };

    // Check if user already exists
    if (credentials[user.username]) {
      return false;
    }

    // Add new user with provided or default values
    credentials[user.username] = {
      password: user.password,
      role: user.role || 'attendant',
      name: user.name || user.username,
      email: user.email || '',
      phone: user.phone || ''
    };

    // Save updated credentials to localStorage
    localStorage.setItem('parkingUserCredentials', JSON.stringify(credentials));
    
    return true;
  } catch (error) {
    console.error('Error adding user:', error);
    return false;
  }
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
