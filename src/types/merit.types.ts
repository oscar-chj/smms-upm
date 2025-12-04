/**
 * Merit-related type definitions
 * Matches Prisma MeritRecord model
 */

import type { EventCategory } from "./event.types";

export interface MeritRecord {
  id: string;
  studentId: string;
  eventId?: string | null;
  category: EventCategory;
  points: number;
  description: string;
  date: Date;
  isVerified: boolean;
  meritType?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface representing a merit activity
 */
export interface MeritActivity {
  id: string;
  title: string;
  category: EventCategory;
  points: number;
  date: string;
  description?: string;
}

/**
 * Interface representing a merit event
 */
export interface MeritEvent {
  id: string;
  title: string;
  date: string;
  points: number;
  location: string;
  description?: string;
  capacity?: number;
  registeredCount?: number;
  category: EventCategory;
}

/**
 * Interface representing a student's merit summary
 */
export interface MeritSummary {
  totalPoints: number;
  targetPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  clubMerit: number;
  recentActivities: MeritActivity[];
  upcomingEvents: MeritEvent[];
}

/**
 * Interface for merit record creation request
 */
export interface CreateMeritRecordRequest {
  studentId: string;
  eventId?: string;
  category: EventCategory;
  points: number;
  description: string;
  date: string;
}
