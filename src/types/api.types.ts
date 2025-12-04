/**
 * Generic API response types
 * Used across all API endpoints
 */

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Re-export all entity types for convenience
export * from "./user.types";
export * from "./event.types";
export * from "./registration.types";
export * from "./merit.types";
