/**
 * Event-related type definitions
 * Matches Prisma Event model
 */

// EventCategory enum - must match Prisma schema exactly
export enum EventCategory {
  UNIVERSITY = "UNIVERSITY",
  FACULTY = "FACULTY",
  COLLEGE = "COLLEGE",
  CLUB = "CLUB",
}

// EventStatus enum - must match Prisma schema exactly
export enum EventStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  category: EventCategory;
  points: number;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventFilters {
  category?: EventCategory;
  status?: EventStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  minPoints?: number;
  maxPoints?: number;
}
