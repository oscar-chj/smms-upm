/**
 * Application constants - keeping it simple
 */

// Layout constants
export const DRAWER_WIDTH = 280;
export const DRAWER_WIDTH_COLLAPSED = 64;

// Authentication constants
export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_COOKIE_EXPIRES_DAYS = 7;

// Default target points for students (adjusted to common goal)
export const DEFAULT_TARGET_POINTS = 150;

// Event capacity warning threshold (80% full)
export const EVENT_CAPACITY_WARNING_THRESHOLD = 0.8;

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  LOGIN_FAILED: "Invalid email or password",
  FILL_ALL_FIELDS: "Please fill out all fields",
} as const;
