
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateTime: Date | string): string {
  if (!dateTime) return "N/A";
  
  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;
  return format(date, "PPp"); // Format: Apr 29, 2023, 1:30 PM
}
