import { format } from "date-fns";
import { arTN } from "date-fns/locale";

export const formatDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);

    // Use date-fns formatting
    return format(date, "dd MMMM yyyy", { locale: arTN });
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDate; // Fallback to raw date if formatting fails
  }
};

export const parseLocalDate = (val: unknown) => {
  if (typeof val === "string" || val instanceof Date) {
    const date = new Date(val);
    // Return only the date portion (YYYY-MM-DD) in local timezone
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return localDate;
  }
  return val;
};

function toLocalISOString(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T00:00:00Z`;
}

export const parseToLocalMidnight = (val: unknown) => {
  if (typeof val === "string" || val instanceof Date) {
    const date = typeof val === "string" ? new Date(val) : val;
    return new Date(toLocalISOString(date)); // Makes it safe from timezone shift
  }
  return val;
};
