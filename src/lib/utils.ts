import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateTime: Date | string): string {
  if (!dateTime) return "N/A";

  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;
  return format(date, "PPp"); // Format: Apr 29, 2023, 1:30 PM
}

/** Compact date for dense tables: "29 Apr, 13:30". */
export function formatShortDateTime(dateTime: Date | string): string {
  if (!dateTime) return "—";

  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "d MMM, HH:mm");
}

/** Elapsed time as "3h 20m", or "45m" under an hour. */
export function formatDuration(
  from: Date | string | null | undefined,
  to: Date = new Date()
): string {
  if (!from) return "—";

  const start = from instanceof Date ? from : new Date(from);
  if (Number.isNaN(start.getTime())) return "—";

  const totalMinutes = Math.max(
    Math.floor((to.getTime() - start.getTime()) / 60000),
    0
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

/** KSh amounts, grouped and always to two decimals. */
export function formatMoney(amount: number): string {
  return amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
