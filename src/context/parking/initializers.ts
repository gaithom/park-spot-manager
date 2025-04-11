
import { ParkingSlot, ParkingHistory, ParkingReservation, VehicleTypeCategory } from "@/types";
import { INITIAL_VEHICLE_CATEGORIES, TOTAL_SLOTS } from "./types";

export const initialSlots = (): ParkingSlot[] => {
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

export const initialParkingHistory = (): ParkingHistory[] => {
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

export const initialReservations = (): ParkingReservation[] => {
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

export const initialVehicleCategories = (): VehicleTypeCategory[] => {
  const saved = localStorage.getItem("vehicleCategories");
  return saved ? JSON.parse(saved) : INITIAL_VEHICLE_CATEGORIES;
};
