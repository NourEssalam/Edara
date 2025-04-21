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
