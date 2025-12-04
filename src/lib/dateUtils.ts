/**
 * Simple date formatting utilities
 */

/**
 * Convert Date object to ISO date string (YYYY-MM-DD)
 * @param date - Date object or string
 * @returns ISO date string
 */
export const toDateString = (date: Date | string): string => {
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
};

/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date (e.g., "May 15, 2025")
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString; // Return original if formatting fails
  }
};

/**
 * Format a date string for display with day of week
 * @param dateString - ISO date string
 * @returns Formatted date with day (e.g., "Mon, May 15")
 */
export const formatDateWithDay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Check if a date is in the past
 * @param dateString - ISO date string
 * @returns True if the date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  } catch {
    return false;
  }
};

/**
 * Get days until a future date
 * @param dateString - ISO date string
 * @returns Number of days until the date (0 if today, negative if past)
 */
export const getDaysUntil = (dateString: string): number => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};
