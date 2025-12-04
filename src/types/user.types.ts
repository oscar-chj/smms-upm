/**
 * User-related type definitions
 * Matches Prisma User model
 */

export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  // Student-specific fields
  studentId?: string | null;
  faculty?: string | null;
  year?: number | null;
  program?: string | null;
  totalMeritPoints: number;
  enrollmentDate?: Date | null;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Student is a User with role STUDENT and required student fields
export interface Student {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole.STUDENT;
  studentId: string;
  faculty: string;
  year: number;
  program: string;
  totalMeritPoints: number;
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentFilters {
  faculty?: string;
  year?: number;
  program?: string;
  search?: string;
}

/**
 * Authentication result interface
 */
export interface AuthResult {
  success: boolean;
  user: User | null;
  message?: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}
