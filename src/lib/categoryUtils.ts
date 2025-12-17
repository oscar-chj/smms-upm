import { EventCategory } from "@/types/api.types";

/**
 * Get theme color for event category
 * Returns Material-UI color names for consistency
 */
export const getCategoryColor = (
  category: EventCategory
): "primary" | "secondary" | "success" | "info" | "warning" | "error" => {
  switch (category) {
    case EventCategory.UNIVERSITY:
      return "error"; // Red for high-level university events
    case EventCategory.FACULTY:
      return "primary"; // Blue for faculty-level events
    case EventCategory.COLLEGE:
      return "success"; // Green for college-level events
    case EventCategory.CLUB:
      return "warning"; // Orange for club events
    default:
      return "primary";
  }
};

/**
 * Get category display name (short version)
 */
export const getCategoryDisplayName = (category: EventCategory): string => {
  return category.toString();
};

/**
 * Get full category display name with merit type description
 */
export const getCategoryFullName = (category: EventCategory): string => {
  switch (category) {
    case EventCategory.UNIVERSITY:
      return "University/National/International Merit";
    case EventCategory.FACULTY:
      return "Faculty Merit";
    case EventCategory.COLLEGE:
      return "College Merit";
    case EventCategory.CLUB:
      return "Club Merit";
    default:
      return "Unknown Category";
  }
};

/**
 * Get capacity status color based on registration percentage
 */
export const getCapacityStatusColor = (
  registered: number,
  capacity: number
): "success" | "warning" | "error" => {
  const percentage = registered / capacity;

  if (percentage >= 1.0) return "error"; // Full
  if (percentage >= 0.8) return "warning"; // Nearly full
  return "success"; // Available
};
