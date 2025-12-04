/**
 * Event Registration-related type definitions
 * Matches Prisma EventRegistration model
 */

// RegistrationStatus enum - must match Prisma schema exactly
export enum RegistrationStatus {
  REGISTERED = "REGISTERED",
  WAITLISTED = "WAITLISTED",
  CANCELLED = "CANCELLED",
  ATTENDED = "ATTENDED",
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  registrationDate: Date;
  status: RegistrationStatus;
  attendanceMarked: boolean;
  pointsAwarded: number;
  createdAt: Date;
  updatedAt: Date;
}
